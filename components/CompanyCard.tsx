"use client";

import Link from "next/link";
import type { Company } from "@/lib/companies";
import {
  getCategoryColor,
  getCategoryBg,
  getHiringBadgeStyle,
} from "@/lib/companies";
import CompanyLogo from "./CompanyLogo";
import { useTrackedCompanies, saveTrackedCompany, removeTrackedCompany } from "@/lib/tracker";

interface CompanyCardProps {
  company: Company;
}

const regionFlag: Record<string, string> = {
  India: "🇮🇳",
  US: "🇺🇸",
  Europe: "🇪🇺",
  Remote: "🌍",
};

const statusLabels: Record<string, { label: string; bg: string; color: string }> = {
  saved: { label: "Saved", bg: "#EEF2FF", color: "#4F46E5" },
  applied: { label: "Applied", bg: "#FEF3C7", color: "#B45309" },
  interviewing: { label: "Interviewing", bg: "#EDE9FE", color: "#6D28D9" },
  offer: { label: "Offer 🎉", bg: "#D1FAE5", color: "#065F46" },
};

export default function CompanyCard({ company }: CompanyCardProps) {
  const flag = regionFlag[company.region] ?? "🌐";
  const { trackedMap } = useTrackedCompanies();
  const tracked = trackedMap[company.slug];
  const isBookmarked = !!tracked;

  const toggleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isBookmarked) {
      removeTrackedCompany(company.slug);
    } else {
      saveTrackedCompany(company.slug, "saved");
    }
  };

  return (
    <Link
      href={`/company/${company.slug}`}
      style={{ textDecoration: "none", color: "inherit", display: "block", height: "100%" }}
    >
      <article
        style={{
          background: "var(--bg-card)",
          border: isBookmarked ? "1.5px solid var(--accent)" : "1px solid var(--border)",
          borderRadius: "14px",
          padding: "1.5rem",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          cursor: "pointer",
          position: "relative",
          boxShadow: isBookmarked ? "0 4px 14px rgba(79,70,229,0.08)" : "none",
          transition:
            "transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease, border-color 0.2s ease",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget;
          el.style.transform = "translateY(-4px)";
          el.style.boxShadow = "0 14px 36px var(--shadow-md)";
          if (!isBookmarked) el.style.borderColor = "#C4B8AA";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget;
          el.style.transform = "";
          el.style.boxShadow = isBookmarked ? "0 4px 14px rgba(79,70,229,0.08)" : "";
          if (!isBookmarked) el.style.borderColor = "var(--border)";
        }}
      >
        {/* Header: Logo + Category & Bookmark */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "0.75rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <CompanyLogo src={company.logo} name={company.name} size={48} />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
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

            {/* Bookmark button */}
            <button
              type="button"
              onClick={toggleBookmark}
              aria-label={isBookmarked ? "Remove from bookmarks" : "Bookmark company"}
              style={{
                background: isBookmarked ? "rgba(79,70,229,0.1)" : "transparent",
                border: "none",
                borderRadius: "8px",
                width: "32px",
                height: "32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: isBookmarked ? "var(--accent)" : "var(--text-muted)",
                fontSize: "1.1rem",
                transition: "all 0.15s ease",
              }}
              title={isBookmarked ? "Remove bookmark" : "Bookmark for job search"}
            >
              {isBookmarked ? "★" : "☆"}
            </button>
          </div>
        </div>

        {/* Company name + country + Application Status pill if tracked */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
            <h3
              style={{
                fontSize: "1.05rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                lineHeight: 1.3,
              }}
            >
              {company.name}
            </h3>
            {tracked && (
              <span
                style={{
                  fontSize: "0.68rem",
                  fontWeight: 600,
                  padding: "2px 8px",
                  borderRadius: "999px",
                  background: statusLabels[tracked.status]?.bg ?? "#EEF2FF",
                  color: statusLabels[tracked.status]?.color ?? "#4F46E5",
                }}
              >
                {statusLabels[tracked.status]?.label}
              </span>
            )}
          </div>
          <p
            style={{
              fontSize: "0.8rem",
              color: "var(--text-muted)",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              marginTop: "0.2rem",
            }}
          >
            <span>{flag}</span>
            <span>{company.country}</span>
          </p>
        </div>

        {/* Description */}
        <p
          style={{
            fontSize: "0.84rem",
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

        {/* CTA Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: "0.75rem",
            borderTop: "1px solid var(--border-light)",
            marginTop: "auto",
          }}
        >
          <span
            style={{
              fontSize: "0.8rem",
              color: "var(--accent)",
              fontWeight: 600,
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            View Careers →
          </span>
          <span
            style={{
              fontSize: "0.75rem",
              color: "var(--text-muted)",
              fontFamily: "monospace",
            }}
          >
            {new URL(company.website).hostname.replace("www.", "")}
          </span>
        </div>
      </article>
    </Link>
  );
}
