(function(){
'use strict';

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
  .replace(/payment_date TEXT NOT NULL/g, 'payment_date DATE NOT NULL');

async function initDatabase() {
  var statusEl = document.getElementById('dbStatus');
  try {
    if (statusEl) statusEl.textContent = 'Pobieranie silnika PostgreSQL (PGlite)…';
    var mod = await import('https://cdn.jsdelivr.net/npm/@electric-sql/pglite/dist/index.js');
    var PGlite = mod.PGlite;
    db = new PGlite();
    await db.exec(PG_DVDRENTAL_DDL);
    if (window.INTERVIEW_SEED_SQL) {
      await db.exec(window.INTERVIEW_SEED_SQL);
    }
    dbReady = true;
    if (window.INTERVIEW_SCHEMA_META) {
      for (var i = 0; i < window.INTERVIEW_SCHEMA_META.length; i++) {
        var tblName = window.INTERVIEW_SCHEMA_META[i].table;
        interviewSamples[tblName] = await runQuery('SELECT * FROM ' + tblName + ' LIMIT 5;');
      }
    }
    if (statusEl) statusEl.textContent = 'Silnik PostgreSQL 16 (PGlite) gotowy';
    render();
  } catch (err) {
    console.error('PGlite init error:', err);
    if (statusEl) statusEl.textContent = 'Błąd inicjalizacji PostgreSQL WASM';
  }
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
  return { ok: true, msg: 'Brawo! Wynik Twojego zapytania w 100% pokrywa się z wzorcem na bazie dvdrental.' };
}

/* ==========================================================================
   6. STAN APLIKACJI I NAWIGACJI (CZYSTY PODZIAŁ LISTA <-> WORKSPACE)
   ========================================================================== */
var STORAGE_KEY = 'sqlmaster_dvd_v1';

function defaultState() {
  return {
    xp: 1202,
    streak: 4,
    theme: 'dark',
    unlockedStage: 1,
    diagDone: false,
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
    nickname: 'Wojtek_SQL'
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
var uiState = { schemaBoxOpen: false, theoryBoxOpen: null, lemurDiffFilter: 'all' };

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

// Wyciąga nazwy tabel biorących udział w zadaniu (z zapytania wzorcowego sol lub tablicy tables)
function resolveTaskTables(tableNames, solSql) {
  var sql = typeof tableNames === 'string' ? tableNames : String(solSql || '');
  if (sql) {
    var fromSol = ALL_SCHEMA_META.filter(function(m) {
      return new RegExp('\\b' + m.table + '\\b', 'i').test(sql);
    }).map(function(m) { return m.table; });
    if (fromSol.length) return fromSol;
  }
  if (Array.isArray(tableNames) && tableNames.length) return tableNames;
  return [];
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

  return '<details class="helper-fold"' + (uiState.schemaBoxOpen ? ' open' : '') + '>' +
    '<summary>👁 Podejrzyj i kliknij kolumny tabel w tym zadaniu (' + metas.map(function(m){return m.table;}).join(', ') + ')</summary>' +
    '<p class="small muted" style="margin:6px 0 8px">💡 Kliknij dowolną nazwę tabeli lub kolumny poniżej, aby od razu wstawić ją do swojego kodu SQL:</p>' +
    '<div style="display:flex;flex-direction:column;gap:8px">' +
      metas.map(function(m) {
        return '<div style="display:flex;flex-wrap:wrap;align-items:center;gap:5px">' +
          '<button type="button" class="helper-tbl-btn" data-act="ins" data-val="' + esc(m.table) + '" data-insert-sql="' + esc(m.table) + '" title="Wstaw nazwę tabeli ' + esc(m.table) + '">📦 ' + esc(m.table) + '</button>' +
          m.cols.map(function(c) {
            var colName = typeof c === 'string' ? c : c.name;
            var isKey = typeof c === 'string' ? /_id$/i.test(c) : !!c.isKey;
            var cls = 'helper-col-btn' + (isKey ? ' col-key-chip' : '');
            var ttl = isKey ? 'Klucz złączenia (JOIN ON)' : 'Wstaw kolumnę ' + esc(colName);
            var lbl = (isKey ? '🔗 ' : '') + esc(colName);
            return '<button type="button" class="' + cls + '" data-act="ins" data-val="' + esc(colName) + '" data-insert-sql="' + esc(colName) + '" title="' + ttl + '">' + lbl + '</button>';
          }).join('') +
          '<button type="button" class="btn sm" style="min-height:24px;padding:2px 8px;font-size:11px;margin-left:auto" data-act="peekTable" data-table="' + esc(m.table) + '">Podgląd 5 wierszy</button>' +
        '</div>';
      }).join('') +
    '</div>' +
    joinBanner +
  '</details>';
}
var renderTablesHelper = buildTaskSchemaBox;

function buildInterviewSpecBox(tableNames) {
  var activeTables = Array.isArray(tableNames) ? tableNames : [];
  var ivMeta = window.INTERVIEW_SCHEMA_META || [];
  var metas = ivMeta.filter(function(m) { return activeTables.indexOf(m.table) > -1; });
  if (!metas.length) return '';

  return '<div class="iv-spec-box">' +
    '<div class="iv-spec-hdr">📋 Specyfikacja tabel i przykładowe dane</div>' +
    '<p class="small muted" style="margin:2px 0 10px">Kliknij dowolną nazwę tabeli lub kolumny, aby wstawić ją do edytora SQL poniżej:</p>' +
    metas.map(function(m) {
      var sample = interviewSamples[m.table];
      var sampleHtml = '';
      if (sample && sample.columns && sample.columns.length) {
        sampleHtml = '<details class="iv-sample-fold" open>' +
          '<summary>Przykładowe wiersze z tabeli <code>' + esc(m.table) + '</code> (pierwsze ' + sample.values.length + ' wierszy)</summary>' +
          renderSingleTable(sample, 5) +
        '</details>';
      } else {
        sampleHtml = '<div style="margin-top:6px"><button type="button" class="btn sm" data-act="peekTable" data-table="' + esc(m.table) + '">👁 Podgląd 5 wierszy (' + esc(m.table) + ')</button></div>';
      }

      return '<div class="iv-tbl-card">' +
        '<div class="iv-tbl-top">' +
          '<button type="button" class="helper-tbl-btn" data-act="ins" data-val="' + esc(m.table) + '" data-insert-sql="' + esc(m.table) + '" title="Wstaw nazwę tabeli ' + esc(m.table) + '">📦 ' + esc(m.table) + '</button>' +
          '<span class="small muted">' + esc(m.desc) + '</span>' +
        '</div>' +
        '<div class="tblwrap iv-schema-wrap"><table><thead><tr><th>Kolumna (kliknij, aby wstawić)</th><th>Typ danych SQL</th></tr></thead><tbody>' +
          m.cols.map(function(c) {
            var isKey = !!c.isKey;
            var cls = 'helper-col-btn' + (isKey ? ' col-key-chip' : '');
            var lbl = (isKey ? '🔗 ' : '') + esc(c.name);
            return '<tr>' +
              '<td><button type="button" class="' + cls + '" data-act="ins" data-val="' + esc(c.name) + '" data-insert-sql="' + esc(c.name) + '">' + lbl + '</button></td>' +
              '<td><code>' + esc(c.type) + '</code></td>' +
            '</tr>';
          }).join('') +
        '</tbody></table></div>' +
        sampleHtml +
      '</div>';
    }).join('') +
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
    h += '<div class="fb-box ' + lastFeedback.type + '">' +
      '<strong>' + esc(lastFeedback.title) + '</strong>' +
      '<p class="small" style="margin:4px 0 0;white-space:pre-wrap">' + esc(lastFeedback.msg) + '</p>' +
    '</div>';
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
   8. WIDOKI ZAKŁADEK (PRZEJRZYSTY PODZIAŁ: MAPA vs TRYB ZADANIA)
   ========================================================================== */

// ZAKŁADKA 1: ŚCIEŻKA (120 WARIANTÓW)
function renderPathTab() {
  if (state.pathMode === 'solve') {
    var task = PATH_TASKS.find(function(t) { return t.id === state.activeTaskId; }) || PATH_TASKS[0];
    var vIdx = state.activeVariantIdx % task.variants.length;
    var variant = task.variants[vIdx];

    var varPills = '';
    for (var i = 0; i < task.variants.length; i++) {
      if (i === 5) {
        varPills += '<span class="var-sep" title="Warianty 6–10: Poziom Progresywny (Mix+)">Mix+</span>';
      }
      var vDone = !!state.completedVariants[task.id + ':' + i];
      var isMix = i >= 5;
      var cls = 'var-pill ' + (isMix ? 'var-pill-mix ' : '') + (i === vIdx ? 'active ' : '') + (vDone ? 'done' : '');
      var ttl = 'Wariant ' + (i + 1) + (isMix ? ' (Poziom Mix+)' : ' (Podstawy)');
      varPills += '<button type="button" class="' + cls.trim() + '" data-act="pickVariant" data-idx="' + i + '" title="' + ttl + '">' + (i + 1) + '</button>';
    }

    var isTheoryOpen = uiState.theoryBoxOpen !== null ? uiState.theoryBoxOpen : (task.stage === 1);
    var theoryHtml = task.theory
      ? '<details class="theory-box"' + (isTheoryOpen ? ' open' : '') + '>' +
          '<summary>📘 Teoria w pigułce: jak działają klauzule w tej lekcji (kliknij, aby rozwinąć/zwinąć)</summary>' +
          '<div class="theory-body">' + task.theory + '</div>' +
        '</details>'
      : '';

    var tierLabel = vIdx >= 5 ? ' · 🔥 Poziom Mix+' : ' · Podstawy';

    return '<div class="card">' +
      '<div class="ws-bar">' +
        '<button class="btn sm" data-act="backToPathList">← Wróć do Mapy Ścieżki</button>' +
        '<div class="var-pills"><span class="small muted" style="margin-right:2px">Wariant:</span>' + varPills + '</div>' +
        '<button class="btn sm" data-act="shuffleVariant">🎲 Losuj wariant</button>' +
      '</div>' +
      '<span class="chip info">Etap ' + task.stage + ' · Wariant ' + (vIdx + 1) + ' z ' + task.variants.length + tierLabel + '</span>' +
      '<h2 style="margin-top:8px">' + esc(task.title) + '</h2>' +
      theoryHtml +
      '<div class="prompt-box">' + formatPrompt(variant.prompt) + '</div>' +
      buildTaskSchemaBox(variant.tables || task.tables, variant.sol) +
      renderEditorWidget(task.cols, 'checkPathTask') +
      '<div class="acts" style="margin-top:12px;border-top:1px solid var(--line);padding-top:10px">' +
        '<button class="btn sm" data-act="showSolution">💡 Pokaż wzorcowy kod</button>' +
        '<button class="btn sm" data-act="aiHint">🤖 Podpowiedź AI</button>' +
      '</div>' +
    '</div>';
  }

  var totalVariants = PATH_TASKS.reduce(function(acc, t) { return acc + t.variants.length; }, 0);
  var doneVariants = Object.keys(state.completedVariants).length;
  var doneLessons = Object.keys(state.completedTasks).length;

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
      '<div><h2 style="margin:0">Mapa Ścieżki SQL (dvdrental)</h2>' +
      '<p class="small muted" style="margin:2px 0 0">Ukończone lekcje: <strong>' + doneLessons + '/' + PATH_TASKS.length + '</strong> · Rozwiązane warianty: <strong>' + doneVariants + '/' + totalVariants + '</strong></p></div>' +
      '<button class="btn primary sm" data-act="continuePath">▶ Kontynuuj naukę</button>' +
    '</div>' +
    '<div class="bar"><i style="width:' + Math.round((doneLessons / PATH_TASKS.length) * 100) + '%"></i></div>' +
  '</div>';

  STAGES.forEach(function(st) {
    var unlocked = st.id <= state.unlockedStage;
    var tasksInStage = PATH_TASKS.filter(function(t) { return t.stage === st.id; });
    var allDone = tasksInStage.every(function(t) { return state.completedTasks[t.id]; });

    h += '<div class="stage-box ' + (allDone ? 'completed' : unlocked ? 'unlocked' : '') + '">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;gap:8px">' +
        '<strong>' + esc(st.name) + '</strong>' +
        '<span class="chip ' + (allDone ? 'done' : unlocked ? 'mid' : 'info') + '">' + (allDone ? 'Opanowany' : unlocked ? 'Aktywny' : 'Dostępny') + '</span>' +
      '</div>' +
      '<p class="small muted" style="margin:4px 0 10px">' + esc(st.desc) + '</p>' +
      '<div class="node-list">';

    tasksInStage.forEach(function(t) {
      var vSolved = 0;
      for (var k = 0; k < t.variants.length; k++) {
        if (state.completedVariants[t.id + ':' + k]) vSolved++;
      }
      var isDone = !!state.completedTasks[t.id];
      h += '<button type="button" class="node-item" data-act="openPathTask" data-id="' + t.id + '">' +
        '<div>' +
          '<span class="node-title">' + (isDone ? '✅ ' : '📘 ') + esc(t.title) + '</span>' +
          '<div class="node-meta">' +
            '<span>Warianty: <strong>' + vSolved + '/' + t.variants.length + '</strong></span>' +
            '<span>· Tabele: ' + t.tables.slice(0, 3).join(', ') + '</span>' +
          '</div>' +
        '</div>' +
        '<span class="chip ' + (isDone ? 'done' : 'info') + '">' + (isDone ? 'Ćwicz warianty' : 'Rozwiąż →') + '</span>' +
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
  return '<div class="card">' +
    '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px">' +
      '<span class="chip mid">Diagnoza · Pytanie ' + (state.diagIdx + 1) + ' z ' + DIAG_QUESTIONS.length + '</span>' +
      '<span class="chip info">Sprawdza: Etap ' + q.stage + '</span>' +
    '</div>' +
    '<div class="bar"><i style="width:' + Math.round((state.diagIdx / DIAG_QUESTIONS.length) * 100) + '%"></i></div>' +
    '<h2>' + esc(q.title) + '</h2>' +
    '<div class="prompt-box">' + formatPrompt(q.prompt) + '</div>' +
    buildTaskSchemaBox(q.tables, q.sol) +
    renderEditorWidget(null, 'submitDiag') +
    '<div class="acts" style="margin-top:12px;border-top:1px solid var(--line);padding-top:12px;justify-content:space-between">' +
      '<button class="btn warn" data-act="skipDiag">⏭ Pomiń zadanie (Nie umiem jeszcze)</button>' +
      '<button class="btn sm" data-act="resetDiag">Restart</button>' +
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
    '<button type="button" class="' + (state.lemurSubTab === 'tasks' ? 'active' : '') + '" data-act="lemurSub" data-sub="tasks">🎯 Wyzwania Rekrutacyjne (' + tasksList.length + ')</button>' +
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
    return nav + '<div class="card">' +
      '<div class="ws-bar">' +
        '<button class="btn sm" data-act="backToLemurList">← Wróć do listy (' + tasksList.length + ' zadań)</button>' +
        '<div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap">' +
          '<span class="chip ' + bdg.cls + '">' + bdg.lbl + '</span>' +
          '<span class="chip info">' + esc(task.categoryTag || 'Analiza SQL') + '</span>' +
        '</div>' +
      '</div>' +
      '<h2>' + (isSolved ? '✅ ' : '') + esc(task.title) + '</h2>' +
      '<div class="prompt-box">' + formatPrompt(task.prompt) + '</div>' +
      buildInterviewSpecBox(task.tables) +
      buildTaskSchemaBox(task.tables, task.sol) +
      renderEditorWidget(task.cols, 'checkLemurTask') +
      '<div class="acts" style="margin-top:12px;border-top:1px solid var(--line);padding-top:10px">' +
        '<button class="btn sm" data-act="showLemurSol">💡 Pokaż wzorcowe rozwiązanie</button>' +
        '<button class="btn sm" data-act="lemurTrapHint">🛡️ Jaka tu jest pułapka?</button>' +
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

// ZAKŁADKA 5: KONTO, KLUCZ API & BACKUP
function renderProfileTab() {
  var totalPathVars = PATH_TASKS.reduce(function(acc, t) { return acc + t.variants.length; }, 0);
  var totalAllTasks = totalPathVars + DIAG_QUESTIONS.length + LEMUR_TASKS.length;
  return '<div class="card">' +
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
    '<p class="small muted">Twój obecny stan: <strong>' + state.xp + ' XP</strong> · Rozwiązane warianty Ścieżki: <strong>' + Object.keys(state.completedVariants).length + '/' + totalPathVars + '</strong> · Zadania Rekrutacyjne: <strong>' + Object.keys(state.completedLemur).length + '/' + LEMUR_TASKS.length + '</strong>.</p>' +
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
  v.innerHTML = currentTab === 'path' ? renderPathTab()
              : currentTab === 'diag' ? renderDiagTab()
              : currentTab === 'lemur' ? renderLemurTab()
              : currentTab === 'schema' ? renderSchemaTab()
              : renderProfileTab();

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
    uiState.schemaBoxOpen = false;
    if (currentTab === 'diag' && state.diagIdx < DIAG_QUESTIONS.length) {
      state.editorCode = '-- Zadanie diagnostyczne #' + (state.diagIdx + 1) + '\nSELECT ';
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
  else if (act === 'clearEd') {
    state.editorCode = '';
    lastExecResult = null;
    lastExpectedResult = null;
    lastFeedback = null;
    render();
  }
  else if (act === 'runOnly') {
    lastExecResult = await runQuery(state.editorCode);
    lastExpectedResult = null;
    lastFeedback = null;
    render();
  }
  else if (act === 'peekTable') {
    var tName = el.dataset.table;
    lastExecResult = await runQuery('SELECT * FROM ' + tName + ' LIMIT 5;');
    lastExpectedResult = null;
    lastFeedback = { type: 'warn', title: '👁 Podgląd tabeli ' + tName + ' (pierwsze 5 wierszy)', msg: 'Twój kod w edytorze pozostał bez zmian.' };
    render();
  }
  else if (act === 'openPathTask') {
    state.activeTaskId = el.dataset.id;
    state.activeVariantIdx = 0;
    state.pathMode = 'solve';
    uiState.schemaBoxOpen = false;
    uiState.theoryBoxOpen = null;
    var t = PATH_TASKS.find(function(x) { return x.id === state.activeTaskId; });
    if (t) state.editorCode = '-- ' + t.title + ' (Wariant 1)\nSELECT ';
    lastExecResult = null;
    lastExpectedResult = null;
    lastFeedback = null;
    saveState();
    render();
    window.scrollTo(0, 0);
  }
  else if (act === 'continuePath') {
    state.pathMode = 'solve';
    uiState.schemaBoxOpen = false;
    uiState.theoryBoxOpen = null;
    lastExecResult = null;
    lastExpectedResult = null;
    lastFeedback = null;
    saveState();
    render();
    window.scrollTo(0, 0);
  }
  else if (act === 'backToPathList') {
    state.pathMode = 'list';
    lastExecResult = null;
    lastExpectedResult = null;
    lastFeedback = null;
    saveState();
    render();
    window.scrollTo(0, 0);
  }
  else if (act === 'pickVariant') {
    state.activeVariantIdx = Number(el.dataset.idx) || 0;
    uiState.schemaBoxOpen = false;
    var tVar = PATH_TASKS.find(function(x) { return x.id === state.activeTaskId; });
    if (tVar) state.editorCode = '-- ' + tVar.title + ' (Wariant ' + (state.activeVariantIdx + 1) + ')\nSELECT ';
    lastExecResult = null;
    lastExpectedResult = null;
    lastFeedback = null;
    saveState();
    render();
  }
  else if (act === 'shuffleVariant') {
    var curTask = PATH_TASKS.find(function(x) { return x.id === state.activeTaskId; }) || PATH_TASKS[0];
    var len = curTask.variants.length;
    var nextIdx = Math.floor(Math.random() * len);
    if (len > 1 && nextIdx === state.activeVariantIdx) {
      nextIdx = (nextIdx + 1) % len;
    }
    state.activeVariantIdx = nextIdx;
    uiState.schemaBoxOpen = false;
    state.editorCode = '-- ' + curTask.title + ' (Wariant ' + (state.activeVariantIdx + 1) + ')\nSELECT ';
    lastExecResult = null;
    lastExpectedResult = null;
    lastFeedback = { type: 'warn', title: '🎲 Wylosowano Wariant #' + (state.activeVariantIdx + 1) + ' z ' + curTask.variants.length, msg: 'Zmieniliśmy tabelę lub warunki zadania. Napisz nowe zapytanie!' };
    saveState();
    render();
  }
  else if (act === 'checkPathTask') {
    var task = PATH_TASKS.find(function(t) { return t.id === state.activeTaskId; }) || PATH_TASKS[0];
    var vIdx = state.activeVariantIdx % task.variants.length;
    var variant = task.variants[vIdx];
    lastExecResult = await runQuery(state.editorCode);
    var expRes = await runQuery(variant.sol);
    var cmp = compareResults(lastExecResult, expRes, variant.order);
    if (cmp.ok) {
      lastExpectedResult = null;
      var vKey = task.id + ':' + vIdx;
      if (!state.completedVariants[vKey]) {
        state.completedVariants[vKey] = true;
        state.xp += 15;
      }
      if (!state.completedTasks[task.id]) {
        state.completedTasks[task.id] = true;
        state.xp += 15;
      }
      if (task.stage >= state.unlockedStage && state.unlockedStage < 5) {
        state.unlockedStage = task.stage + 1;
      }
      lastFeedback = { type: 'ok', title: '✅ Wariant #' + (vIdx + 1) + ' zaliczony! (+XP)', msg: cmp.msg + ' Możesz kliknąć kolejny numer wariantu u góry karty, aby przećwiczyć inne tabele!' };
      saveState();
    } else {
      lastExpectedResult = lastExecResult.error ? null : expRes;
      var pathTrap = task.detectTrap ? task.detectTrap(state.editorCode, lastExecResult) : null;
      if (pathTrap && task.gapId) registerGapTrap(task.gapId, task.title, pathTrap);
      var pathErrMsg = lastExecResult.error
        ? cmp.msg
        : (pathTrap ? pathTrap : 'Odpowiedź nie pasuje do wzorca. Porównaj swój wynik z oczekiwanym wynikiem poniżej.');
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
    lastFeedback = { type: 'warn', title: '💡 Wczytano wzorcowe rozwiązanie', msg: 'Przeanalizuj kod, a następnie przełącz się na kolejny Wariant (1..10), aby napisać podobne zapytanie samodzielnie.' };
    saveState();
    render();
  }
  else if (act === 'submitDiag') {
    var dq = DIAG_QUESTIONS[state.diagIdx];
    lastExecResult = await runQuery(state.editorCode);
    var dExp = await runQuery(dq.sol);
    var dCmp = compareResults(lastExecResult, dExp, dq.order);
    if (dCmp.ok) {
      state.diagScore++;
      state.xp += 15;
      toast('Dobrze! Pytanie ' + (state.diagIdx + 1) + '/10 zaliczone.');
      state.diagIdx++;
      uiState.schemaBoxOpen = false;
      lastExecResult = null;
      lastExpectedResult = null;
      lastFeedback = null;
      if (state.diagIdx < DIAG_QUESTIONS.length) {
        state.editorCode = '-- Zadanie diagnostyczne #' + (state.diagIdx + 1) + '\nSELECT ';
      }
      saveState();
      render();
    } else {
      lastExpectedResult = lastExecResult.error ? null : dExp;
      var diagErrMsg = lastExecResult.error
        ? dCmp.msg
        : 'Odpowiedź nie pasuje do wzorca. Porównaj swój wynik z oczekiwanym wynikiem poniżej.';
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
    lastExecResult = null;
    lastExpectedResult = null;
    lastFeedback = null;
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
    render();
    toast('Odblokowano Etap ' + st + ' w Ścieżce!');
  }
  else if (act === 'resetDiag') {
    state.diagIdx = 0;
    state.diagScore = 0;
    state.diagSkipped = [];
    uiState.schemaBoxOpen = false;
    state.editorCode = '-- Zadanie diagnostyczne #1\nSELECT ';
    lastExecResult = null;
    lastExpectedResult = null;
    lastFeedback = null;
    saveState();
    render();
  }
  else if (act === 'lemurSub') {
    state.lemurSubTab = el.dataset.sub;
    lastExecResult = null;
    lastExpectedResult = null;
    lastFeedback = null;
    saveState();
    render();
  }
  else if (act === 'lemurFilter') {
    uiState.lemurDiffFilter = el.dataset.diff || 'all';
    render();
  }
  else if (act === 'openLemurTask') {
    state.activeLemurId = el.dataset.id;
    state.lemurMode = 'solve';
    uiState.schemaBoxOpen = false;
    var ltOpen = LEMUR_TASKS.find(function(x) { return x.id === state.activeLemurId; });
    state.editorCode = '-- ' + (ltOpen ? ltOpen.title : 'Zadanie rekrutacyjne') + '\nSELECT ';
    lastExecResult = null;
    lastExpectedResult = null;
    lastFeedback = null;
    saveState();
    render();
    window.scrollTo(0, 0);
  }
  else if (act === 'backToLemurList') {
    state.lemurMode = 'list';
    lastExecResult = null;
    lastExpectedResult = null;
    lastFeedback = null;
    saveState();
    render();
    window.scrollTo(0, 0);
  }
  else if (act === 'checkLemurTask') {
    var lt = LEMUR_TASKS.find(function(x) { return x.id === state.activeLemurId; }) || LEMUR_TASKS[0];
    lastExecResult = await runQuery(state.editorCode);
    var lExp = await runQuery(lt.sol);
    var lCmp = compareResults(lastExecResult, lExp, !!lt.order);
    if (lCmp.ok) {
      lastExpectedResult = null;
      if (!state.completedLemur[lt.id]) {
        state.completedLemur[lt.id] = true;
        state.xp += 40;
      }
      lastFeedback = { type: 'ok', title: '🏆 Brawo! Zadanie rekrutacyjne zaliczone (+40 XP)', msg: lCmp.msg };
      saveState();
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
          msg: lastExecResult.error ? lCmp.msg : 'Odpowiedź nie pasuje do wzorca. Porównaj swój wynik z oczekiwanym wynikiem poniżej.'
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
    lastFeedback = { type: 'warn', title: '💡 Wzorcowe rozwiązanie (' + lt2.title + ')', msg: lt2.hint || lt2.gapHint };
    saveState();
    render();
  }
  else if (act === 'lemurTrapHint') {
    var lt3 = LEMUR_TASKS.find(function(x) { return x.id === state.activeLemurId; }) || LEMUR_TASKS[0];
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

if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('./sw.js').catch(function() {});
  });
}
})();

