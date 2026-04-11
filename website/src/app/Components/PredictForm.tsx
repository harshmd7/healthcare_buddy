"use client";
import { useState, useCallback } from "react";

// ---- Types ----
type FormData = {
  // Step 1: Basic Info
  age: string;
  gender: string; // "0" = Male, "1" = Female
  bmi: string;
  // Step 2: Medical History
  hypertension: boolean;
  heart_disease: boolean;
  smoking: boolean;
  family_history: boolean;
  // Step 3: Vitals
  glucose_level: string;
  blood_pressure: string;
  // Step 4: Symptoms
  chest_pain: boolean;
  fatigue: boolean;
  confusion: boolean;
  memory_loss: boolean;
  headache: boolean;
  fever: boolean;
  nausea: boolean;
  dizziness: boolean;
  weakness: boolean;
  numbness: boolean;
  vision_problems: boolean;
  speech_problems: boolean;
  personality_changes: boolean;
  behavioral_problems: boolean;
  skin_rash: boolean;
  diarrhea: boolean;
  constipation: boolean;
};

const defaultForm: FormData = {
  age: "",
  gender: "0",
  bmi: "",
  hypertension: false,
  heart_disease: false,
  smoking: false,
  family_history: false,
  glucose_level: "",
  blood_pressure: "",
  chest_pain: false,
  fatigue: false,
  confusion: false,
  memory_loss: false,
  headache: false,
  fever: false,
  nausea: false,
  dizziness: false,
  weakness: false,
  numbness: false,
  vision_problems: false,
  speech_problems: false,
  personality_changes: false,
  behavioral_problems: false,
  skin_rash: false,
  diarrhea: false,
  constipation: false,
};

// ---- Derived feature computation (mirrors train.py) ----
function computeDerivedFeatures(form: FormData) {
  const age = parseFloat(form.age) || 0;
  const bmi = parseFloat(form.bmi) || 0;
  const glucose = parseFloat(form.glucose_level) || 0;
  const bp = parseFloat(form.blood_pressure) || 0;
  const gender = parseInt(form.gender);

  // Symptom flags
  const symptoms = [
    form.chest_pain, form.fatigue, form.confusion, form.memory_loss,
    form.headache, form.fever, form.nausea, form.dizziness, form.weakness,
    form.numbness, form.vision_problems, form.speech_problems,
    form.personality_changes, form.behavioral_problems, form.skin_rash,
    form.diarrhea, form.constipation,
  ];
  const symptom_count = symptoms.filter(Boolean).length;

  // Neurological score (0-1)
  const neuro_syms = [form.confusion, form.memory_loss, form.numbness, form.vision_problems, form.speech_problems, form.personality_changes, form.behavioral_problems];
  const neurological_score = neuro_syms.filter(Boolean).length / neuro_syms.length;

  // Infection score
  const infect_syms = [form.fever, form.nausea, form.diarrhea, form.skin_rash];
  const infection_score = infect_syms.filter(Boolean).length / infect_syms.length;

  // Cardiovascular score
  const cardio_syms = [form.chest_pain, form.dizziness, form.weakness];
  const cardiovascular_score = cardio_syms.filter(Boolean).length / cardio_syms.length;

  // BMI category: 0=Underweight(<18.5), 1=Normal(18.5-25), 2=Overweight(25-30), 3=Obese(>30)
  const bmi_category = bmi < 18.5 ? 0 : bmi < 25 ? 1 : bmi < 30 ? 2 : 3;

  // Age group: 0=Young(<30), 1=Middle(30-60), 2=Senior(>60)
  const age_group = age < 30 ? 0 : age < 60 ? 1 : 2;

  const high_glucose = glucose > 140 ? 1 : 0;
  const high_bp = bp > 130 ? 1 : 0;

  // Risk score (composite)
  const risk_score =
    (form.hypertension ? 1 : 0) * 0.2 +
    (form.heart_disease ? 1 : 0) * 0.2 +
    (form.smoking ? 1 : 0) * 0.1 +
    high_glucose * 0.15 +
    high_bp * 0.15 +
    (bmi > 30 ? 0.1 : 0) +
    (age > 60 ? 0.1 : 0);

  const bmi_age_interaction = bmi * age;
  const glucose_bp_ratio = bp !== 0 ? glucose / bp : 0;
  const is_elderly = age >= 65 ? 1 : 0;
  const is_young = age < 30 ? 1 : 0;
  const obese = bmi >= 30 ? 1 : 0;
  const underweight = bmi < 18.5 ? 1 : 0;
  const multi_comorbidity = ((form.hypertension ? 1 : 0) + (form.heart_disease ? 1 : 0) + (form.smoking ? 1 : 0)) >= 2 ? 1 : 0;

  return {
    age,
    gender,
    bmi,
    hypertension: form.hypertension ? 1 : 0,
    heart_disease: form.heart_disease ? 1 : 0,
    smoking: form.smoking ? 1 : 0,
    glucose_level: glucose,
    blood_pressure: bp,
    chest_pain: form.chest_pain ? 1 : 0,
    fatigue: form.fatigue ? 1 : 0,
    confusion: form.confusion ? 1 : 0,
    memory_loss: form.memory_loss ? 1 : 0,
    headache: form.headache ? 1 : 0,
    fever: form.fever ? 1 : 0,
    nausea: form.nausea ? 1 : 0,
    dizziness: form.dizziness ? 1 : 0,
    weakness: form.weakness ? 1 : 0,
    numbness: form.numbness ? 1 : 0,
    vision_problems: form.vision_problems ? 1 : 0,
    speech_problems: form.speech_problems ? 1 : 0,
    personality_changes: form.personality_changes ? 1 : 0,
    behavioral_problems: form.behavioral_problems ? 1 : 0,
    skin_rash: form.skin_rash ? 1 : 0,
    diarrhea: form.diarrhea ? 1 : 0,
    constipation: form.constipation ? 1 : 0,
    family_history: form.family_history ? 1 : 0,
    symptom_count,
    neurological_score,
    infection_score,
    cardiovascular_score,
    bmi_category,
    age_group,
    high_glucose,
    high_bp,
    risk_score,
    bmi_age_interaction,
    glucose_bp_ratio,
    is_elderly,
    is_young,
    obese,
    underweight,
    multi_comorbidity,
  };
}

// ---- Toggle Component ----
function Toggle({
  label,
  sublabel,
  checked,
  onChange,
  icon,
}: {
  label: string;
  sublabel?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  icon?: string;
}) {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        padding: "14px 16px",
        background: checked ? "rgba(0,232,122,0.06)" : "var(--surface)",
        border: `1px solid ${checked ? "rgba(0,232,122,0.3)" : "var(--border)"}`,
        borderRadius: 12,
        cursor: "pointer",
        transition: "all 0.2s ease",
        userSelect: "none",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {icon && <span style={{ fontSize: 18 }}>{icon}</span>}
        <div>
          <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text)" }}>
            {label}
          </div>
          {sublabel && (
            <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 2 }}>
              {sublabel}
            </div>
          )}
        </div>
      </div>
      <div className="toggle" style={{ flexShrink: 0 }}>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span className="toggle-slider" />
      </div>
    </label>
  );
}

// ---- Input Component ----
function Field({
  label,
  placeholder,
  value,
  onChange,
  type = "number",
  unit,
  hint,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  unit?: string;
  hint?: string;
}) {
  return (
    <div>
      <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", marginBottom: 8, display: "block" }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <input
          className="hb-input"
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ paddingRight: unit ? 50 : 14 }}
        />
        {unit && (
          <span
            style={{
              position: "absolute",
              right: 12,
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: 12,
              color: "var(--text-dim)",
              fontWeight: 600,
            }}
          >
            {unit}
          </span>
        )}
      </div>
      {hint && (
        <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 6 }}>
          {hint}
        </div>
      )}
    </div>
  );
}

// ---- Steps ----
const STEPS = [
  { id: 1, label: "Profile" },
  { id: 2, label: "History" },
  { id: 3, label: "Vitals" },
  { id: 4, label: "Symptoms" },
];

// ---- Main Component ----
export default function PredictForm() {
  const [form, setForm] = useState<FormData>(defaultForm);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const set = useCallback(
    <K extends keyof FormData>(key: K, value: FormData[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const canNext = () => {
    if (step === 1) return form.age && form.bmi && form.gender !== "";
    if (step === 3) return form.glucose_level && form.blood_pressure;
    return true;
  };

  const handlePredict = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    const payload = computeDerivedFeatures(form);

    try {
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success && data.disease) {
        setResult(data.disease);
      } else {
        setError(
          data.error ||
            "Backend returned an error. Make sure the FastAPI server is running on port 8000."
        );
      }
    } catch {
      setError(
        "Could not connect to prediction server. Please ensure the FastAPI backend is running: uvicorn app:app --reload"
      );
    } finally {
      setLoading(false);
    }
  };

  const resetAll = () => {
    setForm(defaultForm);
    setStep(1);
    setResult(null);
    setError(null);
  };

  // ---- Result screen ----
  if (result) {
    return (
      <div className="animate-scale-in" style={{ textAlign: "center" }}>
        {/* Confetti circles */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "var(--accent)",
              opacity: 0.6,
              top: `${20 + i * 10}%`,
              left: `${10 + i * 15}%`,
              animation: `float ${2 + i * 0.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}

        <div
          style={{
            width: 80,
            height: 80,
            background: "var(--accent-glow)",
            border: "2px solid var(--accent)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 36,
            margin: "0 auto 32px",
          }}
        >
          🩺
        </div>

        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "var(--accent)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: 16,
          }}
        >
          Prediction Complete
        </div>

        <div
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(28px, 5vw, 48px)",
            lineHeight: 1.1,
            marginBottom: 8,
          }}
        >
          Predicted Condition:
        </div>

        <div
          className="shimmer-text"
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(36px, 6vw, 64px)",
            fontWeight: 700,
            lineHeight: 1.1,
            marginBottom: 32,
          }}
        >
          {result}
        </div>

        <div
          style={{
            background: "rgba(255,170,0,0.1)",
            border: "1px solid rgba(255,170,0,0.3)",
            borderRadius: 12,
            padding: "16px 24px",
            maxWidth: 500,
            margin: "0 auto 40px",
          }}
        >
          <div style={{ fontSize: 13, color: "#ffaa00", lineHeight: 1.6 }}>
            ⚠️ This is an AI-based prediction for informational purposes only.
            Always consult a qualified healthcare professional for an official diagnosis.
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button className="hb-btn" onClick={resetAll}>
            New Prediction
          </button>
          <button className="hb-btn-outline" onClick={() => { setResult(null); setStep(4); }}>
            Edit Symptoms
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Step Dots */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          justifyContent: "center",
          marginBottom: 48,
        }}
      >
        {STEPS.map((s, i) => (
          <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div
              className={`step-dot ${step === s.id ? "active" : step > s.id ? "done" : ""}`}
            />
            {i < STEPS.length - 1 && (
              <div
                style={{
                  width: 24,
                  height: 1,
                  background: step > s.id ? "var(--accent-dim)" : "var(--border)",
                  transition: "background 0.3s",
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step label */}
      <div
        style={{
          fontSize: 12,
          color: "var(--accent)",
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          marginBottom: 12,
          textAlign: "center",
        }}
      >
        Step {step} of {STEPS.length} — {STEPS[step - 1].label}
      </div>

      {/* ---- STEP 1: Profile ---- */}
      {step === 1 && (
        <div className="animate-slide-up" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 28, marginBottom: 4 }}>
            Your Health Profile
          </h3>
          <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 8 }}>
            Let&rsquo;s start with some basic information about you.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Field
              label="Age"
              placeholder="e.g. 35"
              value={form.age}
              onChange={(v) => set("age", v)}
              unit="yrs"
              hint="Your current age in years"
            />
            <Field
              label="BMI (Body Mass Index)"
              placeholder="e.g. 24.5"
              value={form.bmi}
              onChange={(v) => set("bmi", v)}
              hint="Weight(kg) / Height(m)²"
            />
          </div>

          {/* Gender */}
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", marginBottom: 12, display: "block" }}>
              Biological Sex
            </label>
            <div style={{ display: "flex", gap: 12 }}>
              {[{ val: "0", label: "Male", icon: "♂" }, { val: "1", label: "Female", icon: "♀" }].map((g) => (
                <button
                  key={g.val}
                  onClick={() => set("gender", g.val)}
                  style={{
                    flex: 1,
                    padding: "16px",
                    background: form.gender === g.val ? "var(--accent-glow)" : "var(--surface)",
                    border: `1px solid ${form.gender === g.val ? "var(--accent)" : "var(--border)"}`,
                    borderRadius: 12,
                    color: form.gender === g.val ? "var(--accent)" : "var(--text-muted)",
                    fontSize: 16,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  <div style={{ fontSize: 24, marginBottom: 6 }}>{g.icon}</div>
                  {g.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ---- STEP 2: Medical History ---- */}
      {step === 2 && (
        <div className="animate-slide-up" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 28, marginBottom: 4 }}>
            Medical History
          </h3>
          <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 8 }}>
            Do you have any of the following conditions? Toggle all that apply.
          </p>
          <Toggle
            label="Hypertension"
            sublabel="High blood pressure (diagnosed)"
            checked={form.hypertension}
            onChange={(v) => set("hypertension", v)}
            icon="💊"
          />
          <Toggle
            label="Heart Disease"
            sublabel="Any diagnosed cardiac condition"
            checked={form.heart_disease}
            onChange={(v) => set("heart_disease", v)}
            icon="❤️"
          />
          <Toggle
            label="Smoking"
            sublabel="Current or former smoker"
            checked={form.smoking}
            onChange={(v) => set("smoking", v)}
            icon="🚬"
          />
          <Toggle
            label="Family History of Illness"
            sublabel="Close relative with major disease"
            checked={form.family_history}
            onChange={(v) => set("family_history", v)}
            icon="🧬"
          />
        </div>
      )}

      {/* ---- STEP 3: Vitals ---- */}
      {step === 3 && (
        <div className="animate-slide-up" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 28, marginBottom: 4 }}>
            Current Vitals
          </h3>
          <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 8 }}>
            Enter your most recent lab or measurement readings.
          </p>
          <Field
            label="Blood Glucose Level"
            placeholder="e.g. 95"
            value={form.glucose_level}
            onChange={(v) => set("glucose_level", v)}
            unit="mg/dL"
            hint="Fasting glucose: Normal &lt;100, Pre-diabetic 100–125, Diabetic ≥126"
          />
          <Field
            label="Blood Pressure (Systolic)"
            placeholder="e.g. 120"
            value={form.blood_pressure}
            onChange={(v) => set("blood_pressure", v)}
            unit="mmHg"
            hint="The top number from your BP reading. Normal &lt;120, Elevated 120–129, High ≥130"
          />

          {/* Visual indicators */}
          {form.glucose_level && (
            <div
              style={{
                padding: "12px 16px",
                background:
                  parseFloat(form.glucose_level) < 100
                    ? "rgba(0,232,122,0.08)"
                    : parseFloat(form.glucose_level) < 126
                    ? "rgba(255,170,0,0.08)"
                    : "rgba(255,68,68,0.08)",
                border: `1px solid ${
                  parseFloat(form.glucose_level) < 100
                    ? "rgba(0,232,122,0.3)"
                    : parseFloat(form.glucose_level) < 126
                    ? "rgba(255,170,0,0.3)"
                    : "rgba(255,68,68,0.3)"
                }`,
                borderRadius: 10,
                fontSize: 13,
                color:
                  parseFloat(form.glucose_level) < 100
                    ? "var(--accent)"
                    : parseFloat(form.glucose_level) < 126
                    ? "#ffaa00"
                    : "#ff4444",
              }}
            >
              {parseFloat(form.glucose_level) < 100
                ? "✓ Normal glucose range"
                : parseFloat(form.glucose_level) < 126
                ? "⚠ Pre-diabetic range — monitor closely"
                : "⚠ Diabetic range — consult a doctor"}
            </div>
          )}
          {form.blood_pressure && (
            <div
              style={{
                padding: "12px 16px",
                background:
                  parseFloat(form.blood_pressure) < 120
                    ? "rgba(0,232,122,0.08)"
                    : parseFloat(form.blood_pressure) < 130
                    ? "rgba(255,170,0,0.08)"
                    : "rgba(255,68,68,0.08)",
                border: `1px solid ${
                  parseFloat(form.blood_pressure) < 120
                    ? "rgba(0,232,122,0.3)"
                    : parseFloat(form.blood_pressure) < 130
                    ? "rgba(255,170,0,0.3)"
                    : "rgba(255,68,68,0.3)"
                }`,
                borderRadius: 10,
                fontSize: 13,
                color:
                  parseFloat(form.blood_pressure) < 120
                    ? "var(--accent)"
                    : parseFloat(form.blood_pressure) < 130
                    ? "#ffaa00"
                    : "#ff4444",
              }}
            >
              {parseFloat(form.blood_pressure) < 120
                ? "✓ Normal blood pressure"
                : parseFloat(form.blood_pressure) < 130
                ? "⚠ Elevated blood pressure"
                : "⚠ High blood pressure — hypertension range"}
            </div>
          )}
        </div>
      )}

      {/* ---- STEP 4: Symptoms ---- */}
      {step === 4 && (
        <div className="animate-slide-up" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 28, marginBottom: 4 }}>
            Current Symptoms
          </h3>
          <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 8 }}>
            Toggle every symptom you&rsquo;re currently experiencing.
          </p>

          {/* Symptom count badge */}
          {(() => {
            const count = [
              form.chest_pain, form.fatigue, form.confusion, form.memory_loss,
              form.headache, form.fever, form.nausea, form.dizziness, form.weakness,
              form.numbness, form.vision_problems, form.speech_problems,
              form.personality_changes, form.behavioral_problems, form.skin_rash,
              form.diarrhea, form.constipation,
            ].filter(Boolean).length;
            return count > 0 ? (
              <div
                style={{
                  background: "var(--accent-glow)",
                  border: "1px solid rgba(0,232,122,0.3)",
                  borderRadius: 10,
                  padding: "10px 16px",
                  fontSize: 13,
                  color: "var(--accent)",
                  fontWeight: 600,
                  marginBottom: 4,
                }}
              >
                {count} symptom{count > 1 ? "s" : ""} selected
              </div>
            ) : null;
          })()}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Toggle label="Chest Pain" checked={form.chest_pain} onChange={(v) => set("chest_pain", v)} icon="💔" />
            <Toggle label="Fatigue" checked={form.fatigue} onChange={(v) => set("fatigue", v)} icon="😴" />
            <Toggle label="Confusion" checked={form.confusion} onChange={(v) => set("confusion", v)} icon="😵" />
            <Toggle label="Memory Loss" checked={form.memory_loss} onChange={(v) => set("memory_loss", v)} icon="🧠" />
            <Toggle label="Headache" checked={form.headache} onChange={(v) => set("headache", v)} icon="🤕" />
            <Toggle label="Fever" checked={form.fever} onChange={(v) => set("fever", v)} icon="🌡️" />
            <Toggle label="Nausea" checked={form.nausea} onChange={(v) => set("nausea", v)} icon="🤢" />
            <Toggle label="Dizziness" checked={form.dizziness} onChange={(v) => set("dizziness", v)} icon="💫" />
            <Toggle label="Weakness" checked={form.weakness} onChange={(v) => set("weakness", v)} icon="💪" />
            <Toggle label="Numbness" checked={form.numbness} onChange={(v) => set("numbness", v)} icon="🖐️" />
            <Toggle label="Vision Problems" checked={form.vision_problems} onChange={(v) => set("vision_problems", v)} icon="👁️" />
            <Toggle label="Speech Problems" checked={form.speech_problems} onChange={(v) => set("speech_problems", v)} icon="💬" />
            <Toggle label="Personality Changes" checked={form.personality_changes} onChange={(v) => set("personality_changes", v)} icon="🎭" />
            <Toggle label="Behavioural Issues" checked={form.behavioral_problems} onChange={(v) => set("behavioral_problems", v)} icon="⚡" />
            <Toggle label="Skin Rash" checked={form.skin_rash} onChange={(v) => set("skin_rash", v)} icon="🩹" />
            <Toggle label="Diarrhoea" checked={form.diarrhea} onChange={(v) => set("diarrhea", v)} icon="🚽" />
            <Toggle label="Constipation" checked={form.constipation} onChange={(v) => set("constipation", v)} icon="😣" />
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div
          style={{
            marginTop: 20,
            padding: "14px 18px",
            background: "rgba(255,68,68,0.08)",
            border: "1px solid rgba(255,68,68,0.3)",
            borderRadius: 10,
            fontSize: 13,
            color: "#ff6b6b",
            lineHeight: 1.6,
          }}
        >
          ❌ {error}
        </div>
      )}

      {/* Navigation */}
      <div
        style={{
          display: "flex",
          gap: 12,
          marginTop: 40,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {step > 1 ? (
          <button className="hb-btn-outline" onClick={() => setStep(step - 1)}>
            ← Back
          </button>
        ) : (
          <div />
        )}

        {step < 4 ? (
          <button
            className="hb-btn"
            onClick={() => setStep(step + 1)}
            disabled={!canNext()}
          >
            Continue →
          </button>
        ) : (
          <button
            className="hb-btn"
            onClick={handlePredict}
            disabled={loading}
            style={{ minWidth: 180 }}
          >
            {loading ? (
              <span style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center" }}>
                <span
                  style={{
                    width: 16,
                    height: 16,
                    border: "2px solid rgba(0,0,0,0.3)",
                    borderTopColor: "#000",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                    display: "inline-block",
                  }}
                />
                Analysing...
              </span>
            ) : (
              "Predict Disease →"
            )}
          </button>
        )}
      </div>
    </div>
  );
}
