// ============================================================
// FILE: server/routes/authRoutes.js
// PURPOSE: Auth API routes
// ============================================================

const express = require("express");
const router  = express.Router();
const { register, login, getProfile } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

router.post("/register", register);          // POST /api/auth/register
router.post("/login",    login);             // POST /api/auth/login
router.get("/profile",   protect, getProfile); // GET  /api/auth/profile  (protected)

module.exports = router;
