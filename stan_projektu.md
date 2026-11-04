# Stan projektu: Centrum nauki SQL (SQL Master)

> Dołączaj ten plik na starcie każdej nowej rozmowy z Gemem 3. Czyta go też agent w VS Code. Aktualizuj go po każdej sesji. Odhaczaj `[x]` dopiero po własnym teście w przeglądarce.

**Ostatnia aktualizacja:** 03.11.2026 (po Sesji 3)

## Pliki
- `index.html`: czysty szkielet HTML aplikacji mobilnej PWA (z kompletem meta tagów dla iOS Safari i Android Chrome)
- `css/style.css`: style aplikacji (motyw ciemny/jasny, animacje slajdów i symulatora potoku SQL, stepper zadań R1–R3 i 1–10, ściąga linia po linii, responsywność `100dvh`)
- `js/app.js`: główna logika aplikacji, silnik PGlite (z blokadą Singleton `dbInitPromise`), slajdy SoloLearn z symulatorem, sekwencyjne blokady każdego zadania (`R1 → R2 → R3 → 1 → ... → 10`), logowanie `Nick + PIN` i synchronizacja z chmurą Supabase REST API
- `js/data-dvdrental.js`: schemat (`SCHEMA_META`) i dane wsadowe (`DVDRENTAL_SEED_SQL`) 10 tabel bazy `dvdrental`
- `js/data-tasks.js`: baza zadań Ścieżki — **156 zadań** (12 lekcji × [4 slajdy teorii + 3 zadania rozgrzewkowe `R1–R3` + 5 zadań podstawowych `1–5` + 5 zadań zaawansowanych `6–10` łączących poprzednie działy]) oraz Diagnozy (10 zadań)
- `js/data-interview.js`: pula 60 zadań rekrutacyjnych w stylu DataLemur
- `manifest.json`: konfiguracja instalacji PWA na ekranie głównym (iOS / Android) ze ścieżkami względnymi (`./`)
- `sw.js`: Service Worker (`sql-master-v7`) obsługujący tryb offline dla plików statycznych i silnika WASM oraz strategię Network-Only dla `supabase.co`
- `docs/ARCHITEKTURA.md`: wizja i plan techniczny
- `stan_projektu.md`: ten plik
- `GEMINI.md`: zasady pracy agenta w VS Code

## Decyzje
- **Silnik SQL (WDROŻONY):** `@electric-sql/pglite` (PostgreSQL 16 w WebAssembly) zabezpieczony wzorcem Singleton Promise Guard (`dbInitPromise`) przed podwójną inicjalizacją i wyciekiem pamięci.
- **Sprawdzanie zadań (WDROŻONE):** twarde porównywanie tabeli wynikowej z zapytaniem wzorcowym w widoku obok siebie (`❌ Twój wynik` vs `✅ Oczekiwany wynik — Wzorzec`) oraz przycisk na żądanie `🛡️ Jaka tu jest pułapka?`.
- **Onboarding i Progresja SoloLearn (WDROŻONA):**
  - Przed każdą z 12 lekcji 4 interaktywne slajdy teorii z animowanym symulatorem potoku wykonawczego PostgreSQL (`FROM` → `WHERE` → `GROUP BY` → `SELECT` → `ORDER BY`) i mini-quizem (+15 XP).
  - W każdym z 12 działów dodano **3 zadania rozgrzewkowe (`R1–R3`)** wprowadzające od zera przed dotychczasową pulą zadań **1–5 (Podstawowe)** oraz **6–10 (Zaawansowane — miks z poprzednimi działami)** (łącznie 156 zadań w Ścieżce, po 13 na dział).
  - Ściśle sekwencyjne odblokowywanie każdego zadania po kolei (`R1 → R2 → R3 → 1 → 2 → ... → 10`) z przyciskiem `🚀 Następne zadanie →` po zaliczeniu oraz przełącznikiem `🔓 Tryb testerski` w zakładce `Konto & AI`.
  - Nad każdym zadaniem boks `💼 Po ludzku (Prośba od szefa)`, a nad edytorem przejrzysta ściąga składni SQL rozpisana linia po linii prostym językiem.
- **Konta użytkowników i Chmura Supabase (WDROŻONE):** bezhasłowe logowanie testerów przez `Nick + 4-cyfrowy PIN`, utworzona tabela `public.sql_profiles` w projekcie Supabase (`SQLRanking`: `https://hpfrcykbzuzucglorpkr.supabase.co`) i żywa tablica wyników (`🏆 Ranking Testerów`).

## Testy (w VS Code + Live Server)
- [x] Uruchamia się w Live Server bez błędów i bez ostrzeżeń w konsoli (F12 → Console czysta)
- [x] Silnik PGlite inicjalizuje się raz (`dbInitPromise`) i wykonuje zapytania PostgreSQL 16
- [x] Widok porównania tabel obok siebie (`Twój wynik` vs `Wzorzec`) i przycisk `🛡️ Jaka tu jest pułapka?` działają poprawnie
- [x] Service Worker (`sw.js`, `#94 activated`) aktywuje się poprawnie i cachuje zasoby lokalne
- [x] Tabela `sql_profiles` utworzona w Supabase (`SQLRanking`) z kompletem kolumn i polityką dostępu
- [x] Slajdy teorii SoloLearn (1–4) otwierają się przed każdą lekcją wraz z symulatorem potoku wykonania zapytania SQL
- [x] Każda z 12 lekcji ma 3 zadania rozgrzewkowe (`R1–R3`) przed zadaniami `1–10` (łącznie 156 zadań w Ścieżce), a zadania `6–10` zachowują wyższy poziom trudności łączący poprzednie działy
- [x] Nad każdym zadaniem wyświetla się ludzkie zdanie biznesowe (`💼 Po ludzku`), a ściąga składni nad edytorem prezentuje każdą klauzulę (`SELECT`, `FROM`, `WHERE`...) w osobnej linii
- [x] Po wyłączeniu „Trybu testerskiego” zadania w lekcji odblokowują się pojedynczo po kolei (`R1 → R2 → R3 → 1 → 2...`), a po zaliczeniu pojawia się przycisk `🚀 Następne zadanie →`
- [ ] Pełne testy przekrojowe wszystkich działów i synchronizacji chmury Supabase Live na kilku profilach użytkowników (jutro)
- [ ] Publikacja na GitHub Pages (HTTPS) i test instalacji PWA na iPhonie oraz Androidzie

## Plan
- [x] 1 Prototyp rdzenia (interfejs Lista ↔ Edytor, PGlite z bazą dvdrental, Diagnoza 10 pytań)
- [x] 2 Rozbudowa puli zadań i podział monolitu na moduły (`style.css`, `app.js`, `data-*.js`)
- [x] 3 Lokalny PWA (`manifest.json`, `sw.js`), slajdy teorii SoloLearn z symulatorem, rozgrzewki `R1–R3` + progresja `1–10` w każdym dziale (156 zadań) oraz podpięcie chmury Supabase (`SQLRanking`)
- [ ] 4 Dalsze testy, włączenie GitHub Pages (`Settings → Pages → Branch: main`) i udostępnienie publicznego linku HTTPS znajomym do testów na iOS i Androidzie

## Ostatnia sesja (podsumowanie od Gema — 03.11.2026)
1. **Zabezpieczenie silnika PGlite i czysta konsola:** wdrożono blokadę Singleton (`dbInitPromise`) w `initDatabase()` zgodnie z sugestią audytu Copilota oraz wyeliminowano ostrzeżenie o meta tagu PWA w konsoli DevTools.
2. **Moduł teorii SoloLearn z symulatorem potoku SQL:** dodano 4-ekranowe wprowadzenia przed każdą z 12 lekcji z interaktywną animacją pokazującą różnicę między kolejnością pisania a kolejnością wykonywania klauzul przez silnik PostgreSQL.
3. **Rozgrzewki R1–R3 w każdym dziale i blokada krok po kroku (156 zadań):** rozbudowano każdą z 12 lekcji o 3 proste zadania rozgrzewkowe (`R1–R3`) przed zadaniami podstawowymi (`1–5`) i zaawansowanymi (`6–10`, łączącymi poprzednie tematy) — odblokowywane pojedynczo (`R1 → R2 → R3 → 1 → ... → 10`) z przyciskiem „🚀 Następne zadanie →”.
4. **Kontekst biznesowy i przejrzysta ściąga:** dodano boks „💼 Po ludzku (Prośba od szefa)” nad każdym zadaniem oraz ściągę składni SQL prezentującą każdą klauzulę w osobnej linii dla osób początkujących.
5. **System kont testerów i chmura Supabase (`SQLRanking`) + co dalej:** utworzono projekt i tabelę `sql_profiles` w Supabase, wdrożono logowanie `Nick + 4-cyfrowy PIN` i podpięto klucze API; następny krok to jutrzejsze testy przekrojowe oraz publikacja linku HTTPS przez GitHub Pages dla znajomych.