
// export default router;
import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const router = express.Router();

function ensureEnv(name) {
  if (!process.env[name]) {
    throw new Error(`Missing required env var: ${name}`);
  }
}

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    ensureEnv("JWT_SECRET");
    const { username, password } = req.body || {};

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
    if (typeof username !== "string" || typeof password !== "string") {
      return res.status(400).json({ message: "Invalid payload" });
    }

    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hash });

    const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    return res.status(201).json({ token });
  } catch (err) {
    // handle duplicate key (in case unique index catches it)
    if (err && err.code === 11000) {
      return res.status(400).json({ message: "User already exists" });
    }
    console.error("❌ Register error:", err?.stack || err);
    return res.status(500).json({ message: "Server error", detail: err?.message });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    ensureEnv("JWT_SECRET");
    const { username, password } = req.body || {};

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    return res.json({ token });
  } catch (err) {
    console.error("❌ Login error:", err?.stack || err);
    return res.status(500).json({ message: "Server error", detail: err?.message });
  }
});

export default router;
