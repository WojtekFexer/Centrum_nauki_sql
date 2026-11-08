# Stan projektu: Centrum nauki SQL (SQL Master)

> Dołączaj ten plik na starcie każdej nowej rozmowy z Gemem 3. Czyta go też agent w VS Code. Aktualizuj go po każdej sesji. Odhaczaj `[x]` dopiero po własnym teście w przeglądarce.

**Ostatnia aktualizacja:** 08.11.2026 (Wersja `v14.0` — po wdrożeniu układu *Zero-Scroll Split UI*, układanki *Tap-to-Build*, pełnej przebudowie Ścieżki na 8 Działów / 27 pod-lekcji / 141 zadań, precyzyjnych wzorów w okienkach `AS` oraz audytu Copilota)

## Pliki
- `index.html`: szkielet HTML aplikacji mobilnej PWA z wersjonowaniem lokalnych zasobów (`?v=14`) i meta tagami dla iOS Safari / Android Chrome
- `css/style.css`: style aplikacji w standardzie *Zero-Scroll Split UI* (przypięty 1-liniowy pasek górny `sticky` z pigułkami `🟢 PG16`, `⚡ XP`, `🔥 Seria`, kompaktowe dwuwierszowe karty na Mapie Ścieżki, kolory składni w stylu DBeavera `.sql-kw`, `.sql-fn`, `.sql-alias`, kontrastowe kafelki układanki `.puzzle-chip`, okienko `.alias-exact-formula`, responsywny modal samouczka 375px)
- `js/app.js`: główna logika aplikacji (`APP_VERSION = 'v14'`), silnik PGlite (`dbInitPromise` z Self-Healing Cache), dynamiczny silnik lekcji (*Adaptive Lesson Engine* obsługujący dowolną liczbę działów i wariantów zadań), 3 zakładki kontekstowe nad edytorem (`📌 Zadanie`, `📊 Tabela`, `🎯 Wzór i pomoc`), tryb układanki klockowej (*Tap-to-Build*) dla rozgrzewek `R1/R2`, generator dokładnych wzorów i polskich wyjaśnień w okienku kolumn aliasowanych (`explainSqlExpressionInPolish`, `buildAliasHelpBoxHtml`), porównania składni w stylu SoloLearn (`Przed ❌ vs Po ✅`), akordeon dla wielu tabel w `JOIN` oraz poprawki z audytu Copilota (ochrona warunków w nawiasach, walidacja aliasów w `compareResults`, skalowanie Diagnozy na 8 działów, synchronizacja `gaps` w Supabase i *debounce* zapisu edytora)
- `js/data-dvdrental.js`: schemat (`SCHEMA_META`) i dane wsadowe (`DVDRENTAL_SEED_SQL`) bazy `dvdrental`
- `js/data-tasks.js`: rozbudowana baza zadań Ścieżki — **8 Działów (`STAGES` 1..8), 27 celowanych pod-lekcji i 141 zadań** (po 4–8 niepowtarzalnych zadań na lekcję, w tym 34 rozgrzewki `R1/R2` w trybie układanki i dynamiczne progi odblokowania `unlockAt: 3..5`), kompletne 4-slajdowe wprowadzenia w `LESSON_TUTORIALS` oraz Diagnoza (10 zadań) — 100% zapytań zweryfikowanych w PGlite
- `js/data-interview.js`: pula 60 zadań rekrutacyjnych w stylu DataLemur po pełnej korekcie polszczyzny biznesowej (łącznie w aplikacji: **211 przetestowanych zapytań SQL**)
- `manifest.json`: konfiguracja instalacji pełnoekranowej PWA (`display: standalone`) ze ścieżkami względnymi (`./`)
- `sw.js`: Service Worker (`sql-master-v14`) ze strategią Network-First (`cache: 'no-store'`) dla plików lokalnych, walidacją rozmiaru paczki `.data` (>5 MB) dla silnika WASM PGlite i Network-Only dla `supabase.co`
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

## Testy (z bieżącej sesji — v12 do v14.0)
- [x] Kolorowanie składni w stylu DBeavera (słowa kluczowe, funkcje, stałe i zadeklarowane aliasy tabel) działa w edytorze, slajdach, quizach i wskazówkach
- [x] Interaktywny 4-kartowy Samouczek Powitalny (z klikalnym podświetlaniem kolumn i wierszy na Karcie 2) mieści się w 100% na ekranie telefonu (375px) i po zakończeniu otwiera okno wyboru nicku dla nowych graczy
- [x] Układ *Zero-Scroll Split UI* (przypięty pasek górny z `XP`/`Serią`, 3 zakładki nad edytorem, wyższy edytor bez przeskakującego `SELECT`, układanka klockowa w rozgrzewkach `R1/R2`) działa płynnie na widoku mobilnym
- [x] Klikalne okienka paska górnego (`🟢 PG16`, `⚡ XP`, `🔥 Seria`) otwierają się i zamykają bezbłędnie, a pigułki kolumn z aliasem (`✨ cost_diff ℹ️` i wszystkie pozostałe) wyświetlają dokładny wzór wyliczenia i wstawiają kod do edytora
- [x] Nowa Mapa Ścieżki wyświetla czyste, dwuwierszowe karty w 8 Działach i 27 pod-lekcjach (141 zadań) z zachowaniem dotychczasowych postępów w `localStorage`
- [x] Wykonano automatyczny test wszystkich **211 zapytań wzorcowych** w silniku PGlite WASM (141 Ścieżka + 10 Diagnoza + 60 Rekrutacja -> **211/211 SUCCESS, 0 FAIL**) oraz 45 testów integracyjnych UI (**45/45 PASSED**)
- [ ] Zebranie uwag z kilkudniowych testów wersji `v14.0` na telefonach (GitHub Pages)
- [ ] Wdrożenie **Etapu 3 z mapy drogowej `ARCHITEKTURA.md` (v3.0)**: moduł **AI Adaptive Gap Engine** (dynamiczne generowanie zadań przez AI pod najczęstsze błędy użytkownika z walidacją w PGlite)

## Plan (Dalsze kroki wg `ARCHITEKTURA.md` v3.0)
- [x] 1 Prototyp rdzenia, podział na moduły, lokalny PWA, chmura Supabase Live i publikacja na GitHub Pages (v1–v11)
- [x] 2 **Etap 1 i 2 (v12–v14.0 — WDROŻONE):** Rewolucja wizualna *Zero-Scroll Split UI*, kolorowanie DBeaver, układanka *Tap-to-Build* w rozgrzewkach, przebudowa Ścieżki na 8 Działów i 27 celowanych pod-lekcji (211 przetestowanych zapytań), audyt Copilota i precyzyjne okienka pomocy `AS`
- [ ] 3 **Etap 3 (Następne sesje — v15):** **AI Adaptive Gap Engine (Inteligentny Trener Luk)** — automatyczna telemetria błędów użytkownika (`g1–g13`) i generowanie spersonalizowanych zadań naprawczych przez AI z twardą weryfikacją wykonalności w PGlite
- [ ] 4 **Etap 4 (v16):** Pełne logowanie **Supabase Auth** (Google / E-mail), synchronizacja postępu i luk między urządzeniami, Tygodniowe Ligi Rankingowe oraz „Wyzwanie Dnia (*Daily SQL*)”
- [ ] 5 **Etap 5 (v17 — Produkt Komercyjny):** Bramka monetyzacji Freemium / Pakiet PRO, Certyfikat do CV oraz opakowanie aplikacji przez **CapacitorJS** pod Google Play / App Store

## Ostatnia sesja (podsumowanie od Gema — 08.11.2026)
1. **Rewolucja wizualna *Zero-Scroll Split UI* i przypięty pasek górny (`v13–v14`):** zlikwidowano wielowierszowe ramki nad zadaniem na rzecz 3 zakładek kontekstowych (`📌 Zadanie`, `📊 Tabela`, `🎯 Wzór i pomoc`), przypięto na stałe górny pasek z interaktywnymi okienkami (`🟢 PG16`, `⚡ XP`, `🔥 Seria`), powiększono edytor SQL (startujący z pustym polem i przyciskami `⌫ Cofnij` / `🧹 Wyczyść`) oraz odchudzono karty na Mapie Ścieżki.
2. **Tryb układanki *Tap-to-Build*, interaktywny Samouczek i porównania SoloLearn:** w zadaniach rozgrzewkowych (`R1/R2`) wdrożono bezklawiaturową układankę z kontrastowych klocków SQL, na Karcie 2 samouczka dodano interaktywne podświetlanie kolumn i wierszy po dotknięciu, a wskazówki składniowe przebudowano na format porównawczy „Przed ❌ vs Po ✅” (m.in. `OR` vs `IN`, 3 warianty `%` w `LIKE`).
3. **Precyzyjne okienka pomocy dla kolumn z aliasem (`AS`) i akordeon tabel:** wyeliminowano ogólnikowe komunikaty na rzecz funkcji `explainSqlExpressionInPolish`, która po kliknięciu w złotą pigułkę kolumny (np. `✨ cost_diff ℹ️`) pokazuje dokładne polskie wyjaśnienie operacji, pokolorowany wzór (`<wyrażenie> AS <alias>`) i przyciski wstawienia do edytora; w zakładce `📊 Tabela` dodano kolorowe plakietki nazw tabel i niezależne zwijanie każdej tabeli w zadaniach `JOIN`.
4. **Rozbudowa Ścieżki do 8 Działów, 27 pod-lekcji i 141 zadań (`js/data-tasks.js`):** wdrożono dynamiczny silnik lekcji i rozbito materiał na 8 działów tematycznych (osobne mikro-lekcje m.in. dla `IN`, `BETWEEN`, `LIKE` z `%` i `_`, `IS NULL`, `COUNT`, `SUM/AVG/MIN/MAX`, funkcji skalarnych tekstu/liczb/dat, `CASE WHEN`, `COALESCE`, `JOIN`, `CTE` i funkcji okna) o dopasowanej długości 4–6 zadań na lekcję.
5. **Audyt Copilota i 100% weryfikacji w PGlite (211/211 SUCCESS):** wdrożono poprawki z audytu statycznego (ochrona warunków liczbowych w nawiasach, weryfikacja aliasów w `compareResults`, skalowanie wyniku Diagnozy na 8 działów, synchronizacja `gaps` w Supabase, *debounce* zapisu), a testy w headless Chrome potwierdziły bezbłędne wykonanie wszystkich 211 zapytań SQL i 45 asercji UI.