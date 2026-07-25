import type { MetadataRoute } from 'next';
import { getAllSlugs } from '@/lib/blog';

const SITE_URL = 'https://arohaastrology.in';

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
      url: `${SITE_URL}/blog`,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  const postRoutes: MetadataRoute.Sitemap = getAllSlugs().map((slug) => ({
    url: `${SITE_URL}/blog/${slug}`,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...postRoutes];
}
