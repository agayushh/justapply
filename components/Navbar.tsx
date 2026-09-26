"use client";

import { useState, type CSSProperties } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTrackedCompanies } from "@/lib/tracker";

export default function Navbar() {
  const pathname = usePathname();
  const { trackedMap, isLoaded } = useTrackedCompanies();
  const savedCount = Object.keys(trackedMap).length;
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPath, setMenuPath] = useState(pathname);
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setMenuOpen(false);
  }

  return (
    <header className="site-header">
      <nav className="site-nav">
        <Link href="/" className="wordmark">
          <span className="mark" aria-hidden="true">J</span>
          <span>JustApply</span>
        </Link>

        <button
          type="button"
          className="mobile-nav-toggle"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            {menuOpen ? (
              <path d="M4 4L14 14M14 4L4 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            ) : (
              <path d="M3 5H15M3 9H15M3 13H15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            )}
          </svg>
        </button>

        {/* Nav links */}
        <div className="desktop-nav">
          <Link
            href="/"
            className={`nav-link${pathname === "/" ? " is-active" : ""}`}
          >
            Browse
          </Link>

          <Link
            href="/tracker"
            className={`nav-link${pathname === "/tracker" ? " is-active" : ""}`}
          >
            Tracker
            {isLoaded && savedCount > 0 && (
              <span className="count-badge" style={{ marginLeft: 6 }}>{savedCount}</span>
            )}
          </Link>

          <Link href="/submit" className="nav-pill">
            Submit
          </Link>
        </div>
      </nav>
      {menuOpen && (
        <div className="mobile-nav-panel">
          <Link href="/" style={mobileLinkStyle(pathname === "/")}>
            Browse
          </Link>
          <Link href="/tracker" style={mobileLinkStyle(pathname === "/tracker")}>
            My Tracker{isLoaded && savedCount > 0 ? ` (${savedCount})` : ""}
          </Link>
          <Link href="/submit" style={mobileLinkStyle(pathname === "/submit")}>
            Submit Company
          </Link>
        </div>
      )}
    </header>
  );
}

function mobileLinkStyle(active: boolean): CSSProperties {
  return {
    padding: "0.7rem 0.25rem",
    fontSize: "0.95rem",
    fontWeight: active ? 600 : 500,
    color: active ? "var(--accent)" : "var(--text-primary)",
    textDecoration: "none",
  };
}
