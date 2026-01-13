# 🏢 SocietySync – Smart Society Management System

SocietySync is a **full-stack web application** designed to digitally manage residential society operations in a **secure, role-based, and scalable** manner.  
The platform centralizes communication between **Admins, Residents, Workers**, and can be extended to **Security Guards**.

---

## 🚀 Features

- 🔐 **Secure Authentication & Authorization**
  - JWT-based authentication
  - Password hashing using bcrypt
  - Role-based access control (Admin, User, Worker, Security)

- 🧑‍💼 **Admin Approval Workflow**
  - Users and workers can self-register
  - Accounts remain in `pending` state
  - Admin approves or rejects access
  - Only approved users can log in

- 📋 **Society Management Modules**
  - Complaint management
  - Service requests with worker assignment
  - Event & notice board management
  - Visitor & delivery tracking
  - Profile management with image upload

- 🛡️ **Backend Security**
  - Protected routes using middleware
  - Admin-only APIs
  - Status-based login blocking
  - Role validation on every request

---

## 🧩 Project Architecture
Client (React)
|
| REST APIs
v
Server (Node.js + Express)
|
| Mongoose ODM
v
MongoDB


Authentication and authorization are handled entirely at the **backend layer** to ensure security and data integrity.

---

## 🔐 Authentication Flow

### Registration (Admin Approval Based)
1. User / Worker registers
2. Account is created with `status = pending`
3. Admin reviews the request
4. Admin approves or rejects
5. Only approved accounts can log in

### Login
1. User submits email & password
2. Password verified using bcrypt
3. Approval status checked
4. JWT token generated
5. Token used for accessing protected APIs

---

## 🛡️ Middleware Protection

All protected routes pass through authentication middleware:
- Verifies JWT token
- Extracts user role
- Enforces role-based permissions
- Blocks unauthorized access

---

## 🧑‍🤝‍🧑 Team Contribution

This project was developed as a **team project**.

### 👨‍💻 My Role
- Backend development with primary focus on:
  - Authentication & authorization
  - JWT token management
  - Admin approval workflow
  - Role-based access control
- Partial contribution to frontend authentication UI

---

## 🛠️ Tech Stack

### Frontend
- React.js
- React Router
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt

### Tools
- Git & GitHub
- Postman
- VS Code

---

## 📁 Folder Structure (Simplified)

Server/
├── models/
├── routes/
├── middlewares/
└── server.js

Client/
├── pages/
├── components/
├── services/
└── App.jsx
