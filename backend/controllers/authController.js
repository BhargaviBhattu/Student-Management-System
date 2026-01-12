const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { generateToken } = require("../utils/jwt");

const authController = {};

// ================= REGISTER =================
authController.register = (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  User.findByEmail(email, (err, users) => {
    if (err) return res.status(500).json({ error: err.message });

    if (users.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    User.create(
      { name, email, password: hashedPassword, role },
      (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        res.status(201).json({
          message: "User registered successfully",
          userId: result.insertId
        });
      }
    );
  });
};

// ================= LOGIN =================
authController.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  User.findByEmail(email, (err, users) => {
    if (err) return res.status(500).json({ error: err.message });

    if (users.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = users[0];
    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);

    res.json({
  token,
  user: {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  }
});

  });
};

// ================= GET MY ACCOUNT =================
authController.getMyAccount = (req, res) => {
  User.findById(req.user.id, (err, users) => {
    if (err) return res.status(500).json({ error: err.message });

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = users[0];
    delete user.password;

    res.json(user);
  });
};

module.exports = authController;

