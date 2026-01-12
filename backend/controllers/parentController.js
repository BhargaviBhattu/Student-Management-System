const Parent = require("../models/Parent");
const Attendance = require("../models/Attendance");
const Comment = require("../models/Comment");

/* =====================================================
   PARENT CONTROLLER (FINAL & STABLE)
   ===================================================== */
const parentController = {

  /* =====================================================
     GET PARENT PROFILE
     ===================================================== */
  getMyProfile: (req, res) => {
    const userId = req.user.id;

    Parent.findByUserId(userId, (err, parent) => {
      if (err) {
        console.error("Parent profile error:", err);
        return res.status(500).json({
          message: "Failed to fetch parent profile"
        });
      }

      if (!parent) {
        return res.status(404).json({
          message: "Parent profile not found"
        });
      }

      res.json(parent);
    });
  },

  /* =====================================================
     GET CHILD DETAILS
     ===================================================== */
  getMyChild: (req, res) => {
    const userId = req.user.id;

    Parent.findByUserId(userId, (err, parent) => {
      if (err || !parent) {
        return res.status(404).json({
          message: "Parent not found"
        });
      }

      Parent.findChildByParentId(parent.id, (err2, child) => {
        if (err2) {
          console.error("Child fetch error:", err2);
          return res.status(500).json({
            message: "Failed to fetch child"
          });
        }

        if (!child) {
          return res.status(404).json({
            message: "Child not found"
          });
        }

        res.json(child);
      });
    });
  },

  /* =====================================================
     GET CHILD ATTENDANCE  ✅ FIXED
     ===================================================== */
  getChildAttendance: (req, res) => {
    const userId = req.user.id;

    Parent.findByUserId(userId, (err, parent) => {
      if (err || !parent) {
        return res.status(404).json({
          message: "Parent not found"
        });
      }

      Parent.findChildByParentId(parent.id, (err2, child) => {
        if (err2 || !child) {
          return res.status(404).json({
            message: "Child not found"
          });
        }

        // ✅ USE child.id
        Attendance.getByStudentId(child.id, (err3, attendance) => {
          if (err3) {
            console.error("Attendance fetch error:", err3);
            return res.status(500).json({
              message: "Failed to fetch attendance"
            });
          }

          res.json(attendance || []);
        });
      });
    });
  },

  /* =====================================================
     ADD COMMENT / COMPLAINT  ✅ FIXED
     ===================================================== */
  addComment: (req, res) => {
    const userId = req.user.id;
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        message: "Comment message is required"
      });
    }

    Parent.findByUserId(userId, (err, parent) => {
      if (err || !parent) {
        return res.status(404).json({
          message: "Parent not found"
        });
      }

      Parent.findChildByParentId(parent.id, (err2, child) => {
        if (err2 || !child) {
          return res.status(404).json({
            message: "Child not found"
          });
        }

        Comment.create(
          {
            parent_id: parent.id,
            student_id: child.id,        // ✅ FIXED
            teacher_id: child.teacher_id || null,
            message: message.trim()
          },
          (err3, result) => {
            if (err3) {
              console.error("Add comment error:", err3);
              return res.status(500).json({
                message: "Failed to submit comment"
              });
            }

            res.status(201).json({
              message: "Comment submitted successfully",
              commentId: result.insertId
            });
          }
        );
      });
    });
  },

  /* =====================================================
     VIEW COMMENTS (PARENT)
     ===================================================== */
  getMyComments: (req, res) => {
    const userId = req.user.id;

    Comment.getByParentId(userId, (err, comments) => {
      if (err) {
        console.error("Get comments error:", err);
        return res.status(500).json({
          message: "Failed to fetch comments"
        });
      }

      res.json(comments || []);
    });
  }

};

module.exports = parentController;






