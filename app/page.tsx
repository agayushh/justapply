import { Suspense } from "react";
import Link from "next/link";
import { getAllCompanies, getCategories, getRegions } from "@/lib/companies";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchFilter from "@/components/SearchFilter";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JustApply — Software Careers Directory | 100+ Tech Companies",
  description:
    "Browse software engineering jobs at 100+ real tech companies. Find careers at top startups, MNCs, SaaS, Fintech, AI, Web3, and DevTools companies in India, US, Europe, and remote.",
  alternates: { canonical: "https://justapply.dev" },
};

const categoryShowcase = [
  { emoji: "🤖", label: "AI", desc: "Machine learning, LLMs, and AI infrastructure" },
  { emoji: "💳", label: "Fintech", desc: "Payments, banking, and financial APIs" },
  { emoji: "☁️", label: "Cloud", desc: "Infrastructure, databases, and platform tools" },
  { emoji: "🛠️", label: "DevTools", desc: "Developer experience and productivity" },
  { emoji: "🚀", label: "Startup", desc: "High-growth companies with equity upside" },
  { emoji: "🔗", label: "Web3", desc: "Blockchain, crypto, and decentralized apps" },
  { emoji: "📦", label: "SaaS", desc: "Subscription software used by teams every day" },
  { emoji: "🏢", label: "MNC", desc: "Global companies with large engineering orgs" },
];

export default function HomePage() {
  const companies = getAllCompanies();
  const remoteCount = companies.filter((company) =>
    company.hiringType.includes("Remote-friendly"),
  ).length;
  const categoryCounts = Object.fromEntries(
    getCategories().map((category) => [
      category,
      companies.filter((company) => company.category === category).length,
    ]),
  );
  const stats = [
    { value: String(companies.length), label: "Companies Listed" },
    { value: String(getCategories().length), label: "Categories" },
    { value: String(getRegions().length), label: "Regions" },
    { value: String(remoteCount), label: "Remote-friendly" },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Software Engineering Careers Directory",
    description:
      "A curated list of software companies hiring developers worldwide",
    numberOfItems: companies.length,
    itemListElement: companies.slice(0, 20).map((company, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: company.name,
      url: `https://justapply.dev/company/${company.slug}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      <main>
        {/* ── HERO ── */}
        <section className="hero">
          <div>
            <p className="kicker">Software careers directory</p>
            <h1>
              Find the next role worth <em>applying</em> for.
            </h1>
            <p className="lede">
              A curated index of software engineering careers — startups, MNCs,
              fintech, and AI labs — with a direct path to each official careers page.
            </p>
            <div className="hero-actions">
              <a className="btn btn-primary" href="#companies">
                Browse companies
              </a>
              <Link className="btn btn-ghost" href="/submit">
                Submit a company
              </Link>
            </div>
          </div>

          <aside className="stat-index" aria-label="Directory totals">
            {stats.map((stat) => (
              <div className="stat-row" key={stat.label}>
                <span>{stat.label}</span>
                <strong>{stat.value}</strong>
              </div>
            ))}
          </aside>
        </section>

        {/* ── TRUSTED LOGOS strip ── */}
        <section className="featured-strip">
          <div className="featured-row">
            <span className="label">Featured</span>
            {[
              "google",
              "stripe",
              "razorpay",
              "openai",
              "zerodha",
              "spotify",
              "mistral",
              "figma",
              "supabase",
              "freshworks",
            ].map((slug) => {
              const c = companies.find((x) => x.slug === slug);
              if (!c) return null;
              return (
                <Link key={slug} href={`/company/${slug}`} className="featured-link">
                  {c.name}
                </Link>
              );
            })}
          </div>
        </section>

        {/* ── CATEGORIES SHOWCASE ── */}
        <section className="section" id="categories">
          <div className="section-head">
            <p className="kicker">Browse by category</p>
            <h2>Every kind of tech company, in one place.</h2>
            <p>
              From seed-stage startups to global enterprises, across eight industry verticals.
            </p>
          </div>

          <div className="category-grid">
            {categoryShowcase.map((cat) => (
              <Link
                key={cat.label}
                href={`/category/${cat.label.toLowerCase()}`}
                className="category-card"
              >
                <span className="emoji" aria-hidden="true">{cat.emoji}</span>
                <strong>{cat.label}</strong>
                <p>{cat.desc}</p>
                <span className="count">{categoryCounts[cat.label] ?? 0} companies</span>
              </Link>
            ))}
          </div>
        </section>

        {/* ── COMPANY GRID ── */}
        <section className="companies-wrap" id="companies">
          <div className="companies-head">
            <p className="kicker">The index</p>
            <h2>All companies</h2>
            <p>
              {companies.length} curated companies, plus any you submit in this browser, with direct links to official careers pages.
            </p>
          </div>
          <Suspense fallback={<p style={{ textAlign: "center", color: "var(--text-muted)" }}>Loading companies…</p>}>
            <SearchFilter companies={companies} />
          </Suspense>
        </section>
      </main>

      <Footer />
    </>
  );
}
