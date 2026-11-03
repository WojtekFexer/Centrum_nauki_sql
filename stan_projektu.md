# Stan projektu: Centrum nauki SQL (SQL Master)

> Dołączaj ten plik na starcie każdej nowej rozmowy z Gemem 3. Czyta go też agent w VS Code. Aktualizuj go po każdej sesji. Odhaczaj `[x]` dopiero po własnym teście w przeglądarce.

**Ostatnia aktualizacja:** 03.11.2026 (Sesja 5 — wdrożenie 4-slajdowych tutoriali SoloLearn przed każdą lekcją, progresji blokad wariantów 6–10 oraz działów, logowania testerów Nick + PIN z chmurą Supabase REST API + Rankingiem oraz pełnej kompatybilności PWA Android/iOS pod GitHub Pages)

## Pliki
- `index.html`: czysty szkielet HTML ze ścieżkami względnymi (`./...`) pod GitHub Pages, meta tagami PWA (`mobile-web-app-capable` i `apple-mobile-web-app-capable`), ładujący style, dane i aplikację
- `css/style.css`: arkusz stylów aplikacji (motywy ciemny/jasny, `100dvh` i `env(safe-area-inset-bottom)` dla klawiatur Android Chrome / iOS Safari, wizualizacja potoku wykonywania SQL, slajdy teorii SoloLearn, blokady progresji, modal logowania i tabela Rankingu)
- `js/data-dvdrental.js`: schemat (`SCHEMA_META`) i dane początkowe (`DVDRENTAL_SEED_SQL`) dla 10 tabel bazy `dvdrental`
- `js/data-tasks.js`: pula zadań edukacyjnych: Ścieżka (12 lekcji × 10 wariantów = 120 zadań), Diagnoza (10 pytań) oraz `LESSON_TUTORIALS` (48 interaktywnych kart teorii SoloLearn: 4 okna na każdą z 12 lekcji)
- `js/data-interview.js`: baza 60 zadań rekrutacyjnych (20 Easy, 20 Medium, 20 Hard) oparta na 6 dedykowanych schematach biznesowych (HR, Finanse, SaaS, E-commerce)
- `js/app.js`: rdzeń aplikacji: cykl życia PGlite WASM (`dbInitPromise`), odtwarzacz 4-slajdowych tutoriali SoloLearn z quizem (+15 XP), system blokad wariantów 6–10 i kolejnych lekcji, logowanie testerów (Nick + 4-cyfrowy PIN), synchronizacja z chmurą Supabase REST API (`fetch`), Ranking Testerów i przełącznik Trybu Testerskiego
- `manifest.json`: manifest PWA ze ścieżkami względnymi (`./index.html`, `./icon.svg`) gotowy pod publikację w podkatalogu GitHub Pages
- `sw.js`: Service Worker (`CACHE_NAME = 'sql-master-v4'`) ze strategią Network-Only dla zapytań do `supabase.co` oraz Cache-First/Stale-While-Revalidate dla zasobów aplikacji i PGlite WASM
- `icon.svg`: wektorowa ikona aplikacji dla urządzeń stacjonarnych i mobilnych
- `docs/ARCHITEKTURA.md`: dokumentacja założeń architektonicznych i technicznych
- `stan_projektu.md`: ten plik (rejestr stanu prac i decyzji)
- `GEMINI.md`: wytyczne i kontekst dla asystenta AI

## Decyzje
- **Silnik SQL (PODJĘTA):** `@electric-sql/pglite` (PostgreSQL 16 w WebAssembly, ładowany z CDN jsdelivr) z zabezpieczonym cyklem życia (`dbInitPromise` + bezpieczne `instance.close()` przy błędzie).
- **Tutoriale SoloLearn (WDROŻONA):** Przed każdą z 12 lekcji użytkownik przechodzi 4 interaktywne karty: (1) Jak zbudować zapytanie, (2) Kolejność pisania vs Kolejność wykonywania przez PostgreSQL (`1. FROM/JOIN` → `2. WHERE` → `3. GROUP BY` → `4. HAVING` → `5. SELECT` → `6. DISTINCT` → `7. ORDER BY` → `8. LIMIT`), (3) Przykład na żywo z `dvdrental`, (4) Quiz sprawdzający (+15 XP). Доступny też przycisk „📖 Teoria (Slajdy 1–4)” w widoku edytora.
- **Progresja i blokady SoloLearn (WDROŻONA):** Warianty w każdej lekcji podzielono na Poziom Podstawowy (1–5) i Poziom Zaawansowany (6–10, odblokowywany po rozwiązaniu 5/5 zadań podstawowych). Kolejne lekcje i etapy na Mapie Ścieżki odblokowują się po zaliczeniu min. 5 podstawowych wariantów w poprzedniej lekcji lub przez Diagnozę. Właściciel projektu ma w `Konto & AI` przełącznik „🔓 Tryb testerski (odblokuj wszystkie działy)”.
- **Konta Testerów i Chmura Supabase (WDROŻONA):** Lekkie logowanie `Nick + 4-cyfrowy PIN` (z deterministycznym hashem `pinHash` do odzyskiwania konta na innym telefonie) oraz synchronizacja przez natywne `fetch` do Supabase REST API (`/rest/v1/sql_profiles`) z automatycznym fallbackiem lokalnym/demo i gotowym skryptem SQL `CREATE TABLE` w zakładce `Konto & AI`.

## Testy (w VS Code + Live Server + weryfikacja V8)
- [x] Wszystkie 5 plików JS (`data-dvdrental.js`, `data-tasks.js`, `data-interview.js`, `app.js`, `sw.js`) przechodzi weryfikację składni bez błędów
- [x] Wszystkie 12 lekcji w `PATH_TASKS` posiada 4 slajdy teorii wraz z quizem jednokrotnego wyboru
- [x] Logika blokad wariantów 6–10 oraz kolejnych lekcji/etapów działa poprawnie dla pustego, częściowego i pełnego `state` oraz z przełącznikiem Trybu Testerskiego
- [x] Porównanie „Twój wynik vs Oczekiwany wynik — Wzorzec” oraz „Jaka tu jest pułapka?” działają bez zmian
- [x] Ścieżki w `index.html`, `manifest.json` i `sw.js` (`sql-master-v4`) są w pełni względne (`./...`), a zapytania do `supabase.co` działają w trybie Network-Only

## Plan
- [x] 1 Prototyp rdzenia i PGlite z dvdrental + zabezpieczenie cyklu życia `dbInitPromise`
- [x] 2 Pula zadań (Ścieżka 120 wariantów, Diagnoza 10, Rekrutacja 60)
- [x] 2.5 Podział kodu na moduły (`js/app.js`, `css/style.css`, pliki danych)
- [x] 3 Slajdy teorii SoloLearn (12 × 4 karty z kolejnością wykonywania SQL) + system blokad progresji (1–5 → 6–10)
- [x] 4 Logowanie testerów (Nick + PIN), integracja Supabase REST API i Ranking Testerów (Leaderboard)
- [x] 5 Kompatybilność PWA Android/iOS (`sql-master-v4`, względne ścieżki `./`, `100dvh`)
- [ ] 6 Publikacja na GitHub Pages (`git push`) i testy terenowe ze znajomymi na Androidzie oraz iOS

## Do zrobienia teraz (po kolei)
- [x] Wdrożyć 4-slajdowe tutoriale SoloLearn z wizualizacją kolejności wykonywania SQL
- [x] Wdrożyć blokady wariantów 6–10 oraz kolejnych działów + przełącznik Trybu Testerskiego
- [x] Wdrożyć logowanie Nick + PIN, synchronizację Supabase REST API oraz Ranking Testerów
- [x] Przygotować `manifest.json`, `sw.js` (`sql-master-v4`) i `css/style.css` pod publikację na GitHub Pages
- [ ] Wypchnąć zmiany na GitHub Pages, wkleić klucze darmowego projektu Supabase i wysłać link zaproszenia znajomym
