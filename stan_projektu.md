# Stan projektu: Centrum nauki SQL (SQL Master)

> Dołączaj ten plik na starcie każdej nowej rozmowy z Gemem 3. Czyta go też agent w VS Code. Aktualizuj go po każdej sesji. Odhaczaj `[x]` dopiero po własnym teście w przeglądarce.

**Ostatnia aktualizacja:** 11.11.2026 (Wersja `v15.1` — po wdrożeniu 4-warstwowej telemetrii w Supabase z kluczami `User100+`, Rejestru Luk `g1–g13`, Quizów Działowych 1–8 z fanfarami, odwróconego Onboardingu 0 XP, Ramek Rang 1–8 oraz usunięciu spojlerów `AS` i błędów HTTP 400)

## Pliki
- `index.html`: szkielet HTML aplikacji mobilnej PWA z wersjonowaniem lokalnych zasobów (`?v=15.1`), dolną zakładką `🎯 Rejestr Luk` i meta tagami dla iOS Safari / Android Chrome
- `css/style.css`: style aplikacji w standardzie *Zero-Scroll Split UI* (1-liniowy pasek górny `sticky`, ramki rang `.rank-frame-1`..`.rank-frame-8`, pigułki kodu `.alias-code-pill` w okienkach wskazówek `AS`, animacje fanfar/konfetti dla Quizów Działowych, karty Rejestru Luk `g1–g13`, przewijany ranking do 50 graczy oraz modal Bottom Sheet `#taskSheetRoot` z `z-index: 9999`)
- `js/app.js`: główna logika aplikacji (`APP_VERSION = 'v15.1'`), silnik PGlite (`dbInitPromise` z Self-Healing Cache), deterministyczny przelicznik `recalculateRealXP(state)` i serii dni (`lastStreakDate`), moduł `SQLTelemetry` wysyłający sesje i próby zadań do Supabase (`sql_profiles`, `app_sessions`, `task_attempts` z odpornością na błędy 400/409 i pamięcią sesji w `sessionStorage`), kanoniczny walidator wierszy bez `ORDER BY` i kolejności kolumn w `SELECT`, odwrócony onboarding (Najpierw Nick z zapisem `0 XP` -> potem 4-kartowy Samouczek), obsługa Quizów Działów (`STAGE_QUIZZES`) oraz zakładki `🎯 Rejestr Luk` (`GAP_CATALOG` startujący od `0/4` i `Wpadki: 0`)
- `js/data-dvdrental.js`: schemat (`SCHEMA_META`) i dane wsadowe (`DVDRENTAL_SEED_SQL`) bazy `dvdrental`
- `js/data-tasks.js`: baza zadań Ścieżki — **8 Działów (`STAGES` 1..8), 27 pod-lekcji i 141 zadań**, komplet 40 pytań w `STAGE_QUIZZES` (po 5 pytań na każdy z 8 działów napisanych przystępnym językiem, +50 XP za zdanie `>= 4/5`), `LESSON_TUTORIALS` oraz Diagnoza (10 zadań)
- `js/data-interview.js`: pula 60 zadań rekrutacyjnych w stylu DataLemur po korekcie polszczyzny biznesowej (łącznie w aplikacji: **211 zadań SQL + 40 pytań quizowych**)
- `manifest.json`: konfiguracja instalacji pełnoekranowej PWA (`display: standalone`) ze ścieżkami względnymi (`./`)
- `sw.js`: Service Worker (`sql-master-v15.1`) ze strategią Network-First (`cache: 'no-store'`) dla plików lokalnych, walidacją rozmiaru paczki `.data` (>5 MB) dla silnika WASM PGlite i Network-Only dla `supabase.co`
- `docs/ARCHITEKTURA.md`: wizja i plan techniczny (v3.0 — horyzont 10 tygodni do wersji komercyjnej)
- `stan_projektu.md`: ten plik
- `GEMINI.md`: zasady pracy agenta w VS Code

## Decyzje
- **Silnik SQL i odporność Cache WASM (WDROŻONE):** `@electric-sql/pglite` (PostgreSQL 16 w WebAssembly) zabezpieczony Singletonem (`dbInitPromise`) oraz mechanizmem Self-Healing Cache w `sw.js`.
- **4-Warstwowa Architektura Analityczna w Supabase (WDROŻONE w v14.8–v15.1):**
  1. `public.sql_profiles` (Tabela Użytkowników): sekwencyjny klucz `user_id` (`User100`, `User101`...), `nick`, realne `xp`, automatycznie wyliczana `rank_name` (Rangi 1–8), `streak`, `country` (`PL`), `email`, `pin_hash`, `gaps` (JSONB) i `solved_count`.
  2. `public.app_sessions` (Tabela Sesji): `user_id`, `user_nick`, `session_date`, polskie godziny `login_time_pl` i `logout_time_pl`, `duration_min`, `duration_sec`, `device_os`, `screen_width`, `is_standalone` (PWA), `app_version`. Sesja trzymana w `sessionStorage` karty (brak duplikatów przy odświeżaniu F5 i brak pustych sesji `'anon'`).
  3. `public.task_attempts` (Tabela Prób Zadań): `user_id`, `user_nick`, `attempt_date`, `attempt_time_pl`, `module_type` (`path`/`interview`/`diag`/`quiz`/`gap_ai`), `lesson_id`, `task_id`, czytelna nazwa `task_name`, `is_passed`, `attempt_number`, `time_spent_sec`, `error_category`, wyniki checklisty 3/3, `hints_used`, `used_quickbar_cnt`, `submitted_sql`.
  4. Widoki Analityczne (`SECURITY INVOKER`): `public.v_daily_user_analytics` (agregacja dzienna 1 wiersz = 1 gracz na dany dzień kalendarzowy w osobnych CTE, eliminująca mnożenie wierszy *Chasm Trap*) oraz `public.v_task_funnel` (lejek zdawalności i najczęstszych błędów).
- **Walidator SQL, Anty-Spojler `AS` i Onboarding 0 XP (WDROŻONE w v14.5–v15.1):**
  - Gdy zapytanie wzorcowe nie ma `ORDER BY`, walidator sortuje wiersze kanonicznie w JS (dowolna kolejność wierszy jest zaliczana), a przy przestawionej kolejności kolumn w `SELECT` wyświetla precyzyjną wskazówkę w 1. punkcie checklisty.
  - Usunięto spojlery wstawiające gotowe wyrażenie `amount * 4 AS amount_pln` jednym kliknięciem — w `SQL Quick-Bar` wyrażenia są rozbite na pojedyncze klocki, a w okienku pomocy `AS` wyświetla się polskie wyjaśnienie („Pomnóż kolumnę `amount` razy `4`...”) z pigułkami `.alias-code-pill` i przyciskiem wstawiającym wyłącznie `AS nazwa_aliasu`.
  - Nowy użytkownik najpierw wybiera nick (z natychmiastowym zapisem `0 XP` w rankingu), a dopiero potem przechodzi 4-kartowy samouczek. Usunięto sztuczną bazę `1202 XP`, `streak: 4` oraz profile-wydmuszki (`Ania_Data` itp.).
- **Quizy Działów (1–8) i Zakładka `🎯 Rejestr Luk (g1–g13)` (WDROŻONE w v14.8–v15.1):**
  - Po każdym z 8 Działów dodano 5-pytaniowy Quiz Podsumowujący (+50 XP) z animacją konfetti/fanfar.
  - Dolną zakładkę `Baza dvdrental` zastąpiono widokiem `🎯 Rejestr Luk (g1–g13)` (startującym uczciwie od `0/4` i `Wpadki: 0`) z dedykowanymi ćwiczeniami luk oraz sub-zakładką schematu `dvdrental`.

## Testy (z bieżącej sesji — v14.5 do v15.1)
- [x] Przełącznik lekcji/zadań otwiera się jako niezależny Bottom Sheet (`#taskSheetRoot`, `z-index: 9999`), a okienka `⚡ XP`, `🔥 Seria` i `🟢 PG16` zamykają się bez błędu `ReferenceError: e is not defined`
- [x] Walidator zalicza dowolną kolejność wierszy w zadaniach bez `ORDER BY`, wskazuje zamienioną kolejność kolumn w `SELECT`, a okienko `AS` używa słowa „razy” przy mnożeniu i pigułek `.alias-code-pill` bez zdradzania gotowego kodu
- [x] Przelicznik `recalculateRealXP` usunął zawyżone `1202 XP` i `streak: 4`, z rankingu usunięto profile demo (`Ania_Data` itd.), a tabela rankingowa rozwija się i przewija do 50 prawdziwych graczy z ramkami rang `.rank-frame-1..8`
- [x] Baza Supabase działa w architekturze 4-warstwowej (`User100+`, `sql_profiles`, `app_sessions`, `task_attempts`, `v_daily_user_analytics`, `v_task_funnel`) bez błędów `HTTP 400 Bad Request` w konsoli
- [x] Zakładka `🎯 Rejestr Luk (g1–g13)` startuje od `0/4` (`Wpadki: 0`), a ćwiczenie `g2` (`LEFT JOIN`) operuje na właściwych datach i odróżnia warunek w `ON` od warunku w `WHERE`
- [ ] **Do poprawy na starcie kolejnej sesji (`v15.2`):**
  1. Naprawić nachodzenie ikony rangi na pigułkę `🟢 PG16` w górnym pasku na wąskim ekranie iPhone'a (`topbar` flexbox).
  2. Rozdzielić bufor kodu edytora między ćwiczeniami z `Rejestru Luk` a zadaniami `Ścieżki` (aby zapytanie z treningu luki nie zostawało w edytorze po przejściu do lekcji 2.1).
  3. Uszczelnić bramkę Quizów Działowych: Quiz Działu `X` nie może wyskakiwać przed ukończeniem wszystkich pod-lekcji w Dziale `X`, a Dział `X+1` musi być twardo zablokowany do czasu zdania Quizu Działu `X` (gdy `Tryb testerski` jest wyłączony).
  4. Znormalizować wielkość liter nicku (`Wojtek1` vs `wojtek1`), aby ten sam gracz nie dublował się w rankingu, i przygotować logowanie Google Auth (1 e-mail = 1 `user_id` między telefonem a laptopem).

## Plan (Dalsze kroki wg `ARCHITEKTURA.md` v3.0)
- [x] 1 Prototyp rdzenia, podział na moduły, lokalny PWA, chmura Supabase Live i publikacja na GitHub Pages (v1–v11)
- [x] 2 **Etap 1 i 2 (v12–v14.5 — WDROŻONE):** Układ *Zero-Scroll Split UI*, kolorowanie DBeaver, układanka *Tap-to-Build*, 8 Działów / 27 pod-lekcji (211 zadań), kanoniczny walidator bez `ORDER BY`, anty-spojler `AS`, Onboarding 0 XP i Ramki Rang 1–8
- [x] 3 **Etap 3 (v14.8–v15.1 — WDROŻONE, szlif UX w v15.2):** 4-warstwowa telemetria w Supabase (`User100+`, `v_daily_user_analytics`), Quizy Działów 1–8 z fanfarami oraz zakładka `🎯 Rejestr Luk (g1–g13)` z generatorem ćwiczeń
- [ ] 4 **Etap 4 (Następna sesja — v15.2 / v16.0):** Poprawka 4 punktów UI/bramek z testów mobilnych `v15.1` + wdrożenie **Supabase Auth (Logowanie przez Google / E-mail)** spinającego telefon i laptop pod jednym `user_id` (`User100+`)
- [ ] 5 **Etap 5 (v17 — Produkt Komercyjny):** Bramka monetyzacji Freemium / Pakiet PRO, Certyfikat do CV oraz opakowanie aplikacji przez **CapacitorJS** pod Google Play / App Store

## Ostatnia sesja (podsumowanie od Gema — 11.11.2026)
1. **Walidator kolejności, Anty-Spojler `AS`, Bottom Sheet i Ramki Rang 1–8 (`v14.5`):** wdrożono kanoniczne sortowanie wierszy w `compareResults` dla zadań bez `ORDER BY` oraz komunikaty o przestawionej kolejności kolumn w `SELECT`; rozbito gotowe formuły z `AS` na pojedyncze klocki i poprawiono polszczyznę („Pomnóż kolumnę `amount` razy `4`”) z pigułkami `.alias-code-pill`; przeniesiono przełącznik zadań do `#taskSheetRoot` (`z-index: 9999`) i dodano wizualne ramki rang `.rank-frame-1..8`.
2. **Odwrócony Onboarding (0 XP), realny przelicznik XP/Serii i czyszczenie rankingu (`v14.8–v15.1`):** ustawiono modal wyboru nicku przed samouczkiem z natychmiastowym zapisem `0 XP` w Supabase; zastąpiono zaszyte `1202 XP` i `streak: 4` deterministyczną funkcją `recalculateRealXP(state)`, usunięto fałszywe profile-wydmuszki (`Ania_Data` itp.) i dodano przewijany ranking do 50 graczy.
3. **4-Warstwowa Hurtownia Telemetrii w Supabase (`User100+` i agregacja dzienna):** zaprojektowano i wdrożono w PostgreSQL sekwencyjne klucze `User100+` z wyzwalaczami serwerowymi (`fn_before_profile_upsert`, `fn_enrich_telemetry`), tabele `sql_profiles`, `app_sessions` (z utrzymaniem sesji w `sessionStorage`) i `task_attempts` (z pełną nazwą zadania `task_name`) oraz widoki `v_daily_user_analytics` i `v_task_funnel` odporne na mnożenie wierszy (*Chasm Trap*).
4. **Quizy Działowe (1–8) z fanfarami oraz zakładka `🎯 Rejestr Luk (g1–g13)` (`v15.0–v15.1`):** dodano 40 pytań podsumowujących po każdym z 8 działów (+50 XP) z animacją konfetti/pucharu, zastąpiono dolną zakładkę `Baza dvdrental` widokiem `🎯 Rejestr Luk` (startującym od `0/4` i `Wpadki: 0`) oraz dopracowano konfigurację darmowego klucza Gemini API w `Konto & AI`.
5. **Stabilizacja komunikacji API (`HTTP 400 fix`):** dodano brakującą kolumnę `solved_count`, zdjęto blokujący klucz obcy na `session_id` przy szybkich próbach mobilnych i wdrożono dwustopniowy fallback zapisu w `syncProfileToCloud` oraz `SQLTelemetry`.