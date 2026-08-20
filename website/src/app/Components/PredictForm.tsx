"use client";
import { useState, useCallback } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────
type F = {
  age: string; gender: string; weight_category: string;
  smoking: boolean; alcohol_consumption: boolean; recent_travel: boolean;
  high_risk_lifestyle: boolean; family_history: boolean;
  pre_existing_diabetes: boolean; pre_existing_hypertension: boolean;
  pre_existing_heart_condition: boolean;
  days_since_onset: string; pain_severity: string;
  fever_severity: string; severity_score: string;
  fever: boolean; chills: boolean; headache: boolean; fatigue: boolean;
  weakness: boolean; nausea: boolean; vomiting: boolean; diarrhea: boolean;
  constipation: boolean; chest_pain: boolean; shortness_of_breath: boolean;
  skin_rash: boolean; joint_pain: boolean; muscle_pain: boolean;
  sore_throat: boolean; cough: boolean; runny_nose: boolean;
  loss_of_appetite: boolean; abdominal_pain: boolean; confusion: boolean;
  memory_loss: boolean; dizziness: boolean; numbness: boolean;
  vision_problems: boolean; speech_problems: boolean;
  personality_changes: boolean; behavioral_problems: boolean;
  sweating: boolean; loss_of_smell_taste: boolean; swollen_lymph_nodes: boolean;
};

const DEF: F = {
  age: "", gender: "0", weight_category: "normal",
  smoking: false, alcohol_consumption: false, recent_travel: false,
  high_risk_lifestyle: false, family_history: false,
  pre_existing_diabetes: false, pre_existing_hypertension: false,
  pre_existing_heart_condition: false,
  days_since_onset: "", pain_severity: "0", fever_severity: "0", severity_score: "1",
  fever: false, chills: false, headache: false, fatigue: false,
  weakness: false, nausea: false, vomiting: false, diarrhea: false,
  constipation: false, chest_pain: false, shortness_of_breath: false,
  skin_rash: false, joint_pain: false, muscle_pain: false,
  sore_throat: false, cough: false, runny_nose: false,
  loss_of_appetite: false, abdominal_pain: false, confusion: false,
  memory_loss: false, dizziness: false, numbness: false,
  vision_problems: false, speech_problems: false,
  personality_changes: false, behavioral_problems: false,
  sweating: false, loss_of_smell_taste: false, swollen_lymph_nodes: false,
};

function buildPayload(f: F) {
  const age = +f.age || 0;
  const b = (v: boolean) => v ? 1 : 0;
  const ageGroup = (a: number) => {
    if (a < 13) return 1;
    if (a < 18) return 4;
    if (a < 30) return 5;
    if (a < 45) return 0;
    if (a < 65) return 2;
    return 3;
  };

  const wtMap: Record<string, number> = { normal: 0, obese: 1, overweight: 2, underweight: 3 };
  const symptomCount = [
    f.fever, f.chills, f.headache, f.fatigue, f.weakness, f.nausea,
    f.vomiting, f.diarrhea, f.constipation, f.chest_pain, f.shortness_of_breath,
    f.skin_rash, f.joint_pain, f.muscle_pain, f.sore_throat, f.cough,
    f.runny_nose, f.loss_of_appetite, f.abdominal_pain, f.confusion,
    f.memory_loss, f.dizziness, f.numbness, f.vision_problems, f.speech_problems,
    f.personality_changes, f.behavioral_problems, f.sweating,
    f.loss_of_smell_taste, f.swollen_lymph_nodes,
  ].filter(Boolean).length;
  
  return {
    // Profile
    age,
    gender: +f.gender,
    weight_category: wtMap[f.weight_category] ?? 0,
    days_since_onset: +f.days_since_onset || 0,
    pain_severity: +f.pain_severity || 0,
    fever_severity: +f.fever_severity || 0,
    severity_score: +f.severity_score || 0,
    
    // Lifestyle & History
    smoking: b(f.smoking),
    alcohol_consumption: b(f.alcohol_consumption),
    recent_travel: b(f.recent_travel),
    family_history: b(f.family_history),
    pre_existing_diabetes: b(f.pre_existing_diabetes),
    pre_existing_hypertension: b(f.pre_existing_hypertension),
    pre_existing_heart_condition: b(f.pre_existing_heart_condition),
    
    // Symptoms
    fever: b(f.fever),
    chills: b(f.chills),
    headache: b(f.headache),
    fatigue: b(f.fatigue),
    weakness: b(f.weakness),
    nausea: b(f.nausea),
    vomiting: b(f.vomiting),
    diarrhea: b(f.diarrhea),
    constipation: b(f.constipation),
    chest_pain: b(f.chest_pain),
    shortness_of_breath: b(f.shortness_of_breath),
    skin_rash: b(f.skin_rash),
    joint_pain: b(f.joint_pain),
    muscle_pain: b(f.muscle_pain),
    sore_throat: b(f.sore_throat),
    cough: b(f.cough),
    runny_nose: b(f.runny_nose),
    loss_of_appetite: b(f.loss_of_appetite),
    abdominal_pain: b(f.abdominal_pain),
    confusion: b(f.confusion),
    memory_loss: b(f.memory_loss),
    dizziness: b(f.dizziness),
    numbness: b(f.numbness),
    vision_problems: b(f.vision_problems),
    speech_problems: b(f.speech_problems),
    personality_changes: b(f.personality_changes),
    behavioral_problems: b(f.behavioral_problems),
    sweating: b(f.sweating),
    loss_of_smell_taste: b(f.loss_of_smell_taste),
    swollen_lymph_nodes: b(f.swollen_lymph_nodes),
    
    // Derived feature
    age_group: ageGroup(age),
    symptom_count: symptomCount,
  };
}

// ─── Mini components ──────────────────────────────────────────────────────────
function Chip({ label, icon, active, onClick }: { label: string; icon?: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: 7,
      padding: "10px 16px",
      background: active ? "rgba(0,232,122,0.12)" : "transparent",
      border: `1.5px solid ${active ? "var(--accent)" : "rgba(255,255,255,0.08)"}`,
      borderRadius: 100, cursor: "pointer", transition: "all 0.18s ease",
      fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600,
      color: active ? "var(--accent)" : "rgba(255,255,255,0.45)",
      whiteSpace: "nowrap",
    }}>
      {icon && <span style={{ fontSize: 15 }}>{icon}</span>}
      {label}
      {active && (
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", flexShrink: 0 }} />
      )}
    </button>
  );
}

const DISEASE_META: Record<string, { icon: string; color: string }> = {
  "Brain Stroke":        { icon: "", color: "#ff6b6b" },
  "Heart Disease":       { icon: "", color: "#ff4444" },
  "COVID-19":            { icon: "", color: "#00b4d8" },
  "Pneumonia":           { icon: "", color: "#7b9cff" },
  "Tuberculosis":        { icon: "", color: "#c77dff" },
  "Dengue":              { icon: "", color: "#f9c74f" },
  "Alzheimer's Disease": { icon: "", color: "#ff9f43" },
  "No Disease":          { icon: "", color: "#00e87a" },
  "Typhoid":             { icon: "", color: "#ffd166" },
  "Malaria":             { icon: "", color: "#06d6a0" },
  "Diabetes":            { icon: "", color: "#a8dadc" },
};

// ─── STEPS ───────────────────────────────────────────────────────────────────
const STEPS = ["Profile", "History", "Condition", "Symptoms"];
const STEP_ICONS = ["", "", "", ""];

export default function PredictForm() {
  const [form, setForm] = useState<F>(DEF);
  const [step, setStep] = useState(0); // 0-indexed
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [top3, setTop3] = useState<{ disease: string; confidence: number }[]>([]);
  const [requesting, setRequesting] = useState(false);
  const [requestedCase, setRequestedCase] = useState<{
    id: string;
    doctor: { name: string; specialization: string } | null;
  } | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);

  const set = useCallback(<K extends keyof F>(k: K, v: F[K]) =>
    setForm(p => ({ ...p, [k]: v })), []);

  const canAdvance = () => {
    if (step === 0) return !!form.age && +form.age > 0;
    if (step === 2) return form.days_since_onset !== "" && +form.days_since_onset >= 0;
    return true;
  };

  const totalSymptoms = [
    form.fever,form.chills,form.headache,form.fatigue,form.weakness,form.nausea,
    form.vomiting,form.diarrhea,form.constipation,form.chest_pain,form.shortness_of_breath,
    form.skin_rash,form.joint_pain,form.muscle_pain,form.sore_throat,form.cough,
    form.runny_nose,form.loss_of_appetite,form.abdominal_pain,form.confusion,
    form.memory_loss,form.dizziness,form.numbness,form.vision_problems,form.speech_problems,
    form.personality_changes,form.behavioral_problems,form.sweating,
    form.loss_of_smell_taste,form.swollen_lymph_nodes,
  ].filter(Boolean).length;

  const predict = async () => {
    setLoading(true); setError(null); setResult(null);
    try {
      const r = await fetch("/api/predict", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload(form)),
      });
      const d = await r.json();
      if (d.success && d.disease) {
        setResult(d.disease);
        setTop3(d.top3 || []);
      } else setError(d.error || "Prediction failed.");
    } catch {
      setError("Cannot reach the backend.\nRun: python -m uvicorn app:app --reload");
    }
    setLoading(false);
  };

  const reset = () => {
    setForm(DEF); setStep(0); setResult(null); setError(null);
    setTop3([]); setRequestedCase(null); setRequestError(null);
  };

  const requestConsultation = async () => {
    if (!result) return;
    setRequesting(true); setRequestError(null);
    try {
      const r = await fetch("/api/cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symptoms: form,
          predictedDisease: result,
          confidence: top3[0]?.confidence ?? 1,
          top3,
        }),
      });
      const d = await r.json();
      if (d.success) setRequestedCase(d.case);
      else setRequestError(d.error || "Could not create consultation request.");
    } catch {
      setRequestError("Cannot reach the server.");
    }
    setRequesting(false);
  };

  // ── RESULT SCREEN ────────────────────────────────────────────────────────
  if (result) {
    const meta = DISEASE_META[result] ?? { icon: "", color: "var(--accent)" };
    const isHealthy = result === "No Disease";
    return (
      <div style={{ textAlign: "center", padding: "8px 0" }}>
        {/* Big icon */}
        <div style={{
          width: 120, height: 120, borderRadius: "50%", margin: "0 auto 28px",
          background: `${meta.color}15`,
          border: `2px solid ${meta.color}40`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 52,
          boxShadow: `0 0 60px ${meta.color}20`,
          animation: "scaleIn 0.5s cubic-bezier(0.22,1,0.36,1)",
        }}>{meta.icon}</div>

        <p style={{ fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 700, color: "rgba(255,255,255,0.35)", marginBottom: 12 }}>
          AI PREDICTION
        </p>

        <div style={{
          fontSize: "clamp(32px,5vw,52px)", fontFamily: "var(--font-serif)",
          fontWeight: 700, color: meta.color, lineHeight: 1.1, marginBottom: 28,
          textShadow: `0 0 40px ${meta.color}40`,
        }}>
          {result}
        </div>

        {isHealthy ? (
          <div style={{ background: "rgba(0,232,122,0.08)", border: "1px solid rgba(0,232,122,0.2)", borderRadius: 14, padding: "18px 24px", marginBottom: 28, maxWidth: 460, margin: "0 auto 28px" }}>
            <div style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", lineHeight: 1.7 }}>
              Great news! No significant disease pattern was detected based on your inputs. Continue maintaining a healthy lifestyle.
            </div>
          </div>
        ) : (
          <div style={{ background: "rgba(255,170,0,0.07)", border: "1px solid rgba(255,170,0,0.2)", borderRadius: 14, padding: "18px 24px", marginBottom: 28, maxWidth: 460, margin: "0 auto 28px" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#ffaa00", marginBottom: 8 }}>Medical Disclaimer</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.7 }}>
              This is an AI-based prediction for informational purposes only. It is <strong style={{ color: "rgba(255,255,255,0.8)" }}>not a diagnosis</strong>. Please consult a qualified healthcare professional.
            </div>
          </div>
        )}

        {top3.length > 1 && (
          <div style={{ maxWidth: 460, margin: "0 auto 28px", textAlign: "left" }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 10 }}>
              Model Confidence Breakdown
            </div>
            {top3.map((t) => (
              <div key={t.disease} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{ width: 130, fontSize: 13, color: "rgba(255,255,255,0.7)" }}>{t.disease}</div>
                <div style={{ flex: 1, height: 8, borderRadius: 6, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
                  <div style={{ width: `${Math.round(t.confidence * 100)}%`, height: "100%", background: "var(--accent)" }} />
                </div>
                <div style={{ width: 46, fontSize: 12, textAlign: "right", color: "rgba(255,255,255,0.5)" }}>
                  {Math.round(t.confidence * 100)}%
                </div>
              </div>
            ))}
          </div>
        )}

        {!isHealthy && !requestedCase && (
          <div style={{ maxWidth: 460, margin: "0 auto 24px" }}>
            <button
              onClick={requestConsultation}
              disabled={requesting}
              style={{
                width: "100%", padding: "13px 28px", background: "#00b4d8", color: "#fff",
                border: "none", borderRadius: 10, fontWeight: 700, fontSize: 14,
                cursor: requesting ? "default" : "pointer", fontFamily: "var(--font-sans)",
                opacity: requesting ? 0.6 : 1,
              }}
            >
              {requesting ? "Requesting..." : "Request Doctor Consultation"}
            </button>
            {requestError && (
              <div style={{ color: "#ff6b6b", fontSize: 13, marginTop: 8 }}>{requestError}</div>
            )}
          </div>
        )}

        {requestedCase && (
          <div style={{
            background: "rgba(0,180,216,0.08)", border: "1px solid rgba(0,180,216,0.25)",
            borderRadius: 14, padding: "18px 24px", marginBottom: 28, maxWidth: 460, margin: "0 auto 28px",
            textAlign: "left",
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#00b4d8", marginBottom: 8 }}>
              Consultation Requested
            </div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>
              {requestedCase.doctor ? (
                <>Matched with <strong>{requestedCase.doctor.name}</strong> ({requestedCase.doctor.specialization}). Case ID: {requestedCase.id}</>
              ) : (
                <>No available doctor for this specialization right now. Your request has been logged, case ID: {requestedCase.id}</>
              )}
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginTop: 12 }}>
          <button onClick={reset} style={{
            padding: "13px 28px", background: "var(--accent)", color: "#000",
            border: "none", borderRadius: 10, fontWeight: 700, fontSize: 14,
            cursor: "pointer", fontFamily: "var(--font-sans)",
            transition: "all 0.2s",
          }}>New Prediction</button>
          <button onClick={() => { setResult(null); setStep(3); }} style={{
            padding: "13px 28px", background: "transparent", color: "rgba(255,255,255,0.5)",
            border: "1.5px solid rgba(255,255,255,0.12)", borderRadius: 10,
            fontWeight: 600, fontSize: 14, cursor: "pointer", fontFamily: "var(--font-sans)",
          }}>Edit Symptoms</button>
        </div>
      </div>
    );
  }

  // ── PROGRESS BAR ─────────────────────────────────────────────────────────
  const pct = ((step + 1) / STEPS.length) * 100;

  return (
    <div>
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 4 }}>
            Step {step + 1} / {STEPS.length}
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#fff", fontFamily: "var(--font-serif)" }}>
            {STEPS[step]}
          </div>
        </div>
        <div style={{ fontSize: 36 }}>{STEP_ICONS[step]}</div>
      </div>

      {/* Progress */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ width: "100%", height: 3, background: "rgba(255,255,255,0.07)", borderRadius: 2 }}>
          <div style={{ width: `${pct}%`, height: "100%", background: "var(--accent)", borderRadius: 2, transition: "width 0.4s cubic-bezier(0.4,0,0.2,1)", boxShadow: "0 0 8px var(--accent)" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{ fontSize: 11, fontWeight: 600, color: i <= step ? "var(--accent)" : "rgba(255,255,255,0.2)", transition: "color 0.3s" }}>{s}</div>
          ))}
        </div>
      </div>

      {/* ── STEP 0: PROFILE ─────────────────────────────────────────────── */}
      {step === 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          {/* Age */}
          <div>
            <label style={lbl}>Age</label>
            <div style={{ position: "relative" }}>
              <input type="number" min={1} max={120}
                placeholder="35" value={form.age}
                onChange={e => set("age", e.target.value)}
                suppressHydrationWarning
                style={{ ...inp, fontSize: 28, fontWeight: 700, color: "#fff", textAlign: "center", letterSpacing: "0.05em", padding: "18px 60px" }}
              />
              <span style={{ position: "absolute", right: 20, top: "50%", transform: "translateY(-50%)", fontSize: 13, color: "rgba(255,255,255,0.3)", fontWeight: 600 }}>yrs</span>
            </div>
            <p style={hint}>Enter your current age in years</p>
          </div>

          {/* Sex */}
          <div>
            <label style={lbl}>Biological Sex</label>
            <div style={{ display: "flex", gap: 12 }}>
              {[{ v: "0", l: "Male", i: "" }, { v: "1", l: "Female", i: "" }].map(g => (
                <button key={g.v} onClick={() => set("gender", g.v)} style={{
                  flex: 1, padding: "20px 12px",
                  background: form.gender === g.v ? "rgba(0,232,122,0.1)" : "rgba(255,255,255,0.03)",
                  border: `1.5px solid ${form.gender === g.v ? "var(--accent)" : "rgba(255,255,255,0.08)"}`,
                  borderRadius: 14, cursor: "pointer", fontFamily: "var(--font-sans)",
                  transition: "all 0.2s",
                }}>
                  <div style={{ fontSize: 28, marginBottom: 6, color: form.gender === g.v ? "var(--accent)" : "rgba(255,255,255,0.4)" }}>{g.i}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: form.gender === g.v ? "var(--accent)" : "rgba(255,255,255,0.5)" }}>{g.l}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Weight */}
          <div>
            <label style={lbl}>Weight Category</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { v: "underweight", l: "Underweight", s: "BMI < 18.5", i: "" },
                { v: "normal",      l: "Normal",      s: "BMI 18.5–24.9", i: "" },
                { v: "overweight",  l: "Overweight",  s: "BMI 25–29.9", i: "" },
                { v: "obese",       l: "Obese",       s: "BMI ≥ 30", i: "" },
              ].map(w => {
                const act = form.weight_category === w.v;
                return (
                  <button key={w.v} onClick={() => set("weight_category", w.v)} style={{
                    padding: "16px 14px", textAlign: "left",
                    background: act ? "rgba(0,232,122,0.08)" : "rgba(255,255,255,0.03)",
                    border: `1.5px solid ${act ? "var(--accent)" : "rgba(255,255,255,0.08)"}`,
                    borderRadius: 14, cursor: "pointer", transition: "all 0.2s", fontFamily: "var(--font-sans)",
                  }}>
                    <div style={{ fontSize: 22, marginBottom: 8 }}>{w.i}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: act ? "var(--accent)" : "rgba(255,255,255,0.7)", marginBottom: 3 }}>{w.l}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.28)" }}>{w.s}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 1: HISTORY ─────────────────────────────────────────────── */}
      {step === 1 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <Section label="Lifestyle" />
          <ChipGroup>
            <Chip label="Smoker" icon="" active={form.smoking} onClick={() => set("smoking", !form.smoking)} />
            <Chip label="Alcohol" icon="" active={form.alcohol_consumption} onClick={() => set("alcohol_consumption", !form.alcohol_consumption)} />
            <Chip label="Recent Travel" icon="" active={form.recent_travel} onClick={() => set("recent_travel", !form.recent_travel)} />
            <Chip label="High-Risk Lifestyle" icon="" active={form.high_risk_lifestyle} onClick={() => set("high_risk_lifestyle", !form.high_risk_lifestyle)} />
          </ChipGroup>

          <div style={{ height: 1, background: "rgba(255,255,255,0.06)" }} />

          <Section label="Medical History" />
          <ChipGroup>
            <Chip label="Family History" icon="" active={form.family_history} onClick={() => set("family_history", !form.family_history)} />
            <Chip label="Diabetes" icon="" active={form.pre_existing_diabetes} onClick={() => set("pre_existing_diabetes", !form.pre_existing_diabetes)} />
            <Chip label="Hypertension" icon="" active={form.pre_existing_hypertension} onClick={() => set("pre_existing_hypertension", !form.pre_existing_hypertension)} />
            <Chip label="Heart Condition" icon="" active={form.pre_existing_heart_condition} onClick={() => set("pre_existing_heart_condition", !form.pre_existing_heart_condition)} />
          </ChipGroup>

          {(form.pre_existing_diabetes || form.pre_existing_hypertension || form.pre_existing_heart_condition) && (
            <div style={{ padding: "12px 16px", background: "rgba(255,107,107,0.07)", border: "1px solid rgba(255,107,107,0.15)", borderRadius: 10, fontSize: 12, color: "rgba(255,150,150,0.8)", lineHeight: 1.6 }}>
              Pre-existing conditions noted — these significantly influence risk scoring.
            </div>
          )}
        </div>
      )}

      {/* ── STEP 2: CONDITION ───────────────────────────────────────────── */}
      {step === 2 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          {/* Days */}
          <div>
            <label style={lbl}>How long have you been unwell?</label>
            <div style={{ position: "relative" }}>
              <input type="number" min={0} max={1825} suppressHydrationWarning
                placeholder="e.g. 3" value={form.days_since_onset}
                onChange={e => set("days_since_onset", e.target.value)}
                style={{ ...inp, fontSize: 28, fontWeight: 700, color: "#fff", textAlign: "center", padding: "18px 60px" }}
              />
              <span style={{ position: "absolute", right: 20, top: "50%", transform: "translateY(-50%)", fontSize: 13, color: "rgba(255,255,255,0.3)", fontWeight: 600 }}>days</span>
            </div>
            {form.days_since_onset !== "" && (() => {
              const d = +form.days_since_onset;
              const [bg, brd, col, msg] =
                d <= 14  ? ["rgba(0,232,122,0.07)","rgba(0,232,122,0.2)","var(--accent)","Acute — 0 to 14 days"] :
                d <= 90  ? ["rgba(255,170,0,0.07)","rgba(255,170,0,0.2)","#ffaa00","Sub-acute — 15 to 90 days"] :
                           ["rgba(255,68,68,0.07)","rgba(255,68,68,0.2)","#ff6b6b","Chronic — over 90 days"];
              return (
                <div style={{ marginTop: 12, padding: "10px 16px", background: bg, border: `1px solid ${brd}`, borderRadius: 10, fontSize: 13, fontWeight: 600, color: col }}>
                  {msg}
                </div>
              );
            })()}
          </div>

          {/* Sliders */}
          <SliderRow
            label="Pain Severity" value={+form.pain_severity} max={8}
            onChange={v => set("pain_severity", String(v))}
            ticks={["None","","Mild","","","Moderate","","","Severe"]}
            colorAt={v => v <= 2 ? "var(--accent)" : v <= 5 ? "#ffaa00" : "#ff4444"}
          />
          <SliderRow
            label="Fever Severity" value={+form.fever_severity} max={4}
            onChange={v => set("fever_severity", String(v))}
            ticks={["None","Low","Moderate","High","Very High"]}
            colorAt={v => v === 0 ? "var(--accent)" : v <= 2 ? "#ffaa00" : "#ff4444"}
          />
          <SliderRow
            label="Overall Severity" value={+form.severity_score} max={9} offset={1}
            onChange={v => set("severity_score", String(v + 1))}
            ticks={["1","2","3","4","5","6","7","8","9","10"]}
            colorAt={v => v <= 2 ? "var(--accent)" : v <= 5 ? "#ffaa00" : "#ff4444"}
            displayVal={+form.severity_score || 1}
          />
        </div>
      )}

      {/* ── STEP 3: SYMPTOMS ────────────────────────────────────────────── */}
      {step === 3 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {totalSymptoms > 0 && (
            <div style={{ padding: "10px 16px", background: "rgba(0,232,122,0.08)", border: "1px solid rgba(0,232,122,0.2)", borderRadius: 10, fontSize: 13, fontWeight: 600, color: "var(--accent)", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent)", display: "inline-block" }} />
              {totalSymptoms} symptom{totalSymptoms !== 1 ? "s" : ""} selected
            </div>
          )}

          <SymGroup label="General">
            <ChipGroup wrap>
              <Chip label="Fever" icon="" active={form.fever} onClick={() => set("fever", !form.fever)} />
              <Chip label="Chills" icon="" active={form.chills} onClick={() => set("chills", !form.chills)} />
              <Chip label="Fatigue" icon="" active={form.fatigue} onClick={() => set("fatigue", !form.fatigue)} />
              <Chip label="Weakness" icon="" active={form.weakness} onClick={() => set("weakness", !form.weakness)} />
              <Chip label="Sweating" icon="" active={form.sweating} onClick={() => set("sweating", !form.sweating)} />
              <Chip label="Headache" icon="" active={form.headache} onClick={() => set("headache", !form.headache)} />
            </ChipGroup>
          </SymGroup>

          <SymGroup label="Respiratory">
            <ChipGroup wrap>
              <Chip label="Cough" icon="" active={form.cough} onClick={() => set("cough", !form.cough)} />
              <Chip label="Short of Breath" icon="" active={form.shortness_of_breath} onClick={() => set("shortness_of_breath", !form.shortness_of_breath)} />
              <Chip label="Sore Throat" icon="" active={form.sore_throat} onClick={() => set("sore_throat", !form.sore_throat)} />
              <Chip label="Runny Nose" icon="" active={form.runny_nose} onClick={() => set("runny_nose", !form.runny_nose)} />
              <Chip label="Loss of Smell/Taste" icon="" active={form.loss_of_smell_taste} onClick={() => set("loss_of_smell_taste", !form.loss_of_smell_taste)} />
            </ChipGroup>
          </SymGroup>

          <SymGroup label="Digestive">
            <ChipGroup wrap>
              <Chip label="Nausea" icon="" active={form.nausea} onClick={() => set("nausea", !form.nausea)} />
              <Chip label="Vomiting" icon="" active={form.vomiting} onClick={() => set("vomiting", !form.vomiting)} />
              <Chip label="Diarrhoea" icon="" active={form.diarrhea} onClick={() => set("diarrhea", !form.diarrhea)} />
              <Chip label="Constipation" icon="" active={form.constipation} onClick={() => set("constipation", !form.constipation)} />
              <Chip label="Abdominal Pain" icon="" active={form.abdominal_pain} onClick={() => set("abdominal_pain", !form.abdominal_pain)} />
              <Chip label="Loss of Appetite" icon="" active={form.loss_of_appetite} onClick={() => set("loss_of_appetite", !form.loss_of_appetite)} />
            </ChipGroup>
          </SymGroup>

          <SymGroup label="Pain">
            <ChipGroup wrap>
              <Chip label="Chest Pain" icon="" active={form.chest_pain} onClick={() => set("chest_pain", !form.chest_pain)} />
              <Chip label="Joint Pain" icon="" active={form.joint_pain} onClick={() => set("joint_pain", !form.joint_pain)} />
              <Chip label="Muscle Pain" icon="" active={form.muscle_pain} onClick={() => set("muscle_pain", !form.muscle_pain)} />
            </ChipGroup>
          </SymGroup>

          <SymGroup label="Neurological">
            <ChipGroup wrap>
              <Chip label="Confusion" icon="" active={form.confusion} onClick={() => set("confusion", !form.confusion)} />
              <Chip label="Memory Loss" icon="" active={form.memory_loss} onClick={() => set("memory_loss", !form.memory_loss)} />
              <Chip label="Dizziness" icon="" active={form.dizziness} onClick={() => set("dizziness", !form.dizziness)} />
              <Chip label="Numbness" icon="" active={form.numbness} onClick={() => set("numbness", !form.numbness)} />
              <Chip label="Vision Issues" icon="" active={form.vision_problems} onClick={() => set("vision_problems", !form.vision_problems)} />
              <Chip label="Speech Issues" icon="" active={form.speech_problems} onClick={() => set("speech_problems", !form.speech_problems)} />
              <Chip label="Personality Changes" icon="" active={form.personality_changes} onClick={() => set("personality_changes", !form.personality_changes)} />
              <Chip label="Behavioural Issues" icon="" active={form.behavioral_problems} onClick={() => set("behavioral_problems", !form.behavioral_problems)} />
            </ChipGroup>
          </SymGroup>

          <SymGroup label="Skin & Lymph">
            <ChipGroup wrap>
              <Chip label="Skin Rash" icon="" active={form.skin_rash} onClick={() => set("skin_rash", !form.skin_rash)} />
              <Chip label="Swollen Lymph Nodes" icon="" active={form.swollen_lymph_nodes} onClick={() => set("swollen_lymph_nodes", !form.swollen_lymph_nodes)} />
            </ChipGroup>
          </SymGroup>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ marginTop: 20, padding: "14px 18px", background: "rgba(255,68,68,0.08)", border: "1px solid rgba(255,68,68,0.2)", borderRadius: 12, fontSize: 13, color: "rgba(255,120,120,0.9)", lineHeight: 1.7, whiteSpace: "pre-line" }}>
          <div style={{ fontWeight: 700, marginBottom: 4 }}>Error</div>
          {error}
        </div>
      )}

      {/* Navigation */}
      <div style={{ display: "flex", gap: 12, marginTop: 40 }}>
        {step > 0 && (
          <button onClick={() => setStep(s => s - 1)} style={{
            flex: "0 0 auto", padding: "14px 24px",
            background: "transparent", border: "1.5px solid rgba(255,255,255,0.1)",
            borderRadius: 12, color: "rgba(255,255,255,0.45)", fontSize: 14, fontWeight: 600,
            cursor: "pointer", fontFamily: "var(--font-sans)", transition: "all 0.2s",
          }}>← Back</button>
        )}
        {step < 3 ? (
          <button onClick={() => setStep(s => s + 1)} disabled={!canAdvance()} style={{
            flex: 1, padding: "14px 24px",
            background: canAdvance() ? "var(--accent)" : "rgba(255,255,255,0.06)",
            border: "none", borderRadius: 12,
            color: canAdvance() ? "#000" : "rgba(255,255,255,0.2)",
            fontSize: 14, fontWeight: 700, cursor: canAdvance() ? "pointer" : "not-allowed",
            fontFamily: "var(--font-sans)", transition: "all 0.25s",
          }}>Continue →</button>
        ) : (
          <button onClick={predict} disabled={loading} style={{
            flex: 1, padding: "14px 24px",
            background: loading ? "rgba(0,232,122,0.3)" : "var(--accent)",
            border: "none", borderRadius: 12,
            color: "#000", fontSize: 14, fontWeight: 700,
            cursor: loading ? "not-allowed" : "pointer",
            fontFamily: "var(--font-sans)", transition: "all 0.25s",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
          }}>
            {loading ? (
              <>
                <span style={{ width: 16, height: 16, border: "2.5px solid rgba(0,0,0,0.2)", borderTopColor: "#000", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" }} />
                Analysing…
              </>
            ) : "Predict Disease →"}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function Section({ label }: { label: string }) {
  return (
    <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
      {label}
    </div>
  );
}

function ChipGroup({ children, wrap }: { children: React.ReactNode; wrap?: boolean }) {
  return (
    <div style={{ display: "flex", flexWrap: wrap ? "wrap" : "nowrap", gap: 8 }}>
      {children}
    </div>
  );
}

function SymGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>
        {label}
      </div>
      {children}
    </div>
  );
}

function SliderRow({
  label, value, max, offset = 0, onChange, ticks, colorAt, displayVal,
}: {
  label: string; value: number; max: number; offset?: number;
  onChange: (v: number) => void; ticks: string[];
  colorAt: (v: number) => string; displayVal?: number;
}) {
  const v = value - offset;
  const color = colorAt(v);
  const pct = (v / max) * 100;
  const shown = displayVal !== undefined ? displayVal : value;
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.55)" }}>{label}</div>
        <div style={{ fontSize: 26, fontWeight: 800, color, lineHeight: 1, fontFamily: "var(--font-serif)", minWidth: 32, textAlign: "right" }}>{shown}</div>
      </div>
      <input
        suppressHydrationWarning
        type="range" min={0} max={max} value={v}
        onChange={e => onChange(+e.target.value + offset)}
        style={{
          width: "100%", height: 5, borderRadius: 3, cursor: "pointer",
          background: `linear-gradient(to right, ${color} ${pct}%, rgba(255,255,255,0.08) ${pct}%)`,
          appearance: "none", outline: "none", marginBottom: 8,
        }}
      />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {ticks.map((t, i) => (
          <div key={i} style={{ fontSize: 10, color: i === v ? color : "rgba(255,255,255,0.2)", fontWeight: i === v ? 700 : 400, transition: "color 0.2s", textAlign: "center", flex: 1 }}>
            {t}
          </div>
        ))}
      </div>
    </div>
  );
}

// Shared styles
const lbl: React.CSSProperties = {
  fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.4)",
  letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12, display: "block",
};
const inp: React.CSSProperties = {
  width: "100%", background: "rgba(255,255,255,0.04)",
  border: "1.5px solid rgba(255,255,255,0.1)", borderRadius: 14,
  color: "rgba(255,255,255,0.9)", fontFamily: "var(--font-sans)",
  fontSize: 16, padding: "14px 18px", outline: "none", boxSizing: "border-box",
  transition: "border-color 0.2s",
};
const hint: React.CSSProperties = {
  fontSize: 12, color: "rgba(255,255,255,0.25)", marginTop: 8, lineHeight: 1.5,
};
