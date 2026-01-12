const Student = require("../models/Student");
const db = require("../config/db");
const bcrypt = require("bcryptjs");
const ROLES = require("../config/roles");

const studentController = {

  /* =====================================================
     CREATE STUDENT (ADMIN ONLY)
     ===================================================== */
  createStudent: async (req, res) => {
    const { name, email, roll_no, department, year } = req.body;

    if (!name || !email || !roll_no) {
      return res.status(400).json({
        message: "name, email and roll_no are required"
      });
    }

    const defaultPassword = bcrypt.hashSync("123456", 10);

    db.beginTransaction(err => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      /* =========================
         1️⃣ CREATE USER
         ========================= */
      const userSql = `
        INSERT INTO users (name, email, password, role)
        VALUES (?, ?, ?, ?)
      `;

      db.query(
        userSql,
        [name, email, defaultPassword, ROLES.STUDENT],
        (err1, userResult) => {
          if (err1) {
            return db.rollback(() => {
              if (err1.code === "ER_DUP_ENTRY") {
                return res.status(400).json({
                  message: "Student email already exists"
                });
              }
              res.status(500).json({ error: err1.message });
            });
          }

          const userId = userResult.insertId;

          /* =========================
             2️⃣ CREATE STUDENT PROFILE
             ========================= */
          const studentSql = `
            INSERT INTO students (user_id, roll_no, department, year)
            VALUES (?, ?, ?, ?)
          `;

          db.query(
            studentSql,
            [userId, roll_no, department || null, year || null],
            (err2, studentResult) => {
              if (err2) {
                return db.rollback(() => {
                  res.status(500).json({ error: err2.message });
                });
              }

              db.commit(() => {
                res.status(201).json({
                  message: "Student created successfully",
                  studentId: studentResult.insertId
                });
              });
            }
          );
        }
      );
    });
  },

  /* =====================================================
     GET ALL STUDENTS (ADMIN / TEACHER)
     ===================================================== */
  getAllStudents: (req, res) => {
    Student.findAll((err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ data: results });
    });
  },

  /* =====================================================
     GET STUDENT BY ID (ADMIN / TEACHER)
     ===================================================== */
  getStudentById: (req, res) => {
    const { id } = req.params;

    Student.findById(id, (err, results) => {
      if (err) return res.status(500).json({ error: err.message });

      if (!results.length) {
        return res.status(404).json({ message: "Student not found" });
      }

      res.json(results[0]);
    });
  },

  /* =====================================================
     UPDATE STUDENT (ADMIN / TEACHER)
     ===================================================== */
  updateStudent: (req, res) => {
    const { id } = req.params;
    const { roll_no, department, year } = req.body;

    Student.update(id, { roll_no, department, year }, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      if (!result.affectedRows) {
        return res.status(404).json({ message: "Student not found" });
      }

      res.json({ message: "Student updated successfully" });
    });
  },

  /* =====================================================
     DELETE STUDENT (ADMIN)
     ===================================================== */
  deleteStudent: (req, res) => {
    const { id } = req.params;

    Student.delete(id, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      if (!result.affectedRows) {
        return res.status(404).json({ message: "Student not found" });
      }

      res.json({ message: "Student deleted successfully" });
    });
  },

  /* =====================================================
     STUDENT SELF PROFILE
     ===================================================== */
  getMyProfile: (req, res) => {
    Student.findByUserId(req.user.id, (err, results) => {
      if (err) return res.status(500).json({ error: err.message });

      if (!results.length) {
        return res.status(404).json({
          message: "Student profile not found"
        });
      }

      res.json(results[0]);
    });
  }
};

module.exports = studentController;


