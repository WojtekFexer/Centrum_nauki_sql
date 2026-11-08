# Architektura i Plan Techniczny: Centrum nauki SQL / Data Master (v3.0)

> **Lokalizacja w projekcie:** `docs/ARCHITEKTURA.md`
> **Status (07.11.2026 — Wersja `v12.1`):** Kod rozbity na moduły (`style.css`, `app.js`, `data-*.js`), wdrożony silnik PGlite (PostgreSQL 16 WASM) z Self-Healing Cache, kolorowanie składni w stylu DBeavera, 198 zweryfikowanych zadań (128 Ścieżka + 10 Diagnoza + 60 Rekrutacja DataLemur), PWA Offline-First oraz ranking na żywo w Supabase.
> **Cel dokumentu:** Kompleksowy opis architektury obecnej (`v12.1`) oraz docelowej architektury komercyjnej (`v3.0 Production` — horyzont 10 tygodni) obejmującej przebudowę wizualną *Zero-Scroll Mobile UI*, *AI Adaptive Gap Engine*, logowanie Supabase Auth, monetyzację Freemium/PRO, natywną aplikację CapacitorJS oraz przyszły moduł Python.

---

## 1. Wizja Produktu i Pozycjonowanie Rynkowe

**Centrum nauki SQL (SQL Master)** to mobilna platforma treningowa (**Mobile-First Data LMS**), która łączy dwa światy:
1. **Przejrzystość wizualną i mikro-naukę (Mimo / SoloLearn / DataCamp Mobile / Duolingo):** układ jednego ekranu bez przewijania (*Zero-Scroll Split UI*), rozgrzewki w formie bezklawiaturowej układanki z klocków (*Tap-to-Build*), 4-kartowe wizualne wprowadzenia i ligi rankingowe.
2. **Prawdziwy warsztat analityka danych (DataLemur / DBeaver / PostgreSQL 16):** pełny silnik **PGlite (PostgreSQL 16 w WebAssembly)** działający lokalnie na telefonie, 60 zadań rekrutacyjnych z detektorem pułapek (*Trap Detector*) oraz **AI Adaptive Gap Engine** generujący nowe zadania na żywo pod indywidualne błędy użytkownika.

---

## 2. Standard Wizualny i UX („Zero-Scroll Split UI” — v13+)

Na podstawie testów mobilnych na iPhonie (375px) oraz analizy aplikacji SoloLearn, Mimo i DataNinja, interfejs przechodzi z układu długiej przewijanej strony na **Jednoekranowy Układ Mobilny (`100dvh`)**:

1. **Ultracienki Nagłówek Zadania (1 linia, 48px wysokości):**
   * Zamiast wieloliniowych opisów silnika i zagnieżdżonych ramek informacyjnych, górny pasek zawiera wyłącznie:
     `[ ← Mapa ]` | `[ ━━━━●━━ 1/6 ▾ ]` | `[ 📖 Slajdy ]` | `[ 🟢 PG16 · ⚡XP ]`.
2. **Górna Strefa Ekranu (45% wysokości — Karta Kontekstu z 3 zakładkami):**
   * Użytkownik przełącza jednym dotknięciem kciuka:
     * **Zakładka `[ 📌 Zadanie ]`:** krótkie, czysto biznesowe polecenie po polsku + **Wizualny Pasek Kolumn Wynikowych** (poziome, klikalne pigułki `[ store_id ] ➔ [ ✨ AS miasto ]` zamiast długiej pionowej listy ze słowem „kolumna”).
     * **Zakładka `[ 📊 Tabela źródłowa ]`:** nazwy i typy kolumn oraz przykładowe wiersze `Example Input`.
     * **Zakładka `[ 🎯 Wzór wyniku ]`:** tabela `Example Output` pokazująca jak ma wyglądać poprawny raport.
3. **Dolna Strefa Ekranu (55% wysokości — Strefa Kodu zawsze pod kciukiem):**
   * **Tryb Rozgrzewki (`🔥 R1–R2`):** interaktywna układanka z klocków (*Tap-to-Build*) — użytkownik stuka w gotowe kafelki słów kluczowych i kolumn, uzupełniając luki w zapytaniu bez otwierania klawiatury ekranowej.
   * **Tryb Zadania Głównego (`🎯 1–6`) i Rekrutacji:** dwuwarstwowy edytor SQL z kolorowaniem w stylu DBeavera (`.sql-kw`, `.sql-fn`, `.sql-alias`), paskiem `SQL Quick-Bar`, przyciskami `⌫ Cofnij` / `🧹 Wyczyść` oraz stałym przyciskiem `▶ Uruchom i sprawdź`.
4. **Wysuwany Panel Wyniku (*Bottom Sheet Drawer*):**
   * Po kliknięciu `▶ Uruchom i sprawdź` wynik nie wymaga przewijania strony w dół — wysuwa się jako dolny panel z 3-punktową checklistą walidacji (`Kolumny` / `Ziarno — liczba wierszy` / `Wartości i sortowanie`), suflerem błędów i przyciskiem `Następne zadanie →`.

---

## 3. Pięć Filarów Funkcjonalnych (Stan Obecny vs Docelowy v3.0)

### Filar 1: Ścieżka Dydaktyczna 16 Pod-lekcji (128 zadań) — [WDROŻONE + ROZBUDOWA UX]
* **5 etapów × pod-lekcje po 8 zadań:** 2 rozgrzewkowe (`R1–R2`) + 3 podstawowe (`1–3`) + 3 łączące (`4–6`).
* **Odblokowanie 5 z 8:** Zaliczenie 5 zadań odblokowuje kolejny temat (`🌟 5/5`), nie blokując ucznia na najtrudniejszych zadaniach łączących.
* **Progresywny Potok Wykonawczy:** Slajdy wprowadzające pokazują wyłącznie klauzule poznane do bieżącej lekcji (zasada *Teach-First*).

### Filar 2: Diagnoza (Placement Test) i 60 Wyzwań Rekrutacyjnych DataLemur — [WDROŻONE]
* **Diagnoza (10 zadań z przyciskiem „Pomiń”):** dopasowuje poziom startowy ucznia i zasila początkowy Rejestr Luk.
* **60 Wyzwań Rekrutacyjnych:** zadania wzorowane na procesach rekrutacyjnych firm technologicznych i działów controllingu, opisane naturalnym językiem biznesowym po polsku (100% zapytań zweryfikowanych na PGlite).

### Filar 3: AI Adaptive Gap Engine (Inteligentny Trener Luk) — [ROZWÓJ v3.0]
* **Automatyczna Telemetria Luk (`g1–g13`):** Każde błędne uruchomienie kodu jest klasyfikowane przez `Trap Detector` (np. `g1` błędne ziarno agregacji, `g2` warunek `LEFT JOIN` w `WHERE`, `g4` granice dat `TIMESTAMP`, `g6` przecinek przed `FROM` / literówki, `g8` `AVG` na `NULL`-ach, `g10` dzielenie całkowite).
* **Generowanie Zadań na Żywo przez AI z Walidacją w PGlite:**
  1. Moduł `AI Gap Trainer` pobiera 3 najsłabsze obszary użytkownika oraz schemat `SCHEMA_META` bazy `dvdrental`.
  2. Model Gemini generuje nowe zadanie (w formacie JSON) wycelowane dokładnie w daną lukę i aktualny poziom trudności ucznia.
  3. **Twarda weryfikacja w PGlite:** Zanim zadanie pojawi się na ekranie, silnik PGlite wykonuje w tle zapytanie wzorcowe wygenerowane przez AI. Jeśli zapytanie zwraca poprawną tabelę, aplikacja buduje z niej `Example Output` i prezentuje zadanie uczniowi.

### Filar 4: Konta Chmurowe, Tygodniowe Ligi i Certyfikat Portfolio — [ROZWÓJ v3.0]
* **Supabase Auth:** Logowanie 1 kliknięciem (Google / Apple / E-mail) z pełną synchronizacją postępu między telefonem a komputerem.
* **System Lig i *Daily SQL Sprint*:** Tygodniowe dywizje rankingowe (Brązowa, Srebrna, Złota, Diamentowa) oraz jedno wspólne „Wyzwanie Dnia” dla wszystkich graczy.
* **Weryfikowalny Certyfikat do CV:** Po ukończeniu Ścieżki i Egzaminu Końcowego (≥80%) generowany jest publiczny profil potwierdzający praktyczną znajomość PostgreSQL.

### Filar 5: Architektura Multi-Language (Gotowość pod Python + Pandas) — [PRZYSZŁOŚĆ v3.5]
* Abstrakcja silnika wykonawczego (`ExecutionEngine`): obok obecnego `PGliteEngine` (PostgreSQL 16 WASM) architektura pozwala podpiąć `PyodideEngine` (Python 3 + biblioteka `pandas` w WebAssembly) na tym samym interfejsie mobilnym i tej samej bazie danych (0 zł kosztu serwerów).

---

## 4. Stos Technologiczny i Model Monetyzacji

| Warstwa | Wersja Obecna (`v12.1`) | Wersja Docelowa (`v3.0 Komercyjna`) | Cel i korzyść |
| :--- | :--- | :--- | :--- |
| **Baza danych w telefonie** | **PGlite** (PostgreSQL 16 WASM) + Self-Healing Cache | **PGlite** (SQL) + docelowo **Pyodide** (Python WASM) | Prawdziwy silnik bazodanowy działający za darmo na urządzeniu użytkownika (0 zł kosztów serwerowych). |
| **Interfejs & Kod** | Vanilla HTML/CSS/JS + edytor DBeaver (`<pre>` + `<textarea>`) | Układ **Zero-Scroll Split UI** + moduły ES (`core-db`, `core-editor`, `ai-trainer`, `ui-views`) | Maksymalna czytelność na ekranie 375px i łatwe utrzymanie kodu. |
| **Instalacja na telefonie** | **PWA** (`manifest.json`, `sw.js`) na GitHub Pages | **PWA** + natywna paczka iOS / Android przez **CapacitorJS** | Publikacja w **Google Play** i **App Store** z tego samego kodu źródłowego. |
| **Backend & Konta** | `localStorage` + tabela `SQLRanking` w **Supabase** | **Supabase Auth** + baza PostgreSQL z Row Level Security (RLS) | Bezpieczne logowanie, synchronizacja między urządzeniami i ochrona wyników. |
| **Integracja AI** | Klucz Gemini API użytkownika (BYOK) | **BYOK** (w wersji Free) + **Supabase Edge Function Proxy** (w wersji PRO) | Użytkownicy PRO korzystają z AI Trenera Luk od razu po zalogowaniu, bez konfigurowania kluczy API. |
| **Monetyzacja** | Darmowa wersja testowa | **Freemium + Pakiet PRO** (Stripe / BLIK / Google Play Billing) | Etapy 1–2 za darmo; Etapy 3–5 + 60 zadań rekrutacyjnych + AI Trener Luk w pakiecie PRO (39 zł jednorazowo lub 19 zł/mies.). |

---

## 5. Harmonogram Wdrożenia v3.0 (10 Tygodni)

* **Etap 1 (Tygodnie 1–2): Rewolucja Wizualna („Zero-Scroll Split UI”)** — odchudzenie nagłówka do 1 linii, zakładki `[Zadanie | Tabela | Wzór]` nad edytorem, poziome pigułki wymaganych kolumn i wysuwany panel wyniku (*Bottom Sheet*).
* **Etap 2 (Tygodnie 3–4): Układanka Klockowa (*Tap-to-Build*) i Wizualne Slajdy** — bezklawiaturowy tryb dla rozgrzewek `R1–R2` oraz interaktywne podświetlanie kolumn/wierszy w samouczku.
* **Etap 3 (Tygodnie 5–6): AI Adaptive Gap Engine** — automatyczne profilowanie błędów użytkownika (`g1–g13`) i generator spersonalizowanych zadań AI walidowanych w PGlite.
* **Etap 4 (Tygodnie 7–8): Supabase Auth i Ligi Rankingowe** — logowanie Google/E-mail, zapis w chmurze, dywizje tygodniowe i „Wyzwanie Dnia”.
* **Etap 5 (Tygodnie 9–10): Bramka PRO, CapacitorJS i Premiera** — wdrożenie płatności BLIK/Stripe, budowa paczki na Google Play i start promocji w mediach społecznościowych.