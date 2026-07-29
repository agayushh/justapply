"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTrackedCompanies } from "@/lib/tracker";

export default function Navbar() {
  const pathname = usePathname();
  const { trackedMap, isLoaded } = useTrackedCompanies();
  const savedCount = Object.keys(trackedMap).length;

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "rgba(246, 241, 233, 0.9)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <nav
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 1.5rem",
          height: "64px",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            textDecoration: "none",
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: "8px",
              background: "linear-gradient(135deg, #4F46E5 0%, #3730A3 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              boxShadow: "0 2px 8px rgba(79,70,229,0.3)",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="8" height="8" rx="2" fill="white" />
              <rect x="13" y="3" width="8" height="8" rx="2" fill="white" opacity="0.6" />
              <rect x="3" y="13" width="8" height="8" rx="2" fill="white" opacity="0.6" />
              <rect x="13" y="13" width="8" height="8" rx="2" fill="white" />
            </svg>
          </div>
          <span
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "1.25rem",
              fontWeight: 700,
              color: "var(--text-primary)",
              letterSpacing: "-0.02em",
            }}
          >
            JustApply
          </span>
        </Link>

        {/* Nav links */}
        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <Link
            href="/"
            style={{
              fontSize: "0.875rem",
              fontWeight: pathname === "/" ? 600 : 500,
              color: pathname === "/" ? "var(--accent)" : "var(--text-secondary)",
              textDecoration: "none",
              transition: "color 0.15s ease",
            }}
          >
            Browse
          </Link>

          <Link
            href="/tracker"
            style={{
              fontSize: "0.875rem",
              fontWeight: pathname === "/tracker" ? 600 : 500,
              color: pathname === "/tracker" ? "var(--accent)" : "var(--text-secondary)",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 10px",
              borderRadius: "6px",
              background: savedCount > 0 ? "rgba(79,70,229,0.08)" : "transparent",
              transition: "all 0.15s ease",
            }}
          >
            <span>My Tracker</span>
            {isLoaded && savedCount > 0 && (
              <span
                style={{
                  background: "var(--accent)",
                  color: "#fff",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  borderRadius: "999px",
                  padding: "1px 7px",
                  minWidth: "18px",
                  textAlign: "center",
                }}
              >
                {savedCount}
              </span>
            )}
          </Link>

          <Link
            href="/submit"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 16px",
              background: "var(--accent)",
              color: "#fff",
              borderRadius: "8px",
              fontSize: "0.8125rem",
              fontWeight: 600,
              textDecoration: "none",
              boxShadow: "0 2px 8px rgba(79,70,229,0.25)",
              transition: "transform 0.15s ease, background-color 0.15s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "")}
          >
            + Submit Company
          </Link>
        </div>
      </nav>
    </header>
  );
}
