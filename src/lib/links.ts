// Single source of truth for every outbound destination on the landing page.
// Nothing should ever hardcode `app.arohaastrology.in` or `href="#"` — import
// from here so a domain change is a one-line edit.

export const APP_URL = 'https://app.arohaastrology.in';

// Not live on the App Store yet — every "get the app" CTA on the site opens
// the AppCTA picker (Android via this link, iOS marked Coming soon) rather
// than linking straight into the web app. See src/components/ui/AppCTA.tsx.
export const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.aroha.astrology';

export const LINKS = {
  app: APP_URL,
  signup: `${APP_URL}/onboarding`,
  kundli: `${APP_URL}/kundli`,
  horoscope: `${APP_URL}/horoscope`,
  panchang: `${APP_URL}/panchang`,
  compatibility: `${APP_URL}/compatibility`,
  vastu: `${APP_URL}/vastu`,
  privacy: `${APP_URL}/legal/privacy`,
  terms: `${APP_URL}/legal/terms`,
  disclaimer: `${APP_URL}/legal/disclaimer`,
} as const;
