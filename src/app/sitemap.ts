import type { MetadataRoute } from 'next';
import { getAllSlugs } from '@/lib/blog';
import { LEGAL_DOCS } from '@/lib/legal-content';

// Keep in sync with SITE_URL in layout.tsx — see the note there on why every
// entry must be the www host. A sitemap of redirecting URLs indexes nothing.
const SITE_URL = 'https://www.arohaastrology.in';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/moon-sign`,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/panchang`,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/kundli`,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/blog`,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    // Low priority but deliberately listed: these are the URLs the Play Store
    // listing points at, and an unindexed policy page is a reviewer's 404
    // waiting to happen.
    {
      url: `${SITE_URL}/delete-account`,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  const legalRoutes: MetadataRoute.Sitemap = (
    Object.keys(LEGAL_DOCS) as (keyof typeof LEGAL_DOCS)[]
  ).map((slug) => ({
    url: `${SITE_URL}/legal/${slug}`,
    changeFrequency: 'yearly',
    priority: 0.3,
  }));

  const postRoutes: MetadataRoute.Sitemap = getAllSlugs().map((slug) => ({
    url: `${SITE_URL}/blog/${slug}`,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...legalRoutes, ...postRoutes];
}
