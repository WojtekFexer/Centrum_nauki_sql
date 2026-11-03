/* ==========================================================================
   3. ŚCIEŻKA NAUKI: 12 LEKCJI × 10 WARIANTÓW = 120 DYNAMICZNYCH ZADAŃ
   ========================================================================== */
var STAGES = [
  { id: 1, name: 'Etap 1: Fundament SELECT i WHERE', desc: 'Filtrowanie wierszy, operatory IN/BETWEEN/ILIKE, sortowanie i LIMIT.' },
  { id: 2, name: 'Etap 2: Agregacje, NULL i GROUP BY', desc: 'COUNT(*) vs COUNT(col), SUM, AVG, grupowanie i filtrowanie grup przez HAVING.' },
  { id: 3, name: 'Etap 3: Złączenia (INNER, LEFT, Anti-Join)', desc: 'Łączenie tabel dvdrental, relacje wiele-do-wielu i szukanie brakujących powiązań.' },
  { id: 4, name: 'Etap 4: CASE WHEN, COALESCE i Rzutowanie', desc: 'Segmentacja danych, FILTER (WHERE ...), obsługa NULL-i oraz procenty (* 100.0).' },
  { id: 5, name: 'Etap 5: CTE, Funkcje Okna i Kalendarze', desc: 'Zapytania WITH, ROW_NUMBER, DENSE_RANK, LAG, sumy narastające i generate_series.' }
];

var PATH_TASKS = [
  {
    id: 'p1_1', stage: 1, title: '1.1 Filtrowanie WHERE, AND i sortowanie ORDER BY',
    tables: ['film', 'payment', 'customer', 'rental'],
    cols: ['title', 'rental_rate', 'rating', 'length', 'film', 'payment', 'customer', 'amount', 'staff_id', 'store_id'],
    theory: '<ul>' +
      '<li><strong><code>SELECT</code> i <code>FROM</code>:</strong> <code>SELECT</code> wskazuje kolumny, które chcesz zobaczyć w wyniku, a <code>FROM</code> mówi, z której tabeli je pobrać.</li>' +
      '<li><strong><code>WHERE</code> (sito na wiersze):</strong> przepuszcza tylko te wiersze, które spełniają Twój warunek (np. <code>rating = \'PG-13\'</code>). Teksty i daty zawsze pisz w pojedynczych apostrofach <code>\'...\'</code>, a liczby bez apostrofów.</li>' +
      '<li><strong><code>AND</code> oraz <code>OR</code>:</strong> <code>AND</code> wymaga spełnienia obu warunków naraz, a <code>OR</code> przynajmniej jednego. <em>Pułapka:</em> gdy łączysz <code>AND</code> z <code>OR</code>, weź część z <code>OR</code> w nawiasy <code>(...)</code>, bo <code>AND</code> ma wyższy priorytet!</li>' +
      '<li><strong><code>ORDER BY</code> (sortowanie):</strong> układa wynik rosnąco (<code>ASC</code> – domyślnie) lub malejąco (<code>DESC</code>). Możesz sortować po kilku kolumnach po przecinku.</li>' +
      '</ul>' +
      '<div class="theory-code"><code>SELECT title, length FROM film WHERE (rating = \'G\' OR rating = \'PG\') AND length &gt; 100 ORDER BY rating ASC, length DESC;</code></div>',
    variants: [
      { prompt: 'Z tabeli `film` wybierz `title` oraz `rental_rate` dla filmów o ratingu `\'PG-13\'` i cenie `rental_rate = 4.99`. Posortuj alfabetycznie po `title`.', sol: "SELECT title, rental_rate FROM film WHERE rating = 'PG-13' AND rental_rate = 4.99 ORDER BY title;", order: true, tables: ['film'], hint: 'Połącz oba warunki operatorem AND w klauzuli WHERE, a na końcu dodaj ORDER BY title.' },
      { prompt: 'Z tabeli `film` wybierz `title` oraz `length` dla filmów o ratingu `\'R\'`, które trwają krócej niż `80` minut (`length < 80`). Posortuj rosnąco po `length`.', sol: "SELECT title, length FROM film WHERE rating = 'R' AND length < 80 ORDER BY length ASC;", order: true, tables: ['film'], hint: 'Użyj WHERE rating = \'R\' AND length < 80 oraz ORDER BY length ASC.' },
      { prompt: 'Z tabeli `payment` wybierz `payment_id`, `customer_id` oraz `amount` dla płatności powyżej `5.00` (`amount > 5.00`) obsłużonych przez pracownika `staff_id = 2`. Posortuj malejąco po `amount`.', sol: "SELECT payment_id, customer_id, amount FROM payment WHERE amount > 5.00 AND staff_id = 2 ORDER BY amount DESC;", order: true, tables: ['payment'], hint: 'Sortowanie malejące zapiszesz jako ORDER BY amount DESC.' },
      { prompt: 'Z tabeli `customer` wybierz `customer_id`, `first_name` oraz `email` dla aktywnych klientów (`active = 1`) przypisanych do sklepu `store_id = 2`. Posortuj po `customer_id`.', sol: "SELECT customer_id, first_name, email FROM customer WHERE active = 1 AND store_id = 2 ORDER BY customer_id;", order: true, tables: ['customer'], hint: 'W WHERE połącz warunki active = 1 AND store_id = 2.' },
      { prompt: 'Z tabeli `rental` wybierz `rental_id`, `customer_id` oraz `rental_date` dla wypożyczeń obsłużonych przez pracownika `staff_id = 1` w czerwcu (`rental_date >= \'2026-06-01\'`). Posortuj po `rental_id`.', sol: "SELECT rental_id, customer_id, rental_date FROM rental WHERE staff_id = 1 AND rental_date >= '2026-06-01' ORDER BY rental_id;", order: true, tables: ['rental'], hint: 'Datę zapisz w apostrofach: rental_date >= \'2026-06-01\'.' },
      { prompt: 'Z tabeli `film` wybierz `title`, `rating` oraz `length` dla filmów o ratingu `\'G\'` LUB `\'PG\'`, które jednocześnie trwają dłużej niż `100` minut (`length > 100`). Posortuj rosnąco po `rating`, a przy remisie malejąco po `length`.', sol: "SELECT title, rating, length FROM film WHERE (rating = 'G' OR rating = 'PG') AND length > 100 ORDER BY rating ASC, length DESC;", order: true, tables: ['film'], hint: 'Weź warunki OR w nawias: (rating = \'G\' OR rating = \'PG\') AND length > 100.' },
      { prompt: 'Z tabeli `payment` wybierz `payment_id`, `customer_id` oraz `amount` dla płatności obsłużonych przez `staff_id = 1`, których kwota mieści się od `2.99` do `4.99` włącznie (`BETWEEN`). Posortuj malejąco po `amount`, a przy remisie rosnąco po `payment_id`.', sol: "SELECT payment_id, customer_id, amount FROM payment WHERE amount BETWEEN 2.99 AND 4.99 AND staff_id = 1 ORDER BY amount DESC, payment_id ASC;", order: true, tables: ['payment'], hint: 'Użyj amount BETWEEN 2.99 AND 4.99 AND staff_id = 1 oraz dwukolumnowego ORDER BY.' },
      { prompt: 'Z tabeli `customer` wybierz `first_name`, `last_name` oraz `store_id` aktywnych klientów (`active = 1`), których nazwisko zawiera fragment `\'son\'` (`ILIKE \'%son%\'`) LUB imię zaczyna się na `\'M\'` (`ILIKE \'M%\'`). Posortuj rosnąco po `store_id`, a następnie po `last_name`.', sol: "SELECT first_name, last_name, store_id FROM customer WHERE active = 1 AND (last_name ILIKE '%son%' OR first_name ILIKE 'M%') ORDER BY store_id ASC, last_name ASC;", order: true, tables: ['customer'], hint: 'Pamiętaj o nawiasie wokół alternatywy OR z operatorami ILIKE.' },
      { prompt: 'Z tabeli `film` wybierz `title`, `rating`, `rental_rate` i `length` dla filmów o ratingu z listy `(\'PG\', \'PG-13\', \'R\')`, cenie z listy `(2.99, 4.99)` i długości od `60` do `160` minut. Posortuj malejąco po `rental_rate`, rosnąco po `length` i ogranicz wynik do `3` wierszy (`LIMIT 3`).', sol: "SELECT title, rating, rental_rate, length FROM film WHERE rating IN ('PG', 'PG-13', 'R') AND rental_rate IN (2.99, 4.99) AND length BETWEEN 60 AND 160 ORDER BY rental_rate DESC, length ASC LIMIT 3;", order: true, tables: ['film'], hint: 'Połącz IN, IN oraz BETWEEN przez AND, a na końcu dodaj ORDER BY rental_rate DESC, length ASC LIMIT 3.' },
      { prompt: 'Wyzwanie: z tabeli `rental` wypisz unikalne pary `customer_id`, `staff_id` (`SELECT DISTINCT`) dla wypożyczeń, które: (a) pochodzą z maja (`rental_date BETWEEN \'2026-05-01\' AND \'2026-05-31\'`) i zostały zwrócone (`return_date IS NOT NULL`), LUB (b) zostały obsłużone przez `staff_id = 2` w czerwcu (`rental_date >= \'2026-06-01\'`). Posortuj rosnąco po `customer_id`, malejąco po `staff_id` i pokaż `5` wierszy.', sol: "SELECT DISTINCT customer_id, staff_id FROM rental WHERE (rental_date BETWEEN '2026-05-01' AND '2026-05-31' AND return_date IS NOT NULL) OR (staff_id = 2 AND rental_date >= '2026-06-01') ORDER BY customer_id ASC, staff_id DESC LIMIT 5;", order: true, tables: ['rental'], hint: 'Zapisz dwa warunki złożone w nawiasach połączone OR, użyj SELECT DISTINCT i zakończ LIMIT 5.' }
    ]
  },
  {
    id: 'p1_2', stage: 1, title: '1.2 Zakresy IN, BETWEEN, ILIKE oraz LIMIT',
    tables: ['film', 'customer', 'actor', 'payment'],
    cols: ['title', 'rating', 'length', 'replacement_cost', 'film', 'customer', 'actor', 'first_name', 'last_name', 'BETWEEN', 'IN', 'ILIKE', 'LIMIT'],
    theory: '<ul>' +
      '<li><strong><code>IN (a, b, c)</code>:</strong> zwięzły zapis sprawdzający, czy wartość należy do podanej listy (zastępuje długie łańcuchy <code>OR</code>).</li>' +
      '<li><strong><code>BETWEEN x AND y</code>:</strong> filtruje przedział domknięty (obejmuje zarówno wartość początkową <code>x</code>, jak i końcową <code>y</code>). Działa na liczbach i datach.</li>' +
      '<li><strong><code>ILIKE</code> i <code>LIKE</code>:</strong> wyszukują wzorce tekstowe (<code>%</code> zastępuje dowolny ciąg znaków, <code>_</code> jeden znak). <code>ILIKE</code> w PostgreSQL ignoruje wielkość liter!</li>' +
      '<li><strong><code>LIMIT n</code>:</strong> obcina wynik do pierwszych <code>n</code> wierszy. <em>Pułapka:</em> zawsze używaj <code>LIMIT</code> w parze z <code>ORDER BY</code>, inaczej dostaniesz przypadkowe wiersze.</li>' +
      '</ul>' +
      '<div class="theory-code"><code>SELECT title, length FROM film WHERE rating IN (\'G\', \'PG\') AND length BETWEEN 100 AND 140 AND title ILIKE \'a%\' ORDER BY length DESC LIMIT 4;</code></div>',
    variants: [
      { prompt: 'Z tabeli `film` wypisz `title`, `rating` oraz `length` dla filmów o ratingu `\'G\'` lub `\'PG\'`, których długość (`length`) mieści się w przedziale od `100` do `140` minut. Posortuj malejąco po `length` i ogranicz wynik do `4` wierszy.', sol: "SELECT title, rating, length FROM film WHERE rating IN ('G', 'PG') AND length BETWEEN 100 AND 140 ORDER BY length DESC LIMIT 4;", order: true, tables: ['film'], hint: 'Połącz rating IN (\'G\', \'PG\') oraz length BETWEEN 100 AND 140, a na końcu dodaj ORDER BY length DESC LIMIT 4.' },
      { prompt: 'Z tabeli `film` wypisz `title` i `replacement_cost` dla filmów o ratingu `\'NC-17\'`, których koszt odtworzenia (`replacement_cost`) jest między `18.00` a `25.00`. Posortuj rosnąco po `title`.', sol: "SELECT title, replacement_cost FROM film WHERE rating = 'NC-17' AND replacement_cost BETWEEN 18.00 AND 25.00 ORDER BY title ASC;", order: true, tables: ['film'], hint: 'Użyj operatora BETWEEN 18.00 AND 25.00 dla kolumny replacement_cost.' },
      { prompt: 'Z tabeli `actor` wybierz `actor_id`, `first_name` i `last_name` dla aktorów, których imię zaczyna się na literę `\'J\'` lub `\'P\'` (użyj `ILIKE` lub `LIKE`). Posortuj po `actor_id`.', sol: "SELECT actor_id, first_name, last_name FROM actor WHERE first_name ILIKE 'J%' OR first_name ILIKE 'P%' ORDER BY actor_id;", order: true, tables: ['actor'], hint: 'Wzorzec \'J%\' oznacza tekst zaczynający się od litery J.' },
      { prompt: 'Z tabeli `payment` wybierz 3 najwyższe płatności (`payment_id`, `amount`) dokonane w maju 2026 (`payment_date BETWEEN \'2026-05-01\' AND \'2026-05-31\'`). W razie remisu kwoty sortuj rosnąco po `payment_id`.', sol: "SELECT payment_id, amount FROM payment WHERE payment_date BETWEEN '2026-05-01' AND '2026-05-31' ORDER BY amount DESC, payment_id ASC LIMIT 3;", order: true, tables: ['payment'], hint: 'Po filtrze BETWEEN posortuj ORDER BY amount DESC, payment_id ASC i dodaj LIMIT 3.' },
      { prompt: 'Z tabeli `customer` wybierz `customer_id`, `first_name`, `last_name` dla klientów o identyfikatorach z listy `(1, 3, 5, 7, 9)`. Posortuj alfabetycznie po `first_name`.', sol: "SELECT customer_id, first_name, last_name FROM customer WHERE customer_id IN (1, 3, 5, 7, 9) ORDER BY first_name ASC;", order: true, tables: ['customer'], hint: 'Skorzystaj z customer_id IN (1, 3, 5, 7, 9).' },
      { prompt: 'Z tabeli `film` wypisz `title`, `rating` i `replacement_cost` dla filmów o ratingu `\'PG\'` lub `\'PG-13\'`, których tytuł zaczyna się od `\'AL\'` (`ILIKE \'AL%\'`), a koszt odtworzenia mieści się między `20` a `28`. Posortuj malejąco po `replacement_cost`, a przy remisie alfabetycznie po `title`.', sol: "SELECT title, rating, replacement_cost FROM film WHERE rating IN ('PG', 'PG-13') AND title ILIKE 'AL%' AND replacement_cost BETWEEN 20 AND 28 ORDER BY replacement_cost DESC, title ASC;", order: true, tables: ['film'], hint: 'Połącz w WHERE trzy warunki przez AND: IN, ILIKE oraz BETWEEN.' },
      { prompt: 'Z tabeli `customer` wybierz `customer_id`, `first_name` i `email` aktywnych klientów (`active = 1`) o `customer_id` od `3` do `9`, których imię NIE zaczyna się na literę `\'M\'` (`NOT ILIKE \'M%\'`). Posortuj alfabetycznie po `first_name` i pokaż `3` pierwsze wiersze.', sol: "SELECT customer_id, first_name, email FROM customer WHERE active = 1 AND customer_id BETWEEN 3 AND 9 AND first_name NOT ILIKE 'M%' ORDER BY first_name ASC LIMIT 3;", order: true, tables: ['customer'], hint: 'Zaprzeczenie wzorca tekstowego zapiszesz jako first_name NOT ILIKE \'M%\'.' },
      { prompt: 'Z tabeli `payment` wybierz `payment_id`, `customer_id`, `amount` i `payment_date` dla klientów z listy `(1, 3, 4)`, płatności z okresu od `\'2026-05-01\'` do `\'2026-06-05\'` o kwocie co najmniej `2.99`. Posortuj rosnąco po `customer_id`, a w ramach klienta malejąco po `amount`.', sol: "SELECT payment_id, customer_id, amount, payment_date FROM payment WHERE customer_id IN (1, 3, 4) AND payment_date BETWEEN '2026-05-01' AND '2026-06-05' AND amount >= 2.99 ORDER BY customer_id ASC, amount DESC;", order: true, tables: ['payment'], hint: 'Zastosuj IN dla klientów, BETWEEN dla daty oraz >= dla kwoty.' },
      { prompt: 'Z tabeli `actor` wybierz `actor_id`, `first_name` i `last_name` aktorów o `actor_id` od `2` do `8`, których nazwisko zawiera `\'son\'` LUB kończy się na `\'is\'` (`ILIKE`). Posortuj malejąco po `last_name` i pokaż `2` pierwsze wiersze.', sol: "SELECT actor_id, first_name, last_name FROM actor WHERE actor_id BETWEEN 2 AND 8 AND (last_name ILIKE '%son%' OR last_name ILIKE '%is') ORDER BY last_name DESC LIMIT 2;", order: true, tables: ['actor'], hint: 'Wzorzec końcówki słowa to \'%is\'. Pamiętaj o nawiasach wokół OR.' },
      { prompt: 'Wyzwanie: z tabeli `film` wypisz unikalne kombinacje `rating` i `rental_rate` (`SELECT DISTINCT`) dla filmów trwających od `50` do `130` minut, o ratingu z listy `(\'G\', \'PG\', \'NC-17\')`, których tytuł NIE zaczyna się od `\'AL\'`. Posortuj rosnąco po `rating`, malejąco po `rental_rate` i ogranicz wynik do `3` wierszy.', sol: "SELECT DISTINCT rating, rental_rate FROM film WHERE length BETWEEN 50 AND 130 AND rating IN ('G', 'PG', 'NC-17') AND title NOT ILIKE 'AL%' ORDER BY rating ASC, rental_rate DESC LIMIT 3;", order: true, tables: ['film'], hint: 'Połącz SELECT DISTINCT z warunkami BETWEEN, IN i NOT ILIKE, a na końcu dodaj ORDER BY i LIMIT 3.' }
    ]
  },
  {
    id: 'p1_3', stage: 1, title: '1.3 Unikalne wartości (DISTINCT) i wyliczenia arytmetyczne',
    tables: ['film', 'rental', 'payment'],
    cols: ['DISTINCT', 'film', 'rental', 'payment', 'rating', 'rental_rate', 'replacement_cost', 'customer_id'],
    theory: '<ul>' +
      '<li><strong><code>SELECT DISTINCT</code>:</strong> usuwa duplikaty z tabeli wynikowej. Gdy podasz kilka kolumn (np. <code>SELECT DISTINCT rating, rental_rate</code>), SQL zostawi unikalne kombinacje całej pary.</li>' +
      '<li><strong>Wyliczenia i aliasy (<code>AS</code>):</strong> w <code>SELECT</code> możesz wykonywać działania (<code>+</code>, <code>-</code>, <code>*</code>, <code>/</code>, <code>%</code>) i nadawać im nazwy przez <code>AS nazwa</code>.</li>' +
      '<li><strong>Pułapka dzielenia całkowitego:</strong> w SQL dzielenie dwóch liczb całkowitych obcina część ułamkową (<code>90 / 60</code> da <code>1</code>). Dziel przez liczbę z kropką (<code>length / 60.0</code>), aby uzyskać dokładny ułamek!</li>' +
      '<li><strong>Kolejność działania SQL:</strong> aliasu zdefiniowanego w <code>SELECT</code> możesz użyć w <code>ORDER BY</code>, ale <em>nie</em> w <code>WHERE</code> (bo <code>WHERE</code> wykonuje się przed <code>SELECT</code>).</li>' +
      '</ul>' +
      '<div class="theory-code"><code>SELECT DISTINCT rating, rental_rate FROM film ORDER BY rating;\nSELECT title, length / 60.0 AS hours FROM film ORDER BY hours DESC LIMIT 5;</code></div>',
    variants: [
      { prompt: 'Z tabeli `film` wypisz unikalne kombinacje `rating` oraz `rental_rate` (użyj `DISTINCT`). Posortuj rosnąco po `rating` i `rental_rate`.', sol: "SELECT DISTINCT rating, rental_rate FROM film ORDER BY rating ASC, rental_rate ASC;", order: true, tables: ['film'], hint: 'Użyj SELECT DISTINCT rating, rental_rate FROM film i posortuj po obu kolumnach.' },
      { prompt: 'Z tabeli `film` wybierz `title`, `rental_rate`, `replacement_cost` oraz stosunek kosztu odtworzenia do ceny wypożyczenia (`replacement_cost / rental_rate`) dla filmów o ratingu `\'G\'`. Posortuj po `title`.', sol: "SELECT title, rental_rate, replacement_cost, replacement_cost / rental_rate AS ratio FROM film WHERE rating = 'G' ORDER BY title;", order: true, tables: ['film'], hint: 'Obie kolumny są typu NUMERIC, więc dzielenie replacement_cost / rental_rate zwróci dokładny ułamek.' },
      { prompt: 'Z tabeli `rental` wypisz unikalne identyfikatory klientów (`DISTINCT customer_id`), którzy wypożyczyli film w czerwcu 2026 (`rental_date >= \'2026-06-01\'`). Posortuj rosnąco.', sol: "SELECT DISTINCT customer_id FROM rental WHERE rental_date >= '2026-06-01' ORDER BY customer_id ASC;", order: true, tables: ['rental'], hint: 'SELECT DISTINCT customer_id usunie powtórzenia klientów z wieloma wypożyczeniami.' },
      { prompt: 'Z tabeli `film` wybierz `title` oraz czas trwania przeliczony na godziny zmiennoprzecinkowe (`length / 60.0`) dla 5 najdłuższych filmów.', sol: "SELECT title, length / 60.0 AS hours FROM film ORDER BY length DESC LIMIT 5;", order: true, tables: ['film'], hint: 'Pamiętaj o kropce w 60.0, aby uniknąć dzielenia całkowitego.' },
      { prompt: 'Z tabeli `payment` wypisz unikalne kwoty płatności (`DISTINCT amount`) występujące w bazie, posortowane malejąco.', sol: "SELECT DISTINCT amount FROM payment ORDER BY amount DESC;", order: true, tables: ['payment'], hint: 'Użyj SELECT DISTINCT amount FROM payment ORDER BY amount DESC.' },
      { prompt: 'Z tabeli `film` wypisz unikalne wartości `rating` (`DISTINCT`) dla filmów kosztujących `0.99` lub `4.99` (`IN`), których długość mieści się między `60` a `120` minut. Posortuj malejąco po `rating`.', sol: "SELECT DISTINCT rating FROM film WHERE rental_rate IN (0.99, 4.99) AND length BETWEEN 60 AND 120 ORDER BY rating DESC;", order: true, tables: ['film'], hint: 'Połącz SELECT DISTINCT rating z warunkami IN oraz BETWEEN w WHERE.' },
      { prompt: 'Z tabeli `film` wybierz `title`, `rental_rate` oraz cenę brutto z 23% VAT (`rental_rate * 1.23 AS price_gross`) dla filmów o ratingu `\'PG-13\'` lub `\'R\'` i cenie wyższej niż `1.00`. Posortuj malejąco po `price_gross`, a przy remisie alfabetycznie po `title`.', sol: "SELECT title, rental_rate, rental_rate * 1.23 AS price_gross FROM film WHERE rating IN ('PG-13', 'R') AND rental_rate > 1.00 ORDER BY price_gross DESC, title ASC;", order: true, tables: ['film'], hint: 'W ORDER BY możesz użyć aliasu price_gross, a w WHERE filtruj po rental_rate > 1.00.' },
      { prompt: 'Z tabeli `payment` wypisz unikalne pary `customer_id`, `staff_id` (`SELECT DISTINCT`) dla płatności o kwocie od `2.99` do `5.99`. Posortuj rosnąco po `customer_id`, potem po `staff_id` i pokaż `5` pierwszych wierszy.', sol: "SELECT DISTINCT customer_id, staff_id FROM payment WHERE amount BETWEEN 2.99 AND 5.99 ORDER BY customer_id ASC, staff_id ASC LIMIT 5;", order: true, tables: ['payment'], hint: 'Użyj SELECT DISTINCT customer_id, staff_id z filtrem BETWEEN i LIMIT 5.' },
      { prompt: 'Z tabeli `film` wybierz `title`, `length`, liczbę pełnych godzin (`length / 60 AS full_hours` – dzielenie całkowite) oraz pozostałe minuty (`length % 60 AS rest_min`) dla filmów trwających co najmniej `120` minut, z wyjątkiem ratingu `\'NC-17\'` (`<>`). Posortuj malejąco po `length`.', sol: "SELECT title, length, length / 60 AS full_hours, length % 60 AS rest_min FROM film WHERE length >= 120 AND rating <> 'NC-17' ORDER BY length DESC;", order: true, tables: ['film'], hint: 'Dzielenie przez 60 (bez kropki) daje pełne godziny, a operator % zwraca resztę z dzielenia.' },
      { prompt: 'Wyzwanie: z tabeli `rental` wypisz unikalne pary `film_id` oraz liczby dni wypożyczenia (`return_date - rental_date AS days`) dla wypożyczeń trwających co najmniej `4` dni. Posortuj malejąco po `days`, rosnąco po `film_id` i pokaż `5` pierwszych wierszy.', sol: "SELECT DISTINCT film_id, return_date - rental_date AS days FROM rental WHERE return_date - rental_date >= 4 ORDER BY days DESC, film_id ASC LIMIT 5;", order: true, tables: ['rental'], hint: 'W WHERE powtórz wyrażenie return_date - rental_date >= 4 (wiersze z NULL w return_date zostaną automatycznie pominięte).' }
    ]
  },
  {
    id: 'p2_1', stage: 2, title: '2.1 COUNT(*) vs COUNT(kolumna) vs COUNT(DISTINCT) – Pułapka NULL',
    tables: ['rental', 'film', 'customer', 'payment'],
    cols: ['COUNT(*)', 'COUNT(return_date)', 'COUNT(DISTINCT', 'rental', 'return_date', 'customer_id', 'film'],
    gapId: 'g3',
    theory: '<ul>' +
      '<li><strong><code>COUNT(*)</code> vs <code>COUNT(kolumna)</code>:</strong> <code>COUNT(*)</code> liczy wszystkie wiersze w grupie (nawet te z pustymi polami), natomiast <code>COUNT(kolumna)</code> liczy wyłącznie wiersze, w których podana kolumna <em>nie jest</em> <code>NULL</code>.</li>' +
      '<li><strong><code>COUNT(DISTINCT kolumna)</code>:</strong> zlicza, ile <em>różnych</em> (unikalnych) niepustych wartości występuje w danej kolumnie (np. ilu unikalnych klientów dokonało wypożyczenia).</li>' +
      '<li><strong>Pułapka <code>NULL</code>:</strong> brak wartości (<code>NULL</code>) w SQL sprawdzasz wyłącznie przez <code>IS NULL</code> oraz <code>IS NOT NULL</code>. Zapis <code>= NULL</code> nigdy nie zwróci wierszy!</li>' +
      '<li><strong>Różnica jako licznik braków:</strong> wyrażenie <code>COUNT(*) - COUNT(return_date)</code> elegancko wylicza liczbę niezwróconych filmów (wierszy z <code>return_date IS NULL</code>).</li>' +
      '</ul>' +
      '<div class="theory-code"><code>SELECT staff_id, COUNT(*) AS all_cnt, COUNT(return_date) AS returned_cnt, COUNT(DISTINCT customer_id) AS uniq_cust FROM rental GROUP BY staff_id;</code></div>',
    variants: [
      { prompt: 'W tabeli `rental` część filmów nie ma daty zwrotu (`return_date` jest `NULL`). Zwróć w jednym wierszu 3 kolumny: liczbę wszystkich wypożyczeń (`COUNT(*)`), liczbę zwróconych (`COUNT(return_date)`) oraz niezwróconych (`COUNT(*) - COUNT(return_date)`).', sol: "SELECT COUNT(*) AS all_rentals, COUNT(return_date) AS returned_rentals, COUNT(*) - COUNT(return_date) AS unreturned FROM rental;", order: false, tables: ['rental'], hint: 'COUNT(return_date) pomija wartości NULL, więc różnica COUNT(*) - COUNT(return_date) daje liczbę niezwróconych filmów.' },
      { prompt: 'Dla każdego pracownika (`staff_id`) w tabeli `rental` policz: łączną liczbę wypożyczeń (`COUNT(*)`) oraz liczbę wypożyczeń już zwróconych (`COUNT(return_date)`).', sol: "SELECT staff_id, COUNT(*) AS total_cnt, COUNT(return_date) AS returned_cnt FROM rental GROUP BY staff_id;", order: false, tables: ['rental'], hint: 'Pogrupuj wiersze klauzulą GROUP BY staff_id.' },
      { prompt: 'Z tabeli `rental` zwróć w jednym wierszu: liczbę wszystkich wypożyczeń (`COUNT(*)`), liczbę unikalnych klientów mających wypożyczenia (`COUNT(DISTINCT customer_id)`) oraz liczbę unikalnych wypożyczonych filmów (`COUNT(DISTINCT film_id)`).', sol: "SELECT COUNT(*) AS total_rows, COUNT(DISTINCT customer_id) AS uniq_customers, COUNT(DISTINCT film_id) AS uniq_films FROM rental;", order: false, tables: ['rental'], hint: 'Słowo DISTINCT umieść wewnątrz nawiasu funkcji COUNT: COUNT(DISTINCT customer_id).' },
      { prompt: 'Z tabeli `film` policz dla każdego `rating`: liczbę filmów (`COUNT(*)`) oraz liczbę unikalnych stawek cenowych (`COUNT(DISTINCT rental_rate)`).', sol: "SELECT rating, COUNT(*) AS films_cnt, COUNT(DISTINCT rental_rate) AS rates_cnt FROM film GROUP BY rating;", order: false, tables: ['film'], hint: 'Użyj GROUP BY rating oraz COUNT(DISTINCT rental_rate).' },
      { prompt: 'Z tabeli `rental` policz wyłącznie te wiersze, w których film NIE został jeszcze zwrócony (`return_date IS NULL`). Zwróć jedną liczbę.', sol: "SELECT COUNT(*) AS unreturned_cnt FROM rental WHERE return_date IS NULL;", order: false, tables: ['rental'], hint: 'Przefiltruj wiersze przez WHERE return_date IS NULL.' },
      { prompt: 'Z tabeli `rental` dla wypożyczeń z maja (`rental_date < \'2026-06-01\'`) policz dla każdego klienta (`customer_id`): liczbę wszystkich wypożyczeń (`COUNT(*)`) oraz liczbę zwróconych (`COUNT(return_date)`). Posortuj rosnąco po `customer_id`.', sol: "SELECT customer_id, COUNT(*) AS all_cnt, COUNT(return_date) AS returned_cnt FROM rental WHERE rental_date < '2026-06-01' GROUP BY customer_id ORDER BY customer_id;", order: true, tables: ['rental'], hint: 'Najpierw WHERE rental_date < \'2026-06-01\', potem GROUP BY customer_id i na końcu ORDER BY.' },
      { prompt: 'Dla każdego pracownika (`staff_id`) w tabeli `rental` zwróć: liczbę wypożyczeń (`COUNT(*)`), liczbę różnych obsłużonych klientów (`COUNT(DISTINCT customer_id)`) oraz liczbę niezwróconych filmów (`COUNT(*) - COUNT(return_date)`). Posortuj po `staff_id`.', sol: "SELECT staff_id, COUNT(*) AS total_cnt, COUNT(DISTINCT customer_id) AS uniq_customers, COUNT(*) - COUNT(return_date) AS unreturned FROM rental GROUP BY staff_id ORDER BY staff_id;", order: true, tables: ['rental'], hint: 'Połącz wszystkie trzy warianty liczenia COUNT w jednym zapytaniu z GROUP BY staff_id.' },
      { prompt: 'Z tabeli `payment` weź płatności poniżej `5.00` (`amount < 5.00`) i dla każdego klienta (`customer_id`) policz ich liczbę (`COUNT(*)`). Zostaw tylko klientów mających co najmniej `2` takie płatności (`HAVING COUNT(*) >= 2`). Posortuj malejąco po liczbie płatności, a przy remisie rosnąco po `customer_id`.', sol: "SELECT customer_id, COUNT(*) AS small_cnt FROM payment WHERE amount < 5.00 GROUP BY customer_id HAVING COUNT(*) >= 2 ORDER BY small_cnt DESC, customer_id ASC;", order: true, tables: ['payment'], hint: 'Warunek na pojedynczą kwotę (amount < 5.00) idzie do WHERE, a na liczbę wierszy w grupie – do HAVING.' },
      { prompt: 'Z tabeli `film` dla filmów dłuższych niż `60` minut policz dla każdego `rating`: liczbę filmów (`COUNT(*)`) oraz liczbę różnych cen (`COUNT(DISTINCT rental_rate)`). Zostaw tylko grupy mające co najmniej `3` różne ceny. Posortuj malejąco po liczbie filmów, potem rosnąco po `rating`.', sol: "SELECT rating, COUNT(*) AS films_cnt, COUNT(DISTINCT rental_rate) AS price_levels FROM film WHERE length > 60 GROUP BY rating HAVING COUNT(DISTINCT rental_rate) >= 3 ORDER BY films_cnt DESC, rating ASC;", order: true, tables: ['film'], hint: 'W klauzuli HAVING użyj HAVING COUNT(DISTINCT rental_rate) >= 3.' },
      { prompt: 'Wyzwanie: z tabeli `rental` dla wypożyczeń od `\'2026-05-02\'` włącznie policz dla każdego klienta (`customer_id`): liczbę wypożyczeń (`rentals`), liczbę niezwróconych (`COUNT(*) - COUNT(return_date)`) oraz liczbę różnych pracowników, którzy go obsłużyli (`COUNT(DISTINCT staff_id)`). Zostaw klientów z co najmniej `2` wypożyczeniami, posortuj malejąco po `rentals`, rosnąco po `customer_id` i pokaż `3` wiersze.', sol: "SELECT customer_id, COUNT(*) AS rentals, COUNT(*) - COUNT(return_date) AS unreturned, COUNT(DISTINCT staff_id) AS staff_cnt FROM rental WHERE rental_date >= '2026-05-02' GROUP BY customer_id HAVING COUNT(*) >= 2 ORDER BY rentals DESC, customer_id ASC LIMIT 3;", order: true, tables: ['rental'], hint: 'Zachowaj pełną kolejność: SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY → LIMIT.' }
    ]
  },
  {
    id: 'p2_2', stage: 2, title: '2.2 GROUP BY i filtrowanie po agregacji przez HAVING',
    tables: ['payment', 'film', 'rental', 'film_actor'],
    cols: ['GROUP BY', 'HAVING', 'SUM(amount)', 'AVG(length)', 'COUNT(*)', 'payment', 'film', 'rental', 'customer_id', 'rating'],
    gapId: 'g7',
    theory: '<ul>' +
      '<li><strong><code>GROUP BY</code> (wrzucanie do koszyków):</strong> zbiera wiersze o tej samej wartości (np. tego samego <code>customer_id</code>) w jeden wiersz podsumowania, dla którego liczysz <code>SUM</code>, <code>AVG</code>, <code>MIN</code>, <code>MAX</code> lub <code>COUNT</code>.</li>' +
      '<li><strong>Złota zasada <code>GROUP BY</code>:</strong> każda kolumna wypisana w <code>SELECT</code>, która nie jest wewnątrz funkcji agregującej, musi znaleźć się w <code>GROUP BY</code>.</li>' +
      '<li><strong><code>WHERE</code> vs <code>HAVING</code> (klasyczna pułapka!):</strong> <code>WHERE</code> działa <em>przed</em> grupowaniem i filtruje pojedyncze wiersze (nie wolno w nim pisać <code>SUM</code> ani <code>COUNT</code>). <code>HAVING</code> działa <em>po</em> zgrupowaniu i filtruje całe koszyki (np. <code>HAVING SUM(amount) &gt; 10</code>).</li>' +
      '</ul>' +
      '<div class="theory-code"><code>SELECT customer_id, SUM(amount) AS total_paid FROM payment WHERE amount &gt;= 2.99 GROUP BY customer_id HAVING SUM(amount) &gt; 10.00 ORDER BY total_paid DESC;</code></div>',
    variants: [
      { prompt: 'Z tabeli `payment` znajdź klientów (`customer_id`), których łączna suma płatności (`SUM(amount)`) przekracza `10.00`. Zwróć `customer_id` oraz `total_paid`, posortowane malejąco po sumie.', sol: "SELECT customer_id, SUM(amount) AS total_paid FROM payment GROUP BY customer_id HAVING SUM(amount) > 10.00 ORDER BY total_paid DESC;", order: true, tables: ['payment'], hint: 'Filtr po funkcji agregującej umieść w klauzuli HAVING SUM(amount) > 10.00.' },
      { prompt: 'Z tabeli `film` policz liczbę filmów (`COUNT(*)`) oraz średnią długość (`AVG(length)`) dla każdego `rating`, zostawiając tylko te grupy `rating`, które mają co najmniej `5` filmów.', sol: "SELECT rating, COUNT(*) AS films_cnt, AVG(length) AS avg_len FROM film GROUP BY rating HAVING COUNT(*) >= 5;", order: false, tables: ['film'], hint: 'Grupuj po rating i przefiltruj grupy przez HAVING COUNT(*) >= 5.' },
      { prompt: 'Z tabeli `rental` znajdź klientów (`customer_id`), którzy wypożyczyli co najmniej `3` filmy (`COUNT(*) >= 3`). Zwróć `customer_id` i liczbę wypożyczeń.', sol: "SELECT customer_id, COUNT(*) AS rental_cnt FROM rental GROUP BY customer_id HAVING COUNT(*) >= 3;", order: false, tables: ['rental'], hint: 'Użyj GROUP BY customer_id HAVING COUNT(*) >= 3.' },
      { prompt: 'Z tabeli `film_actor` znajdź identyfikatory aktorów (`actor_id`), którzy zagrali w co najmniej `3` filmach. Zwróć `actor_id` oraz liczbę filmów, posortowane malejąco po liczbie filmów.', sol: "SELECT actor_id, COUNT(film_id) AS film_cnt FROM film_actor GROUP BY actor_id HAVING COUNT(film_id) >= 3 ORDER BY film_cnt DESC;", order: true, tables: ['film_actor'], hint: 'Grupuj po actor_id, filtruj przez HAVING COUNT(film_id) >= 3 i posortuj malejąco.' },
      { prompt: 'Z tabeli `film` dla każdej stawki `rental_rate` policz maksymalny koszt odtworzenia (`MAX(replacement_cost)`) oraz średnią długość (`AVG(length)`).', sol: "SELECT rental_rate, MAX(replacement_cost) AS max_cost, AVG(length) AS avg_len FROM film GROUP BY rental_rate;", order: false, tables: ['film'], hint: 'Użyj funkcji MAX(replacement_cost) oraz AVG(length) z GROUP BY rental_rate.' },
      { prompt: 'Z tabeli `payment` dla płatności z maja (`payment_date >= \'2026-05-01\' AND payment_date < \'2026-06-01\'`) policz dla każdego pracownika (`staff_id`): sumę kwot (`SUM(amount)`), liczbę płatności (`COUNT(*)`) i średnią kwotę (`AVG(amount)`). Posortuj malejąco po sumie.', sol: "SELECT staff_id, SUM(amount) AS may_rev, COUNT(*) AS cnt, AVG(amount) AS avg_amount FROM payment WHERE payment_date >= '2026-05-01' AND payment_date < '2026-06-01' GROUP BY staff_id ORDER BY may_rev DESC;", order: true, tables: ['payment'], hint: 'Odfiltruj maj w WHERE przed GROUP BY staff_id.' },
      { prompt: 'Z tabeli `film` odrzuć rating `\'NC-17\'` (`WHERE rating <> \'NC-17\'`) i dla każdej stawki `rental_rate` policz: liczbę filmów (`COUNT(*)`), najkrótszą (`MIN(length)`) i najdłuższą (`MAX(length)`) długość. Zostaw stawki mające co najmniej `5` filmów i posortuj malejąco po `rental_rate`.', sol: "SELECT rental_rate, COUNT(*) AS films_cnt, MIN(length) AS min_len, MAX(length) AS max_len FROM film WHERE rating <> 'NC-17' GROUP BY rental_rate HAVING COUNT(*) >= 5 ORDER BY rental_rate DESC;", order: true, tables: ['film'], hint: 'Połącz WHERE rating <> \'NC-17\' z GROUP BY rental_rate oraz HAVING COUNT(*) >= 5.' },
      { prompt: 'Z tabeli `rental` weź tylko zwrócone wypożyczenia (`return_date IS NOT NULL`) i dla każdego klienta (`customer_id`) policz ich liczbę (`COUNT(*)`) oraz datę pierwszego wypożyczenia (`MIN(rental_date)`). Zostaw klientów z co najmniej `2` zwrotami, posortuj malejąco po liczbie zwrotów i rosnąco po `customer_id`.', sol: "SELECT customer_id, COUNT(*) AS returned_cnt, MIN(rental_date) AS first_rental FROM rental WHERE return_date IS NOT NULL GROUP BY customer_id HAVING COUNT(*) >= 2 ORDER BY returned_cnt DESC, customer_id ASC;", order: true, tables: ['rental'], hint: 'MIN(rental_date) wyznaczy najwcześniejszą datę wypożyczenia klienta.' },
      { prompt: 'Z tabeli `payment` weź płatności o kwocie co najmniej `2.99` i dla każdego klienta (`customer_id`) policz sumę (`SUM(amount) AS total`) oraz liczbę takich płatności (`COUNT(*)`). Zostaw klientów z sumą powyżej `5.00`, posortuj malejąco po `total` i zwróć TOP `3` wiersze.', sol: "SELECT customer_id, SUM(amount) AS total, COUNT(*) AS cnt FROM payment WHERE amount >= 2.99 GROUP BY customer_id HAVING SUM(amount) > 5.00 ORDER BY total DESC LIMIT 3;", order: true, tables: ['payment'], hint: 'WHERE filtruje pojedyncze płatności (>= 2.99), a HAVING sumę po zgrupowaniu (> 5.00).' },
      { prompt: 'Wyzwanie: z tabeli `film` weź filmy o długości od `60` do `180` minut i ratingu z listy `(\'G\', \'PG\', \'PG-13\', \'R\')`. Dla każdego `rating` zwróć: liczbę filmów (`COUNT(*)`), sumę stawek (`SUM(rental_rate) AS rate_sum`) oraz maksymalny koszt odtworzenia (`MAX(replacement_cost)`). Zostaw tylko grupy, w których średnia długość filmu (`AVG(length)`) przekracza `100` minut. Posortuj malejąco po `rate_sum`.', sol: "SELECT rating, COUNT(*) AS films_cnt, SUM(rental_rate) AS rate_sum, MAX(replacement_cost) AS max_cost FROM film WHERE length BETWEEN 60 AND 180 AND rating IN ('G', 'PG', 'PG-13', 'R') GROUP BY rating HAVING AVG(length) > 100 ORDER BY rate_sum DESC;", order: true, tables: ['film'], hint: 'W HAVING możesz użyć funkcji AVG(length) > 100, nawet jeśli nie wyświetlasz jej w SELECT.' }
    ]
  },
  {
    id: 'p3_1', stage: 3, title: '3.1 INNER JOIN: Łączenie 2 i 3 tabel wymiarów i faktów',
    tables: ['category', 'film_category', 'film', 'staff', 'store', 'payment', 'customer', 'actor', 'film_actor', 'rental'],
    cols: ['JOIN', 'ON', 'category', 'film_category', 'film', 'staff', 'store', 'payment', 'customer', 'name', 'amount'],
    theory: '<ul>' +
      '<li><strong><code>JOIN</code> (czyli <code>INNER JOIN</code>):</strong> dokleja do siebie wiersze z dwóch lub więcej tabel na podstawie warunku złączenia <code>ON</code> (najczęściej równości kluczy <code>🔗 *_id</code>).</li>' +
      '<li><strong>Tylko pełne dopasowania:</strong> <code>INNER JOIN</code> zwraca wiersz tylko wtedy, gdy klucz występuje w <em>obu</em> łączonych tabelach (rekordy bez pary są pomijane).</li>' +
      '<li><strong>Tabele łączące (wiele-do-wielu):</strong> aby połączyć np. <code>film</code> z <code>category</code>, przechodzisz przez tabelę pośrednią: <code>film f JOIN film_category fc ON f.film_id = fc.film_id JOIN category c ON fc.category_id = c.category_id</code>.</li>' +
      '<li><strong>Aliasy tabel:</strong> nadawaj tabelom krótkie aliasy (np. <code>customer c</code>, <code>payment p</code>) i poprzedzaj nimi nazwy kolumn (<code>c.customer_id</code>), aby uniknąć błędu niejednoznaczności kolumny.</li>' +
      '</ul>' +
      '<div class="theory-code"><code>SELECT c.name, COUNT(f.film_id) AS cnt FROM category c JOIN film_category fc ON c.category_id = fc.category_id JOIN film f ON fc.film_id = f.film_id GROUP BY c.name;</code></div>',
    variants: [
      { prompt: 'Połącz `category` i `film_category`. Policz, ile filmów należy do każdej kategorii. Zwróć `name` oraz `film_count`, posortowane malejąco po liczbie filmów, a przy remisie alfabetycznie po `name`.', sol: "SELECT c.name, COUNT(fc.film_id) AS film_count FROM category c JOIN film_category fc ON c.category_id = fc.category_id GROUP BY c.name ORDER BY film_count DESC, c.name ASC;", order: true, tables: ['category', 'film_category'], hint: 'Złącz tabele po kluczu category_id i pogrupuj po c.name.' },
      { prompt: 'Połącz `staff`, `store` oraz `payment`. Policz łączny przychód (`SUM(amount)`) zebrany przez każdego pracownika. Zwróć `first_name`, `city` oraz `total_revenue`.', sol: "SELECT s.first_name, st.city, SUM(p.amount) AS total_revenue FROM staff s JOIN store st ON s.store_id = st.store_id JOIN payment p ON p.staff_id = s.staff_id GROUP BY s.first_name, st.city;", order: false, tables: ['staff', 'store', 'payment'], hint: 'Połącz staff ze store po store_id oraz z payment po staff_id.' },
      { prompt: 'Połącz `customer` i `payment`. Dla klientów ze sklepu `store_id = 1` policz łączną kwotę płatności (`SUM(amount)`). Zwróć `first_name`, `last_name` i `total_paid`, posortowane malejąco po kwocie.', sol: "SELECT c.first_name, c.last_name, SUM(p.amount) AS total_paid FROM customer c JOIN payment p ON c.customer_id = p.customer_id WHERE c.store_id = 1 GROUP BY c.customer_id, c.first_name, c.last_name ORDER BY total_paid DESC;", order: true, tables: ['customer', 'payment'], hint: 'Po złączeniu po customer_id dodaj WHERE c.store_id = 1 i GROUP BY klienta.' },
      { prompt: 'Połącz `actor`, `film_actor` oraz `film`. Wypisz tytuły filmów (`title`), w których grała aktorka o nazwisku `\'GUINESS\'` (`last_name = \'GUINESS\'`). Posortuj po `title`.', sol: "SELECT f.title FROM actor a JOIN film_actor fa ON a.actor_id = fa.actor_id JOIN film f ON fa.film_id = f.film_id WHERE a.last_name = 'GUINESS' ORDER BY f.title;", order: true, tables: ['actor', 'film_actor', 'film'], hint: 'Przejdź przez tabelę film_actor łącząc po actor_id oraz film_id.' },
      { prompt: 'Połącz `category`, `film_category` oraz `film`. Oblicz średnią długość filmu (`AVG(length)`) dla każdej kategorii `name`. Posortuj malejąco po średniej długości.', sol: "SELECT c.name, AVG(f.length) AS avg_length FROM category c JOIN film_category fc ON c.category_id = fc.category_id JOIN film f ON fc.film_id = f.film_id GROUP BY c.name ORDER BY avg_length DESC;", order: true, tables: ['category', 'film_category', 'film'], hint: 'Połącz trzy tabele i policz AVG(f.length) z GROUP BY c.name.' },
      { prompt: 'Połącz `customer` i `rental`. Dla aktywnych klientów (`active = 1`) policz liczbę wypożyczeń (`COUNT(r.rental_id) AS rentals`). Zwróć `first_name`, `last_name` i `rentals` tylko dla klientów z co najmniej `2` wypożyczeniami. Posortuj malejąco po `rentals`, a przy remisie po `last_name`.', sol: "SELECT c.first_name, c.last_name, COUNT(r.rental_id) AS rentals FROM customer c JOIN rental r ON r.customer_id = c.customer_id WHERE c.active = 1 GROUP BY c.customer_id, c.first_name, c.last_name HAVING COUNT(r.rental_id) >= 2 ORDER BY rentals DESC, c.last_name ASC;", order: true, tables: ['customer', 'rental'], hint: 'Użyj WHERE c.active = 1 przed GROUP BY oraz HAVING COUNT(r.rental_id) >= 2 po GROUP BY.' },
      { prompt: 'Połącz `category`, `film_category` i `film`. Dla filmów dłuższych niż `60` minut policz w każdej kategorii liczbę filmów (`films`) oraz średnią stawkę (`AVG(f.rental_rate)`). Zostaw kategorie mające co najmniej `2` takie filmy. Posortuj malejąco po `films`, potem alfabetycznie po `name`.', sol: "SELECT c.name, COUNT(*) AS films, AVG(f.rental_rate) AS avg_rate FROM category c JOIN film_category fc ON fc.category_id = c.category_id JOIN film f ON f.film_id = fc.film_id WHERE f.length > 60 GROUP BY c.name HAVING COUNT(*) >= 2 ORDER BY films DESC, c.name ASC;", order: true, tables: ['category', 'film_category', 'film'], hint: 'Filtr długości f.length > 60 umieść w WHERE, a liczebność kategorii w HAVING.' },
      { prompt: 'Połącz `rental`, `film` oraz `customer`. Wypisz wypożyczenia klientów ze sklepu `store_id = 2` dla filmów o ratingu `\'PG\'` lub `\'PG-13\'`: zwróć `title`, `rating`, `first_name` oraz `rental_date`. Posortuj rosnąco po `rental_date`.', sol: "SELECT f.title, f.rating, c.first_name, r.rental_date FROM rental r JOIN film f ON f.film_id = r.film_id JOIN customer c ON c.customer_id = r.customer_id WHERE c.store_id = 2 AND f.rating IN ('PG', 'PG-13') ORDER BY r.rental_date;", order: true, tables: ['rental', 'film', 'customer'], hint: 'Tabela rental łączy się z film po film_id oraz z customer po customer_id.' },
      { prompt: 'Połącz `actor`, `film_actor` i `film`. Dla filmów z ceną `rental_rate >= 2.99` policz dla każdego aktora liczbę filmów (`films_cnt`) i sumę ich czasu trwania (`SUM(f.length) AS total_minutes`). Zwróć `first_name`, `last_name`, `films_cnt`, `total_minutes` dla aktorów z co najmniej `2` takimi filmami. Posortuj malejąco po `total_minutes`.', sol: "SELECT a.first_name, a.last_name, COUNT(*) AS films_cnt, SUM(f.length) AS total_minutes FROM actor a JOIN film_actor fa ON fa.actor_id = a.actor_id JOIN film f ON f.film_id = fa.film_id WHERE f.rental_rate >= 2.99 GROUP BY a.actor_id, a.first_name, a.last_name HAVING COUNT(*) >= 2 ORDER BY total_minutes DESC;", order: true, tables: ['actor', 'film_actor', 'film'], hint: 'Grupuj po a.actor_id, a.first_name, a.last_name i filtruj grupy przez HAVING COUNT(*) >= 2.' },
      { prompt: 'Wyzwanie (4 tabele): połącz `category`, `film_category`, `rental` i `payment`, aby policzyć przychód z wypożyczeń w każdej kategorii. Zwróć `name`, sumę płatności (`SUM(p.amount) AS revenue`) oraz liczbę unikalnych klientów (`COUNT(DISTINCT r.customer_id)`). Zostaw kategorie z przychodem powyżej `10.00` i posortuj malejąco po `revenue`.', sol: "SELECT c.name, SUM(p.amount) AS revenue, COUNT(DISTINCT r.customer_id) AS customers FROM category c JOIN film_category fc ON fc.category_id = c.category_id JOIN rental r ON r.film_id = fc.film_id JOIN payment p ON p.rental_id = r.rental_id GROUP BY c.name HAVING SUM(p.amount) > 10.00 ORDER BY revenue DESC;", order: true, tables: ['category', 'film_category', 'rental', 'payment'], hint: 'Połącz kolejno po kluczach: category_id → film_id → rental_id, a próg 10.00 sprawdź w HAVING.' }
    ]
  },
  {
    id: 'p3_2', stage: 3, title: '3.2 LEFT JOIN i Anti-Join: Szukanie rekordów bez pary',
    tables: ['customer', 'rental', 'actor', 'film_actor', 'film', 'payment', 'category', 'film_category'],
    cols: ['LEFT JOIN', 'IS NULL', 'COALESCE', 'customer', 'rental', 'actor', 'film_actor', 'film'],
    gapId: 'g2',
    theory: '<ul>' +
      '<li><strong><code>LEFT JOIN</code>:</strong> zwraca <em>wszystkie</em> wiersze z lewej tabeli (po <code>FROM</code>), nawet jeśli w prawej tabeli nie ma dla nich dopasowania (wtedy kolumny z prawej tabeli przyjmują wartość <code>NULL</code>).</li>' +
      '<li><strong>Wzorzec Anti-Join (szukanie sierot):</strong> gdy po <code>LEFT JOIN</code> dodasz <code>WHERE prawa.id IS NULL</code>, zostawisz wyłącznie rekordy, które <em>nie mają pary</em> w prawej tabeli (np. klienci bez wypożyczeń).</li>' +
      '<li><strong>Pułapka <code>COUNT(*)</code> przy <code>LEFT JOIN</code>:</strong> aby policzyć dopasowane rekordy (w tym <code>0</code> dla wierszy bez pary), używaj <code>COUNT(prawa.id)</code>, nigdy <code>COUNT(*)</code> (bo <code>COUNT(*)</code> policzy pusty wiersz lewej tabeli jako <code>1</code>!).</li>' +
      '<li><strong>Pułapka warunku w <code>WHERE</code>:</strong> dodatkowy filtr na prawą tabelę (np. miesiąc wypożyczenia) wpisz bezpośrednio do <code>ON</code>, inaczej <code>WHERE</code> odrzuci wiersze z <code>NULL</code> i zamieni <code>LEFT JOIN</code> w zwykły <code>INNER JOIN</code>.</li>' +
      '</ul>' +
      '<div class="theory-code"><code>SELECT c.customer_id, c.first_name, COUNT(r.rental_id) AS cnt FROM customer c LEFT JOIN rental r ON c.customer_id = r.customer_id GROUP BY c.customer_id, c.first_name;</code></div>',
    variants: [
      { prompt: 'Znajdź wszystkich klientów z tabeli `customer`, którzy NIGDY nie wypożyczyli żadnego filmu (brak wpisu w `rental`). Zwróć `customer_id`, `first_name` oraz `last_name`.', sol: "SELECT c.customer_id, c.first_name, c.last_name FROM customer c LEFT JOIN rental r ON c.customer_id = r.customer_id WHERE r.rental_id IS NULL;", order: false, tables: ['customer', 'rental'], hint: 'Zastosuj LEFT JOIN rental r ON ... i odfiltruj brak dopasowania przez WHERE r.rental_id IS NULL.' },
      { prompt: 'Znajdź aktorów z tabeli `actor`, którzy nie zagrali w żadnym filmie w `film_actor`. Zwróć `actor_id`, `first_name` oraz `last_name`.', sol: "SELECT a.actor_id, a.first_name, a.last_name FROM actor a LEFT JOIN film_actor fa ON a.actor_id = fa.actor_id WHERE fa.film_id IS NULL;", order: false, tables: ['actor', 'film_actor'], hint: 'Połącz actor LEFT JOIN film_actor i sprawdź WHERE fa.film_id IS NULL.' },
      { prompt: 'Znajdź filmy z tabeli `film`, które nigdy nie zostały wypożyczone (brak w `rental`). Zwróć `film_id` oraz `title`, posortowane po `film_id`.', sol: "SELECT f.film_id, f.title FROM film f LEFT JOIN rental r ON f.film_id = r.film_id WHERE r.rental_id IS NULL ORDER BY f.film_id;", order: true, tables: ['film', 'rental'], hint: 'Użyj LEFT JOIN rental r ON f.film_id = r.film_id oraz WHERE r.rental_id IS NULL.' },
      { prompt: 'Dla KAŻDEGO aktora z tabeli `actor` (włącznie z tymi bez filmów!) policz liczbę filmów, w których zagrał (`COUNT(fa.film_id)`). Zwróć `actor_id`, `first_name` i `films_cnt`.', sol: "SELECT a.actor_id, a.first_name, COUNT(fa.film_id) AS films_cnt FROM actor a LEFT JOIN film_actor fa ON a.actor_id = fa.actor_id GROUP BY a.actor_id, a.first_name;", order: false, tables: ['actor', 'film_actor'], hint: 'Użyj COUNT(fa.film_id), aby aktor bez filmów otrzymał wynik 0.' },
      { prompt: 'Dla KAŻDEGO klienta z tabeli `customer` ze sklepu `store_id = 2` zwróć `customer_id`, `first_name` oraz sumę jego płatności (użyj `COALESCE(SUM(p.amount), 0)` dla klientów bez płatności).', sol: "SELECT c.customer_id, c.first_name, COALESCE(SUM(p.amount), 0) AS total_paid FROM customer c LEFT JOIN payment p ON c.customer_id = p.customer_id WHERE c.store_id = 2 GROUP BY c.customer_id, c.first_name;", order: false, tables: ['customer', 'payment'], hint: 'COALESCE(SUM(p.amount), 0) zamienia wartość NULL na 0 dla klientów bez płatności.' },
      { prompt: 'Dla każdego AKTYWNEGO klienta (`active = 1`) z tabeli `customer` zwróć `first_name`, liczbę płatności (`COUNT(p.payment_id)`) oraz sumę płatności z zerem dla klientów bez wpłat (`COALESCE(SUM(p.amount), 0) AS total`). Posortuj malejąco po `total`, a przy remisie alfabetycznie po `first_name`.', sol: "SELECT c.first_name, COUNT(p.payment_id) AS payments, COALESCE(SUM(p.amount), 0) AS total FROM customer c LEFT JOIN payment p ON p.customer_id = c.customer_id WHERE c.active = 1 GROUP BY c.customer_id, c.first_name ORDER BY total DESC, c.first_name ASC;", order: true, tables: ['customer', 'payment'], hint: 'Filtr c.active = 1 dotyczy lewej tabeli, więc bezpiecznie umieszczasz go w WHERE.' },
      { prompt: 'Dla KAŻDEJ kategorii z tabeli `category` policz liczbę wypożyczeń jej filmów (`COUNT(r.rental_id) AS rentals` – w tym `0` dla kategorii bez wypożyczeń), łącząc `category` → `film_category` → `rental` przez `LEFT JOIN`. Zwróć `name` i `rentals`, posortowane malejąco po `rentals`, potem alfabetycznie po `name`.', sol: "SELECT c.name, COUNT(r.rental_id) AS rentals FROM category c LEFT JOIN film_category fc ON fc.category_id = c.category_id LEFT JOIN rental r ON r.film_id = fc.film_id GROUP BY c.name ORDER BY rentals DESC, c.name ASC;", order: true, tables: ['category', 'film_category', 'rental'], hint: 'Oba złączenia muszą być LEFT JOIN, a zliczanie wykonaj po kluczu prawej tabeli: COUNT(r.rental_id).' },
      { prompt: 'Znajdź filmy o ratingu z listy `(\'PG-13\', \'NC-17\', \'R\')`, które nigdy nie zostały wypożyczone (brak w `rental`). Zwróć `title`, `rating` oraz `rental_rate`, posortowane po `rating`, a następnie po `title`.', sol: "SELECT f.title, f.rating, f.rental_rate FROM film f LEFT JOIN rental r ON r.film_id = f.film_id WHERE r.rental_id IS NULL AND f.rating IN ('PG-13', 'NC-17', 'R') ORDER BY f.rating, f.title;", order: true, tables: ['film', 'rental'], hint: 'Połącz wzorzec Anti-Join (r.rental_id IS NULL) z filtrem f.rating IN (...) w WHERE.' },
      { prompt: 'Dla KAŻDEGO klienta ze sklepu `store_id = 2` policz liczbę jego wypożyczeń w czerwcu 2026 (`r.rental_date >= \'2026-06-01\'`). Klienci bez czerwcowych wypożyczeń muszą widnieć z wynikiem `0`! Zwróć `customer_id`, `first_name`, `june_cnt`, posortowane malejąco po `june_cnt`, potem rosnąco po `customer_id`.', sol: "SELECT c.customer_id, c.first_name, COUNT(r.rental_id) AS june_cnt FROM customer c LEFT JOIN rental r ON r.customer_id = c.customer_id AND r.rental_date >= '2026-06-01' WHERE c.store_id = 2 GROUP BY c.customer_id, c.first_name ORDER BY june_cnt DESC, c.customer_id ASC;", order: true, tables: ['customer', 'rental'], hint: 'Warunek daty r.rental_date >= \'2026-06-01\' umieść w klauzuli ON, aby nie wyciąć klientów z wynikiem 0.' },
      { prompt: 'Wyzwanie: dla KAŻDEGO aktora (włącznie z aktorem bez filmów) policz liczbę filmów (`COUNT(fa.film_id) AS films_cnt`) oraz łączny czas trwania jego filmów (`COALESCE(SUM(f.length), 0) AS total_minutes`), łącząc `actor` → `film_actor` → `film` przez `LEFT JOIN`. Zostaw aktorów mających mniej niż `3` filmy i posortuj malejąco po `total_minutes`.', sol: "SELECT a.first_name, a.last_name, COUNT(fa.film_id) AS films_cnt, COALESCE(SUM(f.length), 0) AS total_minutes FROM actor a LEFT JOIN film_actor fa ON fa.actor_id = a.actor_id LEFT JOIN film f ON f.film_id = fa.film_id GROUP BY a.actor_id, a.first_name, a.last_name HAVING COUNT(fa.film_id) < 3 ORDER BY total_minutes DESC;", order: true, tables: ['actor', 'film_actor', 'film'], hint: 'Użyj dwóch LEFT JOIN, COALESCE(SUM(f.length), 0) oraz HAVING COUNT(fa.film_id) < 3.' }
    ]
  },
  {
    id: 'p4_1', stage: 4, title: '4.1 CASE WHEN, FILTER (WHERE ...) i dokładne procenty (* 100.0)',
    tables: ['film', 'customer', 'rental', 'payment', 'category', 'film_category', 'staff'],
    cols: ['CASE WHEN', 'THEN', 'ELSE', 'END', 'FILTER (WHERE', '* 100.0', 'film', 'customer', 'rental'],
    gapId: 'g10',
    theory: '<ul>' +
      '<li><strong><code>CASE WHEN ... THEN ... ELSE ... END</code>:</strong> odpowiednik instrukcji warunkowej „jeżeli” w SQL. Pozwala dzielić wiersze na segmenty (np. krótki/średni/długi film) lub warunkowo zliczać wartości.</li>' +
      '<li><strong><code>COUNT(*) FILTER (WHERE warunek)</code>:</strong> natywna, superczytelna składnia PostgreSQL do agregacji warunkowej (zastępuje długie <code>SUM(CASE WHEN warunek THEN 1 ELSE 0 END)</code>). Działa też z <code>SUM</code> i <code>AVG</code>.</li>' +
      '<li><strong>Dokładne procenty (<code>* 100.0</code> i <code>ROUND</code>):</strong> licząc odsetek, zawsze mnóż licznik przez <code>100.0</code> (lub rzutuj <code>::numeric</code>), aby uniknąć obcięcia ułamka przez dzielenie całkowite. Wynik zaokrąglisz funkcją <code>ROUND(wyrażenie, 2)</code>.</li>' +
      '</ul>' +
      '<div class="theory-code"><code>SELECT staff_id, COUNT(*) FILTER (WHERE return_date IS NULL) * 100.0 / COUNT(*) AS unreturned_pct FROM rental GROUP BY staff_id;</code></div>',
    variants: [
      { prompt: 'Oblicz w tabeli `film`, jaki procent wszystkich filmów stanowią filmy drogie (`rental_rate = 4.99`). Zwróć jedną liczbę zmiennoprzecinkową (użyj `* 100.0`).', sol: "SELECT SUM(CASE WHEN rental_rate = 4.99 THEN 1 ELSE 0 END) * 100.0 / COUNT(*) AS expensive_pct FROM film;", order: false, tables: ['film'], hint: 'Pomnóż licznik przez 100.0 i podziel przez COUNT(*).' },
      { prompt: 'Podziel filmy z `film` przez `CASE WHEN` na segmenty: `\'Krotki\'` (`length < 70`), `\'Sredni\'` (`length BETWEEN 70 AND 120`) oraz `\'Dlugi\'` (`ELSE`). Zwróć segment i `COUNT(*)`.', sol: "SELECT CASE WHEN length < 70 THEN 'Krotki' WHEN length BETWEEN 70 AND 120 THEN 'Sredni' ELSE 'Dlugi' END AS seg, COUNT(*) AS cnt FROM film GROUP BY 1;", order: false, tables: ['film'], hint: 'Zbuduj kolumnę CASE WHEN ... END AS seg i pogrupuj po niej (GROUP BY 1).' },
      { prompt: 'Dla każdego sklepu (`store_id`) w tabeli `customer` policz procent aktywnych klientów (`active = 1`). Zwróć `store_id` oraz `active_pct` z użyciem `* 100.0`.', sol: "SELECT store_id, SUM(CASE WHEN active = 1 THEN 1 ELSE 0 END) * 100.0 / COUNT(*) AS active_pct FROM customer GROUP BY store_id;", order: false, tables: ['customer'], hint: 'Policz aktywnych klientów w każdej grupie store_id i podziel przez wszystkich klientów sklepu.' },
      { prompt: 'Użyj składni PostgreSQL `COUNT(*) FILTER (WHERE ...)` (lub `CASE WHEN`), aby w tabeli `rental` dla każdego `staff_id` zwrócić liczbę wypożyczeń z maja (`rental_date LIKE \'2026-05%\'`) oraz z czerwca (`rental_date LIKE \'2026-06%\'`). Zwróć `staff_id`, `may_cnt`, `june_cnt`.', sol: "SELECT staff_id, COUNT(*) FILTER (WHERE rental_date::text LIKE '2026-05%') AS may_cnt, COUNT(*) FILTER (WHERE rental_date::text LIKE '2026-06%') AS june_cnt FROM rental GROUP BY staff_id;", order: false, tables: ['rental'], hint: 'Użyj COUNT(*) FILTER (WHERE rental_date >= \'2026-05-01\' AND rental_date < \'2026-06-01\') lub porównania tekstowego.' },
      { prompt: 'W tabeli `payment` policz w jednym wierszu sumę kwot dla płatności wysokich (`amount >= 5.00`) oraz niskich (`amount < 5.00`). Zwróć dwie kolumny: `high_sum`, `low_sum`.', sol: "SELECT SUM(CASE WHEN amount >= 5.00 THEN amount ELSE 0 END) AS high_sum, SUM(CASE WHEN amount < 5.00 THEN amount ELSE 0 END) AS low_sum FROM payment;", order: false, tables: ['payment'], hint: 'Wewnątrz SUM(CASE WHEN ... THEN amount ELSE 0 END) sumujesz kwotę amount.' },
      { prompt: 'Połącz `category`, `film_category` i `film`. Dla każdej kategorii zwróć `name`, liczbę wszystkich filmów (`total`), liczbę filmów drogich (`COUNT(*) FILTER (WHERE f.rental_rate = 4.99) AS premium`) oraz ich udział procentowy zaokrąglony do 2 miejsc (`ROUND(... * 100.0 / COUNT(*), 2) AS premium_pct`). Posortuj malejąco po `premium_pct`, a przy remisie po `name`.', sol: "SELECT c.name, COUNT(*) AS total, COUNT(*) FILTER (WHERE f.rental_rate = 4.99) AS premium, ROUND(COUNT(*) FILTER (WHERE f.rental_rate = 4.99) * 100.0 / COUNT(*), 2) AS premium_pct FROM category c JOIN film_category fc ON fc.category_id = c.category_id JOIN film f ON f.film_id = fc.film_id GROUP BY c.name ORDER BY premium_pct DESC, c.name ASC;", order: true, tables: ['category', 'film_category', 'film'], hint: 'Złącz 3 tabele, pogrupuj po c.name i oblicz procent za pomocą ROUND(licznik * 100.0 / COUNT(*), 2).' },
      { prompt: 'Połącz `customer` i `payment`. Dla każdego sklepu (`c.store_id`) zwróć sumę płatności wysokich (`SUM(p.amount) FILTER (WHERE p.amount >= 5) AS big_rev`), niskich (`SUM(p.amount) FILTER (WHERE p.amount < 5) AS small_rev`) oraz procentowy udział wysokich w przychodzie sklepu zaokrąglony do 2 miejsc (`big_share`). Posortuj po `store_id`.', sol: "SELECT c.store_id, SUM(p.amount) FILTER (WHERE p.amount >= 5) AS big_rev, SUM(p.amount) FILTER (WHERE p.amount < 5) AS small_rev, ROUND(SUM(p.amount) FILTER (WHERE p.amount >= 5) * 100.0 / SUM(p.amount), 2) AS big_share FROM customer c JOIN payment p ON p.customer_id = c.customer_id GROUP BY c.store_id ORDER BY c.store_id;", order: true, tables: ['customer', 'payment'], hint: 'Udział wysokich płatności to SUM(p.amount) FILTER (WHERE p.amount >= 5) * 100.0 / SUM(p.amount).' },
      { prompt: 'Połącz `customer` z `rental` przez `LEFT JOIN` (wszyscy klienci!). Dla każdego klienta zwróć `customer_id`, `first_name`, liczbę wypożyczeń (`COUNT(r.rental_id) AS cnt`) oraz segment `CASE WHEN`: `\'Brak\'` (`0` wypożyczeń), `\'Okazjonalny\'` (`1`–`2`), `\'Staly\'` (`3` i więcej). Posortuj po `customer_id`.', sol: "SELECT c.customer_id, c.first_name, COUNT(r.rental_id) AS cnt, CASE WHEN COUNT(r.rental_id) = 0 THEN 'Brak' WHEN COUNT(r.rental_id) <= 2 THEN 'Okazjonalny' ELSE 'Staly' END AS segment FROM customer c LEFT JOIN rental r ON r.customer_id = c.customer_id GROUP BY c.customer_id, c.first_name ORDER BY c.customer_id;", order: true, tables: ['customer', 'rental'], hint: 'Wewnątrz CASE WHEN możesz bezpośrednio sprawdzać wartość agregatu COUNT(r.rental_id).' },
      { prompt: 'Połącz `category`, `film_category` i `film`. Dla każdej kategorii zwróć `name`, liczbę filmów familijnych (`COUNT(*) FILTER (WHERE f.rating IN (\'G\', \'PG\')) AS family_cnt`) oraz ich średnią długość zaokrągloną do 1 miejsca – a jeśli w kategorii nie ma takich filmów, zwróć `0` (`COALESCE(ROUND(AVG(f.length) FILTER (WHERE ...), 1), 0)`). Posortuj po `name`.', sol: "SELECT c.name, COUNT(*) FILTER (WHERE f.rating IN ('G', 'PG')) AS family_cnt, COALESCE(ROUND(AVG(f.length) FILTER (WHERE f.rating IN ('G', 'PG')), 1), 0) AS family_avg_len FROM category c JOIN film_category fc ON fc.category_id = c.category_id JOIN film f ON f.film_id = fc.film_id GROUP BY c.name ORDER BY c.name;", order: true, tables: ['category', 'film_category', 'film'], hint: 'Owiń ROUND(AVG(f.length) FILTER (WHERE f.rating IN (\'G\', \'PG\')), 1) w funkcję COALESCE(..., 0).' },
      { prompt: 'Wyzwanie: połącz `staff`, `payment` i `rental` (`p.rental_id = r.rental_id`). Dla każdego pracownika zwróć: `first_name`, liczbę płatności (`payments`), przychód z niezwróconych wypożyczeń (`COALESCE(SUM(p.amount) FILTER (WHERE r.return_date IS NULL), 0) AS open_rev`), odsetek niezwróconych zaokrąglony do 2 miejsc (`open_pct`) oraz etykietę `CASE WHEN SUM(p.amount) > 35 THEN \'Lider\' ELSE \'Standard\' END AS tier`. Posortuj po `first_name`.', sol: "SELECT s.first_name, COUNT(*) AS payments, COALESCE(SUM(p.amount) FILTER (WHERE r.return_date IS NULL), 0) AS open_rev, ROUND(COUNT(*) FILTER (WHERE r.return_date IS NULL) * 100.0 / COUNT(*), 2) AS open_pct, CASE WHEN SUM(p.amount) > 35 THEN 'Lider' ELSE 'Standard' END AS tier FROM staff s JOIN payment p ON p.staff_id = s.staff_id JOIN rental r ON r.rental_id = p.rental_id GROUP BY s.staff_id, s.first_name ORDER BY s.first_name;", order: true, tables: ['staff', 'payment', 'rental'], hint: 'Połącz 3 tabele i wykorzystaj w jednym SELECT funkcje FILTER, COALESCE, ROUND oraz CASE WHEN.' }
    ]
  },
  {
    id: 'p4_2', stage: 4, title: '4.2 Operatory zbiorowe: UNION, INTERSECT, EXCEPT',
    tables: ['actor', 'customer', 'rental', 'film_category', 'payment', 'staff', 'store', 'film', 'category'],
    cols: ['UNION', 'INTERSECT', 'EXCEPT', 'actor', 'customer', 'rental', 'first_name', 'customer_id'],
    theory: '<ul>' +
      '<li><strong>Łączenie w pionie (wiersze pod wierszami):</strong> podczas gdy <code>JOIN</code> dokleja kolumny obok siebie, operatory zbiorowe sklejają wyniki dwóch osobnych zapytań <code>SELECT</code> jeden pod drugim.</li>' +
      '<li><strong><code>UNION</code> vs <code>UNION ALL</code>:</strong> <code>UNION</code> łączy wyniki i usuwa duplikaty, a <code>UNION ALL</code> skleja wszystkie wiersze bez usuwania powtórzeń (jest szybszy).</li>' +
      '<li><strong><code>INTERSECT</code> oraz <code>EXCEPT</code>:</strong> <code>INTERSECT</code> zwraca część wspólną (wiersze obecne w <em>obu</em> zapytaniach, np. klienci aktywni w maju I w czerwcu). <code>EXCEPT</code> zwraca różnicę (wiersze z pierwszego zapytania, których nie ma w drugim).</li>' +
      '<li><strong>Zasada zgodności kolumn:</strong> oba zapytania muszą zwracać tę samą liczbę kolumn o zgodnych typach danych, a klauzulę <code>ORDER BY</code> piszesz tylko raz na samym końcu.</li>' +
      '</ul>' +
      '<div class="theory-code"><code>SELECT customer_id FROM rental WHERE rental_date &lt; \'2026-06-01\'\nINTERSECT\nSELECT customer_id FROM rental WHERE rental_date &gt;= \'2026-06-01\';</code></div>',
    variants: [
      { prompt: 'Za pomocą `INTERSECT` znajdź imiona (`first_name`), które występują jednocześnie w tabeli `actor` oraz w tabeli `customer`.', sol: "SELECT first_name FROM actor INTERSECT SELECT first_name FROM customer;", order: false, tables: ['actor', 'customer'], hint: 'Połącz dwa zapytania SELECT first_name operatorem INTERSECT.' },
      { prompt: 'Za pomocą `INTERSECT` znajdź identyfikatory klientów (`customer_id`) z tabeli `rental`, którzy wypożyczali filmy ZARÓWNO w maju (`2026-05%`), JAK I w czerwcu (`2026-06%`).', sol: "SELECT customer_id FROM rental WHERE rental_date >= '2026-05-01' AND rental_date < '2026-06-01' INTERSECT SELECT customer_id FROM rental WHERE rental_date >= '2026-06-01' AND rental_date < '2026-07-01';", order: false, tables: ['rental'], hint: 'Pierwsze zapytanie wybiera customer_id z maja, drugie z czerwca, a pomiędzy nimi stoi INTERSECT.' },
      { prompt: 'Za pomocą `EXCEPT` znajdź klientów (`customer_id`), którzy wypożyczali film w maju (`2026-05%`), ale NIE wypożyczyli żadnego filmu w czerwcu (`2026-06%`).', sol: "SELECT customer_id FROM rental WHERE rental_date >= '2026-05-01' AND rental_date < '2026-06-01' EXCEPT SELECT customer_id FROM rental WHERE rental_date >= '2026-06-01' AND rental_date < '2026-07-01';", order: false, tables: ['rental'], hint: 'Odejmij zbiór klientów czerwcowych od majowych za pomocą operatora EXCEPT.' },
      { prompt: 'Za pomocą `EXCEPT` znajdź wszystkie `customer_id` z tabeli `customer`, których nie ma w tabeli `payment`.', sol: "SELECT customer_id FROM customer EXCEPT SELECT customer_id FROM payment;", order: false, tables: ['customer', 'payment'], hint: 'SELECT customer_id FROM customer EXCEPT SELECT customer_id FROM payment.' },
      { prompt: 'Połącz za pomocą `UNION ALL` listę pracowników (`first_name`, `\'staff\' AS role` z `staff`) oraz oddziałów (`city`, `\'store\' AS role` z `store`).', sol: "SELECT first_name, 'staff' AS role FROM staff UNION ALL SELECT city, 'store' AS role FROM store;", order: false, tables: ['staff', 'store'], hint: 'W obu SELECT-ach zwróć po dwie kolumny i połącz je przez UNION ALL.' },
      { prompt: 'Za pomocą `UNION` (bez duplikatów) wypisz listę klientów (`first_name`, `last_name`), którzy wypożyczyli film o ratingu `\'R\'` (`customer` + `rental` + `film`) LUB wykonali płatność powyżej `7.00` (`customer` + `payment`).', sol: "SELECT c.first_name, c.last_name FROM customer c JOIN rental r ON r.customer_id = c.customer_id JOIN film f ON f.film_id = r.film_id WHERE f.rating = 'R' UNION SELECT c.first_name, c.last_name FROM customer c JOIN payment p ON p.customer_id = c.customer_id WHERE p.amount > 7.00;", order: false, tables: ['customer', 'rental', 'film', 'payment'], hint: 'Połącz przez UNION dwa osobne zapytania z JOIN-ami.' },
      { prompt: 'Za pomocą `INTERSECT` znajdź tytuły filmów (`title`), które zostały wypożyczone ZARÓWNO w maju (`rental_date < \'2026-06-01\'`), JAK I w czerwcu (`rental_date >= \'2026-06-01\'`). Każda część łączy `film` z `rental`. Posortuj wynik po `title`.', sol: "SELECT f.title FROM film f JOIN rental r ON r.film_id = f.film_id WHERE r.rental_date < '2026-06-01' INTERSECT SELECT f.title FROM film f JOIN rental r ON r.film_id = f.film_id WHERE r.rental_date >= '2026-06-01' ORDER BY title;", order: true, tables: ['film', 'rental'], hint: 'Na końcu całej konstrukcji INTERSECT dopisz wspólne ORDER BY title.' },
      { prompt: 'Za pomocą `EXCEPT` znajdź nazwy kategorii (`name`), których filmów nikt nigdy nie wypożyczył: od wszystkich kategorii z `category` odejmij kategorie obecne w złączeniu `category` + `film_category` + `rental`.', sol: "SELECT name FROM category EXCEPT SELECT c.name FROM category c JOIN film_category fc ON fc.category_id = c.category_id JOIN rental r ON r.film_id = fc.film_id;", order: false, tables: ['category', 'film_category', 'rental'], hint: 'Pierwszy SELECT pobiera wszystkie nazwy z category, a drugi (po EXCEPT) te, które mają wpis w rental.' },
      { prompt: 'Zbuduj raport `UNION ALL` składający się z dwóch wierszy (`\'Maj\'` oraz `\'Czerwiec\'`). Dla każdego miesiąca z tabeli `rental` zwróć: etykietę `okres`, liczbę wypożyczeń (`COUNT(*) AS rentals`) oraz procent niezwróconych filmów zaokrąglony do 2 miejsc (`open_pct`).', sol: "SELECT 'Maj' AS okres, COUNT(*) AS rentals, ROUND(COUNT(*) FILTER (WHERE return_date IS NULL) * 100.0 / COUNT(*), 2) AS open_pct FROM rental WHERE rental_date < '2026-06-01' UNION ALL SELECT 'Czerwiec', COUNT(*), ROUND(COUNT(*) FILTER (WHERE return_date IS NULL) * 100.0 / COUNT(*), 2) FROM rental WHERE rental_date >= '2026-06-01';", order: false, tables: ['rental'], hint: 'Sklej przez UNION ALL dwa zapytania agregujące: jedno z WHERE dla maja, drugie dla czerwca.' },
      { prompt: 'Wyzwanie: zbuduj zestawienie `UNION ALL` łączące przychody pracowników (`staff` + `payment`: `\'pracownik\' AS level`, `first_name AS name`, `SUM(p.amount) AS total`) oraz wszystkich klientów sklepu `store_id = 1` (`customer` LEFT JOIN `payment`: `\'klient\'`, `first_name`, `COALESCE(SUM(p.amount), 0)`). W obu częściach dodaj czwartą kolumnę `CASE WHEN suma >= 10 THEN \'wysoki\' ELSE \'niski\' END AS tier`.', sol: "SELECT 'pracownik' AS level, s.first_name AS name, SUM(p.amount) AS total, CASE WHEN SUM(p.amount) >= 10 THEN 'wysoki' ELSE 'niski' END AS tier FROM staff s JOIN payment p ON p.staff_id = s.staff_id GROUP BY s.staff_id, s.first_name UNION ALL SELECT 'klient', c.first_name, COALESCE(SUM(p.amount), 0), CASE WHEN COALESCE(SUM(p.amount), 0) >= 10 THEN 'wysoki' ELSE 'niski' END FROM customer c LEFT JOIN payment p ON p.customer_id = c.customer_id WHERE c.store_id = 1 GROUP BY c.customer_id, c.first_name;", order: false, tables: ['staff', 'payment', 'customer'], hint: 'Każda z dwóch części UNION ALL ma własne JOIN oraz GROUP BY i zwraca dokładnie 4 kolumny.' }
    ]
  },
  {
    id: 'p5_1', stage: 5, title: '5.1 CTE i Rankingi Okna: ROW_NUMBER, RANK, DENSE_RANK',
    tables: ['film', 'payment', 'customer', 'category', 'film_category', 'store', 'actor', 'film_actor', 'rental'],
    cols: ['WITH', 'ROW_NUMBER()', 'DENSE_RANK()', 'OVER', 'PARTITION BY', 'ORDER BY', 'film', 'payment'],
    gapId: 't5',
    theory: '<ul>' +
      '<li><strong>CTE (<code>WITH nazwa AS (...)</code>):</strong> tymczasowa, nazwana tabela pomocnicza żyjąca tylko na czas jednego zapytania. Pozwala rozbić trudny problem na czytelne kroki (np. krok 1: policz sumy lub numery wierszy, krok 2: przefiltruj wynik).</li>' +
      '<li><strong>Funkcje okna (<code>OVER (PARTITION BY ... ORDER BY ...)</code>):</strong> wykonują obliczenia w obrębie grupy (partycji), ale <em>nie zwijają wierszy</em> jak <code>GROUP BY</code>.</li>' +
      '<li><strong><code>ROW_NUMBER()</code> vs <code>RANK()</code> vs <code>DENSE_RANK()</code>:</strong> przy remisie wartości <code>ROW_NUMBER</code> nadaje kolejne unikalne numery (1, 2, 3), <code>RANK</code> daje ten sam numer i zostawia lukę (1, 1, 3), a <code>DENSE_RANK</code> nie zostawia dziur w numeracji (1, 1, 2).</li>' +
      '<li><strong>Pułapka filtrowania okna:</strong> funkcji okna nie wolno użyć bezpośrednio w <code>WHERE</code> tego samego zapytania – wylicz ją w CTE i daj <code>WHERE rn &lt;= 2</code> w zapytaniu zewnętrznym!</li>' +
      '</ul>' +
      '<div class="theory-code"><code>WITH ranked AS (\n  SELECT rating, title, length, DENSE_RANK() OVER (PARTITION BY rating ORDER BY length DESC) AS rnk FROM film\n)\nSELECT rating, title, length FROM ranked WHERE rnk = 1;</code></div>',
    variants: [
      { prompt: 'Użyj CTE i `ROW_NUMBER()`, aby dla każdego `rating` w tabeli `film` znaleźć najdłuższy film (`ORDER BY length DESC`). Zwróć `rating`, `title`, `length` dla `rn = 1`.', sol: "WITH ranked AS (SELECT rating, title, length, ROW_NUMBER() OVER (PARTITION BY rating ORDER BY length DESC) AS rn FROM film) SELECT rating, title, length FROM ranked WHERE rn = 1;", order: false, tables: ['film'], hint: 'Wylicz ROW_NUMBER() OVER (PARTITION BY rating ORDER BY length DESC) AS rn w CTE, a na zewnątrz daj WHERE rn = 1.' },
      { prompt: 'Za pomocą CTE i `ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY amount DESC, payment_id ASC)` zwróć `customer_id`, `payment_id`, `amount` dla maksymalnie 2 najwyższych płatności każdego klienta.', sol: "WITH r AS (SELECT customer_id, payment_id, amount, ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY amount DESC, payment_id ASC) AS rn FROM payment) SELECT customer_id, payment_id, amount FROM r WHERE rn <= 2;", order: false, tables: ['payment'], hint: 'W zapytaniu głównym przefiltruj wynik CTE warunkiem WHERE rn <= 2.' },
      { prompt: 'Z tabeli `film` wybierz `title`, `rating`, `replacement_cost` oraz pozycję filmu pod względem najdroższego `replacement_cost` wewnątrz jego `rating` używając `DENSE_RANK() OVER (PARTITION BY rating ORDER BY replacement_cost DESC)`. Zostaw tylko miejsca `1` i `2`.', sol: "WITH r AS (SELECT title, rating, replacement_cost, DENSE_RANK() OVER (PARTITION BY rating ORDER BY replacement_cost DESC) AS dr FROM film) SELECT title, rating, replacement_cost, dr FROM r WHERE dr <= 2;", order: false, tables: ['film'], hint: 'Użyj DENSE_RANK() w CTE i odfiltruj WHERE dr <= 2.' },
      { prompt: 'Dla każdego klienta w `payment` ponumeruj jego płatności chronologicznie (`ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY payment_date ASC, payment_id ASC)`). Zwróć tylko pierwszą płatność każdego klienta (`customer_id`, `payment_date`, `amount`).', sol: "WITH first_p AS (SELECT customer_id, payment_date, amount, ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY payment_date ASC, payment_id ASC) AS rn FROM payment) SELECT customer_id, payment_date, amount FROM first_p WHERE rn = 1;", order: false, tables: ['payment'], hint: 'Chronologicznie pierwsza płatność to rn = 1 przy sortowaniu rosnącym po payment_date, payment_id.' },
      { prompt: 'Znajdź filmy z tabeli `film`, których długość (`length`) jest większa niż średnia długość wszystkich filmów w bazie (`> (SELECT AVG(length) FROM film)`). Zwróć `title` i `length`.', sol: "SELECT title, length FROM film WHERE length > (SELECT AVG(length) FROM film);", order: false, tables: ['film'], hint: 'Porównaj length z podzapytaniem skalarnym (SELECT AVG(length) FROM film).' },
      { prompt: 'W pierwszym CTE policz sumę wydatków każdego klienta (`customer` + `payment`, `SUM(p.amount) AS total`). W drugim CTE nadaj ranking `DENSE_RANK() OVER (ORDER BY total DESC) AS rnk` i zwróć `first_name`, `last_name`, `total`, `rnk` dla miejsc `1`–`3`.', sol: "WITH totals AS (SELECT c.customer_id, c.first_name, c.last_name, SUM(p.amount) AS total FROM customer c JOIN payment p ON p.customer_id = c.customer_id GROUP BY c.customer_id, c.first_name, c.last_name), ranked AS (SELECT first_name, last_name, total, DENSE_RANK() OVER (ORDER BY total DESC) AS rnk FROM totals) SELECT first_name, last_name, total, rnk FROM ranked WHERE rnk <= 3;", order: false, tables: ['customer', 'payment'], hint: 'Zdefiniuj dwa CTE oddzielone przecinkiem: najpierw GROUP BY, potem DENSE_RANK().' },
      { prompt: 'W CTE policz liczbę filmów w każdej kategorii (`category` + `film_category`, `COUNT(*) AS cnt`). Następnie w zapytaniu głównym zwróć `name`, `cnt` oraz oba rankingi obok siebie: `RANK() OVER (ORDER BY cnt DESC) AS rnk` i `DENSE_RANK() OVER (ORDER BY cnt DESC) AS drnk`.', sol: "WITH cat_cnt AS (SELECT c.name, COUNT(*) AS cnt FROM category c JOIN film_category fc ON fc.category_id = c.category_id GROUP BY c.name) SELECT name, cnt, RANK() OVER (ORDER BY cnt DESC) AS rnk, DENSE_RANK() OVER (ORDER BY cnt DESC) AS drnk FROM cat_cnt;", order: false, tables: ['category', 'film_category'], hint: 'Po zagregowaniu liczby filmów w CTE nałóż w SELECT funkcje RANK() oraz DENSE_RANK().' },
      { prompt: 'Znajdź najdłuższy film w każdej kategorii. W CTE połącz `film`, `film_category` i `category` oraz nadaj `ROW_NUMBER() OVER (PARTITION BY c.name ORDER BY f.length DESC, f.title ASC) AS rn`. Zwróć `name`, `title`, `length` dla `rn = 1`, posortowane po `name`.', sol: "WITH ranked AS (SELECT c.name, f.title, f.length, ROW_NUMBER() OVER (PARTITION BY c.name ORDER BY f.length DESC, f.title ASC) AS rn FROM film f JOIN film_category fc ON fc.film_id = f.film_id JOIN category c ON c.category_id = fc.category_id) SELECT name, title, length FROM ranked WHERE rn = 1 ORDER BY name;", order: true, tables: ['film', 'film_category', 'category'], hint: 'W CTE złącz 3 tabele i użyj PARTITION BY c.name, a na zewnątrz odfiltruj rn = 1.' },
      { prompt: 'Znajdź najlepszego klienta (największa suma płatności) w każdym oddziale (`city`). W pierwszym CTE połącz `customer`, `payment` i `store` i policz `SUM(p.amount) AS total` dla każdego klienta, w drugim nadaj `ROW_NUMBER() OVER (PARTITION BY city ORDER BY total DESC) AS rn`, a na końcu zwróć `city`, `first_name`, `total` dla `rn = 1`.', sol: "WITH totals AS (SELECT st.city, c.customer_id, c.first_name, SUM(p.amount) AS total FROM customer c JOIN payment p ON p.customer_id = c.customer_id JOIN store st ON st.store_id = c.store_id GROUP BY st.city, c.customer_id, c.first_name), ranked AS (SELECT city, first_name, total, ROW_NUMBER() OVER (PARTITION BY city ORDER BY total DESC) AS rn FROM totals) SELECT city, first_name, total FROM ranked WHERE rn = 1;", order: false, tables: ['customer', 'payment', 'store'], hint: 'Najpierw zagreguj wydatki klientów ze sklepem, a potem ponumeruj ich wewnątrz PARTITION BY city.' },
      { prompt: 'Wyzwanie: policz przychód z wypożyczeń filmów każdego aktora (`actor` → `film_actor` → `rental` → `payment`, `SUM(p.amount) AS rev`). W drugim CTE wylicz udział procentowy aktora w sumie przychodów wszystkich aktorów (`ROUND(100.0 * rev / SUM(rev) OVER (), 2) AS share_pct`) oraz `DENSE_RANK() OVER (ORDER BY rev DESC) AS rnk`. Zwróć `first_name`, `last_name`, `rev`, `share_pct`, `rnk` dla miejsc `<= 3`, posortowane po `rnk`.', sol: "WITH actor_rev AS (SELECT a.actor_id, a.first_name, a.last_name, SUM(p.amount) AS rev FROM actor a JOIN film_actor fa ON fa.actor_id = a.actor_id JOIN rental r ON r.film_id = fa.film_id JOIN payment p ON p.rental_id = r.rental_id GROUP BY a.actor_id, a.first_name, a.last_name), ranked AS (SELECT first_name, last_name, rev, ROUND(100.0 * rev / SUM(rev) OVER (), 2) AS share_pct, DENSE_RANK() OVER (ORDER BY rev DESC) AS rnk FROM actor_rev) SELECT first_name, last_name, rev, share_pct, rnk FROM ranked WHERE rnk <= 3 ORDER BY rnk;", order: true, tables: ['actor', 'film_actor', 'rental', 'payment'], hint: 'Wylicz udział SUM(rev) OVER () w drugim CTE przed filtrem WHERE rnk <= 3.' }
    ]
  },
  {
    id: 'p5_2', stage: 5, title: '5.2 Okna analityczne: Suma narastająca, udział % i LAG()',
    tables: ['payment', 'film', 'staff', 'customer', 'category', 'film_category', 'rental'],
    cols: ['SUM(amount) OVER', 'LAG(', 'PARTITION BY', 'ORDER BY', 'payment', 'film', 'payment_date'],
    gapId: 'g5',
    theory: '<ul>' +
      '<li><strong>Suma narastająca (Running Total):</strong> <code>SUM(amount) OVER (ORDER BY payment_date, payment_id)</code> dodaje kolejne kwoty wiersz po wierszu od początku okna aż do bieżącego wiersza.</li>' +
      '<li><strong><code>LAG(kolumna)</code> (krok wstecz):</strong> zagląda do poprzedniego wiersza w oknie bez konieczności robienia skomplikowanego self-joina – niezastąpione przy porównaniach miesiąc-do-miesiąca (MoM).</li>' +
      '<li><strong>Udział w całości (<code>SUM(...) OVER ()</code>):</strong> puste nawiasy w <code>OVER ()</code> oznaczają „policz sumę z całego wyniku”, co pozwala w jednej linijce wyliczyć udział procentowy każdego wiersza.</li>' +
      '<li><strong>Pułapka ziarna przy <code>LAG()</code>:</strong> jeśli liczysz zmianę miesięczną, najpierw zagreguj dane przez <code>GROUP BY</code> w CTE do jednego wiersza na miesiąc, a dopiero potem wywołaj <code>LAG()</code>!</li>' +
      '</ul>' +
      '<div class="theory-code"><code>WITH m_rev AS (SELECT DATE_TRUNC(\'month\', payment_date) AS m, SUM(amount) AS rev FROM payment GROUP BY 1)\nSELECT m, rev, LAG(rev) OVER (ORDER BY m) AS prev_rev FROM m_rev;</code></div>',
    variants: [
      { prompt: 'Dla płatności klienta `customer_id = 1` w tabeli `payment` wypisz `payment_id`, `payment_date`, `amount` oraz sumę narastającą jego wydatków (`SUM(amount) OVER (ORDER BY payment_date, payment_id)`).', sol: "SELECT payment_id, payment_date, amount, SUM(amount) OVER (ORDER BY payment_date, payment_id) AS running_total FROM payment WHERE customer_id = 1 ORDER BY payment_date, payment_id;", order: true, tables: ['payment'], hint: 'Dodaj ORDER BY wewnątrz OVER (...), aby uzyskać sumę narastającą.' },
      { prompt: 'Dla płatności klienta `customer_id = 1` wypisz `payment_id`, `amount` oraz kwotę jego poprzedniej płatności za pomocą `LAG(amount) OVER (ORDER BY payment_date, payment_id)`.', sol: "SELECT payment_id, amount, LAG(amount) OVER (ORDER BY payment_date, payment_id) AS prev_amount FROM payment WHERE customer_id = 1 ORDER BY payment_date, payment_id;", order: true, tables: ['payment'], hint: 'Funkcja LAG(amount) zwraca wartość z poprzedniego wiersza (dla pierwszego wiersza zwróci NULL).' },
      { prompt: 'Dla każdego `rating` w tabeli `film` policz liczbę filmów (`COUNT(*)`) oraz jej procentowy udział we wszystkich filmach (`COUNT(*) * 100.0 / SUM(COUNT(*)) OVER ()`). Zwróć `rating`, `cnt`, `share_pct`.', sol: "SELECT rating, COUNT(*) AS cnt, COUNT(*) * 100.0 / SUM(COUNT(*)) OVER () AS share_pct FROM film GROUP BY rating;", order: false, tables: ['film'], hint: 'SUM(COUNT(*)) OVER () sumuje liczebności wszystkich grup rating.' },
      { prompt: 'W tabeli `film` dla filmów o ratingu `\'G\'` wypisz `title`, `length` oraz średnią długość filmu w grupie `\'G\'` policzoną oknem `AVG(length) OVER ()`.', sol: "SELECT title, length, AVG(length) OVER () AS avg_g_len FROM film WHERE rating = 'G';", order: false, tables: ['film'], hint: 'Puste okno OVER () liczy średnią po wszystkich wierszach przefiltrowanych przez WHERE.' },
      { prompt: 'W tabeli `payment` zagreguj w CTE przychód miesięczny (`DATE_TRUNC(\'month\', payment_date) AS m, SUM(amount) AS rev`), a następnie wypisz `m`, `rev` oraz przychód z poprzedniego miesiąca (`LAG(rev) OVER (ORDER BY m)`).', sol: "WITH m_rev AS (SELECT DATE_TRUNC('month', payment_date) AS m, SUM(amount) AS rev FROM payment GROUP BY 1) SELECT m, rev, LAG(rev) OVER (ORDER BY m) AS prev_rev FROM m_rev ORDER BY m;", order: true, tables: ['payment'], hint: 'Najpierw zrób GROUP BY 1 w CTE, a w zewnętrznym SELECT użyj LAG(rev) OVER (ORDER BY m).' },
      { prompt: 'W CTE połącz `payment` ze `staff` i policz przychód każdego pracownika w każdym miesiącu (`DATE_TRUNC(\'month\', p.payment_date)::date AS m`, `SUM(p.amount) AS rev`). Następnie zwróć `first_name`, `m`, `rev` oraz narastający przychód pracownika (`SUM(rev) OVER (PARTITION BY first_name ORDER BY m)`). Posortuj po `first_name`, potem po `m`.', sol: "WITH monthly AS (SELECT s.first_name, DATE_TRUNC('month', p.payment_date)::date AS m, SUM(p.amount) AS rev FROM payment p JOIN staff s ON s.staff_id = p.staff_id GROUP BY s.first_name, DATE_TRUNC('month', p.payment_date)::date) SELECT first_name, m, rev, SUM(rev) OVER (PARTITION BY first_name ORDER BY m) AS running_rev FROM monthly ORDER BY first_name, m;", order: true, tables: ['payment', 'staff'], hint: 'PARTITION BY first_name liczy sumę narastającą osobno dla każdego pracownika.' },
      { prompt: 'Znajdź płatności, które były WYŻSZE od poprzedniej płatności tego samego klienta. W CTE połącz `payment` z `customer` i wylicz `LAG(p.amount) OVER (PARTITION BY p.customer_id ORDER BY p.payment_date, p.payment_id) AS prev_amount`. Zwróć `first_name`, `payment_id`, `prev_amount`, `amount` oraz różnicę `amount - prev_amount AS diff` tylko dla wierszy z `diff > 0`. Posortuj po `payment_id`.', sol: "WITH x AS (SELECT c.first_name, p.payment_id, p.amount, LAG(p.amount) OVER (PARTITION BY p.customer_id ORDER BY p.payment_date, p.payment_id) AS prev_amount FROM payment p JOIN customer c ON c.customer_id = p.customer_id) SELECT first_name, payment_id, prev_amount, amount, amount - prev_amount AS diff FROM x WHERE amount - prev_amount > 0 ORDER BY payment_id;", order: true, tables: ['payment', 'customer'], hint: 'Wylicz prev_amount w CTE, a warunek amount - prev_amount > 0 sprawdź w zewnętrznym WHERE.' },
      { prompt: 'Dla filmów z kategorii `\'Action\'` oraz `\'Drama\'` (`film` + `film_category` + `category`) zwróć `name`, `title`, `length` oraz procent, jaki stanowi długość filmu w łącznej długości filmów jego kategorii (`ROUND(100.0 * f.length / SUM(f.length) OVER (PARTITION BY c.name), 1) AS pct_of_cat`). Posortuj po `name`, a następnie malejąco po `pct_of_cat`.', sol: "SELECT c.name, f.title, f.length, ROUND(100.0 * f.length / SUM(f.length) OVER (PARTITION BY c.name), 1) AS pct_of_cat FROM film f JOIN film_category fc ON fc.film_id = f.film_id JOIN category c ON c.category_id = fc.category_id WHERE c.name IN ('Action', 'Drama') ORDER BY c.name, pct_of_cat DESC;", order: true, tables: ['film', 'film_category', 'category'], hint: 'Mianownikiem udziału w kategorii jest funkcja okna SUM(f.length) OVER (PARTITION BY c.name).' },
      { prompt: 'Porównaj czerwcowy przychód kategorii z majowym. W pierwszym CTE połącz `category` → `film_category` → `rental` → `payment` i policz miesięczny przychód kategorii (`DATE_TRUNC(\'month\', p.payment_date)::date AS m`, `SUM(p.amount) AS rev`). W drugim CTE dodaj `LAG(rev) OVER (PARTITION BY name ORDER BY m) AS prev_rev`. Zwróć `name`, `rev`, `prev_rev`, `rev - prev_rev AS diff` dla czerwca (`m = \'2026-06-01\'`), posortowane malejąco po `diff`.', sol: "WITH cat_m AS (SELECT c.name, DATE_TRUNC('month', p.payment_date)::date AS m, SUM(p.amount) AS rev FROM category c JOIN film_category fc ON fc.category_id = c.category_id JOIN rental r ON r.film_id = fc.film_id JOIN payment p ON p.rental_id = r.rental_id GROUP BY c.name, DATE_TRUNC('month', p.payment_date)::date), with_prev AS (SELECT name, m, rev, LAG(rev) OVER (PARTITION BY name ORDER BY m) AS prev_rev FROM cat_m) SELECT name, rev, prev_rev, rev - prev_rev AS diff FROM with_prev WHERE m = '2026-06-01' ORDER BY diff DESC;", order: true, tables: ['category', 'film_category', 'rental', 'payment'], hint: 'Filtr m = \'2026-06-01\' zastosuj dopiero po wyliczeniu LAG(), aby funkcja widziała wiersz z maja.' },
      { prompt: 'Wyzwanie: zmierz odstępy w dniach między kolejnymi wypożyczeniami klientów. W CTE policz `rental_date - LAG(rental_date) OVER (PARTITION BY customer_id ORDER BY rental_date) AS gap_days` z tabeli `rental`. Następnie połącz z `customer` i dla każdego klienta zwróć `first_name`, liczbę odstępów (`COUNT(gap_days)`), maksymalny odstęp (`MAX(gap_days)`) oraz średni odstęp zaokrąglony do 1 miejsca (`ROUND(AVG(gap_days), 1) AS avg_gap`). Zostaw klientów z co najmniej 1 odstępem i posortuj malejąco po `avg_gap`.', sol: "WITH gaps AS (SELECT customer_id, rental_date - LAG(rental_date) OVER (PARTITION BY customer_id ORDER BY rental_date) AS gap_days FROM rental) SELECT c.first_name, COUNT(g.gap_days) AS gaps_cnt, MAX(g.gap_days) AS max_gap, ROUND(AVG(g.gap_days), 1) AS avg_gap FROM gaps g JOIN customer c ON c.customer_id = g.customer_id GROUP BY c.customer_id, c.first_name HAVING COUNT(g.gap_days) >= 1 ORDER BY avg_gap DESC;", order: true, tables: ['rental', 'customer'], hint: 'W CTE wylicz różnicę dat z LAG(), a w zapytaniu głównym pogrupuj po kliencie.' }
    ]
  },
  {
    id: 'p5_3', stage: 5, title: '5.3 Kalendarze generate_series, DATE_TRUNC i INTERVAL',
    tables: ['rental', 'payment', 'category', 'store', 'staff'],
    cols: ["generate_series('2026-05-01'::date, '2026-05-07'::date, '1 day')::date AS d", 'LEFT JOIN', 'COALESCE', 'DATE_TRUNC', 'INTERVAL'],
    gapId: 'g4',
    theory: '<ul>' +
      '<li><strong><code>generate_series(start, stop, krok)</code>:</strong> funkcja PostgreSQL generująca „wirtualną tabelę” z serią dat lub liczb. Niezastąpiona, gdy w raporcie musisz pokazać również dni z zerową sprzedażą!</li>' +
      '<li><strong>Kalendarz + <code>LEFT JOIN</code>:</strong> wygenerowaną serię dat umieszczasz po lewej stronie <code>LEFT JOIN</code>, a tabelę zdarzeń (np. <code>rental</code> lub <code>payment</code>) po prawej, używając <code>COUNT(r.rental_id)</code> lub <code>COALESCE(SUM(p.amount), 0)</code>.</li>' +
      '<li><strong><code>DATE_TRUNC(\'month\', data)</code>:</strong> obcina datę do pierwszego dnia miesiąca (lub tygodnia/roku), co pozwala łatwo grupować transakcje po okresach.</li>' +
      '<li><strong><code>INTERVAL \'5 days\'</code>:</strong> pozwala dodawać i odejmować odcinki czasu od daty (np. wyznaczanie terminu zwrotu filmu).</li>' +
      '</ul>' +
      '<div class="theory-code"><code>SELECT d::date AS d, COUNT(r.rental_id) AS cnt FROM generate_series(\'2026-05-01\'::date, \'2026-05-07\'::date, \'1 day\') AS d LEFT JOIN rental r ON r.rental_date = d::date GROUP BY 1 ORDER BY 1;</code></div>',
    variants: [
      { prompt: 'Wygeneruj kalendarz od `\'2026-05-01\'` do `\'2026-05-07\'` za pomocą `generate_series(\'2026-05-01\'::date, \'2026-05-07\'::date, \'1 day\') AS d` i połącz go `LEFT JOIN` z tabelą `rental` po `r.rental_date = d::date`. Zwróć dzień `d::date` oraz liczbę wypożyczeń (`COUNT(r.rental_id)`), posortowane po `1`.', sol: "SELECT d::date AS d, COUNT(r.rental_id) AS rentals_cnt FROM generate_series('2026-05-01'::date, '2026-05-07'::date, '1 day') AS d LEFT JOIN rental r ON r.rental_date = d::date GROUP BY 1 ORDER BY 1;", order: true, tables: ['rental'], hint: 'Kalendarz z generate_series jest po lewej stronie LEFT JOIN, a COUNT(r.rental_id) zwraca 0 dla dni bez wypożyczeń.' },
      { prompt: 'Wygeneruj kalendarz dni od `\'2026-05-01\'` do `\'2026-05-06\'` (`generate_series`) i połącz `LEFT JOIN` z `payment` (`p.payment_date = d::date`). Zwróć dzień `d::date` oraz dzienną sumę płatności z użyciem `COALESCE(SUM(p.amount), 0)`. Posortuj po `1`.', sol: "SELECT d::date AS d, COALESCE(SUM(p.amount), 0) AS daily_rev FROM generate_series('2026-05-01'::date, '2026-05-06'::date, '1 day') AS d LEFT JOIN payment p ON p.payment_date = d::date GROUP BY 1 ORDER BY 1;", order: true, tables: ['payment'], hint: 'Użyj COALESCE(SUM(p.amount), 0), aby dni bez płatności miały przychód 0.' },
      { prompt: 'Z tabeli `rental` dla wypożyczeń z maja (`rental_date >= \'2026-05-01\' AND rental_date < \'2026-06-01\'`) wypisz `rental_id`, `rental_date` oraz termin zwrotu wyznaczony jako 5 dni później: `(rental_date + INTERVAL \'5 days\')::date AS due_date`.', sol: "SELECT rental_id, rental_date, (rental_date + INTERVAL '5 days')::date AS due_date FROM rental WHERE rental_date >= '2026-05-01' AND rental_date < '2026-06-01';", order: false, tables: ['rental'], hint: 'Dodaj INTERVAL \'5 days\' do rental_date i zrzutuj wynik na ::date.' },
      { prompt: 'Z tabeli `rental` pogrupuj wypożyczenia po miesiącu za pomocą `DATE_TRUNC(\'month\', rental_date)::date AS miesiac` i policz liczbę wypożyczeń (`COUNT(*)`) w każdym miesiącu.', sol: "SELECT DATE_TRUNC('month', rental_date)::date AS miesiac, COUNT(*) AS cnt FROM rental GROUP BY 1 ORDER BY 1;", order: true, tables: ['rental'], hint: 'Grupuj po первой kolumnie (GROUP BY 1) i posortuj rosnąco.' },
      { prompt: 'Wygeneruj serię liczb od 1 do 6 za pomocą `generate_series(1, 6) AS s` i połącz ją z tabelą `category` (`c.category_id = s`). Zwróć `s` oraz `c.name`.', sol: "SELECT s, c.name FROM generate_series(1, 6) AS s JOIN category c ON c.category_id = s;", order: false, tables: ['category'], hint: 'Połącz wygenerowaną serię s z tabelą category po c.category_id = s.' },
      { prompt: 'Wygeneruj kalendarz od `\'2026-05-01\'` do `\'2026-05-10\'`, połącz go `LEFT JOIN` z `rental` i zwróć dzień (`d::date`), liczbę wypożyczeń danego dnia (`COUNT(r.rental_id) AS cnt`) oraz narastającą liczbę wypożyczeń od początku miesiąca (`SUM(COUNT(r.rental_id)) OVER (ORDER BY d) AS running_cnt`). Posortuj po dniu.', sol: "SELECT d::date AS d, COUNT(r.rental_id) AS cnt, SUM(COUNT(r.rental_id)) OVER (ORDER BY d) AS running_cnt FROM generate_series('2026-05-01'::date, '2026-05-10'::date, '1 day') AS d LEFT JOIN rental r ON r.rental_date = d::date GROUP BY d ORDER BY d;", order: true, tables: ['rental'], hint: 'Połącz generate_series z LEFT JOIN i nałóż funkcję okna SUM(COUNT(r.rental_id)) OVER (ORDER BY d).' },
      { prompt: 'Zbuduj tygodniowy raport przychodów: wygeneruj początki tygodni od `\'2026-05-01\'` do `\'2026-06-19\'` z krokiem `\'7 days\'` (`AS w`) i połącz `LEFT JOIN` z `payment` warunkiem `p.payment_date >= w AND p.payment_date < w + INTERVAL \'7 days\'`. Zwróć `w::date AS week_start` oraz `COALESCE(SUM(p.amount), 0) AS weekly_rev`, posortowane po tygodniu.', sol: "SELECT w::date AS week_start, COALESCE(SUM(p.amount), 0) AS weekly_rev FROM generate_series('2026-05-01'::date, '2026-06-19'::date, '7 days') AS w LEFT JOIN payment p ON p.payment_date >= w AND p.payment_date < w + INTERVAL '7 days' GROUP BY w ORDER BY w;", order: true, tables: ['payment'], hint: 'Warunek złączenia ON może sprawdzać przedział dat z użyciem w + INTERVAL \'7 days\'.' },
      { prompt: 'Z tabeli `rental` przygotuj raport miesięczny: `DATE_TRUNC(\'month\', rental_date)::date AS miesiac`, liczba wypożyczeń (`COUNT(*) AS rentals`), liczba niezwróconych (`COUNT(*) FILTER (WHERE return_date IS NULL) AS open_cnt`) oraz średni czas wypożyczenia w dniach zaokrąglony do 2 miejsc (`ROUND(AVG(return_date - rental_date), 2) AS avg_days`). Posortuj po miesiącu.', sol: "SELECT DATE_TRUNC('month', rental_date)::date AS miesiac, COUNT(*) AS rentals, COUNT(*) FILTER (WHERE return_date IS NULL) AS open_cnt, ROUND(AVG(return_date - rental_date), 2) AS avg_days FROM rental GROUP BY 1 ORDER BY 1;", order: true, tables: ['rental'], hint: 'Różnica return_date - rental_date daje liczbę dni wypożyczenia.' },
      { prompt: 'Zbuduj dzienny kalendarz dla obu sklepów: serię dni od `\'2026-06-01\'` do `\'2026-06-07\'` (`AS d`) połącz przez `CROSS JOIN store st`, następnie `JOIN staff s ON s.store_id = st.store_id` i `LEFT JOIN rental r ON r.staff_id = s.staff_id AND r.rental_date = d::date`. Zwróć `d::date AS d`, `city` oraz `COUNT(r.rental_id) AS rentals`, posortowane po dniu i mieście.', sol: "SELECT d::date AS d, st.city, COUNT(r.rental_id) AS rentals FROM generate_series('2026-06-01'::date, '2026-06-07'::date, '1 day') AS d CROSS JOIN store st JOIN staff s ON s.store_id = st.store_id LEFT JOIN rental r ON r.staff_id = s.staff_id AND r.rental_date = d::date GROUP BY d, st.city ORDER BY d, st.city;", order: true, tables: ['store', 'staff', 'rental'], hint: 'CROSS JOIN tworzy siatkę każdego dnia z każdym sklepem, a LEFT JOIN dokleja wypożyczenia.' },
      { prompt: 'Wyzwanie: termin zwrotu to `rental_date + INTERVAL \'4 days\'`. W CTE połącz `rental` z `payment` i wyznacz status `CASE WHEN`: `\'Nie zwrocono\'` (`return_date IS NULL`), `\'Spoznienie\'` (`return_date > rental_date + INTERVAL \'4 days\'`), `\'W terminie\'` (`ELSE`). Dla każdego statusu zwróć: `status`, liczbę wypożyczeń (`rentals`), przychód (`SUM(amount) AS revenue`) oraz udział procentowy we wszystkich wypożyczeniach zaokrąglony do 2 miejsc (`ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) AS pct`). Posortuj malejąco po `rentals`.', sol: "WITH st AS (SELECT r.rental_id, p.amount, CASE WHEN r.return_date IS NULL THEN 'Nie zwrocono' WHEN r.return_date > r.rental_date + INTERVAL '4 days' THEN 'Spoznienie' ELSE 'W terminie' END AS status FROM rental r JOIN payment p ON p.rental_id = r.rental_id) SELECT status, COUNT(*) AS rentals, SUM(amount) AS revenue, ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) AS pct FROM st GROUP BY status ORDER BY rentals DESC;", order: true, tables: ['rental', 'payment'], hint: 'W CTE sklasyfikuj wypożyczenia przez CASE WHEN z INTERVAL \'4 days\', a w głównym zapytaniu pogrupuj po statusie.' }
    ]
  }
];

/* ==========================================================================
   4. DIAGNOZA: 10 PRZEKROJOWYCH ZADAŃ POZIOMUJĄCYCH (Z PRZYCISKIEM POMIŃ)
   ========================================================================== */
var DIAG_QUESTIONS = [
  { lvl: 1, stage: 1, gap: 'g7', title: '1/10 Filtrowanie podstawowe (WHERE + ORDER BY)', prompt: 'Z tabeli `film` wypisz `title` oraz `rental_rate` dla wszystkich filmów o ratingu `\'PG\'`. Posortuj wynik rosnąco po `title`.', sol: "SELECT title, rental_rate FROM film WHERE rating = 'PG' ORDER BY title ASC;", order: true },
  { lvl: 1, stage: 1, gap: 'g7', title: '2/10 Zakresy IN oraz BETWEEN', prompt: 'Z tabeli `film` wypisz `title` i `length` dla filmów o ratingu `\'G\'` lub `\'R\'`, których długość mieści się między `50` a `90` minut włącznie.', sol: "SELECT title, length FROM film WHERE rating IN ('G', 'R') AND length BETWEEN 50 AND 90;", order: false },
  { lvl: 2, stage: 2, gap: 'g3', title: '3/10 Agregacja i NULL w COUNT', prompt: 'Z tabeli `rental` zwróć w jednym wierszu dwie kolumny: liczbę wszystkich wierszy (`COUNT(*)`) oraz liczbę wypożyczeń z uzupełnioną datą zwrotu (`COUNT(return_date)`).', sol: "SELECT COUNT(*) AS all_cnt, COUNT(return_date) AS ret_cnt FROM rental;", order: false },
  { lvl: 2, stage: 2, gap: 'g7', title: '4/10 Grupowanie i filtr po agregacji (HAVING)', prompt: 'Z tabeli `payment` wypisz `customer_id` oraz sumę płatności (`SUM(amount)`) tylko dla tych klientów, którzy wydali łącznie co najmniej `8.00`.', sol: "SELECT customer_id, SUM(amount) AS total FROM payment GROUP BY customer_id HAVING SUM(amount) >= 8.00;", order: false },
  { lvl: 3, stage: 3, gap: 'g1', title: '5/10 INNER JOIN po 3 tabelach', prompt: 'Połącz `category`, `film_category` i `film`. Zwróć nazwę kategorii (`name`) oraz liczbę przypisanych do niej filmów (`COUNT(f.film_id)`).', sol: "SELECT c.name, COUNT(f.film_id) AS cnt FROM category c JOIN film_category fc ON c.category_id = fc.category_id JOIN film f ON fc.film_id = f.film_id GROUP BY c.name;", order: false },
  { lvl: 3, stage: 3, gap: 'g2', title: '6/10 LEFT JOIN + COALESCE (wszyscy klienci, także z 0)', prompt: 'Dla KAŻDEGO klienta z tabeli `customer` (również tych bez płatności!) wypisz `customer_id`, `first_name` oraz sumę z tabeli `payment` (zamień `NULL` na `0`).', sol: "SELECT c.customer_id, c.first_name, COALESCE(SUM(p.amount), 0) AS total_paid FROM customer c LEFT JOIN payment p ON c.customer_id = p.customer_id GROUP BY c.customer_id, c.first_name;", order: false },
  { lvl: 3, stage: 3, gap: 'g2', title: '7/10 Anti-Join (wiersze bez pary)', prompt: 'Znajdź `actor_id` oraz `first_name` aktorów z tabeli `actor`, którzy nie występują ani razu w tabeli `film_actor`.', sol: "SELECT a.actor_id, a.first_name FROM actor a LEFT JOIN film_actor fa ON a.actor_id = fa.actor_id WHERE fa.film_id IS NULL;", order: false },
  { lvl: 4, stage: 4, gap: 'g10', title: '8/10 Agregacja warunkowa i procenty (* 100.0)', prompt: 'Dla każdego sklepu (`store_id`) w tabeli `customer` policz procent aktywnych klientów (`active = 1`). Zwróć `store_id` oraz dokładny procent z ułamkiem.', sol: "SELECT store_id, SUM(CASE WHEN active = 1 THEN 1 ELSE 0 END) * 100.0 / COUNT(*) AS active_pct FROM customer GROUP BY store_id;", order: false },
  { lvl: 5, stage: 5, gap: 't5', title: '9/10 CTE i funkcja okna (Top 2 płatności klienta)', prompt: 'Za pomocą CTE i `ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY amount DESC, payment_id ASC)` zwróć `customer_id`, `payment_id` i `amount` dla maksymalnie 2 najwyższych płatności każdego klienta.', sol: "WITH r AS (SELECT customer_id, payment_id, amount, ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY amount DESC, payment_id ASC) AS rn FROM payment) SELECT customer_id, payment_id, amount FROM r WHERE rn <= 2;", order: false },
  { lvl: 5, stage: 5, gap: 'g5', title: '10/10 Porównanie z poprzednim okresem (LAG)', prompt: 'Dla płatności klienta `customer_id = 1` w `payment` wypisz `payment_id`, `amount` oraz kwotę poprzedniej płatności (`LAG(amount) OVER (ORDER BY payment_date, payment_id)`).', sol: "SELECT payment_id, amount, LAG(amount) OVER (ORDER BY payment_date, payment_id) AS prev_amt FROM payment WHERE customer_id = 1 ORDER BY payment_date, payment_id;", order: true }
];

/* ==========================================================================
   5. ZADANIA REKRUTACYJNE: przeniesione do js/data-interview.js
   (INTERVIEW_TASKS, eksportowane również jako window.LEMUR_TASKS)
   ========================================================================== */

/* ==========================================================================
   6. SLAJDY TEORII SOLOLEARN (4 OKNA PRZED KAŻDĄ Z 12 LEKCJI)
   ========================================================================== */
var LESSON_TUTORIALS = {
  p1_1: [
    {
      title: 'Jak zbudować zapytanie?',
      syntax: "SELECT kolumna1, kolumna2\nFROM tabela\nWHERE warunek1 AND (warunek2 OR warunek3)\nORDER BY kolumna1 ASC, kolumna2 DESC;",
      bullets: [
        '<strong><code>SELECT</code> + <code>FROM</code>:</strong> określają, <em>jakie kolumny</em> oraz <em>z której tabeli</em> chcesz pobrać.',
        '<strong><code>WHERE</code> (sito wierszy):</strong> przepuszcza tylko wiersze spełniające warunek logiczny. Teksty i daty ujmuj w pojedyncze apostrofy <code>\'PG-13\'</code>.',
        '<strong>Priorytet <code>AND</code> nad <code>OR</code>:</strong> <code>AND</code> wiąże silniej niż <code>OR</code>! Łącząc oba operatory, zawsze bierz alternatywę <code>OR</code> w nawiasy <code>(...)</code>.',
        '<strong><code>ORDER BY</code>:</strong> sortuje wynik rosnąco (<code>ASC</code> – domyślnie) lub malejąco (<code>DESC</code>).'
      ]
    },
    {
      title: 'Kolejność pisania vs Kolejność wykonywania przez PostgreSQL',
      focusWrite: ['SELECT', 'FROM', 'WHERE', 'ORDER BY'],
      focusExec: [1, 2, 5, 7],
      note: '<strong>Dlaczego to ważne w Lekcji 1.1?</strong> Silnik PostgreSQL najpierw otwiera tabelę (<code>1. FROM</code>), od razu odrzuca niepasujące wiersze sitem (<code>2. WHERE</code>), potem wybiera kolumny (<code>5. SELECT</code>), a dopiero niemal na samym końcu układa wiersze (<code>7. ORDER BY</code>). Dlatego w <code>WHERE</code> filtrujesz po kolumnach tabeli przed ich wyświetleniem!'
    },
    {
      title: 'Przykład na żywo (dvdrental)',
      code: "SELECT title, rating, length\nFROM film\nWHERE (rating = 'G' OR rating = 'PG')\n  AND length > 100\nORDER BY rating ASC, length DESC;",
      lines: [
        { line: 'SELECT title, rating, length', desc: 'Krok 5 silnika: zwraca trzy wybrane kolumny dla przefiltrowanych filmów.' },
        { line: 'FROM film', desc: 'Krok 1 silnika: pobiera surowe wiersze z tabeli film.' },
        { line: "WHERE (rating = 'G' OR rating = 'PG') AND length > 100", desc: 'Krok 2 silnika: zostawia tylko filmy familijne (G lub PG) trwające ponad 100 minut.' },
        { line: 'ORDER BY rating ASC, length DESC;', desc: 'Krok 7 silnika: sortuje alfabetycznie po ratingu, a przy tym samym ratingu – od najdłuższego filmu.' }
      ]
    },
    {
      title: 'Sprawdź się przed zadaniami!',
      quiz: {
        question: 'Która klauzula jest wykonywana przez silnik PostgreSQL jako PIERWSZA pod maską w zapytaniu z SELECT, FROM, WHERE i ORDER BY?',
        options: [
          'SELECT — najpierw wybierane są kolumny do wyświetlenia',
          'FROM — najpierw silnik ładuje tabelę źródłową, a zaraz potem filtruje wiersze w WHERE',
          'ORDER BY — najpierw tabela jest sortowana przed filtrowaniem'
        ],
        correct: 1,
        explanation: 'Dokładnie! PostgreSQL zaczyna od 1. FROM (pobranie tabeli), następnie 2. WHERE (odfiltrowanie wierszy), 5. SELECT (wybór kolumn) i 7. ORDER BY (sortowanie wyniku).'
      }
    }
  ],
  p1_2: [
    {
      title: 'Jak zbudować zapytanie?',
      syntax: "SELECT kolumny\nFROM tabela\nWHERE kol IN ('A', 'B')\n  AND liczba BETWEEN 10 AND 50\n  AND tekst ILIKE 'wz%'\nORDER BY liczba DESC\nLIMIT 5;",
      bullets: [
        '<strong><code>IN (lista)</code>:</strong> sprawdza przynależność do zbioru wartości – zastępuje wielokrotne <code>OR</code>.',
        '<strong><code>BETWEEN a AND b</code>:</strong> filtruje przedział domknięty (włącznie z brzegami <code>a</code> oraz <code>b</code>).',
        '<strong><code>ILIKE \'wzorzec\'</code>:</strong> wyszukuje tekst bez względu na wielkość liter (<code>%</code> = dowolny ciąg znaków, <code>_</code> = pojedynczy znak).',
        '<strong><code>LIMIT n</code>:</strong> zwraca tylko pierwszych <code>n</code> wierszy (zawsze łącz go z <code>ORDER BY</code>!).'
      ]
    },
    {
      title: 'Kolejność pisania vs Kolejność wykonywania przez PostgreSQL',
      focusWrite: ['SELECT', 'FROM', 'WHERE', 'ORDER BY', 'LIMIT'],
      focusExec: [1, 2, 5, 7, 8],
      note: '<strong>Dlaczego to ważne w Lekcji 1.2?</strong> Zwróć uwagę na sam koniec potoku wykonawczego: <code>7. ORDER BY</code> wykonuje się <em>przed</em> <code>8. LIMIT</code>! Dzięki temu PostgreSQL najpierw ustawia wszystkie przefiltrowane wiersze w kolejności (np. od najdroższego), a dopiero w ostatnim kroku odcina górne <code>N</code> rekordów.'
    },
    {
      title: 'Przykład na żywo (dvdrental)',
      code: "SELECT title, rating, length\nFROM film\nWHERE rating IN ('G', 'PG')\n  AND length BETWEEN 100 AND 140\n  AND title NOT ILIKE 'al%'\nORDER BY length DESC\nLIMIT 4;",
      lines: [
        { line: "WHERE rating IN ('G', 'PG')", desc: 'Krok 2 silnika: zostawia filmy o ratingu G lub PG.' },
        { line: 'AND length BETWEEN 100 AND 140', desc: 'Krok 2 silnika: zawęża do długości od 100 do 140 minut (włącznie).' },
        { line: "AND title NOT ILIKE 'al%'", desc: 'Krok 2 silnika: wyklucza tytuły zaczynające się od liter AL (niezależnie od wielkości liter).' },
        { line: 'ORDER BY length DESC LIMIT 4;', desc: 'Kroki 7 i 8 silnika: ustawia filmy od najdłuższego i odcina 4 pierwsze wiersze.' }
      ]
    },
    {
      title: 'Sprawdź się przed zadaniami!',
      quiz: {
        question: 'Dlaczego klauzula LIMIT znajduje się na samym końcu kolejności wykonywania (Krok 8 po ORDER BY)?',
        options: [
          'Aby najpierw posortować cały przefiltrowany wynik i dopiero z posortowanej listy odciąć TOP N wierszy',
          'Ponieważ LIMIT działa przed WHERE i losuje wiersze z tabeli',
          'Kolejność między ORDER BY a LIMIT jest losowa'
        ],
        correct: 0,
        explanation: 'Brawo! Gdyby LIMIT działał przed ORDER BY, dostałbyś przypadkowe wiersze i dopiero je posortował. Wykonanie ORDER BY (7) przed LIMIT (8) gwarantuje prawdziwy ranking TOP N.'
      }
    }
  ],
  p1_3: [
    {
      title: 'Jak zbudować zapytanie?',
      syntax: "SELECT DISTINCT\n  kolumna,\n  liczba / 60.0 AS alias_wyliczenia\nFROM tabela\nWHERE liczba / 60.0 > 1.5\nORDER BY alias_wyliczenia DESC;",
      bullets: [
        '<strong><code>SELECT DISTINCT</code>:</strong> usuwa zduplikowane wiersze z wyniku (zostawia unikalne kombinacje wszystkich wypisanych kolumn).',
        '<strong>Wyliczenia i <code>AS alias</code>:</strong> w <code>SELECT</code> możesz wykonywać działania matematyczne i nadawać im czytelne nazwy.',
        '<strong>Pułapka dzielenia całkowitego:</strong> <code>90 / 60</code> w SQL daje <code>1</code>! Aby otrzymać ułamek <code>1.5</code>, dziel przez liczbę z kropką: <code>length / 60.0</code>.'
      ]
    },
    {
      title: 'Kolejność pisania vs Kolejność wykonywania przez PostgreSQL',
      focusWrite: ['SELECT', 'FROM', 'WHERE', 'ORDER BY'],
      focusExec: [1, 2, 5, 6, 7],
      note: '<strong>Klasyczna pułapka rekrutacyjna!</strong> Alias kolumny (np. <code>AS hours</code>) powstaje dopiero w kroku <code>5. SELECT</code>. Dlatego w kroku <code>2. WHERE</code> ten alias jeszcze <em>nie istnieje</em> (musisz tam powtórzyć całe wyrażenie), natomiast w kroku <code>7. ORDER BY</code> alias jest już znany i możesz po nim wygodnie sortować!'
    },
    {
      title: 'Przykład na żywo (dvdrental)',
      code: "SELECT DISTINCT\n  rating,\n  rental_rate * 1.23 AS price_gross\nFROM film\nWHERE rental_rate > 1.00\nORDER BY price_gross DESC;",
      lines: [
        { line: 'FROM film WHERE rental_rate > 1.00', desc: 'Kroki 1–2 silnika: ładuje tabelę film i zostawia wiersze z ceną netto > 1.00.' },
        { line: 'SELECT ... rental_rate * 1.23 AS price_gross', desc: 'Krok 5 silnika: wylicza cenę brutto i nadaje jej alias price_gross.' },
        { line: 'DISTINCT', desc: 'Krok 6 silnika: usuwa powtarzające się pary (rating, price_gross).' },
        { line: 'ORDER BY price_gross DESC;', desc: 'Krok 7 silnika: sortuje po gotowym aliasie price_gross (który powstał w kroku 5).' }
      ]
    },
    {
      title: 'Sprawdź się przed zadaniami!',
      quiz: {
        question: 'W SELECT zdefiniowałeś alias `length / 60.0 AS hours`. Gdzie MOŻESZ użyć samej nazwy `hours` bez błędu w PostgreSQL?',
        options: [
          'Zarówno w WHERE, jak i w ORDER BY',
          'W klauzuli ORDER BY (bo wykonuje się w kroku 7, po kroku 5 SELECT), ale NIE w WHERE (krok 2)',
          'Tylko w klauzuli WHERE'
        ],
        correct: 1,
        explanation: 'Świetnie! WHERE (krok 2) wykonuje się przed SELECT (krok 5), więc nie zna jeszcze aliasów. ORDER BY (krok 7) działa po SELECT, dlatego widzi wszystkie aliasy.'
      }
    }
  ],
  p2_1: [
    {
      title: 'Jak zbudować zapytanie?',
      syntax: "SELECT\n  COUNT(*) AS wszystkie_wiersze,\n  COUNT(kolumna) AS niepuste_wiersze,\n  COUNT(DISTINCT kolumna) AS unikalne_wartosci\nFROM tabela\nGROUP BY klucz_grupy;",
      bullets: [
        '<strong><code>COUNT(*)</code>:</strong> liczy absolutnie wszystkie wiersze w grupie (nawet te zawierające <code>NULL</code>).',
        '<strong><code>COUNT(kolumna)</code>:</strong> pomija wartości <code>NULL</code>! Liczy tylko wiersze, w których dana kolumna ma wartość.',
        '<strong><code>COUNT(DISTINCT kolumna)</code>:</strong> liczy ile różnych (unikalnych) niepustych wartości występuje w kolumnie.',
        '<strong><code>IS NULL</code> / <code>IS NOT NULL</code>:</strong> jedyny poprawny sposób filtrowania pustych wartości w <code>WHERE</code>.'
      ]
    },
    {
      title: 'Kolejność pisania vs Kolejność wykonywania przez PostgreSQL',
      focusWrite: ['SELECT', 'FROM', 'WHERE', 'GROUP BY', 'ORDER BY'],
      focusExec: [1, 2, 3, 5, 7],
      note: '<strong>Dlaczego to ważne w Lekcji 2.1?</strong> Najpierw <code>2. WHERE</code> odrzuca niechciane wiersze (np. <code>WHERE return_date IS NULL</code>), następnie <code>3. GROUP BY</code> dzieli pozostałe wiersze na koszyki, a w kroku <code>5. SELECT</code> funkcje agregujące (<code>COUNT</code>) podliczają statystyki dla każdego koszyka.'
    },
    {
      title: 'Przykład na żywo (dvdrental)',
      code: "SELECT\n  staff_id,\n  COUNT(*) AS all_rentals,\n  COUNT(return_date) AS returned,\n  COUNT(*) - COUNT(return_date) AS missing\nFROM rental\nGROUP BY staff_id;",
      lines: [
        { line: 'FROM rental', desc: 'Krok 1 silnika: pobiera wszystkie wypożyczenia z tabeli rental.' },
        { line: 'GROUP BY staff_id', desc: 'Krok 3 silnika: dzieli wypożyczenia na grupy według pracownika (staff_id).' },
        { line: 'COUNT(*) AS all_rentals, COUNT(return_date) AS returned', desc: 'Krok 5 silnika: liczy wszystkie wypożyczenia pracownika oraz tylko te z wpisaną datą zwrotu.' },
        { line: 'COUNT(*) - COUNT(return_date) AS missing', desc: 'Krok 5 silnika: różnica daje dokładną liczbę filmów wciąż niezwróconych (gdzie return_date IS NULL).' }
      ]
    },
    {
      title: 'Sprawdź się przed zadaniami!',
      quiz: {
        question: 'Tabela `rental` ma 20 wierszy, z czego w 4 wierszach `return_date` wynosi NULL. Co zwróci `SELECT COUNT(*), COUNT(return_date) FROM rental`?',
        options: [
          '20 oraz 20 (bo COUNT zawsze liczy wszystkie wiersze)',
          '20 oraz 16 (bo COUNT(kolumna) pomija wartości NULL)',
          '16 oraz 4'
        ],
        correct: 1,
        explanation: 'Tak jest! COUNT(*) zlicza wszystkie 20 wierszy, natomiast COUNT(return_date) ignoruje 4 wiersze z wartością NULL i zwraca 16.'
      }
    }
  ],
  p2_2: [
    {
      title: 'Jak zbudować zapytanie?',
      syntax: "SELECT kolumna_grupy, SUM(kwota) AS suma, AVG(dlugosc) AS srednia\nFROM tabela\nWHERE pojedynczy_wiersz > 0\nGROUP BY kolumna_grupy\nHAVING SUM(kwota) > 10.00\nORDER BY suma DESC;",
      bullets: [
        '<strong><code>GROUP BY</code>:</strong> zwija wiersze o tym samym kluczu w jeden wiersz podsumowania (koszyk).',
        '<strong>Złota zasada:</strong> każda kolumna z <code>SELECT</code> niebędąca w funkcji agregującej (<code>SUM</code>, <code>COUNT</code>, <code>AVG</code>, <code>MIN</code>, <code>MAX</code>) musi być w <code>GROUP BY</code>.',
        '<strong><code>WHERE</code> vs <code>HAVING</code>:</strong> <code>WHERE</code> filtruje pojedyncze wiersze <em>przed</em> grupowaniem; <code>HAVING</code> filtruje całe grupy <em>po</em> agregacji.'
      ]
    },
    {
      title: 'Kolejność pisania vs Kolejność wykonywania przez PostgreSQL',
      focusWrite: ['SELECT', 'FROM', 'WHERE', 'GROUP BY', 'HAVING', 'ORDER BY'],
      focusExec: [1, 2, 3, 4, 5, 7],
      note: '<strong>Spójrz na kroki 2 → 3 → 4 → 5!</strong> W kroku <code>2. WHERE</code> grupy jeszcze nie istnieją, dlatego zapis <code>WHERE SUM(amount) > 10</code> wywoła błąd składni. Dopiero po kroku <code>3. GROUP BY</code> wchodzi <code>4. HAVING</code>, który odsiewa koszyki niespełniające warunku agregacji!'
    },
    {
      title: 'Przykład na żywo (dvdrental)',
      code: "SELECT customer_id, SUM(amount) AS total_paid, COUNT(*) AS cnt\nFROM payment\nWHERE amount >= 2.99\nGROUP BY customer_id\nHAVING SUM(amount) > 10.00\nORDER BY total_paid DESC;",
      lines: [
        { line: 'WHERE amount >= 2.99', desc: 'Krok 2 silnika: odrzuca drobne pojedyncze transakcje poniżej 2.99 jeszcze przed grupowaniem.' },
        { line: 'GROUP BY customer_id', desc: 'Krok 3 silnika: grupuje pozostałe płatności w koszyki dla każdego klienta.' },
        { line: 'HAVING SUM(amount) > 10.00', desc: 'Krok 4 silnika: zostawia tylko tych klientów, których suma w koszyku przekracza 10.00.' },
        { line: 'SELECT ... ORDER BY total_paid DESC;', desc: 'Kroki 5 i 7 silnika: wyświetla wynikowe kolumny i sortuje od najlepszego klienta.' }
      ]
    },
    {
      title: 'Sprawdź się przed zadaniami!',
      quiz: {
        question: 'Chcesz odrzucić płatności mniejsze niż 2.00, a następnie zostawić tylko klientów, którzy wydali łącznie ponad 15.00. Jak rozdzielisz te warunki?',
        options: [
          'Oba warunki wpiszę w WHERE: `WHERE amount >= 2.00 AND SUM(amount) > 15.00`',
          '`WHERE amount >= 2.00` (krok 2 przed GROUP BY) oraz `HAVING SUM(amount) > 15.00` (krok 4 po GROUP BY)',
          'Oba warunki wpiszę w HAVING'
        ],
        correct: 1,
        explanation: 'Perfekcyjnie! Pojedyncze wiersze filtrujemy w WHERE (krok 2), a zagregowane koszyki po GROUP BY (krok 3) filtrujemy w HAVING (krok 4).'
      }
    }
  ],
  p3_1: [
    {
      title: 'Jak zbudować zapytanie?',
      syntax: "SELECT c.name, COUNT(f.film_id) AS film_cnt\nFROM category c\nJOIN film_category fc ON c.category_id = fc.category_id\nJOIN film f ON fc.film_id = f.film_id\nWHERE f.length > 60\nGROUP BY c.name;",
      bullets: [
        '<strong><code>JOIN ... ON ...</code> (<code>INNER JOIN</code>):</strong> łączy wiersze z dwóch tabel tam, gdzie klucze (np. <code>🔗 category_id</code>) są sobie równe.',
        '<strong>Tylko wspólne dopasowania:</strong> jeśli wiersz nie ma pary w drugiej tabeli, <code>INNER JOIN</code> go pomija.',
        '<strong>Aliasy tabel:</strong> nadawaj krótkie aliasy w <code>FROM</code>/<code>JOIN</code> (np. <code>category c</code>) i używaj ich w całym zapytaniu (<code>c.name</code>).'
      ]
    },
    {
      title: 'Kolejność pisania vs Kolejność wykonywania przez PostgreSQL',
      focusWrite: ['SELECT', 'FROM', 'JOIN', 'WHERE', 'GROUP BY', 'ORDER BY'],
      focusExec: [1, 2, 3, 5, 7],
      note: '<strong>Dlaczego aliasy tabel z <code>FROM/JOIN</code> działają wszędzie?</strong> Ponieważ <code>1. FROM / JOIN</code> to absolutnie pierwszy krok wykonywany przez PostgreSQL! Gdy podasz <code>FROM customer c JOIN payment p</code> w kroku 1, aliasy <code>c</code> oraz <code>p</code> są od razu widoczne w <code>2. WHERE</code>, <code>3. GROUP BY</code>, <code>5. SELECT</code> i <code>7. ORDER BY</code>.'
    },
    {
      title: 'Przykład na żywo (dvdrental)',
      code: "SELECT c.name, COUNT(f.film_id) AS films, AVG(f.rental_rate) AS avg_rate\nFROM category c\nJOIN film_category fc ON c.category_id = fc.category_id\nJOIN film f ON fc.film_id = f.film_id\nWHERE f.length > 60\nGROUP BY c.name\nORDER BY films DESC;",
      lines: [
        { line: 'FROM category c JOIN film_category fc ... JOIN film f ...', desc: 'Krok 1 silnika: skleja 3 tabele po kluczach category_id oraz film_id.' },
        { line: 'WHERE f.length > 60', desc: 'Krok 2 silnika: zostawia tylko połączone wiersze filmów dłuższych niż 60 minut.' },
        { line: 'GROUP BY c.name', desc: 'Krok 3 silnika: grupuje wynik po nazwie kategorii.' },
        { line: 'SELECT c.name, COUNT(...) ... ORDER BY films DESC;', desc: 'Kroki 5 i 7 silnika: oblicza liczbę filmów i średnią cenę dla każdej kategorii oraz sortuje.' }
      ]
    },
    {
      title: 'Sprawdź się przed zadaniami!',
      quiz: {
        question: 'Dlaczego alias tabeli nadany w `FROM customer c` możemy użyć w `WHERE c.store_id = 1`, podczas gdy aliasu kolumny z `SELECT` nie można użyć w `WHERE`?',
        options: [
          'Ponieważ FROM/JOIN wykonuje się jako Krok 1 (przed Krok 2 WHERE), a SELECT dopiero jako Krok 5',
          'To kwestia przypadku w składni SQL',
          'Aliasów tabel nie wolno używać w WHERE'
        ],
        correct: 0,
        explanation: 'Dokładnie tak! Krok 1 (FROM/JOIN) tworzy przestrzeń nazw tabel dla całego zapytania, więc w Kroku 2 (WHERE) aliasy tabel są już doskonale znane.'
      }
    }
  ],
  p3_2: [
    {
      title: 'Jak zbudować zapytanie?',
      syntax: "-- 1) Anti-Join (szukanie wierszy bez pary):\nSELECT c.customer_id, c.first_name\nFROM customer c\nLEFT JOIN rental r ON c.customer_id = r.customer_id\nWHERE r.rental_id IS NULL;\n\n-- 2) Pełna lista z 0 dla braków:\nSELECT c.first_name, COUNT(r.rental_id) AS cnt, COALESCE(SUM(p.amount), 0) AS total ...",
      bullets: [
        '<strong><code>LEFT JOIN</code>:</strong> zachowuje 100% wierszy z lewej tabeli. Gdy w prawej tabeli brak dopasowania, jej kolumny wypełniane są przez <code>NULL</code>.',
        '<strong>Anti-Join (<code>WHERE prawa.id IS NULL</code>):</strong> wyłapuje rekordy z lewej tabeli, które nie mają ani jednego powiązania w prawej tabeli.',
        '<strong><code>COUNT(prawa.id)</code> vs <code>COUNT(*)</code>:</strong> przy <code>LEFT JOIN</code> zawsze licz klucz prawej tabeli, aby dla braku pary otrzymać <code>0</code> (a nie <code>1</code>!).'
      ]
    },
    {
      title: 'Kolejność pisania vs Kolejność wykonywania przez PostgreSQL',
      focusWrite: ['SELECT', 'FROM', 'JOIN', 'WHERE', 'GROUP BY'],
      focusExec: [1, 2, 3, 5],
      note: '<strong>Uwaga na pułapkę Krok 1 (<code>LEFT JOIN ON</code>) vs Krok 2 (<code>WHERE</code>)!</strong> Jeśli chcesz pokazać wszystkich klientów wraz z liczbą wypożyczeń w czerwcu (w tym <code>0</code>), warunek daty <code>r.rental_date >= \'2026-06-01\'</code> musisz wpisać wewnątrz <code>ON</code> (Krok 1). Wpisanie go w <code>WHERE</code> (Krok 2) wytnie wiersze z <code>NULL</code> i zamieni <code>LEFT JOIN</code> w <code>INNER JOIN</code>!'
    },
    {
      title: 'Przykład na żywo (dvdrental)',
      code: "SELECT\n  c.customer_id,\n  c.first_name,\n  COUNT(r.rental_id) AS june_cnt\nFROM customer c\nLEFT JOIN rental r\n  ON r.customer_id = c.customer_id\n  AND r.rental_date >= '2026-06-01'\nWHERE c.store_id = 2\nGROUP BY c.customer_id, c.first_name;",
      lines: [
        { line: "LEFT JOIN rental r ON r.customer_id = c.customer_id AND r.rental_date >= '2026-06-01'", desc: 'Krok 1 silnika: dokleja tylko czerwcowe wypożyczenia, ale zachowuje wszystkich klientów (reszta ma NULL).' },
        { line: 'WHERE c.store_id = 2', desc: 'Krok 2 silnika: bezpiecznie filtruje lewą tabelę customer (sklep nr 2).' },
        { line: 'GROUP BY c.customer_id, c.first_name', desc: 'Krok 3 silnika: grupuje po kliencie.' },
        { line: 'COUNT(r.rental_id) AS june_cnt', desc: 'Krok 5 silnika: dla klientów z NULL w r.rental_id zwraca dokładne 0!' }
      ]
    },
    {
      title: 'Sprawdź się przed zadaniami!',
      quiz: {
        question: 'Robisz `customer c LEFT JOIN rental r ON c.customer_id = r.customer_id`. Co się stanie, jeśli w SELECT napiszesz `COUNT(*)` zamiast `COUNT(r.rental_id)`?',
        options: [
          'Klienci bez żadnego wypożyczenia otrzymają wynik 1 zamiast 0 (bo COUNT(*) policzy wiersz klienta z NULL-ami)',
          'Zapytanie zwróci błąd składni',
          'Wynik będzie identyczny w obu przypadkach'
        ],
        correct: 0,
        explanation: 'Strzał w dziesiątkę! Po LEFT JOIN klient bez wypożyczeń nadal tworzy 1 wiersz (z NULL w kolumnach rental). COUNT(*) policzy ten wiersz jako 1, a COUNT(r.rental_id) pominie NULL i zwróci poprawne 0.'
      }
    }
  ],
  p4_1: [
    {
      title: 'Jak zbudować zapytanie?',
      syntax: "SELECT\n  CASE\n    WHEN length < 70 THEN 'Krotki'\n    WHEN length <= 120 THEN 'Sredni'\n    ELSE 'Dlugi'\n  END AS segment,\n  COUNT(*) FILTER (WHERE rental_rate = 4.99) * 100.0 / COUNT(*) AS pct\nFROM film\nGROUP BY 1;",
      bullets: [
        '<strong><code>CASE WHEN ... THEN ... ELSE ... END</code>:</strong> tworzy nową kolumnę warunkową lub pozwala agregować wybrane wiersze.',
        '<strong><code>FILTER (WHERE warunek)</code>:</strong> czytelna składnia PostgreSQL zliczająca do agregatu tylko wiersze spełniające warunek.',
        '<strong><code>* 100.0</code> oraz <code>ROUND(x, 2)</code>:</strong> mnożenie przez <code>100.0</code> wymusza typ ułamkowy przy liczeniu procentów.'
      ]
    },
    {
      title: 'Kolejność pisania vs Kolejność wykonywania przez PostgreSQL',
      focusWrite: ['SELECT', 'FROM', 'JOIN', 'GROUP BY', 'ORDER BY'],
      focusExec: [1, 3, 5, 7],
      note: '<strong>Dlaczego w <code>CASE WHEN</code> możemy używać funkcji agregujących?</strong> Ponieważ wyrażenia w <code>5. SELECT</code> wykonywane są już <em>po</em> <code>3. GROUP BY</code>! Dzięki temu w kroku 5 możesz zarówno sklasyfikować pojedyncze wiersze, jak i zbudować etykietę dla całej grupy, np. <code>CASE WHEN SUM(amount) > 35 THEN \'Lider\' ELSE \'Standard\' END</code>.'
    },
    {
      title: 'Przykład na żywo (dvdrental)',
      code: "SELECT\n  c.name,\n  COUNT(*) AS total,\n  COUNT(*) FILTER (WHERE f.rental_rate = 4.99) AS premium,\n  ROUND(COUNT(*) FILTER (WHERE f.rental_rate = 4.99) * 100.0 / COUNT(*), 2) AS premium_pct\nFROM category c\nJOIN film_category fc ON fc.category_id = c.category_id\nJOIN film f ON f.film_id = fc.film_id\nGROUP BY c.name\nORDER BY premium_pct DESC;",
      lines: [
        { line: 'FROM category c JOIN film_category fc ... JOIN film f ...', desc: 'Krok 1 silnika: łączy kategorie z przypisanymi filmami.' },
        { line: 'GROUP BY c.name', desc: 'Krok 3 silnika: tworzy koszyk dla każdej kategorii.' },
        { line: 'COUNT(*) FILTER (WHERE f.rental_rate = 4.99)', desc: 'Krok 5 silnika: wewnątrz każdej kategorii liczy tylko filmy z ceną 4.99.' },
        { line: 'ROUND(... * 100.0 / COUNT(*), 2)', desc: 'Krok 5 silnika: wylicza dokładny udział procentowy i zaokrągla do 2 miejsc po przecinku.' }
      ]
    },
    {
      title: 'Sprawdź się przed zadaniami!',
      quiz: {
        question: 'Dlaczego licząc udział procentowy piszemy `COUNT(*) FILTER (...) * 100.0 / COUNT(*)` z kropką w `100.0`?',
        options: [
          'Ponieważ COUNT(*) zwraca liczbę całkowitą (BIGINT) i bez 100.0 dzielenie całkowite obcięłoby część ułamkową',
          'Kropka w 100.0 jest wymagana przez klauzulę GROUP BY',
          'Bez 100.0 funkcja FILTER nie zadziała'
        ],
        correct: 0,
        explanation: 'Brawo! Dzielenie dwóch liczb całkowitych w SQL obcina ułamki. Mnożenie przez 100.0 zamienia licznik na typ NUMERIC i gwarantuje dokładny wynik zmiennoprzecinkowy.'
      }
    }
  ],
  p4_2: [
    {
      title: 'Jak zbudować zapytanie?',
      syntax: "SELECT kolumna1, kolumna2 FROM tabela_A WHERE ...\nUNION ALL -- lub UNION / INTERSECT / EXCEPT\nSELECT kolumna1, kolumna2 FROM tabela_B WHERE ...\nORDER BY kolumna1;",
      bullets: [
        '<strong><code>UNION ALL</code> vs <code>UNION</code>:</strong> łączą wiersze dwóch zapytań pod sobą. <code>UNION ALL</code> zachowuje wszystkie wiersze (szybszy), a <code>UNION</code> usuwa duplikaty.',
        '<strong><code>INTERSECT</code>:</strong> zwraca część wspólną (rekordy obecne jednocześnie w górnym i dolnym zapytaniu).',
        '<strong><code>EXCEPT</code>:</strong> zwraca różnicę zbiorów (rekordy z pierwszego zapytania, które nie występują w drugim).'
      ]
    },
    {
      title: 'Kolejność pisania vs Kolejność wykonywania przez PostgreSQL',
      focusWrite: ['SELECT', 'FROM', 'WHERE', 'ORDER BY'],
      focusExec: [1, 2, 5, 6, 7],
      note: '<strong>Jak PostgreSQL wykonuje operatory zbiorowe?</strong> Każde składowe zapytanie <code>SELECT</code> przechodzi niezależnie przez kroki <code>1. FROM</code> → <code>2. WHERE</code> → <code>3. GROUP BY</code> → <code>5. SELECT</code>. Następnie operator (<code>UNION</code> / <code>INTERSECT</code> / <code>EXCEPT</code>) łączy oba zbiory wynikowe, a wspólne <code>7. ORDER BY</code> na samym końcu sortuje połączoną tabelę!'
    },
    {
      title: 'Przykład na żywo (dvdrental)',
      code: "SELECT f.title\nFROM film f\nJOIN rental r ON r.film_id = f.film_id\nWHERE r.rental_date < '2026-06-01'\nINTERSECT\nSELECT f.title\nFROM film f\nJOIN rental r ON r.film_id = f.film_id\nWHERE r.rental_date >= '2026-06-01'\nORDER BY title;",
      lines: [
        { line: "SELECT f.title ... WHERE r.rental_date < '2026-06-01'", desc: 'Zapytanie 1 (Kroki 1–5): wyznacza zbiór tytułów wypożyczonych w maju.' },
        { line: 'INTERSECT', desc: 'Operator zbiorowy: zostawia tylko tytuły występujące w OBU zbiorach.' },
        { line: "SELECT f.title ... WHERE r.rental_date >= '2026-06-01'", desc: 'Zapytanie 2 (Kroki 1–5): wyznacza zbiór tytułów wypożyczonych w czerwcu.' },
        { line: 'ORDER BY title;', desc: 'Krok 7 silnika: jedno wspólne sortowanie na samym końcu dla całego wyniku.' }
      ]
    },
    {
      title: 'Sprawdź się przed zadaniami!',
      quiz: {
        question: 'Gdzie umieszczamy klauzulę `ORDER BY`, gdy łączymy dwa zapytania za pomocą `UNION` lub `INTERSECT`?',
        options: [
          'Tylko raz, na samym końcu po drugim zapytaniu SELECT',
          'Wewnątrz pierwszego zapytania przed słowem UNION',
          'Przed każdym słowem SELECT'
        ],
        correct: 0,
        explanation: 'Dokładnie! Najpierw oba zapytania zwracają swoje wiersze i są łączone przez UNION/INTERSECT, a pojedyncze ORDER BY na samym końcu sortuje finalny wynik.'
      }
    }
  ],
  p5_1: [
    {
      title: 'Jak zbudować zapytanie?',
      syntax: "WITH ranked AS (\n  SELECT\n    rating, title, length,\n    DENSE_RANK() OVER (PARTITION BY rating ORDER BY length DESC) AS rnk\n  FROM film\n)\nSELECT rating, title, length\nFROM ranked\nWHERE rnk <= 2;",
      bullets: [
        '<strong>CTE (<code>WITH nazwa AS (...)</code>):</strong> definiuje czytelny krok pośredni (tymczasową tabelę), do której odwołujesz się w głównym <code>SELECT</code>.',
        '<strong><code>OVER (PARTITION BY ... ORDER BY ...)</code>:</strong> liczy ranking osobno dla każdej partycji (np. każdego <code>rating</code>), nie zwijając wierszy.',
        '<strong><code>ROW_NUMBER</code> (1,2,3) vs <code>RANK</code> (1,1,3) vs <code>DENSE_RANK</code> (1,1,2):</strong> wybierasz zależnie od tego, jak chcesz traktować remisy.'
      ]
    },
    {
      title: 'Kolejność pisania vs Kolejność wykonywania przez PostgreSQL',
      focusWrite: ['SELECT', 'FROM', 'WHERE', 'GROUP BY', 'ORDER BY'],
      focusExec: [1, 2, 3, 5, 7],
      note: '<strong>Dlaczego funkcji okna NIE WOLNO wpisać bezpośrednio w <code>WHERE</code>?</strong> Spójrz na schemat: <code>2. WHERE</code> działa na samym początku, a funkcje okna (<code>ROW_NUMBER() OVER ...</code>) są obliczane dopiero w kroku <code>5. SELECT</code>! Dlatego funkcję okna wyliczamy w CTE (wewnętrzny Krok 5), a w zapytaniu zewnętrznym filtrujemy gotową kolumnę przez <code>WHERE rnk <= 2</code>!'
    },
    {
      title: 'Przykład na żywo (dvdrental)',
      code: "WITH ranked AS (\n  SELECT\n    customer_id, payment_id, amount,\n    ROW_NUMBER() OVER (\n      PARTITION BY customer_id\n      ORDER BY amount DESC, payment_id ASC\n    ) AS rn\n  FROM payment\n)\nSELECT customer_id, payment_id, amount\nFROM ranked\nWHERE rn <= 2;",
      lines: [
        { line: 'WITH ranked AS (...)', desc: 'Definiuje tabelę tymczasową CTE o nazwie ranked.' },
        { line: 'PARTITION BY customer_id ORDER BY amount DESC, payment_id ASC', desc: 'Krok 5 wewnątrz CTE: numeruje płatności osobno dla każdego klienta od najwyższej kwoty.' },
        { line: 'FROM ranked WHERE rn <= 2;', desc: 'Kroki 1–2 zapytania głównego: pobiera wynik z CTE i zostawia tylko 2 najwyższe płatności każdego klienta.' }
      ]
    },
    {
      title: 'Sprawdź się przed zadaniami!',
      quiz: {
        question: 'Dlaczego zapytanie `SELECT title FROM film WHERE ROW_NUMBER() OVER (ORDER BY length DESC) = 1` zakończy się błędem?',
        options: [
          'Ponieważ WHERE wykonuje się w Kroku 2, a funkcje okna obliczane są dopiero w Kroku 5 (SELECT) — należy użyć CTE',
          'Ponieważ w PostgreSQL nie istnieje funkcja ROW_NUMBER()',
          'Ponieważ brakuje klauzuli GROUP BY'
        ],
        correct: 0,
        explanation: 'Znakomicie! Funkcje okna uruchamiają się dopiero w Kroku 5 (SELECT). Zamknięcie ich w CTE pozwala odfiltrować wynik w Kroku 2 (WHERE) zapytania zewnętrznego.'
      }
    }
  ],
  p5_2: [
    {
      title: 'Jak zbudować zapytanie?',
      syntax: "WITH m_rev AS (\n  SELECT DATE_TRUNC('month', payment_date) AS m, SUM(amount) AS rev\n  FROM payment\n  GROUP BY 1\n)\nSELECT\n  m, rev,\n  LAG(rev) OVER (ORDER BY m) AS prev_rev,\n  SUM(rev) OVER (ORDER BY m) AS running_total\nFROM m_rev;",
      bullets: [
        '<strong><code>SUM(x) OVER (ORDER BY ...)</code>:</strong> liczy sumę narastającą (Running Total) wiersz po wierszu.',
        '<strong><code>SUM(x) OVER ()</code>:</strong> puste nawiasy liczą sumę z całego zbioru (idealne do mianownika udziału procentowego).',
        '<strong><code>LAG(kolumna) OVER (ORDER BY ...)</code>:</strong> pobiera wartość z poprzedniego wiersza (porównania okres-do-okresu MoM).'
      ]
    },
    {
      title: 'Kolejność pisania vs Kolejność wykonywania przez PostgreSQL',
      focusWrite: ['SELECT', 'FROM', 'WHERE', 'GROUP BY', 'ORDER BY'],
      focusExec: [1, 2, 3, 5, 7],
      note: '<strong>Jak współgrają <code>3. GROUP BY</code> oraz funkcje okna w <code>5. SELECT</code>?</strong> Ponieważ <code>3. GROUP BY</code> wykonuje się przed <code>5. SELECT</code>, możesz w jednym zapytaniu najpierw pogrupować wiersze, a w <code>SELECT</code> użyć <code>SUM(COUNT(*)) OVER ()</code>! Podobnie przy <code>LAG()</code>: jeśli chcesz porównać czerwiec z majem, najpierw wylicz <code>LAG()</code> w CTE (Krok 5), a dopiero w zewnętrznym zapytaniu daj <code>WHERE miesiac = \'2026-06-01\'</code>!'
    },
    {
      title: 'Przykład na żywo (dvdrental)',
      code: "SELECT\n  rating,\n  COUNT(*) AS cnt,\n  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) AS share_pct\nFROM film\nGROUP BY rating\nORDER BY cnt DESC;",
      lines: [
        { line: 'FROM film GROUP BY rating', desc: 'Kroki 1 i 3 silnika: dzieli filmy na grupy według ratingu.' },
        { line: 'COUNT(*) AS cnt', desc: 'Krok 5a silnika (agregacja): liczy filmy w danym ratingu.' },
        { line: 'SUM(COUNT(*)) OVER ()', desc: 'Krok 5b silnika (okno po agregacji): sumuje liczebności wszystkich ratingów (mianownik procentu).' },
        { line: 'ORDER BY cnt DESC;', desc: 'Krok 7 silnika: sortuje wynik od najliczniejszego ratingu.' }
      ]
    },
    {
      title: 'Sprawdź się przed zadaniami!',
      quiz: {
        question: 'Chcesz porównać przychód z czerwca z majem używając `LAG(rev) OVER (ORDER BY m)`. Co się stanie, jeśli dasz `WHERE m = \'2026-06-01\'` w tym samym zapytaniu przed wyliczeniem `LAG()`?',
        options: [
          'WHERE (Krok 2) wytnie maj zanim uruchomi się LAG() w SELECT (Krok 5), więc poprzedni miesiąc wyniesie NULL!',
          'LAG() i tak odczyta usunięte przez WHERE wiersze z maja',
          'Zapytanie zwróci sumę z obu miesięcy'
        ],
        correct: 0,
        explanation: 'Dokładnie! WHERE działa w Kroku 2, więc odetnie wiersz majowy zanim Krok 5 (SELECT) policzy LAG(). Dlatego LAG() liczymy w CTE, a filtr na czerwiec dajemy w zapytaniu zewnętrznym!'
      }
    }
  ],
  p5_3: [
    {
      title: 'Jak zbudować zapytanie?',
      syntax: "SELECT\n  d::date AS dzien,\n  COUNT(r.rental_id) AS wypozyczenia,\n  COALESCE(SUM(p.amount), 0) AS przychod\nFROM generate_series('2026-05-01'::date, '2026-05-07'::date, '1 day') AS d\nLEFT JOIN rental r ON r.rental_date = d::date\nLEFT JOIN payment p ON p.rental_id = r.rental_id\nGROUP BY 1\nORDER BY 1;",
      bullets: [
        '<strong><code>generate_series(start, stop, krok)</code>:</strong> tworzy ciągłą tabelę dat lub liczb w sekcji <code>FROM</code> (brak dziur w kalendarzu!).',
        '<strong><code>DATE_TRUNC(\'month\', data)</code>:</strong> zaokrągla datę w dół do początku miesiąca/tygodnia.',
        '<strong><code>data + INTERVAL \'5 days\'</code>:</strong> bezpieczna arytmetyka kalendarzowa w PostgreSQL.'
      ]
    },
    {
      title: 'Kolejność pisania vs Kolejność wykonywania przez PostgreSQL',
      focusWrite: ['SELECT', 'FROM', 'JOIN', 'GROUP BY', 'ORDER BY'],
      focusExec: [1, 3, 5, 7],
      note: '<strong>Dlaczego kalendarz <code>generate_series</code> dajemy w <code>1. FROM</code> przed <code>LEFT JOIN</code>?</strong> W kroku <code>1. FROM / LEFT JOIN</code> PostgreSQL generuje pełną oś czasu po lewej stronie i dokleja do niej zdarzenia. Następnie <code>3. GROUP BY</code> tworzy grupę dla każdego dnia kalendarza, a w <code>5. SELECT</code> funkcje <code>COUNT(r.rental_id)</code> oraz <code>COALESCE(SUM(...), 0)</code> zamieniają puste dni na eleganckie zera!'
    },
    {
      title: 'Przykład na żywo (dvdrental)',
      code: "SELECT\n  d::date AS d,\n  COUNT(r.rental_id) AS cnt,\n  SUM(COUNT(r.rental_id)) OVER (ORDER BY d) AS running_cnt\nFROM generate_series('2026-05-01'::date, '2026-05-07'::date, '1 day') AS d\nLEFT JOIN rental r ON r.rental_date = d::date\nGROUP BY d\nORDER BY d;",
      lines: [
        { line: "FROM generate_series('2026-05-01'::date, '2026-05-07'::date, '1 day') AS d", desc: 'Krok 1a silnika: tworzy 7 wierszy dla każdego dnia od 1 do 7 maja.' },
        { line: 'LEFT JOIN rental r ON r.rental_date = d::date', desc: 'Krok 1b silnika: dopasowuje wypożyczenia do dni (dni bez ruchu dostają NULL).' },
        { line: 'GROUP BY d', desc: 'Krok 3 silnika: grupuje wiersze po dniu kalendarzowym.' },
        { line: 'COUNT(r.rental_id) AS cnt, SUM(COUNT(r.rental_id)) OVER (ORDER BY d)', desc: 'Krok 5 silnika: liczy wypożyczenia danego dnia (z zerami) oraz sumę narastającą od początku miesiąca.' }
      ]
    },
    {
      title: 'Sprawdź się przed zadaniami!',
      quiz: {
        question: 'Jak wyświetlić pełny 7-dniowy raport sprzedaży z zerami dla dni, w których żaden klient nic nie kupił?',
        options: [
          'Zrobić zwykłe `SELECT payment_date, SUM(amount) FROM payment GROUP BY payment_date`',
          'Umieścić `generate_series(...) AS d` po lewej stronie `LEFT JOIN payment p ON p.payment_date = d::date` i użyć `COALESCE(SUM(p.amount), 0)`',
          'Użyć INNER JOIN między generate_series a tabelą payment'
        ],
        correct: 1,
        explanation: 'Rewelacja! Wygenerowany w FROM kalendarz połączony przez LEFT JOIN z tabelą transakcji gwarantuje obecność każdego dnia, a COALESCE(SUM(...), 0) zamienia brak sprzedaży na 0.'
      }
    }
  ]
};

PATH_TASKS.forEach(function(t) {
  if (LESSON_TUTORIALS[t.id]) {
    t.slides = LESSON_TUTORIALS[t.id];
  }
});

window.STAGES = STAGES;
window.PATH_TASKS = PATH_TASKS;
window.DIAG_QUESTIONS = DIAG_QUESTIONS;
window.LESSON_TUTORIALS = LESSON_TUTORIALS;


