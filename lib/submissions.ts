"use client";

import { useMemo, useSyncExternalStore } from "react";
import type { Company } from "@/lib/companies";

const STORAGE_KEY = "justapply_submissions";
const UPDATE_EVENT = "justapply_submissions_updated";

const emptyMap: Record<string, Company> = {};
let cachedSubmissions: Record<string, Company> = emptyMap;
let cachedRaw: string | null = null;

function isCompany(value: unknown): value is Company {
  if (!value || typeof value !== "object") return false;
  const company = value as Partial<Company>;
  return (
    typeof company.name === "string" &&
    typeof company.slug === "string" &&
    typeof company.website === "string" &&
    typeof company.careers === "string" &&
    typeof company.country === "string" &&
    typeof company.region === "string" &&
    typeof company.category === "string" &&
    typeof company.description === "string" &&
    typeof company.logo === "string" &&
    Array.isArray(company.hiringType)
  );
}

export function getSubmissions(): Record<string, Company> {
  if (typeof window === "undefined") return emptyMap;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw !== cachedRaw) {
      cachedRaw = raw;
      const parsed: unknown = raw ? JSON.parse(raw) : {};
      const next: Record<string, Company> = {};
      if (parsed && typeof parsed === "object") {
        for (const [slug, value] of Object.entries(parsed)) {
          if (isCompany(value) && value.slug === slug) next[slug] = value;
        }
      }
      cachedSubmissions = next;
    }
    return cachedSubmissions;
  } catch (error) {
    console.error("Failed to parse submitted companies", error);
    return emptyMap;
  }
}

export function saveSubmission(company: Company) {
  if (typeof window === "undefined") return;
  const current = { ...getSubmissions(), [company.slug]: company };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  cachedRaw = null;
  window.dispatchEvent(new Event(UPDATE_EVENT));
}

export function removeSubmission(slug: string) {
  if (typeof window === "undefined") return;
  const current = { ...getSubmissions() };
  delete current[slug];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  cachedRaw = null;
  window.dispatchEvent(new Event(UPDATE_EVENT));
}

function subscribe(callback: () => void) {
  window.addEventListener(UPDATE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(UPDATE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function getSnapshot() {
  return getSubmissions();
}

function getServerSnapshot() {
  return emptyMap;
}

export function useSubmissionMap() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function useSubmissions(): Company[] {
  const map = useSubmissionMap();
  return useMemo(() => Object.values(map), [map]);
}
