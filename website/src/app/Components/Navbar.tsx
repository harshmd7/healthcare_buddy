"use client";
import { useState, useEffect } from "react";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { isLoaded, isSignedIn } = useUser();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: "16px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: scrolled ? "rgba(5, 13, 10, 0.9)" : "transparent",
        borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        transition: "all 0.3s ease",
      }}
    >
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div
          style={{
            width: 36,
            height: 36,
            background: "var(--accent)",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
            fontWeight: 800,
            color: "#000",
            letterSpacing: "-0.05em",
          }}
        >
          H
        </div>
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 700,
            fontSize: 18,
            color: "var(--text)",
            letterSpacing: "-0.02em",
          }}
        >
          Health<span style={{ color: "var(--accent)" }}>Buddy</span>
        </span>
      </div>

      {/* Links */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        {["Features", "How It Works", "Predict"].map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase().replace(/ /g, "-")}`}
            style={{
              color: "var(--text-muted)",
              textDecoration: "none",
              fontSize: 14,
              fontWeight: 500,
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
          >
            {item}
          </a>
        ))}
        {isLoaded && !isSignedIn ? (
          <>
            <SignInButton mode="modal">
              <button
                style={{
                  background: "transparent",
                  color: "var(--text)",
                  border: "1px solid var(--border)",
                  fontSize: 13,
                  fontWeight: 700,
                  padding: "8px 16px",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Sign in
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button
                style={{
                  background: "var(--accent)",
                  color: "#000",
                  border: "none",
                  fontSize: 13,
                  fontWeight: 700,
                  padding: "8px 18px",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Sign up
              </button>
            </SignUpButton>
          </>
        ) : (
          <UserButton />
        )}
      </div>
    </nav>
  );
}
