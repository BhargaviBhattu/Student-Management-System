const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware"); // ✅ FIX
const roleMiddleware = require("../middleware/roleMiddleware");
const ROLES = require("../config/roles");

console.log("AUTH CONTROLLER:", authController);

/* =====================================================
   AUTH ROUTES (PUBLIC)
   ===================================================== */

// 🔐 Login (All roles)
router.post("/login", authController.login);

// 📝 Register (ADMIN only – creates STUDENT / TEACHER / PARENT)
router.post(
  "/register",
  protect,                     // ✅ FUNCTION
  roleMiddleware(ROLES.ADMIN),
  authController.register
);

/* =====================================================
   AUTH ROUTES (PROTECTED)
   ===================================================== */

// 👤 Get logged-in user profile (all roles)
router.get(
  "/me",
  protect,                     // ✅ FUNCTION
  authController.getMyAccount
);

module.exports = router;

