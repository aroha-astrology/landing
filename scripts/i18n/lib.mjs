// Shared by the i18n scripts: finds every string the TranslationProvider
// would try to translate, by reading the prerendered HTML that `next build`
// leaves in .next/server/app and applying the provider's own skip rules.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { parse } from 'parse5';
import matter from 'gray-matter';
import { IGNORE, runtimeStrings } from './runtime-strings.mjs';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
export const I18N_DIR = path.join(ROOT, 'i18n');
const APP = path.join(ROOT, '.next/server/app');
const BLOG = path.join(ROOT, 'content/blog');

export const LANGUAGES = ['hi', 'bn', 'ta', 'te', 'mr', 'gu', 'kn', 'es', 'fr', 'de', 'pt', 'it', 'ru', 'ja'];

// Keep in step with SKIP_TAGS in src/components/providers/TranslationProvider.tsx.
const SKIP_TAGS = new Set(['script', 'style', 'noscript', 'code', 'pre', 'svg', 'textarea', 'input', 'template']);

// Pages in the order a translator should meet them. Article and legal pages
// are handled separately: only their shared chrome is translated.
const PAGES = [
  ['index.html', 'Home'],
  ['astrology.html', 'Aroha Astrology page'],
  ['vastu.html', 'Aroha Vastu page'],
  ['puja.html', 'Aroha Puja page'],
  ['kundli.html', 'Free Kundli page'],
  ['moon-sign.html', 'Moon sign page'],
  ['panchang.html', 'Panchang page'],
  ['about.html', 'About page'],
  ['support.html', 'Support page'],
  ['editorial-standards.html', 'Editorial standards page'],
  ['delete-account.html', 'Delete account page'],
  ['blog.html', 'Knowledge Hub'],
  ['blog/astrology.html', 'Knowledge Hub'],
  ['blog/vastu.html', 'Knowledge Hub'],
  ['blog/puja.html', 'Knowledge Hub'],
  ['_not-found.html', 'Page not found'],
];
const HUBS = new Set(['astrology', 'vastu', 'puja']);

export const SITE_WIDE = 'Site-wide (navigation, footer, shared buttons)';
export const ARTICLE_CHROME = 'Article pages (everything around the article text)';
export const RUNTIME = 'Shown after interaction (forms, results, planet cards)';

export function normalise(text) {
  return text.replace(/\s+/g, ' ').trim();
}

export function idFor(text) {
  return `t-${crypto.createHash('sha1').update(text).digest('hex').slice(0, 8)}`;
}

function looksTranslatable(text) {
  return text.length >= 2 && /[a-zA-Z]/.test(text);
}

function attr(node, name) {
  return node.attrs?.find((a) => a.name === name)?.value;
}

function hintFor(ancestors) {
  for (let i = ancestors.length - 1; i >= 0; i--) {
    const tag = ancestors[i];
    if (tag === 'button' || tag === 'a') return 'button or link';
    if (/^h[1-6]$/.test(tag)) return 'heading';
    if (tag === 'label') return 'form label';
    if (tag === 'option') return 'dropdown option';
  }
  return '';
}

// A string cut out of a longer sentence by a link or emphasis is hard to
// translate alone, so the export shows the sentence it belongs to.
const PROSE = new Set(['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'figcaption', 'blockquote', 'summary', 'label', 'dd', 'dt', 'td', 'span', 'em', 'strong']);
const hasLetters = (s) => /[a-zA-Z]/.test(s);

function textOf(node) {
  if (node.nodeName === '#text') return node.value;
  // <br> and element boundaries carry no space of their own.
  return (node.childNodes ?? []).map(textOf).reduce((a, b) => (/[\w.]$/.test(a) && /^\w/.test(b) ? `${a} ${b}` : a + b), '');
}

// The sentence is held by the nearest ancestor that has more text than this
// one piece. Cards and list rows are not sentences, so only prose elements
// count, or an element that mixes its own text with inline children.
function sentenceAround(node, text) {
  let el = node.parentNode;
  for (let depth = 0; el && depth < 3; depth++, el = el.parentNode) {
    const full = normalise(textOf(el));
    if (!hasLetters(full.replace(text, ''))) continue;
    const ownText = el.childNodes.some((c) => c !== node && c.nodeName === '#text' && hasLetters(c.value));
    return (PROSE.has(el.tagName) || ownText) && full.length <= 700 ? full : '';
  }
  return '';
}

/** Translatable strings in one HTML file, in document order: Map<text, { hint, context }>. */
function stringsIn(file, { skipIds = [] } = {}) {
  const out = new Map();
  const doc = parse(fs.readFileSync(file, 'utf8'));
  const walk = (node, ancestors) => {
    if (node.nodeName === '#text') {
      const text = normalise(node.value);
      if (looksTranslatable(text) && !IGNORE.some((re) => re.test(text)) && !out.has(text)) {
        out.set(text, { hint: hintFor(ancestors), context: sentenceAround(node, text) });
      }
      return;
    }
    if (node.tagName) {
      if (SKIP_TAGS.has(node.tagName)) return;
      if (attr(node, 'data-no-translate') !== undefined) return;
      if (attr(node, 'contenteditable') === 'true') return;
      if (skipIds.includes(attr(node, 'id'))) return;
    }
    const next = node.tagName ? [...ancestors, node.tagName] : ancestors;
    for (const child of node.childNodes ?? []) walk(child, next);
  };
  const html = doc.childNodes.find((n) => n.tagName === 'html');
  const body = html?.childNodes.find((n) => n.tagName === 'body');
  if (body) walk(body, []);
  return out;
}

/** Every string that comes from an article's frontmatter: titles, excerpts, FAQs, tags. These stay English. */
function articleStrings() {
  const out = new Set();
  const add = (v) => typeof v === 'string' && out.add(normalise(v));
  for (const f of fs.readdirSync(BLOG).filter((n) => n.endsWith('.mdx'))) {
    const { data, content } = matter(fs.readFileSync(path.join(BLOG, f), 'utf8'));
    for (const m of content.matchAll(/^#{2,4}\s+(.+)$/gm)) add(m[1]);
    for (const key of ['title', 'seoTitle', 'description', 'heroAlt', 'author', 'reviewedBy']) add(data[key]);
    for (const tag of data.tags ?? []) add(tag);
    for (const faq of data.faqs ?? []) (add(faq.question), add(faq.answer));
    for (const s of data.sources ?? []) (add(s.title), add(s.note));
  }
  return out;
}

/**
 * The full list, grouped for the translator.
 * Returns [{ id, text, hint, context, group }] with each string listed once.
 */
export async function extract() {
  if (!fs.existsSync(path.join(APP, 'index.html'))) {
    throw new Error('No build output found. Run `npm run build` first.');
  }
  const fromArticles = articleStrings();
  const keep = (text) => !fromArticles.has(text);

  const perPage = PAGES.filter(([file]) => fs.existsSync(path.join(APP, file))).map(([file, group]) => ({
    group,
    strings: stringsIn(path.join(APP, file)),
  }));

  // On every page means navigation, footer or another shared element.
  const everywhere = new Set([...perPage[0].strings.keys()].filter((text) => perPage.every((p) => p.strings.has(text))));

  const entries = new Map();
  const add = (text, { hint = '', context = '' }, group) => {
    if (!keep(text) || entries.has(text)) return;
    entries.set(text, { id: idFor(text), text, hint, context, group });
  };

  for (const text of everywhere) add(text, perPage[0].strings.get(text), SITE_WIDE);
  for (const { group, strings } of perPage) for (const [text, info] of strings) add(text, info, group);

  // Article and tag pages: a string is chrome when several pages share it.
  const blogDir = path.join(APP, 'blog');
  const articleFiles = fs
    .readdirSync(blogDir)
    .filter((n) => n.endsWith('.html') && !HUBS.has(n.replace(/\.html$/, '')))
    .map((n) => path.join(blogDir, n));
  const tagDir = path.join(blogDir, 'tag');
  const tagFiles = fs.existsSync(tagDir) ? fs.readdirSync(tagDir).filter((n) => n.endsWith('.html')).map((n) => path.join(tagDir, n)) : [];
  for (const files of [articleFiles, tagFiles]) {
    const seen = new Map();
    for (const file of files) {
      for (const [text, info] of stringsIn(file, { skipIds: ['article-body'] })) {
        const hit = seen.get(text) ?? { count: 0, info };
        hit.count += 1;
        seen.set(text, hit);
      }
    }
    for (const [text, { count, info }] of seen) if (count >= 3) add(text, info, ARTICLE_CHROME);
  }

  for (const { text, hint } of await runtimeStrings(ROOT)) add(normalise(text), { hint }, RUNTIME);

  const ids = new Map();
  for (const e of entries.values()) {
    if (ids.has(e.id)) throw new Error(`Id clash between "${ids.get(e.id)}" and "${e.text}"`);
    ids.set(e.id, e.text);
  }
  return [...entries.values()];
}

/** Reads en.md or a translated copy: Map<id, text>. */
export function readStringsFile(file) {
  const out = new Map();
  let id = null;
  let lines = [];
  const flush = () => {
    if (id) out.set(id, normalise(lines.join(' ')));
    lines = [];
  };
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^##\s+(t-[0-9a-f]{8})\b/);
    if (m) {
      flush();
      id = m[1];
    } else if (/^#\s/.test(line) || /^---\s*$/.test(line)) {
      flush();
      id = null;
    } else if (id && !/^<!--.*-->\s*$/.test(line)) {
      lines.push(line);
    }
  }
  flush();
  return out;
}
