import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    // www host, not the apex — the apex 308-redirects, and Google deprioritized
    // re-reading this sitemap for 2.5 months after hitting that redirect.
    sitemap: 'https://www.arohaastrology.in/sitemap.xml',
  };
}
