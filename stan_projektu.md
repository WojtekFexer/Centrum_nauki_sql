# Stan projektu: Centrum nauki SQL (SQL Master)

> Dołączaj ten plik na starcie każdej nowej rozmowy z Gemem 3. Czyta go też agent w VS Code. Aktualizuj go po każdej sesji. Odhaczaj `[x]` dopiero po własnym teście w przeglądarce.

**Ostatnia aktualizacja:** 05.11.2026 (Wersja `v11` — po wdrożeniu standardu SoloLearn + DataLemur i publikacji na GitHub Pages)

## Pliki
- `index.html`: szkielet HTML aplikacji mobilnej PWA z wersjonowaniem lokalnych zasobów (`?v=11`) i meta tagami dla iOS Safari / Android Chrome
- `css/style.css`: style aplikacji (układ Editor-Centric Mobile UI, dwustopniowe zwijanie tabel, bursztynowa plakietka `.sql-as-badge`, animacje przejść między zadaniami `task-transition-enter`, ochrona przed rozjeżdżaniem ramek `overflow-wrap: anywhere`)
- `js/app.js`: główna logika aplikacji (`APP_VERSION = 'v11'`), silnik PGlite (Singleton `dbInitPromise`), generator zadań `buildDataLemurSpec` (czyste `📌 Polecenie` + `📋 Wymagania i założenia` z kolorowym `AS`), żywy podgląd `Example Input` / `Example Output`, 3-punktowa checklista walidacji, przełącznik cofania zadań `◀ ZADANIE X z 8 ▾ ▶`, zasada *Teach-First* (`🆕 Nowy element`), kontekstowy `SQL Quick-Bar` oraz auto-scroll do wyniku
- `js/data-dvdrental.js`: schemat (`SCHEMA_META`) i dane wsadowe (`DVDRENTAL_SEED_SQL`) bazy `dvdrental`
- `js/data-tasks.js`: przebudowana baza zadań Ścieżki — **128 zadań w 16 przyjaznych pod-lekcjach** (5 głównych ścieżek × pod-lekcje po 8 zadań: 2 rozgrzewkowe `R1–R2` + 3 podstawowe `1–3` + 3 łączące `4–6`) z odblokowaniem kolejnej pod-lekcji po zaliczeniu 5 z 8 zadań, oraz Diagnoza (10 zadań)
- `js/data-interview.js`: pula 60 zadań rekrutacyjnych w stylu DataLemur
- `manifest.json`: konfiguracja instalacji pełnoekranowej PWA (`display: standalone`) ze ścieżkami względnymi (`./`)
- `sw.js`: Service Worker (`sql-master-v11`) ze strategią Network-First (`cache: 'no-store'`) dla plików `.html/.js/.css`, Cache-First dla silnika WASM PGlite i Network-Only dla `supabase.co`
- `docs/ARCHITEKTURA.md`: wizja i plan techniczny (zaktualizowany do v2.0)
- `stan_projektu.md`: ten plik
- `GEMINI.md`: zasady pracy agenta w VS Code

## Decyzje
- **Silnik SQL (WDROŻONY):** `@electric-sql/pglite` (PostgreSQL 16 w WebAssembly) zabezpieczony wzorcem Singleton Promise Guard (`dbInitPromise`).
- **Układ mobilny i prezentacja zadań w stylu SoloLearn + DataLemur (WDROŻONE w v10–v11):**
  - Każde zadanie dzieli się na czysto biznesowe `📌 Polecenie` (po polsku, bez wzorów SQL i bez uciętych zdań) oraz wypunktowane `📋 Wymagania i założenia`, gdzie zwykłe kolumny wyświetlają się jako `kolumna nazwa`, a kolumny z aliasem w szyku `opis/kolumna AS alias` z wyróżnionym kolorem słowem `AS`.
  - Nowa kolejność na ekranie telefonu: `Nawigacja i Pasek Postępu` → `Polecenie i Wymagania` → `Dwustopniowo zwijana specyfikacja tabeli (osobno kolumny, osobno Example Input)` → `Kontekstowa Ściąga i SQL Quick-Bar` → `Edytor SQL` → `Wynik (z auto-scrollem), Example Output i 3-stopniowe Podpowiedzi pod edytorem`.
  - Klikalny przełącznik `◀ ZADANIE X z 8 ▾ ▶` w nagłówku pozwala w każdej chwili cofnąć się do dowolnego wcześniejszego zadania w lekcji.
- **Dydaktyka progresywna i 16 pod-lekcji (WDROŻONE w v11):**
  - Ścieżka podzielona na 5 etapów i **16 krótszych pod-lekcji po 8 zadań** (`R1–R2`, `1–3`, `4–6` — łącznie 128 zadań). Osobne pod-lekcje dla `SELECT/FROM`, `AS`, `DISTINCT`, `ORDER BY/LIMIT`, pojedynczego `WHERE`, `AND/OR`, `IN/BETWEEN/ILIKE`, agregacji, `GROUP BY` i `HAVING`.
  - Zaliczenie **5 z 8 zadań** automatycznie odblokowuje następną pod-lekcję (trudniejsze zadania `4–6` nie blokują dalszej nauki).
  - Zasada *Teach-First*: boks `🆕 Nowy element w tym zadaniu` pojawia się tylko przy pierwszym wystąpieniu nowej składni, a symulator potoku wykonawczego bazy jest ukryty w Etapach 1–2 (wchodzi dopiero od Etapu 3 przy `GROUP BY` i `HAVING`).
- **Auto-aktualizacja PWA i GitHub Pages (WDROŻONE w v9–v11):** aplikacja działa publicznie pod adresem `https://wojtekfexer.github.io/Centrum_nauki_sql/`, wymusza pobieranie świeżych plików przez `cache: 'no-store'` + `?v=11` i posiada przycisk `🔄 Odśwież do najnowszej wersji (v11)` w zakładce `Konto & AI`.

## Testy (z bieżącej sesji — v8 do v11)
- [x] Publikacja na GitHub Pages (`https://wojtekfexer.github.io/Centrum_nauki_sql/`) działa na telefonie, a znajoma osoba zalogowała się i od razu pojawiła w `🏆 Rankingu Testerów` (Supabase Live)
- [x] Pasek kontrolny walidacji (Kolumny / Ziarno — liczba wierszy / Wartości i sortowanie) działa poprawnie po uruchomieniu zapytania
- [x] Usunięto duży boks steppera znad zadania oraz duplikację boksów „Po ludzku”; wprowadzono czysty podział na `📌 Polecenie` i `📋 Wymagania i założenia` bez uciętych polskich zdań
- [x] W wymaganiach zadania zwykłe kolumny wyświetlają się bez słowa `AS`, a wymagające aliasu mają szyk `kolumna/opis AS alias` z kolorową plakietką `AS`
- [x] Klikalny przełącznik `◀ ZADANIE X z 8 ▾ ▶` pozwala cofać się do poprzednich zadań i wybierać kroki z rozwijanej listy
- [x] Nowy układ mobilny działa poprawnie: specyfikacja tabeli zwija się dwustopniowo (osobno kolumny, osobno `Example Input`), edytor SQL jest od razu pod ręką, a po kliknięciu `▶ Uruchom i sprawdź` ekran płynnie przewija się do wyniku
- [x] Ścieżka jest podzielona na 16 mniejszych pod-lekcji po 8 zadań (128 zadań), lekcja `1.1` zawiera tylko prosty opis `SELECT` i `FROM` (bez `AS`, bez `WHERE` i bez symulatora potoku bazy), a zaliczenie 5 zadań odblokowuje kolejną pod-lekcję
- [ ] Przegląd i doszlifowanie naturalności opisów we wszystkich 60 zadaniach rekrutacyjnych (`js/data-interview.js`)
- [ ] Dodanie banera/instrukcji instalacji aplikacji na ekranie głównym telefonu (tryb pełnoekranowy Standalone bez pasków przeglądarki Safari/Chrome)
- [ ] Finałowy audyt kodu i spójności zapytań wzorcowych z udziałem Copilota

## Plan (Dalsze kroki)
- [x] 1 Prototyp rdzenia (interfejs Lista ↔ Edytor, PGlite z bazą dvdrental, Diagnoza 10 pytań)
- [x] 2 Rozbudowa puli zadań i podział monolitu na moduły (`style.css`, `app.js`, `data-*.js`)
- [x] 3 Lokalny PWA (`manifest.json`, `sw.js`), podpięcie chmury Supabase (`SQLRanking`) i publikacja na GitHub Pages (HTTPS)
- [x] 4 Przebudowa UX i dydaktyki do standardu SoloLearn + DataLemur (v11: 16 pod-lekcji po 8 zadań, zasada *Teach-First*, dwustopniowe tabele `Example Input/Output`, 3-punktowa checklista, klikalne cofanie zadań, kolorowe `AS`)
- [ ] 5 **Pakiet 3 (Następna sesja):** korekta językowa wszystkich 60 zadań rekrutacyjnych w `js/data-interview.js` + baner instalacji pełnoekranowej aplikacji PWA (Standalone na iOS/Android)
- [ ] 6 **Krok 4 (Następna sesja):** kompleksowy przegląd kodu i testów z Copilotem (`get_errors`, weryfikacja wszystkich zapytań wzorcowych PGlite) oraz zebranie kolejnej tury feedbacku od znajomych testerów

## Ostatnia sesja (podsumowanie od Gema — 05.11.2026)
1. **Publikacja na GitHub Pages i test Supabase Live ze znajomymi:** uruchomiono publiczny hosting HTTPS (`wojtekfexer.github.io/Centrum_nauki_sql/`), zweryfikowano działanie na telefonie oraz potwierdzono natychmiastową synchronizację konta znajomej w tabeli `🏆 Ranking Testerów`.
2. **Standard zadań DataLemur + SQLBolt i kolorowe `AS`:** zlikwidowano zduplikowane opisy „Po ludzku”, naprawiono ucięte polskie zdania i wdrożono podział na czyste `📌 Polecenie` oraz `📋 Wymagania i założenia` (zwykłe kolumny bez `AS`, a aliasy w szyku `opis/kolumna AS alias` z wyróżnioną kolorystycznie plakietką `AS`), uzupełnione o 3-punktową checklistę walidacji (Kolumny / Ziarno / Wartości) i 3-stopniowe podpowiedzi.
3. **Mobilny układ ekranu (Editor-Centric UX) i cofanie zadań:** przeniesiono edytor SQL wyżej (a `Example Output` i podpowiedzi pod edytor), wprowadzono dwustopniowe zwijanie specyfikacji tabeli (osobno kolumny, osobno `Example Input`), dodano płynny auto-scroll do wyniku, kontekstowy `SQL Quick-Bar` oraz klikalny przełącznik `◀ ZADANIE X z 8 ▾ ▶` umożliwiający cofanie się do poprzednich zadań.
4. **Dydaktyka *Teach-First* i podział Ścieżki na 16 pod-lekcji po 8 zadań (128 zadań):** odchudzono pierwszą lekcję `1.1` wyłącznie do prostego `SELECT` i `FROM`, ukryto symulator potoku wykonawczego bazy w Etapach 1–2, dodano pigułki `🆕 Nowy element w tym zadaniu` oraz rozbito materiał na 16 krótkich pod-lekcji z odblokowaniem kolejnego tematu po zaliczeniu 5 z 8 zadań.
5. **Niezawodna aktualizacja PWA (`v11`) i co dalej:** wdrożono wersjonowanie zasobów (`?v=11`), strategię Network-First z `cache: 'no-store'` dla lokalnych plików oraz przycisk wymuszenia aktualizacji w zakładce `Konto & AI`; w następnej sesji wykonamy Pakiet 3 (korekta 60 zadań rekrutacyjnych + instrukcja instalacji pełnoekranowej PWA bez pasków przeglądarki) oraz finałowy audyt kodu z Copilotem.