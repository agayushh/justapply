"use client";

import { useSyncExternalStore } from "react";

export type ApplicationStatus = "saved" | "applied" | "interviewing" | "offer";

export interface TrackedCompany {
  slug: string;
  status: ApplicationStatus;
  notes?: string;
  updatedAt: string;
}

const STORAGE_KEY = "justapply_tracked_companies";

let cachedTrackedCompanies: Record<string, TrackedCompany> = {};
let cachedRaw: string | null = null;

export function getTrackedCompanies(): Record<string, TrackedCompany> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw !== cachedRaw) {
      cachedRaw = raw;
      cachedTrackedCompanies = raw ? JSON.parse(raw) : {};
    }
    return cachedTrackedCompanies;
  } catch (e) {
    console.error("Failed to parse tracked companies", e);
    return {};
  }
}

export function saveTrackedCompany(
  slug: string,
  status: ApplicationStatus,
  notes?: string
) {
  if (typeof window === "undefined") return;
  const current = { ...getTrackedCompanies() };
  current[slug] = {
    slug,
    status,
    notes: notes !== undefined ? notes : current[slug]?.notes || "",
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  window.dispatchEvent(new Event("justapply_tracker_updated"));
}

export function removeTrackedCompany(slug: string) {
  if (typeof window === "undefined") return;
  const current = { ...getTrackedCompanies() };
  delete current[slug];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  window.dispatchEvent(new Event("justapply_tracker_updated"));
}

function subscribe(callback: () => void) {
  window.addEventListener("justapply_tracker_updated", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("justapply_tracker_updated", callback);
    window.removeEventListener("storage", callback);
  };
}

const emptyMap: Record<string, TrackedCompany> = {};

function getSnapshot() {
  return getTrackedCompanies();
}

function getServerSnapshot() {
  return emptyMap;
}

export function useTrackedCompanies() {
  const trackedMap = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  return { trackedMap, isLoaded: true };
}
