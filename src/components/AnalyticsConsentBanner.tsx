"use client";

import { useEffect, useState } from "react";
import { getAnalyticsConsent, setAnalyticsConsent } from "@/lib/analytics-consent";

/**
 * Minimal, non-blocking banner gating PostHog init/identify/capture until
 * the visitor explicitly opts in. English-only, matching this site's
 * existing legal-text convention (see SECURITY_AND_PRIVACY_AUDIT.md).
 */
export default function AnalyticsConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(getAnalyticsConsent() === "unset");
  }, []);

  if (!visible) return null;

  const choose = (value: "granted" | "denied") => {
    setAnalyticsConsent(value);
    setVisible(false);
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[90] mx-auto max-w-md rounded-2xl border border-amber-500/20 bg-black/90 backdrop-blur-xl shadow-2xl px-4 py-3.5">
      <p className="text-xs text-neutral-300 leading-relaxed mb-3">
        We&apos;d like to use privacy-conscious analytics to understand how this site is used. No personal data
        is collected without your consent.
      </p>
      <div className="flex gap-2.5">
        <button
          onClick={() => choose("denied")}
          className="flex-1 px-3 py-2 rounded-xl border border-amber-500/20 text-xs font-medium text-neutral-200"
        >
          Decline
        </button>
        <button
          onClick={() => choose("granted")}
          className="flex-1 px-3 py-2 rounded-xl bg-amber-500 text-black text-xs font-medium"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
