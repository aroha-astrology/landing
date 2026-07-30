/**
 * Standalone analytics-consent flag (localStorage-backed). Mirrors
 * frontend/lib/analytics-consent.ts. Analytics is granted by default;
 * only an explicit prior "denied" opts a visitor out.
 */

const STORAGE_KEY = "aroha_analytics_consent";

export type AnalyticsConsent = "granted" | "denied";

export function getAnalyticsConsent(): AnalyticsConsent {
  if (typeof window === "undefined") return "granted";
  const raw = window.localStorage.getItem(STORAGE_KEY);
  return raw === "denied" ? "denied" : "granted";
}

export function setAnalyticsConsent(value: "granted" | "denied"): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, value);
  window.dispatchEvent(new Event("analytics-consent-changed"));
}
