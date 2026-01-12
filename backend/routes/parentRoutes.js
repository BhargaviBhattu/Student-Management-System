const express = require("express");
const router = express.Router();

const parentController = require("../controllers/parentController");
const commentController = require("../controllers/commentController");

const { protect } = require("../middleware/authMiddleware"); // ✅ FIX
const roleMiddleware = require("../middleware/roleMiddleware");
const ROLES = require("../config/roles");

/* =====================================================
   PARENT ROUTES
   ===================================================== */

// 👤 Parent → View own profile
router.get(
  "/me",
  protect,
  roleMiddleware(ROLES.PARENT),
  parentController.getMyProfile
);

// 👧 Parent → View own child
router.get(
  "/my-child",
  protect,
  roleMiddleware(ROLES.PARENT),
  parentController.getMyChild
);

// 📋 Parent → View child attendance
router.get(
  "/attendance",
  protect,
  roleMiddleware(ROLES.PARENT),
  parentController.getChildAttendance
);

// 💬 Parent → Add comment / complaint
router.post(
  "/comment",
  protect,
  roleMiddleware(ROLES.PARENT),
  commentController.addComment
);

// 💬 Parent → View own comments & teacher replies
router.get(
  "/comments",
  protect,
  roleMiddleware(ROLES.PARENT),
  commentController.getMyComments
);

module.exports = router;

