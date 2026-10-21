// Runs on the HomeSpace EC2 in ~/blogtr:  PRIVATE_API_TOKEN=... node translate.mjs <lang,lang> [slug,slug|all] [workers]
// Reads units/<slug>.json, asks Omnirush for translations, validates each unit and caches it in cache/<lang>/<slug>.json.
import fs from 'node:fs';
import path from 'node:path';
import { LANG_NAMES, check, tidy } from './validate.mjs';

const URL = 'https://api.homespace.arohaastrology.in/api/v1/private/ask';
const TOKEN = process.env.PRIVATE_API_TOKEN;
if (!TOKEN) throw new Error('set PRIVATE_API_TOKEN');

const [langArg, slugArg = 'all', workerArg = '4'] = process.argv.slice(2);
const langs = langArg.split(',');
const allSlugs = fs.readdirSync('units').map((f) => f.replace(/\.json$/, '')).sort();
const slugs = slugArg === 'all' ? allSlugs : slugArg.split(',');
const WORKERS = Number(workerArg);
const MAX_CHARS = 900;
const MAX_UNITS = 12;

const SYSTEM = (lang) => `You translate blog articles for Aroha, a Vedic astrology, Vastu and puja product, from English into ${LANG_NAMES[lang]}.
Rules:
- Keep Aroha, Aroha Astrology, Aroha Vastu, Aroha Puja, Android, iOS, Google Play in Latin letters.
- Write Kundli, Lagna, Rashi, Nakshatra, Dasha, Panchang, Vastu, puja and other Sanskrit or Hindi terms the way ${LANG_NAMES[lang]} readers normally see them.
- Keep every number as ASCII digits, every URL, every markdown mark (**bold**, [link text](/blog/x) where only the link text is translated and the (/path) stays exactly, lists "- ", numbered "1. ", headings "## ", tables with the same "|" cells and rule rows) and every HTML or JSX tag exactly as in the source, with the same number of lines.
- Never write "AI" or "artificial intelligence".
- Never use em dashes or en dashes. Use commas or full stops; a range of numbers uses a hyphen.
- Plain, warm, natural language, like a careful human translator. Do not add or drop information.
Input is a list of blocks, each introduced by a line "<<<id>>>". Answer with the same blocks, each introduced by the same "<<<id>>>" line followed by its translation, and nothing else.`;

function parse(text, ids) {
  const out = {};
  const parts = text.split(/^<<<([^>\n]+)>>>[ \t]*\n/m);
  for (let i = 1; i < parts.length; i += 2) {
    const id = parts[i].trim();
    if (ids.includes(id)) out[id] = parts[i + 1].replace(/\s+$/, '');
  }
  return out;
}

async function ask(lang, batch, title) {
  const prompt = `Article: ${title}\n\n` + batch.map((u) => `<<<${u.id}>>>\n${u.text}${u.hint ? `\n(Previous attempt was rejected: ${u.hint}. Fix that.)` : ''}`).join('\n\n');
  for (let a = 0; a < 5; a++) {
    try {
      const r = await fetch(URL, {
        method: 'POST',
        headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'gpt-6-sol', system: SYSTEM(lang), prompt }),
        signal: AbortSignal.timeout(170000),
      });
      const t = await r.text();
      if (!r.ok) throw new Error(`${r.status} ${t.slice(0, 200)}`);
      const body = JSON.parse(t);
      return typeof body === 'string' ? body : body.answer ?? body.text ?? '';
    } catch (e) {
      console.error(lang, 'retry', a, String(e).slice(0, 120));
      await new Promise((r) => setTimeout(r, 5000 * (a + 1)));
    }
  }
  return '';
}

function batches(units) {
  const out = [];
  let cur = [], n = 0;
  for (const u of units) {
    if (cur.length && (n + u.text.length > MAX_CHARS || cur.length >= MAX_UNITS)) (out.push(cur), (cur = []), (n = 0));
    cur.push(u);
    n += u.text.length;
  }
  if (cur.length) out.push(cur);
  return out;
}

const stats = {};
async function job(lang, slug) {
  const units = JSON.parse(fs.readFileSync(`units/${slug}.json`, 'utf8'));
  const title = units.find((u) => u.id === 'fm.title')?.text ?? slug;
  const dir = `cache/${lang}`;
  fs.mkdirSync(dir, { recursive: true });
  const file = `${dir}/${slug}.json`;
  const done = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : {};
  const hints = {};
  for (let round = 0; round < 4; round++) {
    const todo = units.filter((u) => !(u.id in done)).map((u) => ({ ...u, hint: hints[u.id] }));
    if (!todo.length) break;
    for (const b of batches(todo)) {
      const text = await ask(lang, b, title);
      const got = parse(text, b.map((u) => u.id));
      for (const u of b) {
        const t = got[u.id] != null ? tidy(got[u.id]) : '';
        const why = t ? check(u.kind, lang, u.text, t) : 'missing';
        if (why) hints[u.id] = why;
        else done[u.id] = t;
      }
      fs.writeFileSync(file, JSON.stringify(done));
    }
  }
  const left = units.filter((u) => !(u.id in done)).map((u) => `${u.id}:${hints[u.id]}`);
  if (left.length) fs.appendFileSync('failures.log', `${lang} ${slug} ${left.join(' ')}\n`);
  stats[lang] = (stats[lang] ?? 0) + 1;
  console.log(new Date().toISOString().slice(11, 19), lang, slug, `${units.length - left.length}/${units.length}`, left.length ? 'FAILED ' + left.length : '');
}

const queue = [];
for (const slug of slugs) for (const lang of langs) queue.push([lang, slug]);
await Promise.all(
  Array.from({ length: WORKERS }, async () => {
    while (queue.length) {
      const [lang, slug] = queue.shift();
      await job(lang, slug);
    }
  }),
);
console.log('ALL DONE');
