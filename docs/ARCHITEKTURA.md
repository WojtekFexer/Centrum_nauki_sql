# Architektura i Plan Techniczny: Centrum nauki SQL (Mobile LMS)

> **Lokalizacja docelowa w projekcie:** `docs/ARCHITEKTURA.md`
> **Status (31.10.2026):** etapy 1–2 gotowe, silnik zmieniony z SQL.js na PGlite, następny krok to podział pliku na części i PWA.
> **Cel dokumentu:** Stały punkt odniesienia opisujący wizję funkcjonalną, architekturę danych, stos technologiczny (obecny i docelowy) oraz harmonogram rozwoju aplikacji.

---

## 1. Główny zamysł i wizja aplikacji

Aplikacja jest **mobilnym środowiskiem treningowym SQL (Mobile-First SQL LMS)** łączącym najlepsze cechy **SoloLearn / SQLBolt** (prowadzenie za rękę od zera przez krótkie, ustrukturyzowane lekcje, ale z dużym naciskiem na samodzielne pisanie kodu) oraz **DataLemur / StrataScratch** (zadania rekrutacyjne z ukrytymi pułapkami analitycznymi zasilającymi indywidualny rejestr luk).

### Cztery filary funkcjonalne:
1. **Ścieżka od 0 do Zaawansowanego (60–100 dynamicznych zadań na bazie `dvdrental`):**
   * Podzielona na 5 etapów:
     1. *Fundament SELECT i WHERE*
     2. *Agregacje, NULL i GROUP BY / HAVING*
     3. *Złączenia (INNER, LEFT, Anti-Join, Self-Join)*
     4. *CASE WHEN, COALESCE, FILTER i Rzutowanie*
     5. *CTE (WITH), Funkcje Okna i Kalendarze (`generate_series`)*
   * Każde zagadnienie w ścieżce posiada **5 wariantów parametrycznych**. Zmiana wariantu podmienia tabelę docelową (np. `film` → `payment` → `rental` → `customer`), szukane kolumny oraz progi liczbowe, dzięki czemu nie rozwiązujesz zadań „na pamięć”.
2. **Moduł „Diagnoza” (Placement Test 10–15 zadań z przyciskiem „Pomiń”):**
   * Przeznaczony dla osób, które mają już podstawy i nie chcą zaczynać od prostego `SELECT *`.
   * Zawiera przekrojowe zadania od poziomu 1 do 5. Każde zadanie ma przycisk **„⏭ Pomiń zadanie (Nie umiem jeszcze)”**.
   * Na koniec Diagnoza automatycznie odblokowuje właściwy etap w Ścieżce, zalicza wcześniejsze moduły i dopisuje pominięte lub błędnie rozwiązane zagadnienia bezpośrednio do **Rejestru Luk**.
3. **Sekcja Rekrutacyjna w stylu DataLemur + Detektor Pułapek + Rejestr Luk:**
   * Katalog 12 zadań rekrutacyjnych z prawdziwych procesów kwalifikacyjnych (Netflix, Stripe, Amazon, Spotify, Uber, Meta, Microsoft, Airbnb, Google, LinkedIn, PayPal, TikTok) przeniesionych na schemat `dvdrental`.
   * **Trap Detector:** Gdy zapytanie zwraca zły wynik, algorytm analizuje strukturę Twojego kodu SQL pod kątem typowych błędów (np. warunek dla prawej tabeli `LEFT JOIN` umieszczony w `WHERE` zamiast w `ON`, użycie `COUNT(*)` zamiast `COUNT(prawa.id)`, `NOT IN` na kolumnie z `NULL`, brak `DISTINCT` przy łączeniu dwóch tabel faktów, dzielenie całkowite bez `* 100.0`).
   * Każda wykryta pułapka automatycznie obniża poziom danej luki w **Rejestrze Luk (Spaced Repetition)** i podsuwa ją do powtórki.
4. **Ergonomia na telefonie (iOS / Android) + Tryb Hybrydowy (100% Offline + BYOK AI):**
   * **SQL Quick-Bar:** Dwa paski przycisków nad edytorem (kontekstowe nazwy tabel/kolumn z bieżącego zadania oraz operatory SQL), które wstawiają kod w miejsce kursora jednym dotknięciem.
   * **Przejrzysty układ Lista ↔ Tryb Zadania:** Na małym ekranie telefonu nigdy nie mieszamy długiej mapy kursu z edytorem kodu.
   * **Tryb Offline + Własne AI:** Baza `dvdrental`, sprawdzanie zadań, warianty, Diagnoza i pułapki DataLemur działają lokalnie, a po kroku PWA także bez internetu (do tego czasu silnik PGlite ładuje się z internetu przez CDN). Dodatkowo użytkownik może podać darmowy klucz **Google Gemini API** lub korzystać z **Claude** do generowania podpowiedzi mentora.

---

## 2. Stos technologiczny (Teraz vs Docelowo)

| Warstwa | Etap 1–3 (Teraz w VS Code) | Etap 4 (Docelowa aplikacja produkcyjna) | Uzasadnienie techniczne |
| :--- | :--- | :--- | :--- |
| **Silnik bazy danych** | **PGlite** (pełny PostgreSQL 16 w WASM), ładowany z CDN (jsdelivr) | **PGlite** z lokalnym cache w PWA | Prawdziwy PostgreSQL w przeglądarce: ta sama składnia i te same komunikaty błędów co w DBeaverze (`::numeric`, `FILTER`, `generate_series`). Zapytania wykonują się lokalnie w pamięci telefonu, bez kosztów serwera. |
| **Frontend & UI** | **Vanilla HTML5 / CSS3 / JS (ES6+)** | **Moduły ES / Vite** opakowane w **PWA** (i opcjonalnie **Capacitor** dla App Store / Google Play) | Brak narzutu ciężkich frameworków, natychmiastowa reakcja dwuwarstwowego edytora kodu na iOS Safari. |
| **Praca Offline** | `localStorage` + pamięć podręczna przeglądarki | **Service Worker (`sw.js`) + Web App Manifest (`manifest.json`)** | Pełne działanie aplikacji i silnika WASM w trybie samolotowym po dodaniu ikony do ekranu początkowego telefonu. |
| **Zapis w chmurze i Rankingi** | `localStorage` + eksport/import pliku `.json` | **Supabase** (darmowy PostgreSQL w chmurze + Supabase Auth) | Pozwala w przyszłości dodać logowanie Google/Apple, synchronizację między telefonem a laptopem oraz globalną tablicę wyników (`leaderboard`). |
| **Integracja AI** | **Google Gemini API (BYOK)**: klucz wpisuje użytkownik, zapis w `localStorage`. Claude Artifacts: opcjonalnie w przyszłości | Adapter AI + opcjonalne proxy w **Supabase Edge Functions** | Użytkownik korzysta za darmo z wbudowanej bazy 80+ zadań lub podpina własny darmowy klucz API. |

---

## 3. Schemat bazy danych `dvdrental` z zaszytymi przypadkami brzegowymi

Wbudowana baza `dvdrental` składa się z **10 powiązanych tabel**, w których celowo umieszczono anomalie testujące uważność analityka:
* `film` (20 filmów, różne grupy `rating`, ceny `0.99`, `2.99`, `4.99` oraz remisy w czasie trwania `length`).
* `category` (6 kategorii) oraz `film_category` (tabela łącząca).
* `actor` (8 aktorów) oraz `film_actor` — **Przypadek brzegowy:** aktor `actor_id = 8 (MATTHEW JOHANSSON)` nie grał w żadnym filmie (test na `LEFT JOIN ... IS NULL` / `NOT EXISTS`).
* `store` (2 oddziały) oraz `staff` (2 pracowników).
* `customer` (10 klientów, aktywni i nieaktywni) — **Przypadek brzegowy:** klientki `customer_id = 9` oraz `10` nigdy nic nie wypożyczyły (pułapka `INNER JOIN` vs `LEFT JOIN`).
* `rental` (15 wypożyczeń w maju i czerwcu 2026) — **Przypadek brzegowy:** 3 wypożyczenia mają `return_date IS NULL` (filmy jeszcze niezwrócone – test na `COUNT(*)` vs `COUNT(return_date)` oraz pułapkę `NOT IN` z `NULL`).
* `payment` (15 płatności powiązanych z wypożyczeniami i klientami).

---

## 4. Plan realizacji w 4 etapach (Kryteria „Działa, gdy…”)

1. **Etap 1: Przejrzysty Prototyp Rdzenia (ZROBIONE)**
   * *Działa, gdy:* Użytkownik może w VS Code (Live Server) przeglądać czystą Mapę Ścieżki, wchodzić w Tryb Zadania, pisać zapytania ze składnią PostgreSQL (`::numeric`, `ILIKE`, `DATE_TRUNC`, `INTERVAL`, `generate_series`), przejść 10-pytaniową Diagnozę i wpaść w pułapkę w zadaniu DataLemur z automatycznym wpisem do Rejestru Luk.
2. **Etap 2: Pula 60–100 zadań i wariantów (ZROBIONE – 82 zadania w bazie)**
   * *Działa, gdy:* Każda z 12 lekcji w Ścieżce posiada 5 grywalnych wariantów (60 zadań), Diagnoza ma 10 zadań, a katalog Rekrutacji oferuje 12 pełnych zadań w stylu DataLemur.
3. **Etap 3: Instalowalna aplikacja mobilna PWA (NASTĘPNY KROK)**
   * *Działa, gdy:* Dodamy pliki `manifest.json` oraz `sw.js`, dzięki czemu aplikacja zapisuje w pamięci podręcznej telefonu pliki silnika PGlite (WASM) i czcionki oraz uruchamia się z ikony na ekranie głównym bez dostępu do sieci.
   * *Uwaga:* instalacja na iPhonie wymaga adresu HTTPS (np. GitHub Pages, Netlify lub Cloudflare Pages), bo Live Server (`127.0.0.1`) działa tylko na laptopie. GitHub Pages na darmowym koncie wymaga publicznego repozytorium, więc sprawdź aktualne warunki przed wyborem hostingu.
4. **Etap 4: Chmura Supabase, Konta i Ranking Graczy (PÓŹNIEJ)**
   * *Działa, gdy:* Użytkownik może założyć konto, jego postęp (`state`) synchronizuje się automatycznie w chmurze, a zakładka `Konto & AI` wyświetla prawdziwy ranking XP innych graczy.

---

## 5. Struktura plików (plan podziału)

Obecnie cała aplikacja jest w jednym pliku `index.html` (ok. 2 000 linii: CSS w liniach ok. 10–357, cały JavaScript w jednej funkcji od linii ok. 406). Dzielimy go stopniowo, **jeden commit na krok**, i po każdym kroku aplikacja musi działać dokładnie tak samo.

```
Centrum_nauki_sql/
  index.html             szkielet strony
  css/style.css          style (z bloku <style>)
  js/data-tasks.js       lekcje, diagnoza, zadania rekrutacyjne (sekcje 3–5 w kodzie)
  js/data-dvdrental.js   schemat i dane bazy dvdrental (sekcja 1)
  js/app.js              silnik PGlite, stan, edytor, widoki, zdarzenia (sekcje 2 i 6–9)
  manifest.json, sw.js   PWA (etap 3)
  docs/ARCHITEKTURA.md   ten plik
  stan_projektu.md       bieżący status i checklista
  GEMINI.md              zasady pracy agenta w VS Code
```

**Kolejność podziału:** (1) CSS, (2) dane zadań, (3) dane dvdrental. Logikę (`app.js`) zostawiamy w jednym pliku, dopóki nie ma powodu jej dzielić. Dane udostępniamy jako zmienne globalne (np. `window.TASKS`), żeby nie przepisywać całej logiki na importy. Po podziale otwieraj aplikację zawsze przez Live Server, a nie dwuklikiem w plik.

## 6. Dziennik decyzji

| Decyzja | Wybór | Powód |
| :--- | :--- | :--- |
| Silnik SQL | PGlite zamiast sql.js | Uczysz się PostgreSQL, a SQLite zachowuje się inaczej (daty, `INTERVAL`, `::numeric`, `generate_series`). |
| Sposób pracy | Agent w VS Code edytuje pliki, Gem 3 planuje i recenzuje | Wklejanie 2 000 linii z czatu grozi ucięciem kodu i cichymi zmianami. |
| Kod | Tylko w repozytorium Git | Jedno źródło prawdy, historia zmian i możliwość cofnięcia. |
