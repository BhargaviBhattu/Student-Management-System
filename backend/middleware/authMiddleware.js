/**
 * Authentication Middleware
 * Verifies JWT and attaches user payload to request
 */

const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Token missing"
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: decoded.id,
      role: decoded.role,
      email: decoded.email
    };

    next();
  } catch (error) {
    console.error("AUTH ERROR:", error.message);
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Invalid or expired token"
    });
  }
};

module.exports = { protect }; // ✅ KEY FIX


