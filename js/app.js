(function(){
'use strict';

/* ==========================================================================
   0. KONFIGURACJA CHMURY SUPABASE (REST API — RANKING I PROFILE TESTERÓW)
   ========================================================================== */
const APP_VERSION = 'v10';
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
      instance = new PGlite();
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
    editorCode: "SELECT title, rental_rate\nFROM film\nWHERE rating = 'PG-13'\n  AND rental_rate = 4.99\nORDER BY title;",
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
    // automatycznie oznacz rozgrzewkę R1-R3 jako zaliczoną, aby nie blokować dotychczasowego postępu.
    (window.PATH_TASKS || []).forEach(function(pt) {
      if (state.completedVariants[pt.id + ':0']) {
        state.completedVariants[pt.id + ':r1'] = true;
        state.completedVariants[pt.id + ':r2'] = true;
        state.completedVariants[pt.id + ':r3'] = true;
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
  authModalOpen: !(state.userProfile && state.userProfile.nick),
  authError: '',
  leaderboard: null,
  leaderboardSource: 'local',
  lastSyncTime: null,
  syncing: false
};

/* --- PROGRESJA SOLOLEARN: SEKWENCYJNE BLOKADY KROK PO KROKU (R1→R2→R3→1→...→10) --- */
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
  if (vIdx === 2) return taskId + ':r3';
  return taskId + ':' + (vIdx - 3);
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
  if (cv[taskId + ':r3']) c++;
  return c;
}

function countBasicSolved(taskId) {
  var c = 0;
  var cv = (state && state.completedVariants) ? state.completedVariants : {};
  for (var i = 0; i < 5; i++) {
    if (cv[taskId + ':' + i]) c++;
  }
  return c;
}

function countAdvSolved(taskId) {
  var c = 0;
  var cv = (state && state.completedVariants) ? state.completedVariants : {};
  for (var i = 5; i < 10; i++) {
    if (cv[taskId + ':' + i]) c++;
  }
  return c;
}

function countTotalLessonSolved(taskId) {
  return countWarmupSolved(taskId) + countBasicSolved(taskId) + countAdvSolved(taskId);
}

function isLessonCoreCompleted(taskId) {
  return countWarmupSolved(taskId) >= 3 && countBasicSolved(taskId) >= 5;
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
  // Odblokowana, gdy poprzednia lekcja ma zaliczoną rozgrzewkę R1–R3 oraz zadania podstawowe 1–5
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

function formatPrompt(txt) {
  return esc(txt).replace(/`([^`]+)`/g, '<code class="inline">$1</code>').replace(/\n/g, '<br>');
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
var SQL_KW = new Set('select from where join left right inner outer on group by order having with as and or not null in is case when then else end over partition desc asc distinct limit between like ilike union all exists coalesce cast row_number rank dense_rank filter interval date_trunc generate_series intersect except'.split(' '));
var SQL_AGG = new Set(['sum','count','avg','min','max']);
var SQL_TOK = /(--[^\n]*|\/\*[\s\S]*?(?:\*\/|$))|('(?:[^']|'')*(?:'|$))|(\b\d+(?:\.\d+)?\b)|([A-Za-z_]\w*)|([\u2018\u2019\u201A\u201B\u201C\u201D])|([\s\S])/g;

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
  code.style.height = Math.max(130, code.scrollHeight + 4) + 'px';

  var out = '', m;
  SQL_TOK.lastIndex = 0;
  while ((m = SQL_TOK.exec(t))) {
    var x = m[0], c = null;
    if (m[1]) c = 'cmt';
    else if (m[2]) c = 'str';
    else if (m[3]) c = 'num';
    else if (m[5]) c = 'bad';
    else if (m[4]) {
      var w = x.toLowerCase();
      if (SQL_AGG.has(w)) c = 'agg';
      else if (SQL_KW.has(w)) c = 'kw';
    }
    out += c ? '<span class="t-' + c + '">' + esc(x) + '</span>' : esc(x);
  }
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

function insertAtCursor(snippet) {
  var ta = document.getElementById('answer');
  if (!ta) return;
  var start = ta.selectionStart || 0, end = ta.selectionEnd || 0;
  var val = ta.value;
  var pad = (start > 0 && !/[\s(.]/.test(val[start - 1]) && !/^[,);':]/.test(snippet)) ? ' ' : '';
  ta.value = val.slice(0, start) + pad + snippet + val.slice(end);
  var pos = start + pad.length + snippet.length;
  ta.focus();
  ta.setSelectionRange(pos, pos);
  state.editorCode = ta.value;
  if (lastExecResult && lastExecResult.errorLine) lastExecResult.errorLine = 0;
  sqlUpdate();
  saveState();
}

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

  return '<details class="helper-fold iv-spec-fold"' + (isLevel1Open ? ' open' : '') + '>' +
    '<summary>🗄️ Specyfikacja tabel (' + metas.map(function(m){return m.table;}).join(', ') + ') — kliknij, aby rozwinąć</summary>' +
    '<p class="small muted" style="margin:6px 0 8px">💡 Kliknij dowolną nazwę tabeli lub kolumny poniżej, aby wstawić ją do edytora SQL:</p>' +
    '<div style="display:flex;flex-direction:column;gap:10px">' +
      metas.map(function(m) {
        var sample = tableSamples[m.table] || interviewSamples[m.table];
        var sampleHtml = '';
        if (sample && sample.columns && sample.columns.length) {
          var rowCnt = (sample.values || []).length;
          sampleHtml = '<div class="example-input-box">' +
            '<div class="example-input-hdr">📊 Przykładowe wiersze (Example Input — tabela <code>' + esc(m.table) + '</code>, pierwsze ' + Math.min(4, rowCnt) + ' wiersze):</div>' +
            renderSingleTable(sample, 4) +
          '</div>';
        } else {
          sampleHtml = '<div style="margin-top:6px"><button type="button" class="btn sm" data-act="peekTable" data-table="' + esc(m.table) + '">👁 Pobierz przykładowe wiersze (' + esc(m.table) + ')</button></div>';
        }

        // Poziom 2: osobny zagnieżdżony tag <details> pod kolumnami, domyślnie ZWINIĘTY (Punkt 11)
        var level2Fold = '<details class="example-input-fold">' +
          '<summary class="example-input-summary">👁️ Pokaż przykładowe wiersze z tabeli (Example Input — 4 wiersze)</summary>' +
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

function describeSqlExprPl(expr, alias) {
  var e = String(expr || '').trim();
  if (e === '*') return 'wszystkie kolumny tabeli (<code>*</code>)';
  var u = e.toUpperCase();
  if (u === 'COUNT(*)') return 'liczba wierszy (<code>COUNT(*)</code>)';
  if (/^COUNT\s*\(\s*DISTINCT\s+([^)]+)\)/i.test(e)) {
    var mCd = /^COUNT\s*\(\s*DISTINCT\s+([^)]+)\)/i.exec(e);
    return 'liczba unikalnych wartości <code>' + mCd[1].trim() + '</code>';
  }
  if (/^COUNT\s*\(([^)]+)\)\s*FILTER\s*\(\s*WHERE\s+([^)]+)\)/i.test(e)) {
    var mCf = /^COUNT\s*\(([^)]+)\)\s*FILTER\s*\(\s*WHERE\s+([^)]+)\)/i.exec(e);
    return 'liczba wierszy spełniających warunek <code>' + mCf[2].trim() + '</code>';
  }
  if (/^COUNT\s*\(([^)]+)\)/i.test(e)) {
    var mC = /^COUNT\s*\(([^)]+)\)/i.exec(e);
    return 'liczba niepustych wartości <code>' + mC[1].trim() + '</code>';
  }
  if (/^ROUND\s*\(\s*AVG\s*\(([^)]+)\)\s*,\s*(\d+)\s*\)/i.test(e)) {
    var mRa = /^ROUND\s*\(\s*AVG\s*\(([^)]+)\)\s*,\s*(\d+)\s*\)/i.exec(e);
    return 'średnia z <code>' + mRa[1].trim() + '</code> zaokrąglona do ' + mRa[2] + ' miejsc po przecinku';
  }
  if (/^ROUND\s*\((.+),\s*(\d+)\s*\)$/i.test(e)) {
    var mR = /^ROUND\s*\((.+),\s*(\d+)\s*\)$/i.exec(e);
    return 'wartość wyrażenia <code>' + mR[1].trim() + '</code> zaokrąglona do ' + mR[2] + ' miejsc po przecinku';
  }
  if (/^SUM\s*\(([^)]+)\)/i.test(e)) {
    var mS = /^SUM\s*\(([^)]+)\)/i.exec(e);
    return 'suma <code>' + mS[1].trim() + '</code>';
  }
  if (/^AVG\s*\(([^)]+)\)/i.test(e)) {
    var mA = /^AVG\s*\(([^)]+)\)/i.exec(e);
    return 'średnia wartość <code>' + mA[1].trim() + '</code>';
  }
  if (/^MIN\s*\(([^)]+)\)/i.test(e)) {
    var mMin = /^MIN\s*\(([^)]+)\)/i.exec(e);
    return 'wartość minimalna <code>' + mMin[1].trim() + '</code>';
  }
  if (/^MAX\s*\(([^)]+)\)/i.test(e)) {
    var mMax = /^MAX\s*\(([^)]+)\)/i.exec(e);
    return 'wartość maksymalna <code>' + mMax[1].trim() + '</code>';
  }
  if (/\bOVER\s*\(/i.test(e)) {
    return 'wynik funkcji okna <code>' + e + '</code>';
  }
  if (/\bCASE\s+WHEN\b/i.test(e)) {
    return 'wyrażenie warunkowe <code>CASE WHEN ... END</code>';
  }
  if (e !== alias) {
    return 'wyliczenie <code>' + e + '</code>';
  }
  return '';
}

function buildCleanPolecenie(item, details) {
  var raw = String(item.goal || item.prompt || '').trim();
  raw = raw.replace(/^Rozgrzewka\s+R\d+\s*(\([^)]*\))?\s*:\s*/i, '');
  raw = raw.replace(/^Wyzwanie\s*:\s*/i, '');
  raw = raw.replace(/^Zadanie\s+\d+\s*:\s*/i, '');

  // 1. Zdejmij backticki wokół słów
  var s = raw.replace(/`([^`]+)`/g, '$1');

  // 2. Zamień konstrukcje z nazwami tabel na naturalne polskie określenia biznesowe
  var tablePhraseReplacements = [
    [/\b[Zz]\s+tabeli\s+product_orders\b/gi, 'Ze zbioru zamówień produktów'],
    [/\b[Ww]\s+tabeli\s+product_orders\b/gi, 'W zbiorze zamówień produktów'],
    [/\b[Zz]\s+tabeli\s+app_transactions\b/gi, 'Z rejestru transakcji w aplikacji'],
    [/\b[Ww]\s+tabeli\s+app_transactions\b/gi, 'W rejestrze transakcji w aplikacji'],
    [/\b[Zz]\s+tabeli\s+saas_users\b/gi, 'Z bazy użytkowników platformy'],
    [/\b[Ww]\s+tabeli\s+saas_users\b/gi, 'W bazie użytkowników platformy'],
    [/\b[Zz]\s+tabeli\s+user_events\b/gi, 'Z dziennika zdarzeń użytkowników'],
    [/\b[Ww]\s+tabeli\s+user_events\b/gi, 'W dzienniku zdarzeń użytkowników'],
    [/\b[Zz]\s+tabeli\s+emp_salaries\b/gi, 'Z listy wynagrodzeń pracowników'],
    [/\b[Ww]\s+tabeli\s+emp_salaries\b/gi, 'Na liście wynagrodzeń pracowników'],
    [/\b[Zz]\s+tabeli\s+dept_budgets\b/gi, 'Z zestawienia budżetów działów'],
    [/\b[Ww]\s+tabeli\s+dept_budgets\b/gi, 'W zestawieniu budżetów działów'],
    [/\b[Zz]\s+tabeli\s+film_category\b/gi, 'Z przypisań filmów do kategorii'],
    [/\b[Ww]\s+tabeli\s+film_category\b/gi, 'W przypisaniach filmów do kategorii'],
    [/\b[Zz]\s+tabeli\s+film_actor\b/gi, 'Z tabeli obsady filmów'],
    [/\b[Ww]\s+tabeli\s+film_actor\b/gi, 'W tabeli obsady filmów'],
    [/\b[Zz]\s+tabeli\s+film\b/gi, 'Z katalogu filmów'],
    [/\b[Ww]\s+tabeli\s+film\b/gi, 'W katalogu filmów'],
    [/\b[Zz]\s+tabeli\s+customer\b/gi, 'Z bazy klientów'],
    [/\b[Ww]\s+tabeli\s+customer\b/gi, 'W bazie klientów'],
    [/\b[Zz]\s+tabeli\s+rental\b/gi, 'Z historii wypożyczeń'],
    [/\b[Ww]\s+tabeli\s+rental\b/gi, 'W historii wypożyczeń'],
    [/\b[Zz]\s+tabeli\s+payment\b/gi, 'Z rejestru płatności'],
    [/\b[Ww]\s+tabeli\s+payment\b/gi, 'W rejestrze płatności'],
    [/\b[Zz]\s+tabeli\s+actor\b/gi, 'Z listy aktorów'],
    [/\b[Ww]\s+tabeli\s+actor\b/gi, 'Na liście aktorów'],
    [/\b[Zz]\s+tabeli\s+category\b/gi, 'Ze słownika kategorii'],
    [/\b[Ww]\s+tabeli\s+category\b/gi, 'W słowniku kategorii'],
    [/\b[Zz]\s+tabeli\s+staff\b/gi, 'Z listy pracowników'],
    [/\b[Ww]\s+tabeli\s+staff\b/gi, 'Wśród pracowników'],
    [/\b[Zz]\s+tabeli\s+store\b/gi, 'Z listy oddziałów sklepów'],
    [/\b[Ww]\s+tabeli\s+store\b/gi, 'W oddziałach sklepów'],
    [/\bproduct_orders\b/gi, 'zamówień produktów'],
    [/\bapp_transactions\b/gi, 'transakcji w aplikacji'],
    [/\bsaas_users\b/gi, 'użytkowników platformy'],
    [/\buser_events\b/gi, 'zdarzeń użytkowników'],
    [/\bemp_salaries\b/gi, 'wynagrodzeń pracowników'],
    [/\bdept_budgets\b/gi, 'budżetów działów'],
    [/\bfilm_category\b/gi, 'przypisań filmów do kategorii'],
    [/\bfilm_actor\b/gi, 'obsady filmów']
  ];
  for (var tIdx = 0; tIdx < tablePhraseReplacements.length; tIdx++) {
    s = s.replace(tablePhraseReplacements[tIdx][0], tablePhraseReplacements[tIdx][1]);
  }

  // 3. Bezpieczne usuwanie nawiasów zawierających wzory SQL (nie naruszające polskiego tekstu!)
  s = s.replace(/\s*\([^)]*\b(SELECT|FROM|WHERE|GROUP|HAVING|ORDER|LIMIT|JOIN|COUNT|SUM|AVG|MIN|MAX|ROUND|COALESCE|NULLIF|OVER|PARTITION|ROW_NUMBER|RANK|DENSE_RANK|LAG|LEAD|FILTER|DISTINCT|BETWEEN|ILIKE|LIKE|ASC|DESC|NULL|AS|INTERVAL|DATE_TRUNC|generate_series)\b[^)]*\)/gi, '');
  s = s.replace(/\s*\([^)]*[=><!*\/+%:]+[^)]*\)/g, '');

  // 4. Zamiana technicznych nazw kolumn na naturalne polskie pojęcia
  var colToPolish = [
    [/\b(?:\w+\.)?rental_rate\b/g, 'cenę wypożyczenia'],
    [/\b(?:\w+\.)?replacement_cost\b/g, 'koszt odtworzenia'],
    [/\b(?:\w+\.)?release_year\b/g, 'rok wydania'],
    [/\b(?:\w+\.)?rental_duration\b/g, 'czas wypożyczenia'],
    [/\b(?:\w+\.)?rating\b/g, 'kategorię wiekową'],
    [/\b(?:\w+\.)?length\b/g, 'czas trwania'],
    [/\b(?:\w+\.)?title\b/g, 'tytuł filmu'],
    [/\b(?:\w+\.)?film_id\b/g, 'identyfikator filmu'],
    [/\b(?:\w+\.)?customer_id\b/g, 'identyfikator klienta'],
    [/\b(?:\w+\.)?first_name\b/g, 'imię'],
    [/\b(?:\w+\.)?last_name\b/g, 'nazwisko'],
    [/\b(?:\w+\.)?create_date\b/g, 'datę rejestracji'],
    [/\b(?:\w+\.)?rental_id\b/g, 'identyfikator wypożyczenia'],
    [/\b(?:\w+\.)?rental_date\b/g, 'datę wypożyczenia'],
    [/\b(?:\w+\.)?return_date\b/g, 'datę zwrotu'],
    [/\b(?:\w+\.)?payment_id\b/g, 'identyfikator płatności'],
    [/\b(?:\w+\.)?payment_date\b/g, 'datę płatności'],
    [/\b(?:\w+\.)?amount\b/g, 'kwotę płatności'],
    [/\b(?:\w+\.)?staff_id\b/g, 'identyfikator pracownika'],
    [/\b(?:\w+\.)?store_id\b/g, 'identyfikator sklepu'],
    [/\b(?:\w+\.)?actor_id\b/g, 'identyfikator aktora'],
    [/\b(?:\w+\.)?category_id\b/g, 'identyfikator kategorii'],
    [/\b(?:\w+\.)?active\s*=\s*1\b/gi, 'aktywnych klientów'],
    [/\b(?:\w+\.)?active\s*=\s*0\b/gi, 'nieaktywnych klientów'],
    [/\b(?:\w+\.)?active\b/g, 'status aktywności'],
    [/\b(?:\w+\.)?emp_id\b/g, 'identyfikator pracownika'],
    [/\b(?:\w+\.)?emp_name\b/g, 'imię i nazwisko pracownika'],
    [/\b(?:\w+\.)?dept_id\b/g, 'identyfikator działu'],
    [/\b(?:\w+\.)?dept_name\b/g, 'nazwę działu'],
    [/\b(?:\w+\.)?salary\b/g, 'wynagrodzenie'],
    [/\b(?:\w+\.)?hire_date\b/g, 'datę zatrudnienia'],
    [/\b(?:\w+\.)?manager_id\b/g, 'identyfikator przełożonego'],
    [/\b(?:\w+\.)?user_id\b/g, 'identyfikator użytkownika'],
    [/\b(?:\w+\.)?signup_date\b/g, 'datę rejestracji'],
    [/\b(?:\w+\.)?plan_type\b/g, 'plan subskrypcji'],
    [/\b(?:\w+\.)?monthly_fee\b/g, 'opłatę miesięczną'],
    [/\b(?:\w+\.)?event_id\b/g, 'identyfikator zdarzenia'],
    [/\b(?:\w+\.)?event_type\b/g, 'typ zdarzenia'],
    [/\b(?:\w+\.)?event_date\b/g, 'datę zdarzenia'],
    [/\b(?:\w+\.)?tx_id\b/g, 'identyfikator transakcji'],
    [/\b(?:\w+\.)?tx_date\b/g, 'datę transakcji'],
    [/\b(?:\w+\.)?status\b/g, 'status'],
    [/\b(?:\w+\.)?order_id\b/g, 'identyfikator zamówienia'],
    [/\b(?:\w+\.)?order_date\b/g, 'datę zamówienia'],
    [/\b(?:\w+\.)?product_name\b/g, 'nazwę produktu'],
    [/\b(?:\w+\.)?quantity\b/g, 'liczbę sztuk'],
    [/\b(?:\w+\.)?unit_price\b/g, 'cenę jednostkową'],
    [/\b(?:\w+\.)?annual_budget\b/g, 'roczny budżet']
  ];
  for (var cIdx = 0; cIdx < colToPolish.length; cIdx++) {
    s = s.replace(colToPolish[cIdx][0], colToPolish[cIdx][1]);
  }

  // 5. Czysta obsługa fraz sortowania i klauzul technicznych
  s = s.replace(/\s+\bAS\s+[a-zA-Z_]\w*/gi, '');
  s = s.replace(/\s+jako\s+[a-zA-Z_]\w*/gi, '');
  s = s.replace(/\bSELECT\s+DISTINCT\b/gi, 'unikalne wartości');
  s = s.replace(/\bDISTINCT\b/gi, 'unikalne wartości');
  s = s.replace(/\bORDER\s+BY\b/gi, 'posortowane po');
  s = s.replace(/\bGROUP\s+BY\b/gi, 'pogrupowane po');
  s = s.replace(/\bLIMIT\s+(\d+)/gi, 'ograniczając wynik do $1 wierszy');
  s = s.replace(/\bASC\b/g, 'rosnąco');
  s = s.replace(/\bDESC\b/g, 'malejąco');

  // Bezpieczne usuwanie technicznych aliasów tylko gdy są wolnostojące (bez niszczenia polskich słów!)
  s = s.replace(/\s+,\s*/g, ', ');
  s = s.replace(/\s+\b(gross_rev|net_rev|units|arpu|tx_cnt|film_cnt|total_paid|avg_rate|min_len|max_len)\b/gi, '');

  // 6. Usuwanie wiszących polskich przyimków przed znakami interpunkcyjnymi lub na końcu zdania
  s = s.replace(/\s+\b(po|w|z|ze|do|od|na|dla|o|oraz|i)\s*(?=[.,;?!]|$)/gi, '');
  s = s.replace(/'([^']+)'/g, '$1');
  s = s.replace(/\s+([,.;?!])/g, '$1');
  s = s.replace(/,\s*,+/g, ', ');
  s = s.replace(/,\s*\./g, '.');
  s = s.replace(/\(\s*\)/g, '');
  s = s.replace(/\s{2,}/g, ' ').trim();
  s = s.replace(/[,;:]\s*$/, '.');
  if (s && !/[.!?]$/.test(s)) s += '.';
  if (s.length > 1) s = s.charAt(0).toUpperCase() + s.slice(1);
  return s;
}

function buildDataLemurSpec(item, parentTask) {
  var sol = item.sol || '';
  var fallbackTbls = item.tables || (parentTask && parentTask.tables) || [];
  var details = parseSqlDetails(sol, fallbackTbls);

  var polecenie = buildCleanPolecenie(item, details);
  var assumptions = [];

  if (details.tables.length > 0) {
    var tblCodes = details.tables.map(function(t) { return '<code>' + t + '</code>'; }).join(', ');
    assumptions.push('Tabele źródłowe: ' + tblCodes + '.');
  }

  if (details.cols.length > 0) {
    var hasAnyAlias = details.cols.some(function(c) { return c.hasAlias; });
    var colsHtml = '<div class="dl-cols-sublist-title">Wymagane kolumny w wyniku (w dokładnie tej kolejności):</div>' +
      '<ul class="dl-cols-sublist">' +
      details.cols.map(function(c) {
        if (c.name === '*') {
          return '<li><code>*</code> — wszystkie kolumny tabeli źródłowej</li>';
        }
        var descPl = describeSqlExprPl(c.expr, c.name);
        var aliasBadge = c.hasAlias ? ' <span class="dl-alias-tag">alias AS</span>' : '';
        var colDesc = descPl ? (' — ' + descPl) : (' — kolumna <code>' + c.name + '</code>');
        return '<li><code>' + c.name + '</code>' + aliasBadge + colDesc + '</li>';
      }).join('') +
      '</ul>';
    if (hasAnyAlias) {
      colsHtml += '<div class="dl-alias-tip">💡 <strong>Wskazówka:</strong> Pamiętaj o użyciu zapisu <code>kolumna AS nowa_nazwa</code>.</div>';
    }
    assumptions.push(colsHtml);
  }

  if (details.roundDigits !== null) {
    assumptions.push('Zaokrąglij wartości ułamkowe do <strong>' + details.roundDigits + ' miejsc po przecinku</strong> za pomocą <code>ROUND(..., ' + details.roundDigits + ')</code>.');
  }

  if (details.hasDistinct && !/COUNT\s*\(\s*DISTINCT/i.test(sol)) {
    assumptions.push('Zwróć wyłącznie unikalne wiersze (zastosuj <code>SELECT DISTINCT</code>).');
  }

  if (details.orderBy) {
    assumptions.push('Sortowanie wyniku: <code>ORDER BY ' + details.orderBy + '</code>' + (details.limit ? ' oraz ograniczenie do <code>LIMIT ' + details.limit + '</code> wierszy.' : '.'));
  } else if (details.limit) {
    assumptions.push('Ogranicz liczbę zwracanych wierszy do: <code>LIMIT ' + details.limit + '</code>.');
  } else if (item.order === false) {
    assumptions.push('Kolejność wierszy w wyniku nie ma znaczenia.');
  }

  var step1 = 'Zidentyfikuj tabele źródłowe (' + (details.tables.map(function(t){return '`' + t + '`';}).join(', ') || 'wskazane w zadaniu') + ') ';
  if (details.hasLeftJoin) {
    step1 += 'i połącz je złączeniem `LEFT JOIN`, aby nie zgubić rekordów z lewej tabeli nieposiadających dopasowania.';
  } else if (details.hasJoin) {
    step1 += 'i połącz je po wspólnym kluczu za pomocą `JOIN ... ON`.';
  } else if (details.hasCte) {
    step1 += 'i rozbij problem na czytelny krok pomocniczy w klauzuli `WITH nazwa_cte AS (...)`.';
  } else {
    step1 += 'i zastanów się, które wiersze należy odfiltrować przed dalszymi obliczeniami.';
  }

  var usedClauses = [];
  if (details.hasCte) usedClauses.push('`WITH ... AS (...)`');
  usedClauses.push(details.hasDistinct ? '`SELECT DISTINCT`' : '`SELECT`');
  usedClauses.push('`FROM`');
  if (details.hasJoin) usedClauses.push(details.hasLeftJoin ? '`LEFT JOIN ... ON`' : '`JOIN ... ON`');
  if (details.hasWhere) usedClauses.push('`WHERE`');
  if (details.hasGroupBy) usedClauses.push('`GROUP BY`');
  if (details.hasHaving) usedClauses.push('`HAVING`');
  if (details.hasWindow) usedClauses.push('funkcji okna `OVER (...)`');
  if (details.orderBy) usedClauses.push('`ORDER BY`');
  if (details.limit) usedClauses.push('`LIMIT`');

  var step2 = 'Użyj konstrukcji: ' + usedClauses.join(' → ') + '. ' + (item.hint || '');

  var step3 = item.gapHint || '';
  if (!step3) {
    if (details.hasHaving) {
      step3 = 'Pułapka kolejności SQL: w `WHERE` filtrujemy pojedyncze wiersze przed grupowaniem, a warunki na funkcjach agregujących (`COUNT`, `SUM`, `AVG`) umieszczamy wyłącznie w `HAVING`!';
    } else if (details.hasLeftJoin) {
      step3 = 'Pułapka LEFT JOIN: nie umieszczaj warunków dla prawej tabeli w `WHERE` (chyba że sprawdzasz `IS NULL`), bo zamienisz `LEFT JOIN` w zwykły `INNER JOIN`!';
    } else if (details.hasWindow) {
      step3 = 'Pułapka funkcji okna: funkcji `ROW_NUMBER()`, `RANK()`, `LAG()` nie można użyć bezpośrednio w `WHERE` — oblicz je w CTE (`WITH`) i przefiltruj w zapytaniu głównym.';
    } else if (/\bIS\s+(?:NOT\s+)?NULL\b/i.test(sol)) {
      step3 = 'Pułapka NULL: w SQL nigdy nie piszemy `= NULL` ani `<> NULL`. Do sprawdzania brakujących wartości używaj wyłącznie `IS NULL` oraz `IS NOT NULL`.';
    } else if (/\bOR\b/i.test(sol) && /\bAND\b/i.test(sol)) {
      step3 = 'Pułapka priorytetu operatorów: `AND` wiąże silniej niż `OR`! Zawsze otaczaj część z `OR` nawiasami `(...)`.';
    } else {
      step3 = 'Upewnij się, że nazwy i kolejność kolumn w `SELECT` (wraz z aliasami `AS`) dokładnie zgadzają się z sekcją „Wymagania i założenia”.';
    }
  }

  return {
    polecenie: polecenie,
    assumptions: assumptions,
    hints: [step1, step2, step3]
  };
}
window.buildDataLemurSpec = buildDataLemurSpec;

// Renderuje zunifikowaną specyfikację zadania w standardzie DataLemur (📌 Polecenie + 📋 Wymagania i założenia)
function renderTaskSpecBox(item, parentTask) {
  if (!item) return '';
  if (!item._v10SpecDone) {
    var spec = buildDataLemurSpec(item, parentTask || null);
    item.polecenie = spec.polecenie;
    item.assumptions = spec.assumptions;
    item.hints = spec.hints;
    item._v10SpecDone = true;
  }
  var polecenieTxt = item.polecenie || item.prompt || '';
  var assumptionsList = Array.isArray(item.assumptions) ? item.assumptions : [];

  var assumptionsHtml = assumptionsList.length
    ? '<div class="dl-assumptions-box">' +
        '<div class="dl-sec-hdr">📋 Wymagania i założenia:</div>' +
        '<ul class="dl-assumptions-list">' +
          assumptionsList.map(function(a) { return '<li>' + a + '</li>'; }).join('') +
        '</ul>' +
      '</div>'
    : '';

  return '<div class="dl-spec-wrap">' +
    '<div class="dl-prompt-box">' +
      '<div class="dl-sec-hdr">📌 Polecenie:</div>' +
      '<div class="dl-prompt-body">' + formatPrompt(polecenieTxt) + '</div>' +
    '</div>' +
    assumptionsHtml +
  '</div>';
}

function renderHintStepperBox(item, parentTask) {
  if (!item || !uiState.hintStep || uiState.hintStep < 1) return '';
  if (!item.hints && typeof window.buildDataLemurSpec === 'function') {
    var spec = window.buildDataLemurSpec(item, parentTask || null);
    item.hints = spec.hints;
  }
  var hints = Array.isArray(item.hints) ? item.hints : [item.hint || 'Sprawdź wymagane kolumny i warunki filtrowania.'];
  var maxStep = Math.min(hints.length, uiState.hintStep);
  var stepTitles = [
    'Krok 1/3 · Wskazówka koncepcyjna (jak podejść do problemu)',
    'Krok 2/3 · Wskazówka techniczna (klauzule i funkcje PostgreSQL)',
    'Krok 3/3 · 🛡️ Jaka tu jest pułapka?'
  ];

  var cardsHtml = '';
  for (var i = 0; i < maxStep; i++) {
    cardsHtml += '<div class="hint-step-item' + (i === 2 ? ' trap-step' : '') + '">' +
      '<div class="hint-step-hdr">' + esc(stepTitles[i] || ('Krok ' + (i + 1))) + '</div>' +
      '<div class="hint-step-body">' + formatPrompt(hints[i]) + '</div>' +
    '</div>';
  }

  return '<div class="hint-stepper-box">' + cardsHtml + '</div>';
}

function getHintButtonLabel() {
  var st = uiState.hintStep || 0;
  if (st === 0) return '💡 Podpowiedź (Krok 1/3)';
  if (st === 1) return '💡 Podpowiedź (Krok 2/3 — Składnia)';
  if (st === 2) return '🛡️ Podpowiedź (Krok 3/3 — Pułapka!)';
  return '💡 Ukryj podpowiedzi (3/3)';
}

// 8-liniowa ściąga krok po kroku (kolejność pisania zapytania SQL) z podświetleniem klauzul użytych w zadaniu
var ALL_CHEAT_CLAUSES = [
  {
    kw: 'SELECT',
    check: function(s) { return true; },
    insert: 'SELECT ',
    syntax: 'kol1, kol2',
    desc: 'wybiera kolumny do wyświetlenia w wyniku'
  },
  {
    kw: 'AS',
    check: function(s) { return /\bAS\b/i.test(s); },
    insert: ' AS ',
    syntax: 'kolumna AS nowa_nazwa',
    desc: 'nadaje kolumnie nowy nagłówek / alias w wyniku'
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
    syntax: 'LEFT JOIN tabela2 ON t1.id = t2.id',
    desc: 'dołącza rekordy z prawej tabeli bez utraty wierszy z lewej'
  },
  {
    kw: 'JOIN ... ON',
    check: function(s) { return /\bJOIN\b/i.test(s) && !/\bLEFT\s+(?:OUTER\s+)?JOIN\b/i.test(s); },
    insert: '\nJOIN ',
    syntax: 'JOIN tabela2 ON t1.id = t2.id',
    desc: 'łączy tabele po wspólnym kluczu'
  },
  {
    kw: 'WHERE',
    check: function(s) { return /\bWHERE\b/i.test(s); },
    insert: '\nWHERE ',
    syntax: 'WHERE warunek',
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
    syntax: 'HAVING warunek_grup',
    desc: 'filtruje całe grupy po podliczeniu agregatów'
  },
  {
    kw: 'ORDER BY',
    check: function(s) { return /\bORDER\s+BY\b/i.test(s); },
    insert: '\nORDER BY ',
    syntax: 'ORDER BY kolumna ASC/DESC',
    desc: 'sortuje gotowy wynik (rosnąco ASC lub malejąco DESC)'
  },
  {
    kw: 'LIMIT',
    check: function(s) { return /\bLIMIT\b/i.test(s); },
    insert: '\nLIMIT ',
    syntax: 'LIMIT N;',
    desc: 'odcina wynik do pierwszych N wierszy'
  }
];

function renderStepByStepCheatSheet(solSql, lessonTheoryHtml, openByDefault) {
  var s = String(solSql || '');
  var usedClauses = ALL_CHEAT_CLAUSES.filter(function(row) {
    return row.check(s);
  });
  if (usedClauses.length < 2) {
    usedClauses = ALL_CHEAT_CLAUSES.slice(0, 2);
  }

  var isOpen = uiState.theoryBoxOpen !== null ? uiState.theoryBoxOpen : (openByDefault !== false);
  var rowsHtml = usedClauses.map(function(row, idx) {
    return '<div class="cheat-row used">' +
      '<span class="cheat-num">' + (idx + 1) + '.</span>' +
      '<button type="button" class="cheat-kw-btn active" data-insert-sql="' + esc(row.insert) + '" title="Kliknij, aby wstawić ' + esc(row.kw) + ' do edytora">' +
        '[' + esc(row.kw) + ']' +
      '</button>' +
      '<code class="cheat-syn">' + esc(row.syntax) + '</code>' +
      '<span class="cheat-desc">→ ' + esc(row.desc) + '</span>' +
    '</div>';
  }).join('');

  var extraLessonHtml = lessonTheoryHtml
    ? '<div class="cheat-lesson-extra"><div class="small muted" style="margin-bottom:4px;font-weight:700">📌 Notatka do bieżącego działu:</div>' + lessonTheoryHtml + '</div>'
    : '';

  return '<details class="theory-box cheat-8-box"' + (isOpen ? ' open' : '') + '>' +
    '<summary>🧭 Kontekstowa ściąga składni dla tego zadania (' + usedClauses.length + ' ' + (usedClauses.length === 1 ? 'klauzula' : usedClauses.length < 5 ? 'klauzule' : 'klauzul') + ' — kliknij, by wstawić)</summary>' +
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

function renderEditorWidget(extraCols, actionType) {
  return '' +
    '<div class="ed">' +
      '<div id="sqlgut" aria-hidden="true"><span class="ln">1</span></div>' +
      '<div class="edwrap">' +
        '<pre id="sqlhl" aria-hidden="true"></pre>' +
        '<textarea id="answer" wrap="off" spellcheck="false" autocomplete="off" autocorrect="off" autocapitalize="off" placeholder="Wpisz zapytanie SQL...">' + esc(state.editorCode) + '</textarea>' +
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

function renderResultBox() {
  var h = '';
  if (lastFeedback) {
    var nextBtnHtml = '';
    if (lastFeedback.type === 'ok' && currentTab === 'path' && state.pathMode === 'solve') {
      var curT = PATH_TASKS.find(function(t) { return t.id === state.activeTaskId; }) || PATH_TASKS[0];
      var curVIdx = state.activeVariantIdx % curT.variants.length;
      if (curVIdx + 1 < curT.variants.length) {
        var nextVar = curT.variants[curVIdx + 1];
        var nextLbl = nextVar.stepCode ? ('Zadanie ' + nextVar.stepCode) : ('Krok ' + (curVIdx + 2));
        nextBtnHtml = '<div style="margin-top:10px">' +
          '<button type="button" class="btn success next-step-cta" data-act="nextTaskStep">🚀 Następne zadanie (' + esc(nextLbl) + ') →</button>' +
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
      var snippetHtml = lastExecResult.errorSnippet ? '<div style="margin-top:6px;padding:6px 10px;background:rgba(0,0,0,0.25);border-radius:6px;font-family:var(--mono);font-size:12px">Linia ' + lastExecResult.errorLine + ': <code>' + esc(lastExecResult.errorSnippet) + '</code></div>' : '';
      h += '<div class="fb-box trap"><strong>⚠️ Błąd SQL' + esc(lnBadge) + ':</strong> <span class="small">' + esc(lastExecResult.error) + '</span>' + snippetHtml + '</div>';
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

function renderSqlPipelineSimulator() {
  var activeStep = uiState.sqlAnimStep || 1;
  if (activeStep < 1 || activeStep > SQL_PIPELINE_SIM_STEPS.length) activeStep = 1;
  var cur = SQL_PIPELINE_SIM_STEPS[activeStep - 1];

  var pillsHtml = SQL_PIPELINE_SIM_STEPS.map(function(s) {
    var cls = 'sim-step-pill' + (s.step === activeStep ? ' active' : '') + (s.step < activeStep ? ' done' : '');
    return '<button type="button" class="' + cls + '" data-act="setSqlAnimStep" data-step="' + s.step + '">' +
      esc(s.clause) +
    '</button>';
  }).join('<span class="sim-arr">→</span>');

  var tblHtml = '<div class="tblwrap sim-tbl"><table><thead><tr>' +
    cur.cols.map(function(c) { return '<th>' + esc(c) + '</th>'; }).join('') +
    '</tr></thead><tbody>' +
    cur.preview.map(function(r) {
      return '<tr>' + r.map(function(v) { return '<td>' + esc(v) + '</td>'; }).join('') + '</tr>';
    }).join('') +
    '</tbody></table></div>';

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
    '<div class="sim-pills-row">' + pillsHtml + '</div>' +
    '<div class="sim-stage-card">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;margin-bottom:6px">' +
        '<code class="sim-clause-code">' + esc(cur.clause) + '</code>' +
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
      '<div class="theory-code" style="margin-bottom:12px"><code>' + esc(slide.syntax) + '</code></div>' +
      '<ul class="tut-list">' + (slide.bullets || []).map(function(b) { return '<li>' + b + '</li>'; }).join('') + '</ul>' +
    '</div>';
  } else if (sIdx === 1) {
    var fw = slide.focusWrite || [];
    var fe = slide.focusExec || [];
    bodyHtml = '<div class="tut-card-inner">' +
      '<span class="chip mid">Karta 2/4 · Architektura silnika PostgreSQL</span>' +
      '<h3 style="margin:8px 0">' + esc(slide.title) + '</h3>' +
      '<div class="order-box">' +
        '<div class="order-label">✍️ Kolejność pisania w kodzie SQL:</div>' +
        '<div class="order-flow">' +
          WRITE_ORDER_STEPS.map(function(w, idx) {
            var hi = fw.indexOf(w) > -1;
            return (idx > 0 ? '<span class="order-arr">→</span>' : '') +
              '<span class="order-pill' + (hi ? ' active' : '') + '">' + esc(w) + '</span>';
          }).join('') +
        '</div>' +
      '</div>' +
      '<div class="order-box exec">' +
        '<div class="order-label">⚙️ Prawdziwa kolejność wykonywania pod maską PostgreSQL:</div>' +
        '<div class="exec-grid">' +
          EXEC_ORDER_STEPS.map(function(st) {
            var hi = fe.indexOf(st.num) > -1;
            return '<div class="exec-step' + (hi ? ' active' : '') + '">' +
              '<strong>' + esc(st.lbl) + '</strong>' +
              '<span>' + esc(st.desc) + '</span>' +
            '</div>';
          }).join('') +
        '</div>' +
      '</div>' +
      '<div class="fb-box warn" style="margin-top:10px">' + slide.note + '</div>' +
      renderSqlPipelineSimulator() +
    '</div>';
  } else if (sIdx === 2) {
    bodyHtml = '<div class="tut-card-inner">' +
      '<span class="chip info">Karta 3/4 · Przykład krok po kroku</span>' +
      '<h3 style="margin:8px 0">' + esc(slide.title) + '</h3>' +
      '<div class="theory-code" style="margin-bottom:12px"><code>' + esc(slide.code) + '</code></div>' +
      '<div class="tut-lines">' +
        (slide.lines || []).map(function(ln, idx) {
          return '<div class="tut-line-item">' +
            '<div class="tut-line-code"><code>' + esc(ln.line) + '</code></div>' +
            '<div class="tut-line-desc"><strong>Krok ' + (idx + 1) + ':</strong> ' + esc(ln.desc) + '</div>' +
          '</div>';
        }).join('') +
      '</div>' +
    '</div>';
  } else if (sIdx === 3 && slide.quiz) {
    var qz = slide.quiz;
    var sel = uiState.quizSelected;
    var passed = uiState.quizPassed || isDone;
    bodyHtml = '<div class="tut-card-inner">' +
      '<span class="chip done">Karta 4/4 · Interaktywne sprawdzenie (+15 XP)</span>' +
      '<h3 style="margin:8px 0">' + esc(slide.title) + '</h3>' +
      '<div class="prompt-box" style="margin-bottom:12px"><strong>❓ Pytanie:</strong> ' + formatPrompt(qz.question) + '</div>' +
      '<div class="quiz-opts">' +
        qz.options.map(function(optTxt, oIdx) {
          var optCls = 'quiz-opt-btn';
          if (sel === oIdx) {
            optCls += (oIdx === qz.correct) ? ' correct' : ' wrong';
          } else if (passed && oIdx === qz.correct) {
            optCls += ' correct';
          }
          var prefix = ['A', 'B', 'C'][oIdx] || (oIdx + 1);
          return '<button type="button" class="' + optCls + '" data-act="pickQuizOpt" data-opt="' + oIdx + '">' +
            '<span class="quiz-letter">' + prefix + '</span>' +
            '<span>' + formatPrompt(optTxt) + '</span>' +
          '</button>';
        }).join('') +
      '</div>' +
      (sel !== null && sel !== qz.correct
        ? '<div class="fb-box trap"><strong>❌ Jeszcze nie to!</strong> <span class="small">Sprawdź wskazówki z Karty 2 (Kolejność wykonywania SQL) i kliknij inną odpowiedź.</span></div>'
        : '') +
      (passed
        ? '<div class="fb-box ok"><strong>✅ Świetnie! Teoria opanowana.</strong><p class="small" style="margin:4px 0 0">' + esc(qz.explanation) + '</p></div>'
        : '') +
    '</div>';
  }

  var canFinish = uiState.quizPassed || isDone;
  var navBtns = '<div class="acts" style="justify-content:space-between;margin-top:14px;border-top:1px solid var(--line);padding-top:12px">' +
    (sIdx > 0
      ? '<button type="button" class="btn sm" data-act="prevSlide">← Wstecz</button>'
      : '<button type="button" class="btn sm" data-act="backToPathList">← Mapa Ścieżki</button>') +
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
      '<button type="button" class="btn sm" data-act="backToPathList">← Wróć do Mapy Ścieżki</button>' +
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

// ZAKŁADKA 1: ŚCIEŻKA (156 ZADAŃ: 36 ROZGRZEWEK R1–R3 + 120 ZADAŃ 1–10 + SLAJDY SOLOLEARN + SEKWENCYJNE BLOKADY)
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
    var curStepNum = vIdx + 1;
    var curStepCode = variant.stepCode || (vIdx < 3 ? ('R' + (vIdx + 1)) : String(vIdx - 2));
    var tierBadge = vIdx < 3
      ? '🔥 Rozgrzewka (' + curStepCode + ' z R1–R3)'
      : (vIdx >= 8 ? '🚀 Zaawansowane (' + curStepCode + ' z 6–10 · Miks)' : '📘 Podstawy (' + curStepCode + ' z 1–5)');
    var pct = Math.round((curStepNum / totalSteps) * 100);

    return '<div class="card task-transition-enter">' +
      '<div class="task-nav-hdr">' +
        '<button type="button" class="btn back-path-btn" data-act="backToPathList">← Mapa Ścieżki</button>' +
        '<button type="button" class="btn sm ghost sololearn-theory-btn" data-act="openTutorialSlides">📖 Teoria</button>' +
      '</div>' +
      '<div class="sololearn-progress-wrap">' +
        '<div class="sololearn-progress-meta">' +
          '<span class="sololearn-step-badge">ZADANIE ' + curStepNum + ' z ' + totalSteps + '</span>' +
          '<span class="sololearn-tier-badge">' + esc(tierBadge) + '</span>' +
          '<span class="sololearn-pct">' + pct + '%</span>' +
        '</div>' +
        '<div class="sololearn-bar"><i style="width:' + pct + '%"></i></div>' +
      '</div>' +
      '<h2 class="task-page-title">' + esc(task.title) + ' — Zadanie ' + esc(curStepCode) + '</h2>' +
      renderTaskSpecBox(variant, task) +
      buildTaskSchemaBox(variant.tables || task.tables, variant.sol) +
      renderStepByStepCheatSheet(variant.sol, task.theory, false) +
      renderEditorWidget(task.cols, 'checkPathTask') +
      renderExampleOutputBox(variant.sol) +
      renderHintStepperBox(variant, task) +
      '<div class="acts" style="margin-top:12px;border-top:1px solid var(--line);padding-top:10px">' +
        '<button type="button" class="btn sm warn" data-act="stepHint">' + esc(getHintButtonLabel()) + '</button>' +
        '<button type="button" class="btn sm" data-act="showSolution">💡 Pokaż wzorcowy kod</button>' +
        '<button type="button" class="btn sm" data-act="aiHint">🤖 Podpowiedź AI</button>' +
      '</div>' +
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
      '<button class="btn ghost" data-act="tab" data-tab="diag">🎯 Uruchom Diagnozę (10 pytań)</button>' +
    '</section>';
  }

  h += '<div class="card">' +
    '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">' +
      '<div><h2 style="margin:0">Mapa Ścieżki SQL (Progresja Krok po Kroku)</h2>' +
      '<p class="small muted" style="margin:2px 0 0">Zaliczone działy: <strong>' + doneLessons + '/' + PATH_TASKS.length + '</strong> · Rozwiązane zadania: <strong>' + doneVariants + '/' + totalVariants + '</strong>' +
      (state.testerUnlockAll ? ' · <span class="chip mid">🔓 Tryb testerski aktywny</span>' : '') + '</p></div>' +
      '<button class="btn primary sm" data-act="continuePath">▶ Kontynuuj naukę</button>' +
    '</div>' +
    '<div class="bar"><i style="width:' + Math.round((doneLessons / PATH_TASKS.length) * 100) + '%"></i></div>' +
  '</div>';

  STAGES.forEach(function(st) {
    var stageOpen = isStageUnlocked(st.id);
    var tasksInStage = PATH_TASKS.filter(function(t) { return t.stage === st.id; });
    var allDone = tasksInStage.every(function(t) { return isLessonCoreCompleted(t.id); });

    h += '<div class="stage-box ' + (allDone ? 'completed' : stageOpen ? 'unlocked' : 'locked-stage') + '">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;gap:8px">' +
        '<strong>' + (stageOpen ? '' : '🔒 ') + esc(st.name) + '</strong>' +
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

      var statusChip = !lessonOpen
        ? '<span class="chip open">🔒 Zablokowane (ukończ R1–R3 i 1–5 wyżej)</span>'
        : isMastered
          ? '<span class="chip done">✅ Odblokowano 6–10 (' + vSolved + '/13)</span>'
          : '<span class="chip info">' + (tutDone ? 'Krok po kroku (' + vSolved + '/13) →' : '📖 Start (Slajdy) →') + '</span>';

      h += '<button type="button" class="node-item' + (!lessonOpen ? ' locked' : '') + '" data-act="openPathTask" data-id="' + t.id + '">' +
        '<div>' +
          '<span class="node-title">' + (!lessonOpen ? '🔒 ' : isMastered ? '✅ ' : '📘 ') + esc(t.title) + '</span>' +
          '<div class="node-meta">' +
            '<span>Teoria: <strong>' + (tutDone ? '✓ 4/4' : '0/4') + '</strong></span>' +
            '<span>· 🔥 R1–R3: <strong>' + warmupSolved + '/3</strong></span>' +
            '<span>· 📘 Podstawy 1–5: <strong>' + basicSolved + '/5</strong></span>' +
            '<span>· 🚀 Zaawansowane 6–10: <strong>' + (isAdvancedUnlocked(t.id) ? advSolved + '/5' : '🔒') + '</strong></span>' +
          '</div>' +
        '</div>' +
        statusChip +
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
  return '<div class="card task-transition-enter">' +
    '<div class="sololearn-progress-wrap">' +
      '<div class="sololearn-progress-meta">' +
        '<span class="sololearn-step-badge">PYTANIE ' + curDNum + ' z ' + totalDiag + '</span>' +
        '<span class="sololearn-tier-badge">Sprawdza: Etap ' + q.stage + '</span>' +
        '<span class="sololearn-pct">' + dPct + '%</span>' +
      '</div>' +
      '<div class="sololearn-bar"><i style="width:' + dPct + '%"></i></div>' +
    '</div>' +
    '<h2 class="task-page-title">' + esc(q.title) + '</h2>' +
    renderTaskSpecBox(q, null) +
    buildTaskSchemaBox(q.tables, q.sol) +
    renderStepByStepCheatSheet(q.sol, '', false) +
    renderEditorWidget(null, 'submitDiag') +
    renderExampleOutputBox(q.sol) +
    renderHintStepperBox(q, null) +
    '<div class="acts" style="margin-top:12px;border-top:1px solid var(--line);padding-top:12px;justify-content:space-between">' +
      '<div style="display:flex;gap:8px;flex-wrap:wrap">' +
        '<button type="button" class="btn sm warn" data-act="stepHint">' + esc(getHintButtonLabel()) + '</button>' +
        '<button type="button" class="btn warn" data-act="skipDiag">⏭ Pomiń zadanie (Nie umiem jeszcze)</button>' +
      '</div>' +
      '<button type="button" class="btn sm" data-act="resetDiag">Restart</button>' +
    '</div>' +
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

    return nav + '<div class="card task-transition-enter">' +
      '<div class="sololearn-progress-wrap" style="margin-top:2px">' +
        '<div class="sololearn-progress-meta">' +
          '<span class="sololearn-step-badge">ZADANIE ' + curNum + ' z ' + tasksList.length + '</span>' +
          '<div style="display:flex;gap:6px;align-items:center">' +
            '<span class="chip ' + bdg.cls + '">' + bdg.lbl + '</span>' +
            '<span class="chip info">' + esc(task.categoryTag || 'Analiza SQL') + '</span>' +
          '</div>' +
          '<span class="sololearn-pct">' + pct + '%</span>' +
        '</div>' +
        '<div class="sololearn-bar"><i style="width:' + pct + '%"></i></div>' +
      '</div>' +
      '<h2 class="task-page-title">' + (isSolved ? '✅ ' : '') + esc(task.title) + '</h2>' +
      renderTaskSpecBox(task, null) +
      buildTaskSchemaBox(task.tables, task.sol) +
      renderStepByStepCheatSheet(task.sol, '', false) +
      renderEditorWidget(task.cols, 'checkLemurTask') +
      renderExampleOutputBox(task.sol) +
      renderHintStepperBox(task, null) +
      '<div class="acts" style="margin-top:12px;border-top:1px solid var(--line);padding-top:10px">' +
        '<button type="button" class="btn sm warn" data-act="stepHint">' + esc(getHintButtonLabel()) + '</button>' +
        '<button type="button" class="btn sm" data-act="lemurTrapHint">🛡️ Jaka tu jest pułapka?</button>' +
        '<button type="button" class="btn sm" data-act="showLemurSol">💡 Pokaż wzorcowe rozwiązanie</button>' +
      '</div>' +
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
  v.innerHTML = mainHtml + renderAuthModal();

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
    if (lastExecResult && lastExecResult.errorLine) lastExecResult.errorLine = 0;
    sqlUpdate();
    saveState();
  }
});

document.addEventListener('click', async function(e) {
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
    uiState.hintStep = 0;
    uiState.schemaBoxOpen = false;
    if (currentTab === 'diag' && state.diagIdx < DIAG_QUESTIONS.length) {
      state.editorCode = '-- Zadanie diagnostyczne #' + (state.diagIdx + 1) + '\nSELECT ';
    } else if (currentTab === 'profile') {
      fetchLeaderboard();
    }
    render();
    window.scrollTo(0, 0);
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
  else if (act === 'clearEd') {
    state.editorCode = '';
    lastExecResult = null;
    lastExpectedResult = null;
    lastFeedback = null;
    lastChecklist = null;
    render();
  }
  else if (act === 'runOnly') {
    lastExecResult = await runQuery(state.editorCode);
    lastExpectedResult = null;
    lastFeedback = null;
    lastChecklist = null;
    render();
  }
  else if (act === 'peekTable') {
    var tName = el.dataset.table;
    lastExecResult = await runQuery('SELECT * FROM ' + tName + ' LIMIT 5;');
    lastExpectedResult = null;
    lastChecklist = null;
    lastFeedback = { type: 'warn', title: '👁 Podgląd tabeli ' + tName + ' (pierwsze 5 wierszy)', msg: 'Twój kod w edytorze pozostał bez zmian.' };
    render();
  }
  else if (act === 'openPathTask') {
    var targetId = el.dataset.id;
    if (!isLessonUnlocked(targetId)) {
      toast('🔒 Zablokowane! Ukończ najpierw rozgrzewkę R1–R3 oraz zadania podstawowe 1–5 w poprzednim dziale.');
      return;
    }
    state.activeTaskId = targetId;
    var t = PATH_TASKS.find(function(x) { return x.id === state.activeTaskId; });
    state.activeVariantIdx = t ? getFirstUnsolvedStepIdx(t) : 0;
    uiState.schemaBoxOpen = false;
    uiState.theoryBoxOpen = null;
    uiState.hintStep = 0;
    uiState.tutorialSlideIdx = 0;
    uiState.quizSelected = null;
    uiState.quizPassed = !!(state.tutorialsDone && state.tutorialsDone[targetId]);
    // Przy pierwszym wejściu w lekcję otwórz slajdy teorii SoloLearn (1-4)
    state.pathMode = (state.tutorialsDone && state.tutorialsDone[targetId]) ? 'solve' : 'tutorial';
    if (t) {
      var curV = t.variants[state.activeVariantIdx] || t.variants[0];
      state.editorCode = '-- ' + t.title + ' (Zadanie ' + (curV.stepCode || 'R1') + ')\nSELECT ';
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
    uiState.schemaBoxOpen = false;
    uiState.theoryBoxOpen = null;
    uiState.hintStep = 0;
    uiState.tutorialSlideIdx = 0;
    uiState.quizSelected = null;
    uiState.quizPassed = !!(state.tutorialsDone && state.tutorialsDone[nextTask.id]);
    state.pathMode = (state.tutorialsDone && state.tutorialsDone[nextTask.id]) ? 'solve' : 'tutorial';
    var nextVarObj = nextTask.variants[state.activeVariantIdx] || nextTask.variants[0];
    state.editorCode = '-- ' + nextTask.title + ' (Zadanie ' + (nextVarObj.stepCode || 'R1') + ')\nSELECT ';
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
    uiState.quizSelected = null;
    uiState.quizPassed = !!(state.tutorialsDone && state.tutorialsDone[state.activeTaskId]);
    state.pathMode = 'tutorial';
    render();
    window.scrollTo(0, 0);
  }
  else if (act === 'setSqlAnimStep') {
    clearInterval(window._sqlAnimTimer);
    uiState.sqlAnimRunning = false;
    uiState.sqlAnimStep = Math.max(1, Math.min(SQL_PIPELINE_SIM_STEPS.length, Number(el.dataset.step) || 1));
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
    var fVar = fTask.variants[state.activeVariantIdx] || fTask.variants[0];
    if (!state.editorCode || state.editorCode.indexOf('SELECT') === -1) {
      state.editorCode = '-- ' + fTask.title + ' (Zadanie ' + (fVar.stepCode || 'R1') + ')\nSELECT ';
    }
    saveState();
    render();
    window.scrollTo(0, 0);
  }
  else if (act === 'backToPathList') {
    clearInterval(window._sqlAnimTimer);
    uiState.sqlAnimRunning = false;
    state.pathMode = 'list';
    uiState.hintStep = 0;
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
    uiState.schemaBoxOpen = false;
    uiState.hintStep = 0;
    var pickedV = tVar.variants[state.activeVariantIdx] || tVar.variants[0];
    state.editorCode = '-- ' + tVar.title + ' (Zadanie ' + (pickedV.stepCode || (reqIdx + 1)) + ')\nSELECT ';
    lastExecResult = null;
    lastExpectedResult = null;
    lastFeedback = null;
    lastChecklist = null;
    saveState();
    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  else if (act === 'nextTaskStep') {
    var curTaskStep = PATH_TASKS.find(function(x) { return x.id === state.activeTaskId; }) || PATH_TASKS[0];
    var nextStepIdx = (state.activeVariantIdx + 1);
    if (nextStepIdx < curTaskStep.variants.length) {
      state.activeVariantIdx = nextStepIdx;
      uiState.schemaBoxOpen = false;
      uiState.hintStep = 0;
      var nextVObj = curTaskStep.variants[nextStepIdx];
      state.editorCode = '-- ' + curTaskStep.title + ' (Zadanie ' + (nextVObj.stepCode || (nextStepIdx + 1)) + ')\nSELECT ';
      lastExecResult = null;
      lastExpectedResult = null;
      lastFeedback = null;
      lastChecklist = null;
      saveState();
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
      uiState.schemaBoxOpen = false;
      uiState.theoryBoxOpen = null;
      uiState.hintStep = 0;
      uiState.tutorialSlideIdx = 0;
      uiState.quizSelected = null;
      uiState.quizPassed = !!(state.tutorialsDone && state.tutorialsDone[nextL.id]);
      state.pathMode = (state.tutorialsDone && state.tutorialsDone[nextL.id]) ? 'solve' : 'tutorial';
      var nextLV = nextL.variants[state.activeVariantIdx] || nextL.variants[0];
      state.editorCode = '-- ' + nextL.title + ' (Zadanie ' + (nextLV.stepCode || 'R1') + ')\nSELECT ';
      lastExecResult = null;
      lastExpectedResult = null;
      lastFeedback = null;
      lastChecklist = null;
      saveState();
      render();
      window.scrollTo(0, 0);
    } else {
      state.pathMode = 'list';
      uiState.hintStep = 0;
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
    uiState.schemaBoxOpen = false;
    uiState.hintStep = 0;
    var shufV = curTask.variants[state.activeVariantIdx] || curTask.variants[0];
    state.editorCode = '-- ' + curTask.title + ' (Zadanie ' + (shufV.stepCode || (nextIdx + 1)) + ')\nSELECT ';
    lastExecResult = null;
    lastExpectedResult = null;
    lastChecklist = null;
    lastFeedback = { type: 'warn', title: '🎲 Wylosowano odblokowane Zadanie ' + (shufV.stepCode || (nextIdx + 1)) + ' (' + availLen + ' dostępnych)', msg: 'Zmieniliśmy tabelę lub warunki zadania. Napisz nowe zapytanie!' };
    saveState();
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
      var isWarmStep = variant.tier === 'warmup' || vIdx < 3;
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
          unlockBonusMsg = '\n🔓 Brawo! Ukończyłeś R1–R3 oraz zadania podstawowe 1–5 — odblokowałeś Zadania Zaawansowane (6–10) oraz kolejny dział na Mapie Ścieżki!';
          toast('🔓 Odblokowano zadania 6–10 oraz następną lekcję!');
        }
      }
      if (vIdx + 1 < task.variants.length) {
        var nextUnlockedStep = task.variants[vIdx + 1];
        unlockBonusMsg += '\n👉 Odblokowano kolejny krok: Zadanie ' + (nextUnlockedStep.stepCode || (vIdx + 2)) + '. Kliknij zielony przycisk poniżej!';
      } else {
        unlockBonusMsg += '\n🏆 Wszystkie 13 zadań w tym dziale (R1–R3 oraz 1–10) zostały ukończone!';
      }
      var curLbl = variant.stepCode || (vIdx + 1);
      lastFeedback = { type: 'ok', title: '✅ Zadanie ' + curLbl + ' zaliczone! (+' + (isWarmStep ? 10 : 15) + ' XP)', msg: cmp.msg + unlockBonusMsg };
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
      uiState.schemaBoxOpen = false;
      uiState.hintStep = 0;
      lastExecResult = null;
      lastExpectedResult = null;
      lastFeedback = null;
      lastChecklist = null;
      if (state.diagIdx < DIAG_QUESTIONS.length) {
        state.editorCode = '-- Zadanie diagnostyczne #' + (state.diagIdx + 1) + '\nSELECT ';
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
    }
  }
  else if (act === 'skipDiag') {
    var sq = DIAG_QUESTIONS[state.diagIdx];
    state.diagSkipped.push(sq.lvl);
    registerGapTrap(sq.gap, sq.title, 'Zagadnienie pominięte podczas Diagnozy.');
    state.diagIdx++;
    uiState.schemaBoxOpen = false;
    uiState.hintStep = 0;
    lastExecResult = null;
    lastExpectedResult = null;
    lastFeedback = null;
    lastChecklist = null;
    if (state.diagIdx < DIAG_QUESTIONS.length) {
      state.editorCode = '-- Zadanie diagnostyczne #' + (state.diagIdx + 1) + '\nSELECT ';
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
    uiState.schemaBoxOpen = false;
    uiState.hintStep = 0;
    state.editorCode = '-- Zadanie diagnostyczne #1\nSELECT ';
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
    uiState.schemaBoxOpen = false;
    uiState.hintStep = 0;
    var ltOpen = LEMUR_TASKS.find(function(x) { return x.id === state.activeLemurId; });
    state.editorCode = '-- ' + (ltOpen ? ltOpen.title : 'Zadanie rekrutacyjne') + '\nSELECT ';
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
    uiState.hintStep = 0;
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
      lastFeedback = { type: 'ok', title: '🏆 Brawo! Zadanie rekrutacyjne zaliczone (+40 XP)', msg: lCmp.msg };
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
    navigator.serviceWorker.register('./sw.js?v=10', { updateViaCache: 'none' }).then(function(registration) {
      document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'visible') {
          registration.update().catch(function() {});
        }
      });
    }).catch(function() {});
  });
}
})();

