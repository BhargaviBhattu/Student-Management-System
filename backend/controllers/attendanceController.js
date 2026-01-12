const Attendance = require("../models/Attendance");
const Student = require("../models/Student");
const Parent = require("../models/Parent");

/* =====================================================
   ADD ATTENDANCE (ADMIN / TEACHER)
   ===================================================== */
exports.addAttendance = (req, res) => {
  const { student_id, subject, marks, attendance_percentage } = req.body;

  if (!student_id || !subject || marks === undefined || attendance_percentage === undefined) {
    return res.status(400).json({
      message: "student_id, subject, marks, attendance_percentage are required"
    });
  }

  Attendance.create(
    student_id,
    subject,
    marks,
    attendance_percentage,
    (err, result) => {
      if (err) {
        console.error("ADD ATTENDANCE ERROR:", err);
        return res.status(500).json({ message: "Failed to add attendance" });
      }

      res.status(201).json({
        message: "Attendance added successfully",
        attendanceId: result.insertId
      });
    }
  );
};

/* =====================================================
   GET ALL ATTENDANCE (ADMIN / TEACHER)
   ===================================================== */
exports.getAllAttendance = (req, res) => {
  Attendance.getAll((err, results) => {
    if (err) {
      console.error("FETCH ALL ATTENDANCE ERROR:", err);
      return res.status(500).json({ message: "Failed to fetch attendance" });
    }

    res.json(results || []);
  });
};

/* =====================================================
   GET OWN ATTENDANCE (STUDENT)
   ===================================================== */
exports.getMyAttendance = (req, res) => {
  const userId = req.user.id;

  Student.findByUserId(userId, (err, student) => {
    if (err) {
      return res.status(500).json({ message: "Failed to fetch student profile" });
    }

    if (!student) {
      return res.status(404).json({ message: "Student profile not found" });
    }

    Attendance.getByStudentId(student.id, (err2, attendance) => {
      if (err2) {
        return res.status(500).json({ message: "Failed to fetch attendance" });
      }

      res.json(attendance || []);
    });
  });
};

/* =====================================================
   GET CHILD ATTENDANCE (PARENT) ✅ FIXED
   ===================================================== */
exports.getChildAttendance = (req, res) => {
  const userId = req.user.id;

  Parent.findByUserId(userId, (err, parent) => {
    if (err || !parent) {
      return res.status(404).json({ message: "Parent not found" });
    }

    Parent.findChildByParentId(parent.id, (err2, child) => {
      if (err2 || !child) {
        return res.status(404).json({ message: "Child not found" });
      }

      // ✅ FIX IS HERE
      Attendance.getByStudentId(child.student_id, (err3, attendance) => {
        if (err3) {
          return res.status(500).json({ message: "Failed to fetch attendance" });
        }

        res.json(attendance || []);
      });
    });
  });
};


/* =====================================================
   UPDATE ATTENDANCE (ADMIN / TEACHER)
   ===================================================== */
exports.updateAttendance = (req, res) => {
  const { id } = req.params;
  const { marks, attendance_percentage } = req.body;

  if (marks === undefined || attendance_percentage === undefined) {
    return res.status(400).json({
      message: "marks and attendance_percentage are required"
    });
  }

  Attendance.update(id, marks, attendance_percentage, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Failed to update attendance" });
    }

    if (!result.affectedRows) {
      return res.status(404).json({ message: "Attendance record not found" });
    }

    res.json({ message: "Attendance updated successfully" });
  });
};

/* =====================================================
   DELETE ATTENDANCE (ADMIN)
   ===================================================== */
exports.deleteAttendance = (req, res) => {
  const { id } = req.params;

  Attendance.delete(id, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Failed to delete attendance" });
    }

    if (!result.affectedRows) {
      return res.status(404).json({ message: "Attendance record not found" });
    }

    res.json({ message: "Attendance deleted successfully" });
  });
};






