import { getAllCompanies } from "@/lib/companies";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchFilter from "@/components/SearchFilter";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JustApply — Software Careers Directory | 100+ Tech Companies",
  description:
    "Browse software engineering jobs at 100+ real tech companies. Find careers at top startups, MNCs, SaaS, Fintech, AI, Web3, and DevTools companies in India, US, Europe, and remote.",
  alternates: { canonical: "https://justapply.dev" },
};

const stats = [
  { value: "100+", label: "Companies Listed" },
  { value: "8", label: "Categories" },
  { value: "4", label: "Regions" },
  { value: "∞", label: "Opportunities" },
];

const categoryShowcase = [
  {
    emoji: "🤖",
    label: "AI",
    desc: "Machine learning, LLMs, and AI infrastructure",
  },
  {
    emoji: "💳",
    label: "Fintech",
    desc: "Payments, banking, and financial APIs",
  },
  {
    emoji: "☁️",
    label: "Cloud",
    desc: "Infrastructure, databases, and platform tools",
  },
  {
    emoji: "🛠️",
    label: "DevTools",
    desc: "Developer experience and productivity",
  },
  {
    emoji: "🚀",
    label: "Startup",
    desc: "High-growth companies with equity upside",
  },
  {
    emoji: "🔗",
    label: "Web3",
    desc: "Blockchain, crypto, and decentralized apps",
  },
];

export default function HomePage() {
  const companies = getAllCompanies();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Software Engineering Careers Directory",
    description:
      "A curated list of software companies hiring developers worldwide",
    numberOfItems: companies.length,
    itemListElement: companies.slice(0, 20).map((company, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: company.name,
      url: `https://justapply.dev/company/${company.slug}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      <main>
        {/* ── HERO ── */}
        <section
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "5rem 2rem 3rem",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "3rem",
            alignItems: "center",
          }}
        >
          <div>
            <p
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--accent)",
                marginBottom: "1.25rem",
              }}
            >
              The Developer Careers Directory
            </p>
            <h1
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "clamp(2.25rem, 4vw, 3.25rem)",
                fontWeight: 700,
                color: "var(--text-primary)",
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
                marginBottom: "1.25rem",
              }}
            >
              Find your next{" "}
              <em style={{ fontStyle: "italic", color: "var(--accent)" }}>
                tech role
              </em>{" "}
              at the world&apos;s best companies.
            </h1>
            <p
              style={{
                fontSize: "1.05rem",
                color: "var(--text-secondary)",
                lineHeight: 1.65,
                maxWidth: "480px",
                marginBottom: "2rem",
              }}
            >
              Browse{" "}
              <strong style={{ color: "var(--text-primary)" }}>
                software engineering careers
              </strong>{" "}
              at 100+ real and active companies — from Indian startups to global
              MNCs, fintech disruptors to AI labs.
            </p>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <a
                href="#companies"
                style={{
                  padding: "11px 22px",
                  background: "var(--accent)",
                  color: "#fff",
                  borderRadius: "8px",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  textDecoration: "none",
                  boxShadow: "0 2px 8px rgba(79,70,229,0.3)",
                }}
              >
                Browse Companies
              </a>
              <a
                href="mailto:hello@justapply.dev"
                style={{
                  padding: "11px 22px",
                  background: "transparent",
                  color: "var(--text-primary)",
                  border: "1.5px solid var(--border)",
                  borderRadius: "8px",
                  fontWeight: 500,
                  fontSize: "0.9rem",
                  textDecoration: "none",
                }}
              >
                Submit a Company
              </a>
            </div>
          </div>

          {/* Right side: stats */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: "12px",
                  padding: "1.5rem",
                  textAlign: "center",
                }}
              >
                <p
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: "2rem",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    lineHeight: 1,
                    marginBottom: "0.5rem",
                  }}
                >
                  {stat.value}
                </p>
                <p
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--text-muted)",
                    fontWeight: 500,
                  }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── TRUSTED LOGOS strip ── */}
        <section
          style={{
            borderTop: "1px solid var(--border-light)",
            borderBottom: "1px solid var(--border-light)",
            padding: "1.5rem 2rem",
            background: "rgba(255,255,255,0.5)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                fontSize: "0.78rem",
                color: "var(--text-muted)",
                fontWeight: 500,
                whiteSpace: "nowrap",
              }}
            >
              Featured companies:
            </span>
            {[
              "google",
              "stripe",
              "razorpay",
              "openai",
              "zerodha",
              "spotify",
              "mistral",
              "figma",
              "supabase",
              "freshworks",
            ].map((slug) => {
              const c = companies.find((x) => x.slug === slug);
              if (!c) return null;
              return (
                <span
                  key={slug}
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    color: "var(--text-secondary)",
                    opacity: 0.75,
                  }}
                >
                  {c.name}
                </span>
              );
            })}
          </div>
        </section>

        {/* ── CATEGORIES SHOWCASE ── */}
        <section
          id="categories"
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "5rem 2rem 3rem",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--accent)",
                marginBottom: "0.75rem",
              }}
            >
              Browse by Category
            </p>
            <h2
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "clamp(1.75rem, 3vw, 2.25rem)",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: "0.75rem",
                letterSpacing: "-0.02em",
              }}
            >
              Every kind of tech company, in one place.
            </h2>
            <p
              style={{
                fontSize: "0.95rem",
                color: "var(--text-secondary)",
                maxWidth: "500px",
                margin: "0 auto",
              }}
            >
              From seed-stage startups to trillion-dollar enterprises, across 8
              industry verticals.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "1rem",
            }}
          >
            {categoryShowcase.map((cat) => (
              <div
                key={cat.label}
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: "12px",
                  padding: "1.5rem",
                  display: "flex",
                  gap: "1rem",
                  alignItems: "flex-start",
                }}
              >
                <span style={{ fontSize: "1.75rem" }}>{cat.emoji}</span>
                <div>
                  <p
                    style={{
                      fontWeight: 700,
                      fontSize: "0.95rem",
                      color: "var(--text-primary)",
                      marginBottom: "0.25rem",
                    }}
                  >
                    {cat.label}
                  </p>
                  <p
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--text-muted)",
                      lineHeight: 1.5,
                    }}
                  >
                    {cat.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── COMPANY GRID ── */}
        <section
          id="companies"
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "2rem 2rem 5rem",
          }}
        >
          <div style={{ marginBottom: "2rem" }}>
            <h2
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: "0.5rem",
                letterSpacing: "-0.02em",
              }}
            >
              All Companies
            </h2>
            <p style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
              {companies.length} companies · directly linking to official
              careers pages
            </p>
          </div>
          <SearchFilter companies={companies} />
        </section>
      </main>

      <Footer />
    </>
  );
}
