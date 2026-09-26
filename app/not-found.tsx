import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main
        style={{
          minHeight: "calc(100vh - 128px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "4rem 2rem",
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: "4rem", marginBottom: "1.5rem" }}>🗺️</p>
        <h1
          style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
            fontWeight: 700,
            color: "var(--text-primary)",
            marginBottom: "0.75rem",
            letterSpacing: "-0.02em",
          }}
        >
          Company not found
        </h1>
        <p
          style={{
            fontSize: "1rem",
            color: "var(--text-secondary)",
            maxWidth: "400px",
            marginBottom: "2rem",
            lineHeight: 1.6,
          }}
        >
          This company page doesn&apos;t exist or may have been removed. Browse
          all companies below.
        </p>
        <Link
          href="/"
          style={{
            padding: "11px 24px",
            background: "var(--accent)",
            color: "#fff",
            borderRadius: "8px",
            fontWeight: 600,
            fontSize: "0.9rem",
            textDecoration: "none",
            boxShadow: "0 2px 8px var(--accent-glow)",
          }}
        >
          Browse All Companies
        </Link>
      </main>
      <Footer />
    </>
  );
}
