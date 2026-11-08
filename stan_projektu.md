# Stan projektu: Centrum nauki SQL (SQL Master)

> Dołączaj ten plik na starcie każdej nowej rozmowy z Gemem 3. Czyta go też agent w VS Code. Aktualizuj go po każdej sesji. Odhaczaj `[x]` dopiero po własnym teście w przeglądarce.

**Ostatnia aktualizacja:** 08.11.2026 (Wersja `v13.1` — Globalna aktualizacja UI/UX, układ Zero-Scroll Split UI, jednolite pigułki aliasów i popovery, dwustopniowy akordeon dla wielu tabel, klocki układanki o wysokim kontraście, 4 poprawki z audytu Copilota oraz interaktywne modale paska górnego)

## Pliki
- `index.html`: szkielet HTML aplikacji mobilnej PWA z wersjonowaniem lokalnych zasobów (`?v=13.1`), interaktywnymi pigułkami górnego paska (`#dbStatus`, `#xpPill`, `#streakPill`) i meta tagami dla iOS Safari / Android Chrome
- `css/style.css`: style aplikacji (układ Zero-Scroll Split UI, złote pigułki `.req-col-pill-alias`, popover `.alias-calc-popover`, akordeon `.multi-table-accordion-card`, klocki układanki o wysokim kontraście `.puzzle-block-btn`, `.quick-chip-btn`, modale `.topbar-modal-backdrop` i odporność na ściskanie nagłówków mobilnych 360px–414px)
- `js/app.js`: główna logika aplikacji (`APP_VERSION = 'v13.1'`), silnik PGlite z auto-naprawą cache WASM, dwustopniowe filtrowanie kolumn `Example Input` (`filterSampleToMeta`), walidator `compareResults` z weryfikacją nazw kolumn/aliasów, bezpieczna synchronizacja `gaps` i debounced save (200ms) w edytorze mobilnym
- `js/data-dvdrental.js`: schemat (`SCHEMA_META`) i dane wsadowe (`DVDRENTAL_SEED_SQL`) bazy `dvdrental`
- `js/data-tasks.js`: baza 128 zadań Ścieżki oraz Diagnoza (10 pytań) — 100% zapytań wzorcowych przechodzi na PGlite
- `js/data-interview.js`: pula 60 wyzwań rekrutacyjnych w stylu DataLemur po pełnej korekcie językowej
- `manifest.json`: konfiguracja instalacji pełnoekranowej PWA (`display: standalone`) ze ścieżkami względnymi (`./`)
- `sw.js`: Service Worker (`sql-master-v13-1`) z obsługą cache dla wersji `v13.1` i walidacją rozmiaru paczki WASM
- `docs/ARCHITEKTURA.md`: wizja i plan techniczny (v2.0)
- `stan_projektu.md`: ten plik
- `GEMINI.md`: zasady pracy agenta w VS Code

## Decyzje
- **Zero-Scroll Split UI i Zakładki Kontekstowe (WDROŻONE w v13):** Kompaktowy 2-wierszowy pasek nawigacji zadania (`← Mapa` | `◀ 🔥 Rozgrz. 1/2 ▾ ▶` | `📖 Slajdy`) oraz 3 zakładki (`📌 Zadanie`, `📊 Tabela`, `🎯 Wzór i pomoc`) nad edytorem SQL.
- **Globalny system pigułek kolumn i popovery (WDROŻONE w v13.1):** Każda kolumna wymagająca wyliczenia lub aliasu wyświetla zgrabną, złotą pigułkę (`✨ nazwa_kolumny ℹ️` bez słowa `AS` w środku). Dotknięcie pigułki otwiera okienko z informacją o źródle wyliczenia oraz przyciskami `[ ➕ Wstaw "AS ..." ]` i `[ ✕ Zamknij ]`.
- **Dwustopniowy akordeon wielu tabel i ścisłe filtrowanie (WDROŻONE w v13.1):** W zadaniach z `>= 2` tabelami każda tabela posiada niezależny akordeon rozwijania kolumn i podglądu wierszy `Example Input`. Kolumny `Example Input` są filtrowane w 100% 1:1 ze specyfikacją zadania (eliminacja nadmiarowych kolumn typu `rental_duration`).
- **Dydaktyka i podsumowania w boksach `🆕 Nowy element` (WDROŻONE w v13.1):** Wyróżnienie składni SQL kodem oraz gwarantowane zdanie wyjaśniające wpływ klauzuli na końcową tabelę wynikową we wszystkich 16 pod-lekcjach.
- **Poprawki z audytu Copilota (WDROŻONE w v13.1):** Inteligentne tłumaczenie warunków w nawiasach (np. `customer_id = 1`, `length >= 120`, `* 100.0`), weryfikacja aliasów kolumn w `compareResults()`, bezpieczna obsługa pustych profili i merge `gaps` z Supabase oraz debounced zapis edytora (200 ms).
- **Interaktywny pasek górny (WDROŻONE w v13.1):** Klikalne pigułki `🟢 PG16` (status silnika WASM i reset bazy), `⚡ XP` (postęp, ranga gracza i statystyki) oraz `🔥 Seria dni` (streak nauki).

## Testy (z bieżącej sesji — v13 i v13.1)
- [x] Wszystkie 30 testów automatycznych w suicie headless Chrome przeszło w 100% (30/30 PASS)
- [x] Pigułki kolumn z aliasem wyglądają jednolicie (`✨ kolumna ℹ️`), a kliknięcie otwiera popover ze wstawianiem `AS ...`
- [x] Akordeon dla zadań z wieloma tabelami zwija i rozwija niezależnie kolumny i wiersze `Example Input`
- [x] Podgląd `Example Input` nie wyświetla nadmiarowych kolumn spoza schematu zadania
- [x] `compareResults` wychwytuje brakujące lub błędne aliasy kolumn i wyświetla pomocny komunikat po polsku
- [x] `buildCleanPolecenie` zachowuje wartości filtrów liczbowych w nawiasach (`co najmniej 120`, `ID 1`, `w procentach`)
- [x] Klocki układanki i Quick-Bara mają wysoki kontrast i czytelne podświetlenie składni
- [x] Pigułki statusu `🟢 PG16`, `⚡ XP`, `🔥` otwierają dedykowane okienka modalne z dowolnego miejsca w aplikacji
- [x] Edytor zapisuje stan z opóźnieniem 200 ms oraz natychmiast przy zdarzeniu `blur`
- [x] Zero błędów w konsoli przeglądarki (Console F12) przy uruchomieniu aplikacji

## Plan (Dalsze kroki)
- [x] 1 Prototyp rdzenia (interfejs Lista ↔ Edytor, PGlite z bazą dvdrental, Diagnoza 10 pytań)
- [x] 2 Rozbudowa puli zadań i podział monolitu na moduły (`style.css`, `app.js`, `data-*.js`)
- [x] 3 Lokalny PWA (`manifest.json`, `sw.js`), podpięcie chmury Supabase (`SQLRanking`) i publikacja na GitHub Pages (HTTPS)
- [x] 4 Przebudowa UX i dydaktyki do standardu SoloLearn + DataLemur (v11: 16 pod-lekcji po 8 zadań)
- [x] 5 Aktualizacja UX, kolorowanie DBeaver, samouczek SoloLearn + PWA (v12–v12.1)
- [x] 6 Układ Zero-Scroll Split UI i globalna aktualizacja systemowa v13.1 (akordeon tabel, jednolite pigułki, kontrast, audyt Copilota, modale paska)
- [ ] 7 Testy użyteczności na telefonach (iPhone Safari, Android Chrome) z udziałem testerów i zebranie statystyk rankingowych w Supabase