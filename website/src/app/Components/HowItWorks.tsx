"use client";

const steps = [
  {
    num: "01",
    title: "Enter Your Health Profile",
    desc: "Provide basic vitals — age, gender, BMI, blood pressure, glucose levels, and whether you have pre-existing conditions like hypertension or heart disease.",
    icon: "",
  },
  {
    num: "02",
    title: "Report Your Symptoms",
    desc: "Toggle which symptoms you're experiencing: fatigue, chest pain, headache, neurological changes, skin issues, and 15+ more clinical indicators.",
    icon: "",
  },
  {
    num: "03",
    title: "AI Analyses the Data",
    desc: "Our HistGradientBoosting model—trained on clinical data—computes risk scores, feature interactions, and demographic patterns before making its prediction.",
    icon: "",
  },
  {
    num: "04",
    title: "Get Instant Diagnosis",
    desc: "Receive a clear, instant disease prediction with the identified condition highlighted. Always follow up with a licensed physician for confirmation.",
    icon: "",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      style={{
        padding: "120px 24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle divider top */}
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

      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 80 }}>
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
            Process
          </div>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(36px, 5vw, 60px)",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              maxWidth: 500,
            }}
          >
            Four steps to a{" "}
            <span style={{ fontStyle: "italic", color: "var(--accent)" }}>
              smarter
            </span>{" "}
            diagnosis
          </h2>
        </div>

        {/* Steps */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 2,
          }}
        >
          {steps.map((step, i) => (
            <div
              key={step.num}
              className="hb-card"
              style={{
                padding: "40px 32px",
                borderRadius: i === 0 ? "16px 4px 4px 16px" : i === 3 ? "4px 16px 16px 4px" : "4px",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.background = "var(--surface-2)";
                el.style.borderColor = "var(--accent)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.background = "var(--surface)";
                el.style.borderColor = "var(--border)";
              }}
            >
              {/* Number watermark */}
              <div
                style={{
                  position: "absolute",
                  top: 16,
                  right: 20,
                  fontSize: 80,
                  fontFamily: "var(--font-serif)",
                  fontWeight: 700,
                  color: "var(--surface-2)",
                  lineHeight: 1,
                  userSelect: "none",
                }}
              >
                {step.num}
              </div>

              <div style={{ fontSize: 36, marginBottom: 20 }}>{step.icon}</div>

              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "var(--accent)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: 12,
                }}
              >
                Step {step.num}
              </div>

              <h3
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  marginBottom: 16,
                  lineHeight: 1.3,
                  color: "var(--text)",
                }}
              >
                {step.title}
              </h3>

              <p
                style={{
                  fontSize: 14,
                  color: "var(--text-muted)",
                  lineHeight: 1.7,
                }}
              >
                {step.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Model info strip */}
        <div
          style={{
            marginTop: 64,
            padding: "32px 40px",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 16,
            display: "flex",
            gap: 48,
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 12,
                color: "var(--text-dim)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: 8,
                fontWeight: 600,
              }}
            >
              About the Model
            </div>
            <div style={{ fontSize: 16, fontWeight: 600, color: "var(--text)" }}>
              HistGradientBoosting · Tuned for Real-World Accuracy
            </div>
          </div>
          {[
            { label: "Algorithm", val: "HistGradientBoosting" },
            { label: "Features", val: "42 parameters" },
            { label: "Accuracy", val: "91.6%" },
            { label: "Classes", val: "11 diseases" },
          ].map((item) => (
            <div key={item.label} style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "var(--accent)",
                  marginBottom: 4,
                }}
              >
                {item.val}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "var(--text-dim)",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
