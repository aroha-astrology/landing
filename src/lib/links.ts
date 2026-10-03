// Single source of truth for every outbound destination on the landing page.
// Nothing should ever hardcode `app.arohaastrology.in` or `href="#"` — import
// from here so a domain change is a one-line edit.

// MUST include `www.` — the apex domain 308-redirects to www at the edge, so
// a bare-apex URL in JSON-LD @id/url fields points at something that
// redirects away from itself. Used to link Organization/WebSite/WebPage
// entities together across pages via matching @id values.
export const SITE_URL = 'https://www.arohaastrology.in';

// Not live on the App Store yet — every "get the app" CTA on the site opens
// the AppCTA picker: Android (this link), Web (WEB_APP_URL) and iOS marked
// Coming soon. See src/components/ui/AppCTA.tsx.
export const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.aroha.astrology';

// The full app in a browser — same account and data as the Android app.
export const WEB_APP_URL = 'https://app.arohaastrology.in';

export const LINKS = {
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
  support: '/support',
} as const;
