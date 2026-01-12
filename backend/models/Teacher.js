const db = require("../config/db");

const Teacher = {

  /* =====================================================
     CREATE TEACHER PROFILE (ADMIN)
     User must already exist with role = TEACHER
     ===================================================== */
  create: (data, callback) => {
    const sql = `
      INSERT INTO teachers (user_id, department)
      VALUES (?, ?)
    `;

    db.query(
      sql,
      [
        data.user_id,
        data.department || null
      ],
      callback
    );
  },

  /* =====================================================
     GET ALL TEACHERS (ADMIN)
     ===================================================== */
  findAll: (callback) => {
    const sql = `
      SELECT
        t.id,
        t.user_id,
        u.name,
        u.email,
        t.department
      FROM teachers t
      JOIN users u ON t.user_id = u.id
      ORDER BY t.id DESC
    `;

    db.query(sql, callback);
  },

  /* =====================================================
     FIND TEACHER BY EMAIL (ADMIN)
     ===================================================== */
  findByEmail: (email, callback) => {
    const sql = `
      SELECT
        t.id,
        t.user_id,
        u.name,
        u.email,
        t.department
      FROM teachers t
      JOIN users u ON t.user_id = u.id
      WHERE u.email = ?
      LIMIT 1
    `;

    db.query(sql, [email], (err, rows) => {
      if (err) return callback(err);
      callback(null, rows[0] || null);
    });
  },

  /* =====================================================
     FIND TEACHER BY ID (ADMIN)
     ===================================================== */
  findById: (id, callback) => {
    const sql = `
      SELECT
        t.id,
        t.user_id,
        u.name,
        u.email,
        t.department
      FROM teachers t
      JOIN users u ON t.user_id = u.id
      WHERE t.id = ?
      LIMIT 1
    `;

    db.query(sql, [id], (err, rows) => {
      if (err) return callback(err);
      callback(null, rows[0] || null);
    });
  },

  /* =====================================================
     FIND TEACHER BY USER ID (TEACHER DASHBOARD)
     ===================================================== */
  findByUserId: (userId, callback) => {
    const sql = `
      SELECT
        t.id,
        u.name,
        u.email,
        t.department
      FROM teachers t
      JOIN users u ON t.user_id = u.id
      WHERE t.user_id = ?
      LIMIT 1
    `;

    db.query(sql, [userId], (err, rows) => {
      if (err) return callback(err);
      callback(null, rows[0] || null);
    });
  },

  /* =====================================================
     UPDATE TEACHER PROFILE (ADMIN)
     ===================================================== */
  update: (id, data, callback) => {
    const sql = `
      UPDATE teachers
      SET department = ?
      WHERE id = ?
    `;

    db.query(
      sql,
      [
        data.department || null,
        id
      ],
      callback
    );
  },

  /* =====================================================
     DELETE TEACHER (ADMIN)
     ===================================================== */
  delete: (id, callback) => {
    const sql = `
      DELETE FROM teachers WHERE id = ?
    `;
    db.query(sql, [id], callback);
  },

  /* =====================================================
     GET STUDENTS FOR TEACHER (DERIVED BY DEPARTMENT)
     🔥 THIS IS THE KEY FIX
     ===================================================== */
  getAssignedStudents: (teacherUserId, callback) => {
    const sql = `
      SELECT
        s.id AS student_id,
        s.roll_no,
        s.department,
        s.year,
        u.name AS student_name,
        u.email AS student_email
      FROM teachers t
      JOIN students s ON s.department = t.department
      JOIN users u ON s.user_id = u.id
      WHERE t.user_id = ?
      ORDER BY s.id DESC
    `;

    db.query(sql, [teacherUserId], callback);
  }

};

module.exports = Teacher;

