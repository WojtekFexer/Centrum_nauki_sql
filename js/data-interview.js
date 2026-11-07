/* ==========================================================================
   ZADANIA REKRUTACYJNE: osobna baza biznesowa (6 tabel) + 60 zadań (20 Easy, 20 Medium, 20 Hard)
   Tabele nie kolidują z dvdrental: emp_salaries, dept_budgets, app_transactions,
   saas_users, user_events, product_orders.
   ========================================================================== */
var INTERVIEW_SEED_SQL = `
CREATE TABLE dept_budgets (
  department varchar(50) PRIMARY KEY,
  annual_budget numeric(12,2) NOT NULL,
  location varchar(50)
);
INSERT INTO dept_budgets VALUES
  ('Engineering', 2400000.00, 'Warsaw'),
  ('Sales', 1500000.00, 'Krakow'),
  ('Marketing', 800000.00, 'Warsaw'),
  ('HR', 450000.00, 'Gdansk'),
  ('Finance', 900000.00, 'Warsaw'),
  ('Legal', 300000.00, 'Warsaw');

CREATE TABLE emp_salaries (
  emp_id integer PRIMARY KEY,
  full_name varchar(80) NOT NULL,
  department varchar(50) NOT NULL,
  job_title varchar(60),
  salary numeric(10,2) NOT NULL,
  hire_date date NOT NULL,
  manager_id integer
);
INSERT INTO emp_salaries VALUES
  (1, 'Anna Kowalska', 'Engineering', 'VP Engineering', 18000.00, '2018-03-12', NULL),
  (2, 'Piotr Nowak', 'Engineering', 'Senior Developer', 14000.00, '2019-06-01', 1),
  (3, 'Marta Zielinska', 'Engineering', 'Senior Developer', 14000.00, '2020-01-15', 1),
  (4, 'Tomasz Wisniewski', 'Engineering', 'Developer', 11000.00, '2021-09-20', 2),
  (5, 'Katarzyna Wojcik', 'Engineering', 'Developer', 10500.00, '2022-02-07', 2),
  (6, 'Jan Kaminski', 'Engineering', 'Junior Developer', 7500.00, '2023-05-02', 3),
  (7, 'Ewa Lewandowska', 'Engineering', 'Developer', 15000.00, '2021-11-10', 3),
  (8, 'Michal Dabrowski', 'Sales', 'Sales Director', 16000.00, '2017-08-25', NULL),
  (9, 'Agnieszka Szymanska', 'Sales', 'Account Executive', 9000.00, '2019-04-18', 8),
  (10, 'Pawel Wozniak', 'Sales', 'Account Executive', 9000.00, '2020-10-05', 8),
  (11, 'Monika Kozlowska', 'Sales', 'Sales Rep', 6500.00, '2022-03-14', 9),
  (12, 'Krzysztof Jankowski', 'Sales', 'Sales Rep', 6500.00, '2022-07-01', 9),
  (13, 'Barbara Mazur', 'Sales', 'Sales Rep', 6000.00, '2023-01-23', 10),
  (14, 'Marcin Krawczyk', 'Sales', 'Account Executive', 17000.00, '2023-09-11', 8),
  (15, 'Joanna Piotrowska', 'Marketing', 'Marketing Manager', 12000.00, '2018-12-03', NULL),
  (16, 'Adam Grabowski', 'Marketing', 'Content Specialist', 7000.00, '2021-02-22', 15),
  (17, 'Magdalena Pawlowska', 'Marketing', 'SEO Specialist', 7000.00, '2021-06-30', 15),
  (18, 'Robert Michalski', 'Marketing', 'Designer', 6800.00, '2022-10-17', 15),
  (19, 'Dorota Zajac', 'HR', 'HR Manager', 11000.00, '2019-01-07', NULL),
  (20, 'Lukasz Krol', 'HR', 'Recruiter', 6200.00, '2022-04-04', 19),
  (21, 'Natalia Wieczorek', 'HR', 'Recruiter', 6200.00, '2023-03-06', 19),
  (22, 'Grzegorz Jablonski', 'Finance', 'CFO', 19000.00, '2016-05-16', NULL),
  (23, 'Iwona Majewska', 'Finance', 'Senior Accountant', 9500.00, '2018-09-03', 22),
  (24, 'Slawomir Olszewski', 'Finance', 'Accountant', 7200.00, '2021-12-01', 23),
  (25, 'Karolina Stepien', 'Finance', 'Accountant', 7200.00, '2022-08-29', 23);

CREATE TABLE saas_users (
  user_id integer PRIMARY KEY,
  signup_date date NOT NULL,
  country varchar(30),
  plan_type varchar(20)
);
INSERT INTO saas_users VALUES
  (1, '2025-11-03', 'PL', 'pro'),
  (2, '2025-11-15', 'PL', 'free'),
  (3, '2025-12-01', 'DE', 'pro'),
  (4, '2025-12-10', 'US', 'enterprise'),
  (5, '2025-12-22', 'PL', 'free'),
  (6, '2026-01-04', 'UK', 'pro'),
  (7, '2026-01-09', 'DE', 'free'),
  (8, '2026-01-14', 'US', 'pro'),
  (9, '2026-01-20', 'PL', 'free'),
  (10, '2026-01-27', 'FR', 'enterprise'),
  (11, '2026-02-02', 'US', 'free'),
  (12, '2026-02-08', 'DE', 'pro'),
  (13, '2026-02-13', 'UK', 'free'),
  (14, '2026-02-18', 'PL', 'pro'),
  (15, '2026-02-25', 'FR', 'free'),
  (16, '2026-03-03', 'US', 'pro'),
  (17, '2026-03-08', 'PL', 'free'),
  (18, '2026-03-12', 'DE', 'free'),
  (19, '2026-03-17', 'UK', 'free'),
  (20, '2026-03-21', 'PL', 'free');

CREATE TABLE app_transactions (
  tx_id integer PRIMARY KEY,
  user_id integer NOT NULL,
  tx_status varchar(20) NOT NULL,
  amount numeric(10,2) NOT NULL,
  tx_timestamp timestamp NOT NULL,
  merchant_category varchar(30)
);
INSERT INTO app_transactions VALUES
  (1, 1, 'approved', 49.99, '2026-01-05 10:15:00', 'Food'),
  (2, 2, 'approved', 120.00, '2026-01-06 14:30:00', 'Electronics'),
  (3, 3, 'declined', 75.50, '2026-01-07 09:05:00', 'Fashion'),
  (4, 1, 'approved', 49.99, '2026-01-05 10:19:00', 'Food'),
  (5, 4, 'approved', 300.00, '2026-01-10 18:45:00', 'Travel'),
  (6, 5, 'approved', 25.00, '2026-01-12 12:00:00', 'Food'),
  (7, 6, 'declined', 210.00, '2026-01-15 20:10:00', 'Electronics'),
  (8, 2, 'approved', 89.90, '2026-01-20 11:25:00', 'Fashion'),
  (9, 7, 'approved', 15.75, '2026-01-22 08:40:00', 'Food'),
  (10, 3, 'approved', 75.50, '2026-01-23 16:20:00', 'Fashion'),
  (11, 8, 'approved', 450.00, '2026-01-28 19:00:00', 'Travel'),
  (12, 9, 'declined', 60.00, '2026-01-30 13:15:00', 'Food'),
  (13, 1, 'approved', 99.00, '2026-02-02 10:00:00', 'Electronics'),
  (14, 10, 'approved', 35.20, '2026-02-03 17:35:00', 'Food'),
  (15, 4, 'approved', 150.00, '2026-02-05 21:10:00', 'Fashion'),
  (16, 4, 'approved', 150.00, '2026-02-05 21:16:00', 'Fashion'),
  (17, 11, 'declined', 500.00, '2026-02-08 15:50:00', 'Travel'),
  (18, 5, 'approved', 25.00, '2026-02-10 12:05:00', 'Food'),
  (19, 12, 'approved', 220.00, '2026-02-12 09:30:00', 'Electronics'),
  (20, 6, 'approved', 210.00, '2026-02-14 20:25:00', 'Electronics'),
  (21, 13, 'approved', 18.40, '2026-02-17 07:55:00', 'Food'),
  (22, 2, 'declined', 120.00, '2026-02-19 14:00:00', 'Electronics'),
  (23, 7, 'approved', 64.30, '2026-02-21 18:20:00', 'Fashion'),
  (24, 14, 'approved', 380.00, '2026-02-25 10:45:00', 'Travel'),
  (25, 8, 'approved', 55.00, '2026-02-27 12:40:00', 'Food'),
  (26, 3, 'approved', 42.00, '2026-03-02 09:10:00', 'Food'),
  (27, 15, 'approved', 275.00, '2026-03-04 16:00:00', 'Electronics'),
  (28, 1, 'declined', 49.99, '2026-03-05 10:30:00', 'Food'),
  (29, 9, 'approved', 60.00, '2026-03-06 13:20:00', 'Food'),
  (30, 9, 'approved', 60.00, '2026-03-06 13:28:00', 'Food'),
  (31, 10, 'approved', 410.00, '2026-03-09 19:15:00', 'Travel'),
  (32, 12, 'declined', 99.99, '2026-03-12 11:45:00', 'Fashion'),
  (33, 16, 'approved', 33.60, '2026-03-15 08:25:00', 'Food'),
  (34, 4, 'approved', 80.00, '2026-03-18 20:05:00', 'Fashion'),
  (35, 5, 'approved', 25.00, '2026-03-20 12:10:00', 'Food'),
  (36, 2, 'approved', 89.90, '2026-03-22 11:00:00', 'Fashion');

CREATE TABLE user_events (
  event_id integer PRIMARY KEY,
  user_id integer NOT NULL,
  event_type varchar(30) NOT NULL,
  event_time timestamp NOT NULL,
  device varchar(20)
);
INSERT INTO user_events VALUES
  (1, 1, 'login', '2026-03-01 08:00:00', 'mobile'),
  (2, 1, 'view_item', '2026-03-01 08:05:00', 'mobile'),
  (3, 1, 'add_to_cart', '2026-03-01 08:09:00', 'mobile'),
  (4, 1, 'purchase', '2026-03-01 08:15:00', 'mobile'),
  (5, 2, 'login', '2026-03-01 09:30:00', 'desktop'),
  (6, 2, 'view_item', '2026-03-01 09:35:00', 'desktop'),
  (7, 3, 'login', '2026-03-02 10:00:00', 'desktop'),
  (8, 3, 'view_item', '2026-03-02 10:10:00', 'desktop'),
  (9, 3, 'add_to_cart', '2026-03-02 10:18:00', 'desktop'),
  (10, 4, 'login', '2026-03-02 11:20:00', 'tablet'),
  (11, 4, 'view_item', '2026-03-02 11:25:00', 'tablet'),
  (12, 4, 'add_to_cart', '2026-03-02 11:40:00', 'tablet'),
  (13, 4, 'purchase', '2026-03-02 11:55:00', 'tablet'),
  (14, 5, 'login', '2026-03-03 07:45:00', 'mobile'),
  (15, 6, 'login', '2026-03-03 12:00:00', 'desktop'),
  (16, 6, 'view_item', '2026-03-03 12:07:00', 'desktop'),
  (17, 6, 'add_to_cart', '2026-03-03 12:12:00', 'desktop'),
  (18, 6, 'purchase', '2026-03-03 12:20:00', 'desktop'),
  (19, 7, 'login', '2026-03-04 18:00:00', 'mobile'),
  (20, 7, 'view_item', '2026-03-04 18:06:00', 'mobile'),
  (21, 8, 'login', '2026-03-04 19:30:00', 'desktop'),
  (22, 8, 'view_item', '2026-03-05 19:35:00', 'desktop'),
  (23, 9, 'login', '2026-03-05 08:10:00', 'mobile'),
  (24, 10, 'login', '2026-03-05 09:00:00', 'desktop'),
  (25, 10, 'view_item', '2026-03-05 09:04:00', 'desktop'),
  (26, 10, 'add_to_cart', '2026-03-05 09:10:00', 'desktop'),
  (27, 10, 'purchase', '2026-03-05 09:15:00', 'desktop'),
  (28, 11, 'login', '2026-03-06 14:00:00', 'tablet'),
  (29, 12, 'login', '2026-03-06 15:20:00', 'mobile'),
  (30, 12, 'view_item', '2026-03-06 15:25:00', 'mobile'),
  (31, 13, 'login', '2026-03-07 10:00:00', 'desktop'),
  (32, 14, 'login', '2026-03-08 11:00:00', 'mobile'),
  (33, 14, 'view_item', '2026-03-08 11:06:00', 'mobile'),
  (34, 14, 'add_to_cart', '2026-03-08 11:10:00', 'mobile'),
  (35, 1, 'login', '2026-03-09 08:00:00', 'mobile'),
  (36, 2, 'login', '2026-03-09 09:00:00', 'desktop');

CREATE TABLE product_orders (
  order_id integer PRIMARY KEY,
  product_id integer NOT NULL,
  category varchar(30) NOT NULL,
  quantity integer NOT NULL,
  unit_price numeric(10,2) NOT NULL,
  discount_pct numeric(5,2),
  order_date date NOT NULL
);
INSERT INTO product_orders VALUES
  (1, 101, 'Laptops', 1, 3200.00, 10.00, '2026-01-04'),
  (2, 102, 'Phones', 2, 1800.00, NULL, '2026-01-09'),
  (3, 103, 'Accessories', 5, 45.00, 0.00, '2026-01-15'),
  (4, 104, 'Accessories', 3, 120.00, NULL, '2026-01-21'),
  (5, 101, 'Laptops', 1, 3200.00, NULL, '2026-01-28'),
  (6, 102, 'Phones', 1, 1800.00, 5.00, '2026-02-03'),
  (7, 105, 'Laptops', 2, 2500.00, 15.00, '2026-02-08'),
  (8, 103, 'Accessories', 10, 45.00, NULL, '2026-02-14'),
  (9, 106, 'Phones', 1, 2100.00, 0.00, '2026-02-19'),
  (10, 104, 'Accessories', 4, 120.00, 10.00, '2026-02-26'),
  (11, 101, 'Laptops', 2, 3200.00, 5.00, '2026-03-02'),
  (12, 107, 'Phones', 3, 950.00, NULL, '2026-03-07'),
  (13, 103, 'Accessories', 8, 45.00, 0.00, '2026-03-12'),
  (14, 105, 'Laptops', 1, 2500.00, NULL, '2026-03-18'),
  (15, 106, 'Phones', 2, 2100.00, 10.00, '2026-03-25'),
  (16, 102, 'Phones', 2, 1800.00, 0.00, '2026-04-01'),
  (17, 104, 'Accessories', 6, 120.00, NULL, '2026-04-06'),
  (18, 101, 'Laptops', 1, 3200.00, 20.00, '2026-04-13'),
  (19, 108, 'Accessories', 12, 15.00, 0.00, '2026-04-20'),
  (20, 107, 'Phones', 1, 950.00, NULL, '2026-04-27'),
  (21, 105, 'Laptops', 3, 2500.00, 10.00, '2026-05-04'),
  (22, 106, 'Phones', 1, 2100.00, NULL, '2026-05-10'),
  (23, 103, 'Accessories', 15, 45.00, 5.00, '2026-05-16'),
  (24, 108, 'Accessories', 20, 15.00, NULL, '2026-05-22'),
  (25, 102, 'Phones', 2, 1800.00, 10.00, '2026-05-29'),
  (26, 101, 'Laptops', 2, 3200.00, 0.00, '2026-06-03'),
  (27, 107, 'Phones', 4, 950.00, NULL, '2026-06-09'),
  (28, 104, 'Accessories', 5, 120.00, 5.00, '2026-06-14'),
  (29, 105, 'Laptops', 1, 2500.00, NULL, '2026-06-21'),
  (30, 106, 'Phones', 3, 2100.00, 15.00, '2026-06-27');
`;

var INTERVIEW_SCHEMA_META = [
  { table: 'emp_salaries', desc: 'Pracownicy i pensje (25 wierszy, remisy pensji, manager_id wskazuje emp_id przełożonego)', cols: [
    { name: 'emp_id', type: 'integer', isKey: true },
    { name: 'full_name', type: 'varchar(80)', isKey: false },
    { name: 'department', type: 'varchar(50)', isKey: true },
    { name: 'job_title', type: 'varchar(60)', isKey: false },
    { name: 'salary', type: 'numeric(10,2)', isKey: false },
    { name: 'hire_date', type: 'date', isKey: false },
    { name: 'manager_id', type: 'integer', isKey: true }
  ] },
  { table: 'dept_budgets', desc: 'Roczne budżety działów (dział Legal nie ma pracowników)', cols: [
    { name: 'department', type: 'varchar(50)', isKey: true },
    { name: 'annual_budget', type: 'numeric(12,2)', isKey: false },
    { name: 'location', type: 'varchar(50)', isKey: false }
  ] },
  { table: 'app_transactions', desc: 'Transakcje w aplikacji (approved / declined, powtórzone płatności w ciągu kilku minut)', cols: [
    { name: 'tx_id', type: 'integer', isKey: true },
    { name: 'user_id', type: 'integer', isKey: true },
    { name: 'tx_status', type: 'varchar(20)', isKey: false },
    { name: 'amount', type: 'numeric(10,2)', isKey: false },
    { name: 'tx_timestamp', type: 'timestamp', isKey: false },
    { name: 'merchant_category', type: 'varchar(30)', isKey: false }
  ] },
  { table: 'saas_users', desc: 'Użytkownicy aplikacji SaaS (część bez transakcji i bez logowań)', cols: [
    { name: 'user_id', type: 'integer', isKey: true },
    { name: 'signup_date', type: 'date', isKey: false },
    { name: 'country', type: 'varchar(30)', isKey: false },
    { name: 'plan_type', type: 'varchar(20)', isKey: false }
  ] },
  { table: 'user_events', desc: 'Zdarzenia użytkowników: login, view_item, add_to_cart, purchase (marzec 2026)', cols: [
    { name: 'event_id', type: 'integer', isKey: true },
    { name: 'user_id', type: 'integer', isKey: true },
    { name: 'event_type', type: 'varchar(30)', isKey: false },
    { name: 'event_time', type: 'timestamp', isKey: false },
    { name: 'device', type: 'varchar(20)', isKey: false }
  ] },
  { table: 'product_orders', desc: 'Zamówienia produktów (styczeń–czerwiec 2026, discount_pct bywa NULL)', cols: [
    { name: 'order_id', type: 'integer', isKey: true },
    { name: 'product_id', type: 'integer', isKey: true },
    { name: 'category', type: 'varchar(30)', isKey: false },
    { name: 'quantity', type: 'integer', isKey: false },
    { name: 'unit_price', type: 'numeric(10,2)', isKey: false },
    { name: 'discount_pct', type: 'numeric(5,2)', isKey: false },
    { name: 'order_date', type: 'date', isKey: false }
  ] }
];

// Usuwa komentarze SQL przed analizą pułapek
function ivClean(sql) {
  return String(sql || '').replace(/--[^\n]*/g, '').replace(/\/\*[\s\S]*?\*\//g, '');
}

var INTERVIEW_TASKS = [
  /* ============================== EASY ============================== */
  {
    id: 'iv_1', difficulty: 'easy', categoryTag: 'HR & Płace',
    title: '1. Wysokie pensje w wybranych działach (IN + BETWEEN)',
    tables: ['emp_salaries'],
    gapId: 'g11', gapName: 'Priorytet AND / OR i nawiasy',
    gapHint: 'AND wiąże mocniej niż OR. Gdy mieszasz oba operatory, wstaw nawiasy albo użyj IN (...), które zastępuje serię OR.',
    hint: 'AND wiąże mocniej niż OR. Gdy mieszasz oba operatory, wstaw nawiasy albo użyj IN (...), które zastępuje serię OR.',
    cols: ['emp_salaries', 'full_name', 'department', 'salary', 'IN', 'BETWEEN'],
    prompt: "Z tabeli `emp_salaries` wypisz `full_name`, `department` oraz `salary` dla pracowników działów `'Engineering'` i `'Finance'` (użyj `IN`), którzy zarabiają od `9000` do `15000` włącznie (`BETWEEN`). Posortuj malejąco po `salary`, a przy remisie rosnąco po `full_name`.",
    sol: "SELECT full_name, department, salary FROM emp_salaries WHERE department IN ('Engineering', 'Finance') AND salary BETWEEN 9000 AND 15000 ORDER BY salary DESC, full_name ASC;",
    order: true,
    detectTrap: function(sql) {
      var s = ivClean(sql);
      if (!/\bemp_salaries\b/i.test(s)) return null;
      if (/\bOR\b/i.test(s) && !/\(/.test(s)) {
        return 'PUŁAPKA AND / OR: Użyłeś OR bez nawiasów. AND ma wyższy priorytet, więc warunek na pensję obejmie tylko część działów. Użyj IN (...) albo nawiasów.';
      }
      return null;
    }
  },
  {
    id: 'iv_2', difficulty: 'easy', categoryTag: 'Finanse & Płatności',
    title: '2. Zatwierdzone transakcje wg kategorii sprzedawcy (HAVING)',
    tables: ['app_transactions'],
    gapId: 'g7', gapName: 'GROUP BY i filtrowanie grup w HAVING',
    gapHint: 'WHERE filtruje pojedyncze wiersze przed grupowaniem (np. status), a HAVING filtruje gotowe grupy po agregacji (np. liczba transakcji). Wartości tekstowe muszą pasować co do wielkości liter.',
    hint: 'WHERE filtruje pojedyncze wiersze przed grupowaniem (np. status), a HAVING filtruje gotowe grupy po agregacji (np. liczba transakcji). Wartości tekstowe muszą pasować co do wielkości liter.',
    cols: ['app_transactions', 'merchant_category', 'tx_status', 'amount', 'COUNT(*)', 'SUM(amount)', 'HAVING'],
    prompt: "W tabeli `app_transactions` policz dla każdej kategorii sprzedawcy (`merchant_category`) liczbę zatwierdzonych transakcji (`tx_status = 'approved'`) jako `tx_cnt` oraz ich łączną kwotę jako `total_amount`. Zostaw tylko kategorie z co najmniej `5` takimi transakcjami (`HAVING`). Posortuj malejąco po `total_amount`.",
    sol: "SELECT merchant_category, COUNT(*) AS tx_cnt, SUM(amount) AS total_amount FROM app_transactions WHERE tx_status = 'approved' GROUP BY merchant_category HAVING COUNT(*) >= 5 ORDER BY total_amount DESC;",
    order: true,
    detectTrap: function(sql) {
      var s = ivClean(sql);
      if (!/\bapp_transactions\b/i.test(s)) return null;
      if (/tx_status\s*=\s*'[A-Z]/.test(s)) {
        return "PUŁAPKA WIELKOŚCI LITER: Statusy w tabeli są zapisane małymi literami (np. 'approved'). Porównanie z 'Approved' nie zwróci żadnego wiersza.";
      }
      return null;
    }
  },
  {
    id: 'iv_3', difficulty: 'easy', categoryTag: 'Produkt & SaaS',
    title: '3. Płacący użytkownicy w podziale na kraje (INNER JOIN)',
    tables: ['saas_users', 'app_transactions'],
    gapId: 'g1', gapName: 'Ziarno wyniku i COUNT(DISTINCT) po JOIN',
    gapHint: 'Po złączeniu użytkownika z jego transakcjami jeden użytkownik występuje w wielu wierszach. Aby policzyć osoby, a nie transakcje, użyj COUNT(DISTINCT user_id).',
    hint: 'Po złączeniu użytkownika z jego transakcjami jeden użytkownik występuje w wielu wierszach. Aby policzyć osoby, a nie transakcje, użyj COUNT(DISTINCT user_id).',
    cols: ['saas_users', 'app_transactions', 'user_id', 'country', 'COUNT(DISTINCT', 'JOIN'],
    prompt: "Połącz tabelę użytkowników saas_users z tabelą transakcji app_transactions (INNER JOIN po user_id). Dla każdego kraju (country) policz liczbę unikalnych użytkowników posiadających zatwierdzoną transakcję (tx_status = 'approved') jako paying_users oraz łączną sumę ich zatwierdzonych kwot jako total_amount. Wynik posortuj malejąco według łącznej kwoty total_amount.",
    sol: "SELECT u.country, COUNT(DISTINCT u.user_id) AS paying_users, SUM(t.amount) AS total_amount FROM saas_users u JOIN app_transactions t ON t.user_id = u.user_id WHERE t.tx_status = 'approved' GROUP BY u.country ORDER BY total_amount DESC;",
    order: true,
    detectTrap: function(sql) {
      var s = ivClean(sql);
      if (!/\bsaas_users\b/i.test(s) || !/\bapp_transactions\b/i.test(s)) return null;
      if (/\bCOUNT\s*\((?!\s*DISTINCT\b)/i.test(s) && !/\bCOUNT\s*\(\s*DISTINCT\b/i.test(s)) {
        return 'PUŁAPKA ZIARNA: Zwykły COUNT po JOIN liczy transakcje, a nie użytkowników. Jeden użytkownik z 3 płatnościami zostanie policzony 3 razy. Użyj COUNT(DISTINCT u.user_id).';
      }
      return null;
    }
  },
  {
    id: 'iv_4', difficulty: 'easy', categoryTag: 'E-commerce',
    title: '4. Segmenty wartości zamówień (CASE WHEN)',
    tables: ['product_orders'],
    gapId: 'g12', gapName: 'CASE WHEN do segmentacji danych',
    gapHint: 'Segmenty tworzysz wyrażeniem CASE WHEN ... THEN ... ELSE ... END w SELECT, a następnie grupujesz po nim (GROUP BY 1). WHERE tylko odrzuciłby część wierszy.',
    hint: 'Segmenty tworzysz wyrażeniem CASE WHEN ... THEN ... ELSE ... END w SELECT, a następnie grupujesz po nim (GROUP BY 1). WHERE tylko odrzuciłby część wierszy.',
    cols: ['product_orders', 'quantity', 'unit_price', 'CASE WHEN', 'THEN', 'ELSE', 'END', 'GROUP BY'],
    prompt: "W tabeli `product_orders` oblicz wartość zamówienia `quantity * unit_price` i przypisz je do segmentu za pomocą `CASE WHEN`: `'Maly'` (wartość poniżej `500`), `'Sredni'` (od `500` do `3000` włącznie) oraz `'Duzy'` (powyżej `3000`). Zwróć `segment`, liczbę zamówień `orders_cnt` oraz łączną wartość `total_value`. Posortuj malejąco po `total_value`.",
    sol: "SELECT CASE WHEN quantity * unit_price < 500 THEN 'Maly' WHEN quantity * unit_price <= 3000 THEN 'Sredni' ELSE 'Duzy' END AS segment, COUNT(*) AS orders_cnt, SUM(quantity * unit_price) AS total_value FROM product_orders GROUP BY 1 ORDER BY total_value DESC;",
    order: true,
    detectTrap: function(sql) {
      var s = ivClean(sql);
      if (!/\bproduct_orders\b/i.test(s)) return null;
      if (!/\bCASE\b/i.test(s)) {
        return 'PUŁAPKA SEGMENTACJI: Segmenty tworzy się wyrażeniem CASE WHEN ... END. Warunki w WHERE odrzucają wiersze zamiast przypisywać je do segmentów.';
      }
      return null;
    }
  },
  {
    id: 'iv_5', difficulty: 'easy', categoryTag: 'E-commerce',
    title: '5. Przychód i średnia cena kategorii (ROUND)',
    tables: ['product_orders'],
    gapId: 'g7', gapName: 'GROUP BY i filtrowanie grup w HAVING',
    gapHint: 'Funkcji agregujących (SUM, COUNT, AVG) nie wolno używać w WHERE. Warunek na przychód kategorii sprawdzasz w HAVING po GROUP BY.',
    hint: 'Funkcji agregujących (SUM, COUNT, AVG) nie wolno używać w WHERE. Warunek na przychód kategorii sprawdzasz w HAVING po GROUP BY.',
    cols: ['product_orders', 'category', 'quantity', 'unit_price', 'SUM(', 'ROUND(AVG(', 'HAVING'],
    prompt: "W tabeli `product_orders` policz dla każdej kategorii (`category`) łączny przychód `revenue` (`SUM(quantity * unit_price)`), średnią cenę jednostkową zaokrągloną do 2 miejsc `avg_price` (`ROUND(AVG(unit_price), 2)`) oraz liczbę sprzedanych sztuk `units`. Zostaw kategorie z przychodem powyżej `10000` i posortuj malejąco po `revenue`.",
    sol: "SELECT category, SUM(quantity * unit_price) AS revenue, ROUND(AVG(unit_price), 2) AS avg_price, SUM(quantity) AS units FROM product_orders GROUP BY category HAVING SUM(quantity * unit_price) > 10000 ORDER BY revenue DESC;",
    order: true,
    detectTrap: function(sql) {
      var s = ivClean(sql);
      if (!/\bproduct_orders\b/i.test(s)) return null;
      if (/\bWHERE\b[\s\S]*\b(?:SUM|AVG|COUNT)\s*\(/i.test(s) && !/\bHAVING\b/i.test(s)) {
        return 'PUŁAPKA WHERE vs HAVING: Funkcji agregujących nie używa się w WHERE. Warunek na sumę przychodu kategorii wpisz do HAVING.';
      }
      return null;
    }
  },

  /* ============================= MEDIUM ============================= */
  {
    id: 'iv_6', difficulty: 'medium', categoryTag: 'HR & Płace',
    title: '6. Top 3 poziomy pensji w każdym dziale (remisy)',
    tables: ['emp_salaries'],
    gapId: 't5', gapName: 'DENSE_RANK vs RANK vs ROW_NUMBER przy remisach',
    gapHint: 'ROW_NUMBER nadaje różne numery osobom z tą samą pensją, a RANK zostawia dziury (1, 1, 3). Gdy pytanie dotyczy N najwyższych UNIKALNYCH wartości, użyj DENSE_RANK() w CTE i filtruj wynik na zewnątrz.',
    hint: 'ROW_NUMBER nadaje różne numery osobom z tą samą pensją, a RANK zostawia dziury (1, 1, 3). Gdy pytanie dotyczy N najwyższych UNIKALNYCH wartości, użyj DENSE_RANK() w CTE i filtruj wynik na zewnątrz.',
    cols: ['emp_salaries', 'WITH', 'DENSE_RANK()', 'OVER', 'PARTITION BY', 'department', 'salary'],
    prompt: "Dla każdego działu w `emp_salaries` zwróć pracowników, którzy mają jedną z 3 najwyższych UNIKALNYCH pensji w swoim dziale (osoby z identyczną pensją dostają to samo miejsce, bez dziur w numeracji). Zwróć `department`, `full_name`, `salary` oraz `salary_rank`. Posortuj po `department`, `salary_rank`, a następnie `full_name`.",
    sol: "WITH r AS (SELECT department, full_name, salary, DENSE_RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS salary_rank FROM emp_salaries) SELECT department, full_name, salary, salary_rank FROM r WHERE salary_rank <= 3 ORDER BY department, salary_rank, full_name;",
    order: true,
    detectTrap: function(sql) {
      var s = ivClean(sql);
      if (!/\bemp_salaries\b/i.test(s)) return null;
      if (/\bROW_NUMBER\s*\(/i.test(s)) return 'PUŁAPKA REMISÓW: ROW_NUMBER() rozdziela osoby z tą samą pensją (np. dwóch seniorów po 14000) na różne miejsca zamiast nadać im to samo.';
      if (/\bRANK\s*\(/i.test(s) && !/\bDENSE_RANK\s*\(/i.test(s)) return 'PUŁAPKA RANK(): Po remisie RANK() przeskakuje numerację (1, 2, 3, 3, 5). Aby miejsca były ciągłe, użyj DENSE_RANK().';
      return null;
    }
  },
  {
    id: 'iv_7', difficulty: 'medium', categoryTag: 'HR & Płace',
    title: '7. Pracownicy zarabiający więcej niż ich menedżer (self-join)',
    tables: ['emp_salaries'],
    gapId: 'g13', gapName: 'Self-join: łączenie tabeli samej ze sobą',
    gapHint: 'Tabelę łączysz sama ze sobą pod dwoma aliasami: e (pracownik) i m (menedżer). Warunek łączenia to e.manager_id = m.emp_id, a nie emp_id = emp_id.',
    hint: 'Tabelę łączysz sama ze sobą pod dwoma aliasami: e (pracownik) i m (menedżer). Warunek łączenia to e.manager_id = m.emp_id, a nie emp_id = emp_id.',
    cols: ['emp_salaries', 'emp_id', 'manager_id', 'full_name', 'salary', 'JOIN', 'ON'],
    prompt: "Połącz tabelę `emp_salaries` samą ze sobą (self-join po `manager_id` pracownika = `emp_id` menedżera). Zwróć pracowników, którzy zarabiają WIĘCEJ niż ich menedżer: `employee` (imię pracownika), `emp_salary`, `manager` (imię menedżera) oraz `manager_salary`. Posortuj malejąco po `emp_salary`.",
    sol: "SELECT e.full_name AS employee, e.salary AS emp_salary, m.full_name AS manager, m.salary AS manager_salary FROM emp_salaries e JOIN emp_salaries m ON e.manager_id = m.emp_id WHERE e.salary > m.salary ORDER BY e.salary DESC;",
    order: true,
    detectTrap: function(sql) {
      var s = ivClean(sql);
      if (!/\bemp_salaries\b/i.test(s)) return null;
      if (/\bON\s+\w+\.emp_id\s*=\s*\w+\.emp_id\b/i.test(s)) {
        return 'PUŁAPKA SELF-JOIN: Warunek emp_id = emp_id łączy każdego pracownika z nim samym. Połącz manager_id pracownika z emp_id menedżera.';
      }
      return null;
    }
  },
  {
    id: 'iv_8', difficulty: 'medium', categoryTag: 'Finanse & Płatności',
    title: '8. Odsetek odrzuconych transakcji w kategorii (FILTER + 100.0)',
    tables: ['app_transactions'],
    gapId: 'g10', gapName: 'Dzielenie całkowite (* 100.0)',
    gapHint: 'Dzielenie dwóch liczb całkowitych (COUNT / COUNT) obcina ułamek do 0. Mnóż licznik przez 100.0 albo rzutuj ::numeric. Licznik policzysz przez COUNT(*) FILTER (WHERE ...).',
    hint: 'Dzielenie dwóch liczb całkowitych (COUNT / COUNT) obcina ułamek do 0. Mnóż licznik przez 100.0 albo rzutuj ::numeric. Licznik policzysz przez COUNT(*) FILTER (WHERE ...).',
    cols: ['app_transactions', 'merchant_category', 'tx_status', "COUNT(*) FILTER (WHERE", '* 100.0', 'ROUND('],
    prompt: "Dla każdej kategorii sprzedawcy (`merchant_category`) w tabeli `app_transactions` policz: liczbę wszystkich transakcji `tx_cnt` oraz odsetek odrzuconych (`tx_status = 'declined'`) jako `declined_pct`, zaokrąglony do 2 miejsc (`ROUND(COUNT(*) FILTER (WHERE ...) * 100.0 / COUNT(*), 2)`). Posortuj malejąco po `declined_pct`, a przy remisie po `merchant_category`.",
    sol: "SELECT merchant_category, COUNT(*) AS tx_cnt, ROUND(COUNT(*) FILTER (WHERE tx_status = 'declined') * 100.0 / COUNT(*), 2) AS declined_pct FROM app_transactions GROUP BY merchant_category ORDER BY declined_pct DESC, merchant_category ASC;",
    order: true,
    detectTrap: function(sql) {
      var s = ivClean(sql);
      if (!/\bapp_transactions\b/i.test(s)) return null;
      if (/\//.test(s) && s.indexOf('100.0') < 0 && !/numeric|decimal|float|real/i.test(s)) {
        return 'PUŁAPKA DZIELENIA CAŁKOWITEGO: Brakuje * 100.0 (lub ::numeric). Dzielenie liczby odrzuconych przez liczbę wszystkich daje 0 zamiast ułamka.';
      }
      return null;
    }
  },
  {
    id: 'iv_9', difficulty: 'medium', categoryTag: 'Produkt & SaaS',
    title: '9. Nowi użytkownicy bez zatwierdzonej płatności (LEFT JOIN)',
    tables: ['saas_users', 'app_transactions'],
    gapId: 'g2', gapName: 'LEFT JOIN: warunek w ON czy w WHERE',
    gapHint: 'Filtr na prawej tabeli (tx_status) w WHERE usuwa wiersze z NULL i zamienia LEFT JOIN w INNER JOIN. Warunek na status dopisz do ON, a brak pary sprawdź przez IS NULL.',
    hint: 'Filtr na prawej tabeli (tx_status) w WHERE usuwa wiersze z NULL i zamienia LEFT JOIN w INNER JOIN. Warunek na status dopisz do ON, a brak pary sprawdź przez IS NULL.',
    cols: ['saas_users', 'app_transactions', 'LEFT JOIN', 'IS NULL', 'signup_date', 'plan_type', 'tx_status'],
    prompt: "Znajdź użytkowników z `saas_users` z planem `'free'` lub `'pro'`, którzy zarejestrowali się w 2026 roku (`signup_date >= '2026-01-01'`) i NIE mają żadnej zatwierdzonej transakcji (`tx_status = 'approved'`) w `app_transactions`. Zwróć `user_id`, `country`, `plan_type` posortowane po `user_id`. Uwaga: użytkownik, który miał tylko odrzucone transakcje, też się liczy!",
    sol: "SELECT u.user_id, u.country, u.plan_type FROM saas_users u LEFT JOIN app_transactions t ON t.user_id = u.user_id AND t.tx_status = 'approved' WHERE u.signup_date >= '2026-01-01' AND u.plan_type IN ('free', 'pro') AND t.tx_id IS NULL ORDER BY u.user_id;",
    order: true,
    detectTrap: function(sql) {
      var s = ivClean(sql);
      if (!/\bsaas_users\b/i.test(s) || !/\bapp_transactions\b/i.test(s)) return null;
      if (/\bJOIN\b/i.test(s) && !/\bLEFT\s+(?:OUTER\s+)?JOIN\b/i.test(s)) {
        return 'PUŁAPKA INNER JOIN: Zwykły JOIN gubi użytkowników bez transakcji, a to właśnie ich szukasz. Użyj LEFT JOIN i IS NULL.';
      }
      if (/\bWHERE\b[\s\S]*\btx_status\b/i.test(s)) {
        return 'PUŁAPKA ON vs WHERE: Filtr na tx_status w WHERE odrzuca wiersze z NULL (użytkowników bez płatności) i psuje LEFT JOIN. Przenieś go do ON.';
      }
      return null;
    }
  },
  {
    id: 'iv_10', difficulty: 'medium', categoryTag: 'E-commerce',
    title: '10. Średnia wartość zamówienia po rabacie (pułapka NULL)',
    tables: ['product_orders'],
    gapId: 'g8', gapName: 'AVG pomija NULL-e (COALESCE przed agregacją)',
    gapHint: 'Gdy discount_pct jest NULL, całe wyrażenie quantity * unit_price * (1 - discount_pct / 100) też staje się NULL, a AVG takie wiersze pomija. Zamień NULL na 0 przez COALESCE(discount_pct, 0).',
    hint: 'Gdy discount_pct jest NULL, całe wyrażenie quantity * unit_price * (1 - discount_pct / 100) też staje się NULL, a AVG takie wiersze pomija. Zamień NULL na 0 przez COALESCE(discount_pct, 0).',
    cols: ['product_orders', 'category', 'discount_pct', 'COALESCE(', 'AVG(', 'ROUND('],
    prompt: "W tabeli `product_orders` rabat `discount_pct` bywa `NULL` (oznacza brak rabatu = `0`). Dla każdej kategorii (`category`) zwróć liczbę zamówień `orders_cnt` oraz średnią wartość zamówienia po rabacie `avg_order_value` = `ROUND(AVG(quantity * unit_price * (1 - discount_pct / 100)), 2)`. Zadbaj, aby zamówienia z `NULL` w rabacie były uwzględnione. Posortuj malejąco po `avg_order_value`.",
    sol: "SELECT category, COUNT(*) AS orders_cnt, ROUND(AVG(quantity * unit_price * (1 - COALESCE(discount_pct, 0) / 100)), 2) AS avg_order_value FROM product_orders GROUP BY category ORDER BY avg_order_value DESC;",
    order: true,
    detectTrap: function(sql) {
      var s = ivClean(sql);
      if (!/\bproduct_orders\b/i.test(s)) return null;
      if (/\bdiscount_pct\b/i.test(s) && !/\bCOALESCE\s*\(/i.test(s)) {
        return 'PUŁAPKA NULL: Wyrażenie z discount_pct = NULL daje NULL, a AVG() pomija takie zamówienia, więc średnia jest zawyżona. Użyj COALESCE(discount_pct, 0).';
      }
      return null;
    }
  },

  /* ============================== HARD ============================== */
  {
    id: 'iv_11', difficulty: 'hard', categoryTag: 'E-commerce',
    title: '11. Zmiana przychodu miesiąc do miesiąca (LAG)',
    tables: ['product_orders'],
    gapId: 'g5', gapName: 'LAG() i porównania okresowe MoM',
    gapHint: 'Najpierw zagreguj zamówienia do jednego wiersza na miesiąc w CTE (GROUP BY), a dopiero potem użyj LAG(revenue) OVER (ORDER BY miesiąc). LAG na surowych zamówieniach porównuje pojedyncze zamówienia, a nie miesiące.',
    hint: 'Najpierw zagreguj zamówienia do jednego wiersza na miesiąc w CTE (GROUP BY), a dopiero potem użyj LAG(revenue) OVER (ORDER BY miesiąc). LAG na surowych zamówieniach porównuje pojedyncze zamówienia, a nie miesiące.',
    cols: ['product_orders', 'WITH', 'DATE_TRUNC', 'LAG(', 'OVER', 'COALESCE(', 'ROUND('],
    prompt: "Policz miesięczny przychód po rabacie w `product_orders` (rabat `NULL` = `0`): `revenue` = `ROUND(SUM(quantity * unit_price * (1 - COALESCE(discount_pct, 0) / 100)), 2)` dla `DATE_TRUNC('month', order_date)::date AS month_start`. Następnie zwróć `month_start`, `revenue`, `prev_revenue` (przychód poprzedniego miesiąca z `LAG`) oraz zmianę procentową `mom_pct` = `ROUND((revenue - prev_revenue) * 100.0 / prev_revenue, 2)`. Posortuj po `month_start`.",
    sol: "WITH m AS (SELECT DATE_TRUNC('month', order_date)::date AS month_start, ROUND(SUM(quantity * unit_price * (1 - COALESCE(discount_pct, 0) / 100)), 2) AS revenue FROM product_orders GROUP BY 1) SELECT month_start, revenue, LAG(revenue) OVER (ORDER BY month_start) AS prev_revenue, ROUND((revenue - LAG(revenue) OVER (ORDER BY month_start)) * 100.0 / LAG(revenue) OVER (ORDER BY month_start), 2) AS mom_pct FROM m ORDER BY month_start;",
    order: true,
    detectTrap: function(sql) {
      var s = ivClean(sql);
      if (!/\bproduct_orders\b/i.test(s)) return null;
      if (/\bLAG\s*\(/i.test(s) && !/\bGROUP\s+BY\b/i.test(s)) {
        return 'PUŁAPKA ZIARNA OKNA: LAG() użyty na surowych zamówieniach porównuje pojedyncze zamówienia. Najpierw zagreguj przychód do poziomu miesiąca (GROUP BY), potem użyj LAG().';
      }
      return null;
    }
  },
  {
    id: 'iv_12', difficulty: 'hard', categoryTag: 'Finanse & Płatności',
    title: '12. Powtórzone płatności w ciągu 10 minut (LAG + EXTRACT)',
    tables: ['app_transactions'],
    gapId: 'g5', gapName: 'LAG() i porównania okresowe MoM',
    gapHint: 'Poprzednią podobną transakcję znajdziesz przez LAG(tx_timestamp) OVER (PARTITION BY user_id, merchant_category, amount ORDER BY tx_timestamp). Bez PARTITION BY porównasz płatności różnych osób i kategorii.',
    hint: 'Poprzednią podobną transakcję znajdziesz przez LAG(tx_timestamp) OVER (PARTITION BY user_id, merchant_category, amount ORDER BY tx_timestamp). Bez PARTITION BY porównasz płatności różnych osób i kategorii.',
    cols: ['app_transactions', 'WITH', 'LAG(', 'PARTITION BY', 'EXTRACT(EPOCH FROM', "INTERVAL '10 minutes'"],
    prompt: "Znajdź powtórzone płatności w `app_transactions`: transakcje, w których ten sam `user_id` zapłacił tę samą kwotę `amount` u tego samego `merchant_category` nie później niż `10` minut po poprzedniej takiej transakcji. Użyj `LAG(tx_timestamp) OVER (PARTITION BY user_id, merchant_category, amount ORDER BY tx_timestamp)`. Zwróć `tx_id`, `user_id`, `amount` oraz `minutes_since_prev` = `ROUND(EXTRACT(EPOCH FROM (tx_timestamp - prev_ts)) / 60.0, 0)`. Posortuj po `tx_id`.",
    sol: "WITH x AS (SELECT tx_id, user_id, amount, tx_timestamp, LAG(tx_timestamp) OVER (PARTITION BY user_id, merchant_category, amount ORDER BY tx_timestamp) AS prev_ts FROM app_transactions) SELECT tx_id, user_id, amount, ROUND(EXTRACT(EPOCH FROM (tx_timestamp - prev_ts)) / 60.0, 0) AS minutes_since_prev FROM x WHERE prev_ts IS NOT NULL AND tx_timestamp - prev_ts <= INTERVAL '10 minutes' ORDER BY tx_id;",
    order: true,
    detectTrap: function(sql) {
      var s = ivClean(sql);
      if (!/\bapp_transactions\b/i.test(s)) return null;
      if (/\bLAG\s*\(/i.test(s) && !/\bPARTITION\s+BY\b/i.test(s)) {
        return 'PUŁAPKA PARTYCJI: LAG() bez PARTITION BY porównuje kolejne transakcje wszystkich użytkowników. Powtórzenie dotyczy tego samego user_id, merchant_category i amount.';
      }
      if (/\bWHERE\b[\s\S]*\bLAG\s*\(/i.test(s)) {
        return 'PUŁAPKA KOLEJNOŚCI SQL: Funkcji okna nie wolno użyć bezpośrednio w WHERE. Policz LAG() w CTE, a warunek na odstęp czasu dodaj w zapytaniu zewnętrznym.';
      }
      return null;
    }
  },
  {
    id: 'iv_13', difficulty: 'hard', categoryTag: 'E-commerce',
    title: '13. Krocząca średnia i suma z 3 miesięcy (ROWS BETWEEN)',
    tables: ['product_orders'],
    gapId: 'g14', gapName: 'Okna ruchome: ROWS BETWEEN',
    gapHint: 'Samo OVER (ORDER BY ...) liczy od początku danych do bieżącego wiersza. Okno z ostatnich 3 miesięcy definiujesz jawnie: ROWS BETWEEN 2 PRECEDING AND CURRENT ROW.',
    hint: 'Samo OVER (ORDER BY ...) liczy od początku danych do bieżącego wiersza. Okno z ostatnich 3 miesięcy definiujesz jawnie: ROWS BETWEEN 2 PRECEDING AND CURRENT ROW.',
    cols: ['product_orders', 'WITH', 'DATE_TRUNC', 'AVG(', 'SUM(', 'OVER', 'ROWS BETWEEN 2 PRECEDING AND CURRENT ROW'],
    prompt: "Policz miesięczny przychód brutto w `product_orders` (`SUM(quantity * unit_price)` jako `revenue` dla `DATE_TRUNC('month', order_date)::date AS month_start`). Następnie zwróć `month_start`, `revenue`, kroczącą średnią z bieżącego i 2 poprzednich miesięcy `rolling_avg_3m` (`ROUND(AVG(revenue) OVER (...), 2)`) oraz kroczącą sumę z tych samych 3 miesięcy `rolling_sum_3m`. Posortuj po `month_start`.",
    sol: "WITH m AS (SELECT DATE_TRUNC('month', order_date)::date AS month_start, SUM(quantity * unit_price) AS revenue FROM product_orders GROUP BY 1) SELECT month_start, revenue, ROUND(AVG(revenue) OVER (ORDER BY month_start ROWS BETWEEN 2 PRECEDING AND CURRENT ROW), 2) AS rolling_avg_3m, SUM(revenue) OVER (ORDER BY month_start ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) AS rolling_sum_3m FROM m ORDER BY month_start;",
    order: true,
    detectTrap: function(sql) {
      var s = ivClean(sql);
      if (!/\bproduct_orders\b/i.test(s)) return null;
      if (/\bOVER\s*\(/i.test(s) && !/\bROWS\s+BETWEEN\b/i.test(s)) {
        return 'PUŁAPKA RAMKI OKNA: Bez ROWS BETWEEN okno rośnie od pierwszego miesiąca (suma narastająca), a nie obejmuje ostatnich 3 miesięcy. Dodaj ROWS BETWEEN 2 PRECEDING AND CURRENT ROW.';
      }
      return null;
    }
  },
  {
    id: 'iv_14', difficulty: 'hard', categoryTag: 'E-commerce',
    title: '14. Najsilniejsza kategoria miesiąca i jej udział w przychodzie',
    tables: ['product_orders'],
    gapId: 't5', gapName: 'Filtrowanie funkcji okna wymaga CTE / podzapytania',
    gapHint: 'Udział w miesiącu liczysz sumą okna z PARTITION BY (SUM(revenue) OVER (PARTITION BY month_start)). Pusta suma okna OVER () dałaby udział w całym roku. Wynik ROW_NUMBER() filtrujesz dopiero w zapytaniu zewnętrznym.',
    hint: 'Udział w miesiącu liczysz sumą okna z PARTITION BY (SUM(revenue) OVER (PARTITION BY month_start)). Pusta suma okna OVER () dałaby udział w całym roku. Wynik ROW_NUMBER() filtrujesz dopiero w zapytaniu zewnętrznym.',
    cols: ['product_orders', 'WITH', 'SUM(', 'OVER', 'PARTITION BY', 'ROW_NUMBER()', 'ROUND('],
    prompt: "W `product_orders` policz przychód brutto `revenue` (`SUM(quantity * unit_price)`) dla każdej pary: miesiąc (`DATE_TRUNC('month', order_date)::date AS month_start`) i `category`. Dodaj udział kategorii w przychodzie miesiąca `share_pct` = `ROUND(100.0 * revenue / SUM(revenue) OVER (PARTITION BY month_start), 2)` oraz numer `ROW_NUMBER() OVER (PARTITION BY month_start ORDER BY revenue DESC, category ASC)`. Zwróć `month_start`, `category`, `revenue`, `share_pct` tylko dla najsilniejszej kategorii każdego miesiąca. Posortuj po `month_start`.",
    sol: "WITH m AS (SELECT DATE_TRUNC('month', order_date)::date AS month_start, category, SUM(quantity * unit_price) AS revenue FROM product_orders GROUP BY 1, 2), s AS (SELECT month_start, category, revenue, ROUND(100.0 * revenue / SUM(revenue) OVER (PARTITION BY month_start), 2) AS share_pct, ROW_NUMBER() OVER (PARTITION BY month_start ORDER BY revenue DESC, category ASC) AS rn FROM m) SELECT month_start, category, revenue, share_pct FROM s WHERE rn = 1 ORDER BY month_start;",
    order: true,
    detectTrap: function(sql) {
      var s = ivClean(sql);
      if (!/\bproduct_orders\b/i.test(s)) return null;
      if (/\bWHERE\b[\s\S]*\b(?:ROW_NUMBER|RANK|DENSE_RANK)\s*\(/i.test(s)) {
        return 'PUŁAPKA KOLEJNOŚCI SQL: Wyniku ROW_NUMBER() nie filtrujesz w WHERE tego samego zapytania. Policz go w CTE, a WHERE rn = 1 dodaj w zapytaniu zewnętrznym.';
      }
      if (/\bSUM\s*\([^)]*\)\s*OVER\s*\(\s*\)/i.test(s)) {
        return 'PUŁAPKA OKNA: SUM(...) OVER () sumuje cały wynik, więc dostaniesz udział w przychodzie całego okresu. Dodaj PARTITION BY month_start, aby liczyć udział w obrębie miesiąca.';
      }
      return null;
    }
  },
  {
    id: 'iv_15', difficulty: 'hard', categoryTag: 'Produkt & SaaS',
    title: '15. Retencja kohort rejestracji (aktywność w marcu)',
    tables: ['saas_users', 'user_events'],
    gapId: 'g1', gapName: 'Ziarno wyniku i mnożenie wierszy po JOIN',
    gapHint: 'Użytkownik ma w user_events wiele logowań, więc bezpośredni JOIN mnoży jego wiersz. Najpierw wyznacz w CTE unikalnych aktywnych użytkowników (SELECT DISTINCT user_id), a dopiero potem dołącz je LEFT JOIN-em do saas_users.',
    hint: 'Użytkownik ma w user_events wiele logowań, więc bezpośredni JOIN mnoży jego wiersz. Najpierw wyznacz w CTE unikalnych aktywnych użytkowników (SELECT DISTINCT user_id), a dopiero potem dołącz je LEFT JOIN-em do saas_users.',
    cols: ['saas_users', 'user_events', 'WITH', 'DISTINCT', 'LEFT JOIN', 'DATE_TRUNC', 'COUNT(', 'ROUND('],
    prompt: "Zbuduj tabelę retencji kohort. Kohorta to miesiąc rejestracji (`DATE_TRUNC('month', signup_date)::date AS cohort_month`) z `saas_users`. Aktywny w marcu to użytkownik, który ma w `user_events` co najmniej jedno zdarzenie `'login'` w marcu 2026 (`event_time >= '2026-03-01' AND event_time < '2026-04-01'`). Dla każdej kohorty zwróć `cohort_size` (wszyscy użytkownicy kohorty), `active_in_march` oraz `retention_pct` = `ROUND(active_in_march * 100.0 / cohort_size, 2)`. Posortuj po `cohort_month`.",
    sol: "WITH march_active AS (SELECT DISTINCT user_id FROM user_events WHERE event_type = 'login' AND event_time >= '2026-03-01' AND event_time < '2026-04-01') SELECT DATE_TRUNC('month', u.signup_date)::date AS cohort_month, COUNT(*) AS cohort_size, COUNT(a.user_id) AS active_in_march, ROUND(COUNT(a.user_id) * 100.0 / COUNT(*), 2) AS retention_pct FROM saas_users u LEFT JOIN march_active a ON a.user_id = u.user_id GROUP BY 1 ORDER BY 1;",
    order: true,
    detectTrap: function(sql) {
      var s = ivClean(sql);
      if (!/\bsaas_users\b/i.test(s) || !/\buser_events\b/i.test(s)) return null;
      if (/\bJOIN\s+user_events\b/i.test(s) && !/\bDISTINCT\b/i.test(s)) {
        return 'PUŁAPKA ZIARNA: JOIN prosto do user_events mnoży użytkownika przez liczbę jego zdarzeń, więc COUNT(*) zawyża kohorty. Najpierw wyznacz w CTE unikalnych aktywnych użytkowników (DISTINCT user_id).';
      }
      return null;
    }
  },

  /* =================== DODATKOWE EASY (iv_16 – iv_30) =================== */
  {
    id: 'iv_16', difficulty: 'easy', categoryTag: 'HR & Płace',
    title: '16. Zatrudnieni po 2021 roku z pensją powyżej 7000 (WHERE + ORDER BY)',
    tables: ['emp_salaries'],
    gapId: 'g4', gapName: 'Filtrowanie dat i porządek sortowania',
    gapHint: "Daty w SQL porównujemy w formacie 'YYYY-MM-DD'. Po roku 2021 oznacza hire_date >= '2022-01-01' (lub > '2021-12-31').",
    hint: "Daty w SQL porównujemy w formacie 'YYYY-MM-DD'. Po roku 2021 oznacza hire_date >= '2022-01-01' (lub > '2021-12-31').",
    cols: ['emp_salaries', 'full_name', 'department', 'hire_date', 'salary', 'WHERE', 'ORDER BY'],
    prompt: "Z listy pracowników wypisz imię i nazwisko, dział, datę zatrudnienia oraz pensję dla osób zatrudnionych od początku 2022 roku, których wynagrodzenie przekracza 7000. Wynik posortuj chronologicznie rosnąco.",
    sol: "SELECT full_name, department, hire_date, salary FROM emp_salaries WHERE hire_date >= '2022-01-01' AND salary > 7000 ORDER BY hire_date ASC;",
    order: true,
    detectTrap: function(sql) {
      var s = ivClean(sql);
      if (!/\bemp_salaries\b/i.test(s)) return null;
      if (/hire_date\s*>\s*202[12]\b/.test(s)) {
        return "PUŁAPKA LITERAŁU DATY: Datę zapisz w apostrofach jako '2022-01-01', a nie jako samą liczbę roku.";
      }
      return null;
    }
  },
  {
    id: 'iv_17', difficulty: 'easy', categoryTag: 'HR & Płace',
    title: '17. Wyszukiwanie stanowisk kierowniczych i seniorskich (ILIKE)',
    tables: ['emp_salaries'],
    gapId: 'g11', gapName: 'Priorytet AND / OR i wyszukiwanie wzorców ILIKE',
    gapHint: "Gdy łączysz dwa warunki OR z dodatkowym filtrem lub wyszukujesz dwa wzorce tekstu, pamiętaj o znakach % z obu stron wzorca.",
    hint: "Gdy łączysz dwa warunki OR z dodatkowym filtrem lub wyszukujesz dwa wzorce tekstu, pamiętaj o znakach % z obu stron wzorca.",
    cols: ['emp_salaries', 'full_name', 'job_title', 'department', 'salary', 'ILIKE'],
    prompt: "Z tabeli `emp_salaries` wypisz `full_name`, `job_title`, `department` oraz `salary` dla pracowników, których stanowisko (`job_title`) zawiera słowo `'Senior'` lub `'Manager'` (bez względu na wielkość liter — użyj `ILIKE`). Posortuj malejąco po `salary`, a następnie rosnąco po `full_name`.",
    sol: "SELECT full_name, job_title, department, salary FROM emp_salaries WHERE job_title ILIKE '%Senior%' OR job_title ILIKE '%Manager%' ORDER BY salary DESC, full_name ASC;",
    order: true,
    detectTrap: function(sql) {
      var s = ivClean(sql);
      if (!/\bemp_salaries\b/i.test(s)) return null;
      if (/\bILIKE\s+'[^%]+'/.test(s)) {
        return "PUŁAPKA WZORCA ILIKE: Bez znaku % (np. '%Senior%') operator ILIKE szuka dokładnego dopasowania całego napisu zamiast fragmentu.";
      }
      return null;
    }
  },
  {
    id: 'iv_18', difficulty: 'easy', categoryTag: 'HR & Płace',
    title: '18. Liczba pracowników i widełki płacowe w działach (MIN / MAX / AVG)',
    tables: ['emp_salaries'],
    gapId: 'g7', gapName: 'GROUP BY i funkcje agregujące',
    gapHint: "Wszystkie kolumny nieagregowane z SELECT muszą znaleźć się w GROUP BY. Średnią zaokrąglij przez ROUND(AVG(salary), 2).",
    hint: "Wszystkie kolumny nieagregowane z SELECT muszą znaleźć się w GROUP BY. Średnią zaokrąglij przez ROUND(AVG(salary), 2).",
    cols: ['emp_salaries', 'department', 'COUNT(*)', 'MIN(salary)', 'MAX(salary)', 'ROUND(AVG(salary), 2)', 'GROUP BY'],
    prompt: "Dla każdego działu (`department`) w `emp_salaries` policz liczbę pracowników `emp_cnt`, minimalną pensję `min_sal`, maksymalną pensję `max_sal` oraz średnią pensję zaokrągloną do 2 miejsc `avg_sal`. Posortuj malejąco po `avg_sal`.",
    sol: "SELECT department, COUNT(*) AS emp_cnt, MIN(salary) AS min_sal, MAX(salary) AS max_sal, ROUND(AVG(salary), 2) AS avg_sal FROM emp_salaries GROUP BY department ORDER BY avg_sal DESC;",
    order: true,
    detectTrap: function(sql) {
      var s = ivClean(sql);
      if (!/\bemp_salaries\b/i.test(s)) return null;
      if (!/\bGROUP\s+BY\b/i.test(s)) {
        return "PUŁAPKA GROUP BY: Aby policzyć statystyki osobno dla każdego działu, musisz użyć klauzuli GROUP BY department.";
      }
      return null;
    }
  },
  {
    id: 'iv_19', difficulty: 'easy', categoryTag: 'HR & Płace',
    title: '19. Działy i ich lokalizacje (INNER JOIN emp_salaries + dept_budgets)',
    tables: ['emp_salaries', 'dept_budgets'],
    gapId: 'g1', gapName: 'Łączenie tabel po kluczu biznesowym',
    gapHint: "Obie tabele łączysz po kolumnie department: ON e.department = d.department.",
    hint: "Obie tabele łączysz po kolumnie department: ON e.department = d.department.",
    cols: ['emp_salaries', 'dept_budgets', 'department', 'location', 'full_name', 'salary', 'JOIN'],
    prompt: "Połącz `emp_salaries` z `dept_budgets` po kolumnie `department`. Wypisz `full_name`, `department`, `location` oraz `salary` tylko dla pracowników pracujących w lokalizacji `'Warsaw'` i zarabiających powyżej `12000`. Posortuj malejąco po `salary`, a przy remisie rosnąco po `full_name`.",
    sol: "SELECT e.full_name, e.department, d.location, e.salary FROM emp_salaries e JOIN dept_budgets d ON d.department = e.department WHERE d.location = 'Warsaw' AND e.salary > 12000 ORDER BY e.salary DESC, e.full_name ASC;",
    order: true,
    detectTrap: function(sql) {
      var s = ivClean(sql);
      if (!/\bemp_salaries\b/i.test(s) || !/\bdept_budgets\b/i.test(s)) return null;
      if (!/\bJOIN\b/i.test(s) && !/,/.test(s.split(/\bFROM\b/i)[1] || '')) {
        return "PUŁAPKA BRAKU JOIN: Kolumna location znajduje się w tabeli dept_budgets, więc musisz połączyć obie tabele.";
      }
      return null;
    }
  },
  {
    id: 'iv_20', difficulty: 'easy', categoryTag: 'HR & Płace',
    title: '20. Dyrektorzy i szefowie bez przełożonego (IS NULL)',
    tables: ['emp_salaries'],
    gapId: 'g3', gapName: 'Porównywanie z NULL: IS NULL zamiast = NULL',
    gapHint: "W SQL porównanie manager_id = NULL zawsze zwraca UNKNOWN (puste wiersze). Użyj manager_id IS NULL.",
    hint: "W SQL porównanie manager_id = NULL zawsze zwraca UNKNOWN (puste wiersze). Użyj manager_id IS NULL.",
    cols: ['emp_salaries', 'emp_id', 'full_name', 'department', 'job_title', 'salary', 'IS NULL'],
    prompt: "Z tabeli `emp_salaries` wybierz pracowników najwyższego szczebla, którzy nie mają przypisanego przełożonego (`manager_id` jest `NULL`). Zwróć `emp_id`, `full_name`, `department`, `job_title` oraz `salary`. Posortuj malejąco po `salary`.",
    sol: "SELECT emp_id, full_name, department, job_title, salary FROM emp_salaries WHERE manager_id IS NULL ORDER BY salary DESC;",
    order: true,
    detectTrap: function(sql) {
      var s = ivClean(sql);
      if (!/\bemp_salaries\b/i.test(s)) return null;
      if (/manager_id\s*=\s*NULL/i.test(s)) {
        return "PUŁAPKA = NULL: W SQL nic nie jest równe NULL. Zamiast manager_id = NULL użyj manager_id IS NULL.";
      }
      return null;
    }
  },
  {
    id: 'iv_21', difficulty: 'easy', categoryTag: 'Produkt & SaaS',
    title: '21. Struktura użytkowników wg typu planu (GROUP BY + COUNT)',
    tables: ['saas_users'],
    gapId: 'g7', gapName: 'Grupowanie i sortowanie po agregacie',
    gapHint: "Policz wiersze przez COUNT(*) i pogrupuj po plan_type.",
    hint: "Policz wiersze przez COUNT(*) i pogrupuj po plan_type.",
    cols: ['saas_users', 'plan_type', 'COUNT(*)', 'MIN(signup_date)', 'MAX(signup_date)', 'GROUP BY'],
    prompt: "W tabeli `saas_users` policz dla każdego planu (`plan_type`) liczbę użytkowników `users_cnt`, datę pierwszej rejestracji `first_signup` oraz datę ostatniej rejestracji `last_signup`. Posortuj malejąco po `users_cnt`, a przy remisie alfabetycznie po `plan_type`.",
    sol: "SELECT plan_type, COUNT(*) AS users_cnt, MIN(signup_date) AS first_signup, MAX(signup_date) AS last_signup FROM saas_users GROUP BY plan_type ORDER BY users_cnt DESC, plan_type ASC;",
    order: true,
    detectTrap: function(sql) {
      var s = ivClean(sql);
      if (!/\bsaas_users\b/i.test(s)) return null;
      if (!/\bGROUP\s+BY\b/i.test(s)) {
        return "PUŁAPKA BRAKU GROUP BY: Używasz funkcji agregujących razem z kolumną plan_type, więc dodaj GROUP BY plan_type.";
      }
      return null;
    }
  },
  {
    id: 'iv_22', difficulty: 'easy', categoryTag: 'Produkt & SaaS',
    title: '22. Aktywność na urządzeniach w marcu 2026 (COUNT + COUNT DISTINCT)',
    tables: ['user_events'],
    gapId: 'g1', gapName: 'Ziarno: liczba zdarzeń vs liczba unikalnych użytkowników',
    gapHint: "COUNT(*) liczy wszystkie zdarzenia, natomiast COUNT(DISTINCT user_id) liczy unikalnych użytkowników na danym typie urządzenia.",
    hint: "COUNT(*) liczy wszystkie zdarzenia, natomiast COUNT(DISTINCT user_id) liczy unikalnych użytkowników na danym typie urządzenia.",
    cols: ['user_events', 'device', 'COUNT(*)', 'COUNT(DISTINCT user_id)', 'GROUP BY'],
    prompt: "Na podstawie tabeli `user_events` policz dla każdego typu urządzenia (`device`) łączną liczbę zdarzeń `events_cnt` oraz liczbę unikalnych użytkowników `unique_users`. Posortuj malejąco po `events_cnt`.",
    sol: "SELECT device, COUNT(*) AS events_cnt, COUNT(DISTINCT user_id) AS unique_users FROM user_events GROUP BY device ORDER BY events_cnt DESC;",
    order: true,
    detectTrap: function(sql) {
      var s = ivClean(sql);
      if (!/\buser_events\b/i.test(s)) return null;
      if (!/\bDISTINCT\b/i.test(s)) {
        return "PUŁAPKA ZIARNA: Aby policzyć unikalnych użytkowników (unique_users), użyj COUNT(DISTINCT user_id), inaczej policzysz zdarzenia.";
      }
      return null;
    }
  },
  {
    id: 'iv_23', difficulty: 'easy', categoryTag: 'Finanse & Płatności',
    title: '23. Top 5 największych zatwierdzonych transakcji (LIMIT)',
    tables: ['app_transactions'],
    gapId: 'g4', gapName: 'Sortowanie malejące przed LIMIT',
    gapHint: "Najpierw odfiltruj tx_status = 'approved', potem posortuj ORDER BY amount DESC, tx_id ASC i ogranicz przez LIMIT 5.",
    hint: "Najpierw odfiltruj tx_status = 'approved', potem posortuj ORDER BY amount DESC, tx_id ASC i ogranicz przez LIMIT 5.",
    cols: ['app_transactions', 'tx_id', 'user_id', 'merchant_category', 'amount', 'ORDER BY', 'LIMIT 5'],
    prompt: "Z tabeli `app_transactions` wybierz 5 największych kwotowo zatwierdzonych transakcji (`tx_status = 'approved'`). Zwróć `tx_id`, `user_id`, `merchant_category` oraz `amount`. Posortuj malejąco po `amount`, a przy remisie rosnąco po `tx_id`.",
    sol: "SELECT tx_id, user_id, merchant_category, amount FROM app_transactions WHERE tx_status = 'approved' ORDER BY amount DESC, tx_id ASC LIMIT 5;",
    order: true,
    detectTrap: function(sql) {
      var s = ivClean(sql);
      if (!/\bapp_transactions\b/i.test(s)) return null;
      if (!/\btx_status\b/i.test(s)) {
        return "PUŁAPKA BRAKU FILTRA: W topowych kwotach jest odrzucona transakcja na 500.00. Odfiltruj tylko zatwierdzone: WHERE tx_status = 'approved'.";
      }
      return null;
    }
  },
  {
    id: 'iv_24', difficulty: 'easy', categoryTag: 'E-commerce',
    title: '24. Zamówienia z jawnie przypisanym rabatem dodatnim (IS NOT NULL)',
    tables: ['product_orders'],
    gapId: 'g3', gapName: 'Wartości NULL vs 0 w kolumnie rabatu',
    gapHint: "W tabeli product_orders są wiersze z discount_pct = NULL oraz discount_pct = 0.00. Warunek discount_pct > 0 automatycznie odrzuca oba te przypadki.",
    hint: "W tabeli product_orders są wiersze z discount_pct = NULL oraz discount_pct = 0.00. Warunek discount_pct > 0 automatycznie odrzuca oba te przypadki.",
    cols: ['product_orders', 'order_id', 'category', 'quantity', 'unit_price', 'discount_pct'],
    prompt: "Z tabeli `product_orders` wypisz `order_id`, `category`, `quantity`, `unit_price` oraz `discount_pct` tylko dla zamówień, w których przyznano rzeczywisty rabat większy od zera (`discount_pct > 0`). Posortuj malejąco po `discount_pct`, a przy remisie rosnąco po `order_id`.",
    sol: "SELECT order_id, category, quantity, unit_price, discount_pct FROM product_orders WHERE discount_pct > 0 ORDER BY discount_pct DESC, order_id ASC;",
    order: true,
    detectTrap: function(sql) {
      var s = ivClean(sql);
      if (!/\bproduct_orders\b/i.test(s)) return null;
      if (/IS\s+NOT\s+NULL/i.test(s) && !/discount_pct\s*>\s*0/.test(s)) {
        return "PUŁAPKA 0.00 vs NULL: Samo discount_pct IS NOT NULL przepuszcza zamówienia z rabatem 0.00%. Dodaj warunek discount_pct > 0.";
      }
      return null;
    }
  },
  {
    id: 'iv_25', difficulty: 'easy', categoryTag: 'Produkt & SaaS',
    title: '25. Liczba zdarzeń każdego typu w systemie (GROUP BY event_type)',
    tables: ['user_events'],
    gapId: 'g7', gapName: 'Podstawowa agregacja po kategorii zdarzenia',
    gapHint: "Grupuj po event_type i policz wiersze funkcją COUNT(*).",
    hint: "Grupuj po event_type i policz wiersze funkcją COUNT(*).",
    cols: ['user_events', 'event_type', 'COUNT(*)', 'COUNT(DISTINCT user_id)', 'GROUP BY'],
    prompt: "Dla każdego typu zdarzenia (`event_type`) w tabeli `user_events` policz łączną liczbę wystąpień `total_events` oraz liczbę unikalnych użytkowników `users_cnt`. Posortuj malejąco po `total_events`.",
    sol: "SELECT event_type, COUNT(*) AS total_events, COUNT(DISTINCT user_id) AS users_cnt FROM user_events GROUP BY event_type ORDER BY total_events DESC;",
    order: true,
    detectTrap: function(sql) {
      var s = ivClean(sql);
      if (!/\buser_events\b/i.test(s)) return null;
      if (!/\bDISTINCT\b/i.test(s)) {
        return "PUŁAPKA ZIARNA: Druga kolumna ma liczyć unikalnych użytkowników (COUNT(DISTINCT user_id)), a nie wszystkie wiersze.";
      }
      return null;
    }
  },
  {
    id: 'iv_26', difficulty: 'easy', categoryTag: 'HR & Płace',
    title: '26. Roczny koszt płac działu na tle budżetu (JOIN + GROUP BY)',
    tables: ['emp_salaries', 'dept_budgets'],
    gapId: 'g1', gapName: 'Przeliczenie pensji miesięcznej na roczną przy porównaniu z budżetem',
    gapHint: "Pensja salary jest miesięczna, a annual_budget roczny. Roczny fundusz płac działu to SUM(e.salary) * 12.",
    hint: "Pensja salary jest miesięczna, a annual_budget roczny. Roczny fundusz płac działu to SUM(e.salary) * 12.",
    cols: ['emp_salaries', 'dept_budgets', 'department', 'annual_budget', 'SUM(salary) * 12', 'JOIN', 'GROUP BY'],
    prompt: "Połącz `dept_budgets` z `emp_salaries` (`INNER JOIN` po `department`). Dla każdego działu posiadającego pracowników zwróć `department`, `annual_budget` oraz roczny koszt pensji `annual_payroll` (`SUM(salary) * 12`). Posortuj malejąco po `annual_payroll`.",
    sol: "SELECT d.department, d.annual_budget, SUM(e.salary) * 12 AS annual_payroll FROM dept_budgets d JOIN emp_salaries e ON e.department = d.department GROUP BY d.department, d.annual_budget ORDER BY annual_payroll DESC;",
    order: true,
    detectTrap: function(sql) {
      var s = ivClean(sql);
      if (!/\bemp_salaries\b/i.test(s) || !/\bdept_budgets\b/i.test(s)) return null;
      if (!/\*\s*12\b/.test(s)) {
        return "PUŁAPKA JEDNOSTKI: Kolumna salary to pensja miesięczna, a budżet jest roczny. Pomnóż sumę pensji przez 12 (SUM(salary) * 12).";
      }
      return null;
    }
  },
  {
    id: 'iv_27', difficulty: 'easy', categoryTag: 'Finanse & Płatności',
    title: '27. Miesięczna liczba i wartość zatwierdzonych transakcji (DATE_TRUNC)',
    tables: ['app_transactions'],
    gapId: 'g4', gapName: 'Grupowanie znaczników czasu do poziomu miesiąca',
    gapHint: "Użyj DATE_TRUNC('month', tx_timestamp)::date AS tx_month i pogrupuj po tym wyrażeniu.",
    hint: "Użyj DATE_TRUNC('month', tx_timestamp)::date AS tx_month i pogrupuj po tym wyrażeniu.",
    cols: ['app_transactions', "DATE_TRUNC('month', tx_timestamp)::date", 'COUNT(*)', 'SUM(amount)', 'GROUP BY'],
    prompt: "W tabeli `app_transactions` pogrupuj zatwierdzone transakcje (`tx_status = 'approved'`) po miesiącu (`DATE_TRUNC('month', tx_timestamp)::date AS tx_month`). Zwróć `tx_month`, liczbę transakcji `tx_cnt` oraz sumę kwot `total_amount`. Posortuj rosnąco po `tx_month`.",
    sol: "SELECT DATE_TRUNC('month', tx_timestamp)::date AS tx_month, COUNT(*) AS tx_cnt, SUM(amount) AS total_amount FROM app_transactions WHERE tx_status = 'approved' GROUP BY 1 ORDER BY 1 ASC;",
    order: true,
    detectTrap: function(sql) {
      var s = ivClean(sql);
      if (!/\bapp_transactions\b/i.test(s)) return null;
      if (/GROUP\s+BY\s+tx_timestamp\b/i.test(s)) {
        return "PUŁAPKA ZIARNA CZASU: Grupowanie po surowym tx_timestamp tworzy osobną grupę dla każdej sekundy/minuty. Użyj DATE_TRUNC('month', tx_timestamp)::date.";
      }
      return null;
    }
  },
  {
    id: 'iv_28', difficulty: 'easy', categoryTag: 'Produkt & SaaS',
    title: '28. Użytkownicy dokonujący zakupów i ich kraje (DISTINCT + JOIN)',
    tables: ['saas_users', 'user_events'],
    gapId: 'g1', gapName: 'Eliminacja duplikatów użytkowników po JOIN ze zdarzeniami',
    gapHint: "Filtruj event_type = 'purchase' i zwróć unikalne wiersze użytkownika lub pogrupuj.",
    hint: "Filtruj event_type = 'purchase' i zwróć unikalne wiersze użytkownika lub pogrupuj.",
    cols: ['saas_users', 'user_events', 'DISTINCT', 'user_id', 'country', 'plan_type', 'device'],
    prompt: "Połącz `saas_users` z `user_events` po `user_id`. Wypisz unikalne wiersze (`DISTINCT`) zawierające `user_id`, `country`, `plan_type` oraz `device` dla użytkowników, którzy wykonali zdarzenie zakupu (`event_type = 'purchase'`). Posortuj rosnąco po `user_id`.",
    sol: "SELECT DISTINCT u.user_id, u.country, u.plan_type, e.device FROM saas_users u JOIN user_events e ON e.user_id = u.user_id WHERE e.event_type = 'purchase' ORDER BY u.user_id ASC;",
    order: true,
    detectTrap: function(sql) {
      var s = ivClean(sql);
      if (!/\bsaas_users\b/i.test(s) || !/\buser_events\b/i.test(s)) return null;
      if (!/purchase/i.test(s)) {
        return "PUŁAPKA FILTRA: Pamiętaj o odfiltrowaniu tylko zdarzeń zakupu: WHERE event_type = 'purchase'.";
      }
      return null;
    }
  },
  {
    id: 'iv_29', difficulty: 'easy', categoryTag: 'E-commerce',
    title: '29. Najczęściej zamawiane produkty wg łącznej liczby sztuk (HAVING)',
    tables: ['product_orders'],
    gapId: 'g7', gapName: 'COUNT(*) vs SUM(quantity) przy liczeniu sprzedanych sztuk',
    gapHint: "COUNT(*) liczy zamówienia (wiersze), a SUM(quantity) liczy sprzedane sztuki towaru.",
    hint: "COUNT(*) liczy zamówienia (wiersze), a SUM(quantity) liczy sprzedane sztuki towaru.",
    cols: ['product_orders', 'product_id', 'category', 'COUNT(*)', 'SUM(quantity)', 'HAVING'],
    prompt: "W tabeli `product_orders` policz dla każdego produktu (`product_id` oraz `category`) liczbę zamówień `orders_cnt` oraz łączną liczbę sprzedanych sztuk `total_qty` (`SUM(quantity)`). Zostaw tylko produkty, których sprzedano łącznie co najmniej `10` sztuk (`HAVING`). Posortuj malejąco po `total_qty`.",
    sol: "SELECT product_id, category, COUNT(*) AS orders_cnt, SUM(quantity) AS total_qty FROM product_orders GROUP BY product_id, category HAVING SUM(quantity) >= 10 ORDER BY total_qty DESC;",
    order: true,
    detectTrap: function(sql) {
      var s = ivClean(sql);
      if (!/\bproduct_orders\b/i.test(s)) return null;
      if (/HAVING\s+COUNT\s*\(\*\)\s*>=\s*10/i.test(s)) {
        return "PUŁAPKA COUNT vs SUM: Warunek dotyczy łącznej liczby sztuk (SUM(quantity) >= 10), a nie liczby zamówień COUNT(*).";
      }
      return null;
    }
  },
  {
    id: 'iv_30', difficulty: 'easy', categoryTag: 'Finanse & Płatności',
    title: '30. Aktywni płatnicy z co najmniej 2 zatwierdzonymi transakcjami',
    tables: ['app_transactions'],
    gapId: 'g7', gapName: 'Filtrowanie przed i po grupowaniu (WHERE + HAVING)',
    gapHint: "Najpierw w WHERE zostaw tx_status = 'approved', a potem w HAVING sprawdź COUNT(*) >= 2.",
    hint: "Najpierw w WHERE zostaw tx_status = 'approved', a potem w HAVING sprawdź COUNT(*) >= 2.",
    cols: ['app_transactions', 'user_id', 'COUNT(*)', 'SUM(amount)', 'ROUND(AVG(amount), 2)', 'HAVING'],
    prompt: "Z tabeli `app_transactions` wyznacz użytkowników (`user_id`), którzy mają co najmniej `2` zatwierdzone transakcje (`tx_status = 'approved'`). Zwróć `user_id`, liczbę zatwierdzonych transakcji `approved_cnt`, ich sumę `total_spent` oraz średnią kwotę zaokrągloną do 2 miejsc `avg_spent`. Posortuj malejąco po `total_spent`, a przy remisie rosnąco po `user_id`.",
    sol: "SELECT user_id, COUNT(*) AS approved_cnt, SUM(amount) AS total_spent, ROUND(AVG(amount), 2) AS avg_spent FROM app_transactions WHERE tx_status = 'approved' GROUP BY user_id HAVING COUNT(*) >= 2 ORDER BY total_spent DESC, user_id ASC;",
    order: true,
    detectTrap: function(sql) {
      var s = ivClean(sql);
      if (!/\bapp_transactions\b/i.test(s)) return null;
      if (!/\bWHERE\b[\s\S]*approved/i.test(s) && !/\bFILTER\b/i.test(s)) {
        return "PUŁAPKA STATUSU: Bez WHERE tx_status = 'approved' wliczasz odrzucone transakcje do sumy i średniej użytkownika.";
      }
      return null;
    }
  },

  /* ================== DODATKOWE MEDIUM (iv_31 – iv_45) ================== */
  {
    id: 'iv_31', difficulty: 'medium', categoryTag: 'HR & Płace',
    title: '31. Wszystkie działy z budżetem i liczbą pracowników (LEFT JOIN + COUNT)',
    tables: ['dept_budgets', 'emp_salaries'],
    gapId: 'g3', gapName: 'NULL w agregatach: COUNT(*) vs COUNT(kolumna) po LEFT JOIN',
    gapHint: "Dział Legal nie ma pracowników. Po LEFT JOIN ma 1 wiersz z NULL-ami po stronie emp_salaries. COUNT(*) zwróciłby 1 zamiast 0 — użyj COUNT(e.emp_id) oraz COALESCE(SUM(e.salary), 0).",
    hint: "Dział Legal nie ma pracowników. Po LEFT JOIN ma 1 wiersz z NULL-ami po stronie emp_salaries. COUNT(*) zwróciłby 1 zamiast 0 — użyj COUNT(e.emp_id) oraz COALESCE(SUM(e.salary), 0).",
    cols: ['dept_budgets', 'emp_salaries', 'LEFT JOIN', 'COUNT(e.emp_id)', 'COALESCE(SUM(e.salary), 0)'],
    prompt: "Wypisz WSZYSTKIE działy z `dept_budgets` (łącznie z działem `Legal`, który nie ma pracowników). Dla każdego działu zwróć `department`, `location`, `annual_budget`, liczbę pracowników `emp_cnt` oraz miesięczną sumę pensji `monthly_payroll` (gdy brak pracowników, zwróć `0`). Posortuj malejąco po `annual_budget`.",
    sol: "SELECT d.department, d.location, d.annual_budget, COUNT(e.emp_id) AS emp_cnt, COALESCE(SUM(e.salary), 0) AS monthly_payroll FROM dept_budgets d LEFT JOIN emp_salaries e ON e.department = d.department GROUP BY d.department, d.location, d.annual_budget ORDER BY d.annual_budget DESC;",
    order: true,
    detectTrap: function(sql) {
      var s = ivClean(sql);
      if (!/\bdept_budgets\b/i.test(s) || !/\bemp_salaries\b/i.test(s)) return null;
      if (!/\bLEFT\s+(?:OUTER\s+)?JOIN\b/i.test(s)) {
        return "PUŁAPKA INNER JOIN: Zwykły JOIN gubi dział Legal (0 pracowników). Użyj LEFT JOIN od tabeli dept_budgets.";
      }
      if (/\bCOUNT\s*\(\s*\*\s*\)/i.test(s)) {
        return "PUŁAPKA COUNT(*): Po LEFT JOIN pusty dział Legal ma 1 wiersz z NULL-ami, więc COUNT(*) daje 1 zamiast 0! Użyj COUNT(e.emp_id).";
      }
      return null;
    }
  },
  {
    id: 'iv_32', difficulty: 'medium', categoryTag: 'HR & Płace',
    title: '32. Pracownicy zarabiający powyżej średniej swojego działu (AVG OVER)',
    tables: ['emp_salaries'],
    gapId: 't5', gapName: 'Funkcja okna AVG() OVER (PARTITION BY ...) w CTE',
    gapHint: "Średnią działu policz w CTE przez ROUND(AVG(salary) OVER (PARTITION BY department), 2) AS dept_avg, a w zewnętrznym SELECT zostaw salary > dept_avg.",
    hint: "Średnią działu policz w CTE przez ROUND(AVG(salary) OVER (PARTITION BY department), 2) AS dept_avg, a w zewnętrznym SELECT zostaw salary > dept_avg.",
    cols: ['emp_salaries', 'WITH', 'AVG(salary) OVER (PARTITION BY department)', 'ROUND(', 'salary'],
    prompt: "Znajdź pracowników z emp_salaries, których pensja (salary) jest wyższa niż średnia pensja w ich własnym dziale (department). Zwróć full_name, department, salary oraz średnią działu zaokrągloną do 2 miejsc dept_avg. Posortuj po department rosnąco i salary malejąco.",
    sol: "WITH d AS (SELECT full_name, department, salary, ROUND(AVG(salary) OVER (PARTITION BY department), 2) AS dept_avg FROM emp_salaries) SELECT full_name, department, salary, dept_avg FROM d WHERE salary > dept_avg ORDER BY department ASC, salary DESC;",
    order: true,
    detectTrap: function(sql) {
      var s = ivClean(sql);
      if (!/\bemp_salaries\b/i.test(s)) return null;
      if (/\bAVG\s*\(\s*salary\s*\)\s*OVER\s*\(\s*\)/i.test(s)) {
        return "PUŁAPKA OKNA: AVG(salary) OVER () liczy średnią całej firmy, a nie działu. Dodaj PARTITION BY department.";
      }
      return null;
    }
  },
  {
    id: 'iv_33', difficulty: 'medium', categoryTag: 'HR & Płace',
    title: '33. Liczba podwładnych i średnia pensja zespołu każdego menedżera',
    tables: ['emp_salaries'],
    gapId: 'g13', gapName: 'Self-join i grupowanie po przełożonym',
    gapHint: "Połącz tabelę emp_salaries m (menedżer) z emp_salaries e (podwładny) po ON e.manager_id = m.emp_id.",
    hint: "Połącz tabelę emp_salaries m (menedżer) z emp_salaries e (podwładny) po ON e.manager_id = m.emp_id.",
    cols: ['emp_salaries', 'emp_id', 'manager_id', 'COUNT(*)', 'ROUND(AVG(', 'GROUP BY'],
    prompt: "Wyznacz wszystkich menedżerów w `emp_salaries` (osoby, które mają przynajmniej jednego bezpośredniego podwładnego). Zwróć `manager_id` (`emp_id` menedżera), `manager_name` (`full_name` menedżera), `department`, liczbę bezpośrednich podwładnych `reports_cnt` oraz średnią pensję podwładnych `team_avg_salary` (zaokrągloną do 2 miejsc). Posortuj malejąco po `reports_cnt`, a przy remisie rosnąco po `manager_id`.",
    sol: "SELECT m.emp_id AS manager_id, m.full_name AS manager_name, m.department, COUNT(e.emp_id) AS reports_cnt, ROUND(AVG(e.salary), 2) AS team_avg_salary FROM emp_salaries m JOIN emp_salaries e ON e.manager_id = m.emp_id GROUP BY m.emp_id, m.full_name, m.department ORDER BY reports_cnt DESC, manager_id ASC;",
    order: true,
    detectTrap: function(sql) {
      var s = ivClean(sql);
      if (!/\bemp_salaries\b/i.test(s)) return null;
      if (/AVG\s*\(\s*m\.salary\s*\)/i.test(s)) {
        return "PUŁAPKA ALIASU: Liczysz średnią pensję menedżera (m.salary) zamiast średniej pensji jego podwładnych (e.salary).";
      }
      return null;
    }
  },
  {
    id: 'iv_34', difficulty: 'medium', categoryTag: 'HR & Płace',
    title: '34. Najwcześniej zatrudniony pracownik w każdym dziale (ROW_NUMBER)',
    tables: ['emp_salaries'],
    gapId: 't5', gapName: 'Wybór pierwszego wiersza w grupie (ROW_NUMBER OVER PARTITION BY)',
    gapHint: "Użyj ROW_NUMBER() OVER (PARTITION BY department ORDER BY hire_date ASC, emp_id ASC) AS rn w CTE, a następnie WHERE rn = 1.",
    hint: "Użyj ROW_NUMBER() OVER (PARTITION BY department ORDER BY hire_date ASC, emp_id ASC) AS rn w CTE, a następnie WHERE rn = 1.",
    cols: ['emp_salaries', 'WITH', 'ROW_NUMBER() OVER (PARTITION BY department ORDER BY hire_date ASC)', 'hire_date'],
    prompt: "Dla każdego działu (`department`) w `emp_salaries` znajdź pracownika o najdłuższym stażu (najwcześniejsza data `hire_date`, a przy remisie mniejsze `emp_id`). Zwróć `department`, `full_name`, `hire_date` oraz `salary`. Posortuj alfabetycznie po `department`.",
    sol: "WITH r AS (SELECT department, full_name, hire_date, salary, ROW_NUMBER() OVER (PARTITION BY department ORDER BY hire_date ASC, emp_id ASC) AS rn FROM emp_salaries) SELECT department, full_name, hire_date, salary FROM r WHERE rn = 1 ORDER BY department ASC;",
    order: true,
    detectTrap: function(sql) {
      var s = ivClean(sql);
      if (!/\bemp_salaries\b/i.test(s)) return null;
      if (/ORDER\s+BY\s+hire_date\s+DESC/i.test(s)) {
        return "PUŁAPKA KIERUNKU SORTOWANIA: Najwcześniej zatrudniony pracownik ma NAJMNIEJSZĄ datę hire_date (ORDER BY hire_date ASC, a nie DESC).";
      }
      return null;
    }
  },
  {
    id: 'iv_35', difficulty: 'medium', categoryTag: 'Finanse & Płatności',
    title: '35. Porównanie kwot zatwierdzonych vs odrzuconych per kategoria (FILTER)',
    tables: ['app_transactions'],
    gapId: 'g3', gapName: 'Warunkowa suma z FILTER i zabezpieczenie COALESCE',
    gapHint: "SUM(amount) FILTER (WHERE tx_status = 'declined') zwraca NULL, jeśli w danej kategorii nie ma odrzuceń (np. Travel ma 1 odrzucenie, ale warto stosować COALESCE(..., 0)).",
    hint: "SUM(amount) FILTER (WHERE tx_status = 'declined') zwraca NULL, jeśli w danej kategorii nie ma odrzuceń (np. Travel ma 1 odrzucenie, ale warto stosować COALESCE(..., 0)).",
    cols: ['app_transactions', 'merchant_category', "SUM(amount) FILTER (WHERE tx_status = 'approved')", 'COALESCE('],
    prompt: "Dla każdej kategorii `merchant_category` w `app_transactions` policz w jednym wierszu: sumę kwot zatwierdzonych `approved_amount` oraz sumę kwot odrzuconych `declined_amount` (zabezpiecz przed `NULL` przez `COALESCE(..., 0)`). Posortuj malejąco po `approved_amount`.",
    sol: "SELECT merchant_category, COALESCE(SUM(amount) FILTER (WHERE tx_status = 'approved'), 0) AS approved_amount, COALESCE(SUM(amount) FILTER (WHERE tx_status = 'declined'), 0) AS declined_amount FROM app_transactions GROUP BY merchant_category ORDER BY approved_amount DESC;",
    order: true,
    detectTrap: function(sql) {
      var s = ivClean(sql);
      if (!/\bapp_transactions\b/i.test(s)) return null;
      if (/\bWHERE\s+tx_status\b/i.test(s) && !/\bFILTER\b/i.test(s) && !/\bCASE\b/i.test(s)) {
        return "PUŁAPKA GLOBALNEGO WHERE: Filtr tx_status w głównym WHERE wytnie jedną z grup, przez co druga kolumna będzie zawsze 0. Użyj FILTER (WHERE ...) lub CASE WHEN wewnątrz SUM().";
      }
      return null;
    }
  },
  {
    id: 'iv_36', difficulty: 'medium', categoryTag: 'Finanse & Płatności',
    title: '36. Pierwsza zatwierdzona transakcja każdego użytkownika (ROW_NUMBER)',
    tables: ['app_transactions'],
    gapId: 't5', gapName: 'Filtrowanie przed funkcją okna vs po funkcji okna',
    gapHint: "Najpierw odfiltruj tx_status = 'approved' wewnątrz CTE, gdzie liczysz ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY tx_timestamp ASC).",
    hint: "Najpierw odfiltruj tx_status = 'approved' wewnątrz CTE, gdzie liczysz ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY tx_timestamp ASC).",
    cols: ['app_transactions', 'WITH', 'ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY tx_timestamp ASC)', 'tx_status'],
    prompt: "Dla każdego użytkownika, który ma chociaż jedną zatwierdzoną transakcję w `app_transactions`, znajdź jego PIERWSZĄ zatwierdzoną transakcję (`tx_status = 'approved'`, najwcześniejszy `tx_timestamp`). Zwróć `user_id`, `tx_id`, `merchant_category`, `amount` oraz `tx_timestamp`. Posortuj rosnąco po `user_id`.",
    sol: "WITH f AS (SELECT user_id, tx_id, merchant_category, amount, tx_timestamp, ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY tx_timestamp ASC, tx_id ASC) AS rn FROM app_transactions WHERE tx_status = 'approved') SELECT user_id, tx_id, merchant_category, amount, tx_timestamp FROM f WHERE rn = 1 ORDER BY user_id ASC;",
    order: true,
    detectTrap: function(sql) {
      var s = ivClean(sql);
      if (!/\bapp_transactions\b/i.test(s)) return null;
      var parts = s.split(/\)\s*SELECT\b/i);
      if (parts.length > 1 && !/approved/i.test(parts[0]) && /approved/i.test(parts[1])) {
        return "PUŁAPKA KOLEJNOŚCI FILTROWANIA: Jeśli nadajesz rn = 1 przed odfiltrowaniem odrzuconych transakcji, użytkownik, którego pierwsza płatność była declined (np. user_id = 3 lub 6), zniknie z wyniku!";
      }
      return null;
    }
  },
  {
    id: 'iv_37', difficulty: 'medium', categoryTag: 'Produkt & SaaS',
    title: '37. ARPU wg planu subskrypcji (uwzględniając niepłacących użytkowników)',
    tables: ['saas_users', 'app_transactions'],
    gapId: 'g2', gapName: 'LEFT JOIN z warunkiem w ON oraz COUNT(DISTINCT) przy liczeniu ARPU',
    gapHint: "Użyj LEFT JOIN app_transactions t ON t.user_id = u.user_id AND t.tx_status = 'approved'. ARPU to COALESCE(SUM(t.amount), 0) / COUNT(DISTINCT u.user_id).",
    hint: "Użyj LEFT JOIN app_transactions t ON t.user_id = u.user_id AND t.tx_status = 'approved'. ARPU to COALESCE(SUM(t.amount), 0) / COUNT(DISTINCT u.user_id).",
    cols: ['saas_users', 'app_transactions', 'LEFT JOIN', 'COUNT(DISTINCT u.user_id)', 'COALESCE(SUM(t.amount), 0)', 'ROUND('],
    prompt: "Oblicz średni przychód na użytkownika (`ARPU`) dla każdego planu (`plan_type`) w `saas_users`. Uwzględnij WSZYSTKICH zarejestrowanych użytkowników planu (także tych z 0 transakcji!). Zwróć `plan_type`, liczbę użytkowników `users_cnt`, łączny zatwierdzony przychód `total_rev` oraz `arpu` = `ROUND(COALESCE(SUM(t.amount), 0) * 1.0 / COUNT(DISTINCT u.user_id), 2)`. Posortuj malejąco po `arpu`.",
    sol: "SELECT u.plan_type, COUNT(DISTINCT u.user_id) AS users_cnt, COALESCE(SUM(t.amount), 0) AS total_rev, ROUND(COALESCE(SUM(t.amount), 0) * 1.0 / COUNT(DISTINCT u.user_id), 2) AS arpu FROM saas_users u LEFT JOIN app_transactions t ON t.user_id = u.user_id AND t.tx_status = 'approved' GROUP BY u.plan_type ORDER BY arpu DESC;",
    order: true,
    detectTrap: function(sql) {
      var s = ivClean(sql);
      if (!/\bsaas_users\b/i.test(s) || !/\bapp_transactions\b/i.test(s)) return null;
      if (!/\bLEFT\s+(?:OUTER\s+)?JOIN\b/i.test(s)) {
        return "PUŁAPKA INNER JOIN: Zwykły JOIN odrzuca niepłacących użytkowników (np. większość planu free), sztucznie zawyżając ARPU. Użyj LEFT JOIN.";
      }
      if (/\bAVG\s*\(\s*(?:t\.)?amount\s*\)/i.test(s)) {
        return "PUŁAPKA AVG(amount): AVG(amount) liczy średnią wartość pojedynczej transakcji, a nie przychód na użytkownika (ARPU). Podziel sumę kwot przez COUNT(DISTINCT u.user_id).";
      }
      return null;
    }
  },
  {
    id: 'iv_38', difficulty: 'medium', categoryTag: 'Produkt & SaaS',
    title: '38. Nieaktywni użytkownicy bez żadnego zdarzenia w marcu (Anti-Join)',
    tables: ['saas_users', 'user_events'],
    gapId: 'g2', gapName: 'Wzorzec Anti-Join: LEFT JOIN ... WHERE prawa.id IS NULL',
    gapHint: "Dołącz user_events przez LEFT JOIN i zostaw wiersze, gdzie e.event_id IS NULL.",
    hint: "Dołącz user_events przez LEFT JOIN i zostaw wiersze, gdzie e.event_id IS NULL.",
    cols: ['saas_users', 'user_events', 'LEFT JOIN', 'IS NULL', 'user_id', 'signup_date', 'country', 'plan_type'],
    prompt: "Znajdź użytkowników z tabeli `saas_users`, którzy nie wygenerowali ŻADNEGO zdarzenia w tabeli `user_events`. Zwróć `user_id`, `signup_date`, `country` oraz `plan_type`. Posortuj rosnąco po `user_id`.",
    sol: "SELECT u.user_id, u.signup_date, u.country, u.plan_type FROM saas_users u LEFT JOIN user_events e ON e.user_id = u.user_id WHERE e.event_id IS NULL ORDER BY u.user_id ASC;",
    order: true,
    detectTrap: function(sql) {
      var s = ivClean(sql);
      if (!/\bsaas_users\b/i.test(s) || !/\buser_events\b/i.test(s)) return null;
      if (!/\bLEFT\b/i.test(s) && !/\bNOT\s+EXISTS\b/i.test(s) && !/\bNOT\s+IN\b/i.test(s)) {
        return "PUŁAPKA INNER JOIN: Aby znaleźć użytkowników BEZ zdarzeń, użyj LEFT JOIN ... WHERE e.event_id IS NULL (lub NOT EXISTS).";
      }
      return null;
    }
  },
  {
    id: 'iv_39', difficulty: 'medium', categoryTag: 'Produkt & SaaS',
    title: '39. Porzucone koszyki: dodali do koszyka, ale nie kupili (FILTER / HAVING)',
    tables: ['user_events'],
    gapId: 'g7', gapName: 'Agregacja warunkowa na poziomie użytkownika w HAVING',
    gapHint: "Pogrupuj po user_id i w HAVING sprawdź: COUNT(*) FILTER (WHERE event_type = 'add_to_cart') > 0 AND COUNT(*) FILTER (WHERE event_type = 'purchase') = 0.",
    hint: "Pogrupuj po user_id i w HAVING sprawdź: COUNT(*) FILTER (WHERE event_type = 'add_to_cart') > 0 AND COUNT(*) FILTER (WHERE event_type = 'purchase') = 0.",
    cols: ['user_events', 'user_id', "COUNT(*) FILTER (WHERE event_type = 'add_to_cart')", 'HAVING'],
    prompt: "W tabeli `user_events` znajdź użytkowników (`user_id`), którzy przynajmniej raz dodali produkt do koszyka (`event_type = 'add_to_cart'`), ale ani razu nie sfinalizowali zakupu (`event_type = 'purchase'`). Zwróć `user_id` oraz łączną liczbę wszystkich zdarzeń tego użytkownika w systemie jako `total_events`. Posortuj rosnąco po `user_id`.",
    sol: "SELECT user_id, COUNT(*) AS total_events FROM user_events GROUP BY user_id HAVING COUNT(*) FILTER (WHERE event_type = 'add_to_cart') > 0 AND COUNT(*) FILTER (WHERE event_type = 'purchase') = 0 ORDER BY user_id ASC;",
    order: true,
    detectTrap: function(sql) {
      var s = ivClean(sql);
      if (!/\buser_events\b/i.test(s)) return null;
      if (/WHERE\s+event_type\s*=\s*'add_to_cart'/i.test(s) && !/\bEXCEPT\b/i.test(s) && !/\bNOT\b/i.test(s)) {
        return "PUŁAPKA POJEDYNCZEGO WIERSZA: Filtr WHERE event_type = 'add_to_cart' sprawdza pojedynczy wiersz, więc nie wyklucza użytkowników, którzy w kolejnym wierszu mają 'purchase'!";
      }
      return null;
    }
  },
  {
    id: 'iv_40', difficulty: 'medium', categoryTag: 'Produkt & SaaS',
    title: '40. Odsetek zdarzeń mobilnych dla każdego kraju (JOIN + FILTER + 100.0)',
    tables: ['saas_users', 'user_events'],
    gapId: 'g10', gapName: 'Dzielenie całkowite (* 100.0) i warunkowe zliczanie',
    gapHint: "Połącz saas_users z user_events. Odsetek mobile to ROUND(COUNT(*) FILTER (WHERE e.device = 'mobile') * 100.0 / COUNT(*), 2).",
    hint: "Połącz saas_users z user_events. Odsetek mobile to ROUND(COUNT(*) FILTER (WHERE e.device = 'mobile') * 100.0 / COUNT(*), 2).",
    cols: ['saas_users', 'user_events', 'country', 'device', "FILTER (WHERE device = 'mobile')", '* 100.0', 'ROUND('],
    prompt: "Połącz `saas_users` z `user_events` po `user_id`. Dla każdego kraju (`country`) policz łączną liczbę zdarzeń `events_cnt`, liczbę zdarzeń na telefonie (`device = 'mobile'`) jako `mobile_events` oraz ich udział procentowy `mobile_pct` (zaokrąglony do 2 miejsc). Posortuj malejąco po `mobile_pct`, a przy remisie alfabetycznie po `country`.",
    sol: "SELECT u.country, COUNT(*) AS events_cnt, COUNT(*) FILTER (WHERE e.device = 'mobile') AS mobile_events, ROUND(COUNT(*) FILTER (WHERE e.device = 'mobile') * 100.0 / COUNT(*), 2) AS mobile_pct FROM saas_users u JOIN user_events e ON e.user_id = u.user_id GROUP BY u.country ORDER BY mobile_pct DESC, u.country ASC;",
    order: true,
    detectTrap: function(sql) {
      var s = ivClean(sql);
      if (!/\bsaas_users\b/i.test(s) || !/\buser_events\b/i.test(s)) return null;
      if (/\//.test(s) && s.indexOf('100.0') < 0 && !/numeric|decimal|float/i.test(s)) {
        return "PUŁAPKA DZIELENIA CAŁKOWITEGO: Pomnóż licznik przez 100.0 przed dzieleniem przez COUNT(*), inaczej ułamki zostaną obcięte do 0.";
      }
      return null;
    }
  },
  {
    id: 'iv_41', difficulty: 'medium', categoryTag: 'E-commerce',
    title: '41. Przychód brutto, kwota udzielonych rabatów i przychód netto (COALESCE)',
    tables: ['product_orders'],
    gapId: 'g8', gapName: 'Obsługa NULL w wyrażeniach arytmetycznych (COALESCE)',
    gapHint: "Gdy discount_pct jest NULL, rabat wynosi 0. Kwota rabatu to quantity * unit_price * COALESCE(discount_pct, 0) / 100.0.",
    hint: "Gdy discount_pct jest NULL, rabat wynosi 0. Kwota rabatu to quantity * unit_price * COALESCE(discount_pct, 0) / 100.0.",
    cols: ['product_orders', 'category', 'COALESCE(discount_pct, 0)', 'SUM(', 'ROUND(', 'GROUP BY'],
    prompt: "Dla każdej kategorii (`category`) w `product_orders` oblicz: przychód brutto `gross_rev` (`ROUND(SUM(quantity * unit_price), 2)`), łączną kwotę udzielonych rabatów `discount_val` (`ROUND(SUM(quantity * unit_price * COALESCE(discount_pct, 0) / 100.0), 2)`) oraz przychód netto po rabacie `net_rev`. Posortuj malejąco po `net_rev`.",
    sol: "SELECT category, ROUND(SUM(quantity * unit_price), 2) AS gross_rev, ROUND(SUM(quantity * unit_price * COALESCE(discount_pct, 0) / 100.0), 2) AS discount_val, ROUND(SUM(quantity * unit_price * (1 - COALESCE(discount_pct, 0) / 100.0)), 2) AS net_rev FROM product_orders GROUP BY category ORDER BY net_rev DESC;",
    order: true,
    detectTrap: function(sql) {
      var s = ivClean(sql);
      if (!/\bproduct_orders\b/i.test(s)) return null;
      if (/\bdiscount_pct\b/i.test(s) && !/\bCOALESCE\s*\(/i.test(s)) {
        return "PUŁAPKA NULL: Bez COALESCE(discount_pct, 0) zamówienia bez rabatu (NULL) wypadają z sumy przychodu netto!";
      }
      return null;
    }
  },
  {
    id: 'iv_42', difficulty: 'medium', categoryTag: 'E-commerce',
    title: '42. Udział przychodu z zamówień promocyjnych w każdej kategorii',
    tables: ['product_orders'],
    gapId: 'g10', gapName: 'Warunkowa suma FILTER i udział procentowy',
    gapHint: "Zamówienie promocyjne to takie, gdzie discount_pct > 0. Podziel przychód brutto z zamówień promocyjnych (* 100.0) przez całkowity przychód brutto kategorii.",
    hint: "Zamówienie promocyjne to takie, gdzie discount_pct > 0. Podziel przychód brutto z zamówień promocyjnych (* 100.0) przez całkowity przychód brutto kategorii.",
    cols: ['product_orders', 'category', 'SUM(quantity * unit_price) FILTER (WHERE discount_pct > 0)', '* 100.0', 'ROUND('],
    prompt: "Dla każdej kategorii (`category`) w `product_orders` policz całkowity przychód brutto `total_gross`, przychód brutto z zamówień objętych dodatnim rabatem (`discount_pct > 0`) jako `discounted_gross` oraz jego udział procentowy `discounted_share_pct` (zaokrąglony do 2 miejsc). Posortuj malejąco po `discounted_share_pct`.",
    sol: "SELECT category, SUM(quantity * unit_price) AS total_gross, SUM(quantity * unit_price) FILTER (WHERE discount_pct > 0) AS discounted_gross, ROUND(SUM(quantity * unit_price) FILTER (WHERE discount_pct > 0) * 100.0 / SUM(quantity * unit_price), 2) AS discounted_share_pct FROM product_orders GROUP BY category ORDER BY discounted_share_pct DESC;",
    order: true,
    detectTrap: function(sql) {
      var s = ivClean(sql);
      if (!/\bproduct_orders\b/i.test(s)) return null;
      if (/IS\s+NOT\s+NULL/i.test(s) && !/discount_pct\s*>\s*0/.test(s)) {
        return "PUŁAPKA RABATU 0%: W tabeli są wiersze z discount_pct = 0.00. Dodatni rabat sprawdzaj warunkiem discount_pct > 0.";
      }
      return null;
    }
  },
  {
    id: 'iv_43', difficulty: 'medium', categoryTag: 'E-commerce',
    title: '43. Porównanie sprzedaży I kwartału (Q1) i II kwartału (Q2) wg kategorii',
    tables: ['product_orders'],
    gapId: 'g4', gapName: 'Pivotowanie okresów czasowych za pomocą FILTER',
    gapHint: "Q1 to order_date < '2026-04-01', a Q2 to order_date >= '2026-04-01'. Użyj SUM(quantity * unit_price) FILTER (WHERE ...).",
    hint: "Q1 to order_date < '2026-04-01', a Q2 to order_date >= '2026-04-01'. Użyj SUM(quantity * unit_price) FILTER (WHERE ...).",
    cols: ['product_orders', 'category', 'order_date', 'SUM(quantity * unit_price) FILTER (WHERE', 'GROUP BY'],
    prompt: "W tabeli `product_orders` porównaj przychód brutto (`quantity * unit_price`) pomiędzy I kwartałem 2026 (`order_date < '2026-04-01'`) a II kwartałem 2026 (`order_date >= '2026-04-01'`) dla każdej kategorii (`category`). Zwróć `category`, `q1_gross`, `q2_gross` oraz różnicę `q2_diff` (`q2_gross - q1_gross`). Posortuj malejąco po `q2_diff`.",
    sol: "SELECT category, SUM(quantity * unit_price) FILTER (WHERE order_date < '2026-04-01') AS q1_gross, SUM(quantity * unit_price) FILTER (WHERE order_date >= '2026-04-01') AS q2_gross, SUM(quantity * unit_price) FILTER (WHERE order_date >= '2026-04-01') - SUM(quantity * unit_price) FILTER (WHERE order_date < '2026-04-01') AS q2_diff FROM product_orders GROUP BY category ORDER BY q2_diff DESC;",
    order: true,
    detectTrap: function(sql) {
      var s = ivClean(sql);
      if (!/\bproduct_orders\b/i.test(s)) return null;
      if (!/\bFILTER\b/i.test(s) && !/\bCASE\b/i.test(s)) {
        return "PUŁAPKA PIVOTU: Aby wyświetlić Q1 i Q2 w osobnych kolumnach tego samego wiersza, użyj SUM(...) FILTER (WHERE ...) lub SUM(CASE WHEN ...).";
      }
      return null;
    }
  },
  {
    id: 'iv_44', difficulty: 'medium', categoryTag: 'E-commerce',
    title: '44. Największe pojedyncze zamówienie dla każdego produktu (ROW_NUMBER)',
    tables: ['product_orders'],
    gapId: 't5', gapName: 'Wybór rekordu maksymalnego z detalami wiersza (ROW_NUMBER)',
    gapHint: "Samo MAX(quantity * unit_price) nie pozwoli łatwo wyciągnąć order_id i order_date tego zamówienia. Użyj ROW_NUMBER() OVER (PARTITION BY product_id ORDER BY quantity * unit_price DESC, order_id ASC).",
    hint: "Samo MAX(quantity * unit_price) nie pozwoli łatwo wyciągnąć order_id i order_date tego zamówienia. Użyj ROW_NUMBER() OVER (PARTITION BY product_id ORDER BY quantity * unit_price DESC, order_id ASC).",
    cols: ['product_orders', 'WITH', 'ROW_NUMBER() OVER (PARTITION BY product_id ORDER BY', 'product_id', 'order_id'],
    prompt: "Dla każdego produktu (`product_id`) w `product_orders` wskaż jedno zamówienie o najwyższej wartości brutto (`quantity * unit_price AS gross_val`, a przy remisie wybierz mniejsze `order_id`). Zwróć `product_id`, `category`, `order_id`, `order_date` oraz `gross_val`. Posortuj rosnąco po `product_id`.",
    sol: "WITH r AS (SELECT product_id, category, order_id, order_date, quantity * unit_price AS gross_val, ROW_NUMBER() OVER (PARTITION BY product_id ORDER BY quantity * unit_price DESC, order_id ASC) AS rn FROM product_orders) SELECT product_id, category, order_id, order_date, gross_val FROM r WHERE rn = 1 ORDER BY product_id ASC;",
    order: true,
    detectTrap: function(sql) {
      var s = ivClean(sql);
      if (!/\bproduct_orders\b/i.test(s)) return null;
      if (/GROUP\s+BY\s+product_id\s*,\s*category\s*,\s*order_id/i.test(s)) {
        return "PUŁAPKA GROUP BY: Grupowanie po order_id tworzy osobną grupę dla każdego zamówienia. Użyj ROW_NUMBER() OVER (PARTITION BY product_id ...).";
      }
      return null;
    }
  },
  {
    id: 'iv_45', difficulty: 'medium', categoryTag: 'Finanse & Płatności',
    title: '45. Użytkownicy kupujący w co najmniej 2 różnych kategoriach sprzedawców',
    tables: ['saas_users', 'app_transactions'],
    gapId: 'g1', gapName: 'COUNT(DISTINCT kolumna) w klauzuli HAVING',
    gapHint: "Zliczaj unikalne kategorie przez COUNT(DISTINCT t.merchant_category) tylko dla zatwierdzonych transakcji (t.tx_status = 'approved').",
    hint: "Zliczaj unikalne kategorie przez COUNT(DISTINCT t.merchant_category) tylko dla zatwierdzonych transakcji (t.tx_status = 'approved').",
    cols: ['saas_users', 'app_transactions', 'COUNT(DISTINCT t.merchant_category)', 'HAVING', 'tx_status'],
    prompt: "Połącz `saas_users` z `app_transactions`. Znajdź użytkowników, którzy mają zatwierdzone transakcje (`tx_status = 'approved'`) w co najmniej `2` RÓŻNYCH kategoriach sprzedawców (`merchant_category`). Zwróć `user_id`, `country`, `plan_type`, liczbę unikalnych kategorii `categories_cnt` oraz łączną kwotę zatwierdzonych transakcji `total_spent`. Posortuj malejąco po `total_spent`, a przy remisie rosnąco po `user_id`.",
    sol: "SELECT u.user_id, u.country, u.plan_type, COUNT(DISTINCT t.merchant_category) AS categories_cnt, SUM(t.amount) AS total_spent FROM saas_users u JOIN app_transactions t ON t.user_id = u.user_id WHERE t.tx_status = 'approved' GROUP BY u.user_id, u.country, u.plan_type HAVING COUNT(DISTINCT t.merchant_category) >= 2 ORDER BY total_spent DESC, u.user_id ASC;",
    order: true,
    detectTrap: function(sql) {
      var s = ivClean(sql);
      if (!/\bsaas_users\b/i.test(s) || !/\bapp_transactions\b/i.test(s)) return null;
      if (!/\bDISTINCT\b/i.test(s)) {
        return "PUŁAPKA ZIARNA: Zwykły COUNT(merchant_category) liczy transakcje zamiast unikalnych kategorii (np. 3 zakupy użytkownika 5 w Food to wciąż 1 kategoria). Użyj COUNT(DISTINCT t.merchant_category).";
      }
      return null;
    }
  },

  /* =================== DODATKOWE HARD (iv_46 – iv_60) =================== */
  {
    id: 'iv_46', difficulty: 'hard', categoryTag: 'HR & Płace',
    title: '46. Udział pensji pracownika w funduszu płac działu i kumulacja (Window)',
    tables: ['emp_salaries'],
    gapId: 'g14', gapName: 'SUM() OVER (PARTITION BY) vs SUM() OVER (PARTITION BY ... ORDER BY)',
    gapHint: "SUM(salary) OVER (PARTITION BY department) daje sumę całego działu, a dodanie ORDER BY salary DESC, emp_id ASC tworzy sumę narastającą wewnątrz działu.",
    hint: "SUM(salary) OVER (PARTITION BY department) daje sumę całego działu, a dodanie ORDER BY salary DESC, emp_id ASC tworzy sumę narastającą wewnątrz działu.",
    cols: ['emp_salaries', 'SUM(salary) OVER (PARTITION BY department)', 'ORDER BY', 'ROUND('],
    prompt: "Dla każdego pracownika z działów `'Engineering'` oraz `'Finance'` w `emp_salaries` wylicz: `department`, `full_name`, `salary`, udział procentowy jego pensji w miesięcznym funduszu płac działu `dept_share_pct` (`ROUND(salary * 100.0 / SUM(salary) OVER (PARTITION BY department), 2)`) oraz narastającą sumę pensji w dziale `running_dept_payroll` (liczoną w kolejności `salary DESC, emp_id ASC`). Posortuj po `department ASC, salary DESC, emp_id ASC`.",
    sol: "SELECT department, full_name, salary, ROUND(salary * 100.0 / SUM(salary) OVER (PARTITION BY department), 2) AS dept_share_pct, SUM(salary) OVER (PARTITION BY department ORDER BY salary DESC, emp_id ASC ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running_dept_payroll FROM emp_salaries WHERE department IN ('Engineering', 'Finance') ORDER BY department ASC, salary DESC, emp_id ASC;",
    order: true,
    detectTrap: function(sql) {
      var s = ivClean(sql);
      if (!/\bemp_salaries\b/i.test(s)) return null;
      if (/\bSUM\s*\(\s*salary\s*\)\s*OVER\s*\(\s*\)/i.test(s)) {
        return "PUŁAPKA OKNA: Puste OVER () sumuje pensje całej firmy. Użyj PARTITION BY department.";
      }
      return null;
    }
  },
  {
    id: 'iv_47', difficulty: 'hard', categoryTag: 'HR & Płace',
    title: '47. Odchylenie pensji od drugiego najlepiej opłacanego stanowiska w dziale',
    tables: ['emp_salaries'],
    gapId: 't5', gapName: 'Łączenie DENSE_RANK z analitycznym porównaniem w CTE',
    gapHint: "W pierwszym CTE wyznacz DENSE_RANK() po pensji malejąco w dziale, wyciągnij unikalną wartość dla rnk = 2 i porównaj pensje pracowników.",
    hint: "W pierwszym CTE wyznacz DENSE_RANK() po pensji malejąco w dziale, wyciągnij unikalną wartość dla rnk = 2 i porównaj pensje pracowników.",
    cols: ['emp_salaries', 'WITH', 'DENSE_RANK() OVER (PARTITION BY department ORDER BY salary DESC)', 'MAX('],
    prompt: "Dla każdego działu w `emp_salaries` wyznacz wartość DRUGIEJ najwyższej unikalnej pensji (`second_highest_sal` za pomocą `DENSE_RANK() = 2`). Następnie dla każdego lidera płacowego działu (`DENSE_RANK() = 1`) zwróć `department`, `full_name`, `salary`, `second_highest_sal` oraz różnicę `lead_gap` (`salary - second_highest_sal`). Posortuj malejąco po `lead_gap`.",
    sol: "WITH r AS (SELECT department, full_name, salary, DENSE_RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS dr FROM emp_salaries), s AS (SELECT department, MAX(salary) FILTER (WHERE dr = 2) AS second_highest_sal FROM r GROUP BY department) SELECT r.department, r.full_name, r.salary, s.second_highest_sal, r.salary - s.second_highest_sal AS lead_gap FROM r JOIN s ON s.department = r.department WHERE r.dr = 1 ORDER BY lead_gap DESC;",
    order: true,
    detectTrap: function(sql) {
      var s = ivClean(sql);
      if (!/\bemp_salaries\b/i.test(s)) return null;
      if (/\bROW_NUMBER\s*\(/i.test(s) && !/\bDENSE_RANK\s*\(/i.test(s)) {
        return "PUŁAPKA REMISÓW: Użyj DENSE_RANK(), aby spójnie wyznaczyć poziomy płacowe niezależnie od remisów.";
      }
      return null;
    }
  },
  {
    id: 'iv_48', difficulty: 'hard', categoryTag: 'HR & Płace',
    title: '48. Wskaźnik wykorzystania budżetu i rezerwa po kosztach rocznych (CTE)',
    tables: ['dept_budgets', 'emp_salaries'],
    gapId: 'g1', gapName: 'Wieloetapowe CTE z LEFT JOIN i przeliczeniem rocznym',
    gapHint: "Najpierw policz roczny koszt płac (COALESCE(SUM(salary), 0) * 12) dla każdego działu z LEFT JOIN, a następnie oblicz procent wykorzystania budżetu.",
    hint: "Najpierw policz roczny koszt płac (COALESCE(SUM(salary), 0) * 12) dla każdego działu z LEFT JOIN, a następnie oblicz procent wykorzystania budżetu.",
    cols: ['dept_budgets', 'emp_salaries', 'WITH', 'LEFT JOIN', 'COALESCE(SUM(salary) * 12, 0)', 'ROUND(', 'CASE WHEN'],
    prompt: "Dla wszystkich 6 działów z `dept_budgets` oblicz w CTE roczny koszt pensji `annual_payroll` (`COALESCE(SUM(e.salary) * 12, 0)`). Następnie zwróć `department`, `annual_budget`, `annual_payroll`, procent wykorzystania budżetu `utilization_pct` (`ROUND(annual_payroll * 100.0 / annual_budget, 2)`) oraz status `budget_status`: `'Krytyczny'` (gdy `>= 60%`), `'Bezpieczny'` (gdy `> 0%` i `< 60%`) lub `'Brak etatu'` (gdy `0%`). Posortuj malejąco po `utilization_pct`.",
    sol: "WITH p AS (SELECT d.department, d.annual_budget, COALESCE(SUM(e.salary) * 12, 0) AS annual_payroll FROM dept_budgets d LEFT JOIN emp_salaries e ON e.department = d.department GROUP BY d.department, d.annual_budget) SELECT department, annual_budget, annual_payroll, ROUND(annual_payroll * 100.0 / annual_budget, 2) AS utilization_pct, CASE WHEN annual_payroll = 0 THEN 'Brak etatu' WHEN annual_payroll * 100.0 / annual_budget >= 60 THEN 'Krytyczny' ELSE 'Bezpieczny' END AS budget_status FROM p ORDER BY utilization_pct DESC;",
    order: true,
    detectTrap: function(sql) {
      var s = ivClean(sql);
      if (!/\bdept_budgets\b/i.test(s) || !/\bemp_salaries\b/i.test(s)) return null;
      if (!/\bLEFT\s+(?:OUTER\s+)?JOIN\b/i.test(s)) {
        return "PUŁAPKA BRAKU LEFT JOIN: Dział Legal nie ma pracowników, ale musi pojawić się w raporcie ze statusem 'Brak etatu'.";
      }
      return null;
    }
  },
  {
    id: 'iv_49', difficulty: 'hard', categoryTag: 'HR & Płace',
    title: '49. Hierarchia 3 poziomów: Pracownik -> Menedżer -> Dyrektor (2x LEFT JOIN)',
    tables: ['emp_salaries'],
    gapId: 'g13', gapName: 'Wielopoziomowy self-join z zachowaniem szefów (LEFT JOIN)',
    gapHint: "Dołącz emp_salaries m ON e.manager_id = m.emp_id oraz emp_salaries d ON m.manager_id = d.emp_id za pomocą LEFT JOIN.",
    hint: "Dołącz emp_salaries m ON e.manager_id = m.emp_id oraz emp_salaries d ON m.manager_id = d.emp_id za pomocą LEFT JOIN.",
    cols: ['emp_salaries', 'LEFT JOIN', 'COALESCE(', 'manager_id', 'emp_id'],
    prompt: "Dla pracowników działu `'Engineering'` w `emp_salaries` zbuduj pełną ścieżkę raportowania: zwróć `emp_id`, `employee` (`e.full_name`), bezpośredniego przełożonego `direct_manager` (`COALESCE(m.full_name, 'Brak')`) oraz przełożonego wyższego szczebla `top_director` (`COALESCE(d.full_name, 'Brak')`). Posortuj rosnąco po `emp_id`.",
    sol: "SELECT e.emp_id, e.full_name AS employee, COALESCE(m.full_name, 'Brak') AS direct_manager, COALESCE(d.full_name, 'Brak') AS top_director FROM emp_salaries e LEFT JOIN emp_salaries m ON m.emp_id = e.manager_id LEFT JOIN emp_salaries d ON d.emp_id = m.manager_id WHERE e.department = 'Engineering' ORDER BY e.emp_id ASC;",
    order: true,
    detectTrap: function(sql) {
      var s = ivClean(sql);
      if (!/\bemp_salaries\b/i.test(s)) return null;
      if (/\bINNER\s+JOIN\b/i.test(s) || (/\bJOIN\b/i.test(s) && !/\bLEFT\b/i.test(s))) {
        return "PUŁAPKA INNER JOIN W HIERARCHII: Zwykły JOIN wycina szefa działu (Anna Kowalska nie ma menedżera) oraz Senior Developerów (ich menedżer nie ma już przełożonego). Użyj dwóch LEFT JOIN.";
      }
      return null;
    }
  },
  {
    id: 'iv_50', difficulty: 'hard', categoryTag: 'Finanse & Płatności',
    title: '50. Narastająca wartość zatwierdzonych transakcji użytkownika (Running Total)',
    tables: ['app_transactions'],
    gapId: 'g14', gapName: 'Suma krocząca per użytkownik (SUM OVER PARTITION BY ORDER BY)',
    gapHint: "Policz SUM(amount) OVER (PARTITION BY user_id ORDER BY tx_timestamp ASC, tx_id ASC) tylko dla zatwierdzonych transakcji.",
    hint: "Policz SUM(amount) OVER (PARTITION BY user_id ORDER BY tx_timestamp ASC, tx_id ASC) tylko dla zatwierdzonych transakcji.",
    cols: ['app_transactions', 'SUM(amount) OVER (PARTITION BY user_id ORDER BY tx_timestamp ASC, tx_id ASC)', 'tx_status'],
    prompt: "Dla zatwierdzonych transakcji (`tx_status = 'approved'`) użytkowników `user_id IN (1, 2, 4)` w `app_transactions` oblicz narastającą sumę wydatków danego użytkownika `running_user_spend` oraz numer kolejny jego zatwierdzonej transakcji `tx_seq` (w kolejności `tx_timestamp ASC, tx_id ASC`). Zwróć `user_id`, `tx_id`, `tx_seq`, `amount` oraz `running_user_spend`. Posortuj po `user_id ASC, tx_seq ASC`.",
    sol: "SELECT user_id, tx_id, ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY tx_timestamp ASC, tx_id ASC) AS tx_seq, amount, SUM(amount) OVER (PARTITION BY user_id ORDER BY tx_timestamp ASC, tx_id ASC ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running_user_spend FROM app_transactions WHERE tx_status = 'approved' AND user_id IN (1, 2, 4) ORDER BY user_id ASC, tx_seq ASC;",
    order: true,
    detectTrap: function(sql) {
      var s = ivClean(sql);
      if (!/\bapp_transactions\b/i.test(s)) return null;
      if (/\bSUM\s*\(\s*amount\s*\)\s*OVER\s*\(\s*PARTITION\s+BY\s+user_id\s*\)/i.test(s)) {
        return "PUŁAPKA BRAKU ORDER BY W OVER: Bez ORDER BY tx_timestamp wewnątrz OVER (...) dostaniesz od razu pełną sumę wydatków użytkownika zamiast sumy narastającej.";
      }
      return null;
    }
  },
  {
    id: 'iv_51', difficulty: 'hard', categoryTag: 'Finanse & Płatności',
    title: '51. Zmiana średniego koszyka użytkownika: 1. vs 2. transakcja (ROW_NUMBER + LAG)',
    tables: ['app_transactions'],
    gapId: 'g5', gapName: 'Porównanie pierwszej i drugiej transakcji klienta',
    gapHint: "Ponumeruj zatwierdzone transakcje każdego użytkownika przez ROW_NUMBER(), a następnie dla użytkowników mających co najmniej 2 transakcje wyciągnij kwotę 1. i 2. płatności.",
    hint: "Ponumeruj zatwierdzone transakcje każdego użytkownika przez ROW_NUMBER(), a następnie dla użytkowników mających co najmniej 2 transakcje wyciągnij kwotę 1. i 2. płatności.",
    cols: ['app_transactions', 'WITH', 'ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY tx_timestamp ASC, tx_id ASC)', 'FILTER'],
    prompt: "W `app_transactions` ponumeruj zatwierdzone transakcje (`tx_status = 'approved'`) każdego użytkownika chronologicznie (`tx_timestamp ASC, tx_id ASC`). Dla użytkowników, którzy mają co najmniej 2 takie transakcje, zwróć `user_id`, kwotę pierwszej transakcji `first_amount`, kwotę drugiej transakcji `second_amount` oraz różnicę `diff_amount` (`second_amount - first_amount`). Posortuj rosnąco po `user_id`.",
    sol: "WITH seq AS (SELECT user_id, amount, ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY tx_timestamp ASC, tx_id ASC) AS rn FROM app_transactions WHERE tx_status = 'approved') SELECT user_id, MAX(amount) FILTER (WHERE rn = 1) AS first_amount, MAX(amount) FILTER (WHERE rn = 2) AS second_amount, MAX(amount) FILTER (WHERE rn = 2) - MAX(amount) FILTER (WHERE rn = 1) AS diff_amount FROM seq WHERE rn <= 2 GROUP BY user_id HAVING COUNT(*) = 2 ORDER BY user_id ASC;",
    order: true,
    detectTrap: function(sql) {
      var s = ivClean(sql);
      if (!/\bapp_transactions\b/i.test(s)) return null;
      if (!/approved/i.test(s)) {
        return "PUŁAPKA STATUSU: Pamiętaj o odfiltrowaniu tylko zatwierdzonych transakcji (tx_status = 'approved') przed ich ponumerowaniem.";
      }
      return null;
    }
  },
  {
    id: 'iv_52', difficulty: 'hard', categoryTag: 'Finanse & Płatności',
    title: '52. Użytkownicy, których odrzucona transakcja została później opłacona (Self-Join / EXISTS)',
    tables: ['app_transactions'],
    gapId: 'g13', gapName: 'Korelacja czasowa zdarzeń tego samego użytkownika',
    gapHint: "Połącz wiersz odrzucony d (tx_status = 'declined') z wierszem zatwierdzonym a (tx_status = 'approved') dla tego samego user_id, merchant_category i amount, gdzie a.tx_timestamp > d.tx_timestamp.",
    hint: "Połącz wiersz odrzucony d (tx_status = 'declined') z wierszem zatwierdzonym a (tx_status = 'approved') dla tego samego user_id, merchant_category i amount, gdzie a.tx_timestamp > d.tx_timestamp.",
    cols: ['app_transactions', 'user_id', 'merchant_category', 'amount', 'tx_timestamp', 'JOIN'],
    prompt: "Znajdź przypadki w `app_transactions`, gdzie użytkownik miał odrzuconą transakcję (`tx_status = 'declined'`), ale w późniejszym terminie (`tx_timestamp > declined_time`) skutecznie opłacił (`tx_status = 'approved'`) dokładnie tę samą kwotę (`amount`) w tej samej kategorii (`merchant_category`). Zwróć `user_id`, `merchant_category`, `amount`, `declined_tx_id` (`d.tx_id`) oraz `approved_tx_id` (`a.tx_id`). Posortuj po `user_id ASC`, a przy remisie po `approved_tx_id ASC`.",
    sol: "SELECT d.user_id, d.merchant_category, d.amount, d.tx_id AS declined_tx_id, a.tx_id AS approved_tx_id FROM app_transactions d JOIN app_transactions a ON a.user_id = d.user_id AND a.merchant_category = d.merchant_category AND a.amount = d.amount WHERE d.tx_status = 'declined' AND a.tx_status = 'approved' AND a.tx_timestamp > d.tx_timestamp ORDER BY d.user_id ASC, approved_tx_id ASC;",
    order: true,
    detectTrap: function(sql) {
      var s = ivClean(sql);
      if (!/\bapp_transactions\b/i.test(s)) return null;
      if (!/tx_timestamp\s*[<>]/i.test(s)) {
        return "PUŁAPKA CHRONOLOGII: Musisz sprawdzić, że zatwierdzona płatność nastąpiła PO odrzuconej (a.tx_timestamp > d.tx_timestamp). Inaczej złapiesz np. user_id = 1, któremu płatność odrzucono w marcu po styczniowym zakupie!";
      }
      return null;
    }
  },
  {
    id: 'iv_53', difficulty: 'hard', categoryTag: 'Finanse & Płatności',
    title: '53. Udział Top 3 klientów w przychodzie całej platformy (Pareto / CTE)',
    tables: ['app_transactions'],
    gapId: 'g14', gapName: 'Agregacja dwupoziomowa w CTE (udział Top N w całości)',
    gapHint: "Policz wydatki każdego klienta w pierwszym CTE, ponumeruj miejsca przez ROW_NUMBER() i policz udział sumy Top 3 w sumie wszystkich zatwierdzonych transakcji.",
    hint: "Policz wydatki każdego klienta w pierwszym CTE, ponumeruj miejsca przez ROW_NUMBER() i policz udział sumy Top 3 w sumie wszystkich zatwierdzonych transakcji.",
    cols: ['app_transactions', 'WITH', 'ROW_NUMBER() OVER (ORDER BY user_spend DESC)', 'SUM(', 'ROUND('],
    prompt: "Oblicz w `app_transactions` wydatki każdego użytkownika na zatwierdzonych transakcjach (`tx_status = 'approved'`). Wyznacz 3 najbardziej dochodowych użytkowników i zwróć dla każdego z nich: `rn` (miejsce 1..3), `user_id`, `user_spend`, łączny przychód całej platformy ze wszystkich użytkowników `platform_total` oraz procentowy udział tego użytkownika w przychodzie platformy `platform_share_pct` (zaokrąglony do 2 miejsc). Posortuj po `rn ASC`.",
    sol: "WITH u AS (SELECT user_id, SUM(amount) AS user_spend FROM app_transactions WHERE tx_status = 'approved' GROUP BY user_id), r AS (SELECT ROW_NUMBER() OVER (ORDER BY user_spend DESC, user_id ASC) AS rn, user_id, user_spend, SUM(user_spend) OVER () AS platform_total FROM u) SELECT rn, user_id, user_spend, platform_total, ROUND(user_spend * 100.0 / platform_total, 2) AS platform_share_pct FROM r WHERE rn <= 3 ORDER BY rn ASC;",
    order: true,
    detectTrap: function(sql) {
      var s = ivClean(sql);
      if (!/\bapp_transactions\b/i.test(s)) return null;
      if (/LIMIT\s+3/i.test(s) && !/\bWITH\b/i.test(s) && /OVER\s*\(\s*\)/i.test(s)) {
        return "UWAGA: Upewnij się, że platform_total liczy przychód ze wszystkich użytkowników, a zwrócone są tylko 3 wiersze z kolumną rn (1..3).";
      }
      return null;
    }
  },
  {
    id: 'iv_54', difficulty: 'hard', categoryTag: 'Produkt & SaaS',
    title: '54. Pełny lejek konwersji użytkowników (Login -> View -> Cart -> Purchase)',
    tables: ['user_events'],
    gapId: 'g1', gapName: 'Budowa lejka konwersji na unikalnych użytkownikach (COUNT DISTINCT + FILTER)',
    gapHint: "Dla każdego kroku lejka licz unikalnych użytkowników przez COUNT(DISTINCT user_id) FILTER (WHERE event_type = '...').",
    hint: "Dla każdego kroku lejka licz unikalnych użytkowników przez COUNT(DISTINCT user_id) FILTER (WHERE event_type = '...').",
    cols: ['user_events', 'device', 'COUNT(DISTINCT user_id) FILTER (WHERE', '* 100.0', 'ROUND('],
    prompt: "Zbuduj lejek konwersji w podziale na typ urządzenia (`device`) na podstawie `user_events`. Dla każdego `device` zwróć liczbę unikalnych użytkowników na etapach: `logins` (`'login'`), `views` (`'view_item'`), `carts` (`'add_to_cart'`), `purchases` (`'purchase'`) oraz wskaźnik konwersji od logowania do zakupu `login_to_purchase_pct` = `ROUND(purchases * 100.0 / logins, 2)`. Posortuj malejąco po `login_to_purchase_pct`.",
    sol: "SELECT device, COUNT(DISTINCT user_id) FILTER (WHERE event_type = 'login') AS logins, COUNT(DISTINCT user_id) FILTER (WHERE event_type = 'view_item') AS views, COUNT(DISTINCT user_id) FILTER (WHERE event_type = 'add_to_cart') AS carts, COUNT(DISTINCT user_id) FILTER (WHERE event_type = 'purchase') AS purchases, ROUND(COUNT(DISTINCT user_id) FILTER (WHERE event_type = 'purchase') * 100.0 / COUNT(DISTINCT user_id) FILTER (WHERE event_type = 'login'), 2) AS login_to_purchase_pct FROM user_events GROUP BY device ORDER BY login_to_purchase_pct DESC;",
    order: true,
    detectTrap: function(sql) {
      var s = ivClean(sql);
      if (!/\buser_events\b/i.test(s)) return null;
      if (!/\bDISTINCT\b/i.test(s)) {
        return "PUŁAPKA ZIARNA LEJKA: Lejek konwersji użytkowników musi liczyć COUNT(DISTINCT user_id), ponieważ jeden użytkownik może logować się wielokrotnie!";
      }
      return null;
    }
  },
  {
    id: 'iv_55', difficulty: 'hard', categoryTag: 'Produkt & SaaS',
    title: '55. Czas od logowania do zakupu w ramach tego samego dnia (Self-Join + EPOCH)',
    tables: ['user_events'],
    gapId: 'g4', gapName: 'Różnica znaczników czasu w minutach (EXTRACT EPOCH)',
    gapHint: "Połącz zdarzenie login i purchase tego samego użytkownika z tego samego dnia (event_time::date) i policz EXTRACT(EPOCH FROM (p.event_time - l.event_time)) / 60.0.",
    hint: "Połącz zdarzenie login i purchase tego samego użytkownika z tego samego dnia (event_time::date) i policz EXTRACT(EPOCH FROM (p.event_time - l.event_time)) / 60.0.",
    cols: ['user_events', 'user_id', 'event_time', 'EXTRACT(EPOCH FROM', 'ROUND('],
    prompt: "Dla użytkowników, którzy dokonali zakupu (`event_type = 'purchase'`) w `user_events`, oblicz ile minut minęło od ich logowania (`event_type = 'login'`) tego samego dnia (`l.event_time::date = p.event_time::date`) do momentu zakupu. Zwróć `user_id`, `device`, `login_time` (`l.event_time`), `purchase_time` (`p.event_time`) oraz `minutes_to_buy` (`ROUND(EXTRACT(EPOCH FROM (p.event_time - l.event_time)) / 60.0, 0)`). Posortuj rosnąco po `minutes_to_buy`, a przy remisie po `user_id`.",
    sol: "SELECT p.user_id, p.device, l.event_time AS login_time, p.event_time AS purchase_time, ROUND(EXTRACT(EPOCH FROM (p.event_time - l.event_time)) / 60.0, 0) AS minutes_to_buy FROM user_events l JOIN user_events p ON p.user_id = l.user_id AND p.event_time::date = l.event_time::date WHERE l.event_type = 'login' AND p.event_type = 'purchase' AND p.event_time >= l.event_time ORDER BY minutes_to_buy ASC, p.user_id ASC;",
    order: true,
    detectTrap: function(sql) {
      var s = ivClean(sql);
      if (!/\buser_events\b/i.test(s)) return null;
      if (!/::date|DATE_TRUNC|DATE\s*\(/i.test(s) && !/INTERVAL/i.test(s)) {
        return "PUŁAPKA SESJI: Użytkownik 1 logował się zarówno 1 marca, jak i 9 marca. Dopasuj logowanie z tego samego dnia co zakup (p.event_time::date = l.event_time::date).";
      }
      return null;
    }
  },
  {
    id: 'iv_56', difficulty: 'hard', categoryTag: 'Produkt & SaaS',
    title: '56. Użytkownicy powracający (logowanie w co najmniej 2 różnych dniach)',
    tables: ['saas_users', 'user_events'],
    gapId: 'g1', gapName: 'Zliczanie unikalnych dni aktywności: COUNT(DISTINCT event_time::date)',
    gapHint: "Policz unikalne daty dzienne logowania: COUNT(DISTINCT e.event_time::date).",
    hint: "Policz unikalne daty dzienne logowania: COUNT(DISTINCT e.event_time::date).",
    cols: ['saas_users', 'user_events', 'COUNT(DISTINCT e.event_time::date)', 'MIN(', 'MAX(', 'HAVING'],
    prompt: "Znajdź użytkowników z `saas_users`, którzy zalogowali się (`event_type = 'login'` w `user_events`) w co najmniej `2` różnych dniach kalendarzowych (`e.event_time::date`). Zwróć `user_id`, `country`, `plan_type`, liczbę dni z logowaniem `login_days` oraz odstęp dni między pierwszym a ostatnim logowaniem `span_days` (`MAX(e.event_time::date) - MIN(e.event_time::date)`). Posortuj rosnąco po `user_id`.",
    sol: "SELECT u.user_id, u.country, u.plan_type, COUNT(DISTINCT e.event_time::date) AS login_days, MAX(e.event_time::date) - MIN(e.event_time::date) AS span_days FROM saas_users u JOIN user_events e ON e.user_id = u.user_id WHERE e.event_type = 'login' GROUP BY u.user_id, u.country, u.plan_type HAVING COUNT(DISTINCT e.event_time::date) >= 2 ORDER BY u.user_id ASC;",
    order: true,
    detectTrap: function(sql) {
      var s = ivClean(sql);
      if (!/\bsaas_users\b/i.test(s) || !/\buser_events\b/i.test(s)) return null;
      if (!/login/i.test(s)) {
        return "PUŁAPKA TYPU ZDARZENIA: Użytkownik 8 miał login 4 marca i view_item 5 marca. Zadanie dotyczy wyłącznie zdarzeń event_type = 'login'!";
      }
      return null;
    }
  },
  {
    id: 'iv_57', difficulty: 'hard', categoryTag: 'Produkt & SaaS',
    title: '57. Kompleksowy profil LTV i zaangażowania per kraj (2 osobne CTE przed JOIN)',
    tables: ['saas_users', 'app_transactions', 'user_events'],
    gapId: 'g1', gapName: 'Fan-out trap: łączenie dwóch tabel faktów (transakcje + zdarzenia)',
    gapHint: "Bezpośredni JOIN saas_users z app_transactions I user_events naraz mnoży każdą transakcję przez liczbę zdarzeń użytkownika! Najpierw zagreguj transakcje i zdarzenia w osobnych CTE do poziomu user_id.",
    hint: "Bezpośredni JOIN saas_users z app_transactions I user_events naraz mnoży każdą transakcję przez liczbę zdarzeń użytkownika! Najpierw zagreguj transakcje i zdarzenia w osobnych CTE do poziomu user_id.",
    cols: ['saas_users', 'app_transactions', 'user_events', 'WITH', 'LEFT JOIN', 'COALESCE(', 'SUM('],
    prompt: "Dla każdego kraju (`country`) w `saas_users` wyznacz: liczbę wszystkich zarejestrowanych użytkowników `users_cnt`, łączną kwotę zatwierdzonych transakcji `total_revenue` (z `app_transactions`, gdzie `tx_status = 'approved'`) oraz łączną liczbę wszystkich zdarzeń w aplikacji `total_events` (z `user_events`). Uwaga na pułapkę mnożenia wierszy (fan-out) przy łączeniu dwóch tabel faktów! Posortuj malejąco po `total_revenue`.",
    sol: "WITH tx AS (SELECT user_id, SUM(amount) AS rev FROM app_transactions WHERE tx_status = 'approved' GROUP BY user_id), ev AS (SELECT user_id, COUNT(*) AS ev_cnt FROM user_events GROUP BY user_id) SELECT u.country, COUNT(u.user_id) AS users_cnt, COALESCE(SUM(tx.rev), 0) AS total_revenue, COALESCE(SUM(ev.ev_cnt), 0) AS total_events FROM saas_users u LEFT JOIN tx ON tx.user_id = u.user_id LEFT JOIN ev ON ev.user_id = u.user_id GROUP BY u.country ORDER BY total_revenue DESC;",
    order: true,
    detectTrap: function(sql) {
      var s = ivClean(sql);
      if (!/\bsaas_users\b/i.test(s) || !/\bapp_transactions\b/i.test(s) || !/\buser_events\b/i.test(s)) return null;
      if (!/\bWITH\b/i.test(s) && (s.match(/\bSELECT\b/gi) || []).length < 2) {
        return "PUŁAPKA FAN-OUT (MNOŻENIE WIERSZY): Łączenie saas_users jednocześnie z app_transactions i user_events w jednym SELECT mnoży każdą płatność przez liczbę zdarzeń użytkownika! Zagreguj transakcje i zdarzenia w osobnych CTE.";
      }
      return null;
    }
  },
  {
    id: 'iv_58', difficulty: 'hard', categoryTag: 'E-commerce',
    title: '58. Narastający przychód kategorii w roku (YTD Running Total per Category)',
    tables: ['product_orders'],
    gapId: 'g14', gapName: 'Dwustopniowa agregacja: GROUP BY miesiąc+kategoria, potem SUM() OVER (PARTITION BY)',
    gapHint: "Najpierw w CTE policz miesięczny przychód brutto każdej kategorii, a w zewnętrznym zapytaniu użyj SUM(monthly_rev) OVER (PARTITION BY category ORDER BY month_start).",
    hint: "Najpierw w CTE policz miesięczny przychód brutto każdej kategorii, a w zewnętrznym zapytaniu użyj SUM(monthly_rev) OVER (PARTITION BY category ORDER BY month_start).",
    cols: ['product_orders', 'WITH', 'DATE_TRUNC', 'SUM(monthly_rev) OVER (PARTITION BY category ORDER BY month_start)'],
    prompt: "W `product_orders` policz miesięczny przychód brutto (`SUM(quantity * unit_price) AS monthly_rev`) dla każdej kategorii (`category`) i miesiąca (`DATE_TRUNC('month', order_date)::date AS month_start`). Następnie dodaj kolumnę `ytd_rev` będącą narastającą sumą przychodu danej kategorii od początku roku do bieżącego miesiąca. Posortuj po `category ASC, month_start ASC`.",
    sol: "WITH m AS (SELECT category, DATE_TRUNC('month', order_date)::date AS month_start, SUM(quantity * unit_price) AS monthly_rev FROM product_orders GROUP BY 1, 2) SELECT category, month_start, monthly_rev, SUM(monthly_rev) OVER (PARTITION BY category ORDER BY month_start ASC ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS ytd_rev FROM m ORDER BY category ASC, month_start ASC;",
    order: true,
    detectTrap: function(sql) {
      var s = ivClean(sql);
      if (!/\bproduct_orders\b/i.test(s)) return null;
      if (/\bSUM\s*\([^)]+\)\s*OVER\s*\(\s*ORDER\s+BY/i.test(s) && !/\bPARTITION\s+BY\b/i.test(s)) {
        return "PUŁAPKA PARTYCJI: Bez PARTITION BY category suma narastająca miesza ze sobą przychody różnych kategorii (Laptops, Phones, Accessories).";
      }
      return null;
    }
  },
  {
    id: 'iv_59', difficulty: 'hard', categoryTag: 'E-commerce',
    title: '59. Produkty z wyższą sprzedażą w II kwartale niż w I kwartale (CTE + wzrost %)',
    tables: ['product_orders'],
    gapId: 'g5', gapName: 'Porównanie okresowe na poziomie produktu i filtr wzrostu',
    gapHint: "Policz przychód brutto każdego produktu w Q1 i Q2 w CTE, zostaw produkty obecne w obu kwartałach z q2_rev > q1_rev i policz dynamikę wzrostu.",
    hint: "Policz przychód brutto każdego produktu w Q1 i Q2 w CTE, zostaw produkty obecne w obu kwartałach z q2_rev > q1_rev i policz dynamikę wzrostu.",
    cols: ['product_orders', 'WITH', 'product_id', 'category', 'FILTER (WHERE', 'ROUND('],
    prompt: "Dla każdego produktu (`product_id`, `category`) w `product_orders` oblicz przychód brutto w I kwartale (`order_date < '2026-04-01'`) jako `q1_rev` oraz w II kwartale (`order_date >= '2026-04-01'`) jako `q2_rev`. Zwróć tylko produkty, które miały sprzedaż w I kwartale (`q1_rev > 0`) i zanotowały wzrost w II kwartale (`q2_rev > q1_rev`), podając `product_id`, `category`, `q1_rev`, `q2_rev` oraz procentowy wzrost `growth_pct` = `ROUND((q2_rev - q1_rev) * 100.0 / q1_rev, 2)`. Posortuj malejąco po `growth_pct`.",
    sol: "WITH q AS (SELECT product_id, category, COALESCE(SUM(quantity * unit_price) FILTER (WHERE order_date < '2026-04-01'), 0) AS q1_rev, COALESCE(SUM(quantity * unit_price) FILTER (WHERE order_date >= '2026-04-01'), 0) AS q2_rev FROM product_orders GROUP BY product_id, category) SELECT product_id, category, q1_rev, q2_rev, ROUND((q2_rev - q1_rev) * 100.0 / q1_rev, 2) AS growth_pct FROM q WHERE q1_rev > 0 AND q2_rev > q1_rev ORDER BY growth_pct DESC;",
    order: true,
    detectTrap: function(sql) {
      var s = ivClean(sql);
      if (!/\bproduct_orders\b/i.test(s)) return null;
      if (!/q1_rev\s*>\s*0/i.test(s) && /COALESCE/i.test(s) && !/\bIS\s+NOT\s+NULL\b/i.test(s)) {
        return "PUŁAPKA DZIELENIA PRZEZ ZERO: Produkt 108 był sprzedawany dopiero w Q2 (q1_rev = 0). Odfiltruj q1_rev > 0 przed dzieleniem!";
      }
      return null;
    }
  },
  {
    id: 'iv_60', difficulty: 'hard', categoryTag: 'E-commerce',
    title: '60. Zamówienia powyżej 150% średniej wartości zamówienia w swojej kategorii',
    tables: ['product_orders'],
    gapId: 't5', gapName: 'Analityczne wykrywanie anomalii (wartość wiersza vs AVG OVER PARTITION BY)',
    gapHint: "W CTE policz wartość zamówienia brutto order_val = quantity * unit_price oraz średnią w kategorii cat_avg = AVG(quantity * unit_price) OVER (PARTITION BY category).",
    hint: "W CTE policz wartość zamówienia brutto order_val = quantity * unit_price oraz średnią w kategorii cat_avg = AVG(quantity * unit_price) OVER (PARTITION BY category).",
    cols: ['product_orders', 'WITH', 'AVG(quantity * unit_price) OVER (PARTITION BY category)', 'ROUND('],
    prompt: "W `product_orders` oblicz wartość brutto każdego zamówienia `order_val` (`quantity * unit_price`) oraz średnią wartość zamówienia brutto w jego kategorii `cat_avg` (`ROUND(AVG(quantity * unit_price) OVER (PARTITION BY category), 2)`). Wybierz zamówienia-anomalie, których wartość `order_val` przekracza `1.5 * cat_avg`. Zwróć `order_id`, `category`, `order_date`, `order_val` oraz `cat_avg`. Posortuj malejąco po `order_val`, a przy remisie rosnąco po `order_id`.",
    sol: "WITH a AS (SELECT order_id, category, order_date, quantity * unit_price AS order_val, AVG(quantity * unit_price) OVER (PARTITION BY category) AS raw_avg, ROUND(AVG(quantity * unit_price) OVER (PARTITION BY category), 2) AS cat_avg FROM product_orders) SELECT order_id, category, order_date, order_val, cat_avg FROM a WHERE order_val > 1.5 * raw_avg ORDER BY order_val DESC, order_id ASC;",
    order: true,
    detectTrap: function(sql) {
      var s = ivClean(sql);
      if (!/\bproduct_orders\b/i.test(s)) return null;
      if (/\bAVG\s*\(\s*unit_price\s*\)/i.test(s)) {
        return "PUŁAPKA WARTOŚCI ZAMÓWIENIA: Średnia dotyczy wartości całego zamówienia (quantity * unit_price), a nie samej ceny jednostkowej unit_price!";
      }
      return null;
    }
  }
];

if (typeof window.buildDataLemurSpec === 'function') {
  INTERVIEW_TASKS.forEach(function(it) {
    var spec = window.buildDataLemurSpec(it, null);
    it.solutionSql = it.sol;
    it.polecenie = spec.polecenie;
    it.assumptions = spec.assumptions;
    it.hints = spec.hints;
  });
}

window.INTERVIEW_SEED_SQL = INTERVIEW_SEED_SQL;
window.INTERVIEW_SCHEMA_META = INTERVIEW_SCHEMA_META;
window.INTERVIEW_TASKS = INTERVIEW_TASKS;
window.LEMUR_TASKS = INTERVIEW_TASKS;


