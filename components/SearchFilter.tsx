"use client";

import { useState, useMemo, useEffect } from "react";
import type { Company } from "@/lib/companies";
import { getCategories, getRegions } from "@/lib/companies";
import CompanyCard from "./CompanyCard";

interface SearchFilterProps {
  companies: Company[];
  initialCategory?: string;
  initialRegion?: string;
}

const categories = ["All", ...getCategories()];
const regions = ["All", ...getRegions()];

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
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [region, setRegion] = useState(initialRegion);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get("category");
    const reg = params.get("region");
    if (cat && categories.includes(cat)) setCategory(cat);
    if (reg && regions.includes(reg)) setRegion(reg);
  }, []);

  const filtered = useMemo(() => {
    return companies.filter((c) => {
      const matchesQuery =
        query === "" ||
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.country.toLowerCase().includes(query.toLowerCase()) ||
        c.description.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = category === "All" || c.category === category;
      const matchesRegion = region === "All" || c.region === region;
      return matchesQuery && matchesCategory && matchesRegion;
    });
  }, [companies, query, category, region]);

  return (
    <div>
      {/* Search bar */}
      <div
        style={{
          position: "relative",
          marginBottom: "2rem",
          maxWidth: "600px",
          margin: "0 auto 2rem",
        }}
      >
        <span
          style={{
            position: "absolute",
            left: "16px",
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
          placeholder="Search companies, countries, or technologies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search companies"
          style={{
            width: "100%",
            padding: "0.9rem 1rem 0.9rem 3rem",
            border: "1.5px solid var(--border)",
            borderRadius: "10px",
            fontSize: "0.95rem",
            background: "var(--bg-card)",
            color: "var(--text-primary)",
            outline: "none",
            transition: "border-color 0.2s ease, box-shadow 0.2s ease",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "var(--accent)";
            e.target.style.boxShadow = "0 0 0 3px rgba(79,70,229,0.1)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "var(--border)";
            e.target.style.boxShadow = "";
          }}
        />
      </div>

      {/* Filters row */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.75rem",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        {/* Category pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", flex: 1 }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                padding: "6px 14px",
                borderRadius: "999px",
                fontSize: "0.8rem",
                fontWeight: 500,
                border:
                  category === cat
                    ? "1.5px solid var(--accent)"
                    : "1.5px solid var(--border)",
                background:
                  category === cat ? "var(--accent)" : "var(--bg-card)",
                color: category === cat ? "#fff" : "var(--text-secondary)",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Region dropdown */}
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          aria-label="Filter by region"
          style={{
            padding: "6px 14px",
            borderRadius: "8px",
            fontSize: "0.8rem",
            fontWeight: 500,
            border: "1.5px solid var(--border)",
            background: "var(--bg-card)",
            color: "var(--text-secondary)",
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

      {/* Results count */}
      <p
        style={{
          fontSize: "0.85rem",
          color: "var(--text-muted)",
          marginBottom: "1.5rem",
        }}
      >
        Showing{" "}
        <strong style={{ color: "var(--text-primary)" }}>
          {filtered.length}
        </strong>{" "}
        {filtered.length === 1 ? "company" : "companies"}
        {category !== "All" && ` in ${category}`}
        {region !== "All" && ` · ${regionLabel[region]}`}
        {query && ` matching "${query}"`}
      </p>

      {/* Company grid */}
      {filtered.length > 0 ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {filtered.map((company) => (
            <CompanyCard key={company.slug} company={company} />
          ))}
        </div>
      ) : (
        <div
          style={{
            textAlign: "center",
            padding: "4rem 2rem",
            color: "var(--text-muted)",
          }}
        >
          <p style={{ fontSize: "2rem", marginBottom: "1rem" }}>🔎</p>
          <p
            style={{
              fontSize: "1rem",
              fontWeight: 600,
              color: "var(--text-secondary)",
            }}
          >
            No companies found
          </p>
          <p style={{ fontSize: "0.875rem", marginTop: "0.5rem" }}>
            Try adjusting your search or filters
          </p>
          <button
            onClick={() => {
              setQuery("");
              setCategory("All");
              setRegion("All");
            }}
            style={{
              marginTop: "1.5rem",
              padding: "8px 18px",
              background: "var(--accent)",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              fontSize: "0.875rem",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
