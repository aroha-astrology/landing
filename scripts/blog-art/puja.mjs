// Puja motifs: ivory and firelight. Ritual objects are drawn plainly and
// respectfully — no deity figures, no sacred syllables used as decoration.
import { C, CX, CY, W, H, f, rng, polar, el, g, circle, line, rect, path, poly, polyline, marigold, garland, leaf, diya } from './lib.mjs';

const brass = (id) => `<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#F3D48A"/><stop offset="50%" stop-color="${C.brass}"/><stop offset="100%" stop-color="#7C5418"/></linearGradient>`;
const outline = (o = {}) => ({ stroke: '#6B4418', 'stroke-width': 1.6, fill: 'none', ...o });

/** Top-down puja thali with the everyday items arranged on it. */
function thali(cx, cy, R, seed = 5) {
  const r = rng(seed);
  const out = [brass('thaliG')];
  out.push(circle(cx + 10, cy + 16, R, { fill: '#3A2418', opacity: '0.16', filter: 'url(#softglow)' }));
  out.push(circle(cx, cy, R, { fill: 'url(#thaliG)' }));
  out.push(circle(cx, cy, R * 0.9, outline({ opacity: '0.55' })));
  for (let i = 0; i < 48; i++) {
    const [x, y] = polar(cx, cy, R * 0.95, i * 7.5);
    out.push(circle(x, y, 2, { fill: '#7C5418', opacity: '0.5' }));
  }
  // Kumkum, haldi, chandan bowls.
  const bowl = (x, y, col) => [circle(x, y, R * 0.14, { fill: 'url(#thaliG)', stroke: '#6B4418', 'stroke-width': 1.2 }), circle(x, y, R * 0.1, { fill: col })];
  out.push(...bowl(...polar(cx, cy, R * 0.55, 200), C.kumkum));
  out.push(...bowl(...polar(cx, cy, R * 0.55, 245), '#E8B23A'));
  out.push(...bowl(...polar(cx, cy, R * 0.55, 290), '#E9D2B0'));
  // Akshata (rice).
  const [ax, ay] = polar(cx, cy, R * 0.52, 110);
  for (let i = 0; i < 70; i++) {
    const [x, y] = polar(ax, ay, r() * R * 0.13, r() * 360);
    out.push(el('ellipse', { cx: f(x), cy: f(y), rx: 3.4, ry: 1.6, fill: '#FFF9EC', transform: `rotate(${f(r() * 180)} ${f(x)} ${f(y)})` }));
  }
  // Flowers and a betel leaf.
  out.push(marigold(...polar(cx, cy, R * 0.55, 20), R * 0.12, seed + 1));
  out.push(marigold(...polar(cx, cy, R * 0.6, 55), R * 0.1, seed + 2));
  out.push(leaf(...polar(cx, cy, R * 0.3, 160), R * 0.32, 135, '#6F8E42'));
  out.push(circle(...polar(cx, cy, R * 0.3, 160), R * 0.05, { fill: '#8C5A3A' }));
  // Small diya at the centre, seen from above.
  out.push(el('ellipse', { cx: f(cx), cy: f(cy), rx: R * 0.16, ry: R * 0.13, fill: '#A0522D' }));
  out.push(circle(cx, cy, R * 0.07, { fill: '#F9D27A' }));
  out.push(circle(cx, cy, R * 0.22, { fill: C.marigold, opacity: '0.45', filter: 'url(#softglow)' }));
  out.push(circle(cx, cy, R * 0.04, { fill: '#FFF6D6' }));
  return g({}, out);
}

/** A kalash with five mango leaves and a coconut — the Purna Kumbha. */
function kalash(cx, baseY, s = 1) {
  const out = [brass('kalashG')];
  const body = `M${f(cx - 70 * s)},${f(baseY - 20 * s)} C${f(cx - 150 * s)},${f(baseY - 110 * s)} ${f(cx - 120 * s)},${f(baseY - 230 * s)} ${f(cx - 48 * s)},${f(baseY - 250 * s)} L${f(cx - 58 * s)},${f(baseY - 290 * s)} L${f(cx + 58 * s)},${f(baseY - 290 * s)} L${f(cx + 48 * s)},${f(baseY - 250 * s)} C${f(cx + 120 * s)},${f(baseY - 230 * s)} ${f(cx + 150 * s)},${f(baseY - 110 * s)} ${f(cx + 70 * s)},${f(baseY - 20 * s)} Z`;
  out.push(el('ellipse', { cx: f(cx), cy: f(baseY), rx: f(110 * s), ry: f(18 * s), fill: '#3A2418', opacity: '0.18', filter: 'url(#softglow)' }));
  out.push(rect(cx - 60 * s, baseY - 24 * s, 120 * s, 24 * s, { fill: 'url(#kalashG)', rx: 6 * s }));
  out.push(path(body, { fill: 'url(#kalashG)', stroke: '#6B4418', 'stroke-width': 1.4 }));
  // Mauli thread and a band of kumkum dots.
  out.push(path(`M${f(cx - 118 * s)},${f(baseY - 150 * s)} Q${f(cx)},${f(baseY - 120 * s)} ${f(cx + 118 * s)},${f(baseY - 150 * s)}`, { stroke: C.kumkum, 'stroke-width': 5 * s, fill: 'none' }));
  out.push(path(`M${f(cx - 118 * s)},${f(baseY - 140 * s)} Q${f(cx)},${f(baseY - 110 * s)} ${f(cx + 118 * s)},${f(baseY - 140 * s)}`, { stroke: '#E8B23A', 'stroke-width': 3 * s, fill: 'none' }));
  for (let i = -2; i <= 2; i++) out.push(circle(cx + i * 30 * s, baseY - 190 * s, 5 * s, { fill: C.kumkum }));
  for (const a of [-70, -38, 0, 38, 70]) out.push(leaf(cx + a * 0.6 * s, baseY - 286 * s, 120 * s, a, '#5E7A3A'));
  // Coconut with a red cloth.
  out.push(el('ellipse', { cx: f(cx), cy: f(baseY - 340 * s), rx: f(52 * s), ry: f(62 * s), fill: '#8C5A2E' }));
  out.push(path(`M${f(cx - 50 * s)},${f(baseY - 320 * s)} Q${f(cx)},${f(baseY - 420 * s)} ${f(cx + 50 * s)},${f(baseY - 320 * s)} Q${f(cx)},${f(baseY - 296 * s)} ${f(cx - 50 * s)},${f(baseY - 320 * s)} Z`, { fill: C.kumkum }));
  out.push(path(`M${f(cx - 8 * s)},${f(baseY - 398 * s)} q8,-26 18,-30`, { stroke: '#6B4418', 'stroke-width': 3 * s, fill: 'none' }));
  return g({}, out);
}

/** An arched doorway with a marigold toran. */
function doorway(cx, cy, w, h, { open = true, glow = true } = {}) {
  const x = cx - w / 2, y = cy - h / 2;
  const out = [];
  out.push(rect(x - 70, y - 80, w + 140, h + 80, { fill: '#EADBC2', stroke: '#6B4418', 'stroke-width': 1.2 }));
  if (glow) out.push(circle(cx, cy + h * 0.1, w * 0.8, { fill: '#FFD58A', opacity: '0.5', filter: 'url(#blur40)' }));
  out.push(path(`M${x},${y + h} L${x},${y + 110} Q${cx},${y - 30} ${x + w},${y + 110} L${x + w},${y + h} Z`, { fill: open ? '#FFEFC9' : '#8C5A3A' }));
  out.push(path(`M${x},${y + h} L${x},${y + 110} Q${cx},${y - 30} ${x + w},${y + 110} L${x + w},${y + h}`, { stroke: '#6B4418', 'stroke-width': 5, fill: 'none' }));
  out.push(garland(x - 20, y + 60, x + w + 20, y + 60, 60, 16, 21, 15));
  for (let i = 0; i < 7; i++) {
    const t = (i + 0.5) / 7;
    out.push(leaf(x + t * w, y + 76 + 60 * 4 * t * (1 - t), 46, 180, '#5E7A3A'));
  }
  out.push(rect(x - 30, y + h, w + 60, 16, { fill: '#B79C76', stroke: '#6B4418', 'stroke-width': 1.2 }));
  return g({}, out);
}

const MOTIFS = {
  diya: () => {
    const out = [];
    out.push(diya(CX - 90, CY + 170, 2.1));
    for (let i = 0; i < 5; i++) out.push(marigold(CX - 420 + i * 30 + (i % 2) * 20, CY + 250 - (i % 2) * 28, 30, 40 + i));
    for (let i = 0; i < 4; i++) out.push(marigold(CX + 360 + i * 36, CY + 240 - (i % 2) * 30, 28, 60 + i));
    return out;
  },

  thali: ({ seed }) => [thali(CX, CY, 330, seed)],

  'kalash-door': () => [doorway(CX + 220, CY + 60, 360, 620), kalash(CX - 280, CY + 330, 1.15)],

  /** Havan kund (stepped fire altar) with flames — Vastu Shanti. */
  havan: () => {
    const out = [];
    const cx = CX, by = CY + 240;
    for (let k = 0; k < 3; k++) {
      const w = 520 - k * 90, hh = 46;
      const y = by - k * hh;
      out.push(poly([[cx - w / 2, y], [cx + w / 2, y], [cx + w / 2 - 30, y - hh], [cx - w / 2 + 30, y - hh]], { fill: k % 2 ? '#B0673F' : '#9A5433', stroke: '#5A2E18', 'stroke-width': 1.4 }));
    }
    const top = by - 3 * 46;
    out.push(circle(cx, top - 120, 260, { fill: C.saffron, opacity: '0.45', filter: 'url(#blur40)' }));
    const flame = (x, h, w, col) => path(`M${f(x - w)},${f(top)} C${f(x - w * 1.1)},${f(top - h * 0.5)} ${f(x - w * 0.2)},${f(top - h * 0.7)} ${f(x)},${f(top - h)} C${f(x + w * 0.3)},${f(top - h * 0.6)} ${f(x + w * 1.2)},${f(top - h * 0.45)} ${f(x + w)},${f(top)} Z`, { fill: col });
    out.push(flame(cx - 60, 200, 70, C.saffron), flame(cx + 70, 230, 80, C.saffron), flame(cx, 290, 100, "#EE8A2A"));
    out.push(flame(cx - 40, 150, 45, C.marigold), flame(cx + 50, 170, 50, C.marigold), flame(cx, 210, 60, '#FFD58A'));
    out.push(flame(cx, 120, 30, '#FFF3C8'));
    // Samidha sticks.
    for (let i = -3; i <= 3; i++) out.push(line(cx + i * 40 - 30, top + 4, cx + i * 40 + 30, top - 30, { stroke: '#5A2E18', 'stroke-width': 7, 'stroke-linecap': 'round' }));
    const r = rng(9);
    for (let i = 0; i < 26; i++) {
      const [x, y] = [cx + (r() - 0.5) * 500, top - 200 - r() * 300];
      out.push(circle(x, y, 1.5 + r() * 2.5, { fill: '#FFD58A', opacity: f(0.4 + r() * 0.5) }));
    }
    return out;
  },

  /** A new car garlanded for Vahan Puja, lemons at the wheels. */
  vehicle: () => {
    const out = [];
    const bx = CX - 430, by = CY + 170;
    out.push(el('ellipse', { cx: CX, cy: by + 70, rx: 520, ry: 28, fill: '#3A2418', opacity: '0.14', filter: 'url(#softglow)' }));
    out.push(`<linearGradient id="carG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#FFFFFF"/><stop offset="100%" stop-color="#E6DCCB"/></linearGradient>`);
    const body = `M${bx},${by} L${bx},${by - 70} Q${bx + 10},${by - 110} ${bx + 90},${by - 118} L${bx + 250},${by - 130} Q${bx + 330},${by - 250} ${bx + 470},${by - 256} L${bx + 610},${by - 256} Q${bx + 700},${by - 250} ${bx + 760},${by - 140} L${bx + 820},${by - 128} Q${bx + 870},${by - 110} ${bx + 870},${by - 50} L${bx + 870},${by} Z`;
    out.push(path(body, { fill: 'url(#carG)', stroke: '#6B4418', 'stroke-width': 2 }));
    out.push(path(`M${bx + 280},${by - 132} Q${bx + 350},${by - 232} ${bx + 470},${by - 236} L${bx + 530},${by - 236} L${bx + 530},${by - 132} Z`, { fill: '#C9D6D8', stroke: '#6B4418', 'stroke-width': 1.4 }));
    out.push(path(`M${bx + 550},${by - 236} L${bx + 610},${by - 236} Q${bx + 680},${by - 230} ${bx + 730},${by - 132} L${bx + 550},${by - 132} Z`, { fill: '#C9D6D8', stroke: '#6B4418', 'stroke-width': 1.4 }));
    for (const wx of [bx + 170, bx + 700]) {
      out.push(circle(wx, by, 70, { fill: '#2A2420' }), circle(wx, by, 36, { fill: '#9A9088' }), circle(wx, by, 10, { fill: '#2A2420' }));
      out.push(el('ellipse', { cx: wx - 70, cy: by + 58, rx: 22, ry: 16, fill: '#D8E04A', stroke: '#7A8420', 'stroke-width': 1.2 }));
    }
    // Garland across the bonnet and a kumkum mark.
    out.push(garland(bx + 770, by - 132, bx + 870, by - 70, 50, 7, 31, 13));
    out.push(garland(bx + 240, by - 140, bx + 760, by - 140, 70, 18, 41, 12));
    out.push(circle(bx + 820, by - 96, 7, { fill: C.kumkum }));
    out.push(path(`M${bx + 900},${by - 30} q40,-26 80,-10`, { stroke: C.kumkum, 'stroke-width': 3, fill: 'none', opacity: '0.6' }));
    return out;
  },

  /** Life milestones: lamps rising along a gentle timeline. */
  milestones: () => {
    const out = [];
    const pts = Array.from({ length: 6 }, (_, i) => [220 + i * 232, CY + 190 - i * 58]);
    out.push(polyline(pts.map(([x, y]) => [x, y + 30]), { stroke: C.brass, 'stroke-width': 2, 'stroke-dasharray': '2 8', 'stroke-linecap': 'round' }));
    pts.forEach(([x, y], i) => out.push(diya(x - 50, y + 20, 0.55 + i * 0.07)));
    for (let i = 0; i < 12; i++) out.push(marigold(140 + i * 120, 120 + (i % 2) * 24, 12, 70 + i));
    out.push(path(`M80,120 ${Array.from({ length: 12 }, (_, i) => `L${140 + i * 120},${120 + (i % 2) * 24}`).join(' ')}`, { stroke: '#6F8E42', 'stroke-width': 1.4, fill: 'none', opacity: '0.6' }));
    return out;
  },

  /** Aarti: a five-wick lamp and the circular path it is waved in. */
  aarti: () => {
    const out = [brass('aartiG')];
    const cx = CX, cy = CY + 40;
    for (let k = 0; k < 3; k++) out.push(el('ellipse', { cx: f(cx), cy: f(cy - 60), rx: f(300 + k * 60), ry: f(150 + k * 30), fill: 'none', stroke: C.marigold, 'stroke-width': 2.4 - k * 0.6, opacity: f(0.7 - k * 0.2), 'stroke-dasharray': k ? '2 12' : undefined, 'stroke-linecap': 'round' }));
    out.push(rect(cx - 9, cy + 20, 18, 230, { fill: 'url(#aartiG)', rx: 9 }));
    out.push(el('ellipse', { cx: f(cx), cy: f(cy + 250), rx: 70, ry: 16, fill: 'url(#aartiG)' }));
    out.push(el('ellipse', { cx: f(cx), cy: f(cy), rx: 150, ry: 42, fill: 'url(#aartiG)', stroke: '#6B4418', 'stroke-width': 1.4 }));
    out.push(circle(cx, cy - 90, 200, { fill: C.marigold, opacity: '0.4', filter: 'url(#blur40)' }));
    for (let i = 0; i < 5; i++) {
      const x = cx - 100 + i * 50, y = cy - 10 - (i % 2) * 12;
      out.push(path(`M${x - 12},${y} C${x - 14},${y - 30} ${x - 2},${y - 50} ${x},${y - 70} C${x + 4},${y - 50} ${x + 16},${y - 30} ${x + 12},${y} Z`, { fill: C.saffron }));
      out.push(path(`M${x - 6},${y - 4} C${x - 6},${y - 22} ${x},${y - 34} ${x},${y - 44} C${x + 2},${y - 34} ${x + 8},${y - 22} ${x + 6},${y - 4} Z`, { fill: '#FFE7A8' }));
    }
    return out;
  },

  /** Flat-lay of samagri on cloth. */
  samagri: ({ seed }) => {
    const r = rng(seed);
    const out = [brass('samG')];
    out.push(rect(140, 110, W - 280, H - 220, { fill: '#B8412E', opacity: '0.9', rx: 6 }));
    out.push(rect(160, 130, W - 320, H - 260, { fill: 'none', stroke: '#F2C46B', 'stroke-width': 3, 'stroke-dasharray': '10 6' }));
    const bowl = (x, y, R, col) => [circle(x + 6, y + 8, R, { fill: '#3A2418', opacity: '0.2', filter: 'url(#softglow)' }), circle(x, y, R, { fill: 'url(#samG)' }), circle(x, y, R * 0.76, { fill: col })];
    out.push(...bowl(360, 300, 70, C.kumkum), ...bowl(540, 270, 62, '#E8B23A'), ...bowl(700, 310, 58, '#EFE2C8'));
    // Rice heap.
    for (let i = 0; i < 160; i++) {
      const [x, y] = polar(420, 560, r() * 90, r() * 360);
      out.push(el('ellipse', { cx: f(x), cy: f(y), rx: 4, ry: 2, fill: '#FFF9EC', transform: `rotate(${f(r() * 180)} ${f(x)} ${f(y)})` }));
    }
    // Coconut, betel leaves with supari, camphor, incense.
    out.push(circle(1000, 300, 86, { fill: '#8C5A2E' }), circle(985, 285, 70, { fill: '#9E6A38', opacity: '0.6' }));
    out.push(leaf(760, 620, 150, 60, '#6F8E42'), leaf(790, 640, 150, 100, '#5E7A3A'));
    out.push(circle(840, 600, 14, { fill: '#8C5A3A' }), circle(870, 620, 12, { fill: '#8C5A3A' }));
    for (let i = 0; i < 5; i++) out.push(rect(620 + i * 26, 470 + (i % 2) * 8, 22, 22, { fill: '#FFFFFF', opacity: '0.95', rx: 4, transform: `rotate(${i * 11} ${631 + i * 26} ${481})` }));
    for (let i = 0; i < 6; i++) out.push(line(1080 + i * 14, 520, 1240 + i * 10, 700, { stroke: '#4A2A18', 'stroke-width': 3.2, 'stroke-linecap': 'round' }));
    out.push(diya(1140, 330, 0.7));
    out.push(marigold(1260, 560, 34, 80), marigold(1320, 630, 26, 81), marigold(1200, 640, 22, 82));
    // Mauli thread.
    out.push(path('M230,720 C400,660 520,780 700,700 S980,640 1080,720', { stroke: C.kumkum, 'stroke-width': 4, fill: 'none' }));
    out.push(path('M230,728 C400,668 520,788 700,708 S980,648 1080,728', { stroke: '#F2C46B', 'stroke-width': 2, fill: 'none' }));
    return out;
  },

  /** A home's open door, warm light, a thali waiting at the threshold. */
  doorway: () => [doorway(CX, CY + 20, 380, 640), thali(CX + 420, CY + 250, 120, 12), marigold(CX - 380, CY + 300, 40, 90), marigold(CX - 320, CY + 330, 28, 91)],

  /** A shopfront opening: shutter up, toran, two diyas at the step. */
  storefront: () => {
    const out = [];
    const x = CX - 420, y = CY - 250, w = 840, h = 520;
    out.push(rect(x - 30, y - 110, w + 60, 110, { fill: '#8C5A3A', stroke: '#5A2E18', 'stroke-width': 1.4 }));
    out.push(rect(x + 120, y - 86, w - 240, 62, { fill: '#F3E4CC', stroke: '#5A2E18', 'stroke-width': 1.2, rx: 4 }));
    out.push(rect(x, y, w, h, { fill: '#EADBC2', stroke: '#5A2E18', 'stroke-width': 1.6 }));
    out.push(rect(x + 40, y + 40, w - 80, h - 40, { fill: '#FFEFC9' }));
    out.push(circle(CX, CY + 60, 320, { fill: '#FFD58A', opacity: '0.45', filter: 'url(#blur40)' }));
    for (let i = 0; i < 6; i++) out.push(line(x + 40, y + 40 + i * 12, x + w - 40, y + 40 + i * 12, { stroke: '#8C7A66', 'stroke-width': 3 }));
    for (let i = 0; i < 3; i++) out.push(rect(x + 90 + i * 240, y + 190, 180, 150, { fill: 'none', stroke: '#8C5A3A', 'stroke-width': 1.4 }));
    out.push(garland(x + 20, y + 60, x + w - 20, y + 60, 50, 24, 51, 14));
    out.push(rect(x - 60, y + h, w + 120, 22, { fill: '#B79C76', stroke: '#5A2E18', 'stroke-width': 1.2 }));
    out.push(diya(x + 120, y + h - 6, 0.7), diya(x + w - 240, y + h - 6, 0.7));
    return out;
  },
};

export const PUJA_DARK = new Set(['diya', 'havan', 'aarti']);

export function drawPuja(motif, opts) {
  const fn = MOTIFS[motif];
  if (!fn) throw new Error(`Unknown puja motif "${motif}"`);
  return [].concat(fn(opts));
}

export const PUJA_MOTIFS = Object.keys(MOTIFS);
