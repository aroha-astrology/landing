/**
 * Trig for server-rendered SVG coordinates. Node and the browser can differ
 * in the last bit of Math.cos/Math.sin, which makes React report a
 * hydration mismatch on every computed attribute. Rounding to 6 decimals
 * (far below a pixel) makes both sides produce identical numbers.
 */
const round = (n: number) => Math.round(n * 1e6) / 1e6;
export const cos = (a: number) => round(Math.cos(a));
export const sin = (a: number) => round(Math.sin(a));
