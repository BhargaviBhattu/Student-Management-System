/**
 * ======================================================
 * Student Validation Middleware
 * ======================================================
 * Used when ADMIN / TEACHER creates or updates students
 */

// ================= CREATE STUDENT =================
const validateCreateStudent = (req, res, next) => {
  const { name, email, roll_no } = req.body;

  if (!name || name.trim().length < 3) {
    return res.status(400).json({
      success: false,
      message: "Student name must be at least 3 characters long"
    });
  }

  if (!email || !email.includes("@")) {
    return res.status(400).json({
      success: false,
      message: "Valid email is required"
    });
  }

  if (!roll_no || roll_no.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: "Valid roll number is required"
    });
  }

  next();
};

// ================= UPDATE STUDENT =================
const validateUpdateStudent = (req, res, next) => {
  const { roll_no, department, year } = req.body;

  if (roll_no && roll_no.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: "Roll number must be valid"
    });
  }

  if (department && department.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: "Department must be valid"
    });
  }

  if (year && (isNaN(year) || year < 1 || year > 6)) {
    return res.status(400).json({
      success: false,
      message: "Year must be between 1 and 6"
    });
  }

  next();
};

module.exports = {
  validateCreateStudent,
  validateUpdateStudent
};
