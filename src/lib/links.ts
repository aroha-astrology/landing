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
  // Legal documents are served by THIS site, not the app. These are the URLs
  // the Play Store listing and the backend's GET /legal/current point at, and
  // they must resolve without a login — a reviewer will not install the app to
  // read the privacy policy. They used to point at app.arohaastrology.in while
  // arohaastrology.in/legal/* 404'd. The app renders its own in-app copies at
  // the same paths for the point-of-consent flow; both exist on purpose.
  privacy: '/legal/privacy',
  terms: '/legal/terms',
  disclaimer: '/legal/disclaimer',
  deleteAccount: '/delete-account',
} as const;
