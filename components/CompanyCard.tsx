import Link from "next/link";
import Image from "next/image";
import type { Company } from "@/lib/companies";
import {
  getCategoryColor,
  getCategoryBg,
  getHiringBadgeStyle,
} from "@/lib/companies";

interface CompanyCardProps {
  company: Company;
}

const regionFlag: Record<string, string> = {
  India: "🇮🇳",
  US: "🇺🇸",
  Europe: "🇪🇺",
  Remote: "🌍",
};

export default function CompanyCard({ company }: CompanyCardProps) {
  const flag = regionFlag[company.region] ?? "🌐";

  return (
    <Link
      href={`/company/${company.slug}`}
      style={{ textDecoration: "none", color: "inherit", display: "block" }}
    >
      <article
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "12px",
          padding: "1.5rem",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          cursor: "pointer",
          transition:
            "transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget;
          el.style.transform = "translateY(-3px)";
          el.style.boxShadow = "0 12px 32px var(--shadow-md)";
          el.style.borderColor = "#C4B8AA";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget;
          el.style.transform = "";
          el.style.boxShadow = "";
          el.style.borderColor = "var(--border)";
        }}
      >
        {/* Header: Logo + Category */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "0.75rem",
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "10px",
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
              width={40}
              height={40}
              style={{ objectFit: "contain" }}
              unoptimized
            />
          </div>

          <span
            style={{
              padding: "3px 10px",
              borderRadius: "999px",
              fontSize: "0.7rem",
              fontWeight: 600,
              letterSpacing: "0.04em",
              background: getCategoryBg(company.category),
              color: getCategoryColor(company.category),
              flexShrink: 0,
            }}
          >
            {company.category}
          </span>
        </div>

        {/* Company name + country */}
        <div>
          <h3
            style={{
              fontSize: "1rem",
              fontWeight: 600,
              color: "var(--text-primary)",
              marginBottom: "0.25rem",
              lineHeight: 1.3,
            }}
          >
            {company.name}
          </h3>
          <p
            style={{
              fontSize: "0.8rem",
              color: "var(--text-muted)",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <span>{flag}</span>
            <span>{company.country}</span>
          </p>
        </div>

        {/* Description */}
        <p
          style={{
            fontSize: "0.83rem",
            color: "var(--text-secondary)",
            lineHeight: 1.55,
            flex: 1,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {company.description}
        </p>

        {/* Hiring tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {company.hiringType.map((type) => {
            const style = getHiringBadgeStyle(type);
            return (
              <span
                key={type}
                style={{
                  padding: "3px 8px",
                  borderRadius: "4px",
                  fontSize: "0.7rem",
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

        {/* CTA */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: "0.5rem",
            borderTop: "1px solid var(--border-light)",
          }}
        >
          <span
            style={{
              fontSize: "0.8rem",
              color: "var(--accent)",
              fontWeight: 600,
            }}
          >
            View Careers →
          </span>
          <span
            style={{
              fontSize: "0.75rem",
              color: "var(--text-muted)",
            }}
          >
            {new URL(company.website).hostname}
          </span>
        </div>
      </article>
    </Link>
  );
}
