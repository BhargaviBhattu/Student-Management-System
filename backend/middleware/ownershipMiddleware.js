/**
 * Ownership Middleware
 * Ensures users can access only their own resources
 * Admins and Teachers are allowed full access
 */

const ROLES = require("../config/roles");

const ownershipMiddleware = (options = {}) => {
  return (req, res, next) => {
    const { user } = req;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    // =========================
    // ADMIN & TEACHER → FULL ACCESS
    // =========================
    if (user.role === ROLES.ADMIN || user.role === ROLES.TEACHER) {
      return next();
    }

    // =========================
    // STUDENT → OWN DATA ONLY
    // =========================
    if (user.role === ROLES.STUDENT) {
      const requestedUserId =
        req.params.userId ||
        req.params.studentId ||
        req.body.user_id ||
        req.user.id;

      if (Number(requestedUserId) !== Number(user.id)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden: You can access only your own data"
        });
      }
      return next();
    }

    // =========================
    // PARENT → CHILD DATA ONLY
    // =========================
    if (user.role === ROLES.PARENT) {
      const requestedStudentId =
        req.params.studentId || req.body.student_id;

      if (!requestedStudentId) {
        return res.status(400).json({
          success: false,
          message: "Student ID required for parent access"
        });
      }

      // 🔒 Actual child ownership check will be done in controller
      // This middleware only enforces structure
      return next();
    }

    // =========================
    // FALLBACK
    // =========================
    return res.status(403).json({
      success: false,
      message: "Forbidden: Access denied"
    });
  };
};

module.exports = ownershipMiddleware;
