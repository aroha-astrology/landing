// Shared primitives for the Aroha editorial art generator.
// Everything is plain string-building SVG so the output is deterministic,
// diffable and renderable by sharp/librsvg without a browser.

export const W = 1600;
export const H = 900;
export const CX = W / 2;
export const CY = H / 2;

export const C = {
  // Astrology
  night: '#0B1020',
  night2: '#16204A',
  starlight: '#F4EEDF',
  gold: '#D4A64E',
  goldSoft: '#E9CF95',
  mist: '#A9AEC2',
  // Vastu
  sand: '#EEE6D6',
  sand2: '#DCCFB7',
  sand3: '#CDBD9F',
  clay: '#A4583A',
  claySoft: '#D39A7C',
  laterite: '#3B2D22',
  stone: '#8C7A66',
  // Puja
  ivory: '#FBF5EA',
  ivory2: '#F3E4CC',
  saffron: '#E07A1F',
  marigold: '#F2A93B',
  kumkum: '#9C2A22',
  umber: '#1F130C',
  umber2: '#3A2418',
  leaf: '#5E7A3A',
  brass: '#C9973E',
};

/** mulberry32 — tiny deterministic PRNG. */
export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export const f = (n) => (Math.round(n * 10) / 10).toString();

/** Point on a circle; 0° is straight up, angles run clockwise. */
export function polar(cx, cy, r, deg) {
  const a = ((deg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}

export function attrs(o) {
  return Object.entries(o)
    .filter(([, v]) => v !== undefined && v !== null && v !== false)
    .map(([k, v]) => `${k}="${v}"`)
    .join(' ');
}

export const el = (tag, a = {}, children = '') =>
  children === '' ? `<${tag} ${attrs(a)}/>` : `<${tag} ${attrs(a)}>${children}</${tag}>`;

export const g = (a, children) => el('g', a, Array.isArray(children) ? children.join('') : children);

export const circle = (cx, cy, r, a = {}) => el('circle', { cx: f(cx), cy: f(cy), r: f(r), ...a });

export const line = (x1, y1, x2, y2, a = {}) =>
  el('line', { x1: f(x1), y1: f(y1), x2: f(x2), y2: f(y2), ...a });

export const rect = (x, y, w, h, a = {}) => el('rect', { x: f(x), y: f(y), width: f(w), height: f(h), ...a });

export const path = (d, a = {}) => el('path', { d, ...a });

export const poly = (pts, a = {}) => el('polygon', { points: pts.map(([x, y]) => `${f(x)},${f(y)}`).join(' '), ...a });

export const polyline = (pts, a = {}) =>
  el('polyline', { points: pts.map(([x, y]) => `${f(x)},${f(y)}`).join(' '), fill: 'none', ...a });

export function arcD(cx, cy, r, a0, a1) {
  const [x0, y0] = polar(cx, cy, r, a0);
  const [x1, y1] = polar(cx, cy, r, a1);
  const large = (((a1 - a0) % 360) + 360) % 360 > 180 ? 1 : 0;
  return `M${f(x0)},${f(y0)} A${f(r)},${f(r)} 0 ${large} 1 ${f(x1)},${f(y1)}`;
}

/** Annular sector from angle a0 to a1 between radii r0 < r1. */
export function sectorD(cx, cy, r0, r1, a0, a1) {
  const [ax, ay] = polar(cx, cy, r1, a0);
  const [bx, by] = polar(cx, cy, r1, a1);
  const [cx2, cy2] = polar(cx, cy, r0, a1);
  const [dx, dy] = polar(cx, cy, r0, a0);
  const large = a1 - a0 > 180 ? 1 : 0;
  return `M${f(ax)},${f(ay)} A${f(r1)},${f(r1)} 0 ${large} 1 ${f(bx)},${f(by)} L${f(cx2)},${f(cy2)} A${f(r0)},${f(r0)} 0 ${large} 0 ${f(dx)},${f(dy)} Z`;
}

/** Radial tick marks. */
export function ticks(cx, cy, r0, r1, count, a = {}, offset = 0) {
  const out = [];
  for (let i = 0; i < count; i++) {
    const deg = offset + (360 / count) * i;
    const [x0, y0] = polar(cx, cy, r0, deg);
    const [x1, y1] = polar(cx, cy, r1, deg);
    out.push(line(x0, y0, x1, y1, a));
  }
  return out.join('');
}

// ---------------------------------------------------------------------------
// Shared <defs>: glow, grain, vignette. Each background below references them.
// ---------------------------------------------------------------------------

export function defs(extra = '') {
  return el(
    'defs',
    {},
    [
      `<filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="7" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`,
      `<filter id="softglow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="18"/></filter>`,
      `<filter id="blur40" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="40"/></filter>`,
      `<filter id="grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="7" stitchTiles="stitch"/><feColorMatrix type="matrix" values="0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0.9 0"/></filter>`,
      `<radialGradient id="vignette" cx="50%" cy="50%" r="75%"><stop offset="55%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity="0.45"/></radialGradient>`,
      `<radialGradient id="vignetteSoft" cx="50%" cy="50%" r="80%"><stop offset="60%" stop-color="#3B2D22" stop-opacity="0"/><stop offset="100%" stop-color="#3B2D22" stop-opacity="0.16"/></radialGradient>`,
      extra,
    ].join(''),
  );
}

export function grainLayer(opacity) {
  return rect(0, 0, W, H, { filter: 'url(#grain)', opacity });
}

// ---------------------------------------------------------------------------
// Category backgrounds
// ---------------------------------------------------------------------------

/** Midnight sky with a starfield and a faint galactic band. */
export function astroBackground(seed, { glowX = 0.6, glowY = 0.45 } = {}) {
  const r = rng(seed);
  const stars = [];
  for (let i = 0; i < 320; i++) {
    const x = r() * W;
    const y = r() * H;
    const big = r() > 0.94;
    const rad = big ? 1.4 + r() * 1.2 : 0.5 + r() * 0.9;
    const op = big ? 0.7 + r() * 0.3 : 0.18 + r() * 0.55;
    const fill = r() > 0.9 ? C.goldSoft : C.starlight;
    stars.push(circle(x, y, rad, { fill, opacity: f(op) }));
  }
  const bandAngle = -18 + r() * 36;
  return [
    `<radialGradient id="sky" cx="${glowX * 100}%" cy="${glowY * 100}%" r="85%"><stop offset="0%" stop-color="#1D2A5A"/><stop offset="45%" stop-color="${C.night2}"/><stop offset="100%" stop-color="${C.night}"/></radialGradient>`,
    rect(0, 0, W, H, { fill: 'url(#sky)' }),
    g({ transform: `rotate(${f(bandAngle)} ${CX} ${CY})`, opacity: '0.07' }, [
      el('ellipse', { cx: CX, cy: CY, rx: 1100, ry: 90, fill: '#8FA0D8', filter: 'url(#blur40)' }),
    ]),
    g({}, stars),
  ];
}

export function astroFinish() {
  return [rect(0, 0, W, H, { fill: 'url(#vignette)' }), grainLayer(0.05)];
}

/** Sandstone drafting paper with a faint grid and window light. */
export function vastuBackground(seed) {
  const r = rng(seed);
  const grid = [];
  for (let x = 40; x < W; x += 40) grid.push(line(x, 0, x, H, { stroke: C.laterite, 'stroke-width': x % 200 === 0 ? 0.8 : 0.4, opacity: '0.07' }));
  for (let y = 50; y < H; y += 40) grid.push(line(0, y, W, y, { stroke: C.laterite, 'stroke-width': (y - 10) % 200 === 0 ? 0.8 : 0.4, opacity: '0.07' }));
  const lx = 200 + r() * 300;
  return [
    `<linearGradient id="sand" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#F3ECDF"/><stop offset="60%" stop-color="${C.sand}"/><stop offset="100%" stop-color="${C.sand2}"/></linearGradient>`,
    rect(0, 0, W, H, { fill: 'url(#sand)' }),
    g({}, grid),
    el('ellipse', { cx: f(lx), cy: 120, rx: 520, ry: 340, fill: '#FFF8EA', opacity: '0.55', filter: 'url(#blur40)' }),
  ];
}

export function vastuFinish() {
  return [rect(0, 0, W, H, { fill: 'url(#vignetteSoft)' }), grainLayer(0.07)];
}

/** Ivory with a warm lamp-glow, or deep umber for firelit scenes. */
export function pujaBackground(seed, { dark = false, glowX = CX, glowY = CY } = {}) {
  if (dark) {
    return [
      `<radialGradient id="umber" cx="${(glowX / W) * 100}%" cy="${(glowY / H) * 100}%" r="80%"><stop offset="0%" stop-color="#5A3218"/><stop offset="35%" stop-color="${C.umber2}"/><stop offset="100%" stop-color="${C.umber}"/></radialGradient>`,
      rect(0, 0, W, H, { fill: 'url(#umber)' }),
      circle(glowX, glowY, 260, { fill: C.saffron, opacity: '0.28', filter: 'url(#blur40)' }),
    ];
  }
  return [
    `<radialGradient id="ivory" cx="${(glowX / W) * 100}%" cy="${(glowY / H) * 100}%" r="85%"><stop offset="0%" stop-color="#FFF1D6"/><stop offset="40%" stop-color="${C.ivory}"/><stop offset="100%" stop-color="${C.ivory2}"/></radialGradient>`,
    rect(0, 0, W, H, { fill: 'url(#ivory)' }),
    circle(glowX, glowY, 300, { fill: C.marigold, opacity: '0.16', filter: 'url(#blur40)' }),
  ];
}

export function pujaFinish(dark = false) {
  return dark
    ? [rect(0, 0, W, H, { fill: 'url(#vignette)' }), grainLayer(0.06)]
    : [rect(0, 0, W, H, { fill: 'url(#vignetteSoft)' }), grainLayer(0.06)];
}

// ---------------------------------------------------------------------------
// Reusable ornaments
// ---------------------------------------------------------------------------

/** A marigold bloom: stacked rings of short petals. */
export function marigold(cx, cy, r, seed = 1, color = C.marigold) {
  const rr = rng(seed);
  const out = [];
  const layers = [
    { rad: r, n: 18, len: r * 0.42, col: color },
    { rad: r * 0.7, n: 14, len: r * 0.36, col: C.saffron },
    { rad: r * 0.42, n: 10, len: r * 0.3, col: color },
  ];
  for (const L of layers) {
    for (let i = 0; i < L.n; i++) {
      const a = (360 / L.n) * i + rr() * 12;
      const [x, y] = polar(cx, cy, L.rad - L.len / 2, a);
      out.push(
        el('ellipse', {
          cx: f(x),
          cy: f(y),
          rx: f(L.len * 0.34),
          ry: f(L.len * 0.55),
          fill: L.col,
          opacity: f(0.85 + rr() * 0.15),
          transform: `rotate(${f(a)} ${f(x)} ${f(y)})`,
        }),
      );
    }
  }
  out.push(circle(cx, cy, r * 0.18, { fill: '#B8561A' }));
  return g({}, out);
}

/** A string of marigolds hanging in a catenary between two points (toran). */
export function garland(x0, y0, x1, y1, sag, n, seed = 3, size = 16) {
  const out = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const x = x0 + (x1 - x0) * t;
    const y = y0 + (y1 - y0) * t + sag * 4 * t * (1 - t);
    out.push(marigold(x, y, size, seed + i, i % 3 === 0 ? C.saffron : C.marigold));
  }
  return g({}, out);
}

/** A mango leaf pointing along angle `deg` from its stem at (x, y). */
export function leaf(x, y, len, deg, color = C.leaf) {
  const w = len * 0.28;
  const d = `M0,0 C${f(w)},${f(-len * 0.3)} ${f(w * 0.8)},${f(-len * 0.75)} 0,${f(-len)} C${f(-w * 0.8)},${f(-len * 0.75)} ${f(-w)},${f(-len * 0.3)} 0,0 Z`;
  return g({ transform: `translate(${f(x)} ${f(y)}) rotate(${f(deg)})` }, [
    path(d, { fill: color }),
    line(0, 0, 0, -len * 0.92, { stroke: '#3F5626', 'stroke-width': 1.2, opacity: '0.7' }),
  ]);
}

/** A diya: clay lamp in profile with a layered flame and halo. */
export function diya(cx, cy, s = 1, { halo = true } = {}) {
  const bowl = `M${f(cx - 70 * s)},${f(cy)} Q${f(cx)},${f(cy + 62 * s)} ${f(cx + 70 * s)},${f(cy)} L${f(cx + 92 * s)},${f(cy - 14 * s)} Q${f(cx + 40 * s)},${f(cy - 4 * s)} ${f(cx)},${f(cy - 2 * s)} Q${f(cx - 40 * s)},${f(cy - 4 * s)} ${f(cx - 70 * s)},${f(cy)} Z`;
  const flameOuter = `M${f(cx + 64 * s)},${f(cy - 12 * s)} C${f(cx + 40 * s)},${f(cy - 60 * s)} ${f(cx + 72 * s)},${f(cy - 110 * s)} ${f(cx + 78 * s)},${f(cy - 150 * s)} C${f(cx + 96 * s)},${f(cy - 104 * s)} ${f(cx + 108 * s)},${f(cy - 56 * s)} ${f(cx + 64 * s)},${f(cy - 12 * s)} Z`;
  const flameInner = `M${f(cx + 68 * s)},${f(cy - 16 * s)} C${f(cx + 56 * s)},${f(cy - 50 * s)} ${f(cx + 74 * s)},${f(cy - 78 * s)} ${f(cx + 78 * s)},${f(cy - 100 * s)} C${f(cx + 88 * s)},${f(cy - 74 * s)} ${f(cx + 94 * s)},${f(cy - 46 * s)} ${f(cx + 68 * s)},${f(cy - 16 * s)} Z`;
  return g({}, [
    halo ? circle(cx + 76 * s, cy - 80 * s, 150 * s, { fill: C.marigold, opacity: '0.35', filter: 'url(#blur40)' }) : '',
    halo ? circle(cx + 76 * s, cy - 76 * s, 60 * s, { fill: '#FFD58A', opacity: '0.55', filter: 'url(#softglow)' }) : '',
    `<linearGradient id="clay${Math.round(cx)}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#C8743A"/><stop offset="100%" stop-color="#7A3A1C"/></linearGradient>`,
    path(bowl, { fill: `url(#clay${Math.round(cx)})` }),
    path(`M${f(cx - 70 * s)},${f(cy)} Q${f(cx)},${f(cy - 16 * s)} ${f(cx + 84 * s)},${f(cy - 10 * s)}`, { stroke: '#E9A25A', 'stroke-width': 2 * s, fill: 'none', opacity: '0.7' }),
    path(flameOuter, { fill: C.saffron }),
    path(flameInner, { fill: '#FFE7A8' }),
  ]);
}
