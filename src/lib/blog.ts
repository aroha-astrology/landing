import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const BLOG_DIR = path.join(process.cwd(), 'content/blog');

export type BlogFrontmatter = {
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  tags: string[];
};

export type BlogPost = { slug: string; frontmatter: BlogFrontmatter; content: string };

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

export function getPost(slug: string): BlogPost {
  const raw = fs.readFileSync(path.join(BLOG_DIR, `${slug}.mdx`), 'utf8');
  const { data, content } = matter(raw);
  return { slug, frontmatter: data as BlogFrontmatter, content };
}

export function getAllPosts(): BlogPost[] {
  return getAllSlugs()
    .map(getPost)
    .sort((a, b) => (a.frontmatter.date < b.frontmatter.date ? 1 : -1));
}
