# Student Management System (Full-Stack Web Application)
A full-stack Student Management System designed to manage academic records and communication using role-based access control. The system supports Admin, Teacher, Student, and Parent roles with secure authentication and real-world workflow implementation.

## 🚀 Features
- Role-Based Access Control (Admin, Teacher, Student, Parent)
- JWT-based Authentication and Authorization
- Admin dashboard for managing students, teachers, and parents
- Teacher dashboard for managing assigned students and academic records
- Student dashboard to view attendance and academic details
- Parent dashboard to track child attendance and communicate with teachers
- Attendance and marks management with smart add/update logic
- Secure RESTful API architecture

## 🛠 Tech Stack

**Frontend**
- HTML5
- CSS3
- JavaScript
- Bootstrap
  
**Backend**
- Node.js
- Express.js
- REST APIs

**Database**
- MySQL
- Relational Database Design (Joins, Foreign Keys)
  
**Security**
- JWT Authentication
- Role-Based Access Control (RBAC)
- Middleware-based authorization

---

## 👥 User Roles & Responsibilities

### Admin
- Create and manage students, teachers, and parents
- Assign teachers to students
- Link parents to students
- Delete users

### Teacher
- View assigned students
- Update attendance and marks
- View and reply to parent comments

### Student
- View own profile
- View attendance and academic records

### Parent
- View child profile and attendance
- Send comments or queries to teachers
- View teacher replies
## 🔑 Authentication Flow
- Users authenticate using JWT tokens
- Tokens are validated using middleware
- Access is restricted based on user roles (RBAC)
- Unauthorized access is blocked at API level

## 📌 Database Highlights
- Normalized relational schema
- Foreign key relationships between users, students, teachers, and parents
- Secure data access with role-based constraints
- Optimized queries for dashboards and reports





