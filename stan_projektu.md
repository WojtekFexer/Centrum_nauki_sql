# Stan projektu: Centrum nauki SQL (SQL Master)

> Dołączaj ten plik na starcie każdej nowej rozmowy z Gemem 3. Czyta go też agent w VS Code. Aktualizuj go po każdej sesji. Odhaczaj `[x]` dopiero po własnym teście w przeglądarce.

**Ostatnia aktualizacja:** 11.11.2026 (Wersja `v14.8` — realne przeliczanie XP i serii, telemetria Supabase, 8 quizów działów oraz poprawione wskazówki `AS`)

## Pliki
- `index.html`: szkielet HTML aplikacji mobilnej PWA z wersjonowaniem lokalnych zasobów (`?v=14.8`) i meta tagami dla iOS Safari / Android Chrome
- `css/style.css`: style aplikacji w standardzie *Zero-Scroll Split UI*, w tym pigułki `.alias-code-pill` i responsywny modal quizu działu dla ekranów 375px
- `js/app.js`: główna logika aplikacji (`APP_VERSION = 'v14.8'`), silnik PGlite (`dbInitPromise` z Self-Healing Cache), dynamiczny silnik lekcji, realne XP i seria dni, `SQLTelemetry` dla sesji/prób Supabase, quizy działów oraz polskie wskazówki aliasów `AS`
- `js/data-dvdrental.js`: schemat (`SCHEMA_META`) i dane wsadowe (`DVDRENTAL_SEED_SQL`) bazy `dvdrental`
- `js/data-tasks.js`: baza 141 zadań, 10 pytań Diagnozy oraz komplet `STAGE_QUIZZES` (8 działów × 5 pytań)
- `js/data-interview.js`: pula 60 zadań rekrutacyjnych w stylu DataLemur po pełnej korekcie polszczyzny biznesowej (łącznie w aplikacji: **211 przetestowanych zapytań SQL**)
- `manifest.json`: konfiguracja instalacji pełnoekranowej PWA (`display: standalone`) ze ścieżkami względnymi (`./`)
- `sw.js`: Service Worker (`sql-master-v14.8`) ze strategią Network-First (`cache: 'no-store'`) dla plików lokalnych, walidacją rozmiaru paczki `.data` (>5 MB) dla silnika WASM PGlite i Network-Only dla `supabase.co`
- `docs/ARCHITEKTURA.md`: wizja i plan techniczny (zaktualizowany do v3.0 — horyzont 10 tygodni do wersji komercyjnej)
- `stan_projektu.md`: ten plik
- `GEMINI.md`: zasady pracy agenta w VS Code

## Decyzje
- **Silnik SQL i odporność Cache WASM (WDROŻONE):** `@electric-sql/pglite` (PostgreSQL 16 w WebAssembly) zabezpieczony Singletonem (`dbInitPromise`) oraz mechanizmem Self-Healing Cache w `sw.js` i `initDatabase()`.
- **Standard wizualny *Zero-Scroll Split UI* i ergonomia mobilna (WDROŻONE w v13–v14):**
  - Przypięty na stałe (`sticky`) 1-liniowy pasek górny z interaktywnymi okienkami dla `🟢 PG16`, `⚡ XP` i `🔥 Serii dni` (zamykanymi na 4 sposoby: przycisk `✕`, tło, ponowne kliknięcie, `Escape`).
  - Nad edytorem SQL (powiększonym do `min-height: 118px`, z pustym startem `placeholder`, blokadą Grammarly oraz przyciskami `⌫ Cofnij` i `🧹 Wyczyść`) znajdują się 3 szybkie zakładki kontekstowe: `📌 Zadanie` | `📊 Tabela` | `🎯 Wzór i pomoc`.
  - W zakładce `📊 Tabela` nazwy tabel mają błękitne plakietki bazodanowe, podgląd `Example Input` filtruje kolumny ściśle według `SCHEMA_META`, a w zadaniach wielotabelowych (`JOIN`) każda tabela ma własny akordeon zwijania kolumn i wierszy.
  - W zadaniach rozgrzewkowych (`🔥 R1/R2`) działa bezklawiaturowy tryb układanki z klocków (*Tap-to-Build*).
- **Nowa architektura Ścieżki: 8 Działów, 27 pod-lekcji i 141 zadań (WDROŻONE w v14):**
  - Zamiast 5 ogólnych worków po 8 zadań, materiał rozbito na **8 logicznych Działów i 27 celowanych mikro-lekcji** o dopasowanej długości (4–6 zadań w nowych lekcjach, próg odblokowania `unlockAt: 3–4`): osobne pod-lekcje m.in. dla operatorów `WHERE`, `AND/OR/()`, `IN`, `BETWEEN`, wzorców tekstowych `LIKE/ILIKE` (`'A%'`, `'%a'`, `'%abc%'`, `_`), `IS NULL`, `COUNT`, `SUM/AVG/MIN/MAX`, funkcji tekstowych/liczbowych/dat, `CASE WHEN`, `COALESCE`, `INNER JOIN`, `LEFT JOIN`, `UNION`, `CTE` oraz funkcji okna (`ROW_NUMBER/RANK` i `LAG/LEAD`).
  - Karty pod-lekcji na Mapie Ścieżki zostały oczyszczone ze zbędnych opisów zadań pod spodem, a na górze widoku znajduje się karta szybkiego startu `🔥 KONTYNUUJ NAUKĘ`.
- **Precyzyjne okienka kolumn wyliczanych (`AS`) i porównania SoloLearn (WDROŻONE w v13.2–v14):**
  - Na liście wymaganych kolumn pigułki z aliasem są zgrabne (`✨ nazwa_kolumny ℹ️`), a po kliknięciu w nie otwiera się okienko z polskim wyjaśnieniem reguły (`explainSqlExpressionInPolish`), pokolorowanym dokładnym wzorem dla tego zadania (`<wyrażenie> AS <alias>`) oraz przyciskami wstawienia do edytora.
  - Boksy `🆕 Nowy element` i wskazówki składniowe pokazują zestawienia porównawcze „Stary zapis ❌ vs Nowy zapis ✅” (np. wielokrotne `OR` vs `IN`, 3 warianty znaku `%` w `LIKE`).
- **Aktualizacja v14.8:** XP jest odtwarzane z zapisanych ukończeń, data serii jest aktualizowana raz dziennie, a `app_sessions` i `task_attempts` są przygotowane w skrypcie Supabase. Każdy z 8 działów ma pięciopytaniowy quiz zaliczany wynikiem co najmniej 4/5.

## Testy (z bieżącej sesji — v12 do v14.8)
- [x] Kolorowanie składni w stylu DBeavera (słowa kluczowe, funkcje, stałe i zadeklarowane aliasy tabel) działa w edytorze, slajdach, quizach i wskazówkach
- [x] Interaktywny 4-kartowy Samouczek Powitalny (z klikalnym podświetlaniem kolumn i wierszy na Karcie 2) mieści się w 100% na ekranie telefonu (375px) i po zakończeniu otwiera okno wyboru nicku dla nowych graczy
- [x] Układ *Zero-Scroll Split UI* (przypięty pasek górny z `XP`/`Serią`, 3 zakładki nad edytorem, wyższy edytor bez przeskakującego `SELECT`, układanka klockowa w rozgrzewkach `R1/R2`) działa płynnie na widoku mobilnym
- [x] Klikalne okienka paska górnego (`🟢 PG16`, `⚡ XP`, `🔥 Seria`) otwierają się i zamykają bezbłędnie, a pigułki kolumn z aliasem (`✨ cost_diff ℹ️` i wszystkie pozostałe) wyświetlają dokładny wzór wyliczenia i wstawiają kod do edytora
- [x] Nowa Mapa Ścieżki wyświetla czyste, dwuwierszowe karty w 8 Działach i 27 pod-lekcjach (141 zadań) z zachowaniem dotychczasowych postępów w `localStorage`
- [x] W przeglądarce sprawdzono 8 kart quizów, po 5 pytań i 4 odpowiedzi w każdym; quiz Działu 1 zaliczony wynikiem 5/5 naliczył dokładnie 50 XP, a modal mieści się na ekranie 375 px
- [ ] Zapis sesji/prób potwierdzony w tabelach Supabase (w tej sesji niedostępne połączenie z API)
- [x] Wykonano automatyczny test wszystkich **211 zapytań wzorcowych** w silniku PGlite WASM (141 Ścieżka + 10 Diagnoza + 60 Rekrutacja -> **211/211 SUCCESS, 0 FAIL**) oraz 45 testów integracyjnych UI (**45/45 PASSED**)
- [ ] Zebranie uwag z kilkudniowych testów wersji `v14.0` na telefonach (GitHub Pages)
- [ ] Wdrożenie **Etapu 3 z mapy drogowej `ARCHITEKTURA.md` (v3.0)**: moduł **AI Adaptive Gap Engine** (dynamiczne generowanie zadań przez AI pod najczęstsze błędy użytkownika z walidacją w PGlite)

## Plan (Dalsze kroki wg `ARCHITEKTURA.md` v3.0)
- [x] 1 Prototyp rdzenia, podział na moduły, lokalny PWA, chmura Supabase Live i publikacja na GitHub Pages (v1–v11)
- [x] 2 **Etap 1 i 2 (v12–v14.0 — WDROŻONE):** Rewolucja wizualna *Zero-Scroll Split UI*, kolorowanie DBeaver, układanka *Tap-to-Build* w rozgrzewkach, przebudowa Ścieżki na 8 Działów i 27 celowanych pod-lekcji (211 przetestowanych zapytań), audyt Copilota i precyzyjne okienka pomocy `AS`
- [ ] 3 **Etap 3 (Następne sesje — v15):** **AI Adaptive Gap Engine (Inteligentny Trener Luk)** — automatyczna telemetria błędów użytkownika (`g1–g13`) i generowanie spersonalizowanych zadań naprawczych przez AI z twardą weryfikacją wykonalności w PGlite
- [ ] 4 **Etap 4 (v16):** Pełne logowanie **Supabase Auth** (Google / E-mail), synchronizacja postępu i luk między urządzeniami, Tygodniowe Ligi Rankingowe oraz „Wyzwanie Dnia (*Daily SQL*)”
- [ ] 5 **Etap 5 (v17 — Produkt Komercyjny):** Bramka monetyzacji Freemium / Pakiet PRO, Certyfikat do CV oraz opakowanie aplikacji przez **CapacitorJS** pod Google Play / App Store

## Ostatnia sesja (podsumowanie Copilota — 11.11.2026)
1. **Rewolucja wizualna *Zero-Scroll Split UI* i przypięty pasek górny (`v13–v14`):** zlikwidowano wielowierszowe ramki nad zadaniem na rzecz 3 zakładek kontekstowych (`📌 Zadanie`, `📊 Tabela`, `🎯 Wzór i pomoc`), przypięto na stałe górny pasek z interaktywnymi okienkami (`🟢 PG16`, `⚡ XP`, `🔥 Seria`), powiększono edytor SQL (startujący z pustym polem i przyciskami `⌫ Cofnij` / `🧹 Wyczyść`) oraz odchudzono karty na Mapie Ścieżki.
2. **Tryb układanki *Tap-to-Build*, interaktywny Samouczek i porównania SoloLearn:** w zadaniach rozgrzewkowych (`R1/R2`) wdrożono bezklawiaturową układankę z kontrastowych klocków SQL, na Karcie 2 samouczka dodano interaktywne podświetlanie kolumn i wierszy po dotknięciu, a wskazówki składniowe przebudowano na format porównawczy „Przed ❌ vs Po ✅” (m.in. `OR` vs `IN`, 3 warianty `%` w `LIKE`).
3. **Precyzyjne okienka pomocy dla kolumn z aliasem (`AS`) i akordeon tabel:** wyeliminowano ogólnikowe komunikaty na rzecz funkcji `explainSqlExpressionInPolish`, która po kliknięciu w złotą pigułkę kolumny (np. `✨ cost_diff ℹ️`) pokazuje dokładne polskie wyjaśnienie operacji, pokolorowany wzór (`<wyrażenie> AS <alias>`) i przyciski wstawienia do edytora; w zakładce `📊 Tabela` dodano kolorowe plakietki nazw tabel i niezależne zwijanie każdej tabeli w zadaniach `JOIN`.
4. **Rozbudowa Ścieżki do 8 Działów, 27 pod-lekcji i 141 zadań (`js/data-tasks.js`):** wdrożono dynamiczny silnik lekcji i rozbito materiał na 8 działów tematycznych (osobne mikro-lekcje m.in. dla `IN`, `BETWEEN`, `LIKE` z `%` i `_`, `IS NULL`, `COUNT`, `SUM/AVG/MIN/MAX`, funkcji skalarnych tekstu/liczb/dat, `CASE WHEN`, `COALESCE`, `JOIN`, `CTE` i funkcji okna) o dopasowanej długości 4–6 zadań na lekcję.
5. **Audyt Copilota i 100% weryfikacji w PGlite (211/211 SUCCESS):** wdrożono poprawki z audytu statycznego (ochrona warunków liczbowych w nawiasach, weryfikacja aliasów w `compareResults`, skalowanie wyniku Diagnozy na 8 działów, synchronizacja `gaps` w Supabase, *debounce* zapisu), a testy w headless Chrome potwierdziły bezbłędne wykonanie wszystkich 211 zapytań SQL i 45 asercji UI.
6. **Aktualizacja `v14.8`:** XP jest przeliczane z zaliczonych kroków, Diagnozy, Rekrutacji i quizów, seria używa `lastStreakDate`, a `SQLTelemetry` zapisuje sesje i próby do Supabase. Dodano 40 pytań quizowych (8 × 5), poprawiono opisy działań arytmetycznych w pomocy `AS` i zaktualizowano cache PWA. W przeglądarce potwierdzono quizy wszystkich działów, naliczenie 50 XP za zaliczenie oraz układ modalu przy szerokości 375 px; połączenia z API Supabase nie udało się potwierdzić.