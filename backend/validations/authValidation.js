/**
 * ======================================================
 * Auth Validation Middleware
 * ======================================================
 * Used for login & register APIs
 */

// ================= REGISTER VALIDATION =================
const validateRegister = (req, res, next) => {
  const { name, email, password, role } = req.body;

  if (!name || name.trim().length < 3) {
    return res.status(400).json({
      success: false,
      message: "Name must be at least 3 characters long"
    });
  }

  if (!email || !email.includes("@")) {
    return res.status(400).json({
      success: false,
      message: "Valid email is required"
    });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 6 characters"
    });
  }

  if (role && !["ADMIN", "TEACHER", "STUDENT", "PARENT"].includes(role)) {
    return res.status(400).json({
      success: false,
      message: "Invalid role provided"
    });
  }

  next();
};

// ================= LOGIN VALIDATION =================
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !email.includes("@")) {
    return res.status(400).json({
      success: false,
      message: "Valid email is required"
    });
  }

  if (!password) {
    return res.status(400).json({
      success: false,
      message: "Password is required"
    });
  }

  next();
};

module.exports = {
  validateRegister,
  validateLogin
};
