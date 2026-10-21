// Shared by the translator (runs on the server) and the builder: checks one translated unit.
export const LANG_NAMES = { hi: 'Hindi', bn: 'Bengali', ta: 'Tamil', te: 'Telugu', mr: 'Marathi', gu: 'Gujarati', kn: 'Kannada', es: 'Spanish', fr: 'French', de: 'German', pt: 'Portuguese', it: 'Italian', ru: 'Russian', ja: 'Japanese' };

const SCRIPT = {
  hi: /[ऀ-ॿ]/g, mr: /[ऀ-ॿ]/g, bn: /[ঀ-৿]/g, ta: /[஀-௿]/g, te: /[ఀ-౿]/g,
  gu: /[઀-૿]/g, kn: /[ಀ-೿]/g, ru: /[Ѐ-ӿ]/g, ja: /[぀-ヿ一-鿿]/g,
};

/** Dashes become commas (or a hyphen between numbers); returns the cleaned text. */
export function tidy(text) {
  return text
    .replace(/(\d)\s*[–—]\s*(\d)/g, '$1-$2')
    .replace(/\s*[–—]\s*/g, ', ')
    .replace(/,\s*,/g, ',')
    .replace(/\r/g, '')
    .trim();
}

const links = (s) => [...s.matchAll(/\]\(([^)]*)\)/g)].map((m) => m[1]).sort().join('|');
const tags = (s) => (s.match(/<\/?[A-Za-z][^>]*>/g) ?? []).join('|');
const digits = (s) => (s.replace(/<[^>]*>/g, '').replace(/\]\([^)]*\)/g, ']()').match(/\d+/g) ?? []).sort().join(',');
const marker = (l) => (/^\s*(#{1,6} |[-*] |\d+\. |> |\|)/.exec(l) ?? [''])[0].trim();

export function check(kind, lang, src, out) {
  if (!out || !out.trim()) return 'empty';
  if (/\b(AI|A\.I\.)\b/.test(out) && !/\bAI\b/.test(src)) return 'mentions AI';
  if (/[–—]/.test(out)) return 'dash';
  if (digits(src) && digits(src) !== digits(out)) return 'digits';
  if (kind === 'md') {
    if (links(src) !== links(out)) return 'links';
    if (tags(src) !== tags(out)) return 'tags';
    const a = src.trim().split('\n'), b = out.trim().split('\n');
    if (a.length !== b.length) return 'lines';
    for (let i = 0; i < a.length; i++) {
      if (marker(a[i]) !== marker(b[i])) return 'marker line ' + i;
      if (/^\s*\|[\s:|-]+\|?\s*$/.test(a[i]) && a[i].trim() !== b[i].trim()) return 'table rule';
      if (a[i].includes('|') && (a[i].match(/\|/g) ?? []).length !== (b[i].match(/\|/g) ?? []).length) return 'table cells';
    }
    if ((src.match(/\*\*/g) ?? []).length !== (out.match(/\*\*/g) ?? []).length) return 'bold';
    if ((src.match(/`/g) ?? []).length !== (out.match(/`/g) ?? []).length) return 'backticks';
  }
  const letters = (out.replace(/<[^>]*>/g, '').replace(/\]\([^)]*\)/g, ']').match(/\p{L}/gu) ?? []).length;
  if (SCRIPT[lang] && letters >= 25) {
    const hit = (out.replace(/<[^>]*>/g, '').match(SCRIPT[lang]) ?? []).length;
    if (hit / letters < 0.3) return 'script';
  }
  if (src.length > 40 && src.trim() === out.trim()) return 'unchanged';
  return null;
}
