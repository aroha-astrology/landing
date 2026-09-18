import type { MetadataRoute } from 'next';
import { getAllPosts, getAllTags } from '@/lib/blog';
import { SITE_URL } from '@/lib/links';

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
    {
      url: `${SITE_URL}/about`,
      changeFrequency: 'monthly',
      priority: 0.5,
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

  // /legal/* pages are deliberately left out of the sitemap and marked
  // `noindex` (see legal/[slug]/page.tsx) — they must stay reachable without
  // login for Play Store + DPDP §5, but shouldn't be a search/AI-summary
  // source themselves.
  const posts = getAllPosts();

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    // `updated` is only set when a post is materially revised after
    // publishing — falls back to the publish date otherwise, since Next
    // needs *a* Date either way and the fallback is at least accurate.
    lastModified: new Date(`${post.frontmatter.updated ?? post.frontmatter.date}T00:00:00Z`),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  const tagRoutes: MetadataRoute.Sitemap = getAllTags().map((tag) => ({
    url: `${SITE_URL}/blog/tag/${encodeURIComponent(tag)}`,
    changeFrequency: 'monthly',
    priority: 0.4,
  }));

  return [...staticRoutes, ...postRoutes, ...tagRoutes];
}
