"use client";
import { useEffect, useRef } from "react";

export default function Hero() {
  const orbRef1 = useRef<HTMLDivElement>(null);
  const orbRef2 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      if (orbRef1.current) {
        orbRef1.current.style.transform = `translate(${x * 30}px, ${y * 30}px)`;
      }
      if (orbRef2.current) {
        orbRef2.current.style.transform = `translate(${-x * 20}px, ${-y * 20}px)`;
      }
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  return (
    <section
      id="features"
      style={{
        minHeight: "100vh",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        paddingTop: 80,
      }}
    >
      {/* Background grid */}
      <div
        className="bg-grid"
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.3,
        }}
      />

      {/* Orbs */}
      <div
        ref={orbRef1}
        className="orb"
        style={{
          width: 500,
          height: 500,
          background: "radial-gradient(circle, rgba(0,232,122,0.2) 0%, transparent 70%)",
          top: "10%",
          left: "-10%",
          transition: "transform 0.5s ease",
        }}
      />
      <div
        ref={orbRef2}
        className="orb"
        style={{
          width: 400,
          height: 400,
          background: "radial-gradient(circle, rgba(0,160,80,0.15) 0%, transparent 70%)",
          bottom: "10%",
          right: "-5%",
          transition: "transform 0.5s ease",
          animationDelay: "2s",
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          textAlign: "center",
          maxWidth: 900,
          padding: "0 24px",
        }}
      >
        {/* Badge */}
        <div
          className="animate-slide-up"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "var(--accent-glow)",
            border: "1px solid rgba(0,232,122,0.3)",
            borderRadius: 100,
            padding: "6px 16px",
            marginBottom: 32,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "var(--accent)",
              display: "block",
              animation: "glowPulse 1.5s ease-in-out infinite",
            }}
          />
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "var(--accent)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            ML-Powered · HistGradientBoosting · 91.6% Accuracy
          </span>
        </div>

        {/* Headline */}
        <h1
          className="animate-slide-up delay-1"
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(52px, 8vw, 96px)",
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            marginBottom: 24,
            opacity: 0,
          }}
        >
          Know what your{" "}
          <span className="shimmer-text">symptoms</span>
          <br />
          are telling you
        </h1>

        <p
          className="animate-slide-up delay-2"
          style={{
            fontSize: "clamp(16px, 2vw, 20px)",
            color: "var(--text-muted)",
            maxWidth: 600,
            margin: "0 auto 48px",
            lineHeight: 1.7,
            opacity: 0,
          }}
        >
          HealthBuddy analyses your symptoms, vitals, and medical history using a
          HistGradientBoosting model trained on clinical data to give you
          an instant disease prediction with 91.6% accuracy.
        </p>

        {/* CTA */}
        <div
          className="animate-slide-up delay-3"
          style={{
            display: "flex",
            gap: 16,
            justifyContent: "center",
            flexWrap: "wrap",
            opacity: 0,
          }}
        >
          <a
            href="#predict"
            className="hb-btn"
            style={{ textDecoration: "none", display: "inline-block" }}
          >
            Start Diagnosis →
          </a>
          <a
            href="#how-it-works"
            className="hb-btn-outline"
            style={{ textDecoration: "none", display: "inline-block" }}
          >
            How it works
          </a>
        </div>

        {/* Stats */}
        <div
          className="animate-slide-up delay-4"
          style={{
            display: "flex",
            gap: 48,
            justifyContent: "center",
            marginTop: 80,
            opacity: 0,
          }}
        >
          {[
            { val: "935K", label: "Training Samples" },
            { val: "42", label: "Features" },
            { val: "91.6%", label: "Accuracy" },
            { val: "11", label: "Diseases" },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: 32,
                  fontWeight: 800,
                  color: "var(--accent)",
                  lineHeight: 1,
                  marginBottom: 6,
                  fontFamily: "var(--font-serif)",
                }}
              >
                {stat.val}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "var(--text-dim)",
                  fontWeight: 500,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        style={{
          position: "absolute",
          bottom: 32,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          animation: "float 2s ease-in-out infinite",
        }}
      >
        <span style={{ fontSize: 11, color: "var(--text-dim)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Scroll
        </span>
        <div
          style={{
            width: 1,
            height: 40,
            background: "linear-gradient(to bottom, var(--text-dim), transparent)",
          }}
        />
      </div>
    </section>
  );
}
