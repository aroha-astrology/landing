// Vastu motifs: architectural drafting on sandstone. Plans are drawn with
// real Vastu logic (north up, the eight zones, Brahmasthan at the centre),
// so the art agrees with what the article says.
import { C, CX, CY, W, H, f, rng, polar, el, g, circle, line, rect, path, poly, polyline, sectorD, ticks, diya } from './lib.mjs';

const ink = (o = {}) => ({ stroke: C.laterite, fill: 'none', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...o });
const thin = (o = {}) => ink({ 'stroke-width': 1, opacity: '0.55', ...o });
const hatchId = 'hatch';

const hatchDef = `<pattern id="${hatchId}" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="10" stroke="${C.clay}" stroke-width="2" opacity="0.35"/></pattern>`;

/** North arrow in the drafting style. */
function northArrow(x, y, s = 1) {
  return g({}, [
    circle(x, y, 34 * s, thin({ opacity: '0.7' })),
    poly([[x, y - 30 * s], [x + 10 * s, y + 8 * s], [x, y + 2 * s], [x - 10 * s, y + 8 * s]], { fill: C.laterite }),
    poly([[x, y - 30 * s], [x - 10 * s, y + 8 * s], [x, y + 2 * s]], { fill: C.clay }),
    path(`M${f(x - 6 * s)},${f(y - 40 * s)} L${f(x - 6 * s)},${f(y - 52 * s)} L${f(x + 6 * s)},${f(y - 40 * s)} L${f(x + 6 * s)},${f(y - 52 * s)}`, ink({ 'stroke-width': 1.6 * s })),
  ]);
}

/** Eight-direction compass rose, optional highlighted directions (e.g. ['NE']). */
const DIRS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
function compassRose(cx, cy, R, { highlight = [], centre = false } = {}) {
  const out = [];
  for (let i = 0; i < 8; i++) {
    const hi = highlight.includes(DIRS[i]);
    out.push(path(sectorD(cx, cy, R * 0.28, R, i * 45 - 22.5, i * 45 + 22.5), { fill: hi ? C.clay : i % 2 ? C.sand2 : C.sand, opacity: hi ? '0.55' : '0.7', stroke: C.laterite, 'stroke-width': 1, 'stroke-opacity': '0.35' }));
  }
  out.push(circle(cx, cy, R, ink()));
  out.push(circle(cx, cy, R + 18, thin()));
  out.push(ticks(cx, cy, R, R + 18, 72, thin({ opacity: '0.4' })));
  out.push(ticks(cx, cy, R, R + 18, 8, ink({ 'stroke-width': 1.6 })));
  for (let i = 0; i < 8; i++) {
    const main = i % 2 === 0;
    const [tx, ty] = polar(cx, cy, main ? R * 0.95 : R * 0.72, i * 45);
    const [lx, ly] = polar(cx, cy, R * 0.12, i * 45 - 90);
    const [rx, ry] = polar(cx, cy, R * 0.12, i * 45 + 90);
    out.push(poly([[tx, ty], [lx, ly], [cx, cy]], { fill: i === 0 ? C.clay : C.laterite, opacity: main ? '0.9' : '0.55' }));
    out.push(poly([[tx, ty], [rx, ry], [cx, cy]], { fill: C.stone, opacity: main ? '0.7' : '0.4' }));
  }
  out.push(circle(cx, cy, R * 0.28, { fill: centre ? C.clay : C.sand, opacity: centre ? '0.5' : '1', stroke: C.laterite, 'stroke-width': 1.4 }));
  out.push(circle(cx, cy, 6, { fill: C.laterite }));
  return g({}, out);
}

/**
 * A 3BHK plan laid out along common Vastu guidance: entrance in the
 * north-east, kitchen south-east, master bedroom south-west, pooja room
 * north-east, living room towards north/east, open centre.
 */
const PLAN = {
  x: CX - 420, y: CY - 300, w: 840, h: 600,
  rooms: {
    pooja: [0.66, 0, 0.34, 0.24],
    living: [0.3, 0, 0.36, 0.42],
    entry: [0.66, 0.24, 0.34, 0.22],
    guest: [0, 0, 0.3, 0.42],
    centre: [0.3, 0.42, 0.36, 0.2],
    kitchen: [0.66, 0.46, 0.34, 0.54],
    dining: [0.3, 0.62, 0.36, 0.38],
    master: [0, 0.62, 0.3, 0.38],
    bath: [0, 0.42, 0.3, 0.2],
  },
};

function floorPlan({ highlight = [], hatch = [], marks = [], grid = false, furniture = true, x = PLAN.x, y = PLAN.y, w = PLAN.w, h = PLAN.h } = {}) {
  const out = [];
  const R = (k) => {
    const [a, b, c, d] = PLAN.rooms[k];
    return [x + a * w, y + b * h, c * w, d * h];
  };
  // Soft shadow + slab.
  out.push(rect(x + 14, y + 18, w, h, { fill: C.laterite, opacity: '0.08', filter: 'url(#softglow)' }));
  out.push(rect(x, y, w, h, { fill: '#F7F1E6' }));
  for (const k of Object.keys(PLAN.rooms)) {
    const [rx, ry, rw, rh] = R(k);
    if (highlight.includes(k)) out.push(rect(rx, ry, rw, rh, { fill: C.clay, opacity: '0.28' }));
    if (hatch.includes(k)) out.push(rect(rx, ry, rw, rh, { fill: `url(#${hatchId})` }));
    out.push(rect(rx, ry, rw, rh, thin({ opacity: '0.8', 'stroke-width': 1.4 })));
  }
  // Outer walls, thick, with the entrance gap on the east wall of the entry.
  const [ex, ey, , eh] = R('entry');
  out.push(path(`M${f(x)},${f(y)} L${f(x + w)},${f(y)} L${f(x + w)},${f(ey + eh * 0.25)} M${f(x + w)},${f(ey + eh * 0.75)} L${f(x + w)},${f(y + h)} L${f(x)},${f(y + h)} L${f(x)},${f(y)}`, ink({ 'stroke-width': 7 })));
  // Door swing.
  out.push(path(`M${f(x + w)},${f(ey + eh * 0.25)} A${f(eh * 0.5)},${f(eh * 0.5)} 0 0 0 ${f(x + w - eh * 0.5)},${f(ey + eh * 0.75)}`, thin({ 'stroke-dasharray': '3 4' })));
  out.push(line(x + w, ey + eh * 0.75, x + w - eh * 0.5, ey + eh * 0.75, ink({ 'stroke-width': 2 })));
  // Windows on north and east.
  for (const t of [0.12, 0.45]) out.push(line(x + w * t, y, x + w * (t + 0.12), y, { stroke: '#FFFFFF', 'stroke-width': 4 }), line(x + w * t, y - 5, x + w * (t + 0.12), y - 5, thin()));
  if (furniture) {
    const [mx, my, mw, mh] = R('master');
    out.push(rect(mx + mw * 0.2, my + mh * 0.25, mw * 0.55, mh * 0.6, thin({ opacity: '0.7', rx: 4 })));
    out.push(rect(mx + mw * 0.2, my + mh * 0.25, mw * 0.55, mh * 0.12, thin({ opacity: '0.7' })));
    const [kx, ky, kw, kh] = R('kitchen');
    out.push(rect(kx + kw - 46, ky + 10, 36, kh - 20, thin({ opacity: '0.7' })));
    for (const t of [0.62, 0.8]) out.push(circle(kx + kw - 28, ky + kh * t, 9, thin({ opacity: '0.8' })));
    const [lx, ly, lw, lh] = R('living');
    out.push(rect(lx + 18, ly + lh * 0.5, lw * 0.55, 34, thin({ opacity: '0.7', rx: 6 })));
    out.push(rect(lx + lw * 0.25, ly + lh * 0.25, lw * 0.3, lh * 0.18, thin({ opacity: '0.5', rx: 4 })));
    const [px, py, pw, ph] = R('pooja');
    out.push(rect(px + pw * 0.3, py + 12, pw * 0.4, 26, thin({ opacity: '0.7' })));
  }
  const [cx, cy, cw, ch] = R('centre');
  out.push(circle(cx + cw / 2, cy + ch / 2, 8, { fill: 'none', stroke: C.clay, 'stroke-width': 1.6 }));
  out.push(line(cx + cw / 2 - 16, cy + ch / 2, cx + cw / 2 + 16, cy + ch / 2, { stroke: C.clay, 'stroke-width': 1.2 }));
  out.push(line(cx + cw / 2, cy + ch / 2 - 16, cx + cw / 2, cy + ch / 2 + 16, { stroke: C.clay, 'stroke-width': 1.2 }));
  if (grid) {
    for (let i = 1; i < 3; i++) {
      out.push(line(x + (w / 3) * i, y - 40, x + (w / 3) * i, y + h + 40, { stroke: C.clay, 'stroke-width': 1.4, 'stroke-dasharray': '8 8' }));
      out.push(line(x - 40, y + (h / 3) * i, x + w + 40, y + (h / 3) * i, { stroke: C.clay, 'stroke-width': 1.4, 'stroke-dasharray': '8 8' }));
    }
    out.push(rect(x + w / 3, y + h / 3, w / 3, h / 3, { fill: C.clay, opacity: '0.12' }));
  }
  for (const [mx, my] of marks) {
    const px = x + mx * w, py = y + my * h;
    out.push(circle(px, py, 34, { fill: 'none', stroke: C.clay, 'stroke-width': 2.4 }));
    out.push(line(px - 12, py - 12, px + 12, py + 12, { stroke: C.clay, 'stroke-width': 2.4 }));
    out.push(line(px + 12, py - 12, px - 12, py + 12, { stroke: C.clay, 'stroke-width': 2.4 }));
  }
  // Dimension line along the south.
  out.push(line(x, y + h + 46, x + w, y + h + 46, thin()));
  out.push(line(x, y + h + 36, x, y + h + 56, thin()), line(x + w, y + h + 36, x + w, y + h + 56, thin()));
  return g({}, out);
}

/** Isometric projection helper: (x, y, z) in plan units → screen. */
function iso(ox, oy, s) {
  const c = Math.cos(Math.PI / 6), sn = Math.sin(Math.PI / 6);
  return (x, y, z) => [ox + (x - y) * c * s, oy + (x + y) * sn * s - z * s];
}

function isoRoom(kind) {
  const P = iso(CX, CY - 150, 1);
  const out = [];
  const Wd = 420, Dp = 420, Ht = 260;
  const face = (pts, fill, op = '1') => poly(pts.map((p) => P(...p)), { fill, opacity: op, stroke: C.laterite, 'stroke-width': 1.4, 'stroke-linejoin': 'round' });
  // Floor, back-left wall (north), back-right wall (east).
  out.push(face([[0, 0, 0], [Wd, 0, 0], [Wd, Dp, 0], [0, Dp, 0]], '#E4D6BD'));
  out.push(face([[0, 0, 0], [Wd, 0, 0], [Wd, 0, Ht], [0, 0, Ht]], '#F2EADB'));
  out.push(face([[0, 0, 0], [0, Dp, 0], [0, Dp, Ht], [0, 0, Ht]], '#E9DDC8'));
  // Floor boards.
  for (let i = 1; i < 8; i++) out.push(polyline([P(0, (Dp / 8) * i, 0), P(Wd, (Dp / 8) * i, 0)], { stroke: C.laterite, 'stroke-width': 0.8, opacity: '0.18' }));
  // Window on the north wall with a light shaft onto the floor.
  out.push(face([[140, 0, 90], [300, 0, 90], [300, 0, 210], [140, 0, 210]], '#FFF7E6'));
  out.push(poly([P(140, 0, 90), P(300, 0, 90), P(330, 220, 0), P(170, 220, 0)], { fill: '#FFF3D2', opacity: '0.55' }));
  out.push(polyline([P(220, 0, 90), P(220, 0, 210)], { stroke: C.laterite, 'stroke-width': 1.2 }));
  if (kind === 'bedroom') {
    // Bed against the south-west: head against the back (south) wall.
    out.push(face([[40, 170, 0], [40, 390, 0], [40, 390, 60], [40, 170, 60]], '#CDB797'));
    out.push(face([[40, 170, 60], [230, 170, 60], [230, 390, 60], [40, 390, 60]], '#F7F1E6'));
    out.push(face([[40, 170, 60], [40, 390, 60], [40, 390, 140], [40, 170, 140]], C.claySoft));
    out.push(face([[50, 190, 60], [110, 190, 60], [110, 370, 60], [50, 370, 60]], '#FFFFFF'));
    out.push(face([[160, 170, 60], [230, 170, 60], [230, 390, 60], [160, 390, 60]], C.clay, '0.8'));
    out.push(face([[40, 60, 0], [40, 140, 0], [40, 140, 70], [40, 60, 70]], '#BFA886'));
  } else {
    // Living: sofa on the south-west, low table, rug, plant in the north-east.
    out.push(face([[40, 120, 0], [40, 380, 0], [40, 380, 50], [40, 120, 50]], '#BFA886'));
    out.push(face([[40, 120, 50], [120, 120, 50], [120, 380, 50], [40, 380, 50]], C.claySoft));
    out.push(face([[40, 120, 50], [40, 380, 50], [40, 380, 110], [40, 120, 110]], C.clay));
    out.push(face([[150, 150, 0], [360, 150, 0], [360, 360, 0], [150, 360, 0]], C.sand2, '0.8'));
    out.push(face([[200, 200, 34], [300, 200, 34], [300, 300, 34], [200, 300, 34]], '#8C6A4A'));
    const [px, py] = P(380, 30, 0);
    out.push(el('ellipse', { cx: f(px), cy: f(py), rx: 26, ry: 12, fill: '#8C6A4A' }));
    for (let i = 0; i < 7; i++) out.push(el('ellipse', { cx: f(px + (i - 3) * 9), cy: f(py - 50 - (i % 3) * 14), rx: 10, ry: 26, fill: C.leaf, opacity: '0.85', transform: `rotate(${(i - 3) * 16} ${f(px + (i - 3) * 9)} ${f(py - 50)})` }));
  }
  // Compass in the corner of the floor.
  const [nx, ny] = P(Wd - 40, Dp + 60, 0);
  out.push(g({ opacity: '0.9' }, northArrow(nx + 90, ny + 30, 0.8)));
  return out;
}

const MOTIFS = {
  /** Vastu Purusha Mandala: 9 × 9 padas, Brahmasthan at the centre. */
  'vastu-mandala': () => {
    const out = [];
    const s = 620, x0 = CX - s / 2, y0 = CY - s / 2, c = s / 9;
    out.push(rect(x0 + 16, y0 + 20, s, s, { fill: C.laterite, opacity: '0.08', filter: 'url(#softglow)' }));
    out.push(rect(x0, y0, s, s, { fill: '#F7F1E6' }));
    for (let i = 0; i < 9; i++) for (let j = 0; j < 9; j++) {
      const outer = i === 0 || j === 0 || i === 8 || j === 8;
      const centre = i >= 3 && i <= 5 && j >= 3 && j <= 5;
      if (outer) out.push(rect(x0 + i * c, y0 + j * c, c, c, { fill: C.sand2, opacity: '0.7' }));
      if (centre) out.push(rect(x0 + i * c, y0 + j * c, c, c, { fill: C.clay, opacity: '0.18' }));
    }
    for (let i = 0; i <= 9; i++) {
      out.push(line(x0 + i * c, y0, x0 + i * c, y0 + s, thin({ opacity: i % 3 === 0 ? '0.8' : '0.4' })));
      out.push(line(x0, y0 + i * c, x0 + s, y0 + i * c, thin({ opacity: i % 3 === 0 ? '0.8' : '0.4' })));
    }
    out.push(rect(x0, y0, s, s, ink({ 'stroke-width': 3 })));
    out.push(line(x0, y0, x0 + s, y0 + s, thin({ opacity: '0.35', 'stroke-dasharray': '4 6' })));
    out.push(line(x0 + s, y0, x0, y0 + s, thin({ opacity: '0.35', 'stroke-dasharray': '4 6' })));
    out.push(circle(CX, CY, c * 1.5, { fill: 'none', stroke: C.clay, 'stroke-width': 2 }));
    out.push(circle(CX, CY, 7, { fill: C.clay }));
    out.push(northArrow(x0 + s + 120, y0 + 60));
    return out;
  },

  compass: () => [compassRose(CX, CY, 320, { highlight: ['NE'], centre: true }), northArrow(CX + 520, CY - 280)],

  entrance: () => {
    const out = [];
    // Elevation of a doorway with morning light, plus a plan inset of the NE.
    const dx = CX - 180, dy = CY - 300, dw = 320, dh = 560;
    out.push(rect(dx - 90, dy - 60, dw + 180, dh + 60, { fill: '#EFE4D0', stroke: C.laterite, 'stroke-width': 1.4, opacity: '0.95' }));
    out.push(path(`M${dx},${dy + dh} L${dx},${dy + 120} Q${dx + dw / 2},${dy - 40} ${dx + dw},${dy + 120} L${dx + dw},${dy + dh} Z`, { fill: '#FFF4DC' }));
    out.push(poly([[dx, dy + dh], [dx + dw, dy + dh], [dx + dw + 220, H], [dx - 120, H]], { fill: '#FFF0CC', opacity: '0.65' }));
    out.push(path(`M${dx},${dy + dh} L${dx},${dy + 120} Q${dx + dw / 2},${dy - 40} ${dx + dw},${dy + 120} L${dx + dw},${dy + dh}`, ink({ 'stroke-width': 5 })));
    // Open door leaf.
    out.push(poly([[dx + dw, dy + 130], [dx + dw + 90, dy + 160], [dx + dw + 90, dy + dh + 20], [dx + dw, dy + dh]], { fill: '#8C5A3A', stroke: C.laterite, 'stroke-width': 1.6 }));
    for (let i = 0; i < 4; i++) out.push(rect(dx + dw + 20, dy + 200 + i * 90, 50, 64, thin({ opacity: '0.6' })));
    out.push(rect(dx - 30, dy + dh, dw + 60, 18, { fill: C.stone, stroke: C.laterite, 'stroke-width': 1.4 }));
    // Threshold rangoli dots.
    for (let i = 0; i < 9; i++) out.push(circle(dx + 20 + i * 35, dy + dh + 40, 4, { fill: C.clay, opacity: '0.7' }));
    out.push(compassRose(CX + 430, CY - 110, 130, { highlight: ['NE', 'N', 'E'] }));
    return out;
  },

  kitchen: () => {
    const out = [];
    out.push(compassRose(CX - 360, CY, 190, { highlight: ['SE'] }));
    // Kitchen plan: counter L along south & east, stove in SE, sink towards NE.
    const x = CX - 60, y = CY - 250, w = 520, h = 500;
    out.push(rect(x + 12, y + 16, w, h, { fill: C.laterite, opacity: '0.08', filter: 'url(#softglow)' }));
    out.push(rect(x, y, w, h, { fill: '#F7F1E6', ...ink({ 'stroke-width': 6 }) }));
    out.push(rect(x, y + h - 90, w, 90, { fill: C.sand2, stroke: C.laterite, 'stroke-width': 1.4 }));
    out.push(rect(x + w - 90, y, 90, h, { fill: C.sand2, stroke: C.laterite, 'stroke-width': 1.4 }));
    out.push(rect(x + w - 90, y + h - 190, 90, 190, { fill: C.clay, opacity: '0.3' }));
    for (const [px, py] of [[x + w - 45, y + h - 140], [x + w - 45, y + h - 60], [x + w - 140, y + h - 45]]) {
      out.push(circle(px, py, 22, ink({ 'stroke-width': 1.6 })), circle(px, py, 11, thin()));
      out.push(circle(px, py - 30, 26, { fill: C.saffron, opacity: '0.2', filter: 'url(#softglow)' }));
    }
    out.push(rect(x + w - 80, y + 70, 70, 110, { fill: '#DDE7E6', stroke: C.laterite, 'stroke-width': 1.4, rx: 10 }));
    out.push(circle(x + w - 45, y + 125, 5, { fill: C.laterite }));
    // Cook facing east.
    out.push(circle(x + w - 190, y + h - 150, 18, { fill: C.laterite, opacity: '0.8' }));
    out.push(path(`M${x + w - 170},${y + h - 150} l60,0 m-14,-10 l14,10 l-14,10`, ink({ 'stroke-width': 2.4, stroke: C.clay })));
    out.push(northArrow(x + w + 90, y + 30, 0.8));
    return out;
  },

  'iso-room': ({ focus = 'living' }) => isoRoom(focus),

  'pooja-alcove': () => {
    const out = [];
    const x = CX - 70, y = CY - 250, w = 380, h = 470;
    out.push(rect(x - 30, y - 30, w + 60, h + 80, { fill: '#EFE4D0', stroke: C.laterite, 'stroke-width': 1.4 }));
    out.push(path(`M${x},${y + h} L${x},${y + 150} Q${x + w / 2},${y - 50} ${x + w},${y + 150} L${x + w},${y + h} Z`, { fill: '#3A2418' }));
    out.push(path(`M${x},${y + h} L${x},${y + 150} Q${x + w / 2},${y - 50} ${x + w},${y + 150} L${x + w},${y + h}`, ink({ 'stroke-width': 5 })));
    for (let i = 0; i < 3; i++) out.push(rect(x - 20 - i * 14, y + h + i * 14, w + 40 + i * 28, 14, { fill: i % 2 ? C.sand2 : C.stone, stroke: C.laterite, 'stroke-width': 1 }));
    out.push(diya(x + w / 2 - 70, y + h - 30, 0.9));
    out.push(compassRose(CX - 400, CY + 20, 170, { highlight: ['NE'] }));
    return out;
  },

  apartment: () => {
    const out = [];
    const P = iso(CX + 80, CY + 20, 1);
    const face = (pts, fill, op = '1', sw = 1.2) => poly(pts.map((p) => P(...p)), { fill, opacity: op, stroke: C.laterite, 'stroke-width': sw, 'stroke-linejoin': 'round' });
    const Wd = 300, Dp = 220, fh = 56, floors = 7;
    for (let k = 0; k < floors; k++) {
      const z = k * fh;
      const hi = k === 4;
      out.push(face([[0, Dp, z], [Wd, Dp, z], [Wd, Dp, z + fh], [0, Dp, z + fh]], hi ? C.claySoft : '#EDE3D1'));
      out.push(face([[Wd, 0, z], [Wd, Dp, z], [Wd, Dp, z + fh], [Wd, 0, z + fh]], hi ? C.clay : '#D8C9AE', hi ? '0.85' : '1'));
      for (let i = 0; i < 4; i++) out.push(face([[40 + i * 64, Dp, z + 16], [80 + i * 64, Dp, z + 16], [80 + i * 64, Dp, z + 46], [40 + i * 64, Dp, z + 46]], '#FFF6E2', '0.9', 0.8));
      for (let i = 0; i < 3; i++) out.push(face([[Wd, 30 + i * 64, z + 16], [Wd, 70 + i * 64, z + 16], [Wd, 70 + i * 64, z + 46], [Wd, 30 + i * 64, z + 46]], '#F3E7D0', '0.8', 0.8));
    }
    out.push(face([[0, 0, floors * fh], [Wd, 0, floors * fh], [Wd, Dp, floors * fh], [0, Dp, floors * fh]], '#F7F1E6'));
    out.push(compassRose(CX - 420, CY + 120, 150, { highlight: ['N', 'E', 'NE'] }));
    return out;
  },

  'plan-grid': () => [floorPlan({ grid: true, furniture: true }), northArrow(PLAN.x + PLAN.w + 110, PLAN.y + 40)],

  'plan-mistakes': () => [
    floorPlan({ hatch: ['bath'], marks: [[0.83, 0.12], [0.48, 0.52], [0.15, 0.8]], furniture: true }),
    northArrow(PLAN.x + PLAN.w + 110, PLAN.y + 40),
  ],

  'plan-rooms': ({ focus = [] }) => [floorPlan({ highlight: [].concat(focus) }), northArrow(PLAN.x + PLAN.w + 110, PLAN.y + 40)],
};

export function drawVastu(motif, opts) {
  const fn = MOTIFS[motif];
  if (!fn) throw new Error(`Unknown vastu motif "${motif}"`);
  return [hatchDef, ...[].concat(fn(opts))];
}

export const VASTU_MOTIFS = Object.keys(MOTIFS);
