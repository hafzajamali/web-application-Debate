// ============================================================
// FILE: client/src/pages/Register.jsx
// PURPOSE: Registration form — calls authService.register()
// ============================================================

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../services/authService.js";

export default function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) { setError("Passwords do not match"); return; }
    if (password.length < 6)  { setError("Password must be at least 6 characters"); return; }
    setLoading(true);
    try {
      await register(username, email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card anim-in">
        <div className="auth-brand">DebateAI</div>
        <h2 className="auth-title">Create account</h2>
        <p className="auth-sub">Your debates. Your progress. Only yours.</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Username</label>
            <input value={username} onChange={e => setUsername(e.target.value)}
              placeholder="Alex Chen" required />
          </div>
          <div className="field">
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com" required />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="Min. 6 characters" required />
          </div>
          <div className="field">
            <label>Confirm Password</label>
            <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
              placeholder="Repeat password" required />
          </div>
          <button type="submit" className="btn-primary full" disabled={loading}>
            {loading ? "Creating account…" : "Create Account →"}
          </button>
        </form>

        <div className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
