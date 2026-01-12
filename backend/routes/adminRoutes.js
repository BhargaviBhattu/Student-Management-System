const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const ROLES = require("../config/roles");

/* =====================================================
   ADMIN ROUTES (PROTECTED)
   ===================================================== */

// 🔐 Protect ALL admin routes
router.use(
  protect,
  roleMiddleware(ROLES.ADMIN)
);

/* =====================================================
   STUDENT MANAGEMENT
   ===================================================== */

// 📄 View all students
// GET /api/admin/students
router.get("/students", adminController.getAllStudents);

// ➕ Add student
// POST /api/admin/students
router.post("/students", adminController.addStudent);

/* =====================================================
   PARENT MANAGEMENT
   ===================================================== */

// ➕ Add parent
// POST /api/admin/parents
router.post("/parents", adminController.addParent);

/* =====================================================
   TEACHER MANAGEMENT
   ===================================================== */

// 📄 Get all teachers (✅ REQUIRED for dropdown)
router.get("/teachers", adminController.getAllTeachers);

// ➕ Add teacher
// POST /api/admin/teachers
router.post("/teachers", adminController.addTeacher);

/* =====================================================
   USER MANAGEMENT
   ===================================================== */

// ❌ Delete any user (student / parent / teacher)
// DELETE /api/admin/users/:id
router.delete("/users/:id", adminController.deleteUser);

module.exports = router;







