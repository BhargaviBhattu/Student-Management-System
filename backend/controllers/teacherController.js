const db = require("../config/db");
const Teacher = require("../models/Teacher");
const Attendance = require("../models/Attendance");
const Comment = require("../models/Comment");

/* =====================================================
   TEACHER CONTROLLER
   ===================================================== */
const teacherController = {

  /* =====================================================
     GET TEACHER PROFILE
     ===================================================== */
  getMyProfile: (req, res) => {
    const userId = req.user.id;

    Teacher.findByUserId(userId, (err, teacher) => {
      if (err) {
        console.error("Teacher profile error:", err);
        return res.status(500).json({ message: "Failed to load profile" });
      }

      if (!teacher) {
        return res.status(404).json({ message: "Teacher not found" });
      }

      res.json(teacher);
    });
  },

  /* =====================================================
     MANAGE STUDENTS (DASHBOARD)
     ===================================================== */
  getManageStudentsData: (req, res) => {
    const teacherUserId = req.user.id;

    const sql = `
      SELECT
        s.id AS student_id,
        u.name AS student_name,
        s.roll_no,
        s.department,
        s.year,
        a.id AS attendance_id,
        a.subject,
        a.marks,
        a.attendance_percentage
      FROM teachers t
      JOIN students s ON s.teacher_id = t.id
      JOIN users u ON s.user_id = u.id
      LEFT JOIN attendance a ON a.student_id = s.id
      WHERE t.user_id = ?
      ORDER BY u.name, a.subject
    `;

    db.query(sql, [teacherUserId], (err, rows) => {
      if (err) {
        console.error("MANAGE STUDENTS ERROR:", err);
        return res.status(500).json({
          message: "Failed to load students"
        });
      }

      res.json(rows || []);
    });
  },

  /* =====================================================
     🔥 ADD OR UPDATE ATTENDANCE (SMART)
     ===================================================== */
  saveAttendance: (req, res) => {
    const { student_id, subject, marks, attendance_percentage } = req.body;

    if (
      !student_id ||
      !subject ||
      marks === undefined ||
      attendance_percentage === undefined
    ) {
      return res.status(400).json({
        message: "student_id, subject, marks, attendance_percentage are required"
      });
    }

    // 1️⃣ Check if attendance exists
    Attendance.getByStudentAndSubject(
      student_id,
      subject,
      (err, existing) => {
        if (err) {
          console.error("ATTENDANCE CHECK ERROR:", err);
          return res.status(500).json({
            message: "Failed to process attendance"
          });
        }

        // 🔁 UPDATE
        if (existing) {
          Attendance.update(
            existing.id,
            marks,
            attendance_percentage,
            (err2) => {
              if (err2) {
                console.error("UPDATE ATTENDANCE ERROR:", err2);
                return res.status(500).json({
                  message: "Failed to update attendance"
                });
              }

              res.json({
                message: "Attendance updated successfully"
              });
            }
          );
        }
        // ➕ INSERT
        else {
          Attendance.create(
            student_id,
            subject,
            marks,
            attendance_percentage,
            (err3, result) => {
              if (err3) {
                console.error("ADD ATTENDANCE ERROR:", err3);
                return res.status(500).json({
                  message: "Failed to add attendance"
                });
              }

              res.status(201).json({
                message: "Attendance added successfully",
                attendanceId: result.insertId
              });
            }
          );
        }
      }
    );
  },

  /* =====================================================
     VIEW PARENT COMMENTS
     ===================================================== */
  getParentComments: (req, res) => {
    const teacherUserId = req.user.id;

    Comment.getByTeacherId(teacherUserId, (err, comments) => {
      if (err) {
        console.error("GET COMMENTS ERROR:", err);
        return res.status(500).json({
          message: "Failed to fetch comments"
        });
      }

      res.json(comments || []);
    });
  },

  /* =====================================================
     REPLY TO COMMENT
     ===================================================== */
  replyToComment: (req, res) => {
    const { id } = req.params;
    const { reply } = req.body;

    if (!reply || !reply.trim()) {
      return res.status(400).json({
        message: "Reply is required"
      });
    }

    Comment.reply(id, reply.trim(), (err, result) => {
      if (err) {
        console.error("REPLY ERROR:", err);
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
        message: "Reply sent successfully"
      });
    });
  }

};

module.exports = teacherController;


