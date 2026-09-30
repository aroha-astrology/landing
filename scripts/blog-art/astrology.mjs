// Astrology motifs: midnight sky, gold linework. Each motif draws the
// article's actual subject (the 27-fold ring for Nakshatras, the 120-year
// proportions for Vimshottari, the diamond chart for Kundli), not a
// generic "space" picture.
import {
  C, CX, CY, W, H, f, rng, polar, el, g, circle, line, rect, path, poly, polyline,
  arcD, sectorD, ticks,
} from './lib.mjs';

const gold = (o = {}) => ({ stroke: C.gold, fill: 'none', 'stroke-width': 1.6, ...o });
const faint = (o = {}) => ({ stroke: C.goldSoft, fill: 'none', 'stroke-width': 1, opacity: '0.35', ...o });

/** A glowing planet sphere with a soft terminator. */
function planet(cx, cy, r, color = C.goldSoft, { ring = false, id = 'p' } = {}) {
  const gid = `pl${id}${Math.round(cx)}${Math.round(cy)}`;
  return g({}, [
    `<radialGradient id="${gid}" cx="35%" cy="35%" r="70%"><stop offset="0%" stop-color="#FFF6DD"/><stop offset="45%" stop-color="${color}"/><stop offset="100%" stop-color="#2A2440"/></radialGradient>`,
    circle(cx, cy, r * 2.6, { fill: color, opacity: '0.18', filter: 'url(#softglow)' }),
    circle(cx, cy, r, { fill: `url(#${gid})` }),
    ring ? el('ellipse', { cx: f(cx), cy: f(cy), rx: f(r * 2.1), ry: f(r * 0.55), ...gold({ 'stroke-width': 1.4, opacity: '0.8' }), transform: `rotate(-18 ${f(cx)} ${f(cy)})` }) : '',
  ]);
}

const PLANET_COLORS = {
  sun: '#F2B54A', moon: '#E8E4D8', mars: '#D0643C', mercury: '#9FC08A', jupiter: '#E3B866',
  venus: '#F1E6CF', saturn: '#8E9BC4', rahu: '#6D7291', ketu: '#A88B6C',
};

/** Zodiac wheel: 12 sectors, degree ticks, optional highlighted sign. */
function zodiacRing(cx, cy, r, { highlight = [], width = 60, offset = 0, opacity = 1 } = {}) {
  const out = [];
  for (const i of highlight) out.push(path(sectorD(cx, cy, r - width, r, offset + i * 30, offset + (i + 1) * 30), { fill: C.gold, opacity: '0.16' }));
  out.push(circle(cx, cy, r, gold()));
  out.push(circle(cx, cy, r - width, gold({ 'stroke-width': 1.2 })));
  out.push(ticks(cx, cy, r - width, r, 12, gold({ 'stroke-width': 1.2 }), offset));
  out.push(ticks(cx, cy, r - 10, r, 72, faint({ opacity: '0.5' }), offset));
  out.push(ticks(cx, cy, r - 5, r, 360, faint({ opacity: '0.25', 'stroke-width': 0.6 }), offset));
  // Sign markers: a small diamond in each sector's middle.
  for (let i = 0; i < 12; i++) {
    const [x, y] = polar(cx, cy, r - width / 2, offset + i * 30 + 15);
    const hi = highlight.includes(i);
    out.push(poly([[x, y - 7], [x + 5, y], [x, y + 7], [x - 5, y]], { fill: hi ? C.goldSoft : 'none', stroke: C.gold, 'stroke-width': 1, opacity: hi ? '1' : '0.7' }));
  }
  return g({ opacity: f(opacity) }, out);
}

/** 27-fold ring with 108 pada ticks. */
function nakshatraRing(cx, cy, r, { highlight = [], width = 44 } = {}) {
  const span = 360 / 27;
  const out = [];
  for (const i of highlight) out.push(path(sectorD(cx, cy, r - width, r, i * span, (i + 1) * span), { fill: C.gold, opacity: '0.28' }));
  out.push(circle(cx, cy, r, gold()));
  out.push(circle(cx, cy, r - width, gold({ 'stroke-width': 1.1 })));
  out.push(ticks(cx, cy, r - width, r, 27, gold({ 'stroke-width': 1.1 })));
  out.push(ticks(cx, cy, r - 9, r, 108, faint({ opacity: '0.55' })));
  for (let i = 0; i < 27; i++) {
    const [x, y] = polar(cx, cy, r - width / 2, i * span + span / 2);
    out.push(circle(x, y, highlight.includes(i) ? 4 : 2, { fill: highlight.includes(i) ? C.starlight : C.goldSoft, opacity: highlight.includes(i) ? '1' : '0.6' }));
  }
  return g({}, out);
}

/** North Indian (diamond) chart: square, both diagonals and the inner diamond. */
function northChart(cx, cy, s, { houses = [], planets = true, seed = 1, path: readingPath = false, connect = null } = {}) {
  const x0 = cx - s / 2, y0 = cy - s / 2, x1 = cx + s / 2, y1 = cy + s / 2;
  const mid = (a, b) => (a + b) / 2;
  const T = [mid(x0, x1), y0], R = [x1, mid(y0, y1)], B = [mid(x0, x1), y1], L = [x0, mid(y0, y1)];
  // House polygons, house 1 at top centre, counting anticlockwise.
  const c = [cx, cy];
  const q = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const TL = [x0, y0], TR = [x1, y0], BR = [x1, y1], BL = [x0, y1];
  const mTL = q(TL, c), mTR = q(TR, c), mBR = q(BR, c), mBL = q(BL, c);
  const H = {
    1: [T, mTR, c, mTL], 2: [TL, T, mTL], 3: [TL, mTL, L], 4: [L, mTL, c, mBL], 5: [L, mBL, BL],
    6: [BL, mBL, B], 7: [B, mBL, c, mBR], 8: [B, mBR, BR], 9: [BR, mBR, R], 10: [R, mBR, c, mTR], 11: [R, mTR, TR], 12: [TR, mTR, T],
  };
  const centroid = (pts) => [pts.reduce((a, p) => a + p[0], 0) / pts.length, pts.reduce((a, p) => a + p[1], 0) / pts.length];
  const out = [];
  out.push(rect(x0 - 26, y0 - 26, s + 52, s + 52, faint({ opacity: '0.25' })));
  for (const h of houses) out.push(poly(H[h], { fill: C.gold, opacity: '0.2' }));
  out.push(rect(x0, y0, s, s, gold({ 'stroke-width': 2 })));
  out.push(line(x0, y0, x1, y1, gold()));
  out.push(line(x1, y0, x0, y1, gold()));
  out.push(poly([T, R, B, L], gold()));
  if (connect) {
    const pts = connect.map((h) => centroid(H[h]));
    out.push(poly(pts, { fill: 'none', stroke: C.starlight, 'stroke-width': 1.2, 'stroke-dasharray': '4 6', opacity: '0.8' }));
  }
  if (readingPath) {
    const pts = Array.from({ length: 12 }, (_, i) => centroid(H[i + 1]));
    out.push(polyline([...pts, pts[0]], { stroke: C.starlight, 'stroke-width': 1, 'stroke-dasharray': '2 7', opacity: '0.6' }));
  }
  if (planets) {
    const r = rng(seed);
    const names = Object.keys(PLANET_COLORS);
    names.forEach((n, i) => {
      const h = 1 + Math.floor(r() * 12);
      const [hx, hy] = centroid(H[h]);
      const px = hx + (r() - 0.5) * s * 0.08;
      const py = hy + (r() - 0.5) * s * 0.08 + (i % 2 ? 10 : -10);
      out.push(circle(px, py, houses.includes(h) ? 6 : 4.5, { fill: PLANET_COLORS[n], filter: 'url(#glow)' }));
    });
  }
  for (const h of houses) {
    const [hx, hy] = centroid(H[h]);
    out.push(circle(hx, hy, 16, gold({ 'stroke-width': 1.2, opacity: '0.9' })));
  }
  return g({}, out);
}

const MOTIFS = {
  /** Armillary sphere — the pillar image for "What is Vedic astrology". */
  armillary: ({ seed }) => {
    const cx = CX + 40, cy = CY, R = 330;
    const out = [];
    out.push(circle(cx, cy, R + 40, faint({ opacity: '0.2' })));
    out.push(zodiacRing(cx, cy, R + 20, { width: 34 }));
    for (const [rx, ry, rot, o] of [[R - 20, 90, -23.4, 1], [R - 20, 170, 40, 0.6], [R - 20, 260, -65, 0.45], [110, R - 20, 0, 0.5]]) {
      out.push(el('ellipse', { cx: f(cx), cy: f(cy), rx: f(rx), ry: f(ry), ...gold({ opacity: f(o) }), transform: `rotate(${rot} ${f(cx)} ${f(cy)})` }));
    }
    out.push(line(cx - R - 60, cy + 40, cx + R + 60, cy - 40, faint({ opacity: '0.4', 'stroke-dasharray': '3 8' })));
    const r = rng(seed);
    Object.entries(PLANET_COLORS).forEach(([n, col], i) => {
      const a = i * 40 + r() * 20;
      const rr = 110 + i * 22;
      const [x, y] = polar(0, 0, rr, a);
      // Squash onto the tilted ecliptic ellipse.
      const tx = cx + x, ty = cy + y * 0.27;
      const rot = (-23.4 * Math.PI) / 180;
      const X = cx + (tx - cx) * Math.cos(rot) - (ty - cy) * Math.sin(rot);
      const Y = cy + (tx - cx) * Math.sin(rot) + (ty - cy) * Math.cos(rot);
      out.push(planet(X, Y, n === 'sun' ? 13 : 6 + (i % 3), col, { id: n }));
    });
    out.push(planet(cx, cy, 30, PLANET_COLORS.sun, { id: 'core' }));
    return out;
  },

  'zodiac-wheel': ({ focus = [0] }) => [zodiacRing(CX, CY, 360, { highlight: [].concat(focus) }), planet(CX, CY, 34, PLANET_COLORS.sun, { id: 'zc' })],

  /** Tropical vs sidereal: two zodiac rings offset by the ~24° ayanamsa. */
  ayanamsa: () => {
    const out = [];
    out.push(zodiacRing(CX, CY, 360, { width: 50 }));
    out.push(zodiacRing(CX, CY, 280, { width: 50, offset: 24.1, opacity: 0.75 }));
    out.push(path(sectorD(CX, CY, 180, 380, 0, 24.1), { fill: C.starlight, opacity: '0.09' }));
    const [x0, y0] = polar(CX, CY, 390, 0);
    const [x1, y1] = polar(CX, CY, 390, 24.1);
    out.push(path(arcD(CX, CY, 390, 0, 24.1), { stroke: C.starlight, 'stroke-width': 2.2, fill: 'none' }));
    out.push(circle(x0, y0, 5, { fill: C.starlight }), circle(x1, y1, 5, { fill: C.starlight }));
    out.push(planet(CX, CY, 26, PLANET_COLORS.sun, { id: 'ay' }));
    const [mx, my] = polar(CX, CY, 150, 118);
    out.push(planet(mx, my, 14, PLANET_COLORS.moon, { id: 'aym' }));
    return out;
  },

  'nakshatra-ring': ({ focus = [3] }) => {
    const hl = [].concat(focus);
    const out = [nakshatraRing(CX, CY, 370, { highlight: hl })];
    out.push(zodiacRing(CX, CY, 300, { width: 30, opacity: 0.45 }));
    const [mx, my] = polar(CX, CY, 190, hl[0] * (360 / 27) + 6.6);
    out.push(planet(mx, my, 22, PLANET_COLORS.moon, { id: 'nm' }));
    out.push(line(CX, CY, mx, my, faint({ opacity: '0.5', 'stroke-dasharray': '3 6' })));
    return out;
  },

  /** 12 signs and 27 nakshatras on one axis, showing they don't line up. */
  'rashi-nakshatra': () => {
    const out = [];
    out.push(zodiacRing(CX, CY, 380, { width: 56, highlight: [1] }));
    out.push(nakshatraRing(CX, CY, 300, { highlight: [2, 3, 4], width: 40 }));
    // Taurus spans the last 3/4 of Krittika, all of Rohini, half of Mrigashira.
    out.push(path(sectorD(CX, CY, 140, 250, 30, 60), { fill: C.gold, opacity: '0.08' }));
    const [mx, my] = polar(CX, CY, 200, 49);
    out.push(planet(mx, my, 18, PLANET_COLORS.moon, { id: 'rn' }));
    return out;
  },

  /** 27 small constellation glyphs on a 9 × 3 grid. */
  'nakshatra-grid': ({ seed }) => {
    const out = [];
    const r = rng(seed);
    const cols = 9, rows = 3, cw = 150, ch = 210;
    const ox = CX - (cols * cw) / 2 + cw / 2, oy = CY - (rows * ch) / 2 + ch / 2;
    for (let i = 0; i < 27; i++) {
      const cx = ox + (i % cols) * cw;
      const cy = oy + Math.floor(i / cols) * ch;
      const n = 3 + Math.floor(r() * 4);
      const pts = Array.from({ length: n }, () => [cx + (r() - 0.5) * 100, cy + (r() - 0.5) * 120]);
      out.push(polyline(pts, { stroke: C.gold, 'stroke-width': 1.1, opacity: '0.7' }));
      pts.forEach(([x, y], k) => out.push(circle(x, y, k === 0 ? 3.6 : 2.2, { fill: k === 0 ? C.starlight : C.goldSoft, filter: k === 0 ? 'url(#glow)' : undefined })));
      out.push(circle(cx, cy, 62, faint({ opacity: '0.14' })));
    }
    return out;
  },

  'north-chart': ({ focus = [], seed, variant }) =>
    [northChart(CX, CY, 560, {
      houses: [].concat(focus),
      seed,
      path: variant === 'read',
      connect: variant === 'raj' ? [1, 4, 7, 10] : variant === 'trikona' ? [1, 5, 9] : null,
    }), variant === 'raj' ? northChart(CX, CY, 560, { houses: [], planets: false, connect: [1, 5, 9] }) : ''],

  /** 12 equal houses from the Lagna on the eastern horizon. */
  houses: ({ focus = [] }) => {
    const out = [];
    const R = 360;
    const hl = [].concat(focus);
    for (let i = 0; i < 12; i++) {
      // House 1 sits just below the eastern (left) horizon, counting anticlockwise.
      const a0 = 270 - (i + 1) * 30, a1 = 270 - i * 30;
      out.push(path(sectorD(CX, CY, 120, R, a0, a1), { fill: C.gold, opacity: hl.includes(i + 1) ? '0.24' : f(0.03 + (i % 2) * 0.03), stroke: C.gold, 'stroke-width': 1.2 }));
      const [x, y] = polar(CX, CY, R + 28, a0 + 15);
      out.push(circle(x, y, 3 + (i === 0 ? 3 : 0), { fill: i === 0 ? C.starlight : C.goldSoft }));
    }
    out.push(line(CX - R - 90, CY, CX + R + 90, CY, faint({ opacity: '0.6', 'stroke-dasharray': '2 6' })));
    out.push(circle(CX, CY, 120, gold()));
    out.push(planet(CX, CY, 20, C.goldSoft, { id: 'hs' }));
    return out;
  },

  /** Lagna: the ecliptic rising over the eastern horizon. */
  horizon: () => {
    const out = [];
    const hy = 610;
    out.push(`<linearGradient id="dawn" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${C.gold}" stop-opacity="0"/><stop offset="100%" stop-color="${C.gold}" stop-opacity="0.35"/></linearGradient>`);
    out.push(rect(0, hy - 220, W, 220, { fill: 'url(#dawn)' }));
    out.push(rect(0, hy, W, H - hy, { fill: C.night }));
    out.push(line(0, hy, W, hy, gold({ 'stroke-width': 2 })));
    for (let i = 1; i < 6; i++) out.push(line(0, hy + i * 26, W, hy + i * 26, faint({ opacity: f(0.25 - i * 0.04) })));
    const cx = CX, cy = hy + 120;
    out.push(zodiacRing(cx, cy, 520, { width: 50, highlight: [0], offset: -105 }));
    out.push(planet(cx - 270, hy - 40, 26, PLANET_COLORS.sun, { id: 'hz' }));
    out.push(line(cx - 520, hy, cx - 270, hy - 40, faint({ opacity: '0.6', 'stroke-dasharray': '3 6' })));
    return out;
  },

  /** Moon sign: a large Moon set inside the zodiac band. */
  moon: ({ focus = 3 }) => {
    const out = [zodiacRing(CX, CY, 380, { width: 44, highlight: [focus], opacity: 0.8 })];
    out.push(`<radialGradient id="moonface" cx="40%" cy="38%" r="70%"><stop offset="0%" stop-color="#FFFBF0"/><stop offset="60%" stop-color="#E4DDCB"/><stop offset="100%" stop-color="#8A8676"/></radialGradient>`);
    out.push(circle(CX, CY, 220, { fill: C.starlight, opacity: '0.12', filter: 'url(#blur40)' }));
    out.push(circle(CX, CY, 170, { fill: 'url(#moonface)' }));
    const r = rng(11);
    for (let i = 0; i < 14; i++) {
      const [x, y] = polar(CX, CY, r() * 130, r() * 360);
      out.push(circle(x, y, 6 + r() * 18, { fill: '#8A8676', opacity: f(0.12 + r() * 0.12) }));
    }
    out.push(path(`M${CX + 30},${CY - 168} A170,170 0 0 1 ${CX + 30},${CY + 168} A120,170 0 0 0 ${CX + 30},${CY - 168} Z`, { fill: C.night, opacity: '0.55' }));
    return out;
  },

  /** Drishti: aspect lines drawn across the wheel. */
  aspects: () => {
    const out = [zodiacRing(CX, CY, 370, { width: 40, opacity: 0.7 })];
    const R = 290;
    const pos = { mars: 20, jupiter: 140, saturn: 250 };
    const aspectSets = { mars: [4, 7, 8], jupiter: [5, 7, 9], saturn: [3, 7, 10] };
    for (const [p, a] of Object.entries(pos)) {
      const [x, y] = polar(CX, CY, R, a);
      for (const h of aspectSets[p]) {
        const [tx, ty] = polar(CX, CY, R, a + (h - 1) * 30);
        out.push(line(x, y, tx, ty, { stroke: PLANET_COLORS[p], 'stroke-width': h === 7 ? 1.8 : 1.1, opacity: h === 7 ? '0.9' : '0.55', 'stroke-dasharray': h === 7 ? undefined : '5 7' }));
        out.push(circle(tx, ty, 3, { fill: PLANET_COLORS[p] }));
      }
      out.push(planet(x, y, 16, PLANET_COLORS[p], { id: p, ring: p === 'saturn' }));
    }
    return out;
  },

  /** Planetary combination: a constellation-like network with one triangle lit. */
  'yoga-network': ({ seed }) => {
    const r = rng(seed);
    const out = [];
    const pts = Array.from({ length: 11 }, (_, i) => polar(CX, CY, 150 + r() * 220, i * 33 + r() * 20));
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const d = Math.hypot(pts[i][0] - pts[j][0], pts[i][1] - pts[j][1]);
        if (d < 260) out.push(line(...pts[i], ...pts[j], faint({ opacity: '0.3' })));
      }
    }
    out.push(poly([pts[1], pts[4], pts[8]], { fill: C.gold, opacity: '0.14', stroke: C.goldSoft, 'stroke-width': 2 }));
    pts.forEach(([x, y], i) => out.push([1, 4, 8].includes(i) ? planet(x, y, 14, Object.values(PLANET_COLORS)[i % 9], { id: `y${i}` }) : circle(x, y, 3.5, { fill: C.goldSoft })));
    out.push(circle(CX, CY, 400, faint({ opacity: '0.2' })));
    return out;
  },

  /** Kundli matching: two wheels overlapping, 36 points of Guna Milan below. */
  match: () => {
    const out = [];
    out.push(zodiacRing(CX - 170, CY - 40, 240, { width: 36, opacity: 0.9 }));
    out.push(zodiacRing(CX + 170, CY - 40, 240, { width: 36, opacity: 0.9, offset: 15 }));
    out.push(el('ellipse', { cx: CX, cy: CY - 40, rx: 70, ry: 190, fill: C.gold, opacity: '0.12', filter: 'url(#softglow)' }));
    out.push(planet(CX - 170, CY - 40, 16, PLANET_COLORS.moon, { id: 'ma' }), planet(CX + 170, CY - 40, 16, PLANET_COLORS.venus, { id: 'mb' }));
    for (let i = 0; i < 36; i++) {
      const x = CX - 350 + i * 20;
      out.push(circle(x, CY + 290, i < 27 ? 5 : 4, { fill: i < 27 ? C.goldSoft : 'none', stroke: C.gold, 'stroke-width': 1 }));
    }
    return out;
  },

  /** Retrograde: the apparent loop a planet traces against the stars. */
  retrograde: () => {
    const out = [];
    const pts = [];
    for (let t = 0; t <= 1; t += 0.005) {
      const x = 180 + t * 1240;
      const loop = Math.exp(-Math.pow((t - 0.5) / 0.1, 2));
      const y = CY + 80 - t * 160 + Math.sin(t * Math.PI * 6) * 0 - loop * 150 * Math.sin((t - 0.4) * Math.PI * 5);
      pts.push([x - loop * 180 * Math.sin((t - 0.5) * Math.PI * 5), y]);
    }
    out.push(zodiacRing(CX, CY + 560, 760, { width: 50, opacity: 0.35 }));
    out.push(polyline(pts, { stroke: C.gold, 'stroke-width': 2.2, 'stroke-dasharray': '1 9', 'stroke-linecap': 'round' }));
    out.push(polyline(pts, { stroke: C.goldSoft, 'stroke-width': 1, opacity: '0.4' }));
    const mid = pts[Math.floor(pts.length * 0.5)];
    out.push(planet(mid[0], mid[1], 22, PLANET_COLORS.mercury, { id: 'rt' }));
    return out;
  },

  /** Combustion: a planet swallowed by the Sun's glare. */
  combust: () => {
    const out = [];
    out.push(circle(CX, CY, 330, { fill: '#F2B54A', opacity: '0.12', filter: 'url(#blur40)' }));
    out.push(circle(CX, CY, 180, { fill: '#F2B54A', opacity: '0.28', filter: 'url(#blur40)' }));
    for (let i = 0; i < 36; i++) {
      const [x0, y0] = polar(CX, CY, 110, i * 10);
      const [x1, y1] = polar(CX, CY, 170 + (i % 3) * 40, i * 10);
      out.push(line(x0, y0, x1, y1, { stroke: C.goldSoft, 'stroke-width': 1, opacity: '0.35' }));
    }
    out.push(planet(CX, CY, 90, PLANET_COLORS.sun, { id: 'cs' }));
    out.push(circle(CX, CY, 250, faint({ 'stroke-dasharray': '4 8', opacity: '0.5' })));
    const [px, py] = polar(CX, CY, 200, 58);
    out.push(planet(px, py, 12, PLANET_COLORS.mercury, { id: 'cm' }));
    const [qx, qy] = polar(CX, CY, 360, 200);
    out.push(planet(qx, qy, 12, PLANET_COLORS.venus, { id: 'cv' }));
    return out;
  },

  /** Transit: a planet's path sweeping across the signs. */
  transit: ({ focus = 'jupiter' }) => {
    const out = [zodiacRing(CX, CY, 380, { width: 44, opacity: 0.85 })];
    out.push(path(arcD(CX, CY, 300, 40, 150), { stroke: C.goldSoft, 'stroke-width': 2.5, fill: 'none', 'stroke-dasharray': '2 10', 'stroke-linecap': 'round' }));
    const [x, y] = polar(CX, CY, 300, 150);
    out.push(planet(x, y, 24, PLANET_COLORS[focus], { id: 'tr', ring: focus === 'saturn' }));
    const [mx, my] = polar(CX, CY, 190, 250);
    out.push(planet(mx, my, 14, PLANET_COLORS.moon, { id: 'trm' }));
    out.push(planet(CX, CY, 20, C.goldSoft, { id: 'tre' }));
    return out;
  },

  /** Sade Sati: Saturn crossing the sign before, of and after the natal Moon. */
  'sade-sati': () => {
    const out = [zodiacRing(CX, CY, 380, { width: 56, highlight: [8, 9, 10] })];
    const [mx, my] = polar(CX, CY, 352, 9 * 30 + 15);
    out.push(planet(mx, my, 12, PLANET_COLORS.moon, { id: 'ssm' }));
    out.push(path(arcD(CX, CY, 290, 240, 330), { stroke: PLANET_COLORS.saturn, 'stroke-width': 3, fill: 'none', 'stroke-dasharray': '2 10', 'stroke-linecap': 'round' }));
    const [sx, sy] = polar(CX, CY, 290, 300);
    out.push(planet(sx, sy, 30, PLANET_COLORS.saturn, { id: 'sss', ring: true }));
    out.push(circle(CX, CY, 200, faint({ opacity: '0.2' })));
    return out;
  },

  /** Exaltation and debilitation sit exactly opposite each other. */
  dignity: ({ variant }) => {
    const out = [zodiacRing(CX, CY, 360, { width: 44, highlight: [0, 6], opacity: 0.85 })];
    const [ax, ay] = polar(CX, CY, 260, 10);
    const [bx, by] = polar(CX, CY, 260, 190);
    out.push(line(ax, ay, bx, by, { stroke: C.goldSoft, 'stroke-width': 1.4, 'stroke-dasharray': '3 7' }));
    out.push(planet(ax, ay, 26, PLANET_COLORS.sun, { id: 'dx' }));
    out.push(planet(bx, by, 16, PLANET_COLORS.sun, { id: 'dd' }));
    if (variant === 'rise') {
      out.push(path(arcD(CX, CY, 200, 195, 355), { stroke: C.starlight, 'stroke-width': 2, fill: 'none', opacity: '0.85' }));
      const [tx, ty] = polar(CX, CY, 200, 355);
      out.push(poly([[tx, ty - 10], [tx + 12, ty + 6], [tx - 8, ty + 10]], { fill: C.starlight }));
    }
    return out;
  },

  /** A brilliant-cut gemstone, seen from above. */
  gem: () => {
    const out = [];
    const R = 250;
    out.push(circle(CX, CY, R + 120, { fill: '#C0304A', opacity: '0.16', filter: 'url(#blur40)' }));
    const outer = Array.from({ length: 8 }, (_, i) => polar(CX, CY, R, i * 45 + 22.5));
    const inner = Array.from({ length: 8 }, (_, i) => polar(CX, CY, R * 0.55, i * 45));
    out.push(`<radialGradient id="ruby" cx="40%" cy="35%" r="75%"><stop offset="0%" stop-color="#F7B0B9"/><stop offset="40%" stop-color="#C0304A"/><stop offset="100%" stop-color="#4A0E1C"/></radialGradient>`);
    out.push(poly(outer, { fill: 'url(#ruby)', stroke: C.gold, 'stroke-width': 2 }));
    out.push(poly(inner, { fill: 'none', stroke: C.goldSoft, 'stroke-width': 1.2, opacity: '0.8' }));
    for (let i = 0; i < 8; i++) {
      out.push(line(...outer[i], ...inner[i], { stroke: C.goldSoft, 'stroke-width': 1, opacity: '0.6' }));
      out.push(line(...outer[i], ...inner[(i + 1) % 8], { stroke: C.goldSoft, 'stroke-width': 1, opacity: '0.6' }));
    }
    out.push(poly([polar(CX, CY, R * 0.5, 300), polar(CX, CY, R * 0.3, 330), polar(CX, CY, R * 0.52, 350)], { fill: '#FFFFFF', opacity: '0.35' }));
    out.push(circle(CX, CY, R + 60, faint({ opacity: '0.3' })));
    out.push(ticks(CX, CY, R + 60, R + 75, 9, gold({ opacity: '0.8' })));
    return out;
  },

  /** Navamsa: one sign drawn out and divided into nine. */
  divisional: () => {
    const out = [zodiacRing(CX - 230, CY, 290, { width: 40, highlight: [2], opacity: 0.9 })];
    const [ax, ay] = polar(CX - 230, CY, 290, 60);
    const [bx, by] = polar(CX - 230, CY, 290, 90);
    const x0 = CX + 170, y0 = CY - 270, w = 330, h = 540;
    out.push(line(ax, ay, x0, y0, faint({ opacity: '0.5' })), line(bx, by, x0, y0 + h, faint({ opacity: '0.5' })));
    out.push(rect(x0, y0, w, h, gold({ 'stroke-width': 1.8 })));
    for (let i = 1; i < 9; i++) out.push(line(x0, y0 + (h / 9) * i, x0 + w, y0 + (h / 9) * i, gold({ 'stroke-width': 1, opacity: '0.7' })));
    out.push(rect(x0, y0 + (h / 9) * 4, w, h / 9, { fill: C.gold, opacity: '0.25' }));
    out.push(planet(x0 + w / 2, y0 + (h / 9) * 4.5, 14, PLANET_COLORS.venus, { id: 'dv' }));
    return out;
  },

  /** Birth time: a dial where a few minutes move the rising sign. */
  clock: () => {
    const out = [zodiacRing(CX, CY, 380, { width: 40, opacity: 0.55 })];
    out.push(circle(CX, CY, 300, gold({ 'stroke-width': 1.8 })));
    out.push(ticks(CX, CY, 270, 300, 24, gold({ 'stroke-width': 1.6 })));
    out.push(ticks(CX, CY, 285, 300, 96, faint({ opacity: '0.5' })));
    out.push(path(sectorD(CX, CY, 150, 300, 118, 132), { fill: C.gold, opacity: '0.25' }));
    const [hx, hy] = polar(CX, CY, 250, 125);
    out.push(line(CX, CY, hx, hy, { stroke: C.starlight, 'stroke-width': 3, 'stroke-linecap': 'round' }));
    const [mx, my] = polar(CX, CY, 180, 40);
    out.push(line(CX, CY, mx, my, { stroke: C.goldSoft, 'stroke-width': 2, 'stroke-linecap': 'round' }));
    out.push(circle(CX, CY, 10, { fill: C.gold }));
    return out;
  },

  /** A 108-bead mala with a single guru bead: remedies and practice. */
  mala: () => {
    const out = [];
    for (let i = 0; i < 108; i++) {
      const t = i / 108;
      const a = t * 360;
      const [x, y] = polar(CX, CY - 20, 280, a);
      const yy = CY - 20 + (y - (CY - 20)) * 0.92;
      out.push(circle(x, yy, 9, { fill: i % 27 === 0 ? C.gold : '#7B4A2A', stroke: '#C28A55', 'stroke-width': 0.8 }));
    }
    const [gx, gy] = polar(CX, CY - 20, 280, 180);
    out.push(circle(gx, gy + 34, 18, { fill: C.gold, filter: 'url(#glow)' }));
    out.push(path(`M${gx},${gy + 50} q-8,60 -20,90 M${gx},${gy + 50} q0,64 0,96 M${gx},${gy + 50} q8,60 20,90`, { stroke: C.goldSoft, 'stroke-width': 2, fill: 'none', opacity: '0.8' }));
    out.push(planet(CX, CY - 20, 30, '#C0304A', { id: 'ml' }));
    return out;
  },

  /** Lotus mandala: 8 and 16 petals — for Ishta Devata and devotion. */
  mandala: () => {
    const out = [];
    const petal = (r0, r1, a, w) => {
      const [x0, y0] = polar(CX, CY, r0, a);
      const [x1, y1] = polar(CX, CY, r1, a);
      const [c1x, c1y] = polar(CX, CY, (r0 + r1) / 2, a - w);
      const [c2x, c2y] = polar(CX, CY, (r0 + r1) / 2, a + w);
      return path(`M${f(x0)},${f(y0)} Q${f(c1x)},${f(c1y)} ${f(x1)},${f(y1)} Q${f(c2x)},${f(c2y)} ${f(x0)},${f(y0)} Z`, gold({ 'stroke-width': 1.3 }));
    };
    for (let i = 0; i < 16; i++) out.push(petal(200, 360, i * 22.5 + 11.25, 9));
    for (let i = 0; i < 8; i++) out.push(petal(90, 230, i * 45, 16));
    out.push(circle(CX, CY, 380, gold()), circle(CX, CY, 395, faint({ opacity: '0.5' })));
    out.push(circle(CX, CY, 90, gold({ 'stroke-width': 1.3 })));
    out.push(circle(CX, CY, 60, { fill: C.gold, opacity: '0.2' }));
    out.push(circle(CX, CY, 8, { fill: C.starlight, filter: 'url(#glow)' }));
    return out;
  },

  /** Atmakaraka: nine planets ranked by degree within their sign. */
  'degree-bars': ({ seed }) => {
    const r = rng(seed);
    const out = [];
    const degs = Object.keys(PLANET_COLORS).slice(0, 8).map(() => 3 + r() * 26);
    const max = degs.indexOf(Math.max(...degs));
    degs.forEach((d, i) => {
      const a = i * 45;
      const len = 60 + (d / 30) * 280;
      const [x, y] = polar(CX, CY, len, a);
      out.push(line(CX, CY, x, y, { stroke: i === max ? C.starlight : C.gold, 'stroke-width': i === max ? 3 : 1.6, opacity: i === max ? '1' : '0.75' }));
      out.push(planet(x, y, i === max ? 20 : 9, Object.values(PLANET_COLORS)[i], { id: `db${i}` }));
    });
    out.push(circle(CX, CY, 340, faint({ opacity: '0.3', 'stroke-dasharray': '2 6' })));
    out.push(circle(CX, CY, 8, { fill: C.gold }));
    return out;
  },

  /** Rahu Kaal: the daylight arc cut into eight parts, one lit. */
  'rahu-kaal': () => {
    const out = [];
    const hy = 640;
    out.push(line(80, hy, W - 80, hy, gold({ 'stroke-width': 2 })));
    for (let i = 0; i < 8; i++) {
      const a0 = 270 + i * (180 / 8), a1 = a0 + 180 / 8;
      out.push(path(sectorD(CX, hy, 240, 480, a0, a1), { fill: C.gold, opacity: i === 6 ? '0.3' : f(0.04 + (i % 2) * 0.03), stroke: C.gold, 'stroke-width': 1.2 }));
    }
    out.push(path(sectorD(CX, hy, 240, 480, 270 + 88, 270 + 92), { fill: C.starlight, opacity: '0.35' }));
    const [sx, sy] = polar(CX, hy, 540, 270 + 125);
    out.push(planet(sx, sy, 28, PLANET_COLORS.sun, { id: 'rk' }));
    out.push(planet(CX - 560, hy - 4, 16, '#E9A25A', { id: 'rise' }));
    return out;
  },

  /** Panchang: Sun and Moon with the elongation that defines the Tithi. */
  panchang: () => {
    const out = [];
    const R = 330;
    out.push(circle(CX, CY, R, gold()));
    out.push(ticks(CX, CY, R - 18, R, 30, gold({ 'stroke-width': 1.3 })));
    out.push(ticks(CX, CY, R + 22, R + 40, 27, faint({ opacity: '0.6' })));
    out.push(circle(CX, CY, R + 40, faint({ opacity: '0.45' })));
    out.push(path(sectorD(CX, CY, 0, R - 24, 300, 300 + 84), { fill: C.gold, opacity: '0.14' }));
    const [sx, sy] = polar(CX, CY, R, 300);
    const [mx, my] = polar(CX, CY, R, 384);
    out.push(line(CX, CY, sx, sy, gold({ 'stroke-width': 1.3 })), line(CX, CY, mx, my, gold({ 'stroke-width': 1.3 })));
    out.push(planet(sx, sy, 30, PLANET_COLORS.sun, { id: 'pns' }), planet(mx, my, 20, PLANET_COLORS.moon, { id: 'pnm' }));
    for (let i = 0; i < 5; i++) out.push(circle(CX - 80 + i * 40, CY + R + 90, 7, { fill: C.goldSoft, opacity: f(0.5 + i * 0.1) }));
    return out;
  },

  /** Vimshottari: the 120-year cycle as proportional arcs. */
  'dasha-wheel': ({ focus = 6 }) => {
    const years = [7, 20, 6, 10, 7, 18, 16, 19, 17];
    const names = ['ketu', 'venus', 'sun', 'moon', 'mars', 'rahu', 'jupiter', 'saturn', 'mercury'];
    const out = [];
    let a = 0;
    years.forEach((y, i) => {
      const span = (y / 120) * 360;
      const hi = i === focus;
      out.push(path(sectorD(CX, CY, hi ? 220 : 240, hi ? 380 : 350, a + 0.8, a + span - 0.8), { fill: PLANET_COLORS[names[i]], opacity: hi ? '0.55' : '0.16', stroke: C.gold, 'stroke-width': hi ? 1.6 : 0.8 }));
      const [x, y2] = polar(CX, CY, 410, a + span / 2);
      out.push(circle(x, y2, hi ? 6 : 3.5, { fill: C.goldSoft }));
      a += span;
    });
    out.push(circle(CX, CY, 200, faint({ opacity: '0.4' })));
    out.push(planet(CX, CY, 34, PLANET_COLORS.moon, { id: 'dw' }));
    return out;
  },

  /** Mahadasha → Antardasha → Pratyantardasha, nested bands. */
  'dasha-timeline': () => {
    const years = [7, 20, 6, 10, 7, 18, 16, 19, 17];
    const names = ['ketu', 'venus', 'sun', 'moon', 'mars', 'rahu', 'jupiter', 'saturn', 'mercury'];
    const out = [];
    const x0 = 140, w = W - 280;
    const band = (y, h, list, from, total, hiIndex, op) => {
      let x = from;
      const scale = total;
      list.forEach((yy, i) => {
        const ww = (yy / 120) * scale;
        out.push(rect(x + 1, y, ww - 2, h, { fill: PLANET_COLORS[names[i]], opacity: i === hiIndex ? '0.75' : op, stroke: C.gold, 'stroke-width': i === hiIndex ? 1.4 : 0.6 }));
        x += ww;
      });
    };
    band(250, 70, years, x0, w, 6, '0.22');
    // Jupiter mahadasha (index 6) starts after 88 years.
    const jx = x0 + (88 / 120) * w, jw = (16 / 120) * w;
    const rot = [...years.slice(6), ...years.slice(0, 6)];
    const rotNames = [...names.slice(6), ...names.slice(0, 6)];
    out.push(line(jx, 320, x0, 430, faint({ opacity: '0.5' })), line(jx + jw, 320, x0 + w, 430, faint({ opacity: '0.5' })));
    let x = x0;
    rot.forEach((yy, i) => {
      const ww = (yy / 120) * w;
      out.push(rect(x + 1, 430, ww - 2, 56, { fill: PLANET_COLORS[rotNames[i]], opacity: i === 2 ? '0.7' : '0.2', stroke: C.gold, 'stroke-width': 0.8 }));
      x += ww;
    });
    const sx = x0 + ((16 + 19) / 120) * w, sw = (17 / 120) * w;
    out.push(line(sx, 486, x0 + 200, 590, faint({ opacity: '0.5' })), line(sx + sw, 486, x0 + w - 200, 590, faint({ opacity: '0.5' })));
    let x2 = x0 + 200;
    const w2 = w - 400;
    rot.forEach((yy, i) => {
      const ww = (yy / 120) * w2;
      out.push(rect(x2 + 1, 590, ww - 2, 40, { fill: PLANET_COLORS[rotNames[(i + 2) % 9]], opacity: i === 4 ? '0.7' : '0.18', stroke: C.gold, 'stroke-width': 0.6 }));
      x2 += ww;
    });
    out.push(line(x0, 700, x0 + w, 700, faint({ opacity: '0.4' })));
    for (let i = 0; i <= 12; i++) out.push(line(x0 + (w / 12) * i, 692, x0 + (w / 12) * i, 708, faint({ opacity: '0.6' })));
    return out;
  },

  /** Navagraha in the traditional 3 × 3 temple arrangement, Sun at centre. */
  'navagraha-grid': () => {
    const out = [];
    // Row-major: NW, N, NE / W, C, E / SW, S, SE
    const layout = ['ketu', 'jupiter', 'mercury', 'saturn', 'sun', 'venus', 'rahu', 'mars', 'moon'];
    const s = 210;
    for (let i = 0; i < 9; i++) {
      const cx = CX + ((i % 3) - 1) * s;
      const cy = CY + (Math.floor(i / 3) - 1) * s;
      out.push(rect(cx - s / 2 + 8, cy - s / 2 + 8, s - 16, s - 16, faint({ opacity: '0.4' })));
      out.push(planet(cx, cy, layout[i] === 'sun' ? 44 : 26, PLANET_COLORS[layout[i]], { id: `ng${i}`, ring: layout[i] === 'saturn' }));
    }
    out.push(rect(CX - s * 1.5, CY - s * 1.5, s * 3, s * 3, gold({ 'stroke-width': 1.8 })));
    return out;
  },

  /** The Rahu–Ketu axis cutting the chart: doshas and the nodes. */
  nodes: () => {
    const out = [zodiacRing(CX, CY, 370, { width: 44, opacity: 0.8 })];
    const [ax, ay] = polar(CX, CY, 300, 128);
    const [bx, by] = polar(CX, CY, 300, 308);
    out.push(line(ax, ay, bx, by, { stroke: C.starlight, 'stroke-width': 2, opacity: '0.8' }));
    out.push(path(sectorD(CX, CY, 0, 300, 128, 308), { fill: C.gold, opacity: '0.07' }));
    out.push(planet(ax, ay, 22, PLANET_COLORS.ketu, { id: 'nk' }), planet(bx, by, 22, PLANET_COLORS.rahu, { id: 'nr' }));
    for (const a of [170, 200, 235, 260, 290]) {
      const [x, y] = polar(CX, CY, 210, a);
      out.push(circle(x, y, 6, { fill: C.goldSoft, filter: 'url(#glow)' }));
    }
    return out;
  },
};

export function drawAstrology(motif, opts) {
  const fn = MOTIFS[motif];
  if (!fn) throw new Error(`Unknown astrology motif "${motif}"`);
  return fn(opts);
}

export const ASTROLOGY_MOTIFS = Object.keys(MOTIFS);
