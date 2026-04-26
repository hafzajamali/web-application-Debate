// ============================================================
// FILE: server/server.js
// PURPOSE: Main entry point — starts Express server
// ============================================================

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// ── Middleware ──────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json()); // Parse JSON request bodies

// ── Routes ─────────────────────────────────────────────────
app.use("/api/auth",   require("./routes/authRoutes"));
app.use("/api/debate", require("./routes/debateRoutes"));

// ── Health Check ────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ message: "DebateAI Server is running ✅" });
});

// ── Start Server ────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
