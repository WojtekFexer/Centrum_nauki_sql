/* ==========================================================================
   3. ŚCIEŻKA NAUKI: 16 POD-LEKCJI PO 7–8 ZADAŃ (STANDARD v11 SOLOLEARN)
   ========================================================================== */
var STAGES = [
  {
    "id": 1,
    "name": "Etap 1: Fundamenty SELECT i porządkowanie wyniku",
    "desc": "Pierwsze zapytanie, aliasy AS, obliczenia, unikalne wartości DISTINCT oraz sortowanie ORDER BY i LIMIT."
  },
  {
    "id": 2,
    "name": "Etap 2: Filtrowanie wierszy (WHERE)",
    "desc": "Pojedynczy warunek WHERE, łączenie AND/OR oraz szybkie filtry IN, BETWEEN, ILIKE i IS NULL."
  },
  {
    "id": 3,
    "name": "Etap 3: Agregacje i grupowanie (GROUP BY)",
    "desc": "Funkcje COUNT, SUM, AVG, MIN, MAX, grupowanie wierszy oraz filtrowanie grup przez HAVING."
  },
  {
    "id": 4,
    "name": "Etap 4: Łączenie tabel (JOIN) i warunki (CASE)",
    "desc": "Łączenie wewnętrzne INNER JOIN, lewostronne LEFT JOIN, Anti-Join oraz COALESCE i CASE WHEN."
  },
  {
    "id": 5,
    "name": "Etap 5: Zaawansowany SQL Analityczny",
    "desc": "Agregacje warunkowe FILTER (WHERE ...), podzapytania, CTE (WITH) oraz Funkcje Okna."
  }
];

var PATH_TASKS = [
  {
    "id": "p1_1",
    "stage": 1,
    "title": "1.1 Pierwsze zapytanie: SELECT i FROM",
    "tables": [
      "film",
      "actor",
      "category",
      "customer",
      "staff",
      "store"
    ],
    "cols": [
      "SELECT",
      "FROM",
      "*",
      "title",
      "rental_rate",
      "first_name",
      "last_name",
      "email",
      "staff_id",
      "store_id",
      "city"
    ],
    "theory": "<ul><li><strong><code>SELECT</code>:</strong> służy do wyciągania kolumn z bazy danych.</li><li><strong><code>FROM</code>:</strong> wskazuje tabelę, z której pobieramy dane.</li><li><strong>Kilka kolumn:</strong> oddzielaj nazwy kolumn przecinkami (np. <code>title, rental_rate</code>).</li><li><strong>Gwiazdka <code>*</code>:</strong> pobiera wszystkie kolumny tabeli na raz.</li></ul><div class=\"theory-code\"><code>SELECT title, rental_rate\nFROM film;</code></div>",
    "variants": [
      {
        "stepCode": "R1",
        "keySuffix": "r1",
        "isWarmup": true,
        "tier": "warmup",
        "goal": "Przygotuj pełną listę samych tytułów wszystkich filmów dostępnych w naszym katalogu.",
        "prompt": "Pobierz z katalogu filmów samą kolumnę z tytułem filmu (wszystkie wiersze, bez filtrowania).",
        "sol": "SELECT title FROM film;",
        "order": false,
        "tables": [
          "film"
        ],
        "hint": "Wpisz: SELECT title FROM film;",
        "newFeature": {
          "title": "Klauzule SELECT i FROM",
          "desc": "SELECT wskazuje kolumny do wyświetlenia, a FROM wskazuje tabelę źródłową.",
          "example": "SELECT title FROM film;"
        }
      },
      {
        "stepCode": "R2",
        "keySuffix": "r2",
        "isWarmup": true,
        "tier": "warmup",
        "goal": "Przygotuj listę imion oraz nazwisk wszystkich aktorów występujących w naszej bazie.",
        "prompt": "Pobierz z listy aktorów dwie kolumny: imię oraz nazwisko aktora.",
        "sol": "SELECT first_name, last_name FROM actor;",
        "order": false,
        "tables": [
          "actor"
        ],
        "hint": "Oddziel kolumny przecinkiem: SELECT first_name, last_name FROM actor;",
        "newFeature": {
          "title": "Wybór wielu kolumn (przecinek)",
          "desc": "Aby pobrać kilka kolumn, oddziel ich nazwy przecinkami po słowie SELECT.",
          "example": "SELECT first_name, last_name FROM actor;"
        }
      },
      {
        "stepCode": "1",
        "keySuffix": "0",
        "isWarmup": false,
        "tier": "basic",
        "goal": "Pobierz ze słownika kategorii filmowych wszystkie dostępne kolumny za pomocą symbolu gwiazdki.",
        "prompt": "Pobierz ze słownika kategorii filmowych wszystkie dostępne kolumny za pomocą symbolu gwiazdki.",
        "sol": "SELECT * FROM category;",
        "order": false,
        "tables": [
          "category"
        ],
        "hint": "Użyj gwiazdki: SELECT * FROM category;",
        "newFeature": {
          "title": "Gwiazdka * (wszystkie kolumny)",
          "desc": "Zamiast wpisywać każdą kolumnę, wpisz *, aby wyświetlić całą zawartość tabeli.",
          "example": "SELECT * FROM category;"
        }
      },
      {
        "stepCode": "2",
        "keySuffix": "1",
        "isWarmup": false,
        "tier": "basic",
        "goal": "Pobierz z katalogu filmów tytuły oraz ceny wypożyczenia wszystkich filmów.",
        "prompt": "Pobierz z katalogu filmów tytuły oraz ceny wypożyczenia wszystkich filmów.",
        "sol": "SELECT title, rental_rate FROM film;",
        "order": false,
        "tables": [
          "film"
        ],
        "hint": "Wpisz po SELECT: title, rental_rate",
        "newFeature": null
      },
      {
        "stepCode": "3",
        "keySuffix": "2",
        "isWarmup": false,
        "tier": "basic",
        "goal": "Pobierz z bazy klientów imiona, nazwiska oraz adresy e-mail wszystkich klientów.",
        "prompt": "Pobierz z bazy klientów imiona, nazwiska oraz adresy e-mail wszystkich klientów.",
        "sol": "SELECT first_name, last_name, email FROM customer;",
        "order": false,
        "tables": [
          "customer"
        ],
        "hint": "Wybierz: first_name, last_name, email",
        "newFeature": null
      },
      {
        "stepCode": "4",
        "keySuffix": "3",
        "isWarmup": false,
        "tier": "adv",
        "goal": "Pobierz z listy personelu identyfikatory pracowników, imiona, nazwiska oraz identyfikatory sklepów.",
        "prompt": "Pobierz z listy personelu identyfikatory pracowników, imiona, nazwiska oraz identyfikatory przypisanych sklepów (staff_id, first_name, last_name, store_id).",
        "sol": "SELECT staff_id, first_name, last_name, store_id FROM staff;",
        "order": false,
        "tables": [
          "staff"
        ],
        "hint": "Wybierz 4 kolumny z tabeli staff: SELECT staff_id, first_name, last_name, store_id FROM staff;",
        "newFeature": null
      },
      {
        "stepCode": "5",
        "keySuffix": "4",
        "isWarmup": false,
        "tier": "adv",
        "goal": "Pobierz z rejestru oddziałów identyfikatory sklepów oraz miasta.",
        "prompt": "Pobierz z rejestru oddziałów identyfikatory sklepów oraz miasta, w których się znajdują (store_id, city).",
        "sol": "SELECT store_id, city FROM store;",
        "order": false,
        "tables": [
          "store"
        ],
        "hint": "Wybierz store_id oraz city z tabeli store: SELECT store_id, city FROM store;",
        "newFeature": null
      },
      {
        "stepCode": "6",
        "keySuffix": "5",
        "isWarmup": false,
        "tier": "adv",
        "goal": "Pobierz z katalogu filmów identyfikator filmu, tytuł, rok wydania oraz kategorię wiekową.",
        "prompt": "Pobierz z katalogu filmów identyfikator filmu, tytuł, rok wydania oraz kategorię wiekową.",
        "sol": "SELECT film_id, title, release_year, rating FROM film;",
        "order": false,
        "tables": [
          "film"
        ],
        "hint": "Wybierz 4 kolumny z tabeli film",
        "newFeature": null
      }
    ]
  },
  {
    "id": "p1_2",
    "stage": 1,
    "title": "1.2 Zmiana nazw kolumn (AS) i proste obliczenia w SELECT",
    "tables": [
      "film",
      "staff",
      "store",
      "payment",
      "customer"
    ],
    "cols": [
      "SELECT",
      "FROM",
      "AS",
      "*",
      "+",
      "-",
      "/",
      "title",
      "length",
      "rental_rate",
      "amount",
      "first_name",
      "last_name",
      "store_id",
      "city"
    ],
    "theory": "<ul><li><strong>Aliasy kolumn (<code>AS</code>):</strong> pozwalają nadać kolumnie nową nazwę w nagłówku tabeli wynikowej.</li><li><strong>Działania arytmetyczne:</strong> możesz bezpośrednio wykonywać operacje <code>+</code>, <code>-</code>, <code>*</code>, <code>/</code> na kolumnach liczbowych.</li></ul><div class=\"theory-code\"><code>SELECT title, length AS duration_min, rental_rate * 4 AS cena_pln\nFROM film;</code></div>",
    "variants": [
      {
        "stepCode": "R1",
        "keySuffix": "r1",
        "isWarmup": true,
        "tier": "warmup",
        "goal": "Wyświetl tytuł filmu oraz czas trwania pod nową, czytelną nazwą w nagłówku.",
        "prompt": "Pobierz z katalogu filmów tytuł oraz czas trwania, nadając kolumnie length nowy nagłówek duration_min za pomocą AS.",
        "sol": "SELECT title, length AS duration_min FROM film;",
        "order": false,
        "tables": [
          "film"
        ],
        "hint": "Użyj AS: length AS duration_min",
        "newFeature": {
          "title": "Słowo kluczowe AS (aliasy)",
          "desc": "AS pozwala nadać kolumnie lub obliczeniu własny, czytelny nagłówek w wyniku zapytania.",
          "example": "SELECT cena * 100 AS grosze FROM produkty;"
        }
      },
      {
        "stepCode": "R2",
        "keySuffix": "r2",
        "isWarmup": true,
        "tier": "warmup",
        "goal": "Przygotuj listę pracowników z polskimi nagłówkami kolumn imienia i nazwiska.",
        "prompt": "Pobierz identyfikator pracownika, imię pod aliasem imie oraz nazwisko pod aliasem nazwisko z tabeli personelu.",
        "sol": "SELECT staff_id, first_name AS imie, last_name AS nazwisko FROM staff;",
        "order": false,
        "tables": [
          "staff"
        ],
        "hint": "Zastosuj dwa aliasy: first_name AS imie, last_name AS nazwisko",
        "newFeature": null
      },
      {
        "stepCode": "1",
        "keySuffix": "0",
        "isWarmup": false,
        "tier": "basic",
        "goal": "Pobierz z rejestru oddziałów store_id oraz miasto pod aliasem miasto.",
        "prompt": "Pobierz z rejestru oddziałów identyfikator sklepu store_id oraz miasto pod czytelnym aliasem miasto (city AS miasto).",
        "sol": "SELECT store_id, city AS miasto FROM store;",
        "order": false,
        "tables": [
          "store"
        ],
        "hint": "Wpisz: SELECT store_id, city AS miasto FROM store;",
        "newFeature": null
      },
      {
        "stepCode": "2",
        "keySuffix": "1",
        "isWarmup": false,
        "tier": "basic",
        "goal": "Kwoty w kolumnie amount są wyrażone w euro (np. 4.99). Pobierz identyfikator płatności payment_id, kwotę oryginalną amount oraz kwotę przeliczoną na centy (amount * 100) pod aliasem amount_cents.",
        "prompt": "Kwoty w kolumnie amount są wyrażone w euro (np. 4.99). Pobierz identyfikator płatności payment_id, kwotę oryginalną amount oraz kwotę przeliczoną na centy (amount * 100) pod aliasem amount_cents.",
        "sol": "SELECT payment_id, amount, amount * 100 AS amount_cents FROM payment;",
        "order": false,
        "tables": [
          "payment"
        ],
        "hint": "Pomnóż kwotę przez 100: amount * 100 AS amount_cents",
        "newFeature": {
          "title": "Obliczenia arytmetyczne (+, -, *, /)",
          "desc": "W SELECT możesz wykonywać działania bezpośrednio na kolumnach liczbowych i nadać im czytelną nazwę przez AS.",
          "example": "SELECT cena * 100 AS grosze FROM produkty;"
        }
      },
      {
        "stepCode": "3",
        "keySuffix": "2",
        "isWarmup": false,
        "tier": "basic",
        "goal": "Pobierz z katalogu filmów tytuł, cenę wypożyczenia oraz nową stawkę powiększoną o opłatę 2 pod aliasem new_rate.",
        "prompt": "Pobierz z katalogu filmów tytuł, cenę wypożyczenia oraz nową stawkę powiększoną o opłatę 2 pod aliasem new_rate.",
        "sol": "SELECT title, rental_rate, rental_rate + 2 AS new_rate FROM film;",
        "order": false,
        "tables": [
          "film"
        ],
        "hint": "Dodaj 2: rental_rate + 2 AS new_rate",
        "newFeature": null
      },
      {
        "stepCode": "4",
        "keySuffix": "3",
        "isWarmup": false,
        "tier": "adv",
        "goal": "Pobierz tytuł, długość filmu w minutach oraz długość w godzinach (length podzielone przez 60.0) pod aliasem duration_hours.",
        "prompt": "Pobierz tytuł, długość filmu w minutach oraz długość w godzinach (length podzielone przez 60.0) pod aliasem duration_hours.",
        "sol": "SELECT title, length, length / 60.0 AS duration_hours FROM film;",
        "order": false,
        "tables": [
          "film"
        ],
        "hint": "Podziel przez 60.0: length / 60.0 AS duration_hours",
        "newFeature": null
      },
      {
        "stepCode": "5",
        "keySuffix": "4",
        "isWarmup": false,
        "tier": "adv",
        "goal": "Pobierz tytuł, koszt odtworzenia, cenę wypożyczenia oraz różnicę kosztu i ceny pod aliasem cost_diff.",
        "prompt": "Pobierz tytuł, koszt odtworzenia, cenę wypożyczenia oraz różnicę kosztu i ceny pod aliasem cost_diff.",
        "sol": "SELECT title, replacement_cost, rental_rate, replacement_cost - rental_rate AS cost_diff FROM film;",
        "order": false,
        "tables": [
          "film"
        ],
        "hint": "Odejmij cenę od kosztu: replacement_cost - rental_rate AS cost_diff",
        "newFeature": null
      },
      {
        "stepCode": "6",
        "keySuffix": "5",
        "isWarmup": false,
        "tier": "adv",
        "goal": "Pobierz identyfikator klienta customer_id, datę płatności payment_date, kwotę amount oraz kwotę przeliczoną na złotówki (amount * 4) pod aliasem amount_pln.",
        "prompt": "Pobierz identyfikator klienta customer_id, datę płatności payment_date, kwotę amount oraz kwotę przeliczoną na złotówki (amount * 4) pod aliasem amount_pln.",
        "sol": "SELECT customer_id, payment_date, amount, amount * 4 AS amount_pln FROM payment;",
        "order": false,
        "tables": [
          "payment"
        ],
        "hint": "Pomnóż kwotę przez 4: amount * 4 AS amount_pln",
        "newFeature": null
      }
    ]
  },
  {
    "id": "p1_3",
    "stage": 1,
    "title": "1.3 Unikalne wartości (DISTINCT)",
    "tables": [
      "film",
      "customer",
      "store"
    ],
    "cols": [
      "SELECT",
      "DISTINCT",
      "FROM",
      "rating",
      "rental_rate",
      "store_id",
      "release_year",
      "active",
      "city"
    ],
    "theory": "<ul><li><strong><code>DISTINCT</code>:</strong> eliminuje zduplikowane wiersze i zwraca wyłącznie unikalne wartości.</li><li><strong>Miejsce w zapytaniu:</strong> słowo <code>DISTINCT</code> stawia się bezpośrednio po <code>SELECT</code>.</li></ul><div class=\"theory-code\"><code>SELECT DISTINCT rating\nFROM film;</code></div>",
    "variants": [
      {
        "stepCode": "R1",
        "keySuffix": "r1",
        "isWarmup": true,
        "tier": "warmup",
        "goal": "Wyświetl listę wszystkich unikalnych kategorii wiekowych w katalogu filmów.",
        "prompt": "Wybierz unikalne kategorie wiekowe (rating) z tabeli film bez żadnych powtórzeń.",
        "sol": "SELECT DISTINCT rating FROM film;",
        "order": false,
        "tables": [
          "film"
        ],
        "hint": "Wpisz: SELECT DISTINCT rating FROM film;",
        "newFeature": {
          "title": "Klauzula DISTINCT",
          "desc": "DISTINCT usuwa powtórzenia i pozostawia tylko unikalne wiersze.",
          "example": "SELECT DISTINCT rating FROM film;"
        }
      },
      {
        "stepCode": "R2",
        "keySuffix": "r2",
        "isWarmup": true,
        "tier": "warmup",
        "goal": "Sprawdź, jakie różne stawki cenowe za wypożyczenie występują w bazie filmów.",
        "prompt": "Pobierz unikalne ceny wypożyczenia (rental_rate) z katalogu filmów.",
        "sol": "SELECT DISTINCT rental_rate FROM film;",
        "order": false,
        "tables": [
          "film"
        ],
        "hint": "SELECT DISTINCT rental_rate FROM film;",
        "newFeature": null
      },
      {
        "stepCode": "1",
        "keySuffix": "0",
        "isWarmup": false,
        "tier": "basic",
        "goal": "Pobierz unikalne identyfikatory sklepów (store_id), do których przypisani są nasi klienci.",
        "prompt": "Pobierz unikalne identyfikatory sklepów (store_id), do których przypisani są nasi klienci.",
        "sol": "SELECT DISTINCT store_id FROM customer;",
        "order": false,
        "tables": [
          "customer"
        ],
        "hint": "SELECT DISTINCT store_id FROM customer;",
        "newFeature": null
      },
      {
        "stepCode": "2",
        "keySuffix": "1",
        "isWarmup": false,
        "tier": "basic",
        "goal": "Pobierz unikalne lata wydania (release_year) z katalogu filmów.",
        "prompt": "Pobierz unikalne lata wydania (release_year) z katalogu filmów.",
        "sol": "SELECT DISTINCT release_year FROM film;",
        "order": false,
        "tables": [
          "film"
        ],
        "hint": "SELECT DISTINCT release_year FROM film;",
        "newFeature": null
      },
      {
        "stepCode": "3",
        "keySuffix": "2",
        "isWarmup": false,
        "tier": "basic",
        "goal": "Pobierz ze zbioru klientów unikalne wartości ze znacznika aktywności (active).",
        "prompt": "Pobierz ze zbioru klientów unikalne wartości ze znacznika aktywności (active).",
        "sol": "SELECT DISTINCT active FROM customer;",
        "order": false,
        "tables": [
          "customer"
        ],
        "hint": "SELECT DISTINCT active FROM customer;",
        "newFeature": null
      },
      {
        "stepCode": "4",
        "keySuffix": "3",
        "isWarmup": false,
        "tier": "adv",
        "goal": "Pobierz unikalne kombinacje kategorii wiekowej (rating) oraz ceny wypożyczenia (rental_rate) z filmów.",
        "prompt": "Pobierz unikalne kombinacje kategorii wiekowej (rating) oraz ceny wypożyczenia (rental_rate) z filmów.",
        "sol": "SELECT DISTINCT rating, rental_rate FROM film;",
        "order": false,
        "tables": [
          "film"
        ],
        "hint": "Podaj dwie kolumny po DISTINCT: rating, rental_rate",
        "newFeature": null
      },
      {
        "stepCode": "5",
        "keySuffix": "4",
        "isWarmup": false,
        "tier": "adv",
        "goal": "Pobierz unikalne pary identyfikatora sklepu (store_id) oraz statusu klienta (active) z bazy klientów.",
        "prompt": "Pobierz unikalne pary identyfikatora sklepu (store_id) oraz statusu klienta (active) z bazy klientów.",
        "sol": "SELECT DISTINCT store_id, active FROM customer;",
        "order": false,
        "tables": [
          "customer"
        ],
        "hint": "SELECT DISTINCT store_id, active FROM customer;",
        "newFeature": null
      },
      {
        "stepCode": "6",
        "keySuffix": "5",
        "isWarmup": false,
        "tier": "adv",
        "goal": "Pobierz ze słownika placówek unikalne miasta (city), w których działają nasze sklepy.",
        "prompt": "Pobierz ze słownika placówek unikalne miasta (city), w których działają nasze sklepy.",
        "sol": "SELECT DISTINCT city FROM store;",
        "order": false,
        "tables": [
          "store"
        ],
        "hint": "SELECT DISTINCT city FROM store;",
        "newFeature": null
      }
    ]
  },
  {
    "id": "p1_4",
    "stage": 1,
    "title": "1.4 Sortowanie wyników (ORDER BY) i limit wierszy (LIMIT)",
    "tables": [
      "film",
      "customer",
      "actor",
      "payment"
    ],
    "cols": [
      "SELECT",
      "FROM",
      "ORDER BY",
      "ASC",
      "DESC",
      "LIMIT",
      "AS",
      "title",
      "length",
      "rental_rate",
      "film_id",
      "amount"
    ],
    "theory": "<ul><li><strong><code>ORDER BY</code>:</strong> sortuje wiersze rosnąco (<code>ASC</code>, domyślnie) lub malejąco (<code>DESC</code>).</li><li><strong><code>LIMIT N</code>:</strong> ogranicza wynik do pierwszych N wierszy.</li></ul><div class=\"theory-code\"><code>SELECT title, length\nFROM film\nORDER BY length DESC, title ASC\nLIMIT 5;</code></div>",
    "variants": [
      {
        "stepCode": "R1",
        "keySuffix": "r1",
        "isWarmup": true,
        "tier": "warmup",
        "goal": "Ułóż filmy alfabetycznie według tytułu.",
        "prompt": "Pobierz tytuł oraz cenę wypożyczenia wszystkich filmów, sortując wynik rosnąco po tytule.",
        "sol": "SELECT title, rental_rate FROM film ORDER BY title ASC;",
        "order": true,
        "tables": [
          "film"
        ],
        "hint": "Dopisz: ORDER BY title ASC;",
        "newFeature": {
          "title": "Klauzula ORDER BY",
          "desc": "ORDER BY sortuje wynik. Domyślnie rosnąco (ASC).",
          "example": "SELECT title FROM film ORDER BY title ASC;"
        }
      },
      {
        "stepCode": "R2",
        "keySuffix": "r2",
        "isWarmup": true,
        "tier": "warmup",
        "goal": "Ogranicz podgląd tabeli do pierwszych 5 wierszy.",
        "prompt": "Pobierz film_id oraz tytuł z tabeli film, ograniczając wynik do 5 pierwszych wierszy.",
        "sol": "SELECT film_id, title FROM film LIMIT 5;",
        "order": false,
        "tables": [
          "film"
        ],
        "hint": "Dopisz na końcu: LIMIT 5;",
        "newFeature": {
          "title": "Klauzula LIMIT",
          "desc": "LIMIT odcina wynik do żądanej liczby rekordów.",
          "example": "SELECT film_id, title FROM film LIMIT 5;"
        }
      },
      {
        "stepCode": "1",
        "keySuffix": "0",
        "isWarmup": false,
        "tier": "basic",
        "goal": "Pobierz tytuły i czasy trwania filmów, sortując je od najdłuższych (malejąco), a przy remisie alfabetycznie po tytule.",
        "prompt": "Pobierz tytuły i czasy trwania filmów, sortując je od najdłuższych (malejąco), a przy remisie alfabetycznie po tytule.",
        "sol": "SELECT title, length FROM film ORDER BY length DESC, title ASC;",
        "order": true,
        "tables": [
          "film"
        ],
        "hint": "Wpisz: ORDER BY length DESC, title ASC;",
        "newFeature": {
          "title": "Sortowanie malejące DESC i po kilku kolumnach",
          "desc": "DESC sortuje od największych do najmniejszych. Możesz podać kilka kolumn po przecinku.",
          "example": "ORDER BY length DESC, title ASC;"
        }
      },
      {
        "stepCode": "2",
        "keySuffix": "1",
        "isWarmup": false,
        "tier": "basic",
        "goal": "Pobierz imię, nazwisko oraz datę utworzenia konta klientów, sortując rosnąco po dacie założenia konta, a przy remisie po customer_id.",
        "prompt": "Pobierz imię, nazwisko oraz datę utworzenia konta klientów, sortując rosnąco po dacie założenia konta, a przy remisie po customer_id.",
        "sol": "SELECT first_name, last_name, create_date FROM customer ORDER BY create_date ASC, customer_id ASC;",
        "order": true,
        "tables": [
          "customer"
        ],
        "hint": "ORDER BY create_date ASC, customer_id ASC;",
        "newFeature": null
      },
      {
        "stepCode": "3",
        "keySuffix": "2",
        "isWarmup": false,
        "tier": "basic",
        "goal": "Pobierz actor_id, first_name oraz last_name z tabeli aktorów, sortując rosnąco po actor_id i ograniczając wynik do 4 rekordów.",
        "prompt": "Pobierz actor_id, first_name oraz last_name z tabeli aktorów, sortując rosnąco po actor_id i ograniczając wynik do 4 rekordów.",
        "sol": "SELECT actor_id, first_name, last_name FROM actor ORDER BY actor_id ASC LIMIT 4;",
        "order": true,
        "tables": [
          "actor"
        ],
        "hint": "ORDER BY actor_id ASC LIMIT 4;",
        "newFeature": null
      },
      {
        "stepCode": "4",
        "keySuffix": "3",
        "isWarmup": false,
        "tier": "adv",
        "goal": "Pobierz tytuł oraz czas trwania jako duration_min dla 5 najdłuższych filmów w katalogu (przy remisie alfabetycznie po tytule).",
        "prompt": "Pobierz tytuł oraz czas trwania jako duration_min dla 5 najdłuższych filmów w katalogu (przy remisie alfabetycznie po tytule).",
        "sol": "SELECT title, length AS duration_min FROM film ORDER BY length DESC, title ASC LIMIT 5;",
        "order": true,
        "tables": [
          "film"
        ],
        "hint": "SELECT title, length AS duration_min FROM film ORDER BY length DESC, title ASC LIMIT 5;",
        "newFeature": null
      },
      {
        "stepCode": "5",
        "keySuffix": "4",
        "isWarmup": false,
        "tier": "adv",
        "goal": "Pobierz tytuł oraz koszt odtworzenia jako max_cost dla 5 najdroższych w odtworzeniu filmów (remis rozstrzygnij po tytule).",
        "prompt": "Pobierz tytuł oraz koszt odtworzenia jako max_cost dla 5 najdroższych w odtworzeniu filmów (remis rozstrzygnij po tytule).",
        "sol": "SELECT title, replacement_cost AS max_cost FROM film ORDER BY replacement_cost DESC, title ASC LIMIT 5;",
        "order": true,
        "tables": [
          "film"
        ],
        "hint": "ORDER BY replacement_cost DESC, title ASC LIMIT 5;",
        "newFeature": null
      },
      {
        "stepCode": "6",
        "keySuffix": "5",
        "isWarmup": false,
        "tier": "adv",
        "goal": "Wybierz payment_id, kwotę oraz datę 5 największych pojedynczych wpłat z rejestru płatności (przy remisie po payment_id rosnąco).",
        "prompt": "Wybierz payment_id, kwotę oraz datę 5 największych pojedynczych wpłat z rejestru płatności (przy remisie po payment_id rosnąco).",
        "sol": "SELECT payment_id, amount, payment_date FROM payment ORDER BY amount DESC, payment_id ASC LIMIT 5;",
        "order": true,
        "tables": [
          "payment"
        ],
        "hint": "ORDER BY amount DESC, payment_id ASC LIMIT 5;",
        "newFeature": null
      }
    ]
  },
  {
    "id": "p2_1",
    "stage": 2,
    "title": "2.1 Proste WHERE — tylko jeden warunek (=, >, <, <>)",
    "tables": [
      "film",
      "customer"
    ],
    "cols": [
      "SELECT",
      "FROM",
      "WHERE",
      "=",
      ">",
      "<",
      "<>",
      "title",
      "rental_rate",
      "rating",
      "length",
      "replacement_cost",
      "store_id"
    ],
    "theory": "<ul><li><strong><code>WHERE</code>:</strong> odrzuca wiersze niespełniające warunku logicznego przed przygotowaniem wyniku.</li><li><strong>Tekst i liczby:</strong> wartości tekstowe podawaj zawsze w apostrofach (np. <code>rating = 'PG'</code>), a liczby bez cudzysłowów (np. <code>rental_rate = 0.99</code>).</li><li><strong>Operatory:</strong> <code>=</code> (równe), <code>></code> (większe), <code><</code> (mniejsze), <code><></code> lub <code>!=</code> (różne).</li></ul><div class=\"theory-code\"><code>SELECT title, rental_rate\nFROM film\nWHERE rental_rate = 0.99;</code></div>",
    "variants": [
      {
        "stepCode": "R1",
        "keySuffix": "r1",
        "isWarmup": true,
        "tier": "warmup",
        "goal": "Wyświetl tytuły i stawki filmów, których cena wypożyczenia wynosi dokładnie 0.99$.",
        "prompt": "Pobierz z katalogu filmów tytuł oraz cenę wypożyczenia dla filmów z ceną rental_rate równą 0.99.",
        "sol": "SELECT title, rental_rate FROM film WHERE rental_rate = 0.99;",
        "order": false,
        "tables": [
          "film"
        ],
        "hint": "WHERE rental_rate = 0.99",
        "newFeature": {
          "title": "Klauzula WHERE (filtrowanie)",
          "desc": "WHERE działa jak sito odrzucające wiersze przed wyświetleniem wyniku.",
          "example": "SELECT title FROM film WHERE rental_rate = 0.99;"
        }
      },
      {
        "stepCode": "R2",
        "keySuffix": "r2",
        "isWarmup": true,
        "tier": "warmup",
        "goal": "Znajdź filmy z kategorią wiekową PG.",
        "prompt": "Wybierz tytuł oraz kategorię wiekową (rating) dla filmów z ratingiem równym PG.",
        "sol": "SELECT title, rating FROM film WHERE rating = 'PG';",
        "order": false,
        "tables": [
          "film"
        ],
        "hint": "Wartość tekstową zapisz w apostrofach: WHERE rating = 'PG'",
        "newFeature": {
          "title": "Filtrowanie tekstu (pojedyncze apostrofy)",
          "desc": "W SQL wartości tekstowe zawsze ujmujemy w pojedyncze apostrofy '...'.",
          "example": "SELECT title FROM film WHERE rating = 'PG';"
        }
      },
      {
        "stepCode": "1",
        "keySuffix": "0",
        "isWarmup": false,
        "tier": "basic",
        "goal": "Pobierz tytuły oraz czasy trwania filmów, których długość (length) przekracza 120 minut.",
        "prompt": "Pobierz tytuły oraz czasy trwania filmów, których długość (length) przekracza 120 minut.",
        "sol": "SELECT title, length FROM film WHERE length > 120;",
        "order": false,
        "tables": [
          "film"
        ],
        "hint": "WHERE length > 120",
        "newFeature": null
      },
      {
        "stepCode": "2",
        "keySuffix": "1",
        "isWarmup": false,
        "tier": "basic",
        "goal": "Pobierz tytuł i cenę wypożyczenia dla filmów o cenie wynoszącej dokładnie 4.99$.",
        "prompt": "Pobierz tytuł i cenę wypożyczenia dla filmów o cenie wynoszącej dokładnie 4.99$.",
        "sol": "SELECT title, rental_rate FROM film WHERE rental_rate = 4.99;",
        "order": false,
        "tables": [
          "film"
        ],
        "hint": "WHERE rental_rate = 4.99",
        "newFeature": null
      },
      {
        "stepCode": "3",
        "keySuffix": "2",
        "isWarmup": false,
        "tier": "basic",
        "goal": "Pobierz imię, nazwisko oraz store_id klientów zarejestrowanych w placówce o store_id równym 1.",
        "prompt": "Pobierz imię, nazwisko oraz store_id klientów zarejestrowanych w placówce o store_id równym 1.",
        "sol": "SELECT first_name, last_name, store_id FROM customer WHERE store_id = 1;",
        "order": false,
        "tables": [
          "customer"
        ],
        "hint": "WHERE store_id = 1",
        "newFeature": null
      },
      {
        "stepCode": "4",
        "keySuffix": "3",
        "isWarmup": false,
        "tier": "adv",
        "goal": "Pobierz tytuł oraz koszt odtworzenia dla filmów, których replacement_cost jest ściśle większy niż 20.",
        "prompt": "Pobierz tytuł oraz koszt odtworzenia dla filmów, których replacement_cost jest ściśle większy niż 20.",
        "sol": "SELECT title, replacement_cost FROM film WHERE replacement_cost > 20;",
        "order": false,
        "tables": [
          "film"
        ],
        "hint": "WHERE replacement_cost > 20",
        "newFeature": null
      },
      {
        "stepCode": "5",
        "keySuffix": "4",
        "isWarmup": false,
        "tier": "adv",
        "goal": "Pobierz tytuł oraz długość dla krótkich filmów trwających poniżej 60 minut.",
        "prompt": "Pobierz tytuł oraz długość dla krótkich filmów trwających poniżej 60 minut.",
        "sol": "SELECT title, length FROM film WHERE length < 60;",
        "order": false,
        "tables": [
          "film"
        ],
        "hint": "WHERE length < 60",
        "newFeature": null
      },
      {
        "stepCode": "6",
        "keySuffix": "5",
        "isWarmup": false,
        "tier": "adv",
        "goal": "Pobierz tytuł oraz kategorię wiekową dla wszystkich filmów niemających kategorii R (użyj operatora <>), sortując alfabetycznie po tytule.",
        "prompt": "Pobierz tytuł oraz kategorię wiekową dla wszystkich filmów niemających kategorii R (użyj operatora <>), sortując alfabetycznie po tytule.",
        "sol": "SELECT title, rating FROM film WHERE rating <> 'R' ORDER BY title ASC;",
        "order": true,
        "tables": [
          "film"
        ],
        "hint": "WHERE rating <> 'R' ORDER BY title ASC;",
        "newFeature": {
          "title": "Operator różności <>",
          "desc": "Symbol <> oznacza \"różne od\" (nie równe).",
          "example": "SELECT title FROM film WHERE rating <> 'R';"
        }
      }
    ]
  },
  {
    "id": "p2_2",
    "stage": 2,
    "title": "2.2 Łączenie warunków: AND oraz OR",
    "tables": [
      "film",
      "customer",
      "payment"
    ],
    "cols": [
      "SELECT",
      "FROM",
      "WHERE",
      "AND",
      "OR",
      "title",
      "rating",
      "rental_rate",
      "length",
      "store_id",
      "active",
      "amount",
      "payment_date"
    ],
    "theory": "<ul><li><strong><code>AND</code>:</strong> wymaga spełnienia wszystkich warunków jednocześnie.</li><li><strong><code>OR</code>:</strong> wymaga spełnienia co najmniej jednego warunku.</li><li><strong>Nawiasy <code>(...)</code>:</strong> stosuj nawiasy przy łączeniu AND i OR, aby kontrolować kolejność logiczną!</li></ul><div class=\"theory-code\"><code>SELECT title, rating, rental_rate\nFROM film\nWHERE rating = 'PG' AND rental_rate < 3.00;</code></div>",
    "variants": [
      {
        "stepCode": "R1",
        "keySuffix": "r1",
        "isWarmup": true,
        "tier": "warmup",
        "goal": "Znajdź tanie filmy familijne (rating PG i cena 0.99$).",
        "prompt": "Pobierz tytuł, kategorię wiekową oraz cenę wypożyczenia dla filmów z ratingiem równym PG i stawką rental_rate równą 0.99.",
        "sol": "SELECT title, rating, rental_rate FROM film WHERE rating = 'PG' AND rental_rate = 0.99;",
        "order": false,
        "tables": [
          "film"
        ],
        "hint": "WHERE rating = 'PG' AND rental_rate = 0.99",
        "newFeature": {
          "title": "Operator AND",
          "desc": "AND wymaga spełnienia obu warunków jednocześnie.",
          "example": "SELECT title FROM film WHERE rating = 'PG' AND rental_rate = 0.99;"
        }
      },
      {
        "stepCode": "R2",
        "keySuffix": "r2",
        "isWarmup": true,
        "tier": "warmup",
        "goal": "Wyświetl filmy z kategorią dla najmłodszych (G lub PG).",
        "prompt": "Pobierz tytuł oraz rating dla filmów, których kategoria rating jest równa G lub jest równa PG.",
        "sol": "SELECT title, rating FROM film WHERE rating = 'G' OR rating = 'PG';",
        "order": false,
        "tables": [
          "film"
        ],
        "hint": "WHERE rating = 'G' OR rating = 'PG'",
        "newFeature": {
          "title": "Operator OR",
          "desc": "OR wymaga spełnienia przynajmniej jednego z warunków.",
          "example": "SELECT title FROM film WHERE rating = 'G' OR rating = 'PG';"
        }
      },
      {
        "stepCode": "1",
        "keySuffix": "0",
        "isWarmup": false,
        "tier": "basic",
        "goal": "Pobierz tytuł, rating oraz długość dla filmów z kategorią R trwających powyżej 100 minut.",
        "prompt": "Pobierz tytuł, rating oraz długość dla filmów z kategorią R trwających powyżej 100 minut.",
        "sol": "SELECT title, rating, length FROM film WHERE rating = 'R' AND length > 100;",
        "order": false,
        "tables": [
          "film"
        ],
        "hint": "WHERE rating = 'R' AND length > 100",
        "newFeature": null
      },
      {
        "stepCode": "2",
        "keySuffix": "1",
        "isWarmup": false,
        "tier": "basic",
        "goal": "Pobierz tytuł, długość oraz cenę dla filmów trwających poniżej 60 minut LUB mających cenę powyżej 4.00$.",
        "prompt": "Pobierz tytuł, długość oraz cenę dla filmów trwających poniżej 60 minut LUB mających cenę powyżej 4.00$.",
        "sol": "SELECT title, length, rental_rate FROM film WHERE length < 60 OR rental_rate > 4.00;",
        "order": false,
        "tables": [
          "film"
        ],
        "hint": "WHERE length < 60 OR rental_rate > 4.00",
        "newFeature": null
      },
      {
        "stepCode": "3",
        "keySuffix": "2",
        "isWarmup": false,
        "tier": "basic",
        "goal": "Pobierz imię, nazwisko oraz store_id dla aktywnych klientów (active = 1) z placówki o store_id = 1.",
        "prompt": "Pobierz imię, nazwisko oraz store_id dla aktywnych klientów (active = 1) z placówki o store_id = 1.",
        "sol": "SELECT first_name, last_name, store_id FROM customer WHERE store_id = 1 AND active = 1;",
        "order": false,
        "tables": [
          "customer"
        ],
        "hint": "WHERE store_id = 1 AND active = 1",
        "newFeature": null
      },
      {
        "stepCode": "4",
        "keySuffix": "3",
        "isWarmup": false,
        "tier": "adv",
        "goal": "Pobierz tytuł, rating i cenę dla filmów z ratingiem PG lub G, których cena wypożyczenia nie przekracza 2.99 (rental_rate <= 2.99). Użyj nawiasów.",
        "prompt": "Pobierz tytuł, rating i cenę dla filmów z ratingiem PG lub G, których cena wypożyczenia nie przekracza 2.99 (rental_rate <= 2.99). Użyj nawiasów.",
        "sol": "SELECT title, rating, rental_rate FROM film WHERE (rating = 'PG' OR rating = 'G') AND rental_rate <= 2.99;",
        "order": false,
        "tables": [
          "film"
        ],
        "hint": "WHERE (rating = 'PG' OR rating = 'G') AND rental_rate <= 2.99",
        "newFeature": null
      },
      {
        "stepCode": "5",
        "keySuffix": "4",
        "isWarmup": false,
        "tier": "adv",
        "goal": "Pobierz tytuł, rating oraz czas trwania pod aliasem duration_min dla filmów z ratingiem PG-13 o długości co najmniej 120 minut, sortując malejąco po długości, a przy remisie po tytule.",
        "prompt": "Pobierz tytuł, rating oraz czas trwania pod aliasem duration_min dla filmów z ratingiem PG-13 o długości co najmniej 120 minut, sortując malejąco po długości, a przy remisie po tytule.",
        "sol": "SELECT title, rating, length AS duration_min FROM film WHERE rating = 'PG-13' AND length >= 120 ORDER BY length DESC, title ASC;",
        "order": true,
        "tables": [
          "film"
        ],
        "hint": "WHERE rating = 'PG-13' AND length >= 120 ORDER BY length DESC, title ASC;",
        "newFeature": null
      },
      {
        "stepCode": "6",
        "keySuffix": "5",
        "isWarmup": false,
        "tier": "adv",
        "goal": "Pobierz payment_id, kwotę oraz datę dla płatności o kwocie co najmniej 8.00$ LUB nieprzekraczającej 0.99$, sortując od najwyższych kwot (malejąco), a przy remisie po payment_id rosnąco.",
        "prompt": "Pobierz payment_id, kwotę oraz datę dla płatności o kwocie co najmniej 8.00$ LUB nieprzekraczającej 0.99$, sortując od najwyższych kwot (malejąco), a przy remisie po payment_id rosnąco.",
        "sol": "SELECT payment_id, amount, payment_date FROM payment WHERE amount >= 8.00 OR amount <= 0.99 ORDER BY amount DESC, payment_id ASC;",
        "order": true,
        "tables": [
          "payment"
        ],
        "hint": "WHERE amount >= 8.00 OR amount <= 0.99 ORDER BY amount DESC, payment_id ASC;",
        "newFeature": null
      }
    ]
  },
  {
    "id": "p2_3",
    "stage": 2,
    "title": "2.3 Szybkie filtry: IN (...), BETWEEN oraz wyszukiwanie tekstu ILIKE i IS NULL",
    "tables": [
      "film",
      "customer"
    ],
    "cols": [
      "SELECT",
      "FROM",
      "WHERE",
      "IN",
      "BETWEEN",
      "ILIKE",
      "IS NULL",
      "IS NOT NULL",
      "title",
      "rating",
      "length",
      "replacement_cost",
      "first_name",
      "last_name",
      "email",
      "active"
    ],
    "theory": "<ul><li><strong><code>IN (...)</code>:</strong> sprawdza, czy wartość znajduje się na liście (np. <code>rating IN ('G', 'PG')</code>).</li><li><strong><code>BETWEEN a AND b</code>:</strong> sprawdza zakres obustronnie domknięty (od a do b włącznie).</li><li><strong><code>ILIKE '%tekst%'</code>:</strong> wyszukuje wzorzec tekstu bez względu na wielkość liter (znak <code>%</code> to dowolny ciąg znaków).</li><li><strong><code>IS NULL / IS NOT NULL</code>:</strong> sprawdza brak lub obecność wartości (nigdy nie używaj <code>= NULL</code>!).</li></ul><div class=\"theory-code\"><code>SELECT title, rating\nFROM film\nWHERE rating IN ('G', 'R') AND title ILIKE 'a%';</code></div>",
    "variants": [
      {
        "stepCode": "R1",
        "keySuffix": "r1",
        "isWarmup": true,
        "tier": "warmup",
        "goal": "Zwróć filmy o ratingu G lub R za pomocą operatora IN.",
        "prompt": "Pobierz tytuł oraz kategorię wiekową dla filmów, których rating znajduje się na liście: G, R (użyj operatora IN).",
        "sol": "SELECT title, rating FROM film WHERE rating IN ('G', 'R');",
        "order": false,
        "tables": [
          "film"
        ],
        "hint": "WHERE rating IN ('G', 'R')",
        "newFeature": {
          "title": "Operator IN (...)",
          "desc": "IN zastępuje ciągłe powtarzanie OR i sprawdza obecność na liście wartości.",
          "example": "SELECT title FROM film WHERE rating IN ('G', 'R');"
        }
      },
      {
        "stepCode": "R2",
        "keySuffix": "r2",
        "isWarmup": true,
        "tier": "warmup",
        "goal": "Znajdź filmy o długości od 60 do 90 minut włącznie za pomocą BETWEEN.",
        "prompt": "Pobierz tytuł oraz czas trwania dla filmów, których długość mieści się w przedziale od 60 do 90 minut włącznie.",
        "sol": "SELECT title, length FROM film WHERE length BETWEEN 60 AND 90;",
        "order": false,
        "tables": [
          "film"
        ],
        "hint": "WHERE length BETWEEN 60 AND 90",
        "newFeature": {
          "title": "Operator BETWEEN",
          "desc": "BETWEEN X AND Y sprawdza przedział od X do Y włącznie.",
          "example": "SELECT title FROM film WHERE length BETWEEN 60 AND 90;"
        }
      },
      {
        "stepCode": "1",
        "keySuffix": "0",
        "isWarmup": false,
        "tier": "basic",
        "goal": "Pobierz tytuł oraz rating dla filmów z ratingiem na liście: G, PG, PG-13.",
        "prompt": "Pobierz tytuł oraz rating dla filmów z ratingiem na liście: G, PG, PG-13.",
        "sol": "SELECT title, rating FROM film WHERE rating IN ('G', 'PG', 'PG-13');",
        "order": false,
        "tables": [
          "film"
        ],
        "hint": "WHERE rating IN ('G', 'PG', 'PG-13')",
        "newFeature": null
      },
      {
        "stepCode": "2",
        "keySuffix": "1",
        "isWarmup": false,
        "tier": "basic",
        "goal": "Pobierz tytuł oraz koszt odtworzenia dla filmów, których replacement_cost mieści się między 15.00 a 22.00 włącznie.",
        "prompt": "Pobierz tytuł oraz koszt odtworzenia dla filmów, których replacement_cost mieści się między 15.00 a 22.00 włącznie.",
        "sol": "SELECT title, replacement_cost FROM film WHERE replacement_cost BETWEEN 15.00 AND 22.00;",
        "order": false,
        "tables": [
          "film"
        ],
        "hint": "WHERE replacement_cost BETWEEN 15.00 AND 22.00",
        "newFeature": null
      },
      {
        "stepCode": "3",
        "keySuffix": "2",
        "isWarmup": false,
        "tier": "basic",
        "goal": "Pobierz tytuł oraz rating dla filmów, których tytuł zaczyna się na literę A (użyj ILIKE), sortując alfabetycznie po tytule.",
        "prompt": "Pobierz tytuł oraz rating dla filmów, których tytuł zaczyna się na literę A (użyj ILIKE), sortując alfabetycznie po tytule.",
        "sol": "SELECT title, rating FROM film WHERE title ILIKE 'a%' ORDER BY title ASC;",
        "order": true,
        "tables": [
          "film"
        ],
        "hint": "WHERE title ILIKE 'a%' ORDER BY title ASC;",
        "newFeature": {
          "title": "Operator ILIKE i maska %",
          "desc": "ILIKE nie rozróżnia wielkości liter. Znak % zastępuje dowolny ciąg znaków.",
          "example": "SELECT title FROM film WHERE title ILIKE 'a%';"
        }
      },
      {
        "stepCode": "4",
        "keySuffix": "3",
        "isWarmup": false,
        "tier": "adv",
        "goal": "Pobierz tytuł oraz rating dla filmów, których tytuł zawiera w dowolnym miejscu słowo love (użyj ILIKE), sortując alfabetycznie po tytule.",
        "prompt": "Pobierz tytuł oraz rating dla filmów, których tytuł zawiera w dowolnym miejscu słowo love (użyj ILIKE), sortując alfabetycznie po tytule.",
        "sol": "SELECT title, rating FROM film WHERE title ILIKE '%love%' ORDER BY title ASC;",
        "order": true,
        "tables": [
          "film"
        ],
        "hint": "WHERE title ILIKE '%love%' ORDER BY title ASC;",
        "newFeature": null
      },
      {
        "stepCode": "5",
        "keySuffix": "4",
        "isWarmup": false,
        "tier": "adv",
        "goal": "Pobierz imię, nazwisko oraz adres e-mail dla aktywnych klientów (active = 1), których e-mail nie jest pusty (użyj IS NOT NULL).",
        "prompt": "Pobierz imię, nazwisko oraz adres e-mail dla aktywnych klientów (active = 1), których e-mail nie jest pusty (użyj IS NOT NULL).",
        "sol": "SELECT first_name, last_name, email FROM customer WHERE email IS NOT NULL AND active = 1;",
        "order": false,
        "tables": [
          "customer"
        ],
        "hint": "WHERE email IS NOT NULL AND active = 1",
        "newFeature": {
          "title": "Sprawdzanie NULL: IS NOT NULL",
          "desc": "Wartości NULL sprawdzamy wyłącznie przez IS NULL lub IS NOT NULL (nigdy przez = NULL!).",
          "example": "SELECT email FROM customer WHERE email IS NOT NULL;"
        }
      },
      {
        "stepCode": "6",
        "keySuffix": "5",
        "isWarmup": false,
        "tier": "adv",
        "goal": "Pobierz tytuł, rating oraz czas trwania dla filmów z ratingiem PG lub G, których długość mieści się między 80 a 100 minut włącznie, sortując alfabetycznie po tytule.",
        "prompt": "Pobierz tytuł, rating oraz czas trwania dla filmów z ratingiem PG lub G, których długość mieści się między 80 a 100 minut włącznie, sortując alfabetycznie po tytule.",
        "sol": "SELECT title, rating, length FROM film WHERE rating IN ('PG', 'G') AND length BETWEEN 80 AND 100 ORDER BY title ASC;",
        "order": true,
        "tables": [
          "film"
        ],
        "hint": "WHERE rating IN ('PG', 'G') AND length BETWEEN 80 AND 100 ORDER BY title ASC;",
        "newFeature": null
      }
    ]
  },
  {
    "id": "p3_1",
    "stage": 3,
    "title": "3.1 Funkcje agregujące (COUNT, SUM, AVG, MIN, MAX) na całej tabeli",
    "tables": [
      "film",
      "payment",
      "customer"
    ],
    "cols": [
      "SELECT",
      "FROM",
      "COUNT",
      "SUM",
      "AVG",
      "MIN",
      "MAX",
      "ROUND",
      "AS",
      "total_films",
      "total_revenue",
      "avg_rate",
      "min_len",
      "max_len"
    ],
    "theory": "<ul><li><strong>Funkcje agregujące:</strong> zwijają wiele wierszy do pojedynczej wartości podsumowującej.</li><li><code>COUNT(*)</code> — liczy wszystkie wiersze.</li><li><code>SUM(kolumna)</code> i <code>AVG(kolumna)</code> — suma i średnia wartość liczbowa.</li><li><code>MIN(kolumna)</code> i <code>MAX(kolumna)</code> — wartość najmniejsza i największa.</li><li><code>ROUND(wartosc, 2)</code> — zaokrągla wynik do wskazanej liczby miejsc po przecinku.</li></ul><div class=\"theory-code\"><code>SELECT COUNT(*) AS total_films, ROUND(AVG(rental_rate), 2) AS avg_price\nFROM film;</code></div>",
    "variants": [
      {
        "stepCode": "R1",
        "keySuffix": "r1",
        "isWarmup": true,
        "tier": "warmup",
        "goal": "Policz całkowitą liczbę wszystkich filmów w katalogu.",
        "prompt": "Policz łączną liczbę filmów w tabeli film i nazwij wynik total_films za pomocą aliasu AS.",
        "sol": "SELECT COUNT(*) AS total_films FROM film;",
        "order": false,
        "tables": [
          "film"
        ],
        "hint": "Wpisz: SELECT COUNT(*) AS total_films FROM film;",
        "newFeature": {
          "title": "Funkcja COUNT(*)",
          "desc": "COUNT(*) zlicza wszystkie wiersze tabeli.",
          "example": "SELECT COUNT(*) AS total_films FROM film;"
        }
      },
      {
        "stepCode": "R2",
        "keySuffix": "r2",
        "isWarmup": true,
        "tier": "warmup",
        "goal": "Podlicz całkowity przychód ze wszystkich zrealizowanych płatności.",
        "prompt": "Oblicz sumę wszystkich kwot amount w tabeli payment i nazwij wynik total_revenue.",
        "sol": "SELECT SUM(amount) AS total_revenue FROM payment;",
        "order": false,
        "tables": [
          "payment"
        ],
        "hint": "Wpisz: SELECT SUM(amount) AS total_revenue FROM payment;",
        "newFeature": {
          "title": "Funkcja SUM(kolumna)",
          "desc": "SUM liczy sumę wartości w podanej kolumnie numerycznej.",
          "example": "SELECT SUM(amount) AS total_revenue FROM payment;"
        }
      },
      {
        "stepCode": "1",
        "keySuffix": "0",
        "isWarmup": false,
        "tier": "basic",
        "goal": "Oblicz średnią cenę wypożyczenia filmu (rental_rate) w całej bazie i nazwij wynik avg_rate.",
        "prompt": "Oblicz średnią cenę wypożyczenia filmu (rental_rate) w całej bazie i nazwij wynik avg_rate.",
        "sol": "SELECT AVG(rental_rate) AS avg_rate FROM film;",
        "order": false,
        "tables": [
          "film"
        ],
        "hint": "SELECT AVG(rental_rate) AS avg_rate FROM film;",
        "newFeature": {
          "title": "Funkcja AVG(kolumna)",
          "desc": "AVG wylicza średnią arytmetyczną z wartości kolumny.",
          "example": "SELECT AVG(rental_rate) AS avg_rate FROM film;"
        }
      },
      {
        "stepCode": "2",
        "keySuffix": "1",
        "isWarmup": false,
        "tier": "basic",
        "goal": "Wyznacz najkrótszy czas trwania filmu jako min_len oraz najdłuższy czas trwania jako max_len z katalogu filmów.",
        "prompt": "Wyznacz najkrótszy czas trwania filmu jako min_len oraz najdłuższy czas trwania jako max_len z katalogu filmów.",
        "sol": "SELECT MIN(length) AS min_len, MAX(length) AS max_len FROM film;",
        "order": false,
        "tables": [
          "film"
        ],
        "hint": "SELECT MIN(length) AS min_len, MAX(length) AS max_len FROM film;",
        "newFeature": {
          "title": "Funkcje MIN i MAX",
          "desc": "Zwracają skrajne wartości: minimalną i maksymalną.",
          "example": "SELECT MIN(length) AS min_len, MAX(length) AS max_len FROM film;"
        }
      },
      {
        "stepCode": "3",
        "keySuffix": "2",
        "isWarmup": false,
        "tier": "basic",
        "goal": "Policz liczbę klientów posiadających wpisany adres e-mail (COUNT z kolumny email) pod aliasem cust_with_email.",
        "prompt": "Policz liczbę klientów posiadających wpisany adres e-mail (COUNT z kolumny email) pod aliasem cust_with_email.",
        "sol": "SELECT COUNT(email) AS cust_with_email FROM customer;",
        "order": false,
        "tables": [
          "customer"
        ],
        "hint": "SELECT COUNT(email) AS cust_with_email FROM customer;",
        "newFeature": null
      },
      {
        "stepCode": "4",
        "keySuffix": "3",
        "isWarmup": false,
        "tier": "adv",
        "goal": "Oblicz średnią kwotę wpłaty z rejestru payment, zaokrąglając wynik do 2 miejsc po przecinku pod aliasem avg_payment.",
        "prompt": "Oblicz średnią kwotę wpłaty z rejestru payment, zaokrąglając wynik do 2 miejsc po przecinku pod aliasem avg_payment.",
        "sol": "SELECT ROUND(AVG(amount), 2) AS avg_payment FROM payment;",
        "order": false,
        "tables": [
          "payment"
        ],
        "hint": "Użyj ROUND(AVG(amount), 2) AS avg_payment",
        "newFeature": {
          "title": "Funkcja ROUND(wartość, cyfry)",
          "desc": "ROUND zaokrągla ułamek do podanej liczby miejsc po przecinku.",
          "example": "SELECT ROUND(AVG(amount), 2) AS avg_payment FROM payment;"
        }
      },
      {
        "stepCode": "5",
        "keySuffix": "4",
        "isWarmup": false,
        "tier": "adv",
        "goal": "Policz liczbę tanich filmów (cena poniżej 2.00$) jako cheap_films oraz ich średni czas trwania zaokrąglony do 1 miejsca po przecinku jako avg_len.",
        "prompt": "Policz liczbę tanich filmów (cena poniżej 2.00$) jako cheap_films oraz ich średni czas trwania zaokrąglony do 1 miejsca po przecinku jako avg_len.",
        "sol": "SELECT COUNT(*) AS cheap_films, ROUND(AVG(length), 1) AS avg_len FROM film WHERE rental_rate < 2.00;",
        "order": false,
        "tables": [
          "film"
        ],
        "hint": "WHERE rental_rate < 2.00",
        "newFeature": null
      },
      {
        "stepCode": "6",
        "keySuffix": "5",
        "isWarmup": false,
        "tier": "adv",
        "goal": "Policz liczbę unikalnych kategorii wiekowych w katalogu filmów (użyj COUNT(DISTINCT rating)) pod aliasem unique_ratings.",
        "prompt": "Policz liczbę unikalnych kategorii wiekowych w katalogu filmów (użyj COUNT(DISTINCT rating)) pod aliasem unique_ratings.",
        "sol": "SELECT COUNT(DISTINCT rating) AS unique_ratings FROM film;",
        "order": false,
        "tables": [
          "film"
        ],
        "hint": "COUNT(DISTINCT rating) AS unique_ratings",
        "newFeature": {
          "title": "COUNT(DISTINCT kolumna)",
          "desc": "Zlicza ile unikalnych (różnych) wartości występuje w kolumnie.",
          "example": "SELECT COUNT(DISTINCT rating) AS unique_ratings FROM film;"
        }
      }
    ]
  },
  {
    "id": "p3_2",
    "stage": 3,
    "title": "3.2 Grupowanie wierszy (GROUP BY)",
    "tables": [
      "film",
      "payment",
      "customer"
    ],
    "cols": [
      "SELECT",
      "FROM",
      "GROUP BY",
      "COUNT",
      "SUM",
      "AVG",
      "ROUND",
      "AS",
      "ORDER BY",
      "LIMIT",
      "rating",
      "film_cnt",
      "staff_id",
      "total_sales",
      "store_id"
    ],
    "theory": "<ul><li><strong><code>GROUP BY</code>:</strong> dzieli tabelę na grupy według wartości w wybranej kolumnie (np. wg kategorii filmu lub identyfikatora sklepu).</li><li><strong>Złota zasada GROUP BY:</strong> każda kolumna w <code>SELECT</code>, która nie jest owinięta funkcją agregującą (COUNT/SUM/AVG), MUSI znaleźć się w klauzuli <code>GROUP BY</code>!</li></ul><div class=\"theory-code\"><code>SELECT rating, COUNT(*) AS film_cnt\nFROM film\nGROUP BY rating;</code></div>",
    "variants": [
      {
        "stepCode": "R1",
        "keySuffix": "r1",
        "isWarmup": true,
        "tier": "warmup",
        "goal": "Policz liczbę filmów w podziale na każdą kategorię wiekową.",
        "prompt": "Pobierz kategorię rating oraz liczbę filmów w każdej kategorii jako film_cnt za pomocą GROUP BY.",
        "sol": "SELECT rating, COUNT(*) AS film_cnt FROM film GROUP BY rating;",
        "order": false,
        "tables": [
          "film"
        ],
        "hint": "GROUP BY rating",
        "newFeature": {
          "title": "Klauzula GROUP BY",
          "desc": "Dzieli wiersze na grupy i liczy statystyki osobno dla każdej grupy.",
          "example": "SELECT rating, COUNT(*) AS film_cnt FROM film GROUP BY rating;"
        }
      },
      {
        "stepCode": "R2",
        "keySuffix": "r2",
        "isWarmup": true,
        "tier": "warmup",
        "goal": "Podlicz łączną sprzedaż wygenerowaną przez każdego pracownika.",
        "prompt": "Dla każdego pracownika (staff_id) podlicz sumę kwot wpłat amount pod aliasem total_sales.",
        "sol": "SELECT staff_id, SUM(amount) AS total_sales FROM payment GROUP BY staff_id;",
        "order": false,
        "tables": [
          "payment"
        ],
        "hint": "SELECT staff_id, SUM(amount) AS total_sales FROM payment GROUP BY staff_id;",
        "newFeature": null
      },
      {
        "stepCode": "1",
        "keySuffix": "0",
        "isWarmup": false,
        "tier": "basic",
        "goal": "Dla każdego oddziału sklepu (store_id) policz liczbę przypisanych klientów jako customer_cnt.",
        "prompt": "Dla każdego oddziału sklepu (store_id) policz liczbę przypisanych klientów jako customer_cnt.",
        "sol": "SELECT store_id, COUNT(*) AS customer_cnt FROM customer GROUP BY store_id;",
        "order": false,
        "tables": [
          "customer"
        ],
        "hint": "GROUP BY store_id",
        "newFeature": null
      },
      {
        "stepCode": "2",
        "keySuffix": "1",
        "isWarmup": false,
        "tier": "basic",
        "goal": "Dla każdej kategorii rating oblicz średni czas trwania filmu (length) zaokrąglony do 2 miejsc po przecinku pod aliasem avg_len.",
        "prompt": "Dla każdej kategorii rating oblicz średni czas trwania filmu (length) zaokrąglony do 2 miejsc po przecinku pod aliasem avg_len.",
        "sol": "SELECT rating, ROUND(AVG(length), 2) AS avg_len FROM film GROUP BY rating;",
        "order": false,
        "tables": [
          "film"
        ],
        "hint": "SELECT rating, ROUND(AVG(length), 2) AS avg_len FROM film GROUP BY rating;",
        "newFeature": null
      },
      {
        "stepCode": "3",
        "keySuffix": "2",
        "isWarmup": false,
        "tier": "basic",
        "goal": "Wyznacz 5 klientów, którzy zapłacili najwięcej w całej historii (customer_id, suma kwot jako cust_total), sortując od najwyższej sumy malejąco, a przy remisie po customer_id rosnąco.",
        "prompt": "Wyznacz 5 klientów, którzy zapłacili najwięcej w całej historii (customer_id, suma kwot jako cust_total), sortując od najwyższej sumy malejąco, a przy remisie po customer_id rosnąco.",
        "sol": "SELECT customer_id, SUM(amount) AS cust_total FROM payment GROUP BY customer_id ORDER BY cust_total DESC, customer_id ASC LIMIT 5;",
        "order": true,
        "tables": [
          "payment"
        ],
        "hint": "GROUP BY customer_id ORDER BY cust_total DESC, customer_id ASC LIMIT 5;",
        "newFeature": null
      },
      {
        "stepCode": "4",
        "keySuffix": "3",
        "isWarmup": false,
        "tier": "adv",
        "goal": "Dla każdej kategorii rating znajdź minimalną cenę wypożyczenia jako min_price oraz maksymalną cenę jako max_price.",
        "prompt": "Dla każdej kategorii rating znajdź minimalną cenę wypożyczenia jako min_price oraz maksymalną cenę jako max_price.",
        "sol": "SELECT rating, MIN(rental_rate) AS min_price, MAX(rental_rate) AS max_price FROM film GROUP BY rating;",
        "order": false,
        "tables": [
          "film"
        ],
        "hint": "MIN(rental_rate) AS min_price, MAX(rental_rate) AS max_price",
        "newFeature": null
      },
      {
        "stepCode": "5",
        "keySuffix": "4",
        "isWarmup": false,
        "tier": "adv",
        "goal": "Policz liczbę klientów dla każdej kombinacji placówki (store_id) oraz statusu aktywności (active) jako cnt, sortując rosnąco po store_id, a przy remisie po active.",
        "prompt": "Policz liczbę klientów dla każdej kombinacji placówki (store_id) oraz statusu aktywności (active) jako cnt, sortując rosnąco po store_id, a przy remisie po active.",
        "sol": "SELECT store_id, active, COUNT(*) AS cnt FROM customer GROUP BY store_id, active ORDER BY store_id ASC, active ASC;",
        "order": true,
        "tables": [
          "customer"
        ],
        "hint": "GROUP BY store_id, active ORDER BY store_id ASC, active ASC;",
        "newFeature": null
      },
      {
        "stepCode": "6",
        "keySuffix": "5",
        "isWarmup": false,
        "tier": "adv",
        "goal": "Dla każdego pracownika (staff_id) policz liczbę transakcji jako tx_cnt oraz średnią kwotę transakcji zaokrągloną do 2 miejsc jako avg_tx.",
        "prompt": "Dla każdego pracownika (staff_id) policz liczbę transakcji jako tx_cnt oraz średnią kwotę transakcji zaokrągloną do 2 miejsc jako avg_tx.",
        "sol": "SELECT staff_id, COUNT(*) AS tx_cnt, ROUND(AVG(amount), 2) AS avg_tx FROM payment GROUP BY staff_id;",
        "order": false,
        "tables": [
          "payment"
        ],
        "hint": "SELECT staff_id, COUNT(*) AS tx_cnt, ROUND(AVG(amount), 2) AS avg_tx FROM payment GROUP BY staff_id;",
        "newFeature": null
      }
    ]
  },
  {
    "id": "p3_3",
    "stage": 3,
    "title": "3.3 Filtrowanie grup (HAVING vs WHERE) oraz zaokrąglanie ROUND",
    "tables": [
      "film",
      "payment",
      "customer"
    ],
    "cols": [
      "SELECT",
      "FROM",
      "WHERE",
      "GROUP BY",
      "HAVING",
      "COUNT",
      "SUM",
      "AVG",
      "ROUND",
      "AS",
      "ORDER BY",
      "rating",
      "customer_id",
      "total",
      "avg_len"
    ],
    "theory": "<ul><li><strong><code>HAVING</code>:</strong> filtruje całe grupy po podliczeniu agregatów (np. <code>HAVING COUNT(*) > 100</code>).</li><li><strong>WHERE vs HAVING:</strong> <code>WHERE</code> filtruje pojedyncze wiersze PRZED grupowaniem (nie wolno w nim pisać COUNT/SUM!). <code>HAVING</code> filtruje grupy PO obliczeniu agregatów.</li></ul><div class=\"theory-code\"><code>SELECT rating, COUNT(*) AS film_cnt\nFROM film\nGROUP BY rating\nHAVING COUNT(*) > 100;</code></div>",
    "variants": [
      {
        "stepCode": "R1",
        "keySuffix": "r1",
        "isWarmup": true,
        "tier": "warmup",
        "goal": "Wyświetl tylko te kategorie filmów, które liczą ponad 100 pozycji.",
        "prompt": "Dla każdej kategorii rating policz liczbę filmów jako cnt, pozostawiając tylko kategorie liczące powyżej 100 filmów za pomocą HAVING.",
        "sol": "SELECT rating, COUNT(*) AS cnt FROM film GROUP BY rating HAVING COUNT(*) > 100;",
        "order": false,
        "tables": [
          "film"
        ],
        "hint": "HAVING COUNT(*) > 100",
        "newFeature": {
          "title": "Klauzula HAVING (sito dla grup)",
          "desc": "HAVING filtruje grupy na podstawie wartości funkcji agregujących (np. COUNT/SUM/AVG).",
          "example": "SELECT rating, COUNT(*) FROM film GROUP BY rating HAVING COUNT(*) > 100;"
        }
      },
      {
        "stepCode": "R2",
        "keySuffix": "r2",
        "isWarmup": true,
        "tier": "warmup",
        "goal": "Znajdź stałych klientów o łącznych wpłatach przekraczających 150$.",
        "prompt": "Dla każdego customer_id oblicz sumę kwot wpłat jako total, filtrując klientów o sumie przekraczającej 150$ i sortując od największej kwoty.",
        "sol": "SELECT customer_id, SUM(amount) AS total FROM payment GROUP BY customer_id HAVING SUM(amount) > 150 ORDER BY total DESC;",
        "order": true,
        "tables": [
          "payment"
        ],
        "hint": "GROUP BY customer_id HAVING SUM(amount) > 150 ORDER BY total DESC;",
        "newFeature": null
      },
      {
        "stepCode": "1",
        "keySuffix": "0",
        "isWarmup": false,
        "tier": "basic",
        "goal": "Dla każdej kategorii rating oblicz średni czas trwania jako avg_len zaokrąglony do 2 miejsc, pozostawiając tylko kategorie o średniej długości powyżej 115 minut.",
        "prompt": "Dla każdej kategorii rating oblicz średni czas trwania jako avg_len zaokrąglony do 2 miejsc, pozostawiając tylko kategorie o średniej długości powyżej 115 minut.",
        "sol": "SELECT rating, ROUND(AVG(length), 2) AS avg_len FROM film GROUP BY rating HAVING AVG(length) > 115;",
        "order": false,
        "tables": [
          "film"
        ],
        "hint": "HAVING AVG(length) > 115",
        "newFeature": null
      },
      {
        "stepCode": "2",
        "keySuffix": "1",
        "isWarmup": false,
        "tier": "basic",
        "goal": "Dla placówek store_id policz aktywnych klientów (active = 1 w WHERE) jako cnt, pozostawiając tylko placówki o liczbie aktywnych klientów powyżej 200.",
        "prompt": "Dla placówek store_id policz aktywnych klientów (active = 1 w WHERE) jako cnt, pozostawiając tylko placówki o liczbie aktywnych klientów powyżej 200.",
        "sol": "SELECT store_id, COUNT(*) AS cnt FROM customer WHERE active = 1 GROUP BY store_id HAVING COUNT(*) > 200;",
        "order": false,
        "tables": [
          "customer"
        ],
        "hint": "WHERE active = 1 GROUP BY store_id HAVING COUNT(*) > 200",
        "newFeature": null
      },
      {
        "stepCode": "3",
        "keySuffix": "2",
        "isWarmup": false,
        "tier": "basic",
        "goal": "Dla każdego pracownika (staff_id) policz transakcje o kwocie amount > 5 jako tx_cnt, wyświetlając tylko pracowników mających ponad 50 takich wpłat.",
        "prompt": "Dla każdego pracownika (staff_id) policz transakcje o kwocie amount > 5 jako tx_cnt, wyświetlając tylko pracowników mających ponad 50 takich wpłat.",
        "sol": "SELECT staff_id, COUNT(*) AS tx_cnt FROM payment WHERE amount > 5 GROUP BY staff_id HAVING COUNT(*) > 50;",
        "order": false,
        "tables": [
          "payment"
        ],
        "hint": "WHERE amount > 5 GROUP BY staff_id HAVING COUNT(*) > 50",
        "newFeature": null
      },
      {
        "stepCode": "4",
        "keySuffix": "3",
        "isWarmup": false,
        "tier": "adv",
        "goal": "Dla filmów z rental_rate >= 2.99 pogrupuj po rating, policz liczbę filmów jako cnt, pozostaw kategorie z co najmniej 50 filmami i posortuj malejąco po liczbie filmów, a przy remisie po rating.",
        "prompt": "Dla filmów z rental_rate >= 2.99 pogrupuj po rating, policz liczbę filmów jako cnt, pozostaw kategorie z co najmniej 50 filmami i posortuj malejąco po liczbie filmów, a przy remisie po rating.",
        "sol": "SELECT rating, COUNT(*) AS cnt FROM film WHERE rental_rate >= 2.99 GROUP BY rating HAVING COUNT(*) >= 50 ORDER BY cnt DESC, rating ASC;",
        "order": true,
        "tables": [
          "film"
        ],
        "hint": "WHERE rental_rate >= 2.99 GROUP BY rating HAVING COUNT(*) >= 50 ORDER BY cnt DESC, rating ASC;",
        "newFeature": null
      },
      {
        "stepCode": "5",
        "keySuffix": "4",
        "isWarmup": false,
        "tier": "adv",
        "goal": "Dla każdego klienta policz liczbę wypożyczeń jako rental_cnt oraz sumę wpłat jako total_spent zaokrągloną do 2 miejsc, filtrując klientów z co najmniej 30 transakcjami i sortując od największych wydatków.",
        "prompt": "Dla każdego klienta policz liczbę wypożyczeń jako rental_cnt oraz sumę wpłat jako total_spent zaokrągloną do 2 miejsc, filtrując klientów z co najmniej 30 transakcjami i sortując od największych wydatków.",
        "sol": "SELECT customer_id, COUNT(*) AS rental_cnt, ROUND(SUM(amount), 2) AS total_spent FROM payment GROUP BY customer_id HAVING COUNT(*) >= 30 ORDER BY total_spent DESC, customer_id ASC;",
        "order": true,
        "tables": [
          "payment"
        ],
        "hint": "GROUP BY customer_id HAVING COUNT(*) >= 30 ORDER BY total_spent DESC, customer_id ASC;",
        "newFeature": null
      },
      {
        "stepCode": "6",
        "keySuffix": "5",
        "isWarmup": false,
        "tier": "adv",
        "goal": "Dla każdej kategorii rating oblicz średni koszt odtworzenia jako avg_cost zaokrąglony do 2 miejsc, pozostawiając tylko kategorie o średnim koszcie wyższym niż 20.00$.",
        "prompt": "Dla każdej kategorii rating oblicz średni koszt odtworzenia jako avg_cost zaokrąglony do 2 miejsc, pozostawiając tylko kategorie o średnim koszcie wyższym niż 20.00$.",
        "sol": "SELECT rating, ROUND(AVG(replacement_cost), 2) AS avg_cost FROM film GROUP BY rating HAVING AVG(replacement_cost) > 20.00;",
        "order": false,
        "tables": [
          "film"
        ],
        "hint": "HAVING AVG(replacement_cost) > 20.00",
        "newFeature": null
      }
    ]
  },
  {
    "id": "p4_1",
    "stage": 4,
    "title": "4.1 Łączenie wewnętrzne (INNER JOIN)",
    "tables": [
      "film",
      "film_category",
      "category",
      "customer",
      "payment",
      "actor",
      "film_actor",
      "staff",
      "store"
    ],
    "cols": [
      "SELECT",
      "FROM",
      "JOIN",
      "ON",
      "AS",
      "COUNT",
      "SUM",
      "ROUND",
      "GROUP BY",
      "ORDER BY",
      "LIMIT",
      "title",
      "first_name",
      "last_name",
      "name"
    ],
    "theory": "<ul><li><strong><code>INNER JOIN ... ON</code>:</strong> łączy wiersze z dwóch tabel po wspólnym kluczu (np. <code>fc.category_id = c.category_id</code>).</li><li><strong>Aliasy tabel:</strong> nadawaj tabelom krótkie aliasy (np. <code>film f JOIN film_category fc</code>), aby zapytania były zwięzłe i czytelne.</li><li><strong>Tylko pasujące pary:</strong> INNER JOIN zachowuje tylko te rekordy, które posiadają odpowiednik w obu złączonych tabelach.</li></ul><div class=\"theory-code\"><code>SELECT f.title, c.name AS category_name\nFROM film f\nJOIN film_category fc ON f.film_id = fc.film_id\nJOIN category c ON fc.category_id = c.category_id;</code></div>",
    "variants": [
      {
        "stepCode": "R1",
        "keySuffix": "r1",
        "isWarmup": true,
        "tier": "warmup",
        "goal": "Wyświetl tytuł każdego filmu wraz z nazwą jego kategorii.",
        "prompt": "Połącz tabele film f, film_category fc oraz category c, wybierając tytuł filmu f.title oraz nazwę kategorii c.name pod aliasem category_name.",
        "sol": "SELECT f.title, c.name AS category_name FROM film f JOIN film_category fc ON f.film_id = fc.film_id JOIN category c ON fc.category_id = c.category_id;",
        "order": false,
        "tables": [
          "film",
          "film_category",
          "category"
        ],
        "hint": "JOIN film_category fc ON f.film_id = fc.film_id JOIN category c ON fc.category_id = c.category_id",
        "newFeature": {
          "title": "Złączenie JOIN ... ON",
          "desc": "Łączy tabele po relacji klucza obcego i głównego (ON t1.id = t2.id).",
          "example": "SELECT f.title, c.name FROM film f JOIN film_category fc ON f.film_id = fc.film_id JOIN category c ON fc.category_id = c.category_id;"
        }
      },
      {
        "stepCode": "R2",
        "keySuffix": "r2",
        "isWarmup": true,
        "tier": "warmup",
        "goal": "Wyświetl imię, nazwisko oraz kwotę i datę 5 ostatnich wpłat klientów.",
        "prompt": "Połącz customer c z payment p po customer_id, zwracając c.first_name, c.last_name, p.amount oraz p.payment_date dla 5 ostatnich wpłat (sortuj malejąco po payment_date, a przy remisie po payment_id rosnąco).",
        "sol": "SELECT c.first_name, c.last_name, p.amount, p.payment_date FROM customer c JOIN payment p ON c.customer_id = p.customer_id ORDER BY p.payment_date DESC, p.payment_id ASC LIMIT 5;",
        "order": true,
        "tables": [
          "customer",
          "payment"
        ],
        "hint": "JOIN payment p ON c.customer_id = p.customer_id ORDER BY p.payment_date DESC, p.payment_id ASC LIMIT 5;",
        "newFeature": null
      },
      {
        "stepCode": "1",
        "keySuffix": "0",
        "isWarmup": false,
        "tier": "basic",
        "goal": "Połącz film f, film_actor fa oraz actor a, wyświetlając f.title, a.first_name oraz a.last_name dla ról aktora o actor_id = 1, sortując alfabetycznie po tytule.",
        "prompt": "Połącz film f, film_actor fa oraz actor a, wyświetlając f.title, a.first_name oraz a.last_name dla ról aktora o actor_id = 1, sortując alfabetycznie po tytule.",
        "sol": "SELECT f.title, a.first_name, a.last_name FROM film f JOIN film_actor fa ON f.film_id = fa.film_id JOIN actor a ON fa.actor_id = a.actor_id WHERE a.actor_id = 1 ORDER BY f.title ASC;",
        "order": true,
        "tables": [
          "film",
          "film_actor",
          "actor"
        ],
        "hint": "WHERE a.actor_id = 1 ORDER BY f.title ASC;",
        "newFeature": null
      },
      {
        "stepCode": "2",
        "keySuffix": "1",
        "isWarmup": false,
        "tier": "basic",
        "goal": "Połącz category c z film_category fc po category_id, policz liczbę filmów w każdej kategorii jako film_cnt, pogrupuj po c.name i posortuj malejąco po liczbie filmów, a przy remisie alfabetycznie po nazwie.",
        "prompt": "Połącz category c z film_category fc po category_id, policz liczbę filmów w każdej kategorii jako film_cnt, pogrupuj po c.name i posortuj malejąco po liczbie filmów, a przy remisie alfabetycznie po nazwie.",
        "sol": "SELECT c.name, COUNT(*) AS film_cnt FROM category c JOIN film_category fc ON c.category_id = fc.category_id GROUP BY c.name ORDER BY film_cnt DESC, c.name ASC;",
        "order": true,
        "tables": [
          "category",
          "film_category"
        ],
        "hint": "GROUP BY c.name ORDER BY film_cnt DESC, c.name ASC;",
        "newFeature": null
      },
      {
        "stepCode": "3",
        "keySuffix": "2",
        "isWarmup": false,
        "tier": "basic",
        "goal": "Połącz staff s z payment p po staff_id, wyliczając sumę sprzedaży jako total_sales dla każdego pracownika (s.first_name, s.last_name).",
        "prompt": "Połącz staff s z payment p po staff_id, wyliczając sumę sprzedaży jako total_sales dla każdego pracownika (s.first_name, s.last_name).",
        "sol": "SELECT s.first_name, s.last_name, SUM(p.amount) AS total_sales FROM staff s JOIN payment p ON s.staff_id = p.staff_id GROUP BY s.first_name, s.last_name;",
        "order": false,
        "tables": [
          "staff",
          "payment"
        ],
        "hint": "GROUP BY s.first_name, s.last_name",
        "newFeature": null
      },
      {
        "stepCode": "4",
        "keySuffix": "3",
        "isWarmup": false,
        "tier": "adv",
        "goal": "Połącz store st z customer c po store_id, wyświetlając st.store_id, miasto st.city oraz liczbę przypisanych klientów jako customers_count.",
        "prompt": "Połącz store st z customer c po store_id, wyświetlając st.store_id, miasto st.city oraz liczbę przypisanych klientów jako customers_count.",
        "sol": "SELECT st.store_id, st.city, COUNT(c.customer_id) AS customers_count FROM store st JOIN customer c ON st.store_id = c.store_id GROUP BY st.store_id, st.city;",
        "order": false,
        "tables": [
          "store",
          "customer"
        ],
        "hint": "GROUP BY st.store_id, st.city",
        "newFeature": null
      },
      {
        "stepCode": "5",
        "keySuffix": "4",
        "isWarmup": false,
        "tier": "adv",
        "goal": "Połącz actor a z film_actor fa, policz liczbę ról filmowych każdego aktora jako roles_cnt, wybierz 5 najbardziej aktywnych aktorów (a.first_name, a.last_name), sortując malejąco po roles_cnt, a przy remisie po actor_id rosnąco.",
        "prompt": "Połącz actor a z film_actor fa, policz liczbę ról filmowych każdego aktora jako roles_cnt, wybierz 5 najbardziej aktywnych aktorów (a.first_name, a.last_name), sortując malejąco po roles_cnt, a przy remisie po actor_id rosnąco.",
        "sol": "SELECT a.first_name, a.last_name, COUNT(fa.film_id) AS roles_cnt FROM actor a JOIN film_actor fa ON a.actor_id = fa.actor_id GROUP BY a.actor_id, a.first_name, a.last_name ORDER BY roles_cnt DESC, a.actor_id ASC LIMIT 5;",
        "order": true,
        "tables": [
          "actor",
          "film_actor"
        ],
        "hint": "ORDER BY roles_cnt DESC, a.actor_id ASC LIMIT 5;",
        "newFeature": null
      },
      {
        "stepCode": "6",
        "keySuffix": "5",
        "isWarmup": false,
        "tier": "adv",
        "goal": "Połącz category c, film_category fc oraz film f, obliczając średnią długość filmu w każdej kategorii jako avg_len zaokrągloną do 2 miejsc. Wyświetl tylko kategorie o avg_len > 115, sortując malejąco po średniej długości.",
        "prompt": "Połącz category c, film_category fc oraz film f, obliczając średnią długość filmu w każdej kategorii jako avg_len zaokrągloną do 2 miejsc. Wyświetl tylko kategorie o avg_len > 115, sortując malejąco po średniej długości.",
        "sol": "SELECT c.name, ROUND(AVG(f.length), 2) AS avg_len FROM category c JOIN film_category fc ON c.category_id = fc.category_id JOIN film f ON fc.film_id = f.film_id GROUP BY c.name HAVING AVG(f.length) > 115 ORDER BY avg_len DESC, c.name ASC;",
        "order": true,
        "tables": [
          "category",
          "film_category",
          "film"
        ],
        "hint": "HAVING AVG(f.length) > 115 ORDER BY avg_len DESC, c.name ASC;",
        "newFeature": null
      }
    ]
  },
  {
    "id": "p4_2",
    "stage": 4,
    "title": "4.2 Łączenie lewostronne (LEFT JOIN) i szukanie braków",
    "tables": [
      "customer",
      "rental",
      "category",
      "film_category",
      "store",
      "actor",
      "film_actor",
      "film",
      "payment",
      "staff"
    ],
    "cols": [
      "SELECT",
      "FROM",
      "LEFT JOIN",
      "ON",
      "WHERE",
      "IS NULL",
      "COUNT",
      "COALESCE",
      "AS",
      "GROUP BY",
      "customer_id",
      "rental_id",
      "first_name",
      "last_name"
    ],
    "theory": "<ul><li><strong><code>LEFT JOIN</code>:</strong> zachowuje WSZYSTKIE wiersze z lewej tabeli, nawet jeśli po prawej stronie nie ma dopasowania (w polach pojawia się NULL).</li><li><strong>Anti-Join (szukanie rekordów bez powiązań):</strong> dodaj warunek <code>WHERE prawa_tabela.klucz IS NULL</code>, aby wyłowić np. klientów, którzy nigdy niczego nie wypożyczyli!</li><li><strong>Pułapka COUNT:</strong> przy zliczaniu dopasowań w LEFT JOIN używaj <code>COUNT(prawa_tabela.id)</code> zamiast <code>COUNT(*)</code>, aby nie policzyć pustego wiersza z NULL jako 1!</li></ul><div class=\"theory-code\"><code>SELECT c.customer_id, c.first_name, c.last_name\nFROM customer c\nLEFT JOIN rental r ON c.customer_id = r.customer_id\nWHERE r.rental_id IS NULL;</code></div>",
    "variants": [
      {
        "stepCode": "R1",
        "keySuffix": "r1",
        "isWarmup": true,
        "tier": "warmup",
        "goal": "Znajdź klientów, którzy nie dokonali ani jednego wypożyczenia (Anti-Join).",
        "prompt": "Połącz customer c z rental r za pomocą LEFT JOIN i wyznacz klientów bez wypożyczeń (r.rental_id IS NULL). Zwróć customer_id, first_name oraz last_name.",
        "sol": "SELECT c.customer_id, c.first_name, c.last_name FROM customer c LEFT JOIN rental r ON c.customer_id = r.customer_id WHERE r.rental_id IS NULL ORDER BY c.customer_id ASC;",
        "order": true,
        "tables": [
          "customer",
          "rental"
        ],
        "hint": "LEFT JOIN rental r ON c.customer_id = r.customer_id WHERE r.rental_id IS NULL ORDER BY c.customer_id ASC;",
        "newFeature": {
          "title": "Złączenie LEFT JOIN i Anti-Join",
          "desc": "LEFT JOIN zachowuje całą lewą tabelę. Filtr WHERE prawa.id IS NULL wyłapuje brak powiązań.",
          "example": "SELECT c.customer_id FROM customer c LEFT JOIN rental r ON c.customer_id = r.customer_id WHERE r.rental_id IS NULL;"
        }
      },
      {
        "stepCode": "R2",
        "keySuffix": "r2",
        "isWarmup": true,
        "tier": "warmup",
        "goal": "Policz liczbę filmów w każdej kategorii, nie gubiąc pustych kategorii.",
        "prompt": "Dla każdej kategorii (c.name) policz liczbę przypisanych filmów jako films_in_cat za pomocą LEFT JOIN z film_category fc (pamiętaj o COUNT(fc.film_id)).",
        "sol": "SELECT c.name, COUNT(fc.film_id) AS films_in_cat FROM category c LEFT JOIN film_category fc ON c.category_id = fc.category_id GROUP BY c.name ORDER BY c.name ASC;",
        "order": true,
        "tables": [
          "category",
          "film_category"
        ],
        "hint": "COUNT(fc.film_id) AS films_in_cat",
        "newFeature": null
      },
      {
        "stepCode": "1",
        "keySuffix": "0",
        "isWarmup": false,
        "tier": "basic",
        "goal": "Połącz store s z customer c za pomocą LEFT JOIN, zliczając aktywnych klientów (c.active = 1 w warunku ON) jako active_cust dla każdego oddziału (s.store_id, s.city).",
        "prompt": "Połącz store s z customer c za pomocą LEFT JOIN, zliczając aktywnych klientów (c.active = 1 w warunku ON) jako active_cust dla każdego oddziału (s.store_id, s.city).",
        "sol": "SELECT s.store_id, s.city, COUNT(c.customer_id) AS active_cust FROM store s LEFT JOIN customer c ON s.store_id = c.store_id AND c.active = 1 GROUP BY s.store_id, s.city ORDER BY s.store_id ASC;",
        "order": true,
        "tables": [
          "store",
          "customer"
        ],
        "hint": "LEFT JOIN customer c ON s.store_id = c.store_id AND c.active = 1 GROUP BY s.store_id, s.city ORDER BY s.store_id ASC;",
        "newFeature": null
      },
      {
        "stepCode": "2",
        "keySuffix": "1",
        "isWarmup": false,
        "tier": "basic",
        "goal": "Znajdź aktorów z listy actor a, którzy nie zagrali w żadnym filmie (LEFT JOIN z film_actor fa, gdzie fa.film_id IS NULL). Zwróć actor_id, first_name oraz last_name.",
        "prompt": "Znajdź aktorów z listy actor a, którzy nie zagrali w żadnym filmie (LEFT JOIN z film_actor fa, gdzie fa.film_id IS NULL). Zwróć actor_id, first_name oraz last_name.",
        "sol": "SELECT a.actor_id, a.first_name, a.last_name FROM actor a LEFT JOIN film_actor fa ON a.actor_id = fa.actor_id WHERE fa.film_id IS NULL ORDER BY a.actor_id ASC;",
        "order": true,
        "tables": [
          "actor",
          "film_actor"
        ],
        "hint": "WHERE fa.film_id IS NULL ORDER BY a.actor_id ASC;",
        "newFeature": null
      },
      {
        "stepCode": "3",
        "keySuffix": "2",
        "isWarmup": false,
        "tier": "basic",
        "goal": "Pobierz film_id oraz tytuł wszystkich filmów z katalogu film f, które nie mają żadnego wypożyczenia w tabeli rental r (użyj LEFT JOIN i WHERE r.rental_id IS NULL).",
        "prompt": "Pobierz film_id oraz tytuł wszystkich filmów z katalogu film f, które nie mają żadnego wypożyczenia w tabeli rental r (użyj LEFT JOIN i WHERE r.rental_id IS NULL).",
        "sol": "SELECT f.film_id, f.title FROM film f LEFT JOIN rental r ON f.film_id = r.film_id WHERE r.rental_id IS NULL ORDER BY f.film_id ASC;",
        "order": true,
        "tables": [
          "film",
          "rental"
        ],
        "hint": "LEFT JOIN rental r ON f.film_id = r.film_id WHERE r.rental_id IS NULL ORDER BY f.film_id ASC;",
        "newFeature": null
      },
      {
        "stepCode": "4",
        "keySuffix": "3",
        "isWarmup": false,
        "tier": "adv",
        "goal": "Dla każdego klienta (first_name, last_name) oblicz łączną sumę wpłat jako total_paid za pomocą LEFT JOIN z payment p oraz COALESCE(SUM(p.amount), 0), sortując rosnąco po sumie i wybierając pierwsze 5 wyników.",
        "prompt": "Dla każdego klienta (first_name, last_name) oblicz łączną sumę wpłat jako total_paid za pomocą LEFT JOIN z payment p oraz COALESCE(SUM(p.amount), 0), sortując rosnąco po sumie i wybierając pierwsze 5 wyników.",
        "sol": "SELECT c.first_name, c.last_name, COALESCE(SUM(p.amount), 0) AS total_paid FROM customer c LEFT JOIN payment p ON c.customer_id = p.customer_id GROUP BY c.first_name, c.last_name ORDER BY total_paid ASC, c.first_name ASC LIMIT 5;",
        "order": true,
        "tables": [
          "customer",
          "payment"
        ],
        "hint": "COALESCE(SUM(p.amount), 0) AS total_paid",
        "newFeature": null
      },
      {
        "stepCode": "5",
        "keySuffix": "4",
        "isWarmup": false,
        "tier": "adv",
        "goal": "Wyświetl miasto oddziału st.city oraz imię pracownika s.first_name pod aliasem staff_name, łącząc store st z tabelą personelu staff s złączeniem LEFT JOIN.",
        "prompt": "Wyświetl miasto oddziału st.city oraz imię pracownika s.first_name pod aliasem staff_name, łącząc store st z tabelą personelu staff s złączeniem LEFT JOIN.",
        "sol": "SELECT st.city, s.first_name AS staff_name FROM store st LEFT JOIN staff s ON st.store_id = s.store_id ORDER BY st.city ASC;",
        "order": true,
        "tables": [
          "store",
          "staff"
        ],
        "hint": "SELECT st.city, s.first_name AS staff_name FROM store st LEFT JOIN staff s ON st.store_id = s.store_id ORDER BY st.city ASC;",
        "newFeature": null
      },
      {
        "stepCode": "6",
        "keySuffix": "5",
        "isWarmup": false,
        "tier": "adv",
        "goal": "Znajdź klientów zarejestrowanych w bazie customer c, którzy nie dokonali żadnej płatności w tabeli payment p (Anti-Join). Zwróć customer_id, first_name oraz last_name.",
        "prompt": "Znajdź klientów zarejestrowanych w bazie customer c, którzy nie dokonali żadnej płatności w tabeli payment p (Anti-Join). Zwróć customer_id, first_name oraz last_name.",
        "sol": "SELECT c.customer_id, c.first_name, c.last_name FROM customer c LEFT JOIN payment p ON c.customer_id = p.customer_id WHERE p.payment_id IS NULL ORDER BY c.customer_id ASC;",
        "order": true,
        "tables": [
          "customer",
          "payment"
        ],
        "hint": "WHERE p.payment_id IS NULL ORDER BY c.customer_id ASC;",
        "newFeature": null
      }
    ]
  },
  {
    "id": "p4_3",
    "stage": 4,
    "title": "4.3 Zastępowanie braków (COALESCE) i logika warunkowa (CASE WHEN)",
    "tables": [
      "customer",
      "film",
      "rental",
      "payment",
      "store",
      "staff"
    ],
    "cols": [
      "SELECT",
      "FROM",
      "CASE",
      "WHEN",
      "THEN",
      "ELSE",
      "END",
      "COALESCE",
      "COUNT",
      "SUM",
      "ROUND",
      "AS",
      "title",
      "length",
      "rental_rate",
      "active"
    ],
    "theory": "<ul><li><strong><code>COALESCE(wartosc, domyslna)</code>:</strong> zwraca pierwszą niepustą wartość z listy (zastępuje NULL wskazaną wartością).</li><li><strong><code>CASE WHEN ... THEN ... ELSE ... END</code>:</strong> pozwala tworzyć warunkowe kolumny i segmentować dane (jak instrukcja IF-ELSE).</li><li><strong>Agregacja warunkowa:</strong> <code>SUM(CASE WHEN rating = 'R' THEN 1 ELSE 0 END)</code> pozwala zliczać rekordy spełniające kryterium wewnątrz GROUP BY.</li></ul><div class=\"theory-code\"><code>SELECT title,\n  CASE WHEN length < 60 THEN 'Krótki' ELSE 'Długi' END AS segment\nFROM film;</code></div>",
    "variants": [
      {
        "stepCode": "R1",
        "keySuffix": "r1",
        "isWarmup": true,
        "tier": "warmup",
        "goal": "Zastąp brakujący adres e-mail tekstem domyślnym za pomocą COALESCE.",
        "prompt": "Pobierz customer_id oraz adres e-mail zastępując ewentualne braki tekstem brak@adresu.pl pod aliasem contact_email za pomocą funkcji COALESCE.",
        "sol": "SELECT customer_id, COALESCE(email, 'brak@adresu.pl') AS contact_email FROM customer;",
        "order": false,
        "tables": [
          "customer"
        ],
        "hint": "COALESCE(email, 'brak@adresu.pl') AS contact_email",
        "newFeature": {
          "title": "Funkcja COALESCE",
          "desc": "COALESCE zwraca pierwszy argument różny od NULL.",
          "example": "SELECT COALESCE(email, 'brak@adresu.pl') FROM customer;"
        }
      },
      {
        "stepCode": "R2",
        "keySuffix": "r2",
        "isWarmup": true,
        "tier": "warmup",
        "goal": "Podziel filmy na segmenty długości: Krótki, Średni, Długi za pomocą CASE WHEN.",
        "prompt": "Pobierz tytuł, długość length oraz nową kolumnę duration_type: gdy length < 60 wpisz Krótki, gdy length <= 120 wpisz Średni, w pozostałych przypadkach wpisz Długi.",
        "sol": "SELECT title, length, CASE WHEN length < 60 THEN 'Krótki' WHEN length <= 120 THEN 'Średni' ELSE 'Długi' END AS duration_type FROM film;",
        "order": false,
        "tables": [
          "film"
        ],
        "hint": "CASE WHEN length < 60 THEN 'Krótki' WHEN length <= 120 THEN 'Średni' ELSE 'Długi' END AS duration_type",
        "newFeature": {
          "title": "Instrukcja CASE WHEN",
          "desc": "CASE WHEN pozwala tworzyć warunkowe gałęzie wartości w zapytaniu SQL.",
          "example": "SELECT CASE WHEN length < 60 THEN 'Krótki' ELSE 'Długi' END FROM film;"
        }
      },
      {
        "stepCode": "1",
        "keySuffix": "0",
        "isWarmup": false,
        "tier": "basic",
        "goal": "Pobierz tytuł, cenę rental_rate oraz kolumnę price_tier: gdy cena < 2.00 wpisz Tani, w przeciwnym razie Standard.",
        "prompt": "Pobierz tytuł, cenę rental_rate oraz kolumnę price_tier: gdy cena < 2.00 wpisz Tani, w przeciwnym razie Standard.",
        "sol": "SELECT title, rental_rate, CASE WHEN rental_rate < 2.00 THEN 'Tani' ELSE 'Standard' END AS price_tier FROM film;",
        "order": false,
        "tables": [
          "film"
        ],
        "hint": "CASE WHEN rental_rate < 2.00 THEN 'Tani' ELSE 'Standard' END AS price_tier",
        "newFeature": null
      },
      {
        "stepCode": "2",
        "keySuffix": "1",
        "isWarmup": false,
        "tier": "basic",
        "goal": "Pobierz rental_id, customer_id oraz return_status: użyj COALESCE(return_date::text, 'W toku') dla wypożyczeń, gdzie return_date IS NULL lub rental_id <= 5.",
        "prompt": "Pobierz rental_id, customer_id oraz return_status: użyj COALESCE(return_date::text, 'W toku') dla wypożyczeń, gdzie return_date IS NULL lub rental_id <= 5.",
        "sol": "SELECT rental_id, customer_id, COALESCE(return_date::text, 'W toku') AS return_status FROM rental WHERE return_date IS NULL OR rental_id <= 5;",
        "order": false,
        "tables": [
          "rental"
        ],
        "hint": "COALESCE(return_date::text, 'W toku') AS return_status",
        "newFeature": null
      },
      {
        "stepCode": "3",
        "keySuffix": "2",
        "isWarmup": false,
        "tier": "basic",
        "goal": "Pobierz customer_id, first_name oraz status_pl: gdy active = 1 wpisz Aktywny, w przeciwnym razie Nieaktywny.",
        "prompt": "Pobierz customer_id, first_name oraz status_pl: gdy active = 1 wpisz Aktywny, w przeciwnym razie Nieaktywny.",
        "sol": "SELECT customer_id, first_name, CASE WHEN active = 1 THEN 'Aktywny' ELSE 'Nieaktywny' END AS status_pl FROM customer;",
        "order": false,
        "tables": [
          "customer"
        ],
        "hint": "CASE WHEN active = 1 THEN 'Aktywny' ELSE 'Nieaktywny' END AS status_pl",
        "newFeature": null
      },
      {
        "stepCode": "4",
        "keySuffix": "3",
        "isWarmup": false,
        "tier": "adv",
        "goal": "Dla każdej kategorii rating policz łączną liczbę filmów jako total oraz liczbę filmów z ceną > 3 jako expensive_count za pomocą agregacji warunkowej SUM(CASE WHEN rental_rate > 3 THEN 1 ELSE 0 END).",
        "prompt": "Dla każdej kategorii rating policz łączną liczbę filmów jako total oraz liczbę filmów z ceną > 3 jako expensive_count za pomocą agregacji warunkowej SUM(CASE WHEN rental_rate > 3 THEN 1 ELSE 0 END).",
        "sol": "SELECT rating, COUNT(*) AS total, SUM(CASE WHEN rental_rate > 3 THEN 1 ELSE 0 END) AS expensive_count FROM film GROUP BY rating;",
        "order": false,
        "tables": [
          "film"
        ],
        "hint": "SUM(CASE WHEN rental_rate > 3 THEN 1 ELSE 0 END) AS expensive_count",
        "newFeature": null
      },
      {
        "stepCode": "5",
        "keySuffix": "4",
        "isWarmup": false,
        "tier": "adv",
        "goal": "Oblicz udział procentowy filmów z ratingiem R w całym katalogu jako r_rated_pct zaokrąglony do 2 miejsc: ROUND(SUM(CASE WHEN rating = 'R' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2).",
        "prompt": "Oblicz udział procentowy filmów z ratingiem R w całym katalogu jako r_rated_pct zaokrąglony do 2 miejsc: ROUND(SUM(CASE WHEN rating = 'R' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2).",
        "sol": "SELECT ROUND(SUM(CASE WHEN rating = 'R' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) AS r_rated_pct FROM film;",
        "order": false,
        "tables": [
          "film"
        ],
        "hint": "ROUND(SUM(CASE WHEN rating = 'R' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) AS r_rated_pct",
        "newFeature": null
      },
      {
        "stepCode": "6",
        "keySuffix": "5",
        "isWarmup": false,
        "tier": "adv",
        "goal": "Dla każdego miasta oddziału st.city policz liczbę wypożyczeń jako rentals_cnt oraz sumę wpłat z COALESCE(SUM(p.amount), 0) jako total_revenue, łącząc store st, staff s, payment p i rental r przez LEFT JOIN.",
        "prompt": "Dla każdego miasta oddziału st.city policz liczbę wypożyczeń jako rentals_cnt oraz sumę wpłat z COALESCE(SUM(p.amount), 0) jako total_revenue, łącząc store st, staff s, payment p i rental r przez LEFT JOIN.",
        "sol": "SELECT st.city, COUNT(r.rental_id) AS rentals_cnt, COALESCE(SUM(p.amount), 0) AS total_revenue FROM store st LEFT JOIN staff s ON st.store_id = s.store_id LEFT JOIN payment p ON s.staff_id = p.staff_id LEFT JOIN rental r ON p.rental_id = r.rental_id GROUP BY st.city ORDER BY st.city ASC;",
        "order": true,
        "tables": [
          "store",
          "staff",
          "payment",
          "rental"
        ],
        "hint": "COALESCE(SUM(p.amount), 0) AS total_revenue",
        "newFeature": null
      }
    ]
  },
  {
    "id": "p5_1",
    "stage": 5,
    "title": "5.1 Agregacje warunkowe FILTER (WHERE ...) i podzapytania",
    "tables": [
      "film",
      "payment",
      "customer",
      "category",
      "film_category"
    ],
    "cols": [
      "SELECT",
      "FROM",
      "FILTER",
      "WHERE",
      "COUNT",
      "SUM",
      "AVG",
      "ROUND",
      "AS",
      "title",
      "length",
      "rental_rate",
      "pg_count",
      "r_count"
    ],
    "theory": "<ul><li><strong><code>FILTER (WHERE ...)</code>:</strong> elegancka składnia PostgreSQL do agregacji warunkowej (np. <code>COUNT(*) FILTER (WHERE rating = 'PG')</code>).</li><li><strong>Podzapytania skalarne:</strong> zapytanie w nawiasie zwracające jedną wartość (np. <code>WHERE length > (SELECT AVG(length) FROM film)</code>).</li><li><strong>Podzapytania IN:</strong> sprawdzanie przynależności do zbioru generowanego podzapytaniem.</li></ul><div class=\"theory-code\"><code>SELECT COUNT(*) FILTER (WHERE rating = 'PG') AS pg_count\nFROM film;\n\nSELECT title FROM film\nWHERE length > (SELECT AVG(length) FROM film);</code></div>",
    "variants": [
      {
        "stepCode": "R1",
        "keySuffix": "r1",
        "isWarmup": true,
        "tier": "warmup",
        "goal": "Policz filmy z ratingiem PG oraz filmy z ratingiem R w jednym zapytaniu za pomocą FILTER.",
        "prompt": "Oblicz liczbę filmów z ratingiem PG jako pg_count oraz liczbę filmów z ratingiem R jako r_count za pomocą klauzuli FILTER (WHERE ...).",
        "sol": "SELECT COUNT(*) FILTER (WHERE rating = 'PG') AS pg_count, COUNT(*) FILTER (WHERE rating = 'R') AS r_count FROM film;",
        "order": false,
        "tables": [
          "film"
        ],
        "hint": "COUNT(*) FILTER (WHERE rating = 'PG') AS pg_count",
        "newFeature": {
          "title": "Klauzula FILTER (WHERE ...)",
          "desc": "Natywna funkcja PostgreSQL do filtrowania wierszy bezpośrednio wewnątrz agregatu.",
          "example": "SELECT COUNT(*) FILTER (WHERE rating = 'PG') AS pg_cnt FROM film;"
        }
      },
      {
        "stepCode": "R2",
        "keySuffix": "r2",
        "isWarmup": true,
        "tier": "warmup",
        "goal": "Oblicz łączną sumę wpłat oraz sumę dużych transakcji (od 5.00$).",
        "prompt": "Oblicz ogólną sumę wpłat jako total oraz sumę transakcji o kwocie >= 5.00 pod aliasem high_ticket_total za pomocą SUM(amount) FILTER (WHERE amount >= 5.00).",
        "sol": "SELECT SUM(amount) AS total, SUM(amount) FILTER (WHERE amount >= 5.00) AS high_ticket_total FROM payment;",
        "order": false,
        "tables": [
          "payment"
        ],
        "hint": "SUM(amount) FILTER (WHERE amount >= 5.00) AS high_ticket_total",
        "newFeature": null
      },
      {
        "stepCode": "1",
        "keySuffix": "0",
        "isWarmup": false,
        "tier": "basic",
        "goal": "Wybierz tytuł oraz czas trwania dla filmów, których długość length jest większa niż średnia długość wszystkich filmów w bazie (zastosuj podzapytanie skalarne z AVG(length)).",
        "prompt": "Wybierz tytuł oraz czas trwania dla filmów, których długość length jest większa niż średnia długość wszystkich filmów w bazie (zastosuj podzapytanie skalarne z AVG(length)).",
        "sol": "SELECT title, length FROM film WHERE length > (SELECT AVG(length) FROM film);",
        "order": false,
        "tables": [
          "film"
        ],
        "hint": "WHERE length > (SELECT AVG(length) FROM film)",
        "newFeature": {
          "title": "Podzapytanie skalarne w WHERE",
          "desc": "Podzapytanie w nawiasie zwraca pojedynczą wartość (np. średnią), do której porównujesz wiersze.",
          "example": "SELECT title FROM film WHERE length > (SELECT AVG(length) FROM film);"
        }
      },
      {
        "stepCode": "2",
        "keySuffix": "1",
        "isWarmup": false,
        "tier": "basic",
        "goal": "Pobierz customer_id, first_name oraz last_name klientów, którzy dokonali wpłaty o kwocie powyżej 10.00$ (użyj WHERE customer_id IN (SELECT customer_id FROM payment WHERE amount > 10.00)).",
        "prompt": "Pobierz customer_id, first_name oraz last_name klientów, którzy dokonali wpłaty o kwocie powyżej 10.00$ (użyj WHERE customer_id IN (SELECT customer_id FROM payment WHERE amount > 10.00)).",
        "sol": "SELECT customer_id, first_name, last_name FROM customer WHERE customer_id IN (SELECT customer_id FROM payment WHERE amount > 10.00);",
        "order": false,
        "tables": [
          "customer",
          "payment"
        ],
        "hint": "WHERE customer_id IN (SELECT customer_id FROM payment WHERE amount > 10.00)",
        "newFeature": null
      },
      {
        "stepCode": "3",
        "keySuffix": "2",
        "isWarmup": false,
        "tier": "basic",
        "goal": "Dla każdej kategorii c.name policz łączną liczbę filmów jako all_films oraz liczbę filmów z ceną rental_rate > 3.00 jako premium_films za pomocą FILTER, łącząc category c, film_category fc i film f.",
        "prompt": "Dla każdej kategorii c.name policz łączną liczbę filmów jako all_films oraz liczbę filmów z ceną rental_rate > 3.00 jako premium_films za pomocą FILTER, łącząc category c, film_category fc i film f.",
        "sol": "SELECT c.name, COUNT(*) AS all_films, COUNT(*) FILTER (WHERE f.rental_rate > 3.00) AS premium_films FROM category c JOIN film_category fc ON c.category_id = fc.category_id JOIN film f ON fc.film_id = f.film_id GROUP BY c.name ORDER BY c.name ASC;",
        "order": true,
        "tables": [
          "category",
          "film_category",
          "film"
        ],
        "hint": "COUNT(*) FILTER (WHERE f.rental_rate > 3.00) AS premium_films",
        "newFeature": null
      },
      {
        "stepCode": "4",
        "keySuffix": "3",
        "isWarmup": false,
        "tier": "adv",
        "goal": "Pobierz tytuł oraz cenę wypożyczenia dla filmów mających maksymalną cenę wypożyczenia w całej tabeli film (użyj podzapytania z MAX(rental_rate)), sortując alfabetycznie po tytule i ograniczając do 5 wierszy.",
        "prompt": "Pobierz tytuł oraz cenę wypożyczenia dla filmów mających maksymalną cenę wypożyczenia w całej tabeli film (użyj podzapytania z MAX(rental_rate)), sortując alfabetycznie po tytule i ograniczając do 5 wierszy.",
        "sol": "SELECT title, rental_rate FROM film WHERE rental_rate = (SELECT MAX(rental_rate) FROM film) ORDER BY title ASC LIMIT 5;",
        "order": true,
        "tables": [
          "film"
        ],
        "hint": "WHERE rental_rate = (SELECT MAX(rental_rate) FROM film) ORDER BY title ASC LIMIT 5;",
        "newFeature": null
      },
      {
        "stepCode": "5",
        "keySuffix": "4",
        "isWarmup": false,
        "tier": "adv",
        "goal": "Oblicz udział procentowy długich filmów (length >= 120) w całym katalogu jako long_film_pct zaokrąglony do 2 miejsc: ROUND(COUNT(*) FILTER (WHERE length >= 120) * 100.0 / COUNT(*), 2).",
        "prompt": "Oblicz udział procentowy długich filmów (length >= 120) w całym katalogu jako long_film_pct zaokrąglony do 2 miejsc: ROUND(COUNT(*) FILTER (WHERE length >= 120) * 100.0 / COUNT(*), 2).",
        "sol": "SELECT ROUND(COUNT(*) FILTER (WHERE length >= 120) * 100.0 / COUNT(*), 2) AS long_film_pct FROM film;",
        "order": false,
        "tables": [
          "film"
        ],
        "hint": "ROUND(COUNT(*) FILTER (WHERE length >= 120) * 100.0 / COUNT(*), 2) AS long_film_pct",
        "newFeature": null
      },
      {
        "stepCode": "6",
        "keySuffix": "5",
        "isWarmup": false,
        "tier": "adv",
        "goal": "Wybierz staff_id oraz łączną sprzedaż jako staff_rev z podzapytania w FROM dla pracowników, których łączna sprzedaż staff_rev przekracza 1000$.",
        "prompt": "Wybierz staff_id oraz łączną sprzedaż jako staff_rev z podzapytania w FROM dla pracowników, których łączna sprzedaż staff_rev przekracza 1000$.",
        "sol": "SELECT sub.staff_id, sub.staff_rev FROM (SELECT staff_id, SUM(amount) AS staff_rev FROM payment GROUP BY staff_id) sub WHERE sub.staff_rev > 1000 ORDER BY sub.staff_rev DESC;",
        "order": true,
        "tables": [
          "payment"
        ],
        "hint": "FROM (SELECT staff_id, SUM(amount) AS staff_rev FROM payment GROUP BY staff_id) sub WHERE sub.staff_rev > 1000",
        "newFeature": null
      }
    ]
  },
  {
    "id": "p5_2",
    "stage": 5,
    "title": "5.2 Zapytania etapowe CTE (WITH)",
    "tables": [
      "film",
      "payment",
      "customer",
      "film_category",
      "category",
      "staff",
      "store",
      "rental"
    ],
    "cols": [
      "WITH",
      "SELECT",
      "FROM",
      "WHERE",
      "GROUP BY",
      "HAVING",
      "ROUND",
      "AS",
      "ORDER BY",
      "LIMIT",
      "title",
      "length",
      "customer_id",
      "total",
      "first_name",
      "last_name"
    ],
    "theory": "<ul><li><strong><code>WITH nazwa AS (...)</code> (CTE):</strong> tworzy tymczasową, nazwaną tabelę na czas trwania zapytania.</li><li><strong>Czytelność kodu:</strong> CTE pozwala rozbić skomplikowaną logikę analityczną na małe, logiczne etapy zamiast tworzyć trudne do przeczytania potworki zagnieżdżonych podzapytań.</li><li><strong>Wiele CTE:</strong> możesz łączyć kilka CTE po przecinku: <code>WITH krok1 AS (...), krok2 AS (...) SELECT ...</code></li></ul><div class=\"theory-code\"><code>WITH filmy_dlugie AS (\n  SELECT title, length\n  FROM film\n  WHERE length > 120\n)\nSELECT title, length\nFROM filmy_dlugie\nWHERE length > 150;</code></div>",
    "variants": [
      {
        "stepCode": "R1",
        "keySuffix": "r1",
        "isWarmup": true,
        "tier": "warmup",
        "goal": "Stwórz CTE z długimi filmami (>120 min) i wybierz z niego filmy trwające ponad 150 min.",
        "prompt": "Zdefiniuj CTE long_films jako SELECT title, length FROM film WHERE length > 120, a w głównym zapytaniu pobierz title oraz length z long_films dla filmów z length > 150.",
        "sol": "WITH long_films AS (SELECT title, length FROM film WHERE length > 120) SELECT title, length FROM long_films WHERE length > 150;",
        "order": false,
        "tables": [
          "film"
        ],
        "hint": "WITH long_films AS (SELECT title, length FROM film WHERE length > 120) SELECT title, length FROM long_films WHERE length > 150;",
        "newFeature": {
          "title": "Zapytania etapowe CTE (WITH)",
          "desc": "WITH tworzy czytelną tabelę pomocniczą na czas wykonywania zapytania.",
          "example": "WITH long_films AS (SELECT title, length FROM film WHERE length > 120) SELECT * FROM long_films;"
        }
      },
      {
        "stepCode": "R2",
        "keySuffix": "r2",
        "isWarmup": true,
        "tier": "warmup",
        "goal": "Przygotuj zestawienie sumy wpłat per klient w CTE i wybierz klientów z wydatkiem powyżej 150$.",
        "prompt": "W CTE cust_totals oblicz customer_id oraz sumę kwot wpłat jako total z tabeli payment. W głównym zapytaniu zwróć customer_id oraz total z cust_totals dla total > 150, sortując malejąco po total.",
        "sol": "WITH cust_totals AS (SELECT customer_id, SUM(amount) AS total FROM payment GROUP BY customer_id) SELECT customer_id, total FROM cust_totals WHERE total > 150 ORDER BY total DESC;",
        "order": true,
        "tables": [
          "payment"
        ],
        "hint": "WITH cust_totals AS (SELECT customer_id, SUM(amount) AS total FROM payment GROUP BY customer_id) SELECT customer_id, total FROM cust_totals WHERE total > 150 ORDER BY total DESC;",
        "newFeature": null
      },
      {
        "stepCode": "1",
        "keySuffix": "0",
        "isWarmup": false,
        "tier": "basic",
        "goal": "W CTE cat_stats oblicz category_id oraz liczbę filmów jako cnt z film_category. W zapytaniu głównym wybierz category_id oraz cnt dla kategorii mających ponad 50 filmów.",
        "prompt": "W CTE cat_stats oblicz category_id oraz liczbę filmów jako cnt z film_category. W zapytaniu głównym wybierz category_id oraz cnt dla kategorii mających ponad 50 filmów.",
        "sol": "WITH cat_stats AS (SELECT category_id, COUNT(*) AS cnt FROM film_category GROUP BY category_id) SELECT category_id, cnt FROM cat_stats WHERE cnt > 50;",
        "order": false,
        "tables": [
          "film_category"
        ],
        "hint": "WITH cat_stats AS (SELECT category_id, COUNT(*) AS cnt FROM film_category GROUP BY category_id) SELECT category_id, cnt FROM cat_stats WHERE cnt > 50;",
        "newFeature": null
      },
      {
        "stepCode": "2",
        "keySuffix": "1",
        "isWarmup": false,
        "tier": "basic",
        "goal": "W CTE monthly_rev pogrupuj płatności po DATE_TRUNC('month', payment_date::timestamp)::date jako m i podlicz sumę wpłat jako rev. W zapytaniu głównym wybierz m oraz rev z monthly_rev, sortując rosnąco po m.",
        "prompt": "W CTE monthly_rev pogrupuj płatności po DATE_TRUNC('month', payment_date::timestamp)::date jako m i podlicz sumę wpłat jako rev. W zapytaniu głównym wybierz m oraz rev z monthly_rev, sortując rosnąco po m.",
        "sol": "WITH monthly_rev AS (SELECT DATE_TRUNC('month', payment_date::timestamp)::date AS m, SUM(amount) AS rev FROM payment GROUP BY 1) SELECT m, rev FROM monthly_rev ORDER BY m ASC;",
        "order": true,
        "tables": [
          "payment"
        ],
        "hint": "WITH monthly_rev AS (SELECT DATE_TRUNC('month', payment_date::timestamp)::date AS m, SUM(amount) AS rev FROM payment GROUP BY 1) SELECT m, rev FROM monthly_rev ORDER BY m ASC;",
        "newFeature": null
      },
      {
        "stepCode": "3",
        "keySuffix": "2",
        "isWarmup": false,
        "tier": "basic",
        "goal": "W CTE store_sales połącz payment p, staff s i store st, wyliczając store_id oraz sumę sprzedaży jako rev per placówka. Zwróć store_id oraz rev z CTE store_sales.",
        "prompt": "W CTE store_sales połącz payment p, staff s i store st, wyliczając store_id oraz sumę sprzedaży jako rev per placówka. Zwróć store_id oraz rev z CTE store_sales.",
        "sol": "WITH store_sales AS (SELECT st.store_id, SUM(p.amount) AS rev FROM payment p JOIN staff s ON p.staff_id = s.staff_id JOIN store st ON s.store_id = st.store_id GROUP BY st.store_id) SELECT store_id, rev FROM store_sales;",
        "order": false,
        "tables": [
          "payment",
          "staff",
          "store"
        ],
        "hint": "WITH store_sales AS (SELECT st.store_id, SUM(p.amount) AS rev FROM payment p JOIN staff s ON p.staff_id = s.staff_id JOIN store st ON s.store_id = st.store_id GROUP BY st.store_id) SELECT store_id, rev FROM store_sales;",
        "newFeature": null
      },
      {
        "stepCode": "4",
        "keySuffix": "3",
        "isWarmup": false,
        "tier": "adv",
        "goal": "W CTE high_spenders znajdź customer_id klientów mających sumę wpłat > 180 (HAVING SUM(amount) > 180). W głównym zapytaniu połącz customer c z high_spenders h, zwracając c.first_name oraz c.last_name.",
        "prompt": "W CTE high_spenders znajdź customer_id klientów mających sumę wpłat > 180 (HAVING SUM(amount) > 180). W głównym zapytaniu połącz customer c z high_spenders h, zwracając c.first_name oraz c.last_name.",
        "sol": "WITH high_spenders AS (SELECT customer_id FROM payment GROUP BY customer_id HAVING SUM(amount) > 180) SELECT c.first_name, c.last_name FROM customer c JOIN high_spenders h ON c.customer_id = h.customer_id;",
        "order": false,
        "tables": [
          "payment",
          "customer"
        ],
        "hint": "WITH high_spenders AS (SELECT customer_id FROM payment GROUP BY customer_id HAVING SUM(amount) > 180) SELECT c.first_name, c.last_name FROM customer c JOIN high_spenders h ON c.customer_id = h.customer_id;",
        "newFeature": null
      },
      {
        "stepCode": "5",
        "keySuffix": "4",
        "isWarmup": false,
        "tier": "adv",
        "goal": "W CTE f_stats policz średnią długość filmów jako avg_l dla każdej kategorii rating. W głównym zapytaniu połącz film f ze statystykami f_stats po rating, zwracając f.title, f.rating oraz f.length dla filmów dłuższych niż średnia w ich kategorii (f.length > s.avg_l), sortując malejąco po długości i biorąc 5 pierwszych.",
        "prompt": "W CTE f_stats policz średnią długość filmów jako avg_l dla każdej kategorii rating. W głównym zapytaniu połącz film f ze statystykami f_stats po rating, zwracając f.title, f.rating oraz f.length dla filmów dłuższych niż średnia w ich kategorii (f.length > s.avg_l), sortując malejąco po długości i biorąc 5 pierwszych.",
        "sol": "WITH f_stats AS (SELECT rating, AVG(length) AS avg_l FROM film GROUP BY rating) SELECT f.title, f.rating, f.length FROM film f JOIN f_stats s ON f.rating = s.rating WHERE f.length > s.avg_l ORDER BY f.length DESC, f.title ASC LIMIT 5;",
        "order": true,
        "tables": [
          "film"
        ],
        "hint": "WITH f_stats AS (SELECT rating, AVG(length) AS avg_l FROM film GROUP BY rating) SELECT f.title, f.rating, f.length FROM film f JOIN f_stats s ON f.rating = s.rating WHERE f.length > s.avg_l ORDER BY f.length DESC, f.title ASC LIMIT 5;",
        "newFeature": null
      },
      {
        "stepCode": "6",
        "keySuffix": "5",
        "isWarmup": false,
        "tier": "adv",
        "goal": "W CTE cat_rev podlicz przychód rev dla każdej kategorii (c.name), łącząc category c, film_category fc, film f, rental r i payment p. W głównym zapytaniu wybierz c.name oraz rev dla 3 najbardziej dochodowych kategorii.",
        "prompt": "W CTE cat_rev podlicz przychód rev dla każdej kategorii (c.name), łącząc category c, film_category fc, film f, rental r i payment p. W głównym zapytaniu wybierz c.name oraz rev dla 3 najbardziej dochodowych kategorii.",
        "sol": "WITH cat_rev AS (SELECT c.name, SUM(p.amount) AS rev FROM category c JOIN film_category fc ON c.category_id = fc.category_id JOIN film f ON fc.film_id = f.film_id JOIN rental r ON f.film_id = r.film_id JOIN payment p ON r.rental_id = p.rental_id GROUP BY c.name) SELECT name, rev FROM cat_rev ORDER BY rev DESC, name ASC LIMIT 3;",
        "order": true,
        "tables": [
          "category",
          "film_category",
          "film",
          "rental",
          "payment"
        ],
        "hint": "ORDER BY rev DESC, name ASC LIMIT 3;",
        "newFeature": null
      }
    ]
  },
  {
    "id": "p5_3",
    "stage": 5,
    "title": "5.3 Funkcje okna: Rankingi (ROW_NUMBER, RANK, DENSE_RANK) i porównania (LAG, LEAD)",
    "tables": [
      "film",
      "payment",
      "category"
    ],
    "cols": [
      "SELECT",
      "FROM",
      "OVER",
      "PARTITION BY",
      "ORDER BY",
      "ROW_NUMBER",
      "RANK",
      "DENSE_RANK",
      "LAG",
      "LEAD",
      "SUM",
      "ROUND",
      "AS",
      "LIMIT",
      "title",
      "length",
      "rating",
      "amount"
    ],
    "theory": "<ul><li><strong>Funkcje Okna (<code>OVER (...)</code>):</strong> wykonują obliczenia analityczne na zbiorze wierszy, NIE zwijając ich do pojedynczego wiersza (w przeciwieństwie do GROUP BY)!</li><li><strong>Rankingi:</strong> <code>ROW_NUMBER()</code> (unikalny numer 1,2,3...), <code>DENSE_RANK()</code> (pozycje bez dziur w numeracji przy remisie).</li><li><strong><code>PARTITION BY</code>:</strong> resetuje numerację/agregację osobno dla każdej grupy (np. osobny ranking filmów w każdej kategorii wiekowej).</li><li><strong><code>LAG(kolumna)</code> i <code>LEAD(kolumna)</code>:</strong> pobierają wartość z poprzedniego lub następnego wiersza (idealne do liczenia zmian z miesiąca na miesiąc).</li></ul><div class=\"theory-code\"><code>SELECT title, rating, length,\n  ROW_NUMBER() OVER (PARTITION BY rating ORDER BY length DESC) AS rn\nFROM film;</code></div>",
    "variants": [
      {
        "stepCode": "R1",
        "keySuffix": "r1",
        "isWarmup": true,
        "tier": "warmup",
        "goal": "Ponumeruj 5 najdłuższych filmów od 1 do 5 za pomocą ROW_NUMBER.",
        "prompt": "Pobierz title, length oraz numer porządkowy w rankingu jako rn za pomocą ROW_NUMBER() OVER (ORDER BY length DESC, title ASC) dla 5 najdłuższych filmów.",
        "sol": "SELECT title, length, ROW_NUMBER() OVER (ORDER BY length DESC, title ASC) AS rn FROM film LIMIT 5;",
        "order": true,
        "tables": [
          "film"
        ],
        "hint": "ROW_NUMBER() OVER (ORDER BY length DESC, title ASC) AS rn LIMIT 5;",
        "newFeature": {
          "title": "Funkcje Okna i ROW_NUMBER()",
          "desc": "OVER (ORDER BY ...) nadaje wierszom kolejny numer bez redukowania ich do grup.",
          "example": "SELECT title, ROW_NUMBER() OVER (ORDER BY length DESC) AS rn FROM film;"
        }
      },
      {
        "stepCode": "R2",
        "keySuffix": "r2",
        "isWarmup": true,
        "tier": "warmup",
        "goal": "Stwórz ranking cen wypożyczenia filmów osobno w każdej kategorii wiekowej za pomocą DENSE_RANK.",
        "prompt": "Pobierz rating, title, rental_rate oraz pozycję w rankingu cen jako rk za pomocą DENSE_RANK() OVER (PARTITION BY rating ORDER BY rental_rate DESC, title ASC), ograniczając wynik do pierwszych 10 rekordów.",
        "sol": "SELECT rating, title, rental_rate, DENSE_RANK() OVER (PARTITION BY rating ORDER BY rental_rate DESC, title ASC) AS rk FROM film LIMIT 10;",
        "order": true,
        "tables": [
          "film"
        ],
        "hint": "DENSE_RANK() OVER (PARTITION BY rating ORDER BY rental_rate DESC, title ASC) AS rk LIMIT 10;",
        "newFeature": {
          "title": "PARTITION BY w oknie",
          "desc": "PARTITION BY dzieli zbiór na niezależne okna, resetując numerację dla każdej grupy.",
          "example": "DENSE_RANK() OVER (PARTITION BY rating ORDER BY rental_rate DESC) AS rk"
        }
      },
      {
        "stepCode": "1",
        "keySuffix": "0",
        "isWarmup": false,
        "tier": "basic",
        "goal": "Pobierz payment_id, customer_id, amount oraz poprzednią kwotę wpłaty tego samego klienta jako prev_amount za pomocą LAG(amount) OVER (PARTITION BY customer_id ORDER BY payment_date, payment_id), ograniczając wynik do pierwszych 10 rekordów.",
        "prompt": "Pobierz payment_id, customer_id, amount oraz poprzednią kwotę wpłaty tego samego klienta jako prev_amount za pomocą LAG(amount) OVER (PARTITION BY customer_id ORDER BY payment_date, payment_id), ograniczając wynik do pierwszych 10 rekordów.",
        "sol": "SELECT payment_id, customer_id, amount, LAG(amount) OVER (PARTITION BY customer_id ORDER BY payment_date, payment_id) AS prev_amount FROM payment LIMIT 10;",
        "order": true,
        "tables": [
          "payment"
        ],
        "hint": "LAG(amount) OVER (PARTITION BY customer_id ORDER BY payment_date, payment_id) AS prev_amount LIMIT 10;",
        "newFeature": {
          "title": "Funkcja LAG() (poprzedni wiersz)",
          "desc": "LAG pobiera wartość z poprzedniego wiersza w zdefiniowanym porządku okna.",
          "example": "LAG(amount) OVER (ORDER BY payment_date) AS prev_amt"
        }
      },
      {
        "stepCode": "2",
        "keySuffix": "1",
        "isWarmup": false,
        "tier": "basic",
        "goal": "Pobierz payment_id, customer_id, amount oraz sumę narastającą wpłat klienta jako running_total za pomocą SUM(amount) OVER (PARTITION BY customer_id ORDER BY payment_date, payment_id) dla pierwszych 10 wierszy.",
        "prompt": "Pobierz payment_id, customer_id, amount oraz sumę narastającą wpłat klienta jako running_total za pomocą SUM(amount) OVER (PARTITION BY customer_id ORDER BY payment_date, payment_id) dla pierwszych 10 wierszy.",
        "sol": "SELECT payment_id, customer_id, amount, SUM(amount) OVER (PARTITION BY customer_id ORDER BY payment_date, payment_id) AS running_total FROM payment LIMIT 10;",
        "order": true,
        "tables": [
          "payment"
        ],
        "hint": "SUM(amount) OVER (PARTITION BY customer_id ORDER BY payment_date, payment_id) AS running_total LIMIT 10;",
        "newFeature": {
          "title": "Suma narastająca (Running Total)",
          "desc": "SUM(...) OVER (ORDER BY ...) liczy sumę kumulatywną krok po kroku od pierwszego wiersza.",
          "example": "SUM(amount) OVER (ORDER BY payment_date) AS running_total"
        }
      },
      {
        "stepCode": "3",
        "keySuffix": "2",
        "isWarmup": false,
        "tier": "basic",
        "goal": "W CTE ranked ponumeruj filmy w każdej kategorii rating od najdłuższych (ROW_NUMBER() OVER (PARTITION BY rating ORDER BY length DESC, title ASC) AS rn). W zapytaniu głównym wybierz title, rating, length oraz rn dla 2 najdłuższych filmów w każdej kategorii (rn <= 2).",
        "prompt": "W CTE ranked ponumeruj filmy w każdej kategorii rating od najdłuższych (ROW_NUMBER() OVER (PARTITION BY rating ORDER BY length DESC, title ASC) AS rn). W zapytaniu głównym wybierz title, rating, length oraz rn dla 2 najdłuższych filmów w każdej kategorii (rn <= 2).",
        "sol": "WITH ranked AS (SELECT title, rating, length, ROW_NUMBER() OVER (PARTITION BY rating ORDER BY length DESC, title ASC) AS rn FROM film) SELECT title, rating, length, rn FROM ranked WHERE rn <= 2;",
        "order": false,
        "tables": [
          "film"
        ],
        "hint": "WITH ranked AS (...) SELECT ... WHERE rn <= 2;",
        "newFeature": null
      },
      {
        "stepCode": "4",
        "keySuffix": "3",
        "isWarmup": false,
        "tier": "adv",
        "goal": "Pobierz payment_id, amount oraz kolejną kwotę wpłaty jako next_amount za pomocą LEAD(amount) OVER (ORDER BY payment_date, payment_id) dla pierwszych 5 płatności.",
        "prompt": "Pobierz payment_id, amount oraz kolejną kwotę wpłaty jako next_amount za pomocą LEAD(amount) OVER (ORDER BY payment_date, payment_id) dla pierwszych 5 płatności.",
        "sol": "SELECT payment_id, amount, LEAD(amount) OVER (ORDER BY payment_date, payment_id) AS next_amount FROM payment LIMIT 5;",
        "order": true,
        "tables": [
          "payment"
        ],
        "hint": "LEAD(amount) OVER (ORDER BY payment_date, payment_id) AS next_amount LIMIT 5;",
        "newFeature": {
          "title": "Funkcja LEAD() (następny wiersz)",
          "desc": "LEAD zagląda do kolejnego wiersza w oknie, umożliwiając porównania w przód.",
          "example": "LEAD(amount) OVER (ORDER BY payment_date) AS next_amt"
        }
      },
      {
        "stepCode": "5",
        "keySuffix": "4",
        "isWarmup": false,
        "tier": "adv",
        "goal": "Pobierz rating, title, length oraz pozycję w rankingu długości jako rnk za pomocą RANK() OVER (PARTITION BY rating ORDER BY length DESC, title ASC) dla pierwszych 10 filmów.",
        "prompt": "Pobierz rating, title, length oraz pozycję w rankingu długości jako rnk za pomocą RANK() OVER (PARTITION BY rating ORDER BY length DESC, title ASC) dla pierwszych 10 filmów.",
        "sol": "SELECT rating, title, length, RANK() OVER (PARTITION BY rating ORDER BY length DESC, title ASC) AS rnk FROM film LIMIT 10;",
        "order": true,
        "tables": [
          "film"
        ],
        "hint": "RANK() OVER (PARTITION BY rating ORDER BY length DESC, title ASC) AS rnk LIMIT 10;",
        "newFeature": null
      },
      {
        "stepCode": "6",
        "keySuffix": "5",
        "isWarmup": false,
        "tier": "adv",
        "goal": "W CTE m pogrupuj miesięczny przychód payment po DATE_TRUNC('month', payment_date::timestamp)::date jako miesiac i SUM(amount) jako rev. W zapytaniu głównym zwróć miesiac, rev, poprzedni przychód jako prev_rev (użyj LAG) oraz zmianę procentową mom_pct = ROUND((rev - LAG(rev) OVER (ORDER BY miesiac)) * 100.0 / LAG(rev) OVER (ORDER BY miesiac), 2).",
        "prompt": "W CTE m pogrupuj miesięczny przychód payment po DATE_TRUNC('month', payment_date::timestamp)::date jako miesiac i SUM(amount) jako rev. W zapytaniu głównym zwróć miesiac, rev, poprzedni przychód jako prev_rev (użyj LAG) oraz zmianę procentową mom_pct = ROUND((rev - LAG(rev) OVER (ORDER BY miesiac)) * 100.0 / LAG(rev) OVER (ORDER BY miesiac), 2).",
        "sol": "WITH m AS (SELECT DATE_TRUNC('month', payment_date::timestamp)::date AS miesiac, SUM(amount) AS rev FROM payment GROUP BY 1) SELECT miesiac, rev, LAG(rev) OVER (ORDER BY miesiac) AS prev_rev, ROUND((rev - LAG(rev) OVER (ORDER BY miesiac)) * 100.0 / LAG(rev) OVER (ORDER BY miesiac), 2) AS mom_pct FROM m;",
        "order": false,
        "tables": [
          "payment"
        ],
        "hint": "ROUND((rev - LAG(rev) OVER (ORDER BY miesiac)) * 100.0 / LAG(rev) OVER (ORDER BY miesiac), 2) AS mom_pct",
        "newFeature": null
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
      "focusWrite": [
        "SELECT",
        "FROM"
      ],
      "focusExec": [
        1,
        5
      ],
      "note": "<strong>Zasada działania:</strong> W kodzie piszesz najpierw <code>SELECT</code>, a potem <code>FROM</code>. Silnik PostgreSQL najpierw otwiera tabelę z <code>FROM</code>, a dopiero potem wycina wskazane kolumny."
    },
    {
      "title": "Przykład na żywo (dvdrental)",
      "code": "SELECT title, rental_rate\nFROM film;",
      "lines": [
        {
          "line": "FROM film;",
          "desc": "Silnik otwiera tabelę film."
        },
        {
          "line": "SELECT title, rental_rate",
          "desc": "Silnik wybiera tytuł i cenę do tabeli wynikowej."
        }
      ]
    },
    {
      "title": "Sprawdź się przed zadaniami!",
      "quiz": {
        "question": "Które zapytanie poprawnie pobierze kolumny `first_name` oraz `last_name` z tabeli `actor`?",
        "options": [
          "SELECT first_name, last_name, FROM actor;",
          "SELECT first_name, last_name FROM actor;",
          "FROM actor SELECT first_name last_name;"
        ],
        "correct": 1,
        "explanation": "Brawo! Kolumny rozdzielamy przecinkami, ale przed słowem FROM nigdy nie stawiamy przecinka."
      }
    }
  ],
  "p1_2": [
    {
      "title": "Aliasy AS i obliczenia w SELECT",
      "syntax": "SELECT kolumna AS nowy_naglowek, cena * 100 AS cena_centy\nFROM tabela;",
      "bullets": [
        "<strong><code>AS</code>:</strong> zmienia nazwę kolumny w nagłówku wyniku.",
        "<strong>Obliczenia:</strong> możesz dodawać (<code>+</code>), odejmować (<code>-</code>), mnożyć (<code>*</code>) i dzielić (<code>/</code>)."
      ]
    },
    {
      "title": "Kolejność w silniku",
      "focusWrite": [
        "SELECT",
        "FROM"
      ],
      "focusExec": [
        1,
        5
      ],
      "note": "Aliasy i wyliczenia są tworzone dopiero w fazie <code>SELECT</code> (po otwarciu tabeli z <code>FROM</code>)."
    },
    {
      "title": "Przykład obliczenia",
      "code": "SELECT title, length / 60.0 AS hours\nFROM film;",
      "lines": [
        {
          "line": "FROM film;",
          "desc": "Otwiera tabelę film."
        },
        {
          "line": "SELECT title, length / 60.0 AS hours",
          "desc": "Dzieli długość przez 60 i nadaje kolumnie alias hours."
        }
      ]
    },
    {
      "title": "Szybki quiz",
      "quiz": {
        "question": "Jak prawidłowo nadać kolumnie `price` nowy nagłówek `cena_pln`?",
        "options": [
          "SELECT price AS cena_pln FROM film;",
          "SELECT cena_pln AS price FROM film;",
          "SELECT price (cena_pln) FROM film;"
        ],
        "correct": 0,
        "explanation": "Znakomicie! Stosujemy zapis: nazwa_oryginalna AS nowa_nazwa."
      }
    }
  ],
  "p1_3": [
    {
      "title": "Usuwanie duplikatów: DISTINCT",
      "syntax": "SELECT DISTINCT kolumna\nFROM tabela;",
      "bullets": [
        "<strong><code>DISTINCT</code>:</strong> eliminuje powtarzające się wiersze.",
        "Stawia się go raz, bezpośrednio po słowie <code>SELECT</code>."
      ]
    },
    {
      "title": "Działanie DISTINCT",
      "focusWrite": [
        "SELECT",
        "DISTINCT",
        "FROM"
      ],
      "focusExec": [
        1,
        5
      ],
      "note": "DISTINCT filtruje duplikaty tuż przed przygotowaniem końcowego wyniku."
    },
    {
      "title": "Przykład DISTINCT",
      "code": "SELECT DISTINCT rating\nFROM film;",
      "lines": [
        {
          "line": "FROM film;",
          "desc": "Otwiera tabelę film (1000 rekordów)."
        },
        {
          "line": "SELECT DISTINCT rating",
          "desc": "Zwraca tylko unikalne wartości (G, PG, R itp. — 5 wierszy)."
        }
      ]
    },
    {
      "title": "Szybki quiz",
      "quiz": {
        "question": "Gdzie w zapytaniu stawia się słowo kluczowe DISTINCT?",
        "options": [
          "Na samym końcu po FROM tabela DISTINCT;",
          "Bezpośrednio po słowie SELECT: SELECT DISTINCT kolumna FROM tabela;",
          "W nawiasie przed nazwą tabeli."
        ],
        "correct": 1,
        "explanation": "Dokładnie tak! Zawsze piszemy SELECT DISTINCT ..."
      }
    }
  ],
  "p1_4": [
    {
      "title": "Sortowanie i odcinanie: ORDER BY i LIMIT",
      "syntax": "SELECT kolumna1, kolumna2\nFROM tabela\nORDER BY kolumna2 DESC\nLIMIT 5;",
      "bullets": [
        "<strong><code>ORDER BY</code>:</strong> sortuje gotowy wynik (<code>ASC</code> = rosnąco, <code>DESC</code> = malejąco).",
        "<strong><code>LIMIT N</code>:</strong> zwraca tylko pierwsze N wierszy."
      ]
    },
    {
      "title": "Kolejność wykonywania",
      "focusWrite": [
        "SELECT",
        "FROM",
        "ORDER BY",
        "LIMIT"
      ],
      "focusExec": [
        1,
        5,
        7,
        8
      ],
      "note": "Sortowanie (ORDER BY) i odcięcie wierszy (LIMIT) wykonują się na samym końcu potoku silnika."
    },
    {
      "title": "Przykład ORDER BY + LIMIT",
      "code": "SELECT title, length\nFROM film\nORDER BY length DESC\nLIMIT 3;",
      "lines": [
        {
          "line": "FROM film;",
          "desc": "Otwiera tabelę film."
        },
        {
          "line": "SELECT title, length",
          "desc": "Pobiera tytuł i długość."
        },
        {
          "line": "ORDER BY length DESC",
          "desc": "Układa od najdłuższych do najkrótszych."
        },
        {
          "line": "LIMIT 3;",
          "desc": "Zostawia tylko podium (TOP 3)."
        }
      ]
    },
    {
      "title": "Szybki quiz",
      "quiz": {
        "question": "Jak posortować wiersze od największych do najmniejszych?",
        "options": [
          "ORDER BY kolumna ASC",
          "ORDER BY kolumna DESC",
          "LIMIT DESC"
        ],
        "correct": 1,
        "explanation": "Świetnie! DESC oznacza descending (malejąco)."
      }
    }
  ],
  "p2_1": [
    {
      "title": "Filtrowanie wierszy: WHERE",
      "syntax": "SELECT kolumny\nFROM tabela\nWHERE warunek;",
      "bullets": [
        "<strong><code>WHERE</code>:</strong> odrzuca wiersze niespełniające warunku.",
        "Liczby piszemy bez cudzysłowów (<code>cena > 10</code>), a tekst w apostrofach (<code>status = 'aktywny'</code>)."
      ]
    },
    {
      "title": "Kolejność silnika bazy",
      "focusWrite": [
        "SELECT",
        "FROM",
        "WHERE"
      ],
      "focusExec": [
        1,
        2,
        5
      ],
      "note": "Kluczowa zasada: silnik wykonuje <code>WHERE</code> bezpośrednio po <code>FROM</code>, ZANIM przejdzie do <code>SELECT</code>!"
    },
    {
      "title": "Przykład WHERE",
      "code": "SELECT title, rental_rate\nFROM film\nWHERE rental_rate = 0.99;",
      "lines": [
        {
          "line": "FROM film;",
          "desc": "Otwiera tabelę film."
        },
        {
          "line": "WHERE rental_rate = 0.99;",
          "desc": "Silnik odrzuca filmy o innej cenie."
        },
        {
          "line": "SELECT title, rental_rate",
          "desc": "Zwraca wycięte kolumny."
        }
      ]
    },
    {
      "title": "Szybki quiz",
      "quiz": {
        "question": "Jak poprawnie przefiltrować wiersze dla kategorii wiekowej G w PostgreSQL?",
        "options": [
          "WHERE rating = G",
          "WHERE rating = 'G'",
          "WHERE rating == \"G\""
        ],
        "correct": 1,
        "explanation": "Brawo! Tekst w PostgreSQL zawsze zapisujemy w pojedynczych apostrofach 'G'."
      }
    }
  ],
  "p2_2": [
    {
      "title": "Łączenie warunków: AND i OR",
      "syntax": "SELECT kolumny\nFROM tabela\nWHERE warunek1 AND warunek2;\n\nWHERE (w1 OR w2) AND w3;",
      "bullets": [
        "<strong><code>AND</code>:</strong> oba warunki muszą być prawdziwe.",
        "<strong><code>OR</code>:</strong> wystarczy, że jeden warunek jest prawdziwy.",
        "Zawsze używaj nawiasów przy mieszaniu AND z OR."
      ]
    },
    {
      "title": "Priorytet operatorów",
      "focusWrite": [
        "SELECT",
        "FROM",
        "WHERE",
        "AND",
        "OR"
      ],
      "focusExec": [
        1,
        2,
        5
      ],
      "note": "AND ma wyższy priorytet niż OR — dlatego nawiasy są kluczowe, aby zapytanie działało zgodnie z Twoją intencją!"
    },
    {
      "title": "Przykład AND i OR",
      "code": "SELECT title, rating, rental_rate\nFROM film\nWHERE (rating = 'G' OR rating = 'PG') AND rental_rate < 3.00;",
      "lines": [
        {
          "line": "FROM film;",
          "desc": "Otwiera tabelę film."
        },
        {
          "line": "WHERE (rating = 'G' OR rating = 'PG') AND rental_rate < 3.00",
          "desc": "Sprawdza czy film ma kategorię familijną i jednocześnie kosztuje poniżej 3$."
        }
      ]
    },
    {
      "title": "Szybki quiz",
      "quiz": {
        "question": "Który warunek wybierze klientów nieaktywnych (active=0) Z placówki numer 2?",
        "options": [
          "WHERE active = 0 OR store_id = 2",
          "WHERE active = 0 AND store_id = 2",
          "WHERE active = 0, store_id = 2"
        ],
        "correct": 1,
        "explanation": "Dokładnie tak! Operator AND wymaga jednoczesnego spełnienia obu kryteriów."
      }
    }
  ],
  "p2_3": [
    {
      "title": "Szybkie operatory filtrujące",
      "syntax": "WHERE kolumna IN (w1, w2)\nWHERE liczba BETWEEN 10 AND 50\nWHERE tekst ILIKE 'a%'\nWHERE pole IS NOT NULL;",
      "bullets": [
        "<strong><code>IN</code>:</strong> zastępuje serie OR dla konkretnych wartości.",
        "<strong><code>BETWEEN</code>:</strong> przedział obustronnie domknięty (z krańcami).",
        "<strong><code>ILIKE</code>:</strong> wyszukiwanie tekstu z % (dowolny ciąg).",
        "<strong><code>IS NULL</code>:</strong> sprawdzanie braku wartości."
      ]
    },
    {
      "title": "Pułapka NULL w SQL",
      "focusWrite": [
        "SELECT",
        "FROM",
        "WHERE",
        "IN",
        "ILIKE"
      ],
      "focusExec": [
        1,
        2,
        5
      ],
      "note": "Pamiętaj: w SQL wyrażenie <code>kolumna = NULL</code> zwraca NULL (nieznane), a nie TRUE! Zawsze pisz <code>IS NULL</code> lub <code>IS NOT NULL</code>."
    },
    {
      "title": "Przykład ILIKE i IN",
      "code": "SELECT title, rating\nFROM film\nWHERE rating IN ('G', 'PG') AND title ILIKE 'star%';",
      "lines": [
        {
          "line": "FROM film;",
          "desc": "Otwiera tabelę film."
        },
        {
          "line": "WHERE rating IN ('G', 'PG') AND title ILIKE 'star%'",
          "desc": "Wybiera filmy G/PG zaczynające się od słowa star."
        }
      ]
    },
    {
      "title": "Szybki quiz",
      "quiz": {
        "question": "Jak sprawdzić, czy film ma długość od 90 do 120 minut włącznie?",
        "options": [
          "WHERE length IN (90, 120)",
          "WHERE length BETWEEN 90 AND 120",
          "WHERE length FROM 90 TO 120"
        ],
        "correct": 1,
        "explanation": "Wyśmienicie! Operator BETWEEN obejmuje obie wartości graniczne."
      }
    }
  ],
  "p3_1": [
    {
      "title": "Funkcje agregujące SQL",
      "syntax": "SELECT COUNT(*), SUM(kwota), AVG(cena), ROUND(AVG(cena), 2)\nFROM tabela;",
      "bullets": [
        "<strong>Agregaty:</strong> łączą wiele rekordów w 1 wiersz podsumowania.",
        "<strong><code>COUNT(*)</code></strong> liczy wiersze, a <strong><code>COUNT(kol)</code></strong> ignoruje wartości NULL.",
        "<strong><code>ROUND(..., 2)</code>:</strong> formatuje wynik do 2 miejsc po przecinku."
      ]
    },
    {
      "title": "Potok agregacji silnika",
      "focusWrite": [
        "SELECT",
        "FROM",
        "WHERE"
      ],
      "focusExec": [
        1,
        2,
        5
      ],
      "note": "Gdy zapytanie nie posiada GROUP BY, agregaty są obliczane dla wszystkich wierszy przefiltrowanych przez WHERE."
    },
    {
      "title": "Przykład agregacji z zaokrągleniem",
      "code": "SELECT COUNT(*) AS cnt, ROUND(AVG(amount), 2) AS srednia\nFROM payment\nWHERE amount > 5.00;",
      "lines": [
        {
          "line": "FROM payment;",
          "desc": "Otwiera rejestr płatności."
        },
        {
          "line": "WHERE amount > 5.00;",
          "desc": "Filtruje wpłaty powyżej 5$."
        },
        {
          "line": "SELECT COUNT(*)...",
          "desc": "Podlicza liczbę i średnią przefiltrowanych wpłat."
        }
      ]
    },
    {
      "title": "Szybki quiz",
      "quiz": {
        "question": "Która funkcja policzy średnią arytmetyczną z kolumny pensja?",
        "options": [
          "MEAN(pensja)",
          "AVERAGE(pensja)",
          "AVG(pensja)"
        ],
        "correct": 2,
        "explanation": "Znakomicie! W standardzie SQL funkcja średniej to skrót AVG."
      }
    }
  ],
  "p3_2": [
    {
      "title": "Grupowanie: GROUP BY",
      "syntax": "SELECT kolumna_grupujaca, COUNT(*), SUM(kwota)\nFROM tabela\nGROUP BY kolumna_grupujaca;",
      "bullets": [
        "<strong><code>GROUP BY</code>:</strong> tworzy wiaderka (grupy) dla identycznych wartości.",
        "Wszystkie niezagregowane kolumny w SELECT muszą znaleźć się w GROUP BY."
      ]
    },
    {
      "title": "Kolejność wykonywania GROUP BY",
      "focusWrite": [
        "SELECT",
        "FROM",
        "WHERE",
        "GROUP BY"
      ],
      "focusExec": [
        1,
        2,
        3,
        5
      ],
      "note": "Silnik bazy najpierw filtruje wiersze (WHERE), potem dzieli je na grupy (GROUP BY), a na końcu wylicza agregaty (SELECT)."
    },
    {
      "title": "Przykład grupowania",
      "code": "SELECT rating, COUNT(*) AS cnt\nFROM film\nGROUP BY rating;",
      "lines": [
        {
          "line": "FROM film;",
          "desc": "Otwiera tabelę film."
        },
        {
          "line": "GROUP BY rating;",
          "desc": "Dzieli filmy na 5 grup (G, PG, PG-13, R, NC-17)."
        },
        {
          "line": "SELECT rating, COUNT(*)",
          "desc": "Zwraca etykietę grupy oraz liczbę filmów w każdej z nich."
        }
      ]
    },
    {
      "title": "Szybki quiz",
      "quiz": {
        "question": "Które zapytanie jest poprawne składniowo w PostgreSQL?",
        "options": [
          "SELECT rating, title, COUNT(*) FROM film GROUP BY rating;",
          "SELECT rating, COUNT(*) FROM film GROUP BY rating;",
          "SELECT rating FROM film GROUP BY;"
        ],
        "correct": 1,
        "explanation": "Świetnie! Kolumna title nie jest zagregowana i nie ma jej w GROUP BY, dlatego pierwsza opcja wywołałaby błąd."
      }
    }
  ],
  "p3_3": [
    {
      "title": "Filtrowanie grup: HAVING",
      "syntax": "SELECT kolumna, COUNT(*)\nFROM tabela\nWHERE warunek_wierszy\nGROUP BY kolumna\nHAVING COUNT(*) > 10;",
      "bullets": [
        "<strong><code>WHERE</code>:</strong> odrzuca wiersze PRZED grupowaniem (nie wolno w nim pisać COUNT/SUM).",
        "<strong><code>HAVING</code>:</strong> odrzuca całe grupy PO przeliczeniu agregatów."
      ]
    },
    {
      "title": "Architektura potoku silnika",
      "focusWrite": [
        "SELECT",
        "FROM",
        "WHERE",
        "GROUP BY",
        "HAVING"
      ],
      "focusExec": [
        1,
        2,
        3,
        4,
        5
      ],
      "note": "Kolejność: 1. FROM -> 2. WHERE -> 3. GROUP BY -> 4. HAVING -> 5. SELECT -> 6. ORDER BY."
    },
    {
      "title": "Przykład WHERE vs HAVING",
      "code": "SELECT rating, COUNT(*) AS cnt\nFROM film\nWHERE rental_rate > 2.00\nGROUP BY rating\nHAVING COUNT(*) > 50;",
      "lines": [
        {
          "line": "WHERE rental_rate > 2.00",
          "desc": "Filtruje wiersze: odrzuca tanie filmy."
        },
        {
          "line": "GROUP BY rating",
          "desc": "Grupuje pozostałe filmy po ratingu."
        },
        {
          "line": "HAVING COUNT(*) > 50",
          "desc": "Zostawia tylko te grupy ratingu, które mają ponad 50 filmów."
        }
      ]
    },
    {
      "title": "Szybki quiz",
      "quiz": {
        "question": "Gdzie w zapytaniu SQL wolno przefiltrować wynik funkcji COUNT(*) > 10?",
        "options": [
          "W klauzuli WHERE: WHERE COUNT(*) > 10",
          "W klauzuli HAVING: HAVING COUNT(*) > 10",
          "W klauzuli FROM"
        ],
        "correct": 1,
        "explanation": "Idealnie! W klauzuli WHERE nie wolno używać funkcji agregujących — warunki na grupach umieszczamy wyłącznie w HAVING."
      }
    }
  ],
  "p4_1": [
    {
      "title": "Łączenie tabel: INNER JOIN",
      "syntax": "SELECT t1.kolumna, t2.kolumna\nFROM tabela1 t1\nJOIN tabela2 t2 ON t1.klucz = t2.klucz;",
      "bullets": [
        "<strong><code>JOIN ... ON</code>:</strong> łączy tabele po wspólnym kluczu.",
        "<strong>Aliasy tabel (np. <code>t1</code>):</strong> ułatwiają jednoznaczne wskazywanie, z której tabeli pochodzi kolumna.",
        "Zwraca tylko wiersze mające parę w obu tabelach."
      ]
    },
    {
      "title": "Potok łączenia relacji",
      "focusWrite": [
        "SELECT",
        "FROM",
        "JOIN",
        "ON"
      ],
      "focusExec": [
        1,
        5
      ],
      "note": "Złączenia wykonywane są w kroku 1 (FROM/JOIN). Silnik zestawia iloczyn relacji i odrzuca rekordy niespełniające warunku ON."
    },
    {
      "title": "Przykład łączenia 2 tabel",
      "code": "SELECT c.first_name, p.amount\nFROM customer c\nJOIN payment p ON c.customer_id = p.customer_id;",
      "lines": [
        {
          "line": "FROM customer c",
          "desc": "Otwiera lewą tabelę (klient)."
        },
        {
          "line": "JOIN payment p ON c.customer_id = p.customer_id",
          "desc": "Dopasowuje płatności do każdego klienta po identyfikatorze."
        },
        {
          "line": "SELECT c.first_name, p.amount",
          "desc": "Wybiera imię klienta i kwotę wpłaty."
        }
      ]
    },
    {
      "title": "Szybki quiz",
      "quiz": {
        "question": "Co się stanie, jeśli połączymy dwie tabele za pomocą INNER JOIN, a pewien wiersz nie ma dopasowania w drugiej tabeli?",
        "options": [
          "Wiersz ten pojawi się z wartościami NULL",
          "Wiersz ten zostanie całkowicie pominięty w wyniku",
          "Zapytanie zwróci błąd składniowy"
        ],
        "correct": 1,
        "explanation": "Zgadza się! INNER JOIN zachowuje wyłącznie rekordy, które posiadają parę w obu łączonych tabelach."
      }
    }
  ],
  "p4_2": [
    {
      "title": "Szukanie braków: LEFT JOIN",
      "syntax": "SELECT c.first_name, r.rental_id\nFROM customer c\nLEFT JOIN rental r ON c.id = r.customer_id\nWHERE r.rental_id IS NULL;",
      "bullets": [
        "<strong><code>LEFT JOIN</code>:</strong> nie gubi rekordów lewej tabeli.",
        "Jeśli po prawej stronie brak dopasowania, kolumny prawej tabeli przyjmują wartość <code>NULL</code>.",
        "<strong>Anti-Join:</strong> <code>WHERE prawa.id IS NULL</code> wyłapuje brak powiązań."
      ]
    },
    {
      "title": "Pułapka COUNT(*) w LEFT JOIN",
      "focusWrite": [
        "SELECT",
        "FROM",
        "LEFT JOIN",
        "WHERE"
      ],
      "focusExec": [
        1,
        2,
        5
      ],
      "note": "Złota zasada: <code>COUNT(*)</code> liczy pusty wiersz z NULL jako 1! Zawsze zliczaj konkretną kolumnę z prawej tabeli: <code>COUNT(r.rental_id)</code>."
    },
    {
      "title": "Przykład Anti-Join",
      "code": "SELECT c.first_name, c.last_name\nFROM customer c\nLEFT JOIN rental r ON c.customer_id = r.customer_id\nWHERE r.rental_id IS NULL;",
      "lines": [
        {
          "line": "FROM customer c LEFT JOIN rental r...",
          "desc": "Łączy klientów z wypożyczeniami."
        },
        {
          "line": "WHERE r.rental_id IS NULL",
          "desc": "Zostawia wyłącznie klientów bez ani jednego wypożyczenia."
        }
      ]
    },
    {
      "title": "Szybki quiz",
      "quiz": {
        "question": "Jak poprawnie policzyć liczbę zamówień klienta w LEFT JOIN, aby dla klienta bez zamówień wynik wynosił 0, a nie 1?",
        "options": [
          "COUNT(*)",
          "COUNT(zamowienia.zamowienie_id)",
          "SUM(*)"
        ],
        "correct": 1,
        "explanation": "Brawo! COUNT(kolumna) ignoruje wartości NULL i poprawnie zwróci 0 dla braku dopasowania."
      }
    }
  ],
  "p4_3": [
    {
      "title": "Warunki i braki: CASE WHEN i COALESCE",
      "syntax": "SELECT COALESCE(pole, 'brak'),\n  CASE WHEN wiek >= 18 THEN 'Dorosly' ELSE 'Niepelnoletni' END AS kategoria\nFROM tabela;",
      "bullets": [
        "<strong><code>COALESCE</code>:</strong> podstawia wartość domyślną zamiast NULL.",
        "<strong><code>CASE WHEN</code>:</strong> segmentuje wiersze na podstawie warunków (IF-THEN-ELSE)."
      ]
    },
    {
      "title": "Agregacje warunkowe z CASE",
      "focusWrite": [
        "SELECT",
        "FROM",
        "CASE",
        "WHEN",
        "THEN"
      ],
      "focusExec": [
        1,
        5
      ],
      "note": "Złoty wzorzec analityka: <code>SUM(CASE WHEN rating = 'R' THEN 1 ELSE 0 END)</code> pozwala zliczać wybrane typy rekordów bez rozbijania zapytania na podzapytania!"
    },
    {
      "title": "Przykład CASE WHEN",
      "code": "SELECT title, CASE WHEN length < 60 THEN 'Krótki' ELSE 'Standard' END AS typ\nFROM film;",
      "lines": [
        {
          "line": "FROM film;",
          "desc": "Otwiera tabelę film."
        },
        {
          "line": "CASE WHEN length < 60...",
          "desc": "Ocenia warunek dla każdego wiersza i przypisuje etykietę."
        }
      ]
    },
    {
      "title": "Szybki quiz",
      "quiz": {
        "question": "Czym kończy się poprawnie skonstruowane wyrażenie CASE WHEN w SQL?",
        "options": [
          "Słowem END (np. CASE WHEN ... THEN ... END)",
          "Słowem STOP",
          "Średnikiem wewnątrz nawiasu"
        ],
        "correct": 0,
        "explanation": "Wyśmienicie! Konstrukcja warunkowa w SQL zawsze zamyka się słowem kluczowym END."
      }
    }
  ],
  "p5_1": [
    {
      "title": "Analityka: FILTER i Podzapytania",
      "syntax": "SELECT COUNT(*) FILTER (WHERE rating = 'PG') AS pg_cnt\nFROM film;\n\nWHERE kolumna > (SELECT AVG(kolumna) FROM tabela);",
      "bullets": [
        "<strong><code>FILTER (WHERE ...)</code>:</strong> najszybszy sposób na agregację warunkową w PostgreSQL.",
        "<strong>Podzapytania:</strong> zapytania zagnieżdżone w nawiasach w WHERE lub FROM."
      ]
    },
    {
      "title": "Architektura podzapytań",
      "focusWrite": [
        "SELECT",
        "FROM",
        "WHERE",
        "FILTER"
      ],
      "focusExec": [
        1,
        2,
        5
      ],
      "note": "Silnik bazy najpierw oblicza wartość niezależnego podzapytania w nawiasie, a następnie wstawia wynik do zewnętrznego warunku WHERE."
    },
    {
      "title": "Przykład FILTER",
      "code": "SELECT\n  COUNT(*) AS total,\n  COUNT(*) FILTER (WHERE rating = 'PG') AS pg_films\nFROM film;",
      "lines": [
        {
          "line": "FROM film;",
          "desc": "Otwiera tabelę film."
        },
        {
          "line": "COUNT(*) FILTER...",
          "desc": "Zlicza tylko te wiersze, które spełniają warunek w nawiasie FILTER."
        }
      ]
    },
    {
      "title": "Szybki quiz",
      "quiz": {
        "question": "Jak w PostgreSQL zliczyć liczbę zamówień ze statusem gotowe za pomocą klauzuli FILTER?",
        "options": [
          "COUNT(*) FILTER (WHERE status = 'gotowe')",
          "COUNT(status = 'gotowe')",
          "FILTER COUNT(WHERE status = 'gotowe')"
        ],
        "correct": 0,
        "explanation": "Wyśmienicie! Składnia to funkcja_agregujaca(...) FILTER (WHERE warunek)."
      }
    }
  ],
  "p5_2": [
    {
      "title": "Zapytania modułowe: CTE (WITH)",
      "syntax": "WITH podsumowanie AS (\n  SELECT klucz, COUNT(*) AS cnt\n  FROM tabela\n  GROUP BY klucz\n)\nSELECT * FROM podsumowanie WHERE cnt > 5;",
      "bullets": [
        "<strong><code>WITH</code> (Common Table Expression):</strong> tworzy tymczasową tabelę na czas trwania zapytania.",
        "Znacząco poprawia czytelność kodu w porównaniu z zagnieżdżonymi podzapytaniami.",
        "Możesz definiować wiele CTE oddzielając je przecinkami."
      ]
    },
    {
      "title": "Wykonywanie CTE",
      "focusWrite": [
        "WITH",
        "SELECT",
        "FROM",
        "WHERE"
      ],
      "focusExec": [
        1,
        5
      ],
      "note": "CTE działa jak klocki Lego: definiujesz krok 1, krok 2, a w końcowym SELECT łączysz gotowe cegiełki."
    },
    {
      "title": "Przykład CTE",
      "code": "WITH najlepsi AS (\n  SELECT customer_id, SUM(amount) AS wydatki\n  FROM payment\n  GROUP BY customer_id\n  HAVING SUM(amount) > 150\n)\nSELECT c.first_name, n.wydatki\nFROM customer c\nJOIN najlepsi n ON c.customer_id = n.customer_id;",
      "lines": [
        {
          "line": "WITH najlepsi AS (...)",
          "desc": "Etap 1: wylicza sumę wydatków per klient i filtruje > 150$."
        },
        {
          "line": "SELECT c.first_name, n.wydatki...",
          "desc": "Etap 2: dołącza dane osobowe do przefiltrowanych klientów."
        }
      ]
    },
    {
      "title": "Szybki quiz",
      "quiz": {
        "question": "Jakim słowem kluczowym rozpoczyna się definicję tabeli CTE?",
        "options": [
          "CREATE TABLE",
          "WITH",
          "TEMP"
        ],
        "correct": 1,
        "explanation": "Dokładnie tak! Zapytania CTE zawsze zaczynają się od słowa WITH."
      }
    }
  ],
  "p5_3": [
    {
      "title": "Funkcje Okna: OVER (...)",
      "syntax": "SELECT kolumna,\n  ROW_NUMBER() OVER (PARTITION BY kategoria ORDER BY wartosc DESC) AS pozycja,\n  LAG(kwota) OVER (ORDER BY data) AS poprzednia_kwota\nFROM tabela;",
      "bullets": [
        "<strong>Funkcje okna:</strong> liczą analitykę wiersz po wierszu bez zwijania tabeli.",
        "<strong><code>PARTITION BY</code>:</strong> resetuje obliczenia dla każdej grupy.",
        "<strong><code>LAG/LEAD</code>:</strong> pobierają dane z wiersza poprzedniego lub następnego."
      ]
    },
    {
      "title": "Kolejność w silniku PostgreSQL",
      "focusWrite": [
        "SELECT",
        "FROM",
        "WHERE",
        "OVER"
      ],
      "focusExec": [
        1,
        2,
        5
      ],
      "note": "Funkcje okna wykonują się w fazie SELECT (po WHERE i GROUP BY) — dlatego nie można po nich filtrować bezpośrednio w WHERE (użyj CTE WITH)!"
    },
    {
      "title": "Przykład ROW_NUMBER",
      "code": "SELECT title, length,\n  ROW_NUMBER() OVER (ORDER BY length DESC) AS rn\nFROM film\nLIMIT 5;",
      "lines": [
        {
          "line": "FROM film;",
          "desc": "Otwiera tabelę film."
        },
        {
          "line": "ROW_NUMBER() OVER (ORDER BY length DESC)",
          "desc": "Układa filmy od najdłuższych i nadaje im kolejne numery 1, 2, 3, 4, 5..."
        }
      ]
    },
    {
      "title": "Szybki quiz",
      "quiz": {
        "question": "Czym różnią się funkcje okna (OVER) od klasycznego grupowania GROUP BY?",
        "options": [
          "Funkcje okna zwijają wiersze do pojedynczego rekordu, a GROUP BY nie",
          "Funkcje okna zachowują wszystkie pojedyncze wiersze w wyniku, a GROUP BY zwija wiersze do grup",
          "Nie ma żadnej różnicy"
        ],
        "correct": 1,
        "explanation": "Wybitnie! Funkcje okna dołączają wynik obliczeń do każdego oryginalnego wiersza tabeli bez zwijania wyniku."
      }
    }
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
    "prompt": "Z tabeli `rental` zwróć w jednym wierszu dwie kolumny: liczbę wszystkich wierszy (`COUNT(*)`) oraz liczbę wypożyczeń z uzupełnioną datą zwrotu (`COUNT(return_date)`).",
    "sol": "SELECT COUNT(*) AS all_cnt, COUNT(return_date) AS ret_cnt FROM rental;",
    "order": false
  },
  {
    "lvl": 2,
    "stage": 2,
    "gap": "g7",
    "title": "4/10 Grupowanie i filtr po agregacji (HAVING)",
    "prompt": "Z tabeli `payment` wypisz `customer_id` oraz sumę płatności (`SUM(amount)`) tylko dla tych klientów, którzy wydali łącznie co najmniej `8.00`.",
    "sol": "SELECT customer_id, SUM(amount) AS total FROM payment GROUP BY customer_id HAVING SUM(amount) >= 8.00;",
    "order": false
  },
  {
    "lvl": 3,
    "stage": 3,
    "gap": "g1",
    "title": "5/10 INNER JOIN po 3 tabelach",
    "prompt": "Połącz `category`, `film_category` i `film`. Zwróć nazwę kategorii (`name`) oraz liczbę przypisanych do niej filmów (`COUNT(f.film_id)`).",
    "sol": "SELECT c.name, COUNT(f.film_id) AS cnt FROM category c JOIN film_category fc ON c.category_id = fc.category_id JOIN film f ON fc.film_id = f.film_id GROUP BY c.name;",
    "order": false
  },
  {
    "lvl": 3,
    "stage": 3,
    "gap": "g2",
    "title": "6/10 LEFT JOIN + COALESCE (wszyscy klienci, także z 0)",
    "prompt": "Dla KAŻDEGO klienta z tabeli `customer` (również tych bez płatności!) wypisz `customer_id`, `first_name` oraz sumę z tabeli `payment` (zamień `NULL` na `0`).",
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
    "prompt": "Dla każdego sklepu (`store_id`) w tabeli `customer` policz procent aktywnych klientów (`active = 1`). Zwróć `store_id` oraz dokładny procent z ułamkiem.",
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
    "prompt": "Dla płatności klienta `customer_id = 1` w `payment` wypisz `payment_id`, `amount` oraz kwotę poprzedniej płatności (`LAG(amount) OVER (ORDER BY payment_date, payment_id)`).",
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
window.LESSON_TUTORIALS = LESSON_TUTORIALS;
window.LESSON_WARMUPS = LESSON_WARMUPS;
