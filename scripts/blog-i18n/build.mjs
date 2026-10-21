// Assembles content/blog-i18n/<lang>/<slug>.mdx from work/cache (copied from the server). Only fully valid posts are written.
// Usage: node scripts/blog-i18n/build.mjs
import fs from 'node:fs';
import path from 'node:path';
import { extract, rebuild } from './lib.mjs';
import { check, tidy } from './validate.mjs';

const cacheDir = 'scripts/blog-i18n/work/cache';
const outDir = 'content/blog-i18n';
const counts = {};
const bad = [];
for (const lang of fs.existsSync(cacheDir) ? fs.readdirSync(cacheDir) : []) {
  for (const f of fs.readdirSync(path.join(cacheDir, lang))) {
    const slug = f.replace(/\.json$/, '');
    const src = path.join('content/blog', slug + '.mdx');
    if (!fs.existsSync(src)) continue;
    const raw = fs.readFileSync(src, 'utf8');
    const { units } = extract(raw);
    const tr = JSON.parse(fs.readFileSync(path.join(cacheDir, lang, f), 'utf8'));
    let ok = true;
    const clean = {};
    for (const u of units) {
      const t = tr[u.id] != null ? tidy(tr[u.id]) : null;
      const why = t ? check(u.kind, lang, u.text, t) : 'missing';
      if (why) {
        ok = false;
        bad.push(`${lang} ${slug} ${u.id} ${why}`);
        break;
      }
      clean[u.id] = t;
    }
    if (!ok) continue;
    fs.mkdirSync(path.join(outDir, lang), { recursive: true });
    fs.writeFileSync(path.join(outDir, lang, slug + '.mdx'), rebuild(raw, clean));
    counts[lang] = (counts[lang] ?? 0) + 1;
  }
}
console.log(counts);
if (bad.length) console.log('incomplete or invalid:\n' + bad.slice(0, 40).join('\n'));
