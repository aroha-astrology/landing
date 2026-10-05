import type { MetadataRoute } from 'next';
import { MIN_INDEXABLE_TAG_POSTS, getAllTags, getPostsByTag, getPublishedPosts } from '@/lib/blog';
import { CATEGORY_ORDER } from '@/lib/categories';
import { SITE_URL } from '@/lib/links';

// Mirrors CategoryHub's MIN_INDEXABLE: a hub asking not to be indexed
// shouldn't be advertised here.
const MIN_HUB_POSTS = 3;

/**
 * Only public, canonical, indexable URLs. Excluded on purpose: /api/*,
 * /legal/* (noindex, see legal/[slug]/page.tsx), articles still in review,
 * thin tag archives and thin category hubs. Articles are read from disk at
 * build, so a new published article appears here automatically.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPublishedPosts();
  const latest = (list: typeof posts) =>
    list.length ? new Date(`${list.map((p) => p.frontmatter.updated ?? p.frontmatter.date).sort().at(-1)}T00:00:00Z`) : undefined;

  // The day the page's own copy or structured data last changed. Update by
  // hand when a page is edited; a date that moves on every build is ignored.
  const edited = (day: string) => new Date(`${day}T00:00:00Z`);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: edited('2026-10-06'), changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/astrology`, lastModified: edited('2026-10-06'), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/vastu`, lastModified: edited('2026-10-06'), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/puja`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/kundli`, lastModified: edited('2026-10-06'), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/moon-sign`, lastModified: edited('2026-10-06'), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/panchang`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/blog`, lastModified: latest(posts), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/about`, lastModified: edited('2026-10-06'), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/editorial-standards`, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${SITE_URL}/support`, changeFrequency: 'yearly', priority: 0.3 },
    // Low priority but deliberately listed: these are the URLs the Play Store
    // listing points at, and an unindexed policy page is a reviewer's 404
    // waiting to happen.
    { url: `${SITE_URL}/delete-account`, changeFrequency: 'yearly', priority: 0.3 },
  ];

  const hubRoutes: MetadataRoute.Sitemap = CATEGORY_ORDER.flatMap((c) => {
    const inCat = posts.filter((p) => p.category === c);
    if (inCat.length < MIN_HUB_POSTS) return [];
    return [{ url: `${SITE_URL}/blog/${c}`, lastModified: latest(inCat), changeFrequency: 'weekly' as const, priority: 0.7 }];
  });

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(`${post.frontmatter.updated ?? post.frontmatter.date}T00:00:00Z`),
    changeFrequency: 'monthly',
    priority: post.isPillar ? 0.7 : 0.6,
    images: post.hero ? [`${SITE_URL}${post.hero}`] : undefined,
  }));

  const tagRoutes: MetadataRoute.Sitemap = getAllTags()
    .filter((tag) => getPostsByTag(tag).filter((p) => p.status === 'published').length >= MIN_INDEXABLE_TAG_POSTS)
    .map((tag) => ({
      url: `${SITE_URL}/blog/tag/${encodeURIComponent(tag)}`,
      changeFrequency: 'monthly',
      priority: 0.3,
    }));

  return [...staticRoutes, ...hubRoutes, ...postRoutes, ...tagRoutes];
}
