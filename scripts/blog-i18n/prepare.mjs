// Writes work/units/<slug>.json (the source units for every post) that the server translator reads.
import fs from 'node:fs';
import path from 'node:path';
import { extract } from './lib.mjs';

const dir = 'content/blog';
const out = 'scripts/blog-i18n/work/units';
fs.mkdirSync(out, { recursive: true });
let total = 0, chars = 0;
for (const f of fs.readdirSync(dir).filter((f) => f.endsWith('.mdx'))) {
  const slug = f.replace(/\.mdx$/, '');
  const { units } = extract(fs.readFileSync(path.join(dir, f), 'utf8'));
  fs.writeFileSync(path.join(out, slug + '.json'), JSON.stringify(units));
  total += units.length;
  chars += units.reduce((n, u) => n + u.text.length, 0);
}
console.log('units', total, 'chars', chars);
