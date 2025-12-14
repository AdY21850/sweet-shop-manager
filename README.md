# 🍬 Sweet Shop Management System

A **full-stack Sweet Shop application** built with **Spring Boot (Backend)** and **React (Frontend)** that supports **user authentication, role-based access (Admin/User), sweet management, and purchasing**.

This project follows **industry-standard practices** including JWT authentication, REST APIs, DTO validation, and clean separation of concerns.

---

## 🚀 Features

### 👤 Authentication & Authorization
- User Registration & Login
- JWT-based authentication
- Role-based access control
  - **ADMIN**: Can add, update, delete sweets
  - **USER**: Can view & purchase sweets
- Secure password hashing using BCrypt

### 🍭 Sweet Management
- View all available sweets
- Search sweets by:
  - Name
  - Category
  - Price range
- Purchase sweets (quantity auto-decreases)
- Admin can:
  - Add new sweets
  - Manage inventory

### 🖥️ Frontend (React)
- Modern UI with reusable components
- Axios with JWT interceptor
- Context API for authentication state
- Protected routes for Admin actions

---

## 🛠️ Tech Stack

### Backend
- Java 21
- Spring Boot
- Spring Security
- JWT Authentication
- Hibernate / JPA
- MySQL
- Lombok

### Frontend
- React
- Axios
- React Router
- Context API
- Tailwind CSS / UI Components

---

## 📂 Project Structure

### Backend
src/main/java/com/example/sweet_shop
├── controller
├── service
├── repository
├── model
├── dto
├── config
└── util
### Frontend
src
├── api
├── context
├── components
├── pages
└── App.jsx

---

## 🗄️ Database Schema

### users table
```sql
CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('ADMIN','USER') NOT NULL DEFAULT 'USER'
);
----------------------------
CREATE TABLE sweet (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(255) NOT NULL,
  price DOUBLE NOT NULL,
  quantity INT NOT NULL,
  image_url VARCHAR(500),
  description TEXT
);
