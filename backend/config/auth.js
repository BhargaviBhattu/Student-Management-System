/**
 * Authentication Utilities
 * Handles JWT generation and verification payload
 */

const jwt = require("jsonwebtoken");

// ==========================
// GENERATE JWT TOKEN
// ==========================
const generateToken = (user) => {
  if (!user || !user.id || !user.role) {
    throw new Error("Invalid user data for token generation");
  }

  return jwt.sign(
    {
      id: user.id,
      role: user.role,
      email: user.email
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",     // token valid for 24 hours
      issuer: "student-management-system"
    }
  );
};

module.exports = {
  generateToken
};

