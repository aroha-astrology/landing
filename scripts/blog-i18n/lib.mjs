// Splits a blog post into translatable units and puts translations back. Deterministic: ids depend only on the source file.
import matter from 'gray-matter';

const FM_STRINGS = ['title', 'seoTitle', 'description', 'heroAlt'];

function literals(block) {
  const spans = [];
  for (const m of block.matchAll(/\b(title|caption|alt)="([^"]*)"/g)) {
    const start = m.index + m[0].indexOf('"') + 1;
    spans.push({ start, end: start + m[2].length, text: m[2], quote: '"' });
  }
  for (const key of ['items', 'steps']) {
    const at = block.indexOf(`${key}={[`);
    if (at < 0) continue;
    const to = block.indexOf(']}', at);
    const region = block.slice(at, to);
    for (const m of region.matchAll(/'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)"/g)) {
      const q = m[1] !== undefined ? "'" : '"';
      const raw = m[1] ?? m[2];
      const start = at + m.index + 1;
      spans.push({ start, end: start + raw.length, text: raw.replace(/\\(.)/g, '$1'), quote: q });
    }
  }
  return spans.sort((a, b) => a.start - b.start).filter((s) => /\p{L}/u.test(s.text));
}

const hasText = (b) => /\p{L}/u.test(b.replace(/<[^>]*>/g, ''));
const isJsx = (b) => /^<[A-Z]\w*[\s\S]*\/>\s*$/.test(b.trim()) && !/^<[A-Z]\w*>/.test(b);

export function extract(raw) {
  const { data, content } = matter(raw.split(String.fromCharCode(13)).join(""));
  const units = [];
  for (const k of FM_STRINGS) if (typeof data[k] === 'string') units.push({ id: 'fm.' + k, kind: 'plain', text: data[k] });
  (data.faqs ?? []).forEach((f, i) => {
    units.push({ id: `fm.faq${i}q`, kind: 'plain', text: f.question });
    units.push({ id: `fm.faq${i}a`, kind: 'plain', text: f.answer });
  });
  const blocks = content.split(/\n{2,}/);
  blocks.forEach((b, i) => {
    if (isJsx(b)) literals(b).forEach((s, j) => units.push({ id: `b${i}.${j}`, kind: 'plain', text: s.text }));
    else if (hasText(b)) units.push({ id: `b${i}`, kind: 'md', text: b });
  });
  return { data, blocks, units };
}

const esc = (s, q) => {
  const t = s.replace(/\\/g, '\\\\').replace(/\n/g, ' ');
  return q === '"' ? t.replace(/"/g, '”') : t.replace(/'/g, "\\'");
};

function plainDates(v) {
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  if (Array.isArray(v)) return v.map(plainDates);
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, plainDates(x)]));
  return v;
}

export function rebuild(raw, tr) {
  raw = raw.split(String.fromCharCode(13)).join("");
  const { data, blocks } = extract(raw);
  const d = plainDates(data);
  for (const k of FM_STRINGS) if (tr['fm.' + k] != null) d[k] = tr['fm.' + k];
  (d.faqs ?? []).forEach((f, i) => {
    if (tr[`fm.faq${i}q`] != null) f.question = tr[`fm.faq${i}q`];
    if (tr[`fm.faq${i}a`] != null) f.answer = tr[`fm.faq${i}a`];
  });
  const out = blocks.map((b, i) => {
    if (isJsx(b)) {
      let r = b;
      const sp = literals(b);
      for (let j = sp.length - 1; j >= 0; j--) {
        const t = tr[`b${i}.${j}`];
        if (t == null) continue;
        r = r.slice(0, sp[j].start) + esc(t, sp[j].quote) + r.slice(sp[j].end);
      }
      return r;
    }
    return tr[`b${i}`] ?? b;
  });
  return matter.stringify(out.join('\n\n').replace(/^\n+/, ''), d, { lineWidth: -1 });
}
