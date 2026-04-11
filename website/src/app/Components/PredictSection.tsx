"use client";
import PredictForm from "./PredictForm";

export default function PredictSection() {
  return (
    <section
      id="predict"
      style={{
        padding: "120px 24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Divider */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "10%",
          right: "10%",
          height: 1,
          background: "linear-gradient(90deg, transparent, var(--border), transparent)",
        }}
      />

      {/* Background glow */}
      <div
        className="orb"
        style={{
          width: 600,
          height: 600,
          background: "radial-gradient(circle, rgba(0,232,122,0.08) 0%, transparent 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.4fr",
            gap: 64,
            alignItems: "start",
          }}
        >
          {/* Left: Info */}
          <div style={{ position: "sticky", top: 120 }}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "var(--accent)",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: 16,
              }}
            >
              AI Diagnosis
            </div>
            <h2
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(36px, 4vw, 56px)",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                marginBottom: 24,
              }}
            >
              Get your{" "}
              <span style={{ fontStyle: "italic", color: "var(--accent)" }}>
                instant
              </span>{" "}
              disease prediction
            </h2>
            <p
              style={{
                fontSize: 15,
                color: "var(--text-muted)",
                lineHeight: 1.7,
                marginBottom: 40,
              }}
            >
              Fill in 4 quick steps. Our model computes 40+ derived features
              from your inputs — including risk scores, BMI/age groupings, and
              symptom cluster scores — before running the RandomForest
              prediction.
            </p>

            {/* Features list */}
            {[
              "40+ health parameters analysed",
              "Derived risk & symptom scores",
              "Instant prediction, no sign-up",
              "Runs on your own ML backend",
            ].map((f) => (
              <div
                key={f}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: "var(--accent-glow)",
                    border: "1px solid rgba(0,232,122,0.4)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="#00e87a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span style={{ fontSize: 14, color: "var(--text-muted)" }}>{f}</span>
              </div>
            ))}

            {/* Backend note */}
            <div
              style={{
                marginTop: 40,
                padding: "16px 20px",
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 12,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "var(--text-dim)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                Backend Required
              </div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.7 }}>
                Start your FastAPI server before predicting:
              </div>
              <code
                style={{
                  display: "block",
                  marginTop: 8,
                  fontSize: 12,
                  color: "var(--accent)",
                  background: "var(--surface-2)",
                  padding: "8px 12px",
                  borderRadius: 6,
                  fontFamily: "monospace",
                }}
              >
                uvicorn app:app --reload
              </code>
            </div>
          </div>

          {/* Right: Form card */}
          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 20,
              padding: "48px 40px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Card top accent */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: "20%",
                right: "20%",
                height: 2,
                background: "linear-gradient(90deg, transparent, var(--accent), transparent)",
                borderRadius: "0 0 4px 4px",
              }}
            />
            <PredictForm />
          </div>
        </div>
      </div>
    </section>
  );
}
