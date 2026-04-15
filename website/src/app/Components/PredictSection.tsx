"use client";
import PredictForm from "./PredictForm";

export default function PredictSection() {
  return (
    <section
      id="predict"
      style={{ padding: "120px 24px 100px", position: "relative", overflow: "hidden" }}
    >
      {/* Divider */}
      <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 1, background: "linear-gradient(90deg,transparent,var(--border),transparent)" }} />

      {/* Background glow */}
      <div className="orb" style={{ width: 700, height: 700, background: "radial-gradient(circle,rgba(0,232,122,0.07) 0%,transparent 70%)", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />

      <div style={{ maxWidth: 1080, margin: "0 auto", position: "relative", zIndex: 2 }}>

        {/* Section header */}
        <div style={{ textAlign: "center", marginBottom: 72 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "6px 18px", background: "rgba(0,232,122,0.08)",
            border: "1px solid rgba(0,232,122,0.2)", borderRadius: 100, marginBottom: 24,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", display: "inline-block", boxShadow: "0 0 8px var(--accent)" }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--accent)", letterSpacing: "0.1em", textTransform: "uppercase" }}>AI Diagnosis Engine</span>
          </div>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(30px,4vw,52px)", lineHeight: 1.15, letterSpacing: "-0.02em", marginBottom: 16 }}>
            Predict your condition in{" "}
            <span style={{ fontStyle: "italic", color: "var(--accent)" }}>4 steps</span>
          </h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.4)", lineHeight: 1.7, maxWidth: 520, margin: "0 auto" }}>
            Enter your profile, lifestyle, severity, and symptoms. Our RandomForest model analyses 55 health parameters and gives you an instant prediction.
          </p>
        </div>

        {/* Two-column layout */}
        <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 32, alignItems: "start" }}>

          {/* ── LEFT SIDEBAR ── */}
          <div style={{ position: "sticky", top: 110, display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Steps card */}
            <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 18, padding: "24px 22px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 18 }}>How It Works</div>
              {[
                { n: "01", l: "Profile", d: "Age, sex, weight" },
                { n: "02", l: "History", d: "Lifestyle & pre-conditions" },
                { n: "03", l: "Condition", d: "Duration & severity" },
                { n: "04", l: "Symptoms", d: "30 clinical indicators" },
              ].map((s, i) => (
                <div key={s.n} style={{ display: "flex", gap: 14, paddingBottom: i < 3 ? 16 : 0, marginBottom: i < 3 ? 16 : 0, borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "var(--accent)", fontFamily: "var(--font-serif)", minWidth: 24, paddingTop: 2 }}>{s.n}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.75)", marginBottom: 2 }}>{s.l}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.28)" }}>{s.d}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats card */}
            <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 18, padding: "22px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>Model Stats</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { val: "935K", lbl: "Training samples" },
                  { val: "55", lbl: "Feature columns" },
                  { val: "11", lbl: "Disease classes" },
                  { val: "300", lbl: "Decision trees" },
                ].map(s => (
                  <div key={s.lbl} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>{s.lbl}</span>
                    <span style={{ fontSize: 16, fontWeight: 800, color: "var(--accent)", fontFamily: "var(--font-serif)" }}>{s.val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Backend notice */}
            <div style={{ background: "rgba(255,170,0,0.05)", border: "1px solid rgba(255,170,0,0.15)", borderRadius: 14, padding: "18px 20px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,170,0,0.7)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>Backend</div>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", lineHeight: 1.6, marginBottom: 10 }}>Start FastAPI before predicting:</p>
              <code style={{ display: "block", fontSize: 11, color: "var(--accent)", background: "rgba(0,0,0,0.3)", padding: "8px 12px", borderRadius: 8, fontFamily: "monospace", wordBreak: "break-all", lineHeight: 1.6 }}>
                python -m uvicorn app:app --reload
              </code>
            </div>
          </div>

          {/* ── FORM CARD ── */}
          <div style={{
            background: "rgba(255,255,255,0.025)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 24,
            padding: "44px 40px",
            position: "relative",
            overflow: "hidden",
          }}>
            {/* Top accent line */}
            <div style={{ position: "absolute", top: 0, left: "15%", right: "15%", height: 1, background: "linear-gradient(90deg,transparent,var(--accent),transparent)" }} />
            <PredictForm />
          </div>
        </div>
      </div>
    </section>
  );
}
