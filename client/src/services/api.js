// ============================================================
// FILE: client/src/services/api.js
// PURPOSE: Axios instance — base URL + auto-attach JWT token
// ============================================================

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Auto-attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("debateai_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 — redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("debateai_token");
      localStorage.removeItem("debateai_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
