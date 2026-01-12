/**
 * Role-Based Access Control Middleware
 * Supports single or multiple allowed roles
 */

const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {

    // =========================
    // AUTH CHECK
    // =========================
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Authentication required"
      });
    }

    const userRole = req.user.role.toUpperCase();

    // =========================
    // ROLE CHECK
    // =========================
    if (!allowedRoles.map(r => r.toUpperCase()).includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Role '${userRole}' is not allowed`
      });
    }

    // =========================
    // ACCESS GRANTED
    // =========================
    next();
  };
};

module.exports = roleMiddleware;


