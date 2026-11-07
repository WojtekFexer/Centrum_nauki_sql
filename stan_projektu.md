# Stan projektu: Centrum nauki SQL (SQL Master)

> Dołączaj ten plik na starcie każdej nowej rozmowy z Gemem 3. Czyta go też agent w VS Code. Aktualizuj go po każdej sesji. Odhaczaj `[x]` dopiero po własnym teście w przeglądarce.

**Ostatnia aktualizacja:** 07.11.2026 (Wersja `v12.1` — po wdrożeniu kolorowania DBeaver, samouczka SoloLearn, sugestii testerów mobilnych, korekcie 198 zadań i auto-naprawie cache PGlite WASM)

## Pliki
- `index.html`: szkielet HTML aplikacji mobilnej PWA z wersjonowaniem lokalnych zasobów (`?v=12.1`) i meta tagami dla iOS Safari / Android Chrome
- `css/style.css`: style aplikacji (układ Editor-Centric Mobile UI, kolory składni w stylu DBeavera `.sql-kw`, `.sql-fn`, `.sql-alias`, `.sql-str`, `.sql-num`, responsywny modal samouczka 375px, pigułki `.req-calc-pill` i `.sql-as-badge`, animacje przejść `.task-step-flash`)
- `js/app.js`: główna logika aplikacji (`APP_VERSION = 'v12.1'`), silnik PGlite (`dbInitPromise` z auto-naprawą uszkodzonego cache WASM `Invalid FS bundle size`), parser `highlightSQL` i `detectSqlTableAliases`, 4-kartowy samouczek powitalny (`renderOnboardingModal`), progresywny potok SQL (`getProgressivePipelineForTask`), generator czysto biznesowych poleceń (`buildCleanPolecenie` bez zdradzania wzorów i nazw technicznych), przełącznik `🔥 Rozgrzewka 1 z 2` / `🎯 Zadanie 1 z 6`, licznik odblokowania `X/5`, pusty edytor na starcie z `placeholderem`, przyciski `⌫ Cofnij` i `🧹 Wyczyść`, 3-stopniowe podpowiedzi (`Kierunek` → `Szkielet z lukami` → `Wzór`) oraz sufler błędu przecinka przed `FROM`
- `js/data-dvdrental.js`: schemat (`SCHEMA_META`) i dane wsadowe (`DVDRENTAL_SEED_SQL`) bazy `dvdrental`
- `js/data-tasks.js`: zweryfikowana względem `SCHEMA_META` baza zadań Ścieżki (**128 zadań w 16 pod-lekcjach po 8 zadań**: 2 rozgrzewkowe + 6 głównych) oraz Diagnoza (10 zadań) — 100% zapytań przechodzi na PGlite
- `js/data-interview.js`: pula 60 zadań rekrutacyjnych w stylu DataLemur po pełnej korekcie polszczyzny biznesowej
- `manifest.json`: konfiguracja instalacji pełnoekranowej PWA (`display: standalone`) ze ścieżkami względnymi (`./`)
- `sw.js`: Service Worker (`sql-master-v12-1`) ze strategią Network-First (`cache: 'no-store'`) dla plików lokalnych, walidacją rozmiaru paczki `.data` (>5 MB) dla silnika WASM PGlite i Network-Only dla `supabase.co`
- `docs/ARCHITEKTURA.md`: wizja i plan techniczny (v2.0)
- `stan_projektu.md`: ten plik
- `GEMINI.md`: zasady pracy agenta w VS Code

## Decyzje
- **Silnik SQL i odporność Cache WASM (WDROŻONE w v12.1):** `@electric-sql/pglite` (PostgreSQL 16 w WebAssembly) zabezpieczony Singletonem (`dbInitPromise`) oraz mechanizmem Self-Healing Cache (w razie błędu `Invalid FS bundle size` / `ErrnoError` automatycznie czyści uszkodzony cache przeglądarki i pobiera pełny plik `.data`).
- **Kolorowanie składni w stylu DBeavera (WDROŻONE w v12):** Centralny parser `highlightSQL()` koloruje słowa kluczowe, funkcje, stałe oraz zadeklarowane w `FROM`/`JOIN` aliasy tabel we wszystkich widokach aplikacji (edytor, 4 slajdy lekcji, quiz, `🆕 Nowy element` i ściąga).
- **Ergonomia mobilna i sugestie testerów (WDROŻONE w v12–v12.1):**
  - Edytor SQL otwiera się pusty (z instrukcją w `placeholderze`), co eliminuje problem przeskakiwania słowa `SELECT` do 2. linii na telefonie; nad edytorem działają szybkie przyciski `⌫ Cofnij` oraz `🧹 Wyczyść`.
  - Numeracja rozróżnia `🔥 Rozgrzewka 1 z 2` oraz `🎯 Zadanie 1 z 6`, a pigułka odblokowania liczy wyłącznie 5 wymaganych zadań (`🔓 X/5` → `🌟 Kolejna lekcja odblokowana! (5/5)`).
  - Kontekstowa ściąga składni znajduje się na samym dole strony i wyświetla tylko 2–4 konstrukcje z bieżącej lekcji.
- **Rozdział języka biznesowego od technicznego i ochrona przed spojlerami (WDROŻONE w v12.1):**
  - `📌 Polecenie` opisuje cel czystym językiem biznesowym po polsku (bez technicznych nazw kolumn z podkreślnikami i bez warunków SQL w nawiasach).
  - `📋 Wymagania i założenia` podają dokładne nazwy tabel i kolumn, ale w kolumnach wyliczanych nie zdradzają gotowego wzoru matematycznego (wskazują tylko kolumny wejściowe + `AS alias`), a żółta wskazówka składniowa jest domyślnie zwinięta.
  - 3-stopniowe podpowiedzi prowadzą stopniowo: `Krok 1 (Kierunek słowny)` → `Krok 2 (Szkielet zapytania z lukami ___)` → `Krok 3 (Pełny wzór rozwiązania)`.

## Testy (z bieżącej sesji — v12 do v12.1)
- [x] Kolorowanie składni w stylu DBeavera (w tym aliasy tabel po zdefiniowaniu w `FROM`/`JOIN`) działa w edytorze, na 4 slajdach lekcji, w quizie i w ściądze
- [x] 4-kartowy Samouczek Powitalny (`🎓 Samouczek SQL`) działa z obsługą swipe i mieści się w 100% na ekranie telefonu (375px) wraz z instrukcją instalacji PWA
- [x] Slajd 2 pokazuje progresywny potok wykonywania zapytania (tylko klauzule poznane do bieżącej lekcji) ze wskazówką `👆 Dotknij...`
- [x] Przełącznik zadań pokazuje `🔥 Rozgrzewka 1 z 2` / `🎯 Zadanie 1 z 6`, zwięzłe tytuły na liście oraz licznik odblokowania `5/5`
- [x] Edytor startuje pusty z `placeholderem` (brak przeskakującego `SELECT`), działają przyciski `⌫ Cofnij` i `🧹 Wyczyść` oraz 3-stopniowe podpowiedzi bez zdradzania gotowca w 1. i 2. kroku
- [x] Wszystkie 198 zapytań wzorcowych (128 Ścieżka + 10 Diagnoza + 60 Rekrutacja) wykonuje się bezbłędnie (198/198 SUCCESS w PGlite), usunięto błędne kolumny (`email` w `staff`, `country` w `store`)
- [x] Błąd `Invalid FS bundle size` / `ErrnoError` w konsoli został naprawiony przez walidację rozmiaru w `sw.js` i auto-reset cache w `initDatabase()`
- [ ] Wykonanie pełnego audytu kodu i architektury przez Copilota w VS Code (według przygotowanego promptu) i wdrożenie wybranych rekomendacji

## Plan (Dalsze kroki)
- [x] 1 Prototyp rdzenia (interfejs Lista ↔ Edytor, PGlite z bazą dvdrental, Diagnoza 10 pytań)
- [x] 2 Rozbudowa puli zadań i podział monolitu na moduły (`style.css`, `app.js`, `data-*.js`)
- [x] 3 Lokalny PWA (`manifest.json`, `sw.js`), podpięcie chmury Supabase (`SQLRanking`) i publikacja na GitHub Pages (HTTPS)
- [x] 4 Przebudowa UX i dydaktyki do standardu SoloLearn + DataLemur (v11: 16 pod-lekcji po 8 zadań, zasada *Teach-First*, dwustopniowe tabele `Example Input/Output`, 3-punktowa checklista, klikalne cofanie zadań, kolorowe `AS`)
- [x] 5 **Wielka aktualizacja UX i jakości danych (v12–v12.1):** kolorowanie DBeaver, samouczek SoloLearn + PWA, korekta wszystkich 128 zadań Ścieżki i 60 zadań rekrutacyjnych, wdrożenie feedbacku testerów mobilnych i auto-naprawa cache WASM
- [ ] 6 **Następna sesja:** analiza raportu z audytu Copilota w VS Code, ewentualny refaktoring wąskich gardeł w `js/app.js` oraz zebranie kolejnej tury uwag z testów na telefonach

## Ostatnia sesja (podsumowanie od Gema — 07.11.2026)
1. **Kolorowanie składni DBeaver i progresywne slajdy lekcji:** wdrożono centralny parser `highlightSQL()` (słowa kluczowe, funkcje, stałe oraz aliasy tabel aktywowane po deklaracji w `FROM`/`JOIN`) we wszystkich elementach aplikacji, a Kartę 2 slajdów ograniczono wyłącznie do klauzul poznanych do bieżącej pod-lekcji z wyraźną wskazówką interaktywności.
2. **Samouczek SoloLearn (375px) i odchudzona nawigacja mobilna:** dodano przesuwany 4-kartowy modal powitalny dla początkujących z instrukcją instalacji pełnoekranowej PWA, powiększono przycisk `← Mapa ścieżki`, ujednolicono cofanie do listy w Wyzwaniach Rekrutacyjnych, przeniesiono odchudzoną ściągę na dół strony oraz zmieniono numerację na `🔥 Rozgrzewka 1 z 2` / `🎯 Zadanie 1 z 6` z licznikiem odblokowania `5/5`.
3. **Wdrożenie feedbacku od testerki mobilnej (Edytor i Podpowiedzi):** usunięto pre-wpisywane `SELECT` przy starcie zadania (zastąpione `placeholderem`, co wyeliminowało błąd przeskakiwania tekstu do 2. linii na telefonie), dodano przyciski `⌫ Cofnij` i `🧹 Wyczyść` nad edytorem oraz przebudowano podpowiedzi na 3 kroki (`Kierunek` → `Szkielet z lukami ___` → `Wzór rozwiązania`).
4. **Korekta 198 zadań i ochrona przed spojlerami w wymaganiach:** naprawiono błędne odwołania do kolumn w `js/data-tasks.js` (198/198 zapytań przechodzi testy na PGlite), oczyszczono `📌 Polecenie` z technicznych nazw kolumn i podpowiedzi SQL w nawiasach oraz ukryto gotowe wzory matematyczne w `📋 Wymagania i założenia`.
5. **Auto-naprawa błędu PGlite WASM (`v12.1`) i co dalej:** wyeliminowano błąd `Invalid FS bundle size` / `ErrnoError` poprzez walidację kompletności paczki `.data` w