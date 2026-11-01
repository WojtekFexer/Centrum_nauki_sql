/* ==========================================================================
   3. ŚCIEŻKA NAUKI: 12 LEKCJI × 5 WARIANTÓW = 60 DYNAMICZNYCH ZADAŃ
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
    variants: [
      { prompt: 'Z tabeli `film` wybierz `title` oraz `rental_rate` dla filmów o ratingu `\'PG-13\'` i cenie `rental_rate = 4.99`. Posortuj alfabetycznie po `title`.', sol: "SELECT title, rental_rate FROM film WHERE rating = 'PG-13' AND rental_rate = 4.99 ORDER BY title;", order: true },
      { prompt: 'Z tabeli `film` wybierz `title` oraz `length` dla filmów o ratingu `\'R\'`, które trwają krócej niż `80` minut (`length < 80`). Posortuj rosnąco po `length`.', sol: "SELECT title, length FROM film WHERE rating = 'R' AND length < 80 ORDER BY length ASC;", order: true },
      { prompt: 'Z tabeli `payment` wybierz `payment_id`, `customer_id` oraz `amount` dla płatności powyżej `5.00` (`amount > 5.00`) obsłużonych przez pracownika `staff_id = 2`. Posortuj malejąco po `amount`.', sol: "SELECT payment_id, customer_id, amount FROM payment WHERE amount > 5.00 AND staff_id = 2 ORDER BY amount DESC;", order: true },
      { prompt: 'Z tabeli `customer` wybierz `customer_id`, `first_name` oraz `email` dla aktywnych klientów (`active = 1`) przypisanych do sklepu `store_id = 2`. Posortuj po `customer_id`.', sol: "SELECT customer_id, first_name, email FROM customer WHERE active = 1 AND store_id = 2 ORDER BY customer_id;", order: true },
      { prompt: 'Z tabeli `rental` wybierz `rental_id`, `customer_id` oraz `rental_date` dla wypożyczeń obsłużonych przez pracownika `staff_id = 1` w czerwcu (`rental_date >= \'2026-06-01\'`). Posortuj po `rental_id`.', sol: "SELECT rental_id, customer_id, rental_date FROM rental WHERE staff_id = 1 AND rental_date >= '2026-06-01' ORDER BY rental_id;", order: true }
    ]
  },
  {
    id: 'p1_2', stage: 1, title: '1.2 Zakresy IN, BETWEEN, ILIKE oraz LIMIT',
    tables: ['film', 'customer', 'actor', 'payment'],
    cols: ['title', 'rating', 'length', 'replacement_cost', 'film', 'customer', 'actor', 'first_name', 'last_name', 'BETWEEN', 'IN', 'ILIKE', 'LIMIT'],
    variants: [
      { prompt: 'Z tabeli `film` wypisz `title`, `rating` oraz `length` dla filmów o ratingu `\'G\'` lub `\'PG\'`, których długość (`length`) mieści się w przedziale od `100` do `140` minut. Posortuj malejąco po `length` i ogranicz wynik do `4` wierszy.', sol: "SELECT title, rating, length FROM film WHERE rating IN ('G', 'PG') AND length BETWEEN 100 AND 140 ORDER BY length DESC LIMIT 4;", order: true },
      { prompt: 'Z tabeli `film` wypisz `title` i `replacement_cost` dla filmów o ratingu `\'NC-17\'`, których koszt odtworzenia (`replacement_cost`) jest między `18.00` a `25.00`. Posortuj rosnąco po `title`.', sol: "SELECT title, replacement_cost FROM film WHERE rating = 'NC-17' AND replacement_cost BETWEEN 18.00 AND 25.00 ORDER BY title ASC;", order: true },
      { prompt: 'Z tabeli `actor` wybierz `actor_id`, `first_name` i `last_name` dla aktorów, których imię zaczyna się na literę `\'J\'` lub `\'P\'` (użyj `ILIKE` lub `LIKE`). Posortuj po `actor_id`.', sol: "SELECT actor_id, first_name, last_name FROM actor WHERE first_name ILIKE 'J%' OR first_name ILIKE 'P%' ORDER BY actor_id;", order: true },
      { prompt: 'Z tabeli `payment` wybierz 3 najwyższe płatności (`payment_id`, `amount`) dokonane w maju 2026 (`payment_date BETWEEN \'2026-05-01\' AND \'2026-05-31\'`). W razie remisu kwoty sortuj rosnąco po `payment_id`.', sol: "SELECT payment_id, amount FROM payment WHERE payment_date BETWEEN '2026-05-01' AND '2026-05-31' ORDER BY amount DESC, payment_id ASC LIMIT 3;", order: true },
      { prompt: 'Z tabeli `customer` wybierz `customer_id`, `first_name`, `last_name` dla klientów o identyfikatorach z listy `(1, 3, 5, 7, 9)`. Posortuj alfabetycznie po `first_name`.', sol: "SELECT customer_id, first_name, last_name FROM customer WHERE customer_id IN (1, 3, 5, 7, 9) ORDER BY first_name ASC;", order: true }
    ]
  },
  {
    id: 'p1_3', stage: 1, title: '1.3 Unikalne wartości (DISTINCT) i wyliczenia arytmetyczne',
    tables: ['film', 'rental', 'payment'],
    cols: ['DISTINCT', 'film', 'rental', 'payment', 'rating', 'rental_rate', 'replacement_cost', 'customer_id'],
    variants: [
      { prompt: 'Z tabeli `film` wypisz unikalne kombinacje `rating` oraz `rental_rate` (użyj `DISTINCT`). Posortuj rosnąco po `rating` i `rental_rate`.', sol: "SELECT DISTINCT rating, rental_rate FROM film ORDER BY rating ASC, rental_rate ASC;", order: true },
      { prompt: 'Z tabeli `film` wybierz `title`, `rental_rate`, `replacement_cost` oraz stosunek kosztu odtworzenia do ceny wypożyczenia (`replacement_cost / rental_rate`) dla filmów o ratingu `\'G\'`. Posortuj po `title`.', sol: "SELECT title, rental_rate, replacement_cost, replacement_cost / rental_rate AS ratio FROM film WHERE rating = 'G' ORDER BY title;", order: true },
      { prompt: 'Z tabeli `rental` wypisz unikalne identyfikatory klientów (`DISTINCT customer_id`), którzy wypożyczyli film w czerwcu 2026 (`rental_date >= \'2026-06-01\'`). Posortuj rosnąco.', sol: "SELECT DISTINCT customer_id FROM rental WHERE rental_date >= '2026-06-01' ORDER BY customer_id ASC;", order: true },
      { prompt: 'Z tabeli `film` wybierz `title` oraz czas trwania przeliczony na godziny zmiennoprzecinkowe (`length / 60.0`) dla 5 najdłuższych filmów.', sol: "SELECT title, length / 60.0 AS hours FROM film ORDER BY length DESC LIMIT 5;", order: true },
      { prompt: 'Z tabeli `payment` wypisz unikalne kwoty płatności (`DISTINCT amount`) występujące w bazie, posortowane malejąco.', sol: "SELECT DISTINCT amount FROM payment ORDER BY amount DESC;", order: true }
    ]
  },
  {
    id: 'p2_1', stage: 2, title: '2.1 COUNT(*) vs COUNT(kolumna) vs COUNT(DISTINCT) – Pułapka NULL',
    tables: ['rental', 'film', 'customer'],
    cols: ['COUNT(*)', 'COUNT(return_date)', 'COUNT(DISTINCT', 'rental', 'return_date', 'customer_id', 'film'],
    gapId: 'g3',
    variants: [
      { prompt: 'W tabeli `rental` część filmów nie ma daty zwrotu (`return_date` jest `NULL`). Zwróć w jednym wierszu 3 kolumny: liczbę wszystkich wypożyczeń (`COUNT(*)`), liczbę zwróconych (`COUNT(return_date)`) oraz niezwróconych (`COUNT(*) - COUNT(return_date)`).', sol: "SELECT COUNT(*) AS all_rentals, COUNT(return_date) AS ret_cnt FROM rental;", order: false },
      { prompt: 'Dla każdego pracownika (`staff_id`) w tabeli `rental` policz: łączną liczbę wypożyczeń (`COUNT(*)`) oraz liczbę wypożyczeń już zwróconych (`COUNT(return_date)`).', sol: "SELECT staff_id, COUNT(*) AS total_cnt, COUNT(return_date) AS returned_cnt FROM rental GROUP BY staff_id;", order: false },
      { prompt: 'Z tabeli `rental` zwróć w jednym wierszu: liczbę wszystkich wypożyczeń (`COUNT(*)`), liczbę unikalnych klientów mających wypożyczenia (`COUNT(DISTINCT customer_id)`) oraz liczbę unikalnych wypożyczonych filmów (`COUNT(DISTINCT film_id)`).', sol: "SELECT COUNT(*) AS total_rows, COUNT(DISTINCT customer_id) AS uniq_customers, COUNT(DISTINCT film_id) AS uniq_films FROM rental;", order: false },
      { prompt: 'Z tabeli `film` policz dla każdego `rating`: liczbę filmów (`COUNT(*)`) oraz liczbę unikalnych stawek cenowych (`COUNT(DISTINCT rental_rate)`).', sol: "SELECT rating, COUNT(*) AS films_cnt, COUNT(DISTINCT rental_rate) AS rates_cnt FROM film GROUP BY rating;", order: false },
      { prompt: 'Z tabeli `rental` policz wyłącznie te wiersze, w których film NIE został jeszcze zwrócony (`return_date IS NULL`). Zwróć jedną liczbę.', sol: "SELECT COUNT(*) AS unreturned_cnt FROM rental WHERE return_date IS NULL;", order: false }
    ]
  },
  {
    id: 'p2_2', stage: 2, title: '2.2 GROUP BY i filtrowanie po agregacji przez HAVING',
    tables: ['payment', 'film', 'rental', 'film_actor'],
    cols: ['GROUP BY', 'HAVING', 'SUM(amount)', 'AVG(length)', 'COUNT(*)', 'payment', 'film', 'rental', 'customer_id', 'rating'],
    gapId: 'g7',
    variants: [
      { prompt: 'Z tabeli `payment` znajdź klientów (`customer_id`), których łączna suma płatności (`SUM(amount)`) przekracza `10.00`. Zwróć `customer_id` oraz `total_paid`, posortowane malejąco po sumie.', sol: "SELECT customer_id, SUM(amount) AS total_paid FROM payment GROUP BY customer_id HAVING SUM(amount) > 10.00 ORDER BY total_paid DESC;", order: true },
      { prompt: 'Z tabeli `film` policz liczbę filmów (`COUNT(*)`) oraz średnią długość (`AVG(length)`) dla każdego `rating`, zostawiając tylko te grupy `rating`, które mają co najmniej `5` filmów.', sol: "SELECT rating, COUNT(*) AS films_cnt, AVG(length) AS avg_len FROM film GROUP BY rating HAVING COUNT(*) >= 5;", order: false },
      { prompt: 'Z tabeli `rental` znajdź klientów (`customer_id`), którzy wypożyczyli co najmniej `3` filmy (`COUNT(*) >= 3`). Zwróć `customer_id` i liczbę wypożyczeń.', sol: "SELECT customer_id, COUNT(*) AS rental_cnt FROM rental GROUP BY customer_id HAVING COUNT(*) >= 3;", order: false },
      { prompt: 'Z tabeli `film_actor` znajdź identyfikatory aktorów (`actor_id`), którzy zagrali w co najmniej `3` filmach. Zwróć `actor_id` oraz liczbę filmów, posortowane malejąco po liczbie filmów.', sol: "SELECT actor_id, COUNT(film_id) AS film_cnt FROM film_actor GROUP BY actor_id HAVING COUNT(film_id) >= 3 ORDER BY film_cnt DESC;", order: true },
      { prompt: 'Z tabeli `film` dla każdej stawki `rental_rate` policz maksymalny koszt odtworzenia (`MAX(replacement_cost)`) oraz średnią długość (`AVG(length)`).', sol: "SELECT rental_rate, MAX(replacement_cost) AS max_cost, AVG(length) AS avg_len FROM film GROUP BY rental_rate;", order: false }
    ]
  },
  {
    id: 'p3_1', stage: 3, title: '3.1 INNER JOIN: Łączenie 2 i 3 tabel wymiarów i faktów',
    tables: ['category', 'film_category', 'film', 'staff', 'store', 'payment', 'customer'],
    cols: ['JOIN', 'ON', 'category', 'film_category', 'film', 'staff', 'store', 'payment', 'customer', 'name', 'amount'],
    variants: [
      { prompt: 'Połącz `category` i `film_category`. Policz, ile filmów należy do każdej kategorii. Zwróć `name` oraz `film_count`, posortowane malejąco po liczbie filmów, a przy remisie alfabetycznie po `name`.', sol: "SELECT c.name, COUNT(fc.film_id) AS film_count FROM category c JOIN film_category fc ON c.category_id = fc.category_id GROUP BY c.name ORDER BY film_count DESC, c.name ASC;", order: true },
      { prompt: 'Połącz `staff`, `store` oraz `payment`. Policz łączny przychód (`SUM(amount)`) zebrany przez każdego pracownika. Zwróć `first_name`, `city` oraz `total_revenue`.', sol: "SELECT s.first_name, st.city, SUM(p.amount) AS total_revenue FROM staff s JOIN store st ON s.store_id = st.store_id JOIN payment p ON p.staff_id = s.staff_id GROUP BY s.first_name, st.city;", order: false },
      { prompt: 'Połącz `customer` i `payment`. Dla klientów ze sklepu `store_id = 1` policz łączną kwotę płatności (`SUM(amount)`). Zwróć `first_name`, `last_name` i `total_paid`, posortowane malejąco po kwocie.', sol: "SELECT c.first_name, c.last_name, SUM(p.amount) AS total_paid FROM customer c JOIN payment p ON c.customer_id = p.customer_id WHERE c.store_id = 1 GROUP BY c.customer_id, c.first_name, c.last_name ORDER BY total_paid DESC;", order: true },
      { prompt: 'Połącz `actor`, `film_actor` oraz `film`. Wypisz tytuły filmów (`title`), w których grała aktorka o nazwisku `\'GUINESS\'` (`last_name = \'GUINESS\'`). Posortuj po `title`.', sol: "SELECT f.title FROM actor a JOIN film_actor fa ON a.actor_id = fa.actor_id JOIN film f ON fa.film_id = f.film_id WHERE a.last_name = 'GUINESS' ORDER BY f.title;", order: true },
      { prompt: 'Połącz `category`, `film_category` oraz `film`. Oblicz średnią długość filmu (`AVG(length)`) dla każdej kategorii `name`. Posortuj malejąco po średniej długości.', sol: "SELECT c.name, AVG(f.length) AS avg_length FROM category c JOIN film_category fc ON c.category_id = fc.category_id JOIN film f ON fc.film_id = f.film_id GROUP BY c.name ORDER BY avg_length DESC;", order: true }
    ]
  },
  {
    id: 'p3_2', stage: 3, title: '3.2 LEFT JOIN i Anti-Join: Szukanie rekordów bez pary',
    tables: ['customer', 'rental', 'actor', 'film_actor', 'film', 'payment'],
    cols: ['LEFT JOIN', 'IS NULL', 'COALESCE', 'customer', 'rental', 'actor', 'film_actor', 'film'],
    gapId: 'g2',
    variants: [
      { prompt: 'Znajdź wszystkich klientów z tabeli `customer`, którzy NIGDY nie wypożyczyli żadnego filmu (brak wpisu w `rental`). Zwróć `customer_id`, `first_name` oraz `last_name`.', sol: "SELECT c.customer_id, c.first_name, c.last_name FROM customer c LEFT JOIN rental r ON c.customer_id = r.customer_id WHERE r.rental_id IS NULL;", order: false },
      { prompt: 'Znajdź aktorów z tabeli `actor`, którzy nie zagrali w żadnym filmie w `film_actor`. Zwróć `actor_id`, `first_name` oraz `last_name`.', sol: "SELECT a.actor_id, a.first_name, a.last_name FROM actor a LEFT JOIN film_actor fa ON a.actor_id = fa.actor_id WHERE fa.film_id IS NULL;", order: false },
      { prompt: 'Znajdź filmy z tabeli `film`, które nigdy nie zostały wypożyczone (brak w `rental`). Zwróć `film_id` oraz `title`, posortowane po `film_id`.', sol: "SELECT f.film_id, f.title FROM film f LEFT JOIN rental r ON f.film_id = r.film_id WHERE r.rental_id IS NULL ORDER BY f.film_id;", order: true },
      { prompt: 'Dla KAŻDEGO aktora z tabeli `actor` (włącznie z tymi bez filmów!) policz liczbę filmów, w których zagrał (`COUNT(fa.film_id)`). Zwróć `actor_id`, `first_name` i `films_cnt`.', sol: "SELECT a.actor_id, a.first_name, COUNT(fa.film_id) AS films_cnt FROM actor a LEFT JOIN film_actor fa ON a.actor_id = fa.actor_id GROUP BY a.actor_id, a.first_name;", order: false },
      { prompt: 'Dla KAŻDEGO klienta z tabeli `customer` ze sklepu `store_id = 2` zwróć `customer_id`, `first_name` oraz sumę jego płatności (użyj `COALESCE(SUM(p.amount), 0)` dla klientów bez płatności).', sol: "SELECT c.customer_id, c.first_name, COALESCE(SUM(p.amount), 0) AS total_paid FROM customer c LEFT JOIN payment p ON c.customer_id = p.customer_id WHERE c.store_id = 2 GROUP BY c.customer_id, c.first_name;", order: false }
    ]
  },
  {
    id: 'p4_1', stage: 4, title: '4.1 CASE WHEN, FILTER (WHERE ...) i dokładne procenty (* 100.0)',
    tables: ['film', 'customer', 'rental', 'payment'],
    cols: ['CASE WHEN', 'THEN', 'ELSE', 'END', 'FILTER (WHERE', '* 100.0', 'film', 'customer', 'rental'],
    gapId: 'g10',
    variants: [
      { prompt: 'Oblicz w tabeli `film`, jaki procent wszystkich filmów stanowią filmy drogie (`rental_rate = 4.99`). Zwróć jedną liczbę zmiennoprzecinkową (użyj `* 100.0`).', sol: "SELECT SUM(CASE WHEN rental_rate = 4.99 THEN 1 ELSE 0 END) * 100.0 / COUNT(*) AS expensive_pct FROM film;", order: false },
      { prompt: 'Podziel filmy z `film` przez `CASE WHEN` na segmenty: `\'Krotki\'` (`length < 70`), `\'Sredni\'` (`length BETWEEN 70 AND 120`) oraz `\'Dlugi\'` (`ELSE`). Zwróć segment i `COUNT(*)`.', sol: "SELECT CASE WHEN length < 70 THEN 'Krotki' WHEN length BETWEEN 70 AND 120 THEN 'Sredni' ELSE 'Dlugi' END AS seg, COUNT(*) AS cnt FROM film GROUP BY 1;", order: false },
      { prompt: 'Dla każdego sklepu (`store_id`) w tabeli `customer` policz procent aktywnych klientów (`active = 1`). Zwróć `store_id` oraz `active_pct` z użyciem `* 100.0`.', sol: "SELECT store_id, SUM(CASE WHEN active = 1 THEN 1 ELSE 0 END) * 100.0 / COUNT(*) AS active_pct FROM customer GROUP BY store_id;", order: false },
      { prompt: 'Użyj składni PostgreSQL `COUNT(*) FILTER (WHERE ...)` (lub `CASE WHEN`), aby w tabeli `rental` dla każdego `staff_id` zwrócić liczbę wypożyczeń z maja (`rental_date LIKE \'2026-05%\'`) oraz z czerwca (`rental_date LIKE \'2026-06%\'`). Zwróć `staff_id`, `may_cnt`, `june_cnt`.', sol: "SELECT staff_id, COUNT(*) FILTER (WHERE rental_date LIKE '2026-05%') AS may_cnt, COUNT(*) FILTER (WHERE rental_date LIKE '2026-06%') AS june_cnt FROM rental GROUP BY staff_id;", order: false },
      { prompt: 'W tabeli `payment` policz w jednym wierszu sumę kwot dla płatności wysokich (`amount >= 5.00`) oraz niskich (`amount < 5.00`). Zwróć dwie kolumny: `high_sum`, `low_sum`.', sol: "SELECT SUM(CASE WHEN amount >= 5.00 THEN amount ELSE 0 END) AS high_sum, SUM(CASE WHEN amount < 5.00 THEN amount ELSE 0 END) AS low_sum FROM payment;", order: false }
    ]
  },
  {
    id: 'p4_2', stage: 4, title: '4.2 Operatory zbiorowe: UNION, INTERSECT, EXCEPT',
    tables: ['actor', 'customer', 'rental', 'film_category'],
    cols: ['UNION', 'INTERSECT', 'EXCEPT', 'actor', 'customer', 'rental', 'first_name', 'customer_id'],
    variants: [
      { prompt: 'Za pomocą `INTERSECT` znajdź imiona (`first_name`), które występują jednocześnie w tabeli `actor` oraz w tabeli `customer`.', sol: "SELECT first_name FROM actor INTERSECT SELECT first_name FROM customer;", order: false },
      { prompt: 'Za pomocą `INTERSECT` znajdź identyfikatory klientów (`customer_id`) z tabeli `rental`, którzy wypożyczali filmy ZARÓWNO w maju (`2026-05%`), JAK I w czerwcu (`2026-06%`).', sol: "SELECT customer_id FROM rental WHERE rental_date LIKE '2026-05%' INTERSECT SELECT customer_id FROM rental WHERE rental_date LIKE '2026-06%';", order: false },
      { prompt: 'Za pomocą `EXCEPT` znajdź klientów (`customer_id`), którzy wypożyczali film w maju (`2026-05%`), ale NIE wypożyczyli żadnego filmu w czerwcu (`2026-06%`).', sol: "SELECT customer_id FROM rental WHERE rental_date LIKE '2026-05%' EXCEPT SELECT customer_id FROM rental WHERE rental_date LIKE '2026-06%';", order: false },
      { prompt: 'Za pomocą `EXCEPT` znajdź wszystkie `customer_id` z tabeli `customer`, których nie ma w tabeli `payment`.', sol: "SELECT customer_id FROM customer EXCEPT SELECT customer_id FROM payment;", order: false },
      { prompt: 'Połącz za pomocą `UNION ALL` listę pracowników (`first_name`, `\'staff\' AS role` z `staff`) oraz oddziałów (`city`, `\'store\' AS role` z `store`).', sol: "SELECT first_name, 'staff' AS role FROM staff UNION ALL SELECT city, 'store' AS role FROM store;", order: false }
    ]
  },
  {
    id: 'p5_1', stage: 5, title: '5.1 CTE i Rankingi Okna: ROW_NUMBER, RANK, DENSE_RANK',
    tables: ['film', 'payment'],
    cols: ['WITH', 'ROW_NUMBER()', 'DENSE_RANK()', 'OVER', 'PARTITION BY', 'ORDER BY', 'film', 'payment'],
    gapId: 't5',
    variants: [
      { prompt: 'Użyj CTE i `ROW_NUMBER()`, aby dla każdego `rating` w tabeli `film` znaleźć najdłuższy film (`ORDER BY length DESC`). Zwróć `rating`, `title`, `length` dla `rn = 1`.', sol: "WITH ranked AS (SELECT rating, title, length, ROW_NUMBER() OVER (PARTITION BY rating ORDER BY length DESC) AS rn FROM film) SELECT rating, title, length FROM ranked WHERE rn = 1;", order: false },
      { prompt: 'Za pomocą CTE i `ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY amount DESC, payment_id ASC)` zwróć `customer_id`, `payment_id`, `amount` dla maksymalnie 2 najwyższych płatności każdego klienta.', sol: "WITH r AS (SELECT customer_id, payment_id, amount, ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY amount DESC, payment_id ASC) AS rn FROM payment) SELECT customer_id, payment_id, amount FROM r WHERE rn <= 2;", order: false },
      { prompt: 'Z tabeli `film` wybierz `title`, `rating`, `replacement_cost` oraz pozycję filmu pod względem najdroższego `replacement_cost` wewnątrz jego `rating` używając `DENSE_RANK() OVER (PARTITION BY rating ORDER BY replacement_cost DESC)`. Zostaw tylko miejsca `1` i `2`.', sol: "WITH r AS (SELECT title, rating, replacement_cost, DENSE_RANK() OVER (PARTITION BY rating ORDER BY replacement_cost DESC) AS dr FROM film) SELECT title, rating, replacement_cost, dr FROM r WHERE dr <= 2;", order: false },
      { prompt: 'Dla każdego klienta w `payment` ponumeruj jego płatności chronologicznie (`ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY payment_date ASC, payment_id ASC)`). Zwróć tylko pierwszą płatność każdego klienta (`customer_id`, `payment_date`, `amount`).', sol: "WITH first_p AS (SELECT customer_id, payment_date, amount, ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY payment_date ASC, payment_id ASC) AS rn FROM payment) SELECT customer_id, payment_date, amount FROM first_p WHERE rn = 1;", order: false },
      { prompt: 'Znajdź filmy z tabeli `film`, których długość (`length`) jest większa niż średnia długość wszystkich filmów w bazie (`> (SELECT AVG(length) FROM film)`). Zwróć `title` i `length`.', sol: "SELECT title, length FROM film WHERE length > (SELECT AVG(length) FROM film);", order: false }
    ]
  },
  {
    id: 'p5_2', stage: 5, title: '5.2 Okna analityczne: Suma narastająca, udział % i LAG()',
    tables: ['payment', 'film'],
    cols: ['SUM(amount) OVER', 'LAG(', 'PARTITION BY', 'ORDER BY', 'payment', 'film', 'payment_date'],
    gapId: 'g5',
    variants: [
      { prompt: 'Dla płatności klienta `customer_id = 1` w tabeli `payment` wypisz `payment_id`, `payment_date`, `amount` oraz sumę narastającą jego wydatków (`SUM(amount) OVER (ORDER BY payment_date, payment_id)`).', sol: "SELECT payment_id, payment_date, amount, SUM(amount) OVER (ORDER BY payment_date, payment_id) AS running_total FROM payment WHERE customer_id = 1 ORDER BY payment_date, payment_id;", order: true },
      { prompt: 'Dla płatności klienta `customer_id = 1` wypisz `payment_id`, `amount` oraz kwotę jego poprzedniej płatności za pomocą `LAG(amount) OVER (ORDER BY payment_date, payment_id)`.', sol: "SELECT payment_id, amount, LAG(amount) OVER (ORDER BY payment_date, payment_id) AS prev_amount FROM payment WHERE customer_id = 1 ORDER BY payment_date, payment_id;", order: true },
      { prompt: 'Dla każdego `rating` w tabeli `film` policz liczbę filmów (`COUNT(*)`) oraz jej procentowy udział we wszystkich filmach (`COUNT(*) * 100.0 / SUM(COUNT(*)) OVER ()`). Zwróć `rating`, `cnt`, `share_pct`.', sol: "SELECT rating, COUNT(*) AS cnt, COUNT(*) * 100.0 / SUM(COUNT(*)) OVER () AS share_pct FROM film GROUP BY rating;", order: false },
      { prompt: 'W tabeli `film` dla filmów o ratingu `\'G\'` wypisz `title`, `length` oraz średnią długość filmu w grupie `\'G\'` policzoną oknem `AVG(length) OVER ()`.', sol: "SELECT title, length, AVG(length) OVER () AS avg_g_len FROM film WHERE rating = 'G';", order: false },
      { prompt: 'W tabeli `payment` zagreguj w CTE przychód miesięczny (`DATE_TRUNC(\'month\', payment_date) AS m, SUM(amount) AS rev`), a następnie wypisz `m`, `rev` oraz przychód z poprzedniego miesiąca (`LAG(rev) OVER (ORDER BY m)`).', sol: "WITH m_rev AS (SELECT DATE_TRUNC('month', payment_date) AS m, SUM(amount) AS rev FROM payment GROUP BY 1) SELECT m, rev, LAG(rev) OVER (ORDER BY m) AS prev_rev FROM m_rev ORDER BY m;", order: true }
    ]
  },
  {
    id: 'p5_3', stage: 5, title: '5.3 Kalendarze generate_series, DATE_TRUNC i INTERVAL',
    tables: ['rental', 'payment'],
    cols: ["generate_series('2026-05-01'::date, '2026-05-07'::date, '1 day')::date AS d", 'LEFT JOIN', 'COALESCE', 'DATE_TRUNC', 'INTERVAL'],
    gapId: 'g4',
    variants: [
      { prompt: 'Wygeneruj kalendarz od `\'2026-05-01\'` do `\'2026-05-07\'` za pomocą `generate_series(\'2026-05-01\'::date, \'2026-05-07\'::date, \'1 day\') AS d` i połącz go `LEFT JOIN` z tabelą `rental` po `r.rental_date = d::date`. Zwróć dzień `d::date` oraz liczbę wypożyczeń (`COUNT(r.rental_id)`), posortowane po `1`.', sol: "SELECT d::date AS d, COUNT(r.rental_id) AS rentals_cnt FROM generate_series('2026-05-01'::date, '2026-05-07'::date, '1 day') AS d LEFT JOIN rental r ON r.rental_date = d::date GROUP BY 1 ORDER BY 1;", order: true },
      { prompt: 'Wygeneruj kalendarz dni od `\'2026-05-01\'` do `\'2026-05-06\'` (`generate_series`) i połącz `LEFT JOIN` z `payment` (`p.payment_date = d::date`). Zwróć dzień `d::date` oraz dzienną sumę płatności z użyciem `COALESCE(SUM(p.amount), 0)`. Posortuj po `1`.', sol: "SELECT d::date AS d, COALESCE(SUM(p.amount), 0) AS daily_rev FROM generate_series('2026-05-01'::date, '2026-05-06'::date, '1 day') AS d LEFT JOIN payment p ON p.payment_date = d::date GROUP BY 1 ORDER BY 1;", order: true },
      { prompt: 'Z tabeli `rental` dla wypożyczeń z maja (`rental_date >= \'2026-05-01\' AND rental_date < \'2026-06-01\'`) wypisz `rental_id`, `rental_date` oraz termin zwrotu wyznaczony jako 5 dni później: `(rental_date + INTERVAL \'5 days\')::date AS due_date`.', sol: "SELECT rental_id, rental_date, (rental_date + INTERVAL '5 days')::date AS due_date FROM rental WHERE rental_date >= '2026-05-01' AND rental_date < '2026-06-01';", order: false },
      { prompt: 'Z tabeli `rental` pogrupuj wypożyczenia po miesiącu za pomocą `DATE_TRUNC(\'month\', rental_date)::date AS miesiac` i policz liczbę wypożyczeń (`COUNT(*)`) w każdym miesiącu.', sol: "SELECT DATE_TRUNC('month', rental_date)::date AS miesiac, COUNT(*) AS cnt FROM rental GROUP BY 1 ORDER BY 1;", order: true },
      { prompt: 'Wygeneruj serię liczb od 1 do 6 za pomocą `generate_series(1, 6) AS s` i połącz ją z tabelą `category` (`c.category_id = s`). Zwróć `s` oraz `c.name`.', sol: "SELECT s, c.name FROM generate_series(1, 6) AS s JOIN category c ON c.category_id = s;", order: false }
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
   5. ZADANIA REKRUTACYJNE DATALEMUR (12 KLASYCZNYCH PUŁAPEK FAANG)
   ========================================================================== */
var LEMUR_TASKS = [
  {
    id: 'dl_1', company: 'Netflix', diff: 'Medium',
    title: '1. Klienci bez aktywności w czerwcu (Pułapka LEFT JOIN: ON vs WHERE)',
    tables: ['customer', 'rental'],
    gapId: 'g2', gapName: 'LEFT JOIN: warunek daty w ON czy w WHERE',
    gapHint: 'Filtrowanie prawej tabeli w WHERE odrzuca wiersze z NULL i zamienia LEFT JOIN w INNER JOIN! Warunek daty dla prawej tabeli musi być w klauzuli ON.',
    cols: ['customer', 'rental', 'customer_id', 'first_name', 'rental_date', 'LEFT JOIN', 'COUNT(r.rental_id)'],
    prompt: 'Zarząd chce listę WSZYSTKICH klientów z tabeli `customer` należących do sklepu `store_id = 1` wraz z liczbą ich wypożyczeń w czerwcu 2026 (`r.rental_date >= \'2026-06-01\' AND r.rental_date < \'2026-07-01\'` lub `r.rental_date::text LIKE \'2026-06%\'`).\n\nJeśli klient ze sklepu 1 nie miał żadnego wypożyczenia w czerwcu, MUSI widnieć w wyniku z liczbą `0`.\nZwróć: `customer_id`, `first_name`, `june_rentals`.',
    sol: "SELECT c.customer_id, c.first_name, COUNT(r.rental_id) AS june_rentals FROM customer c LEFT JOIN rental r ON c.customer_id = r.customer_id AND r.rental_date >= '2026-06-01' AND r.rental_date < '2026-07-01' WHERE c.store_id = 1 GROUP BY c.customer_id, c.first_name;",
    detectTrap: function(sql) {
      if (/LEFT\s+JOIN/i.test(sql) && /WHERE[\s\S]*RENTAL_DATE/i.test(sql)) {
        return 'PUŁAPKA DATALEMUR WYKRYTA: Użyłeś LEFT JOIN, ale filtr na `rental_date` dałeś w WHERE zamiast w ON! Przez to klienci bez wypożyczeń w czerwcu (mający NULL w rental_date) zostali wycięci.';
      }
      if (/COUNT\s*\(\s*\*\s*\)/i.test(sql)) {
        return 'PUŁAPKA COUNT(*): Przy LEFT JOIN użycie COUNT(*) policzy wiersz klienta jako 1 zamiast 0! Użyj COUNT(r.rental_id).';
      }
      return null;
    }
  },
  {
    id: 'dl_2', company: 'Stripe', diff: 'Easy-Tricky',
    title: '2. Odsetek niezwróconych filmów (Pułapka Dzielenia Całkowitego i NULL)',
    tables: ['rental'],
    gapId: 'g10', gapName: 'Dzielenie całkowite (* 100.0) i IS NULL',
    gapHint: 'Dzielenie dwóch liczb całkowitych obcina ułamki. Zawsze mnóż przez 100.0, a brak wartości sprawdzaj przez IS NULL, nigdy = NULL.',
    cols: ['rental', 'return_date', 'staff_id', 'CASE WHEN', 'IS NULL', '* 100.0'],
    prompt: 'Dla każdego pracownika (`staff_id`) w tabeli `rental` oblicz odsetek wypożyczeń, które NIE zostały jeszcze zwrócone (`return_date IS NULL`).\n\nZwróć: `staff_id` oraz `unreturned_pct` (jako dokładny procent zmiennoprzecinkowy).',
    sol: "SELECT staff_id, SUM(CASE WHEN return_date IS NULL THEN 1 ELSE 0 END) * 100.0 / COUNT(*) AS unreturned_pct FROM rental GROUP BY staff_id;",
    detectTrap: function(sql) {
      if (/=\s*NULL/i.test(sql)) return 'PUŁAPKA SQL: Napisałeś `= NULL`. W SQL porównanie przez `=` z NULL daje UNKNOWN. Użyj `return_date IS NULL`.';
      if (sql.indexOf('100.0') < 0 && !/numeric|float|real/i.test(sql)) return 'PUŁAPKA DZIELENIA CAŁKOWITEGO: Brakuje `* 100.0` lub `::numeric` przy dzieleniu liczby wierszy!';
      return null;
    }
  },
  {
    id: 'dl_3', company: 'Amazon', diff: 'Hard',
    title: '3. Rozdmuchanie wierszy po JOIN dwóch tabel faktów (Fan-out Trap)',
    tables: ['film', 'film_category', 'film_actor'],
    gapId: 'g1', gapName: 'Ziarno wyniku i mnożenie wierszy po JOIN',
    gapHint: 'Łączenie bezpośrednio dwóch tabel 1-do-wielu mnoży wiersze przez siebie. Użyj COUNT(DISTINCT ...) lub zagreguj tabele w osobnych CTE przed złączeniem.',
    cols: ['film', 'film_actor', 'film_category', 'film_id', 'title', 'COUNT(DISTINCT'],
    prompt: 'Dla filmów o `film_id` z listy `(1, 2, 6)` wypisz: `film_id`, `title`, liczbę przypisanych kategorii (`cat_cnt` z `film_category`) oraz liczbę przypisanych aktorów (`actor_cnt` z `film_actor`).\n\nUważaj na pomnożenie liczby kategorii przez liczbę aktorów!',
    sol: "SELECT f.film_id, f.title, COUNT(DISTINCT fc.category_id) AS cat_cnt, COUNT(DISTINCT fa.actor_id) AS actor_cnt FROM film f LEFT JOIN film_category fc ON f.film_id = fc.film_id LEFT JOIN film_actor fa ON f.film_id = fa.film_id WHERE f.film_id IN (1, 2, 6) GROUP BY f.film_id, f.title;",
    detectTrap: function(sql) {
      if (!/DISTINCT/i.test(sql) && !/WITH/i.test(sql)) {
        return 'PUŁAPKA ZIARNA (Fan-out): Łączysz dwie tabele podrzędne naraz używając zwykłego COUNT() bez DISTINCT ani osobnych CTE! Przez to każda kategoria mnoży się przez każdego aktora.';
      }
      return null;
    }
  },
  {
    id: 'dl_4', company: 'Spotify', diff: 'Medium',
    title: '4. Top 2 ceny wypożyczenia w grupie z remisami (DENSE_RANK vs ROW_NUMBER)',
    tables: ['film'],
    gapId: 't5', gapName: 'DENSE_RANK vs RANK vs ROW_NUMBER przy remisach',
    gapHint: 'ROW_NUMBER ucina remisy losowo, a RANK zostawia dziury w numeracji (1, 1, 3). Gdy pytanie prosi o Top N unikalnych wartości z remisami, użyj DENSE_RANK().',
    cols: ['film', 'title', 'rating', 'replacement_cost', 'DENSE_RANK()', 'OVER', 'PARTITION BY'],
    prompt: 'W kategorii wiekowej `rating = \'PG\'` znajdź filmy mające 2 najwyższe wartości kosztu odtworzenia (`replacement_cost`). Jeśli dwa filmy mają ten sam koszt (np. `20.99`), oba mają się znaleźć na tym samym miejscu bez pomijania kolejnych numerów miejsc!\n\nZwróć: `title`, `replacement_cost`, `rnk` (dla miejsc `<= 2`).',
    sol: "WITH r AS (SELECT title, replacement_cost, DENSE_RANK() OVER (ORDER BY replacement_cost DESC) AS rnk FROM film WHERE rating = 'PG') SELECT title, replacement_cost, rnk FROM r WHERE rnk <= 2;",
    detectTrap: function(sql) {
      if (/ROW_NUMBER/i.test(sql)) return 'PUŁAPKA REMISÓW: Użyłeś ROW_NUMBER(), który przy remisie `20.99` nadał różne numery wierszy zamiast tego samego miejsca!';
      if (/\bRANK\s*\(/i.test(sql) && !/DENSE_RANK/i.test(sql)) return 'PUŁAPKA RANK(): Zwykły RANK() po remisie przeskakuje oczko numeracji (1, 2, 2, 4). Użyj DENSE_RANK().';
      return null;
    }
  },
  {
    id: 'dl_5', company: 'Uber', diff: 'Medium',
    title: '5. Trzecia transakcja każdego klienta (Window Filtering Trap)',
    tables: ['payment'],
    gapId: 't5', gapName: 'Filtrowanie funkcji okna wymaga CTE / podzapytania',
    gapHint: 'Funkcji okna nie wolno używać bezpośrednio w klauzuli WHERE tego samego zapytania. Najpierw wylicz ROW_NUMBER() w CTE, a w zewnętrznym SELECT daj WHERE rn = 3.',
    cols: ['payment', 'customer_id', 'payment_id', 'amount', 'payment_date', 'ROW_NUMBER()', 'WITH'],
    prompt: 'Znajdź dokładnie TRZECIĄ chronologicznie płatność każdego klienta w tabeli `payment` (sortując po `payment_date ASC, payment_id ASC`).\n\nZwróć: `customer_id`, `payment_id`, `amount`, `payment_date`.',
    sol: "WITH r AS (SELECT customer_id, payment_id, amount, payment_date, ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY payment_date ASC, payment_id ASC) AS rn FROM payment) SELECT customer_id, payment_id, amount, payment_date FROM r WHERE rn = 3;",
    detectTrap: function(sql) {
      if (!/WITH/i.test(sql) && !/FROM\s*\(\s*SELECT/i.test(sql)) return 'PUŁAPKA KOLEJNOŚCI SQL: Próbujesz filtrować wynik funkcji okna bez CTE lub podzapytania!';
      return null;
    }
  },
  {
    id: 'dl_6', company: 'Airbnb', diff: 'Hard',
    title: '6. Pułapka NOT IN z wartościami NULL (Zwraca 0 wierszy!)',
    tables: ['film', 'rental'],
    gapId: 'g2', gapName: 'NOT IN z NULL w podzapytaniu zwraca pusty wynik',
    gapHint: 'Jeśli podzapytanie wewnątrz NOT IN zawiera chociaż jeden NULL, całe wyrażenie przyjmuje wartość UNKNOWN i zwraca 0 wierszy! Zawsze używaj LEFT JOIN ... IS NULL, NOT EXISTS lub odfiltruj NULL w podzapytaniu.',
    cols: ['customer', 'rental', 'return_date', 'NOT EXISTS', 'LEFT JOIN', 'IS NULL'],
    prompt: 'W tabeli `rental` kolumna `return_date` zawiera wartości `NULL`. Ktoś próbował znaleźć wypożyczenia, których data wypożyczenia (`rental_date`) NIE pokrywa się z żadną datą zwrotu (`return_date`) w bazie, pisząc:\n`SELECT rental_id, rental_date FROM rental WHERE rental_date NOT IN (SELECT return_date FROM rental);`\nAle zapytanie zwróciło 0 wierszy przez `NULL` w `return_date`!\n\nNapisz poprawne zapytanie zwracające `rental_id` oraz `rental_date` dla wypożyczeń, których `rental_date` nie występuje wśród niepustych wartości `return_date`.',
    sol: "SELECT rental_id, rental_date FROM rental WHERE rental_date NOT IN (SELECT return_date FROM rental WHERE return_date IS NOT NULL);",
    detectTrap: function(sql, userRes) {
      if (/NOT\s+IN/i.test(sql) && !/IS\s+NOT\s+NULL/i.test(sql) && userRes && userRes.values && userRes.values.length === 0) {
        return 'PUŁAPKA NOT IN + NULL: Twoje podzapytanie w NOT IN zwraca NULL-e! W logice trójwartościowej SQL `x NOT IN (..., NULL)` zawsze daje UNKNOWN i zwraca 0 wierszy.';
      }
      return null;
    }
  },
  {
    id: 'dl_7', company: 'Meta', diff: 'Hard',
    title: '7. Zmiana przychodu Miesiąc do Miesiąca (MoM % Change z LAG)',
    tables: ['payment'],
    gapId: 'g5', gapName: 'LAG i zmiana procentowa MoM po agregacji',
    gapHint: 'Najpierw zagreguj dane do ziarna miesiąca w CTE, a dopiero potem użyj LAG() OVER (ORDER BY miesiac).',
    cols: ['payment', 'payment_date', 'amount', 'DATE_TRUNC', 'LAG(', 'WITH'],
    prompt: 'Policz przychód miesięczny w tabeli `payment` (`DATE_TRUNC(\'month\', payment_date)::date AS m`) oraz kwotę zmiany przychodu względem poprzedniego miesiąca (`rev - LAG(rev) OVER (ORDER BY m)`).\n\nZwróć: `m`, `rev`, `diff_from_prev`.',
    sol: "WITH m_rev AS (SELECT DATE_TRUNC('month', payment_date)::date AS m, SUM(amount) AS rev FROM payment GROUP BY 1) SELECT m, rev, rev - LAG(rev) OVER (ORDER BY m) AS diff_from_prev FROM m_rev ORDER BY m;",
    detectTrap: function(sql) {
      if (!/GROUP\s+BY/i.test(sql)) return 'PUŁAPKA ZIARNA OKNA: Używasz LAG() na surowych wierszach płatności zamiast najpierw zagregować przychód do poziomu miesiąca!';
      return null;
    }
  },
  {
    id: 'dl_8', company: 'Microsoft', diff: 'Hard',
    title: '8. Super-Klient: Różnorodność kategorii (Relational Division)',
    tables: ['rental', 'film', 'film_category'],
    gapId: 'g7', gapName: 'COUNT(DISTINCT ...) w HAVING',
    gapHint: 'Aby sprawdzić, czy klient miał styczność z N różnymi kategoriami, użyj HAVING COUNT(DISTINCT category_id) >= N (zwykły COUNT policzy wielokrotne wypożyczenia z tej samej kategorii!).',
    cols: ['rental', 'film_category', 'customer_id', 'category_id', 'HAVING', 'COUNT(DISTINCT'],
    prompt: 'Połącz `rental` oraz `film_category` (po `film_id`). Znajdź klientów (`customer_id`), którzy wypożyczyli filmy z co najmniej `3` RÓŻNYCH kategorii (`category_id`).\n\nZwróć: `customer_id` oraz liczbę unikalnych kategorii (`uniq_cats`).',
    sol: "SELECT r.customer_id, COUNT(DISTINCT fc.category_id) AS uniq_cats FROM rental r JOIN film_category fc ON r.film_id = fc.film_id GROUP BY r.customer_id HAVING COUNT(DISTINCT fc.category_id) >= 3;",
    detectTrap: function(sql) {
      if (!/DISTINCT/i.test(sql)) return 'PUŁAPKA DUPLIKATÓW: Klient mógł wypożyczyć 3 filmy z tej samej kategorii! Musisz użyć COUNT(DISTINCT fc.category_id), a nie zwykłego COUNT.';
      return null;
    }
  },
  {
    id: 'dl_9', company: 'Google', diff: 'Medium',
    title: '9. Średnia kwota na WSZYSTKICH klientów vs tylko płacących (AVG vs NULL)',
    tables: ['customer', 'payment'],
    gapId: 'g8', gapName: 'AVG pomija NULL-e (COALESCE przed agregacją)',
    gapHint: 'Funkcja AVG(x) całkowicie ignoruje wiersze z NULL. Jeśli chcesz policzyć średnią uwzględniającą klientów z wynikiem 0, użyj AVG(COALESCE(x, 0)) na poziomie klienta.',
    cols: ['customer', 'payment', 'COALESCE', 'AVG(', 'LEFT JOIN'],
    prompt: 'W sklepie `store_id = 1` jest 5 klientów, ale jedna klientka (`MARGARET`) nigdy nic nie kupiła. Policz w jednym wierszu dwie liczby dla klientów ze `store_id = 1`:\n1) Średnią łączną kwotę wydatków na klienta liczoną po WSZYSTKICH 5 klientach ze sklepu 1 (`avg_all_customers`, gdzie brak wpłat to `0`).\n2) Liczbę wszystkich klientów w `store_id = 1`.',
    sol: "WITH cust_totals AS (SELECT c.customer_id, COALESCE(SUM(p.amount), 0) AS tot FROM customer c LEFT JOIN payment p ON c.customer_id = p.customer_id WHERE c.store_id = 1 GROUP BY c.customer_id) SELECT AVG(tot) AS avg_all_customers, COUNT(*) AS cust_cnt FROM cust_totals;",
    detectTrap: function(sql) {
      if (!/LEFT\s+JOIN/i.test(sql)) return 'PUŁAPKA INNER JOIN: Bez LEFT JOIN klientka z kwotą 0 wypada z mianownika średniej!';
      if (!/COALESCE/i.test(sql)) return 'PUŁAPKA AVG i NULL: Funkcja AVG() pomija wartości NULL! Musisz zamienić NULL na 0 przez COALESCE.';
      return null;
    }
  },
  {
    id: 'dl_10', company: 'LinkedIn', diff: 'Medium',
    title: '10. Klienci aktywni w obu miesiącach (Both Months Trap)',
    tables: ['rental'],
    gapId: 'g7', gapName: 'Warunek A AND B na tym samym wierszu vs na grupie',
    gapHint: 'Jeden wiersz nie może mieć jednocześnie daty z maja ORAZ z czerwca. Aby znaleźć klientów mających wiersze w obu miesiącach, użyj INTERSECT lub HAVING z dwoma warunkami COUNT/FILTER.',
    cols: ['rental', 'customer_id', 'rental_date', 'INTERSECT', 'HAVING'],
    prompt: 'Znajdź `customer_id` klientów z tabeli `rental`, którzy wypożyczyli co najmniej jeden film w maju (`rental_date >= \'2026-05-01\' AND rental_date < \'2026-06-01\'`) ORAZ co najmniej jeden film w czerwcu (`rental_date >= \'2026-06-01\' AND rental_date < \'2026-07-01\'`). Posortuj rosnąco po `customer_id`.',
    sol: "SELECT customer_id FROM rental WHERE rental_date >= '2026-05-01' AND rental_date < '2026-06-01' INTERSECT SELECT customer_id FROM rental WHERE rental_date >= '2026-06-01' AND rental_date < '2026-07-01' ORDER BY customer_id;",
    detectTrap: function(sql) {
      if (/WHERE[\s\S]*2026-05[\s\S]*AND[\s\S]*2026-06[\s\S]*AND[\s\S]*2026-07/i.test(sql) && !/INTERSECT|HAVING|EXISTS/i.test(sql)) {
        return 'PUŁAPKA LOGICZNA WHERE: Pojedynczy wiersz nigdy nie ma daty z maja i z czerwca naraz! Użyj INTERSECT lub GROUP BY + HAVING.';
      }
      return null;
    }
  },
  {
    id: 'dl_11', company: 'PayPal', diff: 'Medium',
    title: '11. Udział każdej płatności w całkowitych wydatkach klienta (Window Share)',
    tables: ['payment'],
    gapId: 't5', gapName: 'SUM(x) OVER (PARTITION BY ...) bez zwijania wierszy',
    gapHint: 'GROUP BY zwija wiersze do jednego na grupę. Jeśli potrzebujesz zachować pojedyncze transakcje i obok pokazać sumę grupy, użyj SUM(amount) OVER (PARTITION BY customer_id).',
    cols: ['payment', 'payment_id', 'customer_id', 'amount', 'SUM(amount) OVER (PARTITION BY'],
    prompt: 'Dla płatności klientów `customer_id IN (1, 2)` wypisz każdy pojedynczy wiersz płatności: `payment_id`, `customer_id`, `amount` oraz łączną sumę wszystkich wydatków tego klienta (`cust_total`) wyliczoną funkcją okna. Posortuj po `payment_id`.',
    sol: "SELECT payment_id, customer_id, amount, SUM(amount) OVER (PARTITION BY customer_id) AS cust_total FROM payment WHERE customer_id IN (1, 2) ORDER BY payment_id;",
    detectTrap: function(sql) {
      if (/GROUP\s+BY/i.test(sql) && !/OVER/i.test(sql)) return 'PUŁAPKA GROUP BY: Użyłeś GROUP BY zamiast funkcji okna SUM(amount) OVER (PARTITION BY customer_id), przez co zwinąłeś wiersze lub rozbiłeś sumę po payment_id!';
      return null;
    }
  },
  {
    id: 'dl_12', company: 'TikTok', diff: 'Hard',
    title: '12. Szybkie zwroty w ciągu 3 dni (Date Interval Join Trap)',
    tables: ['rental'],
    gapId: 'g4', gapName: 'Operacje na datach i INTERVAL',
    gapHint: 'Pamiętaj, że niezwrócone wypożyczenia mają return_date IS NULL, a różnicę dat w SQL możesz zapisać przez return_date <= rental_date + INTERVAL \'3 days\'.',
    cols: ['rental', 'rental_id', 'customer_id', 'rental_date', 'return_date', "INTERVAL '3 days'"],
    prompt: 'Z tabeli `rental` znajdź wypożyczenia, które zostały zwrócone najpóźniej w ciągu `3` dni od daty wypożyczenia (`return_date <= rental_date + INTERVAL \'3 days\'`).\n\nZwróć: `rental_id`, `customer_id`, `rental_date`, `return_date`, posortowane po `rental_id`.',
    sol: "SELECT rental_id, customer_id, rental_date, return_date FROM rental WHERE return_date IS NOT NULL AND return_date <= rental_date + INTERVAL '3 days' ORDER BY rental_id;",
    detectTrap: function(sql) {
      if (!/return_date/i.test(sql)) return 'Sprawdź porównanie kolumny `return_date` z `rental_date + INTERVAL \'3 days\'`.';
      return null;
    }
  }
];

window.STAGES = STAGES;
window.PATH_TASKS = PATH_TASKS;
window.DIAG_QUESTIONS = DIAG_QUESTIONS;
window.LEMUR_TASKS = LEMUR_TASKS;

