// ============================================================
// FILE: client/src/App.jsx
// PURPOSE: Root component — sets up all routes with React Router
// ============================================================

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Landing    from "./pages/Landing.jsx";
import Login      from "./pages/Login.jsx";
import Register   from "./pages/Register.jsx";
import Dashboard  from "./pages/Dashboard.jsx";
import DebateRoom from "./pages/DebateRoom.jsx";
import Results    from "./pages/Results.jsx";

// ── Protected Route wrapper ──────────────────────────────────
// Redirects to /login if user not authenticated
function PrivateRoute({ children }) {
  const token = localStorage.getItem("debateai_token");
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/"          element={<Landing />} />
        <Route path="/login"     element={<Login />} />
        <Route path="/register"  element={<Register />} />

        {/* Protected routes — require login */}
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/debate"    element={<PrivateRoute><DebateRoom /></PrivateRoute>} />
        <Route path="/results"   element={<PrivateRoute><Results /></PrivateRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
