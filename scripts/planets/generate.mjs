// Generates the hero's planet surface maps: equirectangular textures drawn
// in code (3D noise sampled on the sphere, so no seams at the poles or the
// date line), plus a small lit "disc" render of each planet for the static
// SVG fallback. Everything here is original, owned artwork.
//
//   node scripts/planets/generate.mjs            # all planets
//   node scripts/planets/generate.mjs mars moon  # just these
//
// Output: public/assets/planets/<name>.webp (1024×512 map) and
//         public/assets/planets/<name>-disc.webp (160×160 lit sphere)

import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const OUT = path.join(process.cwd(), 'public/assets/planets');
const W = 1024;
const H = 512;

// ---------------------------------------------------------------- noise ---

function mulberry32(seed) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** 3D simplex noise (Gustavson), seeded permutation. Returns roughly -1..1. */
function makeNoise(seed) {
  const rand = mulberry32(seed);
  const p = new Uint8Array(256).map((_, i) => i);
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [p[i], p[j]] = [p[j], p[i]];
  }
  const perm = new Uint8Array(512);
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
  const G = [1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1, 0, 1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, -1, 0, 1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1];
  const F3 = 1 / 3;
  const G3 = 1 / 6;
  return (x, y, z) => {
    const s = (x + y + z) * F3;
    const i = Math.floor(x + s);
    const j = Math.floor(y + s);
    const k = Math.floor(z + s);
    const t = (i + j + k) * G3;
    const x0 = x - (i - t);
    const y0 = y - (j - t);
    const z0 = z - (k - t);
    let i1, j1, k1, i2, j2, k2;
    if (x0 >= y0) {
      if (y0 >= z0) [i1, j1, k1, i2, j2, k2] = [1, 0, 0, 1, 1, 0];
      else if (x0 >= z0) [i1, j1, k1, i2, j2, k2] = [1, 0, 0, 1, 0, 1];
      else [i1, j1, k1, i2, j2, k2] = [0, 0, 1, 1, 0, 1];
    } else if (y0 < z0) [i1, j1, k1, i2, j2, k2] = [0, 0, 1, 0, 1, 1];
    else if (x0 < z0) [i1, j1, k1, i2, j2, k2] = [0, 1, 0, 0, 1, 1];
    else [i1, j1, k1, i2, j2, k2] = [0, 1, 0, 1, 1, 0];
    const corners = [
      [x0, y0, z0, 0, 0, 0],
      [x0 - i1 + G3, y0 - j1 + G3, z0 - k1 + G3, i1, j1, k1],
      [x0 - i2 + 2 * G3, y0 - j2 + 2 * G3, z0 - k2 + 2 * G3, i2, j2, k2],
      [x0 - 1 + 3 * G3, y0 - 1 + 3 * G3, z0 - 1 + 3 * G3, 1, 1, 1],
    ];
    let n = 0;
    for (const [cx, cy, cz, di, dj, dk] of corners) {
      let tt = 0.6 - cx * cx - cy * cy - cz * cz;
      if (tt < 0) continue;
      const gi = (perm[((i + di) & 255) + perm[((j + dj) & 255) + perm[(k + dk) & 255]]] % 12) * 3;
      tt *= tt;
      n += tt * tt * (G[gi] * cx + G[gi + 1] * cy + G[gi + 2] * cz);
    }
    return 32 * n;
  };
}

function fbm(noise, x, y, z, octaves = 5, lacunarity = 2, gain = 0.5) {
  let amp = 0.5;
  let sum = 0;
  let f = 1;
  for (let o = 0; o < octaves; o++) {
    sum += amp * noise(x * f, y * f, z * f);
    f *= lacunarity;
    amp *= gain;
  }
  return sum;
}

// ---------------------------------------------------------------- helpers ---

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const mix = (a, b, t) => a + (b - a) * t;
const mixc = (c1, c2, t) => [mix(c1[0], c2[0], t), mix(c1[1], c2[1], t), mix(c1[2], c2[2], t)];
const smooth = (e0, e1, x) => {
  const t = clamp((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};
const hex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];

/** Colour ramp: stops as [position, '#rrggbb']. */
function ramp(stops, t) {
  t = clamp(t);
  for (let i = 1; i < stops.length; i++) {
    if (t <= stops[i][0]) {
      const [p0, c0] = stops[i - 1];
      const [p1, c1] = stops[i];
      return mixc(hex(c0), hex(c1), (t - p0) / (p1 - p0 || 1));
    }
  }
  return hex(stops[stops.length - 1][1]);
}

/** Random crater field on the unit sphere. */
function craters(seed, count, rMin, rMax) {
  const rand = mulberry32(seed);
  return Array.from({ length: count }, () => {
    const z = rand() * 2 - 1;
    const a = rand() * Math.PI * 2;
    const s = Math.sqrt(1 - z * z);
    // Size distribution skewed small, like real crater populations.
    const r = rMin + (rMax - rMin) * Math.pow(rand(), 3);
    return { x: s * Math.cos(a), y: z, z: s * Math.sin(a), r, depth: 0.5 + rand() * 0.5 };
  });
}

/** Crater shading at a point: dark floor, bright rim, faint ejecta. */
function craterShade(list, x, y, z) {
  let v = 0;
  for (const c of list) {
    const d = Math.acos(clamp(x * c.x + y * c.y + z * c.z, -1, 1));
    if (d > c.r * 1.8) continue;
    const q = d / c.r;
    // Soft bowl, a Gaussian bright rim and faint ejecta beyond it.
    v -= 0.13 * c.depth * (1 - smooth(0.1, 1, q));
    v += 0.12 * c.depth * Math.exp(-(((q - 1) / 0.13) ** 2));
    if (q > 1) v += 0.03 * c.depth * (1 - smooth(1, 1.8, q));
  }
  return v;
}

// ---------------------------------------------------------------- planets ---
// Each recipe maps a point on the unit sphere (x, y, z; y is north) plus its
// latitude (radians) to an RGB colour, and optionally an alpha.

const RECIPES = {
  sun() {
    const n = makeNoise(11);
    return (x, y, z) => {
      const gran = fbm(n, x * 18, y * 18, z * 18, 4);
      const big = fbm(n, x * 3 + 40, y * 3, z * 3, 3);
      const t = clamp(0.62 + gran * 0.35 + big * 0.25);
      return ramp([[0, '#B8410C'], [0.45, '#F07A1A'], [0.75, '#FFB43C'], [1, '#FFE9A8']], t);
    };
  },

  moon() {
    const n = makeNoise(21);
    const cr = craters(7, 520, 0.012, 0.16);
    return (x, y, z) => {
      const maria = smooth(0.08, 0.2, fbm(n, x * 1.6, y * 1.6, z * 1.6, 4) + (x > 0.2 ? 0.08 : -0.05));
      const rough = fbm(n, x * 14, y * 14, z * 14, 4) * 0.12;
      let v = mix(0.74, 0.4, maria) + rough + craterShade(cr, x, y, z) * (1 - maria * 0.6);
      v = clamp(v, 0.12, 0.95);
      return mixc([v * 255, v * 255, v * 255], [v * 250, v * 244, v * 232], 0.5);
    };
  },

  mercury() {
    const n = makeNoise(31);
    const cr = craters(13, 700, 0.01, 0.13);
    return (x, y, z) => {
      const base = fbm(n, x * 3, y * 3, z * 3, 4) * 0.12;
      const rough = fbm(n, x * 16, y * 16, z * 16, 3) * 0.1;
      const v = clamp(0.56 + base + rough + craterShade(cr, x, y, z), 0.15, 0.92);
      return [v * 236, v * 222, v * 204];
    };
  },

  venus() {
    const n = makeNoise(41);
    return (x, y, z, lat) => {
      // Domain-warped cloud decks, stretched along latitude lines.
      const wx = fbm(n, x * 2, y * 2, z * 2, 3);
      const band = Math.sin(lat * 7 + wx * 4 + fbm(n, x * 4 + 9, y * 9, z * 4, 4) * 2.5);
      const fine = fbm(n, x * 10 + wx, y * 22, z * 10, 4);
      const t = clamp(0.55 + band * 0.18 + fine * 0.25);
      return ramp([[0, '#A9793E'], [0.4, '#D8B06A'], [0.7, '#EFD7A2'], [1, '#FBF0D2']], t);
    };
  },

  earth() {
    const n = makeNoise(51);
    return (x, y, z, lat) => {
      const h = fbm(n, x * 1.25, y * 1.25, z * 1.25, 7) + fbm(n, x * 5 + 7, y * 5, z * 5, 3) * 0.12;
      const land = h > 0.14;
      const ice = Math.abs(lat) > 1.25 + fbm(n, x * 5, y * 5, z * 5, 3) * 0.15;
      if (ice) return [236, 242, 248];
      if (!land) {
        const depth = clamp((0.14 - h) * 3.5);
        return ramp([[0, '#2E7FB8'], [0.35, '#1C5A94'], [1, '#0B2C5C']], depth);
      }
      const dry = clamp(0.5 - Math.cos(lat * 2) * 0.35 + fbm(n, x * 4 + 3, y * 4, z * 4, 4) * 0.8);
      const elev = clamp((h - 0.14) * 3);
      const c = ramp([[0, '#3E7A3A'], [0.45, '#6E8B45'], [0.7, '#B59A63'], [1, '#D8C49A']], dry);
      return mixc(c, [120, 104, 88], elev * 0.5);
    };
  },

  'earth-clouds'() {
    const n = makeNoise(57);
    return (x, y, z) => {
      const c = fbm(n, x * 3, y * 5, z * 3, 6) + fbm(n, x * 12, y * 12, z * 12, 3) * 0.2;
      const a = smooth(0.02, 0.32, c);
      return [255, 255, 255, a * 235];
    };
  },

  mars() {
    const n = makeNoise(61);
    const cr = craters(17, 160, 0.01, 0.07);
    return (x, y, z, lat) => {
      const albedo = fbm(n, x * 2.2, y * 2.2, z * 2.2, 5);
      const dark = smooth(0.02, 0.2, albedo);
      const rough = fbm(n, x * 12, y * 12, z * 12, 4) * 0.25;
      let c = ramp([[0, '#E4A06A'], [0.5, '#C2562B'], [1, '#7A3520']], clamp(0.38 + dark * 0.34 + rough));
      // Positive shade lightens rims; negative (crater floors) darkens.
      c = mixc(c, [255, 255, 255], craterShade(cr, x, y, z) * 0.6);
      const cap = smooth(1.2, 1.32, Math.abs(lat) + fbm(n, x * 6, y * 6, z * 6, 3) * 0.08);
      return mixc(c, [246, 240, 232], cap);
    };
  },

  jupiter() {
    const n = makeNoise(71);
    // Great Red Spot: an ellipse at ~22°S.
    const spotLat = -0.38;
    const spotLon = 1.1;
    return (x, y, z, lat, lon) => {
      const warp = fbm(n, x * 3, y * 3, z * 3, 4) * 0.35 + fbm(n, x * 9, y * 14, z * 9, 3) * 0.12;
      const b = lat * 9 + warp * 2.2;
      const bands = Math.sin(b) * 0.5 + Math.sin(b * 2.3 + 1) * 0.25;
      const eddy = fbm(n, x * 18, y * 40, z * 18, 3) * 0.18;
      let c = ramp([[0, '#6E4228'], [0.28, '#B0764A'], [0.5, '#D9B27F'], [0.75, '#F1E1C4'], [1, '#FFFBF2']], clamp(0.55 + bands * 0.55 + eddy));
      const dLon = Math.atan2(Math.sin(lon - spotLon), Math.cos(lon - spotLon));
      const e = (dLon / 0.3) ** 2 + ((lat - spotLat) / 0.12) ** 2;
      if (e < 1.4) {
        const swirl = fbm(n, dLon * 8, lat * 20, 3, 3) * 0.3;
        const k = smooth(1.4, 0.4, e + swirl);
        c = mixc(c, ramp([[0, '#C8744A'], [1, '#A2432A']], 1 - e), k);
      }
      return c;
    };
  },

  saturn() {
    const n = makeNoise(81);
    return (x, y, z, lat) => {
      const warp = fbm(n, x * 2, y * 2, z * 2, 3) * 0.2;
      const b = lat * 11 + warp * 1.5;
      const bands = Math.sin(b) * 0.5 + Math.sin(b * 2.7) * 0.2;
      const fine = fbm(n, x * 10, y * 30, z * 10, 3) * 0.08;
      return ramp([[0, '#A88B5A'], [0.4, '#CDB27E'], [0.7, '#E6D3A6'], [1, '#F6EBCF']], clamp(0.6 + bands * 0.35 + fine));
    };
  },
};

// Saturn's rings: a 1D radial strip (inner → outer), RGBA.
function saturnRings() {
  const n = makeNoise(91);
  const w = 1024;
  const buf = Buffer.alloc(w * 4 * 4);
  for (let i = 0; i < w; i++) {
    const t = i / (w - 1);
    // C ring (faint) → B ring (bright) → Cassini division → A ring → Encke gap.
    let a = 0;
    if (t < 0.22) a = 0.18 + t * 0.6;
    else if (t < 0.58) a = 0.75 + 0.2 * Math.sin(t * 60);
    else if (t < 0.64) a = 0.05;
    else if (t < 0.97) a = 0.55 + 0.15 * Math.sin(t * 90);
    if (t > 0.9 && t < 0.915) a *= 0.2;
    a = clamp(a + n(t * 40, 0, 0) * 0.12);
    const c = ramp([[0, '#8C7A5E'], [0.4, '#D9C49A'], [0.7, '#EFE1BF'], [1, '#C9B48C']], t);
    for (let row = 0; row < 4; row++) {
      const o = (row * w + i) * 4;
      buf[o] = c[0];
      buf[o + 1] = c[1];
      buf[o + 2] = c[2];
      buf[o + 3] = Math.round(a * 255);
    }
  }
  return sharp(buf, { raw: { width: w, height: 4, channels: 4 } });
}

// ---------------------------------------------------------------- render ---

function renderMap(fn) {
  const buf = Buffer.alloc(W * H * 4);
  for (let j = 0; j < H; j++) {
    const lat = Math.PI / 2 - ((j + 0.5) / H) * Math.PI;
    const cl = Math.cos(lat);
    const y = Math.sin(lat);
    for (let i = 0; i < W; i++) {
      // Matches three.js SphereGeometry UVs: u=0 at -x, increasing towards +z.
      const lon = ((i + 0.5) / W) * Math.PI * 2 - Math.PI;
      const x = -Math.cos(lon) * cl;
      const z = Math.sin(lon) * cl;
      const c = fn(x, y, z, lat, lon);
      const o = (j * W + i) * 4;
      buf[o] = clamp(c[0], 0, 255);
      buf[o + 1] = clamp(c[1], 0, 255);
      buf[o + 2] = clamp(c[2], 0, 255);
      buf[o + 3] = c.length > 3 ? clamp(c[3], 0, 255) : 255;
    }
  }
  return buf;
}

/** A lit sphere seen from the front, for the static fallback. */
function renderDisc(map, size, { lit = true, light = [-0.55, 0.35, 0.76] } = {}) {
  const buf = Buffer.alloc(size * size * 4);
  const L = Math.hypot(...light);
  const [lx, ly, lz] = light.map((v) => v / L);
  for (let j = 0; j < size; j++) {
    for (let i = 0; i < size; i++) {
      const nx = ((i + 0.5) / size) * 2 - 1;
      const ny = 1 - ((j + 0.5) / size) * 2;
      const r2 = nx * nx + ny * ny;
      const o = (j * size + i) * 4;
      if (r2 > 1) continue;
      const nz = Math.sqrt(1 - r2);
      const lat = Math.asin(ny);
      const lon = Math.atan2(nx, nz) - Math.PI / 2;
      const u = (((lon + Math.PI) / (Math.PI * 2)) % 1 + 1) % 1;
      const v = (Math.PI / 2 - lat) / Math.PI;
      const si = Math.min(W - 1, Math.floor(u * W));
      const sj = Math.min(H - 1, Math.floor(v * H));
      const so = (sj * W + si) * 4;
      const diff = lit ? clamp(nx * lx + ny * ly + nz * lz) : 1;
      const shade = lit ? 0.06 + 0.94 * Math.pow(diff, 0.9) : 1;
      const edge = smooth(1, 0.94, Math.sqrt(r2));
      buf[o] = map[so] * shade;
      buf[o + 1] = map[so + 1] * shade;
      buf[o + 2] = map[so + 2] * shade;
      buf[o + 3] = 255 * edge;
    }
  }
  return sharp(buf, { raw: { width: size, height: size, channels: 4 } });
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const only = new Set(process.argv.slice(2));
  for (const [name, recipe] of Object.entries(RECIPES)) {
    if (only.size && !only.has(name)) continue;
    const t0 = Date.now();
    const map = renderMap(recipe());
    const hasAlpha = name === 'earth-clouds';
    await sharp(map, { raw: { width: W, height: H, channels: 4 } })
      .webp({ quality: hasAlpha ? 70 : 82, alphaQuality: 70, effort: 6 })
      .toFile(path.join(OUT, `${name}.webp`));
    if (!hasAlpha) {
      await renderDisc(map, 160, { lit: name !== 'sun' })
        .webp({ quality: 82, effort: 6 })
        .toFile(path.join(OUT, `${name}-disc.webp`));
    }
    const kb = (fs.statSync(path.join(OUT, `${name}.webp`)).size / 1024).toFixed(0);
    console.log(`${name.padEnd(13)} ${kb} KB  ${Date.now() - t0} ms`);
  }
  if (!only.size || only.has('saturn')) {
    await saturnRings().png().toFile(path.join(OUT, 'saturn-rings.png'));
    console.log('saturn-rings  png');
  }
}

main();
