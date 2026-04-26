// ============================================================
// FILE: server/models/Debate.js
// PURPOSE: MongoDB schema for debate sessions & results
// ============================================================

const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  role: { type: String, enum: ["user", "assistant"], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const DebateSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  topic: {
    type: String,
    required: true,
    trim: true,
  },
  topicIcon: {
    type: String,
    default: "💬",
  },
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    default: "medium",
  },
  mode: {
    type: String,
    enum: ["friendly", "formal", "socratic"],
    default: "formal",
  },
  messages: [MessageSchema],

  // Scoring
  score: { type: Number, default: 0 },
  scoreLogic:     { type: Number, default: 0 },
  scoreEvidence:  { type: Number, default: 0 },
  scoreRelevance: { type: Number, default: 0 },
  scoreClarity:   { type: Number, default: 0 },
  scoreStrength:  { type: Number, default: 0 },

  // AI Feedback
  strengths:   [String],
  weaknesses:  [String],
  suggestions: [String],

  xpGained: { type: Number, default: 0 },
  rounds:   { type: Number, default: 0 },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Debate", DebateSchema);
