const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();
const verifyJWT = require("../utils/verifyJWT");

// ✅ In-memory user store (for login & register)
const users = [
  { username: "teja", password: "0508" },
  { username: "admin", password: "admin" },
];

// 🔐 GET /api/auth/profile (protected route)
router.get("/profile", verifyJWT, (req, res) => {
  res.json({ message: `Welcome ${req.user.username}`, user: req.user });
});

// 🧠 POST /api/auth/login
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ username }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.json({ token });
});

// 🆕 POST /api/auth/register
router.post("/register", (req, res) => {
  const { username, password } = req.body;

  const existingUser = users.find(u => u.username === username);
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  users.push({ username, password });

  const token = jwt.sign({ username }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.json({ token });
});

module.exports = router;
