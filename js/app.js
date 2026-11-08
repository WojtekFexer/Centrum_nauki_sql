(function(){
'use strict';

/* ==========================================================================
   0. KONFIGURACJA CHMURY SUPABASE (REST API — RANKING I PROFILE TESTERÓW)
   ========================================================================== */
const APP_VERSION = 'v12.1';
const DEFAULT_SUPABASE_URL = 'https://hpfrcykbzuzucglorpkr.supabase.co';
const DEFAULT_SUPABASE_KEY = 'sb_publishable_5klYjdIKjT35Zl2OtOyGQA_DGxdJCHh';

const SUPABASE_CONFIG = {
  url: localStorage.getItem('sql_master_sb_url') || DEFAULT_SUPABASE_URL,
  anonKey: localStorage.getItem('sql_master_sb_key') || DEFAULT_SUPABASE_KEY
};

try {
  var urlParams = new URLSearchParams(window.location.search);
  var paramSbUrl = urlParams.get('sb_url');
  var paramSbKey = urlParams.get('sb_key');
  if (paramSbUrl && paramSbKey) {
    SUPABASE_CONFIG.url = paramSbUrl.trim().replace(/\/+$/, '');
    SUPABASE_CONFIG.anonKey = paramSbKey.trim();
    localStorage.setItem('sql_master_sb_url', SUPABASE_CONFIG.url);
    localStorage.setItem('sql_master_sb_key', SUPABASE_CONFIG.anonKey);
    if (window.history && window.history.replaceState) {
      window.history.replaceState({}, document.title, window.location.pathname + window.location.hash);
    }
  }
} catch (e) {}

/* ==========================================================================
   1. BAZA DANYCH DVDRENTAL (10 TABEL Z PRZYPADKAMI BRZEGOWYMI)
   Dane i schemat ładowane z js/data-dvdrental.js
   ========================================================================== */
var db = null;
var dbReady = false;

/* ==========================================================================
   2. NATYWNY SILNIK POSTGRESQL (PGlite WASM) + PRECYZYJNA DETEKCJA LINII BŁĘDU
   Zero sztucznej transpilacji regex - 100% prawdziwy PostgreSQL jak w DBeaverze!
   ========================================================================== */
var ALL_SCHEMA_META = SCHEMA_META.concat(window.INTERVIEW_SCHEMA_META || []);
var ALL_SCHEMA_COLS = new Set();
ALL_SCHEMA_META.forEach(function(m) {
  m.cols.forEach(function(c) {
    var colName = typeof c === 'string' ? c : c.name;
    ALL_SCHEMA_COLS.add(colName.toLowerCase());
  });
});

var interviewSamples = {};
var tableSamples = {};
var expectedOutputCache = {};
var expectedOutputPending = {};

var DVDRENTAL_COL_TYPES = {
  film_id: 'integer', title: 'text', rating: 'text', rental_rate: 'numeric(4,2)',
  length: 'integer', release_year: 'integer', replacement_cost: 'numeric(5,2)',
  category_id: 'integer', name: 'text', actor_id: 'integer', first_name: 'text',
  last_name: 'text', customer_id: 'integer', store_id: 'integer', active: 'integer',
  create_date: 'date', rental_id: 'integer', rental_date: 'date', return_date: 'date',
  staff_id: 'integer', payment_id: 'integer', amount: 'numeric(5,2)', payment_date: 'date',
  city: 'text', country: 'text'
};

function ensureExpectedOutput(solSql) {
  var key = String(solSql || '').trim();
  if (!key || !dbReady || !db) return;
  if (expectedOutputCache[key] || expectedOutputPending[key]) return;
  expectedOutputPending[key] = true;
  runQuery(key).then(function(res) {
    delete expectedOutputPending[key];
    if (res && !res.error && res.columns) {
      expectedOutputCache[key] = res;
      render();
    }
  }).catch(function() {
    delete expectedOutputPending[key];
  });
}

// Przelicza oficjalną pozycję znaku (err.position z silnika PostgreSQL) na numer linii w edytorze
function posToLineNumber(sql, charPos) {
  var pos = Number(charPos);
  if (!pos || isNaN(pos) || pos < 1) return null;
  var prefix = String(sql || '').slice(0, pos);
  return prefix.split('\n').length;
}

// Rezerwowe wyszukanie linii błędu, jeśli PGlite nie zwróci pola err.position
function fallbackErrorLine(rawSql, errMsg) {
  var lines = String(rawSql || '').split('\n');
  var msg = String(errMsg || '');

  var qMatch = /"([^"]+)"/.exec(msg);
  if (qMatch && qMatch[1]) {
    var tok = qMatch[1].trim();
    for (var i = 0; i < lines.length; i++) {
      var cleanLine = lines[i].replace(/--.*$/, '');
      if (cleanLine.indexOf(tok) > -1) return i + 1;
    }
  }
  for (var j = 0; j < lines.length; j++) {
    if (lines[j].replace(/--.*$/, '').trim().length > 0) return j + 1;
  }
  return 1;
}

// Lekki strażnik tylko na przypadek, gdy ktoś w SELECT napisze pod sobą dwie kolumny z bazy bez przecinka i bez AS
// (np. w linii 4: "rating", a w linii 5: "length" - co każdy SQL interpretuje po cichu jako "rating AS length")
function detectAccidentalColumnAlias(rawSql) {
  var lines = String(rawSql || '').split('\n');
  var inSelect = false;

  for (var i = 0; i < lines.length; i++) {
    var clean = lines[i].replace(/--.*$/, '').trim();
    if (!clean) continue;

    if (/^SELECT\b/i.test(clean)) {
      inSelect = true;
      clean = clean.replace(/^SELECT(?:\s+DISTINCT(?:\s+ON\s*\([^)]+\))?)?\b/i, '').trim();
      if (!clean) continue; // Samo słowo SELECT w linii jest w 100% poprawne!
    }
    if (inSelect && /^(FROM|WHERE|GROUP|ORDER|LIMIT|HAVING|UNION|INTERSECT|EXCEPT|WINDOW|FETCH)\b/i.test(clean)) {
      inSelect = false;
      continue;
    }

    if (inSelect) {
      // Jeśli bieżąca linia kończy się pojedynczą nazwą kolumny BEZ przecinka na końcu...
      if (/^[a-zA-Z_][\w.]*$/.test(clean)) {
        // ...sprawdźmy następną niepustą linię:
        for (var n = i + 1; n < lines.length; n++) {
          var nextClean = lines[n].replace(/--.*$/, '').trim();
          if (!nextClean) continue;
          if (/^(FROM|WHERE|GROUP|ORDER|LIMIT|HAVING|UNION|INTERSECT|EXCEPT|AS|ASC|DESC)\b/i.test(nextClean)) break;

          var nextFirstWord = nextClean.split(/[\s,]+/)[0];
          if ( nextFirstWord && (nextFirstWord.indexOf('.') > -1 || ALL_SCHEMA_COLS.has(nextFirstWord.toLowerCase())) ) {
            return {
              line: i + 1,
              msg: 'ERROR: syntax error at or near "' + nextFirstWord + '" — brakuje przecinka `,` na końcu linii ' + (i + 1) + ' po `' + clean + '` (bez przecinka SQL uznałby `' + nextFirstWord + '` za alias kolumny `' + clean + '`).'
            };
          }
          break;
        }
      }
    }
  }
  return null;
}

// Schemat dvdrental z natywnymi typami PostgreSQL (DATE, NUMERIC, INTEGER)
var PG_DVDRENTAL_DDL = DVDRENTAL_SEED_SQL
  .replace(/create_date TEXT/g, 'create_date DATE')
  .replace(/rental_date TEXT NOT NULL/g, 'rental_date DATE NOT NULL')
  .replace(/return_date TEXT/g, 'return_date DATE')
  .replace(/payment_date TEXT NOT NULL/g, 'payment_date DATE NOT NULL') +
  "\nALTER TABLE film ADD COLUMN IF NOT EXISTS rental_duration INTEGER DEFAULT 3;\nUPDATE film SET rental_duration = CASE WHEN film_id % 3 = 0 THEN 3 WHEN film_id % 3 = 1 THEN 5 ELSE 7 END;\n" +
  "ALTER TABLE customer ADD COLUMN IF NOT EXISTS email TEXT;\nUPDATE customer SET email = LOWER(first_name || '.' || last_name || '@dvdrental.org') WHERE email IS NULL;\n";

let dbInitPromise = null;

async function initDatabase() {
  if (db && dbReady) return db;
  if (dbInitPromise !== null) return dbInitPromise;

  dbInitPromise = (async function() {
    var statusEl = document.getElementById('dbStatus');
    var instance = null;
    try {
      if (statusEl) statusEl.textContent = 'Pobieranie silnika PostgreSQL (PGlite)…';
      var mod = await import('https://cdn.jsdelivr.net/npm/@electric-sql/pglite/dist/index.js');
      var PGlite = mod.PGlite;
      try {
        instance = new PGlite();
        await instance.exec('SELECT 1;');
      } catch (firstErr) {
        var errStr = (firstErr && firstErr.message ? firstErr.message : '') + ' ' + String(firstErr);
        if (/Invalid FS bundle size|ErrnoError|errno/i.test(errStr)) {
          console.warn('Wykryto uszkodzony cache PGlite WASM/DATA — czyszczę pamięć podręczną i ponawiam inicjalizację…', firstErr);
          if (instance && typeof instance.close === 'function') {
            try { await instance.close(); } catch (e) {}
          }
          if (typeof window !== 'undefined' && window.caches) {
            try {
              var keys = await caches.keys();
              await Promise.all(keys.map(function(k) { return caches.delete(k); }));
            } catch (cacheErr) {}
          }
          try {
            var wasmRes = await fetch('https://cdn.jsdelivr.net/npm/@electric-sql/pglite/dist/postgres.wasm', { cache: 'reload' });
            var dataRes = await fetch('https://cdn.jsdelivr.net/npm/@electric-sql/pglite/dist/postgres.data', { cache: 'reload' });
            if (wasmRes.ok && dataRes.ok) {
              var wasmMod = await WebAssembly.compile(await wasmRes.arrayBuffer());
              var fsBlob = await dataRes.blob();
              instance = new PGlite({ wasmModule: wasmMod, fsBundle: fsBlob });
            } else {
              instance = new PGlite();
            }
          } catch (reloadErr) {
            instance = new PGlite();
          }
        } else {
          throw firstErr;
        }
      }
      await instance.exec(PG_DVDRENTAL_DDL);
      if (window.INTERVIEW_SEED_SQL) {
        await instance.exec(window.INTERVIEW_SEED_SQL);
      }
      db = instance;
      dbReady = true;
      for (var i = 0; i < ALL_SCHEMA_META.length; i++) {
        var tblName = ALL_SCHEMA_META[i].table;
        var sampleRes = await runQuery('SELECT * FROM ' + tblName + ' LIMIT 4;');
        tableSamples[tblName] = sampleRes;
        interviewSamples[tblName] = sampleRes;
      }
      if (statusEl) statusEl.textContent = 'Silnik PostgreSQL 16 (PGlite) gotowy';
      render();
      return db;
    } catch (err) {
      console.error('PGlite init error:', err);
      var outerErrStr = (err && err.message ? err.message : '') + ' ' + String(err);
      if (/Invalid FS bundle size|ErrnoError|errno/i.test(outerErrStr) && typeof window !== 'undefined' && window.caches) {
        try {
          var cKeys = await caches.keys();
          await Promise.all(cKeys.map(function(k) { return caches.delete(k); }));
        } catch (ce) {}
      }
      if (instance && typeof instance.close === 'function') {
        try {
          await instance.close();
        } catch (closeErr) {
          console.error('Błąd podczas zamykania instancji PGlite:', closeErr);
        }
      }
      db = null;
      dbReady = false;
      dbInitPromise = null;
      if (statusEl) statusEl.textContent = 'Błąd inicjalizacji PostgreSQL WASM';
    }
  })();

  return dbInitPromise;
}

async function runQuery(sql) {
  if (!dbReady || !db) return { error: 'Silnik PostgreSQL jeszcze się inicjalizuje (poczekaj 1-2 sekundy)…' };
  var raw = String(sql || '').trim();
  if (!raw) return { error: 'Wpisz zapytanie SQL.', errorLine: 1 };

  // Sprawdzenie, czy użytkownik nie pominął przecinka między dwoma kolumnami w osobnych liniach
  var aliasTrap = detectAccidentalColumnAlias(raw);
  if (aliasTrap) {
    var trapLineTxt = (raw.split('\n')[aliasTrap.line - 1] || '').trim();
    return {
      error: aliasTrap.msg,
      errorLine: aliasTrap.line,
      errorSnippet: trapLineTxt
    };
  }

  try {
    var res = await db.query(raw, [], {
      parsers: {
        1114: function(v) { return String(v).replace(/ 00:00:00$/, ''); }
      }
    });
    var cols = (res.fields || []).map(function(f) { return f.name; });
    var vals = (res.rows || []).map(function(rowObj) {
      return cols.map(function(c) {
        var v = rowObj[c];
        if (v instanceof Date) return v.toISOString().slice(0, 10);
        return v;
      });
    });
    return { columns: cols, values: vals };
  } catch (e) {
    var rawMsg = e.message || String(e);
    var ln = posToLineNumber(raw, e.position) || fallbackErrorLine(raw, rawMsg);
    var linesArr = raw.split('\n');
    ln = Math.max(1, Math.min(linesArr.length, ln));
    var lineTxt = (linesArr[ln - 1] || '').trim();
    return {
      error: 'ERROR: ' + rawMsg + (e.hint ? ' (Podpowiedź PG: ' + e.hint + ')' : ''),
      errorLine: ln,
      errorSnippet: lineTxt
    };
  }
}

function compareResults(userRes, expRes, checkOrder) {
  if (userRes.error) {
    var lnInfo = userRes.errorLine ? ' (Linia ' + userRes.errorLine + (userRes.errorSnippet ? ': `' + userRes.errorSnippet + '`' : '') + ')' : '';
    return { ok: false, reason: 'error', msg: 'Błąd wykonania SQL' + lnInfo + ': ' + userRes.error };
  }
  var uRows = userRes.values || [], eRows = expRes.values || [];
  var uCols = userRes.columns || [], eCols = expRes.columns || [];

  if (uCols.length !== eCols.length) {
    return {
      ok: false, reason: 'cols',
      msg: 'Liczba kolumn się nie zgadza: zwróciłeś ' + uCols.length + ' (' + uCols.join(', ') + '), a oczekiwano ' + eCols.length + ' (' + eCols.join(', ') + ').'
    };
  }
  if (uRows.length !== eRows.length) {
    return {
      ok: false, reason: 'rows',
      msg: 'Liczba wierszy się nie zgadza: Twoje zapytanie zwróciło ' + uRows.length + ' wierszy, a wzorcowy wynik ma ' + eRows.length + ' wierszy.'
    };
  }
  function normCell(v) {
    if (v === null || v === undefined) return 'NULL';
    if (typeof v === 'number') return Number(v.toFixed(2)).toString();
    var num = Number(v);
    if (!isNaN(num) && String(v).trim() !== '') return Number(num.toFixed(2)).toString();
    return String(v).trim().toUpperCase();
  }
  function normRow(r) { return r.map(normCell).join('|'); }

  var uNorm = uRows.map(normRow);
  var eNorm = eRows.map(normRow);
  if (!checkOrder) {
    uNorm = uNorm.slice().sort();
    eNorm = eNorm.slice().sort();
  }
  for (var i = 0; i < eNorm.length; i++) {
    if (uNorm[i] !== eNorm[i]) {
      return {
        ok: false, reason: 'values',
        msg: 'Różnica w wierszu #' + (i + 1) + '. Twój wynik: [' + uRows[i].join(', ') + '], oczekiwano: [' + eRows[i].join(', ') + '].'
      };
    }
  }
  return { ok: true, msg: 'Brawo! Wynik Twojego zapytania w 100% pokrywa się z wzorcem.' };
}

function buildValidationChecklist(userRes, expRes, checkOrder) {
  if (!userRes || userRes.error || !expRes || !expRes.columns) return null;
  var uCols = userRes.columns || [];
  var eCols = expRes.columns || [];
  var uRows = userRes.values || [];
  var eRows = expRes.values || [];

  var colsOk = (uCols.length === eCols.length) && uCols.every(function(c, idx) {
    return String(c).toLowerCase() === String(eCols[idx]).toLowerCase();
  });

  var rowsOk = uRows.length === eRows.length;

  function normCell(v) {
    if (v === null || v === undefined) return 'NULL';
    if (typeof v === 'number') return Number(v.toFixed(2)).toString();
    var num = Number(v);
    if (!isNaN(num) && String(v).trim() !== '') return Number(num.toFixed(2)).toString();
    return String(v).trim().toUpperCase();
  }
  function normRow(r) { return r.map(normCell).join('|'); }

  var valsOk = false;
  if (uCols.length === eCols.length && rowsOk) {
    var uNorm = uRows.map(normRow);
    var eNorm = eRows.map(normRow);
    if (!checkOrder) {
      uNorm = uNorm.slice().sort();
      eNorm = eNorm.slice().sort();
    }
    valsOk = true;
    for (var i = 0; i < eNorm.length; i++) {
      if (uNorm[i] !== eNorm[i]) {
        valsOk = false;
        break;
      }
    }
  }

  return {
    colsOk: colsOk,
    colsMsg: colsOk
      ? '✅ Zgodne nazwy kolumn (' + eCols.join(', ') + ')'
      : '❌ Różnica w kolumnach (masz: [' + (uCols.join(', ') || 'brak') + '], oczekiwano: [' + eCols.join(', ') + '])',
    rowsOk: rowsOk,
    rowsMsg: rowsOk
      ? '✅ Zgodna liczba wierszy (' + eRows.length + ')'
      : '❌ Inna liczba wierszy (Twój wynik: ' + uRows.length + ', oczekiwano: ' + eRows.length + ')',
    valsOk: valsOk,
    valsMsg: valsOk
      ? '✅ Dane w 100% zgodne'
      : '❌ Różnice w wartościach lub sortowaniu'
  };
}

/* ==========================================================================
   6. STAN APLIKACJI I NAWIGACJI (CZYSTY PODZIAŁ LISTA <-> WORKSPACE)
   ========================================================================== */
var STORAGE_KEY = 'sqlmaster_dvd_v1';
var LOCAL_PROFILES_KEY = 'sql_master_local_profiles';

function defaultState() {
  return {
    xp: 1202,
    streak: 4,
    theme: 'dark',
    unlockedStage: 1,
    diagDone: false,
    testerUnlockAll: false,
    tutorialsDone: {},
    completedTasks: {},
    completedVariants: {},
    completedLemur: {},
    pathMode: 'list',
    lemurMode: 'list',
    lemurSubTab: 'tasks',
    activeTaskId: 'p1_1',
    activeVariantIdx: 0,
    activeLemurId: 'iv_1',
    editorCode: '',
    diagIdx: 0,
    diagScore: 0,
    diagSkipped: [],
    gaps: [
      { id: 'g1', name: 'Ziarno wyniku i mnożenie wierszy po JOIN', hint: 'Przed JOIN sprawdź, co jest jednym wierszem w obu tabelach. Przy łączeniu dwóch tabel faktów użyj COUNT(DISTINCT) lub osobnych CTE.', lvl: 2, hits: 1 },
      { id: 'g2', name: 'LEFT JOIN: warunek w ON czy w WHERE + NOT IN z NULL', hint: 'Filtr na prawej tabeli w WHERE zamienia LEFT JOIN w INNER JOIN. Unikaj też NOT IN na kolumnach z NULL.', lvl: 2, hits: 1 },
      { id: 'g3', name: 'NULL w agregatach (COUNT(*) vs COUNT(col))', hint: 'COUNT(*) liczy wszystkie wiersze, COUNT(col) pomija NULL-e.', lvl: 3, hits: 0 },
      { id: 'g4', name: 'Daty: DATE_TRUNC, INTERVAL i generate_series', hint: 'Kalendarz z generate_series musi być po lewej stronie LEFT JOIN.', lvl: 2, hits: 0 },
      { id: 'g5', name: 'LAG() i porównania okresowe MoM', hint: 'Najpierw zagreguj dane do poziomu miesiąca w CTE, a dopiero potem użyj LAG() OVER (ORDER BY miesiac).', lvl: 2, hits: 0 },
      { id: 'g7', name: 'GROUP BY i filtrowanie grup w HAVING', hint: 'WHERE filtruje pojedyncze wiersze przed grupowaniem, HAVING filtruje grupy po agregacji.', lvl: 2, hits: 0 },
      { id: 'g8', name: 'AVG vs SUM/COUNT przy wartościach NULL', hint: 'AVG pomija NULL-e. Jeśli brak aktywności ma oznaczać 0, użyj COALESCE przed policzeniem średniej.', lvl: 1, hits: 0 },
      { id: 'g10', name: 'Dzielenie całkowite (* 100.0)', hint: 'Mnożenie przez 100.0 (lub ::numeric) wymusza wynik zmiennoprzecinkowy.', lvl: 1, hits: 2 },
      { id: 't5', name: 'Funkcje okna: ROW_NUMBER vs DENSE_RANK i CTE', hint: 'Przy remisach używaj DENSE_RANK(). Wynik okna filtruj w zewnętrznym zapytaniu z użyciem WITH.', lvl: 2, hits: 0 }
    ],
    aiProvider: 'gemini',
    apiKey: '',
    nickname: 'Wojtek_SQL',
    userProfile: null
  };
}

var state = defaultState();
try {
  var saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    var parsed = JSON.parse(saved);
    state = Object.assign(defaultState(), parsed);
    if (!state.completedVariants) state.completedVariants = {};
    if (!state.completedLemur) state.completedLemur = {};
    if (!state.completedTasks) state.completedTasks = {};
    if (!state.tutorialsDone) state.tutorialsDone = {};
    // Kompatybilność wsteczna: jeśli z poprzednich sesji zaliczono już zadanie podstawowe 1 (klucz ':0'),
    // automatycznie oznacz rozgrzewkę R1-R2 jako zaliczoną, aby nie blokować dotychczasowego postępu.
    (window.PATH_TASKS || []).forEach(function(pt) {
      if (state.completedVariants[pt.id + ':0']) {
        state.completedVariants[pt.id + ':r1'] = true;
        state.completedVariants[pt.id + ':r2'] = true;
      }
    });
  }
} catch (e) {}

function saveState() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
  updateHeader();
}

var currentTab = 'path';
var lastExecResult = null;
var lastExpectedResult = null;
var lastFeedback = null;
var lastChecklist = null;
var ONBOARDING_KEY = 'sql_master_onboarding_seen';
var hasSeenOnboarding = false;
try {
  hasSeenOnboarding = localStorage.getItem(ONBOARDING_KEY) === '1';
} catch (e) {}

var uiState = {
  schemaBoxOpen: false,
  theoryBoxOpen: null,
  exampleOutOpen: true,
  hintStep: 0,
  lemurDiffFilter: 'all',
  tutorialSlideIdx: 0,
  quizSelected: null,
  quizPassed: false,
  sqlAnimStep: 0,
  sqlAnimRunning: false,
  authModalOpen: hasSeenOnboarding && !(state.userProfile && state.userProfile.nick),
  authError: '',
  leaderboard: null,
  leaderboardSource: 'local',
  lastSyncTime: null,
  syncing: false,
  taskDropdownOpen: false,
  onboardingOpen: !hasSeenOnboarding,
  onboardingSlideIdx: 0,
  clickedClauses: {},
  selectedClause: null,
  stepFlashActive: false,
  syntaxTipOpen: false,
  editorUndoStack: [],
  taskCtxTab: 'task',
  warmupUsedBlocks: []
};

function resetTaskContextUi() {
  uiState.taskCtxTab = 'task';
  uiState.warmupUsedBlocks = [];
  uiState.editorUndoStack = [];
  uiState.syntaxTipOpen = false;
  uiState.schemaBoxOpen = false;
  uiState.hintStep = 0;
}

function triggerStepFlash() {
  uiState.stepFlashActive = true;
  clearTimeout(window._stepFlashTimer);
  window._stepFlashTimer = setTimeout(function() {
    uiState.stepFlashActive = false;
    document.querySelectorAll('.task-step-flash').forEach(function(el) {
      el.classList.remove('task-step-flash');
    });
  }, 500);
}

/* --- PROGRESJA SOLOLEARN: SEKWENCYJNE BLOKADY KROK PO KROKU (R1→R2→1→2→3→4→5→6) --- */
function getVariantKey(taskOrId, vIdx) {
  var taskId = typeof taskOrId === 'string' ? taskOrId : (taskOrId && taskOrId.id);
  var task = typeof taskOrId === 'object' && taskOrId
    ? taskOrId
    : (window.PATH_TASKS || []).find(function(t) { return t.id === taskId; });
  if (task && task.variants && task.variants[vIdx] && task.variants[vIdx].keySuffix !== undefined) {
    return task.id + ':' + task.variants[vIdx].keySuffix;
  }
  if (vIdx === 0) return taskId + ':r1';
  if (vIdx === 1) return taskId + ':r2';
  return taskId + ':' + (vIdx - 2);
}

function isStepSolved(taskOrId, vIdx) {
  var cv = (state && state.completedVariants) ? state.completedVariants : {};
  return !!cv[getVariantKey(taskOrId, vIdx)];
}

function isStepUnlocked(taskOrId, vIdx) {
  if (state && state.testerUnlockAll) return true;
  if (vIdx <= 0) return true; // Rozgrzewka R1 odblokowana na starcie lekcji
  if (isStepSolved(taskOrId, vIdx)) return true;
  return isStepSolved(taskOrId, vIdx - 1);
}

function countWarmupSolved(taskId) {
  var c = 0;
  var cv = (state && state.completedVariants) ? state.completedVariants : {};
  if (cv[taskId + ':r1']) c++;
  if (cv[taskId + ':r2']) c++;
  return c;
}

function countBasicSolved(taskId) {
  var c = 0;
  var cv = (state && state.completedVariants) ? state.completedVariants : {};
  for (var i = 0; i < 3; i++) {
    if (cv[taskId + ':' + i]) c++;
  }
  return c;
}

function countAdvSolved(taskId) {
  var c = 0;
  var cv = (state && state.completedVariants) ? state.completedVariants : {};
  for (var i = 3; i < 10; i++) {
    if (cv[taskId + ':' + i]) c++;
  }
  return c;
}

function countTotalLessonSolved(taskId) {
  return countWarmupSolved(taskId) + countBasicSolved(taskId) + countAdvSolved(taskId);
}

function isLessonCoreCompleted(taskId) {
  if (state && state.completedTasks && state.completedTasks[taskId]) return true;
  return countTotalLessonSolved(taskId) >= 5;
}

function isAdvancedUnlocked(taskId) {
  if (state && state.testerUnlockAll) return true;
  return isLessonCoreCompleted(taskId);
}

function getFirstUnsolvedStepIdx(task) {
  if (!task || !task.variants) return 0;
  for (var i = 0; i < task.variants.length; i++) {
    if (!isStepSolved(task, i)) return i;
  }
  return 0;
}

function isLessonUnlocked(taskId) {
  if (state && state.testerUnlockAll) return true;
  var idx = PATH_TASKS.findIndex(function(t) { return t.id === taskId; });
  if (idx <= 0) return true; // Lekcja 1.1 zawsze odblokowana na starcie
  var task = PATH_TASKS[idx];
  var prevTask = PATH_TASKS[idx - 1];
  // Odblokowana, gdy poprzednia lekcja ma zaliczone co najmniej 5 zadań
  if (isLessonCoreCompleted(prevTask.id)) return true;
  // Lub została odblokowana przez moduł Diagnozy (state.unlockedStage)
  if (state && state.diagDone && (state.unlockedStage || 1) > 1) {
    if (task.stage < state.unlockedStage) return true;
    if (task.stage === state.unlockedStage && prevTask.stage < task.stage) return true;
  }
  return false;
}

function isStageUnlocked(stageId) {
  if (state && state.testerUnlockAll) return true;
  if (stageId <= 1) return true;
  if (state && state.diagDone && stageId <= (state.unlockedStage || 1)) return true;
  var firstTask = PATH_TASKS.find(function(t) { return t.stage === stageId; });
  return firstTask ? isLessonUnlocked(firstTask.id) : false;
}

function getLessonSlides(task) {
  if (!task) return [];
  if (Array.isArray(task.slides) && task.slides.length) return task.slides;
  if (window.LESSON_TUTORIALS && window.LESSON_TUTORIALS[task.id]) return window.LESSON_TUTORIALS[task.id];
  return [];
}

/* --- AUTORYZACJA TESTERÓW (NICK + PIN) ORAZ SYNCHRONIZACJA SUPABASE REST API --- */
function hashPin(nick, pin) {
  var str = String(nick || '').trim().toLowerCase() + ':' + String(pin || '').trim() + ':sqlmaster_salt_2026';
  var h1 = 0xdeadbeef ^ str.length, h2 = 0x41c6ce57 ^ str.length;
  for (var i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (h2 >>> 0).toString(16).padStart(8, '0') + (h1 >>> 0).toString(16).padStart(8, '0');
}

function isSupabaseConfigured() {
  return Boolean(SUPABASE_CONFIG.url && SUPABASE_CONFIG.anonKey);
}

function getTotalSolvedCount() {
  var vCnt = Object.keys((state && state.completedVariants) || {}).length;
  var lCnt = Object.keys((state && state.completedLemur) || {}).length;
  return vCnt + lCnt;
}

function getLocalProfilesMap() {
  try {
    var raw = localStorage.getItem(LOCAL_PROFILES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function saveLocalProfileEntry() {
  if (!state.userProfile || !state.userProfile.nick) return;
  try {
    var map = getLocalProfilesMap();
    var key = state.userProfile.nick.toLowerCase();
    map[key] = {
      nick: state.userProfile.nick,
      pin_hash: state.userProfile.pinHash,
      xp: state.xp,
      streak: state.streak,
      solved_count: getTotalSolvedCount(),
      state_json: {
        xp: state.xp,
        streak: state.streak,
        unlockedStage: state.unlockedStage,
        diagDone: state.diagDone,
        tutorialsDone: state.tutorialsDone,
        completedTasks: state.completedTasks,
        completedVariants: state.completedVariants,
        completedLemur: state.completedLemur,
        gaps: state.gaps
      },
      updated_at: new Date().toISOString()
    };
    localStorage.setItem(LOCAL_PROFILES_KEY, JSON.stringify(map));
  } catch (e) {}
}

function mergeRemoteStateIntoCurrent(remoteState) {
  if (!remoteState || typeof remoteState !== 'object') return;
  state.xp = Math.max(state.xp || 0, Number(remoteState.xp) || 0);
  state.streak = Math.max(state.streak || 1, Number(remoteState.streak) || 1);
  state.unlockedStage = Math.max(state.unlockedStage || 1, Number(remoteState.unlockedStage) || 1);
  state.diagDone = Boolean(state.diagDone || remoteState.diagDone);
  state.tutorialsDone = Object.assign({}, remoteState.tutorialsDone || {}, state.tutorialsDone || {});
  state.completedTasks = Object.assign({}, remoteState.completedTasks || {}, state.completedTasks || {});
  state.completedVariants = Object.assign({}, remoteState.completedVariants || {}, state.completedVariants || {});
  state.completedLemur = Object.assign({}, remoteState.completedLemur || {}, state.completedLemur || {});
}

async function syncProfileToCloud(silent) {
  saveLocalProfileEntry();
  if (!isSupabaseConfigured() || !state.userProfile || !state.userProfile.nick) {
    await fetchLeaderboard();
    return false;
  }
  uiState.syncing = true;
  var baseUrl = SUPABASE_CONFIG.url.replace(/\/+$/, '');
  var nowIso = new Date().toISOString();
  state.userProfile.updatedAt = nowIso;
  var payload = {
    nick: state.userProfile.nick,
    pin_hash: state.userProfile.pinHash,
    xp: state.xp,
    streak: state.streak,
    solved_count: getTotalSolvedCount(),
    state_json: {
      xp: state.xp,
      streak: state.streak,
      unlockedStage: state.unlockedStage,
      diagDone: state.diagDone,
      tutorialsDone: state.tutorialsDone,
      completedTasks: state.completedTasks,
      completedVariants: state.completedVariants,
      completedLemur: state.completedLemur,
      gaps: state.gaps
    },
    updated_at: nowIso
  };
  try {
    var resp = await fetch(baseUrl + '/rest/v1/sql_profiles?on_conflict=nick', {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_CONFIG.anonKey,
        'Authorization': 'Bearer ' + SUPABASE_CONFIG.anonKey,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates,return=minimal'
      },
      body: JSON.stringify(payload)
    });
    uiState.syncing = false;
    if (!resp.ok) throw new Error('HTTP ' + resp.status);
    uiState.lastSyncTime = new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
    saveState();
    await fetchLeaderboard();
    if (!silent) toast('☁️ Zsynchronizowano postęp z chmurą Supabase!');
    return true;
  } catch (err) {
    uiState.syncing = false;
    console.warn('Supabase sync error:', err);
    await fetchLeaderboard();
    if (!silent) toast('⚠️ Zapisano lokalnie (sprawdź połączenie lub tabelę sql_profiles w Supabase).');
    return false;
  }
}

async function fetchLeaderboard() {
  if (isSupabaseConfigured()) {
    try {
      var baseUrl = SUPABASE_CONFIG.url.replace(/\/+$/, '');
      var resp = await fetch(baseUrl + '/rest/v1/sql_profiles?select=nick,xp,streak,solved_count,updated_at&order=xp.desc&limit=20', {
        method: 'GET',
        headers: {
          'apikey': SUPABASE_CONFIG.anonKey,
          'Authorization': 'Bearer ' + SUPABASE_CONFIG.anonKey
        }
      });
      if (resp.ok) {
        var rows = await resp.json();
        if (Array.isArray(rows)) {
          uiState.leaderboard = rows;
          uiState.leaderboardSource = 'supabase';
          if (currentTab === 'profile') render();
          return rows;
        }
      }
    } catch (err) {
      console.warn('Leaderboard fetch fallback:', err);
    }
  }
  uiState.leaderboardSource = 'local';
  uiState.leaderboard = getDisplayLeaderboard();
  if (currentTab === 'profile') render();
  return uiState.leaderboard;
}

function getDisplayLeaderboard() {
  if (uiState.leaderboardSource === 'supabase' && Array.isArray(uiState.leaderboard) && uiState.leaderboard.length > 0) {
    return uiState.leaderboard;
  }
  var demoPlayers = [
    { nick: 'Ania_Data', xp: 1420, streak: 6, solved_count: 38 },
    { nick: 'Kamil_BI', xp: 980, streak: 3, solved_count: 24 },
    { nick: 'Marta_SQL', xp: 640, streak: 2, solved_count: 15 },
    { nick: 'Tomek_Dev', xp: 410, streak: 1, solved_count: 9 }
  ];
  var localMap = getLocalProfilesMap();
  var byNick = {};
  demoPlayers.forEach(function(p) { byNick[p.nick.toLowerCase()] = p; });
  Object.keys(localMap).forEach(function(k) {
    var lp = localMap[k];
    byNick[k] = { nick: lp.nick, xp: lp.xp, streak: lp.streak, solved_count: lp.solved_count };
  });
  var curNick = (state.userProfile && state.userProfile.nick) ? state.userProfile.nick : (state.nickname || 'Ty (Gość)');
  byNick[curNick.toLowerCase()] = {
    nick: curNick,
    xp: state.xp,
    streak: state.streak,
    solved_count: getTotalSolvedCount()
  };
  return Object.keys(byNick).map(function(k) { return byNick[k]; }).sort(function(a, b) {
    return (b.xp - a.xp) || (b.solved_count - a.solved_count);
  }).slice(0, 20);
}

async function loginOrRegisterTester(rawNick, rawPin) {
  var nick = String(rawNick || '').trim();
  var pin = String(rawPin || '').trim();
  if (nick.length < 2 || nick.length > 24) {
    return { ok: false, msg: 'Podaj Nick o długości od 2 do 24 znaków (np. Wojtek).' };
  }
  if (!/^\d{4}$/.test(pin)) {
    return { ok: false, msg: 'PIN musi składać się dokładnie z 4 cyfr (np. 1234).' };
  }
  var pinHash = hashPin(nick, pin);

  // 1. Sprawdzenie w chmurze Supabase (jeśli skonfigurowana)
  if (isSupabaseConfigured()) {
    try {
      var baseUrl = SUPABASE_CONFIG.url.replace(/\/+$/, '');
      var checkResp = await fetch(baseUrl + '/rest/v1/sql_profiles?nick=eq.' + encodeURIComponent(nick) + '&select=nick,pin_hash,xp,streak,solved_count,state_json,updated_at', {
        method: 'GET',
        headers: {
          'apikey': SUPABASE_CONFIG.anonKey,
          'Authorization': 'Bearer ' + SUPABASE_CONFIG.anonKey
        }
      });
      if (checkResp.ok) {
        var found = await checkResp.json();
        if (Array.isArray(found) && found.length > 0) {
          var remoteRow = found[0];
          if (remoteRow.pin_hash && remoteRow.pin_hash !== pinHash) {
            return { ok: false, msg: 'Gracz "' + nick + '" już istnieje w chmurze, ale podano błędny 4-cyfrowy PIN!' };
          }
          if (remoteRow.state_json) {
            mergeRemoteStateIntoCurrent(remoteRow.state_json);
          } else {
            state.xp = Math.max(state.xp, Number(remoteRow.xp) || 0);
            state.streak = Math.max(state.streak, Number(remoteRow.streak) || 1);
          }
        }
      }
    } catch (e) {
      console.warn('Cloud profile check warning:', e);
    }
  }

  // 2. Sprawdzenie w lokalnym rejestrze profili na tym urządzeniu
  var localMap = getLocalProfilesMap();
  var existingLocal = localMap[nick.toLowerCase()];
  if (existingLocal) {
    if (existingLocal.pin_hash && existingLocal.pin_hash !== pinHash) {
      return { ok: false, msg: 'Profil "' + nick + '" na tym urządzeniu ma przypisany inny 4-cyfrowy PIN!' };
    }
    if (existingLocal.state_json) {
      mergeRemoteStateIntoCurrent(existingLocal.state_json);
    }
  }

  state.userProfile = {
    nick: nick,
    pinHash: pinHash,
    updatedAt: new Date().toISOString()
  };
  state.nickname = nick;
  uiState.authModalOpen = false;
  uiState.authError = '';
  saveState();
  await syncProfileToCloud(true);
  return { ok: true, msg: 'Zalogowano jako ' + nick + '!' };
}

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function(c) {
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
  });
}

var DBEAVER_KW_SET = new Set([
  'SELECT', 'FROM', 'WHERE', 'AS', 'DISTINCT', 'ORDER', 'BY', 'LIMIT', 'OFFSET',
  'AND', 'OR', 'IN', 'BETWEEN', 'ILIKE', 'LIKE', 'IS', 'NOT', 'NULL',
  'JOIN', 'INNER', 'LEFT', 'RIGHT', 'FULL', 'CROSS', 'ON', 'GROUP', 'HAVING',
  'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'ASC', 'DESC', 'WITH', 'OVER',
  'PARTITION', 'FILTER', 'EXISTS', 'UNION', 'ALL'
]);

var DBEAVER_FN_SET = new Set([
  'ROUND', 'COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'COALESCE', 'NULLIF',
  'DATE_TRUNC', 'CAST', 'EXTRACT', 'TO_CHAR', 'ROW_NUMBER', 'RANK',
  'DENSE_RANK', 'LAG', 'LEAD', 'GENERATE_SERIES', 'LOWER', 'UPPER',
  'TRIM', 'LENGTH'
]);

var DBEAVER_NON_ALIAS_SET = new Set([
  'OUTER', 'NATURAL', 'LATERAL', 'USING', 'WINDOW', 'FETCH', 'INTERSECT',
  'EXCEPT', 'FOR', 'INTO', 'VALUES', 'SET', ' ONLY', 'TRUE', 'FALSE'
]);

var SQL_TOK = /(--[^\n]*|\/\*[\s\S]*?(?:\*\/|$))|('(?:[^']|'')*(?:'|$))|(\b\d+(?:\.\d+)?\b)|([A-Za-z_]\w*)|([\u2018\u2019\u201A\u201B\u201C\u201D])|([\s\S])/g;

function detectSqlTableAliases(sqlText) {
  var aliases = new Set();
  var clean = String(sqlText || '')
    .replace(/--[^\n]*/g, function(m) { return ' '.repeat(m.length); })
    .replace(/\/\*[\s\S]*?(?:\*\/|$)/g, function(m) { return ' '.repeat(m.length); })
    .replace(/'(?:[^']|'')*(?:'|$)/g, function(m) { return ' '.repeat(m.length); });

  var reFromJoin = /\b(?:FROM|JOIN)\s+([A-Za-z_]\w*)(?:\s+AS\s+|\s+)([A-Za-z_]\w*)\b/gi;
  var m;
  while ((m = reFromJoin.exec(clean)) !== null) {
    var tbl = m[1].toUpperCase();
    var cand = m[2].toUpperCase();
    if (
      !DBEAVER_KW_SET.has(tbl) &&
      !DBEAVER_KW_SET.has(cand) &&
      !DBEAVER_FN_SET.has(cand) &&
      !DBEAVER_NON_ALIAS_SET.has(cand)
    ) {
      aliases.add(m[2].toLowerCase());
    }
  }

  var reGenSeries = /\bgenerate_series\s*\([^)]*\)\s*(?:AS\s+)?([A-Za-z_]\w*)\b/gi;
  while ((m = reGenSeries.exec(clean)) !== null) {
    var gsAlias = m[1].toUpperCase();
    if (!DBEAVER_KW_SET.has(gsAlias) && !DBEAVER_FN_SET.has(gsAlias)) {
      aliases.add(m[1].toLowerCase());
    }
  }

  return aliases;
}

function highlightSQL(sqlText) {
  var raw = String(sqlText == null ? '' : sqlText);
  if (!raw) return '';
  var aliasSet = detectSqlTableAliases(raw);
  var out = '', m;
  SQL_TOK.lastIndex = 0;

  while ((m = SQL_TOK.exec(raw)) !== null) {
    var x = m[0];
    var idx = m.index;
    var cls = null;

    if (m[1]) {
      cls = 'sql-comment';
    } else if (m[2]) {
      cls = 'sql-str';
    } else if (m[3]) {
      cls = 'sql-num';
    } else if (m[5]) {
      cls = 't-bad';
    } else if (m[4]) {
      var prevChar = idx > 0 ? raw[idx - 1] : '';
      var beforeSlice = raw.slice(Math.max(0, idx - 24), idx);
      var isDirectlyAfterFromOrJoin = /\b(?:FROM|JOIN)\s+$/i.test(beforeSlice);
      var upper = x.toUpperCase();
      var lower = x.toLowerCase();

      if (prevChar !== '.' && !isDirectlyAfterFromOrJoin && aliasSet.has(lower)) {
        cls = 'sql-alias';
      } else if (prevChar !== '.' && DBEAVER_KW_SET.has(upper)) {
        cls = 'sql-kw';
      } else if (prevChar !== '.' && DBEAVER_FN_SET.has(upper)) {
        cls = 'sql-fn';
      }
    }

    out += cls ? '<span class="' + cls + '">' + esc(x) + '</span>' : esc(x);
  }
  return out;
}
window.highlightSQL = highlightSQL;
window.detectSqlTableAliases = detectSqlTableAliases;

function unescapeHtmlEntities(str) {
  return String(str == null ? '' : str)
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&');
}

function highlightHtmlCodeBlocks(htmlStr) {
  return String(htmlStr == null ? '' : htmlStr).replace(/<code([^>]*)>([\s\S]*?)<\/code>/gi, function(_, attrs, inner) {
    if (inner.indexOf('<span') > -1) return '<code' + attrs + '>' + inner + '</code>';
    var rawSql = unescapeHtmlEntities(inner);
    return '<code' + attrs + '>' + highlightSQL(rawSql) + '</code>';
  });
}

function formatPrompt(txt) {
  var parts = String(txt == null ? '' : txt).split(/(`[^`]+`)/g);
  return parts.map(function(part) {
    if (part.length >= 2 && part.charAt(0) === '`' && part.charAt(part.length - 1) === '`') {
      var rawCode = part.slice(1, -1);
      return '<code class="inline">' + highlightSQL(rawCode) + '</code>';
    }
    return esc(part).replace(/\n/g, '<br>');
  }).join('');
}

function toast(msg) {
  var t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(window._tTimer);
  window._tTimer = setTimeout(function() { t.classList.remove('show'); }, 2800);
}

function registerGapTrap(gapId, name, hint) {
  var g = state.gaps.find(function(x) { return x.id === gapId; });
  if (g) {
    g.lvl = Math.max(0, g.lvl - 1);
    g.hits = (g.hits || 0) + 1;
  } else if (gapId) {
    state.gaps.unshift({ id: gapId, name: name, hint: hint, lvl: 0, hits: 1 });
  }
  saveState();
}

/* ==========================================================================
   7. DWUWARSTWOWY EDYTOR SQL + POMOCNIK TABEL ZADANIA
   ========================================================================== */
function sqlUpdate() {
  var code = document.getElementById('answer');
  if (!code) return;
  var gut = document.getElementById('sqlgut'), hl = document.getElementById('sqlhl');
  var t = code.value, n = t.split('\n').length, gHtml = '';
  var errLn = (lastExecResult && lastExecResult.errorLine) ? lastExecResult.errorLine : 0;
  for (var i = 1; i <= n; i++) {
    gHtml += '<span class="ln' + (i === errLn ? ' err' : '') + '">' + i + '</span>';
  }
  gut.innerHTML = gHtml;
  code.style.height = 'auto';
  code.style.height = Math.max(88, code.scrollHeight + 4) + 'px';

  var out = highlightSQL(t);
  if (t.slice(-1) === '\n') out += ' ';
  hl.innerHTML = out;
  hl.scrollTop = code.scrollTop;
  hl.scrollLeft = code.scrollLeft;
  gut.scrollTop = code.scrollTop;
}

function formatSqlPretty(sql) {
  var s = String(sql || '').trim();
  if (!s) return '';
  if (s.indexOf('\n') > -1 && s.split('\n').length >= 4) return s;
  s = s.replace(/\s+/g, ' ');
  s = s.replace(/\s+\b(INNER\s+JOIN|LEFT\s+(?:OUTER\s+)?JOIN|RIGHT\s+(?:OUTER\s+)?JOIN|FULL\s+(?:OUTER\s+)?JOIN|CROSS\s+JOIN|JOIN|FROM|WHERE|GROUP\s+BY|HAVING|ORDER\s+BY|LIMIT|UNION(?:\s+ALL)?|EXCEPT)\b/gi, function(_, kw) {
    return '\n' + kw.toUpperCase();
  });
  s = s.replace(/,\s*(?=[a-zA-Z_]\w*\s+AS\s*\()/gi, ',\n  ');
  return s;
}

function insertAtCursor(snippet, skipFocus) {
  var ta = document.getElementById('answer');
  if (!ta) return;
  if (!Array.isArray(uiState.editorUndoStack)) uiState.editorUndoStack = [];
  uiState.editorUndoStack.push(ta.value);
  if (uiState.editorUndoStack.length > 40) uiState.editorUndoStack.shift();
  var start = skipFocus ? ta.value.length : (ta.selectionStart !== undefined ? ta.selectionStart : ta.value.length);
  var end = skipFocus ? ta.value.length : (ta.selectionEnd !== undefined ? ta.selectionEnd : ta.value.length);
  var val = ta.value;
  var pad = (start > 0 && !/[\s(.]/.test(val[start - 1]) && !/^[,);':]/.test(snippet)) ? ' ' : '';
  var trailingSpace = (!/[\s(;]/.test(snippet.slice(-1))) ? ' ' : '';
  var toInsert = pad + snippet + trailingSpace;
  ta.value = val.slice(0, start) + toInsert + val.slice(end);
  var pos = start + toInsert.length;
  if (!skipFocus) {
    ta.focus();
    ta.setSelectionRange(pos, pos);
  }
  state.editorCode = ta.value;
  if (lastExecResult && lastExecResult.errorLine) lastExecResult.errorLine = 0;
  sqlUpdate();
  saveState();
}
window.insertAtCursor = insertAtCursor;

// Wyciąga nazwy tabel biorących udział w zadaniu (z tablicy tables lub z klauzul FROM/JOIN zapytania wzorcowego sol)
function resolveTaskTables(tableNames, solSql) {
  if (Array.isArray(tableNames) && tableNames.length) return tableNames.slice();
  var sql = typeof tableNames === 'string' ? tableNames : String(solSql || '');
  var found = [];
  if (sql) {
    var knownSet = new Set(ALL_SCHEMA_META.map(function(m) { return m.table; }));
    var re = /\b(?:FROM|JOIN)\s+([a-zA-Z_]\w*)/gi, m;
    while ((m = re.exec(sql)) !== null) {
      var cand = m[1].toLowerCase();
      if (knownSet.has(cand) && found.indexOf(cand) === -1) found.push(cand);
    }
  }
  return found;
}

function buildTaskSchemaBox(tableNames, solSql) {
  var activeTables = resolveTaskTables(tableNames, solSql);
  if (!activeTables.length) return '';
  var metas = ALL_SCHEMA_META.filter(function(m) { return activeTables.indexOf(m.table) > -1; });
  if (!metas.length) return '';

  // Zliczanie kluczy występujących w więcej niż jednej tabeli zadania
  var keyCounts = {};
  metas.forEach(function(m) {
    m.cols.forEach(function(c) {
      var colName = typeof c === 'string' ? c : c.name;
      var isKey = typeof c === 'string' ? /_id$/i.test(c) : !!c.isKey;
      if (isKey) {
        keyCounts[colName] = (keyCounts[colName] || 0) + 1;
      }
    });
  });
  var sharedKeys = Object.keys(keyCounts).filter(function(k) { return keyCounts[k] > 1; });
  var joinBanner = (metas.length > 1 && sharedKeys.length > 0)
    ? '<div class="join-keys-banner">🔗 Klucz łączenia tabel w tym zadaniu: <strong>' + sharedKeys.map(esc).join(', ') + '</strong></div>'
    : '';

  var isLevel1Open = !!uiState.schemaBoxOpen;
  var summaryLbl = metas.length === 1
    ? '🗄️ Tabela: ' + esc(metas[0].table) + ' (' + metas[0].cols.length + ' kolumn)'
    : '🗄️ Tabele: ' + metas.map(function(m) { return esc(m.table) + ' (' + m.cols.length + ' kol.)'; }).join(', ');

  return '<details class="helper-fold iv-spec-fold"' + (isLevel1Open ? ' open' : '') + '>' +
    '<summary>' + summaryLbl + '</summary>' +
    '<div style="display:flex;flex-direction:column;gap:10px;margin-top:8px">' +
      metas.map(function(m) {
        var sample = tableSamples[m.table] || interviewSamples[m.table];
        var sampleHtml = '';
        if (sample && sample.columns && sample.columns.length) {
          var rowCnt = (sample.values || []).length;
          sampleHtml = '<div class="example-input-box">' +
            '<div class="example-input-hdr">📊 Example Input — tabela <code>' + esc(m.table) + '</code> (pierwsze ' + Math.min(4, rowCnt) + ' wiersze):</div>' +
            renderSingleTable(sample, 4) +
          '</div>';
        } else {
          sampleHtml = '<div style="margin-top:6px"><button type="button" class="btn sm" data-act="peekTable" data-table="' + esc(m.table) + '">👁 Pobierz Example Input (' + esc(m.table) + ')</button></div>';
        }

        // Poziom 2: osobny zagnieżdżony tag <details> pod kolumnami, domyślnie ZWINIĘTY
        var level2Fold = '<details class="example-input-fold">' +
          '<summary class="example-input-summary">👁️ Example Input (' + esc(m.table) + ' — 4 wiersze)</summary>' +
          '<div class="example-input-fold-body">' + sampleHtml + '</div>' +
        '</details>';

        return '<div class="iv-tbl-card">' +
          '<div style="display:flex;flex-wrap:wrap;align-items:center;gap:5px">' +
            '<button type="button" class="helper-tbl-btn" data-act="ins" data-val="' + esc(m.table) + '" data-insert-sql="' + esc(m.table) + '" title="Wstaw nazwę tabeli ' + esc(m.table) + '">📦 ' + esc(m.table) + '</button>' +
            (m.desc ? '<span class="small muted" style="font-size:11.5px">· ' + esc(m.desc) + '</span>' : '') +
          '</div>' +
          '<div style="display:flex;flex-wrap:wrap;align-items:center;gap:5px;margin-top:6px">' +
            m.cols.map(function(c) {
              var colName = typeof c === 'string' ? c : c.name;
              var colType = typeof c === 'string' ? (DVDRENTAL_COL_TYPES[c] || 'text') : (c.type || 'text');
              var isKey = typeof c === 'string' ? /_id$/i.test(c) : !!c.isKey;
              var cls = 'helper-col-btn' + (isKey ? ' col-key-chip' : '');
              var ttl = (isKey ? 'Klucz złączenia (JOIN ON) · ' : 'Kolumna · ') + 'Typ: ' + colType;
              var lbl = (isKey ? '🔗 ' : '') + esc(colName) + ' <span class="col-type-badge">' + esc(colType) + '</span>';
              return '<button type="button" class="' + cls + '" data-act="ins" data-val="' + esc(colName) + '" data-insert-sql="' + esc(colName) + '" title="' + esc(ttl) + '">' + lbl + '</button>';
            }).join('') +
          '</div>' +
          level2Fold +
        '</div>';
      }).join('') +
    '</div>' +
    joinBanner +
  '</details>';
}
var renderTablesHelper = buildTaskSchemaBox;

function renderExampleOutputBox(solSql) {
  if (!solSql) return '';
  ensureExpectedOutput(solSql);
  var key = String(solSql || '').trim();
  var expRes = expectedOutputCache[key];

  var innerHtml = '';
  if (!expRes || !expRes.columns) {
    innerHtml = '<p class="small muted" style="margin:6px 0">⏳ Generowanie podglądu oczekiwanego kształtu wyniku w PGlite…</p>';
  } else {
    var totalRows = (expRes.values || []).length;
    var shownRows = Math.min(3, totalRows);
    var moreNote = totalRows > 3
      ? '<div class="example-output-more">... (łącznie oczekiwanych wierszy: <strong>' + totalRows + '</strong>)</div>'
      : '<div class="example-output-more">Łącznie oczekiwanych wierszy w wyniku: <strong>' + totalRows + '</strong></div>';
    innerHtml = '<p class="small muted" style="margin:4px 0 6px">Docelowe nagłówki kolumn: ' +
      expRes.columns.map(function(c) { return '<code class="inline">' + esc(c) + '</code>'; }).join(', ') +
      (shownRows > 0 ? ' (poniżej pierwsze ' + shownRows + ' wiersze wzorcowego wyniku):' : ':') + '</p>' +
      renderSingleTable(expRes, 3) +
      moreNote;
  }

  return '<details class="example-output-fold"' + (uiState.exampleOutOpen !== false ? ' open' : '') + '>' +
    '<summary>🎯 Oczekiwany kształt wyniku (Example Output — pierwsze 3 wiersze)</summary>' +
    '<div class="example-output-body">' + innerHtml + '</div>' +
  '</details>';
}

function getTaskSchemaColCount(tableNames, solSql) {
  var activeTables = resolveTaskTables(tableNames, solSql);
  var metas = ALL_SCHEMA_META.filter(function(m) { return activeTables.indexOf(m.table) > -1; });
  return metas.reduce(function(acc, m) { return acc + (m.cols ? m.cols.length : 0); }, 0);
}

function renderTaskTablesInline(tableNames, solSql) {
  var activeTables = resolveTaskTables(tableNames, solSql);
  if (!activeTables.length) return '<p class="small muted" style="margin:6px 0">Brak przypisanych tabel źródłowych.</p>';
  var metas = ALL_SCHEMA_META.filter(function(m) { return activeTables.indexOf(m.table) > -1; });
  if (!metas.length) return '';

  var keyCounts = {};
  metas.forEach(function(m) {
    m.cols.forEach(function(c) {
      var colName = typeof c === 'string' ? c : c.name;
      var isKey = typeof c === 'string' ? /_id$/i.test(c) : !!c.isKey;
      if (isKey) {
        keyCounts[colName] = (keyCounts[colName] || 0) + 1;
      }
    });
  });
  var sharedKeys = Object.keys(keyCounts).filter(function(k) { return keyCounts[k] > 1; });
  var joinBanner = (metas.length > 1 && sharedKeys.length > 0)
    ? '<div class="join-keys-banner">🔗 Klucz łączenia tabel w tym zadaniu: <strong>' + sharedKeys.map(esc).join(', ') + '</strong></div>'
    : '';

  return '<div class="inline-schema-wrap">' +
    joinBanner +
    metas.map(function(m) {
      var sample = tableSamples[m.table] || interviewSamples[m.table];
      var sampleHtml = '';
      if (sample && sample.columns && sample.columns.length) {
        var rowCnt = (sample.values || []).length;
        sampleHtml = '<div class="example-input-box" style="margin-top:8px">' +
          '<div class="example-input-hdr">📊 Example Input — tabela <code>' + esc(m.table) + '</code> (pierwsze ' + Math.min(4, rowCnt) + ' wiersze):</div>' +
          renderSingleTable(sample, 4) +
        '</div>';
      } else {
        sampleHtml = '<div style="margin-top:6px"><button type="button" class="btn sm" data-act="peekTable" data-table="' + esc(m.table) + '">👁 Pobierz Example Input (' + esc(m.table) + ')</button></div>';
      }

      return '<div class="iv-tbl-card">' +
        '<div style="display:flex;flex-wrap:wrap;align-items:center;gap:5px">' +
          '<button type="button" class="helper-tbl-btn" data-act="ins" data-val="' + esc(m.table) + '" data-insert-sql="' + esc(m.table) + '" title="Wstaw nazwę tabeli ' + esc(m.table) + '">📦 ' + esc(m.table) + '</button>' +
          (m.desc ? '<span class="small muted" style="font-size:11.5px">· ' + esc(m.desc) + '</span>' : '') +
        '</div>' +
        '<div style="display:flex;flex-wrap:wrap;align-items:center;gap:5px;margin-top:6px">' +
          m.cols.map(function(c) {
            var colName = typeof c === 'string' ? c : c.name;
            var colType = typeof c === 'string' ? (DVDRENTAL_COL_TYPES[c] || 'text') : (c.type || 'text');
            var isKey = typeof c === 'string' ? /_id$/i.test(c) : !!c.isKey;
            var cls = 'helper-col-btn' + (isKey ? ' col-key-chip' : '');
            var ttl = (isKey ? 'Klucz złączenia (JOIN ON) · ' : 'Kolumna · ') + 'Typ: ' + colType;
            var lbl = (isKey ? '🔗 ' : '') + esc(colName) + ' <span class="col-type-badge">' + esc(colType) + '</span>';
            return '<button type="button" class="' + cls + '" data-act="ins" data-val="' + esc(colName) + '" data-insert-sql="' + esc(colName) + '" title="' + esc(ttl) + '">' + lbl + '</button>';
          }).join('') +
        '</div>' +
        sampleHtml +
      '</div>';
    }).join('') +
  '</div>';
}

function renderExampleOutputInline(solSql) {
  if (!solSql) return '';
  ensureExpectedOutput(solSql);
  var key = String(solSql || '').trim();
  var expRes = expectedOutputCache[key];

  var innerHtml = '';
  if (!expRes || !expRes.columns) {
    innerHtml = '<p class="small muted" style="margin:6px 0">⏳ Generowanie podglądu oczekiwanego kształtu wyniku w PGlite…</p>';
  } else {
    var totalRows = (expRes.values || []).length;
    var shownRows = Math.min(3, totalRows);
    var moreNote = totalRows > 3
      ? '<div class="example-output-more">... (łącznie oczekiwanych wierszy: <strong>' + totalRows + '</strong>)</div>'
      : '<div class="example-output-more">Łącznie oczekiwanych wierszy w wyniku: <strong>' + totalRows + '</strong></div>';
    innerHtml = '<div class="example-output-hdr-inline">🎯 <strong>Oczekiwany kształt wyniku (Example Output — pierwsze ' + shownRows + ' wiersze):</strong></div>' +
      '<p class="small muted" style="margin:3px 0 6px">Docelowe nagłówki kolumn: ' +
      expRes.columns.map(function(c) { return '<code class="inline">' + esc(c) + '</code>'; }).join(', ') + '</p>' +
      renderSingleTable(expRes, 3) +
      moreNote;
  }

  return '<div class="example-output-inline-box">' + innerHtml + '</div>';
}

/* ==========================================================================
   6B. CENTRALNY GENERATOR SPECYFIKACJI DATALEMUR (100% CZYSTE POLECENIE)
   ========================================================================== */
function splitSqlTopLevel(str) {
  var res = [], cur = '', depth = 0, inStr = false;
  for (var i = 0; i < str.length; i++) {
    var ch = str[i];
    if (ch === "'" && str[i - 1] !== '\\') inStr = !inStr;
    if (!inStr) {
      if (ch === '(') depth++;
      else if (ch === ')' && depth > 0) depth--;
      else if (ch === ',' && depth === 0) {
        if (cur.trim()) res.push(cur.trim());
        cur = '';
        continue;
      }
    }
    cur += ch;
  }
  if (cur.trim()) res.push(cur.trim());
  return res;
}

function extractMainSelectSegment(sql) {
  var s = String(sql || '').trim().replace(/;+\s*$/, '');
  var inStr = false, depth = 0, lastMainSelectIdx = -1;
  var upper = s.toUpperCase();
  for (var i = 0; i < s.length; i++) {
    var ch = s[i];
    if (ch === "'" && s[i - 1] !== '\\') inStr = !inStr;
    if (!inStr) {
      if (ch === '(') depth++;
      else if (ch === ')' && depth > 0) depth--;
      else if (depth === 0 && upper.slice(i, i + 6) === 'SELECT') {
        var prev = i === 0 ? ' ' : s[i - 1];
        var next = s[i + 6] || ' ';
        if (!/[A-Za-z0-9_]/.test(prev) && !/[A-Za-z0-9_]/.test(next)) {
          lastMainSelectIdx = i;
        }
      }
    }
  }
  if (lastMainSelectIdx === -1) return s;
  return s.slice(lastMainSelectIdx);
}

function parseSqlDetails(sol, fallbackTables) {
  var s = String(sol || '').trim();
  var mainSeg = extractMainSelectSegment(s);
  var tables = [];
  if (Array.isArray(fallbackTables) && fallbackTables.length) {
    tables = fallbackTables.slice();
  } else {
    var knownTables = [
      'film_category', 'film_actor', 'film', 'category', 'actor', 'customer', 'rental', 'payment', 'staff', 'store',
      'user_events', 'app_transactions', 'saas_users', 'emp_salaries', 'product_orders', 'dept_budgets'
    ];
    var reTbl = /\b(?:FROM|JOIN)\s+([a-zA-Z_]\w*)/gi, m;
    while ((m = reTbl.exec(s)) !== null) {
      var cand = m[1].toLowerCase();
      if (knownTables.indexOf(cand) > -1 && tables.indexOf(cand) === -1) tables.push(cand);
    }
  }

  var selectBody = '';
  var inStr = false, depth = 0;
  var upperMain = mainSeg.toUpperCase();
  var startPos = 6;
  if (/^SELECT\s+DISTINCT\s+ON\s*\(/i.test(mainSeg)) {
    var openP = mainSeg.indexOf('(');
    var d2 = 0;
    for (var k = openP; k < mainSeg.length; k++) {
      if (mainSeg[k] === '(') d2++;
      else if (mainSeg[k] === ')') { d2--; if (d2 === 0) { startPos = k + 1; break; } }
    }
  } else if (/^SELECT\s+DISTINCT\b/i.test(mainSeg)) {
    startPos = mainSeg.replace(/^SELECT\s+DISTINCT\b/i, '').length;
    startPos = mainSeg.length - startPos;
  }

  var fromPos = -1;
  for (var i = startPos; i < mainSeg.length; i++) {
    var ch = mainSeg[i];
    if (ch === "'" && mainSeg[i - 1] !== '\\') inStr = !inStr;
    if (!inStr) {
      if (ch === '(') depth++;
      else if (ch === ')' && depth > 0) depth--;
      else if (depth === 0 && upperMain.slice(i, i + 4) === 'FROM') {
        var prevC = mainSeg[i - 1] || ' ';
        var nextC = mainSeg[i + 4] || ' ';
        if (/[\s)]/.test(prevC) && /[\s(]/.test(nextC)) {
          fromPos = i;
          break;
        }
      }
    }
  }

  if (fromPos > -1) {
    selectBody = mainSeg.slice(startPos, fromPos).trim();
  } else {
    selectBody = mainSeg.slice(startPos).trim();
  }

  var rawCols = splitSqlTopLevel(selectBody);
  var outCols = rawCols.map(function(c) {
    var cleanC = c.replace(/\s+/g, ' ').trim();
    if (cleanC === '*') {
      return { name: '*', expr: '*', hasAlias: false };
    }
    var asMatch = /\bAS\s+([a-zA-Z_]\w*)\s*$/i.exec(cleanC);
    if (asMatch) {
      var alias = asMatch[1];
      var exprPart = cleanC.slice(0, asMatch.index).trim();
      return { name: alias, expr: exprPart, hasAlias: true };
    }
    var dotMatch = /(?:^|\.)([a-zA-Z_]\w*)\s*$/.exec(cleanC);
    var colName = dotMatch ? dotMatch[1] : cleanC;
    return { name: colName, expr: cleanC, hasAlias: false };
  });

  var orderMatch = /\bORDER\s+BY\s+([\s\S]+?)(?:\bLIMIT\s+\d+|\s*;?\s*$)/i.exec(mainSeg);
  var orderBy = orderMatch ? orderMatch[1].replace(/\s+/g, ' ').trim() : '';
  var limitMatch = /\bLIMIT\s+(\d+)/i.exec(mainSeg);
  var limit = limitMatch ? limitMatch[1] : '';

  var hasRound = /ROUND\s*\(([^,]+),\s*(\d+)\)/i.exec(s);
  var roundDigits = hasRound ? hasRound[2] : null;

  return {
    tables: tables,
    cols: outCols,
    orderBy: orderBy,
    limit: limit,
    roundDigits: roundDigits,
    hasDistinct: /\bDISTINCT\b/i.test(s),
    hasWhere: /\bWHERE\b/i.test(s),
    hasGroupBy: /\bGROUP\s+BY\b/i.test(s),
    hasHaving: /\bHAVING\b/i.test(s),
    hasJoin: /\bJOIN\b/i.test(s),
    hasLeftJoin: /\bLEFT\s+(?:OUTER\s+)?JOIN\b/i.test(s),
    hasCte: /^\s*WITH\b/i.test(s),
    hasWindow: /\bOVER\s*\(/i.test(s),
    hasCase: /\bCASE\s+WHEN\b/i.test(s),
    hasFilter: /\bFILTER\s*\(\s*WHERE\b/i.test(s)
  };
}

function extractExprSourceCols(expr) {
  var e = String(expr || '');
  var clean = e.replace(/'(?:[^']|'')*'/g, ' ');
  var ignore = new Set([
    'SELECT', 'FROM', 'WHERE', 'AS', 'DISTINCT', 'ORDER', 'BY', 'LIMIT', 'OFFSET',
    'AND', 'OR', 'IN', 'BETWEEN', 'ILIKE', 'LIKE', 'IS', 'NOT', 'NULL', 'JOIN',
    'INNER', 'LEFT', 'RIGHT', 'FULL', 'CROSS', 'ON', 'GROUP', 'HAVING', 'CASE',
    'WHEN', 'THEN', 'ELSE', 'END', 'ASC', 'DESC', 'WITH', 'OVER', 'PARTITION',
    'FILTER', 'EXISTS', 'UNION', 'ALL', 'ROUND', 'COUNT', 'SUM', 'AVG', 'MIN',
    'MAX', 'COALESCE', 'NULLIF', 'DATE_TRUNC', 'CAST', 'EXTRACT', 'TO_CHAR',
    'ROW_NUMBER', 'RANK', 'DENSE_RANK', 'LAG', 'LEAD', 'GENERATE_SERIES',
    'LOWER', 'UPPER', 'TRIM', 'LENGTH', 'INTERVAL', 'NUMERIC', 'INTEGER',
    'TEXT', 'DATE', 'DAY', 'DAYS', 'MONTH', 'YEAR', 'TRUE', 'FALSE'
  ]);
  var cols = [];
  var re = /\b(?:[a-zA-Z_]\w*\.)?([a-zA-Z_]\w*)\b/g;
  var m;
  while ((m = re.exec(clean)) !== null) {
    var col = m[1];
    var u = col.toUpperCase();
    if (!ignore.has(u) && !/^\d/.test(col) && cols.indexOf(col) === -1) {
      cols.push(col);
    }
  }
  return cols;
}

function describeSqlExprPl(expr, alias) {
  var e = String(expr || '').trim();
  if (e === '*') return 'wszystkie kolumny tabeli <span class="req-calc-pill">*</span>';
  var u = e.toUpperCase();
  var srcCols = extractExprSourceCols(e);
  var srcColsLabel = srcCols.length ? srcCols.join(', ') : 'wierszy';

  if (u === 'COUNT(*)') return 'liczba wierszy <span class="req-calc-pill">wyliczenie COUNT(*)</span>';
  if (/^COUNT\s*\(\s*DISTINCT\s+([^)]+)\)/i.test(e)) {
    return 'liczba unikalnych wartości <span class="req-calc-pill">wyliczenie z: ' + esc(srcColsLabel) + '</span>';
  }
  if (/\bCOUNT\b/i.test(e) && /\bFILTER\s*\(\s*WHERE\b/i.test(e)) {
    return 'liczba wierszy spełniających warunek <span class="req-calc-pill">warunkowe zliczanie FILTER</span>';
  }
  if (/^COUNT\s*\(([^)]+)\)/i.test(e)) {
    return 'liczba niepustych wartości <span class="req-calc-pill">wyliczenie z: ' + esc(srcColsLabel) + '</span>';
  }
  if (/^ROUND\s*\(\s*AVG\s*\(([^)]+)\)\s*,\s*(\d+)\s*\)/i.test(e)) {
    var mRa = /^ROUND\s*\(\s*AVG\s*\(([^)]+)\)\s*,\s*(\d+)\s*\)/i.exec(e);
    return 'średnia zaokrąglona do ' + mRa[2] + ' miejsc <span class="req-calc-pill">na podstawie: ' + esc(srcColsLabel) + '</span>';
  }
  if (/^ROUND\s*\((.+),\s*(\d+)\s*\)$/i.test(e)) {
    var mR = /^ROUND\s*\((.+),\s*(\d+)\s*\)$/i.exec(e);
    return 'wartość zaokrąglona do ' + mR[2] + ' miejsc <span class="req-calc-pill">wartość wyliczona na podstawie: ' + esc(srcColsLabel) + '</span>';
  }
  if (/^SUM\s*\(([^)]+)\)/i.test(e)) {
    return 'suma wartości <span class="req-calc-pill">wyliczenie z: ' + esc(srcColsLabel) + '</span>';
  }
  if (/^AVG\s*\(([^)]+)\)/i.test(e)) {
    return 'średnia wartość <span class="req-calc-pill">wyliczenie z: ' + esc(srcColsLabel) + '</span>';
  }
  if (/^MIN\s*\(([^)]+)\)/i.test(e)) {
    return 'wartość minimalna <span class="req-calc-pill">wyliczenie z: ' + esc(srcColsLabel) + '</span>';
  }
  if (/^MAX\s*\(([^)]+)\)/i.test(e)) {
    return 'wartość maksymalna <span class="req-calc-pill">wyliczenie z: ' + esc(srcColsLabel) + '</span>';
  }
  if (/\bOVER\s*\(/i.test(e)) {
    return 'wynik funkcji okna <span class="req-calc-pill">funkcja okna OVER (...)</span>';
  }
  if (/\bCASE\s+WHEN\b/i.test(e)) {
    return 'etykieta warunkowa <span class="req-calc-pill">wyrażenie CASE WHEN</span>';
  }
  if (e !== alias) {
    var colHint = srcCols.length ? ('wartość wyliczona na podstawie: ' + srcCols.join(', ')) : 'wartość wyliczona';
    return 'wartość wyliczona <span class="req-calc-pill">' + esc(colHint) + '</span>';
  }
  return '';
}

function buildCleanPolecenie(item, details) {
  var raw = String((item && (item.goal || item.prompt)) || '').trim();
  raw = raw.replace(/^Rozgrzewka\s+R\d+\s*(\([^)]*\))?\s*:\s*/i, '');
  raw = raw.replace(/^Wyzwanie\s*:\s*/i, '');
  raw = raw.replace(/^Zadanie\s+\d+\s*:\s*/i, '');
  var s = raw.replace(/`([^`]+)`/g, '$1').trim();
  if (!s) return 'Napisz zapytanie SQL realizujące cel zadania.';

  // 1. Zamiana znanych nawiasów z warunkami SQL na naturalny opis biznesowy po polsku
  var parenConditionMap = [
    [/\(\s*hire_date\s*>=\s*'2022-01-01'\s*\)/gi, ''],
    [/\(\s*tx_status\s*=\s*'approved'\s*\)/gi, 'o statusie zatwierdzonym'],
    [/\(\s*tx_status\s*=\s*'declined'\s*\)/gi, 'o statusie odrzuconym'],
    [/\(\s*event_type\s*=\s*'login'\s*\)/gi, 'logowania'],
    [/\(\s*event_type\s*=\s*'purchase'\s*\)/gi, 'zakupu'],
    [/\(\s*event_type\s*=\s*'signup'\s*\)/gi, 'rejestracji'],
    [/\(\s*active\s*=\s*1\s*\)/gi, 'aktywnych'],
    [/\(\s*active\s*=\s*0\s*\)/gi, 'nieaktywnych'],
    [/\(\s*return_date\s+IS\s+NULL\s*\)/gi, 'jeszcze niezwróconych'],
    [/\(\s*return_date\s+IS\s+NOT\s+NULL\s*\)/gi, 'już zwróconych'],
    [/\(\s*manager_id\s+IS\s+NULL\s*\)/gi, 'bez przypisanego przełożonego'],
    [/\(\s*manager_id\s+IS\s+NOT\s+NULL\s*\)/gi, 'posiadających przełożonego'],
    [/\(\s*left_date\s+IS\s+NULL\s*\)/gi, 'nadal pracujących w firmie'],
    [/\(\s*left_date\s+IS\s+NOT\s+NULL\s*\)/gi, 'którzy odeszli z firmy']
  ];
  for (var pi = 0; pi < parenConditionMap.length; pi++) {
    s = s.replace(parenConditionMap[pi][0], parenConditionMap[pi][1]);
  }

  // 2. Usunięcie nawiasów z podpowiedziami technicznymi, wzorami lub warunkami SQL (wieloprzebiegowo dla zagnieżdżonych nawiasów)
  for (var pass = 0; pass < 3; pass++) {
    s = s.replace(/\s*\(([^()]*)\)/g, function(full, inner) {
      var t = inner.trim();
      if (!t) return '';
      if (/^[a-zA-Z0-9_]+(?:\s*,\s*[a-zA-Z0-9_]+)*$/.test(t) && (ALL_SCHEMA_COLS.has(t.toLowerCase()) || /_/.test(t))) {
        return '';
      }
      if (/[=<>!*+\/]|::|\b(?:SELECT|FROM|WHERE|JOIN|GROUP\s+BY|HAVING|ORDER\s+BY|LIMIT|OFFSET|OVER|PARTITION|ROUND|COUNT|SUM|AVG|MIN|MAX|COALESCE|NULLIF|FILTER|CASE|WHEN|DISTINCT|ILIKE|LIKE|BETWEEN|IS\s+NULL|IS\s+NOT\s+NULL|ASC|DESC|AS|IN|EXTRACT|EPOCH)\b/i.test(t)) {
        return '';
      }
      if (/[a-zA-Z0-9]+_[a-zA-Z0-9]+/.test(t)) {
        return '';
      }
      return full;
    });
  }
  s = s.replace(/\s*=\s*(?:ROUND|SUM|COUNT|AVG|MIN|MAX|COALESCE|CASE|ROW_NUMBER|RANK|DENSE_RANK|LAG|LEAD|EXTRACT|DATE_TRUNC)\b[^.]*/gi, '');

  // 3. Usunięcie fraz z aliasami technicznymi ("jako cost_diff", "pod nazwą cichy_klient", "AS duration_min")
  s = s.replace(/\s+(?:jako|pod\s+aliasem|pod\s+nazwą|z\s+aliasem|aliasem|o\s+nazwie)\s+[a-zA-Z_]\w*/gi, '');
  s = s.replace(/\s+\bAS\s+[a-zA-Z_]\w*/g, '');

  // 4. Zamiana nazw tabel na naturalne określenia biznesowe
  var tablePhraseReplacements = [
    [/\b[Zz]\s+tabeli\s+emp_salaries\b/g, 'Z listy pracowników'],
    [/\b[Ww]\s+tabeli\s+emp_salaries\b/g, 'Na liście pracowników'],
    [/\btabel[ięą]\s+emp_salaries\b/gi, 'listę pracowników'],
    [/\bemp_salaries\b/g, 'pracowników'],
    [/\b[Zz]\s+tabeli\s+dept_budgets\b/g, 'Z budżetów działów'],
    [/\bdept_budgets\b/g, 'budżetów działów'],
    [/\b[Zz]\s+tabeli\s+saas_users\b/g, 'Z bazy użytkowników SaaS'],
    [/\bsaas_users\b/g, 'użytkowników SaaS'],
    [/\b[Zz]\s+tabeli\s+app_transactions\b/g, 'Z historii transakcji'],
    [/\bapp_transactions\b/g, 'transakcji'],
    [/\b[Zz]\s+tabeli\s+user_events\b/g, 'Z dziennika zdarzeń użytkowników'],
    [/\buser_events\b/g, 'zdarzeń użytkowników'],
    [/\b[Zz]\s+tabeli\s+product_orders\b/g, 'Z rejestru zamówień produktów'],
    [/\bproduct_orders\b/g, 'zamówień produktów'],
    [/\b[Zz]\s+tabeli\s+film_category\b/g, 'Z przypisań filmów do kategorii'],
    [/\bfilm_category\b/g, 'przypisań kategorii filmów'],
    [/\b[Zz]\s+tabeli\s+film_actor\b/g, 'Z obsady filmowej'],
    [/\bfilm_actor\b/g, 'obsady filmowej'],
    [/\b[Zz]\s+tabeli\s+film\b/g, 'Z katalogu filmów'],
    [/\b[Ww]\s+tabeli\s+film\b/g, 'W katalogu filmów'],
    [/\b[Zz]\s+tabeli\s+customer\b/g, 'Z bazy klientów'],
    [/\b[Ww]\s+tabeli\s+customer\b/g, 'W bazie klientów'],
    [/\b[Zz]\s+tabeli\s+rental\b/g, 'Z historii wypożyczeń'],
    [/\b[Ww]\s+tabeli\s+rental\b/g, 'W historii wypożyczeń'],
    [/\b[Zz]\s+tabeli\s+payment\b/g, 'Z rejestru płatności'],
    [/\b[Ww]\s+tabeli\s+payment\b/g, 'W rejestrze płatności'],
    [/\b[Zz]\s+tabeli\s+staff\b/g, 'Z listy personelu'],
    [/\b[Zz]\s+tabeli\s+store\b/g, 'Z listy oddziałów wypożyczalni'],
    [/\b[Zz]\s+tabeli\s+actor\b/g, 'Z bazy aktorów'],
    [/\b[Zz]\s+tabeli\s+category\b/g, 'Z listy kategorii filmowych'],
    [/\bPołącz\s+customer\s+z\s+rental\b/gi, 'Połącz dane klientów z historią wypożyczeń'],
    [/\bPołącz\s+customer\s+z\s+payment\b/gi, 'Połącz dane klientów z rejestrem płatności'],
    [/\bPołącz\s+film\s+z\s+film_category\b/gi, 'Połącz katalog filmów z przypisaniami kategorii'],
    [/\bPołącz\s+film\s+z\s+film_actor\b/gi, 'Połącz katalog filmów z obsadą aktorską'],
    [/\bPołącz\s+rental\s+z\s+customer\b/gi, 'Połącz historię wypożyczeń z bazą klientów'],
    [/\bPołącz\s+payment\s+z\s+customer\b/gi, 'Połącz rejestr płatności z bazą klientów'],
    [/\bPołącz\s+payment\s+z\s+staff\b/gi, 'Połącz rejestr płatności z listą personelu'],
    [/\bPołącz\s+rental\s+z\s+staff\b/gi, 'Połącz historię wypożyczeń z listą personelu']
  ];
  for (var ti = 0; ti < tablePhraseReplacements.length; ti++) {
    s = s.replace(tablePhraseReplacements[ti][0], tablePhraseReplacements[ti][1]);
  }

  // 5. Zamiana technicznych nazw kolumn na naturalny język biznesowy (bez duplikowania poprzedzających polskich słów)
  var colBusinessMap = [
    [/(?:imię\s+i\s+nazwisko\s+)?\bfull_name\b/gi, 'imię i nazwisko'],
    [/(?:identyfikator\s+pracownika\s+|ID\s+pracownika\s+)?\bemp_id\b/gi, 'identyfikator pracownika'],
    [/(?:identyfikator\s+przełożonego\s+|ID\s+przełożonego\s+|ID\s+menedżera\s+)?\bmanager_id\b/gi, 'identyfikator przełożonego'],
    [/(?:dział\s+|departament\s+)?\bdepartment\b/gi, 'dział'],
    [/(?:stanowisko\s+)?\bjob_title\b/gi, 'stanowisko'],
    [/(?:dat[ęa]\s+zatrudnienia\s+)?\bhire_date\b/gi, 'datę zatrudnienia'],
    [/(?:dat[ęa]\s+odejścia\s+)?\bleft_date\b/gi, 'datę odejścia'],
    [/(?:pensj[ęa]\s+|wynagrodzenie\s+)?\bsalary\b/gi, 'pensję'],
    [/(?:ocen[ęa]\s+roczn[ąa]\s+)?\bperf_score\b/gi, 'ocenę roczną'],
    [/(?:roczny\s+budżet\s+|budżet\s+)?\bannual_budget\b/gi, 'roczny budżet'],
    [/(?:docelow[ąa]\s+liczb[ęa]\s+etatów\s+|limit\s+etatów\s+)?\bheadcount_target\b/gi, 'docelową liczbę etatów'],
    [/(?:identyfikator\s+użytkownika\s+|ID\s+użytkownika\s+)?\buser_id\b/gi, 'identyfikator użytkownika'],
    [/(?:dat[ęa]\s+rejestracji\s+)?\bsignup_date\b/gi, 'datę rejestracji'],
    [/(?:plan\s+subskrypcji\s+|plan\s+)?\bplan_tier\b/gi, 'plan subskrypcji'],
    [/(?:opłat[ęa]\s+miesięczn[ąa]\s+|abonament\s+miesięczny\s+)?\bmonthly_fee\b/gi, 'opłatę miesięczną'],
    [/(?:kraj\s+)?\bcountry\b/gi, 'kraj'],
    [/(?:kanał\s+pozyskania\s+)?\bacq_channel\b/gi, 'kanał pozyskania'],
    [/(?:identyfikator\s+transakcji\s+|ID\s+transakcji\s+)?\btx_id\b/gi, 'identyfikator transakcji'],
    [/(?:identyfikator\s+konta\s+|ID\s+konta\s+)?\baccount_id\b/gi, 'identyfikator konta'],
    [/(?:kategori[ęa]\s+sprzedawcy\s+)?\bmerchant_category\b/gi, 'kategorię sprzedawcy'],
    [/(?:status\s+transakcji\s+)?\btx_status\b/gi, 'status transakcji'],
    [/(?:dat[ęa]\s+transakcji\s+)?\btx_date\b/gi, 'datę transakcji'],
    [/(?:identyfikator\s+zdarzenia\s+|ID\s+zdarzenia\s+)?\bevent_id\b/gi, 'identyfikator zdarzenia'],
    [/(?:typ\s+zdarzenia\s+)?\bevent_type\b/gi, 'typ zdarzenia'],
    [/(?:dat[ęa]\s+zdarzenia\s+)?\bevent_date\b/gi, 'datę zdarzenia'],
    [/(?:czas\s+sesji\s+)?\bsession_sec\b/gi, 'czas trwania sesji'],
    [/(?:identyfikator\s+zamówienia\s+|ID\s+zamówienia\s+)?\border_id\b/gi, 'identyfikator zamówienia'],
    [/(?:nazw[ęa]\s+produktu\s+|produkt\s+)?\bproduct_name\b/gi, 'nazwę produktu'],
    [/(?:liczb[ęa]\s+sztuk\s+|ilość\s+)?\bqty\b/gi, 'liczbę sztuk'],
    [/(?:cen[ęa]\s+jednostkow[ąa]\s+)?\bunit_price\b/gi, 'cenę jednostkową'],
    [/(?:dat[ęa]\s+zamówienia\s+)?\border_date\b/gi, 'datę zamówienia'],
    [/(?:identyfikator\s+filmu\s+|ID\s+filmu\s+)?\bfilm_id\b/gi, 'identyfikator filmu'],
    [/(?:tytuł\s+filmu\s+|tytuł\s+)?\btitle\b/gi, 'tytuł filmu'],
    [/(?:kategori[ęa]\s+wiekow[ąa]\s+|klasyfikacj[ęa]\s+wiekow[ąa]\s+|rating\s+)?\brating\b/gi, 'kategorię wiekową'],
    [/(?:cen[ęa]\s+wypożyczenia\s+|stawk[ęa]\s+wypożyczenia\s+|cen[ęa]\s+najmu\s+|stawk[ęa]\s+)?\brental_rate\b/gi, 'cenę wypożyczenia'],
    [/(?:czas\s+trwania\s+|długość\s+filmu\s+|długość\s+)?\blength\b/gi, 'czas trwania filmu'],
    [/(?:rok\s+produkcji\s+|rok\s+wydania\s+)?\brelease_year\b/gi, 'rok wydania'],
    [/(?:koszt\s+odtworzenia\s+|koszt\s+wymiany\s+)?\breplacement_cost\b/gi, 'koszt wymiany'],
    [/(?:okres\s+wypożyczenia\s+|czas\s+najmu\s+)?\brental_duration\b/gi, 'domyślny okres wypożyczenia'],
    [/(?:identyfikator\s+klienta\s+|ID\s+klienta\s+)?\bcustomer_id\b/gi, 'identyfikator klienta'],
    [/(?:identyfikator\s+aktora\s+|ID\s+aktora\s+)?\bactor_id\b/gi, 'identyfikator aktora'],
    [/(?:identyfikator\s+kategorii\s+|ID\s+kategorii\s+)?\bcategory_id\b/gi, 'identyfikator kategorii'],
    [/(?:identyfikator\s+wypożyczenia\s+|ID\s+wypożyczenia\s+)?\brental_id\b/gi, 'identyfikator wypożyczenia'],
    [/(?:identyfikator\s+płatności\s+|ID\s+płatności\s+)?\bpayment_id\b/gi, 'identyfikator płatności'],
    [/(?:identyfikator\s+pracownika\s+|ID\s+pracownika\s+|ID\s+personelu\s+)?\bstaff_id\b/gi, 'identyfikator pracownika'],
    [/(?:identyfikator\s+sklepu\s+|ID\s+sklepu\s+|ID\s+oddziału\s+|oddział\s+)?\bstore_id\b/gi, 'identyfikator oddziału'],
    [/(?:imię\s+)?\bfirst_name\b/gi, 'imię'],
    [/(?:nazwisko\s+)?\blast_name\b/gi, 'nazwisko'],
    [/(?:adres\s+e-mail\s+|e-mail\s+|email\s+)?\bemail\b/gi, 'adres e-mail'],
    [/(?:status\s+aktywności\s+)?\bactive\b/gi, 'status aktywności'],
    [/(?:dat[ęa]\s+utworzenia\s+konta\s+|dat[ęa]\s+rejestracji\s+)?\bcreate_date\b/gi, 'datę rejestracji klienta'],
    [/(?:dat[ęa]\s+wypożyczenia\s+)?\brental_date\b/gi, 'datę wypożyczenia'],
    [/(?:dat[ęa]\s+zwrotu\s+)?\breturn_date\b/gi, 'datę zwrotu'],
    [/(?:kwot[ęa]\s+płatności\s+|kwot[ęa]\s+)?\bamount\b/gi, 'kwotę płatności'],
    [/(?:dat[ęa]\s+płatności\s+)?\bpayment_date\b/gi, 'datę płatności'],
    [/(?:miasto\s+)?\bcity\b/gi, 'miasto'],
    [/(?:nazw[ęa]\s+kategorii\s+|nazw[ęa]\s+)?\bname\b/gi, 'nazwę']
  ];
  for (var ci = 0; ci < colBusinessMap.length; ci++) {
    s = s.replace(colBusinessMap[ci][0], colBusinessMap[ci][1]);
  }

  // 6. Uporządkowanie zdań o sortowaniu na końcu, aby nie zawierały technicznych nazw ani podkreślników
  s = s.replace(/Posortuj\s+wynik[i]?\s+(?:malejąco|rosnąco)\s+po\s+[^.]+?\./gi, function(m) {
    return /malejąco/i.test(m) ? 'Wynik posortuj malejąco.' : 'Wynik posortuj rosnąco.';
  });
  s = s.replace(/Posortuj\s+(?:od\s+najwyższej\s+[^.]+|od\s+największej\s+[^.]+|malejąco\s+po\s+[^.]+|po\s+[^.]+\s+malejąco)\./gi, 'Wynik posortuj od najwyższej wartości.');
  s = s.replace(/Posortuj\s+(?:od\s+najniższej\s+[^.]+|rosnąco\s+po\s+[^.]+|po\s+[^.]+\s+rosnąco)\./gi, 'Wynik posortuj rosnąco.');
  s = s.replace(/Posortuj\s+po\s+[a-zA-Z_]\w*(?:\s*,\s*[a-zA-Z_]\w*)*\./gi, 'Wynik posortuj zgodnie ze specyfikacją.');

  // 7. Ostateczne oczyszczenie pozostałych identyfikatorów z podkreślnikiem (np. total_spent, q1_rev -> odpowiedniego pola)
  s = s.replace(/\b[a-zA-Z0-9]+_[a-zA-Z0-9_]+\b/g, 'odpowiedniego pola');

  // Kosmetyka spacji i wielkiej litery na początku
  s = s.replace(/\s{2,}/g, ' ').replace(/\s+([,.;:?!])/g, '$1').trim();
  if (s.length > 0) {
    s = s.charAt(0).toUpperCase() + s.slice(1);
  }
  return s;
}

function buildQuerySkeleton(solSql) {
  if (!solSql) return 'SELECT ___ FROM ___;';
  var s = formatSqlPretty(solSql);
  s = s.replace(/'(?:[^']|'')*'/g, "'___'");
  s = s.replace(/\b\d+(?:\.\d+)?\b/g, '___');
  s = s.replace(/\bAS\s+[a-zA-Z_]\w*/gi, 'AS ___');

  var reservedWords = new Set([
    'SELECT', 'FROM', 'WHERE', 'JOIN', 'INNER', 'LEFT', 'RIGHT', 'FULL', 'CROSS', 'ON',
    'GROUP', 'BY', 'HAVING', 'ORDER', 'LIMIT', 'OFFSET', 'AS', 'AND', 'OR', 'NOT', 'IN',
    'BETWEEN', 'LIKE', 'ILIKE', 'IS', 'NULL', 'DISTINCT', 'CASE', 'WHEN', 'THEN', 'ELSE',
    'END', 'ASC', 'DESC', 'WITH', 'OVER', 'PARTITION', 'FILTER', 'EXISTS', 'UNION', 'ALL',
    'ROUND', 'COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'COALESCE', 'NULLIF', 'DATE_TRUNC', 'CAST',
    'EXTRACT', 'TO_CHAR', 'ROW_NUMBER', 'RANK', 'DENSE_RANK', 'LAG', 'LEAD', 'GENERATE_SERIES',
    'LOWER', 'UPPER', 'TRIM', 'LENGTH', 'INTERVAL'
  ]);

  var lines = s.split('\n');
  var outLines = [];
  var inSelect = false;
  for (var li = 0; li < lines.length; li++) {
    var line = lines[li];
    if (/^\s*SELECT\b/i.test(line)) inSelect = true;
    if (/^\s*(FROM|WHERE|GROUP\s+BY|HAVING|ORDER\s+BY|LIMIT)\b/i.test(line)) inSelect = false;

    if (inSelect) {
      line = line.replace(/([a-zA-Z_]\w*(?:\.[a-zA-Z_]\w*)?)/g, function(token) {
        var u = token.toUpperCase();
        if (reservedWords.has(u)) return token;
        return '___';
      });
      line = line.replace(/___\s*\(___\)/g, '___');
      line = line.replace(/___\s*\.\s*___/g, '___');
    } else if (/^\s*(?:WHERE|AND|OR)\b/i.test(line)) {
      line = line.replace(/([a-zA-Z_]\w*(?:\.[a-zA-Z_]\w*)?)/g, function(token) {
        var u = token.toUpperCase();
        if (reservedWords.has(u)) return token;
        return '___';
      });
    } else if (/^\s*(?:GROUP\s+BY|ORDER\s+BY)\b/i.test(line)) {
      line = line.replace(/(GROUP\s+BY|ORDER\s+BY)\s+.*$/i, function(_, kw) {
        return kw + ' ___';
      });
    }
    outLines.push(line);
  }
  return outLines.join('\n');
}

function buildCalcPillText(expr) {
  var e = String(expr || '').trim();
  if (e.toUpperCase() === 'COUNT(*)') return '🧮 zliczanie wierszy';
  var cols = extractExprSourceCols(e);
  if (cols.length > 0) return '🧮 z: ' + cols.join(', ');
  return '🧮 wyliczenie';
}

function buildDataLemurSpec(item, parentTask) {
  var sol = item.sol || '';
  var fallbackTbls = item.tables || (parentTask && parentTask.tables) || [];
  var details = parseSqlDetails(sol, fallbackTbls);

  var polecenie = buildCleanPolecenie(item, details);
  var assumptions = [];

  var tblLabel = details.tables.length > 0 ? details.tables.map(esc).join(', ') : 'brak';
  var sortChipHtml = details.orderBy
    ? '<span class="req-meta-chip">↕️ Sortowanie: <b>ORDER BY ' + esc(details.orderBy) + '</b></span>'
    : '<span class="req-meta-chip">↕️ Kolejność dowolna</span>';

  var extraChips = '';
  if (details.limit) {
    extraChips += ' <span class="req-meta-chip">✂️ Limit: <b>LIMIT ' + esc(details.limit) + '</b></span>';
  }
  if (details.roundDigits !== null) {
    extraChips += ' <span class="req-meta-chip">🔢 Zaokrąglij: <b>' + esc(details.roundDigits) + ' msc. (ROUND)</b></span>';
  }
  if (details.hasDistinct && !/COUNT\s*\(\s*DISTINCT/i.test(sol)) {
    extraChips += ' <span class="req-meta-chip">✨ Unikalne: <b>SELECT DISTINCT</b></span>';
  }

  var metaStripHtml = '<div class="req-meta-strip">' +
    '<span class="req-meta-chip">🗄️ Tabela: <b>' + tblLabel + '</b></span> ' +
    sortChipHtml +
    extraChips +
  '</div>';

  var colsPipelineHtml = '';
  var hasAnyAlias = false;
  if (details.cols.length > 0) {
    hasAnyAlias = details.cols.some(function(c) { return c.hasAlias; });
    colsPipelineHtml = '<div class="req-cols-hdr">' +
        '<span class="req-cols-title">📋 Wymagane kolumny wyniku:</span>' +
        '<span class="req-cols-caption">(👆 Dotknij kolumnę, aby wstawić ją do edytora)</span>' +
      '</div>' +
      '<div class="req-cols-pipeline">' +
      details.cols.map(function(c, idx) {
        var num = idx + 1;
        if (c.name === '*') {
          return '<button type="button" class="req-col-pill" onclick="insertAtCursor(\'*\')">' +
            '<span class="req-col-idx">' + num + '</span><code>*</code><span class="req-calc-pill">wszystkie kolumny</span>' +
          '</button>';
        }
        if (!c.hasAlias) {
          var safeCol = String(c.name || '').replace(/'/g, "\\'");
          return '<button type="button" class="req-col-pill" onclick="insertAtCursor(\'' + esc(safeCol) + '\')">' +
            '<span class="req-col-idx">' + num + '</span><code>' + esc(c.name) + '</code>' +
          '</button>';
        }
        var safeAlias = ('AS ' + String(c.name || '')).replace(/'/g, "\\'");
        var calcLbl = buildCalcPillText(c.expr);
        return '<button type="button" class="req-col-pill req-col-pill-alias" onclick="insertAtCursor(\'' + esc(safeAlias) + '\')">' +
          '<span class="req-col-idx">' + num + '</span>' +
          '<span class="req-calc-pill">' + esc(calcLbl) + '</span>' +
          '<span class="sql-as-badge">AS</span>' +
          '<code>' + esc(c.name) + '</code>' +
        '</button>';
      }).join('') +
      '</div>';

    if (hasAnyAlias) {
      colsPipelineHtml += '<div class="mini-syntax-tip-wrap">' +
        '<button type="button" class="mini-syntax-tip-btn" data-act="toggleSyntaxTip">💡 Pokaż ogólną wskazówkę składni AS</button>' +
        '__SYNTAX_TIP_BODY__' +
      '</div>';
    }
  }

  var reqStripHtml = metaStripHtml + colsPipelineHtml;
  assumptions.push(reqStripHtml);

  var usedClauses = [];
  if (details.hasCte) usedClauses.push('WITH ... AS (...)');
  usedClauses.push(details.hasDistinct ? 'SELECT DISTINCT' : 'SELECT');
  usedClauses.push('FROM');
  if (details.hasJoin) usedClauses.push(details.hasLeftJoin ? 'LEFT JOIN ... ON' : 'JOIN ... ON');
  if (details.hasWhere) usedClauses.push('WHERE');
  if (details.hasGroupBy) usedClauses.push('GROUP BY');
  if (details.hasHaving) usedClauses.push('HAVING');
  if (details.hasWindow) usedClauses.push('OVER (...)');
  if (details.orderBy) usedClauses.push('ORDER BY');
  if (details.limit) usedClauses.push('LIMIT');

  // Krok 1: Kierunek bez kodu
  var tblListStr = details.tables.length ? details.tables.map(function(t) { return '<code>' + t + '</code>'; }).join(', ') : 'wskazana w zadaniu';
  var step1Html = '<p style="margin:0 0 6px"><strong>🧭 Tabela źródłowa:</strong> ' + tblListStr + '</p>' +
    '<p style="margin:0 0 6px"><strong>📌 Potrzebne klauzule:</strong> ' + usedClauses.map(function(c){ return '<code>' + c + '</code>'; }).join(' → ') + '</p>' +
    '<p class="small muted" style="margin:0">Zacznij od wskazania tabeli w <code>FROM</code>, a następnie wypisz wymagane kolumny w <code>SELECT</code>.</p>';

  // Krok 2: Szkielet z lukami
  var skeletonSql = buildQuerySkeleton(sol);
  var step2Html = '<div class="theory-code" style="margin:4px 0 6px;font-size:13px"><code>' + highlightSQL(skeletonSql) + '</code></div>' +
    '<p class="small muted" style="margin:0">🧩 Uzupełnij luki <code>___</code> odpowiednimi kolumnami i warunkami w edytorze powyżej.</p>';

  // Krok 3: Wzorcowy kod z wyjaśnieniem
  var explanation = item.gapHint || (item.newFeature ? item.newFeature.desc : 'Wzorcowe zapytanie realizuje wszystkie wymagania specyfikacji.');
  var step3Html = '<div class="theory-code" style="margin:4px 0 6px;font-size:13px"><code>' + highlightSQL(formatSqlPretty(sol)) + '</code></div>' +
    '<p class="small" style="margin:4px 0 0;line-height:1.5"><strong>💡 Dlaczego tak:</strong> ' + esc(explanation) + '</p>';

  return {
    polecenie: polecenie,
    reqStripHtml: reqStripHtml,
    assumptions: assumptions,
    hints: [step1Html, step2Html, step3Html]
  };
}
window.buildDataLemurSpec = buildDataLemurSpec;
window.buildCleanPolecenie = buildCleanPolecenie;
window.buildQuerySkeleton = buildQuerySkeleton;
window.getHintButtonLabel = getHintButtonLabel;
window.renderOnboardingModal = renderOnboardingModal;
window.state = state;
window.uiState = uiState;

// Renderuje zunifikowaną specyfikację zadania (📌 Polecenie + Wizualny Pasek Wymagań)
function renderTaskSpecBox(item, parentTask, teachFirstHtml) {
  if (!item) return '';
  if (!item._v12SpecDone) {
    var spec = buildDataLemurSpec(item, parentTask || null);
    item.polecenie = spec.polecenie;
    item.reqStripHtml = spec.reqStripHtml;
    item.assumptions = spec.assumptions;
    item.hints = spec.hints;
    item._v12SpecDone = true;
  }
  var polecenieTxt = item.polecenie || item.prompt || '';
  var rawReqStrip = item.reqStripHtml || (Array.isArray(item.assumptions) ? item.assumptions.join('') : '');

  var tipBodyHtml = uiState.syntaxTipOpen
    ? '<div class="dl-alias-tip" style="margin-top:6px">💡 <strong>Ogólna wskazówka składni:</strong> Aby nadać kolumnie lub obliczeniu nową nazwę w wyniku, użyj zapisu <code>' + highlightSQL('SELECT cena * 100 AS grosze FROM produkty;') + '</code>.</div>'
    : '';

  var reqHtml = rawReqStrip
    ? '<div class="dl-assumptions-box req-strip-box">' +
        String(rawReqStrip).replace('__SYNTAX_TIP_BODY__', tipBodyHtml) +
      '</div>'
    : '';

  return '<div class="dl-spec-wrap">' +
    '<div class="dl-prompt-box">' +
      '<div class="dl-sec-hdr">📌 Polecenie:</div>' +
      '<div class="dl-prompt-body">' + formatPrompt(polecenieTxt) + '</div>' +
    '</div>' +
    (teachFirstHtml || '') +
    reqHtml +
  '</div>';
}

function renderHintStepperBox(item, parentTask) {
  if (!item || !uiState.hintStep || uiState.hintStep < 1) return '';
  if (!item.hints || !item._v12SpecDone) {
    var spec = buildDataLemurSpec(item, parentTask || null);
    item.polecenie = spec.polecenie;
    item.assumptions = spec.assumptions;
    item.hints = spec.hints;
    item._v12SpecDone = true;
  }
  var hints = Array.isArray(item.hints) ? item.hints : [item.hint || 'Sprawdź wymagane kolumny i warunki filtrowania.'];
  var maxStep = Math.min(hints.length, uiState.hintStep);
  var stepTitles = [
    'Krok 1/3 · 🧭 Kierunek (jak podejść do problemu)',
    'Krok 2/3 · 🧩 Szkielet z lukami (do uzupełnienia)',
    'Krok 3/3 · 💡 Wzorcowy kod z wyjaśnieniem'
  ];

  var cardsHtml = '';
  for (var i = 0; i < maxStep; i++) {
    cardsHtml += '<div class="hint-step-item' + (i === 2 ? ' trap-step' : '') + '">' +
      '<div class="hint-step-hdr">' + esc(stepTitles[i] || ('Krok ' + (i + 1))) + '</div>' +
      '<div class="hint-step-body">' + hints[i] + '</div>' +
    '</div>';
  }

  return '<div class="hint-stepper-box">' + cardsHtml + '</div>';
}

function getHintButtonLabel() {
  var st = uiState.hintStep || 0;
  if (st === 0) return '💡 Podpowiedź 1 (Kierunek)';
  if (st === 1) return '💡 Podpowiedź 2 (Szkielet z lukami)';
  if (st === 2) return '💡 Podpowiedź 3 (Wzorcowy kod)';
  return '💡 Ukryj podpowiedzi (3/3)';
}

// 8-liniowa ściąga krok po kroku (kolejność pisania zapytania SQL) z podświetleniem klauzul użytych w zadaniu
var ALL_CHEAT_CLAUSES = [
  {
    kw: 'SELECT',
    check: function(s) { return true; },
    insert: 'SELECT ',
    syntax: 'SELECT kol1, kol2',
    desc: 'wybiera kolumny do wyświetlenia w wyniku'
  },
  {
    kw: 'AS',
    check: function(s) { return /\bAS\b/i.test(s); },
    insert: ' AS ',
    syntax: 'kolumna AS nowa_nazwa',
    desc: 'nadaje kolumnie nową, czytelną nazwę w wyniku raportu'
  },
  {
    kw: 'DISTINCT',
    check: function(s) { return /\bDISTINCT\b/i.test(s); },
    insert: 'DISTINCT ',
    syntax: 'SELECT DISTINCT kolumna',
    desc: 'usuwa duplikaty i zwraca unikalne wartości'
  },
  {
    kw: 'FROM',
    check: function(s) { return /\bFROM\b/i.test(s); },
    insert: '\nFROM ',
    syntax: 'FROM tabela',
    desc: 'wskazuje główną tabelę źródłową'
  },
  {
    kw: 'LEFT JOIN',
    check: function(s) { return /\bLEFT\s+(?:OUTER\s+)?JOIN\b/i.test(s); },
    insert: '\nLEFT JOIN ',
    syntax: 'LEFT JOIN tabela2 t2 ON t1.id = t2.id',
    desc: 'dołącza rekordy z prawej tabeli bez utraty wierszy z lewej'
  },
  {
    kw: 'JOIN ... ON',
    check: function(s) { return /\bJOIN\b/i.test(s) && !/\bLEFT\s+(?:OUTER\s+)?JOIN\b/i.test(s); },
    insert: '\nJOIN ',
    syntax: 'JOIN tabela2 t2 ON t1.id = t2.id',
    desc: 'łączy tabele po wspólnym kluczu'
  },
  {
    kw: 'WHERE',
    check: function(s) { return /\bWHERE\b/i.test(s); },
    insert: '\nWHERE ',
    syntax: "WHERE rating = 'PG-13'",
    desc: 'sito odrzucające pojedyncze wiersze niespełniające warunku'
  },
  {
    kw: 'GROUP BY',
    check: function(s) { return /\bGROUP\s+BY\b/i.test(s); },
    insert: '\nGROUP BY ',
    syntax: 'GROUP BY kolumna',
    desc: 'grupuje wiersze do podliczenia SUM/COUNT/AVG'
  },
  {
    kw: 'HAVING',
    check: function(s) { return /\bHAVING\b/i.test(s); },
    insert: '\nHAVING ',
    syntax: 'HAVING COUNT(*) > 5',
    desc: 'filtruje całe grupy po podliczeniu agregatów'
  },
  {
    kw: 'ORDER BY',
    check: function(s) { return /\bORDER\s+BY\b/i.test(s); },
    insert: '\nORDER BY ',
    syntax: 'ORDER BY kolumna DESC',
    desc: 'sortuje gotowy wynik (rosnąco ASC lub malejąco DESC)'
  },
  {
    kw: 'LIMIT',
    check: function(s) { return /\bLIMIT\b/i.test(s); },
    insert: '\nLIMIT ',
    syntax: 'LIMIT 10;',
    desc: 'odcina wynik do pierwszych N wierszy'
  }
];

function buildNeutralTeachExample(nf, solSql) {
  var title = String((nf && nf.title) || '');
  var ex = String((nf && nf.example) || '');
  var combined = title + ' ' + ex + ' ' + String(solSql || '');
  if (/\bDENSE_RANK\b/i.test(combined)) return 'SELECT nazwa, DENSE_RANK() OVER (ORDER BY punkty DESC) AS miejsce FROM gracze;';
  if (/\bROW_NUMBER\b/i.test(combined)) return 'SELECT nazwa, ROW_NUMBER() OVER (PARTITION BY kategoria ORDER BY cena DESC) AS nr FROM produkty;';
  if (/\bLAG\b|\bLEAD\b/i.test(combined)) return 'SELECT dzien, przychod, LAG(przychod) OVER (ORDER BY dzien) AS poprzedni_dzien FROM sprzedaz;';
  if (/\bOVER\s*\(/i.test(combined)) return 'SELECT dzial, pensja, ROUND(AVG(pensja) OVER (PARTITION BY dzial), 2) AS srednia_dzialu FROM kadry;';
  if (/\bWITH\b/i.test(combined)) return 'WITH podsumowanie AS (\n  SELECT klient_id, SUM(kwota) AS suma FROM zamowienia GROUP BY klient_id\n)\nSELECT * FROM podsumowanie WHERE suma > 100;';
  if (/\bFILTER\s*\(\s*WHERE\b/i.test(combined)) return "SELECT COUNT(*) FILTER (WHERE status = 'oplacone') AS oplacone_cnt FROM faktury;";
  if (/\bCASE\s+WHEN\b/i.test(combined)) return "SELECT cena, CASE WHEN cena >= 50 THEN 'wysoka' ELSE 'standardowa' END AS segment FROM produkty;";
  if (/\bCOALESCE\b/i.test(combined)) return "SELECT id, COALESCE(telefon, 'brak numeru') AS kontakt FROM klienci;";
  if (/\bNULLIF\b/i.test(combined)) return 'SELECT przychod / NULLIF(liczba_sztuk, 0) AS srednia_cena FROM raport;';
  if (/\bLEFT\s+(?:OUTER\s+)?JOIN\b/i.test(combined)) return 'SELECT k.nazwa, z.id AS zamowienie_id FROM klienci k LEFT JOIN zamowienia z ON k.id = z.klient_id;';
  if (/\bJOIN\b/i.test(combined)) return 'SELECT p.nazwa, k.nazwa_kategorii FROM produkty p JOIN kategorie k ON p.kategoria_id = k.id;';
  if (/\bHAVING\b/i.test(combined)) return 'SELECT kategoria, COUNT(*) AS liczba FROM produkty GROUP BY kategoria HAVING COUNT(*) > 5;';
  if (/\bGROUP\s+BY\b/i.test(combined)) return 'SELECT kategoria, COUNT(*) AS liczba FROM produkty GROUP BY kategoria;';
  if (/\bROUND\b/i.test(combined)) return 'SELECT nazwa, ROUND(cena * 0.85, 2) AS cena_po_rabacie FROM produkty;';
  if (/\bCOUNT\s*\(\s*DISTINCT\b/i.test(combined)) return 'SELECT COUNT(DISTINCT kategoria) AS unikalne_kategorie FROM produkty;';
  if (/\bDISTINCT\b/i.test(combined)) return 'SELECT DISTINCT miasto FROM oddzialy;';
  if (/\bILIKE\b|\bLIKE\b/i.test(combined)) return "SELECT nazwa FROM produkty WHERE nazwa ILIKE 'pro%';";
  if (/\bBETWEEN\b/i.test(combined)) return 'SELECT nazwa, cena FROM produkty WHERE cena BETWEEN 10 AND 50;';
  if (/\bIN\s*\(/i.test(combined)) return "SELECT nazwa, kategoria FROM produkty WHERE kategoria IN ('A', 'B');";
  if (/\bIS\s+(?:NOT\s+)?NULL\b/i.test(combined)) return 'SELECT id, data_wysylki FROM paczki WHERE data_wysylki IS NULL;';
  if (/\bORDER\s+BY\b/i.test(combined)) return 'SELECT nazwa, cena FROM produkty ORDER BY cena DESC LIMIT 5;';
  if (/\bWHERE\b/i.test(combined)) return 'SELECT nazwa, cena FROM produkty WHERE cena > 20;';
  if (/[*+\/-]/.test(combined) || /\bAS\b/i.test(combined)) return 'SELECT cena * 100 AS grosze FROM produkty;';
  return 'SELECT kolumna1, kolumna2 FROM przykladowa_tabela;';
}

function renderTeachFirstBox(newFeature, task, variant) {
  var nf = newFeature;
  var sol = String((variant && variant.sol) || '');
  // Dla AS w 1.1/1.2 dopilnuj prostego i czytelnego wyjaśnienia na neutralnym przykładzie (bez zdradzania kolumn zadania)
  if (task && (task.id === 'p1_1' || task.id === 'p1_2') && /\bAS\b/i.test(sol)) {
    if (!nf || /\bAS\b/i.test(nf.title)) {
      nf = {
        title: (nf && nf.title) ? nf.title : 'Zmiana nazwy kolumny: AS (alias)',
        desc: 'Słowo kluczowe AS nadaje kolumnie lub obliczeniu nową, czytelną nazwę w nagłówku wyniku raportu (np. cena * 100 AS grosze).',
        example: 'SELECT cena * 100 AS grosze FROM produkty;'
      };
    }
  }
  if (!nf) return '';
  var safeDesc = String(nf.desc || '')
    .replace(/replacement_cost\s*-\s*rental_rate/gi, 'cena_brutto - rabat')
    .replace(/rental_rate\s*\*\s*\d+/gi, 'cena * 100')
    .replace(/amount\s*\*\s*\d+/gi, 'cena * 100')
    .replace(/length\s+AS\s+duration_min/gi, 'cena * 100 AS grosze');
  var neutralExample = buildNeutralTeachExample(nf, sol);
  return '<details class="teach-first-box teach-first-pill">' +
    '<summary class="teach-first-hdr">🆕 Nowy element: <strong>' + esc(nf.title) + '</strong> <span class="teach-first-more">(rozwiń przykład ▾)</span></summary>' +
    '<div class="teach-first-body">' +
      '<p class="teach-first-desc">' + formatPrompt(safeDesc) + '</p>' +
      (neutralExample ? '<div class="teach-first-code"><code>' + highlightSQL(neutralExample) + '</code></div>' : '') +
    '</div>' +
  '</details>';
}

function renderZeroScrollTaskCard(item, parentTask, mode) {
  if (!item) return '';
  var activeTab = uiState.taskCtxTab || 'task';
  var tblNames = item.tables || (parentTask && parentTask.tables) || [];
  var colCount = getTaskSchemaColCount(tblNames, item.sol);

  var tabsBarHtml = '<div class="ctx-tabs-bar" role="tablist">' +
    '<button type="button" class="ctx-tab-btn' + (activeTab === 'task' ? ' active' : '') + '" data-act="setCtxTab" data-ctx="task">📌 Zadanie</button>' +
    '<button type="button" class="ctx-tab-btn' + (activeTab === 'table' ? ' active' : '') + '" data-act="setCtxTab" data-ctx="table">📊 Tabela (' + colCount + ')</button>' +
    '<button type="button" class="ctx-tab-btn' + (activeTab === 'help' ? ' active' : '') + '" data-act="setCtxTab" data-ctx="help">🎯 Wzór i pomoc</button>' +
  '</div>';

  var bodyHtml = '';
  if (activeTab === 'table') {
    bodyHtml = renderTaskTablesInline(tblNames, item.sol);
  } else if (activeTab === 'help') {
    var helpBtnsHtml = '';
    if (mode === 'path') {
      helpBtnsHtml = '<div class="acts ctx-help-acts">' +
        '<button type="button" class="btn sm warn" data-act="stepHint">' + esc(getHintButtonLabel()) + '</button>' +
        '<button type="button" class="btn sm" data-act="showSolution">💡 Pokaż wzorcowy kod</button>' +
        '<button type="button" class="btn sm" data-act="aiHint">🤖 Podpowiedź AI</button>' +
      '</div>';
    } else if (mode === 'diag') {
      helpBtnsHtml = '<div class="acts ctx-help-acts">' +
        '<button type="button" class="btn sm warn" data-act="stepHint">' + esc(getHintButtonLabel()) + '</button>' +
        '<button type="button" class="btn sm warn" data-act="skipDiag">⏭ Pomiń zadanie</button>' +
        '<button type="button" class="btn sm" data-act="resetDiag">Restart</button>' +
      '</div>';
    } else if (mode === 'lemur') {
      helpBtnsHtml = '<div class="acts ctx-help-acts">' +
        '<button type="button" class="btn sm warn" data-act="stepHint">' + esc(getHintButtonLabel()) + '</button>' +
        '<button type="button" class="btn sm" data-act="lemurTrapHint">🛡️ Jaka tu jest pułapka?</button>' +
        '<button type="button" class="btn sm" data-act="showLemurSol">💡 Pokaż wzorcowe rozwiązanie</button>' +
      '</div>';
    }
    bodyHtml = renderExampleOutputInline(item.sol) +
      helpBtnsHtml +
      renderHintStepperBox(item, parentTask) +
      renderStepByStepCheatSheet(item.sol, parentTask ? parentTask.theory : '', true, parentTask);
  } else {
    var teachHtml = (mode === 'path') ? renderTeachFirstBox(item.newFeature, parentTask, item) : '';
    bodyHtml = renderTaskSpecBox(item, parentTask, teachHtml);
  }

  return '<div class="ctx-card">' +
    tabsBarHtml +
    '<div class="ctx-tab-body">' + bodyHtml + '</div>' +
  '</div>';
}

function renderStepByStepCheatSheet(solSql, lessonTheoryHtml, openByDefault, task) {
  var s = String(solSql || '');
  var usedClauses = [];

  if (task && task.id === 'p1_1') {
    usedClauses = [
      {
        kw: 'SELECT',
        insert: 'SELECT ',
        syntax: 'SELECT kolumna1, kolumna2',
        desc: 'służy do wyciągania kolumn z bazy danych.'
      },
      {
        kw: 'FROM',
        insert: '\nFROM ',
        syntax: 'FROM nazwa_tabeli',
        desc: 'wskazuje tabelę, z której pobieramy dane.'
      }
    ];
  } else if (task && task.id === 'p1_2') {
    usedClauses = [
      {
        kw: 'SELECT',
        insert: 'SELECT ',
        syntax: 'SELECT kolumna1, kolumna2',
        desc: 'wybiera kolumny oraz wykonuje obliczenia (+, -, *, /).'
      },
      {
        kw: 'AS',
        insert: ' AS ',
        syntax: 'length AS duration_min',
        desc: 'nadaje kolumnie nową, czytelną nazwę w wyniku raportu.'
      },
      {
        kw: 'FROM',
        insert: '\nFROM ',
        syntax: 'FROM film',
        desc: 'wskazuje tabelę źródłową z danymi.'
      }
    ];
  } else {
    var matched = ALL_CHEAT_CLAUSES.filter(function(row) {
      return row.check(s);
    });
    if (matched.length < 2) {
      matched = [ALL_CHEAT_CLAUSES[0], ALL_CHEAT_CLAUSES[3]];
    }
    if (matched.length > 4) {
      // Zachowaj maksymalnie 4 najważniejsze elementy składni dla bieżącego zadania
      var priority = matched.filter(function(r) { return r.kw !== 'SELECT' && r.kw !== 'FROM'; });
      usedClauses = [matched[0]].concat(priority.slice(-3));
    } else {
      usedClauses = matched;
    }
  }

  var isOpen = uiState.theoryBoxOpen !== null ? uiState.theoryBoxOpen : (openByDefault !== false);
  var rowsHtml = usedClauses.map(function(row, idx) {
    return '<div class="cheat-row used">' +
      '<span class="cheat-num">' + (idx + 1) + '.</span>' +
      '<button type="button" class="cheat-kw-btn active" data-insert-sql="' + esc(row.insert) + '" title="Kliknij, aby wstawić ' + esc(row.kw) + ' do edytora">' +
        highlightSQL(row.kw) +
      '</button>' +
      '<code class="cheat-syn">' + highlightSQL(row.syntax) + '</code>' +
      '<span class="cheat-desc">→ ' + esc(row.desc) + '</span>' +
    '</div>';
  }).join('');

  var extraLessonHtml = (lessonTheoryHtml && (!task || (task.id !== 'p1_1' && task.id !== 'p1_2')))
    ? '<div class="cheat-lesson-extra"><div class="small muted" style="margin-bottom:4px;font-weight:700">📌 Notatka do bieżącego działu:</div>' + highlightHtmlCodeBlocks(lessonTheoryHtml) + '</div>'
    : '';

  return '<details class="theory-box cheat-8-box"' + (isOpen ? ' open' : '') + '>' +
    '<summary>🧭 Kontekstowa ściąga składni (' + usedClauses.length + ' ' + (usedClauses.length === 1 ? 'element' : usedClauses.length < 5 ? 'elementy' : 'elementów') + ' — kliknij, by wstawić)</summary>' +
    '<div class="theory-body">' +
      '<div class="cheat-8-grid">' + rowsHtml + '</div>' +
      extraLessonHtml +
    '</div>' +
  '</details>';
}

function buildInterviewSpecBox(tableNames, solSql) {
  return buildTaskSchemaBox(tableNames, solSql);
}

function renderValidationChecklistHtml(chk) {
  if (!chk) return '';
  return '<div class="val-checklist">' +
    '<div class="val-hdr">🔍 Checklista walidacji wyniku (SQLBolt Style):</div>' +
    '<div class="val-grid">' +
      '<div class="val-item ' + (chk.colsOk ? 'ok' : 'bad') + '">' +
        '<strong>1) Kolumny:</strong> <span>' + esc(chk.colsMsg) + '</span>' +
      '</div>' +
      '<div class="val-item ' + (chk.rowsOk ? 'ok' : 'bad') + '">' +
        '<strong>2) Ziarno (liczba wierszy):</strong> <span>' + esc(chk.rowsMsg) + '</span>' +
      '</div>' +
      '<div class="val-item ' + (chk.valsOk ? 'ok' : 'bad') + '">' +
        '<strong>3) Wartości i kolejność:</strong> <span>' + esc(chk.valsMsg) + '</span>' +
      '</div>' +
    '</div>' +
  '</div>';
}

function renderQuickBar(task, variant) {
  var sol = String((variant && variant.sol) || '');
  var isP1_1 = task && task.id === 'p1_1';
  var buttons = [];

  function addBtn(label, sql, title, cls) {
    buttons.push({
      label: label,
      sql: sql,
      title: title || ('Wstaw ' + label),
      cls: 'quick-chip-btn' + (cls ? (' ' + cls) : '')
    });
  }

  // Słowa kluczowe
  addBtn('SELECT', 'SELECT ', 'Wstaw SELECT');
  if (isP1_1 || /\*/.test(sol)) addBtn('*', '*', 'Wstaw gwiazdkę *');
  addBtn(',', ', ', 'Wstaw przecinek');
  addBtn('FROM', '\nFROM ', 'Wstaw FROM');

  if (!isP1_1) {
    if (/\bAS\b/i.test(sol)) addBtn('AS', ' AS ', 'Wstaw AS', 'kw-as');
    if (/\bDISTINCT\b/i.test(sol)) addBtn('DISTINCT', 'DISTINCT ', 'Wstaw DISTINCT');
    if (/\bWHERE\b/i.test(sol)) addBtn('WHERE', '\nWHERE ', 'Wstaw WHERE');
    if (/\bAND\b/i.test(sol)) addBtn('AND', ' AND ', 'Wstaw AND');
    if (/\bOR\b/i.test(sol)) addBtn('OR', ' OR ', 'Wstaw OR');
    if (/\bIN\b/i.test(sol)) addBtn('IN (...)', ' IN ()', 'Wstaw IN');
    if (/\bBETWEEN\b/i.test(sol)) addBtn('BETWEEN', ' BETWEEN ', 'Wstaw BETWEEN');
    if (/\bILIKE\b/i.test(sol)) addBtn('ILIKE', " ILIKE '%%'", 'Wstaw ILIKE');
    if (/\bIS\s+NULL\b/i.test(sol)) addBtn('IS NULL', ' IS NULL', 'Wstaw IS NULL');
    if (/\bIS\s+NOT\s+NULL\b/i.test(sol)) addBtn('IS NOT NULL', ' IS NOT NULL', 'Wstaw IS NOT NULL');
    if (/=/.test(sol)) addBtn('=', ' = ', 'Wstaw =');
    if (/<[>=]?|>[=]?/.test(sol)) {
      if (/>=/.test(sol)) addBtn('>=', ' >= ', 'Wstaw >=');
      else if (/>/.test(sol)) addBtn('>', ' > ', 'Wstaw >');
      if (/<=/.test(sol)) addBtn('<=', ' <= ', 'Wstaw <=');
      else if (/<(?![>=])/.test(sol)) addBtn('<', ' < ', 'Wstaw <');
      if (/<>|!=/.test(sol)) addBtn('<>', ' <> ', 'Wstaw <>');
    }
    if (/\bGROUP\s+BY\b/i.test(sol)) addBtn('GROUP BY', '\nGROUP BY ', 'Wstaw GROUP BY');
    if (/\bHAVING\b/i.test(sol)) addBtn('HAVING', '\nHAVING ', 'Wstaw HAVING');
    if (/\bORDER\s+BY\b/i.test(sol)) {
      addBtn('ORDER BY', '\nORDER BY ', 'Wstaw ORDER BY');
      if (/\bASC\b/i.test(sol)) addBtn('ASC', ' ASC', 'Wstaw ASC');
      if (/\bDESC\b/i.test(sol)) addBtn('DESC', ' DESC', 'Wstaw DESC');
    }
    if (/\bLIMIT\b/i.test(sol)) addBtn('LIMIT', '\nLIMIT ', 'Wstaw LIMIT');
    if (/\bLEFT\s+(?:OUTER\s+)?JOIN\b/i.test(sol)) {
      addBtn('LEFT JOIN', '\nLEFT JOIN ', 'Wstaw LEFT JOIN');
      addBtn('ON', ' ON ', 'Wstaw ON');
    } else if (/\bJOIN\b/i.test(sol)) {
      addBtn('JOIN', '\nJOIN ', 'Wstaw JOIN');
      addBtn('ON', ' ON ', 'Wstaw ON');
    }
    if (/\bCOUNT\b/i.test(sol)) addBtn('COUNT(*)', 'COUNT(*)', 'Wstaw COUNT(*)');
    if (/\bSUM\b/i.test(sol)) addBtn('SUM()', 'SUM()', 'Wstaw SUM()');
    if (/\bAVG\b/i.test(sol)) addBtn('AVG()', 'AVG()', 'Wstaw AVG()');
    if (/\bMIN\b/i.test(sol)) addBtn('MIN()', 'MIN()', 'Wstaw MIN()');
    if (/\bMAX\b/i.test(sol)) addBtn('MAX()', 'MAX()', 'Wstaw MAX()');
    if (/\bROUND\b/i.test(sol)) addBtn('ROUND(, 2)', 'ROUND(, 2)', 'Wstaw ROUND');
    if (/\bCOALESCE\b/i.test(sol)) addBtn('COALESCE()', 'COALESCE()', 'Wstaw COALESCE');
    if (/\bCASE\b/i.test(sol)) addBtn('CASE WHEN', "CASE WHEN  THEN  ELSE  END", 'Wstaw CASE');
    if (/\bFILTER\b/i.test(sol)) addBtn('FILTER (WHERE)', "FILTER (WHERE )", 'Wstaw FILTER');
    if (/\bWITH\b/i.test(sol)) addBtn('WITH', "WITH  AS ()", 'Wstaw WITH');
    if (/\bOVER\b/i.test(sol)) addBtn('OVER ()', "OVER ()", 'Wstaw OVER');
    if (/\bROW_NUMBER\b/i.test(sol)) addBtn('ROW_NUMBER()', "ROW_NUMBER() OVER ()", 'Wstaw ROW_NUMBER');
    if (/\bDENSE_RANK\b/i.test(sol)) addBtn('DENSE_RANK()', "DENSE_RANK() OVER ()", 'Wstaw DENSE_RANK');
    if (/\bLAG\b/i.test(sol)) addBtn('LAG()', "LAG() OVER ()", 'Wstaw LAG');
  }

  // Tabele
  var tbls = resolveTaskTables(variant ? variant.tables : null, sol);
  if (!tbls.length && task && Array.isArray(task.tables)) tbls = task.tables.slice(0, 2);
  tbls.forEach(function(t) {
    addBtn('📦 ' + t, t, 'Wstaw tabelę ' + t, 'quick-tbl-chip');
  });

  // Kolumny z sol
  var parsed = parseSqlDetails(sol, tbls);
  (parsed.cols || []).forEach(function(c) {
    if (c.name && c.name !== '*') {
      addBtn(c.name, c.name, 'Wstaw kolumnę ' + c.name, 'quick-col-chip');
    }
  });

  return '<div class="sql-quick-bar-wrap">' +
    '<div class="quick-bar-label">' +
      '<span>⚡ <strong>Quick-Bar:</strong> kliknij, by wstawić do zapytania</span>' +
      '<div class="quick-bar-actions">' +
        '<button type="button" class="qb-act-btn" data-act="undoToken" title="Cofnij ostatnio wstawiony klocek lub słowo">⌫ Cofnij</button>' +
        '<button type="button" class="qb-act-btn qb-clear-btn" data-act="clearEd" title="Wyczyść całe zapytanie">🧹 Wyczyść</button>' +
      '</div>' +
    '</div>' +
    '<div class="sql-quick-bar">' +
      buttons.map(function(b) {
        return '<button type="button" class="' + b.cls + '" data-insert-sql="' + esc(b.sql) + '" title="' + esc(b.title) + '">' + esc(b.label) + '</button>';
      }).join('') +
    '</div>' +
  '</div>';
}

function tokenizeWarmupSql(solSql) {
  var s = String(solSql || '').trim().replace(/\s+/g, ' ');
  if (!s) return [];

  // 1. Podział na surowe tokeny z zachowaniem tekstów '...' oraz nawiasów funkcji (...) bez podzapytań SELECT
  var raw = [];
  var cur = '';
  var inStr = false;
  var depth = 0;
  for (var i = 0; i < s.length; i++) {
    var ch = s[i];
    if (ch === "'" && s[i - 1] !== '\\') {
      inStr = !inStr;
      cur += ch;
      continue;
    }
    if (!inStr) {
      if (ch === '(') {
        // Sprawdź czy ten nawias otwiera podzapytanie lub definicję CTE
        var rest = s.slice(i + 1).trim();
        if (/^SELECT\b/i.test(rest)) {
          cur += ch;
          if (cur.trim()) raw.push(cur.trim());
          cur = '';
          continue;
        }
        depth++;
        cur += ch;
        continue;
      }
      if (ch === ')') {
        if (depth > 0) {
          depth--;
          cur += ch;
          continue;
        }
      }
      if (ch === ' ' && depth === 0) {
        if (cur.trim()) raw.push(cur.trim());
        cur = '';
        continue;
      }
    }
    cur += ch;
  }
  if (cur.trim()) raw.push(cur.trim());

  // 2. Łączenie wieloczłonowych klauzul i wyrażeń w logiczne klocki SQL
  var merged = [];
  var k = 0;
  while (k < raw.length) {
    var t0 = raw[k];
    var t1 = raw[k + 1] || '';
    var t2 = raw[k + 2] || '';
    var u0 = t0.toUpperCase();
    var u1 = t1.toUpperCase();
    var u2 = t2.toUpperCase();

    if ((u0 === 'ORDER' || u0 === 'GROUP' || u0 === 'PARTITION') && u1 === 'BY') {
      merged.push(t0 + ' ' + t1);
      k += 2;
    } else if ((u0 === 'LEFT' || u0 === 'INNER' || u0 === 'RIGHT' || u0 === 'FULL') && u1 === 'JOIN') {
      merged.push(t0 + ' ' + t1);
      k += 2;
    } else if (u0 === 'IS' && u1 === 'NOT' && /^NULL[;,]?$/i.test(u2)) {
      merged.push(t0 + ' ' + t1 + ' ' + t2);
      k += 3;
    } else if (u0 === 'IS' && /^NULL[;,]?$/i.test(u1)) {
      merged.push(t0 + ' ' + t1);
      k += 2;
    } else if ((u1 === 'OVER' || u1 === 'FILTER') && t2.charAt(0) === '(') {
      merged.push(t0 + ' ' + t1 + ' ' + t2);
      k += 3;
    } else if (/^(?:=|>|<|>=|<=|<>|!=|\+|-|\*|\/|ILIKE|LIKE)$/i.test(u1) && t2 && !/^(?:SELECT|FROM|WHERE|GROUP|ORDER|HAVING|LIMIT|AND|OR)$/i.test(u0)) {
      merged.push(t0 + ' ' + t1 + ' ' + t2);
      k += 3;
    } else if (/^(?:ASC|DESC)[;,]?$/i.test(u1) && !/^(?:SELECT|FROM|WHERE|BY)$/i.test(u0)) {
      merged.push(t0 + ' ' + t1);
      k += 2;
    } else {
      merged.push(t0);
      k += 1;
    }
  }
  return merged;
}

function buildWarmupPuzzlePool(task, variant, vIdx) {
  var sol = String((variant && variant.sol) || '').trim();
  var coreBlocks = tokenizeWarmupSql(sol);
  var items = coreBlocks.map(function(txt, idx) {
    return { id: 'core_' + idx, sql: txt, isDistractor: false };
  });

  // Dodaj 2 klocki-zmyłki: 1 nieużywaną kolumnę z tabeli + 1 nieużywane słowo kluczowe
  var tbls = resolveTaskTables(variant ? variant.tables : null, sol);
  if (!tbls.length && task && Array.isArray(task.tables)) tbls = task.tables.slice(0, 1);
  var mainTbl = tbls[0] || 'film';
  var meta = ALL_SCHEMA_META.find(function(m) { return m.table === mainTbl; });
  var solLower = sol.toLowerCase();

  var distractorCol = 'last_update';
  if (meta && Array.isArray(meta.cols)) {
    for (var ci = 0; ci < meta.cols.length; ci++) {
      var cName = typeof meta.cols[ci] === 'string' ? meta.cols[ci] : meta.cols[ci].name;
      if (cName && solLower.indexOf(cName.toLowerCase()) === -1) {
        distractorCol = cName;
        break;
      }
    }
  }
  items.push({ id: 'dist_col', sql: distractorCol, isDistractor: true });

  var candidateKws = ['HAVING', 'LIMIT 5', 'DISTINCT', 'GROUP BY', 'ORDER BY', 'WHERE'];
  var distractorKw = 'HAVING';
  for (var ki = 0; ki < candidateKws.length; ki++) {
    var kw = candidateKws[ki].split(' ')[0];
    if (!new RegExp('\\b' + kw + '\\b', 'i').test(sol)) {
      distractorKw = candidateKws[ki];
      break;
    }
  }
  items.push({ id: 'dist_kw', sql: distractorKw, isDistractor: true });

  // Deterministyczne przetasowanie dla danego zadania/wariantu (aby klocki nie skakały po ekranie podczas klikania)
  var seedStr = (task ? task.id : 't') + '_' + (vIdx || 0) + '_' + sol.length;
  var seed = 0;
  for (var si = 0; si < seedStr.length; si++) {
    seed = ((seed << 5) - seed + seedStr.charCodeAt(si)) | 0;
  }
  var shuffled = items.slice();
  for (var i = shuffled.length - 1; i > 0; i--) {
    seed = (seed * 1664525 + 1013904223) | 0;
    var j = Math.abs(seed) % (i + 1);
    var tmp = shuffled[i];
    shuffled[i] = shuffled[j];
    shuffled[j] = tmp;
  }
  // Upewnij się, że pierwszy klocek po przetasowaniu nie jest od razu SELECT na 1. miejscu
  if (shuffled.length > 2 && shuffled[0].id === 'core_0') {
    var swapTmp = shuffled[0];
    shuffled[0] = shuffled[1];
    shuffled[1] = swapTmp;
  }
  return shuffled;
}
window.tokenizeWarmupSql = tokenizeWarmupSql;
window.buildWarmupPuzzlePool = buildWarmupPuzzlePool;

function renderWarmupPuzzleBar(task, variant, vIdx) {
  var pool = buildWarmupPuzzlePool(task, variant, vIdx);
  var usedList = Array.isArray(uiState.warmupUsedBlocks) ? uiState.warmupUsedBlocks : [];
  return '<div class="warmup-puzzle-box">' +
    '<div class="warmup-puzzle-hdr">' +
      '<span>🧩 <strong>Szybka układanka (Stuknij klocki w kolejności)</strong></span>' +
      '<div class="quick-bar-actions">' +
        '<button type="button" class="qb-act-btn" data-act="undoToken" title="Cofnij ostatnio wstawiony klocek">⌫ Cofnij</button>' +
        '<button type="button" class="qb-act-btn qb-clear-btn" data-act="clearEd" title="Wyczyść i odblokuj klocki">🧹 Wyczyść</button>' +
      '</div>' +
    '</div>' +
    '<div class="warmup-puzzle-grid">' +
      pool.map(function(b) {
        var isUsed = usedList.indexOf(b.id) > -1;
        return '<button type="button" class="puzzle-block-btn' + (isUsed ? ' used' : '') + '" data-act="tapPuzzleBlock" data-bid="' + esc(b.id) + '" data-sql="' + esc(b.sql) + '"' + (isUsed ? ' disabled' : '') + '>' +
          '<code>' + highlightSQL(b.sql) + '</code>' +
        '</button>';
      }).join('') +
    '</div>' +
  '</div>';
}

function renderEditorWidget(extraCols, actionType, variant, task) {
  var isWarmupStep = false;
  var curVIdx = 0;
  if (task && Array.isArray(task.variants) && variant) {
    curVIdx = task.variants.indexOf(variant);
    if (curVIdx === -1) curVIdx = state.activeVariantIdx % task.variants.length;
    isWarmupStep = (curVIdx === 0 || curVIdx === 1 || variant.tier === 'warmup');
  }
  var barHtml = '';
  if (isWarmupStep && task && variant) {
    barHtml = renderWarmupPuzzleBar(task, variant, curVIdx);
  } else if (variant || task) {
    barHtml = renderQuickBar(task, variant);
  }
  return '' +
    barHtml +
    '<div class="ed">' +
      '<div id="sqlgut" aria-hidden="true"><span class="ln">1</span></div>' +
      '<div class="edwrap">' +
        '<pre id="sqlhl" aria-hidden="true"></pre>' +
        '<textarea id="answer" wrap="off" spellcheck="false" autocomplete="off" autocorrect="off" autocapitalize="off" placeholder="Wpisz zapytanie SQL (np. SELECT ... FROM ...) lub dotknij klocka powyżej">' + esc(state.editorCode || '') + '</textarea>' +
      '</div>' +
    '</div>' +
    '<div class="acts">' +
      '<button class="btn primary" data-act="' + (actionType || 'runOnly') + '">▶ Uruchom i sprawdź wynik</button>' +
      '<button class="btn sm" data-act="runOnly">Tylko uruchom (SELECT)</button>' +
      '<button class="btn sm" data-act="clearEd">Wyczyść</button>' +
    '</div>' +
    renderResultBox();
}

function renderSingleTable(resObj, maxRows) {
  var limit = maxRows || 30;
  if (!resObj || !resObj.columns || !resObj.columns.length) {
    return '<p class="small muted" style="margin:6px 0">Zapytanie zwróciło 0 wierszy (brak kolumn).</p>';
  }
  var rows = resObj.values || [];
  if (!rows.length) {
    return '<div class="tblwrap"><table><thead><tr>' +
      resObj.columns.map(function(c) { return '<th>' + esc(c) + '</th>'; }).join('') +
      '</tr></thead><tbody><tr><td colspan="' + resObj.columns.length + '" class="muted" style="text-align:center;padding:10px">0 wierszy</td></tr></tbody></table></div>';
  }
  return '<div class="tblwrap"><table><thead><tr>' +
    resObj.columns.map(function(c) { return '<th>' + esc(c) + '</th>'; }).join('') +
    '</tr></thead><tbody>' +
    rows.slice(0, limit).map(function(r) {
      return '<tr>' + r.map(function(v) { return '<td>' + (v === null ? '<em class="muted">NULL</em>' : esc(v)) + '</td>'; }).join('') + '</tr>';
    }).join('') +
    '</tbody></table></div>';
  }

// Nowa numeracja zadań w Ścieżce: 🔥 Rozgrzewka 1 z 2 / 🎯 Zadanie 1 z 6 + kompaktowy wariant na pasek nawigacji
function getStepSwitchLabel(vIdx, totalSteps) {
  var mainCnt = Math.max(1, (totalSteps || 8) - 2);
  if (vIdx < 2) {
    return '🔥 Rozgrzewka ' + (vIdx + 1) + ' z 2';
  }
  return '🎯 Zadanie ' + (vIdx - 1) + ' z ' + mainCnt;
}

function getCompactStepLabel(vIdx, totalSteps) {
  var mainCnt = Math.max(1, (totalSteps || 8) - 2);
  if (vIdx < 2) {
    return '🔥 Rozgrz. ' + (vIdx + 1) + '/2';
  }
  return '🎯 Zad. ' + (vIdx - 1) + '/' + mainCnt;
}

function getVariantShortDesc(task, variant, vIdx) {
  if (!variant) return 'Zadanie SQL';
  if (variant.shortTitle) return variant.shortTitle;
  if (variant.title) return variant.title;
  var sol = String(variant.sol || '');
  var tbls = resolveTaskTables(variant.tables || (task && task.tables), sol);
  var tbl = tbls[0] || 'film';

  if (variant.newFeature && variant.newFeature.title) {
    var nfTitle = variant.newFeature.title.replace(/\s*\([^)]*\)/g, '').trim();
    if (nfTitle.split(/\s+/).length <= 4) return nfTitle + ' (' + tbl + ')';
  }
  if (/^\s*WITH\b/i.test(sol) && /\bLAG\b/i.test(sol)) return 'CTE i porównanie LAG';
  if (/^\s*WITH\b/i.test(sol) && /\bROW_NUMBER\b/i.test(sol)) return 'CTE i ranking TOP N';
  if (/^\s*WITH\b/i.test(sol)) return 'Zapytanie CTE (' + tbl + ')';
  if (/\bDENSE_RANK\b/i.test(sol)) return 'Ranking DENSE_RANK (' + tbl + ')';
  if (/\bRANK\s*\(/i.test(sol)) return 'Ranking RANK (' + tbl + ')';
  if (/\bROW_NUMBER\b/i.test(sol)) return 'Numeracja ROW_NUMBER (' + tbl + ')';
  if (/\bLAG\s*\(/i.test(sol)) return 'Poprzedni wiersz LAG (' + tbl + ')';
  if (/\bLEAD\s*\(/i.test(sol)) return 'Kolejny wiersz LEAD (' + tbl + ')';
  if (/\bSUM\s*\([^)]+\)\s*OVER/i.test(sol)) return 'Suma narastająca (' + tbl + ')';
  if (/\bFILTER\s*\(\s*WHERE/i.test(sol)) return 'Agregacja FILTER (' + tbl + ')';
  if (/\(\s*SELECT\b/i.test(sol)) return 'Podzapytanie w WHERE (' + tbl + ')';
  if (/\bCASE\s+WHEN\b/i.test(sol)) return 'Warunek CASE WHEN (' + tbl + ')';
  if (/\bCOALESCE\b/i.test(sol)) return 'Zastępowanie NULL (' + tbl + ')';
  if (/\bLEFT\s+JOIN\b/i.test(sol) && /\bIS\s+NULL\b/i.test(sol)) return 'Szukanie braków (' + tbl + ')';
  if (/\bLEFT\s+JOIN\b/i.test(sol)) return 'Złączenie LEFT JOIN (' + tbl + ')';
  if (/\bJOIN\b/i.test(sol)) return 'Łączenie tabel (' + tbls.slice(0, 2).join(' + ') + ')';
  if (/\bHAVING\b/i.test(sol)) return 'Filtr grup HAVING (' + tbl + ')';
  if (/\bGROUP\s+BY\b/i.test(sol)) return 'Grupowanie tabeli ' + tbl;
  if (/\bROUND\s*\(\s*AVG/i.test(sol)) return 'Średnia z ROUND (' + tbl + ')';
  if (/\b(COUNT|SUM|AVG|MIN|MAX)\s*\(/i.test(sol)) return 'Funkcje agregujące (' + tbl + ')';
  if (/\bILIKE\b/i.test(sol)) return 'Wyszukiwanie ILIKE (' + tbl + ')';
  if (/\bBETWEEN\b/i.test(sol)) return 'Przedział BETWEEN (' + tbl + ')';
  if (/\bIN\s*\(/i.test(sol)) return 'Filtr listy IN (' + tbl + ')';
  if (/\bIS\s+(?:NOT\s+)?NULL\b/i.test(sol)) return 'Sprawdzanie NULL (' + tbl + ')';
  if (/\bAND\b/i.test(sol) && /\bOR\b/i.test(sol)) return 'Łączenie AND z OR (' + tbl + ')';
  if (/\b(AND|OR)\b/i.test(sol)) return 'Warunki złożone (' + tbl + ')';
  if (/\bWHERE\b/i.test(sol)) return 'Filtrowanie tabeli ' + tbl;
  if (/\bORDER\s+BY\b/i.test(sol) && /\bLIMIT\b/i.test(sol)) return 'Ranking TOP z ' + tbl;
  if (/\bORDER\s+BY\b/i.test(sol)) return 'Sortowanie tabeli ' + tbl;
  if (/\bLIMIT\b/i.test(sol)) return 'Limit wierszy z ' + tbl;
  if (/\bDISTINCT\b/i.test(sol)) return 'Unikalne wartości z ' + tbl;
  if (/[+\-*\/]/.test(sol) && /\bAS\b/i.test(sol)) return 'Wyliczenie i alias (' + tbl + ')';
  if (/\bAS\b/i.test(sol)) return 'Alias AS w tabeli ' + tbl;
  if (/SELECT\s+\*/i.test(sol)) return 'Wszystkie kolumny ' + tbl;
  if (vIdx === 0) return 'Podgląd tabeli ' + tbl;
  return 'Wybór kolumn z ' + tbl;
}

function getVariantShortTitle(task, variant, vIdx) {
  var prefix = vIdx < 2 ? ('🔥 R' + (vIdx + 1) + ': ') : ('🎯 Zad. ' + (vIdx - 1) + ': ');
  return prefix + getVariantShortDesc(task, variant, vIdx);
}

function renderResultBox() {
  var h = '';
  if (lastFeedback) {
    var nextBtnHtml = '';
    if (lastFeedback.type === 'ok' && currentTab === 'path' && state.pathMode === 'solve') {
      var curT = PATH_TASKS.find(function(t) { return t.id === state.activeTaskId; }) || PATH_TASKS[0];
      var curVIdx = state.activeVariantIdx % curT.variants.length;
      if (curVIdx + 1 < curT.variants.length) {
        var nextSwitchLbl = getStepSwitchLabel(curVIdx + 1, curT.variants.length);
        nextBtnHtml = '<div style="margin-top:10px">' +
          '<button type="button" class="btn success next-step-cta" data-act="nextTaskStep">🚀 Następne zadanie (' + esc(nextSwitchLbl) + ') →</button>' +
        '</div>';
      } else {
        var curLessonIdx = PATH_TASKS.findIndex(function(t) { return t.id === curT.id; });
        var hasNextLesson = curLessonIdx >= 0 && curLessonIdx + 1 < PATH_TASKS.length;
        nextBtnHtml = '<div style="margin-top:10px">' +
          '<button type="button" class="btn success next-step-cta" data-act="nextLessonAfterComplete">' +
            (hasNextLesson ? '🏆 Dział ukończony! Przejdź do następnej lekcji →' : '🏆 Cała Ścieżka ukończona! Wróć do Mapy →') +
          '</button>' +
        '</div>';
      }
    } else if (lastFeedback.type === 'ok' && currentTab === 'lemur' && state.lemurMode === 'solve') {
      nextBtnHtml = '<div style="margin-top:10px">' +
        '<button type="button" class="btn success next-step-cta" data-act="backToLemurList">📋 Wróć do listy zadań rekrutacyjnych</button>' +
      '</div>';
    }
    h += '<div class="fb-box ' + lastFeedback.type + '">' +
      '<strong>' + esc(lastFeedback.title) + '</strong>' +
      '<p class="small" style="margin:4px 0 0;white-space:pre-wrap">' + esc(lastFeedback.msg) + '</p>' +
      nextBtnHtml +
    '</div>';
  }
  if (lastChecklist && lastExecResult && !lastExecResult.error) {
    h += renderValidationChecklistHtml(lastChecklist);
  }
  if (lastExecResult) {
    if (lastExecResult.error) {
      var lnBadge = lastExecResult.errorLine ? ' w linii ' + lastExecResult.errorLine : '';
      var suflerHtml = /syntax error at or near\s+"FROM"/i.test(lastExecResult.error)
        ? '<div class="pg-error-sufler-pill">💡 Podpowiedź: Sprawdź, czy przed słowem FROM nie został przecinek po ostatniej kolumnie.</div>'
        : '';
      var snippetHtml = lastExecResult.errorSnippet
        ? '<div style="margin-top:6px;padding:6px 10px;background:rgba(0,0,0,0.25);border-radius:6px;font-family:var(--mono);font-size:12px">Linia ' + lastExecResult.errorLine + ': <code>' + highlightSQL(lastExecResult.errorSnippet) + '</code></div>'
        : '';
      h += '<div class="fb-box trap">' + suflerHtml + '<strong>⚠️ Błąd SQL' + esc(lnBadge) + ':</strong> <span class="small">' + esc(lastExecResult.error) + '</span>' + snippetHtml + '</div>';
    } else if (lastExpectedResult && lastExpectedResult.columns) {
      var uCnt = (lastExecResult.values || []).length;
      var eCnt = (lastExpectedResult.values || []).length;
      h += '<div class="cmp-grid">' +
        '<div class="cmp-col bad">' +
          '<div class="cmp-hdr bad">❌ Twój wynik (' + uCnt + ' wierszy)</div>' +
          renderSingleTable(lastExecResult, 20) +
        '</div>' +
        '<div class="cmp-col ok">' +
          '<div class="cmp-hdr ok">✅ Oczekiwany wynik — Wzorzec (' + eCnt + ' wierszy)</div>' +
          renderSingleTable(lastExpectedResult, 20) +
        '</div>' +
      '</div>';
    } else if (lastExecResult.columns && lastExecResult.columns.length) {
      h += '<p class="small muted" style="margin:10px 0 4px">Wynik zapytania (' + lastExecResult.values.length + ' wierszy):</p>' +
        renderSingleTable(lastExecResult, 30);
    } else {
      h += '<p class="small muted" style="margin-top:8px">Zapytanie wykonało się poprawnie, ale zwróciło 0 wierszy.</p>';
    }
  }
  return h;
}

/* ==========================================================================
   8. WIDOKI ZAKŁADEK (PRZEJRZYSTY PODZIAŁ: MAPA vs SLAJDY TEORII vs ZADANIA)
   ========================================================================== */

var WRITE_ORDER_STEPS = ['SELECT', 'FROM', 'JOIN', 'WHERE', 'GROUP BY', 'HAVING', 'ORDER BY', 'LIMIT'];
var EXEC_ORDER_STEPS = [
  { num: 1, lbl: '1. FROM / JOIN', desc: 'Pobranie i złączenie tabel' },
  { num: 2, lbl: '2. WHERE', desc: 'Sito pojedynczych wierszy' },
  { num: 3, lbl: '3. GROUP BY', desc: 'Podział na koszyki (grupy)' },
  { num: 4, lbl: '4. HAVING', desc: 'Filtr całych koszyków po agregacji' },
  { num: 5, lbl: '5. SELECT (+ OVER)', desc: 'Wyliczenia, aliasy AS i funkcje okna' },
  { num: 6, lbl: '6. DISTINCT', desc: 'Usunięcie duplikatów' },
  { num: 7, lbl: '7. ORDER BY', desc: 'Sortowanie wyniku (widzi aliasy!)' },
  { num: 8, lbl: '8. LIMIT', desc: 'Odcięcie pierwszych N wierszy' }
];

var SQL_PIPELINE_SIM_STEPS = [
  {
    step: 1,
    clause: '1. FROM film',
    badge: '20 wierszy × 7 kolumn',
    desc: 'Silnik otwiera pełną tabelę `film` i ładuje wszystkie 20 filmów wraz ze wszystkimi kolumnami do pamięci roboczej.',
    preview: [
      ['1', 'Academy Dinosaur', 'PG', '0.99', '86 min'],
      ['3', 'Adaptation Holes', 'NC-17', '2.99', '50 min'],
      ['4', 'Affair Prejudice', 'G', '2.99', '117 min'],
      ['8', 'Airport Pollock', 'R', '4.99', '54 min'],
      ['10', 'Aladdin Calendar', 'NC-17', '4.99', '63 min'],
      ['18', 'Alter Victory', 'PG-13', '0.99', '57 min']
    ],
    cols: ['film_id', 'title', 'rating', 'rental_rate', 'length']
  },
  {
    step: 2,
    clause: "2. WHERE rental_rate >= 2.99",
    badge: '14 wierszy → zostaje 6 wierszy (po filtrze)',
    desc: 'Sito `WHERE` sprawdza każdy wiersz z osobna. Filmy za 0.99 $ odpadają natychmiast — przed jakimkolwiek grupowaniem!',
    preview: [
      ['3', 'Adaptation Holes', 'NC-17', '2.99', '50 min'],
      ['4', 'Affair Prejudice', 'G', '2.99', '117 min'],
      ['8', 'Airport Pollock', 'R', '4.99', '54 min'],
      ['10', 'Aladdin Calendar', 'NC-17', '4.99', '63 min'],
      ['12', 'Ali Forever', 'PG', '4.99', '150 min'],
      ['15', 'Alien Center', 'NC-17', '2.99', '46 min']
    ],
    cols: ['film_id', 'title', 'rating', 'rental_rate', 'length']
  },
  {
    step: 3,
    clause: '3. GROUP BY rating (+ HAVING)',
    badge: '6 wierszy → 3 koszyki (grupy)',
    desc: 'Wiersze o tym samym `rating` trafiają do wspólnych koszyków. Od tej chwili pojedyncze tytuły znikają — mamy zagregowane grupy!',
    preview: [
      ['Koszyk NC-17', '3 filmy w grupie', 'śr. 3.66 $'],
      ['Koszyk R', '2 filmy w grupie', 'śr. 4.99 $'],
      ['Koszyk G / PG', '2 filmy w grupie', 'śr. 3.99 $']
    ],
    cols: ['rating (Grupa)', 'COUNT(*)', 'ROUND(AVG(rental_rate),2)']
  },
  {
    step: 4,
    clause: '4. SELECT rating, COUNT(*) AS ile_filmow',
    badge: 'Wycięcie docelowych kolumn i nadanie aliasu AS',
    desc: 'Dopiero TERAZ PostgreSQL wycina wybrane kolumny i tworzy alias `AS ile_filmow` (dlatego `WHERE` i `GROUP BY` nie widziały tego aliasu!).',
    preview: [
      ['NC-17', '3'],
      ['R', '2'],
      ['G', '1']
    ],
    cols: ['rating', 'ile_filmow']
  },
  {
    step: 5,
    clause: '5. ORDER BY ile_filmow DESC',
    badge: 'Posortowany gotowy wynik (3 wiersze)',
    desc: 'Na samym końcu silnik układa wynik malejąco po aliasie `ile_filmow` (który już istnieje po kroku SELECT) i zwraca tabelę użytkownikowi.',
    preview: [
      ['NC-17', '3'],
      ['R', '2'],
      ['G', '1']
    ],
    cols: ['rating', 'ile_filmow']
  }
];

var CLAUSE_EXPLANATIONS_PL = {
  'SELECT': {
    title: 'SELECT — wybór i wyliczanie kolumn raportu',
    desc: 'Wskazuje, które kolumny lub wyliczenia (oraz aliasy AS) mają znaleźć się w ostatecznym wyniku.',
    sql: 'SELECT title, length AS duration_min\nFROM film;'
  },
  'DISTINCT': {
    title: 'DISTINCT — usuwanie duplikatów',
    desc: 'Odrzuca powtarzające się wiersze, zostawiając tylko unikalne wartości wybranych kolumn.',
    sql: 'SELECT DISTINCT rating\nFROM film;'
  },
  'FROM': {
    title: 'FROM — pobranie tabeli źródłowej (Krok #1 bazy!)',
    desc: 'Silnik PostgreSQL ZAWSZE zaczyna od FROM — najpierw otwiera tabelę w pamięci, zanim sprawdzi jakiekolwiek kolumny.',
    sql: 'SELECT title\nFROM film;'
  },
  'FROM / JOIN': {
    title: 'FROM / JOIN — pobranie i połączenie tabel',
    desc: 'Baza ładuje główną tabelę z FROM i dopasowuje do niej wiersze z tabeli w JOIN po wspólnym kluczu w ON.',
    sql: 'SELECT f.title, l.name\nFROM film f\nJOIN language l ON f.language_id = l.language_id;'
  },
  'JOIN': {
    title: 'JOIN ... ON — łączenie danych z dwóch tabel',
    desc: 'Dokleja kolumny z drugiej tabeli tam, gdzie identyfikatory w warunku ON są sobie równe.',
    sql: 'SELECT c.first_name, a.district\nFROM customer c\nJOIN address a ON c.address_id = a.address_id;'
  },
  'WHERE': {
    title: 'WHERE — sito pojedynczych wierszy',
    desc: 'Sprawdza każdy wiersz z osobna. Wiersze, które nie spełniają warunku, odpadają od razu przed grupowaniem i przed SELECT.',
    sql: "SELECT title, rental_rate\nFROM film\nWHERE rental_rate >= 2.99;"
  },
  'GROUP BY': {
    title: 'GROUP BY — podział wierszy na koszyki (grupy)',
    desc: 'Zbiera wiersze o tej samej wartości (np. ten sam rating) do jednego koszyka, aby policzyć dla niego COUNT, SUM lub AVG.',
    sql: 'SELECT rating, COUNT(*) AS film_count\nFROM film\nGROUP BY rating;'
  },
  'HAVING': {
    title: 'HAVING — filtr gotowych grup po agregacji',
    desc: 'Działa dopiero PO GROUP BY — odsiewa całe koszyki na podstawie wyniku funkcji agregującej (np. COUNT(*) > 5).',
    sql: 'SELECT rating, COUNT(*) AS film_count\nFROM film\nGROUP BY rating\nHAVING COUNT(*) >= 4;'
  },
  'ORDER BY': {
    title: 'ORDER BY — sortowanie wyniku końcowego',
    desc: 'Układa wiersze rosnąco (ASC) lub malejąco (DESC). Działa po SELECT, więc zna już wszystkie aliasy AS!',
    sql: 'SELECT title, length AS duration_min\nFROM film\nORDER BY duration_min DESC;'
  },
  'LIMIT': {
    title: 'LIMIT — odcięcie pierwszych N wierszy',
    desc: 'Na samym końcu odcina wynik do zadanej liczby wierszy (np. TOP 5 rekordów).',
    sql: 'SELECT title, rental_rate\nFROM film\nORDER BY rental_rate DESC\nLIMIT 5;'
  },
  'WITH': {
    title: 'WITH (CTE) — nazwana tabela tymczasowa',
    desc: 'Tworzy czytelny krok pomocniczy przed głównym zapytaniem SELECT, działający jak tymczasowa tabela.',
    sql: 'WITH long_films AS (\n  SELECT film_id, title, length FROM film WHERE length > 120\n)\nSELECT title, length FROM long_films;'
  }
};

function getProgressivePipelineForTask(task, slide) {
  var tid = task && task.id ? task.id : 'p1_1';
  var stg = task && task.stage ? task.stage : 1;
  var writeList = [];
  var execRaw = [];

  if (tid === 'p1_1' || tid === 'p1_2') {
    writeList = ['SELECT', 'FROM'];
    execRaw = [
      { key: 'FROM', lbl: 'FROM', desc: 'Pobranie tabeli z bazy' },
      { key: 'SELECT', lbl: 'SELECT', desc: 'Wybór kolumn i nadanie aliasów AS' }
    ];
  } else if (tid === 'p1_3') {
    writeList = ['SELECT', 'DISTINCT', 'FROM'];
    execRaw = [
      { key: 'FROM', lbl: 'FROM', desc: 'Pobranie tabeli z bazy' },
      { key: 'SELECT', lbl: 'SELECT', desc: 'Wybór wskazanych kolumn' },
      { key: 'DISTINCT', lbl: 'DISTINCT', desc: 'Usunięcie duplikatów z wyniku' }
    ];
  } else if (tid === 'p1_4') {
    writeList = ['SELECT', 'FROM', 'ORDER BY', 'LIMIT'];
    execRaw = [
      { key: 'FROM', lbl: 'FROM', desc: 'Pobranie tabeli z bazy' },
      { key: 'SELECT', lbl: 'SELECT', desc: 'Wybór kolumn i aliasów AS' },
      { key: 'ORDER BY', lbl: 'ORDER BY', desc: 'Sortowanie wyniku (widzi aliasy AS!)' },
      { key: 'LIMIT', lbl: 'LIMIT', desc: 'Odcięcie pierwszych N wierszy' }
    ];
  } else if (stg === 2 || tid === 'p3_1') {
    writeList = ['SELECT', 'FROM', 'WHERE', 'ORDER BY', 'LIMIT'];
    execRaw = [
      { key: 'FROM', lbl: 'FROM', desc: 'Pobranie tabeli z bazy' },
      { key: 'WHERE', lbl: 'WHERE', desc: 'Sito pojedynczych wierszy' },
      { key: 'SELECT', lbl: 'SELECT', desc: 'Wyliczenia i aliasy AS' },
      { key: 'ORDER BY', lbl: 'ORDER BY', desc: 'Sortowanie wyniku' },
      { key: 'LIMIT', lbl: 'LIMIT', desc: 'Odcięcie pierwszych N wierszy' }
    ];
  } else if (tid === 'p3_2') {
    writeList = ['SELECT', 'FROM', 'WHERE', 'GROUP BY', 'ORDER BY', 'LIMIT'];
    execRaw = [
      { key: 'FROM', lbl: 'FROM', desc: 'Pobranie tabeli z bazy' },
      { key: 'WHERE', lbl: 'WHERE', desc: 'Sito pojedynczych wierszy przed grupowaniem' },
      { key: 'GROUP BY', lbl: 'GROUP BY', desc: 'Podział wierszy na koszyki (grupy)' },
      { key: 'SELECT', lbl: 'SELECT', desc: 'Policzenie COUNT/SUM/AVG dla grup' },
      { key: 'ORDER BY', lbl: 'ORDER BY', desc: 'Sortowanie gotowych grup' },
      { key: 'LIMIT', lbl: 'LIMIT', desc: 'Odcięcie pierwszych N wierszy' }
    ];
  } else if (tid === 'p3_3') {
    writeList = ['SELECT', 'FROM', 'WHERE', 'GROUP BY', 'HAVING', 'ORDER BY', 'LIMIT'];
    execRaw = [
      { key: 'FROM', lbl: 'FROM', desc: 'Pobranie tabeli z bazy' },
      { key: 'WHERE', lbl: 'WHERE', desc: 'Sito pojedynczych wierszy' },
      { key: 'GROUP BY', lbl: 'GROUP BY', desc: 'Podział na koszyki (grupy)' },
      { key: 'HAVING', lbl: 'HAVING', desc: 'Filtr całych koszyków po agregacji' },
      { key: 'SELECT', lbl: 'SELECT', desc: 'Wycięcie kolumn i aliasów AS' },
      { key: 'ORDER BY', lbl: 'ORDER BY', desc: 'Sortowanie wyniku' },
      { key: 'LIMIT', lbl: 'LIMIT', desc: 'Odcięcie pierwszych N wierszy' }
    ];
  } else if (stg === 4) {
    writeList = ['SELECT', 'FROM', 'JOIN', 'WHERE', 'GROUP BY', 'HAVING', 'ORDER BY', 'LIMIT'];
    execRaw = [
      { key: 'FROM / JOIN', lbl: 'FROM / JOIN', desc: 'Pobranie i złączenie tabel po kluczu ON' },
      { key: 'WHERE', lbl: 'WHERE', desc: 'Sito pojedynczych wierszy' },
      { key: 'GROUP BY', lbl: 'GROUP BY', desc: 'Podział na koszyki (grupy)' },
      { key: 'HAVING', lbl: 'HAVING', desc: 'Filtr całych koszyków po agregacji' },
      { key: 'SELECT', lbl: 'SELECT', desc: 'Wyliczenia i aliasy AS' },
      { key: 'ORDER BY', lbl: 'ORDER BY', desc: 'Sortowanie wyniku' },
      { key: 'LIMIT', lbl: 'LIMIT', desc: 'Odcięcie pierwszych N wierszy' }
    ];
  } else {
    writeList = ['WITH', 'SELECT', 'FROM', 'JOIN', 'WHERE', 'GROUP BY', 'HAVING', 'ORDER BY', 'LIMIT'];
    execRaw = [
      { key: 'WITH', lbl: 'WITH (CTE)', desc: 'Przygotowanie tabel pomocniczych CTE' },
      { key: 'FROM / JOIN', lbl: 'FROM / JOIN', desc: 'Pobranie i złączenie tabel' },
      { key: 'WHERE', lbl: 'WHERE', desc: 'Sito pojedynczych wierszy' },
      { key: 'GROUP BY', lbl: 'GROUP BY', desc: 'Podział na koszyki (grupy)' },
      { key: 'HAVING', lbl: 'HAVING', desc: 'Filtr całych koszyków po agregacji' },
      { key: 'SELECT', lbl: 'SELECT (+ OVER)', desc: 'Wyliczenia, aliasy AS i funkcje okna' },
      { key: 'ORDER BY', lbl: 'ORDER BY', desc: 'Sortowanie wyniku' },
      { key: 'LIMIT', lbl: 'LIMIT', desc: 'Odcięcie pierwszych N wierszy' }
    ];
  }

  return {
    writeSteps: writeList,
    execSteps: execRaw.map(function(item, i) {
      return {
        num: i + 1,
        key: item.key,
        lbl: (i + 1) + '. ' + item.lbl,
        desc: item.desc
      };
    })
  };
}

function formatQuizOptionSql(optTxt) {
  var s = String(optTxt || '');
  if (s.indexOf('`') > -1) {
    return formatPrompt(s);
  }
  if (/^\s*(SELECT|FROM|WHERE|GROUP\s+BY|HAVING|ORDER\s+BY|LIMIT|JOIN|LEFT\s+JOIN|INNER\s+JOIN|WITH)\b/i.test(s)) {
    return '<code class="sql-inline-code">' + highlightSQL(s) + '</code>';
  }
  return highlightHtmlCodeBlocks(esc(s));
}

function renderSqlPipelineSimulator() {
  var activeStep = uiState.sqlAnimStep || 1;
  if (activeStep < 1 || activeStep > SQL_PIPELINE_SIM_STEPS.length) activeStep = 1;
  var cur = SQL_PIPELINE_SIM_STEPS[activeStep - 1];

  var pillsHtml = SQL_PIPELINE_SIM_STEPS.map(function(s) {
    var stepKey = 'sim_' + s.step;
    var unclicked = !uiState.clickedClauses[stepKey] && s.step !== activeStep;
    var cls = 'sim-step-pill' + (s.step === activeStep ? ' active' : '') + (s.step < activeStep ? ' done' : '') + (unclicked ? ' pulse-unclicked' : '');
    var rawClause = s.clause.replace(/^\d+\.\s*/, '');
    var numPrefix = (s.clause.match(/^\d+\.\s*/) || [''])[0];
    return '<button type="button" class="' + cls + '" data-act="setSqlAnimStep" data-step="' + s.step + '">' +
      esc(numPrefix) + highlightSQL(rawClause) +
    '</button>';
  }).join('<span class="sim-arr">→</span>');

  var tblHtml = '<div class="tblwrap sim-tbl"><table><thead><tr>' +
    cur.cols.map(function(c) { return '<th>' + highlightSQL(c) + '</th>'; }).join('') +
    '</tr></thead><tbody>' +
    cur.preview.map(function(r) {
      return '<tr>' + r.map(function(v) { return '<td>' + esc(v) + '</td>'; }).join('') + '</tr>';
    }).join('') +
    '</tbody></table></div>';

  var curNumPrefix = (cur.clause.match(/^\d+\.\s*/) || [''])[0];
  var curRawSql = cur.clause.replace(/^\d+\.\s*/, '');

  return '<div class="sql-sim-box">' +
    '<div class="sql-sim-hdr">' +
      '<div>' +
        '<strong>🎬 Interaktywny symulator potoku PostgreSQL (Krok ' + activeStep + '/' + SQL_PIPELINE_SIM_STEPS.length + ')</strong>' +
        '<p class="small muted" style="margin:2px 0 0">Zobacz na żywo, jak silnik filtruje wiersze, tworzy grupy i wycina kolumny:</p>' +
      '</div>' +
      '<button type="button" class="btn sm primary" data-act="runSqlAnim">' +
        (uiState.sqlAnimRunning ? '⏳ Animacja trwa…' : '▶ Uruchom animację krok po kroku') +
      '</button>' +
    '</div>' +
    '<div class="interactive-hint">👆 Dotknij wybrany klocek poniżej, aby zobaczyć jak działa</div>' +
    '<div class="sim-pills-row">' + pillsHtml + '</div>' +
    '<div class="sim-stage-card">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;margin-bottom:6px">' +
        '<code class="sim-clause-code">' + esc(curNumPrefix) + highlightSQL(curRawSql) + '</code>' +
        '<span class="chip done">' + esc(cur.badge) + '</span>' +
      '</div>' +
      '<p class="small" style="margin:0 0 8px">' + formatPrompt(cur.desc) + '</p>' +
      tblHtml +
    '</div>' +
  '</div>';
}

function renderTutorialView(task) {
  var slides = getLessonSlides(task);
  if (!slides.length) {
    state.pathMode = 'solve';
    return renderPathTab();
  }
  var sIdx = Math.max(0, Math.min(slides.length - 1, uiState.tutorialSlideIdx || 0));
  uiState.tutorialSlideIdx = sIdx;
  var slide = slides[sIdx];
  var isDone = !!(state.tutorialsDone && state.tutorialsDone[task.id]);
  var stepTitles = ['1. Składnia', '2. Kolejność SQL', '3. Przykład', '4. Quiz'];

  var stepDots = '<div class="tut-steps">' + slides.map(function(_, idx) {
    var cls = 'tut-step-btn' + (idx === sIdx ? ' active' : '') + (idx < sIdx || isDone ? ' visited' : '');
    return '<button type="button" class="' + cls + '" data-act="goToSlide" data-idx="' + idx + '">' + esc(stepTitles[idx] || ('Karta ' + (idx + 1))) + '</button>';
  }).join('') + '</div>';

  var bodyHtml = '';
  if (sIdx === 0) {
    bodyHtml = '<div class="tut-card-inner">' +
      '<span class="chip info">Karta 1/4 · Składnia i cel klauzuli</span>' +
      '<h3 style="margin:8px 0">' + esc(slide.title) + '</h3>' +
      '<div class="theory-code" style="margin-bottom:12px"><code>' + highlightSQL(slide.syntax) + '</code></div>' +
      '<ul class="tut-list">' + (slide.bullets || []).map(function(b) { return '<li>' + highlightHtmlCodeBlocks(b) + '</li>'; }).join('') + '</ul>' +
    '</div>';
  } else if (sIdx === 1) {
    var fw = slide.focusWrite || [];
    var prog = getProgressivePipelineForTask(task, slide);
    var activeClauseKey = uiState.selectedClause || (fw[0] && CLAUSE_EXPLANATIONS_PL[fw[0]] ? fw[0] : prog.writeSteps[0]);
    var clauseInfo = CLAUSE_EXPLANATIONS_PL[activeClauseKey] || CLAUSE_EXPLANATIONS_PL['SELECT'];

    bodyHtml = '<div class="tut-card-inner">' +
      '<span class="chip mid">Karta 2/4 · Architektura silnika PostgreSQL (Progresywny potok)</span>' +
      '<h3 style="margin:8px 0">' + esc(slide.title) + '</h3>' +
      '<div class="interactive-hint">👆 Dotknij wybrany klocek poniżej, aby zobaczyć jak działa</div>' +
      '<div class="order-box">' +
        '<div class="order-label">✍️ Kolejność pisania w kodzie SQL (poznane dotąd klauzule):</div>' +
        '<div class="order-flow">' +
          prog.writeSteps.map(function(w, idx) {
            var hi = fw.indexOf(w) > -1 || activeClauseKey === w;
            var wasClicked = !!uiState.clickedClauses[w];
            var pulseCls = !wasClicked ? ' pulse-unclicked' : '';
            return (idx > 0 ? '<span class="order-arr">→</span>' : '') +
              '<button type="button" class="order-pill' + (hi ? ' active' : '') + pulseCls + '" data-act="inspectClause" data-clause="' + esc(w) + '">' + highlightSQL(w) + '</button>';
          }).join('') +
        '</div>' +
      '</div>' +
      '<div class="order-box exec">' +
        '<div class="order-label">⚙️ Prawdziwa kolejność wykonywania przez bazę PostgreSQL:</div>' +
        '<div class="exec-grid">' +
          prog.execSteps.map(function(st) {
            var hi = fw.indexOf(st.key) > -1 || activeClauseKey === st.key || (st.key === 'FROM / JOIN' && fw.indexOf('JOIN') > -1);
            var wasClicked = !!uiState.clickedClauses[st.key];
            var pulseCls = !wasClicked ? ' pulse-unclicked' : '';
            return '<button type="button" class="exec-step' + (hi ? ' active' : '') + pulseCls + '" data-act="inspectClause" data-clause="' + esc(st.key) + '" style="text-align:left;cursor:pointer;font-family:inherit">' +
              '<strong>' + esc(st.num + '. ') + highlightSQL(st.key) + '</strong>' +
              '<span>' + esc(st.desc) + '</span>' +
            '</button>';
          }).join('') +
        '</div>' +
      '</div>' +
      (clauseInfo
        ? '<div class="teach-first-box" style="margin-top:10px">' +
            '<div class="teach-first-hdr">🔍 Jak działa klocek: <code>' + highlightSQL(activeClauseKey) + '</code></div>' +
            '<div class="teach-first-body">' +
              '<strong>' + esc(clauseInfo.title) + '</strong> — ' + esc(clauseInfo.desc) +
              '<div class="theory-code" style="margin-top:6px"><code>' + highlightSQL(clauseInfo.sql) + '</code></div>' +
            '</div>' +
          '</div>'
        : '') +
      '<div class="fb-box warn" style="margin-top:10px">' + highlightHtmlCodeBlocks(slide.note) + '</div>' +
      (task && task.stage >= 3 ? renderSqlPipelineSimulator() : '') +
    '</div>';
  } else if (sIdx === 2) {
    bodyHtml = '<div class="tut-card-inner">' +
      '<span class="chip info">Karta 3/4 · Przykład krok po kroku</span>' +
      '<h3 style="margin:8px 0">' + esc(slide.title) + '</h3>' +
      '<div class="theory-code" style="margin-bottom:12px"><code>' + highlightSQL(slide.code) + '</code></div>' +
      '<div class="tut-lines">' +
        (slide.lines || []).map(function(ln, idx) {
          return '<div class="tut-line-item">' +
            '<div class="tut-line-code"><code>' + highlightSQL(ln.line) + '</code></div>' +
            '<div class="tut-line-desc"><strong>Krok ' + (idx + 1) + ':</strong> ' + highlightHtmlCodeBlocks(esc(ln.desc)) + '</div>' +
          '</div>';
        }).join('') +
      '</div>' +
    '</div>';
  } else if (sIdx === 3 && slide.quiz) {
    var qz = slide.quiz;
    var sel = uiState.quizSelected;
    var passed = uiState.quizPassed || isDone;
    var sampleVar = (task && task.variants && task.variants[0]) ? task.variants[0] : null;
    bodyHtml = '<div class="tut-card-inner">' +
      '<span class="chip done">Karta 4/4 · Interaktywne sprawdzenie (+15 XP)</span>' +
      '<h3 style="margin:8px 0">' + esc(slide.title) + '</h3>' +
      '<div class="prompt-box" style="margin-bottom:10px"><strong>❓ Pytanie:</strong> ' + formatPrompt(qz.question) + '</div>' +
      '<div class="interactive-hint">👆 Dotknij wybrany klocek poniżej, aby zobaczyć jak działa</div>' +
      '<div class="quiz-opts">' +
        qz.options.map(function(optTxt, oIdx) {
          var optCls = 'quiz-opt-btn' + (sel === null ? ' pulse-unclicked' : '');
          if (sel === oIdx) {
            optCls += (oIdx === qz.correct) ? ' correct' : ' wrong';
          } else if (passed && oIdx === qz.correct) {
            optCls += ' correct';
          }
          var prefix = ['A', 'B', 'C'][oIdx] || (oIdx + 1);
          return '<button type="button" class="' + optCls + '" data-act="pickQuizOpt" data-opt="' + oIdx + '">' +
            '<span class="quiz-letter">' + prefix + '</span>' +
            '<span>' + formatQuizOptionSql(optTxt) + '</span>' +
          '</button>';
        }).join('') +
      '</div>' +
      (sel !== null && sel !== qz.correct
        ? '<div class="fb-box trap"><strong>❌ Jeszcze nie to!</strong> <span class="small">Sprawdź wskazówki z Karty 2 (Kolejność wykonywania SQL) i kliknij inną odpowiedź.</span></div>'
        : '') +
      (passed
        ? '<div class="fb-box ok"><strong>✅ Świetnie! Teoria opanowana.</strong><p class="small" style="margin:4px 0 0">' + highlightHtmlCodeBlocks(esc(qz.explanation)) + '</p></div>'
        : '') +
      (sampleVar
        ? '<div class="teach-first-box" style="margin-top:12px">' +
            '<div class="teach-first-hdr">📋 Ściąga z przykładowym zadaniem (' + esc(task.title) + ')</div>' +
            '<div class="teach-first-body">' +
              '<div class="small muted" style="margin-bottom:4px">Przykład z 🔥 Rozgrzewki 1 z 2:</div>' +
              '<div class="theory-code"><code>' + highlightSQL(formatSqlPretty(sampleVar.sol)) + '</code></div>' +
            '</div>' +
          '</div>'
        : '') +
    '</div>';
  }

  var canFinish = uiState.quizPassed || isDone;
  var navBtns = '<div class="acts" style="justify-content:space-between;margin-top:14px;border-top:1px solid var(--line);padding-top:12px">' +
    (sIdx > 0
      ? '<button type="button" class="btn sm" data-act="prevSlide">← Wstecz</button>'
      : '<button type="button" class="btn back-path-btn" data-act="backToPathList">← Mapa ścieżki</button>') +
    '<div style="display:flex;gap:8px;flex-wrap:wrap">' +
      (sIdx < slides.length - 1
        ? '<button type="button" class="btn primary" data-act="nextSlide">Dalej (' + (sIdx + 2) + '/' + slides.length + ') →</button>'
        : (canFinish
            ? '<button type="button" class="btn success" data-act="finishTutorial">🚀 Przejdź do zadań praktycznych →</button>'
            : '<button type="button" class="btn sm" disabled style="opacity:.6;cursor:not-allowed">Wybierz poprawną odpowiedź powyżej</button>')) +
    '</div>' +
  '</div>';

  return '<div class="card">' +
    '<div class="ws-bar">' +
      '<button type="button" class="btn back-path-btn" data-act="backToPathList">← Mapa ścieżki</button>' +
      '<span class="chip info">📖 Lekcja · Okno ' + (sIdx + 1) + ' z ' + slides.length + '</span>' +
      (isDone ? '<button type="button" class="btn sm primary" data-act="finishTutorial">Przejdź do edytora SQL →</button>' : '') +
    '</div>' +
    '<h2 style="margin:4px 0 6px">' + esc(task.title) + '</h2>' +
    '<div class="bar"><i style="width:' + Math.round(((sIdx + 1) / slides.length) * 100) + '%"></i></div>' +
    stepDots +
    bodyHtml +
    navBtns +
  '</div>';
}

// ZAKŁADKA 1: ŚCIEŻKA (128 ZADAŃ: 32 ROZGRZEWKI R1–R2 + 96 ZADAŃ 1–6 + SLAJDY SOLOLEARN + SEKWENCYJNE BLOKADY)
function renderPathTab() {
  var activeTask = PATH_TASKS.find(function(t) { return t.id === state.activeTaskId; }) || PATH_TASKS[0];

  if (state.pathMode === 'tutorial') {
    return renderTutorialView(activeTask);
  }

  if (state.pathMode === 'solve') {
    var task = activeTask;
    var vIdx = state.activeVariantIdx % task.variants.length;
    if (!isStepUnlocked(task, vIdx)) {
      vIdx = getFirstUnsolvedStepIdx(task);
      state.activeVariantIdx = vIdx;
    }
    var variant = task.variants[vIdx];
    var totalSteps = task.variants.length;
    var compactSwitchLbl = getCompactStepLabel(vIdx, totalSteps);

    var solvedInLesson = countTotalLessonSolved(task.id);
    var unlockGoal = 5;
    var unlockedCount = Math.min(unlockGoal, solvedInLesson);
    var isNextLessonUnlocked = solvedInLesson >= unlockGoal || isLessonCoreCompleted(task.id);
    var unlockPct = Math.round((unlockedCount / unlockGoal) * 100);
    var unlockBadgeHtml = isNextLessonUnlocked
      ? '<span class="unlock-progress-pill compact-unlock-badge unlocked" title="Kolejna lekcja odblokowana (5/5)">🌟 5/5</span>'
      : '<span class="unlock-progress-pill compact-unlock-badge" title="Rozwiąż 5 zadań, aby odblokować kolejną lekcję">🔓 ' + unlockedCount + '/5</span>';

    var hasPrev = vIdx > 0;
    var hasNext = (vIdx + 1 < totalSteps) && isStepUnlocked(task, vIdx + 1);

    var dropdownHtml = '';
    if (uiState.taskDropdownOpen) {
      dropdownHtml = '<div class="task-dropdown-menu">' +
        '<div class="task-dropdown-hdr">' +
          '<span>📋 Zadania w tej pod-lekcji (' + solvedInLesson + '/' + totalSteps + '):</span>' +
          '<button type="button" class="task-dropdown-close" data-act="toggleTaskDropdown">✕</button>' +
        '</div>' +
        '<div class="task-dropdown-items">' +
          task.variants.map(function(v, idx) {
            var isCur = idx === vIdx;
            var isSolved = isStepSolved(task, idx);
            var isUnlocked = isStepUnlocked(task, idx);
            var icon = isCur ? '▶' : (isSolved ? '✅' : (isUnlocked ? '🔓' : '🔒'));
            var cls = 'task-dd-item' + (isCur ? ' active' : '') + (!isUnlocked ? ' locked' : '');
            var shortTitle = getVariantShortTitle(task, v, idx);
            return '<button type="button" class="' + cls + '" data-act="jumpToVariant" data-vidx="' + idx + '"' + (!isUnlocked ? ' disabled' : '') + '>' +
              '<span class="task-dd-icon">' + icon + '</span>' +
              '<span class="task-dd-text">' + esc(shortTitle) + '</span>' +
            '</button>';
          }).join('') +
        '</div>' +
      '</div>';
    }

    var flashCls = uiState.stepFlashActive ? ' task-step-flash' : '';

    return '<div class="card task-solve-card task-transition-enter' + flashCls + '">' +
      '<div class="compact-task-topbar">' +
        '<div class="compact-nav-row1">' +
          '<button type="button" class="btn compact-top-btn back-path-btn" data-act="backToPathList">← Mapa</button>' +
          '<div class="step-nav-cluster compact-step-cluster">' +
            '<button type="button" class="step-nav-btn' + (!hasPrev ? ' disabled' : '') + '" data-act="prevStep" title="Poprzednie zadanie"' + (!hasPrev ? ' disabled' : '') + '>◀</button>' +
            '<button type="button" class="sololearn-step-badge step-dropdown-btn compact-step-btn" data-act="toggleTaskDropdown" title="Rozwiń listę zadań">' + esc(compactSwitchLbl) + ' ▾</button>' +
            '<button type="button" class="step-nav-btn' + (!hasNext ? ' disabled' : '') + '" data-act="nextStep" title="Następne odblokowane zadanie"' + (!hasNext ? ' disabled' : '') + '>▶</button>' +
          '</div>' +
          '<button type="button" class="btn compact-top-btn sololearn-theory-btn" data-act="openTutorialSlides">📖 Slajdy</button>' +
        '</div>' +
        '<div class="compact-nav-row2">' +
          '<span class="compact-lesson-title" title="' + esc(task.title) + '">' + esc(task.title) + '</span>' +
          '<div class="compact-unlock-wrap">' +
            unlockBadgeHtml +
            '<div class="compact-micro-bar"><i style="width:' + unlockPct + '%"></i></div>' +
          '</div>' +
        '</div>' +
        dropdownHtml +
      '</div>' +
      renderZeroScrollTaskCard(variant, task, 'path') +
      renderEditorWidget(task.cols, 'checkPathTask', variant, task) +
    '</div>';
  }

  var totalVariants = PATH_TASKS.reduce(function(acc, t) { return acc + t.variants.length; }, 0);
  var doneVariants = PATH_TASKS.reduce(function(acc, t) { return acc + countTotalLessonSolved(t.id); }, 0);
  var doneLessons = PATH_TASKS.filter(function(t) { return isLessonCoreCompleted(t.id) || !!state.completedTasks[t.id]; }).length;

  var h = '';
  if (!state.diagDone) {
    h += '<section class="hero">' +
      '<h2>Znasz już podstawy SQL?</h2>' +
      '<p>Rozwiąż 10-pytaniową Diagnozę i przeskocz podstawy</p>' +
      '<div class="sub-hero">Możesz rozwiązywać lub pomijać zadania, których jeszcze nie znasz. Aplikacja odblokuje Twój poziom i zapisze luki.</div>' +
      '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px">' +
        '<button class="btn ghost" style="margin-top:0" data-act="tab" data-tab="diag">🎯 Uruchom Diagnozę (10 pytań)</button>' +
        '<button class="btn ghost" style="margin-top:0" data-act="openOnboarding">🎓 Samouczek SQL (Od zera)</button>' +
      '</div>' +
    '</section>';
  }

  h += '<div class="card">' +
    '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">' +
      '<div style="min-width:0;flex:1"><h2 style="margin:0">Mapa Ścieżki SQL (Progresja Krok po Kroku)</h2>' +
      '<p class="small muted" style="margin:2px 0 0">Zaliczone działy: <strong>' + doneLessons + '/' + PATH_TASKS.length + '</strong> · Rozwiązane zadania: <strong>' + doneVariants + '/' + totalVariants + '</strong>' +
      (state.testerUnlockAll ? ' · <span class="chip mid">🔓 Tryb testerski aktywny</span>' : '') + '</p></div>' +
      '<div style="display:flex;gap:6px;flex-wrap:wrap">' +
        '<button type="button" class="btn sm onboarding-open-btn" data-act="openOnboarding">🎓 Samouczek SQL (4 karty)</button>' +
        '<button type="button" class="btn primary sm" data-act="continuePath">▶ Kontynuuj naukę</button>' +
      '</div>' +
    '</div>' +
    '<div class="bar"><i style="width:' + Math.round((doneLessons / PATH_TASKS.length) * 100) + '%"></i></div>' +
  '</div>';

  STAGES.forEach(function(st) {
    var stageOpen = isStageUnlocked(st.id);
    var tasksInStage = PATH_TASKS.filter(function(t) { return t.stage === st.id; });
    var allDone = tasksInStage.every(function(t) { return isLessonCoreCompleted(t.id); });

    h += '<div class="stage-box ' + (allDone ? 'completed' : stageOpen ? 'unlocked' : 'locked-stage') + '">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap">' +
        '<strong style="min-width:0;overflow-wrap:break-word">' + (stageOpen ? '' : '🔒 ') + esc(st.name) + '</strong>' +
        '<span class="chip ' + (allDone ? 'done' : stageOpen ? 'mid' : 'open') + '">' + (allDone ? 'Opanowany' : stageOpen ? 'Odblokowany' : '🔒 Zablokowany') + '</span>' +
      '</div>' +
      '<p class="small muted" style="margin:4px 0 10px">' + esc(st.desc) + '</p>' +
      '<div class="node-list">';

    tasksInStage.forEach(function(t) {
      var warmupSolved = countWarmupSolved(t.id);
      var basicSolved = countBasicSolved(t.id);
      var advSolved = countAdvSolved(t.id);
      var vSolved = warmupSolved + basicSolved + advSolved;
      var lessonOpen = isLessonUnlocked(t.id);
      var tutDone = !!(state.tutorialsDone && state.tutorialsDone[t.id]);
      var isMastered = isLessonCoreCompleted(t.id);

      var numMatch = String(t.title || '').match(/^(\d+\.\d+)\s*(.*)$/);
      var subNum = numMatch ? numMatch[1] : '';
      var cleanLessonTitle = numMatch ? numMatch[2] : t.title;

      var progCls = vSolved >= 5 ? ' done' : '';
      var sampleShortTitles = [0, 2, 4].map(function(i) {
        return t.variants[i] ? getVariantShortTitle(t, t.variants[i], i) : '';
      }).filter(Boolean).join(' · ');

      h += '<button type="button" class="node-item' + (!lessonOpen ? ' locked' : '') + '" data-act="openPathTask" data-id="' + t.id + '">' +
        '<div style="width:100%;min-width:0">' +
          '<div class="node-hdr-row">' +
            '<div class="node-title-wrap">' +
              (subNum ? '<span class="node-num-badge">' + (!lessonOpen ? '🔒 ' : isMastered ? '✅ ' : '') + esc(subNum) + '</span>' : '') +
              '<span class="node-title-txt">' + esc(cleanLessonTitle) + '</span>' +
            '</div>' +
            '<span class="node-prog-badge' + progCls + '">' + vSolved + '/' + t.variants.length + '</span>' +
          '</div>' +
          '<div class="node-meta">' +
            '<span>📖 Slajdy: <strong>' + (tutDone ? '✓ 4/4' : '0/4') + '</strong></span>' +
            '<span>· 🔥 Rozgrzewka: <strong>' + warmupSolved + '/2</strong></span>' +
            '<span>· 🎯 Zadania: <strong>' + (basicSolved + advSolved) + '/6</strong></span>' +
          '</div>' +
          (sampleShortTitles ? '<div class="small muted" style="margin-top:4px;font-size:11px;overflow-wrap:break-word">' + esc(sampleShortTitles) + '</div>' : '') +
        '</div>' +
      '</button>';
    });
    h += '</div></div>';
  });

  return h;
}

// ZAKŁADKA 2: DIAGNOZA (10 ZADAŃ Z PRZYCISKIEM POMIŃ)
function renderDiagTab() {
  if (state.diagIdx >= DIAG_QUESTIONS.length) {
    var targetStage = Math.max(1, Math.min(5, Math.floor(state.diagScore / 2) + 1));
    return '<section class="hero">' +
      '<h2>Diagnoza ukończona!</h2>' +
      '<p>Twój wyznaczony poziom: Etap ' + targetStage + ' (' + esc(STAGES[targetStage - 1].name) + ')</p>' +
      '<div class="sub-hero">Poprawne odpowiedzi: ' + state.diagScore + '/10 · Pominięte zadania: ' + state.diagSkipped.length + '</div>' +
      '<button class="btn ghost" data-act="applyDiag" data-stage="' + targetStage + '">🚀 Odblokuj Etap ' + targetStage + ' i przejdź do Ścieżki</button>' +
    '</section>' +
    '<div class="card">' +
      '<h2>Co zaktualizowaliśmy w Twoim profilu?</h2>' +
      '<p class="small muted">Wszystkie zagadnienia, które pominąłeś lub w których pojawił się błąd, trafiły automatycznie do Twojego <strong>Rejestru Luk</strong> w zakładce Rekrutacja.</p>' +
      '<div class="acts"><button class="btn sm" data-act="resetDiag">🔄 Rozwiąż Diagnozę od początku</button></div>' +
    '</div>';
  }

  var q = DIAG_QUESTIONS[state.diagIdx];
  var totalDiag = DIAG_QUESTIONS.length;
  var curDNum = state.diagIdx + 1;
  var dPct = Math.round((curDNum / totalDiag) * 100);
  return '<div class="card task-solve-card task-transition-enter">' +
    '<div class="compact-task-topbar">' +
      '<div class="compact-nav-row1">' +
        '<span class="sololearn-step-badge compact-step-btn">PYTANIE ' + curDNum + '/' + totalDiag + '</span>' +
        '<span class="sololearn-tier-badge">Etap ' + q.stage + '</span>' +
        '<button type="button" class="btn sm warn compact-top-btn" data-act="skipDiag">⏭ Pomiń</button>' +
      '</div>' +
      '<div class="compact-nav-row2">' +
        '<span class="compact-lesson-title" title="' + esc(q.title) + '">' + esc(q.title) + '</span>' +
        '<div class="compact-unlock-wrap">' +
          '<span class="sololearn-pct">' + dPct + '%</span>' +
          '<div class="compact-micro-bar"><i style="width:' + dPct + '%"></i></div>' +
        '</div>' +
      '</div>' +
    '</div>' +
    renderZeroScrollTaskCard(q, null, 'diag') +
    renderEditorWidget(null, 'submitDiag', q, null) +
  '</div>';
}

// ZAKŁADKA 3: WYZWANIA REKRUTACYJNE (15 ZADAŃ: EASY / MEDIUM / HARD) + REJESTR LUK
function diffBadge(diff) {
  var d = String(diff || 'easy').toLowerCase();
  if (d === 'hard') return { cls: 'open', lbl: '🔴 Hard' };
  if (d === 'medium') return { cls: 'mid', lbl: '🟡 Medium' };
  return { cls: 'done', lbl: '🟢 Easy' };
}

function renderLemurTab() {
  var tasksList = window.INTERVIEW_TASKS || window.LEMUR_TASKS || [];
  var openGapsCnt = state.gaps.filter(function(g) { return g.lvl <= 1; }).length;
  var nav = '<div class="subnav">' +
    '<button type="button" class="' + (state.lemurSubTab === 'tasks' ? 'active' : '') + '" data-act="backToLemurList" title="Kliknij, aby wrócić do listy wyzwań">🎯 Wyzwania Rekrutacyjne (' + tasksList.length + ')</button>' +
    '<button type="button" class="' + (state.lemurSubTab === 'gaps' ? 'active' : '') + '" data-act="lemurSub" data-sub="gaps">🧠 Twój Rejestr Luk (' + state.gaps.length + (openGapsCnt ? ' · 🔥' + openGapsCnt : '') + ')</button>' +
  '</div>';

  if (state.lemurSubTab === 'gaps') {
    var gh = nav + '<div class="card">' +
      '<h2>Twój Rejestr Luk (Spaced Repetition)</h2>' +
      '<p class="small muted">Każda wpadka na pułapce w zadaniach rekrutacyjnych lub pominięcie pytania w Diagnozie podbija licznik pułapek i obniża poziom luki, przesuwając ją na górę listy.</p>';

    var sortedGaps = state.gaps.slice().sort(function(a, b) {
      return (a.lvl - b.lvl) || ((b.hits || 0) - (a.hits || 0));
    });

    sortedGaps.forEach(function(g) {
      var badgeCls = g.lvl === 0 ? 'open' : g.lvl < 3 ? 'mid' : 'done';
      gh += '<div style="padding:12px 0;border-bottom:1px solid var(--line)">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap">' +
          '<strong>' + esc(g.name) + '</strong>' +
          '<div style="display:flex;gap:6px;align-items:center">' +
            '<span class="chip ' + badgeCls + '">Poziom ' + g.lvl + '/4 · Wpadki: ' + (g.hits || 0) + '</span>' +
            '<button class="btn sm" data-act="bumpGap" data-id="' + g.id + '">✓ Umiem (+1)</button>' +
          '</div>' +
        '</div>' +
        '<p class="small muted" style="margin:5px 0 0">' + esc(g.hint) + '</p>' +
      '</div>';
    });
    gh += '</div>';
    return gh;
  }

  if (state.lemurMode === 'solve') {
    var task = tasksList.find(function(x) { return x.id === state.activeLemurId; }) || tasksList[0];
    if (task && state.activeLemurId !== task.id) state.activeLemurId = task.id;
    var isSolved = !!state.completedLemur[task.id];
    var bdg = diffBadge(task.difficulty);
    var taskIdx = tasksList.findIndex(function(x) { return x.id === task.id; });
    var curNum = (taskIdx >= 0 ? taskIdx : 0) + 1;
    var pct = Math.round((curNum / tasksList.length) * 100);

    var topClickBanner = '<div class="subnav">' +
      '<button type="button" class="active lemur-back-banner" data-act="backToLemurList" title="Wróć do listy wyzwań rekrutacyjnych">' +
        '<span>🎯 Wyzwania rekrutacyjne (' + tasksList.length + ')</span>' +
        '<span class="lemur-back-sub">← Wróć do listy zadań</span>' +
      '</button>' +
      '<button type="button" class="' + (state.lemurSubTab === 'gaps' ? 'active' : '') + '" data-act="lemurSub" data-sub="gaps">🧠 Twój Rejestr Luk (' + state.gaps.length + (openGapsCnt ? ' · 🔥' + openGapsCnt : '') + ')</button>' +
    '</div>';

    return topClickBanner + '<div class="card task-solve-card task-transition-enter">' +
      '<div class="compact-task-topbar">' +
        '<div class="compact-nav-row1">' +
          '<button type="button" class="btn compact-top-btn back-path-btn" data-act="backToLemurList">← Lista</button>' +
          '<span class="sololearn-step-badge compact-step-btn">WYZWANIE ' + curNum + '/' + tasksList.length + '</span>' +
          '<span class="chip ' + bdg.cls + '">' + bdg.lbl + '</span>' +
        '</div>' +
        '<div class="compact-nav-row2">' +
          '<span class="compact-lesson-title" title="' + esc(task.title) + '">' + (isSolved ? '✅ ' : '') + esc(task.title) + '</span>' +
          '<div class="compact-unlock-wrap">' +
            '<span class="chip info" style="padding:1px 6px;font-size:10px">' + esc(task.categoryTag || 'Analiza SQL') + '</span>' +
            '<div class="compact-micro-bar"><i style="width:' + pct + '%"></i></div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      renderZeroScrollTaskCard(task, null, 'lemur') +
      renderEditorWidget(task.cols, 'checkLemurTask', task, null) +
    '</div>';
  }

  var solvedCnt = tasksList.filter(function(t) { return !!state.completedLemur[t.id]; }).length;
  var easyCnt = tasksList.filter(function(t) { return t.difficulty === 'easy'; }).length;
  var medCnt = tasksList.filter(function(t) { return t.difficulty === 'medium'; }).length;
  var hardCnt = tasksList.filter(function(t) { return t.difficulty === 'hard'; }).length;
  var curFilter = uiState.lemurDiffFilter || 'all';
  var filteredTasks = tasksList.filter(function(t) {
    return curFilter === 'all' || t.difficulty === curFilter;
  });

  var lh = nav + '<div class="card">' +
    '<h2>Wyzwania Rekrutacyjne SQL (Easy · Medium · Hard)</h2>' +
    '<p class="small muted">' + tasksList.length + ' praktycznych zadań rekrutacyjnych na dedykowanych tabelach biznesowych (HR, Finanse, Produkt SaaS, E-commerce). Ukończone: <strong>' + solvedCnt + '/' + tasksList.length + '</strong>.</p>' +
    '<div class="bar"><i style="width:' + Math.round((solvedCnt / (tasksList.length || 1)) * 100) + '%"></i></div>' +
    '<div class="diff-filters">' +
      '<button type="button" class="diff-pill ' + (curFilter === 'all' ? 'active' : '') + '" data-act="lemurFilter" data-diff="all">Wszystkie (' + tasksList.length + ')</button>' +
      '<button type="button" class="diff-pill ' + (curFilter === 'easy' ? 'active' : '') + '" data-act="lemurFilter" data-diff="easy">🟢 Easy (' + easyCnt + ')</button>' +
      '<button type="button" class="diff-pill ' + (curFilter === 'medium' ? 'active' : '') + '" data-act="lemurFilter" data-diff="medium">🟡 Medium (' + medCnt + ')</button>' +
      '<button type="button" class="diff-pill ' + (curFilter === 'hard' ? 'active' : '') + '" data-act="lemurFilter" data-diff="hard">🔴 Hard (' + hardCnt + ')</button>' +
    '</div>' +
    '<div class="node-list">';

  filteredTasks.forEach(function(lt) {
    var done = !!state.completedLemur[lt.id];
    var bdg = diffBadge(lt.difficulty);
    lh += '<button type="button" class="node-item" data-act="openLemurTask" data-id="' + lt.id + '">' +
      '<div>' +
        '<span class="node-title">' + (done ? '✅ ' : '🎯 ') + esc(lt.title) + '</span>' +
        '<div class="node-meta">' +
          '<span class="chip ' + bdg.cls + '">' + bdg.lbl + '</span>' +
          '<span class="chip info">' + esc(lt.categoryTag || 'SQL') + '</span>' +
          '<span>Tabele: <code>' + esc((lt.tables || []).join(', ')) + '</code></span>' +
          '<span>· Luka: <strong>' + esc(lt.gapName) + '</strong></span>' +
        '</div>' +
      '</div>' +
      '<span class="chip ' + (done ? 'done' : 'info') + '">' + (done ? 'Rozwiązane' : 'Zmierz się →') + '</span>' +
    '</button>';
  });

  lh += '</div></div>';
  return lh;
}

// ZAKŁADKA 4: BAZA DVDRENTAL + SANDBOX Z TESTEM SKŁADNI POSTGRESQL
function renderSchemaTab() {
  var h = '<div class="card">' +
    '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">' +
      '<div><h2 style="margin:0">Sandbox SQL & Test Składni PostgreSQL</h2>' +
      '<p class="small muted" style="margin:2px 0 0">Przetestuj dowolne zapytanie na bazie <code>dvdrental</code> albo sprawdź działanie naszego transpilera PostgreSQL.</p></div>' +
      '<button class="btn warn sm" data-act="loadPgTest">⚡ Wklej test składni PG (::numeric, ILIKE, DATE_TRUNC, INTERVAL, generate_series)</button>' +
    '</div>' +
    renderEditorWidget(['film', 'category', 'actor', 'customer', 'rental', 'payment', '::numeric', 'ILIKE', 'DATE_TRUNC', 'INTERVAL', 'generate_series'], 'runOnly') +
  '</div>';

  h += '<div class="card">' +
    '<h2>Schemat bazy danych dvdrental (10 tabel)</h2>' +
    '<p class="small muted">Dotknij karty tabeli, aby wyświetlić jej wiersze (<code>SELECT *</code>), lub kliknij pojedynczą nazwę kolumny, aby wstawić ją do edytora powyżej.</p>' +
    '<div class="node-list">';
  SCHEMA_META.forEach(function(m) {
    h += '<div class="node-item" data-act="previewTable" data-table="' + m.table + '">' +
      '<div><span class="node-title">📦 ' + esc(m.table) + '</span>' +
      '<span class="node-meta">' + esc(m.desc) + '</span>' +
      '<div class="schema-cols">' + m.cols.map(function(c) {
        var isKey = /_id$/i.test(c);
        var cls = 'helper-col-btn' + (isKey ? ' col-key-chip' : '');
        var ttl = isKey ? 'Klucz złączenia (JOIN ON)' : 'Wstaw kolumnę ' + esc(c);
        var lbl = (isKey ? '🔗 ' : '') + esc(c);
        return '<button type="button" class="' + cls + '" data-act="ins" data-val="' + esc(c) + '" data-insert-sql="' + esc(c) + '" title="' + ttl + '">' + lbl + '</button>';
      }).join('') + '</div></div>' +
      '<span class="chip info">SELECT *</span>' +
    '</div>';
  });
  h += '</div></div>';
  return h;
}

// MODAL LOGOWANIA TESTERÓW (NICK + 4-CYFROWY PIN)
var SUPABASE_SQL_SNIPPET = [
  'CREATE TABLE IF NOT EXISTS public.sql_profiles (',
  '  nick TEXT PRIMARY KEY,',
  '  pin_hash TEXT NOT NULL,',
  '  xp INTEGER DEFAULT 0,',
  '  streak INTEGER DEFAULT 1,',
  '  solved_count INTEGER DEFAULT 0,',
  '  state_json JSONB DEFAULT \'{}\'::jsonb,',
  '  updated_at TIMESTAMPTZ DEFAULT now()',
  ');',
  'ALTER TABLE public.sql_profiles ENABLE ROW LEVEL SECURITY;',
  'CREATE POLICY "Public test access" ON public.sql_profiles FOR ALL USING (true) WITH CHECK (true);'
].join('\n');

function renderOnboardingModal() {
  if (!uiState.onboardingOpen) return '';
  var idx = Math.max(0, Math.min(3, uiState.onboardingSlideIdx || 0));
  uiState.onboardingSlideIdx = idx;

  var slides = [
    {
      badge: 'Karta 1/4 · Wprowadzenie dla początkujących',
      title: '👋 Po co w ogóle jest SQL?',
      body:
        '<p class="small" style="font-size:13.5px;line-height:1.6">Wyobraź sobie, że firma ma gigantyczny arkusz z milionem zamówień albo filmów. W zwykłym Excelu taki plik zawiesza komputer.</p>' +
        '<div class="pwa-box">' +
          '<strong>📦 Baza danych = uporządkowany magazyn tabel</strong>' +
          '<p class="small muted" style="margin:4px 0 0">Zamiast jednego ciężkiego pliku dane leżą w przejrzystych tabelach (np. osobno filmy, osobno klienci, osobno płatności).</p>' +
        '</div>' +
        '<div class="pwa-box" style="margin-top:8px">' +
          '<strong>⚡ SQL = język prostych pytań do bazy</strong>' +
          '<p class="small muted" style="margin:4px 0 0">Wpisujesz krótkie pytanie po angielsku (np. <em>„pokaż tytuły filmów z tabeli film”</em>), a baza w <strong>1 sekundę</strong> zwraca gotowy raport!</p>' +
        '</div>'
    },
    {
      badge: 'Karta 2/4 · Budowa tabeli',
      title: '📊 Jak wygląda tabela w bazie danych?',
      body:
        '<p class="small" style="font-size:13px;line-height:1.55">Każda tabela ma nazwę (np. <code>film</code>) i składa się z pionowych <strong>kolumn</strong> oraz poziomych <strong>wierszy</strong>:</p>' +
        '<div style="overflow-x:auto; max-width:100%; margin:8px 0; border:1px solid var(--line); border-radius:8px;">' +
          '<table style="width:100%; font-size:11.5px; border-collapse:collapse;">' +
            '<thead><tr style="background:var(--surface);">' +
              '<th style="padding:6px 8px; text-align:left; border-bottom:1px solid var(--line);">film_id</th>' +
              '<th style="padding:6px 8px; text-align:left; border-bottom:1px solid var(--line);">title</th>' +
              '<th style="padding:6px 8px; text-align:left; border-bottom:1px solid var(--line);">rental_rate</th>' +
            '</tr></thead>' +
            '<tbody>' +
              '<tr><td style="padding:5px 8px; border-bottom:1px solid rgba(255,255,255,0.06);">1</td><td style="padding:5px 8px; border-bottom:1px solid rgba(255,255,255,0.06);">Academy Dinosaur</td><td style="padding:5px 8px; border-bottom:1px solid rgba(255,255,255,0.06);">0.99</td></tr>' +
              '<tr><td style="padding:5px 8px; border-bottom:1px solid rgba(255,255,255,0.06);">2</td><td style="padding:5px 8px; border-bottom:1px solid rgba(255,255,255,0.06);">Ace Goldfinger</td><td style="padding:5px 8px; border-bottom:1px solid rgba(255,255,255,0.06);">4.99</td></tr>' +
              '<tr><td style="padding:5px 8px;">3</td><td style="padding:5px 8px;">Adaptation Holes</td><td style="padding:5px 8px;">2.99</td></tr>' +
            '</tbody>' +
          '</table>' +
        '</div>' +
        '<ul class="tut-list" style="margin-top:6px">' +
          '<li><strong>Kolumna (pionowo):</strong> cecha obiektu, np. <code>title</code> (tytuł) lub <code>rental_rate</code> (cena).</li>' +
          '<li><strong>Wiersz (poziomo):</strong> jeden obiekt, np. pełne dane filmu <em>Academy Dinosaur</em>.</li>' +
        '</ul>'
    },
    {
      badge: 'Karta 3/4 · Twoje pierwsze słowa w SQL',
      title: '🚀 Twoje pierwsze zapytanie: SELECT i FROM',
      body:
        '<p class="small" style="font-size:13px;line-height:1.55">Każde podstawowe pytanie do bazy składa się z dwóch słów kluczowych pokolorowanych w stylu edytora <strong>DBeaver</strong>:</p>' +
        '<div class="theory-code" style="margin:8px 0;font-size:14px"><code>' + highlightSQL('SELECT title\nFROM film;') + '</code></div>' +
        '<div class="pwa-box">' +
          '<strong>1️⃣ <span class="sql-kw">FROM</span> film — Z KTÓREJ tabeli bierzesz dane?</strong>' +
          '<p class="small muted" style="margin:4px 0 0">Silnik bazy zawsze zaczyna od <code>FROM</code>: otwiera pudełko o nazwie <code>film</code>.</p>' +
        '</div>' +
        '<div class="pwa-box" style="margin-top:8px">' +
          '<strong>2️⃣ <span class="sql-kw">SELECT</span> title — KTÓRE kolumny chcesz zobaczyć?</strong>' +
          '<p class="small muted" style="margin:4px 0 0">Wybiera z otwartej tabeli tylko kolumnę <code>title</code> i wyświetla ją na ekranie. Średnik <code>;</code> na końcu oznacza „koniec pytania”.</p>' +
        '</div>'
    },
    {
      badge: 'Karta 4/4 · Nawigacja i pełny ekran PWA',
      title: '📱 Jak uczyć się wygodnie na telefonie?',
      body:
        '<ul class="tut-list" style="margin-bottom:8px">' +
          '<li><strong>Klikaj klocki nad edytorem:</strong> dotknij nazwy kolumny lub <code>SELECT</code> w pasku <em>SQL Quick-Bar</em>, aby wkleić ją bez pisania na klawiaturze.</li>' +
          '<li><strong>Zasada 5 z 8 zadań:</strong> każda lekcja ma 2 krótkie rozgrzewki (🔥 1–2) i 6 zadań (🎯 1–6). Rozwiąż <strong>5 z 8</strong>, aby odblokować kolejny temat!</li>' +
        '</ul>' +
        '<div class="pwa-box">' +
          '<strong>📲 Włącz pełny ekran bez pasków przeglądarki (PWA):</strong>' +
          '<p class="small" style="margin:6px 0 4px"><strong>🍏 iPhone (Safari):</strong> kliknij ikonę <strong>Udostępnij</strong> (kwadrat ze strzałką w górę na dole ekranu) → wybierz <strong>Dodaj do ekranu początkowego</strong>.</p>' +
          '<p class="small" style="margin:0"><strong>🤖 Android (Chrome):</strong> kliknij <strong>Menu ⋮</strong> (trzy kropki w prawym górnym rogu) → wybierz <strong>Zainstaluj aplikację</strong> (lub <em>Dodaj do ekranu głównego</em>).</p>' +
        '</div>'
    }
  ];

  var cur = slides[idx];
  var dotsHtml = '<div class="onboarding-dots">' + [0, 1, 2, 3].map(function(i) {
    return '<button type="button" class="onboarding-dot' + (i === idx ? ' active' : '') + '" data-act="goOnboardingSlide" data-idx="' + i + '" aria-label="Karta ' + (i + 1) + '"></button>';
  }).join('') + '</div>';

  return '<div class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="onbModalTitle">' +
    '<div class="modal-card onboarding-modal-card">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;gap:8px">' +
        '<span class="chip info">' + esc(cur.badge) + '</span>' +
        '<button type="button" class="btn sm" data-act="closeOnboarding">✕ Zamknij</button>' +
      '</div>' +
      dotsHtml +
      '<div class="onboarding-slide-body">' +
        '<h2 id="onbModalTitle" style="margin:2px 0 8px">' + esc(cur.title) + '</h2>' +
        cur.body +
      '</div>' +
      '<div class="acts" style="margin-top:14px;justify-content:space-between;border-top:1px solid var(--line);padding-top:12px">' +
        (idx > 0
          ? '<button type="button" class="btn sm" data-act="prevOnboardingSlide">← Wstecz</button>'
          : '<button type="button" class="btn sm" data-act="closeOnboarding">Pomiń samouczek</button>') +
        (idx < 3
          ? '<button type="button" class="btn primary" data-act="nextOnboardingSlide">Dalej (' + (idx + 1) + '/4) →</button>'
          : '<button type="button" class="btn success" data-act="closeOnboarding">🚀 Zaczynamy naukę SQL!</button>') +
      '</div>' +
    '</div>' +
  '</div>';
}

function renderAuthModal() {
  if (!uiState.authModalOpen) return '';
  var curNick = (state.userProfile && state.userProfile.nick) ? state.userProfile.nick : '';
  return '<div class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="authModalTitle">' +
    '<div class="modal-card">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:6px">' +
        '<span class="chip info">👥 Konto Testera · Android & iOS</span>' +
        '<button type="button" class="btn sm" data-act="closeAuthModal">✕ Pomiń</button>' +
      '</div>' +
      '<h2 id="authModalTitle" style="margin-top:4px">Dołącz do testów SQL Master!</h2>' +
      '<p class="small muted">Podaj swój <strong>Nick</strong> (np. Wojtek) oraz <strong>4-cyfrowy PIN</strong> (do odzyskania konta na innym telefonie i zapisu wyniku w Rankingu).</p>' +
      '<div style="margin-top:10px">' +
        '<label class="small" for="authNickInp">Twój Nick gracza (2–24 znaki)</label>' +
        '<input type="text" id="authNickInp" maxlength="24" autocomplete="username" placeholder="np. Wojtek" value="' + esc(curNick) + '">' +
      '</div>' +
      '<div style="margin-top:10px">' +
        '<label class="small" for="authPinInp">4-cyfrowy PIN (np. 1234)</label>' +
        '<input type="password" id="authPinInp" inputmode="numeric" pattern="[0-9]{4}" maxlength="4" placeholder="••••">' +
      '</div>' +
      (uiState.authError ? '<div class="fb-box trap" style="margin-top:10px"><strong>⚠️ Uwaga:</strong> <span class="small">' + esc(uiState.authError) + '</span></div>' : '') +
      '<div class="acts" style="margin-top:14px;justify-content:space-between">' +
        '<button type="button" class="btn primary" style="flex:1" data-act="submitAuthModal">🚀 Zapisz i wejdź do gry</button>' +
      '</div>' +
    '</div>' +
  '</div>';
}

// ZAKŁADKA 5: KONTO, RANKING SOLOLEARN, SUPABASE & AI
function renderProfileTab() {
  var totalPathVars = PATH_TASKS.reduce(function(acc, t) { return acc + t.variants.length; }, 0);
  var lemurList = window.INTERVIEW_TASKS || window.LEMUR_TASKS || [];
  var totalAllTasks = totalPathVars + DIAG_QUESTIONS.length + lemurList.length;
  var curNick = (state.userProfile && state.userProfile.nick) ? state.userProfile.nick : (state.nickname || 'Gość (niezalogowany)');
  var sbReady = isSupabaseConfigured();
  var board = getDisplayLeaderboard();

  var boardRows = board.map(function(row, idx) {
    var isMe = row.nick && curNick && row.nick.toLowerCase() === curNick.toLowerCase();
    var medal = idx === 0 ? '🥇 1' : idx === 1 ? '🥈 2' : idx === 2 ? '🥉 3' : String(idx + 1);
    return '<tr class="' + (isMe ? 'lb-me' : '') + '">' +
      '<td><strong>' + medal + '</strong></td>' +
      '<td><strong>' + esc(row.nick) + '</strong>' + (isMe ? ' <span class="chip done" style="font-size:10px;padding:1px 6px">Ty</span>' : '') + '</td>' +
      '<td>⚡ <strong>' + Number(row.xp || 0) + '</strong></td>' +
      '<td>🔥 ' + Number(row.streak || 1) + 'd</td>' +
      '<td>✅ ' + Number(row.solved_count || 0) + '</td>' +
    '</tr>';
  }).join('');

  return '<div class="card">' +
    '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">' +
      '<div>' +
        '<div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap">' +
          '<span class="chip ' + (state.userProfile ? 'done' : 'mid') + '">' + (state.userProfile ? '✅ Profil aktywny (Nick + PIN)' : '👤 Tryb gościa') + '</span>' +
          '<span class="chip info">📱 Wersja aplikacji: ' + esc(APP_VERSION) + '</span>' +
          '<button type="button" class="btn sm warn" data-act="forceRefreshApp">🔄 Odśwież do najnowszej wersji (' + esc(APP_VERSION) + ')</button>' +
        '</div>' +
        '<h2 style="margin:6px 0 2px">Gracz: ' + esc(curNick) + '</h2>' +
        '<p class="small muted" style="margin:0">XP: <strong>' + state.xp + '</strong> · Rozwiązane zadania: <strong>' + getTotalSolvedCount() + '</strong>' +
        (uiState.lastSyncTime ? ' · Ost. sync: <strong>' + esc(uiState.lastSyncTime) + '</strong>' : '') + '</p>' +
      '</div>' +
      '<div style="display:flex;gap:6px;flex-wrap:wrap">' +
        '<button type="button" class="btn sm primary" data-act="syncNow">🔄 Synchronizuj postęp teraz</button>' +
        '<button type="button" class="btn sm" data-act="openAuthModal">👤 Przełącz użytkownika (Nick + PIN)</button>' +
      '</div>' +
    '</div>' +
    '<div style="margin-top:12px;padding-top:12px;border-top:1px solid var(--line);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">' +
      '<div>' +
        '<strong>🔓 Tryb testerski (odblokuj wszystkie działy)</strong>' +
        '<p class="small muted" style="margin:2px 0 0">Pozwala właścicielowi projektu jednym kliknięciem testować dowolną lekcję oraz warianty 6–10 bez blokad.</p>' +
      '</div>' +
      '<button type="button" class="btn sm ' + (state.testerUnlockAll ? 'success' : '') + '" data-act="toggleTesterMode">' +
        (state.testerUnlockAll ? '🔓 Włączony (Kliknij, by włączyć blokady)' : '🔒 Wyłączony (Odblokuj wszystko)') +
      '</button>' +
    '</div>' +
  '</div>' +

  '<div class="card">' +
    '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:6px">' +
      '<h2 style="margin:0">🏆 Ranking Testerów (SoloLearn Leaderboard)</h2>' +
      '<span class="chip ' + (sbReady ? 'done' : 'info') + '">' +
        (sbReady ? '🟢 Ranking Chmurowy LIVE (Supabase)' : '📱 Ranking Lokalny / Demo') +
      '</span>' +
    '</div>' +
    '<p class="small muted">Wspólna tablica wyników znajomych testujących aplikację na Androidzie i iOS (projekt <code>SQLRanking</code> · tabela <code>public.sql_profiles</code>).</p>' +
    '<div class="tblwrap" style="max-height:320px">' +
      '<table><thead><tr><th>#</th><th>Nick</th><th>XP</th><th>Streak</th><th>Zadania</th></tr></thead>' +
      '<tbody>' + boardRows + '</tbody></table>' +
    '</div>' +
    '<details class="helper-fold" style="margin-top:12px"' + (!sbReady ? ' open' : '') + '>' +
      '<summary>☁️ Zaawansowane: własne połączenie Supabase (domyślnie aktywny serwer SQLRanking)</summary>' +
      '<p class="small muted" style="margin:6px 0">Aplikacja jest już na stałe połączona z produkcyjną bazą chmurową <code>SQLRanking</code>. Poniższe pola służą wyłącznie do ewentualnej podmiany adresu projektu:</p>' +
      '<div class="theory-code" style="margin-bottom:8px"><code>' + esc(SUPABASE_SQL_SNIPPET) + '</code></div>' +
      '<div class="acts" style="margin:0 0 10px">' +
        '<button type="button" class="btn sm" data-act="copySupabaseSql">📋 Kopiuj skrypt SQL do Supabase</button>' +
        (sbReady ? '<button type="button" class="btn sm primary" data-act="copyInviteLink">🔗 Kopiuj link zaproszenia dla znajomych</button>' : '') +
      '</div>' +
      '<label class="small" for="sbUrlInp">Supabase Project URL</label>' +
      '<input type="text" id="sbUrlInp" placeholder="https://twoj-projekt.supabase.co" value="' + esc(SUPABASE_CONFIG.url) + '">' +
      '<label class="small" for="sbKeyInp" style="display:block;margin-top:8px">Supabase Anon Public Key</label>' +
      '<input type="password" id="sbKeyInp" placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..." value="' + esc(SUPABASE_CONFIG.anonKey) + '">' +
      '<div class="acts">' +
        '<button type="button" class="btn primary sm" data-act="saveSupabaseConfig">💾 Zapisz połączenie Supabase i odśwież ranking</button>' +
      '</div>' +
    '</details>' +
  '</div>' +

  '<div class="card">' +
    '<h2>Konfiguracja Silnika AI (Tryb Hybrydowy)</h2>' +
    '<p class="small muted">Wszystkie ' + totalAllTasks + ' zadania na bazie <code>dvdrental</code> działają w 100% lokalnie i offline. Jeśli chcesz korzystać z podpowiedzi mentora AI, wybierz dostawcę:</p>' +
    '<label class="small">Dostawca AI</label>' +
    '<select id="aiProvSel">' +
      '<option value="gemini" ' + (state.aiProvider === 'gemini' ? 'selected' : '') + '>Google Gemini API (Darmowy klucz z Google AI Studio)</option>' +
      '<option value="claude" ' + (state.aiProvider === 'claude' ? 'selected' : '') + '>Claude Artifacts (Zalogowane konto Claude)</option>' +
      '<option value="offline" ' + (state.aiProvider === 'offline' ? 'selected' : '') + '>Tylko lokalny silnik SQL (100% Offline)</option>' +
    '</select>' +
    '<label class="small" style="display:block;margin-top:10px">Twój klucz API (zapisywany wyłącznie w pamięci Twojej przeglądarki)</label>' +
    '<input type="password" id="apiKeyInp" placeholder="AIzaSy..." value="' + esc(state.apiKey) + '">' +
    '<div class="acts"><button class="btn primary sm" data-act="saveConfig">Zapisz konfigurację</button></div>' +
  '</div>' +
  '<div class="card">' +
    '<h2>Kopia zapasowa postępów (.json)</h2>' +
    '<p class="small muted">Twój obecny stan: <strong>' + state.xp + ' XP</strong> · Rozwiązane warianty Ścieżki: <strong>' + Object.keys(state.completedVariants).length + '/' + totalPathVars + '</strong> · Zadania Rekrutacyjne: <strong>' + Object.keys(state.completedLemur).length + '/' + lemurList.length + '</strong>.</p>' +
    '<div class="acts">' +
      '<button class="btn sm primary" data-act="exportJson">⬇ Pobierz pełny backup (.json)</button>' +
    '</div>' +
  '</div>';
}

/* ==========================================================================
   9. OBSŁUGA ZDARZEŃ I AKCJI
   ========================================================================== */
function updateHeader() {
  var xpEl = document.getElementById('xpPill');
  var stEl = document.getElementById('streakPill');
  var bdg = document.getElementById('gapBdg');
  if (xpEl) xpEl.textContent = '⚡ ' + state.xp + ' XP';
  if (stEl) stEl.textContent = '🔥 ' + state.streak + 'd';
  var openGaps = state.gaps.filter(function(g) { return g.lvl <= 1; }).length;
  if (bdg) bdg.innerHTML = openGaps ? '<span class="bdg-cnt">' + openGaps + '</span>' : '';
}

function render() {
  document.documentElement.setAttribute('data-theme', state.theme || 'dark');
  updateHeader();
  var v = document.getElementById('view');
  if (!v) return;
  var mainHtml = currentTab === 'path' ? renderPathTab()
               : currentTab === 'diag' ? renderDiagTab()
               : currentTab === 'lemur' ? renderLemurTab()
               : currentTab === 'schema' ? renderSchemaTab()
               : renderProfileTab();
  v.innerHTML = mainHtml + renderOnboardingModal() + renderAuthModal();

  document.querySelectorAll('.tab').forEach(function(b) {
    if (b.dataset.tab === currentTab) b.setAttribute('aria-current', 'page');
    else b.removeAttribute('aria-current');
  });

  var code = document.getElementById('answer');
  if (code) {
    code.addEventListener('scroll', function() {
      var hl = document.getElementById('sqlhl');
      var gut = document.getElementById('sqlgut');
      if (hl) { hl.scrollTop = code.scrollTop; hl.scrollLeft = code.scrollLeft; }
      if (gut) { gut.scrollTop = code.scrollTop; }
    });
    sqlUpdate();
  }
}
window.render = render;

// Obsługa gestów przesuwania (swipe) dla Samouczka Powitalnego i Slajdów Lekcji na telefonie
var _touchStartX = null;
var _touchStartY = null;
document.addEventListener('touchstart', function(e) {
  if (!e.touches || e.touches.length !== 1) return;
  if (e.target.closest('.onboarding-modal-card') || e.target.closest('.tut-card-inner')) {
    _touchStartX = e.touches[0].clientX;
    _touchStartY = e.touches[0].clientY;
  } else {
    _touchStartX = null;
    _touchStartY = null;
  }
}, { passive: true });

document.addEventListener('touchend', function(e) {
  if (_touchStartX === null || !e.changedTouches || !e.changedTouches.length) return;
  var dx = e.changedTouches[0].clientX - _touchStartX;
  var dy = e.changedTouches[0].clientY - _touchStartY;
  _touchStartX = null;
  _touchStartY = null;
  if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy) * 1.3) return;
  if (uiState.onboardingOpen) {
    if (dx < 0 && uiState.onboardingSlideIdx < 3) {
      uiState.onboardingSlideIdx++;
      render();
    } else if (dx > 0 && uiState.onboardingSlideIdx > 0) {
      uiState.onboardingSlideIdx--;
      render();
    }
  } else if (currentTab === 'path' && state.pathMode === 'tutorial') {
    if (dx < 0 && uiState.tutorialSlideIdx < 3) {
      uiState.tutorialSlideIdx++;
      render();
    } else if (dx > 0 && uiState.tutorialSlideIdx > 0) {
      uiState.tutorialSlideIdx--;
      render();
    }
  }
}, { passive: true });

function scrollToResult() {
  setTimeout(function() {
    var resTarget = document.querySelector('.val-checklist') ||
                    document.querySelector('.fb-box') ||
                    document.querySelector('.tblwrap') ||
                    document.querySelector('.out-card');
    if (resTarget && typeof resTarget.scrollIntoView === 'function') {
      resTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, 40);
}

// Zapamiętywanie stanu rozwinięcia/zwinięcia podglądu tabel oraz teorii przez użytkownika
document.addEventListener('toggle', function(e) {
  if (e.target && e.target.classList) {
    if (e.target.classList.contains('helper-fold')) {
      uiState.schemaBoxOpen = e.target.open;
    } else if (e.target.classList.contains('theory-box')) {
      uiState.theoryBoxOpen = e.target.open;
    } else if (e.target.classList.contains('example-output-fold')) {
      uiState.exampleOutOpen = e.target.open;
    }
  }
}, true);

document.addEventListener('input', function(e) {
  if (e.target.id === 'answer') {
    state.editorCode = e.target.value;
    if (!state.editorCode.trim() && Array.isArray(uiState.warmupUsedBlocks) && uiState.warmupUsedBlocks.length > 0) {
      uiState.warmupUsedBlocks = [];
      document.querySelectorAll('.puzzle-block-btn.used').forEach(function(b) {
        b.classList.remove('used');
        b.disabled = false;
      });
    }
    if (lastExecResult && lastExecResult.errorLine) lastExecResult.errorLine = 0;
    sqlUpdate();
    saveState();
  }
});

document.addEventListener('click', async function(e) {
  var liveTa = document.getElementById('answer');
  if (liveTa) {
    state.editorCode = liveTa.value;
  }

  // Zamknij rozwijaną listę zadań, jeśli kliknięto poza dropdown
  if (uiState.taskDropdownOpen && !e.target.closest('.task-dropdown-menu') && !e.target.closest('[data-act="toggleTaskDropdown"]')) {
    uiState.taskDropdownOpen = false;
    if (!e.target.closest('[data-act]') && !e.target.closest('[data-insert-sql]')) {
      render();
      return;
    }
  }

  var insEl = e.target.closest('[data-insert-sql]');
  if (insEl && !e.target.closest('[data-act="previewTable"]')) {
    insertAtCursor(insEl.getAttribute('data-insert-sql'));
    return;
  }

  var el = e.target.closest('[data-act]');
  if (!el) return;
  var act = el.dataset.act;

  if (act === 'tab') {
    currentTab = el.dataset.tab;
    lastFeedback = null;
    lastExecResult = null;
    lastExpectedResult = null;
    lastChecklist = null;
    resetTaskContextUi();
    if (currentTab === 'diag' && state.diagIdx < DIAG_QUESTIONS.length) {
      state.editorCode = '';
    } else if (currentTab === 'profile') {
      fetchLeaderboard();
    }
    render();
    window.scrollTo(0, 0);
  }
  else if (act === 'setCtxTab') {
    uiState.taskCtxTab = el.dataset.ctx || 'task';
    render();
  }
  else if (act === 'tapPuzzleBlock') {
    var bid = el.dataset.bid || '';
    var sqlChunk = el.dataset.sql || '';
    if (!Array.isArray(uiState.warmupUsedBlocks)) uiState.warmupUsedBlocks = [];
    if (bid && uiState.warmupUsedBlocks.indexOf(bid) === -1) {
      uiState.warmupUsedBlocks.push(bid);
    }
    el.classList.add('used');
    el.disabled = true;
    insertAtCursor(sqlChunk, true);
  }
  else if (act === 'theme') {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    saveState();
    render();
  }
  else if (act === 'ins') {
    insertAtCursor(el.dataset.val);
  }
  else if (act === 'stepHint') {
    uiState.hintStep = ((uiState.hintStep || 0) + 1) % 4;
    render();
  }
  else if (act === 'toggleSyntaxTip') {
    uiState.syntaxTipOpen = !uiState.syntaxTipOpen;
    render();
  }
  else if (act === 'undoToken') {
    var taUndo = document.getElementById('answer');
    var curCode = taUndo ? taUndo.value : (state.editorCode || '');
    if (Array.isArray(uiState.editorUndoStack) && uiState.editorUndoStack.length > 0) {
      state.editorCode = uiState.editorUndoStack.pop();
    } else if (curCode) {
      state.editorCode = curCode.replace(/\s*\S+\s*$/, '');
    }
    if (Array.isArray(uiState.warmupUsedBlocks) && uiState.warmupUsedBlocks.length > 0) {
      var poppedBid = uiState.warmupUsedBlocks.pop();
      if (!state.editorCode.trim()) uiState.warmupUsedBlocks = [];
      var btnToUnlock = document.querySelector('.puzzle-block-btn[data-bid="' + poppedBid + '"]');
      if (btnToUnlock && uiState.warmupUsedBlocks.indexOf(poppedBid) === -1) {
        btnToUnlock.classList.remove('used');
        btnToUnlock.disabled = false;
      }
      if (!state.editorCode.trim()) {
        document.querySelectorAll('.puzzle-block-btn.used').forEach(function(b) {
          b.classList.remove('used');
          b.disabled = false;
        });
      }
    }
    if (taUndo) {
      taUndo.value = state.editorCode;
    }
    if (lastExecResult && lastExecResult.errorLine) lastExecResult.errorLine = 0;
    sqlUpdate();
    saveState();
  }
  else if (act === 'clearEd') {
    if (state.editorCode) {
      if (!Array.isArray(uiState.editorUndoStack)) uiState.editorUndoStack = [];
      uiState.editorUndoStack.push(state.editorCode);
    }
    state.editorCode = '';
    uiState.warmupUsedBlocks = [];
    lastExecResult = null;
    lastExpectedResult = null;
    lastFeedback = null;
    lastChecklist = null;
    saveState();
    render();
  }
  else if (act === 'runOnly') {
    lastExecResult = await runQuery(state.editorCode);
    lastExpectedResult = null;
    lastFeedback = null;
    lastChecklist = null;
    render();
    scrollToResult();
  }
  else if (act === 'peekTable') {
    var tName = el.dataset.table;
    lastExecResult = await runQuery('SELECT * FROM ' + tName + ' LIMIT 5;');
    lastExpectedResult = null;
    lastChecklist = null;
    lastFeedback = { type: 'warn', title: '👁 Podgląd tabeli ' + tName + ' (pierwsze 5 wierszy)', msg: 'Twój kod w edytorze pozostał bez zmian.' };
    render();
    scrollToResult();
  }
  else if (act === 'openOnboarding') {
    uiState.onboardingOpen = true;
    uiState.onboardingSlideIdx = 0;
    render();
  }
  else if (act === 'closeOnboarding') {
    uiState.onboardingOpen = false;
    try { localStorage.setItem(ONBOARDING_KEY, '1'); } catch (err) {}
    render();
  }
  else if (act === 'nextOnboardingSlide') {
    uiState.onboardingSlideIdx = Math.min(3, (uiState.onboardingSlideIdx || 0) + 1);
    render();
  }
  else if (act === 'prevOnboardingSlide') {
    uiState.onboardingSlideIdx = Math.max(0, (uiState.onboardingSlideIdx || 0) - 1);
    render();
  }
  else if (act === 'goOnboardingSlide') {
    uiState.onboardingSlideIdx = Math.max(0, Math.min(3, Number(el.dataset.idx) || 0));
    render();
  }
  else if (act === 'inspectClause') {
    var clKey = el.dataset.clause || 'SELECT';
    uiState.selectedClause = clKey;
    uiState.clickedClauses[clKey] = true;
    render();
  }
  else if (act === 'openPathTask') {
    var targetId = el.dataset.id;
    if (!isLessonUnlocked(targetId)) {
      toast('🔒 Zablokowane! Ukończ najpierw co najmniej 5 zadań (🔥 Rozgrzewka 1–2 oraz 🎯 Zadanie 1–3) w poprzedniej pod-lekcji.');
      return;
    }
    state.activeTaskId = targetId;
    var t = PATH_TASKS.find(function(x) { return x.id === state.activeTaskId; });
    state.activeVariantIdx = t ? getFirstUnsolvedStepIdx(t) : 0;
    resetTaskContextUi();
    uiState.tutorialSlideIdx = 0;
    uiState.selectedClause = null;
    uiState.quizSelected = null;
    uiState.quizPassed = !!(state.tutorialsDone && state.tutorialsDone[targetId]);
    // Przy pierwszym wejściu w lekcję otwórz slajdy teorii SoloLearn (1-4)
    state.pathMode = (state.tutorialsDone && state.tutorialsDone[targetId]) ? 'solve' : 'tutorial';
    if (t) {
      state.editorCode = '';
    }
    lastExecResult = null;
    lastExpectedResult = null;
    lastFeedback = null;
    lastChecklist = null;
    saveState();
    render();
    window.scrollTo(0, 0);
  }
  else if (act === 'continuePath') {
    // Znajdź pierwszą odblokowaną, jeszcze nieukończoną lekcję lub aktywną
    var nextTask = PATH_TASKS.find(function(pt) {
      return isLessonUnlocked(pt.id) && !isLessonCoreCompleted(pt.id);
    }) || PATH_TASKS.find(function(pt) { return pt.id === state.activeTaskId && isLessonUnlocked(pt.id); }) || PATH_TASKS[0];
    state.activeTaskId = nextTask.id;
    state.activeVariantIdx = getFirstUnsolvedStepIdx(nextTask);
    resetTaskContextUi();
    uiState.tutorialSlideIdx = 0;
    uiState.selectedClause = null;
    uiState.quizSelected = null;
    uiState.quizPassed = !!(state.tutorialsDone && state.tutorialsDone[nextTask.id]);
    state.pathMode = (state.tutorialsDone && state.tutorialsDone[nextTask.id]) ? 'solve' : 'tutorial';
    state.editorCode = '';
    lastExecResult = null;
    lastExpectedResult = null;
    lastFeedback = null;
    lastChecklist = null;
    saveState();
    render();
    window.scrollTo(0, 0);
  }
  else if (act === 'openTutorialSlides') {
    uiState.tutorialSlideIdx = 0;
    uiState.selectedClause = null;
    uiState.quizSelected = null;
    uiState.quizPassed = !!(state.tutorialsDone && state.tutorialsDone[state.activeTaskId]);
    state.pathMode = 'tutorial';
    render();
    window.scrollTo(0, 0);
  }
  else if (act === 'setSqlAnimStep') {
    clearInterval(window._sqlAnimTimer);
    uiState.sqlAnimRunning = false;
    var stepNum = Math.max(1, Math.min(SQL_PIPELINE_SIM_STEPS.length, Number(el.dataset.step) || 1));
    uiState.sqlAnimStep = stepNum;
    uiState.clickedClauses['sim_' + stepNum] = true;
    render();
  }
  else if (act === 'runSqlAnim') {
    clearInterval(window._sqlAnimTimer);
    uiState.sqlAnimRunning = true;
    uiState.sqlAnimStep = 1;
    render();
    window._sqlAnimTimer = setInterval(function() {
      if (uiState.sqlAnimStep < SQL_PIPELINE_SIM_STEPS.length) {
        uiState.sqlAnimStep++;
        render();
      } else {
        clearInterval(window._sqlAnimTimer);
        uiState.sqlAnimRunning = false;
        render();
      }
    }, 1400);
  }
  else if (act === 'prevSlide') {
    clearInterval(window._sqlAnimTimer);
    uiState.sqlAnimRunning = false;
    uiState.tutorialSlideIdx = Math.max(0, (uiState.tutorialSlideIdx || 0) - 1);
    render();
    window.scrollTo(0, 0);
  }
  else if (act === 'nextSlide') {
    clearInterval(window._sqlAnimTimer);
    uiState.sqlAnimRunning = false;
    uiState.tutorialSlideIdx = Math.min(3, (uiState.tutorialSlideIdx || 0) + 1);
    render();
    window.scrollTo(0, 0);
  }
  else if (act === 'goToSlide') {
    clearInterval(window._sqlAnimTimer);
    uiState.sqlAnimRunning = false;
    uiState.tutorialSlideIdx = Math.max(0, Math.min(3, Number(el.dataset.idx) || 0));
    render();
    window.scrollTo(0, 0);
  }
  else if (act === 'pickQuizOpt') {
    var curLesson = PATH_TASKS.find(function(x) { return x.id === state.activeTaskId; }) || PATH_TASKS[0];
    var slides = getLessonSlides(curLesson);
    var lastSlide = slides[slides.length - 1];
    var picked = Number(el.dataset.opt);
    uiState.quizSelected = picked;
    if (lastSlide && lastSlide.quiz && picked === lastSlide.quiz.correct) {
      uiState.quizPassed = true;
      if (!state.tutorialsDone[curLesson.id]) {
        state.tutorialsDone[curLesson.id] = true;
        state.xp += 15;
        saveState();
        syncProfileToCloud(true);
        toast('🎉 Teoria zaliczona! +15 XP');
      }
    }
    render();
  }
  else if (act === 'finishTutorial') {
    clearInterval(window._sqlAnimTimer);
    uiState.sqlAnimRunning = false;
    state.pathMode = 'solve';
    var fTask = PATH_TASKS.find(function(x) { return x.id === state.activeTaskId; }) || PATH_TASKS[0];
    if (!isStepUnlocked(fTask, state.activeVariantIdx)) {
      state.activeVariantIdx = getFirstUnsolvedStepIdx(fTask);
    }
    resetTaskContextUi();
    if (!state.editorCode) {
      state.editorCode = '';
    }
    saveState();
    render();
    window.scrollTo(0, 0);
  }
  else if (act === 'backToPathList') {
    clearInterval(window._sqlAnimTimer);
    uiState.sqlAnimRunning = false;
    state.pathMode = 'list';
    resetTaskContextUi();
    lastExecResult = null;
    lastExpectedResult = null;
    lastFeedback = null;
    lastChecklist = null;
    saveState();
    render();
    window.scrollTo(0, 0);
  }
  else if (act === 'pickVariant') {
    var reqIdx = Number(el.dataset.idx) || 0;
    var tVar = PATH_TASKS.find(function(x) { return x.id === state.activeTaskId; }) || PATH_TASKS[0];
    if (!isStepUnlocked(tVar, reqIdx)) {
      var lockMsg = 'Rozwiąż najpierw poprzednie zadanie, aby odblokować ten krok!';
      toast('🔒 ' + lockMsg);
      lastFeedback = { type: 'warn', title: '🔒 Ten krok jest jeszcze zablokowany', msg: lockMsg };
      render();
      return;
    }
    state.activeVariantIdx = reqIdx;
    uiState.taskDropdownOpen = false;
    resetTaskContextUi();
    state.editorCode = '';
    lastExecResult = null;
    lastExpectedResult = null;
    lastFeedback = null;
    lastChecklist = null;
    saveState();
    triggerStepFlash();
    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  else if (act === 'toggleTaskDropdown') {
    uiState.taskDropdownOpen = !uiState.taskDropdownOpen;
    render();
  }
  else if (act === 'prevStep') {
    if (state.activeVariantIdx > 0) {
      state.activeVariantIdx--;
      uiState.taskDropdownOpen = false;
      resetTaskContextUi();
      state.editorCode = '';
      lastExecResult = null;
      lastExpectedResult = null;
      lastFeedback = null;
      lastChecklist = null;
      saveState();
      triggerStepFlash();
      render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
  else if (act === 'nextStep') {
    var curTNext = PATH_TASKS.find(function(x) { return x.id === state.activeTaskId; }) || PATH_TASKS[0];
    var nextIdx = state.activeVariantIdx + 1;
    if (nextIdx < curTNext.variants.length) {
      if (!isStepUnlocked(curTNext, nextIdx)) {
        toast('🔒 Następne zadanie jest jeszcze zablokowane. Rozwiąż najpierw bieżące zadanie!');
        return;
      }
      state.activeVariantIdx = nextIdx;
      uiState.taskDropdownOpen = false;
      resetTaskContextUi();
      state.editorCode = '';
      lastExecResult = null;
      lastExpectedResult = null;
      lastFeedback = null;
      lastChecklist = null;
      saveState();
      triggerStepFlash();
      render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
  else if (act === 'jumpToVariant') {
    var reqIdxJump = Number(el.dataset.vidx !== undefined ? el.dataset.vidx : el.dataset.idx) || 0;
    var curTJump = PATH_TASKS.find(function(x) { return x.id === state.activeTaskId; }) || PATH_TASKS[0];
    if (!isStepUnlocked(curTJump, reqIdxJump)) {
      var lockMsgJump = 'Rozwiąż najpierw poprzednie zadania, aby odblokować to zadanie!';
      toast('🔒 ' + lockMsgJump);
      lastFeedback = { type: 'warn', title: '🔒 Ten krok jest jeszcze zablokowany', msg: lockMsgJump };
      render();
      return;
    }
    state.activeVariantIdx = reqIdxJump;
    uiState.taskDropdownOpen = false;
    resetTaskContextUi();
    state.editorCode = '';
    lastExecResult = null;
    lastExpectedResult = null;
    lastFeedback = null;
    lastChecklist = null;
    saveState();
    triggerStepFlash();
    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  else if (act === 'nextTaskStep') {
    var curTaskStep = PATH_TASKS.find(function(x) { return x.id === state.activeTaskId; }) || PATH_TASKS[0];
    var nextStepIdx = (state.activeVariantIdx + 1);
    if (nextStepIdx < curTaskStep.variants.length) {
      state.activeVariantIdx = nextStepIdx;
      uiState.taskDropdownOpen = false;
      resetTaskContextUi();
      state.editorCode = '';
      lastExecResult = null;
      lastExpectedResult = null;
      lastFeedback = null;
      lastChecklist = null;
      saveState();
      triggerStepFlash();
      render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
  else if (act === 'nextLessonAfterComplete') {
    var curLessonIdx2 = PATH_TASKS.findIndex(function(x) { return x.id === state.activeTaskId; });
    if (curLessonIdx2 >= 0 && curLessonIdx2 + 1 < PATH_TASKS.length) {
      var nextL = PATH_TASKS[curLessonIdx2 + 1];
      state.activeTaskId = nextL.id;
      state.activeVariantIdx = getFirstUnsolvedStepIdx(nextL);
      uiState.taskDropdownOpen = false;
      resetTaskContextUi();
      uiState.tutorialSlideIdx = 0;
      uiState.selectedClause = null;
      uiState.quizSelected = null;
      uiState.quizPassed = !!(state.tutorialsDone && state.tutorialsDone[nextL.id]);
      state.pathMode = (state.tutorialsDone && state.tutorialsDone[nextL.id]) ? 'solve' : 'tutorial';
      state.editorCode = '';
      lastExecResult = null;
      lastExpectedResult = null;
      lastFeedback = null;
      lastChecklist = null;
      saveState();
      render();
      window.scrollTo(0, 0);
    } else {
      state.pathMode = 'list';
      uiState.taskDropdownOpen = false;
      resetTaskContextUi();
      lastExecResult = null;
      lastExpectedResult = null;
      lastFeedback = null;
      lastChecklist = null;
      saveState();
      render();
      window.scrollTo(0, 0);
    }
  }
  else if (act === 'shuffleVariant') {
    var curTask = PATH_TASKS.find(function(x) { return x.id === state.activeTaskId; }) || PATH_TASKS[0];
    var unlockedIndices = [];
    for (var ui = 0; ui < curTask.variants.length; ui++) {
      if (isStepUnlocked(curTask, ui)) unlockedIndices.push(ui);
    }
    var availLen = unlockedIndices.length || 1;
    var nextIdx = unlockedIndices[Math.floor(Math.random() * availLen)] || 0;
    if (availLen > 1 && nextIdx === state.activeVariantIdx) {
      var curPos = unlockedIndices.indexOf(nextIdx);
      nextIdx = unlockedIndices[(curPos + 1) % availLen];
    }
    state.activeVariantIdx = nextIdx;
    resetTaskContextUi();
    state.editorCode = '';
    lastExecResult = null;
    lastExpectedResult = null;
    lastChecklist = null;
    lastFeedback = { type: 'warn', title: '🎲 Wylosowano odblokowane ' + getStepSwitchLabel(nextIdx, curTask.variants.length), msg: 'Zmieniliśmy tabelę lub warunki zadania. Napisz nowe zapytanie!' };
    saveState();
    triggerStepFlash();
    render();
  }
  else if (act === 'checkPathTask') {
    var task = PATH_TASKS.find(function(t) { return t.id === state.activeTaskId; }) || PATH_TASKS[0];
    var vIdx = state.activeVariantIdx % task.variants.length;
    var variant = task.variants[vIdx];
    lastExecResult = await runQuery(state.editorCode);
    var expRes = await runQuery(variant.sol);
    if (expRes && !expRes.error && expRes.columns) {
      expectedOutputCache[String(variant.sol || '').trim()] = expRes;
    }
    var cmp = compareResults(lastExecResult, expRes, variant.order);
    lastChecklist = buildValidationChecklist(lastExecResult, expRes, variant.order);
    if (cmp.ok) {
      lastExpectedResult = null;
      var wasCoreUnlocked = isLessonCoreCompleted(task.id);
      var vKey = getVariantKey(task, vIdx);
      var isWarmStep = variant.tier === 'warmup' || vIdx < 2;
      if (!state.completedVariants[vKey]) {
        state.completedVariants[vKey] = true;
        state.xp += isWarmStep ? 10 : 15;
      }
      var coreAfter = isLessonCoreCompleted(task.id);
      var unlockBonusMsg = '';
      if (coreAfter) {
        if (!state.completedTasks[task.id]) {
          state.completedTasks[task.id] = true;
          state.xp += 15;
        }
        // Sprawdź czy cały etap ma ukończone lekcje podstawowe, by podbić unlockedStage
        var stageLessons = PATH_TASKS.filter(function(pt) { return pt.stage === task.stage; });
        var allStageBasicDone = stageLessons.every(function(pt) { return isLessonCoreCompleted(pt.id); });
        if (allStageBasicDone && task.stage >= state.unlockedStage && state.unlockedStage < 5) {
          state.unlockedStage = task.stage + 1;
        }
        if (!wasCoreUnlocked) {
          unlockBonusMsg = '\n🔓 Brawo! Rozwiązałeś 5 z 8 zadań w tej pod-lekcji — odblokowałeś Zadania 4–6 oraz kolejną pod-lekcję na Mapie Ścieżki!';
          toast('🔓 Odblokowano kolejną pod-lekcję (5/8 zadań)!');
        }
      }
      if (vIdx + 1 < task.variants.length) {
        unlockBonusMsg += '\n👉 Odblokowano kolejny krok: ' + getStepSwitchLabel(vIdx + 1, task.variants.length) + '. Kliknij zielony przycisk poniżej!';
      } else {
        unlockBonusMsg += '\n🏆 Wszystkie 8 zadań w tej pod-lekcji zostały ukończone!';
      }
      var curStepLbl = getStepSwitchLabel(vIdx, task.variants.length);
      lastFeedback = { type: 'ok', title: '✅ ' + curStepLbl + ' zaliczone! (+' + (isWarmStep ? 10 : 15) + ' XP)', msg: cmp.msg + unlockBonusMsg };
      saveState();
      syncProfileToCloud(true);
    } else {
      lastExpectedResult = lastExecResult.error ? null : expRes;
      var pathTrap = task.detectTrap ? task.detectTrap(state.editorCode, lastExecResult) : null;
      if (pathTrap && task.gapId) registerGapTrap(task.gapId, task.title, pathTrap);
      var pathErrMsg = lastExecResult.error
        ? cmp.msg
        : (pathTrap ? pathTrap : 'Odpowiedź nie pasuje do wzorca. Sprawdź 3-punktową checklistę walidacji oraz porównaj swój wynik z wzorcem poniżej.');
      lastFeedback = { type: 'trap', title: '❌ Wynik różni się od wzorca', msg: pathErrMsg };
    }
    render();
    scrollToResult();
  }
  else if (act === 'showSolution') {
    var task2 = PATH_TASKS.find(function(t) { return t.id === state.activeTaskId; }) || PATH_TASKS[0];
    var variant2 = task2.variants[state.activeVariantIdx % task2.variants.length];
    state.editorCode = formatSqlPretty(variant2.sol);
    lastExecResult = await runQuery(variant2.sol);
    lastExpectedResult = null;
    lastChecklist = buildValidationChecklist(lastExecResult, lastExecResult, variant2.order);
    lastFeedback = { type: 'warn', title: '💡 Wczytano wzorcowe rozwiązanie', msg: 'Przeanalizuj kod, a następnie przełącz się na kolejne zadanie, aby napisać podobne zapytanie samodzielnie.' };
    saveState();
    render();
    scrollToResult();
  }
  else if (act === 'submitDiag') {
    var dq = DIAG_QUESTIONS[state.diagIdx];
    lastExecResult = await runQuery(state.editorCode);
    var dExp = await runQuery(dq.sol);
    if (dExp && !dExp.error && dExp.columns) {
      expectedOutputCache[String(dq.sol || '').trim()] = dExp;
    }
    var dCmp = compareResults(lastExecResult, dExp, dq.order);
    lastChecklist = buildValidationChecklist(lastExecResult, dExp, dq.order);
    if (dCmp.ok) {
      state.diagScore++;
      state.xp += 15;
      toast('Dobrze! Pytanie ' + (state.diagIdx + 1) + '/10 zaliczone.');
      state.diagIdx++;
      resetTaskContextUi();
      lastExecResult = null;
      lastExpectedResult = null;
      lastFeedback = null;
      lastChecklist = null;
      if (state.diagIdx < DIAG_QUESTIONS.length) {
        state.editorCode = '';
      }
      saveState();
      syncProfileToCloud(true);
      render();
    } else {
      lastExpectedResult = lastExecResult.error ? null : dExp;
      var diagErrMsg = lastExecResult.error
        ? dCmp.msg
        : 'Odpowiedź nie pasuje do wzorca. Sprawdź 3-punktową checklistę walidacji oraz porównaj swój wynik z wzorcem poniżej.';
      lastFeedback = { type: 'trap', title: 'Wynik niepoprawny', msg: diagErrMsg };
      render();
      scrollToResult();
    }
  }
  else if (act === 'skipDiag') {
    var sq = DIAG_QUESTIONS[state.diagIdx];
    state.diagSkipped.push(sq.lvl);
    registerGapTrap(sq.gap, sq.title, 'Zagadnienie pominięte podczas Diagnozy.');
    state.diagIdx++;
    resetTaskContextUi();
    lastExecResult = null;
    lastExpectedResult = null;
    lastFeedback = null;
    lastChecklist = null;
    if (state.diagIdx < DIAG_QUESTIONS.length) {
      state.editorCode = '';
    }
    saveState();
    render();
  }
  else if (act === 'applyDiag') {
    var st = Number(el.dataset.stage) || 1;
    state.unlockedStage = st;
    state.diagDone = true;
    PATH_TASKS.forEach(function(pt) {
      if (pt.stage < st) state.completedTasks[pt.id] = true;
    });
    var firstInStage = PATH_TASKS.find(function(pt) { return pt.stage === st; }) || PATH_TASKS[0];
    state.activeTaskId = firstInStage.id;
    state.pathMode = 'list';
    currentTab = 'path';
    saveState();
    syncProfileToCloud(true);
    render();
    toast('Odblokowano Etap ' + st + ' w Ścieżce!');
  }
  else if (act === 'resetDiag') {
    state.diagIdx = 0;
    state.diagScore = 0;
    state.diagSkipped = [];
    resetTaskContextUi();
    state.editorCode = '';
    lastExecResult = null;
    lastExpectedResult = null;
    lastFeedback = null;
    lastChecklist = null;
    saveState();
    render();
  }
  else if (act === 'lemurSub') {
    state.lemurSubTab = el.dataset.sub;
    state.lemurMode = 'list';
    lastExecResult = null;
    lastExpectedResult = null;
    lastFeedback = null;
    lastChecklist = null;
    saveState();
    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  else if (act === 'lemurFilter') {
    uiState.lemurDiffFilter = el.dataset.diff || 'all';
    render();
  }
  else if (act === 'openLemurTask') {
    state.activeLemurId = el.dataset.id;
    state.lemurMode = 'solve';
    resetTaskContextUi();
    state.editorCode = '';
    lastExecResult = null;
    lastExpectedResult = null;
    lastFeedback = null;
    lastChecklist = null;
    saveState();
    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  else if (act === 'backToLemurList') {
    state.lemurMode = 'list';
    state.lemurSubTab = 'tasks';
    resetTaskContextUi();
    lastExecResult = null;
    lastExpectedResult = null;
    lastFeedback = null;
    lastChecklist = null;
    saveState();
    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  else if (act === 'checkLemurTask') {
    var lt = LEMUR_TASKS.find(function(x) { return x.id === state.activeLemurId; }) || LEMUR_TASKS[0];
    lastExecResult = await runQuery(state.editorCode);
    var lExp = await runQuery(lt.sol);
    if (lExp && !lExp.error && lExp.columns) {
      expectedOutputCache[String(lt.sol || '').trim()] = lExp;
    }
    var lCmp = compareResults(lastExecResult, lExp, !!lt.order);
    lastChecklist = buildValidationChecklist(lastExecResult, lExp, !!lt.order);
    if (lCmp.ok) {
      lastExpectedResult = null;
      if (!state.completedLemur[lt.id]) {
        state.completedLemur[lt.id] = true;
        state.xp += 40;
      }
      lastFeedback = { type: 'ok', title: '✅ Zadanie zaliczone! (+40 XP)', msg: lCmp.msg };
      saveState();
      syncProfileToCloud(true);
    } else {
      lastExpectedResult = lastExecResult.error ? null : lExp;
      var trapMsg = lt.detectTrap ? lt.detectTrap(state.editorCode, lastExecResult) : null;
      if (trapMsg) {
        registerGapTrap(lt.gapId, lt.gapName, lt.gapHint || lt.hint);
        lastFeedback = {
          type: 'trap',
          title: '⚠️ Wpadłeś w pułapkę rekrutacyjną (' + (lt.categoryTag || 'SQL') + ')!',
          msg: trapMsg + '\n👉 Luka [' + lt.gapName + '] została zaktualizowana w Twoim Rejestrze Luk.'
        };
      } else {
        lastFeedback = {
          type: 'trap',
          title: '❌ Wynik niezgodny z wzorcem',
          msg: lastExecResult.error ? lCmp.msg : 'Odpowiedź nie pasuje do wzorca. Sprawdź 3-punktową checklistę walidacji oraz porównaj swój wynik z wzorcem poniżej.'
        };
      }
    }
    render();
    scrollToResult();
  }
  else if (act === 'showLemurSol') {
    var lt2 = LEMUR_TASKS.find(function(x) { return x.id === state.activeLemurId; }) || LEMUR_TASKS[0];
    state.editorCode = formatSqlPretty(lt2.sol);
    lastExecResult = await runQuery(lt2.sol);
    lastExpectedResult = null;
    lastChecklist = buildValidationChecklist(lastExecResult, lastExecResult, !!lt2.order);
    lastFeedback = { type: 'warn', title: '💡 Wzorcowe rozwiązanie (' + lt2.title + ')', msg: lt2.hint || lt2.gapHint };
    saveState();
    render();
    scrollToResult();
  }
  else if (act === 'lemurTrapHint') {
    var lt3 = LEMUR_TASKS.find(function(x) { return x.id === state.activeLemurId; }) || LEMUR_TASKS[0];
    uiState.hintStep = 3;
    lastFeedback = { type: 'warn', title: '🛡️ Wskazówka dotycząca pułapki (' + lt3.gapName + ')', msg: lt3.hint || lt3.gapHint };
    render();
  }
  else if (act === 'bumpGap') {
    var g = state.gaps.find(function(x) { return x.id === el.dataset.id; });
    if (g) {
      g.lvl = Math.min(4, g.lvl + 1);
      saveState();
      render();
      toast('Poziom luki podniesiony do ' + g.lvl + '/4.');
    }
  }
  else if (act === 'previewTable') {
    var tbl = el.dataset.table;
    state.editorCode = 'SELECT * FROM ' + tbl + ' LIMIT 10;';
    lastExecResult = await runQuery(state.editorCode);
    lastExpectedResult = null;
    lastFeedback = null;
    render();
    window.scrollTo(0, 0);
  }
  else if (act === 'loadPgTest') {
    state.editorCode = "-- Natywny silnik PostgreSQL 16 (PGlite WASM):\nSELECT\n  d::date AS dzien_kalendarza,\n  DATE_TRUNC('month', d)::date AS miesiac,\n  (d + INTERVAL '7 days')::date AS tydzien_pozniej,\n  COUNT(r.rental_id) FILTER (WHERE r.return_date IS NOT NULL) AS zwrocone,\n  ROUND((COUNT(r.rental_id)::numeric / 2)::numeric, 2) AS test_numeric\nFROM generate_series('2026-05-01'::date, '2026-05-05'::date, '1 day') AS d\nLEFT JOIN rental r ON r.rental_date = d::date\nGROUP BY d\nORDER BY d;";
    lastExecResult = await runQuery(state.editorCode);
    lastExpectedResult = null;
    lastFeedback = { type: 'ok', title: '⚡ Natywny PostgreSQL 16 (PGlite) działa!', msg: 'Zapytanie wykonało się na prawdziwym silniku PostgreSQL WASM (bez żadnych sztucznych regexów ani konwersji do SQLite).' };
    saveState();
    render();
  }
  else if (act === 'openAuthModal') {
    uiState.authModalOpen = true;
    uiState.authError = '';
    render();
  }
  else if (act === 'closeAuthModal') {
    uiState.authModalOpen = false;
    uiState.authError = '';
    render();
  }
  else if (act === 'submitAuthModal') {
    var nickInp = document.getElementById('authNickInp');
    var pinInp = document.getElementById('authPinInp');
    var rawN = nickInp ? nickInp.value : '';
    var rawP = pinInp ? pinInp.value : '';
    var res = await loginOrRegisterTester(rawN, rawP);
    if (!res.ok) {
      uiState.authError = res.msg;
      render();
    } else {
      toast('👋 ' + res.msg);
      render();
    }
  }
  else if (act === 'syncNow') {
    if (!state.userProfile || !state.userProfile.nick) {
      uiState.authModalOpen = true;
      render();
      return;
    }
    toast('🔄 Synchronizuję postęp i pobieram ranking…');
    await syncProfileToCloud(false);
    render();
  }
  else if (act === 'toggleTesterMode') {
    state.testerUnlockAll = !state.testerUnlockAll;
    saveState();
    toast(state.testerUnlockAll ? '🔓 Tryb testerski WŁĄCZONY — wszystkie lekcje i warianty 6–10 odblokowane!' : '🔒 Przywrócono standardowe blokady SoloLearn.');
    render();
  }
  else if (act === 'saveSupabaseConfig') {
    var uInp = document.getElementById('sbUrlInp');
    var kInp = document.getElementById('sbKeyInp');
    SUPABASE_CONFIG.url = (uInp ? uInp.value : '').trim().replace(/\/+$/, '');
    SUPABASE_CONFIG.anonKey = (kInp ? kInp.value : '').trim();
    try {
      localStorage.setItem('sql_master_sb_url', SUPABASE_CONFIG.url);
      localStorage.setItem('sql_master_sb_key', SUPABASE_CONFIG.anonKey);
    } catch (e) {}
    toast('☁️ Zapisano konfigurację Supabase! Pobieram ranking…');
    await syncProfileToCloud(true);
    render();
  }
  else if (act === 'copySupabaseSql') {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(SUPABASE_SQL_SNIPPET).then(function() {
        toast('📋 Skopiowano skrypt CREATE TABLE! Wklej go w SQL Editorze w Supabase.');
      }).catch(function() {
        toast('Zaznacz i skopiuj kod SQL z ramki powyżej.');
      });
    } else {
      toast('Zaznacz i skopiuj kod SQL z ramki powyżej.');
    }
  }
  else if (act === 'copyInviteLink') {
    var baseLink = window.location.origin + window.location.pathname;
    var inviteUrl = isSupabaseConfigured()
      ? baseLink + '?sb_url=' + encodeURIComponent(SUPABASE_CONFIG.url) + '&sb_key=' + encodeURIComponent(SUPABASE_CONFIG.anonKey)
      : baseLink;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(inviteUrl).then(function() {
        toast('🔗 Skopiowano link zaproszenia dla znajomych!');
      });
    }
  }
  else if (act === 'saveConfig') {
    var prov = document.getElementById('aiProvSel');
    var key = document.getElementById('apiKeyInp');
    if (prov) state.aiProvider = prov.value;
    if (key) state.apiKey = key.value.trim();
    saveState();
    toast('Zapisano ustawienia AI.');
  }
  else if (act === 'aiHint') {
    if (state.aiProvider === 'gemini' && state.apiKey) {
      toast('Pytam Gemini AI…');
      try {
        var resp = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + encodeURIComponent(state.apiKey), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: 'Jesteś mentorem SQL. Daj krótką, 2-zdaniową wskazówkę po polsku (bez podawania gotowego kodu) do obecnego kodu ucznia: ' + state.editorCode }] }]
          })
        });
        var data = await resp.json();
        var txt = data.candidates && data.candidates[0] && data.candidates[0].content.parts[0].text;
        lastFeedback = { type: 'warn', title: '🤖 Wskazówka Gemini AI', msg: txt || 'Sprawdź warunki w WHERE i nazwy kolumn.' };
      } catch (err) {
        lastFeedback = { type: 'trap', title: 'Błąd połączenia z API', msg: 'Sprawdź swój klucz API w zakładce Konto & AI.' };
      }
    } else {
      var hintTask = PATH_TASKS.find(function(t) { return t.id === state.activeTaskId; }) || PATH_TASKS[0];
      var hintVar = hintTask.variants[state.activeVariantIdx % hintTask.variants.length];
      lastFeedback = {
        type: 'warn',
        title: '💡 Wskazówka lokalnego mentora (Offline)',
        msg: (hintVar && hintVar.hint ? hintVar.hint + '\n\n' : '') + 'Rozwiń sekcję "👁 Podejrzyj i kliknij kolumny tabel w tym zadaniu" nad edytorem, aby upewnić się co do nazw kolumn i zawartości tabel.'
      };
    }
    render();
  }
  else if (act === 'forceRefreshApp') {
    toast('🔄 Czyszczę pamięć podręczną Service Workera i pobieram wersję ' + APP_VERSION + '…');
    try {
      if ('serviceWorker' in navigator) {
        var regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map(function(r) { return r.unregister(); }));
      }
      if ('caches' in window) {
        var cKeys = await caches.keys();
        await Promise.all(cKeys.map(function(k) { return caches.delete(k); }));
      }
    } catch (err) {}
    window.location.reload();
  }
  else if (act === 'exportJson') {
    var blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'sql-master-backup.json';
    a.click();
    toast('Pobrano plik kopii zapasowej JSON.');
  }
});

render();
initDatabase();
fetchLeaderboard();

if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
  var swRefreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', function() {
    if (swRefreshing) return;
    swRefreshing = true;
    window.location.reload();
  });

  window.addEventListener('load', function() {
    navigator.serviceWorker.register('./sw.js?v=12.1', { updateViaCache: 'none' }).then(function(registration) {
      document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'visible') {
          registration.update().catch(function() {});
        }
      });
    }).catch(function() {});
  });
}
})();

