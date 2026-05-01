-- ============================================================
-- Customer Management System - DDL Script (MariaDB)
-- ============================================================

-- Create Database
CREATE DATABASE IF NOT EXISTS customer_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE customer_db;

-- Create Application User
CREATE USER IF NOT EXISTS 'cms_user'@'localhost' IDENTIFIED BY 'cms_password';
GRANT ALL PRIVILEGES ON customer_db.* TO 'cms_user'@'localhost';
FLUSH PRIVILEGES;

-- ============================================================
-- MASTER DATA TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS countries (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    code        VARCHAR(3),
    UNIQUE KEY uk_country_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS cities (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    country_id  BIGINT,
    CONSTRAINT fk_city_country FOREIGN KEY (country_id) REFERENCES countries(id) ON DELETE SET NULL,
    INDEX idx_city_country_id (country_id),
    INDEX idx_city_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- CUSTOMER TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS customers (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(200) NOT NULL,
    date_of_birth   DATE NOT NULL,
    nic_number      VARCHAR(20) NOT NULL,
    created_at      DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
    updated_at      DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    UNIQUE KEY uk_nic_number (nic_number),
    INDEX idx_customer_name (name),
    INDEX idx_dob (date_of_birth)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- MOBILE NUMBERS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS mobile_numbers (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    number      VARCHAR(20) NOT NULL,
    CONSTRAINT fk_mobile_customer FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    INDEX idx_mobile_customer_id (customer_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- ADDRESSES TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS addresses (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id     BIGINT NOT NULL,
    address_line1   VARCHAR(255),
    address_line2   VARCHAR(255),
    city_id         BIGINT,
    country_id      BIGINT,
    CONSTRAINT fk_address_customer FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    CONSTRAINT fk_address_city    FOREIGN KEY (city_id)     REFERENCES cities(id)    ON DELETE SET NULL,
    CONSTRAINT fk_address_country FOREIGN KEY (country_id)  REFERENCES countries(id) ON DELETE SET NULL,
    INDEX idx_address_customer_id (customer_id),
    INDEX idx_address_city_id (city_id),
    INDEX idx_address_country_id (country_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- CUSTOMER FAMILY MEMBERS (Self-referencing Many-to-Many)
-- ============================================================

CREATE TABLE IF NOT EXISTS customer_family_members (
    customer_id       BIGINT NOT NULL,
    family_member_id  BIGINT NOT NULL,
    PRIMARY KEY (customer_id, family_member_id),
    CONSTRAINT fk_cfm_customer      FOREIGN KEY (customer_id)      REFERENCES customers(id) ON DELETE CASCADE,
    CONSTRAINT fk_cfm_family_member FOREIGN KEY (family_member_id) REFERENCES customers(id) ON DELETE CASCADE,
    INDEX idx_cfm_customer_id (customer_id),
    INDEX idx_cfm_family_member_id (family_member_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
