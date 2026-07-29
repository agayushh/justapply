import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchFilter from "@/components/SearchFilter";
import { getAllCompanies, Company } from "@/lib/companies";

interface Props {
  params: Promise<{ region: string }>;
}

const regionDisplayMap: Record<string, Company["region"]> = {
  india: "India",
  us: "US",
  "united-states": "US",
  europe: "Europe",
  remote: "Remote",
};

const regionTitleMap: Record<Company["region"], string> = {
  India: "🇮🇳 India",
  US: "🇺🇸 United States",
  Europe: "🇪🇺 Europe",
  Remote: "🌍 Remote-first",
};

export async function generateStaticParams() {
  return [
    { region: "india" },
    { region: "us" },
    { region: "united-states" },
    { region: "europe" },
    { region: "remote" },
  ];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { region } = await params;
  const canonicalRegion = regionDisplayMap[region.toLowerCase()];
  if (!canonicalRegion) return { title: "Region Not Found | JustApply" };

  const titleText = regionTitleMap[canonicalRegion] || canonicalRegion;

  return {
    title: `Software Developer Jobs in ${titleText} | JustApply`,
    description: `Browse tech companies hiring software engineers in ${titleText}. Direct links to official job boards.`,
    alternates: { canonical: `https://justapply.dev/region/${region.toLowerCase()}` },
  };
}

export default async function RegionPage({ params }: Props) {
  const { region } = await params;
  const canonicalRegion = regionDisplayMap[region.toLowerCase()];
  if (!canonicalRegion) notFound();

  const companies = getAllCompanies();
  const regionCompanies = companies.filter((c) => c.region === canonicalRegion);
  const titleText = regionTitleMap[canonicalRegion] || canonicalRegion;

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
            Regional Spotlight
          </p>
          <h1
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(2rem, 4vw, 2.75rem)",
              fontWeight: 700,
              color: "var(--text-primary)",
              letterSpacing: "-0.02em",
              marginBottom: "0.75rem",
            }}
          >
            Software Careers in {titleText}
          </h1>
          <p
            style={{
              fontSize: "1rem",
              color: "var(--text-secondary)",
              maxWidth: "540px",
              margin: "0 auto",
            }}
          >
            Explore {regionCompanies.length} tech companies hiring software developers in {canonicalRegion}.
          </p>
        </div>

        <SearchFilter companies={companies} initialRegion={canonicalRegion} />
      </main>
      <Footer />
    </>
  );
}
