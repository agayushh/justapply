"use client";

import { useState, useMemo } from "react";
import type { Company } from "@/lib/companies";
import { getCategories, getRegions } from "@/lib/companies";
import CompanyCard from "./CompanyCard";
import { useTrackedCompanies } from "@/lib/tracker";

interface SearchFilterProps {
  companies: Company[];
  initialCategory?: string;
  initialRegion?: string;
}

const categories = ["All", ...getCategories()];
const regions = ["All", ...getRegions()];
const hiringTypes = ["All", "Full-time", "Internships", "Remote-friendly"];

const regionLabel: Record<string, string> = {
  All: "All Regions",
  India: "🇮🇳 India",
  US: "🇺🇸 United States",
  Europe: "🇪🇺 Europe",
  Remote: "🌍 Remote-first",
};

export default function SearchFilter({
  companies,
  initialCategory = "All",
  initialRegion = "All",
}: SearchFilterProps) {
  const [query, setQueryState] = useState(() => {
    if (typeof window === "undefined") return "";
    return new URLSearchParams(window.location.search).get("q") || "";
  });

  const [category, setCategoryState] = useState(() => {
    if (typeof window === "undefined") return initialCategory;
    const cat = new URLSearchParams(window.location.search).get("category");
    return cat && categories.includes(cat) ? cat : initialCategory;
  });

  const [region, setRegionState] = useState(() => {
    if (typeof window === "undefined") return initialRegion;
    const reg = new URLSearchParams(window.location.search).get("region");
    return reg && regions.includes(reg) ? reg : initialRegion;
  });

  const [hiring, setHiringState] = useState(() => {
    if (typeof window === "undefined") return "All";
    const hir = new URLSearchParams(window.location.search).get("hiring");
    return hir && hiringTypes.includes(hir) ? hir : "All";
  });

  const [showSavedOnly, setShowSavedOnlyState] = useState(false);
  const [sortBy, setSortByState] = useState<"featured" | "name-asc" | "name-desc">("featured");
  const [visibleCount, setVisibleCount] = useState(24);

  const setCategory = (c: string) => { setCategoryState(c); setVisibleCount(24); };
  const setRegion = (r: string) => { setRegionState(r); setVisibleCount(24); };
  const setHiring = (h: string) => { setHiringState(h); setVisibleCount(24); };
  const setQuery = (q: string) => { setQueryState(q); setVisibleCount(24); };
  const setShowSavedOnly = (s: boolean) => { setShowSavedOnlyState(s); setVisibleCount(24); };
  const setSortBy = (s: "featured" | "name-asc" | "name-desc") => { setSortByState(s); setVisibleCount(24); };

  const { trackedMap } = useTrackedCompanies();
  const savedCount = Object.keys(trackedMap).length;

  // Filter logic
  const filtered = useMemo(() => {
    let result = companies.filter((c) => {
      const q = query.toLowerCase().trim();
      const matchesQuery =
        q === "" ||
        c.name.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q);

      const matchesCategory = category === "All" || c.category === category;
      const matchesRegion = region === "All" || c.region === region;
      const matchesHiring =
        hiring === "All" || c.hiringType.includes(hiring as "Full-time" | "Internships" | "Remote-friendly");
      const matchesSaved = !showSavedOnly || !!trackedMap[c.slug];

      return (
        matchesQuery &&
        matchesCategory &&
        matchesRegion &&
        matchesHiring &&
        matchesSaved
      );
    });

    // Sorting logic
    if (sortBy === "name-asc") {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "name-desc") {
      result = [...result].sort((a, b) => b.name.localeCompare(a.name));
    }

    return result;
  }, [companies, query, category, region, hiring, showSavedOnly, sortBy, trackedMap]);

  const activeFiltersCount =
    (category !== "All" ? 1 : 0) +
    (region !== "All" ? 1 : 0) +
    (hiring !== "All" ? 1 : 0) +
    (showSavedOnly ? 1 : 0) +
    (query ? 1 : 0);

  const resetAllFilters = () => {
    setQuery("");
    setCategory("All");
    setRegion("All");
    setHiring("All");
    setShowSavedOnly(false);
    setSortBy("featured");
    setVisibleCount(24);
  };

  const displayedCompanies = filtered.slice(0, visibleCount);

  return (
    <div>
      {/* Search Bar + Main Controls */}
      <div style={{ marginBottom: "2rem" }}>
        <div
          style={{
            position: "relative",
            maxWidth: "680px",
            margin: "0 auto 1.5rem",
          }}
        >
          <span
            style={{
              position: "absolute",
              left: "18px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--text-muted)",
              fontSize: "1.1rem",
              pointerEvents: "none",
            }}
          >
            🔍
          </span>
          <input
            type="search"
            placeholder="Search by company name, technology, or country..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search companies"
            style={{
              width: "100%",
              padding: "1rem 1rem 1rem 3.2rem",
              border: "1.5px solid var(--border)",
              borderRadius: "12px",
              fontSize: "1rem",
              background: "var(--bg-card)",
              color: "var(--text-primary)",
              outline: "none",
              boxShadow: "0 2px 8px var(--shadow)",
              transition: "border-color 0.2s ease, box-shadow 0.2s ease",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "var(--accent)";
              e.target.style.boxShadow = "0 0 0 4px rgba(79,70,229,0.12)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "var(--border)";
              e.target.style.boxShadow = "0 2px 8px var(--shadow)";
            }}
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              style={{
                position: "absolute",
                right: "16px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "rgba(0,0,0,0.06)",
                border: "none",
                borderRadius: "50%",
                width: "24px",
                height: "24px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.8rem",
                color: "var(--text-secondary)",
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
            justifyContent: "center",
            marginBottom: "1.5rem",
          }}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                padding: "7px 16px",
                borderRadius: "999px",
                fontSize: "0.83rem",
                fontWeight: category === cat ? 600 : 500,
                border:
                  category === cat
                    ? "1.5px solid var(--accent)"
                    : "1.5px solid var(--border)",
                background:
                  category === cat ? "var(--accent)" : "var(--bg-card)",
                color: category === cat ? "#fff" : "var(--text-secondary)",
                cursor: "pointer",
                transition: "all 0.15s ease",
                boxShadow: category === cat ? "0 2px 8px rgba(79,70,229,0.25)" : "none",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Secondary Filters Bar */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            padding: "1rem 1.25rem",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "center" }}>
            {/* Region Dropdown */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <label htmlFor="region-select" style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-muted)" }}>
                Region:
              </label>
              <select
                id="region-select"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                style={{
                  padding: "6px 12px",
                  borderRadius: "8px",
                  fontSize: "0.83rem",
                  fontWeight: 500,
                  border: "1px solid var(--border)",
                  background: "var(--bg-primary)",
                  color: "var(--text-primary)",
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                {regions.map((r) => (
                  <option key={r} value={r}>
                    {regionLabel[r] ?? r}
                  </option>
                ))}
              </select>
            </div>

            {/* Hiring Type Dropdown */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <label htmlFor="hiring-select" style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-muted)" }}>
                Type:
              </label>
              <select
                id="hiring-select"
                value={hiring}
                onChange={(e) => setHiring(e.target.value)}
                style={{
                  padding: "6px 12px",
                  borderRadius: "8px",
                  fontSize: "0.83rem",
                  fontWeight: 500,
                  border: "1px solid var(--border)",
                  background: "var(--bg-primary)",
                  color: "var(--text-primary)",
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                {hiringTypes.map((h) => (
                  <option key={h} value={h}>
                    {h === "All" ? "All Types" : h}
                  </option>
                ))}
              </select>
            </div>

            {/* Saved Toggle Button */}
            <button
              type="button"
              onClick={() => setShowSavedOnly(!showSavedOnly)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 12px",
                borderRadius: "8px",
                fontSize: "0.83rem",
                fontWeight: 600,
                border: showSavedOnly ? "1.5px solid var(--accent)" : "1px solid var(--border)",
                background: showSavedOnly ? "rgba(79,70,229,0.1)" : "var(--bg-primary)",
                color: showSavedOnly ? "var(--accent)" : "var(--text-secondary)",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              <span>{showSavedOnly ? "★ Saved Only" : "☆ Saved"}</span>
              {savedCount > 0 && (
                <span
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    background: showSavedOnly ? "var(--accent)" : "var(--border)",
                    color: showSavedOnly ? "#fff" : "var(--text-secondary)",
                    padding: "1px 6px",
                    borderRadius: "999px",
                  }}
                >
                  {savedCount}
                </span>
              )}
            </button>
          </div>

          {/* Right Side: Sort dropdown */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <label htmlFor="sort-select" style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-muted)" }}>
              Sort:
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "featured" | "name-asc" | "name-desc")}
              style={{
                padding: "6px 12px",
                borderRadius: "8px",
                fontSize: "0.83rem",
                fontWeight: 500,
                border: "1px solid var(--border)",
                background: "var(--bg-primary)",
                color: "var(--text-primary)",
                cursor: "pointer",
                outline: "none",
              }}
            >
              <option value="featured">Featured First</option>
              <option value="name-asc">Alphabetical (A - Z)</option>
              <option value="name-desc">Alphabetical (Z - A)</option>
            </select>
          </div>
        </div>

        {/* Active Filter Chips */}
        {activeFiltersCount > 0 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              flexWrap: "wrap",
              marginTop: "1rem",
            }}
          >
            <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 600 }}>
              Active Filters:
            </span>
            {query && (
              <span
                style={{
                  fontSize: "0.75rem",
                  background: "#E0E7FF",
                  color: "#3730A3",
                  padding: "3px 10px",
                  borderRadius: "999px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  fontWeight: 500,
                }}
              >
                &quot;{query}&quot;
                <button
                  onClick={() => setQuery("")}
                  style={{ border: "none", background: "transparent", cursor: "pointer", color: "inherit", fontWeight: 700 }}
                >
                  ✕
                </button>
              </span>
            )}
            {category !== "All" && (
              <span
                style={{
                  fontSize: "0.75rem",
                  background: "#E0E7FF",
                  color: "#3730A3",
                  padding: "3px 10px",
                  borderRadius: "999px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  fontWeight: 500,
                }}
              >
                Category: {category}
                <button
                  onClick={() => setCategory("All")}
                  style={{ border: "none", background: "transparent", cursor: "pointer", color: "inherit", fontWeight: 700 }}
                >
                  ✕
                </button>
              </span>
            )}
            {region !== "All" && (
              <span
                style={{
                  fontSize: "0.75rem",
                  background: "#E0E7FF",
                  color: "#3730A3",
                  padding: "3px 10px",
                  borderRadius: "999px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  fontWeight: 500,
                }}
              >
                Region: {region}
                <button
                  onClick={() => setRegion("All")}
                  style={{ border: "none", background: "transparent", cursor: "pointer", color: "inherit", fontWeight: 700 }}
                >
                  ✕
                </button>
              </span>
            )}
            {hiring !== "All" && (
              <span
                style={{
                  fontSize: "0.75rem",
                  background: "#E0E7FF",
                  color: "#3730A3",
                  padding: "3px 10px",
                  borderRadius: "999px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  fontWeight: 500,
                }}
              >
                Type: {hiring}
                <button
                  onClick={() => setHiring("All")}
                  style={{ border: "none", background: "transparent", cursor: "pointer", color: "inherit", fontWeight: 700 }}
                >
                  ✕
                </button>
              </span>
            )}
            {showSavedOnly && (
              <span
                style={{
                  fontSize: "0.75rem",
                  background: "#E0E7FF",
                  color: "#3730A3",
                  padding: "3px 10px",
                  borderRadius: "999px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  fontWeight: 500,
                }}
              >
                ★ Saved Only
                <button
                  onClick={() => setShowSavedOnly(false)}
                  style={{ border: "none", background: "transparent", cursor: "pointer", color: "inherit", fontWeight: 700 }}
                >
                  ✕
                </button>
              </span>
            )}
            <button
              onClick={resetAllFilters}
              style={{
                fontSize: "0.75rem",
                color: "var(--accent)",
                background: "transparent",
                border: "none",
                fontWeight: 600,
                cursor: "pointer",
                textDecoration: "underline",
                marginLeft: "4px",
              }}
            >
              Reset all
            </button>
          </div>
        )}
      </div>

      {/* Results Count Summary */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <p
          style={{
            fontSize: "0.9rem",
            color: "var(--text-muted)",
          }}
        >
          Showing{" "}
          <strong style={{ color: "var(--text-primary)" }}>
            {Math.min(visibleCount, filtered.length)}
          </strong>{" "}
          of{" "}
          <strong style={{ color: "var(--text-primary)" }}>
            {filtered.length}
          </strong>{" "}
          {filtered.length === 1 ? "company" : "companies"}
        </p>
      </div>

      {/* Company Grid */}
      {filtered.length > 0 ? (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {displayedCompanies.map((company) => (
              <CompanyCard key={company.slug} company={company} />
            ))}
          </div>

          {/* Load More Button */}
          {visibleCount < filtered.length && (
            <div style={{ textAlign: "center", marginTop: "3rem" }}>
              <button
                type="button"
                onClick={() => setVisibleCount((prev) => prev + 24)}
                style={{
                  padding: "12px 32px",
                  background: "var(--bg-card)",
                  color: "var(--text-primary)",
                  border: "1.5px solid var(--border)",
                  borderRadius: "10px",
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  boxShadow: "0 2px 6px var(--shadow)",
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--accent)";
                  e.currentTarget.style.color = "var(--accent)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.color = "var(--text-primary)";
                }}
              >
                Load More Companies ({filtered.length - visibleCount} remaining)
              </button>
            </div>
          )}
        </>
      ) : (
        <div
          style={{
            textAlign: "center",
            padding: "4rem 2rem",
            background: "var(--bg-card)",
            border: "1px dashed var(--border)",
            borderRadius: "16px",
            color: "var(--text-muted)",
          }}
        >
          <p style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>🔍</p>
          <p
            style={{
              fontSize: "1.1rem",
              fontWeight: 700,
              color: "var(--text-primary)",
              marginBottom: "0.25rem",
            }}
          >
            No companies matched your criteria
          </p>
          <p style={{ fontSize: "0.875rem", marginBottom: "1.5rem" }}>
            Try broadening your search term or clearing active category and region filters.
          </p>
          <button
            type="button"
            onClick={resetAllFilters}
            style={{
              padding: "10px 22px",
              background: "var(--accent)",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontSize: "0.9rem",
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(79,70,229,0.3)",
            }}
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}
