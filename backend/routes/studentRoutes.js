const express = require("express");
const router = express.Router();

const studentController = require("../controllers/studentController");
const { protect } = require("../middleware/authMiddleware"); // ✅ FIX
const roleMiddleware = require("../middleware/roleMiddleware");
const ROLES = require("../config/roles");

/* ==================================================
   STUDENT SELF ROUTES
   ==================================================
   Logged-in STUDENT → own profile only
*/

// 👨‍🎓 Student → View own profile
router.get(
  "/me",
  protect,
  roleMiddleware(ROLES.STUDENT),
  studentController.getMyProfile
);

/* ==================================================
   ADMIN ROUTES (FULL CONTROL)
   ==================================================
*/

// ➕ Admin → Create student
router.post(
  "/",
  protect,
  roleMiddleware(ROLES.ADMIN),
  studentController.createStudent
);

// 📄 Admin → Get all students
router.get(
  "/",
  protect,
  roleMiddleware(ROLES.ADMIN),
  studentController.getAllStudents
);

// 📄 Admin → Get student by ID
router.get(
  "/:id",
  protect,
  roleMiddleware(ROLES.ADMIN),
  studentController.getStudentById
);

// ✏️ Admin → Update student
router.put(
  "/:id",
  protect,
  roleMiddleware(ROLES.ADMIN),
  studentController.updateStudent
);

// ❌ Admin → Delete student
router.delete(
  "/:id",
  protect,
  roleMiddleware(ROLES.ADMIN),
  studentController.deleteStudent
);

/* ==================================================
   TEACHER ROUTES (READ-ONLY)
   ==================================================
*/

// 👨‍🏫 Teacher → View all students
router.get(
  "/teacher/all",
  protect,
  roleMiddleware(ROLES.TEACHER),
  studentController.getAllStudents
);

// 👨‍🏫 Teacher → View student by ID
router.get(
  "/teacher/:id",
  protect,
  roleMiddleware(ROLES.TEACHER),
  studentController.getStudentById
);

module.exports = router;



