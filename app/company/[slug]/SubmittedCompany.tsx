"use client";

import { useEffect, useSyncExternalStore } from "react";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CompanyDetailView from "@/components/CompanyDetailView";
import { useSubmissionMap } from "@/lib/submissions";

function useHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export default function SubmittedCompany({ slug }: { slug: string }) {
  const hydrated = useHydrated();
  const submissions = useSubmissionMap();
  const company = submissions[slug];

  useEffect(() => {
    if (!company) return;
    document.title = `${company.name} Careers — Apply for Software Engineering Jobs | JustApply`;
  }, [company]);

  if (!hydrated) {
    return (
      <>
        <Navbar />
        <main style={{ maxWidth: "960px", margin: "0 auto", padding: "4rem 1.5rem" }}>
          <p style={{ color: "var(--text-muted)" }}>Loading company…</p>
        </main>
        <Footer />
      </>
    );
  }

  if (!company) notFound();

  return (
    <>
      <Navbar />
      <CompanyDetailView company={company} />
      <Footer />
    </>
  );
}
