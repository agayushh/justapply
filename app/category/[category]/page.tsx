import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchFilter from "@/components/SearchFilter";
import { getAllCompanies, getCategories, Company } from "@/lib/companies";

interface Props {
  params: Promise<{ category: string }>;
}

const categoryDisplayMap: Record<string, Company["category"]> = {
  mnc: "MNC",
  startup: "Startup",
  saas: "SaaS",
  fintech: "Fintech",
  ai: "AI",
  web3: "Web3",
  cloud: "Cloud",
  devtools: "DevTools",
};

export async function generateStaticParams() {
  return getCategories().map((cat) => ({
    category: cat.toLowerCase(),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const canonicalCat = categoryDisplayMap[category.toLowerCase()];
  if (!canonicalCat) return { title: "Category Not Found | JustApply" };

  return {
    title: `${canonicalCat} Companies Hiring Software Developers | JustApply`,
    description: `Discover top ${canonicalCat} tech companies hiring software engineers. Direct links to official careers pages and open roles.`,
    alternates: { canonical: `https://justapply.dev/category/${category.toLowerCase()}` },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const canonicalCat = categoryDisplayMap[category.toLowerCase()];
  if (!canonicalCat) notFound();

  const companies = getAllCompanies();
  const categoryCompanies = companies.filter((c) => c.category === canonicalCat);

  return (
    <>
      <Navbar />
      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "3rem 1.5rem 5rem" }}>
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
            Category Spotlight
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
            {canonicalCat} Tech Careers
          </h1>
          <p
            style={{
              fontSize: "1rem",
              color: "var(--text-secondary)",
              maxWidth: "540px",
              margin: "0 auto",
            }}
          >
            {categoryCompanies.length} published {canonicalCat} companies, plus any you added in this browser.
          </p>
        </div>

        <Suspense fallback={<p style={{ textAlign: "center", color: "var(--text-muted)" }}>Loading companies…</p>}>
          <SearchFilter companies={companies} initialCategory={canonicalCat} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
