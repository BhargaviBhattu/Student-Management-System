const db = require("../config/db");

const Comment = {

  /* ==================================================
     CREATE COMMENT (PARENT → TEACHER)
     ================================================== */
  create: (data, callback) => {
    const sql = `
      INSERT INTO comments
      (parent_id, student_id, teacher_id, message)
      VALUES (?, ?, ?, ?)
    `;

    db.query(
      sql,
      [
        data.parent_id,
        data.student_id,
        data.teacher_id || null, // optional
        data.message
      ],
      callback
    );
  },

  /* ==================================================
     GET COMMENTS FOR PARENT (PARENT DASHBOARD)
     ================================================== */
  getByParentId: (parentUserId, callback) => {

    // 1️⃣ Resolve parents.id from users.id
    const parentSql = `
      SELECT id FROM parents WHERE user_id = ?
    `;

    db.query(parentSql, [parentUserId], (err, parentRows) => {
      if (err) {
        console.error("Parent lookup failed:", err);
        return callback(err);
      }

      if (!parentRows.length) {
        return callback(null, []);
      }

      const parentId = parentRows[0].id;

      // 2️⃣ Fetch comments by parent_id
      const commentsSql = `
        SELECT
          c.id,
          c.message,
          c.reply,
          c.status,
          c.created_at,
          u_s.name AS student_name,
          s.roll_no
        FROM comments c
        JOIN students s ON c.student_id = s.id
        JOIN users u_s ON s.user_id = u_s.id
        WHERE c.parent_id = ?
        ORDER BY c.created_at DESC
      `;

      db.query(commentsSql, [parentId], (err2, rows) => {
        if (err2) {
          console.error("Parent comments fetch failed:", err2);
          return callback(err2);
        }

        callback(null, rows || []);
      });
    });
  },

  /* ==================================================
     GET COMMENTS FOR TEACHER (🔥 FINAL FIX)
     ================================================== */
 getByTeacherId: (teacherUserId, callback) => {
  const sql = `
    SELECT
      c.id,
      c.message,
      c.reply,
      c.status,
      c.created_at,
      u_p.name AS parent_name,
      u_s.name AS student_name,
      s.roll_no
    FROM comments c
    JOIN parents p ON c.parent_id = p.id
    JOIN users u_p ON p.user_id = u_p.id
    JOIN students s ON c.student_id = s.id
    JOIN users u_s ON s.user_id = u_s.id
    LEFT JOIN teachers t ON c.teacher_id = t.id
    WHERE c.teacher_id IS NULL
       OR t.user_id = ?
    ORDER BY c.created_at DESC
  `;

  db.query(sql, [teacherUserId], (err, rows) => {
    if (err) {
      console.error("Teacher comments fetch failed:", err);
      return callback(err);
    }

    callback(null, rows || []);
  });
},


  /* ==================================================
     GET COMMENT BY ID (FOR REPLY VALIDATION)
     ================================================== */
  getById: (commentId, callback) => {
    const sql = `
      SELECT *
      FROM comments
      WHERE id = ?
    `;

    db.query(sql, [commentId], (err, rows) => {
      if (err) {
        console.error("getById failed:", err);
        return callback(err);
      }

      callback(null, rows[0] || null);
    });
  },

  /* ==================================================
     REPLY TO COMMENT (TEACHER)
     ================================================== */
  reply: (commentId, reply, callback) => {
    const sql = `
      UPDATE comments
      SET reply = ?, status = 'REPLIED'
      WHERE id = ?
    `;

    db.query(sql, [reply, commentId], (err, result) => {
      if (err) {
        console.error("Reply update failed:", err);
        return callback(err);
      }

      callback(null, result);
    });
  },

  /* ==================================================
     DELETE COMMENT (ADMIN)
     ================================================== */
  delete: (commentId, callback) => {
    const sql = `DELETE FROM comments WHERE id = ?`;
    db.query(sql, [commentId], callback);
  }

};

module.exports = Comment;



