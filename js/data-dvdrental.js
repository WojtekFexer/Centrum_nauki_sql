/* ==========================================================================
   1. BAZA DANYCH DVDRENTAL (10 TABEL Z PRZYPADKAMI BRZEGOWYMI)
   ========================================================================== */
var DVDRENTAL_SEED_SQL = `
CREATE TABLE category (
  category_id INTEGER PRIMARY KEY,
  name TEXT NOT NULL
);
INSERT INTO category VALUES
  (1, 'Action'), (2, 'Animation'), (3, 'Comedy'), (4, 'Drama'), (5, 'Sci-Fi'), (6, 'Documentary');

CREATE TABLE film (
  film_id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  rating TEXT NOT NULL,
  rental_rate NUMERIC NOT NULL,
  length INTEGER NOT NULL,
  replacement_cost NUMERIC NOT NULL,
  release_year INTEGER NOT NULL
);
INSERT INTO film VALUES
  (1, 'ACADEMY DINOSAUR', 'PG', 0.99, 86, 20.99, 2006),
  (2, 'ACE GOLDFINGER', 'G', 4.99, 48, 12.99, 2006),
  (3, 'ADAPTATION HOLES', 'NC-17', 2.99, 50, 18.99, 2006),
  (4, 'AFFAIR PREJUDICE', 'G', 2.99, 117, 26.99, 2006),
  (5, 'AFRICAN EGG', 'G', 2.99, 130, 22.99, 2006),
  (6, 'AGENT TRUMAN', 'PG', 2.99, 169, 17.99, 2006),
  (7, 'AIRPLANE SIERRA', 'PG-13', 4.99, 62, 28.99, 2006),
  (8, 'AIRPORT POLLOCK', 'R', 4.99, 54, 15.99, 2006),
  (9, 'ALABAMA DEVIL', 'PG-13', 2.99, 114, 21.99, 2006),
  (10, 'ALADDIN CALENDAR', 'NC-17', 4.99, 63, 24.99, 2006),
  (11, 'ALAMO VIDEOTAPE', 'G', 0.99, 126, 16.99, 2006),
  (12, 'ALASKA PHANTOM', 'PG', 0.99, 136, 22.99, 2006),
  (13, 'ALI FOREVER', 'PG', 4.99, 150, 21.99, 2006),
  (14, 'ALICE FANTASIA', 'NC-17', 0.99, 94, 23.99, 2006),
  (15, 'ALIEN CENTER', 'NC-17', 2.99, 46, 10.99, 2006),
  (16, 'ALLEY EVOLUTION', 'NC-17', 2.99, 180, 23.99, 2006),
  (17, 'ALONE TRIP', 'R', 0.99, 82, 14.99, 2006),
  (18, 'ALTER VICTORY', 'PG-13', 0.99, 57, 27.99, 2006),
  (19, 'AMADEUS HOLY', 'PG', 0.99, 113, 20.99, 2006),
  (20, 'AMELIE HELLFIGHTERS', 'R', 4.99, 79, 23.99, 2006);

CREATE TABLE film_category (
  film_id INTEGER,
  category_id INTEGER
);
INSERT INTO film_category VALUES
  (1,6), (2,1), (3,5), (4,4), (5,3), (6,1), (7,3), (8,4), (9,5), (10,2),
  (11,2), (12,1), (13,4), (14,5), (15,5), (16,1), (17,4), (18,3), (19,4), (20,3);

CREATE TABLE actor (
  actor_id INTEGER PRIMARY KEY,
  first_name TEXT,
  last_name TEXT
);
INSERT INTO actor VALUES
  (1, 'PENELOPE', 'GUINESS'), (2, 'NICK', 'WAHLBERG'), (3, 'ED', 'CHASE'),
  (4, 'JENNIFER', 'DAVIS'), (5, 'JOHNNY', 'LOLLOBRIGIDA'), (6, 'BETTE', 'NICHOLSON'),
  (7, 'GRACE', 'MOSTEL'), (8, 'MATTHEW', 'JOHANSSON');

CREATE TABLE film_actor (
  actor_id INTEGER,
  film_id INTEGER
);
INSERT INTO film_actor VALUES
  (1,1), (1,4), (1,12), (2,2), (2,6), (2,7), (2,16), (3,3), (3,9), (4,5), (4,10),
  (5,8), (5,13), (5,17), (5,20), (6,11), (6,19), (7,14), (7,15);

CREATE TABLE store (
  store_id INTEGER PRIMARY KEY,
  city TEXT
);
INSERT INTO store VALUES (1, 'Lethbridge'), (2, 'Woodridge');

CREATE TABLE staff (
  staff_id INTEGER PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  store_id INTEGER
);
INSERT INTO staff VALUES (1, 'Mike', 'Hillyer', 1), (2, 'Jon', 'Stephens', 2);

CREATE TABLE customer (
  customer_id INTEGER PRIMARY KEY,
  store_id INTEGER,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  active INTEGER,
  create_date TEXT
);
INSERT INTO customer VALUES
  (1, 1, 'MARY', 'SMITH', 'mary.smith@sakilacustomer.org', 1, '2026-01-10'),
  (2, 1, 'PATRICIA', 'JOHNSON', 'patricia.j@sakilacustomer.org', 1, '2026-01-12'),
  (3, 1, 'LINDA', 'WILLIAMS', 'linda.w@sakilacustomer.org', 1, '2026-01-15'),
  (4, 2, 'BARBARA', 'JONES', 'barbara.j@sakilacustomer.org', 1, '2026-01-20'),
  (5, 2, 'ELIZABETH', 'BROWN', 'elizabeth.b@sakilacustomer.org', 1, '2026-02-01'),
  (6, 2, 'JENNIFER', 'DAVIS', 'jennifer.d@sakilacustomer.org', 0, '2026-02-05'),
  (7, 1, 'MARIA', 'MILLER', 'maria.m@sakilacustomer.org', 1, '2026-02-10'),
  (8, 2, 'SUSAN', 'WILSON', 'susan.w@sakilacustomer.org', 1, '2026-02-14'),
  (9, 1, 'MARGARET', 'MOORE', 'margaret.m@sakilacustomer.org', 1, '2026-03-01'),
  (10, 2, 'DOROTHY', 'TAYLOR', 'dorothy.t@sakilacustomer.org', 0, '2026-03-05');

CREATE TABLE rental (
  rental_id INTEGER PRIMARY KEY,
  rental_date TEXT NOT NULL,
  film_id INTEGER NOT NULL,
  customer_id INTEGER NOT NULL,
  return_date TEXT,
  staff_id INTEGER NOT NULL
);
INSERT INTO rental VALUES
  (101, '2026-05-01', 1, 1, '2026-05-04', 1),
  (102, '2026-05-02', 2, 1, '2026-05-06', 1),
  (103, '2026-05-03', 6, 2, '2026-05-07', 2),
  (104, '2026-05-04', 7, 3, NULL, 1),
  (105, '2026-05-05', 8, 4, '2026-05-09', 2),
  (106, '2026-05-07', 10, 1, '2026-05-10', 2),
  (107, '2026-05-10', 13, 5, '2026-05-15', 1),
  (108, '2026-05-12', 16, 2, NULL, 2),
  (109, '2026-06-01', 1, 3, '2026-06-05', 1),
  (110, '2026-06-03', 2, 4, '2026-06-08', 2),
  (111, '2026-06-05', 7, 6, '2026-06-09', 1),
  (112, '2026-06-10', 13, 7, '2026-06-14', 2),
  (113, '2026-06-12', 20, 8, NULL, 1),
  (114, '2026-06-15', 12, 1, '2026-06-19', 1),
  (115, '2026-06-18', 19, 4, '2026-06-21', 2);

CREATE TABLE payment (
  payment_id INTEGER PRIMARY KEY,
  customer_id INTEGER NOT NULL,
  staff_id INTEGER NOT NULL,
  rental_id INTEGER NOT NULL,
  amount NUMERIC NOT NULL,
  payment_date TEXT NOT NULL
);
INSERT INTO payment VALUES
  (501, 1, 1, 101, 2.99, '2026-05-01'),
  (502, 1, 1, 102, 4.99, '2026-05-02'),
  (503, 2, 2, 103, 2.99, '2026-05-03'),
  (504, 3, 1, 104, 6.99, '2026-05-04'),
  (505, 4, 2, 105, 4.99, '2026-05-05'),
  (506, 1, 2, 106, 7.99, '2026-05-07'),
  (507, 5, 1, 107, 4.99, '2026-05-10'),
  (508, 2, 2, 108, 2.99, '2026-05-12'),
  (509, 3, 1, 109, 0.99, '2026-06-01'),
  (510, 4, 2, 110, 8.99, '2026-06-03'),
  (511, 6, 1, 111, 4.99, '2026-06-05'),
  (512, 7, 2, 112, 5.99, '2026-06-10'),
  (513, 8, 1, 113, 4.99, '2026-06-12'),
  (514, 1, 1, 114, 0.99, '2026-06-15'),
  (515, 4, 2, 115, 2.99, '2026-06-18');
`;

var SCHEMA_META = [
  { table: 'film', desc: 'Katalog 20 filmów DVD', cols: ['film_id', 'title', 'rating', 'rental_rate', 'length', 'replacement_cost', 'release_year'] },
  { table: 'category', desc: 'Kategorie filmowe (Action, Sci-Fi...)', cols: ['category_id', 'name'] },
  { table: 'film_category', desc: 'Tabela łącząca film z kategorią', cols: ['film_id', 'category_id'] },
  { table: 'actor', desc: 'Aktorzy (aktor 8 nie grał w żadnym filmie)', cols: ['actor_id', 'first_name', 'last_name'] },
  { table: 'film_actor', desc: 'Obsada filmów (relacja wiele-do-wielu)', cols: ['actor_id', 'film_id'] },
  { table: 'customer', desc: 'Klienci (klientki 9 i 10 bez wypożyczeń)', cols: ['customer_id', 'store_id', 'first_name', 'last_name', 'email', 'active', 'create_date'] },
  { table: 'rental', desc: 'Wypożyczenia (3 rekordy z return_date IS NULL)', cols: ['rental_id', 'rental_date', 'film_id', 'customer_id', 'return_date', 'staff_id'] },
  { table: 'payment', desc: 'Płatności za wypożyczenia', cols: ['payment_id', 'customer_id', 'staff_id', 'rental_id', 'amount', 'payment_date'] },
  { table: 'staff', desc: 'Pracownicy (Mike i Jon)', cols: ['staff_id', 'first_name', 'last_name', 'store_id'] },
  { table: 'store', desc: 'Oddziały wypożyczalni (Lethbridge, Woodridge)', cols: ['store_id', 'city'] }
];

window.DVDRENTAL_SEED_SQL = DVDRENTAL_SEED_SQL;
window.SCHEMA_META = SCHEMA_META;

