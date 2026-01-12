const db = require("../config/db");

const Attendance = {

  /* ==================================================
     CREATE ATTENDANCE
     ================================================== */
  create: (student_id, subject, marks, attendance_percentage, cb) => {
    const sql = `
      INSERT INTO attendance
      (student_id, subject, marks, attendance_percentage)
      VALUES (?, ?, ?, ?)
    `;
    db.query(sql, [student_id, subject, marks, attendance_percentage], cb);
  },

  /* ==================================================
     🔥 GET BY STUDENT + SUBJECT (REQUIRED)
     ================================================== */
  getByStudentAndSubject: (studentId, subject, cb) => {
    const sql = `
      SELECT *
      FROM attendance
      WHERE student_id = ? AND subject = ?
      LIMIT 1
    `;
    db.query(sql, [studentId, subject], (err, rows) => {
      if (err) return cb(err);
      cb(null, rows[0] || null);
    });
  },

  /* ==================================================
     GET ALL ATTENDANCE
     ================================================== */
  getAll: (cb) => {
    const sql = `
      SELECT
        a.id,
        a.subject,
        a.marks,
        a.attendance_percentage,
        a.student_id,
        s.roll_no,
        s.department,
        s.year,
        u.name AS student_name,
        u.email AS student_email,
        a.created_at
      FROM attendance a
      JOIN students s ON a.student_id = s.id
      JOIN users u ON s.user_id = u.id
      ORDER BY a.created_at DESC
    `;
    db.query(sql, cb);
  },

  /* ==================================================
     GET BY STUDENT ID
     ================================================== */
  getByStudentId: (studentId, cb) => {
    const sql = `
      SELECT
        a.subject,
        a.marks,
        a.attendance_percentage
      FROM attendance a
      WHERE a.student_id = ?
      ORDER BY a.subject ASC
    `;
    db.query(sql, [studentId], cb);
  },

  /* ==================================================
     UPDATE ATTENDANCE
     ================================================== */
  update: (id, marks, attendance_percentage, cb) => {
    const sql = `
      UPDATE attendance
      SET marks = ?, attendance_percentage = ?
      WHERE id = ?
    `;
    db.query(sql, [marks, attendance_percentage, id], cb);
  },

  /* ==================================================
     DELETE ATTENDANCE
     ================================================== */
  delete: (id, cb) => {
    const sql = `DELETE FROM attendance WHERE id = ?`;
    db.query(sql, [id], cb);
  }

};

module.exports = Attendance;






