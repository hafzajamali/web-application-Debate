// ============================================================
// FILE: client/src/pages/Dashboard.jsx
// PURPOSE: Main control panel — stats, topics, history
// ============================================================

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Loader from "../components/Loader.jsx";
import { logout, getStoredUser } from "../services/authService.js";
import { getHistory, getStats } from "../services/debateService.js";

const CATEGORIES = [
  {
    id: "ai", label: "🤖 Artificial Intelligence", topics: [
      { icon: "🎓", name: "AI in Education" },
      { icon: "💼", name: "AI & Employment" },
      { icon: "⚖️", name: "AI Ethics" },
      { icon: "🏥", name: "AI in Healthcare" },
      { icon: "🎨", name: "AI & Creativity" },
      { icon: "🛡️", name: "AI in Warfare" },
    ],
  },
  {
    id: "tech", label: "💻 Technology", topics: [
      { icon: "📱", name: "Social Media" },
      { icon: "₿",  name: "Cryptocurrency" },
      { icon: "🔒", name: "Digital Privacy" },
      { icon: "🚀", name: "Space Exploration" },
    ],
  },
  {
    id: "society", label: "🌍 Society", topics: [
      { icon: "💰", name: "Universal Basic Income" },
      { icon: "🏠", name: "Remote Work" },
      { icon: "🌱", name: "Climate Policy" },
      { icon: "📚", name: "Free University" },
    ],
  },
  {
    id: "philosophy", label: "🧠 Philosophy", topics: [
      { icon: "⚰️", name: "Capital Punishment" },
      { icon: "🕊️", name: "Free Will" },
      { icon: "💊", name: "Drug Legalization" },
      { icon: "🐾", name: "Animal Rights" },
    ],
  },
];

const LEVELS = [
  { name: "Novice", min: 0, max: 300 },
  { name: "Apprentice", min: 300, max: 800 },
  { name: "Debater", min: 800, max: 1500 },
  { name: "Orator", min: 1500, max: 2500 },
  { name: "Rhetorician", min: 2500, max: 4000 },
  { name: "Champion", min: 4000, max: 6000 },
  { name: "Legend", min: 6000, max: Infinity },
];

function getLevel(xp) {
  return LEVELS.find(l => xp >= l.min && xp < l.max) || LEVELS[LEVELS.length - 1];
}

export default function Dashboard() {
  const navigate = useNavigate();
  const user = getStoredUser();

  const [tab,       setTab]       = useState("ai");
  const [custom,    setCustom]    = useState("");
  const [history,   setHistory]   = useState([]);
  const [stats,     setStats]     = useState({ total: 0, avg: 0, best: 0 });
  const [loading,   setLoading]   = useState(true);

  const xp    = user?.xp || 0;
  const level = getLevel(xp);
  const nextLevel = LEVELS[LEVELS.indexOf(level) + 1];
  const pct   = Math.min(((xp - level.min) / ((nextLevel?.min || level.min + 600) - level.min)) * 100, 100);

  useEffect(() => {
    Promise.all([getHistory(), getStats()])
      .then(([h, s]) => { setHistory(h); setStats(s); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const goDebate = (topicName, topicIcon) => {
    navigate("/debate", { state: { topic: topicName, topicIcon } });
  };

  const handleCustom = () => {
    if (!custom.trim()) return;
    goDebate(custom.trim(), "💬");
    setCustom("");
  };

  const activeCat = CATEGORIES.find(c => c.id === tab);

  const S = {
    body:     { flex: 1, padding: "36px 28px", maxWidth: 1060, margin: "0 auto", width: "100%" },
    greet:    { fontFamily: "var(--font-display)", fontSize: 30, fontWeight: 800, marginBottom: 4 },
    sub:      { color: "var(--text2)", fontSize: 15, marginBottom: 36 },
    statRow:  { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(155px,1fr))", gap: 14, marginBottom: 36 },
    statCard: { background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "22px 18px" },
    statLbl:  { fontSize: 11, color: "var(--text3)", textTransform: "uppercase", letterSpacing: ".1em", fontFamily: "var(--font-mono)", marginBottom: 8 },
    statVal:  { fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 800, lineHeight: 1, marginBottom: 4 },
    sectionHdr: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
    sectionTitle: { fontSize: 16, fontWeight: 700 },
    pill:     { fontSize: 11, background: "var(--accent-glow)", color: "var(--accent2)", padding: "3px 10px", borderRadius: "100px", fontFamily: "var(--font-mono)" },
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      {loading ? <Loader text="Loading your data…" /> : (
        <div style={S.body}>
          <h1 style={S.greet}>Hello, {user?.username?.split(" ")[0]} 👋</h1>
          <p style={S.sub}>Your debate records are private — only you can see them.</p>

          {/* Stats */}
          <div style={S.statRow}>
            {[
              { lbl: "Total Debates", val: stats.total, note: "all time" },
              { lbl: "Average Score", val: stats.avg || "—", note: "out of 100" },
              { lbl: "Best Score",    val: stats.best || "—", note: stats.best >= 80 ? "🏆 Excellent" : "" },
              { lbl: "Total XP",      val: xp, note: level.name },
            ].map(s => (
              <div key={s.lbl} style={S.statCard}>
                <div style={S.statLbl}>{s.lbl}</div>
                <div style={S.statVal}>{s.val}</div>
                <div style={{ fontSize: 12, color: s.note?.startsWith("🏆") ? "var(--green)" : "var(--text3)" }}>{s.note}</div>
              </div>
            ))}
          </div>

          {/* Level bar */}
          <div style={{
            background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)",
            padding: "22px 24px", marginBottom: 36, display: "flex", alignItems: "center", gap: 22,
          }}>
            <div style={{
              width: 54, height: 54, borderRadius: "50%", flexShrink: 0,
              background: "linear-gradient(135deg, var(--accent), #8b5cf6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 800, color: "#fff",
            }}>
              {LEVELS.indexOf(level) + 1}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, marginBottom: 2 }}>Level {LEVELS.indexOf(level) + 1} — {level.name}</div>
              <div style={{ fontSize: 12, color: "var(--text2)", marginBottom: 10, fontFamily: "var(--font-mono)" }}>
                {xp} / {nextLevel?.min || "∞"} XP
              </div>
              <div style={{ height: 7, background: "var(--surface2)", borderRadius: 4, overflow: "hidden" }}>
                <div style={{
                  height: "100%", borderRadius: 4, width: `${pct}%`,
                  background: "linear-gradient(90deg, var(--accent), var(--gold))",
                  transition: "width .8s cubic-bezier(.34,1.56,.64,1)",
                }} />
              </div>
              <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 6 }}>
                {nextLevel ? `${nextLevel.min - xp} XP to unlock ${nextLevel.name}` : "🎉 Maximum rank!"}
              </div>
            </div>
          </div>

          {/* Custom topic */}
          <div style={{ background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "22px 24px", marginBottom: 36 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text3)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 12, fontFamily: "var(--font-mono)" }}>
              🎯 Enter Any Custom Debate Topic
            </label>
            <div style={{ display: "flex", gap: 10 }}>
              <input style={{ flex: 1, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "12px 16px", color: "var(--text)", fontFamily: "var(--font-body)", fontSize: 14, outline: "none" }}
                value={custom} onChange={e => setCustom(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleCustom()}
                onFocus={e => e.target.style.borderColor = "var(--accent)"}
                onBlur={e => e.target.style.borderColor = "var(--border)"}
                placeholder="e.g. Nuclear energy is the future · Four-day workweek…" />
              <button className="btn-primary" onClick={handleCustom} disabled={!custom.trim()} style={{ padding: "12px 24px", borderRadius: 8, whiteSpace: "nowrap" }}>
                Debate This →
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div style={S.sectionHdr}>
            <span style={S.sectionTitle}>📚 Browse Topics</span>
            <span style={S.pill}>Unlimited</span>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
            {CATEGORIES.map(c => (
              <div key={c.id}
                onClick={() => setTab(c.id)}
                style={{
                  background: tab === c.id ? "var(--accent-glow)" : "var(--surface)",
                  border: `1px solid ${tab === c.id ? "rgba(108,99,255,.4)" : "var(--border)"}`,
                  color: tab === c.id ? "var(--accent2)" : "var(--text2)",
                  padding: "7px 16px", borderRadius: "100px", cursor: "pointer",
                  fontSize: 13, fontWeight: 500, transition: "all .18s",
                }}>
                {c.label}
              </div>
            ))}
          </div>

          {/* Topic Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px,1fr))", gap: 10, marginBottom: 36 }}>
            {activeCat?.topics.map(t => (
              <div key={t.name}
                onClick={() => goDebate(t.name, t.icon)}
                style={{
                  background: "var(--surface)", border: "1px solid var(--border)",
                  borderRadius: "var(--radius-lg)", padding: "18px 16px",
                  cursor: "pointer", transition: "all .2s",
                  display: "flex", flexDirection: "column", gap: 8,
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "none"; }}
              >
                <div style={{ fontSize: 24 }}>{t.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.3 }}>{t.name}</div>
                <div style={{ fontSize: 11, color: "var(--text3)", fontFamily: "var(--font-mono)" }}>
                  {activeCat.label.replace(/^[^ ]+ /, "")}
                </div>
              </div>
            ))}
          </div>

          {/* History */}
          <div style={S.sectionHdr}>
            <span style={S.sectionTitle}>📋 My Debate History</span>
            <span style={S.pill}>{history.length} debates</span>
          </div>
          {history.length === 0 ? (
            <div style={{ textAlign: "center", padding: 32, color: "var(--text3)", fontSize: 14, background: "var(--bg3)", border: "1px dashed var(--border)", borderRadius: "var(--radius-lg)" }}>
              No debates yet — pick a topic above to get started! 🎤
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {history.slice(0, 12).map((d, i) => (
                <div key={i} style={{
                  background: "var(--bg3)", border: "1px solid var(--border)",
                  borderRadius: "var(--radius)", padding: "14px 18px",
                  display: "flex", alignItems: "center", gap: 14,
                }}>
                  <span style={{ fontSize: 20, flexShrink: 0 }}>{d.topicIcon || "💬"}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{d.topic}</div>
                    <div style={{ fontSize: 11, color: "var(--text3)", fontFamily: "var(--font-mono)", marginTop: 3 }}>
                      {new Date(d.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} · {d.difficulty} · {d.rounds} rounds · +{d.xpGained} XP
                    </div>
                  </div>
                  <span className={`score-tag ${d.score >= 80 ? "s-hi" : d.score >= 60 ? "s-md" : "s-lo"}`}>
                    {d.score}/100
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
