import companiesData from "./companies.json";

export interface Company {
  name: string;
  slug: string;
  website: string;
  careers: string;
  country: string;
  region: "India" | "US" | "Europe" | "Remote";
  category:
    | "MNC"
    | "Startup"
    | "SaaS"
    | "Fintech"
    | "AI"
    | "Web3"
    | "Cloud"
    | "DevTools";
  hiringType: Array<"Full-time" | "Internships" | "Remote-friendly">;
  description: string;
  logo: string;
}

const companies: Company[] = companiesData as Company[];

export function getAllCompanies(): Company[] {
  return companies;
}

export function getCompanyBySlug(slug: string): Company | undefined {
  return companies.find((c) => c.slug === slug);
}

export function getAllSlugs(): string[] {
  return companies.map((c) => c.slug);
}

export function getCategories(): Company["category"][] {
  return [
    "MNC",
    "Startup",
    "SaaS",
    "Fintech",
    "AI",
    "Web3",
    "Cloud",
    "DevTools",
  ];
}

export function getRegions(): Company["region"][] {
  return ["India", "US", "Europe", "Remote"];
}

export function searchCompanies(
  query: string,
  category: string,
  region: string,
): Company[] {
  return companies.filter((company) => {
    const matchesQuery =
      query === "" ||
      company.name.toLowerCase().includes(query.toLowerCase()) ||
      company.country.toLowerCase().includes(query.toLowerCase()) ||
      company.description.toLowerCase().includes(query.toLowerCase());

    const matchesCategory = category === "All" || company.category === category;
    const matchesRegion = region === "All" || company.region === region;

    return matchesQuery && matchesCategory && matchesRegion;
  });
}

export function getCategoryColor(category: Company["category"]): string {
  const colors: Record<Company["category"], string> = {
    MNC: "#1E40AF",
    Startup: "#065F46",
    SaaS: "#7C3AED",
    Fintech: "#B45309",
    AI: "#DC2626",
    Web3: "#0369A1",
    Cloud: "#0F766E",
    DevTools: "#374151",
  };
  return colors[category] || "#374151";
}

export function getCategoryBg(category: Company["category"]): string {
  const bgs: Record<Company["category"], string> = {
    MNC: "#DBEAFE",
    Startup: "#D1FAE5",
    SaaS: "#EDE9FE",
    Fintech: "#FEF3C7",
    AI: "#FEE2E2",
    Web3: "#E0F2FE",
    Cloud: "#CCFBF1",
    DevTools: "#F1F5F9",
  };
  return bgs[category] || "#F1F5F9";
}

export function getHiringBadgeStyle(type: string): {
  bg: string;
  color: string;
} {
  if (type === "Remote-friendly") return { bg: "#D1FAE5", color: "#065F46" };
  if (type === "Internships") return { bg: "#FEF3C7", color: "#92400E" };
  return { bg: "#EFE7DC", color: "var(--ink)" };
}

export function slugifyCompanyName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function safeHostname(website: string): string {
  try {
    const withProtocol = /^https?:\/\//i.test(website)
      ? website
      : `https://${website}`;
    return new URL(withProtocol).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

export function logoFromWebsite(website: string): string {
  const host = safeHostname(website);
  if (!host || !host.includes(".")) return "";
  return `https://logo.clearbit.com/${host}`;
}

export function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function mergeCompanies(base: Company[], extra: Company[]): Company[] {
  const seen = new Set(base.map((company) => company.slug));
  const fresh = extra.filter((company) => company.slug && !seen.has(company.slug));
  return [...fresh, ...base];
}
