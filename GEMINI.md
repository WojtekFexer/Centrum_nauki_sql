# Zasady pracy agenta: Centrum nauki SQL

Przed każdą zmianą przeczytaj `stan_projektu.md` i `docs/ARCHITEKTURA.md`.

## O projekcie
Mobilna aplikacja do nauki SQL (PostgreSQL) na bazie dvdrental, działająca w przeglądarce dzięki silnikowi PGlite. Główne urządzenie użytkownika to iPhone (Safari), a kod powstaje na laptopie z Windows. Autor jest początkujący w programowaniu, więc tłumacz prosto i krótko.

## Zasady
1. Jeden krok to jedna zmiana. Nie rób dodatkowych „ulepszeń".
2. Przed zmianą napisz plan w 2–4 punktach: co zmieniasz, w których plikach i jak to sprawdzić. Poczekaj na moje „OK".
3. Nie przepisuj całych plików i nie formatuj całego pliku. Edytuj tylko potrzebne fragmenty.
4. Nie usuwaj działających funkcji. Nie zmieniaj nazw kluczy zapisywanych w `localStorage` (w tym `STORAGE_KEY` i pól obiektu `state`), żeby nie zgubić postępów użytkownika.
5. Nie wpisuj kluczy API ani haseł do kodu. Klucz Gemini użytkownik wpisuje w ustawieniach aplikacji.
6. Silnik SQL to PGlite (prawdziwy PostgreSQL). Nie wracaj do SQLite/sql.js ani do regexowych „transpilerów" składni.
7. Zachowaj ergonomię na telefonie: dwuwarstwowy edytor SQL (`<pre>` pod przezroczystym `<textarea>`), wyłączoną autokorektę iOS oraz układ Lista ↔ Tryb zadania.
8. Nie dodawaj bibliotek ani narzędzi (npm, Vite, frameworki) bez mojej zgody.
9. Nie edytuj `docs/ARCHITEKTURA.md` ani `stan_projektu.md`, chyba że o to poproszę.
10. Pisz po polsku. Komentarze w kodzie krótkie, po polsku.

## Po każdej zmianie napisz
- co zmieniłeś (3 zdania),
- jak to przetestować w przeglądarce (F12 → Console),
- co mogło się zepsuć.

## Koniec sesji
Gdy napiszę „koniec sesji", podaj stan projektu w 5 punktach (co działa, co zmieniliśmy, co dalej) do wklejenia w sekcję „Ostatnia sesja" w `stan_projektu.md`.
