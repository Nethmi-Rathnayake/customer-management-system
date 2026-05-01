-- ============================================================
-- Customer Management System - Sample DML Data
-- ============================================================

USE customer_db;

-- ============================================================
-- COUNTRIES
-- ============================================================
INSERT INTO countries (id, name, code) VALUES
(1,  'Sri Lanka',        'LKA'),
(2,  'India',            'IND'),
(3,  'United Kingdom',   'GBR'),
(4,  'United States',    'USA'),
(5,  'Australia',        'AUS'),
(6,  'Canada',           'CAN'),
(7,  'Germany',          'DEU'),
(8,  'France',           'FRA'),
(9,  'Singapore',        'SGP'),
(10, 'United Arab Emirates', 'ARE');

-- ============================================================
-- CITIES
-- ============================================================
INSERT INTO cities (id, name, country_id) VALUES
-- Sri Lanka
(1,  'Colombo',      1),
(2,  'Kandy',        1),
(3,  'Galle',        1),
(4,  'Jaffna',       1),
(5,  'Negombo',      1),
(6,  'Matara',       1),
(7,  'Kurunegala',   1),
(8,  'Anuradhapura', 1),
-- India
(9,  'Mumbai',       2),
(10, 'Delhi',        2),
(11, 'Bangalore',    2),
(12, 'Chennai',      2),
-- UK
(13, 'London',       3),
(14, 'Manchester',   3),
(15, 'Birmingham',   3),
-- USA
(16, 'New York',     4),
(17, 'Los Angeles',  4),
(18, 'Chicago',      4),
-- Australia
(19, 'Sydney',       5),
(20, 'Melbourne',    5),
-- Canada
(21, 'Toronto',      6),
(22, 'Vancouver',    6),
-- Germany
(23, 'Berlin',       7),
(24, 'Munich',       7),
-- France
(25, 'Paris',        8),
-- Singapore
(26, 'Singapore',    9),
-- UAE
(27, 'Dubai',        10),
(28, 'Abu Dhabi',    10);

-- ============================================================
-- SAMPLE CUSTOMERS
-- ============================================================
INSERT INTO customers (id, name, date_of_birth, nic_number, created_at, updated_at) VALUES
(1,  'Amal Perera',     '1985-03-12', '198501234567', NOW(), NOW()),
(2,  'Nimal Fernando',  '1990-07-22', '199001234567', NOW(), NOW()),
(3,  'Kamala Silva',    '1978-11-05', '197801234567', NOW(), NOW()),
(4,  'Sunil Jayawardena','1995-01-30','199501234567', NOW(), NOW()),
(5,  'Priya Rajapaksa', '1988-09-15', '198801234567', NOW(), NOW()),
(6,  'Roshan Dissanayake','2000-04-18','200001234567', NOW(), NOW()),
(7,  'Dilini Wickramasinghe','1982-12-25','198201234567', NOW(), NOW()),
(8,  'Lasith Mendis',   '1975-06-08', '197501234567', NOW(), NOW()),
(9,  'Tharushi Liyanage','1993-02-14','199301234567', NOW(), NOW()),
(10, 'Chaminda Rathnayake','1969-08-30','196901234567', NOW(), NOW());

-- ============================================================
-- MOBILE NUMBERS
-- ============================================================
INSERT INTO mobile_numbers (customer_id, number) VALUES
(1, '0771234567'),
(1, '0712345678'),
(2, '0759876543'),
(3, '0763344556'),
(3, '0114455667'),
(4, '0787654321'),
(5, '0701122334'),
(6, '0778899001'),
(7, '0723456789'),
(8, '0766677889'),
(9, '0741122334'),
(10, '0779988776');

-- ============================================================
-- ADDRESSES
-- ============================================================
INSERT INTO addresses (customer_id, address_line1, address_line2, city_id, country_id) VALUES
(1, '45 Galle Road',       'Dehiwala',     1,  1),
(1, '12 Temple Street',    'Kotte',        1,  1),
(2, '8 Kandy Road',        'Kelaniya',     1,  1),
(3, '22 Station Road',     '',             2,  1),
(4, '15 Marine Drive',     'Colombo 03',   1,  1),
(5, '7 Queens Street',     'Nugegoda',     1,  1),
(6, '33 Peradeniya Road',  '',             2,  1),
(7, '10 Bay Street',       '',             3,  1),
(8, '5 High Level Road',   'Maharagama',   1,  1),
(9, '88 Negombo Road',     '',             5,  1),
(10,'100 Main Street',     'City Centre',  1,  1);

-- ============================================================
-- FAMILY MEMBERS (self-referencing relationships)
-- ============================================================
-- Amal & Kamala are family
INSERT INTO customer_family_members (customer_id, family_member_id) VALUES
(1, 3),
(3, 1),
-- Nimal & Sunil are family
(2, 4),
(4, 2),
-- Amal & Nimal & Priya are all family
(1, 5),
(5, 1),
(2, 5),
(5, 2);
