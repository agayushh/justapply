"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CompanyLogo from "@/components/CompanyLogo";
import CompanyDetailClientActions from "@/app/company/[slug]/CompanyDetailClientActions";
import {
  getAllCompanies,
  getCategoryBg,
  getCategoryColor,
  getCompanyBySlug,
  getHiringBadgeStyle,
  mergeCompanies,
  type Company,
} from "@/lib/companies";
import { removeSubmission, useSubmissionMap } from "@/lib/submissions";
import { removeTrackedCompany } from "@/lib/tracker";

const regionFlag: Record<string, string> = {
  India: "🇮🇳",
  US: "🇺🇸",
  Europe: "🇪🇺",
  Remote: "🌍",
};

export default function CompanyDetailView({ company }: { company: Company }) {
  const router = useRouter();
  const submissions = useSubmissionMap();
  const isLocal = Boolean(submissions[company.slug]) && !getCompanyBySlug(company.slug);

  const related = useMemo(() => {
    return mergeCompanies(getAllCompanies(), Object.values(submissions))
      .filter((item) => item.category === company.category && item.slug !== company.slug)
      .slice(0, 4);
  }, [company.category, company.slug, submissions]);

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

  const handleRemove = () => {
    const confirmed = window.confirm(
      `Remove ${company.name} from this browser? It will also leave your tracker.`,
    );
    if (!confirmed) return;
    removeSubmission(company.slug);
    removeTrackedCompany(company.slug);
    router.push("/");
  };

  return (
    <main
      style={{
        maxWidth: "960px",
        margin: "0 auto",
        padding: "3rem 1.5rem 5rem",
      }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

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

      {isLocal && (
        <div
          style={{
            background: "#EEF2FF",
            border: "1px solid #C7D2FE",
            borderRadius: "12px",
            padding: "0.9rem 1rem",
            marginBottom: "1.25rem",
            display: "flex",
            justifyContent: "space-between",
            gap: "1rem",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <p style={{ fontSize: "0.85rem", color: "var(--accent-hover)", lineHeight: 1.5 }}>
            Saved in this browser. {company.name} shows up in your directory on this device.
          </p>
          <button
            type="button"
            onClick={handleRemove}
            style={{
              padding: "6px 12px",
              borderRadius: "8px",
              border: "1px solid #C7D2FE",
              background: "#fff",
              color: "var(--accent-hover)",
              fontSize: "0.8rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Remove submission
          </button>
        </div>
      )}

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
                  fontFamily: "'Fraunces', Georgia, serif",
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

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                marginBottom: "1.75rem",
              }}
            >
              {company.hiringType.map((type) => {
                const style = getHiringBadgeStyle(type);
                return (
                  <span
                    key={type}
                    style={{
                      padding: "5px 12px",
                      borderRadius: "6px",
                      fontSize: "0.8rem",
                      fontWeight: 500,
                      background: style.bg,
                      color: style.color,
                    }}
                  >
                    {type}
                  </span>
                );
              })}
            </div>

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
                  boxShadow: "0 2px 10px var(--accent-glow)",
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

      <CompanyDetailClientActions company={company} />

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
            fontFamily: "'Fraunces', Georgia, serif",
            fontSize: "1.35rem",
            fontWeight: 700,
            color: "var(--text-primary)",
            marginBottom: "1rem",
          }}
        >
          Software Engineering Interview Guide for {company.name}
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
            <span style={{ fontSize: "1.2rem" }}>1.</span>
            <div>
              <strong style={{ color: "var(--text-primary)", fontSize: "0.9rem" }}>
                System Design & Architecture
              </strong>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "2px" }}>
                Prepare for scalable component design, distributed system trade-offs, and API schema design relevant to {company.category} platforms.
              </p>
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
            <span style={{ fontSize: "1.2rem" }}>2.</span>
            <div>
              <strong style={{ color: "var(--text-primary)", fontSize: "0.9rem" }}>
                Coding & Data Structures
              </strong>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "2px" }}>
                Focus on clean code, optimal time and space complexity, data structure selection, and edge-case testing.
              </p>
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
            <span style={{ fontSize: "1.2rem" }}>3.</span>
            <div>
              <strong style={{ color: "var(--text-primary)", fontSize: "0.9rem" }}>
                Behavioral & Culture Fit
              </strong>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "2px" }}>
                Be ready to discuss past technical challenges, collaboration, ownership, and project impact using the STAR method.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-hover) 100%)",
          borderRadius: "16px",
          padding: "2.5rem 2rem",
          textAlign: "center",
          marginBottom: "3.5rem",
          boxShadow: "0 8px 30px var(--accent-glow)",
        }}
      >
        <h2
          style={{
            fontFamily: "'Fraunces', Georgia, serif",
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
            color: "var(--accent)",
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

      {related.length > 0 && (
        <div>
          <h2
            style={{
              fontFamily: "'Fraunces', Georgia, serif",
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
                }}
              >
                <CompanyLogo src={rel.logo} name={rel.name} size={36} />
                <div>
                  <p style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--text-primary)" }}>
                    {rel.name}
                  </p>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "1px" }}>
                    {regionFlag[rel.region]} {rel.country}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
