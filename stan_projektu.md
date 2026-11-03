# Stan projektu: Centrum nauki SQL (SQL Master)

> Dołączaj ten plik na starcie każdej nowej rozmowy z Gemem 3. Czyta go też agent w VS Code. Aktualizuj go po każdej sesji. Odhaczaj `[x]` dopiero po własnym teście w przeglądarce.

**Ostatnia aktualizacja:** 03.11.2026 (Sesja 4 — zabezpieczenie cyklu życia PGlite, eliminacja ostrzeżeń PWA w konsoli, przygotowanie do publikacji HTTPS i chmury Supabase)

## Pliki
- `index.html`: czysty szkielet HTML ładujący style, zbiory danych, aplikację, manifest PWA oraz rejestrację Service Workera
- `css/style.css`: arkusz stylów aplikacji (motywy ciemny/jasny, mobile-first, siatki porównawcze wyników `.cmp-grid`, specyfikacja tabel rekrutacyjnych, chipy relacji)
- `js/data-dvdrental.js`: schemat (`SCHEMA_META`) i dane początkowe (`DVDRENTAL_SEED_SQL`) dla 10 tabel bazy `dvdrental`
- `js/data-tasks.js`: pula zadań edukacyjnych: Ścieżka (120 wariantów) oraz Diagnoza (10 pytań sprawdzających)
- `js/data-interview.js`: baza 60 zadań rekrutacyjnych (20 Easy, 20 Medium, 20 Hard) oparta na 6 dedykowanych schematach biznesowych (HR, Finanse, SaaS, E-commerce) z pełną specyfikacją typów i próbek danych
- `js/app.js`: rdzeń aplikacji: zarządzanie instancją PGlite WASM (ze strażnikiem cyklu życia `dbInitPromise`), parser zapytań, synchronizacja `localStorage`, nawigacja i porównywarka wyników
- `manifest.json`: manifest PWA definiujący nazwę, kolory motywu i ikony aplikacji
- `sw.js`: Service Worker obsługujący pamięć podręczną (Cache API) dla plików lokalnych oraz zasobów PGlite z CDN
- `icon.svg`: wektorowa ikona aplikacji dla urządzeń stacjonarnych i mobilnych
- `docs/ARCHITEKTURA.md`: dokumentacja założeń architektonicznych i technicznych
- `stan_projektu.md`: ten plik (rejestr stanu prac i decyzji)
- `GEMINI.md`: wytyczne i kontekst dla asystenta AI

## Decyzje
- **Silnik SQL (PODJĘTA):** `@electric-sql/pglite` (PostgreSQL 16 w WebAssembly, ładowany z CDN jsdelivr). Zapytania wykonuje prawdziwy PostgreSQL.
- **Cykl życia PGlite (WDROŻONA):** Inicjalizacja zabezpieczona strażnikiem `dbInitPromise`. Zapobiega to wielokrotnym instancjom oraz wyciekom pamięci dzięki bezpiecznemu zamykaniu `instance.close()` w bloku błędu.
- **Struktura modułowa i PWA (WDROŻONA):** Pełny podział monolitu zakończony sukcesem (`css/style.css`, `js/data-tasks.js`, `js/data-dvdrental.js`, `js/data-interview.js`, `js/app.js`, `manifest.json`, `sw.js`).
- **Pula zadań (WDROŻONA):** Łącznie 190 zadań: Ścieżka (120 wariantów), Diagnoza (10 zadań), Rekrutacja (60 zadań: 20 Easy, 20 Medium, 20 Hard).
- **Porównywanie wyników (WDROŻONA):** Mechanizm wizualnego zestawiania „Twój wynik” vs „Oczekiwany wynik — Wzorzec” wraz z dynamiczną analizą różnic i podpowiedziami pułapek SQL.

## Testy (w VS Code + Live Server)
- [x] Podział na pliki modułowe działa bez błędów w konsoli DevTools (F12)
- [x] Brak ostrzeżeń w konsoli o przestarzałych meta tagach (`mobile-web-app-capable`)
- [x] PWA (`sw.js` + `manifest.json`) aktywuje się poprawnie w zakładce Application (F12)
- [x] Inicjalizacja PGlite jest odporna na współbieżne wywołania (`dbInitPromise`)
- [x] Porównanie „Twój wynik vs Oczekiwany wynik” poprawnie prezentuje tabele różnic
- [x] Baza rekrutacyjna (60 zadań) oraz ścieżka główna (120) działają płynnie

## Plan
- [x] 1 Prototyp rdzenia i PGlite z dvdrental
- [x] 2 Pula zadań (Ścieżka 120 wariantów, Diagnoza 10, Rekrutacja 60)
- [x] 2.5 Podział kodu na moduły (`js/app.js`, `css/style.css`, pliki danych)
- [x] 3 Lokalne PWA (`manifest.json`, `sw.js`, obsługa offline)
- [ ] 4 Publikacja HTTPS (GitHub Pages) i weryfikacja instalacji PWA na urządzeniach mobilnych
- [ ] 5 Integracja z chmurą Supabase (autoryzacja użytkowników, chmurowy zapis postępu, globalny ranking w stylu SoloLearn)

## Do zrobienia teraz (po kolei)
- [x] Zabezpieczyć cykl życia PGlite przed wyciekami i wielokrotną inicjalizacją
- [x] Dodać standardowy tag `<meta name="mobile-web-app-capable" content="yes">` w `index.html`
- [ ] Opublikować aplikację w domenie HTTPS (GitHub Pages) i zweryfikować działanie offline na smartfonie
- [ ] Skonfigurować projekt Supabase pod kątem profili użytkowników, tabeli postępów i tabeli liderów (ranking)

## Ostatnia sesja (podsumowanie — 03.11.2026)
1. **Zabezpieczenie silnika PGlite:** Wdrożono zmienną strażniczą `dbInitPromise` w `js/app.js`. Zabezpieczono proces przed równoległym powstawaniem wielu instancji oraz dodano bezpieczne sprzątanie instancji (`await instance.close()`) w bloku `catch`.
2. **Korekta PWA w `index.html`:** Dodano zalecany tag `<meta name="mobile-web-app-capable" content="yes">`, eliminując żółte ostrzeżenie w konsoli Chrome.
3. **Aktualizacja statusu projektu:** Zaktualizowano `stan_projektu.md` – potwierdzono kompletność bazy zadań (120 Ścieżka, 10 Diagnoza, 60 Rekrutacja) i przygotowano plan na publikację HTTPS (GitHub Pages) oraz integrację chmury Supabase.
