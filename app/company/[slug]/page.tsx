import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  getAllCompanies,
  getCompanyBySlug,
  getAllSlugs,
  getCategoryColor,
  getCategoryBg,
  getHiringBadgeStyle,
} from "@/lib/companies";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CompanyLogo from "@/components/CompanyLogo";
import CompanyDetailClientActions from "./CompanyDetailClientActions";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const company = getCompanyBySlug(slug);
  if (!company) {
    return { title: "Company Not Found | JustApply" };
  }
  return {
    title: `${company.name} Careers — Apply for Software Engineering Jobs`,
    description: `Apply for software engineering jobs at ${company.name}. Official careers page, hiring details, headquarters in ${company.country}, and company info. ${company.description}`,
    alternates: { canonical: `https://justapply.dev/company/${slug}` },
    openGraph: {
      title: `${company.name} Careers — Software Engineering Jobs`,
      description: `Find and apply for developer roles at ${company.name}. ${company.hiringType.join(", ")}.`,
      url: `https://justapply.dev/company/${slug}`,
      type: "article",
    },
    twitter: {
      card: "summary",
      title: `${company.name} Careers — Software Engineering Jobs`,
      description: `Apply for developer roles at ${company.name}.`,
    },
  };
}

const regionFlag: Record<string, string> = {
  India: "🇮🇳",
  US: "🇺🇸",
  Europe: "🇪🇺",
  Remote: "🌍",
};

export default async function CompanyDetailPage({ params }: Props) {
  const { slug } = await params;
  const company = getCompanyBySlug(slug);
  if (!company) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.name,
    url: company.website,
    logo: company.logo,
    description: company.description,
    foundingLocation: { "@type": "Place", name: company.country },
    sameAs: [company.website, company.careers],
  };

  const allCompanies = getAllCompanies();
  const related = allCompanies
    .filter((c) => c.category === company.category && c.slug !== company.slug)
    .slice(0, 4);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      <main
        style={{
          maxWidth: "960px",
          margin: "0 auto",
          padding: "3rem 1.5rem 5rem",
        }}
      >
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" style={{ marginBottom: "2rem" }}>
          <p style={{ fontSize: "0.83rem", color: "var(--text-muted)" }}>
            <Link
              href="/"
              style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 500 }}
            >
              JustApply
            </Link>
            {" / "}
            <Link
              href="/"
              style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 500 }}
            >
              Companies
            </Link>
            {" / "}
            <span style={{ color: "var(--text-secondary)", fontWeight: 600 }}>
              {company.name}
            </span>
          </p>
        </nav>

        {/* Header Card */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            padding: "2.5rem",
            marginBottom: "2rem",
            boxShadow: "0 4px 20px var(--shadow)",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "1.5rem",
              alignItems: "flex-start",
              flexWrap: "wrap",
            }}
          >
            <CompanyLogo src={company.logo} name={company.name} size={80} />

            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  flexWrap: "wrap",
                  marginBottom: "0.5rem",
                }}
              >
                <h1
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: "clamp(1.75rem, 3.5vw, 2.25rem)",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {company.name}
                </h1>
                <span
                  style={{
                    padding: "4px 12px",
                    borderRadius: "999px",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    background: getCategoryBg(company.category),
                    color: getCategoryColor(company.category),
                  }}
                >
                  {company.category}
                </span>
              </div>

              <p
                style={{
                  fontSize: "0.9rem",
                  color: "var(--text-muted)",
                  marginBottom: "1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span>{regionFlag[company.region]}</span>
                <span>{company.country}</span>
              </p>

              <p
                style={{
                  fontSize: "1.05rem",
                  color: "var(--text-secondary)",
                  lineHeight: 1.65,
                  marginBottom: "1.5rem",
                }}
              >
                {company.description}
              </p>

              {/* Hiring Tags */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                  marginBottom: "1.75rem",
                }}
              >
                {company.hiringType.map((type) => {
                  const s = getHiringBadgeStyle(type);
                  return (
                    <span
                      key={type}
                      style={{
                        padding: "5px 12px",
                        borderRadius: "6px",
                        fontSize: "0.8rem",
                        fontWeight: 500,
                        background: s.bg,
                        color: s.color,
                      }}
                    >
                      {type}
                    </span>
                  );
                })}
              </div>

              {/* Primary Action buttons */}
              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                <a
                  href={company.careers}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: "12px 26px",
                    background: "var(--accent)",
                    color: "#fff",
                    borderRadius: "8px",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    textDecoration: "none",
                    boxShadow: "0 2px 10px rgba(79,70,229,0.3)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  Apply on Careers Site ↗
                </a>
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: "12px 24px",
                    background: "transparent",
                    color: "var(--text-primary)",
                    border: "1.5px solid var(--border)",
                    borderRadius: "8px",
                    fontWeight: 500,
                    fontSize: "0.95rem",
                    textDecoration: "none",
                  }}
                >
                  Official Website
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Client-side Tracker & Share Actions */}
        <CompanyDetailClientActions company={company} />

        {/* Quick Facts Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "1rem",
            marginBottom: "2.5rem",
          }}
        >
          {[
            { label: "Headquarters", value: company.country },
            {
              label: "Region Scope",
              value: company.region === "US" ? "United States" : company.region,
            },
            { label: "Industry Sector", value: company.category },
            { label: "Role Types", value: company.hiringType.join(", ") },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                padding: "1.25rem",
              }}
            >
              <p
                style={{
                  fontSize: "0.73rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "var(--text-muted)",
                  marginBottom: "0.4rem",
                }}
              >
                {item.label}
              </p>
              <p
                style={{
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                }}
              >
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* Hiring & Interview Prep Guidance */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            padding: "2rem",
            marginBottom: "3rem",
          }}
        >
          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "1.35rem",
              fontWeight: 700,
              color: "var(--text-primary)",
              marginBottom: "1rem",
            }}
          >
            💡 Software Engineering Interview Guide for {company.name}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
              <span style={{ fontSize: "1.2rem" }}>1️⃣</span>
              <div>
                <strong style={{ color: "var(--text-primary)", fontSize: "0.9rem" }}>
                  System Design & Architecture:
                </strong>
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "2px" }}>
                  Prepare for scalable component design, distributed system trade-offs, and API schema design relevant to {company.category} platforms.
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
              <span style={{ fontSize: "1.2rem" }}>2️⃣</span>
              <div>
                <strong style={{ color: "var(--text-primary)", fontSize: "0.9rem" }}>
                  Coding & Data Structures:
                </strong>
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "2px" }}>
                  Focus on clean code, optimal time/space complexity, data structure selection (graphs, trees, hash maps), and edge-case testing.
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
              <span style={{ fontSize: "1.2rem" }}>3️⃣</span>
              <div>
                <strong style={{ color: "var(--text-primary)", fontSize: "0.9rem" }}>
                  Behavioral & Culture Fit:
                </strong>
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "2px" }}>
                  Be ready to discuss past technical challenges, cross-functional collaboration, ownership, and project impacts using the STAR method.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div
          style={{
            background: "linear-gradient(135deg, #4F46E5 0%, #3730A3 100%)",
            borderRadius: "16px",
            padding: "2.5rem 2rem",
            textAlign: "center",
            marginBottom: "3.5rem",
            boxShadow: "0 8px 30px rgba(79,70,229,0.25)",
          }}
        >
          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              color: "#fff",
              fontSize: "1.6rem",
              fontWeight: 700,
              marginBottom: "0.75rem",
            }}
          >
            Ready to apply at {company.name}?
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.85)",
              fontSize: "0.95rem",
              marginBottom: "1.5rem",
              maxWidth: "500px",
              margin: "0 auto 1.5rem",
            }}
          >
            Check active software developer openings directly on their official careers board.
          </p>
          <a
            href={company.careers}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              padding: "12px 28px",
              background: "#fff",
              color: "#4F46E5",
              borderRadius: "8px",
              fontWeight: 700,
              fontSize: "0.95rem",
              textDecoration: "none",
              boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
            }}
          >
            Visit {company.name} Careers Page ↗
          </a>
        </div>

        {/* Related Companies */}
        {related.length > 0 && (
          <div>
            <h2
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "1.35rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: "1.25rem",
              }}
            >
              Similar {company.category} Companies
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: "1rem",
              }}
            >
              {related.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/company/${rel.slug}`}
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                    padding: "1.25rem",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.85rem",
                    transition: "all 0.15s ease",
                  }}
                >
                  <CompanyLogo src={rel.logo} name={rel.name} size={36} />
                  <div>
                    <p
                      style={{
                        fontSize: "0.88rem",
                        fontWeight: 600,
                        color: "var(--text-primary)",
                      }}
                    >
                      {rel.name}
                    </p>
                    <p
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--text-muted)",
                        marginTop: "1px",
                      }}
                    >
                      {regionFlag[rel.region]} {rel.country}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
