// ============================================================
// FILE: client/src/pages/DebateRoom.jsx
// PURPOSE: Live debate chat room — config + debate interface
// ============================================================

import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { startDebate, sendMessage, scoreDebate } from "../services/debateService.js";

const DIFFS = [
  { id: "easy",   label: "Easy",   desc: "Gentle, educational debate",      icon: "🌱" },
  { id: "medium", label: "Medium", desc: "Balanced analytical challenge",   icon: "⚔️" },
  { id: "hard",   label: "Hard",   desc: "Expert-level, aggressive",        icon: "🔥" },
];
const MODES = [
  { id: "friendly",  label: "Friendly",  desc: "Collaborative exploration",  icon: "🤝" },
  { id: "formal",    label: "Formal",    desc: "Oxford-style structure",     icon: "⚖️" },
  { id: "socratic",  label: "Socratic",  desc: "Question-driven inquiry",   icon: "🧠" },
];

export default function DebateRoom() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { topic = "AI in Education", topicIcon = "🎓" } = location.state || {};

  // Config state
  const [phase,    setPhase]    = useState("config"); // "config" | "debate"
  const [diff,     setDiff]     = useState("medium");
  const [mode,     setMode]     = useState("formal");

  // Debate state
  const [debateId, setDebateId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input,    setInput]    = useState("");
  const [busy,     setBusy]     = useState(false);
  const [myTurn,   setMyTurn]   = useState(true);
  const [scoring,  setScoring]  = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, busy]);

  // ── Start debate session ──
  const handleStart = async () => {
    setBusy(true);
    try {
      const { debateId: id } = await startDebate(topic, topicIcon, diff, mode);
      setDebateId(id);
      setPhase("debate");
    } catch (err) {
      alert("Could not start debate: " + (err.response?.data?.message || err.message));
    }
    setBusy(false);
  };

  // ── Send user message ──
  const handleSend = useCallback(async () => {
    const txt = input.trim();
    if (!txt || busy || !myTurn) return;
    setInput(""); setBusy(true); setMyTurn(false);

    setMessages(prev => [...prev, { role: "user", content: txt }]);

    try {
      const { aiReply } = await sendMessage(debateId, txt);
      setMessages(prev => [...prev, { role: "assistant", content: aiReply }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Connection error. Please check your backend." }]);
    }
    setBusy(false); setMyTurn(true);
  }, [input, busy, myTurn, debateId]);

  // ── End and score ──
  const handleEnd = async () => {
    if (messages.length < 2) { navigate("/dashboard"); return; }
    setScoring(true);
    try {
      const result = await scoreDebate(debateId);
      navigate("/results", { state: { result, topic, topicIcon, diff, rounds: Math.ceil(messages.length / 2) } });
    } catch {
      navigate("/dashboard");
    }
    setScoring(false);
  };

  const diffLabel = DIFFS.find(d => d.id === diff)?.label || diff;
  const modeLabel = MODES.find(m => m.id === mode)?.label || mode;
  const diffColor = { easy: "var(--green)", medium: "var(--gold)", hard: "var(--red)" };

  // ── Config Screen ─────────────────────────────────────────
  if (phase === "config") return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", padding: "40px 28px" }}>
      <button onClick={() => navigate("/dashboard")} style={{
        background: "none", border: "none", color: "var(--text2)", cursor: "pointer",
        fontSize: 14, display: "flex", alignItems: "center", gap: 7, marginBottom: 36,
        fontFamily: "var(--font-body)",
      }}>← Back to Dashboard</button>

      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 800, marginBottom: 10 }}>
        Configure Debate
      </h1>
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        background: "var(--accent-glow)", border: "1px solid rgba(108,99,255,.3)",
        padding: "7px 16px", borderRadius: 8, fontSize: 14, color: "var(--accent2)",
        marginBottom: 32, fontWeight: 500,
      }}>
        {topicIcon} {topic}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: 24, maxWidth: 820 }}>
        {/* Difficulty */}
        <div>
          <div style={{ fontSize: 11, color: "var(--text3)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 12, fontFamily: "var(--font-mono)", fontWeight: 600 }}>
            Difficulty Level
          </div>
          {DIFFS.map(d => (
            <div key={d.id} onClick={() => setDiff(d.id)} style={{
              background: diff === d.id ? "var(--accent-glow)" : "var(--surface)",
              border: `1px solid ${diff === d.id ? "var(--accent)" : "var(--border)"}`,
              borderRadius: "var(--radius)", padding: "14px 16px", cursor: "pointer",
              display: "flex", alignItems: "center", gap: 12, marginBottom: 8, transition: "all .18s",
            }}>
              <span style={{ fontSize: 18, width: 24, textAlign: "center" }}>{d.icon}</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{d.label}</div>
                <div style={{ fontSize: 12, color: "var(--text2)" }}>{d.desc}</div>
              </div>
              {diff === d.id && <span style={{ marginLeft: "auto", color: "var(--accent2)", fontWeight: 700 }}>✓</span>}
            </div>
          ))}
        </div>

        {/* Mode */}
        <div>
          <div style={{ fontSize: 11, color: "var(--text3)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 12, fontFamily: "var(--font-mono)", fontWeight: 600 }}>
            Debate Mode
          </div>
          {MODES.map(m => (
            <div key={m.id} onClick={() => setMode(m.id)} style={{
              background: mode === m.id ? "var(--accent-glow)" : "var(--surface)",
              border: `1px solid ${mode === m.id ? "var(--accent)" : "var(--border)"}`,
              borderRadius: "var(--radius)", padding: "14px 16px", cursor: "pointer",
              display: "flex", alignItems: "center", gap: 12, marginBottom: 8, transition: "all .18s",
            }}>
              <span style={{ fontSize: 18, width: 24, textAlign: "center" }}>{m.icon}</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{m.label}</div>
                <div style={{ fontSize: 12, color: "var(--text2)" }}>{m.desc}</div>
              </div>
              {mode === m.id && <span style={{ marginLeft: "auto", color: "var(--accent2)", fontWeight: 700 }}>✓</span>}
            </div>
          ))}
        </div>
      </div>

      <button className="btn-primary" onClick={handleStart} disabled={busy} style={{
        marginTop: 36, padding: "16px 48px", borderRadius: "100px", fontSize: 15,
        display: "inline-flex", alignItems: "center", gap: 10,
      }}>
        {busy ? "Starting…" : "Enter Debate Arena ⚔️"}
      </button>
    </div>
  );

  // ── Debate Screen ──────────────────────────────────────────
  return (
    <>
      {scoring && (
        <div className="overlay">
          <div className="spinner" />
          <div className="overlay-text">Analysing your performance…</div>
        </div>
      )}

      <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "var(--bg)" }}>

        {/* Header */}
        <div style={{
          background: "var(--bg2)", borderBottom: "1px solid var(--border)",
          padding: "13px 20px", display: "flex", alignItems: "center", gap: 12, flexShrink: 0, flexWrap: "wrap",
        }}>
          <button onClick={() => navigate("/dashboard")} style={{
            background: "none", border: "none", color: "var(--text2)", cursor: "pointer",
            fontSize: 18, flexShrink: 0, lineHeight: 1,
          }}>←</button>
          <div style={{ flex: 1, fontSize: 14, fontWeight: 600, minWidth: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            <span style={{ color: "var(--accent2)" }}>{topicIcon} </span>{topic}
          </div>
          <span style={{
            padding: "4px 11px", borderRadius: "100px", fontSize: 11, fontWeight: 700,
            textTransform: "uppercase", letterSpacing: ".06em", fontFamily: "var(--font-mono)",
            background: `${diffColor[diff]}1a`, color: diffColor[diff],
          }}>{diff}</span>
          <span style={{
            fontSize: 11, color: "var(--text3)", fontFamily: "var(--font-mono)",
            background: "var(--bg3)", border: "1px solid var(--border)", padding: "4px 10px", borderRadius: 6,
          }}>{modeLabel}</span>
          <button onClick={handleEnd} style={{
            background: "rgba(240,96,96,.1)", color: "var(--red)", border: "1px solid rgba(240,96,96,.25)",
            cursor: "pointer", padding: "7px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600,
            fontFamily: "var(--font-body)", transition: "all .2s",
          }}>End & Score</button>
        </div>

        {/* Chat */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 26px", display: "flex", flexDirection: "column", gap: 16 }}>
          {messages.length === 0 && (
            <div style={{
              textAlign: "center", color: "var(--text3)", fontSize: 12,
              fontFamily: "var(--font-mono)", padding: "10px 16px",
              border: "1px dashed var(--border)", borderRadius: 8, background: "var(--bg3)", lineHeight: 1.6,
            }}>
              ⚔️ Debate started on <strong style={{ color: "var(--text2)" }}>{topic}</strong><br />
              Make your opening argument — take a clear position and defend it.
            </div>
          )}

          {messages.map((m, i) => {
            const isUser = m.role === "user";
            const showRound = isUser && i > 0;
            return (
              <div key={i}>
                {showRound && (
                  <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "2px 0" }}>
                    <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
                    <span style={{ fontSize: 11, color: "var(--text3)", fontFamily: "var(--font-mono)", padding: "0 8px", background: "var(--bg)" }}>
                      Round {Math.floor(i / 2) + 1}
                    </span>
                    <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
                  </div>
                )}
                <div style={{
                  display: "flex", gap: 12, maxWidth: "82%", animation: "fadeIn .25s ease",
                  alignSelf: isUser ? "flex-end" : "flex-start",
                  flexDirection: isUser ? "row-reverse" : "row",
                  marginLeft: isUser ? "auto" : 0,
                }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, fontWeight: 800, color: "#fff",
                    background: isUser ? "linear-gradient(135deg,#2563eb,#1d4ed8)" : "linear-gradient(135deg,var(--accent),#7c3aed)",
                  }}>
                    {isUser ? "U" : "AI"}
                  </div>
                  <div style={{
                    borderRadius: 14, padding: "13px 17px", fontSize: 14, lineHeight: 1.65,
                    background: isUser ? "linear-gradient(135deg,#1a3a6b,#0f2547)" : "var(--surface)",
                    border: isUser ? "1px solid rgba(74,158,255,.2)" : "1px solid var(--border)",
                    borderBottomRightRadius: isUser ? 3 : 14,
                    borderBottomLeftRadius:  isUser ? 14 : 3,
                  }}>
                    {m.content}
                  </div>
                </div>
              </div>
            );
          })}

          {busy && (
            <div style={{ display: "flex", gap: 12, maxWidth: "82%", alignSelf: "flex-start" }}>
              <div style={{
                width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 800, color: "#fff",
                background: "linear-gradient(135deg,var(--accent),#7c3aed)",
              }}>AI</div>
              <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, borderBottomLeftRadius: 3, padding: "14px 17px" }}>
                <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                  {[0, .18, .36].map((d, i) => (
                    <div key={i} style={{
                      width: 6, height: 6, borderRadius: "50%", background: "var(--text3)",
                      animation: `bop 1.1s ${d}s infinite ease-in-out`,
                    }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{ padding: "14px 20px", background: "var(--bg2)", borderTop: "1px solid var(--border)", flexShrink: 0 }}>
          <div style={{ textAlign: "center", fontSize: 11, color: "var(--text3)", fontFamily: "var(--font-mono)", marginBottom: 9 }}>
            {myTurn ? "🟢 Your turn — state your argument (Enter to send)" : "🔴 AI is formulating a response…"}
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
            <textarea
              style={{
                flex: 1, background: "var(--surface)", border: "1px solid var(--border)",
                borderRadius: 10, padding: "12px 15px", color: "var(--text)",
                fontFamily: "var(--font-body)", fontSize: 14, outline: "none", resize: "none",
                lineHeight: 1.5, minHeight: 46, maxHeight: 110,
                transition: "border-color .2s", opacity: busy || !myTurn ? .5 : 1,
              }}
              rows={2}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              onFocus={e => e.target.style.borderColor = "var(--accent)"}
              onBlur={e => e.target.style.borderColor = "var(--border)"}
              placeholder="State your argument clearly and confidently…"
              disabled={busy || !myTurn}
            />
            <button onClick={handleSend} disabled={busy || !input.trim() || !myTurn} style={{
              width: 44, height: 44, borderRadius: 10, flexShrink: 0,
              background: "linear-gradient(135deg,var(--accent),#7c3aed)",
              color: "#fff", border: "none", cursor: "pointer", fontSize: 15,
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all .2s", opacity: busy || !input.trim() || !myTurn ? .35 : 1,
            }}>➤</button>
          </div>
        </div>
      </div>

      <style>{`@keyframes bop{0%,60%,100%{transform:none}30%{transform:translateY(-6px)}}`}</style>
    </>
  );
}
