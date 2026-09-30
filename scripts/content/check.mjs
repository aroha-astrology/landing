#!/usr/bin/env node
// Validates every Knowledge Hub article before it can be published.
//
//   npm run content:check
//
// Fails (exit 1) on: missing required frontmatter, unknown category or
// status, missing hero art or alt text, broken internal links or related
// slugs, and duplicate titles. Warns on long descriptions and on a
// published article linking to one still in review (that link renders as
// plain text until the other is published).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const DIR = path.join(ROOT, 'content/blog');
const CATEGORIES = new Set(['astrology', 'vastu', 'puja']);
const HUBS = new Set(['astrology', 'vastu', 'puja', 'tag']);

const files = fs.readdirSync(DIR).filter((f) => f.endsWith('.mdx'));
const posts = new Map(
  files.map((f) => {
    const { data, content } = matter(fs.readFileSync(path.join(DIR, f), 'utf8'));
    return [f.replace(/\.mdx$/, ''), { data, content }];
  }),
);

const errors = [];
const warnings = [];
const titles = new Map();

for (const [slug, { data, content }] of posts) {
  const where = `${slug}.mdx`;
  for (const key of ['title', 'description', 'date', 'tags', 'heroAlt']) {
    if (!data[key] || (Array.isArray(data[key]) && data[key].length === 0)) errors.push(`${where}: missing "${key}"`);
  }
  const category = data.category ?? 'astrology';
  const status = data.status ?? 'published';
  if (!CATEGORIES.has(category)) errors.push(`${where}: unknown category "${category}"`);
  if (!['published', 'review'].includes(status)) errors.push(`${where}: unknown status "${status}"`);
  if (!data.art?.motif) errors.push(`${where}: no art.motif (hero generator input)`);
  if (!fs.existsSync(path.join(ROOT, 'public/assets/blog', category, `${slug}.webp`)))
    errors.push(`${where}: hero image missing; run npm run blog:art -- ${slug}`);
  if (data.description && data.description.length > 260) warnings.push(`${where}: description is ${data.description.length} chars`);
  if (titles.has(data.title)) errors.push(`${where}: duplicate title with ${titles.get(data.title)}`);
  titles.set(data.title, slug);

  for (const r of data.related ?? []) if (!posts.has(r)) errors.push(`${where}: related slug "${r}" does not exist`);
  for (const m of content.matchAll(/\]\(\/blog\/([a-z0-9-]+)/g)) {
    const target = m[1];
    if (HUBS.has(target)) continue;
    if (!posts.has(target)) errors.push(`${where}: links to missing article /blog/${target}`);
    else if (status === 'published' && (posts.get(target).data.status ?? 'published') === 'review')
      warnings.push(`${where}: links to /blog/${target}, which is still in review (shown as plain text until published)`);
  }
}

const count = (c, s) => [...posts.values()].filter((p) => (p.data.category ?? 'astrology') === c && (p.data.status ?? 'published') === s).length;
for (const c of CATEGORIES) console.log(`${c.padEnd(10)} published ${String(count(c, 'published')).padStart(3)}   in review ${count(c, 'review')}`);
for (const w of warnings) console.warn(`warn  ${w}`);
for (const e of errors) console.error(`error ${e}`);
console.log(errors.length ? `\n${errors.length} error(s)` : '\nAll articles valid.');
process.exit(errors.length ? 1 : 0);
