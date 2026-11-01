# Stan projektu: Centrum nauki SQL (SQL Master)

> Dołączaj ten plik na starcie każdej nowej rozmowy z Gemem 3. Czyta go też agent w VS Code. Aktualizuj go po każdej sesji. Odhaczaj `[x]` dopiero po własnym teście w przeglądarce.

**Ostatnia aktualizacja:** 01.11.2026

## Pliki
- `index.html`: szkielet HTML oraz główna logika aplikacji i silnika PGlite (odchudzony po wydzieleniu stylów i danych)
- `css/style.css`: wszystkie style aplikacji (motyw ciemny/jasny, responsywność, wyróżnienia kluczy `🔗 .col-key-chip`)
- `js/data-dvdrental.js`: schemat (`SCHEMA_META`) i dane wsadowe (`DVDRENTAL_SEED_SQL`) 10 tabel bazy `dvdrental`
- `js/data-tasks.js`: dane wszystkich 82 zadań (`STAGES`, `PATH_TASKS`, `DIAG_QUESTIONS`, `LEMUR_TASKS`) wraz z funkcjami `detectTrap`
- `docs/ARCHITEKTURA.md`: wizja i plan techniczny
- `stan_projektu.md`: ten plik
- `GEMINI.md`: zasady pracy agenta w VS Code

## Decyzje
- **Silnik SQL (PODJĘTA):** `@electric-sql/pglite` (PostgreSQL 16 w WebAssembly, ładowany z CDN jsdelivr). Usunięto sql.js (SQLite) oraz wadliwe wyrażenia regularne `validatePgStrict` i `pgToSqlite`. Zapytania wykonuje prawdziwy PostgreSQL, a numer linii błędu pochodzi z parsera (`err.position`).
- **Struktura (WDROŻONA — KROKI 1–3):** wydzielono `css/style.css`, `js/data-tasks.js` oraz `js/data-dvdrental.js`. Główna logika zostaje w `index.html` (opcjonalne wydzielenie do `js/app.js` przed lub w trakcie PWA).
- **Ergonomia edytora (PODJĘTA):** usunięto dwa przewijane paski `.quickbar` znad edytora na rzecz ujednoliconego, domyślnie zwiniętego boksu „👁 Podejrzyj i kliknij kolumny tabel w tym zadaniu”, który pokazuje wyłącznie tabele z zadania i wyróżnia klucze złączeń (`🔗 *_id`).
- **Zakres:** teraz krok 3 planu głównego (PWA: `manifest.json`, `sw.js`, praca offline na iPhonie). Chmura Supabase i ranking po dopracowaniu PWA.

## Testy (w VS Code + Live Server)
- [x] Uruchamia się w Live Server bez błędów w konsoli (F12) po podziale na `css/style.css`, `js/data-dvdrental.js` i `js/data-tasks.js`
- [x] SELECT zwraca tabelę wyników
- [x] Wynik jest porównywany z zapytaniem wzorcowym
- [x] Diagnoza z przyciskiem Pomiń (10 przekrojowych zadań) — podgląd tabel pokazuje tylko tabele z pytania i pamięta stan zwinięcia/rozwinięcia
- [x] Losowanie wariantów zadań (każde zadanie ma 5 wariantów, razem 60 wariantów w Ścieżce)
- [x] TEST 1 (przejrzystość UI): brak pasków z suwakami nad edytorem, w podglądzie tabel widoczne tylko tabele z zadania z wyróżnionymi kluczami `🔗 *_id` (klikalne nazwy wstawiające kod do edytora)
- [x] TEST 2 (detektor pułapek DataLemur): brak fałszywych alarmów w zadaniu 1 (Netflix) przy pominięciu `WHERE store_id = 1`, gdy warunek daty jest poprawnie w `ON`; zaliczenie zadania 2 (Stripe) z użyciem CTE, `FILTER (WHERE ...)` i `100.0 *`
- [x] TEST 3 (natywny PostgreSQL PGlite): w Bazie dvdrental przycisk „⚡ Wklej test składni PG” zwraca tabelę 5 wierszy
- [x] TEST 4 (tryb offline): wykonywanie zapytań po załadowaniu silnika WASM (pełny offline dopiero po kroku PWA)
- [x] TEST 5 (wieloliniowy SELECT jak w DBeaverze): aplikacja nie wymaga przecinka po SELECT i zwraca uwagę na literówkę „PG13” vs „PG-13”
- [x] TEST 6 (linia błędu z parsera PostgreSQL): brak przecinka między kolumnami (`rating` i `length`) oraz zła nazwa kolumny w `ON f.film_id = fc.fim_id` wskazują właściwą linię

## Plan
- [x] 1 Prototyp rdzenia (interfejs Lista ↔ Edytor, PGlite z bazą dvdrental, Diagnoza 10 pytań, Detektor pułapek)
- [x] 2 Pula 60–100 zadań (82 zadania: 12 lekcji × 5 wariantów, 12 zadań rekrutacyjnych DataLemur, 10 zadań Diagnozy)
- [x] 2.5 Podział monolitu `index.html` na modułowe pliki (`css/style.css`, `js/data-tasks.js`, `js/data-dvdrental.js`) i czyszczenie UI edytora
- [ ] 3 PWA (`manifest.json`, `sw.js`, cache PGlite WASM, hosting HTTPS)
- [ ] 4 Chmura i ranking (opcjonalnie, później)

## Do zrobienia teraz (po kolei)
- [x] 0 Sprawdzić ostrzeżenie „1” przy `index.html` (panel Problems: Ctrl+Shift+M)
- [x] 1 Wydzielić CSS do `css/style.css`
- [x] 2 Wydzielić dane zadań (lekcje, diagnoza, rekrutacja) do `js/data-tasks.js`
- [x] 3 Wydzielić dane dvdrental do `js/data-dvdrental.js`
- [ ] 3A Drobna poprawka `detectTrap` w zadaniach `dl_2`–`dl_12` (np. Stripe `dl_2`), aby detektor nie odpalał pułapki, gdy zapytanie odpytuje inną tabelę/kolumny niż wymagane w zadaniu
- [ ] 3B Opcjonalnie: wydzielić pozostałą logikę JS z `index.html` do `js/app.js` (aby `index.html` miał ~60 linii czystego HTML)
- [ ] 4 PWA: utworzyć `manifest.json`, ikony aplikacji oraz Service Worker `sw.js` (cache plików lokalnych + PGlite WASM z CDN)
- [ ] 5 Publikacja pod adresem HTTPS (np. GitHub Pages / Cloudflare Pages) i test na iPhonie (instalacja z ekranu głównego, tryb samolotowy)

## Ostatnia sesja (podsumowanie od Gema — 01.11.2026)
1. **Podział projektu na osobne pliki (Kroki 1–3):** wydzielono style do `css/style.css`, bazę 82 zadań do `js/data-tasks.js` oraz schemat i dane bazy `dvdrental` do `js/data-dvdrental.js` przy współpracy z agentem Antigravity w VS Code.
2. **Odchudzenie edytora SQL:** usunięto dwa przewijane paski (`.quickbar`) z operatorami i wszystkimi kolumnami znad edytora, zostawiając czysty widok w stylu DBeavera.
3. **Inteligentny podgląd tabel i kluczy złączeń (`🔗`):** ujednolicono komponent `buildTaskSchemaBox` w Ścieżce, Diagnozie i Rekrutacji — wyświetla tylko tabele z bieżącego zadania, jest domyślnie zwinięty, zapamiętuje stan rozwinięcia po kliknięciu „Uruchom” i wyróżnia kolumny kluczy `*_id` ikoną `🔗`.
4. **Uszczelnienie detektora pułapek (`detectTrap`):** w `index.html` zablokowano wywoływanie `registerGapTrap`, gdy `detectTrap(sql)` zwraca `null`; w zadaniu 1 (Netflix) wyeliminowano fałszywy alarm przy braku `WHERE store_id = 1`, gdy filtr daty jest poprawnie umieszczony w `ON`.
5. **Następny krok:** doprecyzowanie warunków wstępnych w `detectTrap` dla zadań `dl_2`–`dl_12`, wydzielenie `js/app.js` oraz wdrożenie PWA (`manifest.json`, `sw.js`) pod instalację na iPhonie.