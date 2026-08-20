export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--border)",
        padding: "40px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 16,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 28,
            height: 28,
            background: "var(--accent)",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
            fontWeight: 800,
            color: "#000",
          }}
        >
          H
        </div>
        <span
          style={{
            fontWeight: 700,
            fontSize: 15,
            color: "var(--text)",
            letterSpacing: "-0.02em",
          }}
        >
          Health<span style={{ color: "var(--accent)" }}>Buddy</span>
        </span>
      </div>

      <p style={{ fontSize: 13, color: "var(--text-dim)", textAlign: "center" }}>
        AI-powered disease prediction · For educational & research purposes only · Not a substitute for medical advice
      </p>

      <p style={{ fontSize: 13, color: "var(--text-dim)" }}>
        Built with Next.js + FastAPI + HistGradientBoosting
      </p>
    </footer>
  );
}
