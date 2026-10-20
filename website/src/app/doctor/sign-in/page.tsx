import { SignIn } from "@clerk/nextjs";

export default function DoctorSignInPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 24,
        background: "radial-gradient(circle at top, rgba(0,232,122,0.12), transparent 40%), var(--bg)",
      }}
    >
      <div style={{ width: "100%", maxWidth: 480 }}>
        <SignIn
          routing="path"
          path="/doctor/sign-in"
          fallbackRedirectUrl="/doctor"
        />
      </div>
    </main>
  );
}