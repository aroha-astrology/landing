import type { Metadata, Viewport } from 'next';
import {
  Inter,
  Playfair_Display,
  Cinzel,
  Cormorant_Garamond,
  Noto_Sans_Devanagari,
} from 'next/font/google';
import './globals.css';
import { TranslationProvider } from '@/components/providers/TranslationProvider';
import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700'],
});

// Italic display face — the hero wordmark + headline accent.
const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
  style: ['italic', 'normal'],
  weight: ['400', '500', '600'],
});

// Mystical serif for section headings (cinematic, all-caps friendly).
const cinzel = Cinzel({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-cinzel',
  weight: ['500', '600', '700'],
});

// Elegant sub-display serif for eyebrows, quotes and supporting copy.
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-cormorant',
  style: ['italic', 'normal'],
  weight: ['400', '500', '600'],
});

// So Hindi / Marathi / Nepali strings render real Devanagari glyphs.
const notoDevanagari = Noto_Sans_Devanagari({
  subsets: ['devanagari'],
  display: 'swap',
  variable: '--font-devanagari',
  weight: ['400', '500', '600', '700'],
});

const SITE_URL = 'https://arohaastrology.in';

export const viewport: Viewport = {
  themeColor: '#11131A',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Aroha Astrology — Vedic Astrology Powered by AI',
    template: '%s | Aroha Astrology',
  },
  description:
    'Stars align, destinies unfold. Free Kundli, daily Panchang, horoscope and matchmaking — Swiss Ephemeris precision with AI-driven Vedic interpretation.',
  applicationName: 'Aroha Astrology',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: 'Aroha Astrology',
    title: 'Aroha Astrology — Vedic Astrology Powered by AI',
    description:
      'Stars align, destinies unfold. Free Kundli, Panchang, horoscope and matchmaking, powered by Swiss Ephemeris and AI.',
    url: SITE_URL,
    locale: 'en_US',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} ${cinzel.variable} ${cormorant.variable} ${notoDevanagari.variable} antialiased`}
      >
        <TranslationProvider>
          <SmoothScrollProvider>{children}</SmoothScrollProvider>
        </TranslationProvider>
      </body>
    </html>
  );
}
