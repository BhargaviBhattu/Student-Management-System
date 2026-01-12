/**
 * ======================================================
 * Attendance Validation Middleware
 * ======================================================
 * Used for ADMIN / TEACHER attendance operations
 */

const validateAddAttendance = (req, res, next) => {
  const { student_id, subject, marks, attendance_percentage } = req.body;

  if (!student_id) {
    return res.status(400).json({
      success: false,
      message: "student_id is required"
    });
  }

  if (!subject || subject.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "subject is required"
    });
  }

  if (marks === undefined || isNaN(marks)) {
    return res.status(400).json({
      success: false,
      message: "marks must be a valid number"
    });
  }

  if (
    attendance_percentage === undefined ||
    isNaN(attendance_percentage) ||
    attendance_percentage < 0 ||
    attendance_percentage > 100
  ) {
    return res.status(400).json({
      success: false,
      message: "attendance_percentage must be between 0 and 100"
    });
  }

  next();
};

const validateUpdateAttendance = (req, res, next) => {
  const { marks, attendance_percentage } = req.body;

  if (marks === undefined || isNaN(marks)) {
    return res.status(400).json({
      success: false,
      message: "marks must be a valid number"
    });
  }

  if (
    attendance_percentage === undefined ||
    isNaN(attendance_percentage) ||
    attendance_percentage < 0 ||
    attendance_percentage > 100
  ) {
    return res.status(400).json({
      success: false,
      message: "attendance_percentage must be between 0 and 100"
    });
  }

  next();
};

module.exports = {
  validateAddAttendance,
  validateUpdateAttendance
};
