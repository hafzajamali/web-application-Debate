// ============================================================
// FILE: client/src/components/Navbar.jsx
// PURPOSE: Top navigation bar used on protected pages
// ============================================================

import { useNavigate } from "react-router-dom";
import { logout, getStoredUser } from "../services/authService.js";

export default function Navbar() {
  const navigate = useNavigate();
  const user = getStoredUser();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="topbar">
      <div className="topbar-brand" onClick={() => navigate("/dashboard")} style={{ cursor: "pointer" }}>
        Debate<span>AI</span>
      </div>
      <div className="topbar-right">
        {user && (
          <>
            <div className="xp-pill">⚡ {user.xp || 0} XP</div>
            <div className="user-chip">
              <div className="avatar">{(user.username || "U")[0].toUpperCase()}</div>
              <span>{user.username}</span>
            </div>
          </>
        )}
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}
