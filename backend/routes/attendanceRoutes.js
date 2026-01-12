


const express = require("express");
const router = express.Router();

const attendanceController = require("../controllers/attendanceController");
const { protect } = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const ROLES = require("../config/roles");

console.log("ATTENDANCE ROUTE DEBUG:", {
  protectType: typeof protect,
  roleMiddlewareType: typeof roleMiddleware,
  studentRole: ROLES.STUDENT,
  getMyAttendanceType: typeof attendanceController.getMyAttendance,
  getChildAttendanceType: typeof attendanceController.getChildAttendance
});

/* ================= STUDENT ================= */
router.get(
  "/me",
  protect,
  roleMiddleware(ROLES.STUDENT),
  attendanceController.getMyAttendance
);

/* ================= PARENT ================= */
router.get(
  "/child",
  protect,
  roleMiddleware(ROLES.PARENT),
  attendanceController.getChildAttendance
);

/* ================= TEACHER ================= */
router.post(
  "/",
  protect,
  roleMiddleware(ROLES.TEACHER),
  attendanceController.addAttendance
);

router.get(
  "/teacher",
  protect,
  roleMiddleware(ROLES.TEACHER),
  attendanceController.getAllAttendance
);

router.put(
  "/:id",
  protect,
  roleMiddleware(ROLES.TEACHER),
  attendanceController.updateAttendance
);

/* ================= ADMIN ================= */
router.get(
  "/",
  protect,
  roleMiddleware(ROLES.ADMIN),
  attendanceController.getAllAttendance
);

router.delete(
  "/:id",
  protect,
  roleMiddleware(ROLES.ADMIN),
  attendanceController.deleteAttendance
);

module.exports = router;






