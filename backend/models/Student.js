const db = require("../config/db");

const Student = {

  /* =====================================================
     CREATE STUDENT (ADMIN)
     ===================================================== */
  create: (data, callback) => {
    const sql = `
      INSERT INTO students (user_id, roll_no, department, year)
      VALUES (?, ?, ?, ?)
    `;

    db.query(
      sql,
      [
        data.user_id,
        data.roll_no,
        data.department,
        data.year
      ],
      callback
    );
  },

  /* =====================================================
     GET ALL STUDENTS (ADMIN)
     ===================================================== */
  findAll: (callback) => {
    const sql = `
      SELECT 
        s.id,
        s.user_id,
        u.name,
        u.email,
        s.roll_no,
        s.department,
        s.year
      FROM students s
      JOIN users u ON s.user_id = u.id
      ORDER BY s.id DESC
    `;

    db.query(sql, (err, rows) => {
      if (err) return callback(err);
      callback(null, rows);
    });
  },

  /* =====================================================
     GET STUDENT BY STUDENT ID (ADMIN)
     ===================================================== */
  findById: (id, callback) => {
    const sql = `
      SELECT 
        s.id,
        s.user_id,
        u.name,
        u.email,
        s.roll_no,
        s.department,
        s.year
      FROM students s
      JOIN users u ON s.user_id = u.id
      WHERE s.id = ?
      LIMIT 1
    `;

    db.query(sql, [id], (err, rows) => {
      if (err) return callback(err);
      callback(null, rows[0] || null);
    });
  },

  /* =====================================================
     UPDATE STUDENT (ADMIN / TEACHER)
     ===================================================== */
  update: (id, data, callback) => {
    const sql = `
      UPDATE students
      SET 
        roll_no = ?,
        department = ?,
        year = ?
      WHERE id = ?
    `;

    db.query(
      sql,
      [
        data.roll_no,
        data.department,
        data.year,
        id
      ],
      callback
    );
  },

  /* =====================================================
     DELETE STUDENT (ADMIN)
     ⚠️ STUDENT DELETION IS HANDLED VIA USER DELETE
     ===================================================== */
  delete: (id, callback) => {
    const sql = `
      DELETE FROM students WHERE id = ?
    `;

    db.query(sql, [id], callback);
  },

  /* =====================================================
     FIND STUDENT BY USER ID (STUDENT / PARENT)
     ===================================================== */
  findByUserId: (userId, callback) => {
    const sql = `
      SELECT 
        s.id,
        s.user_id,
        u.name,
        u.email,
        s.roll_no,
        s.department,
        s.year
      FROM students s
      JOIN users u ON s.user_id = u.id
      WHERE s.user_id = ?
      LIMIT 1
    `;

    db.query(sql, [userId], (err, rows) => {
      if (err) return callback(err);
      callback(null, rows[0] || null);
    });
  }

};

module.exports = Student;
