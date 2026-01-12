/**
 * ======================================================
 * Comment Validation Middleware
 * ======================================================
 * Used for Parent ↔ Teacher communication
 */

// ================= ADD COMMENT (PARENT) =================
const validateAddComment = (req, res, next) => {
  const { student_id, message } = req.body;

  if (!student_id || isNaN(student_id)) {
    return res.status(400).json({
      success: false,
      message: "Valid student_id is required"
    });
  }

  if (!message || message.trim().length < 5) {
    return res.status(400).json({
      success: false,
      message: "Comment must be at least 5 characters long"
    });
  }

  next();
};

// ================= REPLY COMMENT (TEACHER / ADMIN) =================
const validateReplyComment = (req, res, next) => {
  const { reply } = req.body;

  if (!reply || reply.trim().length < 3) {
    return res.status(400).json({
      success: false,
      message: "Reply must be at least 3 characters long"
    });
  }

  next();
};

module.exports = {
  validateAddComment,
  validateReplyComment
};
