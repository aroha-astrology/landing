import type { Metadata } from 'next';

/**
 * The site-wide robots directives. A page that sets `robots` at all, even to
 * `undefined`, replaces the root layout's value wholesale, so every page
 * that builds its own metadata has to restate these or it ships with no
 * robots tag and loses `max-image-preview:large`.
 */
export const DEFAULT_ROBOTS: Metadata['robots'] = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
  },
};

const DEFAULT_IMAGE = {
  url: '/opengraph-image',
  width: 1200,
  height: 630,
  alt: 'Aroha: your birth chart and your home, read the Vedic way. Astrology, Vastu and Puja.',
};

/**
 * Page metadata with a canonical URL and complete Open Graph / Twitter
 * tags. A page that sets its own `openGraph` object replaces the root one
 * wholesale (Next doesn't deep-merge it), so the share image has to be
 * restated here or the page ships without og:image.
 */
export function pageMetadata({
  title,
  description,
  path,
  robots,
  absoluteTitle = false,
}: {
  /** Skip the "| Aroha" template, for titles that already lead with the brand. */
  absoluteTitle?: boolean;
  title: string;
  description: string;
  path: string;
  robots?: Metadata['robots'];
}): Metadata {
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    robots: robots ?? DEFAULT_ROBOTS,
    openGraph: { type: 'website', siteName: 'Aroha', locale: 'en_IN', title, description, url: path, images: [DEFAULT_IMAGE] },
    twitter: { card: 'summary_large_image', title, description, images: [DEFAULT_IMAGE.url] },
  };
}
