import Link from "next/link";

export default function Footer() {
  const currentYear = 2026;
  return (
    <footer
      style={{
        borderTop: "1px solid var(--border)",
        background: "rgba(246,241,233,0.8)",
        padding: "3.5rem 1.5rem 2rem",
        marginTop: "5rem",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "2.5rem",
            marginBottom: "3rem",
          }}
        >
          {/* Brand */}
          <div>
            <Link
              href="/"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "1.25rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                textDecoration: "none",
              }}
            >
              JustApply
            </Link>
            <p
              style={{
                marginTop: "0.75rem",
                fontSize: "0.83rem",
                color: "var(--text-muted)",
                maxWidth: "260px",
                lineHeight: 1.6,
              }}
            >
              The open, curated careers directory for software developers worldwide. Discover active job openings at top tech companies.
            </p>
          </div>

          {/* Regions */}
          <div>
            <p
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--text-muted)",
                marginBottom: "1rem",
              }}
            >
              Browse by Region
            </p>
            {[
              { name: "🇮🇳 India", slug: "india" },
              { name: "🇺🇸 United States", slug: "us" },
              { name: "🇪🇺 Europe", slug: "europe" },
              { name: "🌍 Remote-first", slug: "remote" },
            ].map((region) => (
              <div key={region.slug} style={{ marginBottom: "0.5rem" }}>
                <Link
                  href={`/region/${region.slug}`}
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--text-secondary)",
                    textDecoration: "none",
                    transition: "color 0.15s ease",
                  }}
                >
                  {region.name}
                </Link>
              </div>
            ))}
          </div>

          {/* Categories */}
          <div>
            <p
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--text-muted)",
                marginBottom: "1rem",
              }}
            >
              Browse by Category
            </p>
            {[
              "AI",
              "Fintech",
              "SaaS",
              "DevTools",
              "Web3",
              "Cloud",
              "Startup",
              "MNC",
            ].map((cat) => (
              <div key={cat} style={{ marginBottom: "0.5rem" }}>
                <Link
                  href={`/category/${cat.toLowerCase()}`}
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--text-secondary)",
                    textDecoration: "none",
                    transition: "color 0.15s ease",
                  }}
                >
                  {cat}
                </Link>
              </div>
            ))}
          </div>

          {/* Tools & Links */}
          <div>
            <p
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--text-muted)",
                marginBottom: "1rem",
              }}
            >
              Developer Tools
            </p>
            <div style={{ marginBottom: "0.5rem" }}>
              <Link
                href="/tracker"
                style={{
                  fontSize: "0.875rem",
                  color: "var(--text-secondary)",
                  textDecoration: "none",
                }}
              >
                My Application Tracker
              </Link>
            </div>
            <div style={{ marginBottom: "0.5rem" }}>
              <Link
                href="/submit"
                style={{
                  fontSize: "0.875rem",
                  color: "var(--text-secondary)",
                  textDecoration: "none",
                }}
              >
                Submit a Company
              </Link>
            </div>
            <div style={{ marginBottom: "0.5rem" }}>
              <a
                href="mailto:hello@justapply.dev"
                style={{
                  fontSize: "0.875rem",
                  color: "var(--text-secondary)",
                  textDecoration: "none",
                }}
              >
                Contact & Feedback
              </a>
            </div>
          </div>
        </div>

        <div
          style={{
            borderTop: "1px solid var(--border-light)",
            paddingTop: "1.5rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
            © {currentYear} JustApply. Software engineering careers directory & application tracker.
          </p>
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
            100+ Companies · 4 Regions · 8 Verticals
          </p>
        </div>
      </div>
    </footer>
  );
}
