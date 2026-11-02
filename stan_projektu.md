# Stan projektu: Centrum nauki SQL (SQL Master)

> Dołączaj ten plik na starcie każdej nowej rozmowy z Gemem 3. Czyta go też agent w VS Code. Aktualizuj go po każdej sesji. Odhaczaj `[x]` dopiero po własnym teście w przeglądarce.

**Ostatnia aktualizacja:** 01.11.2026 (Sesja 2 — pełna modularyzacja i rozbudowa bazy do 142 zadań)

## Pliki
- `index.html`: czysty szkielet HTML (~60 linii) ładujący style, dane i logikę aplikacji
- `css/style.css`: wszystkie style aplikacji (motyw ciemny/jasny, responsywność, wyróżnienia kluczy `🔗 .col-key-chip`, style boksu teorii oraz przełącznika 10 wariantów)
- `js/data-dvdrental.js`: schemat (`SCHEMA_META`) i dane wsadowe (`DVDRENTAL_SEED_SQL`) 10 tabel bazy `dvdrental`
- `js/data-tasks.js`: rozbudowana baza **142 zadań** (`STAGES`, `PATH_TASKS` z teorią i 120 wariantami, `DIAG_QUESTIONS` — 10 zadań, `LEMUR_TASKS` — 12 zadań wraz z uszczelnionymi funkcjami `detectTrap`)
- `js/app.js`: cała logika aplikacji, silnika PGlite, stanu `localStorage`, widoków i edytora wydzielona z `index.html`
- `docs/ARCHITEKTURA.md`: wizja i plan techniczny
- `stan_projektu.md`: ten plik
- `GEMINI.md`: zasady pracy agenta w VS Code

## Decyzje
- **Silnik SQL (PODJĘTA):** `@electric-sql/pglite` (PostgreSQL 16 w WebAssembly, ładowany z CDN jsdelivr). Zapytania wykonuje prawdziwy PostgreSQL, a numer linii błędu pochodzi z parsera (`err.position`).
- **Struktura (WDROŻONA — KROKI 1–4):** pełny podział monolitu zakończony. Wydzielono `css/style.css`, `js/data-tasks.js`, `js/data-dvdrental.js` oraz `js/app.js`. W `index.html` został wyłącznie szkielet HTML.
- **Dydaktyka i baza zadań (WDROŻONA):**
  - Każda z 12 lekcji w Ścieżce posiada boks teorii („Ludzkim językiem — co robi klauzula i kiedy się jej używa”) zgodny z zasadą *teach-first*.
  - Każda lekcja ma **10 wariantów** (łącznie 120 zadań w Ścieżce): warianty 1–5 to poziom *Basic* (pojedyncze zagadnienie), a warianty 6–10 to poziom *Progresywny / Mix* (narastająca trudność łącząca bieżący temat z wcześniejszymi sekcjami, np. `JOIN` + `WHERE` + `GROUP BY` + `HAVING`).
- **Ergonomia edytora (PODJĘTA):** ujednolicony, domyślnie zwinięty boks „👁 Podejrzyj i kliknij kolumny tabel w tym zadaniu”, który pokazuje wyłącznie tabele z bieżącego wariantu i wyróżnia klucze złączeń (`🔗 *_id`).
- **Zakres:** następny krok to Krok 4 planu głównego — PWA (`manifest.json`, `sw.js`, praca offline na iPhonie) oraz publikacja pod adresem HTTPS.

## Testy (do odhaczenia przez Wojtka w VS Code + Live Server)
- [x] Podział na `css/style.css`, `js/data-dvdrental.js` i `js/data-tasks.js` działa bez błędów
- [x] SELECT zwraca tabelę wyników i porównuje ją z zapytaniem wzorcowym
- [x] Diagnoza z przyciskiem Pomiń (10 przekrojowych zadań) pamięta stan zwinięcia podglądu tabel
- [x] TEST 1–6 z poprzedniej sesji (przejrzystość UI, pułapka Netflix `dl_1`, składnia PG, wieloliniowy SELECT, linia błędu parsera PG)
- [x] **NOWY TEST 7 (wydzielenie `js/app.js`):** aplikacja uruchamia się w Live Server bez błędów w konsoli (F12), `index.html` ma ok. 60 linii, a wszystkie zakładki (Ścieżka, Diagnoza, Rekrutacja, Baza dvdrental, Konto & AI) reagują prawidłowo
- [x] **NOWY TEST 8 (uszczelnienie `detectTrap` w `dl_2`–`dl_12`):** w zadaniu Stripe (`dl_2`) i Amazon (`dl_3`) wpisanie `SELECT * FROM actor;` zwraca zwykły błąd wyniku i NIE uruchamia fałszywego alarmu detektora pułapek
- [x]**NOWY TEST 9 (Teoria „Ludzkim językiem”):** w zadaniach Ścieżki (np. 1.1, 2.1, 3.1) widoczny jest przystępny opis działania klauzul SQL dla początkujących (można go zwinąć/rozwinąć)
- [x] **NOWY TEST 10 (10 wariantów na lekcję — Basic 1–5 + Mix 6–10):**
  - Dolny pasek pokazuje `Ścieżka (120)`, a wewnątrz lekcji widoczne są warianty `1`–`10`
  - Warianty 6–10 w Etapie 2 (Agregacje) i Etapie 3 (JOIN) łączą zagadnienia z poprzednich lekcji (np. `JOIN` + `WHERE` + `GROUP BY` + `ORDER BY`)
  - Podgląd kolumn `👁` w wariantach 6–10 poprawnie wyświetla wszystkie tabele biorące udział w trudniejszym zadaniu
  - Kliknięcie „💡 Pokaż wzorcowy kod” i „▶ Uruchom i sprawdź wynik” w wybranych wariantach 6–10 zalicza zadanie bez błędów SQL

## Plan
- [x] 1 Prototyp rdzenia (interfejs Lista ↔ Edytor, PGlite z bazą dvdrental, Diagnoza 10 pytań, Detektor pułapek)
- [x] 2 Pula zadań (rozbudowana do **142 zadań**: 12 lekcji × 10 wariantów = 120 w Ścieżce, 12 zadań DataLemur, 10 zadań Diagnozy + teoria *Teach-First*)
- [x] 2.5 Pełny podział monolitu `index.html` na modułowe pliki (`css/style.css`, `js/data-tasks.js`, `js/data-dvdrental.js`, `js/app.js`) i uszczelnienie `detectTrap`
- [ ] 3 PWA (`manifest.json`, `sw.js`, cache PGlite WASM, hosting HTTPS)
- [ ] 4 Chmura i ranking (opcjonalnie, później)

## Do zrobienia teraz (po kolei)
- [x] 1 Wydzielić CSS do `css/style.css`
- [x] 2 Wydzielić dane zadań do `js/data-tasks.js`
- [x] 3 Wydzielić dane dvdrental do `js/data-dvdrental.js`
- [x] 3A Poprawka `detectTrap` w zadaniach `dl_2`–`dl_12` (guard clauses na wymagane tabele)
- [x] 3B Wydzielenie logiki JS z `index.html` do `js/app.js` (~60 linii HTML)
- [x] 3C Dodanie teorii „Ludzkim językiem” do lekcji oraz rozbudowa Ścieżki z 5 do 10 wariantów na lekcję (5 Basic + 5 Progresywnych/Kumulatywnych = 120 zadań w Ścieżce)
- [ ] 4 PWA: utworzyć `manifest.json`, ikony aplikacji oraz Service Worker `sw.js` (cache plików lokalnych + PGlite WASM z CDN)
- [ ] 5 Publikacja pod adresem HTTPS (np. GitHub Pages / Cloudflare Pages) i test na iPhonie (instalacja z ekranu głównego, tryb samolotowy)

## Ostatnia sesja (podsumowanie od Gema — 01.11.2026, cz. 2)
1. **Pełna modularyzacja kodu (Krok 3B):** przeniesiono całą logikę aplikacji z `index.html` do `js/app.js`, zostawiając w `index.html` czysty szkielet dokumentu.
2. **Uszczelnienie detektora pułapek (Krok 3A):** dodano warunki wstępne (*guard clauses*) w `detectTrap` dla zadań `dl_2`–`dl_12`, eliminując fałszywe alarmy przy odpytywaniu tabel niezwiązanych z zadaniem.
3. **Wdrożenie teorii *Teach-First* (Krok 3C):** każda z 12 lekcji w Ścieżce otrzymała przystępne wytłumaczenie klauzul SQL „ludzkim językiem” (co robi dana instrukcja i kiedy się jej używa).
4. **Rozbudowa bazy zadań z 82 do 142 (120 wariantów w Ścieżce):** do każdej lekcji dopisano warianty 6–10 o narastającym poziomie trudności, które kumulatywnie łączą bieżący temat z wiedzą z wcześniejszych sekcji (np. `JOIN` + `WHERE` + `GROUP BY` + `HAVING` + `ORDER BY`).
5. **Następny krok:** po odhaczeniu testów 7–10 w przeglądarce i commicie w GitHub Desktop — wdrożenie PWA (`manifest.json`, `sw.js`) i publikacja na HTTPS pod iPhone'a.