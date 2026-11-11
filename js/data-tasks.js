/* ==========================================================================
   3. ŚCIEŻKA NAUKI: 8 DZIAŁÓW, 27 POD-LEKCJI (STANDARD v14 SOLOLEARN)
   ========================================================================== */
var STAGES = [
  {
    "id": 1,
    "name": "Dział 1: Fundamenty i pierwsze zapytania (SELECT, FROM, AS, DISTINCT)",
    "desc": "Podstawy składni SQL, pobieranie kolumn, aliasy AS, proste obliczenia oraz unikalne wartości DISTINCT."
  },
  {
    "id": 2,
    "name": "Dział 2: Sortowanie i ograniczanie wyników (ORDER BY, LIMIT, OFFSET)",
    "desc": "Sortowanie rosnące (ASC) i malejące (DESC), sortowanie wielokolumnowe oraz paginacja LIMIT i OFFSET."
  },
  {
    "id": 3,
    "name": "Dział 3: Filtrowanie danych krok po kroku (Klauzula WHERE)",
    "desc": "Operatory porównania, łączenie AND/OR, operatory IN, BETWEEN, przeszukiwanie LIKE/ILIKE oraz IS NULL."
  },
  {
    "id": 4,
    "name": "Dział 4: Agregacja i grupowanie (COUNT, SUM, AVG, GROUP BY, HAVING)",
    "desc": "Funkcje agregujące COUNT, SUM, AVG, MIN, MAX, podział na grupy GROUP BY, filtrowanie HAVING i FILTER."
  },
  {
    "id": 5,
    "name": "Dział 5: Praca z tekstem, liczbami i datami (Funkcje skalarne)",
    "desc": "Funkcje tekstowe (UPPER, LOWER, LENGTH, TRIM, ||), zaokrąglanie ROUND() oraz funkcje dat (EXTRACT, DATE_TRUNC)."
  },
  {
    "id": 6,
    "name": "Dział 6: Logika warunkowa i braki danych (CASE WHEN, COALESCE, NULLIF)",
    "desc": "Instrukcje warunkowe CASE WHEN oraz obsługa wartości brakujących NULL za pomocą COALESCE i NULLIF."
  },
  {
    "id": 7,
    "name": "Dział 7: Łączenie tabel i relacje (INNER JOIN, LEFT JOIN, UNION)",
    "desc": "Relacje bazodanowe, klucze obce, łączenie INNER JOIN, LEFT JOIN, Anti-Join oraz operatory UNION i UNION ALL."
  },
  {
    "id": 8,
    "name": "Dział 8: Podzapytania, CTE (WITH) i Funkcje Okna (Poziom Pro)",
    "desc": "Czytelne bloki CTE (WITH), podzapytania analityczne, klauzula OVER, rankingi (ROW_NUMBER, RANK) oraz LAG i LEAD."
  }
];

var PATH_TASKS = [
// 1.1 Pierwsze zapytanie: SELECT i FROM (Zachowane 8 wariantów)
  {
    "id": "p1_1",
    "stage": 1,
    "unlockAt": 5,
    "title": "1.1 Pierwsze zapytanie: SELECT, FROM i gwiazdka *",
    "tables": ["film", "actor", "category", "customer", "staff", "store"],
    "cols": ["SELECT", "FROM", "*", "title", "rental_rate", "first_name", "last_name", "email", "staff_id", "store_id", "city"],
    "theory": "<ul><li><strong><code>SELECT</code>:</strong> służy do wyciągania kolumn z bazy danych.</li><li><strong><code>FROM</code>:</strong> wskazuje tabelę, z której pobieramy dane.</li><li><strong>Kilka kolumn:</strong> oddzielaj nazwy kolumn przecinkami (np. <code>title, rental_rate</code>).</li><li><strong>Gwiazdka <code>*</code>:</strong> pobiera wszystkie kolumny tabeli na raz.</li></ul><div class=\"theory-code\"><code>SELECT title, rental_rate\nFROM film;</code></div>",
    "variants": [
      {
        "stepCode": "R1", "keySuffix": "r1", "isWarmup": true, "tier": "warmup",
        "goal": "Przygotuj pełną listę samych tytułów wszystkich filmów dostępnych w naszym katalogu.",
        "prompt": "Pobierz z katalogu filmów samą kolumnę z tytułem filmu (wszystkie wiersze, bez filtrowania).",
        "sol": "SELECT title FROM film;", "order": false, "tables": ["film"], "hint": "Wpisz: SELECT title FROM film;",
        "newFeature": { "title": "Klauzule SELECT i FROM", "desc": "SELECT wskazuje kolumny do wyświetlenia, a FROM wskazuje tabelę źródłową.", "example": "SELECT title FROM film;" }
      },
      {
        "stepCode": "R2", "keySuffix": "r2", "isWarmup": true, "tier": "warmup",
        "goal": "Przygotuj listę imion oraz nazwisk wszystkich aktorów występujących w naszej bazie.",
        "prompt": "Pobierz z listy aktorów dwie kolumny: imię oraz nazwisko aktora.",
        "sol": "SELECT first_name, last_name FROM actor;", "order": false, "tables": ["actor"], "hint": "Oddziel kolumny przecinkiem: SELECT first_name, last_name FROM actor;",
        "newFeature": { "title": "Wybór wielu kolumn (przecinek)", "desc": "Aby pobrać kilka kolumn, oddziel ich nazwy przecinkami po słowie SELECT.", "example": "SELECT first_name, last_name FROM actor;" }
      },
      {
        "stepCode": "1", "keySuffix": "0", "isWarmup": false, "tier": "basic",
        "goal": "Wyświetl całą tabelę kategorii filmowych (wszystkie kolumny naraz).",
        "prompt": "Pobierz ze słownika kategorii filmowych wszystkie dostępne kolumny za pomocą symbolu gwiazdki (`*`).",
        "sol": "SELECT * FROM category;", "order": false, "tables": ["category"], "hint": "Użyj gwiazdki: SELECT * FROM category;",
        "newFeature": { "title": "Gwiazdka * (wszystkie kolumny)", "desc": "Zamiast wpisywać każdą kolumnę, wpisz *, aby wyświetlić całą zawartość tabeli.", "example": "SELECT * FROM category;" }
      },
      {
        "stepCode": "2", "keySuffix": "1", "isWarmup": false, "tier": "basic",
        "goal": "Przygotuj prosty cennik wypożyczeń z katalogu filmów.",
        "prompt": "Pobierz z tabeli `film` tytuły (`title`) oraz ceny wypożyczenia (`rental_rate`) wszystkich filmów.",
        "sol": "SELECT title, rental_rate FROM film;", "order": false, "tables": ["film"], "hint": "Wpisz po SELECT: title, rental_rate", "newFeature": null
      },
      {
        "stepCode": "3", "keySuffix": "2", "isWarmup": false, "tier": "basic",
        "goal": "Zbierz dane kontaktowe wszystkich klientów wypożyczalni.",
        "prompt": "Pobierz z bazy klientów (`customer`) imiona (`first_name`), nazwiska (`last_name`) oraz adresy e-mail (`email`).",
        "sol": "SELECT first_name, last_name, email FROM customer;", "order": false, "tables": ["customer"], "hint": "Wybierz: first_name, last_name, email", "newFeature": null
      },
      {
        "stepCode": "4", "keySuffix": "3", "isWarmup": false, "tier": "adv",
        "goal": "Pobierz z listy personelu identyfikatory pracowników, imiona, nazwiska oraz identyfikatory sklepów.",
        "prompt": "Pobierz z listy personelu identyfikatory pracowników, imiona, nazwiska oraz identyfikatory przypisanych sklepów (staff_id, first_name, last_name, store_id).",
        "sol": "SELECT staff_id, first_name, last_name, store_id FROM staff;", "order": false, "tables": ["staff"], "hint": "Wybierz 4 kolumny z tabeli staff: SELECT staff_id, first_name, last_name, store_id FROM staff;", "newFeature": null
      },
      {
        "stepCode": "5", "keySuffix": "4", "isWarmup": false, "tier": "adv",
        "goal": "Pobierz z rejestru oddziałów identyfikatory sklepów oraz miasta.",
        "prompt": "Pobierz z rejestru oddziałów identyfikatory sklepów oraz miasta, w których się znajdują (store_id, city).",
        "sol": "SELECT store_id, city FROM store;", "order": false, "tables": ["store"], "hint": "Wybierz store_id oraz city z tabeli store: SELECT store_id, city FROM store;", "newFeature": null
      },
      {
        "stepCode": "6", "keySuffix": "5", "isWarmup": false, "tier": "adv",
        "goal": "Przygotuj zestawienie podstawowych informacji o każdym filmie w katalogu.",
        "prompt": "Pobierz z katalogu filmów (`film`) identyfikator filmu, tytuł, rok wydania oraz kategorię wiekową (`film_id, title, release_year, rating`).",
        "sol": "SELECT film_id, title, release_year, rating FROM film;", "order": false, "tables": ["film"], "hint": "Wybierz 4 kolumny z tabeli film: film_id, title, release_year, rating", "newFeature": null
      }
    ]
  },

  // 1.2 Zmiana nazw kolumn (AS) i proste obliczenia w SELECT (Zachowane 8 wariantów)
  {
    "id": "p1_2",
    "stage": 1,
    "unlockAt": 5,
    "title": "1.2 Nadawanie aliasów (AS) i proste obliczenia",
    "tables": ["film", "staff", "store", "payment", "customer"],
    "cols": ["SELECT", "FROM", "AS", "*", "+", "-", "/", "title", "length", "rental_rate", "amount", "first_name", "last_name", "store_id", "city"],
    "theory": "<ul><li><strong>Aliasy kolumn (<code>AS</code>):</strong> pozwalają nadać kolumnie nową nazwę w nagłówku tabeli wynikowej.</li><li><strong>Działania arytmetyczne:</strong> możesz bezpośrednio wykonywać operacje <code>+</code>, <code>-</code>, <code>*</code>, <code>/</code> na kolumnach liczbowych.</li></ul><div class=\"theory-code\"><code>SELECT title, length AS duration_min, rental_rate * 4 AS cena_pln\nFROM film;</code></div>",
    "variants": [
      {
        "stepCode": "R1", "keySuffix": "r1", "isWarmup": true, "tier": "warmup",
        "goal": "Wyświetl tytuł filmu oraz czas trwania pod nową, czytelną nazwą w nagłówku.",
        "prompt": "Pobierz z katalogu filmów tytuł oraz czas trwania, nadając kolumnie length nowy nagłówek duration_min za pomocą AS.",
        "sol": "SELECT title, length AS duration_min FROM film;", "order": false, "tables": ["film"], "hint": "Użyj AS: length AS duration_min",
        "newFeature": { "title": "Słowo kluczowe AS (aliasy)", "desc": "AS pozwala nadać kolumnie lub obliczeniu własny, czytelny nagłówek w wyniku zapytania.", "example": "SELECT cena * 100 AS grosze FROM produkty;" }
      },
      {
        "stepCode": "R2", "keySuffix": "r2", "isWarmup": true, "tier": "warmup",
        "goal": "Przygotuj listę pracowników z polskimi nagłówkami kolumn imienia i nazwiska.",
        "prompt": "Pobierz identyfikator pracownika, imię pod aliasem imie oraz nazwisko pod aliasem nazwisko z tabeli personelu.",
        "sol": "SELECT staff_id, first_name AS imie, last_name AS nazwisko FROM staff;", "order": false, "tables": ["staff"], "hint": "Zastosuj dwa aliasy: first_name AS imie, last_name AS nazwisko", "newFeature": null
      },
      {
        "stepCode": "1", "keySuffix": "0", "isWarmup": false, "tier": "basic",
        "goal": "Pobierz z rejestru oddziałów store_id oraz miasto pod aliasem miasto.",
        "prompt": "Pobierz z rejestru oddziałów identyfikator sklepu store_id oraz miasto pod czytelnym aliasem miasto (city AS miasto).",
        "sol": "SELECT store_id, city AS miasto FROM store;", "order": false, "tables": ["store"], "hint": "Wpisz: SELECT store_id, city AS miasto FROM store;", "newFeature": null
      },
      {
        "stepCode": "2", "keySuffix": "1", "isWarmup": false, "tier": "basic",
        "goal": "Przelicz kwoty płatności z euro na centy dla systemu księgowego.",
        "prompt": "Kwoty w kolumnie amount są wyrażone w euro (np. 4.99). Pobierz identyfikator płatności payment_id, kwotę oryginalną amount oraz kwotę przeliczoną na centy (amount * 100) pod aliasem amount_cents.",
        "sol": "SELECT payment_id, amount, amount * 100 AS amount_cents FROM payment;", "order": false, "tables": ["payment"], "hint": "Pomnóż kwotę przez 100: amount * 100 AS amount_cents",
        "newFeature": { "title": "Obliczenia arytmetyczne (+, -, *, /)", "desc": "W SELECT możesz wykonywać działania bezpośrednio na kolumnach liczbowych i nadać im czytelną nazwę przez AS.", "example": "SELECT cena * 100 AS grosze FROM produkty;" }
      },
      {
        "stepCode": "3", "keySuffix": "2", "isWarmup": false, "tier": "basic",
        "goal": "Sprawdź, jak zmienią się stawki filmów po doliczeniu stałej opłaty serwisowej.",
        "prompt": "Pobierz z katalogu filmów tytuł, cenę wypożyczenia oraz nową stawkę powiększoną o opłatę 2 pod aliasem new_rate.",
        "sol": "SELECT title, rental_rate, rental_rate + 2 AS new_rate FROM film;", "order": false, "tables": ["film"], "hint": "Dodaj 2: rental_rate + 2 AS new_rate", "newFeature": null
      },
      {
        "stepCode": "4", "keySuffix": "3", "isWarmup": false, "tier": "adv",
        "goal": "Przelicz czas trwania każdego filmu z minut na godziny.",
        "prompt": "Pobierz tytuł, długość filmu w minutach oraz długość w godzinach (length podzielone przez 60.0) pod aliasem duration_hours.",
        "sol": "SELECT title, length, length / 60.0 AS duration_hours FROM film;", "order": false, "tables": ["film"], "hint": "Podziel przez 60.0: length / 60.0 AS duration_hours", "newFeature": null
      },
      {
        "stepCode": "5", "keySuffix": "4", "isWarmup": false, "tier": "adv",
        "goal": "Oblicz różnicę między kosztem zakupu płyty a ceną pojedynczego wypożyczenia.",
        "prompt": "Pobierz tytuł, koszt odtworzenia, cenę wypożyczenia oraz różnicę kosztu i ceny pod aliasem cost_diff.",
        "sol": "SELECT title, replacement_cost, rental_rate, replacement_cost - rental_rate AS cost_diff FROM film;", "order": false, "tables": ["film"], "hint": "Odejmij cenę od kosztu: replacement_cost - rental_rate AS cost_diff", "newFeature": null
      },
      {
        "stepCode": "6", "keySuffix": "5", "isWarmup": false, "tier": "adv",
        "goal": "Przelicz wszystkie wpłaty klientów na złotówki po stałym kursie.",
        "prompt": "Pobierz identyfikator klienta customer_id, datę płatności payment_date, kwotę amount oraz kwotę przeliczoną na złotówki (amount * 4) pod aliasem amount_pln.",
        "sol": "SELECT customer_id, payment_date, amount, amount * 4 AS amount_pln FROM payment;", "order": false, "tables": ["payment"], "hint": "Pomnóż kwotę przez 4: amount * 4 AS amount_pln", "newFeature": null
      }
    ]
  },

  // 1.3 Unikalne wartości: SELECT DISTINCT (5 zadań)
  {
    "id": "p1_3",
    "stage": 1,
    "unlockAt": 3,
    "title": "1.3 Unikalne wartości: SELECT DISTINCT",
    "tables": ["film", "customer", "rental"],
    "cols": ["SELECT", "DISTINCT", "FROM", "rating", "rental_rate", "release_year", "store_id", "staff_id"],
    "theory": "<ul><li><strong><code>DISTINCT</code>:</strong> usuwa zduplikowane wiersze z wyniku zapytania.</li><li>Wpisuj słowo <code>DISTINCT</code> bezpośrednio po <code>SELECT</code>.</li></ul><div class=\"theory-code\"><code>SELECT DISTINCT rating\nFROM film;</code></div>",
    "variants": [
      {
        "stepCode": "R1", "keySuffix": "r1", "isWarmup": true, "tier": "warmup",
        "goal": "Wyświetl unikalne kategorie wiekowe (rating) filmów z katalogu.",
        "prompt": "Pobierz z katalogu filmów unikalne kategorie wiekowe (rating), eliminując duplikaty za pomocą SELECT DISTINCT.",
        "sol": "SELECT DISTINCT rating FROM film;", "order": false, "tables": ["film"], "hint": "Wpisz: SELECT DISTINCT rating FROM film;",
        "newFeature": { "title": "Unikalne wiersze: SELECT DISTINCT", "desc": "Słowo DISTINCT usuwa powtarzające się wiersze z wyniku zapytania.", "example": "SELECT DISTINCT kategoria FROM produkty;" }
      },
      {
        "stepCode": "1", "keySuffix": "0", "isWarmup": false, "tier": "basic",
        "goal": "Pobierz unikalne stawki wypożyczenia filmów.",
        "prompt": "Pobierz z katalogu filmów listę unikalnych cen wypożyczenia (rental_rate).",
        "sol": "SELECT DISTINCT rental_rate FROM film;", "order": false, "tables": ["film"], "hint": "Wpisz: SELECT DISTINCT rental_rate FROM film;", "newFeature": null
      },
      {
        "stepCode": "2", "keySuffix": "1", "isWarmup": false, "tier": "basic",
        "goal": "Sprawdź, z których lat pochodzą filmy w bazie.",
        "prompt": "Pobierz z katalogu filmów unikalne lata produkcji (release_year).",
        "sol": "SELECT DISTINCT release_year FROM film;", "order": false, "tables": ["film"], "hint": "Użyj SELECT DISTINCT na kolumnie release_year", "newFeature": null
      },
      {
        "stepCode": "3", "keySuffix": "2", "isWarmup": false, "tier": "adv",
        "goal": "Pobierz identyfikatory sklepów, w których rejestrowali się nasi klienci.",
        "prompt": "Pobierz z bazy klientów unikalne identyfikatory sklepów (store_id).",
        "sol": "SELECT DISTINCT store_id FROM customer;", "order": false, "tables": ["customer"], "hint": "SELECT DISTINCT store_id FROM customer;", "newFeature": null
      },
      {
        "stepCode": "4", "keySuffix": "3", "isWarmup": false, "tier": "adv",
        "goal": "Sprawdź, którzy pracownicy obsługiwali wypożyczenia.",
        "prompt": "Pobierz z rejestru wypożyczeń unikalne identyfikatory pracowników (staff_id).",
        "sol": "SELECT DISTINCT staff_id FROM rental;", "order": false, "tables": ["rental"], "hint": "SELECT DISTINCT staff_id FROM rental;", "newFeature": null
      }
    ]
  },

  // 2.1 Sortowanie rosnące (ASC) i malejące (DESC) (5 zadań)
  {
    "id": "p1_4",
    "stage": 2,
    "unlockAt": 3,
    "title": "2.1 Sortowanie rosnące (ASC) i malejące (DESC)",
    "tables": ["film", "actor", "rental", "payment"],
    "cols": ["SELECT", "FROM", "ORDER BY", "ASC", "DESC", "title", "rental_rate", "length", "first_name", "last_name", "rental_id", "rental_date", "payment_id", "amount"],
    "theory": "<ul><li><strong><code>ORDER BY</code>:</strong> sortuje wiersze w wyniku zapytania.</li><li><strong><code>ASC</code>:</strong> sortowanie rosnąco (od A do Z, od najmniejszej do największej liczby). Domyślne w SQL.</li><li><strong><code>DESC</code>:</strong> sortowanie malejąco (od Z do A, od największej do najmniejszej liczby).</li></ul><div class=\"theory-code\"><code>SELECT title, length\nFROM film\nORDER BY length DESC;</code></div>",
    "variants": [
      {
        "stepCode": "R1", "keySuffix": "r1", "isWarmup": true, "tier": "warmup",
        "goal": "Posortuj filmy rosnąco według stawki wypożyczenia.",
        "prompt": "Pobierz tytuły oraz stawki wypożyczenia (title, rental_rate) filmów, sortując wynik rosnąco po rental_rate za pomocą ORDER BY ... ASC.",
        "sol": "SELECT title, rental_rate FROM film ORDER BY rental_rate ASC;", "order": true, "tables": ["film"], "hint": "ORDER BY rental_rate ASC;",
        "newFeature": { "title": "Sortowanie rosnące: ORDER BY ... ASC", "desc": "ORDER BY układa wiersze w kolejności rosnącej (ASC) lub malejącej (DESC).", "example": "SELECT nazwa, cena FROM produkty ORDER BY cena ASC;" }
      },
      {
        "stepCode": "1", "keySuffix": "0", "isWarmup": false, "tier": "basic",
        "goal": "Posortuj filmy malejąco według czasu trwania (od najdłuższego).",
        "prompt": "Pobierz tytuły oraz długości filmów (title, length), sortując wynik malejąco według kolumny length.",
        "sol": "SELECT title, length FROM film ORDER BY length DESC;", "order": true, "tables": ["film"], "hint": "ORDER BY length DESC;", "newFeature": null
      },
      {
        "stepCode": "2", "keySuffix": "1", "isWarmup": false, "tier": "basic",
        "goal": "Ułóż listę aktorów w porządku alfabetycznym według nazwiska.",
        "prompt": "Pobierz imię oraz nazwisko każdego aktora (first_name, last_name), sortując rosnąco po nazwisku (last_name ASC).",
        "sol": "SELECT first_name, last_name FROM actor ORDER BY last_name ASC;", "order": true, "tables": ["actor"], "hint": "ORDER BY last_name ASC;", "newFeature": null
      },
      {
        "stepCode": "3", "keySuffix": "2", "isWarmup": false, "tier": "adv",
        "goal": "Uporządkuj wypożyczenia od najnowszych do najstarszych.",
        "prompt": "Pobierz identyfikator wypożyczenia oraz datę (rental_id, rental_date), sortując wynik malejąco po dacie wypożyczenia.",
        "sol": "SELECT rental_id, rental_date FROM rental ORDER BY rental_date DESC;", "order": true, "tables": ["rental"], "hint": "ORDER BY rental_date DESC;", "newFeature": null
      },
      {
        "stepCode": "4", "keySuffix": "3", "isWarmup": false, "tier": "adv",
        "goal": "Posortuj wpłaty od najmniejszej do największej kwoty.",
        "prompt": "Pobierz payment_id oraz amount z tabeli payment, sortując wynik rosnąco po kwocie wpłaty (amount ASC).",
        "sol": "SELECT payment_id, amount FROM payment ORDER BY amount ASC;", "order": true, "tables": ["payment"], "hint": "ORDER BY amount ASC;", "newFeature": null
      }
    ]
  },

  // 2.2 Sortowanie po wielu kolumnach oraz LIMIT i OFFSET (5 zadań)
  {
    "id": "p2_0",
    "stage": 2,
    "unlockAt": 3,
    "title": "2.2 Sortowanie po wielu kolumnach oraz LIMIT i OFFSET",
    "tables": ["film", "customer", "payment"],
    "cols": ["SELECT", "FROM", "ORDER BY", "LIMIT", "OFFSET", "title", "rental_rate", "length", "first_name", "last_name", "payment_id", "amount", "payment_date"],
    "theory": "<ul><li><strong>Sortowanie po kilku kolumnach:</strong> oddzielaj kolumny przecinkiem: <code>ORDER BY k1 DESC, k2 ASC</code>.</li><li><strong><code>LIMIT N</code>:</strong> zwraca tylko pierwszych N wierszy.</li><li><strong><code>OFFSET M</code>:</strong> pomija pierwszych M wierszy (podstawa stronicowania wyników).</li></ul><div class=\"theory-code\"><code>SELECT title, rental_rate\nFROM film\nORDER BY rental_rate DESC\nLIMIT 5 OFFSET 10;</code></div>",
    "variants": [
      {
        "stepCode": "R1", "keySuffix": "r1", "isWarmup": true, "tier": "warmup",
        "goal": "Posortuj filmy najpierw malejąco po stawce, a filmy o tej samej stawce rosnąco po długości.",
        "prompt": "Pobierz title, rental_rate oraz length z filmów, sortując po dwóch kolumnach: rental_rate DESC, length ASC.",
        "sol": "SELECT title, rental_rate, length FROM film ORDER BY rental_rate DESC, length ASC;", "order": true, "tables": ["film"], "hint": "ORDER BY rental_rate DESC, length ASC;",
        "newFeature": { "title": "Sortowanie wielokolumnowe", "desc": "Możesz sortować po wielu kryteriach, oddzielając je przecinkami: ORDER BY k1 DESC, k2 ASC.", "example": "SELECT * FROM produkty ORDER BY kategoria ASC, cena DESC;" }
      },
      {
        "stepCode": "1", "keySuffix": "0", "isWarmup": false, "tier": "basic",
        "goal": "Znajdź 5 najdroższych filmów w ofercie za pomocą LIMIT.",
        "prompt": "Pobierz tytuł oraz stawkę wypożyczenia (title, rental_rate) 5 najdroższych filmów, sortując malejąco po rental_rate i ograniczając wynik do 5 wierszy.",
        "sol": "SELECT title, rental_rate FROM film ORDER BY rental_rate DESC LIMIT 5;", "order": true, "tables": ["film"], "hint": "ORDER BY rental_rate DESC LIMIT 5;", "newFeature": null
      },
      {
        "stepCode": "2", "keySuffix": "1", "isWarmup": false, "tier": "basic",
        "goal": "Pobierz pierwszych 10 klientów alfabetycznie według nazwiska i imienia.",
        "prompt": "Pobierz first_name oraz last_name klientów, posortuj alfabetycznie (last_name ASC, first_name ASC) i zwróć pierwsze 10 wierszy.",
        "sol": "SELECT first_name, last_name FROM customer ORDER BY last_name ASC, first_name ASC LIMIT 10;", "order": true, "tables": ["customer"], "hint": "ORDER BY last_name ASC, first_name ASC LIMIT 10;", "newFeature": null
      },
      {
        "stepCode": "3", "keySuffix": "2", "isWarmup": false, "tier": "adv",
        "goal": "Zastosuj paginację (OFFSET) — pobierz drugą piątkę najdłuższych filmów (miejsca 6–10).",
        "prompt": "Pobierz title oraz length filmów, posortuj malejąco po length, pomiń pierwsze 5 wierszy (OFFSET 5) i zwróć kolejne 5 filmów (LIMIT 5).",
        "sol": "SELECT title, length FROM film ORDER BY length DESC LIMIT 5 OFFSET 5;", "order": true, "tables": ["film"], "hint": "ORDER BY length DESC LIMIT 5 OFFSET 5;", "newFeature": null
      },
      {
        "stepCode": "4", "keySuffix": "3", "isWarmup": false, "tier": "adv",
        "goal": "Pobierz trzecią stronę raportu płatności (5 rekordów z pominięciem 10 pierwszych).",
        "prompt": "Pobierz payment_id, amount oraz payment_date z payment, posortuj malejąco po payment_date i amount, a następnie pobierz 5 rekordów z pominięciem 10 pierwszych.",
        "sol": "SELECT payment_id, amount, payment_date FROM payment ORDER BY payment_date DESC, amount DESC LIMIT 5 OFFSET 10;", "order": true, "tables": ["payment"], "hint": "ORDER BY payment_date DESC, amount DESC LIMIT 5 OFFSET 10;", "newFeature": null
      }
    ]
  },

  // 3.1 Filtrowanie liczb i tekstu (=, <>, >, <, >=, <=) (5 zadań)
  {
    "id": "p2_1",
    "stage": 3,
    "unlockAt": 3,
    "title": "3.1 Filtrowanie liczb i tekstu (=, <>, >, <, >=, <=)",
    "tables": ["film", "customer"],
    "cols": ["SELECT", "FROM", "WHERE", "=", "<>", ">", "<", ">=", "<=", "title", "rating", "rental_rate", "length", "first_name", "last_name", "active"],
    "theory": "<ul><li><strong><code>WHERE</code>:</strong> odfiltrowuje wiersze przed zwróceniem wyniku.</li><li>Tekst zapisuj zawsze w pojedynczych apostrofach: <code>WHERE rating = 'PG-13'</code>.</li><li>Operatory: <code>=</code> (równe), <code>&lt;&gt;</code> lub <code>!=</code> (różne), <code>&gt;</code>, <code>&lt;</code>, <code>&gt;=</code>, <code>&lt;=</code>.</li></ul><div class=\"theory-code\"><code>SELECT title, rental_rate\nFROM film\nWHERE rental_rate &gt; 3.00;</code></div>",
    "variants": [
      {
        "stepCode": "R1", "keySuffix": "r1", "isWarmup": true, "tier": "warmup",
        "goal": "Wybierz tylko te filmy, które posiadają kategorię wiekową PG-13.",
        "prompt": "Pobierz tytuły oraz kategorię (title, rating) filmów, dla których rating wynosi dokładnie 'PG-13'.",
        "sol": "SELECT title, rating FROM film WHERE rating = 'PG-13';", "order": false, "tables": ["film"], "hint": "WHERE rating = 'PG-13';",
        "newFeature": { "title": "Klauzula WHERE i porównanie tekstu =", "desc": "WHERE filtruje wiersze. Wartości tekstowe w SQL zawsze ujmujemy w pojedyncze apostrofy 'tekst'.", "example": "SELECT * FROM produkty WHERE status = 'dostepny';" }
      },
      {
        "stepCode": "1", "keySuffix": "0", "isWarmup": false, "tier": "basic",
        "goal": "Wyświetl filmy droższe niż 3.00.",
        "prompt": "Pobierz tytuły oraz stawki wypożyczenia (title, rental_rate) filmów o stawce ściśle większej niż 3.00.",
        "sol": "SELECT title, rental_rate FROM film WHERE rental_rate > 3.00;", "order": false, "tables": ["film"], "hint": "WHERE rental_rate > 3.00;", "newFeature": null
      },
      {
        "stepCode": "2", "keySuffix": "1", "isWarmup": false, "tier": "basic",
        "goal": "Znajdź filmy trwające co najmniej 120 minut (2 godziny lub dłużej).",
        "prompt": "Pobierz tytuły oraz czas trwania (title, length) filmów, których długość wynosi 120 minut lub więcej.",
        "sol": "SELECT title, length FROM film WHERE length >= 120;", "order": false, "tables": ["film"], "hint": "WHERE length >= 120;", "newFeature": null
      },
      {
        "stepCode": "3", "keySuffix": "2", "isWarmup": false, "tier": "adv",
        "goal": "Wyszukaj tylko aktywnych klientów.",
        "prompt": "Pobierz imię i nazwisko (first_name, last_name) klientów z tabeli customer, dla których pole active ma wartość 1.",
        "sol": "SELECT first_name, last_name FROM customer WHERE active = 1;", "order": false, "tables": ["customer"], "hint": "WHERE active = 1;", "newFeature": null
      },
      {
        "stepCode": "4", "keySuffix": "3", "isWarmup": false, "tier": "adv",
        "goal": "Wybierz filmy z inną kategorią wiekową niż R.",
        "prompt": "Pobierz tytuł oraz kategorię wiekową (title, rating) filmów, których rating jest różny od 'R' (użyj operatora <>).",
        "sol": "SELECT title, rating FROM film WHERE rating <> 'R';", "order": false, "tables": ["film"], "hint": "WHERE rating <> 'R';", "newFeature": null
      }
    ]
  },

  // 3.2 Łączenie warunków: AND, OR oraz nawiasy () (6 zadań)
  {
    "id": "p2_2",
    "stage": 3,
    "unlockAt": 4,
    "title": "3.2 Łączenie warunków: AND, OR oraz nawiasy ()",
    "tables": ["film", "customer"],
    "cols": ["SELECT", "FROM", "WHERE", "AND", "OR", "(", ")", "title", "rating", "rental_rate", "length", "replacement_cost", "first_name", "last_name", "store_id", "active"],
    "theory": "<ul><li><strong><code>AND</code>:</strong> oba warunki muszą być spełnione jednocześnie.</li><li><strong><code>OR</code>:</strong> wystarczy, że co najmniej jeden warunek jest spełniony.</li><li><strong>Nawiasy <code>( )</code>:</strong> wymuszają kolejność logiczną — <code>AND</code> ma wyższy priorytet niż <code>OR</code>!</li></ul><div class=\"theory-code\"><code>SELECT title, rating, rental_rate\nFROM film\nWHERE (rating = 'PG' OR rating = 'G') AND rental_rate &lt; 2.00;</code></div>",
    "variants": [
      {
        "stepCode": "R1", "keySuffix": "r1", "isWarmup": true, "tier": "warmup",
        "goal": "Wybierz tanie filmy familijne (kategoria PG i cena poniżej 3.00).",
        "prompt": "Pobierz title, rating oraz rental_rate filmów, które mają rating 'PG' ORAZ rental_rate < 3.00.",
        "sol": "SELECT title, rating, rental_rate FROM film WHERE rating = 'PG' AND rental_rate < 3.00;", "order": false, "tables": ["film"], "hint": "WHERE rating = 'PG' AND rental_rate < 3.00;",
        "newFeature": { "title": "Łączenie warunków przez AND", "desc": "Operator AND wymaga, aby oba warunki były prawdziwe jednocześnie.", "example": "SELECT * FROM produkty WHERE stan > 0 AND cena < 50;" }
      },
      {
        "stepCode": "R2", "keySuffix": "r2", "isWarmup": true, "tier": "warmup",
        "goal": "Wybierz filmy dla dzieci (kategoria G LUB PG).",
        "prompt": "Pobierz title oraz rating filmów o kategorii 'G' LUB 'PG'.",
        "sol": "SELECT title, rating FROM film WHERE rating = 'G' OR rating = 'PG';", "order": false, "tables": ["film"], "hint": "WHERE rating = 'G' OR rating = 'PG';",
        "newFeature": { "title": "Alternatywa warunków przez OR", "desc": "Operator OR zwraca wiersz, gdy przynajmniej jeden z warunków jest prawdziwy.", "example": "SELECT * FROM klienci WHERE miasto = 'Warszawa' OR miasto = 'Krakow';" }
      },
      {
        "stepCode": "1", "keySuffix": "0", "isWarmup": false, "tier": "basic",
        "goal": "Wyszukaj długie filmy dla dorosłych (kategoria R i czas trwania powyżej 100 minut).",
        "prompt": "Pobierz title, rating oraz length filmów, które mają kategorię 'R' oraz trwają dłużej niż 100 minut (length > 100).",
        "sol": "SELECT title, rating, length FROM film WHERE rating = 'R' AND length > 100;", "order": false, "tables": ["film"], "hint": "WHERE rating = 'R' AND length > 100;", "newFeature": null
      },
      {
        "stepCode": "2", "keySuffix": "1", "isWarmup": false, "tier": "basic",
        "goal": "Wybierz aktywnych klientów z oddziału numer 1.",
        "prompt": "Pobierz first_name, last_name oraz store_id klientów ze sklepu store_id = 1, którzy są aktywni (active = 1).",
        "sol": "SELECT first_name, last_name, store_id FROM customer WHERE store_id = 1 AND active = 1;", "order": false, "tables": ["customer"], "hint": "WHERE store_id = 1 AND active = 1;", "newFeature": null
      },
      {
        "stepCode": "3", "keySuffix": "2", "isWarmup": false, "tier": "adv",
        "goal": "Zastosuj nawiasy — tanie filmy familijne (G lub PG) w cenie poniżej 2.00.",
        "prompt": "Pobierz title, rating oraz rental_rate dla filmów o ratingu 'PG' lub 'G', których rental_rate jest mniejszy niż 2.00. Użyj nawiasów!",
        "sol": "SELECT title, rating, rental_rate FROM film WHERE (rating = 'PG' OR rating = 'G') AND rental_rate < 2.00;", "order": false, "tables": ["film"], "hint": "WHERE (rating = 'PG' OR rating = 'G') AND rental_rate < 2.00;", "newFeature": null
      },
      {
        "stepCode": "4", "keySuffix": "3", "isWarmup": false, "tier": "adv",
        "goal": "Wyszukaj filmy o skrajnych długościach (poniżej godziny lub powyżej 2.5h) z kosztem odtworzenia poniżej 20.",
        "prompt": "Pobierz title, length oraz replacement_cost filmów o długości poniżej 60 minut LUB powyżej 150 minut, których replacement_cost jest mniejszy niż 20.00.",
        "sol": "SELECT title, length, replacement_cost FROM film WHERE (length < 60 OR length > 150) AND replacement_cost < 20.00;", "order": false, "tables": ["film"], "hint": "WHERE (length < 60 OR length > 150) AND replacement_cost < 20.00;", "newFeature": null
      }
    ]
  },

  // 3.3 Wybór z listy: IN (...) oraz wykluczanie NOT IN (5 zadań)
  {
    "id": "p2_3",
    "stage": 3,
    "unlockAt": 3,
    "title": "3.3 Wybór z listy: IN (...) oraz wykluczanie NOT IN",
    "tables": ["film", "actor", "customer"],
    "cols": ["SELECT", "FROM", "WHERE", "IN", "NOT IN", "(", ")", "title", "rating", "rental_rate", "first_name", "last_name", "customer_id"],
    "theory": "<ul><li><strong><code>IN (w1, w2, ...)</code>:</strong> zastępuje wiele powtarzających się warunków <code>OR</code>.</li><li><strong><code>NOT IN (w1, w2, ...)</code>:</strong> wyklucza wszystkie wartości podane w nawiasie.</li></ul><div class=\"theory-code\"><code>SELECT title, rating\nFROM film\nWHERE rating IN ('PG', 'G', 'PG-13');</code></div>",
    "variants": [
      {
        "stepCode": "R1", "keySuffix": "r1", "isWarmup": true, "tier": "warmup",
        "goal": "Wybierz filmy z trzech określonych kategorii wiekowych za pomocą operatora IN.",
        "prompt": "Pobierz title oraz rating filmów, których rating znajduje się na liście ('PG', 'G', 'PG-13').",
        "sol": "SELECT title, rating FROM film WHERE rating IN ('PG', 'G', 'PG-13');", "order": false, "tables": ["film"], "hint": "WHERE rating IN ('PG', 'G', 'PG-13');",
        "newFeature": { "title": "Operator wyboru z listy: IN (...)", "desc": "IN sprawdza, czy wartość kolumny znajduje się w podanym zbiorze wartości w nawiasie.", "example": "SELECT * FROM produkty WHERE kategoria IN ('Elektronika', 'Dom');" }
      },
      {
        "stepCode": "1", "keySuffix": "0", "isWarmup": false, "tier": "basic",
        "goal": "Wyszukaj filmy o konkretnych stawkach wypożyczenia (0.99 lub 2.99).",
        "prompt": "Pobierz title oraz rental_rate dla filmów, których stawka rental_rate wynosi dokładnie 0.99 lub 2.99.",
        "sol": "SELECT title, rental_rate FROM film WHERE rental_rate IN (0.99, 2.99);", "order": false, "tables": ["film"], "hint": "WHERE rental_rate IN (0.99, 2.99);", "newFeature": null
      },
      {
        "stepCode": "2", "keySuffix": "1", "isWarmup": false, "tier": "basic",
        "goal": "Wybierz aktorów o określonych imionach.",
        "prompt": "Pobierz first_name oraz last_name aktorów, których imię to 'PENELOPE', 'NICK' lub 'ED'.",
        "sol": "SELECT first_name, last_name FROM actor WHERE first_name IN ('PENELOPE', 'NICK', 'ED');", "order": false, "tables": ["actor"], "hint": "WHERE first_name IN ('PENELOPE', 'NICK', 'ED');", "newFeature": null
      },
      {
        "stepCode": "3", "keySuffix": "2", "isWarmup": false, "tier": "adv",
        "goal": "Wyklucz filmy dla dorosłych za pomocą operatora NOT IN.",
        "prompt": "Pobierz title oraz rating filmów, których rating NIE jest ani 'R', ani 'NC-17'.",
        "sol": "SELECT title, rating FROM film WHERE rating NOT IN ('R', 'NC-17');", "order": false, "tables": ["film"], "hint": "WHERE rating NOT IN ('R', 'NC-17');", "newFeature": null
      },
      {
        "stepCode": "4", "keySuffix": "3", "isWarmup": false, "tier": "adv",
        "goal": "Pobierz klientów z wyłączeniem pierwszych trzech identyfikatorów.",
        "prompt": "Pobierz customer_id, first_name oraz last_name klientów, których customer_id NIE należy do zbioru (1, 2, 3).",
        "sol": "SELECT customer_id, first_name, last_name FROM customer WHERE customer_id NOT IN (1, 2, 3);", "order": false, "tables": ["customer"], "hint": "WHERE customer_id NOT IN (1, 2, 3);", "newFeature": null
      }
    ]
  },

  // 3.4 Przedziały wartości: BETWEEN ... AND ... (4 zadania)
  {
    "id": "p2_4",
    "stage": 3,
    "unlockAt": 3,
    "title": "3.4 Przedziały wartości: BETWEEN ... AND ...",
    "tables": ["film", "payment"],
    "cols": ["SELECT", "FROM", "WHERE", "BETWEEN", "NOT BETWEEN", "AND", "title", "length", "rental_rate", "replacement_cost", "payment_id", "amount", "payment_date"],
    "theory": "<ul><li><strong><code>BETWEEN A AND B</code>:</strong> sprawdza, czy wartość mieści się w przedziale obustronnie domkniętym [A, B] (od A do B włącznie).</li><li><strong><code>NOT BETWEEN A AND B</code>:</strong> sprawdza, czy wartość leży poza zadanym przedziałem.</li></ul><div class=\"theory-code\"><code>SELECT title, length\nFROM film\nWHERE length BETWEEN 60 AND 90;</code></div>",
    "variants": [
      {
        "stepCode": "R1", "keySuffix": "r1", "isWarmup": true, "tier": "warmup",
        "goal": "Wybierz filmy o długości od 60 do 90 minut włącznie.",
        "prompt": "Pobierz title oraz length filmów, których długość mieści się w przedziale BETWEEN 60 AND 90.",
        "sol": "SELECT title, length FROM film WHERE length BETWEEN 60 AND 90;", "order": false, "tables": ["film"], "hint": "WHERE length BETWEEN 60 AND 90;",
        "newFeature": { "title": "Przedziały wartości: BETWEEN ... AND ...", "desc": "BETWEEN sprawdza, czy wartość znajduje się w zakresie (włącznie z wartościami granicznymi).", "example": "SELECT * FROM produkty WHERE cena BETWEEN 10 AND 50;" }
      },
      {
        "stepCode": "1", "keySuffix": "0", "isWarmup": false, "tier": "basic",
        "goal": "Znajdź filmy w średnim przedziale cenowym (stawka od 1.00 do 4.00).",
        "prompt": "Pobierz title oraz rental_rate dla filmów o stawce rental_rate w przedziale od 1.00 do 4.00 włącznie.",
        "sol": "SELECT title, rental_rate FROM film WHERE rental_rate BETWEEN 1.00 AND 4.00;", "order": false, "tables": ["film"], "hint": "WHERE rental_rate BETWEEN 1.00 AND 4.00;", "newFeature": null
      },
      {
        "stepCode": "2", "keySuffix": "1", "isWarmup": false, "tier": "basic",
        "goal": "Pobierz płatności z pierwszych pięciu dni maja 2026 roku.",
        "prompt": "Pobierz payment_id, amount oraz payment_date płatności zarejestrowanych między '2026-05-01' a '2026-05-05' włącznie.",
        "sol": "SELECT payment_id, amount, payment_date FROM payment WHERE payment_date BETWEEN '2026-05-01' AND '2026-05-05';", "order": false, "tables": ["payment"], "hint": "WHERE payment_date BETWEEN '2026-05-01' AND '2026-05-05';", "newFeature": null
      },
      {
        "stepCode": "3", "keySuffix": "2", "isWarmup": false, "tier": "adv",
        "goal": "Wyklucz przedział cenowy za pomocą NOT BETWEEN.",
        "prompt": "Pobierz title oraz replacement_cost filmów, których replacement_cost leży POZA zakresem od 15.00 do 25.00 (użyj NOT BETWEEN).",
        "sol": "SELECT title, replacement_cost FROM film WHERE replacement_cost NOT BETWEEN 15.00 AND 25.00;", "order": false, "tables": ["film"], "hint": "WHERE replacement_cost NOT BETWEEN 15.00 AND 25.00;", "newFeature": null
      }
    ]
  },

  // 3.5 Wzorce tekstowe: LIKE oraz ILIKE (% na początku, końcu, w środku i znak _) (6 zadań)
  {
    "id": "p2_5",
    "stage": 3,
    "unlockAt": 4,
    "title": "3.5 Wzorce tekstowe: LIKE oraz ILIKE (% i _)",
    "tables": ["film", "actor"],
    "cols": ["SELECT", "FROM", "WHERE", "LIKE", "ILIKE", "AND", "ORDER BY", "title", "rental_rate", "first_name", "last_name"],
    "theory": "<ul><li><strong><code>%</code>:</strong> zastępuje dowolną liczbę znaków (0 lub więcej).</li><li><strong><code>_</code>:</strong> zastępuje dokładnie JEDEN dowolny znak.</li><li><strong><code>LIKE</code>:</strong> rozróżnia wielkość liter ('A%' to co innego niż 'a%').</li><li><strong><code>ILIKE</code>:</strong> w PostgreSQL ignoruje wielkość liter (Case-Insensitive).</li></ul><div class=\"theory-code\"><code>SELECT title\nFROM film\nWHERE title ILIKE 'a%';</code></div>",
    "variants": [
      {
        "stepCode": "R1", "keySuffix": "r1", "isWarmup": true, "tier": "warmup",
        "goal": "Wyszukaj filmy zaczynające się na literę A.",
        "prompt": "Pobierz tytuły filmów, których tytuł zaczyna się od wielkiej litery 'A' (użyj LIKE 'A%').",
        "sol": "SELECT title FROM film WHERE title LIKE 'A%';", "order": false, "tables": ["film"], "hint": "WHERE title LIKE 'A%';",
        "newFeature": { "title": "Prefiks tekstu: LIKE 'A%'", "desc": "Znak % na końcu wzorca dopasowuje dowolny ciąg znaków po wskazanej literze.", "example": "SELECT * FROM produkty WHERE nazwa LIKE 'Super%';" }
      },
      {
        "stepCode": "R2", "keySuffix": "r2", "isWarmup": true, "tier": "warmup",
        "goal": "Wyszukaj aktorów o nazwisku kończącym się na literę S.",
        "prompt": "Pobierz first_name oraz last_name aktorów, których nazwisko kończy się na literę 'S' (LIKE '%S').",
        "sol": "SELECT first_name, last_name FROM actor WHERE last_name LIKE '%S';", "order": false, "tables": ["actor"], "hint": "WHERE last_name LIKE '%S';",
        "newFeature": { "title": "Sufiks tekstu: LIKE '%S'", "desc": "Znak % na początku wzorca oznacza, że tekst może zaczynać się od czegokolwiek, byle kończył się na 'S'.", "example": "SELECT * FROM klienci WHERE nazwisko LIKE '%ski';" }
      },
      {
        "stepCode": "1", "keySuffix": "0", "isWarmup": false, "tier": "basic",
        "goal": "Wyszukaj słowo kluczowe w środku tytułu filmu.",
        "prompt": "Pobierz tytuły filmów, które zawierają w dowolnym miejscu tytułu fragment 'AL' (użyj % z obu stron: LIKE '%AL%').",
        "sol": "SELECT title FROM film WHERE title LIKE '%AL%';", "order": false, "tables": ["film"], "hint": "WHERE title LIKE '%AL%';", "newFeature": null
      },
      {
        "stepCode": "2", "keySuffix": "1", "isWarmup": false, "tier": "basic",
        "goal": "Użyj znaku podkreślenia _, aby dopasować imię o dokładnie dwóch literach.",
        "prompt": "Pobierz first_name oraz last_name aktorów, których imię zaczyna się na 'E' i ma dokładnie dwa znaki (użyj wzorca 'E_').",
        "sol": "SELECT first_name, last_name FROM actor WHERE first_name LIKE 'E_';", "order": false, "tables": ["actor"], "hint": "WHERE first_name LIKE 'E_';", "newFeature": null
      },
      {
        "stepCode": "3", "keySuffix": "2", "isWarmup": false, "tier": "adv",
        "goal": "Wyszukaj tekst bez względu na wielkość liter za pomocą ILIKE.",
        "prompt": "Pobierz tytuły filmów zawierające słowo 'dinosaur' (zapisane małymi literami we wzorcu) za pomocą operatora ILIKE '%dinosaur%'.",
        "sol": "SELECT title FROM film WHERE title ILIKE '%dinosaur%';", "order": false, "tables": ["film"], "hint": "WHERE title ILIKE '%dinosaur%';", "newFeature": null
      },
      {
        "stepCode": "4", "keySuffix": "3", "isWarmup": false, "tier": "adv",
        "goal": "Połącz wzorzec ILIKE z warunkiem liczbowym i sortowaniem.",
        "prompt": "Pobierz title oraz rental_rate dla filmów zaczynających się na literę 'a' (użyj ILIKE 'a%'), o stawce rental_rate poniżej 3.00, posortowanych alfabetycznie po title.",
        "sol": "SELECT title, rental_rate FROM film WHERE title ILIKE 'a%' AND rental_rate < 3.00 ORDER BY title ASC;", "order": true, "tables": ["film"], "hint": "WHERE title ILIKE 'a%' AND rental_rate < 3.00 ORDER BY title ASC;", "newFeature": null
      }
    ]
  },

  // 3.6 Braki w danych: IS NULL oraz IS NOT NULL (4 zadania)
  {
    "id": "p2_6",
    "stage": 3,
    "unlockAt": 3,
    "title": "3.6 Braki w danych: IS NULL oraz IS NOT NULL",
    "tables": ["rental"],
    "cols": ["SELECT", "FROM", "WHERE", "IS NULL", "IS NOT NULL", "AND", "ORDER BY", "rental_id", "customer_id", "return_date", "film_id", "rental_date", "staff_id"],
    "theory": "<ul><li><strong><code>NULL</code>:</strong> oznacza brak wartości lub stan nieznany (nie jest to zero ani pusty tekst!).</li><li>Do sprawdzania NULL używamy wyłącznie <code>IS NULL</code> oraz <code>IS NOT NULL</code> (nigdy <code>= NULL</code>!).</li></ul><div class=\"theory-code\"><code>SELECT rental_id, return_date\nFROM rental\nWHERE return_date IS NULL;</code></div>",
    "variants": [
      {
        "stepCode": "R1", "keySuffix": "r1", "isWarmup": true, "tier": "warmup",
        "goal": "Wskaż wypożyczenia, które jeszcze nie zostały zwrócone (brak daty zwrotu).",
        "prompt": "Pobierz rental_id, customer_id oraz return_date dla wypożyczeń, w których data zwrotu wynosi NULL (użyj IS NULL).",
        "sol": "SELECT rental_id, customer_id, return_date FROM rental WHERE return_date IS NULL;", "order": false, "tables": ["rental"], "hint": "WHERE return_date IS NULL;",
        "newFeature": { "title": "Wartości brakujące: IS NULL", "desc": "W SQL braki danych sprawdzamy za pomocą IS NULL. Nigdy nie używaj zapisu = NULL!", "example": "SELECT * FROM zamowienia WHERE data_wysylki IS NULL;" }
      },
      {
        "stepCode": "1", "keySuffix": "0", "isWarmup": false, "tier": "basic",
        "goal": "Pobierz wyłącznie zwrócone wypożyczenia za pomocą IS NOT NULL.",
        "prompt": "Pobierz rental_id, film_id oraz return_date dla wypożyczeń, które mają uzupełnioną datę zwrotu (return_date IS NOT NULL).",
        "sol": "SELECT rental_id, film_id, return_date FROM rental WHERE return_date IS NOT NULL;", "order": false, "tables": ["rental"], "hint": "WHERE return_date IS NOT NULL;", "newFeature": null
      },
      {
        "stepCode": "2", "keySuffix": "1", "isWarmup": false, "tier": "basic",
        "goal": "Wypisz niezwrócone wypożyczenia posortowane od najstarszego.",
        "prompt": "Pobierz rental_id oraz rental_date dla wypożyczeń z return_date IS NULL, sortując wynik rosnąco po rental_date.",
        "sol": "SELECT rental_id, rental_date FROM rental WHERE return_date IS NULL ORDER BY rental_date ASC;", "order": true, "tables": ["rental"], "hint": "WHERE return_date IS NULL ORDER BY rental_date ASC;", "newFeature": null
      },
      {
        "stepCode": "3", "keySuffix": "2", "isWarmup": false, "tier": "adv",
        "goal": "Znajdź niezwrócone wypożyczenia zarejestrowane przez pracownika numer 1.",
        "prompt": "Pobierz customer_id oraz rental_id dla wypożyczeń, gdzie return_date IS NULL oraz staff_id = 1.",
        "sol": "SELECT customer_id, rental_id FROM rental WHERE return_date IS NULL AND staff_id = 1;", "order": false, "tables": ["rental"], "hint": "WHERE return_date IS NULL AND staff_id = 1;", "newFeature": null
      }
    ]
  },

// 4.1 Liczenie wierszy: COUNT(*), COUNT(kolumna) i COUNT(DISTINCT) (5 zadań)
  {
    "id": "p3_1",
    "stage": 4,
    "unlockAt": 3,
    "title": "4.1 Liczenie wierszy: COUNT(*), COUNT(kolumna) i COUNT(DISTINCT)",
    "tables": ["film", "rental", "payment"],
    "cols": ["SELECT", "FROM", "WHERE", "AS", "COUNT", "DISTINCT", "*", "total_films", "returned_count", "unique_ratings", "active_customers", "affordable_films", "rental_rate", "return_date", "rating", "customer_id"],
    "theory": "<ul><li><strong><code>COUNT(*)</code>:</strong> zlicza wszystkie wiersze w tabeli (nawet te zawierające wartości NULL).</li><li><strong><code>COUNT(kolumna)</code>:</strong> zlicza wyłącznie wiersze, w których wskazana kolumna NIE jest nullem (ignoruje NULL).</li><li><strong><code>COUNT(DISTINCT kolumna)</code>:</strong> zlicza unikalne niepuste wartości.</li></ul><div class=\"theory-code\"><code>SELECT COUNT(*) AS total_films, COUNT(DISTINCT rating) AS unique_ratings\nFROM film;</code></div>",
    "variants": [
      {
        "stepCode": "R1", "keySuffix": "r1", "isWarmup": true, "tier": "warmup",
        "goal": "Policz łączną liczbę filmów w katalogu.",
        "prompt": "Policz wszystkie rekordy w tabeli film za pomocą COUNT(*) i nazwij wynik total_films.",
        "sol": "SELECT COUNT(*) AS total_films FROM film;", "order": false, "tables": ["film"], "hint": "SELECT COUNT(*) AS total_films FROM film;",
        "newFeature": { "title": "Funkcja agregująca COUNT(*)", "desc": "COUNT(*) zlicza wszystkie wiersze spełniające warunki zapytania.", "example": "SELECT COUNT(*) AS liczba_produktow FROM produkty;" }
      },
      {
        "stepCode": "1", "keySuffix": "0", "isWarmup": false, "tier": "basic",
        "goal": "Policz ile wypożyczeń zostało już faktycznie zwróconych (COUNT ignoruje NULL).",
        "prompt": "Policz liczbę niepustych wartości w kolumnie return_date w tabeli rental i nazwij kolumnę returned_count.",
        "sol": "SELECT COUNT(return_date) AS returned_count FROM rental;", "order": false, "tables": ["rental"], "hint": "SELECT COUNT(return_date) AS returned_count FROM rental;", "newFeature": null
      },
      {
        "stepCode": "2", "keySuffix": "1", "isWarmup": false, "tier": "basic",
        "goal": "Sprawdź ile różnych kategorii wiekowych (rating) występuje w ofercie.",
        "prompt": "Policz unikalne wartości w kolumnie rating w tabeli film za pomocą COUNT(DISTINCT rating) i nazwij wynik unique_ratings.",
        "sol": "SELECT COUNT(DISTINCT rating) AS unique_ratings FROM film;", "order": false, "tables": ["film"], "hint": "SELECT COUNT(DISTINCT rating) AS unique_ratings FROM film;", "newFeature": null
      },
      {
        "stepCode": "3", "keySuffix": "2", "isWarmup": false, "tier": "adv",
        "goal": "Sprawdź ilu unikalnych klientów dokonało przynajmniej jednej płatności.",
        "prompt": "Policz unikalne identyfikatory klientów (customer_id) w tabeli payment i nazwij wynik active_customers.",
        "sol": "SELECT COUNT(DISTINCT customer_id) AS active_customers FROM payment;", "order": false, "tables": ["payment"], "hint": "SELECT COUNT(DISTINCT customer_id) AS active_customers FROM payment;", "newFeature": null
      },
      {
        "stepCode": "4", "keySuffix": "3", "isWarmup": false, "tier": "adv",
        "goal": "Policz filmy w promocji (stawka poniżej 2.00).",
        "prompt": "Policz ile filmów w tabeli film ma stawkę rental_rate < 2.00 i nazwij wynik affordable_films.",
        "sol": "SELECT COUNT(*) AS affordable_films FROM film WHERE rental_rate < 2.00;", "order": false, "tables": ["film"], "hint": "SELECT COUNT(*) AS affordable_films FROM film WHERE rental_rate < 2.00;", "newFeature": null
      }
    ]
  },

  // 4.2 Suma, średnia i wartości skrajne: SUM, AVG, MIN, MAX (5 zadań)
  {
    "id": "p3_2",
    "stage": 4,
    "unlockAt": 3,
    "title": "4.2 Suma, średnia i wartości skrajne: SUM, AVG, MIN, MAX",
    "tables": ["payment", "film"],
    "cols": ["SELECT", "FROM", "WHERE", "AS", "ROUND", "SUM", "AVG", "MIN", "MAX", "amount", "rental_rate", "length", "payment_date", "total_revenue", "avg_rate", "min_length", "max_length", "may_revenue", "avg_payment", "max_payment"],
    "theory": "<ul><li><strong><code>SUM(kolumna)</code>:</strong> sumuje wszystkie wartości liczbowe w kolumnie.</li><li><strong><code>AVG(kolumna)</code>:</strong> wylicza średnią arytmetyczną (użyj <code>ROUND(AVG(...), 2)</code> do zaokrąglenia).</li><li><strong><code>MIN()</code> / <code>MAX()</code>:</strong> zwraca wartość najmniejszą i największą.</li></ul><div class=\"theory-code\"><code>SELECT SUM(amount) AS total, ROUND(AVG(amount), 2) AS avg_amt\nFROM payment;</code></div>",
    "variants": [
      {
        "stepCode": "R1", "keySuffix": "r1", "isWarmup": true, "tier": "warmup",
        "goal": "Zsumuj łączny przychód ze wszystkich zarejestrowanych płatności.",
        "prompt": "Oblicz sumę wszystkich kwot w tabeli payment za pomocą SUM(amount) i nazwij kolumnę total_revenue.",
        "sol": "SELECT SUM(amount) AS total_revenue FROM payment;", "order": false, "tables": ["payment"], "hint": "SELECT SUM(amount) AS total_revenue FROM payment;",
        "newFeature": { "title": "Funkcja sumująca: SUM()", "desc": "SUM dodaje do siebie wszystkie wartości liczbowe w danej kolumnie.", "example": "SELECT SUM(kwota) AS utarg FROM zamowienia;" }
      },
      {
        "stepCode": "1", "keySuffix": "0", "isWarmup": false, "tier": "basic",
        "goal": "Oblicz średnią stawkę wypożyczenia filmu zaokrągloną do 2 miejsc po przecinku.",
        "prompt": "Oblicz średnią stawkę rental_rate w tabeli film za pomocą ROUND(AVG(rental_rate), 2) pod aliasem avg_rate.",
        "sol": "SELECT ROUND(AVG(rental_rate), 2) AS avg_rate FROM film;", "order": false, "tables": ["film"], "hint": "SELECT ROUND(AVG(rental_rate), 2) AS avg_rate FROM film;", "newFeature": null
      },
      {
        "stepCode": "2", "keySuffix": "1", "isWarmup": false, "tier": "basic",
        "goal": "Znajdź długość najkrótszego oraz najdłuższego filmu w katalogu.",
        "prompt": "Z tabeli film pobierz minimalną długość jako min_length oraz maksymalną długość jako max_length (użyj MIN i MAX na kolumnie length).",
        "sol": "SELECT MIN(length) AS min_length, MAX(length) AS max_length FROM film;", "order": false, "tables": ["film"], "hint": "SELECT MIN(length) AS min_length, MAX(length) AS max_length FROM film;", "newFeature": null
      },
      {
        "stepCode": "3", "keySuffix": "2", "isWarmup": false, "tier": "adv",
        "goal": "Oblicz przychód z płatności dokonanych wyłącznie w maju 2026 roku.",
        "prompt": "Zsumuj kwoty wpłat (SUM(amount)) z tabeli payment zarejestrowanych przed '2026-06-01' i nazwij wynik may_revenue.",
        "sol": "SELECT SUM(amount) AS may_revenue FROM payment WHERE payment_date < '2026-06-01';", "order": false, "tables": ["payment"], "hint": "WHERE payment_date < '2026-06-01';", "newFeature": null
      },
      {
        "stepCode": "4", "keySuffix": "3", "isWarmup": false, "tier": "adv",
        "goal": "Pobierz średnią wpłatę oraz najwyższą pojedynczą wpłatę w historii.",
        "prompt": "Z tabeli payment pobierz średnią kwotę zaokrągloną do 2 miejsc jako avg_payment oraz maksymalną kwotę jako max_payment.",
        "sol": "SELECT ROUND(AVG(amount), 2) AS avg_payment, MAX(amount) AS max_payment FROM payment;", "order": false, "tables": ["payment"], "hint": "SELECT ROUND(AVG(amount), 2) AS avg_payment, MAX(amount) AS max_payment FROM payment;", "newFeature": null
      }
    ]
  },

  // 4.3 Grupowanie po jednej i wielu kolumnach: GROUP BY (6 zadań)
  {
    "id": "p3_3",
    "stage": 4,
    "unlockAt": 4,
    "title": "4.3 Grupowanie po jednej i wielu kolumnach: GROUP BY",
    "tables": ["film", "payment", "customer"],
    "cols": ["SELECT", "FROM", "GROUP BY", "AS", "ROUND", "AVG", "COUNT", "SUM", "DATE_TRUNC", "::timestamp", "::date", "rating", "staff_id", "customer_id", "amount", "length", "store_id", "active", "payment_date", "film_count", "payment_count", "total_spent", "avg_duration", "customer_count", "payment_month", "monthly_rev"],
    "theory": "<ul><li><strong><code>GROUP BY</code>:</strong> dzieli wiersze na grupy (koszyki) według podanych kolumn.</li><li>Każda kolumna w <code>SELECT</code>, która nie jest funkcją agregującą, <strong>musi</strong> znaleźć się w <code>GROUP BY</code>!</li><li>Możesz grupować po kilku kolumnach: <code>GROUP BY store_id, active</code>.</li></ul><div class=\"theory-code\"><code>SELECT rating, COUNT(*) AS film_count\nFROM film\nGROUP BY rating;</code></div>",
    "variants": [
      {
        "stepCode": "R1", "keySuffix": "r1", "isWarmup": true, "tier": "warmup",
        "goal": "Pogrupuj filmy według kategorii wiekowej i policz liczbę filmów w każdej kategorii.",
        "prompt": "Pobierz kolumnę rating oraz liczbę filmów w każdej kategorii jako film_count z tabeli film za pomocą GROUP BY rating.",
        "sol": "SELECT rating, COUNT(*) AS film_count FROM film GROUP BY rating;", "order": false, "tables": ["film"], "hint": "SELECT rating, COUNT(*) AS film_count FROM film GROUP BY rating;",
        "newFeature": { "title": "Grupowanie wierszy: GROUP BY", "desc": "GROUP BY łączy powtarzające się wiersze w grupy, umożliwiając liczenie sum i średnich dla każdego koszyka.", "example": "SELECT kategoria, COUNT(*) FROM produkty GROUP BY kategoria;" }
      },
      {
        "stepCode": "R2", "keySuffix": "r2", "isWarmup": true, "tier": "warmup",
        "goal": "Sprawdź ilu płatności dokonał każdy z pracowników.",
        "prompt": "Pobierz staff_id oraz liczbę obsłużonych płatności jako payment_count z tabeli payment, grupując po staff_id.",
        "sol": "SELECT staff_id, COUNT(*) AS payment_count FROM payment GROUP BY staff_id;", "order": false, "tables": ["payment"], "hint": "GROUP BY staff_id;",
        "newFeature": null
      },
      {
        "stepCode": "1", "keySuffix": "0", "isWarmup": false, "tier": "basic",
        "goal": "Oblicz łączną sumę wydatków dla każdego klienta.",
        "prompt": "Pobierz customer_id oraz łączną kwotę wpłat jako total_spent z payment, grupując po customer_id.",
        "sol": "SELECT customer_id, SUM(amount) AS total_spent FROM payment GROUP BY customer_id;", "order": false, "tables": ["payment"], "hint": "SELECT customer_id, SUM(amount) AS total_spent FROM payment GROUP BY customer_id;", "newFeature": null
      },
      {
        "stepCode": "2", "keySuffix": "1", "isWarmup": false, "tier": "basic",
        "goal": "Oblicz średni czas trwania filmu w każdej kategorii wiekowej.",
        "prompt": "Pobierz rating oraz średnią długość filmu zaokrągloną do 2 miejsc jako avg_duration z tabeli film, grupując po rating.",
        "sol": "SELECT rating, ROUND(AVG(length), 2) AS avg_duration FROM film GROUP BY rating;", "order": false, "tables": ["film"], "hint": "SELECT rating, ROUND(AVG(length), 2) AS avg_duration FROM film GROUP BY rating;", "newFeature": null
      },
      {
        "stepCode": "3", "keySuffix": "2", "isWarmup": false, "tier": "adv",
        "goal": "Grupowanie po dwóch kolumnach: oddział i status aktywności klienta.",
        "prompt": "Z tabeli customer pobierz store_id, active oraz liczbę klientów jako customer_count, grupując po store_id oraz active.",
        "sol": "SELECT store_id, active, COUNT(*) AS customer_count FROM customer GROUP BY store_id, active;", "order": false, "tables": ["customer"], "hint": "GROUP BY store_id, active;", "newFeature": null
      },
      {
        "stepCode": "4", "keySuffix": "3", "isWarmup": false, "tier": "adv",
        "goal": "Grupowanie miesięcznych przychodów pracownika.",
        "prompt": "Z tabeli payment pobierz staff_id, miesiąc płatności DATE_TRUNC('month', payment_date::timestamp)::date jako payment_month oraz sumę kwot jako monthly_rev, grupując po tych dwóch wyrażeniach.",
        "sol": "SELECT staff_id, DATE_TRUNC('month', payment_date::timestamp)::date AS payment_month, SUM(amount) AS monthly_rev FROM payment GROUP BY staff_id, DATE_TRUNC('month', payment_date::timestamp)::date;", "order": false, "tables": ["payment"], "hint": "GROUP BY staff_id, DATE_TRUNC('month', payment_date::timestamp)::date;", "newFeature": null
      }
    ]
  },

  // 4.4 Filtrowanie grup: HAVING kontra WHERE (5 zadań)
  {
    "id": "p3_4",
    "stage": 4,
    "unlockAt": 3,
    "title": "4.4 Filtrowanie grup: HAVING kontra WHERE",
    "tables": ["film", "payment", "rental"],
    "cols": ["SELECT", "FROM", "WHERE", "GROUP BY", "HAVING", "AS", "COUNT", "SUM", "AVG", "ROUND", "rating", "customer_id", "staff_id", "amount", "rental_rate", "return_date", "film_count", "total_spent", "avg_rate", "big_payments", "rental_count"],
    "theory": "<ul><li><strong><code>WHERE</code>:</strong> filtruje pojedyncze wiersze PRZED grupowaniem (nie może zawierać funkcji agregujących!).</li><li><strong><code>HAVING</code>:</strong> filtruje gotowe grupy PO wykonaniu agregacji (np. <code>HAVING COUNT(*) &gt; 5</code>).</li></ul><div class=\"theory-code\"><code>SELECT rating, COUNT(*) AS film_count\nFROM film\nGROUP BY rating\nHAVING COUNT(*) &gt; 3;</code></div>",
    "variants": [
      {
        "stepCode": "R1", "keySuffix": "r1", "isWarmup": true, "tier": "warmup",
        "goal": "Wskaż kategorie wiekowe, które mają więcej niż 3 filmy.",
        "prompt": "Pobierz rating oraz liczbę filmów jako film_count z film, grupując po rating i zostawiając tylko grupy z COUNT(*) > 3 za pomocą HAVING.",
        "sol": "SELECT rating, COUNT(*) AS film_count FROM film GROUP BY rating HAVING COUNT(*) > 3;", "order": false, "tables": ["film"], "hint": "GROUP BY rating HAVING COUNT(*) > 3;",
        "newFeature": { "title": "Filtrowanie grup: HAVING", "desc": "HAVING służy do filtrowania wyników po agregacji (odrzuca grupy niespełniające warunku).", "example": "SELECT dzial, COUNT(*) FROM pracownicy GROUP BY dzial HAVING COUNT(*) > 10;" }
      },
      {
        "stepCode": "1", "keySuffix": "0", "isWarmup": false, "tier": "basic",
        "goal": "Znajdź klientów VIP, którzy wydali łącznie powyżej 10.00.",
        "prompt": "Pobierz customer_id oraz sumę wpłat jako total_spent z payment, grupując po customer_id i filtrując grupy z SUM(amount) > 10.00 za pomocą HAVING.",
        "sol": "SELECT customer_id, SUM(amount) AS total_spent FROM payment GROUP BY customer_id HAVING SUM(amount) > 10.00;", "order": false, "tables": ["payment"], "hint": "HAVING SUM(amount) > 10.00;", "newFeature": null
      },
      {
        "stepCode": "2", "keySuffix": "1", "isWarmup": false, "tier": "basic",
        "goal": "Wyszukaj kategorie filmów o średniej stawce wyższej niż 3.00.",
        "prompt": "Pobierz rating oraz zaokrągloną średnią stawkę jako avg_rate z film, grupując po rating i filtrując grupy ze średnią AVG(rental_rate) > 3.00.",
        "sol": "SELECT rating, ROUND(AVG(rental_rate), 2) AS avg_rate FROM film GROUP BY rating HAVING AVG(rental_rate) > 3.00;", "order": false, "tables": ["film"], "hint": "HAVING AVG(rental_rate) > 3.00;", "newFeature": null
      },
      {
        "stepCode": "3", "keySuffix": "2", "isWarmup": false, "tier": "adv",
        "goal": "Połącz WHERE i HAVING: duże wpłaty pracownika.",
        "prompt": "Z tabeli payment pobierz staff_id oraz liczbę płatności jako big_payments, filtrując najpierw wiersze z amount > 4.00 (WHERE), grupując po staff_id i wybierając grupy z co najmniej 3 takimi płatnościami (HAVING COUNT(*) >= 3).",
        "sol": "SELECT staff_id, COUNT(*) AS big_payments FROM payment WHERE amount > 4.00 GROUP BY staff_id HAVING COUNT(*) >= 3;", "order": false, "tables": ["payment"], "hint": "WHERE amount > 4.00 GROUP BY staff_id HAVING COUNT(*) >= 3;", "newFeature": null
      },
      {
        "stepCode": "4", "keySuffix": "3", "isWarmup": false, "tier": "adv",
        "goal": "Klienci z więcej niż jednym zwróconym filmem.",
        "prompt": "Pobierz customer_id oraz liczbę zwróconych filmów jako rental_count z rental, filtrując wiersze return_date IS NOT NULL (WHERE), grupując po customer_id i zostawiając klientów z liczbą wypożyczeń większą niż 1 (HAVING COUNT(*) > 1).",
        "sol": "SELECT customer_id, COUNT(*) AS rental_count FROM rental WHERE return_date IS NOT NULL GROUP BY customer_id HAVING COUNT(*) > 1;", "order": false, "tables": ["rental"], "hint": "WHERE return_date IS NOT NULL GROUP BY customer_id HAVING COUNT(*) > 1;", "newFeature": null
      }
    ]
  },

  // 4.5 Agregacja warunkowa: FILTER (WHERE ...) (4 zadania)
  {
    "id": "p3_5",
    "stage": 4,
    "unlockAt": 3,
    "title": "4.5 Agregacja warunkowa: FILTER (WHERE ...)",
    "tables": ["rental", "film", "payment"],
    "cols": ["SELECT", "FROM", "GROUP BY", "AS", "COUNT", "SUM", "FILTER", "WHERE", "total_rentals", "returned_rentals", "all_films", "pg_films", "staff_id", "total_amount", "high_amount", "customer_id", "all_rentals", "unreturned", "return_date", "rating", "amount"],
    "theory": "<ul><li><strong><code>FILTER (WHERE warunek)</code>:</strong> nowoczesna i czytelna klauzula PostgreSQL, pozwalająca agregować tylko wybrane wiersze w ramach jednej funkcji bez dzielenia całego zapytania.</li><li>Działa dla <code>COUNT(*) FILTER (...)</code>, <code>SUM(...) FILTER (...)</code> itd.</li></ul><div class=\"theory-code\"><code>SELECT COUNT(*) AS total,\n       COUNT(*) FILTER (WHERE return_date IS NOT NULL) AS returned\nFROM rental;</code></div>",
    "variants": [
      {
        "stepCode": "R1", "keySuffix": "r1", "isWarmup": true, "tier": "warmup",
        "goal": "W jednym zapytaniu policz wszystkie wypożyczenia oraz tylko te zwrócone.",
        "prompt": "Z tabeli rental pobierz łączną liczbę wypożyczeń jako total_rentals oraz liczbę zwróconych jako returned_rentals za pomocą COUNT(*) FILTER (WHERE return_date IS NOT NULL).",
        "sol": "SELECT COUNT(*) AS total_rentals, COUNT(*) FILTER (WHERE return_date IS NOT NULL) AS returned_rentals FROM rental;", "order": false, "tables": ["rental"], "hint": "COUNT(*) FILTER (WHERE return_date IS NOT NULL) AS returned_rentals",
        "newFeature": { "title": "Agregacja warunkowa: FILTER (WHERE ...)", "desc": "Klauzula FILTER pozwala nałożenie filtra bezpośrednio na konkretną funkcję agregującą.", "example": "SELECT COUNT(*) FILTER (WHERE status = 'zrealizowane') FROM zamowienia;" }
      },
      {
        "stepCode": "1", "keySuffix": "0", "isWarmup": false, "tier": "basic",
        "goal": "Policz wszystkie filmy oraz liczbę filmów z ratingiem PG.",
        "prompt": "Z tabeli film pobierz łączną liczbę filmów jako all_films oraz liczbę filmów z ratingiem PG jako pg_films za pomocą COUNT(*) FILTER (WHERE rating = 'PG').",
        "sol": "SELECT COUNT(*) AS all_films, COUNT(*) FILTER (WHERE rating = 'PG') AS pg_films FROM film;", "order": false, "tables": ["film"], "hint": "COUNT(*) FILTER (WHERE rating = 'PG') AS pg_films", "newFeature": null
      },
      {
        "stepCode": "2", "keySuffix": "1", "isWarmup": false, "tier": "basic",
        "goal": "Suma ogólna wpłat oraz suma wpłat wysokich (powyżej 5.00) dla każdego pracownika.",
        "prompt": "Z tabeli payment pobierz staff_id, łączną sumę wpłat jako total_amount oraz sumę wpłat powyżej 5.00 jako high_amount (SUM(amount) FILTER (WHERE amount > 5.00)), grupując po staff_id.",
        "sol": "SELECT staff_id, SUM(amount) AS total_amount, SUM(amount) FILTER (WHERE amount > 5.00) AS high_amount FROM payment GROUP BY staff_id;", "order": false, "tables": ["payment"], "hint": "SUM(amount) FILTER (WHERE amount > 5.00) AS high_amount", "newFeature": null
      },
      {
        "stepCode": "3", "keySuffix": "2", "isWarmup": false, "tier": "adv",
        "goal": "Wszystkie vs niezwrócone wypożyczenia każdego klienta.",
        "prompt": "Z tabeli rental pobierz customer_id, liczbę wszystkich wypożyczeń jako all_rentals oraz liczbę niezwróconych jako unreturned (COUNT(*) FILTER (WHERE return_date IS NULL)), grupując po customer_id.",
        "sol": "SELECT customer_id, COUNT(*) AS all_rentals, COUNT(*) FILTER (WHERE return_date IS NULL) AS unreturned FROM rental GROUP BY customer_id;", "order": false, "tables": ["rental"], "hint": "COUNT(*) FILTER (WHERE return_date IS NULL) AS unreturned", "newFeature": null
      }
    ]
  },

  // 5.1 Tekst: UPPER, LOWER, LENGTH, TRIM i łączenie || (5 zadań)
  {
    "id": "p4_0a",
    "stage": 5,
    "unlockAt": 3,
    "title": "5.1 Tekst: UPPER, LOWER, LENGTH, TRIM i łączenie ||",
    "tables": ["actor", "film", "store"],
    "cols": ["SELECT", "FROM", "AS", "||", "UPPER", "LOWER", "LENGTH", "ORDER BY", "first_name", "last_name", "title", "rating", "city", "full_name", "upper_title", "lower_rating", "title_len", "generated_email", "city_len"],
    "theory": "<ul><li><strong><code>||</code>:</strong> operator łączenia (konkatenacji) tekstów w PostgreSQL.</li><li><strong><code>UPPER()</code> / <code>LOWER()</code>:</strong> zamienia litery na wielkie lub małe.</li><li><strong><code>LENGTH()</code>:</strong> zwraca liczbę znaków w tekście.</li></ul><div class=\"theory-code\"><code>SELECT first_name || ' ' || last_name AS full_name\nFROM actor;</code></div>",
    "variants": [
      {
        "stepCode": "R1", "keySuffix": "r1", "isWarmup": true, "tier": "warmup",
        "goal": "Połącz imię i nazwisko aktora w jedno pole.",
        "prompt": "Pobierz z tabeli actor imię i nazwisko połączone ze spacją w środku za pomocą operatora || pod aliasem full_name.",
        "sol": "SELECT first_name || ' ' || last_name AS full_name FROM actor;", "order": false, "tables": ["actor"], "hint": "first_name || ' ' || last_name AS full_name",
        "newFeature": { "title": "Łączenie tekstów operatorem ||", "desc": "Operator || łączy ze sobą wartości tekstowe. Aby dodać odstęp, wstaw spację w apostrofach ' '.", "example": "SELECT imie || ' ' || nazwisko AS klient FROM klienci;" }
      },
      {
        "stepCode": "1", "keySuffix": "0", "isWarmup": false, "tier": "basic",
        "goal": "Zastosuj funkcje zmiany wielkości liter UPPER i LOWER.",
        "prompt": "Z tabeli film pobierz tytuł wielkimi literami jako upper_title oraz kategorię rating małymi literami jako lower_rating.",
        "sol": "SELECT UPPER(title) AS upper_title, LOWER(rating) AS lower_rating FROM film;", "order": false, "tables": ["film"], "hint": "UPPER(title) AS upper_title, LOWER(rating) AS lower_rating", "newFeature": null
      },
      {
        "stepCode": "2", "keySuffix": "1", "isWarmup": false, "tier": "basic",
        "goal": "Oblicz długość tytułów filmów i posortuj od najdłuższych.",
        "prompt": "Pobierz title oraz liczbę znaków w tytule jako title_len (użyj LENGTH(title)) z tabeli film, sortując malejąco po title_len.",
        "sol": "SELECT title, LENGTH(title) AS title_len FROM film ORDER BY title_len DESC;", "order": true, "tables": ["film"], "hint": "SELECT title, LENGTH(title) AS title_len FROM film ORDER BY title_len DESC;", "newFeature": null
      },
      {
        "stepCode": "3", "keySuffix": "2", "isWarmup": false, "tier": "adv",
        "goal": "Wygeneruj adres e-mail aktora na podstawie imienia i nazwiska.",
        "prompt": "Z tabeli actor pobierz first_name, last_name oraz wygenerowany adres e-mail w małych literach pod aliasem generated_email w formacie: imie.nazwisko@dvdrental.com (użyj LOWER i ||).",
        "sol": "SELECT first_name, last_name, LOWER(first_name || '.' || last_name || '@dvdrental.com') AS generated_email FROM actor;", "order": false, "tables": ["actor"], "hint": "LOWER(first_name || '.' || last_name || '@dvdrental.com') AS generated_email", "newFeature": null
      },
      {
        "stepCode": "4", "keySuffix": "3", "isWarmup": false, "tier": "adv",
        "goal": "Sprawdź długość nazw miast oddziałów.",
        "prompt": "Pobierz z tabeli store nazwę miasta city oraz długość tej nazwy jako city_len za pomocą LENGTH(city).",
        "sol": "SELECT city, LENGTH(city) AS city_len FROM store;", "order": false, "tables": ["store"], "hint": "SELECT city, LENGTH(city) AS city_len FROM store;", "newFeature": null
      }
    ]
  },

  // 5.2 Liczby: Zaokrąglanie ROUND() i dzielenie dziesiętne (100.0 *, ::numeric) (5 zadań)
  {
    "id": "p4_0b",
    "stage": 5,
    "unlockAt": 3,
    "title": "5.2 Liczby: Zaokrąglanie ROUND() i dzielenie dziesiętne",
    "tables": ["film", "payment"],
    "cols": ["SELECT", "FROM", "GROUP BY", "AS", "ROUND", "AVG", "::numeric", "*", "/", "-", "title", "rental_rate", "film_id", "replacement_cost", "payment_id", "amount", "customer_id", "price_pln", "rent_to_cost_pct", "vat_amount", "avg_amt", "cost_diff"],
    "theory": "<ul><li><strong><code>ROUND(liczba, 2)</code>:</strong> zaokrągla wynik do wskazanej liczby miejsc po przecinku (w PostgreSQL wymaga typu <code>numeric</code>, np. <code>kolumna::numeric</code>).</li><li><strong>Dzielenie dziesiętne:</strong> aby uniknąć ucięcia części ułamkowej przy dzieleniu całkowitym, mnóż przez <code>100.0</code> lub rzutuj <code>::numeric</code>.</li></ul><div class=\"theory-code\"><code>SELECT title, ROUND(rental_rate * 4.25, 2) AS cena_pln\nFROM film;</code></div>",
    "variants": [
      {
        "stepCode": "R1", "keySuffix": "r1", "isWarmup": true, "tier": "warmup",
        "goal": "Przelicz stawkę filmu na złote z kursem 4.25 i zaokrąglij do 2 miejsc.",
        "prompt": "Pobierz title oraz stawkę rental_rate przeliczoną przez kurs 4.25 jako price_pln z zaokrągleniem do 2 miejsc (ROUND(rental_rate * 4.25, 2)).",
        "sol": "SELECT title, ROUND(rental_rate * 4.25, 2) AS price_pln FROM film;", "order": false, "tables": ["film"], "hint": "ROUND(rental_rate * 4.25, 2) AS price_pln",
        "newFeature": { "title": "Zaokrąglanie: ROUND(wartość, miejsca)", "desc": "Funkcja ROUND() zaokrągla wartość liczbową do zadanej liczby miejsc po przecinku.", "example": "SELECT ROUND(cena * 1.23, 2) AS brutto FROM produkty;" }
      },
      {
        "stepCode": "1", "keySuffix": "0", "isWarmup": false, "tier": "basic",
        "goal": "Oblicz jaki procent kosztu zakupu stanowi cena wypożyczenia filmu.",
        "prompt": "Pobierz film_id oraz stosunek rental_rate do replacement_cost wyrażony w procentach jako rent_to_cost_pct (ROUND(rental_rate / replacement_cost * 100.0, 2)).",
        "sol": "SELECT film_id, ROUND(rental_rate / replacement_cost * 100.0, 2) AS rent_to_cost_pct FROM film;", "order": false, "tables": ["film"], "hint": "ROUND(rental_rate / replacement_cost * 100.0, 2) AS rent_to_cost_pct", "newFeature": null
      },
      {
        "stepCode": "2", "keySuffix": "1", "isWarmup": false, "tier": "basic",
        "goal": "Wylicz podatek VAT 23% dla każdej płatności.",
        "prompt": "Z tabeli payment pobierz payment_id, kwotę amount oraz podatek VAT 23% zaokrąglony do 2 miejsc jako vat_amount (ROUND(amount * 0.23, 2)).",
        "sol": "SELECT payment_id, amount, ROUND(amount * 0.23, 2) AS vat_amount FROM payment;", "order": false, "tables": ["payment"], "hint": "ROUND(amount * 0.23, 2) AS vat_amount", "newFeature": null
      },
      {
        "stepCode": "3", "keySuffix": "2", "isWarmup": false, "tier": "adv",
        "goal": "Średnia wpłata klienta rzutowana na ::numeric przed zaokrągleniem.",
        "prompt": "Pobierz customer_id oraz zaokrągloną do 2 miejsc średnią kwotę wpłaty jako avg_amt (ROUND(AVG(amount)::numeric, 2)) z payment, grupując po customer_id.",
        "sol": "SELECT customer_id, ROUND(AVG(amount)::numeric, 2) AS avg_amt FROM payment GROUP BY customer_id;", "order": false, "tables": ["payment"], "hint": "ROUND(AVG(amount)::numeric, 2) AS avg_amt", "newFeature": null
      },
      {
        "stepCode": "4", "keySuffix": "3", "isWarmup": false, "tier": "adv",
        "goal": "Różnica kosztu odtworzenia i stawki wypożyczenia.",
        "prompt": "Z tabeli film pobierz title oraz zaokrągloną różnicę (replacement_cost - rental_rate) jako cost_diff.",
        "sol": "SELECT title, ROUND((replacement_cost - rental_rate)::numeric, 2) AS cost_diff FROM film;", "order": false, "tables": ["film"], "hint": "ROUND((replacement_cost - rental_rate)::numeric, 2) AS cost_diff", "newFeature": null
      }
    ]
  },

  // 5.3 Daty: EXTRACT(YEAR/MONTH) oraz DATE_TRUNC (5 zadań)
  {
    "id": "p4_0c",
    "stage": 5,
    "unlockAt": 3,
    "title": "5.3 Daty: EXTRACT(YEAR/MONTH) oraz DATE_TRUNC",
    "tables": ["payment", "rental"],
    "cols": ["SELECT", "FROM", "GROUP BY", "ORDER BY", "AS", "EXTRACT", "DATE_TRUNC", "::timestamp", "::date", "SUM", "COUNT", "payment_id", "rental_id", "payment_date", "rental_date", "amount", "payment_month", "rental_day", "month_start", "total_amount", "rental_month", "total_rentals"],
    "theory": "<ul><li><strong><code>EXTRACT(część FROM data::timestamp)</code>:</strong> wyciąga liczbę oznaczającą np. <code>MONTH</code>, <code>YEAR</code>, <code>DAY</code> z daty.</li><li><strong><code>DATE_TRUNC('month', data::timestamp)::date</code>:</strong> obcina datę do początku zadanego okresu (np. pierwszy dzień miesiąca).</li></ul><div class=\"theory-code\"><code>SELECT payment_id, EXTRACT(MONTH FROM payment_date::timestamp) AS miesiac\nFROM payment;</code></div>",
    "variants": [
      {
        "stepCode": "R1", "keySuffix": "r1", "isWarmup": true, "tier": "warmup",
        "goal": "Wyciągnij numer miesiąca z daty płatności.",
        "prompt": "Pobierz payment_id oraz numer miesiąca jako payment_month z payment za pomocą EXTRACT(MONTH FROM payment_date::timestamp).",
        "sol": "SELECT payment_id, EXTRACT(MONTH FROM payment_date::timestamp) AS payment_month FROM payment;", "order": false, "tables": ["payment"], "hint": "EXTRACT(MONTH FROM payment_date::timestamp) AS payment_month",
        "newFeature": { "title": "Wyciąganie części daty: EXTRACT()", "desc": "EXTRACT pozwala wyciągnąć rok, miesiąc lub dzień z wartości daty.", "example": "SELECT EXTRACT(YEAR FROM data_zamowienia::timestamp) FROM zamowienia;" }
      },
      {
        "stepCode": "1", "keySuffix": "0", "isWarmup": false, "tier": "basic",
        "goal": "Wyciągnij dzień miesiąca z daty wypożyczenia.",
        "prompt": "Pobierz rental_id oraz numer dnia jako rental_day z rental za pomocą EXTRACT(DAY FROM rental_date::timestamp).",
        "sol": "SELECT rental_id, EXTRACT(DAY FROM rental_date::timestamp) AS rental_day FROM rental;", "order": false, "tables": ["rental"], "hint": "EXTRACT(DAY FROM rental_date::timestamp) AS rental_day", "newFeature": null
      },
      {
        "stepCode": "2", "keySuffix": "1", "isWarmup": false, "tier": "basic",
        "goal": "Zaokrąglij datę płatności do pierwszego dnia miesiąca za pomocą DATE_TRUNC.",
        "prompt": "Pobierz payment_id oraz początek miesiąca jako month_start z payment za pomocą DATE_TRUNC('month', payment_date::timestamp)::date.",
        "sol": "SELECT payment_id, DATE_TRUNC('month', payment_date::timestamp)::date AS month_start FROM payment;", "order": false, "tables": ["payment"], "hint": "DATE_TRUNC('month', payment_date::timestamp)::date AS month_start", "newFeature": null
      },
      {
        "stepCode": "3", "keySuffix": "2", "isWarmup": false, "tier": "adv",
        "goal": "Podsumuj miesięczną sprzedaż grupując po DATE_TRUNC.",
        "prompt": "Pobierz pierwszy dzień miesiąca jako payment_month oraz sumę wpłat jako total_amount z payment, grupując po miesiącu i sortując chronologicznie (GROUP BY 1 ORDER BY 1).",
        "sol": "SELECT DATE_TRUNC('month', payment_date::timestamp)::date AS payment_month, SUM(amount) AS total_amount FROM payment GROUP BY 1 ORDER BY 1;", "order": true, "tables": ["payment"], "hint": "GROUP BY 1 ORDER BY 1;", "newFeature": null
      },
      {
        "stepCode": "4", "keySuffix": "3", "isWarmup": false, "tier": "adv",
        "goal": "Policz liczbę wypożyczeń w poszczególnych miesiącach.",
        "prompt": "Pobierz miesiąc wypożyczenia jako rental_month oraz liczbę wypożyczeń jako total_rentals z rental, grupując i sortując po miesiącu (GROUP BY 1 ORDER BY 1).",
        "sol": "SELECT DATE_TRUNC('month', rental_date::timestamp)::date AS rental_month, COUNT(*) AS total_rentals FROM rental GROUP BY 1 ORDER BY 1;", "order": true, "tables": ["rental"], "hint": "DATE_TRUNC('month', rental_date::timestamp)::date AS rental_month, COUNT(*) AS total_rentals FROM rental GROUP BY 1 ORDER BY 1;", "newFeature": null
      }
    ]
  },

  // 6.1 Warunki CASE WHEN ... THEN ... ELSE ... END (5 zadań)
  {
    "id": "p5_1",
    "stage": 6,
    "unlockAt": 3,
    "title": "6.1 Warunki CASE WHEN ... THEN ... ELSE ... END",
    "tables": ["film", "customer", "payment", "rental"],
    "cols": ["SELECT", "FROM", "AS", "CASE", "WHEN", "THEN", "ELSE", "END", "title", "length", "film_type", "customer_id", "active", "status_txt", "payment_id", "amount", "price_tier", "rating", "audience", "rental_id", "return_date", "rental_status"],
    "theory": "<ul><li><strong><code>CASE WHEN ... THEN ... ELSE ... END</code>:</strong> instrukcja warunkowa w SQL (odpowiednik if/else).</li><li>Możesz podać wiele gałęzi <code>WHEN</code>, a na końcu opcjonalne <code>ELSE</code>. Całość kończymy słowem <code>END</code>.</li></ul><div class=\"theory-code\"><code>SELECT title,\n       CASE WHEN length &gt;= 100 THEN 'Długi' ELSE 'Krótki' END AS typ\nFROM film;</code></div>",
    "variants": [
      {
        "stepCode": "R1", "keySuffix": "r1", "isWarmup": true, "tier": "warmup",
        "goal": "Podziel filmy na długie i krótkie na podstawie czasu trwania.",
        "prompt": "Pobierz title, length oraz pole film_type o wartości 'Długi' gdy length >= 100, w przeciwnym razie 'Krótki' (użyj CASE WHEN ...).",
        "sol": "SELECT title, length, CASE WHEN length >= 100 THEN 'Długi' ELSE 'Krótki' END AS film_type FROM film;", "order": false, "tables": ["film"], "hint": "CASE WHEN length >= 100 THEN 'Długi' ELSE 'Krótki' END AS film_type",
        "newFeature": { "title": "Instrukcja warunkowa: CASE WHEN", "desc": "CASE pozwala przypisać różne wartości w zależności od spełnienia warunków logicznych.", "example": "SELECT CASE WHEN stan > 0 THEN 'Dostępny' ELSE 'Brak' END FROM magazyn;" }
      },
      {
        "stepCode": "1", "keySuffix": "0", "isWarmup": false, "tier": "basic",
        "goal": "Zamień kod aktywności 1/0 na czytelny tekst 'Aktywny' / 'Nieaktywny'.",
        "prompt": "Pobierz customer_id, active oraz pole status_txt ('Aktywny' gdy active = 1, inaczej 'Nieaktywny') z tabeli customer.",
        "sol": "SELECT customer_id, active, CASE WHEN active = 1 THEN 'Aktywny' ELSE 'Nieaktywny' END AS status_txt FROM customer;", "order": false, "tables": ["customer"], "hint": "CASE WHEN active = 1 THEN 'Aktywny' ELSE 'Nieaktywny' END AS status_txt", "newFeature": null
      },
      {
        "stepCode": "2", "keySuffix": "1", "isWarmup": false, "tier": "basic",
        "goal": "Wielostopniowy podział kwot na segmenty: Wysoka, Średnia, Niska.",
        "prompt": "Z tabeli payment pobierz payment_id, amount oraz kolumnę price_tier: 'Wysoka' gdy amount >= 6.00, 'Średnia' gdy amount >= 3.00, w pozostałych przypadkach 'Niska'.",
        "sol": "SELECT payment_id, amount, CASE WHEN amount >= 6.00 THEN 'Wysoka' WHEN amount >= 3.00 THEN 'Średnia' ELSE 'Niska' END AS price_tier FROM payment;", "order": false, "tables": ["payment"], "hint": "CASE WHEN amount >= 6.00 THEN 'Wysoka' WHEN amount >= 3.00 THEN 'Średnia' ELSE 'Niska' END AS price_tier", "newFeature": null
      },
      {
        "stepCode": "3", "keySuffix": "2", "isWarmup": false, "tier": "adv",
        "goal": "Kategoryzacja widowni: 'Dla każdego' vs 'Dla dorosłych'.",
        "prompt": "Z tabeli film pobierz title, rating oraz pole audience ('Dla każdego' dla kategorii 'G' i 'PG', w przeciwnym razie 'Dla dorosłych').",
        "sol": "SELECT title, rating, CASE WHEN rating IN ('G', 'PG') THEN 'Dla każdego' ELSE 'Dla dorosłych' END AS audience FROM film;", "order": false, "tables": ["film"], "hint": "CASE WHEN rating IN ('G', 'PG') THEN 'Dla każdego' ELSE 'Dla dorosłych' END AS audience", "newFeature": null
      },
      {
        "stepCode": "4", "keySuffix": "3", "isWarmup": false, "tier": "adv",
        "goal": "Status wypożyczenia w zależności od obecności daty zwrotu.",
        "prompt": "Z tabeli rental pobierz rental_id oraz kolumnę rental_status ('Wypożyczony' gdy return_date IS NULL, w przeciwnym razie 'Zwrócony').",
        "sol": "SELECT rental_id, CASE WHEN return_date IS NULL THEN 'Wypożyczony' ELSE 'Zwrócony' END AS rental_status FROM rental;", "order": false, "tables": ["rental"], "hint": "CASE WHEN return_date IS NULL THEN 'Wypożyczony' ELSE 'Zwrócony' END AS rental_status", "newFeature": null
      }
    ]
  },

  // 6.2 Obsługa NULL: COALESCE oraz NULLIF (4 zadania)
  {
    "id": "p5_1b",
    "stage": 6,
    "unlockAt": 3,
    "title": "6.2 Obsługa NULL: COALESCE oraz NULLIF",
    "tables": ["rental", "customer", "film"],
    "cols": ["SELECT", "FROM", "WHERE", "AS", "COALESCE", "NULLIF", "::text", "rental_id", "return_date", "safe_return_date", "customer_id", "status_opis", "email", "verified_email", "film_id", "rental_rate", "adjusted_rate"],
    "theory": "<ul><li><strong><code>COALESCE(w1, w2, ...)</code>:</strong> zwraca pierwszą niepustą (nie-NULL) wartość z listy. Idealne do zastępowania NULL wartością domyślną (w PostgreSQL argumenty muszą mieć ten sam typ — np. datę zamieniamy przez <code>return_date::text</code>).</li><li><strong><code>NULLIF(a, b)</code>:</strong> zwraca NULL, jeśli a = b (przydatne np. do ochrony przed dzieleniem przez zero).</li></ul><div class=\"theory-code\"><code>SELECT rental_id, COALESCE(return_date::text, 'W toku') AS status\nFROM rental;</code></div>",
    "variants": [
      {
        "stepCode": "R1", "keySuffix": "r1", "isWarmup": true, "tier": "warmup",
        "goal": "Zastąp brak daty zwrotu czytelnym napisem 'W toku'.",
        "prompt": "Pobierz rental_id oraz kolumnę safe_return_date, która zwraca return_date jako tekst (`return_date::text`), a w przypadku NULL wyświetla napis `'W toku'` (użyj `COALESCE`).",
        "sol": "SELECT rental_id, COALESCE(return_date::text, 'W toku') AS safe_return_date FROM rental;", "order": false, "tables": ["rental"], "hint": "COALESCE(return_date::text, 'W toku') AS safe_return_date",
        "newFeature": { "title": "Zastępowanie braków: COALESCE()", "desc": "COALESCE zwraca pierwszy argument, który nie jest NULL. Pozwala zastąpić brakujące dane domyślnym tekstem lub liczbą (w PostgreSQL rzutuj daty przez ::text przed połączeniem z tekstem).", "example": "SELECT COALESCE(data_zwrotu::text, 'brak') FROM wypozyczenia;" }
      },
      {
        "stepCode": "1", "keySuffix": "0", "isWarmup": false, "tier": "basic",
        "goal": "Zastosuj COALESCE dla wypożyczeń klienta numer 2.",
        "prompt": "Dla klienta customer_id = 2 pobierz rental_id oraz status_opis z wartością `return_date::text` lub tekstem `'Brak zwrotu'` gdy brak daty.",
        "sol": "SELECT rental_id, COALESCE(return_date::text, 'Brak zwrotu') AS status_opis FROM rental WHERE customer_id = 2;", "order": false, "tables": ["rental"], "hint": "SELECT rental_id, COALESCE(return_date::text, 'Brak zwrotu') AS status_opis FROM rental WHERE customer_id = 2;", "newFeature": null
      },
      {
        "stepCode": "2", "keySuffix": "1", "isWarmup": false, "tier": "basic",
        "goal": "Zabezpiecz brakujące adresy e-mail klientów.",
        "prompt": "Z tabeli customer pobierz customer_id oraz zweryfikowany adres email pod aliasem verified_email (gdy brak, wstaw 'brak@maila.pl').",
        "sol": "SELECT customer_id, COALESCE(email, 'brak@maila.pl') AS verified_email FROM customer;", "order": false, "tables": ["customer"], "hint": "COALESCE(email, 'brak@maila.pl') AS verified_email", "newFeature": null
      },
      {
        "stepCode": "3", "keySuffix": "2", "isWarmup": false, "tier": "adv",
        "goal": "Zastosuj NULLIF, aby zamienić stawkę 0.99 na wartość NULL.",
        "prompt": "Pobierz film_id, rental_rate oraz kolumnę adjusted_rate, która zamienia stawkę 0.99 na NULL za pomocą NULLIF(rental_rate, 0.99).",
        "sol": "SELECT film_id, rental_rate, NULLIF(rental_rate, 0.99) AS adjusted_rate FROM film;", "order": false, "tables": ["film"], "hint": "NULLIF(rental_rate, 0.99) AS adjusted_rate", "newFeature": null
      }
    ]
  },

// ==========================================
  // DZIAŁ 7: Relacje i łączenie tabel (JOIN & SET)
  // ==========================================
  {
    "id": "p4_1",
    "stage": 7,
    "unlockAt": 4,
    "title": "7.1 Część wspólna tabel: INNER JOIN i aliasy tabel",
    "tables": ["film", "category", "film_category", "customer", "payment", "actor", "film_actor", "staff", "store"],
    "cols": ["SELECT", "FROM", "JOIN", "ON", "INNER", "AS", "WHERE", "GROUP BY", "ORDER BY", "COUNT", "SUM", "ROUND", "AVG", "LIMIT", "title", "name", "first_name", "last_name", "amount", "payment_date", "store_id", "city", "rental_rate", "length"],
    "theory": "<ul><li><strong><code>INNER JOIN</code>:</strong> łączy wiersze z dwóch tabel, które mają pasujące wartości we wspólnej kolumnie.</li><li><strong><code>ON</code>:</strong> określa warunek połączenia (zazwyczaj klucz obcy = klucz główny).</li><li><strong>Aliasy tabel:</strong> skracają zapis i zapobiegają dwuznaczności kolumn (np. <code>film f JOIN film_category fc ON f.film_id = fc.film_id</code>).</li></ul><div class=\"theory-code\"><code>SELECT f.title, c.name AS kategoria\nFROM film f\nJOIN film_category fc ON f.film_id = fc.film_id\nJOIN category c ON fc.category_id = c.category_id;</code></div>",
    "variants": [
      {
        "stepCode": "R1",
        "keySuffix": "r1",
        "isWarmup": true,
        "tier": "warmup",
        "goal": "Wyświetl katalog filmów wraz z nazwą ich kategorii tematycznej.",
        "prompt": "Połącz tabele filmów i kategorii poprzez tabelę pośredniczącą, pobierając tytuł filmu oraz nazwę kategorii jako category_name.",
        "sol": "SELECT f.title, c.name AS category_name FROM film f JOIN film_category fc ON f.film_id = fc.film_id JOIN category c ON fc.category_id = c.category_id;",
        "order": false,
        "tables": ["film", "film_category", "category"],
        "hint": "Połącz tabele kluczem film_id oraz category_id: SELECT f.title, c.name AS category_name FROM film f JOIN film_category fc ON f.film_id = fc.film_id JOIN category c ON fc.category_id = c.category_id;",
        "newFeature": { "title": "Łączenie tabel: INNER JOIN", "desc": "INNER JOIN zwraca rekordy, które posiadają dopasowanie w obu łączonych tabelach.", "example": "SELECT a.tytul, k.nazwa FROM filmy a JOIN kategorie k ON a.kat_id = k.id;" }
      },
      {
        "stepCode": "R2",
        "keySuffix": "r2",
        "isWarmup": true,
        "tier": "warmup",
        "goal": "Przejrzyj 5 najnowszych płatności wraz z danymi klientów, którzy ich dokonali.",
        "prompt": "Pobierz imię, nazwisko klienta oraz kwotę i datę płatności. Posortuj malejąco po dacie płatności (oraz rosnąco po payment_id) i ogranicz wynik do 5 rekordów.",
        "sol": "SELECT c.first_name, c.last_name, p.amount, p.payment_date FROM customer c JOIN payment p ON c.customer_id = p.customer_id ORDER BY p.payment_date DESC, p.payment_id ASC LIMIT 5;",
        "order": true,
        "tables": ["customer", "payment"],
        "hint": "Połącz customer i payment przez customer_id i posortuj: ORDER BY p.payment_date DESC, p.payment_id ASC LIMIT 5;",
        "newFeature": { "title": "Aliasy tabel z JOIN", "desc": "Nadawanie krótkich literowych aliasów (np. c dla customer, p dla payment) ułatwia czytanie zapytania.", "example": "SELECT c.imie, p.kwota FROM klienci c JOIN platnosci p ON c.id = p.klient_id;" }
      },
      {
        "stepCode": "1",
        "keySuffix": "1",
        "isWarmup": false,
        "tier": "standard",
        "goal": "Znajdź filmy, w których zagrał aktor o identyfikatorze 1 (Penelope Guiness).",
        "prompt": "Pobierz tytuł filmu oraz imię i nazwisko aktora dla aktora o actor_id = 1. Posortuj rosnąco po tytule.",
        "sol": "SELECT f.title, a.first_name, a.last_name FROM film f JOIN film_actor fa ON f.film_id = fa.film_id JOIN actor a ON fa.actor_id = a.actor_id WHERE a.actor_id = 1 ORDER BY f.title ASC;",
        "order": true,
        "tables": ["film", "film_actor", "actor"],
        "hint": "Połącz film, film_actor i actor, a w WHERE dodaj a.actor_id = 1.",
        "newFeature": { "title": "Filtrowanie po złączeniu", "desc": "Klauzulę WHERE stosujemy po blokach JOIN, aby przefiltrować połączone dane.", "example": "SELECT f.title FROM film f JOIN film_actor fa ON f.film_id = fa.film_id WHERE fa.actor_id = 1;" }
      },
      {
        "stepCode": "2",
        "keySuffix": "2",
        "isWarmup": false,
        "tier": "standard",
        "goal": "Podlicz liczbę dostępnych tytułów w każdej kategorii filmowej.",
        "prompt": "Pobierz nazwę kategorii oraz liczbę filmów jako film_cnt. Zgrupuj po nazwie kategorii i posortuj malejąco po liczbie filmów, a przy remisie alfabetycznie po nazwie.",
        "sol": "SELECT c.name, COUNT(*) AS film_cnt FROM category c JOIN film_category fc ON c.category_id = fc.category_id GROUP BY c.name ORDER BY film_cnt DESC, c.name ASC;",
        "order": true,
        "tables": ["category", "film_category"],
        "hint": "Zastosuj COUNT(*) oraz GROUP BY c.name.",
        "newFeature": { "title": "Agregacja po JOIN", "desc": "Możesz łączyć tabele i od razu grupować dane funkcją COUNT(*) lub SUM().", "example": "SELECT c.name, COUNT(*) FROM category c JOIN film_category fc ON c.category_id = fc.category_id GROUP BY c.name;" }
      },
      {
        "stepCode": "3",
        "keySuffix": "3",
        "isWarmup": false,
        "tier": "standard",
        "goal": "Podlicz całkowitą wartość sprzedaży zrealizowanej przez każdego pracownika wypożyczalni.",
        "prompt": "Pobierz imię i nazwisko pracownika oraz sumę zebranych płatności jako total_sales. Zgrupuj po imieniu i nazwisku.",
        "sol": "SELECT s.first_name, s.last_name, SUM(p.amount) AS total_sales FROM staff s JOIN payment p ON s.staff_id = p.staff_id GROUP BY s.first_name, s.last_name;",
        "order": false,
        "tables": ["staff", "payment"],
        "hint": "Użyj SUM(p.amount) AS total_sales i GROUP BY s.first_name, s.last_name.",
        "newFeature": { "title": "Łączenie z tabelą transakcyjną", "desc": "Połączenie pracownika z transakcjami pozwala rozliczyć wyniki sprzedażowe.", "example": "SELECT s.first_name, SUM(p.amount) FROM staff s JOIN payment p ON s.staff_id = p.staff_id GROUP BY s.first_name;" }
      },
      {
        "stepCode": "4",
        "keySuffix": "4",
        "isWarmup": false,
        "tier": "challenge",
        "goal": "Wyłoń 5 najbardziej zapracowanych aktorów w bazie według liczby ról filmowych.",
        "prompt": "Pobierz imię, nazwisko oraz liczbę zagranych filmów jako roles_cnt. Zgrupuj po actor_id, first_name i last_name. Posortuj malejąco po liczbie ról (przy remisie po actor_id rosnąco) i pobierz 5 pierwszych.",
        "sol": "SELECT a.first_name, a.last_name, COUNT(fa.film_id) AS roles_cnt FROM actor a JOIN film_actor fa ON a.actor_id = fa.actor_id GROUP BY a.actor_id, a.first_name, a.last_name ORDER BY roles_cnt DESC, a.actor_id ASC LIMIT 5;",
        "order": true,
        "tables": ["actor", "film_actor"],
        "hint": "Grupuj po a.actor_id, a.first_name, a.last_name i posortuj: ORDER BY roles_cnt DESC, a.actor_id ASC LIMIT 5;",
        "newFeature": { "title": "Top N po złączeniu", "desc": "Połączenie GROUP BY, ORDER BY DESC i LIMIT pozwala łatwo wyciągnąć ranking liderów.", "example": "SELECT a.name, COUNT(*) AS cnt FROM a JOIN b ON a.id = b.a_id GROUP BY a.name ORDER BY cnt DESC LIMIT 5;" }
      }
    ]
  },
  {
    "id": "p4_2",
    "stage": 7,
    "unlockAt": 4,
    "title": "7.2 Zachowanie lewej tabeli: LEFT JOIN oraz szukanie braków (IS NULL)",
    "tables": ["customer", "rental", "category", "film_category", "film", "payment", "store", "staff"],
    "cols": ["SELECT", "FROM", "LEFT JOIN", "ON", "WHERE", "IS NULL", "GROUP BY", "ORDER BY", "COUNT", "COALESCE", "SUM", "LIMIT", "customer_id", "first_name", "last_name", "rental_id", "name", "film_id", "title", "total_paid", "city", "staff_name"],
    "theory": "<ul><li><strong><code>LEFT JOIN</code>:</strong> zwraca wszystkie wiersze z lewej tabeli oraz pasujące wiersze z prawej tabeli.</li><li><strong>Brak dopasowania:</strong> kolumny z prawej tabeli przyjmą wartość <code>NULL</code>.</li><li><strong>Anti-Join (wyszukiwanie braków):</strong> połączenie <code>LEFT JOIN</code> z warunkiem <code>WHERE prawa_tabela.id IS NULL</code> pozwala znaleźć elementy, które nie mają żadnych powiązań (np. klienci bez wypożyczeń).</li></ul><div class=\"theory-code\"><code>SELECT c.customer_id, c.first_name\nFROM customer c\nLEFT JOIN rental r ON c.customer_id = r.customer_id\nWHERE r.rental_id IS NULL;</code></div>",
    "variants": [
      {
        "stepCode": "R1",
        "keySuffix": "r1",
        "isWarmup": true,
        "tier": "warmup",
        "goal": "Znajdź klientów, którzy zarejestrowali się w systemie, ale jeszcze nigdy niczego nie wypożyczyli.",
        "prompt": "Pobierz identyfikator, imię oraz nazwisko klientów, którzy nie mają żadnego powiązanego wpisu w wypożyczeniach. Posortuj rosnąco po identyfikatorze klienta.",
        "sol": "SELECT c.customer_id, c.first_name, c.last_name FROM customer c LEFT JOIN rental r ON c.customer_id = r.customer_id WHERE r.rental_id IS NULL ORDER BY c.customer_id ASC;",
        "order": true,
        "tables": ["customer", "rental"],
        "hint": "Wykorzystaj LEFT JOIN oraz warunek WHERE r.rental_id IS NULL.",
        "newFeature": { "title": "Wyszukiwanie osieroconych rekordów (Anti-Join)", "desc": "LEFT JOIN połączony z WHERE prawa_tabela.klucz IS NULL filtruje wyłącznie rekordy bez powiązań.", "example": "SELECT k.id FROM klienci k LEFT JOIN zamowienia z ON k.id = z.klient_id WHERE z.id IS NULL;" }
      },
      {
        "stepCode": "R2",
        "keySuffix": "r2",
        "isWarmup": true,
        "tier": "warmup",
        "goal": "Zestaw wszystkie kategorie filmowe wraz z liczbą przypisanych do nich filmów, zachowując nawet puste kategorie.",
        "prompt": "Pobierz nazwę kategorii oraz liczbę przypisanych filmów jako films_in_cat za pomocą lewostronnego złączenia. Zgrupuj po nazwie kategorii i posortuj alfabetycznie po nazwie.",
        "sol": "SELECT c.name, COUNT(fc.film_id) AS films_in_cat FROM category c LEFT JOIN film_category fc ON c.category_id = fc.category_id GROUP BY c.name ORDER BY c.name ASC;",
        "order": true,
        "tables": ["category", "film_category"],
        "hint": "Zastosuj COUNT(fc.film_id), aby puste kategorie zwróciły 0 zamiast 1.",
        "newFeature": { "title": "Bezpieczne liczenie z LEFT JOIN", "desc": "Użyj COUNT(kolumna_z_prawej) zamiast COUNT(*), aby wiersze z NULL zostały policzone jako 0.", "example": "SELECT k.nazwa, COUNT(p.id) FROM kategorie k LEFT JOIN produkty p ON k.id = p.kat_id GROUP BY k.nazwa;" }
      },
      {
        "stepCode": "1",
        "keySuffix": "1",
        "isWarmup": false,
        "tier": "standard",
        "goal": "Znajdź filmy, które ani razu nie zostały jeszcze wypożyczone przez żadnego klienta.",
        "prompt": "Pobierz identyfikator oraz tytuł filmów, do których brak wpisów w tabeli rental. Posortuj rosnąco po film_id.",
        "sol": "SELECT f.film_id, f.title FROM film f LEFT JOIN rental r ON f.film_id = r.film_id WHERE r.rental_id IS NULL ORDER BY f.film_id ASC;",
        "order": true,
        "tables": ["film", "rental"],
        "hint": "Połącz film z rental przez film_id i dodaj warunek WHERE r.rental_id IS NULL.",
        "newFeature": { "title": "Identyfikacja nieaktywnego asortymentu", "desc": "Anti-join pozwala znaleźć produkty z katalogu, które nie wygenerowały żadnego ruchu w wypożyczalni.", "example": "SELECT f.film_id, f.title FROM film f LEFT JOIN rental r ON f.film_id = r.film_id WHERE r.rental_id IS NULL;" }
      },
      {
        "stepCode": "2",
        "keySuffix": "2",
        "isWarmup": false,
        "tier": "standard",
        "goal": "Przeanalizuj wydatki klientów i znajdź 5 osób z najniższą łączną kwotą wpłat (w tym 0 zł dla osób bez transakcji).",
        "prompt": "Pobierz imię, nazwisko oraz łączną kwotę wpłat jako total_paid (zastępując brakujące wpłaty zerem za pomocą COALESCE). Zgrupuj po imieniu i nazwisku, posortuj rosnąco po sumie wpłat i imieniu, pobierając 5 osób.",
        "sol": "SELECT c.first_name, c.last_name, COALESCE(SUM(p.amount), 0) AS total_paid FROM customer c LEFT JOIN payment p ON c.customer_id = p.customer_id GROUP BY c.first_name, c.last_name ORDER BY total_paid ASC, c.first_name ASC LIMIT 5;",
        "order": true,
        "tables": ["customer", "payment"],
        "hint": "Użyj COALESCE(SUM(p.amount), 0) AS total_paid.",
        "newFeature": { "title": "COALESCE z agregacją", "desc": "Gdy klient nie ma płatności, SUM(amount) daje NULL. COALESCE zamienia ten NULL na bezpieczną wartość 0.", "example": "SELECT k.imie, COALESCE(SUM(p.kwota), 0) FROM klienci k LEFT JOIN platnosci p ON k.id = p.klient_id GROUP BY k.imie;" }
      },
      {
        "stepCode": "3",
        "keySuffix": "3",
        "isWarmup": false,
        "tier": "standard",
        "goal": "Wyświetl listę miast naszych oddziałów wraz z imieniem przypisanego do nich personelu.",
        "prompt": "Pobierz miasto oddziału oraz imię pracownika jako staff_name za pomocą lewostronnego złączenia tabel store i staff. Posortuj rosnąco po nazwie miasta.",
        "sol": "SELECT st.city, s.first_name AS staff_name FROM store st LEFT JOIN staff s ON st.store_id = s.store_id ORDER BY st.city ASC;",
        "order": true,
        "tables": ["store", "staff"],
        "hint": "Zastosuj store st LEFT JOIN staff s ON st.store_id = s.store_id ORDER BY st.city ASC;",
        "newFeature": { "title": "Zachowanie lokalizacji bez personelu", "desc": "LEFT JOIN gwarantuje, że oddział pojawi się na liście nawet jeśli tymczasowo nie ma przypisanego pracownika.", "example": "SELECT st.city, s.first_name FROM store st LEFT JOIN staff s ON st.store_id = s.store_id;" }
      },
      {
        "stepCode": "4",
        "keySuffix": "4",
        "isWarmup": false,
        "tier": "challenge",
        "goal": "Wskaż klientów, którzy nie zrealizowali ani jednej wpłaty w systemie.",
        "prompt": "Pobierz customer_id, imię oraz nazwisko klientów, dla których brak jakiegokolwiek rekordu w tabeli payment. Posortuj rosnąco po identyfikatorze klienta.",
        "sol": "SELECT c.customer_id, c.first_name, c.last_name FROM customer c LEFT JOIN payment p ON c.customer_id = p.customer_id WHERE p.payment_id IS NULL ORDER BY c.customer_id ASC;",
        "order": true,
        "tables": ["customer", "payment"],
        "hint": "Połącz customer i payment lewostronnie i dodaj WHERE p.payment_id IS NULL.",
        "newFeature": { "title": "Wykrywanie braku transakcji finansowych", "desc": "Filtrowanie po IS NULL na kluczu tabeli finansowej pozwala natychmiast znaleźć klientów bez wpłat.", "example": "SELECT c.id FROM customer c LEFT JOIN payment p ON c.id = p.c_id WHERE p.id IS NULL;" }
      }
    ]
  },
  {
    "id": "p4_3",
    "stage": 7,
    "unlockAt": 3,
    "title": "7.3 Łączenie wyników pod sobą: UNION oraz UNION ALL",
    "tables": ["staff", "customer", "actor", "store", "film"],
    "cols": ["SELECT", "FROM", "UNION", "UNION ALL", "ORDER BY", "LIMIT", "WHERE", "first_name", "last_name", "typ_osoby", "city", "typ_punktu", "title", "length", "kategoria"],
    "theory": "<ul><li><strong><code>UNION</code>:</strong> scala wyniki dwóch zapytań o tej samej liczbie i typach kolumn, automatycznie usuwając duplikaty.</li><li><strong><code>UNION ALL</code>:</strong> scala wyniki bez usuwania duplikatów (działa szybciej).</li><li><strong>Sortowanie:</strong> klauzulę <code>ORDER BY</code> umieszczamy tylko raz, na samym końcu scalonego zapytania.</li></ul><div class=\"theory-code\"><code>SELECT first_name, last_name, 'Pracownik' AS typ\nFROM staff\nUNION ALL\nSELECT first_name, last_name, 'Klient' AS typ\nFROM customer;</code></div>",
    "variants": [
      {
        "stepCode": "R1",
        "keySuffix": "r1",
        "isWarmup": true,
        "tier": "warmup",
        "goal": "Stwórz wspólną książkę adresową pracowników i klientów wypożyczalni.",
        "prompt": "Połącz listę imion i nazwisk pracowników (ze stałą kolumną 'Pracownik' jako typ_osoby) oraz klientów (z kolumną 'Klient' jako typ_osoby) za pomocą UNION ALL. Posortuj rosnąco po nazwisku i imieniu, ograniczając do 10 wyników.",
        "sol": "SELECT first_name, last_name, 'Pracownik' AS typ_osoby FROM staff UNION ALL SELECT first_name, last_name, 'Klient' AS typ_osoby FROM customer ORDER BY last_name ASC, first_name ASC LIMIT 10;",
        "order": true,
        "tables": ["staff", "customer"],
        "hint": "Zastosuj UNION ALL między dwoma zapytaniami SELECT o tym samym układzie kolumn.",
        "newFeature": { "title": "Łączenie zbiorów: UNION ALL", "desc": "UNION ALL skleja wyniki zapytań pionowo (jeden pod drugim) bez usuwania duplikatów.", "example": "SELECT nazwa FROM magazyn_a UNION ALL SELECT nazwa FROM magazyn_b;" }
      },
      {
        "stepCode": "1",
        "keySuffix": "1",
        "isWarmup": false,
        "tier": "standard",
        "goal": "Zbuduj listę unikalnych osób (aktorów i klientów) występujących w naszej bazie.",
        "prompt": "Pobierz unikalne pary imię i nazwisko łącząc tabelę actor oraz customer za pomocą operatora UNION. Posortuj alfabetycznie po imieniu i nazwisku, pobierając pierwsze 10 wierszy.",
        "sol": "SELECT first_name, last_name FROM actor UNION SELECT first_name, last_name FROM customer ORDER BY first_name ASC, last_name ASC LIMIT 10;",
        "order": true,
        "tables": ["actor", "customer"],
        "hint": "Użyj UNION (bez ALL), aby automatycznie odrzucić ewentualne duplikaty.",
        "newFeature": { "title": "Usuwanie duplikatów: UNION", "desc": "UNION scala wiersze pionowo i odrzuca powtórzenia, zwracając tylko unikalne rekordy.", "example": "SELECT email FROM subskrybenci UNION SELECT email FROM klienci;" }
      },
      {
        "stepCode": "2",
        "keySuffix": "2",
        "isWarmup": false,
        "tier": "standard",
        "goal": "Utwórz zestawienie miast dla sklepów i punktów dostawczych.",
        "prompt": "Połącz listę miast ze store z etykietą 'Sklep' jako typ_punktu oraz ze store z etykietą 'Dostawca' jako typ_punktu za pomocą UNION ALL. Posortuj rosnąco po nazwie miasta.",
        "sol": "SELECT city, 'Sklep' AS typ_punktu FROM store UNION ALL SELECT city, 'Dostawca' AS typ_punktu FROM store ORDER BY city ASC;",
        "order": true,
        "tables": ["store"],
        "hint": "Użyj UNION ALL i posortuj: ORDER BY city ASC;",
        "newFeature": { "title": "Etykietowanie źródła w UNION", "desc": "Dodanie stałej tekstowej jako aliasu (np. 'Sklep' AS typ) pozwala rozróżnić skąd pochodzi dany wiersz.", "example": "SELECT miasto, 'A' AS kod FROM oddzial_a UNION ALL SELECT miasto, 'B' AS kod FROM oddzial_b;" }
      },
      {
        "stepCode": "3",
        "keySuffix": "3",
        "isWarmup": false,
        "tier": "challenge",
        "goal": "Przygotuj zestawienie skrajnych długości filmów: bardzo długich i bardzo krótkich.",
        "prompt": "Wybierz tytuł i etykietę 'Długi film' jako kategoria dla filmów trwających powyżej 150 minut, połącz za pomocą UNION ALL z filmami poniżej 60 minut z etykietą 'Krótki film' jako kategoria. Posortuj rosnąco po tytule i pobierz 10 pierwszych.",
        "sol": "SELECT title, 'Długi film' AS kategoria FROM film WHERE length > 150 UNION ALL SELECT title, 'Krótki film' AS kategoria FROM film WHERE length < 60 ORDER BY title ASC LIMIT 10;",
        "order": true,
        "tables": ["film"],
        "hint": "Napisz dwa zapytania z warunkiem WHERE i połącz je przez UNION ALL.",
        "newFeature": { "title": "Scalanie wyników z różnymi filtrami", "desc": "Możesz zdefiniować dwa odrębne kryteria filtrowania w osobnych SELECT i złączyć je operatorem UNION ALL.", "example": "SELECT tytul, 'Drogi' FROM f WHERE cena > 100 UNION ALL SELECT tytul, 'Tani' FROM f WHERE cena < 20;" }
      }
    ]
  },

  // ==========================================
  // DZIAŁ 8: Podzapytania, CTE i Funkcje Okna
  // ==========================================
  {
    "id": "p5_2",
    "stage": 8,
    "unlockAt": 3,
    "title": "8.1 Podzapytania oraz czytelne bloki CTE (WITH)",
    "tables": ["film", "payment", "film_category", "category", "staff", "store", "customer"],
    "cols": ["WITH", "AS", "SELECT", "FROM", "WHERE", "GROUP BY", "HAVING", "ORDER BY", "COUNT", "SUM", "AVG", "LIMIT", "title", "length", "customer_id", "total", "category_id", "cnt", "store_id", "rev", "first_name", "last_name"],
    "theory": "<ul><li><strong>CTE (Common Table Expression):</strong> konstrukcja <code>WITH nazwa AS (...)</code> tworzy tymczasową, nazwaną tabelę na czas trwania zapytania.</li><li><strong>Czytelność kodu:</strong> zamiast wielokrotnie zagnieżdżonych podzapytań, kod czyta się od góry do dołu.</li><li><strong>Ponowne użycie:</strong> do zdefiniowanego CTE można odwoływać się w głównym zapytaniu wielokrotnie lub łączyć je z innymi tabelami.</li></ul><div class=\"theory-code\"><code>WITH dlugie_filmy AS (\n  SELECT title, length\n  FROM film\n  WHERE length > 120\n)\nSELECT title, length\nFROM dlugie_filmy\nWHERE length > 150;</code></div>",
    "variants": [
      {
        "stepCode": "R1",
        "keySuffix": "r1",
        "isWarmup": true,
        "tier": "warmup",
        "goal": "Odfiltruj najdłuższe produkcje za pomocą przejrzystego bloku CTE.",
        "prompt": "Stwórz blok WITH o nazwie long_films wybierający tytuł i czas trwania dla filmów powyżej 120 minut. W zapytaniu głównym wybierz z tego bloku tytuł i długość dla filmów powyżej 150 minut.",
        "sol": "WITH long_films AS (SELECT title, length FROM film WHERE length > 120) SELECT title, length FROM long_films WHERE length > 150;",
        "order": false,
        "tables": ["film"],
        "hint": "Rozpocznij od: WITH long_films AS (SELECT title, length FROM film WHERE length > 120) SELECT title, length FROM long_films WHERE length > 150;",
        "newFeature": { "title": "Klauzula CTE: WITH nazwa AS (...)", "desc": "CTE pozwala nadać nazwę podzapytaniu i traktować je jak tymczasowy widok tabeli.", "example": "WITH temp AS (SELECT * FROM produkty WHERE cena > 100) SELECT * FROM temp;" }
      },
      {
        "stepCode": "1",
        "keySuffix": "1",
        "isWarmup": false,
        "tier": "standard",
        "goal": "Zidentyfikuj klientów o najwyższych sumach płatności przekraczających 150 zł.",
        "prompt": "W bloku CTE cust_totals podlicz łączną kwotę płatności (jako total) dla każdego klienta (customer_id). W zapytaniu głównym wybierz klientów z total > 150 i posortuj malejąco po kwocie.",
        "sol": "WITH cust_totals AS (SELECT customer_id, SUM(amount) AS total FROM payment GROUP BY customer_id) SELECT customer_id, total FROM cust_totals WHERE total > 150 ORDER BY total DESC;",
        "order": true,
        "tables": ["payment"],
        "hint": "Zgrupuj płatności wewnątrz CTE, a w głównym zapytaniu przefiltruj WHERE total > 150.",
        "newFeature": { "title": "Agregacja wewnątrz CTE", "desc": "Policzenie sum w CTE pozwala w głównym zapytaniu użyć zwykłego WHERE zamiast HAVING.", "example": "WITH s AS (SELECT k_id, SUM(kwota) AS suma FROM p GROUP BY k_id) SELECT * FROM s WHERE suma > 100;" }
      },
      {
        "stepCode": "2",
        "keySuffix": "2",
        "isWarmup": false,
        "tier": "standard",
        "goal": "Sprawdź, które kategorie filmów zawierają ponad 50 pozycji.",
        "prompt": "W bloku CTE cat_stats oblicz liczbę filmów (jako cnt) dla każdego category_id. W zapytaniu głównym wyświetl kategorie z cnt > 50.",
        "sol": "WITH cat_stats AS (SELECT category_id, COUNT(*) AS cnt FROM film_category GROUP BY category_id) SELECT category_id, cnt FROM cat_stats WHERE cnt > 50;",
        "order": false,
        "tables": ["film_category"],
        "hint": "Użyj CTE cat_stats z COUNT(*) AS cnt GROUP BY category_id.",
        "newFeature": { "title": "Przejrzysta logika filtrowania", "desc": "CTE rozdziela logikę agregacji danych od logiki biznesowych progów filtrowania.", "example": "WITH c AS (SELECT cat, COUNT(*) AS n FROM t GROUP BY cat) SELECT * FROM c WHERE n > 50;" }
      },
      {
        "stepCode": "3",
        "keySuffix": "3",
        "isWarmup": false,
        "tier": "standard",
        "goal": "Oblicz łączne przychody dla poszczególnych oddziałów wypożyczalni.",
        "prompt": "W bloku CTE store_sales połącz tabele payment, staff i store, sumując kwoty (jako rev) w podziale na st.store_id. W głównym zapytaniu wyświetl store_id oraz rev.",
        "sol": "WITH store_sales AS (SELECT st.store_id, SUM(p.amount) AS rev FROM payment p JOIN staff s ON p.staff_id = s.staff_id JOIN store st ON s.store_id = st.store_id GROUP BY st.store_id) SELECT store_id, rev FROM store_sales;",
        "order": false,
        "tables": ["payment", "staff", "store"],
        "hint": "Połącz tabele wewnątrz bloku CTE i zgrupuj po st.store_id.",
        "newFeature": { "title": "Łączenie tabel w CTE", "desc": "Skomplikowane relacje JOIN możesz zamknąć wewnątrz CTE, aby główne zapytanie pozostało zwięzłe.", "example": "WITH s AS (SELECT o.id, SUM(p.cena) AS suma FROM o JOIN p ON o.id = p.o_id GROUP BY o.id) SELECT * FROM s;" }
      },
      {
        "stepCode": "4",
        "keySuffix": "4",
        "isWarmup": false,
        "tier": "challenge",
        "goal": "Wyszukaj dane osobowe klientów, którzy wydali w wypożyczalni łącznie ponad 180 zł.",
        "prompt": "W bloku high_spenders znajdź customer_id klientów o sumie płatności > 180. W zapytaniu głównym połącz tabelę customer z tym blokiem, aby wyświetlić imię i nazwisko tych klientów.",
        "sol": "WITH high_spenders AS (SELECT customer_id FROM payment GROUP BY customer_id HAVING SUM(amount) > 180) SELECT c.first_name, c.last_name FROM customer c JOIN high_spenders h ON c.customer_id = h.customer_id;",
        "order": false,
        "tables": ["payment", "customer"],
        "hint": "Połącz tabelę customer z blokiem CTE przez customer_id.",
        "newFeature": { "title": "Łączenie tabeli głównej z CTE", "desc": "Blok CTE zachowuje się dokładnie jak zwykła tabela — możesz do niego dołączyć kolejne tabele przez JOIN.", "example": "WITH top AS (...) SELECT k.imie FROM klienci k JOIN top t ON k.id = t.k_id;" }
      }
    ]
  },
  {
    "id": "p5_3",
    "stage": 8,
    "unlockAt": 3,
    "title": "8.2 Funkcje okna: OVER(PARTITION BY) oraz rankingi ROW_NUMBER, RANK, DENSE_RANK",
    "tables": ["film", "payment"],
    "cols": ["SELECT", "FROM", "ROW_NUMBER", "RANK", "DENSE_RANK", "OVER", "PARTITION BY", "ORDER BY", "DESC", "ASC", "LIMIT", "WITH", "WHERE", "title", "length", "rating", "rental_rate", "rn", "rk", "rnk", "customer_id", "amount", "payment_date", "payment_id", "transakcja_nr"],
    "theory": "<ul><li><strong>Funkcje okna:</strong> wykonują obliczenia na zbiorze wierszy powiązanych z bieżącym rekordem bez zwijania wierszy w jeden (w przeciwieństwie do <code>GROUP BY</code>).</li><li><strong><code>OVER (...)</code>:</strong> definiuje ramkę okna.</li><li><strong><code>ROW_NUMBER()</code>:</strong> nadaje kolejny unikalny numer 1, 2, 3... bez powtórzeń.</li><li><strong><code>RANK()</code>:</strong> przy remisie nadaje tę samą rangę, ale zostawia luki w numeracji (np. 1, 2, 2, 4).</li><li><strong><code>DENSE_RANK()</code>:</strong> przy remisie nadaje tę samą rangę bez tworzenia luk (np. 1, 2, 2, 3).</li><li><strong><code>PARTITION BY</code>:</strong> dzieli dane na niezależne grupy rankingowe.</li></ul><div class=\"theory-code\"><code>SELECT title, rating, length,\n  ROW_NUMBER() OVER (PARTITION BY rating ORDER BY length DESC) AS pozycja\nFROM film;</code></div>",
    "variants": [
      {
        "stepCode": "R1",
        "keySuffix": "r1",
        "isWarmup": true,
        "tier": "warmup",
        "goal": "Ponumeruj 5 najdłuższych filmów w katalogu.",
        "prompt": "Pobierz tytuł, długość filmu oraz kolejny numer jako rn za pomocą funkcji ROW_NUMBER() posortowanej malejąco po długości i rosnąco po tytule. Ogranicz wynik do 5 wierszy.",
        "sol": "SELECT title, length, ROW_NUMBER() OVER (ORDER BY length DESC, title ASC) AS rn FROM film LIMIT 5;",
        "order": false,
        "tables": ["film"],
        "hint": "Użyj ROW_NUMBER() OVER (ORDER BY length DESC, title ASC) AS rn LIMIT 5;",
        "newFeature": { "title": "Funkcja okna: ROW_NUMBER()", "desc": "ROW_NUMBER() przydziela kolejny unikalny numer wiersza w zdefiniowanym porządku okna.", "example": "SELECT nazwa, ROW_NUMBER() OVER (ORDER BY pensja DESC) AS ranking FROM pracownicy;" }
      },
      {
        "stepCode": "1",
        "keySuffix": "1",
        "isWarmup": false,
        "tier": "standard",
        "goal": "Ustal pozycję filmów w rankingach cenowych w ramach każdej kategorii wiekowej bez powstawania luk.",
        "prompt": "Pobierz rating, title, rental_rate oraz pozycję w rankingu jako rk za pomocą funkcji DENSE_RANK() z podziałem na grupy wiekowe (PARTITION BY rating) i sortowaniem malejąco po cenie wypożyczenia i alfabetycznie po tytule. Pobierz 10 wierszy.",
        "sol": "SELECT rating, title, rental_rate, DENSE_RANK() OVER (PARTITION BY rating ORDER BY rental_rate DESC, title ASC) AS rk FROM film LIMIT 10;",
        "order": false,
        "tables": ["film"],
        "hint": "Użyj DENSE_RANK() OVER (PARTITION BY rating ORDER BY rental_rate DESC, title ASC) AS rk LIMIT 10;",
        "newFeature": { "title": "Gęsty ranking: DENSE_RANK()", "desc": "DENSE_RANK() przyznaje te same miejsca przy jednakowych wartościach i nie pomija kolejnych numerów.", "example": "SELECT kategoria, produkt, DENSE_RANK() OVER (PARTITION BY kategoria ORDER BY cena DESC) FROM cennik;" }
      },
      {
        "stepCode": "2",
        "keySuffix": "2",
        "isWarmup": false,
        "tier": "standard",
        "goal": "Sporządź klasyczny ranking długości filmów w ramach grup wiekowych (z uwzględnieniem luk przy remisach).",
        "prompt": "Pobierz rating, title, length oraz pozycję jako rnk za pomocą funkcji RANK() partycjonowanej po rating i sortowanej malejąco po długości oraz rosnąco po tytule. Ogranicz do 10 wierszy.",
        "sol": "SELECT rating, title, length, RANK() OVER (PARTITION BY rating ORDER BY length DESC, title ASC) AS rnk FROM film LIMIT 10;",
        "order": false,
        "tables": ["film"],
        "hint": "Zastosuj RANK() OVER (PARTITION BY rating ORDER BY length DESC, title ASC) AS rnk LIMIT 10;",
        "newFeature": { "title": "Klasyczny ranking sportowy: RANK()", "desc": "RANK() przy remisie przypisuje to samo miejsce, ale tworzy lukę o liczbie powtórzonych pozycji.", "example": "SELECT dzial, pracownik, RANK() OVER (PARTITION BY dzial ORDER BY premia DESC) FROM kadry;" }
      },
      {
        "stepCode": "3",
        "keySuffix": "3",
        "isWarmup": false,
        "tier": "standard",
        "goal": "Wybierz dokładnie dwa najdłuższe filmy dla każdej kategorii wiekowej (Top 2 per grupa).",
        "prompt": "W bloku CTE ranked ponumeruj filmy (ROW_NUMBER) w ramach każdego ratingu po długości malejąco (i tytule rosnąco) jako rn. W zapytaniu głównym wybierz title, rating, length oraz rn dla wierszy z rn <= 2.",
        "sol": "WITH ranked AS (SELECT title, rating, length, ROW_NUMBER() OVER (PARTITION BY rating ORDER BY length DESC, title ASC) AS rn FROM film) SELECT title, rating, length, rn FROM ranked WHERE rn <= 2;",
        "order": false,
        "tables": ["film"],
        "hint": "Zastosuj CTE, ponieważ funkcji okna nie można użyć bezpośrednio w klauzuli WHERE.",
        "newFeature": { "title": "Top-N w grupie przy użyciu CTE", "desc": "Zamknięcie ROW_NUMBER() w bloku CTE pozwala w głównym zapytaniu odfiltrować najlepsze pozycje (rn <= N).", "example": "WITH r AS (SELECT *, ROW_NUMBER() OVER (PARTITION BY kat ORDER BY pkt DESC) AS rn FROM test) SELECT * FROM r WHERE rn <= 3;" }
      },
      {
        "stepCode": "4",
        "keySuffix": "4",
        "isWarmup": false,
        "tier": "challenge",
        "goal": "Ponumeruj chronologicznie transakcje każdego klienta od jego pierwszej wizyty.",
        "prompt": "Pobierz customer_id, amount, payment_date oraz kolejny numer wpłaty danego klienta jako transakcja_nr za pomocą funkcji ROW_NUMBER() partycjonowanej po customer_id i posortowanej chronologicznie po payment_date oraz payment_id. Pobierz 10 wierszy.",
        "sol": "SELECT customer_id, amount, payment_date, ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY payment_date ASC, payment_id ASC) AS transakcja_nr FROM payment LIMIT 10;",
        "order": false,
        "tables": ["payment"],
        "hint": "Użyj ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY payment_date ASC, payment_id ASC) AS transakcja_nr LIMIT 10;",
        "newFeature": { "title": "Numeracja zdarzeń w czasie", "desc": "Partycjonowanie po ID klienta i sortowanie po dacie pozwala natychmiast zidentyfikować 1., 2. i n-tą transakcję użytkownika.", "example": "SELECT user_id, data, ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY data) FROM logi;" }
      }
    ]
  },
  {
    "id": "p5_4",
    "stage": 8,
    "unlockAt": 3,
    "title": "8.3 Porównania w czasie i sumy kroczące: LAG(), LEAD() i SUM() OVER",
    "tables": ["payment"],
    "cols": ["SELECT", "FROM", "LAG", "LEAD", "SUM", "AVG", "OVER", "PARTITION BY", "ORDER BY", "ROUND", "LIMIT", "WITH", "GROUP BY", "DATE_TRUNC", "payment_id", "customer_id", "amount", "prev_amount", "running_total", "next_amount", "avg_cust_amount", "payment_date", "miesiac", "rev", "prev_rev", "mom_pct"],
    "theory": "<ul><li><strong><code>LAG(kolumna, n)</code>:</strong> sięga do wartości z poprzedniego wiersza (np. do poprzedniej transakcji lub wyniku z zeszłego miesiąca).</li><li><strong><code>LEAD(kolumna, n)</code>:</strong> sięga do wartości z kolejnego wiersza w zdefiniowanym porządku.</li><li><strong>Suma krocząca:</strong> <code>SUM(kwota) OVER (ORDER BY data)</code> sumuje wartości od początku do bieżącego wiersza (narastająco).</li><li><strong>Średnia grupowa w wierszu:</strong> <code>AVG(kwota) OVER (PARTITION BY klient_id)</code> dołącza średnią klienta do każdego jego wiersza bez grupowania tabeli.</li></ul><div class=\"theory-code\"><code>SELECT payment_id, amount,\n  LAG(amount) OVER (ORDER BY payment_date) AS poprzednia_kwota,\n  SUM(amount) OVER (ORDER BY payment_date) AS suma_narastajaca\nFROM payment;</code></div>",
    "variants": [
      {
        "stepCode": "R1",
        "keySuffix": "r1",
        "isWarmup": true,
        "tier": "warmup",
        "goal": "Sprawdź poprzednią kwotę wpłaconą przez klienta, aby wykryć zmiany w zachowaniu zakupowym.",
        "prompt": "Dla każdego wpisu pobierz payment_id, customer_id, amount oraz wartość poprzedniej wpłaty danego klienta jako prev_amount za pomocą funkcji LAG() partycjonowanej po customer_id i posortowanej po payment_date oraz payment_id. Pobierz 10 wierszy.",
        "sol": "SELECT payment_id, customer_id, amount, LAG(amount) OVER (PARTITION BY customer_id ORDER BY payment_date, payment_id) AS prev_amount FROM payment LIMIT 10;",
        "order": false,
        "tables": ["payment"],
        "hint": "Użyj LAG(amount) OVER (PARTITION BY customer_id ORDER BY payment_date, payment_id) AS prev_amount LIMIT 10;",
        "newFeature": { "title": "Funkcja LAG(): odczyt poprzedniego wiersza", "desc": "LAG(kolumna) zwraca wartość z poprzedniego wiersza w ramach partycji i sortowania.", "example": "SELECT data, utarg, LAG(utarg) OVER (ORDER BY data) AS utarg_wczoraj FROM raport;" }
      },
      {
        "stepCode": "1",
        "keySuffix": "1",
        "isWarmup": false,
        "tier": "standard",
        "goal": "Oblicz sumę kroczącą (narastającą) wydatków każdego klienta wraz z kolejnymi płatnościami.",
        "prompt": "Pobierz payment_id, customer_id, amount oraz sumę kroczącą jako running_total za pomocą funkcji SUM(amount) OVER partycjonowanej po customer_id i sortowanej po payment_date i payment_id. Pobierz 10 wierszy.",
        "sol": "SELECT payment_id, customer_id, amount, SUM(amount) OVER (PARTITION BY customer_id ORDER BY payment_date, payment_id) AS running_total FROM payment LIMIT 10;",
        "order": false,
        "tables": ["payment"],
        "hint": "Użyj SUM(amount) OVER (PARTITION BY customer_id ORDER BY payment_date, payment_id) AS running_total LIMIT 10;",
        "newFeature": { "title": "Suma krocząca (Running Total)", "desc": "SUM() z klauzulą ORDER BY w oknie sumuje wartości narastająco wiersz po wierszu.", "example": "SELECT data, wplata, SUM(wplata) OVER (ORDER BY data) AS saldo FROM konto;" }
      },
      {
        "stepCode": "2",
        "keySuffix": "2",
        "isWarmup": false,
        "tier": "standard",
        "goal": "Podejrzyj kwotę kolejnej transakcji w systemie.",
        "prompt": "Pobierz payment_id, amount oraz kwotę następnej zarejestrowanej płatności jako next_amount za pomocą funkcji LEAD(amount) posortowanej chronologicznie po payment_date i payment_id. Pobierz 5 wierszy.",
        "sol": "SELECT payment_id, amount, LEAD(amount) OVER (ORDER BY payment_date, payment_id) AS next_amount FROM payment LIMIT 5;",
        "order": false,
        "tables": ["payment"],
        "hint": "Zastosuj LEAD(amount) OVER (ORDER BY payment_date, payment_id) AS next_amount LIMIT 5;",
        "newFeature": { "title": "Funkcja LEAD(): odczyt kolejnego wiersza", "desc": "LEAD(kolumna) zwraca wartość z następnego wiersza w oknie.", "example": "SELECT tura, wynik, LEAD(wynik) OVER (ORDER BY tura) AS nastepny_wynik FROM gra;" }
      },
      {
        "stepCode": "3",
        "keySuffix": "3",
        "isWarmup": false,
        "tier": "standard",
        "goal": "Porównaj pojedyncze płatności ze średnią kwotą transakcji danego klienta.",
        "prompt": "Pobierz payment_id, customer_id, amount oraz średnią kwotę wydatków tego klienta jako avg_cust_amount za pomocą funkcji AVG(amount) OVER (PARTITION BY customer_id). Pobierz 10 wierszy.",
        "sol": "SELECT payment_id, customer_id, amount, AVG(amount) OVER (PARTITION BY customer_id) AS avg_cust_amount FROM payment LIMIT 10;",
        "order": false,
        "tables": ["payment"],
        "hint": "Użyj AVG(amount) OVER (PARTITION BY customer_id) AS avg_cust_amount LIMIT 10;",
        "newFeature": { "title": "Średnia bez GROUP BY", "desc": "Funkcja agregująca z klauzulą OVER(PARTITION BY ...) dołącza wyliczoną średnią do każdego pojedynczego wiersza.", "example": "SELECT id, pracownik, pensja, AVG(pensja) OVER (PARTITION BY dzial) AS srednia_dzialu FROM k;" }
      },
      {
        "stepCode": "4",
        "keySuffix": "4",
        "isWarmup": false,
        "tier": "challenge",
        "goal": "Oblicz dynamikę sprzedaży miesiąc do miesiąca (MoM % growth).",
        "prompt": "W bloku CTE m oblicz miesięczne przychody (jako rev) grupując po miesiącu (DATE_TRUNC('month', payment_date::timestamp)::date jako miesiac). W głównym zapytaniu pobierz miesiac, rev, poprzedni miesięczny przychód jako prev_rev (używając LAG) oraz procentową zmianę jako mom_pct zaokrągloną do 2 miejsc: ROUND((rev - LAG(rev) OVER (ORDER BY miesiac)) * 100.0 / LAG(rev) OVER (ORDER BY miesiac), 2).",
        "sol": "WITH m AS (SELECT DATE_TRUNC('month', payment_date::timestamp)::date AS miesiac, SUM(amount) AS rev FROM payment GROUP BY 1) SELECT miesiac, rev, LAG(rev) OVER (ORDER BY miesiac) AS prev_rev, ROUND((rev - LAG(rev) OVER (ORDER BY miesiac)) * 100.0 / LAG(rev) OVER (ORDER BY miesiac), 2) AS mom_pct FROM m;",
        "order": false,
        "tables": ["payment"],
        "hint": "W CTE zgrupuj po miesiącu, a w głównym zapytaniu zastosuj LAG(rev) OVER (ORDER BY miesiac) w obliczeniu mom_pct.",
        "newFeature": { "title": "Zaawansowana analityka MoM (Month-over-Month)", "desc": "Połączenie CTE z funkcją LAG() pozwala błyskawicznie liczyć wskaźniki dynamiki wzrostu w czasie.", "example": "WITH m AS (SELECT mc, SUM(kw) AS rev FROM t GROUP BY 1) SELECT mc, rev, ROUND((rev - LAG(rev) OVER (ORDER BY mc)) * 100.0 / LAG(rev) OVER (ORDER BY mc), 2) FROM m;" }
      }
    ]
  }
];

var LESSON_TUTORIALS = {
  "p1_1": [
    {
      "title": "Pierwsze zapytanie SQL: SELECT i FROM",
      "syntax": "SELECT kolumna1, kolumna2\nFROM nazwa_tabeli;",
      "bullets": [
        "<strong><code>SELECT</code>:</strong> służy do wyciągania kolumn z bazy danych.",
        "<strong><code>FROM</code>:</strong> wskazuje tabelę, z której pobierasz dane.",
        "<strong>Gwiazdka <code>*</code>:</strong> pobiera wszystkie kolumny z tabeli bez ich ręcznego wymieniania."
      ]
    },
    {
      "title": "Kolejność w kodzie vs Silnik bazy",
      "focusWrite": ["SELECT", "FROM"],
      "focusExec": [1, 5],
      "note": "<strong>Zasada działania:</strong> W kodzie piszesz najpierw <code>SELECT</code>, a potem <code>FROM</code>. Silnik PostgreSQL najpierw otwiera tabelę z <code>FROM</code>, a dopiero potem wycina wskazane kolumny."
    },
    {
      "title": "Przykład na żywo (dvdrental)",
      "code": "SELECT title, rental_rate\nFROM film;",
      "lines": [
        { "line": "FROM film;", "desc": "Silnik otwiera tabelę film." },
        { "line": "SELECT title, rental_rate", "desc": "Silnik wybiera tytuł i cenę do tabeli wynikowej." }
      ]
    },
    {
      "title": "Sprawdź się przed zadaniami!",
      "quiz": {
        "question": "Które zapytanie poprawnie pobierze kolumny `first_name` oraz `last_name` z tabeli `actor`?",
        "options": [
          "SELECT first_name last_name FROM actor;",
          "SELECT first_name, last_name FROM actor;",
          "FROM actor SELECT first_name, last_name;"
        ],
        "correct": 1,
        "explanation": "Prawidłowo! Wymieniane kolumny oddzielamy przecinkami, a FROM wskazuje tabelę."
      }
    }
  ],

  "p1_2": [
    {
      "title": "Aliasy AS i obliczenia arytmetyczne",
      "syntax": "SELECT kolumna AS nowa_nazwa,\n       cena * 1.23 AS cena_brutto\nFROM cennik;",
      "bullets": [
        "<strong><code>AS nazwa</code>:</strong> nadaje kolumnie czytelną etykietę w wynikach zapytania.",
        "<strong>Arytmetyka SQL:</strong> możesz używać operatorów <code>+</code>, <code>-</code>, <code>*</code>, <code>/</code> bezpośrednio w SELECT.",
        "<strong>Bezpieczne nazwy:</strong> unikaj spacji i znaków specjalnych w aliasach (używaj znaku podkreślenia <code>_</code>)."
      ]
    },
    {
      "title": "Kolejność w kodzie vs Silnik bazy",
      "focusWrite": ["SELECT", "AS", "FROM"],
      "focusExec": [1, 5],
      "note": "Silnik najpierw pobiera dane z tabeli, a potem wykonuje obliczenia matematyczne i przypisuje aliasy w locie."
    },
    {
      "title": "Przykład: Różnica kosztów",
      "code": "SELECT title, replacement_cost - rental_rate AS cost_diff\nFROM film;",
      "lines": [
        { "line": "FROM film;", "desc": "Pobiera dane z tabeli film." },
        { "line": "replacement_cost - rental_rate", "desc": "Odejmuje stawkę wypożyczenia od kosztu wymiany płyty." },
        { "line": "AS cost_diff", "desc": "Zapisuje wynik pod czytelnym aliasem cost_diff." }
      ]
    },
    {
      "title": "Szybki quiz",
      "quiz": {
        "question": "Jak poprawnie przemnożyć kolumnę `amount` przez 4.30 i nadać jej alias `kwota_pln`?",
        "options": [
          "SELECT amount * 4.30 AS kwota_pln FROM payment;",
          "SELECT amount * 4.30 TO kwota_pln FROM payment;",
          "SELECT kwota_pln = amount * 4.30 FROM payment;"
        ],
        "correct": 0,
        "explanation": "Znakomicie! W SQL aliasy nadajemy za pomocą słowa kluczowego AS."
      }
    }
  ],

  "p1_3": [
    {
      "title": "Usuwanie duplikatów: DISTINCT",
      "syntax": "SELECT DISTINCT kolumna\nFROM tabela;",
      "bullets": [
        "<strong><code>DISTINCT</code>:</strong> eliminuje powtarzające się wiersze ze zbioru wynikowego.",
        "<strong>Pozycja:</strong> słowo <code>DISTINCT</code> stawia się zawsze bezpośrednio po słowie <code>SELECT</code>.",
        "<strong>Wielokolumnowy DISTINCT:</strong> sprawdza unikalność całej kombinacji wybranych kolumn."
      ]
    },
    {
      "title": "Kiedy silnik usuwa duplikaty?",
      "focusWrite": ["SELECT", "DISTINCT", "FROM"],
      "focusExec": [1, 5, 6],
      "note": "DISTINCT wykonuje się dopiero po wycięciu kolumn przez SELECT, tuż przed ostatecznym wyświetleniem tabeli."
    },
    {
      "title": "Przykład: Unikalne stawki wypożyczeń",
      "code": "SELECT DISTINCT rental_rate\nFROM film;",
      "lines": [
        { "line": "FROM film;", "desc": "Otwiera tabelę film." },
        { "line": "SELECT DISTINCT rental_rate", "desc": "Zwraca tylko unikalne wartości stawek (np. 0.99, 2.99, 4.99)." }
      ]
    },
    {
      "title": "Szybki quiz",
      "quiz": {
        "question": "Gdzie w zapytaniu należy umieścić słowo DISTINCT?",
        "options": [
          "Na samym końcu zapytania po nazwie tabeli",
          "Bezpośrednio po słowie SELECT przed nazwami kolumn",
          "W klauzuli FROM przed nazwą tabeli"
        ],
        "correct": 1,
        "explanation": "Zgadza się! W SQL składnia to SELECT DISTINCT kolumna FROM tabela."
      }
    }
  ],

  "p1_4": [
    {
      "title": "Sortowanie wyników: ORDER BY (ASC i DESC)",
      "syntax": "SELECT kolumna1, kolumna2\nFROM tabela\nORDER BY kolumna2 DESC;",
      "bullets": [
        "<strong><code>ORDER BY</code>:</strong> układa wiersze według podanych kolumn.",
        "<strong><code>ASC</code>:</strong> sortowanie rosnące (domyślne: od A do Z, od najmniejszej do największej).",
        "<strong><code>DESC</code>:</strong> sortowanie malejące (od Z do A, od największej do najmniejszej).",
        "<strong>Sortowanie wielokolumnowe:</strong> oddzielaj kryteria przecinkami (np. <code>ORDER BY rating ASC, length DESC</code>)."
      ]
    },
    {
      "title": "Kolejność w silniku",
      "focusWrite": ["SELECT", "FROM", "ORDER BY"],
      "focusExec": [1, 5, 7],
      "note": "ORDER BY wykonuje się na samym końcu — sortuje już wycięte i przeliczone kolumny."
    },
    {
      "title": "Przykład: Najdłuższe filmy",
      "code": "SELECT title, length\nFROM film\nORDER BY length DESC, title ASC;",
      "lines": [
        { "line": "FROM film;", "desc": "Pobiera filmy." },
        { "line": "SELECT title, length", "desc": "Wybiera tytuł i długość." },
        { "line": "ORDER BY length DESC, title ASC;", "desc": "Sortuje od najdłuższych, a przy równej długości alfabetycznie." }
      ]
    },
    {
      "title": "Szybki quiz",
      "quiz": {
        "question": "Jak posortować wiersze malejąco od najwyższej wartości?",
        "options": [
          "ORDER BY cena ASC",
          "ORDER BY cena DESC",
          "SORT BY cena DOWN"
        ],
        "correct": 1,
        "explanation": "Dokładnie tak! DESC to skrót od descending (malejąco)."
      }
    }
  ],

  "p2_0": [
    {
      "title": "Ograniczanie wierszy: LIMIT i OFFSET",
      "syntax": "SELECT tytul\nFROM filmy\nORDER BY data DESC\nLIMIT 10 OFFSET 20;",
      "bullets": [
        "<strong><code>LIMIT N</code>:</strong> pobiera maksymalnie N pierwszych wierszy.",
        "<strong><code>OFFSET M</code>:</strong> pomija pierwsze M wierszy przed zwróceniem wyniku.",
        "<strong>Paginacja:</strong> połączenie LIMIT i OFFSET pozwala budować podział na strony (np. strona 3 po 10 wyników: LIMIT 10 OFFSET 20).",
        "<strong>Zawsze z ORDER BY:</strong> bez sortowania kolejność wierszy w bazie może być losowa!"
      ]
    },
    {
      "title": "Kolejność wykonywania w silniku",
      "focusWrite": ["SELECT", "FROM", "ORDER BY", "LIMIT", "OFFSET"],
      "focusExec": [1, 5, 7, 8, 9],
      "note": "LIMIT i OFFSET działają jak ostateczny filtr odcinający — wykonują się na samym końcu procesu zapytania."
    },
    {
      "title": "Przykład: Druga strona cennika",
      "code": "SELECT title, rental_rate\nFROM film\nORDER BY film_id ASC\nLIMIT 5 OFFSET 5;",
      "lines": [
        { "line": "ORDER BY film_id ASC", "desc": "Ustala stałą kolejność rekordów." },
        { "line": "OFFSET 5", "desc": "Pomija pierwsze 5 filmów (stronę 1)." },
        { "line": "LIMIT 5;", "desc": "Pobiera kolejne 5 pozycji (stronę 2)." }
      ]
    },
    {
      "title": "Szybki quiz",
      "quiz": {
        "question": "Jak wyświetlić dokładnie 3 pozycje, pomijając pierwsze 10?",
        "options": [
          "LIMIT 3 OFFSET 10",
          "OFFSET 3 LIMIT 10",
          "PAGE 2 LIMIT 3"
        ],
        "correct": 0,
        "explanation": "Świetnie! LIMIT 3 określa wielkość paczki, a OFFSET 10 liczbę pomijanych wierszy."
      }
    }
  ],

  "p2_1": [
    {
      "title": "Proste warunki filtrowania: WHERE",
      "syntax": "SELECT * FROM tabela\nWHERE kolumna = 'wartość';",
      "bullets": [
        "<strong><code>WHERE</code>:</strong> odrzuca wiersze, które nie spełniają podanego warunku logicznego.",
        "<strong>Operatory porównania:</strong> <code>=</code> (równe), <code>!=</code> lub <code><></code> (różne), <code>></code>, <code><</code>, <code>>=</code>, <code><=</code>.",
        "<strong>Teksty i daty:</strong> wartości tekstowe i daty zawsze ujmujemy w pojedyncze apostrofy (np. <code>'Action'</code>, <code>'2006-01-01'</code>)."
      ]
    },
    {
      "title": "Silnik filtruje PRZED wyborem kolumn",
      "focusWrite": ["SELECT", "FROM", "WHERE"],
      "focusExec": [1, 2, 5],
      "note": "Kluczowa zasada: Silnik najpierw otwiera tabelę (FROM), natychmiast filtruje wiersze (WHERE), a na końcu wybiera kolumny (SELECT)."
    },
    {
      "title": "Przykład: Filmy z kategorią wiekową PG-13",
      "code": "SELECT title, rating\nFROM film\nWHERE rating = 'PG-13';",
      "lines": [
        { "line": "FROM film", "desc": "Przegląda katalog filmów." },
        { "line": "WHERE rating = 'PG-13';", "desc": "Zostawia tylko wiersze o ratingu PG-13." },
        { "line": "SELECT title, rating", "desc": "Wypisuje tytuł i rating." }
      ]
    },
    {
      "title": "Szybki quiz",
      "quiz": {
        "question": "Który warunek wskaże filmy o cenie różnej od 4.99?",
        "options": [
          "WHERE rental_rate != 4.99",
          "WHERE rental_rate NOT 4.99",
          "WHERE rental_rate IS NOT 4.99"
        ],
        "correct": 0,
        "explanation": "Brawo! Operator != (lub <>) sprawdza nierówność."
      }
    }
  ],

  "p2_2": [
    {
      "title": "Łączenie warunków: AND, OR oraz NOT",
      "syntax": "SELECT * FROM tabela\nWHERE warunek1 AND (warunek2 OR warunek3);",
      "bullets": [
        "<strong><code>AND</code>:</strong> oba warunki muszą być spełnione jednocześnie (koniunkcja).",
        "<strong><code>OR</code>:</strong> wystarczy, że przynajmniej jeden z warunków jest spełniony (alternatywa).",
        "<strong><code>NOT</code>:</strong> odwraca wynik logiczny warunku (negacja).",
        "<strong>Nawiasy <code>()</code>:</strong> zawsze kontroluj kolejność logiczną za pomocą nawiasów — AND ma wyższy priorytet niż OR!"
      ]
    },
    {
      "title": "Priorytet operatorów logicznych",
      "focusWrite": ["WHERE", "(", "OR", ")", "AND"],
      "focusExec": [2],
      "note": "Silnik bez nawiasów połączy najpierw warunki z AND. Stosuj nawiasy, aby wymusić alternatywę OR."
    },
    {
      "title": "Przykład: Tanie lub krótkie filmy familijne",
      "code": "SELECT title, rental_rate, length, rating\nFROM film\nWHERE rating = 'G' AND (rental_rate < 2.00 OR length < 60);",
      "lines": [
        { "line": "WHERE rating = 'G'", "desc": "Film bezwzględnie musi mieć rating familijny G." },
        { "line": "AND (rental_rate < 2.00 OR length < 60)", "desc": "Musi być tani ALBO krótki." }
      ]
    },
    {
      "title": "Szybki quiz",
      "quiz": {
        "question": "Co zwróci warunek: WHERE active = 1 AND (store_id = 1 OR store_id = 2)?",
        "options": [
          "Wszystkich klientów ze sklepu 1 oraz aktywnych ze sklepu 2",
          "Tylko aktywnych klientów przypisanych do sklepu 1 lub 2",
          "Wszystkich klientów ze sklepów 1 i 2"
        ],
        "correct": 1,
        "explanation": "Znakomicie! Nawias wymusza sprawdzenie wyboru sklepu przy zachowaniu warunku aktywności."
      }
    }
  ],

  "p2_3": [
    {
      "title": "Zakresy i listy wartości: BETWEEN oraz IN",
      "syntax": "SELECT * FROM tabela\nWHERE wiek BETWEEN 18 AND 30\n  AND kraj IN ('PL', 'DE', 'FR');",
      "bullets": [
        "<strong><code>BETWEEN a AND b</code>:</strong> sprawdza czy wartość mieści się w przedziale obustronnie domkniętym [a, b].",
        "<strong><code>IN (wartość1, wartość2, ...)</code>:</strong> sprawdza czy wartość znajduje się na liście dopuszczalnych elementów.",
        "<strong><code>NOT IN</code> i <code>NOT BETWEEN</code>:</strong> wykluczają podane zakresy i zbiory."
      ]
    },
    {
      "title": "Kolejność w silniku",
      "focusWrite": ["SELECT", "FROM", "WHERE", "IN", "BETWEEN"],
      "focusExec": [1, 2, 5],
      "note": "IN i BETWEEN to czytelne skróty ułatwiające pisanie długich łańcuchów warunków OR."
    },
    {
      "title": "Przykład: Filmy o umiarkowanej długości",
      "code": "SELECT title, length, rating\nFROM film\nWHERE rating IN ('PG', 'G')\n  AND length BETWEEN 60 AND 90;",
      "lines": [
        { "line": "rating IN ('PG', 'G')", "desc": "Odpowiednik: rating = 'PG' OR rating = 'G'." },
        { "line": "length BETWEEN 60 AND 90", "desc": "Odpowiednik: length >= 60 AND length <= 90." }
      ]
    },
    {
      "title": "Szybki quiz",
      "quiz": {
        "question": "Czy warunek BETWEEN 10 AND 20 włączy liczbę 10 i liczbę 20?",
        "options": [
          "Tak, przedział BETWEEN jest obustronnie domknięty (>= 10 oraz <= 20)",
          "Nie, odrzuca wartości brzegowe",
          "Tylko liczbę 10, a 20 odrzuca"
        ],
        "correct": 0,
        "explanation": "Zgadza się! BETWEEN w SQL zawsze zawiera w sobie obie wartości graniczne."
      }
    }
  ],

  "p2_4": [
    {
      "title": "Wyszukiwanie wzorców: LIKE i ILIKE",
      "syntax": "SELECT * FROM tabela\nWHERE tytul ILIKE 'super%';",
      "bullets": [
        "<strong><code>LIKE</code>:</strong> porównuje tekst ze wzorcem (uwzględnia wielkość liter: case-sensitive).",
        "<strong><code>ILIKE</code>:</strong> wersja PostgreSQL ignorująca wielkość liter (case-insensitive).",
        "<strong>Znak procenta <code>%</code>:</strong> zastępuje dowolną liczbę znaków (0, 1 lub wiele).",
        "<strong>Znak podkreślenia <code>_</code>:</strong> zastępuje dokładnie jeden dowolny znak."
      ]
    },
    {
      "title": "Przeszukiwanie tekstu w silniku",
      "focusWrite": ["SELECT", "FROM", "WHERE", "ILIKE"],
      "focusExec": [1, 2, 5],
      "note": "ILIKE 'matrix%' dopasuje 'Matrix', 'MATRIX' oraz 'matrix reloaded'."
    },
    {
      "title": "Przykład: Szukanie po tytule i emailu",
      "code": "SELECT first_name, last_name, email\nFROM customer\nWHERE email ILIKE '%@gmail.com'\n  AND first_name LIKE 'J%';",
      "lines": [
        { "line": "email ILIKE '%@gmail.com'", "desc": "Wszystkie maile kończące się na @gmail.com." },
        { "line": "first_name LIKE 'J%'", "desc": "Imiona zaczynające się na dużą literę J." }
      ]
    },
    {
      "title": "Szybki quiz",
      "quiz": {
        "question": "Jaki wzorzec dopasuje słowo zawierające fragment 'love' w dowolnym miejscu bez względu na wielkość liter?",
        "options": [
          "ILIKE '%love%'",
          "LIKE 'love*'",
          "== '%love%'"
        ],
        "correct": 0,
        "explanation": "Świetnie! Znak % z obu stron oznacza dowolny ciąg znaków, a ILIKE ignoruje wielkość liter."
      }
    }
  ],

  "p2_5": [
    {
      "title": "Wartości brakujące: IS NULL oraz IS NOT NULL",
      "syntax": "SELECT * FROM tabela\nWHERE data_zwrotu IS NULL;",
      "bullets": [
        "<strong><code>NULL</code>:</strong> oznacza brak wartości lub stan nieznany (nie jest towarem, zerem ani pustym tekstem).",
        "<strong>Nigdy <code>= NULL</code>:</strong> w SQL porównanie <code>kolumna = NULL</code> zawsze zwraca nieznany stan (UNKNOWN/FALSE)!",
        "<strong><code>IS NULL</code>:</strong> poprawny sposób na sprawdzenie czy pole jest puste.",
        "<strong><code>IS NOT NULL</code>:</strong> sprawdza czy pole ma przypisaną jakąkolwiek konkretną wartość."
      ]
    },
    {
      "title": "Logika trójwartościowa (3VL)",
      "focusWrite": ["WHERE", "IS NULL", "IS NOT NULL"],
      "focusExec": [2],
      "note": "Pamiętaj: NULL to stan 'nieznany'. Tylko specjalny operator IS NULL potrafi go wykryć."
    },
    {
      "title": "Przykład: Wypożyczenia w toku",
      "code": "SELECT rental_id, customer_id, rental_date\nFROM rental\nWHERE return_date IS NULL;",
      "lines": [
        { "line": "FROM rental", "desc": "Otwiera historię wypożyczeń." },
        { "line": "WHERE return_date IS NULL;", "desc": "Wybiera płyty, które jeszcze nie wróciły do wypożyczalni." }
      ]
    },
    {
      "title": "Szybki quiz",
      "quiz": {
        "question": "Dlaczego zapis WHERE return_date = NULL jest błędny?",
        "options": [
          "Bo z NULL nie można porównywać operatorem '=', należy użyć 'IS NULL'",
          "Bo NULL można stosować tylko w SELECT",
          "Bo wymaga cudzysłowu '= \"NULL\"'"
        ],
        "correct": 0,
        "explanation": "Dokładnie tak! W SQL do weryfikacji braku danych służy wyłącznie IS NULL / IS NOT NULL."
      }
    }
  ],

  "p2_6": [
    {
      "title": "Filtrowanie po datach i znacznikach czasu",
      "syntax": "SELECT * FROM zamowienia\nWHERE data_zamowienia >= '2026-01-01'\n  AND data_zamowienia < '2026-02-01';",
      "bullets": [
        "<strong>Format ISO:</strong> daty w SQL zapisujemy zawsze w formacie <code>'YYYY-MM-DD'</code> lub <code>'YYYY-MM-DD HH:MI:SS'</code>.",
        "<strong>Rzutowanie typów:</strong> operator <code>::date</code> obcina godzinę z pełnego znacznika czasu.",
        "<strong>Filtrowanie przedziału:</strong> bezpieczniej używać <code>>= 'od' AND < 'do'</code> niż porównywać dokładne znaczniki godzinowe."
      ]
    },
    {
      "title": "Porównywanie dat w silniku",
      "focusWrite": ["SELECT", "FROM", "WHERE", "::date"],
      "focusExec": [1, 2, 5],
      "note": "Silnik PostgreSQL porównuje daty chronologicznie: '2026-05-01' jest większe niż '2026-01-01'."
    },
    {
      "title": "Przykład: Wypożyczenia z maja 2026",
      "code": "SELECT rental_id, rental_date\nFROM rental\nWHERE rental_date >= '2026-05-01'\n  AND rental_date < '2026-06-01';",
      "lines": [
        { "line": "rental_date >= '2026-05-01'", "desc": "Początek miesiąca od północy." },
        { "line": "AND rental_date < '2026-06-01'", "desc": "Koniec miesiąca (przed północą 1 czerwca)." }
      ]
    },
    {
      "title": "Szybki quiz",
      "quiz": {
        "question": "W jakim formacie należy podać datę w zapytaniu SQL?",
        "options": [
          "'YYYY-MM-DD' (np. '2025-05-24')",
          "'DD.MM.YYYY' (np. '24.05.2025')",
          "Format dowolny"
        ],
        "correct": 0,
        "explanation": "Zgadza się! Standard SQL ISO-8601 to zawsze rok-miesiąc-dzień w apostrofach."
      }
    }
  ],

  "p3_1": [
    {
      "title": "Liczenie wierszy: COUNT(*), COUNT(kol) i COUNT(DISTINCT)",
      "syntax": "SELECT COUNT(*) AS total_wierszy,\n       COUNT(kolumna) AS uzupelnione,\n       COUNT(DISTINCT kolumna) AS unikalne\nFROM tabela;",
      "bullets": [
        "<strong><code>COUNT(*)</code>:</strong> zlicza wszystkie wiersze spełniające warunki (łącznie z wartościami NULL).",
        "<strong><code>COUNT(kolumna)</code>:</strong> zlicza wyłącznie wiersze, w których dana kolumna NIE jest NULL.",
        "<strong><code>COUNT(DISTINCT kolumna)</code>:</strong> zlicza liczbę unikalnych niepustych wartości."
      ]
    },
    {
      "title": "Kolejność w silniku",
      "focusWrite": ["SELECT", "COUNT", "FROM", "WHERE"],
      "focusExec": [1, 2, 5],
      "note": "Funkcja COUNT agreguje wiersze po przefiltrowaniu ich przez klauzulę WHERE."
    },
    {
      "title": "Przykład: Statystyka filmów",
      "code": "SELECT COUNT(*) AS total_films, COUNT(DISTINCT rating) AS ratings_cnt\nFROM film;",
      "lines": [
        { "line": "COUNT(*)", "desc": "Zlicza wszystkie filmy w tabeli." },
        { "line": "COUNT(DISTINCT rating)", "desc": "Zwraca 5 (liczba unikalnych kategorii wiekowych: G, PG, PG-13, R, NC-17)." }
      ]
    },
    {
      "title": "Szybki quiz",
      "quiz": {
        "question": "Czym różni się COUNT(*) od COUNT(kolumna)?",
        "options": [
          "COUNT(*) liczy wszystkie wiersze, a COUNT(kolumna) pomija wartości NULL",
          "Nie ma żadnej różnicy",
          "COUNT(kolumna) usuwa duplikaty"
        ],
        "correct": 0,
        "explanation": "Brawo! COUNT(kolumna) ignoruje wiersze, w których badana kolumna ma wartość NULL."
      }
    }
  ],

  "p3_2": [
    {
      "title": "Suma, średnia i skrajności: SUM, AVG, MIN, MAX",
      "syntax": "SELECT SUM(kwota) AS utarg,\n       ROUND(AVG(kwota), 2) AS srednia,\n       MIN(kwota) AS min_wplata,\n       MAX(kwota) AS max_wplata\nFROM platnosci;",
      "bullets": [
        "<strong><code>SUM(kolumna)</code>:</strong> dodaje do siebie wszystkie wartości liczbowe (ignoruje NULL).",
        "<strong><code>AVG(kolumna)</code>:</strong> oblicza średnią arytmetyczną z niepustych wartości.",
        "<strong><code>MIN(kolumna)</code> / <code>MAX(kolumna)</code>:</strong> znajduje najmniejszą i największą wartość (działa też na datach i tekstach!).",
        "<strong><code>ROUND(liczba, miejsca)</code>:</strong> zaokrągla wynik średniej do podanej liczby cyfr po przecinku."
      ]
    },
    {
      "title": "Agregacja całego zbioru",
      "focusWrite": ["SELECT", "SUM", "AVG", "FROM"],
      "focusExec": [1, 5],
      "note": "Gdy używasz funkcji agregującej bez GROUP BY, zapytanie zwija całą tabelę do dokładnie jednego wiersza wynikowego."
    },
    {
      "title": "Przykład: Statystyka płatności",
      "code": "SELECT SUM(amount) AS total_revenue, ROUND(AVG(amount), 2) AS avg_payment\nFROM payment;",
      "lines": [
        { "line": "SUM(amount)", "desc": "Sumuje kwoty wszystkich wpłat w wypożyczalni." },
        { "line": "ROUND(AVG(amount), 2)", "desc": "Liczy średnią wpłatę z dokładnością do groszy." }
      ]
    },
    {
      "title": "Szybki quiz",
      "quiz": {
        "question": "Co zrobi funkcja AVG(kolumna), gdy w kolumnie pojawią się wartości NULL?",
        "options": [
          "Zignoruje wiersze z NULL i policzy średnią z pozostałych",
          "Zwróci błąd",
          "Potraktuje NULL jako 0 i zaniży średnią"
        ],
        "correct": 0,
        "explanation": "Prawidłowo! Standardowe funkcje agregujące w SQL całkowicie pomijają wartości NULL."
      }
    }
  ],

  "p3_3": [
    {
      "title": "Grupowanie wierszy: GROUP BY",
      "syntax": "SELECT kategoria, COUNT(*) AS liczba\nFROM produkty\nGROUP BY kategoria;",
      "bullets": [
        "<strong><code>GROUP BY</code>:</strong> dzieli wiersze na grupy o tych samych wartościach w podanych kolumnach.",
        "<strong>Złota zasada SQL:</strong> każda kolumna w <code>SELECT</code>, która nie jest objęta funkcją agregującą, MUSI znaleźć się w <code>GROUP BY</code>!",
        "<strong>Grupowanie wielokolumnowe:</strong> podział na podgrupy (np. <code>GROUP BY rating, rental_rate</code>)."
      ]
    },
    {
      "title": "Kolejność wykonywania w silniku",
      "focusWrite": ["SELECT", "FROM", "WHERE", "GROUP BY"],
      "focusExec": [1, 2, 3, 5],
      "note": "Kluczowa kolejność: 1. FROM -> 2. WHERE (filtr wierszy) -> 3. GROUP BY (tworzenie grup) -> 4. SELECT (wyliczenie agregacji)."
    },
    {
      "title": "Przykład: Liczba filmów wg kategorii wiekowej",
      "code": "SELECT rating, COUNT(*) AS film_cnt, ROUND(AVG(length), 1) AS avg_len\nFROM film\nGROUP BY rating\nORDER BY film_cnt DESC;",
      "lines": [
        { "line": "GROUP BY rating", "desc": "Dzieli filmy na 5 koszyków (G, PG, PG-13, R, NC-17)." },
        { "line": "COUNT(*) / AVG(length)", "desc": "Liczy liczbę filmów i średnią długość dla każdego koszyka." }
      ]
    },
    {
      "title": "Szybki quiz",
      "quiz": {
        "question": "Dlaczego zapytanie SELECT rating, title, COUNT(*) FROM film GROUP BY rating; jest błędne?",
        "options": [
          "Kolumna 'title' nie znajduje się ani w GROUP BY, ani w funkcji agregującej",
          "Nie można używać COUNT(*) z tekstem",
          "Brakuje klauzuli WHERE"
        ],
        "correct": 0,
        "explanation": "Świetnie! Wszystkie niezagregowane kolumny w SELECT muszą znaleźć się w klauzuli GROUP BY."
      }
    }
  ],

  "p3_4": [
    {
      "title": "Filtrowanie grup: HAVING kontra WHERE",
      "syntax": "SELECT kategoria, COUNT(*) AS liczba\nFROM produkty\nWHERE cena > 10\nGROUP BY kategoria\nHAVING COUNT(*) >= 5;",
      "bullets": [
        "<strong><code>WHERE</code>:</strong> odrzuca pojedyncze wiersze PRZED utworzeniem grup.",
        "<strong><code>HAVING</code>:</strong> odrzuca całe grupy PO wykonaniu agregacji.",
        "<strong>Zapamiętaj:</strong> w klauzuli <code>WHERE</code> nigdy nie wolno używać funkcji agregujących takich jak <code>COUNT(*)</code> czy <code>SUM()</code> — do tego służy wyłącznie <code>HAVING</code>!"
      ]
    },
    {
      "title": "Potok przetwarzania",
      "focusWrite": ["WHERE", "GROUP BY", "HAVING"],
      "focusExec": [2, 3, 4],
      "note": "Silnik najpierw filtruje wiersze (WHERE), potem tworzy grupy (GROUP BY), a na końcu odrzuca grupy (HAVING)."
    },
    {
      "title": "Przykład: Duże kategorie wiekowe",
      "code": "SELECT rating, COUNT(*) AS total\nFROM film\nGROUP BY rating\nHAVING COUNT(*) > 200;",
      "lines": [
        { "line": "GROUP BY rating", "desc": "Tworzy grupy według ratingu." },
        { "line": "HAVING COUNT(*) > 200;", "desc": "Zostawia tylko grupy liczące ponad 200 filmów." }
      ]
    },
    {
      "title": "Szybki quiz",
      "quiz": {
        "question": "Gdzie należy umieścić warunek filtrujący wynik funkcji SUM(amount) > 100?",
        "options": [
          "W klauzuli HAVING po GROUP BY",
          "W klauzuli WHERE przed GROUP BY",
          "W klauzuli SELECT"
        ],
        "correct": 0,
        "explanation": "Zgadza się! Wyniki funkcji agregujących filtrujemy wyłącznie w HAVING."
      }
    }
  ],

  "p3_5": [
    {
      "title": "Agregacja warunkowa: FILTER (WHERE ...)",
      "syntax": "SELECT COUNT(*) AS total,\n       COUNT(*) FILTER (WHERE status = 'aktywny') AS aktywne,\n       SUM(kwota) FILTER (WHERE typ = 'VIP') AS suma_vip\nFROM zamowienia;",
      "bullets": [
        "<strong><code>FILTER (WHERE ...)</code>:</strong> nowoczesna składnia PostgreSQL nakładająca filtr bezpośrednio na funkcję agregującą.",
        "<strong>Wieloraka analityka:</strong> pozwala w jednym zapytaniu policzyć podsumowania dla różnych podzbiorów bez używania podzapytań.",
        "<strong>Czytelność:</strong> jest znacznie bardziej przejrzysta niż stare konstrukcje <code>SUM(CASE WHEN ...)</code>."
      ]
    },
    {
      "title": "Filtrowanie w locie agregacji",
      "focusWrite": ["COUNT", "FILTER", "WHERE"],
      "focusExec": [1, 5],
      "note": "Główny potok zapytania widzi wszystkie wiersze, a FILTER wybiera rekordy tylko dla danej funkcji."
    },
    {
      "title": "Przykład: Segmentacja filmów w jednym wierszu",
      "code": "SELECT COUNT(*) AS total_films,\n       COUNT(*) FILTER (WHERE rating = 'PG') AS pg_cnt,\n       COUNT(*) FILTER (WHERE rating = 'R') AS r_cnt\nFROM film;",
      "lines": [
        { "line": "COUNT(*)", "desc": "Liczy wszystkie filmy." },
        { "line": "COUNT(*) FILTER (WHERE rating = 'PG')", "desc": "Liczy tylko pozycje z ratingiem PG." }
      ]
    },
    {
      "title": "Szybki quiz",
      "quiz": {
        "question": "Co jest główną zaletą klauzuli FILTER (WHERE ...)?",
        "options": [
          "Możliwość liczenia różnych podzbiorów danych w jednym prostym zapytaniu",
          "Automatyczne usuwanie tabel",
          "Sortowanie wyników alfabetycznie"
        ],
        "correct": 0,
        "explanation": "Znakomicie! FILTER pozwala tworzyć wielokolumnowe raporty segmentacyjne w jednym przebiegu."
      }
    }
  ],

  "p4_0a": [
    {
      "title": "Funkcje tekstowe: UPPER, LOWER, LENGTH, TRIM i ||",
      "syntax": "SELECT UPPER(nazwisko),\n       LENGTH(opis),\n       imie || ' ' || nazwisko AS pelne_dane\nFROM pracownicy;",
      "bullets": [
        "<strong><code>UPPER(tekst)</code> / <code>LOWER(tekst)</code>:</strong> zamienia litery na wielkie lub małe.",
        "<strong><code>LENGTH(tekst)</code>:</strong> zwraca liczbę znaków w tekście.",
        "<strong><code>TRIM(tekst)</code>:</strong> usuwa zbędne białe znaki (spacje) z początku i końca tekstu.",
        "<strong>Operator <code>||</code>:</strong> łączy (konkatenacja) dwa lub więcej ciągów tekstowych."
      ]
    },
    {
      "title": "Przetwarzanie tekstu w kolumnach",
      "focusWrite": ["SELECT", "||", "UPPER", "FROM"],
      "focusExec": [1, 5],
      "note": "Operacje tekstowe są wykonywane dla każdego wiersza w trakcie generowania wyniku w SELECT."
    },
    {
      "title": "Przykład: Wizytówka aktora",
      "code": "SELECT first_name || ' ' || last_name AS full_name, LENGTH(first_name) AS len\nFROM actor\nLIMIT 5;",
      "lines": [
        { "line": "first_name || ' ' || last_name", "desc": "Skleja imię, spację i nazwisko w jeden ciąg." },
        { "line": "LENGTH(first_name)", "desc": "Zwraca długość imienia w znakach." }
      ]
    },
    {
      "title": "Szybki quiz",
      "quiz": {
        "question": "Jaki operator w PostgreSQL służy do łączenia stringów (konkatenacji)?",
        "options": [
          "|| (dwie pionowe kreski)",
          "+ (plus)",
          "& (ampersand)"
        ],
        "correct": 0,
        "explanation": "Brawo! W standardzie PostgreSQL operatorem łączenia tekstu jest ||."
      }
    }
  ],

  "p4_0b": [
    {
      "title": "Liczby: Zaokrąglanie ROUND() i dzielenie dziesiętne",
      "syntax": "SELECT cena * 1.23 AS brutto,\n       ROUND(cena * 1.23, 2) AS brutto_zaokr,\n       sukcesy * 100.0 / total AS procent\nFROM statystyki;",
      "bullets": [
        "<strong><code>ROUND(wartość, miejsca)</code>:</strong> zaokrągla liczbę do zadanej precyzji po przecinku.",
        "<strong>Dzielenie całkowite:</strong> w SQL dzielenie dwóch liczb całkowitych (np. <code>5 / 2</code>) daje <code>2</code>, a nie <code>2.5</code>!",
        "<strong>Mnożenie przez <code>100.0</code>:</strong> wymusza konwersję na typ zmiennoprzecinkowy (numeric) i gwarantuje poprawny ułamek."
      ]
    },
    {
      "title": "Precyzja obliczeń finansowych",
      "focusWrite": ["SELECT", "ROUND", "* 100.0", "FROM"],
      "focusExec": [1, 5],
      "note": "Zawsze używaj 100.0 (z kropką i zerem) przy liczeniu procentów, aby uniknąć ucięcia części ułamkowej!"
    },
    {
      "title": "Przykład: Zaokrąglona marża",
      "code": "SELECT title, ROUND(rental_rate / replacement_cost * 100.0, 2) AS roi_pct\nFROM film\nLIMIT 5;",
      "lines": [
        { "line": "* 100.0", "desc": "Konwertuje wynik na procenty z ułamkiem." },
        { "line": "ROUND(..., 2)", "desc": "Zaokrągla ostateczny wynik do 2 miejsc po przecinku." }
      ]
    },
    {
      "title": "Szybki quiz",
      "quiz": {
        "question": "Co zwróci w PostgreSQL zapytanie SELECT 5 / 2; ?",
        "options": [
          "2 (dzielenie całkowite obcina resztę)",
          "2.5",
          "Błąd typu"
        ],
        "correct": 0,
        "explanation": "Dokładnie tak! Aby otrzymać 2.5, należy zapisać 5.0 / 2 lub 5 / 2.0."
      }
    }
  ],

  "p4_0c": [
    {
      "title": "Daty: EXTRACT(YEAR/MONTH) oraz DATE_TRUNC",
      "syntax": "SELECT EXTRACT(YEAR FROM data::timestamp) AS rok,\n       EXTRACT(DOW FROM data::timestamp) AS dzien_tygodnia,\n       DATE_TRUNC('month', data::timestamp)::date AS poczatek_miesiaca\nFROM transakcje;",
      "bullets": [
        "<strong><code>EXTRACT(pole FROM znacznik)</code>:</strong> wyciąga konkretną liczbę (np. <code>YEAR</code>, <code>MONTH</code>, <code>DAY</code>, <code>DOW</code> - dzień tygodnia).",
        "<strong><code>DATE_TRUNC('jednostka', znacznik)</code>:</strong> zeruje datę do początku podanej jednostki (np. do pierwszego dnia miesiąca o północy).",
        "<strong>Raporty okresowe:</strong> <code>DATE_TRUNC('month', data)</code> to podstawa grupowania miesięcznych raportów sprzedaży."
      ]
    },
    {
      "title": "Grupowanie po okresach w silniku",
      "focusWrite": ["SELECT", "DATE_TRUNC", "FROM", "GROUP BY"],
      "focusExec": [1, 2, 3, 5],
      "note": "DATE_TRUNC sprowadza wszystkie transakcje z danego miesiąca do jednej wspólnej daty początkowej."
    },
    {
      "title": "Przykład: Miesięczne podsumowanie",
      "code": "SELECT DATE_TRUNC('month', payment_date::timestamp)::date AS miesiac, SUM(amount) AS utarg\nFROM payment\nGROUP BY 1\nORDER BY miesiac ASC;",
      "lines": [
        { "line": "DATE_TRUNC('month', ...)", "desc": "Sprowadza daty np. 2026-05-14 do 2026-05-01." },
        { "line": "GROUP BY 1", "desc": "Grupuje po pierwszej kolumnie w SELECT." }
      ]
    },
    {
      "title": "Szybki quiz",
      "quiz": {
        "question": "Która funkcja pozwala sprowadzić datę '2026-05-18 14:30:00' do pierwszego dnia tego miesiąca?",
        "options": [
          "DATE_TRUNC('month', data)",
          "EXTRACT(MONTH FROM data)",
          "TRIM(data, 'month')"
        ],
        "correct": 0,
        "explanation": "Prawidłowo! DATE_TRUNC obcina datę do początku zadanego przedziału."
      }
    }
  ],

  "p5_1": [
    {
      "title": "Warunki biznesowe: CASE WHEN ... THEN ... ELSE ... END",
      "syntax": "SELECT tytul,\n       CASE\n         WHEN dlugosc < 60 THEN 'Krótki'\n         WHEN dlugosc <= 120 THEN 'Średni'\n         ELSE 'Długi'\n       END AS kategoria_czasu\nFROM filmy;",
      "bullets": [
        "<strong><code>CASE WHEN</code>:</strong> odpowiednik instrukcji if-else w SQL.",
        "<strong>Ewaluacja od góry do dołu:</strong> silnik sprawdza warunki po kolei i zwraca wartość pierwszego spełnionego.",
        "<strong><code>ELSE</code>:</strong> wartość domyślna, gdy żaden warunek WHEN nie został spełniony (bez ELSE zwróci NULL).",
        "<strong><code>END</code>:</strong> bezwzględnie wymagane słowo kończące blok instrukcji CASE."
      ]
    },
    {
      "title": "Przeliczanie warunkowe w locie",
      "focusWrite": ["SELECT", "CASE", "WHEN", "THEN", "ELSE", "END", "FROM"],
      "focusExec": [1, 5],
      "note": "CASE działa jak wyliczana kolumna — można po niej grupować, filtrować lub wstawiać do agregacji."
    },
    {
      "title": "Przykład: Segmentacja stawek",
      "code": "SELECT title, rental_rate,\n       CASE\n         WHEN rental_rate < 2.00 THEN 'Tani'\n         ELSE 'Standard'\n       END AS price_tier\nFROM film\nLIMIT 5;",
      "lines": [
        { "line": "WHEN rental_rate < 2.00 THEN 'Tani'", "desc": "Gdy stawka < 2.00 przypisuje 'Tani'." },
        { "line": "ELSE 'Standard'", "desc": "W przeciwnym wypadku 'Standard'." },
        { "line": "END AS price_tier", "desc": "Zamyka blok i nadaje alias." }
      ]
    },
    {
      "title": "Szybki quiz",
      "quiz": {
        "question": "Czym musi kończyć się każda instrukcja CASE w języku SQL?",
        "options": [
          "Słowem END",
          "Słowem STOP",
          "Średnikiem ;"
        ],
        "correct": 0,
        "explanation": "Znakomicie! Każda konstrukcja CASE w SQL musi zamykać się słowem END."
      }
    }
  ],

  "p5_1b": [
    {
      "title": "Obsługa NULL: COALESCE oraz NULLIF",
      "syntax": "SELECT COALESCE(telefon, email, 'brak kontaktu') AS kontakt,\n       NULLIF(stawka, 0) AS bezpieczny_mianownik\nFROM klienci;",
      "bullets": [
        "<strong><code>COALESCE(w1, w2, ...)</code>:</strong> zwraca pierwszy napotkany argument, który NIE jest NULL.",
        "<strong>Wartości domyślne:</strong> <code>COALESCE(bonus, 0)</code> zamienia puste pola premii na 0 zł.",
        "<strong><code>NULLIF(a, b)</code>:</strong> zwraca NULL, jeśli argumenty <code>a</code> i <code>b</code> są równe. Używane do zapobiegania błędowi dzielenia przez zero!"
      ]
    },
    {
      "title": "Zastępowanie braków w silniku",
      "focusWrite": ["SELECT", "COALESCE", "NULLIF", "FROM"],
      "focusExec": [1, 5],
      "note": "COALESCE gwarantuje, że kolumna wynikowa nigdy nie zwróci pustej komórki, jeśli podasz wartość zapasową."
    },
    {
      "title": "Przykład: Bezpieczny email kontaktowy",
      "code": "SELECT customer_id, COALESCE(email, 'brak@adresu.pl') AS contact_email\nFROM customer\nLIMIT 5;",
      "lines": [
        { "line": "COALESCE(email, 'brak@adresu.pl')", "desc": "Jeśli email jest pusty, wstawia podany tekst zapasowy." }
      ]
    },
    {
      "title": "Szybki quiz",
      "quiz": {
        "question": "Co zwróci wyrażenie COALESCE(NULL, NULL, 'C', 'D')?",
        "options": [
          "'C' (pierwsza niepusta wartość)",
          "NULL",
          "'D'"
        ],
        "correct": 0,
        "explanation": "Brawo! COALESCE skanuje argumenty od lewej i wybiera pierwszy, który nie ma wartości NULL."
      }
    }
  ],

  "p4_1": [
    {
      "title": "Część wspólna tabel: INNER JOIN i aliasy",
      "syntax": "SELECT a.kolumna, b.kolumna\nFROM tabela_a a\nJOIN tabela_b b ON a.id = b.a_id;",
      "bullets": [
        "<strong><code>INNER JOIN</code> (lub samo <code>JOIN</code>):</strong> łączy wiersze z obu tabel, które mają dopasowanie w warunku <code>ON</code>.",
        "<strong>Warunek <code>ON</code>:</strong> określa logiczne powiązanie (najczęściej: klucz obcy = klucz główny).",
        "<strong>Aliasy tabel:</strong> krótkie litery (np. <code>film f</code>) zapobiegają błędom dwuznaczności kolumn."
      ]
    },
    {
      "title": "Kolejność w silniku",
      "focusWrite": ["SELECT", "FROM", "JOIN", "ON"],
      "focusExec": [1, 5],
      "note": "Silnik bazy najpierw scala zbiory wierszy według reguły ON, tworząc tymczasową szeroką tabelę."
    },
    {
      "title": "Przykład: Film i jego kategoria",
      "code": "SELECT f.title, c.name AS category_name\nFROM film f\nJOIN film_category fc ON f.film_id = fc.film_id\nJOIN category c ON fc.category_id = c.category_id\nLIMIT 5;",
      "lines": [
        { "line": "JOIN film_category fc ON ...", "desc": "Łączy film z tabelą powiązań." },
        { "line": "JOIN category c ON ...", "desc": "Dołącza nazwę kategorii z tabeli słownikowej." }
      ]
    },
    {
      "title": "Szybki quiz",
      "quiz": {
        "question": "Co się stanie z wierszem z lewej tabeli w INNER JOIN, jeśli nie ma on żadnego dopasowania w prawej tabeli?",
        "options": [
          "Zostanie pominięty i nie pojawi się w wyniku",
          "Pojawi się z wartościami NULL",
          "Zgłoszony zostanie błąd"
        ],
        "correct": 0,
        "explanation": "Dokładnie tak! INNER JOIN zwraca wyłącznie część wspólną — rekordy bez dopasowania są odrzucane."
      }
    }
  ],

  "p4_2": [
    {
      "title": "Zachowanie lewej tabeli: LEFT JOIN i Anti-Join",
      "syntax": "SELECT k.klient_id, z.zamowienie_id\nFROM klienci k\nLEFT JOIN zamowienia z ON k.klient_id = z.klient_id\nWHERE z.zamowienie_id IS NULL;",
      "bullets": [
        "<strong><code>LEFT JOIN</code>:</strong> zachowuje WSZYSTKIE wiersze z lewej tabeli, nawet te bez dopasowania w prawej.",
        "<strong>Wartości NULL:</strong> kolumny z prawej tabeli przyjmą wartość NULL, jeśli brak powiązanego rekordu.",
        "<strong>Anti-Join:</strong> filtr <code>WHERE prawa.klucz IS NULL</code> pozwala błyskawicznie znaleźć rekordy nieaktywne lub bezdzietne."
      ]
    },
    {
      "title": "Lewostronne zachowanie w silniku",
      "focusWrite": ["FROM", "LEFT JOIN", "ON", "WHERE IS NULL"],
      "focusExec": [1, 2, 5],
      "note": "LEFT JOIN gwarantuje, że lewa tabela nie straci ani jednego rekordu w procesie łączenia."
    },
    {
      "title": "Przykład: Klienci bez wypożyczeń",
      "code": "SELECT c.customer_id, c.first_name, c.last_name\nFROM customer c\nLEFT JOIN rental r ON c.customer_id = r.customer_id\nWHERE r.rental_id IS NULL;",
      "lines": [
        { "line": "LEFT JOIN rental r ON ...", "desc": "Dołącza wypożyczenia jeśli istnieją." },
        { "line": "WHERE r.rental_id IS NULL", "desc": "Zostawia tylko klientów, którzy nigdy nic nie wypożyczyli." }
      ]
    },
    {
      "title": "Szybki quiz",
      "quiz": {
        "question": "Jak nazywa się technika użycia LEFT JOIN z warunkiem WHERE prawa_tabela.id IS NULL?",
        "options": [
          "Anti-Join (wyszukiwanie rekordów bez powiązań)",
          "Cross Join",
          "Self Join"
        ],
        "correct": 0,
        "explanation": "Świetnie! Anti-Join to jedna z najważniejszych technik analitycznych w SQL."
      }
    }
  ],

  "p4_3": [
    {
      "title": "Łączenie wyników pod sobą: UNION oraz UNION ALL",
      "syntax": "SELECT imie, nazwisko, 'Pracownik' AS typ FROM pracownicy\nUNION ALL\nSELECT imie, nazwisko, 'Klient' AS typ FROM klienci;",
      "bullets": [
        "<strong><code>UNION ALL</code>:</strong> skleja wyniki dwóch zapytań pionowo (jeden pod drugim) z zachowaniem wszystkich wierszy.",
        "<strong><code>UNION</code>:</strong> scala wyniki i automatycznie usuwa duplikaty (jest wolniejsze przez sortowanie).",
        "<strong>Zasady spójności:</strong> oba zapytania muszą mieć tę samą liczbę kolumn i zgodne typy danych.",
        "<strong>Sortowanie:</strong> <code>ORDER BY</code> stosujemy tylko raz, na samym końcu scalonego zapytania."
      ]
    },
    {
      "title": "Scalanie pionowe",
      "focusWrite": ["SELECT", "FROM", "UNION ALL", "ORDER BY"],
      "focusExec": [1, 5, 7],
      "note": "W przeciwieństwie do JOIN (który łączy tabele poziomo), UNION łączy tabele pionowo wiersz pod wierszem."
    },
    {
      "title": "Przykład: Wspólna lista kontaktowa",
      "code": "SELECT first_name, last_name, 'Pracownik' AS typ_osoby FROM staff\nUNION ALL\nSELECT first_name, last_name, 'Klient' AS typ_osoby FROM customer\nORDER BY last_name ASC LIMIT 5;",
      "lines": [
        { "line": "'Pracownik' AS typ_osoby", "desc": "Etykietuje źródło rekordu." },
        { "line": "UNION ALL", "desc": "Skleja listy bez usuwania duplikatów." },
        { "line": "ORDER BY last_name ASC", "desc": "Sortuje całą połączoną tabelę." }
      ]
    },
    {
      "title": "Szybki quiz",
      "quiz": {
        "question": "Czym różni się UNION od UNION ALL?",
        "options": [
          "UNION usuwa duplikaty wierszy, a UNION ALL zostawia wszystkie powtórzenia",
          "UNION ALL działa wolniej niż UNION",
          "UNION pozwala łączyć kolumny o różnych typach"
        ],
        "correct": 0,
        "explanation": "Zgadza się! UNION ALL jest szybsze i nie usuwa identycznych rekordów."
      }
    }
  ],

  "p5_2": [
    {
      "title": "Czytelne bloki modułowe: CTE (WITH)",
      "syntax": "WITH podsumowanie AS (\n  SELECT klient_id, SUM(kwota) AS total\n  FROM zamowienia\n  GROUP BY klient_id\n)\nSELECT *\nFROM podsumowanie\nWHERE total > 500;",
      "bullets": [
        "<strong>CTE (Common Table Expression):</strong> konstrukcja <code>WITH nazwa AS (...)</code> tworzy nazwaną tabelę tymczasową.",
        "<strong>Modularność:</strong> kod staje się czytelny i uporządkowany jak klocki lego.",
        "<strong>Uproszczenie WHERE:</strong> pozwala filtrować wyliczone wartości bez pisania skomplikowanych klauzul HAVING."
      ]
    },
    {
      "title": "Kolejność wykonywania CTE",
      "focusWrite": ["WITH", "AS", "(", "SELECT", ")", "SELECT", "FROM"],
      "focusExec": [1, 5],
      "note": "Silnik najpierw oblicza zawartość zdefiniowanego bloku WITH, a potem odpytuje go jak zwykłą tabelę."
    },
    {
      "title": "Przykład: Klienci o wysokich obrotach",
      "code": "WITH cust_totals AS (\n  SELECT customer_id, SUM(amount) AS total\n  FROM payment\n  GROUP BY customer_id\n)\nSELECT customer_id, total\nFROM cust_totals\nWHERE total > 150\nORDER BY total DESC;",
      "lines": [
        { "line": "WITH cust_totals AS (...)", "desc": "Definiuje tymczasowy widok z sumami wpłat." },
        { "line": "FROM cust_totals WHERE total > 150", "desc": "Odpytuje przygotowany blok ze zwykłym filtrem WHERE." }
      ]
    },
    {
      "title": "Szybki quiz",
      "quiz": {
        "question": "Jakie słowo kluczowe rozpoczyna definiowanie CTE w języku SQL?",
        "options": [
          "WITH",
          "CREATE TEMPORARY",
          "SET TABLE"
        ],
        "correct": 0,
        "explanation": "Brawo! Wyrażenia tabelowe CTE rozpoczynają się od słowa kluczowego WITH."
      }
    }
  ],

  "p5_3": [
    {
      "title": "Funkcje Okna: Rankingi (ROW_NUMBER, RANK, DENSE_RANK)",
      "syntax": "SELECT pracownik, pensja, dzial,\n       ROW_NUMBER() OVER (ORDER BY pensja DESC) AS rn,\n       RANK() OVER (PARTITION BY dzial ORDER BY pensja DESC) AS rnk,\n       DENSE_RANK() OVER (PARTITION BY dzial ORDER BY pensja DESC) AS drnk\nFROM kadry;",
      "bullets": [
        "<strong>Funkcja okna:</strong> oblicza statystyki bez zwijania wierszy (wiersze zachowują swoją tożsamość!).",
        "<strong><code>ROW_NUMBER()</code>:</strong> zawsze nadaje kolejne numery 1, 2, 3, 4 bez powtórzeń.",
        "<strong><code>RANK()</code>:</strong> przy remisach nadaje to samo miejsce, ale tworzy luki (np. 1, 2, 2, 4).",
        "<strong><code>DENSE_RANK()</code>:</strong> przy remisach nadaje to samo miejsce bez luk (np. 1, 2, 2, 3).",
        "<strong><code>PARTITION BY</code>:</strong> resetuje ranking dla każdej grupy osobno."
      ]
    },
    {
      "title": "Kiedy silnik liczy okno?",
      "focusWrite": ["SELECT", "OVER", "PARTITION BY", "ORDER BY"],
      "focusExec": [1, 5, 6],
      "note": "Funkcje okna są obliczane po filtrach WHERE i grupowaniu GROUP BY, tuż przed ostatecznym wyświetleniem SELECT."
    },
    {
      "title": "Przykład: Ranking długości filmów",
      "code": "SELECT rating, title, length,\n       DENSE_RANK() OVER (PARTITION BY rating ORDER BY length DESC, title ASC) AS rk\nFROM film\nLIMIT 10;",
      "lines": [
        { "line": "PARTITION BY rating", "desc": "Liczy osobny ranking dla każdej kategorii wiekowej." },
        { "line": "ORDER BY length DESC", "desc": "Układa filmy od najdłuższego do najkrótszego." }
      ]
    },
    {
      "title": "Szybki quiz",
      "quiz": {
        "question": "Czym różni się RANK() od DENSE_RANK() przy dwóch drugich miejscach?",
        "options": [
          "RANK() dla kolejnej pozycji przypisze 4, a DENSE_RANK() przypisze 3",
          "Nie ma żadnej różnicy",
          "DENSE_RANK() nie pozwala na remisy"
        ],
        "correct": 0,
        "explanation": "Znakomicie! DENSE_RANK (gęsty ranking) nigdy nie pozostawia luk w numeracji."
      }
    }
  ],

  "p5_4": [
    {
      "title": "Porównania w czasie: LAG(), LEAD() i SUM() OVER",
      "syntax": "SELECT data, utarg,\n       LAG(utarg, 1) OVER (ORDER BY data) AS wczoraj,\n       LEAD(utarg, 1) OVER (ORDER BY data) AS jutro,\n       SUM(utarg) OVER (ORDER BY data) AS suma_narastajaco\nFROM sprzedaz;",
      "bullets": [
        "<strong><code>LAG(kolumna, n)</code>:</strong> sięga do wartości z poprzedniego wiersza (pozwala liczyć dynamikę wzrostu MoM/YoY).",
        "<strong><code>LEAD(kolumna, n)</code>:</strong> sięga do wartości z kolejnego wiersza w przód.",
        "<strong>Suma krocząca (Running Total):</strong> <code>SUM(kwota) OVER (ORDER BY data)</code> sumuje wartości od początku do bieżącego dnia.",
        "<strong>Średnia grupowa:</strong> <code>AVG(kwota) OVER (PARTITION BY kategoria)</code> dołącza średnią grupy do każdego pojedynczego wiersza."
      ]
    },
    {
      "title": "Nawigacja między wierszami",
      "focusWrite": ["SELECT", "LAG", "LEAD", "SUM", "OVER", "ORDER BY"],
      "focusExec": [1, 5],
      "note": "LAG i LEAD eliminują konieczność robienia skomplikowanych złączeń tabeli z samą sobą (Self-Join)!"
    },
    {
      "title": "Przykład: Historia transakcji klienta",
      "code": "SELECT payment_id, customer_id, amount,\n       LAG(amount) OVER (PARTITION BY customer_id ORDER BY payment_date, payment_id) AS prev_amount,\n       SUM(amount) OVER (PARTITION BY customer_id ORDER BY payment_date, payment_id) AS running_total\nFROM payment\nLIMIT 10;",
      "lines": [
        { "line": "LAG(amount) OVER ...", "desc": "Pobiera kwotę z poprzedniej wizyty tego klienta." },
        { "line": "SUM(amount) OVER ...", "desc": "Liczy sumaryczne wydatki klienta narastająco w czasie." }
      ]
    },
    {
      "title": "Szybki quiz",
      "quiz": {
        "question": "Która funkcja pozwala sprawdzić wartość z poprzedniego wiersza w zdefiniowanym oknie?",
        "options": [
          "LAG()",
          "LEAD()",
          "PREVIOUS()"
        ],
        "correct": 0,
        "explanation": "Brawo! LAG() sięga wstecz, natomiast LEAD() sięga w przód."
      }
    }
  ]
};

var STAGE_QUIZZES = {
  1: [
    { q: "Które słowo w SQL wybiera kolumny, które chcesz zobaczyć na ekranie?", options: ["SELECT", "FROM", "WHERE", "GROUP BY"], correct: 0, explain: "SELECT wybiera kolumny do pokazania w wyniku, a FROM wskazuje tabelę, z której bierzemy dane." },
    { q: "Jak wyświetlić tylko niepowtarzające się nazwy miast z kolumny city (bez duplikatów)?", options: ["SELECT UNIQUE city", "SELECT DISTINCT city", "SELECT city UNIQUE", "SELECT ONLY city"], correct: 1, explain: "Słowo DISTINCT po SELECT usuwa powtarzające się wiersze i zostawia same unikalne wartości." },
    { q: "Jak ułożyć filmy na liście od najnowszego roku do najstarszego?", options: ["ORDER BY release_year ASC", "SORT release_year DESC", "ORDER BY release_year DESC", "GROUP BY release_year DESC"], correct: 2, explain: "ORDER BY z dopiskiem DESC układa wynik malejąco, więc najnowsze lata będą na samej górze." },
    { q: "Jak ograniczyć wynik zapytania do pierwszych 10 wierszy?", options: ["TOP 10", "LIMIT 10", "ROWS 10", "TAKE 10"], correct: 1, explain: "W PostgreSQL na końcu zapytania dopisujemy LIMIT 10, aby zobaczyć tylko pierwszych 10 wierszy." },
    { q: "Co robi słowo AS w zapisie SELECT amount * 4 AS amount_pln?", options: ["Filtruje wiersze z tabeli", "Zmienia wyświetlaną nazwę kolumny w wyniku na amount_pln (nadaje jej czytelny nagłówek)", "Sortuje wynik rosnąco", "Łączy dwie tabele"], correct: 1, explain: "Słowo AS nadaje wyliczonej kolumnie czytelną nazwę w nagłówku tabeli wynikowej." }
  ],
  2: [
    { q: "Które słowo w SQL służy do wybrania tylko tych wierszy, które spełniają podany warunek (np. cena > 5)?", options: ["HAVING", "WHERE", "ORDER BY", "LIMIT"], correct: 1, explain: "WHERE działa jak sito na pojedyncze wiersze tabeli — zostawia tylko te, które spełniają warunek." },
    { q: "Jak wybrać filmy o kategorii wiekowej G lub R, które trwają od 50 do 90 minut włącznie?", options: ["rating IN ('G', 'R') AND length BETWEEN 50 AND 90", "rating = 'G' AND rating = 'R' OR length = 50", "rating BETWEEN ('G', 'R')", "rating IN ('G', 'R') OR length NOT BETWEEN 50 AND 90"], correct: 0, explain: "IN sprawdza pasującą listę wartości, BETWEEN obejmuje przedział od 50 do 90 włącznie, a AND wymaga obu warunków naraz." },
    { q: "Kiedy warunek a = 1 OR b = 2 przepuści wiersz do wyniku?", options: ["Tylko gdy oba warunki są prawdziwe jednocześnie", "Gdy prawdziwy jest przynajmniej jeden z tych dwóch warunków", "Tylko gdy oba warunki są fałszywe", "Gdy kolumny a i b mają ten sam typ"], correct: 1, explain: "Słowo OR oznacza „lub” — wystarczy, że spełniony jest pierwszy warunek albo drugi (lub oba)." },
    { q: "Jak wyszukać nazwę zawierającą literę a w dowolnym miejscu, nie przejmując się wielkością liter?", options: ["name LIKE 'a'", "name ILIKE '%a%'", "name = '%a%'", "name IS '%a%'"], correct: 1, explain: "ILIKE nie zwraca uwagi na wielkość liter, a znak % po obu stronach oznacza dowolne litery przed i po „a”." },
    { q: "Jak poprawnie znaleźć wiersze, w których brakuje adresu e-mail (puste pole NULL)?", options: ["email = NULL", "email == NULL", "email IS NULL", "email IN NULL"], correct: 2, explain: "Brak wartości (NULL) sprawdzamy zawsze przez IS NULL (nigdy przez znak równości =)." }
  ],
  3: [
    { q: "Co policzy funkcja COUNT(*)?", options: ["Liczbę wszystkich wierszy w wyniku", "Sumę wszystkich liczb w tabeli", "Liczbę kolumn w tabeli", "Średnią długość tekstu"], correct: 0, explain: "COUNT(*) liczy wszystkie wiersze pasujące do zapytania — nawet jeśli niektóre pola są puste (NULL)." },
    { q: "Jak policzyć łączną kwotę wpłat (amount) osobno dla każdego klienta (customer_id)?", options: ["SELECT customer_id, SUM(amount) FROM payment GROUP BY customer_id", "SELECT customer_id, SUM(amount) FROM payment ORDER BY customer_id", "SELECT SUM(amount) FROM payment WHERE customer_id", "SELECT customer_id, COUNT(amount) FROM payment"], correct: 0, explain: "Gdy podsumowujesz dane dla każdego klienta osobno, potrzebujesz funkcji SUM() oraz GROUP BY customer_id." },
    { q: "Która funkcja policzy średnią ze wszystkich liczb w kolumnie?", options: ["SUM()", "AVG()", "MEAN()", "MID()"], correct: 1, explain: "AVG() (od angielskiego average) oblicza średnią arytmetyczną, pomijając puste pola NULL." },
    { q: "Co zwracają funkcje MIN() i MAX()?", options: ["MIN liczy wiersze, a MAX liczy puste pola NULL", "MIN znajduje najmniejszą wartość, a MAX największą", "MIN dzieli na grupy, a MAX sortuje", "Obie działają tak samo"], correct: 1, explain: "MIN() wyciąga z kolumny najmniejszą liczbę lub najwcześniejszą datę, a MAX() — największą lub najnowszą." },
    { q: "Które słowo pozwala zostawić tylko te grupy po GROUP BY, które spełniają warunek (np. mają ponad 5 wpłat)?", options: ["WHERE", "HAVING", "ON", "LIMIT"], correct: 1, explain: "HAVING filtruje gotowe grupy utworzone przez GROUP BY — w WHERE nie można używać funkcji takich jak COUNT() czy SUM()." }
  ],
  4: [
    { q: "Jak zamienić cały tekst w kolumnie name na WIELKIE LITERY?", options: ["UPPER(name)", "CAPITAL(name)", "TO_UPPER(name)", "BIG(name)"], correct: 0, explain: "Funkcja UPPER() zmienia wszystkie litery w tekście na wielkie (a LOWER() na małe)." },
    { q: "Jak zaokrąglić kwotę amount do 2 miejsc po przecinku?", options: ["ROUND(amount, 2)", "CEIL(amount, 2)", "TRUNCATE(amount, 2)", "DECIMAL(amount, 2)"], correct: 0, explain: "ROUND(liczba, miejsca) zaokrągla wynik do podanej liczby cyfr po przecinku." },
    { q: "Jak wyciągnąć sam numer roku z daty payment_date w PostgreSQL?", options: ["YEAR(payment_date)", "EXTRACT(YEAR FROM payment_date)", "DATE_YEAR(payment_date)", "GETYEAR payment_date"], correct: 1, explain: "Funkcja EXTRACT(YEAR FROM data) wyjmuje z daty sam rok (podobnie można wyciągnąć MONTH lub DAY)." },
    { q: "Co wyświetli zapis CASE WHEN amount >= 10 THEN 'duża' ELSE 'mała' END, gdy kwota amount wynosi 12?", options: ["Puste pole (NULL)", "duża", "mała", "Błąd zapytania"], correct: 1, explain: "Ponieważ 12 jest większe lub równe 10, warunek jest prawdziwy i SQL zwraca napis po słowie THEN, czyli 'duża'." },
    { q: "Co robią funkcje COALESCE i NULLIF?", options: ["COALESCE wstawia wartość zastępczą zamiast braku danych (NULL), a NULLIF zwraca NULL, gdy dwie wartości są takie same", "COALESCE usuwa cały wiersz, a NULLIF zawsze wpisuje 0", "Obie funkcje służą do sortowania dat", "NULLIF zamienia każde zero na liczbę 1"], correct: 0, explain: "COALESCE chroni przed pustymi polami (np. zamienia NULL na 0), a NULLIF(a, b) daje NULL przy równości, co chroni np. przed dzieleniem przez zero." }
  ],
  5: [
    { q: "Co to jest tzw. klucz obcy (np. customer_id w tabeli płatności)?", options: ["Kolumna z numerem ID, która wskazuje na konkretny wiersz w drugiej tabeli", "Specjalne hasło do odblokowania bazy", "Nowa nazwa nadana przez AS", "Warunek w klauzuli WHERE"], correct: 0, explain: "Klucz obcy łączy dwie tabele — np. customer_id przy płatności mówi, który klient z tabeli customer ją wykonał." },
    { q: "Które wiersze trafią do wyniku przy zwykłym INNER JOIN?", options: ["Wszystkie z pierwszej tabeli, nawet bez pary", "Tylko te wiersze, które znalazły pasującą parę w obu tabelach", "Wszystkie z drugiej tabeli", "Tylko wiersze bez dopasowania"], correct: 1, explain: "INNER JOIN zostawia wyłącznie rekordy, które mają dopasowanie po obu stronach połączenia." },
    { q: "Co zrobi LEFT JOIN, jeśli wiersz z lewej tabeli nie ma żadnego pasującego wpisu w prawej?", options: ["Usunie ten wiersz z wyniku", "Zachowa wiersz z lewej tabeli, a w brakujących kolumnach z prawej wstawi NULL", "Pokaże tylko prawą tabelę", "Wpisze automatycznie zero zamiast tekstu"], correct: 1, explain: "LEFT JOIN nigdy nie gubi wierszy z lewej tabeli — jeśli nie ma dla nich pary po prawej, uzupełnia puste miejsca wartością NULL." },
    { q: "Po jakim słowie wpisujemy warunek łączący dwie tabele (np. c.customer_id = p.customer_id)?", options: ["ON", "ORDER BY", "LIMIT", "SELECT"], correct: 0, explain: "Słowo ON po nazwie łączonej tabeli wskazuje, które kolumny mają do siebie pasować." },
    { q: "Dlaczego warunek dotyczący prawej tabeli wpisany w WHERE może popsuć LEFT JOIN?", options: ["Bo WHERE zawsze usuwa liczby", "Bo niedopasowane wiersze mają z prawej strony NULL i filtr w WHERE nieświadomie je wyrzuci", "Bo WHERE zamienia tekst na datę", "Bo przy LEFT JOIN nie wolno używać WHERE"], correct: 1, explain: "Jeśli w prawej tabeli jest NULL (brak dopasowania), warunek typu prawa.status = 'ok' w WHERE go odrzuci. Takie warunki wpisuj w ON!" }
  ],
  6: [
    { q: "Co to jest podzapytanie w SQL?", options: ["Jedno zapytanie SELECT wpisane w nawiasie wewnątrz innego zapytania", "Narzędzie do zakładania nowej tabeli", "Skrót do zmiany typu kolumny", "Sposób na sortowanie bez ORDER BY"], correct: 0, explain: "Podzapytanie to mniejsze zapytanie umieszczone wewnątrz głównego (np. w WHERE albo FROM), żeby policzyć dane pomocnicze." },
    { q: "Co sprawdza warunek EXISTS (podzapytanie)?", options: ["Czy zapytanie w środku znalazło chociaż jeden pasujący wiersz", "Czy tabela istnieje na dysku", "Czy wynik nie zawiera duplikatów", "Czy podzapytanie zwróciło dokładnie jedną liczbę"], correct: 0, explain: "EXISTS daje prawdę wtedy, gdy zapytanie w nawiasie zwróci choćby jeden rekord — i jest odporne na pułapki z NULL." },
    { q: "Co musi się zgadzać, żeby połączyć wyniki dwóch zapytań jeden pod drugim przez UNION?", options: ["Obie tabele muszą mieć tę samą nazwę", "Oba zapytania muszą zwracać tyle samo kolumn o pasujących typach danych", "Oba zapytania muszą mieć swoje ORDER BY", "Oba zapytania muszą zwracać tyle samo wierszy"], correct: 1, explain: "Aby skleić dwie listy wiersz pod wierszem, oba SELECT-y muszą mieć taką samą liczbę kolumn i zgodne typy (np. tekst z tekstem)." },
    { q: "Czym różni się UNION ALL od zwykłego UNION?", options: ["UNION ALL zostawia wszystkie powtarzające się wiersze, a UNION usuwa duplikaty", "UNION ALL sortuje wynik od końca", "UNION ALL działa tylko na jednej tabeli", "UNION ALL nie wyświetla wartości NULL"], correct: 0, explain: "UNION ALL po prostu skleja dwie listy (dlatego jest szybsze), natomiast zwykłe UNION dodatkowo usuwa identyczne wiersze." },
    { q: "Do czego służy słowo WITH na początku zapytania (tzw. CTE)?", options: ["Tworzy tymczasową, nazwaną tabelę pomocniczą widoczną w głównym zapytaniu poniżej", "Włącza filtrowanie wierszy jak WHERE", "Tworzy klucz główny tabeli", "Sortuje wynik alfabetycznie"], correct: 0, explain: "Blok WITH (CTE) pozwala rozbić trudne zadanie na prostsze kroki i odwołać się do wyniku pośredniego jak do zwykłej tabeli." }
  ],
  7: [
    { q: "Po co dopisujemy OVER() po funkcji takiej jak SUM() lub ROW_NUMBER()?", options: ["Aby policzyć wynik obok każdego wiersza bez sklejania całej tabeli w jeden wiersz", "Aby usunąć wszystkie duplikaty", "Aby połączyć dwie tabele", "Aby ograniczyć wynik do 10 wierszy"], correct: 0, explain: "W przeciwieństwie do GROUP BY, funkcja okna z OVER() nie zwija wierszy — dopisuje wyliczoną wartość do każdego z nich." },
    { q: "Co robi PARTITION BY wewnątrz nawiasu OVER(...)?", options: ["Dzieli wiersze na osobne grupy (np. osobne działy), w których funkcja liczy wynik od nowa", "Dzieli tabelę na osobne pliki", "Sortuje całą tabelę od końca", "Odrzuca wiersze jak WHERE"], correct: 0, explain: "PARTITION BY działa jak licznik resetujący się dla każdej grupy (np. ranking numerowany od 1 w każdym dziale osobno)." },
    { q: "Czym różni się ROW_NUMBER() od RANK(), gdy dwie osoby mają ten sam wynik (remis)?", options: ["ROW_NUMBER zawsze daje każdemu kolejny numer (1, 2, 3), a RANK daje im to samo miejsce", "ROW_NUMBER usuwa jedną z remisujących osób", "RANK zawsze daje różne numery", "Obie funkcje działają identycznie"], correct: 0, explain: "ROW_NUMBER() numeruje wiersze kolejno bez powtórzeń (1, 2, 3), a RANK() przy remisie daje takie samo miejsce (np. dwa razy 1)." },
    { q: "Która funkcja rankingowa przy remisie daje takie samo miejsce i NIE zostawia przerw w numeracji (np. 1, 2, 2, 3)?", options: ["RANK()", "DENSE_RANK()", "ROW_NUMBER()", "LAG()"], correct: 1, explain: "DENSE_RANK() po dwóch drugich miejscach nadaje miejsce 3 (bez luki), podczas gdy zwykłe RANK() przeskoczy na 4." },
    { q: "Co pobierze zapis LAG(amount) OVER (ORDER BY payment_date)?", options: ["Kwotę z następnego wiersza", "Kwotę z poprzedniego wiersza ułożonego po dacie płatności", "Sumę wszystkich wpłat w tabeli", "Numer bieżącego wiersza"], correct: 1, explain: "LAG() zagląda o jeden wiersz wstecz (do poprzedniej płatności), a LEAD() — o jeden wiersz w przód." }
  ],
  8: [
    { q: "Jak w PostgreSQL policzyć tylko wybrane wiersze w jednym podsumowaniu (np. liczbę opłaconych faktur), nie usuwając pozostałych grup?", options: ["COUNT(*) WHERE ...", "COUNT(*) FILTER (WHERE warunek)", "COUNT(*) HAVING warunek", "SUM(*) FILTER BY warunek"], correct: 1, explain: "FILTER (WHERE ...) ogranicza wiersze tylko dla tej jednej funkcji COUNT lub SUM, nie wycinając reszty raportu." },
    { q: "Jaki wynik da w PostgreSQL dzielenie dwóch liczb całkowitych 5 / 2?", options: ["2 (baza obetnie resztę po przecinku)", "2.5", "3", "Puste pole (NULL)"], correct: 0, explain: "W PostgreSQL dzielenie dwóch liczb całkowitych ucina ułamek! Aby dostać 2.5, zapisz 5.0 / 2 lub 5::numeric / 2." },
    { q: "Jak policzyć procent w PostgreSQL, żeby baza nie obcięła części dziesiętnej?", options: ["COUNT(*) / 100", "SUM(x) * 100.0 / COUNT(*)", "SUM(x) % COUNT(*)", "ROUND(COUNT(*))"], correct: 1, explain: "Pomnożenie licznika przez 100.0 (z kropką i zerem) zamienia wynik na liczbę dziesiętną i zachowuje ułamki." },
    { q: "Co oznacza pojęcie „ziarno wyniku” w analizie danych?", options: ["Co dokładnie reprezentuje jeden wiersz w gotowej tabeli (np. 1 wiersz = 1 klient lub 1 płatność)", "Kolejność pisania słów SELECT i FROM", "Szybkość wykonania zapytania", "Liczbę wszystkich kolumn w bazie"], correct: 0, explain: "Zanim napiszesz JOIN lub SUM, musisz wiedzieć, co oznacza pojedynczy wiersz w Twojej tabeli (np. jeden klient czy jedno zamówienie)." },
    { q: "Dlaczego złączenie (JOIN) dwóch dużych tabel ze zdarzeniami potrafi sztucznie zawyżyć wynik SUM(amount)?", options: ["Bo JOIN automatycznie podwaja każdą liczbę", "Bo jedna płatność może dopasować się do wielu zdarzeń i zostać policzona kilkukrotnie", "Bo SUM pomija liczby całkowite", "Bo GROUP BY nie działa z JOIN"], correct: 1, explain: "Gdy jeden klient ma 2 płatności i 3 zdarzenia, bezpośredni JOIN robi z tego 6 wierszy. Najpierw policz sumy osobno w blokach WITH (CTE)!" }
  ]
};

var DIAG_QUESTIONS = [
  {
    "lvl": 1,
    "stage": 1,
    "gap": "g7",
    "title": "1/10 Filtrowanie podstawowe (WHERE + ORDER BY)",
    "prompt": "Z tabeli `film` wypisz `title` oraz `rental_rate` dla wszystkich filmów o ratingu `'PG'`. Posortuj wynik rosnąco po `title`.",
    "sol": "SELECT title, rental_rate FROM film WHERE rating = 'PG' ORDER BY title ASC;",
    "order": true
  },
  {
    "lvl": 1,
    "stage": 1,
    "gap": "g7",
    "title": "2/10 Zakresy IN oraz BETWEEN",
    "prompt": "Z tabeli `film` wypisz `title` i `length` dla filmów o ratingu `'G'` lub `'R'`, których długość mieści się między `50` a `90` minut włącznie.",
    "sol": "SELECT title, length FROM film WHERE rating IN ('G', 'R') AND length BETWEEN 50 AND 90;",
    "order": false
  },
  {
    "lvl": 2,
    "stage": 2,
    "gap": "g3",
    "title": "3/10 Agregacja i NULL w COUNT",
    "prompt": "Z tabeli `rental` zwróć w jednym wierszu dwie kolumny: liczbę wszystkich wierszy (`COUNT(*)`) jako `all_cnt` oraz liczbę wypożyczeń z uzupełnioną datą zwrotu (`COUNT(return_date)`) jako `ret_cnt`.",
    "sol": "SELECT COUNT(*) AS all_cnt, COUNT(return_date) AS ret_cnt FROM rental;",
    "order": false
  },
  {
    "lvl": 2,
    "stage": 2,
    "gap": "g7",
    "title": "4/10 Grupowanie i filtr po agregacji (HAVING)",
    "prompt": "Z tabeli `payment` wypisz `customer_id` oraz sumę płatności (`SUM(amount)`) jako `total` tylko dla tych klientów, którzy wydali łącznie co najmniej `8.00`.",
    "sol": "SELECT customer_id, SUM(amount) AS total FROM payment GROUP BY customer_id HAVING SUM(amount) >= 8.00;",
    "order": false
  },
  {
    "lvl": 3,
    "stage": 3,
    "gap": "g1",
    "title": "5/10 INNER JOIN po 3 tabelach",
    "prompt": "Połącz `category`, `film_category` i `film`. Zwróć nazwę kategorii (`name`) oraz liczbę przypisanych do niej filmów (`COUNT(f.film_id)`) jako `cnt`.",
    "sol": "SELECT c.name, COUNT(f.film_id) AS cnt FROM category c JOIN film_category fc ON c.category_id = fc.category_id JOIN film f ON fc.film_id = f.film_id GROUP BY c.name;",
    "order": false
  },
  {
    "lvl": 3,
    "stage": 3,
    "gap": "g2",
    "title": "6/10 LEFT JOIN + COALESCE (wszyscy klienci, także z 0)",
    "prompt": "Dla KAŻDEGO klienta z tabeli `customer` (również tych bez płatności!) wypisz `customer_id`, `first_name` oraz sumę z tabeli `payment` jako `total_paid` (zamień `NULL` na `0`).",
    "sol": "SELECT c.customer_id, c.first_name, COALESCE(SUM(p.amount), 0) AS total_paid FROM customer c LEFT JOIN payment p ON c.customer_id = p.customer_id GROUP BY c.customer_id, c.first_name;",
    "order": false
  },
  {
    "lvl": 3,
    "stage": 3,
    "gap": "g2",
    "title": "7/10 Anti-Join (wiersze bez pary)",
    "prompt": "Znajdź `actor_id` oraz `first_name` aktorów z tabeli `actor`, którzy nie występują ani razu w tabeli `film_actor`.",
    "sol": "SELECT a.actor_id, a.first_name FROM actor a LEFT JOIN film_actor fa ON a.actor_id = fa.actor_id WHERE fa.film_id IS NULL;",
    "order": false
  },
  {
    "lvl": 4,
    "stage": 4,
    "gap": "g10",
    "title": "8/10 Agregacja warunkowa i procenty (* 100.0)",
    "prompt": "Dla każdego sklepu (`store_id`) w tabeli `customer` policz procent aktywnych klientów (`active = 1`). Zwróć `store_id` oraz dokładny procent z ułamkiem jako `active_pct`.",
    "sol": "SELECT store_id, SUM(CASE WHEN active = 1 THEN 1 ELSE 0 END) * 100.0 / COUNT(*) AS active_pct FROM customer GROUP BY store_id;",
    "order": false
  },
  {
    "lvl": 5,
    "stage": 5,
    "gap": "t5",
    "title": "9/10 CTE i funkcja okna (Top 2 płatności klienta)",
    "prompt": "Za pomocą CTE i `ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY amount DESC, payment_id ASC)` zwróć `customer_id`, `payment_id` i `amount` dla maksymalnie 2 najwyższych płatności każdego klienta.",
    "sol": "WITH r AS (SELECT customer_id, payment_id, amount, ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY amount DESC, payment_id ASC) AS rn FROM payment) SELECT customer_id, payment_id, amount FROM r WHERE rn <= 2;",
    "order": false
  },
  {
    "lvl": 5,
    "stage": 5,
    "gap": "g5",
    "title": "10/10 Porównanie z poprzednim okresem (LAG)",
    "prompt": "Dla płatności klienta `customer_id = 1` w `payment` wypisz `payment_id`, `amount` oraz kwotę poprzedniej płatności jako `prev_amt` (`LAG(amount) OVER (ORDER BY payment_date, payment_id)`). Posortuj chronologicznie po `payment_date, payment_id`.",
    "sol": "SELECT payment_id, amount, LAG(amount) OVER (ORDER BY payment_date, payment_id) AS prev_amt FROM payment WHERE customer_id = 1 ORDER BY payment_date, payment_id;",
    "order": true
  }
];

var LESSON_WARMUPS = {};
PATH_TASKS.forEach(function(t) {
  LESSON_WARMUPS[t.id] = t.variants.filter(function(v) { return v.isWarmup; });
  if (LESSON_TUTORIALS[t.id]) {
    t.slides = LESSON_TUTORIALS[t.id];
  }
});

DIAG_QUESTIONS.forEach(function(q) {
  if (typeof buildDataLemurSpec === 'function') {
    var spec = buildDataLemurSpec(q, null);
    q.solutionSql = q.sol;
    q.polecenie = spec.polecenie;
    q.assumptions = spec.assumptions;
    q.hints = spec.hints;
  }
});

window.STAGES = STAGES;
window.PATH_TASKS = PATH_TASKS;
window.DIAG_QUESTIONS = DIAG_QUESTIONS;
window.STAGE_QUIZZES = STAGE_QUIZZES;
window.LESSON_TUTORIALS = LESSON_TUTORIALS;
window.LESSON_WARMUPS = LESSON_WARMUPS;
