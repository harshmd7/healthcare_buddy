"use client";

import { useEffect, useState } from "react";
import { SignInButton, useUser } from "@clerk/nextjs";

type Prediction = {
  id: string;
  disease: string;
  confidence: string | null;
  createdAt: string;
};

export default function PredictionHistory() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isLoaded, isSignedIn } = useUser();

  useEffect(() => {
    let alive = true;

    async function loadHistory() {
      try {
        const response = await fetch("/api/predictions");

        if (response.status === 401) {
          if (alive) {
            setLoading(false);
          }
          return;
        }

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || "Could not load prediction history");
        }

        if (alive) {
          setPredictions(data.predictions);
          setError(null);
        }
      } catch (loadError) {
        if (alive) {
          setError(loadError instanceof Error ? loadError.message : "Could not load prediction history");
        }
      } finally {
        if (alive) {
          setLoading(false);
        }
      }
    }

    loadHistory();

    return () => {
      alive = false;
    };
  }, []);

  return (
    <section
      style={{
        marginTop: 28,
        padding: 24,
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 20,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 18 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>
            Saved Results
          </div>
          <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 22, color: "var(--text)", fontWeight: 700 }}>
            Your recent predictions
          </h3>
        </div>
        {isLoaded && !isSignedIn ? (
          <SignInButton mode="modal">
            <button
              style={{
                background: "var(--accent)",
                color: "#000",
                border: "none",
                padding: "10px 16px",
                borderRadius: 10,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Sign in to save
            </button>
          </SignInButton>
        ) : null}
      </div>

      {isLoaded && isSignedIn ? (
        <>
          {loading ? (
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>Loading your history...</div>
          ) : error ? (
            <div style={{ color: "#ff9a9a", fontSize: 14 }}>{error}</div>
          ) : predictions.length === 0 ? (
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, lineHeight: 1.6 }}>
              Run a prediction and it will be stored here for your account.
            </div>
          ) : (
            <div style={{ display: "grid", gap: 12 }}>
              {predictions.map((prediction) => (
                <div
                  key={prediction.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 16,
                    padding: "14px 16px",
                    borderRadius: 14,
                    background: "rgba(0,0,0,0.18)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>{prediction.disease}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.38)" }}>
                      {prediction.confidence ?? "confidence unavailable"}
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.32)", whiteSpace: "nowrap" }}>
                    {new Date(prediction.createdAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : null}
    </section>
  );
}