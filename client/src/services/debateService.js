// ============================================================
// FILE: client/src/services/debateService.js
// PURPOSE: Debate API calls — start, message, score, history
// ============================================================

import api from "./api.js";

export const startDebate = async (topic, topicIcon, difficulty, mode) => {
  const { data } = await api.post("/debate/start", { topic, topicIcon, difficulty, mode });
  return data; // { debateId }
};

export const sendMessage = async (debateId, userMessage) => {
  const { data } = await api.post("/debate/message", { debateId, userMessage });
  return data; // { aiReply, rounds }
};

export const scoreDebate = async (debateId) => {
  const { data } = await api.post("/debate/score", { debateId });
  return data;
};

export const getHistory = async () => {
  const { data } = await api.get("/debate/history");
  return data;
};

export const getStats = async () => {
  const { data } = await api.get("/debate/stats");
  return data;
};
