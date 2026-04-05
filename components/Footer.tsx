import Link from "next/link";

export default function Footer() {
  const currentYear = 2026;
  return (
    <footer
      style={{
        borderTop: "1px solid var(--border)",
        background: "rgba(246,241,233,0.8)",
        padding: "3rem 2rem 2rem",
        marginTop: "5rem",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "2rem",
            marginBottom: "3rem",
          }}
        >
          {/* Brand */}
          <div>
            <Link
              href="/"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "1.15rem",
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
                fontSize: "0.8rem",
                color: "var(--text-muted)",
                maxWidth: "240px",
                lineHeight: 1.7,
              }}
            >
              The curated careers directory for software developers worldwide.
            </p>
          </div>

          {/* Regions */}
          <div>
            <p
              style={{
                fontSize: "0.75rem",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--text-muted)",
                marginBottom: "1rem",
              }}
            >
              Browse by Region
            </p>
            {["India", "United States", "Europe", "Remote"].map((region) => (
              <div key={region} style={{ marginBottom: "0.5rem" }}>
                <Link
                  href={`/?region=${region === "United States" ? "US" : region}`}
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--text-secondary)",
                    textDecoration: "none",
                  }}
                >
                  {region}
                </Link>
              </div>
            ))}
          </div>

          {/* Categories */}
          <div>
            <p
              style={{
                fontSize: "0.75rem",
                fontWeight: 600,
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
                  href={`/?category=${cat}`}
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--text-secondary)",
                    textDecoration: "none",
                  }}
                >
                  {cat}
                </Link>
              </div>
            ))}
          </div>

          {/* Links */}
          <div>
            <p
              style={{
                fontSize: "0.75rem",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--text-muted)",
                marginBottom: "1rem",
              }}
            >
              Company
            </p>
            <div style={{ marginBottom: "0.5rem" }}>
              <a
                href="mailto:hello@justapply.dev"
                style={{
                  fontSize: "0.875rem",
                  color: "var(--text-secondary)",
                  textDecoration: "none",
                }}
              >
                Submit a Company
              </a>
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
                Contact
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
            © {currentYear} JustApply. Open careers directory for software
            developers.
          </p>
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
            100+ companies · 4 regions · 8 categories
          </p>
        </div>
      </div>
    </footer>
  );
}
