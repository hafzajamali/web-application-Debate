// ============================================================
// FILE: client/src/components/Loader.jsx
// PURPOSE: Reusable loading spinner
// ============================================================

export default function Loader({ text = "Loading…" }) {
  return (
    <div className="spinner-wrap">
      <div className="spinner" />
      <span style={{ color: "var(--text3)", fontSize: 14, fontFamily: "var(--font-mono)" }}>
        {text}
      </span>
    </div>
  );
}
