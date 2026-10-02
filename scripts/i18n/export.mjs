#!/usr/bin/env node
// Writes i18n/en.md: every English string on the site that can be
// translated, grouped by page, each under a stable id.
//
//   npm run build && npm run i18n:export
//
// The id is a hash of the English text, so an unchanged string keeps its id
// between exports and a reworded one gets a new id (and needs translating).
import fs from 'node:fs';
import path from 'node:path';
import { I18N_DIR, LANGUAGES, extract } from './lib.mjs';

const entries = await extract();

const groups = [];
for (const e of entries) {
  let g = groups.find((x) => x.name === e.group);
  if (!g) groups.push((g = { name: e.group, entries: [] }));
  g.entries.push(e);
}

const words = entries.reduce((n, e) => n + e.text.split(' ').length, 0);
const lines = [
  '# Aroha website: English strings for translation',
  '',
  `${entries.length} strings, about ${words} words.`,
  '',
  'How to translate this file:',
  '',
  '1. Make one copy per language, named by its code:',
  `   ${LANGUAGES.map((c) => `${c}.md`).join(', ')}.`,
  '2. Leave every line that starts with `## t-` exactly as it is. That code is how the translation is matched to the English.',
  '3. Replace the English text under each code with the translation. One string per code, on one line.',
  '4. Keep these in Latin letters: Aroha, Aroha Astrology, Aroha Vastu, Aroha Puja, Android, iOS, Google Play, Swiss Ephemeris.',
  '5. Write Kundli, Lagna, Rashi, Nakshatra, Dasha, Panchang, Vastu, puja and similar terms the way readers of that language normally see them.',
  '6. Keep numbers, prices, arrows (→) and symbols (·) where they are.',
  '7. The note in brackets after a code (button or link, heading) is a hint. Buttons and links should stay short.',
  '8. A line like `<!-- Part of: ... -->` shows the full sentence a fragment sits in. Translate only the fragment, so that the pieces still read correctly in order. Leave the comment line as it is, or delete it.',
  '',
  'Article text and the legal pages are not in this file. They stay in English.',
  '',
];

for (const g of groups) {
  lines.push('---', `# ${g.name}`, '');
  for (const e of g.entries) {
    lines.push(`## ${e.id}${e.hint ? ` (${e.hint})` : ''}`);
    if (e.context) lines.push(`<!-- Part of: ${e.context} -->`);
    lines.push(e.text, '');
  }
}

fs.mkdirSync(I18N_DIR, { recursive: true });
const file = path.join(I18N_DIR, 'en.md');
fs.writeFileSync(file, lines.join('\n'));
console.log(`Wrote ${path.relative(process.cwd(), file)}: ${entries.length} strings, about ${words} words.`);
for (const g of groups) console.log(`  ${String(g.entries.length).padStart(4)}  ${g.name}`);
