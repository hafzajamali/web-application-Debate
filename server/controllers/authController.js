// ============================================================
// FILE: server/controllers/authController.js
// PURPOSE: Register, Login, Get Profile logic
// ============================================================

const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// Level calculator based on XP
const calcLevel = (xp) => {
  if (xp < 300)  return "Novice";
  if (xp < 800)  return "Apprentice";
  if (xp < 1500) return "Debater";
  if (xp < 2500) return "Orator";
  if (xp < 4000) return "Rhetorician";
  if (xp < 6000) return "Champion";
  return "Legend";
};

// ── POST /api/auth/register ──────────────────────────────────
const register = async (req, res) => {
  const { username, email, password } = req.body;

  // Validation
  if (!username || !email || !password) {
    return res.status(400).json({ message: "Please fill all fields" });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  try {
    // Check if email already exists
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Create user (password auto-hashed in model pre-save hook)
    const user = await User.create({ username, email, password });

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      xp: user.xp,
      level: user.level,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── POST /api/auth/login ─────────────────────────────────────
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please provide email and password" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      xp: user.xp,
      level: user.level,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── GET /api/auth/profile ────────────────────────────────────
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login, getProfile };
