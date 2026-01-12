const bcrypt = require("bcryptjs");
const db = require("../config/db");

/* =====================================================
   ADMIN CONTROLLER
   ===================================================== */
const adminController = {

  /* =====================================================
     VIEW STUDENTS
     ===================================================== */
  getAllStudents: (req, res) => {
    const sql = `
      SELECT
        s.id,
        s.user_id,
        s.roll_no,
        s.department,
        s.year,
        u.name,
        u.email,
        t.id AS teacher_id,
        ut.name AS teacher_name
      FROM students s
      JOIN users u ON s.user_id = u.id
      LEFT JOIN teachers t ON s.teacher_id = t.id
      LEFT JOIN users ut ON t.user_id = ut.id
      ORDER BY s.id DESC
    `;

    db.query(sql, (err, rows) => {
      if (err) {
        console.error("Fetch students error:", err);
        return res.status(500).json({ message: "Failed to fetch students" });
      }
      res.json(rows || []);
    });
  },

  /* =====================================================
     ADD STUDENT (WITH TEACHER ASSIGNMENT)
     ===================================================== */
  addStudent: async (req, res) => {
    const connection = await db.promise().getConnection();

    try {
      const {
        name,
        email,
        password,
        roll_no,
        department,
        year,
        teacher_id
      } = req.body;

      if (
        !name?.trim() ||
        !email?.trim() ||
        !password ||
        !roll_no?.trim() ||
        !department?.trim() ||
        !Number.isInteger(year)
      ) {
        return res.status(400).json({
          message: "Required fields missing or invalid"
        });
      }

      await connection.beginTransaction();

      // ❌ Prevent duplicate user
      const [exists] = await connection.query(
        `SELECT id FROM users WHERE email = ?`,
        [email]
      );

      if (exists.length) {
        throw new Error("User with this email already exists");
      }

      // 🔐 Create USER
      const hashedPassword = await bcrypt.hash(password, 10);

      const [userResult] = await connection.query(
        `INSERT INTO users (name, email, password, role)
         VALUES (?, ?, ?, 'STUDENT')`,
        [name, email, hashedPassword]
      );

      // 🎓 Create STUDENT + assign teacher
      await connection.query(
        `INSERT INTO students (user_id, roll_no, department, year, teacher_id)
         VALUES (?, ?, ?, ?, ?)`,
        [
          userResult.insertId,
          roll_no,
          department,
          year,
          teacher_id || null
        ]
      );

      await connection.commit();

      res.status(201).json({
        message: "Student added successfully"
      });

    } catch (err) {
      await connection.rollback();
      console.error("Add student failed:", err.message);
      res.status(400).json({ message: err.message });
    } finally {
      connection.release();
    }
  },

  /* =====================================================
     ADD PARENT (LINK TO STUDENT)
     ===================================================== */
  addParent: async (req, res) => {
    const { name, email, password, phone, student_id } = req.body;

    if (!name || !email || !password || !student_id) {
      return res.status(400).json({
        message: "Name, email, password and student_id are required"
      });
    }

    const connection = await db.promise().getConnection();

    try {
      await connection.beginTransaction();

      const [exists] = await connection.query(
        `SELECT id FROM users WHERE email = ?`,
        [email]
      );

      if (exists.length) {
        throw new Error("User with this email already exists");
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const [userResult] = await connection.query(
        `INSERT INTO users (name, email, password, role)
         VALUES (?, ?, ?, 'PARENT')`,
        [name, email, hashedPassword]
      );

      const [parentResult] = await connection.query(
        `INSERT INTO parents (user_id, phone)
         VALUES (?, ?)`,
        [userResult.insertId, phone || null]
      );

      // 🔗 Link parent to student
      await connection.query(
        `UPDATE students SET parent_id = ? WHERE id = ?`,
        [parentResult.insertId, student_id]
      );

      await connection.commit();

      res.status(201).json({
        message: "Parent added and linked successfully"
      });

    } catch (err) {
      await connection.rollback();
      console.error("Add parent error:", err.message);
      res.status(400).json({ message: err.message });
    } finally {
      connection.release();
    }
  },

  /* =====================================================
     ADD TEACHER
     ===================================================== */
  addTeacher: async (req, res) => {
    const { name, email, password, department } = req.body;

    if (!name || !email || !password || !department) {
      return res.status(400).json({
        message: "Name, email, password and department are required"
      });
    }

    try {
      const [exists] = await db.promise().query(
        `SELECT id FROM users WHERE email = ?`,
        [email]
      );

      if (exists.length) {
        throw new Error("User with this email already exists");
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const [userResult] = await db.promise().query(
        `INSERT INTO users (name, email, password, role)
         VALUES (?, ?, ?, 'TEACHER')`,
        [name, email, hashedPassword]
      );

      await db.promise().query(
        `INSERT INTO teachers (user_id, department)
         VALUES (?, ?)`,
        [userResult.insertId, department]
      );

      res.status(201).json({
        message: "Teacher added successfully"
      });

    } catch (err) {
      console.error("Add teacher error:", err.message);
      res.status(400).json({ message: err.message });
    }
  },

  /* =====================================================
     GET ALL TEACHERS (FOR DROPDOWNS)
     ===================================================== */
  getAllTeachers: (req, res) => {
    const sql = `
      SELECT
        t.id,
        u.name,
        u.email,
        t.department
      FROM teachers t
      JOIN users u ON t.user_id = u.id
      ORDER BY t.id DESC
    `;

    db.query(sql, (err, rows) => {
      if (err) {
        console.error("Fetch teachers error:", err);
        return res.status(500).json({
          message: "Failed to fetch teachers"
        });
      }

      res.json(rows || []);
    });
  },

  /* =====================================================
     DELETE USER
     ===================================================== */
  deleteUser: (req, res) => {
    const { id } = req.params;

    db.query(`DELETE FROM users WHERE id = ?`, [id], (err, result) => {
      if (err) {
        console.error("Delete user error:", err);
        return res.status(500).json({
          message: "Failed to delete user"
        });
      }

      if (!result.affectedRows) {
        return res.status(404).json({
          message: "User not found"
        });
      }

      res.json({
        message: "User deleted successfully"
      });
    });
  }
};

module.exports = adminController;





