# SocietySync Backend Architecture

## Overview

SocietySync backend is a Node.js + Express API for a private society platform with role-based access:

- `user` (resident)
- `worker` (service executor)
- `security` (future/extendable role)
- `admin` (approval + governance)

All application users are persisted in MongoDB (`user` collection), with login protected by JWT.

## Runtime Stack

- **Runtime:** Node.js
- **API framework:** Express
- **Database:** MongoDB + Mongoose
- **Auth:** JWT (`Authorization: Bearer <token>`)
- **Password hashing:** bcrypt
- **Upload handling:** Multer (profile pictures)
- **Cross-origin:** CORS with explicit allowlist

## High-Level Flow

1. Resident/worker/security registers.
2. Account is created with `status: pending`.
3. Admin reviews pending requests from dashboard.
4. Admin approves/rejects account.
5. Only `approved` users can login and access protected endpoints.

## Folder Structure (Current)

```txt
Server/
  app.js
  configs/
    mongodb-connection.js
    multer.js
  middlewares/
    auth.js
    adminOnly.js
  models/
    userModel.js
    workerModel.js
    securityModel.js
    complaintModel.js
    eventModel.js
    serviceModel.js
    ...
  routes/
    auth-routes.js
    admin-routes.js
    me-routes.js
    complaint-routes.js
    event-routes.js
    service-routes.js
```

## Data Model (Auth Core)

### `userModel`

```js
{
  name: String,
  email: String, // unique, lowercase
  houseNo: String,
  password: String, // bcrypt hash
  role: "user" | "worker" | "security" | "admin",
  status: "pending" | "approved" | "rejected",
  profilePicture: {
    data: Buffer,
    contentType: String
  }
}
```

## Authentication & Authorization

### Registration

- Endpoint: `POST /api/auth/register`
- Validates `name`, `email`, `password`, `houseNo`.
- Hashes password.
- Role is restricted to `user|worker|security` from registration (admin cannot self-register).
- Status is always set to `pending`.

### Login

- Endpoint: `POST /api/auth/login`
- User must exist and password must match.
- User must be `approved`.
- JWT payload includes `id` and `role`.

### Admin Login

- Endpoint: `POST /api/auth/login/admin`
- Account must be `role === admin` and `status === approved`.

### Worker Login

- Endpoint: `POST /api/auth/login/worker`
- Requires worker identity and `approved` status.

### Middleware

- `auth.js` verifies JWT and resolves identity.
- `adminOnly.js` allows only `req.user.role === "admin"`.

## Admin Approval Workflow

- `GET /api/admin/pending` -> returns grouped pending requests (`users`, `workers`, `securities`).
- `PATCH /api/admin/approve/:role/:id` -> marks account as approved.
- `PATCH /api/admin/reject/:role/:id` -> marks account as rejected.

Legacy worker/security collections are still supported in admin endpoints for compatibility.

## Domain APIs

### Events (`/api/events`)

- `GET /` authenticated users can view.
- `POST /create`, `PUT /:id`, `DELETE /:id` admin only.

### Complaints (`/api/complaints`)

- Residents create and view their own complaints.
- Admin can view all complaints.
- Update/delete restricted to complaint owner or admin.

### Services (`/api/services`)

- Residents create service requests.
- Admin sees all requests.
- Non-admin users see own requests; workers see assigned requests.
- `PATCH /:id` (close task) restricted to admin or assigned worker.

### Profile (`/api/me`)

- Read/update profile details.
- Upload and fetch profile picture.

## Environment Variables

Required:

```env
PORT=3000
JWT_SECRET=<secure_random_secret>
MONGODB_URI=<mongodb_connection_uri>
```

## CORS Policy

Configured allowlist includes local and deployed frontend origins. For local development:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`

## Interview Talking Points

- Role + status based onboarding (`pending -> approved`).
- JWT-based stateless auth.
- Granular authorization in domain routes (owner/admin/worker).
- Backward compatibility handling for legacy worker/security collections.
- Environment-driven API and CORS setup for local vs production parity.
# SocietySync Backend Architecture Documentation

## Table of Contents
1. [Introduction](#introduction)
2. [System Overview](#system-overview)
3. [Backend Architecture](#backend-architecture)
4. [Database Design](#database-design)
5. [API Endpoints](#api-endpoints)
6. [Authentication Flow](#authentication-flow)
7. [Security Measures](#security-measures)
8. [Deployment](#deployment)

## Introduction

SocietySync is a comprehensive society management system that streamlines residential complex operations. This document focuses on explaining the backend architecture and how different components work together.

## System Overview

### Core Components
- **User Management System**
- **Society Management Module**
- **Maintenance System**
- **Event Management**
- **Payment Processing**
- **Notification System**

### Technology Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT + Passport.js
- **File Storage**: Multer
- **API Documentation**: Swagger

## Backend Architecture

### Directory Structure
```
Server/
├── app.js              # Main application file
├── configs/            # Configuration files
│   ├── database.js     # Database configuration
│   └── passport.js     # Authentication configuration
├── middlewares/        # Custom middlewares
│   ├── auth.js         # Authentication middleware
│   └── upload.js       # File upload middleware
├── models/            # Database models
│   ├── User.js        # User model
│   ├── Society.js     # Society model
│   └── Maintenance.js # Maintenance model
└── routes/            # API routes
    ├── auth.js        # Authentication routes
    ├── society.js     # Society management routes
    └── maintenance.js # Maintenance routes
```

### Key Components Explanation

#### 1. User Management
- **Registration Flow**
  ```javascript
  // Example registration flow
  User.register -> Validate Data -> Hash Password -> Create User -> Generate JWT
  ```
- **Authentication Flow**
  ```javascript
  // Example authentication flow
  User.login -> Verify Credentials -> Generate JWT -> Set Cookies
  ```

#### 2. Society Management
- **Society Creation**
  ```javascript
  // Example society creation
  Create Society -> Assign Admin -> Setup Default Settings -> Initialize Modules
  ```
- **Member Management**
  ```javascript
  // Example member management
  Add Member -> Assign Role -> Set Permissions -> Send Invitation
  ```

#### 3. Maintenance System
- **Request Flow**
  ```javascript
  // Example maintenance request
  Create Request -> Assign Worker -> Track Progress -> Update Status
  ```
- **Worker Assignment**
  ```javascript
  // Example worker assignment
  Analyze Request -> Match Skills -> Check Availability -> Assign Task
  ```

## Database Design

### Collections Structure

#### Users Collection
```javascript
{
  _id: ObjectId,
  email: String,
  password: String (hashed),
  role: String,
  profile: {
    name: String,
    phone: String,
    address: String
  },
  societyId: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

#### Societies Collection
```javascript
{
  _id: ObjectId,
  name: String,
  address: String,
  adminId: ObjectId,
  members: [{
    userId: ObjectId,
    role: String,
    joinedAt: Date
  }],
  settings: {
    maintenanceFee: Number,
    paymentDue: Number
  },
  createdAt: Date,
  updatedAt: Date
}
```

#### Maintenance Collection
```javascript
{
  _id: ObjectId,
  societyId: ObjectId,
  requestedBy: ObjectId,
  assignedTo: ObjectId,
  type: String,
  description: String,
  status: String,
  priority: String,
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints

### Authentication
```
POST /api/auth/register    # Register new user
POST /api/auth/login       # User login
POST /api/auth/logout      # User logout
GET  /api/auth/profile     # Get user profile
```

### Society Management
```
POST   /api/society/create     # Create new society
GET    /api/society/:id        # Get society details
PUT    /api/society/:id        # Update society
DELETE /api/society/:id        # Delete society
```

### Maintenance
```
POST   /api/maintenance/create    # Create maintenance request
GET    /api/maintenance/:id       # Get request details
PUT    /api/maintenance/:id       # Update request
GET    /api/maintenance/list      # List all requests
```

## Authentication Flow

1. **Registration Process**
   - User submits registration form
   - Backend validates data
   - Password is hashed
   - User document is created
   - JWT token is generated
   - Response sent to client

2. **Login Process**
   - User submits credentials
   - Backend verifies password
   - JWT token is generated
   - Token stored in cookies
   - User data sent to client

3. **Protected Routes**
   - Request includes JWT
   - Middleware verifies token
   - User data attached to request
   - Route handler processes request

## Security Measures

1. **Password Security**
   - Bcrypt hashing
   - Salt rounds: 10
   - Password complexity requirements

2. **JWT Security**
   - Token expiration: 24 hours
   - Refresh token mechanism
   - Secure cookie storage

3. **API Security**
   - Rate limiting
   - CORS configuration
   - Input validation
   - XSS protection




## Conclusion

This documentation provides a comprehensive overview of the SocietySync backend architecture. The system is designed to be scalable, secure, and maintainable. For any specific questions or clarifications, please refer to the API documentation or contact the development team. 