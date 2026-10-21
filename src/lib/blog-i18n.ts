import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const DIR = path.join(process.cwd(), 'content/blog-i18n');

export type TranslatedPost = {
  frontmatter: { title: string; description: string; heroAlt?: string; faqs?: { question: string; answer: string }[] };
  content: string;
};

/** Every translated language folder on disk. */
export function translatedLangs(): string[] {
  if (!fs.existsSync(DIR)) return [];
  return fs.readdirSync(DIR).filter((d) => fs.statSync(path.join(DIR, d)).isDirectory());
}

export function translatedSlugs(lang: string): string[] {
  const dir = path.join(DIR, lang);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith('.mdx')).map((f) => f.replace(/\.mdx$/, ''));
}

export function getTranslatedPost(lang: string, slug: string): TranslatedPost | null {
  if (!/^[a-z]{2}$/.test(lang) || !/^[a-z0-9-]+$/.test(slug)) return null;
  const file = path.join(DIR, lang, `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;
  const { data, content } = matter(fs.readFileSync(file, 'utf8'));
  return { frontmatter: data as TranslatedPost['frontmatter'], content };
}
