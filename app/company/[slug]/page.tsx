import type { Metadata } from "next";
import { getCompanyBySlug, getAllSlugs } from "@/lib/companies";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CompanyDetailView from "@/components/CompanyDetailView";
import SubmittedCompany from "./SubmittedCompany";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const company = getCompanyBySlug(slug);
  if (!company) {
    return {
      title: "Company",
      robots: { index: false, follow: false },
    };
  }
  return {
    title: `${company.name} Careers — Apply for Software Engineering Jobs`,
    description: `Apply for software engineering jobs at ${company.name}. Official careers page, hiring details, headquarters in ${company.country}, and company info. ${company.description}`,
    alternates: { canonical: `https://justapply.dev/company/${slug}` },
    openGraph: {
      title: `${company.name} Careers — Software Engineering Jobs`,
      description: `Find and apply for developer roles at ${company.name}. ${company.hiringType.join(", ")}.`,
      url: `https://justapply.dev/company/${slug}`,
      type: "article",
    },
    twitter: {
      card: "summary",
      title: `${company.name} Careers — Software Engineering Jobs`,
      description: `Apply for developer roles at ${company.name}.`,
    },
  };
}

export default async function CompanyDetailPage({ params }: Props) {
  const { slug } = await params;
  const company = getCompanyBySlug(slug);
  if (!company) {
    return <SubmittedCompany slug={slug} />;
  }

  return (
    <>
      <Navbar />
      <CompanyDetailView company={company} />
      <Footer />
    </>
  );
}
