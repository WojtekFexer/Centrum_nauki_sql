/* ==========================================================================
   ZADANIA REKRUTACYJNE: osobna baza biznesowa (6 tabel) + 15 zadań (5 Easy, 5 Medium, 5 Hard)
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
    cols: ['saas_users', 'app_transactions', 'user_id', 'country', 'COUNT(DISTINCT', 'JOIN'],
    prompt: "Połącz `saas_users` z `app_transactions` (`INNER JOIN` po `user_id`). Dla każdego kraju (`country`) policz liczbę UNIKALNYCH użytkowników, którzy mają zatwierdzoną transakcję (`tx_status = 'approved'`) jako `paying_users`, oraz sumę ich zatwierdzonych kwot jako `total_amount`. Posortuj malejąco po `total_amount`.",
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
  }
];

window.INTERVIEW_SEED_SQL = INTERVIEW_SEED_SQL;
window.INTERVIEW_SCHEMA_META = INTERVIEW_SCHEMA_META;
window.INTERVIEW_TASKS = INTERVIEW_TASKS;
window.LEMUR_TASKS = INTERVIEW_TASKS;

