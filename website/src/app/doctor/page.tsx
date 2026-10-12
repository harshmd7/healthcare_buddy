"use client";
import { useEffect, useState, useCallback } from "react";

type Doctor = { id: string; name: string; specialization: string };
type Top3Entry = { disease: string; confidence: number };
type CaseItem = {
  id: string;
  status: string;
  patientName: string;
  predictedDisease: string;
  confidence: number;
  top3Json: string;
  confirmedDisease: string | null;
  doctorNote: string | null;
  createdAt: string;
  doctor: Doctor | null;
};

const DISEASES = [
  "Brain Stroke", "Heart Disease", "COVID-19", "Pneumonia", "Tuberculosis",
  "Dengue", "Alzheimer's Disease", "Typhoid", "Malaria", "Diabetes", "No Disease",
];

export default function DoctorDashboard() {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCase, setActiveCase] = useState<CaseItem | null>(null);
  const [confirmDisease, setConfirmDisease] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/doctors/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setDoctor(d.doctor);
        else setProfileError(d.error || "This account is not linked to a doctor profile.");
        if (d.success) {
          fetch("/api/cases")
            .then((response) => response.json())
            .then((casesResponse) => {
              if (casesResponse.success) setCases(casesResponse.cases);
              else setProfileError(casesResponse.error || "Unable to load cases.");
              setLoading(false);
            })
            .catch(() => {
              setProfileError("Unable to load your case queue.");
              setLoading(false);
            });
        } else {
          setLoading(false);
        }
      })
      .catch(() => {
        setProfileError("Unable to load your doctor profile.");
        setLoading(false);
      });
  }, []);

  const loadCases = useCallback(() => {
    if (!doctor) return;
    setLoading(true);
    fetch("/api/cases")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setCases(d.cases);
        else setProfileError(d.error || "Unable to load cases.");
        setLoading(false);
      })
      .catch(() => {
        setProfileError("Unable to load your case queue.");
        setLoading(false);
      });
  }, [doctor]);

  const openCase = (c: CaseItem) => {
    setActiveCase(c);
    setConfirmDisease(c.confirmedDisease || c.predictedDisease);
    setNote(c.doctorNote || "");
  };

  const acceptCase = async (c: CaseItem) => {
    setActionError(null);
    const response = await fetch(`/api/cases/${c.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "in_review" }),
    });
    if (!response.ok) {
      const data = await response.json();
      setActionError(data.error || "Could not accept this case.");
      return;
    }
    loadCases();
  };

  const submitReview = async () => {
    if (!activeCase) return;
    setSaving(true);
    setActionError(null);
    const response = await fetch(`/api/cases/${activeCase.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: "completed",
        confirmedDisease: confirmDisease,
        doctorNote: note,
      }),
    });
    if (!response.ok) {
      const data = await response.json();
      setActionError(data.error || "Could not save this review.");
      setSaving(false);
      return;
    }
    setSaving(false);
    setActiveCase(null);
    loadCases();
  };

  const statusColor = (status: string) =>
    status === "pending" ? "#ffaa00" : status === "in_review" ? "#00b4d8" : "#00e87a";

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "#fff", padding: "40px 24px", fontFamily: "var(--font-sans), sans-serif" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 4 }}>
              Doctor Dashboard
            </div>
            <div style={{ fontSize: 26, fontWeight: 700, fontFamily: "var(--font-serif)" }}>Case Queue</div>
          </div>

          {doctor && (
            <div style={{ textAlign: "right", fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
              <div style={{ color: "#fff", fontWeight: 700 }}>{doctor.name}</div>
              <div>{doctor.specialization}</div>
            </div>
          )}
        </div>

        {profileError && (
          <div style={{ border: "1px solid rgba(255,107,107,0.35)", background: "rgba(255,107,107,0.08)", borderRadius: 10, padding: 16, color: "#ff9b9b", marginBottom: 18 }}>
            {profileError} {profileError.includes("linked") && <a href="/doctor/sign-in" style={{ color: "#fff" }}>Use a doctor account</a>}
          </div>
        )}

        {actionError && (
          <div style={{ border: "1px solid rgba(255,170,0,0.35)", background: "rgba(255,170,0,0.08)", borderRadius: 10, padding: 16, color: "#ffd166", marginBottom: 18 }}>
            {actionError}
          </div>
        )}

        {loading && <div style={{ color: "rgba(255,255,255,0.5)" }}>Loading cases...</div>}

        {!loading && cases.length === 0 && (
          <div style={{ color: "rgba(255,255,255,0.4)", padding: "40px 0", textAlign: "center" }}>
            No cases assigned to this doctor yet.
          </div>
        )}

        <div style={{ display: "grid", gap: 12 }}>
          {cases.map((c) => (
            <div
              key={c.id}
              style={{
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 12, padding: "16px 20px", display: "flex", alignItems: "center",
                justifyContent: "space-between", gap: 16, flexWrap: "wrap",
              }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{c.patientName}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", marginTop: 2 }}>
                  Predicted: <strong style={{ color: "#fff" }}>{c.predictedDisease}</strong> ({Math.round(c.confidence * 100)}% confidence)
                </div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 4 }}>
                  {new Date(c.createdAt).toLocaleString()}
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{
                  fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em",
                  color: statusColor(c.status), border: `1px solid ${statusColor(c.status)}40`,
                  borderRadius: 20, padding: "4px 10px",
                }}>
                  {c.status.replace("_", " ")}
                </span>

                {c.status === "pending" && (
                  <button onClick={() => acceptCase(c)} style={btnStyle("#00b4d8")}>Accept</button>
                )}
                {c.status !== "pending" && (
                  <button onClick={() => openCase(c)} style={btnStyle("var(--accent)", c.status === "completed")}>
                    {c.status === "completed" ? "View" : "Review"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {activeCase && (
        <div
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
            display: "flex", alignItems: "center", justifyContent: "center", padding: 20, zIndex: 50,
          }}
          onClick={() => setActiveCase(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#0e0e12", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 16,
              padding: 28, maxWidth: 480, width: "100%", maxHeight: "85vh", overflowY: "auto",
            }}
          >
            <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>{activeCase.patientName}</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 20 }}>
              Case ID: {activeCase.id}
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>
                Model Top-3 Predictions
              </div>
              {(JSON.parse(activeCase.top3Json) as Top3Entry[]).map((t) => (
                <div key={t.disease} style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", marginBottom: 4 }}>
                  {t.disease} — {Math.round(t.confidence * 100)}%
                </div>
              ))}
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Confirm or correct the diagnosis</label>
              <select
                value={confirmDisease}
                onChange={(e) => setConfirmDisease(e.target.value)}
                disabled={activeCase.status === "completed"}
                style={selectStyle}
              >
                {DISEASES.map((d) => (
                  <option key={d} value={d} style={{ color: "#000" }}>{d}</option>
                ))}
              </select>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 6 }}>
                This confirmed label is stored as verified data for future model retraining.
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Doctor note / next steps</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                disabled={activeCase.status === "completed"}
                rows={4}
                placeholder="e.g. Prescribe rest and fluids; recommend in-person follow-up if fever persists beyond 3 days."
                style={{ ...selectStyle, resize: "vertical" }}
              />
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              {activeCase.status !== "completed" && (
                <button onClick={submitReview} disabled={saving} style={{ ...btnStyle("var(--accent)"), flex: 1 }}>
                  {saving ? "Saving..." : "Submit Review"}
                </button>
              )}
              <button onClick={() => setActiveCase(null)} style={{ ...btnStyle("transparent"), color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.15)" }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: 12, fontWeight: 700, textTransform: "uppercase",
  letterSpacing: "0.08em", color: "rgba(255,255,255,0.4)", marginBottom: 8,
};

const selectStyle: React.CSSProperties = {
  width: "100%", background: "rgba(255,255,255,0.06)", color: "#fff",
  border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, padding: "10px 12px", fontSize: 14,
};

function btnStyle(bg: string, disabled = false): React.CSSProperties {
  return {
    padding: "9px 18px", background: bg, color: bg === "transparent" ? "#fff" : "#000",
    border: "none", borderRadius: 8, fontWeight: 700, fontSize: 13,
    cursor: disabled ? "default" : "pointer", opacity: disabled ? 0.5 : 1,
  };
}
