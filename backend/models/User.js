const db = require("../config/db");

const User = {

  // ==================================================
  // CREATE USER (ADMIN / SYSTEM)
  // ==================================================
  create: (userData, callback) => {
    const sql = `
      INSERT INTO users (name, email, password, role)
      VALUES (?, ?, ?, ?)
    `;

    const values = [
      userData.name,
      userData.email,
      userData.password,              // ⚠️ must already be hashed
      userData.role || "STUDENT"       // ADMIN | TEACHER | STUDENT | PARENT
    ];

    db.query(sql, values, callback);
  },

  // ==================================================
  // FIND USER BY EMAIL (LOGIN)
  // ==================================================
  findByEmail: (email, callback) => {
    const sql = `
      SELECT 
        id,
        name,
        email,
        password,
        role,
        created_at
      FROM users
      WHERE email = ?
    `;

    db.query(sql, [email], callback);
  },

  // ==================================================
  // FIND USER BY ID
  // ==================================================
  findById: (id, callback) => {
    const sql = `
      SELECT 
        id,
        name,
        email,
        role,
        created_at
      FROM users
      WHERE id = ?
    `;

    db.query(sql, [id], callback);
  },

  // ==================================================
  // GET ALL USERS (ADMIN)
  // ==================================================
  findAll: (callback) => {
    const sql = `
      SELECT 
        id,
        name,
        email,
        role,
        created_at
      FROM users
      ORDER BY id DESC
    `;

    db.query(sql, callback);
  },

  // ==================================================
  // UPDATE USER BASIC INFO (ADMIN / TEACHER)
  // ==================================================
  update: (id, data, callback) => {
    const sql = `
      UPDATE users
      SET 
        name = ?,
        email = ?,
        role = ?
      WHERE id = ?
    `;

    db.query(
      sql,
      [
        data.name,
        data.email,
        data.role,
        id
      ],
      callback
    );
  },

  // ==================================================
  // UPDATE PASSWORD
  // ==================================================
  updatePassword: (id, hashedPassword, callback) => {
    const sql = `
      UPDATE users
      SET password = ?
      WHERE id = ?
    `;

    db.query(sql, [hashedPassword, id], callback);
  },

  // ==================================================
  // DELETE USER (ADMIN)
  // ==================================================
  delete: (id, callback) => {
    const sql = `DELETE FROM users WHERE id = ?`;
    db.query(sql, [id], callback);
  }

};

module.exports = User;

