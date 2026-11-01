# Stan projektu: Centrum nauki SQL (SQL Master)

> Dołączaj ten plik na starcie każdej nowej rozmowy z Gemem 3. Czyta go też agent w VS Code. Aktualizuj go po każdej sesji. Odhaczaj `[x]` dopiero po własnym teście w przeglądarce.

**Ostatnia aktualizacja:** 31.10.2026

## Pliki
- `index.html`: cała aplikacja (ok. 2 000 linii: CSS, HTML i JS w jednym pliku)
- `docs/ARCHITEKTURA.md`: wizja i plan techniczny
- `stan_projektu.md`: ten plik
- `GEMINI.md`: zasady pracy agenta w VS Code

## Decyzje
- **Silnik SQL (PODJĘTA):** `@electric-sql/pglite` (PostgreSQL 16 w WebAssembly, ładowany z CDN jsdelivr). Usunięto sql.js (SQLite) oraz wadliwe wyrażenia regularne `validatePgStrict` i `pgToSqlite`. Zapytania wykonuje prawdziwy PostgreSQL, a numer linii błędu pochodzi z parsera (`err.position`).
- **Struktura (PROPOZYCJA, do zatwierdzenia):** podział stopniowy: CSS, potem dane zadań, potem dane dvdrental. Logika zostaje w jednym pliku. Szczegóły w `docs/ARCHITEKTURA.md`, sekcja 5.
- **Zakres:** teraz kroki 1–3 (rdzeń, pula zadań, PWA). Chmura Supabase i ranking po dopracowaniu części SQL.

## Testy (w VS Code + Live Server)
- [x] Uruchamia się w Live Server bez błędów w konsoli (F12)
- [x] SELECT zwraca tabelę wyników
- [x] Wynik jest porównywany z zapytaniem wzorcowym
- [x] Diagnoza z przyciskiem Pomiń (10 przekrojowych zadań)
- [x] Losowanie wariantów zadań (każde zadanie ma 5 wariantów, razem 60 wariantów w Ścieżce)
- [x] TEST 1 (przejrzystość UI): w zakładkach Ścieżka i Rekrutacja przełączanie między listą a Trybem Zadania („← Wróć do listy zadań”) oraz rozwijany pasek „👁 Podejrzyj tabele używane w zadaniu”
- [x] TEST 2 (detektor pułapek DataLemur): wykrywanie pułapki LEFT JOIN (warunek w WHERE zamiast w ON) i aktualizacja licznika trafień w Rejestrze Luk
- [x] TEST 3 (natywny PostgreSQL PGlite): w Bazie dvdrental przycisk „⚡ Wklej test składni PG” zwraca tabelę 5 wierszy
- [x] TEST 4 (tryb offline): wykonywanie zapytań po załadowaniu silnika WASM (pełny offline dopiero po kroku PWA)
- [x] TEST 5 (wieloliniowy SELECT jak w DBeaverze): aplikacja nie wymaga przecinka po SELECT i zwraca uwagę na literówkę „PG13” vs „PG-13”
- [x] TEST 6 (linia błędu z parsera PostgreSQL): brak przecinka między kolumnami (`rating` i `length`) oraz zła nazwa kolumny w `ON f.film_id = fc.fim_id` wskazują właściwą linię

## Plan
- [x] 1 Prototyp rdzenia (interfejs Lista ↔ Edytor, PGlite z bazą dvdrental, Diagnoza 10 pytań, Detektor pułapek)
- [x] 2 Pula 60–100 zadań (82 zadania: 12 lekcji × 5 wariantów, 12 zadań rekrutacyjnych DataLemur, 10 zadań Diagnozy)
- [ ] 3 PWA (`manifest.json`, `sw.js`, cache PGlite WASM, hosting HTTPS)
- [ ] 4 Chmura i ranking (opcjonalnie, później)

## Do zrobienia teraz (po kolei)
- [ ] 0 Sprawdzić ostrzeżenie „1” przy `index.html` (panel Problems: Ctrl+Shift+M)
- [ ] 1 Wydzielić CSS do `css/style.css`
- [ ] 2 Wydzielić dane zadań (lekcje, diagnoza, rekrutacja) do `js/data-tasks.js`
- [ ] 3 Wydzielić dane dvdrental do `js/data-dvdrental.js`
- [ ] 4 PWA: `manifest.json`, `sw.js` i publikacja pod adresem HTTPS
- [ ] 5 Test na iPhonie (instalacja z ekranu głównego, tryb samolotowy)

## Ostatnia sesja (podsumowanie od Gema)
1. **Prawdziwy silnik PostgreSQL 16 (PGlite):** zastąpił sql.js (SQLite). Aplikacja działa na natywnym PostgreSQL w przeglądarce.
2. **Usunięcie błędnego regexa `validatePgStrict`:** powodował fałszywy błąd braku przecinka po słowie SELECT.
3. **Natywne wskazywanie linii błędu (`err.position`):** pozycję znaku z parsera PostgreSQL przelicza `posToLineNumber()` na numer linii w edytorze.
4. **Ochrona przed cichym aliasowaniem kolumny:** `detectAccidentalColumnAlias()` reaguje tylko wtedy, gdy w dwóch kolejnych liniach SELECT są dwie kolumny bez przecinka.
5. **Następny krok:** sprawdzenie pisania wieloliniowych zapytań w VS Code (Testy 3, 5 i 6) i przejście do podziału pliku.
