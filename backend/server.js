/**
 * Student Management System - Backend Server
 * Roles: Admin, Teacher, Student, Parent
 */

const express = require("express");
const cors = require("cors");
require("dotenv").config();

// ==========================
// DATABASE CONNECTION
// ==========================
require("./config/db");

// ==========================
// INITIALIZE APP
// ==========================
const app = express();

// ==========================
// GLOBAL MIDDLEWARE (ORDER MATTERS 🔥)
// ==========================

// ✅ Enable CORS
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// ✅ Body parser (THIS FIXES req.body = undefined)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Request logger (debug helper)
app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.originalUrl}`);
  next();
});

// ==========================
// IMPORT ROUTES
// ==========================
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const studentRoutes = require("./routes/studentRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const parentRoutes = require("./routes/parentRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const commentRoutes = require("./routes/commentRoutes");

// ==========================
// ROUTE VALIDATION (PREVENTS SERVER CRASH 🔥)
// ==========================
function validateRouter(name, router) {
  if (!router || typeof router !== "function") {
    console.error(`❌ ${name} is NOT a valid Express router`);
    process.exit(1);
  }
}

validateRouter("authRoutes", authRoutes);
validateRouter("adminRoutes", adminRoutes);
validateRouter("studentRoutes", studentRoutes);
validateRouter("teacherRoutes", teacherRoutes);
validateRouter("parentRoutes", parentRoutes);
validateRouter("attendanceRoutes", attendanceRoutes);
validateRouter("commentRoutes", commentRoutes);

// ==========================
// REGISTER ROUTES
// ==========================
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/parents", parentRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/comments", commentRoutes);

// ==========================
// HEALTH CHECK
// ==========================
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Student Management System API is running"
  });
});

// ==========================
// 404 HANDLER
// ==========================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found"
  });
});

// ==========================
// GLOBAL ERROR HANDLER
// ==========================
app.use((err, req, res, next) => {
  console.error("🔥 SERVER ERROR:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error"
  });
});

// ==========================
// START SERVER
// ==========================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});




