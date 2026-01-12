const express = require("express");
const router = express.Router();

const commentController = require("../controllers/commentController");
const { protect } = require("../middleware/authMiddleware"); // ✅ FIX
const roleMiddleware = require("../middleware/roleMiddleware");
const ROLES = require("../config/roles");

/* =====================================================
   PARENT ROUTES
   ===================================================== */

/**
 * Parent → Add a new comment / complaint
 * POST /api/comments
 */
router.post(
  "/",
  protect,
  roleMiddleware(ROLES.PARENT),
  commentController.addComment
);

/**
 * Parent → View own comment history
 * GET /api/comments/my
 */
router.get(
  "/my",
  protect,
  roleMiddleware(ROLES.PARENT),
  commentController.getMyComments
);

/* =====================================================
   TEACHER ROUTES
   ===================================================== */

/**
 * Teacher → View parent comments assigned to them
 * GET /api/comments/teacher
 */
router.get(
  "/teacher",
  protect,
  roleMiddleware(ROLES.TEACHER),
  commentController.getParentComments
);

/**
 * Teacher → Reply to a parent comment
 * PUT /api/comments/reply/:id
 */
router.put(
  "/reply/:id",
  protect,
  roleMiddleware(ROLES.TEACHER),
  commentController.replyToComment
);

module.exports = router;






