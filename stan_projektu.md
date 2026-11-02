# Stan projektu: Centrum nauki SQL (SQL Master)

> Dołączaj ten plik na starcie każdej nowej rozmowy z Gemem 3. Czyta go też agent w VS Code. Aktualizuj go po każdej sesji. Odhaczaj `[x]` dopiero po własnym teście w przeglądarce.

**Ostatnia aktualizacja:** 02.11.2026 (Sesja 3 — pełne wdrożenie PWA, rozbudowa bazy rekrutacyjnej do 60 zadań, poprawki UX)

## Pliki
- `index.html`: czysty szkielet HTML (~60 linii) ładujący style, dane, logikę aplikacji oraz manifest PWA i Service Workera
- `css/style.css`: wszystkie style aplikacji (motyw ciemny/jasny, responsywność, wyróżnienia kluczy `🔗 .col-key-chip`, styl porównania tabel `.cmp-grid`, style specyfikacji tabel rekrutacyjnych)
- `js/data-dvdrental.js`: schemat (`SCHEMA_META`) i dane wsadowe (`DVDRENTAL_SEED_SQL`) 10 tabel bazy `dvdrental`
- `js/data-tasks.js`: lekcje Ścieżki (120 wariantów), Diagnoza (10 pytań)
- `js/data-interview.js`: baza **60 zadań rekrutacyjnych** (20 Easy, 20 Medium, 20 Hard) oparta na 6 dedykowanych tabelach biznesowych (HR, Finanse, SaaS, E-commerce) z pełną specyfikacją typów i podglądem danych
- `js/app.js`: cała logika aplikacji, silnika PGlite z parserem TIMESTAMP, stanu `localStorage`, wieloliniowego formatowania SQL i rejestracji Service Workera
- `manifest.json`, `sw.js`, `icon.svg`: konfiguracja Progressive Web App (PWA) do pracy offline na telefonie
- `docs/ARCHITEKTURA.md`: wizja i plan techniczny
- `stan_projektu.md`: ten plik
- `GEMINI.md`: zasady pracy agenta w VS Code

## Decyzje
- **Silnik SQL (PODJĘTA):** `@electric-sql/pglite` (PostgreSQL 16 w WebAssembly, ładowany z CDN jsdelivr). Zapytania wykonuje prawdziwy PostgreSQL.
- **Struktura i PWA (WDROŻONA):** pełny podział monolitu zakończony (`css/style.css`, `js/data-tasks.js`, `js/data-dvdrental.js`, `js/data-interview.js`, `js/app.js`). Dodano PWA dla wsparcia trybu offline[cite: 13].
- **Porównywanie wyników (WDROŻONA):** przy błędnym zapytaniu aplikacja wyświetla obok siebie lub pod sobą „Twój wynik” oraz „Oczekiwany wynik (Wzorzec)”. Komunikat błędu został uproszczony, gdy nie wykryto pułapki.
- **Ergonomia kodu (WDROŻONA):** przycisk „💡 Pokaż wzorcowy kod” automatycznie formatuje zapytanie wieloliniowo (w stylu DBeavera).

## Testy (w VS Code + Live Server)
- [x] Podział na pliki modułowe działa bez błędów w konsoli (F12)
- [x] PWA (`sw.js`) aktywuje się poprawnie w zakładce Application (F12)
- [x] Porównanie „Twój wynik vs Oczekiwany wynik” poprawnie prezentuje tablice różnic we wszystkich trybach
- [x] Zakładka Rekrutacja zawiera 60 zadań podzielonych na filtry Easy (20), Medium (20), Hard (20) z pełnym podglądem typów kolumn i danych tabel
- [x] Wzorcowy kod SQL wkleja się do edytora w czytelnej, wieloliniowej formie

## Plan
- [x] 1 Prototyp rdzenia i PGlite z dvdrental
- [x] 2 Pula zadań (Ścieżka 120 wariantów + Diagnoza 10 + Rekrutacja 60 zadań z tabelami biznesowymi)
- [x] 2.5 Podział kodu na moduły (`app.js`, `style.css`, pliki danych)
- [x] 3 PWA (`manifest.json`, `sw.js`, cache PGlite WASM)
- [ ] 4 Publikacja HTTPS (np. GitHub Pages / Cloudflare Pages) i ostateczny test na iPhonie

## Do zrobienia teraz (po kolei)
- [x] Wdrożyć PWA i Service Worker
- [x] Rozbudować bazę rekrutacyjną do 60 zadań (20/20/20) z dedykowanymi tabelami i typami kolumn
- [x] Wdrożyć wieloliniowy formater kodu SQL oraz czysty komunikat błędu
- [ ] Opublikować aplikację pod adresem HTTPS i wykonać test na iPhonie w trybie samolotowym

## Ostatnia sesja (podsumowanie od Gema — 02.11.2026)
1. **Rozbudowa modułu Rekrutacja:** Stworzono dedykowany plik `js/data-interview.js` z 6 tabelami biznesowymi i powiększono bazę do 60 zadań rekrutacyjnych podzielonych na poziomy Easy, Medium i Hard z pełnym podglądem typów danych i przykładowych wierszy.
2. **Wdrożenie PWA:** Dodano `manifest.json`, ikonę `icon.svg` oraz Service Worker `sw.js` obsługujący buforowanie zasobów lokalnych i biblioteki PGlite z CDN, co umożliwia pracę offline[cite: 13].
3. **Usprawnienia UX i formatowania:** Dodano automatyczne, wieloliniowe formatowanie kodu wzorcowego (`formatSqlPretty`), uproszczono komunikaty błędów oraz wdrożono uniwersalny mechanizm porównywania tabel „Twój wynik” kontra „Oczekiwany wynik (Wzorzec)”.
4. **Następny krok:** Publikacja projektu pod adresem HTTPS i test instalacji oraz działania offline na urządzeniu mobilnym (iPhone).