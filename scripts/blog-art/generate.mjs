#!/usr/bin/env node
// Generates the hero illustration for every Knowledge Hub article.
//
//   node scripts/blog-art/generate.mjs            # all articles
//   node scripts/blog-art/generate.mjs <slug>...  # just these
//
// Reads each MDX file's frontmatter (`category`, `art.motif`, `art.focus`,
// `art.variant`) and writes public/assets/blog/<category>/<slug>.webp
// (1600×900). Output is deterministic per slug, so re-running only changes
// files whose art spec or drawing code changed.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import matter from 'gray-matter';
import sharp from 'sharp';
import { W, H, hash, defs, astroBackground, astroFinish, vastuBackground, vastuFinish, pujaBackground, pujaFinish } from './lib.mjs';
import { drawAstrology } from './astrology.mjs';
import { drawVastu } from './vastu.mjs';
import { drawPuja, PUJA_DARK } from './puja.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const BLOG_DIR = path.join(ROOT, 'content/blog');
const OUT_DIR = path.join(ROOT, 'public/assets/blog');

export function renderSvg({ slug, category, motif, focus, variant }) {
  const seed = hash(slug);
  const opts = { seed, focus, variant };
  let body;
  if (category === 'astrology') {
    body = [...astroBackground(seed), ...drawAstrology(motif, opts), ...astroFinish()];
  } else if (category === 'vastu') {
    body = [...vastuBackground(seed), ...drawVastu(motif, opts), ...vastuFinish()];
  } else {
    const dark = PUJA_DARK.has(motif);
    body = [...pujaBackground(seed, { dark }), ...drawPuja(motif, opts), ...pujaFinish(dark)];
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${defs()}${body.join('')}</svg>`;
}

async function main() {
  const only = new Set(process.argv.slice(2));
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.mdx'));
  let count = 0;
  for (const file of files) {
    const slug = file.replace(/\.mdx$/, '');
    if (only.size && !only.has(slug)) continue;
    const { data } = matter(fs.readFileSync(path.join(BLOG_DIR, file), 'utf8'));
    if (!data.art?.motif) {
      console.warn(`skip ${slug}: no art.motif in frontmatter`);
      continue;
    }
    const category = data.category ?? 'astrology';
    const svg = renderSvg({ slug, category, ...data.art });
    const dir = path.join(OUT_DIR, category);
    fs.mkdirSync(dir, { recursive: true });
    const out = path.join(dir, `${slug}.webp`);
    await sharp(Buffer.from(svg), { density: 72 }).webp({ quality: 80, effort: 6 }).toFile(out);
    if (process.env.ART_DEBUG_SVG) fs.writeFileSync(out.replace(/\.webp$/, '.svg'), svg);
    const kb = (fs.statSync(out).size / 1024).toFixed(0);
    console.log(`${category}/${slug}.webp  ${kb} KB  (${data.art.motif})`);
    count++;
  }
  console.log(`\n${count} hero image(s) written to public/assets/blog/`);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
