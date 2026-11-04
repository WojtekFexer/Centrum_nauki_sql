/* ==========================================================================
   3. ŚCIEŻKA NAUKI: 12 LEKCJI × 10 WARIANTÓW = 120 DYNAMICZNYCH ZADAŃ
   ========================================================================== */
var STAGES = [
  { id: 1, name: 'Etap 1: Fundamenty SELECT, ORDER BY i Proste WHERE', desc: 'Pobieranie kolumn, aliasy AS, obliczenia, DISTINCT, sortowanie, LIMIT oraz pojedynczy warunek WHERE.' },
  { id: 2, name: 'Etap 2: Łączenie warunków, Agregacje i GROUP BY', desc: 'Operatory AND/OR/IN/BETWEEN/ILIKE, SUM, AVG, COUNT, grupowanie i filtrowanie grup przez HAVING.' },
  { id: 3, name: 'Etap 3: Złączenia (INNER, LEFT, Anti-Join)', desc: 'Łączenie tabel dvdrental, relacje wiele-do-wielu i szukanie brakujących powiązań.' },
  { id: 4, name: 'Etap 4: CASE WHEN, COALESCE i Rzutowanie', desc: 'Segmentacja danych, FILTER (WHERE ...), obsługa NULL-i oraz procenty (* 100.0).' },
  { id: 5, name: 'Etap 5: CTE, Funkcje Okna i Kalendarze', desc: 'Zapytania WITH, ROW_NUMBER, DENSE_RANK, LAG, sumy narastające i generate_series.' }
];

var PATH_TASKS = [
  {
    id: 'p1_1', stage: 1, title: '1.1 Fundament SELECT i FROM — pobieranie kolumn i aliasy AS',
    tables: ['film', 'customer', 'actor', 'category', 'staff', 'store', 'payment'],
    cols: ['SELECT', 'FROM', 'AS', '*', 'title', 'rental_rate', 'first_name', 'last_name', 'amount', 'length', 'replacement_cost'],
    theory: '<ul>' +
      '<li><strong><code>SELECT</code> i <code>FROM</code>:</strong> każde zapytanie w SQL zaczyna się od <code>SELECT</code> (wskazujesz, które kolumny chcesz wyświetlić) oraz <code>FROM</code> (wskazujesz nazwę tabeli, z której pobierasz dane).</li>' +
      '<li><strong>Wybór wielu kolumn i gwiazdka <code>*</code>:</strong> nazwy kolumn po <code>SELECT</code> oddzielasz przecinkami (np. <code>SELECT first_name, last_name FROM actor</code>). Symbol <code>*</code> pobiera wszystkie kolumny tabeli.</li>' +
      '<li><strong>Aliasy kolumn (<code>AS</code>):</strong> słowo <code>AS</code> pozwala nadać kolumnie lub obliczeniu nową, czytelną nazwę w nagłówku wyniku (np. <code>length AS duration_min</code>).</li>' +
      '<li><strong>Obliczenia arytmetyczne:</strong> w <code>SELECT</code> możesz wykonywać działania na kolumnach liczbowych (<code>+</code>, <code>-</code>, <code>*</code>, <code>/</code>), np. <code>amount * 100 AS amount_cents</code>.</li>' +
      '</ul>' +
      '<div class="theory-code"><code>SELECT title, rental_rate AS cena_usd, rental_rate * 4 AS cena_pln\nFROM film;</code></div>',
    variants: [
      { prompt: 'Pobierz z katalogu filmów tytuły oraz ceny wypożyczenia wszystkich filmów.', sol: "SELECT title, rental_rate FROM film;", order: false, tables: ['film'], hint: 'Wpisz po SELECT dwie kolumny oddzielone przecinkiem: title, rental_rate, a po FROM podaj tabelę film.' },
      { prompt: 'Pobierz z bazy klientów imiona, nazwiska oraz adresy e-mail wszystkich klientów.', sol: "SELECT first_name, last_name, email FROM customer;", order: false, tables: ['customer'], hint: 'Wybierz trzy kolumny z tabeli customer: first_name, last_name, email.' },
      { prompt: 'Pobierz z katalogu filmów tytuły oraz czas trwania, nadając kolumnie z czasem trwania nową nazwę w nagłówku za pomocą aliasu.', sol: "SELECT title, length AS duration_min FROM film;", order: false, tables: ['film'], hint: 'Użyj słowa kluczowego AS po nazwie kolumny: length AS duration_min.' },
      { prompt: 'Pobierz z listy pracowników identyfikatory, imiona oraz nazwiska, nadając kolumnom z imieniem i nazwiskiem polskie nazwy w nagłówku.', sol: "SELECT staff_id, first_name AS imie, last_name AS nazwisko FROM staff;", order: false, tables: ['staff'], hint: 'Zastosuj aliasy AS dla dwóch kolumn w tabeli staff: first_name AS imie, last_name AS nazwisko.' },
      { prompt: 'Pobierz z listy oddziałów sklepów identyfikator placówki, miasto oraz kraj, zmieniając nagłówek kolumny z miastem za pomocą aliasu.', sol: "SELECT store_id, city AS miasto, country FROM store;", order: false, tables: ['store'], hint: 'Wybierz store_id, city AS miasto, country z tabeli store.' },
      { prompt: 'Pobierz z rejestru płatności identyfikator wpłaty, kwotę w dolarach oraz kwotę przeliczoną na centy (pomnożoną przez 100) pod nowym aliasem.', sol: "SELECT payment_id, amount, amount * 100 AS amount_cents FROM payment;", order: false, tables: ['payment'], hint: 'Pomnóż kolumnę amount przez 100 i nadaj jej alias: amount * 100 AS amount_cents.' },
      { prompt: 'Pobierz z katalogu filmów tytuł, obecną cenę wypożyczenia oraz cenę powiększoną o opłatę serwisową (dodaj 2 do ceny wypożyczenia) pod nowym aliasem.', sol: "SELECT title, rental_rate, rental_rate + 2 AS new_rate FROM film;", order: false, tables: ['film'], hint: 'Dodaj 2 do kolumny rental_rate: rental_rate + 2 AS new_rate.' },
      { prompt: 'Pobierz z katalogu filmów tytuł, czas trwania w minutach oraz czas trwania przeliczony na godziny (podzielony przez 60.0) pod nowym aliasem.', sol: "SELECT title, length, length / 60.0 AS duration_hours FROM film;", order: false, tables: ['film'], hint: 'Podziel kolumnę length przez 60.0 i nazwij wynik AS duration_hours.' },
      { prompt: 'Pobierz z katalogu filmów tytuł, koszt odtworzenia płyty, cenę wypożyczenia oraz różnicę między kosztem odtworzenia a ceną wypożyczenia pod nowym aliasem.', sol: "SELECT title, replacement_cost, rental_rate, replacement_cost - rental_rate AS cost_diff FROM film;", order: false, tables: ['film'], hint: 'Odejmij jedną kolumnę od drugiej: replacement_cost - rental_rate AS cost_diff.' },
      { prompt: 'Pobierz z rejestru płatności identyfikator klienta, datę wpłaty, kwotę oryginalną oraz kwotę przeliczoną na złotówki (pomnożoną przez 4) pod nowym aliasem.', sol: "SELECT customer_id, payment_date, amount, amount * 4 AS amount_pln FROM payment;", order: false, tables: ['payment'], hint: 'Wybierz customer_id, payment_date, amount oraz wylicz amount * 4 AS amount_pln z tabeli payment.' }
    ]
  },
  {
    id: 'p1_2', stage: 1, title: '1.2 Porządkowanie wyniku: DISTINCT, ORDER BY oraz LIMIT',
    tables: ['film', 'customer', 'payment', 'actor', 'store'],
    cols: ['SELECT', 'DISTINCT', 'FROM', 'ORDER BY', 'ASC', 'DESC', 'LIMIT', 'AS'],
    theory: '<ul>' +
      '<li><strong><code>SELECT DISTINCT</code>:</strong> usuwa duplikaty i zwraca tylko unikalne (niepowtarzające się) wartości z wybranych kolumn.</li>' +
      '<li><strong><code>ORDER BY</code> (sortowanie):</strong> układa wiersze wyniku rosnąco (<code>ASC</code> – od A do Z lub od najmniejszej liczby) albo malejąco (<code>DESC</code> – od największej liczby).</li>' +
      '<li><strong><code>LIMIT n</code>:</strong> odcina wynik do pierwszych <code>n</code> wierszy (np. <code>LIMIT 5</code> pokaże 5 pierwszych pozycji).</li>' +
      '<li><strong>Kolejność klauzul:</strong> najpierw piszemy <code>SELECT ... FROM ...</code>, potem <code>ORDER BY ...</code>, a na samym końcu <code>LIMIT ...</code>.</li>' +
      '</ul>' +
      '<div class="theory-code"><code>SELECT title, length AS duration_min\nFROM film\nORDER BY length DESC, title ASC\nLIMIT 5;</code></div>',
    variants: [
      { prompt: 'Pobierz z katalogu filmów listę unikalnych (niepowtarzających się) cen wypożyczenia.', sol: "SELECT DISTINCT rental_rate FROM film;", order: false, tables: ['film'], hint: 'Użyj słowa kluczowego DISTINCT bezpośrednio po SELECT: SELECT DISTINCT rental_rate FROM film;' },
      { prompt: 'Pobierz z bazy klientów unikalną listę identyfikatorów sklepów, do których przypisani są klienci.', sol: "SELECT DISTINCT store_id FROM customer;", order: false, tables: ['customer'], hint: 'Wpisz SELECT DISTINCT store_id FROM customer;' },
      { prompt: 'Pobierz z katalogu filmów tytuły oraz czas trwania wszystkich filmów, sortując listę od najdłuższego do najkrótszego filmu (a przy równym czasie alfabetycznie po tytule).', sol: "SELECT title, length FROM film ORDER BY length DESC, title ASC;", order: true, tables: ['film'], hint: 'Użyj ORDER BY length DESC, title ASC na końcu zapytania.' },
      { prompt: 'Pobierz z bazy klientów imiona, nazwiska oraz daty rejestracji, sortując listę od najwcześniej zarejestrowanego klienta (a przy tej samej dacie rosnąco po identyfikatorze klienta).', sol: "SELECT first_name, last_name, create_date FROM customer ORDER BY create_date ASC, customer_id ASC;", order: true, tables: ['customer'], hint: 'Posortuj rosnąco: ORDER BY create_date ASC, customer_id ASC.' },
      { prompt: 'Pobierz z listy aktorów pierwsze 4 wiersze zawierające identyfikator aktora, imię oraz nazwisko, uporządkowane rosnąco według identyfikatora aktora.', sol: "SELECT actor_id, first_name, last_name FROM actor ORDER BY actor_id ASC LIMIT 4;", order: true, tables: ['actor'], hint: 'Dodaj ORDER BY actor_id ASC oraz na samym końcu LIMIT 4.' },
      { prompt: 'Pobierz z katalogu filmów 5 najdłuższych produkcji (tytuł oraz czas trwania pod nowym aliasem), sortując wynik od najdłuższego czasu trwania malejąco i pomocniczo po tytule rosnąco.', sol: "SELECT title, length AS duration_min FROM film ORDER BY length DESC, title ASC LIMIT 5;", order: true, tables: ['film'], hint: 'Połącz alias length AS duration_min z sortowaniem ORDER BY length DESC, title ASC oraz LIMIT 5.' },
      { prompt: 'Pobierz z katalogu filmów 5 pozycji o najwyższym koszcie odtworzenia płyty (tytuł oraz koszt odtworzenia pod nowym aliasem), sortując wynik od najdroższych malejąco i pomocniczo po tytule rosnąco.', sol: "SELECT title, replacement_cost AS max_cost FROM film ORDER BY replacement_cost DESC, title ASC LIMIT 5;", order: true, tables: ['film'], hint: 'Nadaj alias replacement_cost AS max_cost, posortuj ORDER BY replacement_cost DESC, title ASC i ogranicz do LIMIT 5.' },
      { prompt: 'Pobierz z rejestru płatności 5 najwyższych pojedynczych wpłat (identyfikator płatności, kwotę oraz datę wpłaty), sortując wynik od najwyższej kwoty malejąco i pomocniczo po identyfikatorze płatności rosnąco.', sol: "SELECT payment_id, amount, payment_date FROM payment ORDER BY amount DESC, payment_id ASC LIMIT 5;", order: true, tables: ['payment'], hint: 'Wybierz 3 kolumny z payment, posortuj ORDER BY amount DESC, payment_id ASC i dodaj LIMIT 5.' },
      { prompt: 'Pobierz z katalogu filmów unikalne kombinacje kategorii wiekowej oraz ceny wypożyczenia, sortując wynik alfabetycznie po kategorii wiekowej oraz rosnąco po cenie.', sol: "SELECT DISTINCT rating, rental_rate FROM film ORDER BY rating ASC, rental_rate ASC;", order: true, tables: ['film'], hint: 'Użyj SELECT DISTINCT rating, rental_rate FROM film i posortuj po obu kolumnach rosnąco (ASC).' },
      { prompt: 'Pobierz z katalogu filmów 3 najtańsze w odtworzeniu filmy wraz z wyliczoną kaucją w centach (koszt odtworzenia pomnożony przez 100 pod nowym aliasem), sortując wynik rosnąco po koszcie odtworzenia i alfabetycznie po tytule.', sol: "SELECT title, replacement_cost, replacement_cost * 100 AS cost_cents FROM film ORDER BY replacement_cost ASC, title ASC LIMIT 3;", order: true, tables: ['film'], hint: 'Połącz wyliczenie replacement_cost * 100 AS cost_cents z ORDER BY replacement_cost ASC, title ASC oraz LIMIT 3.' }
    ]
  },
  {
    id: 'p1_3', stage: 1, title: '1.3 Proste filtrowanie wierszy: klauzula WHERE (jeden warunek)',
    tables: ['film', 'customer', 'payment', 'store'],
    cols: ['SELECT', 'FROM', 'WHERE', '=', '>', '<', '>=', '<=', '<>', 'ORDER BY', 'LIMIT'],
    theory: '<ul>' +
      '<li><strong><code>WHERE</code> (sito na pojedyncze wiersze):</strong> sprawdza każdy wiersz tabeli i zostawia w wyniku tylko te rekordy, które spełniają warunek.</li>' +
      '<li><strong>Operatory porównania:</strong> <code>=</code> (równy), <code>&gt;</code> (większy), <code>&lt;</code> (mniejszy), <code>&gt;=</code> (większy lub równy), <code>&lt;=</code> (mniejszy lub równy) oraz <code>&lt;&gt;</code> (różny od).</li>' +
      '<li><strong>Liczby vs Teksty:</strong> liczby w warunku piszemy normalnie (np. <code>WHERE length &gt; 120</code>), a teksty oraz daty zawsze ujmujemy w pojedyncze apostrofy (np. <code>WHERE rating = \'PG\'</code>).</li>' +
      '<li><strong>Kolejność w zapytaniu:</strong> klauzulę <code>WHERE</code> umieszczamy zawsze bezpośrednio po <code>FROM</code>, a przed <code>ORDER BY</code> i <code>LIMIT</code>.</li>' +
      '</ul>' +
      '<div class="theory-code"><code>SELECT title, rating, length\nFROM film\nWHERE rating = \'PG-13\'\nORDER BY length DESC\nLIMIT 5;</code></div>',
    variants: [
      { prompt: 'Pobierz z katalogu filmów tytuły oraz ceny wypożyczenia dla filmów z najwyższej półki cenowej (równych 4.99).', sol: "SELECT title, rental_rate FROM film WHERE rental_rate = 4.99;", order: false, tables: ['film'], hint: 'Użyj pojedynczego warunku liczbowego: WHERE rental_rate = 4.99.' },
      { prompt: 'Pobierz z bazy klientów imiona, nazwiska oraz identyfikatory sklepów dla osób przypisanych do pierwszego oddziału sklepu.', sol: "SELECT first_name, last_name, store_id FROM customer WHERE store_id = 1;", order: false, tables: ['customer'], hint: 'Przefiltruj tabelę customer pojedynczym warunkiem: WHERE store_id = 1.' },
      { prompt: 'Pobierz z katalogu filmów tytuły oraz koszty odtworzenia płyty dla pozycji, których koszt odtworzenia przekracza 20 dolarów.', sol: "SELECT title, replacement_cost FROM film WHERE replacement_cost > 20;", order: false, tables: ['film'], hint: 'Zastosuj operator większości: WHERE replacement_cost > 20.' },
      { prompt: 'Pobierz z katalogu filmów tytuły oraz czas trwania dla krótkich produkcji trwających mniej niż 60 minut.', sol: "SELECT title, length FROM film WHERE length < 60;", order: false, tables: ['film'], hint: 'Zastosuj operator mniejszości: WHERE length < 60.' },
      { prompt: 'Pobierz z katalogu filmów tytuły oraz kategorie wiekowe dla wszystkich filmów, których kategoria wiekowa jest inna niż dla dorosłych (różna od R).', sol: "SELECT title, rating FROM film WHERE rating <> 'R';", order: false, tables: ['film'], hint: 'Użyj operatora różności <> oraz pojedynczych apostrofów wokół tekstu: WHERE rating <> \'R\'.' },
      { prompt: 'Pobierz z katalogu filmów tytuły oraz czas trwania dla filmów familijnych (kategoria G), sortując wynik od najdłuższego filmu malejąco (i pomocniczo po tytule rosnąco).', sol: "SELECT title, length FROM film WHERE rating = 'G' ORDER BY length DESC, title ASC;", order: true, tables: ['film'], hint: 'Połącz pojedynczy warunek WHERE rating = \'G\' z sortowaniem ORDER BY length DESC, title ASC.' },
      { prompt: 'Pobierz z rejestru płatności 5 najwyższych wpłat przekraczających 5 dolarów (identyfikator płatności, kwotę oraz datę), sortując wynik od najwyższej kwoty malejąco (i po identyfikatorze płatności rosnąco).', sol: "SELECT payment_id, amount, payment_date FROM payment WHERE amount > 5 ORDER BY amount DESC, payment_id ASC LIMIT 5;", order: true, tables: ['payment'], hint: 'Zastosuj WHERE amount > 5, a następnie ORDER BY amount DESC, payment_id ASC LIMIT 5.' },
      { prompt: 'Pobierz z katalogu filmów 3 najkrótsze filmy z kategorii dla młodzieży (PG-13), zwracając tytuł oraz czas trwania pod nowym aliasem, posortowane rosnąco po czasie trwania i alfabetycznie po tytule.', sol: "SELECT title, length AS duration_min FROM film WHERE rating = 'PG-13' ORDER BY length ASC, title ASC LIMIT 3;", order: true, tables: ['film'], hint: 'Użyj aliasu length AS duration_min, pojedynczego warunku WHERE rating = \'PG-13\', sortowania ORDER BY length ASC, title ASC oraz LIMIT 3.' },
      { prompt: 'Pobierz z bazy klientów imiona, nazwiska oraz daty rejestracji dla aktywnych klientów, sortując listę od najpóźniej zarejestrowanej osoby malejąco (i po identyfikatorze klienta rosnąco).', sol: "SELECT first_name, last_name, create_date FROM customer WHERE active = 1 ORDER BY create_date DESC, customer_id ASC;", order: true, tables: ['customer'], hint: 'Przefiltruj aktywnych klientów przez WHERE active = 1 i posortuj ORDER BY create_date DESC, customer_id ASC.' },
      { prompt: 'Pobierz z katalogu filmów unikalne ceny wypożyczenia dla filmów trwających co najmniej 120 minut, sortując wynik od najniższej ceny rosnąco.', sol: "SELECT DISTINCT rental_rate FROM film WHERE length >= 120 ORDER BY rental_rate ASC;", order: true, tables: ['film'], hint: 'Połącz SELECT DISTINCT rental_rate, pojedynczy warunek WHERE length >= 120 oraz ORDER BY rental_rate ASC.' }
    ]
  },
  {
    id: 'p2_1', stage: 2, title: '2.1 Łączenie warunków: AND, OR, IN, BETWEEN oraz ILIKE',
    tables: ['film', 'customer', 'payment', 'actor'],
    cols: ['WHERE', 'AND', 'OR', 'IN', 'NOT IN', 'BETWEEN', 'ILIKE', 'ORDER BY', 'LIMIT'],
    gapId: 'g3',
    theory: '<ul>' +
      '<li><strong><code>AND</code> oraz <code>OR</code>:</strong> <code>AND</code> wymaga spełnienia obu warunków naraz, a <code>OR</code> przynajmniej jednego. <em>Pułapka:</em> spójnik <code>AND</code> ma wyższy priorytet niż <code>OR</code>, dlatego alternatywę <code>OR</code> przy łączeniu z <code>AND</code> bierzemy w nawiasy <code>(...)</code>!</li>' +
      '<li><strong><code>IN (a, b, c)</code>:</strong> sprawdza, czy wartość kolumny należy do podanej listy wartości (zastępuje wielokrotne pisanie <code>OR</code>).</li>' +
      '<li><strong><code>BETWEEN x AND y</code>:</strong> filtruje przedział domknięty (obejmuje obie wartości skrajne <code>x</code> oraz <code>y</code>).</li>' +
      '<li><strong><code>ILIKE</code>:</strong> wyszukuje wzorce tekstowe w PostgreSQL bez zwracania uwagi na wielkość liter (<code>%</code> zastępuje dowolny ciąg znaków).</li>' +
      '</ul>' +
      '<div class="theory-code"><code>SELECT title, rating, length\nFROM film\nWHERE rating IN (\'PG\', \'PG-13\')\n  AND length BETWEEN 90 AND 120\nORDER BY length DESC;</code></div>',
    variants: [
      { prompt: 'Pobierz z katalogu filmów tytuły, kategorie wiekowe oraz czas trwania dla filmów z kategorii dla dorosłych (R), które trwają dłużej niż 120 minut, posortowane alfabetycznie po tytule.', sol: "SELECT title, rating, length FROM film WHERE rating = 'R' AND length > 120 ORDER BY title ASC;", order: true, tables: ['film'], hint: 'Połącz dwa warunki spójnikiem AND: WHERE rating = \'R\' AND length > 120.' },
      { prompt: 'Pobierz z katalogu filmów tytuły, czas trwania oraz ceny wypożyczenia dla filmów, które są bardzo krótkie (poniżej 60 minut) lub bardzo tanie (cena wypożyczenia 0.99), posortowane po tytule rosnąco.', sol: "SELECT title, length, rental_rate FROM film WHERE length < 60 OR rental_rate = 0.99 ORDER BY title ASC;", order: true, tables: ['film'], hint: 'Połącz dwa warunki alternatywą OR: WHERE length < 60 OR rental_rate = 0.99.' },
      { prompt: 'Pobierz z katalogu filmów tytuły oraz kategorie wiekowe dla filmów należących do jednej z trzech kategorii: familijnej (G), z nadzorem rodziców (PG) lub młodzieżowej (PG-13), posortowane po tytule rosnąco.', sol: "SELECT title, rating FROM film WHERE rating IN ('G', 'PG', 'PG-13') ORDER BY title ASC;", order: true, tables: ['film'], hint: 'Użyj operatora listy wartości: WHERE rating IN (\'G\', \'PG\', \'PG-13\').' },
      { prompt: 'Pobierz z katalogu filmów tytuły oraz koszty odtworzenia płyty dla filmów, których koszt odtworzenia mieści się w przedziale od 15 do 20 dolarów włącznie, posortowane po tytule rosnąco.', sol: "SELECT title, replacement_cost FROM film WHERE replacement_cost BETWEEN 15 AND 20 ORDER BY title ASC;", order: true, tables: ['film'], hint: 'Użyj operatora przedziału domkniętego: WHERE replacement_cost BETWEEN 15 AND 20.' },
      { prompt: 'Pobierz z katalogu filmów tytuły oraz kategorie wiekowe dla filmów, których tytuł zaczyna się na literę A (niezależnie od wielkości liter), posortowane alfabetycznie po tytule.', sol: "SELECT title, rating FROM film WHERE title ILIKE 'a%' ORDER BY title ASC;", order: true, tables: ['film'], hint: 'Użyj operatora ILIKE z symbolem wieloznacznym % na końcu: WHERE title ILIKE \'a%\'.' },
      { prompt: 'Pobierz z katalogu filmów 5 najdłuższych produkcji z kategorii familijnej lub rodzicielskiej (G oraz PG), których cena wypożyczenia nie przekracza 2.99, zwracając tytuł, kategorię oraz czas trwania pod nowym aliasem.', sol: "SELECT title, rating, length AS duration_min FROM film WHERE rating IN ('G', 'PG') AND rental_rate <= 2.99 ORDER BY length DESC, title ASC LIMIT 5;", order: true, tables: ['film'], hint: 'Połącz WHERE rating IN (\'G\', \'PG\') AND rental_rate <= 2.99 z aliasem length AS duration_min, sortowaniem ORDER BY length DESC, title ASC i LIMIT 5.' },
      { prompt: 'Pobierz z rejestru płatności wpłaty z maja 2026 roku (od 2026-05-01 do 2026-05-31 włącznie) o kwocie co najmniej 5 dolarów, zwracając identyfikator płatności, kwotę oraz datę wpłaty posortowane od najwyższej kwoty malejąco.', sol: "SELECT payment_id, amount, payment_date FROM payment WHERE payment_date BETWEEN '2026-05-01' AND '2026-05-31' AND amount >= 5 ORDER BY amount DESC, payment_id ASC;", order: true, tables: ['payment'], hint: 'Połącz zakres dat payment_date BETWEEN \'2026-05-01\' AND \'2026-05-31\' ze spójnikiem AND amount >= 5.' },
      { prompt: 'Pobierz z bazy klientów aktywnych klientów przypisanych do pierwszego sklepu, których nazwisko zaczyna się na literę S lub B (bez względu na wielkość liter), posortowanych alfabetycznie po nazwisku.', sol: "SELECT first_name, last_name, store_id FROM customer WHERE active = 1 AND store_id = 1 AND (last_name ILIKE 's%' OR last_name ILIKE 'b%') ORDER BY last_name ASC, first_name ASC;", order: true, tables: ['customer'], hint: 'Pamiętaj o nawiasach wokół alternatywy OR: WHERE active = 1 AND store_id = 1 AND (last_name ILIKE \'s%\' OR last_name ILIKE \'b%\').' },
      { prompt: 'Pobierz z katalogu filmów unikalne kategorie wiekowe dla filmów trwających od 90 do 150 minut włącznie, których cena wypożyczenia jest wyższa niż 0.99, posortowane alfabetycznie po kategorii.', sol: "SELECT DISTINCT rating FROM film WHERE length BETWEEN 90 AND 150 AND rental_rate > 0.99 ORDER BY rating ASC;", order: true, tables: ['film'], hint: 'Połącz SELECT DISTINCT rating z warunkami WHERE length BETWEEN 90 AND 150 AND rental_rate > 0.99 oraz ORDER BY rating ASC.' },
      { prompt: 'Pobierz z katalogu filmów 4 najdroższe w odtworzeniu filmy, które nie należą do kategorii familijnych (G ani PG) i zawierają w tytule literę O (w dowolnym miejscu, bez względu na wielkość liter), zwracając tytuł, kategorię oraz koszt odtworzenia pod nowym aliasem.', sol: "SELECT title, rating, replacement_cost AS cost_usd FROM film WHERE rating NOT IN ('G', 'PG') AND title ILIKE '%o%' ORDER BY replacement_cost DESC, title ASC LIMIT 4;", order: true, tables: ['film'], hint: 'Zastosuj WHERE rating NOT IN (\'G\', \'PG\') AND title ILIKE \'%o%\' oraz ORDER BY replacement_cost DESC, title ASC LIMIT 4.' }
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
      title: 'Jak zbudować najprostsze zapytanie SELECT?',
      syntax: "SELECT kolumna1, kolumna2 AS nowa_nazwa, kolumna2 * 100 AS wyliczenie\nFROM nazwa_tabeli;",
      bullets: [
        '<strong><code>SELECT</code>:</strong> wskazuje, które kolumny chcesz wyciągnąć i zobaczyć w wyniku.',
        '<strong><code>FROM</code>:</strong> wskazuje nazwę tabeli w bazie danych, z której pobierasz wiersze.',
        '<strong>Gwiazdka <code>*</code> i przecinki:</strong> kilka kolumn rozdzielasz przecinkiem (np. <code>first_name, last_name</code>), a symbol <code>*</code> pobiera wszystkie kolumny tabeli.',
        '<strong>Aliasy <code>AS</code> i matematyka:</strong> możesz zmieniać nagłówki kolumn przez <code>AS</code> oraz wykonywać proste obliczenia (<code>+</code>, <code>-</code>, <code>*</code>, <code>/</code>).'
      ]
    },
    {
      title: 'Kolejność pisania vs Kolejność wykonywania przez PostgreSQL',
      focusWrite: ['SELECT', 'FROM'],
      focusExec: [1, 5],
      note: '<strong>Dlaczego to ważne w Lekcji 1.1?</strong> W kodzie najpierw piszesz <code>SELECT</code>, a potem <code>FROM</code>. Jednak silnik PostgreSQL pod maską najpierw otwiera tabelę wskazaną w <code>1. FROM</code>, a dopiero potem w kroku <code>5. SELECT</code> wycina wybrane kolumny, wykonuje mnożenie/dzielenie i nadaje im aliasy <code>AS</code>!'
    },
    {
      title: 'Przykład na żywo (dvdrental)',
      code: "SELECT\n  title,\n  rental_rate AS cena_usd,\n  rental_rate * 4 AS cena_pln\nFROM film;",
      lines: [
        { line: 'FROM film;', desc: 'Krok 1 silnika: otwiera tabelę katalogu filmów (film).' },
        { line: 'SELECT title,', desc: 'Krok 5 silnika: wybiera oryginalną kolumnę z tytułem filmu.' },
        { line: 'rental_rate AS cena_usd,', desc: 'Krok 5 silnika: wybiera cenę wypożyczenia i zmienia jej nagłówek na cena_usd.' },
        { line: 'rental_rate * 4 AS cena_pln', desc: 'Krok 5 silnika: mnoży cenę przez 4 i wyświetla wynik w nowej kolumnie cena_pln.' }
      ]
    },
    {
      title: 'Sprawdź się przed zadaniami!',
      quiz: {
        question: 'Które zapytanie poprawnie pobierze dwie kolumny `first_name` oraz `last_name` z tabeli `actor`?',
        options: [
          'SELECT first_name, last_name, FROM actor;',
          'SELECT first_name, last_name FROM actor;',
          'FROM actor SELECT first_name last_name;'
        ],
        correct: 1,
        explanation: 'Brawo! Kolumny po SELECT rozdzielamy przecinkami, ale bezpośrednio przed słowem FROM nigdy nie stawiamy przecinka.'
      }
    }
  ],
  p1_2: [
    {
      title: 'Jak uporządkować wynik: DISTINCT, ORDER BY i LIMIT?',
      syntax: "SELECT DISTINCT kolumna1, kolumna2\nFROM tabela\nORDER BY kolumna1 DESC, kolumna2 ASC\nLIMIT 5;",
      bullets: [
        '<strong><code>SELECT DISTINCT</code>:</strong> usuwa duplikaty i zwraca tylko unikalne (niepowtarzające się) wiersze.',
        '<strong><code>ORDER BY kolumna ASC / DESC</code>:</strong> sortuje wynik rosnąco (<code>ASC</code> – domyślnie) lub malejąco (<code>DESC</code>).',
        '<strong><code>LIMIT n</code>:</strong> odcina wynik do pierwszych <code>n</code> wierszy (np. <code>LIMIT 5</code> zwraca Top 5 wierszy).'
      ]
    },
    {
      title: 'Kolejność pisania vs Kolejność wykonywania przez PostgreSQL',
      focusWrite: ['SELECT', 'FROM', 'ORDER BY', 'LIMIT'],
      focusExec: [1, 5, 6, 7, 8],
      note: '<strong>Dlaczego to ważne w Lekcji 1.2?</strong> Popatrz na sam koniec potoku wykonawczego: po wybraniu kolumn (<code>5. SELECT</code>) i usunięciu duplikatów (<code>6. DISTINCT</code>), silnik wykonuje <code>7. ORDER BY</code> (gdzie widzi już aliasy z <code>SELECT</code>!), a na samym końcu <code>8. LIMIT</code> odcina pierwsze wiersze z posortowanej listy.'
    },
    {
      title: 'Przykład na żywo (dvdrental)',
      code: "SELECT\n  title,\n  length AS duration_min\nFROM film\nORDER BY length DESC, title ASC\nLIMIT 5;",
      lines: [
        { line: 'FROM film', desc: 'Krok 1 silnika: pobiera wszystkie wiersze z katalogu filmów.' },
        { line: 'SELECT title, length AS duration_min', desc: 'Krok 5 silnika: wybiera tytuł i czas trwania z aliasem duration_min.' },
        { line: 'ORDER BY length DESC, title ASC', desc: 'Krok 7 silnika: ustawia filmy od najdłuższego, a przy równym czasie alfabetycznie.' },
        { line: 'LIMIT 5;', desc: 'Krok 8 silnika: zostawia tylko 5 pierwszych (najdłuższych) filmów.' }
      ]
    },
    {
      title: 'Sprawdź się przed zadaniami!',
      quiz: {
        question: 'Dlaczego klauzula LIMIT znajduje się na samym końcu kolejności wykonywania (Krok 8 po ORDER BY)?',
        options: [
          'Aby najpierw posortować cały wynik i dopiero z posortowanej listy odciąć TOP N wierszy',
          'Ponieważ LIMIT losuje wiersze przed wybraniem kolumn w SELECT',
          'Kolejność między ORDER BY a LIMIT nie ma znaczenia'
        ],
        correct: 0,
        explanation: 'Dokładnie! Wykonanie ORDER BY (7) przed LIMIT (8) gwarantuje, że odcinamy prawdziwe Top N (np. 5 najdłuższych filmów).'
      }
    }
  ],
  p1_3: [
    {
      title: 'Jak filtrować wiersze pojedynczym warunkiem WHERE?',
      syntax: "SELECT kolumna1, kolumna2\nFROM tabela\nWHERE kolumna1 = 'wartosc'\nORDER BY kolumna2 DESC\nLIMIT 5;",
      bullets: [
        '<strong><code>WHERE warunek</code>:</strong> działa jak sito — sprawdza każdy wiersz tabeli i przepuszcza tylko te, które spełniają warunek.',
        '<strong>Operatory porównania:</strong> <code>=</code> (równy), <code>&gt;</code> (większy), <code>&lt;</code> (mniejszy), <code>&gt;=</code>, <code>&lt;=</code> oraz <code>&lt;&gt;</code> (różny od).',
        '<strong>Teksty w apostrofach:</strong> napisy i daty w <code>WHERE</code> otaczamy pojedynczymi apostrofami (np. <code>WHERE rating = \'PG\'</code>), a liczby piszemy bez apostrofów (np. <code>WHERE length &gt; 120</code>).'
      ]
    },
    {
      title: 'Kolejność pisania vs Kolejność wykonywania przez PostgreSQL',
      focusWrite: ['SELECT', 'FROM', 'WHERE', 'ORDER BY', 'LIMIT'],
      focusExec: [1, 2, 5, 7, 8],
      note: '<strong>Klasyczna pułapka!</strong> Klauzula <code>2. WHERE</code> wykonuje się zaraz po <code>1. FROM</code> — czyli <em>zanim</em> wykona się <code>5. SELECT</code>! Dlatego w <code>WHERE</code> filtrujesz po oryginalnych kolumnach tabeli i nie możesz użyć aliasu stworzonego w <code>SELECT</code>.'
    },
    {
      title: 'Przykład na żywo (dvdrental)',
      code: "SELECT title, length AS duration_min\nFROM film\nWHERE rating = 'PG-13'\nORDER BY length ASC, title ASC\nLIMIT 3;",
      lines: [
        { line: 'FROM film', desc: 'Krok 1 silnika: otwiera tabelę katalogu filmów.' },
        { line: "WHERE rating = 'PG-13'", desc: 'Krok 2 silnika: zostawia wyłącznie filmy z kategorii wiekowej PG-13.' },
        { line: 'SELECT title, length AS duration_min', desc: 'Krok 5 silnika: pobiera tytuł oraz czas trwania pod aliasem duration_min.' },
        { line: 'ORDER BY length ASC, title ASC LIMIT 3;', desc: 'Kroki 7–8 silnika: sortuje od najkrótszego filmu i odcina 3 pierwsze pozycje.' }
      ]
    },
    {
      title: 'Sprawdź się przed zadaniami!',
      quiz: {
        question: 'Który zapis warunku WHERE dla tekstu i liczby jest w 100% poprawny w PostgreSQL?',
        options: [
          'WHERE rating = PG (bez apostrofów wokół tekstu)',
          "WHERE rating = 'PG' (tekst w pojedynczych apostrofach) lub WHERE length > 120 (liczba bez apostrofów)",
          'WHERE rating == "PG"'
        ],
        correct: 1,
        explanation: 'Świetnie! W SQL równość zapisujemy pojedynczym znakiem =, a literały tekstowe ujmujemy w pojedyncze apostrofy \'PG\'.'
      }
    }
  ],
  p2_1: [
    {
      title: 'Jak łączyć warunki: AND, OR, IN, BETWEEN oraz ILIKE?',
      syntax: "SELECT title, rating, length\nFROM film\nWHERE rating IN ('G', 'PG')\n  AND length BETWEEN 60 AND 120\n  AND title ILIKE 'a%';",
      bullets: [
        '<strong><code>AND</code> oraz <code>OR</code>:</strong> <code>AND</code> wymaga spełnienia obu warunków naraz, a <code>OR</code> przynajmniej jednego (pamiętaj o nawiasach wokół <code>OR</code>!).',
        '<strong><code>IN (\'G\', \'PG\')</code>:</strong> sprawdza, czy wartość należy do podanej listy (zastępuje długie łańcuchy <code>OR</code>).',
        '<strong><code>BETWEEN 60 AND 90</code>:</strong> filtruje przedział domknięty (od 60 do 90 włącznie z obiema granicami).',
        '<strong><code>ILIKE \'a%\'</code>:</strong> wyszukuje tekst zaczynający się na literę A bez względu na wielkość liter.'
      ]
    },
    {
      title: 'Kolejność pisania vs Kolejność wykonywania przez PostgreSQL',
      focusWrite: ['SELECT', 'FROM', 'WHERE', 'ORDER BY', 'LIMIT'],
      focusExec: [1, 2, 5, 6, 7, 8],
      note: '<strong>Dlaczego to ważne w Lekcji 2.1?</strong> Wszystkie operatory <code>AND</code>, <code>OR</code>, <code>IN</code>, <code>BETWEEN</code> oraz <code>ILIKE</code> są obliczane wewnątrz kroku <code>2. WHERE</code> dla każdego wiersza z osobna. Pamiętaj, że <code>AND</code> ma wyższy priorytet niż <code>OR</code>!'
    },
    {
      title: 'Przykład na żywo (dvdrental)',
      code: "SELECT title, rating, length AS duration_min\nFROM film\nWHERE rating IN ('G', 'PG')\n  AND rental_rate <= 2.99\nORDER BY length DESC, title ASC\nLIMIT 5;",
      lines: [
        { line: "WHERE rating IN ('G', 'PG')", desc: 'Krok 2 silnika: zostawia filmy o kategorii G lub PG.' },
        { line: 'AND rental_rate <= 2.99', desc: 'Krok 2 silnika: zawęża wynik do filmów kosztujących najwyżej 2.99.' },
        { line: 'SELECT title, rating, length AS duration_min', desc: 'Krok 5 silnika: wybiera kolumny i nadaje alias dla czasu trwania.' },
        { line: 'ORDER BY length DESC, title ASC LIMIT 5;', desc: 'Kroki 7–8 silnika: sortuje od najdłuższego filmu i zwraca Top 5.' }
      ]
    },
    {
      title: 'Sprawdź się przed zadaniami!',
      quiz: {
        question: 'Co oznacza warunek `WHERE length BETWEEN 60 AND 90` w języku SQL?',
        options: [
          'Filmy trwające ściśle powyżej 60 i poniżej 90 minut (bez 60 i 90)',
          'Filmy trwające od 60 do 90 minut włącznie (odpowiednik length >= 60 AND length <= 90)',
          'Filmy trwające dokładnie 60 lub dokładnie 90 minut'
        ],
        correct: 1,
        explanation: 'Tak jest! Operator BETWEEN ... AND ... w SQL jest zawsze przedziałem domkniętym — obejmuje obie wartości brzegowe.'
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

/* ==========================================================================
   7. ZADANIA ROZGRZEWKOWE (R1–R3) DLA KAŻDEJ Z 12 LEKCJI (3 × 12 = 36 ZADAŃ)
   Razem ze 120 zadaniami głównymi (1–10) daje to 156 zadań w Ścieżce!
   ========================================================================== */
var LESSON_WARMUPS = {
  p1_1: [
    {
      stepCode: 'R1', isWarmup: true,
      goal: 'Przygotuj pełną listę samych tytułów wszystkich filmów dostępnych w naszym katalogu.',
      prompt: 'Pobierz z katalogu filmów samą kolumnę z tytułem filmu (wszystkie wiersze, bez filtrowania).',
      sol: 'SELECT title FROM film;',
      order: false, tables: ['film'],
      hint: 'Wpisz: SELECT title FROM film;'
    },
    {
      stepCode: 'R2', isWarmup: true,
      goal: 'Przygotuj listę imion oraz nazwisk wszystkich aktorów występujących w naszej bazie.',
      prompt: 'Pobierz z listy aktorów dwie kolumny: imię oraz nazwisko aktora.',
      sol: 'SELECT first_name, last_name FROM actor;',
      order: false, tables: ['actor'],
      hint: 'Oddziel nazwy kolumn przecinkiem: SELECT first_name, last_name FROM actor;'
    },
    {
      stepCode: 'R3', isWarmup: true,
      goal: 'Wyświetl wszystkie dostępne kolumny i wiersze ze słownika kategorii filmowych.',
      prompt: 'Pobierz ze słownika kategorii wszystkie dostępne kolumny za pomocą symbolu gwiazdki.',
      sol: 'SELECT * FROM category;',
      order: false, tables: ['category'],
      hint: 'Użyj gwiazdki po SELECT: SELECT * FROM category;'
    }
  ],
  p1_2: [
    {
      stepCode: 'R1', isWarmup: true,
      goal: 'Sprawdź, jakie unikalne kategorie wiekowe występują w naszym katalogu filmów (każda kategoria ma pojawić się na liście tylko raz).',
      prompt: 'Pobierz z katalogu filmów unikalne wartości kategorii wiekowej.',
      sol: 'SELECT DISTINCT rating FROM film;',
      order: false, tables: ['film'],
      hint: 'Wpisz: SELECT DISTINCT rating FROM film;'
    },
    {
      stepCode: 'R2', isWarmup: true,
      goal: 'Przygotuj alfabetyczną listę wszystkich filmów wraz z ich ceną wypożyczenia, posortowaną od A do Z po tytule.',
      prompt: 'Pobierz z katalogu filmów tytuł oraz cenę wypożyczenia, sortując wynik alfabetycznie rosnąco po tytule.',
      sol: 'SELECT title, rental_rate FROM film ORDER BY title ASC;',
      order: true, tables: ['film'],
      hint: 'Na końcu zapytania dopisz: ORDER BY title ASC;'
    },
    {
      stepCode: 'R3', isWarmup: true,
      goal: 'Wyświetl tylko pierwszych 5 wierszy z katalogu filmów (identyfikator oraz tytuł), aby szybko podejrzeć zawartość tabeli.',
      prompt: 'Pobierz z katalogu filmów identyfikator filmu oraz tytuł, ograniczając liczbę zwracanych wierszy do 5.',
      sol: 'SELECT film_id, title FROM film LIMIT 5;',
      order: false, tables: ['film'],
      hint: 'Na końcu zapytania dopisz: LIMIT 5;'
    }
  ],
  p1_3: [
    {
      stepCode: 'R1', isWarmup: true,
      goal: 'Wypisz z katalogu tytuły oraz ceny wypożyczenia tylko dla najtańszych filmów kosztujących dokładnie 0.99 dolara.',
      prompt: 'Pobierz z katalogu filmów tytuł oraz cenę wypożyczenia dla filmów o cenie wypożyczenia równej 0.99.',
      sol: 'SELECT title, rental_rate FROM film WHERE rental_rate = 0.99;',
      order: false, tables: ['film'],
      hint: 'Wpisz: SELECT title, rental_rate FROM film WHERE rental_rate = 0.99;'
    },
    {
      stepCode: 'R2', isWarmup: true,
      goal: 'Wypisz z katalogu tytuły oraz kategorie wiekowe tylko dla filmów z kategorii PG.',
      prompt: 'Pobierz z katalogu filmów tytuł oraz kategorię wiekową dla filmów posiadających kategorię PG.',
      sol: "SELECT title, rating FROM film WHERE rating = 'PG';",
      order: false, tables: ['film'],
      hint: "Tekst w WHERE zapisz w pojedynczych apostrofach: WHERE rating = 'PG';"
    },
    {
      stepCode: 'R3', isWarmup: true,
      goal: 'Wyciągnij z katalogu tytuły oraz czas trwania tylko dla długich filmów trwających ponad 120 minut.',
      prompt: 'Pobierz z katalogu filmów tytuł oraz czas trwania dla filmów trwających dłużej niż 120 minut.',
      sol: 'SELECT title, length FROM film WHERE length > 120;',
      order: false, tables: ['film'],
      hint: 'Użyj operatora większości: WHERE length > 120;'
    }
  ],
  p2_1: [
    {
      stepCode: 'R1', isWarmup: true,
      goal: 'Znajdź w katalogu filmy młodzieżowe (kategoria PG-13), które jednocześnie kosztują 4.99 dolara.',
      prompt: 'Pobierz z katalogu filmów tytuł, kategorię wiekową oraz cenę wypożyczenia dla filmów o kategorii PG-13 i jednocześnie cenie równej 4.99.',
      sol: "SELECT title, rating, rental_rate FROM film WHERE rating = 'PG-13' AND rental_rate = 4.99;",
      order: false, tables: ['film'],
      hint: "Połącz oba warunki operatorem AND: WHERE rating = 'PG-13' AND rental_rate = 4.99;"
    },
    {
      stepCode: 'R2', isWarmup: true,
      goal: 'Wypisz tytuły oraz kategorie wiekowe filmów należących do kategorii familijnej (G) lub dla dorosłych (R).',
      prompt: 'Pobierz z katalogu filmów tytuł oraz kategorię wiekową dla filmów należących do zbioru kategorii G lub R za pomocą operatora listy.',
      sol: "SELECT title, rating FROM film WHERE rating IN ('G', 'R');",
      order: false, tables: ['film'],
      hint: "Użyj operatora IN: WHERE rating IN ('G', 'R');"
    },
    {
      stepCode: 'R3', isWarmup: true,
      goal: 'Klienci szukają filmów trwających od godziny do półtorej (od 60 do 90 minut włącznie). Przygotuj listę ich tytułów oraz czasu trwania.',
      prompt: 'Pobierz z katalogu filmów tytuł oraz czas trwania dla filmów mieszczących się w przedziale od 60 do 90 minut włącznie.',
      sol: 'SELECT title, length FROM film WHERE length BETWEEN 60 AND 90;',
      order: false, tables: ['film'],
      hint: 'Użyj operatora zakresu: WHERE length BETWEEN 60 AND 90;'
    }
  ],
  p2_2: [
    {
      stepCode: 'R1', isWarmup: true,
      goal: 'Oblicz całkowity przychód ze wszystkich płatności zarejestrowanych w bazie danych.',
      prompt: 'Rozgrzewka R1 (SUM): Z tabeli `payment` oblicz łączną sumę wszystkich kwot `amount` jako `total_revenue`.',
      sol: 'SELECT SUM(amount) AS total_revenue FROM payment;',
      order: false, tables: ['payment'],
      hint: 'Użyj funkcji SUM(amount) AS total_revenue na tabeli payment.'
    },
    {
      stepCode: 'R2', isWarmup: true,
      goal: 'Policz, ile filmów przypada na każdą kategorię wiekową w katalogu.',
      prompt: 'Rozgrzewka R2 (GROUP BY): Z tabeli `film` wybierz `rating` oraz liczbę filmów `COUNT(*) AS film_cnt`, grupując wynik po `rating`.',
      sol: 'SELECT rating, COUNT(*) AS film_cnt FROM film GROUP BY rating;',
      order: false, tables: ['film'],
      hint: 'Wybierz rating, COUNT(*) AS film_cnt i pogrupuj przez GROUP BY rating.'
    },
    {
      stepCode: 'R3', isWarmup: true,
      goal: 'Podlicz łączną wartość wpłat przyjętych przez każdego pracownika i pozostaw w zestawieniu tylko tych pracowników, którzy zebrali łącznie ponad 20 dolarów.',
      prompt: 'Rozgrzewka R3 (GROUP BY + HAVING): Z tabeli `payment` wybierz `staff_id` oraz `SUM(amount) AS total_sales` pogrupowane po `staff_id`, zostawiając grupy z sumą powyżej `20`.',
      sol: 'SELECT staff_id, SUM(amount) AS total_sales FROM payment GROUP BY staff_id HAVING SUM(amount) > 20;',
      order: false, tables: ['payment'],
      hint: 'Po GROUP BY staff_id dopisz HAVING SUM(amount) > 20;'
    }
  ],
  p3_1: [
    {
      stepCode: 'R1', isWarmup: true,
      goal: 'Przygotuj listę wszystkich pracowników wraz z nazwą miasta oddziału sklepu, w którym pracują.',
      prompt: 'Rozgrzewka R1 (JOIN 2 tabel): Połącz `staff s` z `store st` po kluczu `ON s.store_id = st.store_id` i wybierz `s.first_name`, `s.last_name`, `st.city`.',
      sol: 'SELECT s.first_name, s.last_name, st.city FROM staff s JOIN store st ON s.store_id = st.store_id;',
      order: false, tables: ['staff', 'store'],
      hint: 'Użyj: FROM staff s JOIN store st ON s.store_id = st.store_id'
    },
    {
      stepCode: 'R2', isWarmup: true,
      goal: 'Wyświetl pierwsze 5 wypożyczeń z bazy wraz z imieniem klienta, który dokonał danego wypożyczenia.',
      prompt: 'Rozgrzewka R2 (JOIN + ORDER BY + LIMIT): Połącz `customer c` oraz `rental r` (`ON c.customer_id = r.customer_id`). Wybierz `c.first_name`, `r.rental_id`, `r.rental_date`, posortuj po `r.rental_id` i daj `LIMIT 5`.',
      sol: 'SELECT c.first_name, r.rental_id, r.rental_date FROM customer c JOIN rental r ON c.customer_id = r.customer_id ORDER BY r.rental_id LIMIT 5;',
      order: true, tables: ['customer', 'rental'],
      hint: 'Połącz customer i rental po customer_id, a na końcu dodaj ORDER BY r.rental_id LIMIT 5.'
    },
    {
      stepCode: 'R3', isWarmup: true,
      goal: 'Wyszukaj pojedyncze płatności przekraczające 7 dolarów i wyświetl imię oraz nazwisko klienta obok kwoty transakcji.',
      prompt: 'Rozgrzewka R3 (JOIN + WHERE): Połącz `customer c` i `payment p` (`ON c.customer_id = p.customer_id`). Wypisz `c.first_name`, `c.last_name`, `p.amount` dla `p.amount > 7.00`.',
      sol: 'SELECT c.first_name, c.last_name, p.amount FROM customer c JOIN payment p ON c.customer_id = p.customer_id WHERE p.amount > 7.00;',
      order: false, tables: ['customer', 'payment'],
      hint: 'Po JOIN ON dodaj filtr WHERE p.amount > 7.00;'
    }
  ],
  p3_2: [
    {
      stepCode: 'R1', isWarmup: true,
      goal: 'Wypisz wszystkich klientów przypisanych do sklepu nr 1 wraz z identyfikatorami ich wypożyczeń — zachowując na liście także tych klientów, którzy nigdy nic nie wypożyczyli.',
      prompt: 'Rozgrzewka R1 (LEFT JOIN): Połącz `customer c` przez `LEFT JOIN` z `rental r` (`ON c.customer_id = r.customer_id`) dla `c.store_id = 1`. Zwróć `c.customer_id`, `c.first_name`, `r.rental_id` posortowane po `c.customer_id, r.rental_id`.',
      sol: 'SELECT c.customer_id, c.first_name, r.rental_id FROM customer c LEFT JOIN rental r ON c.customer_id = r.customer_id WHERE c.store_id = 1 ORDER BY c.customer_id, r.rental_id;',
      order: true, tables: ['customer', 'rental'],
      hint: 'Użyj LEFT JOIN rental r ON c.customer_id = r.customer_id.'
    },
    {
      stepCode: 'R2', isWarmup: true,
      goal: 'Dla pierwszych 5 wypożyczeń wyświetl identyfikator, datę wypożyczenia oraz status zwrotu, w którym brakująca data zwrotu zostanie zastąpiona czytelnym napisem „Brak zwrotu”.',
      prompt: 'Rozgrzewka R2 (COALESCE): Z tabeli `rental` wybierz `rental_id`, `rental_date` oraz status zwrotu `status` (podmień `NULL` w `return_date` na `\'Brak zwrotu\'`), posortuj po `rental_id` i daj `LIMIT 5`.',
      sol: "SELECT rental_id, rental_date, COALESCE(return_date::text, 'Brak zwrotu') AS status FROM rental ORDER BY rental_id LIMIT 5;",
      order: true, tables: ['rental'],
      hint: "Funkcja COALESCE(return_date::text, 'Brak zwrotu') AS status podmienia NULL na podany tekst."
    },
    {
      stepCode: 'R3', isWarmup: true,
      goal: 'Podlicz liczbę filmów przypisanych do każdej kategorii z katalogu, upewniając się, że kategorie bez żadnego filmu również pojawią się w raporcie z wartością 0.',
      prompt: 'Rozgrzewka R3 (LEFT JOIN + COUNT klucza): Połącz `category c` przez `LEFT JOIN` z `film_category fc` (`ON c.category_id = fc.category_id`). Zwróć `c.name` oraz `COUNT(fc.film_id) AS films_cnt` pogrupowane po `c.name`.',
      sol: 'SELECT c.name, COUNT(fc.film_id) AS films_cnt FROM category c LEFT JOIN film_category fc ON c.category_id = fc.category_id GROUP BY c.name;',
      order: false, tables: ['category', 'film_category'],
      hint: 'Licz kolumnę prawej tabeli COUNT(fc.film_id) AS films_cnt, aby dla braku dopasowania dostać 0.'
    }
  ],
  p4_1: [
    {
      stepCode: 'R1', isWarmup: true,
      goal: 'Dla każdego klienta przygotuj czytelną etykietę tekstową informującą, czy jego konto jest aktywne („Aktywny” dla wartości 1, „Nieaktywny” w przeciwnym razie).',
      prompt: 'Rozgrzewka R1 (CASE WHEN): Z tabeli `customer` wybierz `first_name`, `active` oraz kolumnę warunkową `status` (`\'Aktywny\'` gdy `active = 1`, w przeciwnym razie `\'Nieaktywny\'`).',
      sol: "SELECT first_name, active, CASE WHEN active = 1 THEN 'Aktywny' ELSE 'Nieaktywny' END AS status FROM customer;",
      order: false, tables: ['customer'],
      hint: "Każdy blok CASE WHEN ... THEN ... ELSE ... musisz zamknąć słowem END AS status."
    },
    {
      stepCode: 'R2', isWarmup: true,
      goal: 'Zestaw obok siebie w jednym wierszu ogólną liczbę wszystkich filmów w katalogu oraz liczbę filmów należących do kategorii wiekowej PG-13.',
      prompt: 'Rozgrzewka R2 (FILTER WHERE): Z tabeli `film` zwróć w jednym wierszu `COUNT(*) AS all_films` oraz liczbę filmów o ratingu `\'PG-13\'` jako `pg13_films`.',
      sol: "SELECT COUNT(*) AS all_films, COUNT(*) FILTER (WHERE rating = 'PG-13') AS pg13_films FROM film;",
      order: false, tables: ['film'],
      hint: "Składnia PG: COUNT(*) AS all_films, COUNT(*) FILTER (WHERE rating = 'PG-13') AS pg13_films."
    },
    {
      stepCode: 'R3', isWarmup: true,
      goal: 'Oblicz, jaki procent wszystkich klientów w bazie ma obecnie aktywne konto (wynik zaokrąglij do 2 miejsc po przecinku).',
      prompt: 'Rozgrzewka R3 (Procent * 100.0 + ROUND): Z tabeli `customer` oblicz procent aktywnych klientów (`active = 1`) zaokrąglony do 2 miejsc jako `active_pct`.',
      sol: 'SELECT ROUND(COUNT(*) FILTER (WHERE active = 1) * 100.0 / COUNT(*), 2) AS active_pct FROM customer;',
      order: false, tables: ['customer'],
      hint: 'Pamiętaj o mnożeniu przez 100.0 (z kropką) wewnątrz ROUND(..., 2) AS active_pct.'
    }
  ],
  p4_2: [
    {
      stepCode: 'R1', isWarmup: true,
      goal: 'Połącz w jedną wspólną kolumnę pod sobą imiona wszystkich pracowników oraz nazwy miast naszych sklepów (bez usuwania duplikatów).',
      prompt: 'Rozgrzewka R1 (UNION ALL): Połącz operatorem `UNION ALL` zapytanie wybierające `first_name` z `staff` oraz `city` ze `store`.',
      sol: 'SELECT first_name FROM staff UNION ALL SELECT city FROM store;',
      order: false, tables: ['staff', 'store'],
      hint: 'Wpisz oba SELECT-y i rozdziel je słowami UNION ALL.'
    },
    {
      stepCode: 'R2', isWarmup: true,
      goal: 'Utwórz unikalną listę imion występujących wśród naszych pracowników lub wśród aktywnych klientów sklepu nr 1 (bez powtórzeń).',
      prompt: 'Rozgrzewka R2 (UNION bez duplikatów): Połącz przez `UNION` imiona `first_name` z tabeli `staff` oraz `first_name` z tabeli `customer` (dla `store_id = 1 AND active = 1`).',
      sol: 'SELECT first_name FROM staff UNION SELECT first_name FROM customer WHERE store_id = 1 AND active = 1;',
      order: false, tables: ['staff', 'customer'],
      hint: 'Operator UNION automatycznie usunie ewentualne duplikaty imion.'
    },
    {
      stepCode: 'R3', isWarmup: true,
      goal: 'Za pomocą operacji różnicy zbiorów wskaż identyfikatory kategorii, które nie mają przypisanego ani jednego filmu.',
      prompt: 'Rozgrzewka R3 (EXCEPT): Od identyfikatorów `category_id` z tabeli `category` odejmij przez `EXCEPT` identyfikatory `category_id` występujące w `film_category`.',
      sol: 'SELECT category_id FROM category EXCEPT SELECT category_id FROM film_category;',
      order: false, tables: ['category', 'film_category'],
      hint: 'Użyj operatora EXCEPT pomiędzy dwoma zapytaniami SELECT category_id.'
    }
  ],
  p5_1: [
    {
      stepCode: 'R1', isWarmup: true,
      goal: 'Wypisz 5 najdłuższych filmów z katalogu i nadaj im kolejne numery pozycji od 1 do 5 w osobnej kolumnie.',
      prompt: 'Rozgrzewka R1 (ROW_NUMBER): Z tabeli `film` wybierz `title`, `length` oraz numer wiersza `rn` (według `length DESC, title ASC`), posortuj wynik po `length DESC, title ASC` i ogranicz do `5` wierszy.',
      sol: 'SELECT title, length, ROW_NUMBER() OVER (ORDER BY length DESC, title ASC) AS rn FROM film ORDER BY length DESC, title ASC LIMIT 5;',
      order: true, tables: ['film'],
      hint: 'Użyj funkcji okna ROW_NUMBER() OVER (ORDER BY length DESC, title ASC) AS rn.'
    },
    {
      stepCode: 'R2', isWarmup: true,
      goal: 'Dla filmów z kategorii G oraz PG wyznacz gęsty ranking cenowy (bez dziur w numeracji przy remisach) liczony osobno wewnątrz każdej kategorii wiekowej.',
      prompt: 'Rozgrzewka R2 (PARTITION BY + DENSE_RANK): Z tabeli `film` dla `rating IN (\'G\', \'PG\')` wybierz `rating`, `title`, `rental_rate` oraz miejsce w rankingu cenowym `rnk` wewnątrz każdego `rating`.',
      sol: "SELECT rating, title, rental_rate, DENSE_RANK() OVER (PARTITION BY rating ORDER BY rental_rate DESC) AS rnk FROM film WHERE rating IN ('G', 'PG');",
      order: false, tables: ['film'],
      hint: 'Wewnątrz OVER (...) wpisz PARTITION BY rating ORDER BY rental_rate DESC.'
    },
    {
      stepCode: 'R3', isWarmup: true,
      goal: 'Zdefiniuj pomocnicze zapytanie tymczasowe (CTE) zawierające filmy dłuższe niż 150 minut, a następnie wyświetl z niego tytuły i czasy trwania od najdłuższego.',
      prompt: 'Rozgrzewka R3 (CTE WITH): Zbuduj CTE `long_films` wybierające `title, length` z `film` dla `length > 150`, a w głównym zapytaniu zwróć `title, length` posortowane malejąco po `length`.',
      sol: 'WITH long_films AS (SELECT title, length FROM film WHERE length > 150) SELECT title, length FROM long_films ORDER BY length DESC;',
      order: true, tables: ['film'],
      hint: 'Zacznij zapytanie od WITH long_films AS (...), a po nawiasie napisz główny SELECT.'
    }
  ],
  p5_2: [
    {
      stepCode: 'R1', isWarmup: true,
      goal: 'Wyświetl wszystkie pojedyncze płatności klienta nr 1, a obok każdej transakcji dołącz w osobnej kolumnie łączną sumę wszystkich wydatków tego klienta.',
      prompt: 'Rozgrzewka R1 (Puste okno OVER ()): Z tabeli `payment` dla `customer_id = 1` wybierz `payment_id`, `amount` oraz łączną sumę wydatków tego klienta w każdym wierszu jako `total_cust`.',
      sol: 'SELECT payment_id, amount, SUM(amount) OVER () AS total_cust FROM payment WHERE customer_id = 1;',
      order: false, tables: ['payment'],
      hint: 'Puste nawiasy w SUM(amount) OVER () AS total_cust liczą sumę ze wszystkich wierszy wynikowych.'
    },
    {
      stepCode: 'R2', isWarmup: true,
      goal: 'Dla klienta nr 2 prześledź historię wpłat i pokaż, jak narastała łączna suma jego wydatków z każdą kolejną transakcją (suma krocząca).',
      prompt: 'Rozgrzewka R2 (Suma narastająca): Z tabeli `payment` dla `customer_id = 2` wybierz `payment_id`, `payment_date`, `amount` oraz sumę narastającą `run_sum` (w kolejności `payment_date, payment_id`).',
      sol: 'SELECT payment_id, payment_date, amount, SUM(amount) OVER (ORDER BY payment_date, payment_id) AS run_sum FROM payment WHERE customer_id = 2 ORDER BY payment_date, payment_id;',
      order: true, tables: ['payment'],
      hint: 'Dodanie ORDER BY wewnątrz OVER (...) zamienia zwykłą sumę w sumę narastającą.'
    },
    {
      stepCode: 'R3', isWarmup: true,
      goal: 'Dla klienta nr 2 zestaw kwotę każdej bieżącej płatności z kwotą jego bezpośrednio poprzedniej transakcji.',
      prompt: 'Rozgrzewka R3 (LAG): Z tabeli `payment` dla `customer_id = 2` wybierz `payment_id`, `amount` oraz kwotę poprzedniej płatności `prev_amt` (według `payment_date, payment_id`).',
      sol: 'SELECT payment_id, amount, LAG(amount) OVER (ORDER BY payment_date, payment_id) AS prev_amt FROM payment WHERE customer_id = 2 ORDER BY payment_date, payment_id;',
      order: true, tables: ['payment'],
      hint: 'Funkcja LAG(amount) OVER (ORDER BY payment_date, payment_id) pobiera kwotę z poprzedniego wiersza.'
    }
  ],
  p5_3: [
    {
      stepCode: 'R1', isWarmup: true,
      goal: 'Wygeneruj jednokolumnową serię kolejnych liczb całkowitych od 1 do 5 bez odpytywania żadnej fizycznej tabeli.',
      prompt: 'Rozgrzewka R1 (generate_series liczb): Wygeneruj liczby od `1` do `5` w kolumnie o aliasie `nr`.',
      sol: 'SELECT generate_series(1, 5) AS nr;',
      order: true, tables: ['category'],
      hint: 'Wpisz dokładnie: SELECT generate_series(1, 5) AS nr;'
    },
    {
      stepCode: 'R2', isWarmup: true,
      goal: 'Wygeneruj kalendarz obejmujący 5 kolejnych dni od 1 do 5 maja 2026 roku.',
      prompt: 'Rozgrzewka R2 (generate_series dat): Wygeneruj kolejne daty od `\'2026-05-01\'` do `\'2026-05-05\'` z krokiem jednodniowym w kolumnie `dzien`.',
      sol: "SELECT d::date AS dzien FROM generate_series('2026-05-01'::date, '2026-05-05'::date, '1 day') AS d;",
      order: true, tables: ['rental'],
      hint: "Użyj generate_series('2026-05-01'::date, '2026-05-05'::date, '1 day') AS d."
    },
    {
      stepCode: 'R3', isWarmup: true,
      goal: 'Dla pierwszych 5 płatności wyznacz datę transakcji, pierwszy dzień miesiąca tej wpłaty oraz termin przypadający dokładnie 7 dni później.',
      prompt: 'Rozgrzewka R3 (DATE_TRUNC + INTERVAL): Z tabeli `payment` wybierz `payment_id`, `payment_date`, początek miesiąca jako `miesiac` oraz datę przesuniętą o 7 dni do przodu jako `plus_7d` (posortuj po `payment_id`, `LIMIT 5`).',
      sol: "SELECT payment_id, payment_date, DATE_TRUNC('month', payment_date)::date AS miesiac, (payment_date + INTERVAL '7 days')::date AS plus_7d FROM payment ORDER BY payment_id LIMIT 5;",
      order: true, tables: ['payment'],
      hint: "Połącz DATE_TRUNC('month', payment_date)::date AS miesiac oraz (payment_date + INTERVAL '7 days')::date AS plus_7d."
    }
  ]
};

/* ==========================================================================
   8. GENERATOR SPECYFIKACJI ZADAŃ W STYLU DATALEMUR + SQLBOLT
      (📌 Polecenie + 📋 Wymagania i założenia + 3-stopniowe podpowiedzi)
   ========================================================================== */
function splitSqlTopLevel(str) {
  var res = [], cur = '', depth = 0, inStr = false;
  var s = String(str || '');
  for (var i = 0; i < s.length; i++) {
    var ch = s[i];
    if (ch === "'" && s[i - 1] !== '\\') inStr = !inStr;
    if (!inStr) {
      if (ch === '(') depth++;
      else if (ch === ')' && depth > 0) depth--;
      else if (ch === ',' && depth === 0) {
        res.push(cur.trim());
        cur = '';
        continue;
      }
    }
    cur += ch;
  }
  if (cur.trim()) res.push(cur.trim());
  return res;
}

function extractMainSelectClause(sql) {
  var s = String(sql || '').trim().replace(/;+\s*$/, '');
  var depth = 0, inStr = false;
  var lastSelectPos = -1;
  for (var i = 0; i < s.length; i++) {
    var ch = s[i];
    if (ch === "'" && s[i - 1] !== '\\') inStr = !inStr;
    if (!inStr) {
      if (ch === '(') depth++;
      else if (ch === ')' && depth > 0) depth--;
      else if (depth === 0) {
        var rest = s.slice(i);
        var m = /^SELECT\b/i.exec(rest);
        if (m && (i === 0 || /[\s)]/.test(s[i - 1]))) {
          lastSelectPos = i;
          break;
        }
      }
    }
  }
  if (lastSelectPos < 0) return { selectList: '', tail: s };
  var afterSelect = s.slice(lastSelectPos + 6).trim();
  afterSelect = afterSelect.replace(/^DISTINCT(?:\s+ON\s*\([^)]+\))?\s+/i, '');

  var d2 = 0, inS2 = false, fromPos = -1;
  for (var j = 0; j < afterSelect.length; j++) {
    var c2 = afterSelect[j];
    if (c2 === "'" && afterSelect[j - 1] !== '\\') inS2 = !inS2;
    if (!inS2) {
      if (c2 === '(') d2++;
      else if (c2 === ')' && d2 > 0) d2--;
      else if (d2 === 0) {
        var r2 = afterSelect.slice(j);
        if (/^FROM\b/i.test(r2) && (j === 0 || /\s/.test(afterSelect[j - 1]))) {
          fromPos = j;
          break;
        }
      }
    }
  }
  if (fromPos < 0) return { selectList: afterSelect, tail: '' };
  return {
    selectList: afterSelect.slice(0, fromPos).trim(),
    tail: afterSelect.slice(fromPos).trim()
  };
}

function describeSelectExpression(expr, alias) {
  var e = String(expr || '').trim();
  if (/^COUNT\s*\(\s*\*\s*\)\s*FILTER/i.test(e)) return 'warunkowa liczba wierszy spełniających kryterium';
  if (/^COUNT\s*\(\s*DISTINCT\b/i.test(e)) return 'liczba unikalnych wartości';
  if (/^COUNT\s*\(\s*\*\s*\)/i.test(e)) return 'liczba wierszy';
  if (/^COUNT\s*\(/i.test(e)) return 'liczba niepustych wartości';
  if (/^COALESCE\s*\(\s*SUM\b/i.test(e)) return 'suma wartości (0 w przypadku braku dopasowań)';
  if (/^ROUND\s*\(\s*AVG\b/i.test(e)) return 'średnia wartość zaokrąglona do 2 miejsc po przecinku';
  if (/^ROUND\s*\([\s\S]*100\.0/i.test(e)) return 'udział procentowy zaokrąglony do 2 miejsc po przecinku';
  if (/^ROUND\s*\(/i.test(e)) return 'wartość wyliczona zaokrąglona do 2 miejsc po przecinku';
  if (/^SUM\s*\([\s\S]*\)\s*OVER\s*\(/i.test(e)) return 'suma okienkowa / narastająca (funkcja okna)';
  if (/^AVG\s*\([\s\S]*\)\s*OVER\s*\(/i.test(e)) return 'średnia w oknie analitycznym';
  if (/^ROW_NUMBER\s*\(\s*\)\s*OVER/i.test(e)) return 'kolejny numer wiersza w oknie';
  if (/^DENSE_RANK\s*\(\s*\)\s*OVER/i.test(e)) return 'miejsce w gęstym rankingu (bez przeskoków przy remisach)';
  if (/^RANK\s*\(\s*\)\s*OVER/i.test(e)) return 'miejsce w rankingu z przeskokami';
  if (/^LAG\s*\(/i.test(e)) return 'wartość z poprzedniego wiersza/okresu';
  if (/^LEAD\s*\(/i.test(e)) return 'wartość z następnego wiersza/okresu';
  if (/^SUM\s*\(/i.test(e)) return 'suma wartości';
  if (/^AVG\s*\(/i.test(e)) return 'średnia wartość';
  if (/^MIN\s*\(/i.test(e)) return 'wartość minimalna';
  if (/^MAX\s*\(/i.test(e)) return 'wartość maksymalna';
  if (/^CASE\s+WHEN\b/i.test(e)) return 'etykieta wyliczana warunkowo';
  if (/^COALESCE\s*\(/i.test(e)) return 'wartość z zastąpieniem braków danych (NULL)';
  if (/^DATE_TRUNC\s*\(/i.test(e)) return 'data przycięta do początku okresu (np. miesiąca)';
  if (/generate_series/i.test(e)) return 'wygenerowana seria wartości';
  if (/[+\-*/]|::/.test(e)) return 'wyliczona wartość kolumny';
  var cleanCol = e.replace(/^[a-zA-Z_]\w*\./, '');
  if (cleanCol !== alias) return 'wartość z kolumny <code>' + cleanCol + '</code>';
  return '';
}

function parseSqlDetails(solSql, fallbackTables) {
  var s = String(solSql || '').trim();
  var main = extractMainSelectClause(s);
  var rawCols = splitSqlTopLevel(main.selectList);
  var outCols = rawCols.map(function(colExpr) {
    var asMatch = /\bAS\s+([a-zA-Z_]\w*)\s*$/i.exec(colExpr);
    var alias = '';
    var exprPart = colExpr;
    if (asMatch) {
      alias = asMatch[1];
      exprPart = colExpr.slice(0, asMatch.index).trim();
    } else {
      var dotMatch = /(?:^|\.)([a-zA-Z_]\w*)\s*$/.exec(colExpr);
      alias = dotMatch ? dotMatch[1] : colExpr;
    }
    return {
      name: alias,
      expr: exprPart,
      desc: describeSelectExpression(exprPart, alias)
    };
  });

  var tables = [];
  if (Array.isArray(fallbackTables) && fallbackTables.length) {
    tables = fallbackTables.slice();
  } else {
    var allKnown = ['film', 'category', 'film_category', 'actor', 'film_actor', 'customer', 'rental', 'payment', 'staff', 'store', 'emp_salaries', 'dept_budgets', 'saas_users', 'app_transactions', 'user_events', 'product_orders'];
    var tblRegex = /\b(?:FROM|JOIN)\s+([a-zA-Z_]\w*)/gi, tm;
    while ((tm = tblRegex.exec(s)) !== null) {
      var cand = tm[1].toLowerCase();
      if (allKnown.indexOf(cand) > -1 && tables.indexOf(cand) === -1) tables.push(cand);
    }
  }

  var orderMatch = /\bORDER\s+BY\s+([\s\S]+?)(?:\s+LIMIT\s+\d+|\s*;?\s*$)/i.exec(main.tail || s);
  var orderBy = orderMatch ? orderMatch[1].trim() : null;
  var limitMatch = /\bLIMIT\s+(\d+)/i.exec(main.tail || s);
  var limit = limitMatch ? Number(limitMatch[1]) : null;

  var hasRound2 = /\bROUND\s*\([\s\S]+?,\s*2\s*\)/i.test(s);
  var hasCoalesce = /\bCOALESCE\s*\(/i.test(s);
  var hasDistinct = /\bDISTINCT\b/i.test(s);
  var hasLeftJoin = /\bLEFT\s+(?:OUTER\s+)?JOIN\b/i.test(s);
  var hasJoin = /\bJOIN\b/i.test(s);
  var hasGroupBy = /\bGROUP\s+BY\b/i.test(s);
  var hasHaving = /\bHAVING\b/i.test(s);
  var hasWindow = /\bOVER\s*\(/i.test(s);
  var hasCte = /^\s*WITH\b/i.test(s);
  var hasSetOp = /\b(UNION\s+ALL|UNION|INTERSECT|EXCEPT)\b/i.test(s);

  return {
    tables: tables,
    columns: outCols,
    orderBy: orderBy,
    limit: limit,
    hasRound2: hasRound2,
    hasCoalesce: hasCoalesce,
    hasDistinct: hasDistinct,
    hasLeftJoin: hasLeftJoin,
    hasJoin: hasJoin,
    hasGroupBy: hasGroupBy,
    hasHaving: hasHaving,
    hasWindow: hasWindow,
    hasCte: hasCte,
    hasSetOp: hasSetOp
  };
}

function stripBalancedParensWithSql(text) {
  var s = String(text || '');
  var out = '';
  var i = 0;
  var sqlTest = /(?:`|\bSELECT\b|\bFROM\b|\bWHERE\b|\bGROUP\s+BY\b|\bHAVING\b|\bORDER\s+BY\b|\bLIMIT\b|\bJOIN\b|\bLEFT\s+JOIN\b|\bON\b|\bCOUNT\s*\(|\bSUM\s*\(|\bAVG\s*\(|\bMIN\s*\(|\bMAX\s*\(|\bROUND\s*\(|\bCOALESCE\s*\(|\bCASE\s+WHEN\b|\bFILTER\s*\(|\bROW_NUMBER\b|\bDENSE_RANK\b|\bRANK\b|\bLAG\b|\bLEAD\b|\bOVER\s*\(|\bPARTITION\s+BY\b|\bDATE_TRUNC\b|\bINTERVAL\b|\bgenerate_series\b|::|\*\s*100\.0|\bASC\b|\bDESC\b|\bIS\s+NULL\b|\bIS\s+NOT\s+NULL\b|\bILIKE\b|\bLIKE\b|\bBETWEEN\b|\bUNION\b|\bEXCEPT\b|\bINTERSECT\b|[a-z_]+\.[a-z_]+|[a-z_]+\s*[=<>!]+\s*['0-9])/i;

  while (i < s.length) {
    if (s[i] === '(') {
      var depth = 1;
      var j = i + 1;
      while (j < s.length && depth > 0) {
        if (s[j] === '(') depth++;
        else if (s[j] === ')') depth--;
        j++;
      }
      var group = s.slice(i, j);
      var inner = group.slice(1, -1);
      if (sqlTest.test(inner)) {
        i = j;
        continue;
      } else {
        out += group;
        i = j;
        continue;
      }
    }
    out += s[i];
    i++;
  }
  return out;
}

function buildCleanPolecenie(item) {
  if (item.goal) return item.goal;
  var raw = String(item.prompt || '');
  var s = raw
    .replace(/^Rozgrzewka\s+R\d+\s*\([^)]*\):\s*/i, '')
    .replace(/^Wyzwanie(?:\s*\([^)]*\))?:\s*/i, '');

  s = stripBalancedParensWithSql(s);

  s = s.replace(/`([^`]+)`/g, function(_, code) {
    var c = code.trim();
    if (/^(?:SELECT|FROM|WHERE|GROUP|HAVING|ORDER|LIMIT|WITH|CASE|COUNT|SUM|AVG|MIN|MAX|ROUND|COALESCE|ROW_NUMBER|DENSE_RANK|RANK|LAG|LEAD|DATE_TRUNC|generate_series)\b/i.test(c)) {
      return '';
    }
    if (/[()*\/+]|::|\bAS\b|\bOVER\b|\bFILTER\b|\bJOIN\b|\bASC\b|\bDESC\b/i.test(c)) {
      var asM = /\bAS\s+([a-zA-Z_]\w*)\s*$/i.exec(c);
      return asM ? asM[1] : '';
    }
    return c.replace(/^[a-zA-Z_]\w*\./, '');
  });

  s = s
    .replace(/\s*=\s*(?=[,;.]|\s|$)/g, '')
    .replace(/\bza pomocą\s*(?=[.,;]|$)/gi, '')
    .replace(/\bprzez\s+(?:LEFT\s+JOIN|JOIN|UNION\s+ALL|UNION|EXCEPT|INTERSECT)\b/gi, 'z tabelą')
    .replace(/\s+,/g, ',')
    .replace(/,\s*,+/g, ',')
    .replace(/\s+\./g, '.')
    .replace(/\(\s*\)/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();

  var sentences = s.split(/(?<=\.)\s+/);
  if (sentences.length > 1) {
    var filtered = sentences.filter(function(sent, idx) {
      if (idx === 0) return true;
      if (/^(?:Posortuj|Ogranicz\s+wynik\s+do|Daj\s+LIMIT)\b/i.test(sent.trim())) return false;
      return true;
    });
    if (filtered.length) s = filtered.join(' ');
  }

  return s;
}

function buildDataLemurAssumptions(item, details) {
  var bullets = [];

  if (details.tables && details.tables.length) {
    var tblTags = details.tables.map(function(t) { return '<code>' + t + '</code>'; }).join(', ');
    if (/generate_series/i.test(item.sol) && !/\bJOIN\b/i.test(item.sol)) {
      bullets.push('Źródło danych: funkcja generatora serii <code>generate_series(...)</code>.');
    } else {
      bullets.push('Tabele źródłowe: ' + tblTags + '.');
    }
  }

  if (details.columns && details.columns.length) {
    var colItems = details.columns.map(function(c) {
      return '<code>' + c.name + '</code>' + (c.desc ? ' (' + c.desc + ')' : '');
    });
    bullets.push('Wymagane kolumny w wyniku (dokładne nazwy/aliasy): ' + colItems.join(', ') + '.');
  }

  var rules = [];
  if (details.hasRound2) {
    rules.push('wartości ułamkowe/procentowe zaokrąglij do <strong>2 miejsc po przecinku</strong> (<code>ROUND(..., 2)</code>)');
  }
  if (details.hasCoalesce) {
    rules.push('brakujące wartości (<code>NULL</code>) zastąp wartością domyślną za pomocą <code>COALESCE(...)</code>');
  }
  if (details.hasLeftJoin) {
    rules.push('zachowaj wszystkie rekordy z tabeli nadrzędnej nawet przy braku dopasowania (<code>LEFT JOIN</code>)');
  }
  if (details.hasDistinct) {
    rules.push('wyeliminuj duplikaty za pomocą klauzuli <code>DISTINCT</code>');
  }
  if (rules.length) {
    bullets.push('Zasady obliczeń i braków danych: ' + rules.join('; ') + '.');
  }

  if (details.orderBy || details.limit) {
    var sortParts = [];
    if (details.orderBy) {
      var cleanOrder = details.orderBy.replace(/^[a-zA-Z_]\w*\./g, '').replace(/,\s*[a-zA-Z_]\w*\./g, ', ');
      sortParts.push('posortuj wynik według <code>' + cleanOrder + '</code>');
    }
    if (details.limit) {
      sortParts.push('ogranicz liczbę zwracanych wierszy do <code>LIMIT ' + details.limit + '</code>');
    }
    var sortStr = sortParts.join(' oraz ');
    bullets.push('Sortowanie i limit: ' + sortStr.charAt(0).toUpperCase() + sortStr.slice(1) + '.');
  } else if (item.order === false) {
    bullets.push('Kolejność wierszy w wyniku nie ma znaczenia (dowolne sortowanie).');
  }

  return bullets;
}

function buildProgressiveHints(item, parentTask, details) {
  var step1 = '';
  if (details.hasCte && details.hasWindow) {
    step1 = 'Rozbij problem na dwa etapy: najpierw w bloku pomocniczym CTE (WITH) wylicz wartość funkcji okna dla każdego wiersza, a następnie w głównym zapytaniu przefiltruj lub posortuj wynik.';
  } else if (details.hasWindow) {
    step1 = 'W tym zadaniu nie chcemy zwijać wierszy przez GROUP BY — użyj funkcji okna z klauzulą OVER (...), aby dodać kolumnę analityczną obok szczegółów każdego wiersza.';
  } else if (details.hasLeftJoin && details.hasGroupBy) {
    step1 = 'Zacznij od tabeli głównej po lewej stronie i dołącz drugą tabelę przez LEFT JOIN, aby nie zgubić rekordów z zerową aktywnością. Następnie pogrupuj wynik i policz agregaty.';
  } else if (details.hasJoin && details.hasGroupBy) {
    step1 = 'Połącz wymagane tabele po kluczu obcym (JOIN ... ON), pogrupuj wiersze według kolumn wymiarowych (GROUP BY), a następnie wylicz funkcje agregujące.';
  } else if (details.hasGroupBy && details.hasHaving) {
    step1 = 'Najpierw odfiltruj pojedyncze wiersze przed grupowaniem (jeśli dotyczy), podziel dane na grupy przez GROUP BY, a na końcu odfiltruj całe grupy za pomocą warunku w HAVING.';
  } else if (details.hasGroupBy) {
    step1 = 'Podziel tabelę na koszyki za pomocą GROUP BY i dla każdej grupy wylicz wymaganą funkcję agregującą (np. COUNT, SUM, AVG).';
  } else if (details.hasSetOp) {
    step1 = 'Napisz dwa niezależne zapytania SELECT zwracające dokładnie taką samą liczbę i typ kolumn, a następnie połącz je operatorem zbiorowym.';
  } else if (details.hasJoin) {
    step1 = 'Połącz tabele klauzulą JOIN ... ON po wspólnym identyfikatorze, wybierz wymagane kolumny z odpowiednimi prefiksami tabel i zastosuj filtr WHERE.';
  } else {
    step1 = 'Zidentyfikuj tabelę źródłową w FROM, przefiltruj wiersze warunkiem w WHERE, a następnie wypisz w SELECT wymagane kolumny we właściwej kolejności.';
  }

  var usedClauses = [];
  if (details.hasCte) usedClauses.push('WITH cte AS (...)');
  usedClauses.push('SELECT ' + details.columns.map(function(c) { return c.name; }).join(', '));
  if (details.tables.length) usedClauses.push('FROM ' + details.tables[0]);
  if (details.hasLeftJoin) usedClauses.push('LEFT JOIN ... ON ...');
  else if (details.hasJoin) usedClauses.push('JOIN ... ON ...');
  if (/\bWHERE\b/i.test(item.sol)) usedClauses.push('WHERE ...');
  if (details.hasGroupBy) usedClauses.push('GROUP BY ...');
  if (details.hasHaving) usedClauses.push('HAVING ...');
  if (details.orderBy) usedClauses.push('ORDER BY ' + details.orderBy);
  if (details.limit) usedClauses.push('LIMIT ' + details.limit);

  var step2 = 'Kluczowe elementy składni w tym zadaniu: ' + usedClauses.join(' → ') + '.';
  if (item.hint) {
    step2 += '\n💡 Wskazówka techniczna: ' + item.hint;
  }

  var step3 = '';
  if (item.gapHint) {
    step3 = '🛡️ Pułapka (' + (item.gapName || 'Analiza SQL') + '): ' + item.gapHint;
  } else if (parentTask && parentTask.title) {
    if (details.hasLeftJoin) {
      step3 = '🛡️ Uważaj na pułapkę LEFT JOIN: przy liczeniu dopasowań używaj COUNT(kolumna_prawej_tabeli) zamiast COUNT(*), ponieważ COUNT(*) policzy pusty wiersz z NULL-ami jako 1 zamiast 0!';
    } else if (details.hasRound2 && /\//.test(item.sol)) {
      step3 = '🛡️ Uważaj na dzielenie całkowite w PostgreSQL: pomnóż licznik przez 100.0 (lub 1.0) przed dzieleniem, a cały ułamek owiń w ROUND(..., 2).';
    } else if (details.hasGroupBy && details.hasHaving) {
      step3 = '🛡️ Pamiętaj o kolejności wykonywania SQL: w WHERE nie wolno używać funkcji agregujących (COUNT/SUM/AVG) — warunki na zagregowanych grupach umieszczaj wyłącznie w HAVING.';
    } else if (details.hasWindow) {
      step3 = '🛡️ Funkcje okna wykonują się dopiero w kroku SELECT — nie można filtrować po ich wyniku bezpośrednio w WHERE tego samego zapytania (użyj CTE WITH).';
    } else {
      step3 = '🛡️ Sprawdź dokładne nazwy kolumn i aliasów (AS) oraz pamiętaj, że pojedyncze napisy w SQL zawsze zapisujemy w pojedynczych apostrofach \'tekst\'.';
    }
  } else {
    step3 = item.hint || '🛡️ Upewnij się, że nazwy kolumn w SELECT oraz kierunek sortowania (ASC/DESC) zgadzają się z sekcją Wymagania i założenia.';
  }

  return [step1, step2, step3];
}

function buildDataLemurSpec(item, parentTask) {
  var fallbackTables = (item && item.tables) || (parentTask && parentTask.tables) || [];
  var details = parseSqlDetails(item.sol, fallbackTables);
  var polecenie = buildCleanPolecenie(item);
  var assumptions = buildDataLemurAssumptions(item, details);
  var hints = buildProgressiveHints(item, parentTask, details);
  return {
    polecenie: polecenie,
    assumptions: assumptions,
    hints: hints,
    sqlDetails: details
  };
}

PATH_TASKS.forEach(function(t) {
  if (LESSON_TUTORIALS[t.id]) {
    t.slides = LESSON_TUTORIALS[t.id];
  }
  var origMain = t.variants.slice();
  t.mainVariants = origMain;
  var warmups = (LESSON_WARMUPS[t.id] || []).map(function(w, wIdx) {
    var spec = buildDataLemurSpec(w, t);
    return Object.assign({}, w, {
      isWarmup: true,
      tier: 'warmup',
      stepCode: 'R' + (wIdx + 1),
      keySuffix: 'r' + (wIdx + 1),
      solutionSql: w.sol,
      polecenie: spec.polecenie,
      assumptions: spec.assumptions,
      hints: spec.hints
    });
  });
  var mains = origMain.map(function(m, mIdx) {
    var spec = buildDataLemurSpec(m, t);
    return Object.assign({}, m, {
      isWarmup: false,
      tier: mIdx < 5 ? 'basic' : 'adv',
      stepCode: String(mIdx + 1),
      keySuffix: String(mIdx),
      solutionSql: m.sol,
      polecenie: spec.polecenie,
      assumptions: spec.assumptions,
      hints: spec.hints
    });
  });
  t.warmups = warmups;
  t.variants = warmups.concat(mains);
});

DIAG_QUESTIONS.forEach(function(q) {
  var spec = buildDataLemurSpec(q, null);
  q.solutionSql = q.sol;
  q.polecenie = spec.polecenie;
  q.assumptions = spec.assumptions;
  q.hints = spec.hints;
});

window.STAGES = STAGES;
window.PATH_TASKS = PATH_TASKS;
window.DIAG_QUESTIONS = DIAG_QUESTIONS;
window.LESSON_TUTORIALS = LESSON_TUTORIALS;
window.LESSON_WARMUPS = LESSON_WARMUPS;
window.buildDataLemurSpec = buildDataLemurSpec;
window.parseSqlDetails = parseSqlDetails;




