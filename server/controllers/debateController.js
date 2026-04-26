// ============================================================
// FILE: server/controllers/debateController.js
// PURPOSE: Start debate, send message to AI, score, history
// ============================================================

const fetch = require("node-fetch");
const Debate = require("../models/Debate");
const User   = require("../models/User");

// ── Helpers ─────────────────────────────────────────────────
const calcXP = (score) => Math.floor((score / 100) * 60) + 10;

const calcLevel = (xp) => {
  if (xp < 300)  return "Novice";
  if (xp < 800)  return "Apprentice";
  if (xp < 1500) return "Debater";
  if (xp < 2500) return "Orator";
  if (xp < 4000) return "Rhetorician";
  if (xp < 6000) return "Champion";
  return "Legend";
};

// Call Anthropic Claude API
const callAI = async (messages, systemPrompt) => {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 400,
      system: systemPrompt,
      messages: messages,
    }),
  });
  const data = await response.json();
  return data.content?.[0]?.text || "I could not generate a response.";
};

// ── POST /api/debate/start ───────────────────────────────────
// Creates a new debate session in DB
const startDebate = async (req, res) => {
  const { topic, topicIcon, difficulty, mode } = req.body;

  if (!topic) return res.status(400).json({ message: "Topic is required" });

  try {
    const debate = await Debate.create({
      user: req.user._id,
      topic,
      topicIcon: topicIcon || "💬",
      difficulty: difficulty || "medium",
      mode: mode || "formal",
      messages: [],
    });

    res.status(201).json({ debateId: debate._id, message: "Debate started" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── POST /api/debate/message ─────────────────────────────────
// User sends argument → AI replies
const sendMessage = async (req, res) => {
  const { debateId, userMessage } = req.body;

  if (!debateId || !userMessage) {
    return res.status(400).json({ message: "debateId and userMessage required" });
  }

  try {
    const debate = await Debate.findOne({ _id: debateId, user: req.user._id });
    if (!debate) return res.status(404).json({ message: "Debate not found" });

    // Build AI system prompt based on settings
    const diffMap = {
      easy:   "Be gentle, educational, and supportive while still opposing.",
      medium: "Be analytical, balanced, and challenge assumptions respectfully.",
      hard:   "Be aggressive, expert-level, use advanced rhetoric relentlessly.",
    };
    const modeMap = {
      friendly: "Use a collaborative, conversational tone.",
      formal:   "Use formal Oxford-style debate language and structure.",
      socratic: "Use probing Socratic questions alongside your counter-argument.",
    };

    const systemPrompt = `You are an elite debate opponent in an AI Debate Training platform.
Topic: "${debate.topic}"
Difficulty: ${debate.difficulty} — ${diffMap[debate.difficulty]}
Mode: ${debate.mode} — ${modeMap[debate.mode]}
Rules:
- Always take the OPPOSING side to the user
- Keep response to 80-120 words — punchy and precise
- Never agree with user, always challenge constructively
- Do not add labels like "Opponent:" — just respond directly`;

    // Build message history for context
    const apiMessages = debate.messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));
    apiMessages.push({ role: "user", content: userMessage });

    // Get AI response
    const aiReply = await callAI(apiMessages, systemPrompt);

    // Save both messages to debate
    debate.messages.push({ role: "user",      content: userMessage });
    debate.messages.push({ role: "assistant", content: aiReply });
    debate.rounds = Math.floor(debate.messages.length / 2);
    await debate.save();

    res.json({ aiReply, rounds: debate.rounds });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── POST /api/debate/score ───────────────────────────────────
// End debate — score it with AI, save results, award XP
const scoreDebate = async (req, res) => {
  const { debateId } = req.body;

  if (!debateId) return res.status(400).json({ message: "debateId required" });

  try {
    const debate = await Debate.findOne({ _id: debateId, user: req.user._id });
    if (!debate) return res.status(404).json({ message: "Debate not found" });
    if (debate.messages.length < 2) {
      return res.status(400).json({ message: "Not enough messages to score" });
    }

    // Build transcript
    const transcript = debate.messages
      .map((m) => `${m.role === "user" ? "DEBATER" : "OPPONENT"}: ${m.content}`)
      .join("\n\n");

    // Ask AI to score
    const scorePrompt = `You are a professional debate judge. Score the DEBATER only (not the opponent) in this debate on "${debate.topic}".

Transcript:
${transcript}

Score each criterion out of 20. Return ONLY valid JSON, no markdown, no extra text:
{"logic":0,"evidence":0,"relevance":0,"clarity":0,"strength":0,"strengths":["...","..."],"weaknesses":["...","..."],"suggestions":["...","..."]}`;

    const aiScoreRaw = await callAI(
      [{ role: "user", content: scorePrompt }],
      "You are a professional debate judge. Always respond with valid JSON only."
    );

    let scoreData;
    try {
      scoreData = JSON.parse(aiScoreRaw.replace(/```json|```/g, "").trim());
    } catch {
      scoreData = {
        logic: 13, evidence: 12, relevance: 14, clarity: 13, strength: 12,
        strengths: ["Took a clear position", "Engaged actively"],
        weaknesses: ["Needed more evidence", "Some gaps in logic"],
        suggestions: ["Use specific examples", "Anticipate counter-arguments"],
      };
    }

    const totalScore = (scoreData.logic || 0) + (scoreData.evidence || 0) +
                       (scoreData.relevance || 0) + (scoreData.clarity || 0) +
                       (scoreData.strength || 0);

    const xpGained = calcXP(totalScore);

    // Save results to debate
    debate.score          = totalScore;
    debate.scoreLogic     = scoreData.logic     || 0;
    debate.scoreEvidence  = scoreData.evidence  || 0;
    debate.scoreRelevance = scoreData.relevance || 0;
    debate.scoreClarity   = scoreData.clarity   || 0;
    debate.scoreStrength  = scoreData.strength  || 0;
    debate.strengths      = scoreData.strengths   || [];
    debate.weaknesses     = scoreData.weaknesses  || [];
    debate.suggestions    = scoreData.suggestions || [];
    debate.xpGained       = xpGained;
    debate.completed      = true;
    await debate.save();

    // Update user XP and level
    const user = await User.findById(req.user._id);
    user.xp   += xpGained;
    user.level = calcLevel(user.xp);
    await user.save();

    res.json({
      score: totalScore,
      scoreLogic:     scoreData.logic,
      scoreEvidence:  scoreData.evidence,
      scoreRelevance: scoreData.relevance,
      scoreClarity:   scoreData.clarity,
      scoreStrength:  scoreData.strength,
      strengths:      scoreData.strengths,
      weaknesses:     scoreData.weaknesses,
      suggestions:    scoreData.suggestions,
      xpGained,
      newXP:   user.xp,
      newLevel: user.level,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── GET /api/debate/history ──────────────────────────────────
// Get current user's debate history only
const getHistory = async (req, res) => {
  try {
    const debates = await Debate.find({
      user: req.user._id,
      completed: true,
    })
      .select("-messages") // Don't send full messages list
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(debates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── GET /api/debate/stats ────────────────────────────────────
// Get user's stats for dashboard
const getStats = async (req, res) => {
  try {
    const debates = await Debate.find({ user: req.user._id, completed: true });
    const total   = debates.length;
    const avg     = total ? Math.round(debates.reduce((s, d) => s + d.score, 0) / total) : 0;
    const best    = total ? Math.max(...debates.map((d) => d.score)) : 0;
    const totalXP = debates.reduce((s, d) => s + d.xpGained, 0);

    res.json({ total, avg, best, totalXP });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { startDebate, sendMessage, scoreDebate, getHistory, getStats };
