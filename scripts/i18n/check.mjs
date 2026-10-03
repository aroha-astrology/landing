#!/usr/bin/env node
// Fails when an installed language is missing a string that the built site
// shows. Run after `npm run build`; this is what stops the translation from
// silently going stale again when English copy changes.
import fs from 'node:fs';
import path from 'node:path';
import { LANGUAGES, ROOT, extract } from './lib.mjs';

const dir = path.join(ROOT, 'src/lib/i18n/locales');
const entries = await extract();
let bad = false;

for (const code of LANGUAGES) {
  const file = path.join(dir, `${code}.json`);
  if (!fs.existsSync(file)) continue;
  const map = JSON.parse(fs.readFileSync(file, 'utf8'));
  const missing = entries.filter((e) => !map[e.text]);
  const unused = Object.keys(map).filter((k) => !entries.some((e) => e.text === k));
  console.log(`${code}: ${entries.length - missing.length}/${entries.length}${unused.length ? `, ${unused.length} unused` : ''}`);
  for (const e of missing.slice(0, 15)) console.log(`  missing [${e.group}] ${e.text.slice(0, 90)}`);
  if (missing.length > 15) console.log(`  … ${missing.length - 15} more`);
  if (missing.length) bad = true;
}
if (!bad) console.log('All installed languages cover every string.');
process.exit(bad ? 1 : 0);
