# 📊 Customer Management System (NexusCRM)

A scalable full-stack Customer Management System built with Spring Boot (Java 8) and React JS.  
Supports advanced features like bulk Excel upload (1M+ records), family linking, and multi-contact management.

---

## 🚀 Live Demo

Frontend: http://localhost:3000  
Backend API: http://localhost:8081/api  

---

## ✨ Features

### Core Features
- CRUD operations for customers
- Pagination, search & sorting
- Customer detail view
- Bulk Excel upload (1M+ records)
- Duplicate NIC validation

### Customer Data
- Name (required)
- Date of Birth (required)
- NIC (unique & required)
- Multiple mobile numbers
- Multiple addresses
- Family member linking

### Technical Highlights
- RESTful API architecture
- React + Axios frontend
- JPA/Hibernate ORM
- MariaDB database
- Excel streaming (low memory usage)
- Batch inserts for performance
- Caching for master data
- Unit testing (JUnit, Jest)

---

## 🛠️ Tech Stack

Backend: Spring Boot 2.7  
Language: Java 8  
Frontend: React 18  
Database: MariaDB  
ORM: Hibernate / JPA  
Excel: Apache POI  
Build: Maven / npm  
Testing: JUnit / Jest  

---

## 📁 Project Structure

```
customer-management-system/
│
├── backend/
│   ├── controller/      # REST APIs
│   ├── service/         # Business logic
│   ├── repository/      # Database layer
│   ├── entity/          # JPA entities
│   ├── dto/             # Data transfer objects
│   ├── config/          # Configurations
│   └── exception/       # Global exception handling
│
├── frontend/
│   ├── components/      # Reusable UI components
│   ├── pages/           # Application pages
│   ├── services/        # Axios API calls
│   └── styles/          # CSS files
│
└── database/
    ├── ddl.sql
    └── dml.sql
```
## 🚀 Getting Started

### Prerequisites
- Java 8+
- Maven 3.6+
- Node.js 16+
- MariaDB 10+

---

### Database Setup

CREATE DATABASE customer_db;
USE customer_db;

SOURCE database/ddl.sql;
SOURCE database/dml.sql;

---

### Backend Setup

cd backend  
mvn clean install  
mvn spring-boot:run  

Runs on: http://localhost:8081/api

---

### Frontend Setup

cd frontend  
npm install  
npm start  

Runs on: http://localhost:3000

---

## 📡 API Overview

GET    /customers                - Get all customers  
GET    /customers/{id}           - Get customer  
POST   /customers                - Create  
PUT    /customers/{id}           - Update  
DELETE /customers/{id}           - Delete  
POST   /bulk-upload/customers    - Excel upload  

---

## 📊 Bulk Upload Format

A - Name  
B - Date of Birth  
C - NIC  
D - Mobile Numbers  
E - Address Line 1  
F - Address Line 2  
G - City  
H - Country  

---

## 🧪 Testing

Backend:
mvn test  

Frontend:
npm test  

---

## ⚙️ Configuration

server.port=8081  
spring.datasource.url=jdbc:mariadb://localhost:3307/customer_db  
spring.datasource.username=root  
spring.datasource.password=  

---

## 🐛 Troubleshooting

Port already in use:
Change server.port=8082  

Database issues:
- Ensure MariaDB is running  
- Verify credentials  
- Create database manually  

Bulk upload issues:
- File must be .xlsx or .xls  
- NIC must be unique  
- Max size: 200MB  

---

## 👨‍💻 Author

Nethmi Rathnayake
GitHub:https://github.com/Nethmi-Rathnayake 

---

## 📄 License

MIT License  

---

## 🙌 Acknowledgements

Spring Boot  
React  
Apache POI  
MariaDB  
Axios  

---

## ⭐ Support

If you like this project, give it a star on GitHub!
