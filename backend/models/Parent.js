const db = require("../config/db");

const Parent = {

  /* =====================================================
     CREATE PARENT (ADMIN)
     ===================================================== */
  create: (data, callback) => {
    const sql = `
      INSERT INTO parents (user_id, phone)
      VALUES (?, ?)
    `;

    db.query(
      sql,
      [data.user_id, data.phone || null],
      callback
    );
  },

  /* =====================================================
     FIND PARENT PROFILE BY USER ID
     ===================================================== */
  findByUserId: (userId, callback) => {
    const sql = `
      SELECT *
      FROM parents
      WHERE user_id = ?
      LIMIT 1
    `;

    db.query(sql, [userId], (err, rows) => {
      if (err) return callback(err);
      callback(null, rows[0] || null);
    });
  },

  /* =====================================================
     FIND PARENT BY EMAIL (ADMIN / DEBUG)
     ===================================================== */
  findByEmail: (email, callback) => {
    const sql = `
      SELECT p.*
      FROM parents p
      JOIN users u ON p.user_id = u.id
      WHERE u.email = ?
      LIMIT 1
    `;

    db.query(sql, [email], (err, rows) => {
      if (err) return callback(err);
      callback(null, rows[0] || null);
    });
  },

  /* =====================================================
     GET ALL PARENTS (ADMIN)
     ===================================================== */
  findAll: (callback) => {
    const sql = `
      SELECT 
        p.id,
        p.user_id,
        u.name,
        u.email,
        p.phone
      FROM parents p
      JOIN users u ON p.user_id = u.id
      ORDER BY p.id DESC
    `;

    db.query(sql, callback);
  },

  /* =====================================================
     FIND CHILD USING PARENT ID
     (Parent Dashboard / Comments / Attendance)
     ===================================================== */
  findChildByParentId: (parentId, callback) => {
    const sql = `
      SELECT 
        s.id AS student_id,
        u.name,
        u.email,
        s.roll_no,
        s.department,
        s.year
      FROM students s
      JOIN users u ON s.user_id = u.id
      WHERE s.parent_id = ?
      LIMIT 1
    `;

    db.query(sql, [parentId], (err, rows) => {
      if (err) return callback(err);
      callback(null, rows[0] || null);
    });
  }

};

module.exports = Parent;

