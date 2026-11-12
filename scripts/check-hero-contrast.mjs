#!/usr/bin/env node
// Run: npm run check:hero
// Hero contrast sampler: rebuilds the hero background (photo cover-fit + scrim) for several viewports, for EVERY hero image of the
// slideshow, and finds the brightest background pixel behind each block of text, then tests the text colour against it.
// (The trust row is full width along the bottom from tablet up, so it is sampled there.) The text line boxes in CASES were measured in
// the browser at each width (hero-relative x, y, w, h).
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

// Every hero image of the slideshow (keep in sync with home.hero.images in src/content/home.ts). `desktop` and `mobile` are the
// image anchors (object-position, as fractions); without a `focus` in the content file the --hero-position tokens are used
// (55% 75% on larger screens, 57% 80% on phones).
const HERO_DIR = path.join(root, "public", "images", "Hero");
const IMAGES = [
  { name: "hero-family-sunset.jpeg", desktop: [0.55, 0.75], mobile: [0.57, 0.8] },
  { name: "Golden-Hour Family Embrace 1.png", desktop: [0.7, 0.4], mobile: [0.76, 0.4] },
  { name: "Joyful Family in the Sunlit Park 1.png", desktop: [0.7, 0.4], mobile: [0.64, 0.4] },
  { name: "Joyful Family Soccer in the Park 1.png", desktop: [0.65, 0.5], mobile: [0.62, 0.5] },
];

// Scrim tokens (tokens.css): footer-bg colour 31,29,33.
const SCRIM = { r: 31, g: 29, b: 33 };
const DESKTOP = [[0, 0.9], [0.45, 0.8], [0.72, 0.3], [1, 0]];
const MOBILE = [[0, 0.9], [0.55, 0.85], [0.78, 0], [1, 0]];
// From tablet up (md) a second scrim runs from the bottom edge upward (bg-hero-scrim-bottom): fraction of the hero height measured from the bottom.
const BOTTOM = [[0, 0.9], [0.12, 0.8], [0.26, 0.3], [0.4, 0]];
const args = process.argv.slice(2);
const overrides = {};
for (const a of args) { const [k, v] = a.split("="); overrides[k] = JSON.parse(v); }
const D = overrides.desktop || DESKTOP;
const M = overrides.mobile || MOBILE;

const alphaAt = (stops, t) => {
  for (let i = 1; i < stops.length; i++) {
    if (t <= stops[i][0]) {
      const [t0, a0] = stops[i - 1], [t1, a1] = stops[i];
      return a0 + ((a1 - a0) * (t - t0)) / (t1 - t0 || 1);
    }
  }
  return stops[stops.length - 1][1];
};
const lin = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
const lum = (r, g, b) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const ratio = (l1, l2) => (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
const WHITE = lum(255, 255, 255), FOOT = lum(0xf3, 0xf1, 0xf2);

// Text line boxes [x, y, w, h] relative to the hero, measured in the browser.
const CASES = [
  { vw: 390, W: 390, H: 1070, h1: [[16,46,287,55],[16,99,308,55],[16,152,286,55],[16,205,223,55]], p: [[16,278,333,22],[16,306,336,22],[16,333,342,22],[16,361,186,22]], ul: [[48,509,240,20],[48,546,197,20],[48,583,281,20],[48,608,184,20]] },
  { vw: 768, W: 753, H: 835, h1: [[24,240,602,55],[24,293,516,55]], p: [[24,366,625,22],[24,394,578,22]], ul: [[56,712,240,20],[532,712,197,20],[56,749,467,20]] },
  { vw: 1280, W: 1265, H: 727, h1: [[56,156,461,71],[56,223,562,71],[56,290,391,71]], p: [[56,378,625,22],[56,406,578,22]], ul: [[88,641,240,20],[436,641,197,20],[741,641,467,20]] },
  { vw: 1440, W: 1425, H: 827, h1: [[136,206,461,71],[136,273,562,71],[136,340,391,71]], p: [[136,428,625,22],[136,456,578,22]], ul: [[168,741,240,20],[516,741,197,20],[821,741,467,20]] },
  { vw: 1920, W: 1905, H: 880, h1: [[376,233,461,71],[376,300,562,71],[376,367,391,71]], p: [[376,455,625,22],[376,483,578,22]], ul: [[408,794,240,20],[756,794,197,20],[1061,794,467,20]] },
];

(async () => {
  let worst = 99;
  const worstPerImage = {};

  for (const image of IMAGES) {
    const SRC = path.join(HERO_DIR, image.name);
    const { width: PW, height: PH } = await sharp(SRC).metadata();
    console.log(`\n==== ${image.name} (${PW} x ${PH})`);
    let worstImage = 99;

    for (const c of CASES) {
      const mobile = c.vw < 1024; const photoMobile = c.vw < 768;
      const [px, py] = photoMobile ? image.mobile : image.desktop;
      const scale = Math.max(c.W / PW, c.H / PH);
      const sw = Math.round(PW * scale), sh = Math.round(PH * scale);
      const offX = Math.round((sw - c.W) * px), offY = Math.round((sh - c.H) * py);
      const { data } = await sharp(SRC).resize(sw, sh, { kernel: "cubic" }).extract({ left: offX, top: offY, width: c.W, height: c.H }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
      // Blend the scrim.
      const L = new Float32Array(c.W * c.H);
      for (let y = 0; y < c.H; y++) {
        for (let x = 0; x < c.W; x++) {
          const i = (y * c.W + x) * 3;
          const a1 = mobile ? alphaAt(M, y / c.H) : alphaAt(D, x / c.W);
          const a2 = c.vw >= 768 ? alphaAt(BOTTOM, 1 - y / c.H) : 0;
          const a = 1 - (1 - a1) * (1 - a2);
          const r = data[i] * (1 - a) + SCRIM.r * a, g = data[i + 1] * (1 - a) + SCRIM.g * a, b = data[i + 2] * (1 - a) + SCRIM.b * a;
          L[y * c.W + x] = lum(r, g, b);
        }
      }
      const stat = (boxes) => {
        let max = 0; const all = [];
        for (const [x, y, w, h] of boxes) {
          for (let yy = Math.max(0, y - 2); yy < Math.min(c.H, y + h + 2); yy++) for (let xx = Math.max(0, x - 2); xx < Math.min(c.W, x + w + 2); xx++) { const v = L[yy * c.W + xx]; if (v > max) max = v; all.push(v); }
        }
        all.sort((a, b) => a - b);
        return { max, p99: all[Math.floor(all.length * 0.99)] };
      };
      const row = (name, boxes, text) => {
        const s = stat(boxes);
        const cr = ratio(text, s.max), cr99 = ratio(text, s.p99);
        worst = Math.min(worst, cr);
        worstImage = Math.min(worstImage, cr);
        return `${name.padEnd(9)} brightest-px ${cr.toFixed(2)}:1 ${cr >= 4.5 ? "PASS" : "FAIL"}   (99th pct ${cr99.toFixed(2)}:1)`;
      };
      console.log(`${c.vw}px wide (hero ${c.W}x${c.H}, photo ${sw}x${sh}, offset ${offX},${offY}, scrim ${mobile ? "top-to-bottom" : "left-to-right"})`);
      console.log("  " + row("headline", c.h1, WHITE));
      console.log("  " + row("support", c.p, FOOT));
      console.log("  " + row("trust row", c.ul, WHITE));

    }
    worstPerImage[image.name] = worstImage;
  }

  console.log("\nWorst text ratio per image:");
  for (const [name, v] of Object.entries(worstPerImage)) console.log(`  ${name.padEnd(42)} ${v.toFixed(2)}:1 ${v >= 4.5 ? "PASS" : "FAIL"}`);
  console.log(`\nWorst brightest-pixel text ratio over all images: ${worst.toFixed(2)}:1 (needs 4.5:1)`);
  if (worst < 4.5) process.exitCode = 1;
})();
