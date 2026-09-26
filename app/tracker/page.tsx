"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CompanyLogo from "@/components/CompanyLogo";
import { getAllCompanies, mergeCompanies } from "@/lib/companies";
import { useSubmissions } from "@/lib/submissions";
import {
  useTrackedCompanies,
  saveTrackedCompany,
  removeTrackedCompany,
  ApplicationStatus,
} from "@/lib/tracker";

const statusConfig: Record<
  ApplicationStatus,
  { label: string; emoji: string; bg: string; color: string; desc: string }
> = {
  saved: {
    label: "Wishlist",
    emoji: "📌",
    bg: "#EEF2FF",
    color: "var(--accent)",
    desc: "Companies you want to apply to",
  },
  applied: {
    label: "Applied",
    emoji: "📤",
    bg: "#FEF3C7",
    color: "#B45309",
    desc: "Applications submitted",
  },
  interviewing: {
    label: "Interviewing",
    emoji: "💬",
    bg: "#EDE9FE",
    color: "#6D28D9",
    desc: "Interviews in progress",
  },
  offer: {
    label: "Offer",
    emoji: "🎉",
    bg: "#D1FAE5",
    color: "#065F46",
    desc: "Job offers received",
  },
};

export default function TrackerPage() {
  const { trackedMap, isLoaded } = useTrackedCompanies();
  const submissions = useSubmissions();
  const allCompanies = useMemo(
    () => mergeCompanies(getAllCompanies(), submissions),
    [submissions],
  );
  const [activeTab, setActiveTab] = useState<ApplicationStatus | "all">("all");
  const [editingNotesSlug, setEditingNotesSlug] = useState<string | null>(null);
  const [notesInput, setNotesInput] = useState("");

  const trackedList = Object.values(trackedMap)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .map((tracked) => {
    const company = allCompanies.find((c) => c.slug === tracked.slug);
    return {
      ...tracked,
      company: company ?? {
        name: tracked.slug,
        slug: tracked.slug,
        website: "#",
        careers: "#",
        country: "Unknown",
        region: "Remote" as const,
        category: "Startup" as const,
        hiringType: ["Full-time" as const],
        description: "",
        logo: "",
      },
    };
  });

  const filteredList =
    activeTab === "all"
      ? trackedList
      : trackedList.filter((item) => item.status === activeTab);

  const stats = {
    total: trackedList.length,
    saved: trackedList.filter((i) => i.status === "saved").length,
    applied: trackedList.filter((i) => i.status === "applied").length,
    interviewing: trackedList.filter((i) => i.status === "interviewing").length,
    offer: trackedList.filter((i) => i.status === "offer").length,
  };

  const handleNotesSave = (slug: string) => {
    const currentStatus = trackedMap[slug]?.status || "saved";
    saveTrackedCompany(slug, currentStatus, notesInput);
    setEditingNotesSlug(null);
  };

  const startEditNotes = (slug: string, currentNotes?: string) => {
    setEditingNotesSlug(slug);
    setNotesInput(currentNotes || "");
  };

  return (
    <>
      <Navbar />
      <main
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "3rem 1.5rem 5rem",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <p
            style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--accent)",
              marginBottom: "0.75rem",
            }}
          >
            Personal Job Hunt Dashboard
          </p>
          <h1
            style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontSize: "clamp(2rem, 4vw, 2.75rem)",
              fontWeight: 700,
              color: "var(--text-primary)",
              letterSpacing: "-0.02em",
              marginBottom: "0.75rem",
            }}
          >
            My Application Tracker
          </h1>
          <p
            style={{
              fontSize: "1rem",
              color: "var(--text-secondary)",
              maxWidth: "540px",
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            Track your target companies, log your application progress, and add personal interview notes in one place.
          </p>
        </div>

        {/* Stats Row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "1rem",
            marginBottom: "2.5rem",
          }}
        >
          {[
            { label: "Total Bookmarked", count: stats.total, color: "var(--text-primary)" },
            { label: "Wishlist", count: stats.saved, color: "var(--accent)" },
            { label: "Applied", count: stats.applied, color: "#B45309" },
            { label: "Interviewing", count: stats.interviewing, color: "#6D28D9" },
            { label: "Offers Received", count: stats.offer, color: "#065F46" },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                padding: "1.25rem",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  fontFamily: "'Fraunces', Georgia, serif",
                  fontSize: "1.75rem",
                  fontWeight: 700,
                  color: stat.color,
                  lineHeight: 1,
                  marginBottom: "0.4rem",
                }}
              >
                {stat.count}
              </p>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 500 }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Status Filter Tabs */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
            borderBottom: "1px solid var(--border)",
            paddingBottom: "1rem",
            marginBottom: "2rem",
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            style={{
              padding: "8px 18px",
              borderRadius: "8px",
              fontSize: "0.875rem",
              fontWeight: activeTab === "all" ? 600 : 500,
              border: activeTab === "all" ? "1.5px solid var(--accent)" : "1px solid var(--border)",
              background: activeTab === "all" ? "var(--accent)" : "var(--bg-card)",
              color: activeTab === "all" ? "#fff" : "var(--text-secondary)",
              cursor: "pointer",
            }}
          >
            All Tracked ({stats.total})
          </button>
          {(["saved", "applied", "interviewing", "offer"] as ApplicationStatus[]).map((st) => {
            const conf = statusConfig[st];
            const count = stats[st];
            const active = activeTab === st;
            return (
              <button
                key={st}
                type="button"
                onClick={() => setActiveTab(st)}
                style={{
                  padding: "8px 18px",
                  borderRadius: "8px",
                  fontSize: "0.875rem",
                  fontWeight: active ? 600 : 500,
                  border: active ? `1.5px solid ${conf.color}` : "1px solid var(--border)",
                  background: active ? conf.color : "var(--bg-card)",
                  color: active ? "#fff" : "var(--text-secondary)",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span>{conf.emoji}</span>
                <span>{conf.label}</span>
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    opacity: 0.85,
                  }}
                >
                  ({count})
                </span>
              </button>
            );
          })}
        </div>

        {/* Company List */}
        {!isLoaded ? (
          <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-muted)" }}>
            Loading your tracker...
          </div>
        ) : filteredList.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "4rem 2rem",
              background: "var(--bg-card)",
              border: "1px dashed var(--border)",
              borderRadius: "16px",
            }}
          >
            <p style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>📌</p>
            <h3
              style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontSize: "1.25rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: "0.5rem",
              }}
            >
              {stats.total === 0 ? "Your tracker is empty" : "No companies in this status yet"}
            </h3>
            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
              {stats.total === 0
                ? "Bookmark a company while browsing, then move it from wishlist to applied, interviewing, or offer."
                : "Try another stage, or bookmark more companies from the directory."}
            </p>
            <Link
              href="/"
              style={{
                padding: "10px 22px",
                background: "var(--accent)",
                color: "#fff",
                borderRadius: "8px",
                fontWeight: 600,
                fontSize: "0.9rem",
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              Browse Companies
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {filteredList.map(({ slug, status, notes, company }) => {
              const conf = statusConfig[status];
              const isEditingNotes = editingNotesSlug === slug;

              return (
                <div
                  key={slug}
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderRadius: "14px",
                    padding: "1.5rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                    boxShadow: "0 2px 10px var(--shadow)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: "1rem",
                      flexWrap: "wrap",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      <CompanyLogo src={company.logo} name={company.name} size={48} />
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <Link
                            href={`/company/${company.slug}`}
                            style={{
                              fontFamily: "'Fraunces', Georgia, serif",
                              fontSize: "1.15rem",
                              fontWeight: 700,
                              color: "var(--text-primary)",
                              textDecoration: "none",
                            }}
                          >
                            {company.name}
                          </Link>
                          <span style={{ fontSize: "0.8rem" }}>{company.country}</span>
                        </div>
                        <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "2px" }}>
                          {company.category} · {company.hiringType.join(", ")}
                        </p>
                      </div>
                    </div>

                    {/* Status selector & Actions */}
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                      <select
                        value={status}
                        onChange={(e) => saveTrackedCompany(slug, e.target.value as ApplicationStatus)}
                        style={{
                          padding: "6px 12px",
                          borderRadius: "8px",
                          fontSize: "0.83rem",
                          fontWeight: 600,
                          background: conf.bg,
                          color: conf.color,
                          border: `1px solid ${conf.color}`,
                          cursor: "pointer",
                          outline: "none",
                        }}
                      >
                        <option value="saved">📌 Wishlist</option>
                        <option value="applied">📤 Applied</option>
                        <option value="interviewing">💬 Interviewing</option>
                        <option value="offer">🎉 Offer</option>
                      </select>

                      <a
                        href={company.careers}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          padding: "6px 14px",
                          background: "var(--accent)",
                          color: "#fff",
                          borderRadius: "8px",
                          fontSize: "0.8125rem",
                          fontWeight: 600,
                          textDecoration: "none",
                        }}
                      >
                        Careers ↗
                      </a>

                      <button
                        type="button"
                        onClick={() => removeTrackedCompany(slug)}
                        style={{
                          background: "transparent",
                          border: "none",
                          color: "var(--text-muted)",
                          fontSize: "1.1rem",
                          cursor: "pointer",
                          padding: "4px",
                        }}
                        title="Remove from tracker"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  {/* Description */}
                  {company.description && (
                    <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                      {company.description}
                    </p>
                  )}

                  {/* Personal Notes Section */}
                  <div
                    style={{
                      background: "var(--bg-primary)",
                      border: "1px solid var(--border-light)",
                      borderRadius: "8px",
                      padding: "0.75rem 1rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "0.4rem",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.73rem",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          color: "var(--text-muted)",
                        }}
                      >
                        Personal Notes & Reminders
                      </span>
                      {!isEditingNotes && (
                        <button
                          type="button"
                          onClick={() => startEditNotes(slug, notes)}
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "var(--accent)",
                            fontSize: "0.78rem",
                            fontWeight: 600,
                            cursor: "pointer",
                          }}
                        >
                          {notes ? "Edit Notes" : "+ Add Note"}
                        </button>
                      )}
                    </div>

                    {isEditingNotes ? (
                      <div>
                        <textarea
                          rows={2}
                          value={notesInput}
                          onChange={(e) => setNotesInput(e.target.value)}
                          placeholder="e.g., Applied on Aug 1. Recruiter call on Friday..."
                          style={{
                            width: "100%",
                            padding: "0.5rem 0.75rem",
                            fontSize: "0.85rem",
                            borderRadius: "6px",
                            border: "1px solid var(--border)",
                            background: "#fff",
                            color: "var(--text-primary)",
                            outline: "none",
                            marginBottom: "0.5rem",
                          }}
                        />
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <button
                            type="button"
                            onClick={() => handleNotesSave(slug)}
                            style={{
                              padding: "4px 12px",
                              background: "var(--accent)",
                              color: "#fff",
                              border: "none",
                              borderRadius: "4px",
                              fontSize: "0.78rem",
                              fontWeight: 600,
                              cursor: "pointer",
                            }}
                          >
                            Save Note
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingNotesSlug(null)}
                            style={{
                              padding: "4px 12px",
                              background: "transparent",
                              border: "1px solid var(--border)",
                              borderRadius: "4px",
                              fontSize: "0.78rem",
                              color: "var(--text-secondary)",
                              cursor: "pointer",
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p style={{ fontSize: "0.85rem", color: notes ? "var(--text-primary)" : "var(--text-muted)", fontStyle: notes ? "normal" : "italic" }}>
                        {notes || "No notes added yet. Click above to add notes like interview dates or referral info."}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
