import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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
    title: `${company.name} Careers — Apply for Software Jobs`,
    description: `Apply for software engineering jobs at ${company.name}. Official careers page, hiring details, and company info. ${company.description}`,
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
          maxWidth: "860px",
          margin: "0 auto",
          padding: "3rem 2rem 5rem",
        }}
      >
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" style={{ marginBottom: "2rem" }}>
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
            <Link
              href="/"
              style={{ color: "var(--accent)", textDecoration: "none" }}
            >
              JustApply
            </Link>
            {" / "}
            <Link
              href="/"
              style={{ color: "var(--accent)", textDecoration: "none" }}
            >
              Companies
            </Link>
            {" / "}
            <span style={{ color: "var(--text-secondary)" }}>
              {company.name}
            </span>
          </p>
        </nav>

        {/* Company Header card */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            padding: "2.5rem",
            marginBottom: "2rem",
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
            {/* Logo */}
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: "14px",
                border: "1px solid var(--border-light)",
                overflow: "hidden",
                flexShrink: 0,
                background: "#F9F7F4",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                src={company.logo}
                alt={`${company.name} logo`}
                width={64}
                height={64}
                style={{ objectFit: "contain" }}
                unoptimized
              />
            </div>

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
                    fontSize: "clamp(1.5rem, 3vw, 2rem)",
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
                }}
              >
                {regionFlag[company.region]} {company.country}
              </p>

              <p
                style={{
                  fontSize: "1rem",
                  color: "var(--text-secondary)",
                  lineHeight: 1.65,
                  marginBottom: "1.5rem",
                }}
              >
                {company.description}
              </p>

              {/* Hiring tags */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                  marginBottom: "1.5rem",
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

              {/* Action buttons */}
              <div
                style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}
              >
                <a
                  href={company.careers}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: "11px 24px",
                    background: "var(--accent)",
                    color: "#fff",
                    borderRadius: "8px",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    textDecoration: "none",
                    boxShadow: "0 2px 8px rgba(79,70,229,0.3)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  View Open Roles ↗
                </a>
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: "11px 24px",
                    background: "transparent",
                    color: "var(--text-primary)",
                    border: "1.5px solid var(--border)",
                    borderRadius: "8px",
                    fontWeight: 500,
                    fontSize: "0.9rem",
                    textDecoration: "none",
                  }}
                >
                  Company Website
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Info grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "1rem",
            marginBottom: "3rem",
          }}
        >
          {[
            { label: "Country", value: company.country },
            {
              label: "Region",
              value: company.region === "US" ? "United States" : company.region,
            },
            { label: "Category", value: company.category },
            { label: "Hiring", value: company.hiringType.join(", ") },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "10px",
                padding: "1.25rem",
              }}
            >
              <p
                style={{
                  fontSize: "0.73rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                  color: "var(--text-muted)",
                  marginBottom: "0.4rem",
                }}
              >
                {item.label}
              </p>
              <p
                style={{
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  color: "var(--text-primary)",
                }}
              >
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* CTA block */}
        <div
          style={{
            background: "#4F46E5",
            borderRadius: "16px",
            padding: "2.5rem",
            textAlign: "center",
            marginBottom: "3rem",
          }}
        >
          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              color: "#fff",
              fontSize: "1.5rem",
              fontWeight: 700,
              marginBottom: "0.75rem",
            }}
          >
            Ready to apply at {company.name}?
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.8)",
              fontSize: "0.9rem",
              marginBottom: "1.5rem",
            }}
          >
            Visit the official careers page to browse all open software
            engineering roles.
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
              fontSize: "0.9rem",
              textDecoration: "none",
            }}
          >
            Go to {company.name} Careers ↗
          </a>
        </div>

        {/* Related companies */}
        {related.length > 0 && (
          <div>
            <h2
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "1.25rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: "1.25rem",
                letterSpacing: "-0.01em",
              }}
            >
              More {company.category} Companies
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
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
                    borderRadius: "10px",
                    padding: "1.25rem",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    transition: "border-color 0.15s ease",
                  }}
                >
                  <Image
                    src={rel.logo}
                    alt={rel.name}
                    width={32}
                    height={32}
                    style={{ borderRadius: "6px", objectFit: "contain" }}
                    unoptimized
                  />
                  <div>
                    <p
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        color: "var(--text-primary)",
                      }}
                    >
                      {rel.name}
                    </p>
                    <p
                      style={{
                        fontSize: "0.73rem",
                        color: "var(--text-muted)",
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
