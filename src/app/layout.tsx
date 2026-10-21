import type { Metadata, Viewport } from 'next';
import {
  Public_Sans,
  Newsreader,
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
import { BlogTranslator } from '@/components/blog/BlogTranslator';
import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider';
import { PostHogProvider } from '@/components/providers/PostHogProvider';
import { AppDownloadBanner } from '@/components/landing/AppDownloadBanner';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { RevealObserver } from '@/components/layout/RevealObserver';
import { JsonLd } from '@/components/seo/JsonLd';
import { BRAND, ORG_ID, brandGraph } from '@/lib/brand';
import { SITE_URL } from '@/lib/links';
import { DEFAULT_ROBOTS } from '@/lib/seo';

const publicSans = Public_Sans({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-public-sans',
  weight: ['400', '500', '600', '700'],
});

// Editorial display serif for H1/H2 and for the italic numerals in stat
// blocks — one family covers hero-scale headlines down to card titles.
const newsreader = Newsreader({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-newsreader',
  style: ['normal', 'italic'],
  weight: ['400', '500', '600'],
});

// One Noto Sans face per non-Latin script the LanguageSwitcher exposes.
// Each ships its own unicode-range, so the browser only fetches a file once
// a page actually renders that script (i.e. after a language switch). They
// must NOT be preloaded: next/font preloads by default, which made every
// English page download ~1 MB of Indic fonts up front and pushed mobile LCP
// past 10 s on a slow connection. Devanagari also
// covers Marathi; Gurmukhi covers Punjabi.
const notoDevanagari = Noto_Sans_Devanagari({
  subsets: ['devanagari'],
  display: 'swap',
  variable: '--font-devanagari',
  weight: ['400', '500', '600', '700'],
  preload: false,
});
const notoBengali = Noto_Sans_Bengali({
  subsets: ['bengali'],
  display: 'swap',
  variable: '--font-bengali',
  weight: ['400', '500', '600', '700'],
  preload: false,
});
const notoTamil = Noto_Sans_Tamil({
  subsets: ['tamil'],
  display: 'swap',
  variable: '--font-tamil',
  weight: ['400', '500', '600', '700'],
  preload: false,
});
const notoTelugu = Noto_Sans_Telugu({
  subsets: ['telugu'],
  display: 'swap',
  variable: '--font-telugu',
  weight: ['400', '500', '600', '700'],
  preload: false,
});
const notoGujarati = Noto_Sans_Gujarati({
  subsets: ['gujarati'],
  display: 'swap',
  variable: '--font-gujarati',
  weight: ['400', '500', '600', '700'],
  preload: false,
});
const notoKannada = Noto_Sans_Kannada({
  subsets: ['kannada'],
  display: 'swap',
  variable: '--font-kannada',
  weight: ['400', '500', '600', '700'],
  preload: false,
});
const notoMalayalam = Noto_Sans_Malayalam({
  subsets: ['malayalam'],
  display: 'swap',
  variable: '--font-malayalam',
  weight: ['400', '500', '600', '700'],
  preload: false,
});
const notoGurmukhi = Noto_Sans_Gurmukhi({
  subsets: ['gurmukhi'],
  display: 'swap',
  variable: '--font-gurmukhi',
  weight: ['400', '500', '600', '700'],
  preload: false,
});

const SITE_NAME = BRAND.name;
const DEFAULT_TITLE = 'Aroha: Vedic Astrology, Vastu and Puja';
const SITE_DESCRIPTION =
  'Aroha brings Vedic astrology, Vastu and puja together. Aroha Astrology and Aroha Vastu are available now; Aroha Puja is coming soon.';

export const viewport: Viewport = {
  themeColor: '#F2ECDF',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: '%s | Aroha',
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  alternates: { canonical: '/' },
  robots: DEFAULT_ROBOTS,
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: DEFAULT_TITLE,
    description: SITE_DESCRIPTION,
  },
};

// Organization + product Brands + WebSite load on every page via this root
// layout (see lib/brand.ts), so page-level JSON-LD links to them by @id.
// The Person node is the byline of the pre-ecosystem astrology posts.
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    ...brandGraph(),
    {
      '@type': 'Person',
      '@id': `${SITE_URL}/#author-yogi-baba`,
      name: 'Yogi Baba',
      jobTitle: 'Vedic Astrology Content Advisor',
      description:
        'Reviews and guides the Vedic astrology methodology behind Aroha Astrology: the classical Parashari, Jaimini and KP traditions, expressed through Swiss Ephemeris-accurate calculations and plain-language explanations.',
      worksFor: { '@id': ORG_ID },
    },
  ],
};

// Marks JS as available before first paint, so .reveal elements only start
// hidden when something will reveal them (see globals.css).
const JS_FLAG = "document.documentElement.classList.add('js')";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      // Font variables live on <html> so :root-level tokens (--font-body in
      // globals.css) can resolve them; on <body> they were out of scope for
      // :root and every page silently fell back to the browser serif.
      className={`${publicSans.variable} ${newsreader.variable} ${notoDevanagari.variable} ${notoBengali.variable} ${notoTamil.variable} ${notoTelugu.variable} ${notoGujarati.variable} ${notoKannada.variable} ${notoMalayalam.variable} ${notoGurmukhi.variable} antialiased`}
    >
      <head>
        {/* eslint-disable-next-line react/no-danger */}
        <script dangerouslySetInnerHTML={{ __html: JS_FLAG }} />
        <JsonLd data={jsonLd} />
      </head>
      <body>
        <PostHogProvider>
          <TranslationProvider>
            <a href="#main" className="skip-link">
              Skip to content
            </a>
            <AppDownloadBanner />
            <Navbar />
            <SmoothScrollProvider>
              <main id="main" tabIndex={-1} className="outline-none">
                {children}
              </main>
            </SmoothScrollProvider>
            <Footer />
            <RevealObserver />
            <BlogTranslator />
          </TranslationProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
