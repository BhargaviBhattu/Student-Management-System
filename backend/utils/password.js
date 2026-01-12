const bcrypt = require("bcryptjs");

/**
 * ==========================================
 * Hash Password
 * ==========================================
 * Used during:
 * - User registration
 * - Admin/Teacher creating users
 */
const hashPassword = async (plainPassword) => {
  const saltRounds = 10;
  return await bcrypt.hash(plainPassword, saltRounds);
};

/**
 * ==========================================
 * Compare Password
 * ==========================================
 * Used during login
 */
const comparePassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

module.exports = {
  hashPassword,
  comparePassword
};
