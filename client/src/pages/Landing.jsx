// ============================================================
// FILE: client/src/pages/Landing.jsx
// PURPOSE: Home page — hero, features, CTA buttons
// ============================================================

import { useNavigate } from "react-router-dom";

const FEATURES = [
  { icon: "🤖", title: "Live AI Opponent",    desc: "Debates back with intelligent counter-arguments in real time." },
  { icon: "📊", title: "5-Criteria Scoring",  desc: "Graded on Logic, Evidence, Relevance, Clarity, and Strength." },
  { icon: "🏆", title: "XP & Level System",   desc: "Earn XP every debate. Rise from Novice to Legend." },
  { icon: "🔒", title: "Private Records",     desc: "Every user sees only their own history. 100% isolated." },
];

const TOPICS = ["AI Ethics", "Climate Policy", "Universal Basic Income", "Social Media", "Space Exploration", "Drug Legalization"];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", overflow: "hidden" }}>

      {/* ── Nav ── */}
      <nav style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "20px 48px", borderBottom: "1px solid var(--border)", position: "relative", zIndex: 1,
      }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 22, letterSpacing: "-0.5px" }}>
          Debate<span style={{ color: "var(--accent2)" }}>AI</span>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button className="btn-outline" onClick={() => navigate("/login")} style={{ padding: "9px 22px" }}>
            Sign In
          </button>
          <button className="btn-primary" onClick={() => navigate("/register")} style={{ padding: "9px 22px" }}>
            Get Started
          </button>
        </div>
      </nav>

      {/* ── Glow BG ── */}
      <div style={{
        position: "fixed", top: "-40%", left: "-20%", width: "80vw", height: "80vh",
        background: "radial-gradient(ellipse, rgba(108,99,255,0.07) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* ── Hero ── */}
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", padding: "80px 40px", textAlign: "center", position: "relative", zIndex: 1,
      }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "rgba(108,99,255,0.1)", border: "1px solid rgba(108,99,255,0.3)",
          padding: "6px 18px", borderRadius: "100px", fontSize: 12,
          color: "var(--accent2)", fontFamily: "var(--font-mono)", letterSpacing: ".06em",
          marginBottom: 32, textTransform: "uppercase",
        }}>
          ⚡ AI-Powered Argument Training
        </div>

        <h1 style={{
          fontFamily: "var(--font-display)", fontSize: "clamp(46px,8vw,90px)",
          fontWeight: 800, lineHeight: 1.0, letterSpacing: "-3px", marginBottom: 22,
        }}>
          Master the Art<br />
          of{" "}
          <span style={{
            background: "linear-gradient(135deg, var(--accent) 0%, var(--gold) 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            Debate
          </span>
        </h1>

        <p style={{
          fontSize: 18, color: "var(--text2)", maxWidth: 520,
          lineHeight: 1.7, marginBottom: 44, fontWeight: 300,
        }}>
          Practice unlimited debate topics against a live AI opponent. Get scored on 5 criteria, earn XP, level up, and track your improvement.
        </p>

        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center", marginBottom: 64 }}>
          <button className="btn-primary" onClick={() => navigate("/register")} style={{ padding: "15px 44px", fontSize: 16 }}>
            Start Debating — Free
          </button>
          <button className="btn-outline" onClick={() => navigate("/login")} style={{ padding: "15px 44px", fontSize: 16 }}>
            Sign In
          </button>
        </div>

        {/* Topic pills */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginBottom: 72, maxWidth: 600 }}>
          {TOPICS.map(t => (
            <span key={t} style={{
              background: "var(--surface)", border: "1px solid var(--border)",
              padding: "6px 16px", borderRadius: "100px", fontSize: 13, color: "var(--text2)",
            }}>{t}</span>
          ))}
          <span style={{
            background: "var(--gold-dim)", border: "1px solid rgba(232,184,75,.3)",
            padding: "6px 16px", borderRadius: "100px", fontSize: 13, color: "var(--gold)",
          }}>+ Any custom topic</span>
        </div>

        {/* Features */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))",
          gap: 14, maxWidth: 900, width: "100%",
        }}>
          {FEATURES.map(f => (
            <div key={f.title} style={{
              background: "var(--bg3)", border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)", padding: "26px 22px", textAlign: "left",
              transition: "all .22s", cursor: "default",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "none"; }}
            >
              <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 7 }}>{f.title}</h3>
              <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
