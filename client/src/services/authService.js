// ============================================================
// FILE: client/src/services/authService.js
// PURPOSE: Auth API calls — register, login, logout
// ============================================================

import api from "./api.js";

export const register = async (username, email, password) => {
  const { data } = await api.post("/auth/register", { username, email, password });
  localStorage.setItem("debateai_token", data.token);
  localStorage.setItem("debateai_user",  JSON.stringify(data));
  return data;
};

export const login = async (email, password) => {
  const { data } = await api.post("/auth/login", { email, password });
  localStorage.setItem("debateai_token", data.token);
  localStorage.setItem("debateai_user",  JSON.stringify(data));
  return data;
};

export const logout = () => {
  localStorage.removeItem("debateai_token");
  localStorage.removeItem("debateai_user");
};

export const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("debateai_user"));
  } catch {
    return null;
  }
};
