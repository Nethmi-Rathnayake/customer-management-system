-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- දායකයා: localhost:3307
-- උත්පාදන වේලාව: මැයි 01, 2026 දින 07:41 PM ට
-- සේවාදායකයේ අනුවාදය: 10.4.32-MariaDB
-- PHP අනුවාදය: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- දත්තගබඩාව: `customer_db`
--

-- --------------------------------------------------------

--
-- වගුවක් සඳහා වගු සැකිල්ල `addresses`
--

CREATE TABLE `addresses` (
  `id` bigint(20) NOT NULL,
  `customer_id` bigint(20) NOT NULL,
  `address_line1` varchar(255) DEFAULT NULL,
  `address_line2` varchar(255) DEFAULT NULL,
  `city_id` bigint(20) DEFAULT NULL,
  `country_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- වගු සඳහා නික්ෂේප දත්ත `addresses`
--

INSERT INTO `addresses` (`id`, `customer_id`, `address_line1`, `address_line2`, `city_id`, `country_id`) VALUES
(3, 2, '', '', 10, 2),
(4, 5, '45 Galle Road', 'Colombo 03', 1, 1);

-- --------------------------------------------------------

--
-- වගුවක් සඳහා වගු සැකිල්ල `cities`
--

CREATE TABLE `cities` (
  `id` bigint(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `country_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- වගු සඳහා නික්ෂේප දත්ත `cities`
--

INSERT INTO `cities` (`id`, `name`, `country_id`) VALUES
(1, 'Colombo', 1),
(2, 'Kandy', 1),
(3, 'Galle', 1),
(9, 'Mumbai', 2),
(10, 'Delhi', 2),
(13, 'London', 3),
(16, 'New York', 4),
(19, 'Sydney', 5);

-- --------------------------------------------------------

--
-- වගුවක් සඳහා වගු සැකිල්ල `countries`
--

CREATE TABLE `countries` (
  `id` bigint(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `code` varchar(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- වගු සඳහා නික්ෂේප දත්ත `countries`
--

INSERT INTO `countries` (`id`, `name`, `code`) VALUES
(1, 'Sri Lanka', 'LKA'),
(2, 'India', 'IND'),
(3, 'United Kingdom', 'GBR'),
(4, 'United States', 'USA'),
(5, 'Australia', 'AUS');

-- --------------------------------------------------------

--
-- වගුවක් සඳහා වගු සැකිල්ල `customers`
--

CREATE TABLE `customers` (
  `id` bigint(20) NOT NULL,
  `name` varchar(200) NOT NULL,
  `date_of_birth` date NOT NULL,
  `nic_number` varchar(20) NOT NULL,
  `created_at` datetime(6) DEFAULT current_timestamp(6),
  `updated_at` datetime(6) DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- වගු සඳහා නික්ෂේප දත්ත `customers`
--

INSERT INTO `customers` (`id`, `name`, `date_of_birth`, `nic_number`, `created_at`, `updated_at`) VALUES
(2, 'Nimal Fernando', '1990-07-22', '199001234567', '2026-04-30 14:06:58.000000', '2026-05-01 21:10:36.051000'),
(3, 'Kamala Silva', '1978-11-05', '197801234567', '2026-04-30 14:06:58.000000', '2026-05-01 22:21:20.543000'),
(5, 'Nuwan Perera', '1995-08-19', '199508201234', '2026-05-01 19:55:57.981000', '2026-05-01 22:22:07.959000'),
(6, 'Nimal Fernando', '1985-07-22', '198507000000', '2026-05-01 20:50:54.958000', '2026-05-01 20:50:54.958000'),
(7, 'Sampath Perera', '1990-03-15', '199003000000', '2026-05-01 20:50:55.003000', '2026-05-01 20:50:55.003000'),
(8, 'New Customer 1', '1995-01-15', '199501159999', '2026-05-01 21:00:57.002000', '2026-05-01 21:00:57.002000'),
(9, 'New Customer 2', '1995-01-16', '199501159997', '2026-05-01 21:00:57.027000', '2026-05-01 21:00:57.027000'),
(10, 'New Customer 3', '1995-01-17', '199501159899', '2026-05-01 21:00:57.048000', '2026-05-01 21:00:57.048000');

-- --------------------------------------------------------

--
-- වගුවක් සඳහා වගු සැකිල්ල `customer_family_members`
--

CREATE TABLE `customer_family_members` (
  `customer_id` bigint(20) NOT NULL,
  `family_member_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- වගු සඳහා නික්ෂේප දත්ත `customer_family_members`
--

INSERT INTO `customer_family_members` (`customer_id`, `family_member_id`) VALUES
(2, 5),
(3, 7),
(5, 3),
(5, 6),
(5, 7);

-- --------------------------------------------------------

--
-- වගුවක් සඳහා වගු සැකිල්ල `mobile_numbers`
--

CREATE TABLE `mobile_numbers` (
  `id` bigint(20) NOT NULL,
  `customer_id` bigint(20) NOT NULL,
  `number` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- වගු සඳහා නික්ෂේප දත්ත `mobile_numbers`
--

INSERT INTO `mobile_numbers` (`id`, `customer_id`, `number`) VALUES
(7, 6, '759876543'),
(8, 7, '771234567'),
(9, 8, '771234567'),
(10, 9, '771234566'),
(11, 10, '771234565'),
(12, 2, '0759876543'),
(13, 3, '0763344556'),
(14, 5, '0771234567');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `addresses`
--
ALTER TABLE `addresses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_address_customer_id` (`customer_id`),
  ADD KEY `idx_address_city_id` (`city_id`),
  ADD KEY `idx_address_country_id` (`country_id`);

--
-- Indexes for table `cities`
--
ALTER TABLE `cities`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_city_country_id` (`country_id`);

--
-- Indexes for table `countries`
--
ALTER TABLE `countries`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_country_name` (`name`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_nic_number` (`nic_number`),
  ADD UNIQUE KEY `idx_nic_number` (`nic_number`),
  ADD KEY `idx_customer_name` (`name`);

--
-- Indexes for table `customer_family_members`
--
ALTER TABLE `customer_family_members`
  ADD PRIMARY KEY (`customer_id`,`family_member_id`),
  ADD KEY `fk_cfm_family_member` (`family_member_id`);

--
-- Indexes for table `mobile_numbers`
--
ALTER TABLE `mobile_numbers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_mobile_customer_id` (`customer_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `addresses`
--
ALTER TABLE `addresses`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `cities`
--
ALTER TABLE `cities`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `countries`
--
ALTER TABLE `countries`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `mobile_numbers`
--
ALTER TABLE `mobile_numbers`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- නික්ෂේපනය කරන ලද වගු සඳහා සීමා බාධක
--

--
-- වගුව සඳහා සීමා බාධක `addresses`
--
ALTER TABLE `addresses`
  ADD CONSTRAINT `fk_address_city` FOREIGN KEY (`city_id`) REFERENCES `cities` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_address_country` FOREIGN KEY (`country_id`) REFERENCES `countries` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_address_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE;

--
-- වගුව සඳහා සීමා බාධක `cities`
--
ALTER TABLE `cities`
  ADD CONSTRAINT `fk_city_country` FOREIGN KEY (`country_id`) REFERENCES `countries` (`id`) ON DELETE SET NULL;

--
-- වගුව සඳහා සීමා බාධක `customer_family_members`
--
ALTER TABLE `customer_family_members`
  ADD CONSTRAINT `fk_cfm_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_cfm_family_member` FOREIGN KEY (`family_member_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE;

--
-- වගුව සඳහා සීමා බාධක `mobile_numbers`
--
ALTER TABLE `mobile_numbers`
  ADD CONSTRAINT `fk_mobile_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
