import Link from "next/link";

export default function Navbar() {
  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 2rem",
        height: "64px",
        background: "rgba(246, 241, 233, 0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border-light)",
      }}
    >
      {/* Logo */}
      <Link
        href="/"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          textDecoration: "none",
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="2" y="2" width="9" height="9" rx="2" fill="#4F46E5" />
          <rect
            x="13"
            y="2"
            width="9"
            height="9"
            rx="2"
            fill="#4F46E5"
            opacity="0.5"
          />
          <rect
            x="2"
            y="13"
            width="9"
            height="9"
            rx="2"
            fill="#4F46E5"
            opacity="0.5"
          />
          <rect x="13" y="13" width="9" height="9" rx="2" fill="#4F46E5" />
        </svg>
        <span
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "1.2rem",
            fontWeight: 700,
            color: "var(--text-primary)",
            letterSpacing: "-0.02em",
          }}
        >
          JustApply
        </span>
      </Link>

      {/* Nav links */}
      <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
        <Link
          href="/"
          style={{
            fontSize: "0.875rem",
            fontWeight: 500,
            color: "var(--text-secondary)",
            textDecoration: "none",
          }}
        >
          Companies
        </Link>
        <Link
          href="/#categories"
          style={{
            fontSize: "0.875rem",
            fontWeight: 500,
            color: "var(--text-secondary)",
            textDecoration: "none",
          }}
        >
          Categories
        </Link>
        <a
          href="mailto:hello@justapply.dev"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 16px",
            background: "var(--accent)",
            color: "#fff",
            borderRadius: "6px",
            fontSize: "0.8125rem",
            fontWeight: 600,
            textDecoration: "none",
            boxShadow: "0 1px 3px rgba(79,70,229,0.25)",
          }}
        >
          Submit a Company
        </a>
      </div>
    </nav>
  );
}
