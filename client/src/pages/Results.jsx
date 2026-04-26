// ============================================================
// FILE: client/src/pages/Results.jsx
// PURPOSE: Shows debate score, breakdown, feedback, XP gained
// ============================================================

import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Results() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { result, topic, topicIcon, diff, rounds } = location.state || {};
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimate(true), 100);
    if (!result) navigate("/dashboard");
  }, []);

  if (!result) return null;

  const total = result.score || 0;
  const trophy  = total >= 80 ? "🏆" : total >= 60 ? "🥈" : "🎖️";
  const verdict = total >= 80 ? "Excellent Performance" : total >= 60 ? "Solid Effort" : "Keep Practicing";

  const criteria = [
    { key: "scoreLogic",     label: "Logic" },
    { key: "scoreEvidence",  label: "Evidence" },
    { key: "scoreRelevance", label: "Relevance" },
    { key: "scoreClarity",   label: "Clarity" },
    { key: "scoreStrength",  label: "Strength" },
  ];

  const S = {
    wrap:     { minHeight: "100vh", background: "var(--bg)", padding: "44px 28px", overflowY: "auto" },
    inner:    { maxWidth: 700, margin: "0 auto" },
    topSec:   { textAlign: "center", marginBottom: 36 },
    trophy:   { fontSize: 52, marginBottom: 14 },
    h:        { fontFamily: "var(--font-display)", fontSize: 34, fontWeight: 800, marginBottom: 8 },
    sub:      { color: "var(--text2)", fontSize: 13, fontFamily: "var(--font-mono)" },
    xpGain:   {
      display: "inline-flex", alignItems: "center", gap: 8,
      background: "var(--gold-dim)", border: "1px solid rgba(232,184,75,.3)",
      padding: "8px 20px", borderRadius: "100px", fontSize: 14,
      color: "var(--gold)", fontWeight: 600, marginTop: 14,
    },
    fbCard:   { background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: 22, marginBottom: 14 },
    fbTitle:  { fontSize: 15, fontWeight: 700, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 },
    fbItem:   { display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 9, fontSize: 13, lineHeight: 1.6, color: "var(--text2)" },
  };

  return (
    <div style={S.wrap}>
      <div style={S.inner}>
        <div style={S.topSec}>
          <div style={S.trophy}>{trophy}</div>
          <h1 style={S.h}>{verdict}</h1>
          <div style={S.sub}>{topicIcon} {topic} · {diff} · {rounds} rounds</div>
          <div style={S.xpGain}>⚡ +{result.xpGained} XP earned</div>
        </div>

        {/* Big ring score */}
        <div style={{
          width: 148, height: 148, borderRadius: "50%", margin: "0 auto 28px",
          background: `conic-gradient(var(--accent) ${total}%, var(--surface2) 0)`,
          display: "flex", alignItems: "center", justifyContent: "center", position: "relative",
        }}>
          <div style={{ position: "absolute", inset: 10, borderRadius: "50%", background: "var(--bg3)" }} />
          <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 42, fontWeight: 800, lineHeight: 1 }}>{total}</div>
            <div style={{ fontSize: 13, color: "var(--text3)", fontFamily: "var(--font-mono)" }}>/100</div>
          </div>
        </div>

        {/* Score breakdown */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 28 }}>
          {criteria.map(c => {
            const val = result[c.key] || 0;
            return (
              <div key={c.key} style={{ background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 17 }}>
                <div style={{ fontSize: 11, color: "var(--text3)", textTransform: "uppercase", letterSpacing: ".08em", fontFamily: "var(--font-mono)", marginBottom: 8 }}>
                  {c.label}
                </div>
                <div style={{ height: 5, background: "var(--surface2)", borderRadius: 3, marginBottom: 8, overflow: "hidden" }}>
                  <div style={{
                    height: "100%", borderRadius: 3, width: animate ? `${(val / 20) * 100}%` : "0%",
                    background: "linear-gradient(90deg, var(--accent), var(--gold))",
                    transition: "width 1s ease",
                  }} />
                </div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 800 }}>
                  {val} <span style={{ fontSize: 12, color: "var(--text3)", fontWeight: 400, fontFamily: "var(--font-body)" }}>/20</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Strengths */}
        {result.strengths?.length > 0 && (
          <div style={S.fbCard}>
            <div style={S.fbTitle}>💪 Strengths</div>
            {result.strengths.map((s, i) => (
              <div key={i} style={S.fbItem}>
                <span style={{ color: "var(--green)", flexShrink: 0, marginTop: 2 }}>✓</span><span>{s}</span>
              </div>
            ))}
          </div>
        )}

        {/* Weaknesses */}
        {result.weaknesses?.length > 0 && (
          <div style={S.fbCard}>
            <div style={S.fbTitle}>⚠️ Areas to Improve</div>
            {result.weaknesses.map((w, i) => (
              <div key={i} style={S.fbItem}>
                <span style={{ color: "var(--gold)", flexShrink: 0, marginTop: 2 }}>△</span><span>{w}</span>
              </div>
            ))}
          </div>
        )}

        {/* Suggestions */}
        {result.suggestions?.length > 0 && (
          <div style={S.fbCard}>
            <div style={S.fbTitle}>💡 Coaching Tips</div>
            {result.suggestions.map((s, i) => (
              <div key={i} style={S.fbItem}>
                <span style={{ color: "var(--blue)", flexShrink: 0, marginTop: 2 }}>→</span><span>{s}</span>
              </div>
            ))}
          </div>
        )}

        {/* New level */}
        {result.newLevel && (
          <div style={{ ...S.fbCard, textAlign: "center", background: "var(--accent-glow)", borderColor: "rgba(108,99,255,.3)" }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>🎉</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 800, color: "var(--accent2)" }}>
              {result.newLevel}
            </div>
            <div style={{ fontSize: 13, color: "var(--text2)", marginTop: 4 }}>
              You now have {result.newXP} XP total
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginTop: 34 }}>
          <button className="btn-outline" onClick={() => navigate("/dashboard")}>← Dashboard</button>
          <button className="btn-primary" onClick={() => navigate("/debate", { state: { topic, topicIcon } })}>
            Debate Again ⚔️
          </button>
        </div>
      </div>
    </div>
  );
}
