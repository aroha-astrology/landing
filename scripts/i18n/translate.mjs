#!/usr/bin/env node
// Fills the strings a language file is missing, using apinex (apinex.bond/v1).
//
//   APINEX_API_KEY=... npm run i18n:translate            every language
//   APINEX_API_KEY=... npm run i18n:translate -- hi de   only those
//   add --dry to only count what is missing
//
// Reads i18n/en.md (run `npm run build && npm run i18n:export` first), finds each id a
// language's i18n/<code>.md lacks, asks apinex for just those, checks each answer
// (not empty, no dashes, same numbers as the English) and appends the good ones to
// i18n/<code>.md. Then run `npm run i18n:import` and check the result with i18n:check.
//
// The key lives as APINEX_API_KEYS in /etc/aroha-marketing/secrets.env on the Sydney
// marketing box. apinex allows 5 requests a minute, so calls are spaced 13 s apart.
// Only website copy is sent, never user data.
import fs from 'node:fs';
import path from 'node:path';
import { I18N_DIR, LANGUAGES, readStringsFile } from './lib.mjs';

// Free on the owner's apinex plan; gemini-3.1-pro and qwen-3.8-max there need a paid subscription.
const MODEL = 'free/gemini-3.8-flash';
const GAP_MS = 13_000;
const BATCH = 40;

const NAMES = {
  hi: 'Hindi', bn: 'Bengali', ta: 'Tamil', te: 'Telugu', mr: 'Marathi', gu: 'Gujarati', kn: 'Kannada',
  es: 'Spanish', fr: 'French', de: 'German', pt: 'Portuguese', it: 'Italian', ru: 'Russian', ja: 'Japanese',
};

/** en.md as id -> { text, hint, partOf }, keeping the notes a translator would see. */
function readEnglish() {
  const out = new Map();
  let cur = null;
  for (const line of fs.readFileSync(path.join(I18N_DIR, 'en.md'), 'utf8').split(/\r?\n/)) {
    const head = line.match(/^##\s+(t-[0-9a-f]{8})\s*(?:\((.*)\))?/);
    if (head) {
      cur = { id: head[1], hint: head[2] ?? '', partOf: '', lines: [] };
      out.set(cur.id, cur);
      continue;
    }
    if (/^#\s/.test(line) || /^---\s*$/.test(line)) {
      cur = null;
      continue;
    }
    if (!cur) continue;
    const note = line.match(/^<!--\s*Part of:\s*(.*?)\s*-->\s*$/);
    if (note) cur.partOf = note[1];
    else if (line.trim()) cur.lines.push(line.trim());
  }
  return new Map([...out].map(([id, e]) => [id, { text: e.lines.join(' '), hint: e.hint, partOf: e.partOf }]));
}

/** Bengali and Devanagari digits written as 0-9, the way the rest of the site shows numbers. */
const westernDigits = (s) =>
  s.replace(/[০-৯]/g, (d) => String(d.charCodeAt(0) - 0x09e6)).replace(/[०-९]/g, (d) => String(d.charCodeAt(0) - 0x0966));

/** Every number in the English is still in the translation (it may add one, e.g. "Seven" as 7). */
function keepsNumbers(english, translated) {
  const left = translated.match(/\d+/g) ?? [];
  for (const n of english.match(/\d+/g) ?? []) {
    const i = left.indexOf(n);
    if (i < 0) return false;
    left.splice(i, 1);
  }
  return true;
}

let lastCall = 0;
async function ask(language, items) {
  const rules =
    `You translate the website of Aroha Astrology (a Vedic astrology and Vastu app) from English into ${language}.\n` +
    'Rules:\n' +
    '- Keep these in Latin letters: Aroha, Aroha Astrology, Aroha Vastu, Aroha Puja, Android, iOS, Google Play, Swiss Ephemeris.\n' +
    '- Write Kundli, Lagna, Rashi, Nakshatra, Dasha, Panchang, Vastu, puja and similar terms the way readers of that language normally see them.\n' +
    '- Keep numbers (as Western digits 0-9), prices, arrows (→) and symbols (·) where they are.\n' +
    '- Do not use em dashes or en dashes. Use a comma, a colon or a full stop instead.\n' +
    '- A "hint" of button or link means keep it short. When "partOf" is given, translate only the fragment so the pieces still read in order.\n' +
    '- Warm, plain, natural wording. One line per string.\n' +
    'Return ONLY a JSON object mapping each id to its translation.';
  const payload = Object.fromEntries(
    items.map(([id, e]) => [id, { text: e.text, ...(e.hint && { hint: e.hint }), ...(e.partOf && { partOf: e.partOf }) }]),
  );
  for (let attempt = 1; attempt <= 5; attempt++) {
    await new Promise((r) => setTimeout(r, Math.max(0, lastCall + GAP_MS - Date.now())));
    lastCall = Date.now();
    try {
      const res = await fetch('https://apinex.bond/v1/chat/completions', {
        method: 'POST',
        headers: { Authorization: `Bearer ${process.env.APINEX_API_KEY.split(',')[0].trim()}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: MODEL,
          temperature: 0.2,
          max_tokens: 16000,
          messages: [
            { role: 'system', content: rules },
            { role: 'user', content: JSON.stringify(payload) },
          ],
        }),
        signal: AbortSignal.timeout(180_000),
      });
      const body = await res.text();
      if (res.ok) {
        const m = (JSON.parse(body).choices?.[0]?.message?.content ?? '').match(/\{[\s\S]*\}/);
        if (m) return JSON.parse(m[0]);
      }
      console.log(`  ${language}: attempt ${attempt} failed (${res.status} ${body.slice(0, 100).replace(/\s+/g, ' ')})`);
    } catch (err) {
      console.log(`  ${language}: attempt ${attempt} failed (${err.message})`);
    }
    await new Promise((r) => setTimeout(r, 15_000 * attempt));
  }
  throw new Error(`apinex would not translate into ${language}`);
}

const args = process.argv.slice(2);
const dry = args.includes('--dry');
const only = args.filter((a) => !a.startsWith('--'));
if (!dry && !process.env.APINEX_API_KEY) {
  console.error('Set APINEX_API_KEY');
  process.exit(1);
}

const en = readEnglish();
for (const code of LANGUAGES.filter((c) => only.length === 0 || only.includes(c))) {
  const file = path.join(I18N_DIR, `${code}.md`);
  const have = fs.existsSync(file) ? readStringsFile(file) : new Map();
  const missing = [...en].filter(([id, e]) => e.text && !have.get(id));
  console.log(`${code}: ${missing.length} missing`);
  if (dry || missing.length === 0) continue;

  const added = [];
  for (let i = 0; i < missing.length; i += BATCH) {
    const items = missing.slice(i, i + BATCH);
    const out = await ask(NAMES[code], items);
    for (const [id, e] of items) {
      const t = typeof out[id] === 'string' ? westernDigits(out[id].replace(/\s+/g, ' ').trim()) : '';
      if (!t) console.log(`  ${code}: skipped ${id} (no answer)`);
      else if (/[—–]/.test(t)) console.log(`  ${code}: skipped ${id} (dash)`);
      else if (!keepsNumbers(e.text, t)) console.log(`  ${code}: skipped ${id} (numbers changed)`);
      else added.push(`## ${id}\n${t}\n`);
    }
  }
  if (added.length) {
    const raw = fs.readFileSync(file, 'utf8');
    const eol = raw.includes('\r\n') ? '\r\n' : '\n';
    const tail = `${raw.endsWith('\n') ? '' : eol}${eol}${added.join(eol)}`.replace(/\r?\n/g, eol);
    fs.appendFileSync(file, tail);
  }
  console.log(`  ${code}: added ${added.length}`);
}
