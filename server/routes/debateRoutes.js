// ============================================================
// FILE: server/routes/debateRoutes.js
// PURPOSE: Debate API routes — all protected
// ============================================================

const express = require("express");
const router  = express.Router();
const {
  startDebate, sendMessage, scoreDebate, getHistory, getStats,
} = require("../controllers/debateController");
const { protect } = require("../middleware/authMiddleware");

// All routes require authentication
router.post("/start",   protect, startDebate);  // POST /api/debate/start
router.post("/message", protect, sendMessage);  // POST /api/debate/message
router.post("/score",   protect, scoreDebate);  // POST /api/debate/score
router.get("/history",  protect, getHistory);   // GET  /api/debate/history
router.get("/stats",    protect, getStats);     // GET  /api/debate/stats

module.exports = router;
