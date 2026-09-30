import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Server-side proxies only; nothing a search engine should fetch.
      // Pages, CSS, JS (/_next/) and images all stay crawlable. Private
      // pages (/legal/*, articles in review, thin archives) use a noindex
      // meta tag instead, which only works if they are NOT disallowed here.
      disallow: ['/api/'],
    },
    // www host, not the apex — the apex 308-redirects, and Google deprioritized
    // re-reading this sitemap for 2.5 months after hitting that redirect.
    sitemap: 'https://www.arohaastrology.in/sitemap.xml',
    host: 'https://www.arohaastrology.in',
  };
}
