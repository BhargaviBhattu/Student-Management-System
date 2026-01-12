const express = require("express");
const router = express.Router();

const teacherController = require("../controllers/teacherController");
const { protect } = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const ROLES = require("../config/roles");

/* =========================
   TEACHER PROFILE
========================= */

// 👨‍🏫 Teacher → View own profile
router.get(
  "/me",
  protect,
  roleMiddleware(ROLES.TEACHER),
  teacherController.getMyProfile
);

/* =========================
   MANAGE STUDENTS
========================= */

// 👨‍🏫 Teacher → Manage assigned students
router.get(
  "/manage-students",
  protect,
  roleMiddleware(ROLES.TEACHER),
  teacherController.getManageStudentsData
);

/* =========================
   ATTENDANCE (ADD OR UPDATE)
========================= */

// 🔥 Teacher → Add OR Update attendance (SMART)
router.post(
  "/attendance",
  protect,
  roleMiddleware(ROLES.TEACHER),
  teacherController.saveAttendance
);

/* =========================
   COMMENTS
========================= */

// 💬 Teacher → View parent comments
router.get(
  "/comments",
  protect,
  roleMiddleware(ROLES.TEACHER),
  teacherController.getParentComments
);

// 💬 Teacher → Reply to parent comment
router.put(
  "/comments/:id/reply",
  protect,
  roleMiddleware(ROLES.TEACHER),
  teacherController.replyToComment
);

module.exports = router;




