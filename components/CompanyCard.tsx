"use client";

import Link from "next/link";
import type { Company } from "@/lib/companies";
import { safeHostname } from "@/lib/companies";
import CompanyLogo from "./CompanyLogo";
import { useTrackedCompanies, saveTrackedCompany, removeTrackedCompany } from "@/lib/tracker";
import { useSubmissionMap } from "@/lib/submissions";

interface CompanyCardProps {
  company: Company;
}

const statusLabels: Record<string, string> = {
  saved: "Saved",
  applied: "Applied",
  interviewing: "Interviewing",
  offer: "Offer",
};

export default function CompanyCard({ company }: CompanyCardProps) {
  const { trackedMap } = useTrackedCompanies();
  const submissions = useSubmissionMap();
  const tracked = trackedMap[company.slug];
  const isBookmarked = !!tracked;
  const isUserSubmission = Boolean(submissions[company.slug]);
  const hostname = safeHostname(company.website);

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
      <article className={`company-card${isBookmarked ? " is-saved" : ""}`}>
        <header className="company-card-top">
          <CompanyLogo src={company.logo} name={company.name} size={42} variant="plain" />
          <div className="company-card-id">
            <h3>{company.name}</h3>
            <p>{company.country}</p>
          </div>
          <button
            type="button"
            className={`company-card-save${isBookmarked ? " is-on" : ""}`}
            onClick={toggleBookmark}
            aria-label={isBookmarked ? "Remove from bookmarks" : "Bookmark company"}
            title={isBookmarked ? "Remove bookmark" : "Bookmark for job search"}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill={isBookmarked ? "currentColor" : "none"} aria-hidden="true">
              <path
                d="M4 2.5h8a.5.5 0 0 1 .5.5v11L8 11.2 3.5 14V3a.5.5 0 0 1 .5-.5Z"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </header>

        <p className="company-card-desc">{company.description}</p>

        <footer className="company-card-foot">
          <div className="company-card-meta">
            <span>{company.category}</span>
            {company.hiringType.map((type) => (
              <span key={type}>{type}</span>
            ))}
            {isUserSubmission && <span className="is-status">Added by you</span>}
            {tracked && (
              <span className="is-status">{statusLabels[tracked.status] ?? "Saved"}</span>
            )}
          </div>
          <span className="company-card-host">{hostname || "website"}</span>
        </footer>
      </article>
    </Link>
  );
}
