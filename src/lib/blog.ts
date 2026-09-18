import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const BLOG_DIR = path.join(process.cwd(), 'content/blog');

// Average adult silent reading speed, used only to round to a friendly
// "N min read" label — not a claim of precision.
const WORDS_PER_MINUTE = 200;

export type BlogFrontmatter = {
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  /** Optional: set only when a post is materially revised after publishing. */
  updated?: string; // YYYY-MM-DD
  tags: string[];
  faqs?: { question: string; answer: string }[];
  /** Public path to a hero image, e.g. "/blog/moon.png" — all art lives under
   * `public/`, copied in from the app's own asset library (see
   * docs/superpowers/plans for the mapping rationale). Optional so a post
   * can ship text-only if nothing fits. */
  hero?: string;
  heroAlt?: string;
  /** Defaults to "Yogi Baba" (the site-wide content-advisor byline; see
   * layout.tsx's `#author-yogi-baba` JSON-LD node) when omitted. */
  author?: string;
};

export type BlogPost = {
  slug: string;
  frontmatter: BlogFrontmatter;
  content: string;
  /** Rounded minutes to read `content`, derived from its word count. */
  readingTime: number;
};

/**
 * `content/blog/*.mdx` is the only thing this module touches on disk — the
 * blog index, the post route, and sitemap.ts all import from here instead of
 * re-reading the directory themselves, so slugs stay in exactly one place.
 */
export function getAllSlugs(): string[] {
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''));
}

function estimateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

export function getPost(slug: string): BlogPost {
  const raw = fs.readFileSync(path.join(BLOG_DIR, `${slug}.mdx`), 'utf8');
  const { data, content } = matter(raw);
  return {
    slug,
    frontmatter: data as BlogFrontmatter,
    content,
    readingTime: estimateReadingTime(content),
  };
}

export function getAllPosts(): BlogPost[] {
  return getAllSlugs()
    .map(getPost)
    .sort((a, b) => (a.frontmatter.date < b.frontmatter.date ? 1 : -1));
}

/** Every tag used across all posts, sorted alphabetically — backs the tag
 * archive pages at /blog/tag/[tag] and their generateStaticParams. */
export function getAllTags(): string[] {
  const tags = new Set<string>();
  for (const post of getAllPosts()) {
    for (const tag of post.frontmatter.tags ?? []) tags.add(tag);
  }
  return [...tags].sort((a, b) => a.localeCompare(b));
}

export function getPostsByTag(tag: string): BlogPost[] {
  return getAllPosts().filter((post) => post.frontmatter.tags?.includes(tag));
}

/**
 * Up to `limit` other posts sharing the most tags with `post`, most-shared
 * first, ties broken by recency. Falls back to the newest other posts if
 * nothing shares a tag, so a post with unique tags still gets related reads.
 */
export function getRelatedPosts(post: BlogPost, limit = 3): BlogPost[] {
  const others = getAllPosts().filter((p) => p.slug !== post.slug);
  const tagSet = new Set(post.frontmatter.tags ?? []);

  const scored = others
    .map((p) => ({
      post: p,
      shared: (p.frontmatter.tags ?? []).filter((t) => tagSet.has(t)).length,
    }))
    .sort((a, b) => {
      if (b.shared !== a.shared) return b.shared - a.shared;
      return a.post.frontmatter.date < b.post.frontmatter.date ? 1 : -1;
    });

  return scored.slice(0, limit).map((s) => s.post);
}
