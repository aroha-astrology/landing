import type { Metadata, Viewport } from 'next';
import {
  Inter,
  Fraunces,
  Noto_Sans_Devanagari,
  Noto_Sans_Bengali,
  Noto_Sans_Tamil,
  Noto_Sans_Telugu,
  Noto_Sans_Gujarati,
  Noto_Sans_Kannada,
  Noto_Sans_Malayalam,
  Noto_Sans_Gurmukhi,
} from 'next/font/google';
import './globals.css';
import { TranslationProvider } from '@/components/providers/TranslationProvider';
import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider';
import { PostHogProvider } from '@/components/providers/PostHogProvider';
import { AppDownloadBanner } from '@/components/landing/AppDownloadBanner';
import AnalyticsConsentBanner from '@/components/AnalyticsConsentBanner';

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700'],
});

// Editorial display serif for H1/H2 — variable + optical sizing, so one
// family covers hero-scale headlines down to card titles.
const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fraunces',
  style: ['normal', 'italic'],
  weight: ['400', '500', '600'],
});

// One Noto Sans face per non-Latin script the LanguageSwitcher exposes.
// Each ships its own unicode-range, so the browser only fetches a file once
// a page actually renders that script (i.e. after a language switch) —
// these do not add weight to the initial English paint. Devanagari also
// covers Marathi; Gurmukhi covers Punjabi.
const notoDevanagari = Noto_Sans_Devanagari({
  subsets: ['devanagari'],
  display: 'swap',
  variable: '--font-devanagari',
  weight: ['400', '500', '600', '700'],
});
const notoBengali = Noto_Sans_Bengali({
  subsets: ['bengali'],
  display: 'swap',
  variable: '--font-bengali',
  weight: ['400', '500', '600', '700'],
});
const notoTamil = Noto_Sans_Tamil({
  subsets: ['tamil'],
  display: 'swap',
  variable: '--font-tamil',
  weight: ['400', '500', '600', '700'],
});
const notoTelugu = Noto_Sans_Telugu({
  subsets: ['telugu'],
  display: 'swap',
  variable: '--font-telugu',
  weight: ['400', '500', '600', '700'],
});
const notoGujarati = Noto_Sans_Gujarati({
  subsets: ['gujarati'],
  display: 'swap',
  variable: '--font-gujarati',
  weight: ['400', '500', '600', '700'],
});
const notoKannada = Noto_Sans_Kannada({
  subsets: ['kannada'],
  display: 'swap',
  variable: '--font-kannada',
  weight: ['400', '500', '600', '700'],
});
const notoMalayalam = Noto_Sans_Malayalam({
  subsets: ['malayalam'],
  display: 'swap',
  variable: '--font-malayalam',
  weight: ['400', '500', '600', '700'],
});
const notoGurmukhi = Noto_Sans_Gurmukhi({
  subsets: ['gurmukhi'],
  display: 'swap',
  variable: '--font-gurmukhi',
  weight: ['400', '500', '600', '700'],
});

const SITE_URL = 'https://arohaastrology.in';
const SITE_NAME = 'Aroha Astrology';
const SITE_DESCRIPTION =
  'Free Vedic birth chart, Moon sign calculator and daily Panchang — Swiss Ephemeris precision with an AI astrologer that explains what it means, in your language.';

export const viewport: Viewport = {
  themeColor: '#FAF8F5',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Aroha Astrology — Vedic Birth Chart, Moon Sign & AI Astrologer',
    template: '%s | Aroha Astrology',
  },
  description: SITE_DESCRIPTION,
  keywords: [
    'vedic astrology',
    'moon sign calculator',
    'rashi calculator',
    'free kundli',
    'birth chart',
    'janma kundli',
    'panchang today',
    'vimshottari dasha',
    'ai astrologer',
    'swiss ephemeris',
  ],
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  alternates: { canonical: '/' },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: 'Aroha Astrology — Vedic Birth Chart, Moon Sign & AI Astrologer',
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aroha Astrology — Vedic Birth Chart, Moon Sign & AI Astrologer',
    description: SITE_DESCRIPTION,
  },
};

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/blog?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: SITE_NAME,
    applicationCategory: 'LifestyleApplication',
    operatingSystem: 'Android, iOS, Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${inter.variable} ${fraunces.variable} ${notoDevanagari.variable} ${notoBengali.variable} ${notoTamil.variable} ${notoTelugu.variable} ${notoGujarati.variable} ${notoKannada.variable} ${notoMalayalam.variable} ${notoGurmukhi.variable} antialiased`}
      >
        <PostHogProvider>
          <TranslationProvider>
            <AppDownloadBanner />
            <SmoothScrollProvider>{children}</SmoothScrollProvider>
            <AnalyticsConsentBanner />
          </TranslationProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
