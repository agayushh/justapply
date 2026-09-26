"use client";

import { useState } from "react";
import type { Company } from "@/lib/companies";
import {
  useTrackedCompanies,
  saveTrackedCompany,
  removeTrackedCompany,
  ApplicationStatus,
} from "@/lib/tracker";

interface Props {
  company: Company;
}

export default function CompanyDetailClientActions({ company }: Props) {
  const { trackedMap } = useTrackedCompanies();
  const tracked = trackedMap[company.slug];
  const isBookmarked = !!tracked;
  const currentStatus = tracked?.status || "saved";
  const [copied, setCopied] = useState(false);
  const [notesDraft, setNotesDraft] = useState<string | null>(null);
  const [notesSaved, setNotesSaved] = useState(false);
  const notesValue = notesDraft ?? tracked?.notes ?? "";

  const handleToggleBookmark = () => {
    if (isBookmarked) {
      removeTrackedCompany(company.slug);
    } else {
      saveTrackedCompany(company.slug, "saved");
    }
  };

  const handleStatusChange = (status: ApplicationStatus) => {
    saveTrackedCompany(company.slug, status);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareTitle = encodeURIComponent(
    `Check out software developer careers at ${company.name} on JustApply!`
  );
  const currentUrl = encodeURIComponent(
    typeof window !== "undefined" ? window.location.href : `https://justapply.dev/company/${company.slug}`
  );

  const handleNotesSave = () => {
    saveTrackedCompany(company.slug, currentStatus, notesValue);
    setNotesDraft(null);
    setNotesSaved(true);
    window.setTimeout(() => setNotesSaved(false), 1600);
  };

  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "14px",
        padding: "1.25rem 1.5rem",
        marginBottom: "2rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
      {/* Tracker Status Controls */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
        <button
          type="button"
          onClick={handleToggleBookmark}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 16px",
            borderRadius: "8px",
            fontSize: "0.875rem",
            fontWeight: 600,
            border: isBookmarked ? "1.5px solid var(--accent)" : "1px solid var(--border)",
            background: isBookmarked ? "var(--accent-soft)" : "var(--bg-primary)",
            color: isBookmarked ? "var(--accent)" : "var(--text-primary)",
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
        >
          <span>{isBookmarked ? "★ Bookmarked" : "☆ Bookmark Company"}</span>
        </button>

        {isBookmarked && (
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600 }}>
              Stage:
            </span>
            <select
              value={currentStatus}
              onChange={(e) => handleStatusChange(e.target.value as ApplicationStatus)}
              style={{
                padding: "6px 12px",
                borderRadius: "8px",
                fontSize: "0.83rem",
                fontWeight: 600,
                border: "1px solid var(--border)",
                background: "var(--bg-primary)",
                color: "var(--text-primary)",
                cursor: "pointer",
                outline: "none",
              }}
            >
              <option value="saved">📌 Wishlist</option>
              <option value="applied">📤 Applied</option>
              <option value="interviewing">💬 Interviewing</option>
              <option value="offer">🎉 Offer</option>
            </select>
          </div>
        )}
      </div>

      {/* Share Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <button
          type="button"
          onClick={handleCopyLink}
          style={{
            padding: "6px 12px",
            borderRadius: "6px",
            fontSize: "0.8rem",
            fontWeight: 500,
            border: "1px solid var(--border)",
            background: "var(--bg-primary)",
            color: "var(--text-secondary)",
            cursor: "pointer",
          }}
        >
          {copied ? "Copied Link ✓" : "🔗 Copy Link"}
        </button>
        <a
          href={`https://twitter.com/intent/tweet?text=${shareTitle}&url=${currentUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: "6px 12px",
            borderRadius: "6px",
            fontSize: "0.8rem",
            fontWeight: 500,
            border: "1px solid var(--border)",
            background: "var(--bg-primary)",
            color: "var(--text-secondary)",
            textDecoration: "none",
          }}
        >
          Share on 𝕏
        </a>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${currentUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: "6px 12px",
            borderRadius: "6px",
            fontSize: "0.8rem",
            fontWeight: 500,
            border: "1px solid var(--border)",
            background: "var(--bg-primary)",
            color: "var(--text-secondary)",
            textDecoration: "none",
          }}
        >
          Share on LinkedIn
        </a>
      </div>
      </div>

      {isBookmarked && (
        <div>
          <label
            htmlFor="company-notes"
            style={{
              display: "block",
              fontSize: "0.73rem",
              fontWeight: 700,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
              marginBottom: "0.4rem",
            }}
          >
            Personal notes
          </label>
          <textarea
            id="company-notes"
            rows={2}
            value={notesValue}
            onChange={(event) => setNotesDraft(event.target.value)}
            placeholder="Interview date, referral, or follow-up reminder"
            style={{
              width: "100%",
              padding: "0.65rem 0.75rem",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              background: "var(--bg-primary)",
              color: "var(--text-primary)",
              fontSize: "0.85rem",
              outline: "none",
              resize: "vertical",
            }}
          />
          <button
            type="button"
            onClick={handleNotesSave}
            style={{
              marginTop: "0.5rem",
              padding: "6px 12px",
              borderRadius: "6px",
              border: "none",
              background: "var(--accent)",
              color: "#fff",
              fontSize: "0.78rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {notesSaved ? "Notes saved" : "Save notes"}
          </button>
        </div>
      )}
    </div>
  );
}
