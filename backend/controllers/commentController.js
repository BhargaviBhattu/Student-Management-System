const Comment = require("../models/Comment");
const Parent = require("../models/Parent");

/* =====================================================
   ADD COMMENT (PARENT → TEACHER)
   ===================================================== */
const addComment = (req, res) => {
  const parentUserId = req.user.id;
  const { message } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ message: "Message is required" });
  }

  Parent.findByUserId(parentUserId, (err, parent) => {
    if (err || !parent) {
      return res.status(404).json({ message: "Parent not found" });
    }

    Parent.findChildByParentId(parent.id, (err2, child) => {
      if (err2 || !child) {
        return res.status(404).json({ message: "Child not found" });
      }

      Comment.create(
        {
          parent_id: parent.id,
          student_id: child.student_id, // ✅ FIX
          teacher_id: null,             // ✅ FIX
          message: message.trim()
        },
        (err3, result) => {
          if (err3) {
            console.error("Add comment error:", err3);
            return res.status(500).json({ message: "Failed to add comment" });
          }

          res.status(201).json({
            success: true,
            message: "Comment added successfully",
            commentId: result.insertId
          });
        }
      );
    });
  });
};


/* =====================================================
   GET MY COMMENTS (PARENT DASHBOARD)
   ===================================================== */
const getMyComments = (req, res) => {
  const parentUserId = req.user.id;

  Comment.getByParentId(parentUserId, (err, comments) => {
    if (err) {
      console.error("Get parent comments error:", err);
      return res.status(500).json({
        message: "Failed to fetch comments"
      });
    }

    res.json(comments || []);
  });
};

/* =====================================================
   GET COMMENTS FOR TEACHER DASHBOARD
   ===================================================== */
const getParentComments = (req, res) => {
  const teacherUserId = req.user.id;

  Comment.getByTeacherId(teacherUserId, (err, comments) => {
    if (err) {
      console.error("Get teacher comments error:", err);
      return res.status(500).json({
        message: "Failed to fetch comments"
      });
    }

    res.json(comments || []);
  });
};

/* =====================================================
   REPLY TO COMMENT (TEACHER)
   ===================================================== */
const replyToComment = (req, res) => {
  const { id } = req.params;
  const { reply } = req.body;

  if (!reply || !reply.trim()) {
    return res.status(400).json({
      message: "Reply is required"
    });
  }

  Comment.reply(id, reply.trim(), (err, result) => {
    if (err) {
      console.error("Reply update failed:", err);
      return res.status(500).json({
        message: "Failed to reply"
      });
    }

    if (!result.affectedRows) {
      return res.status(404).json({
        message: "Comment not found"
      });
    }

    res.json({
      success: true,
      message: "Reply sent successfully"
    });
  });
};

module.exports = {
  addComment,
  getMyComments,
  getParentComments,
  replyToComment
};





