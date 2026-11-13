#!/usr/bin/env node
// Run: npm run check:hero
// Hero contrast sampler: rebuilds the hero background (photo cover-fit + scrim) for several viewports, for EVERY hero image of the
// slideshow, and finds the brightest background pixel behind each block of text, then tests the text colour against it.
// Up to 768px wide the PHONE layout is rebuilt: a near-black hero with the headline, text and buttons on it, the photo (a portrait crop up to
// 599px, the full photo from 600px) filling the area below them (from `photoTop` down), a 96px fade from the near-black into the photo at its
// top, and a 208px dark fade at its bottom behind the trust facts. From 769px the
// desktop layout is rebuilt (the trust row is full width along the bottom from tablet up). The text line boxes in CASES were measured in
// the browser at each width (hero-relative x, y, w, h). Re-measure them (and `photoTop`) if the layout or copy changes.
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

// Every hero image of the slideshow (keep in sync with home.hero.images in src/content/home.ts). `desktop`, `tablet` and `mobile` are the
// image anchors (object-position, as fractions) from `focus` in the content file: `mobile` is for the portrait crop `mobileFile`
// (up to 599px), `tablet` for the full photo (600px to 768px), `desktop` for the full photo (769px and up).
const HERO_DIR = path.join(root, "public", "images", "Hero");
const IMAGES = [
  { name: "hero-family-sunset.jpeg", mobileFile: "mobile/sunset-phone.jpg", desktop: [0.55, 0.75], tablet: [0.6, 0.85], mobile: [0.5, 1] },
  { name: "Golden-Hour Family Embrace 1.png", mobileFile: "mobile/golden-hour-phone.jpg", desktop: [0.7, 0.4], tablet: [0.88, 0.4], mobile: [0.5, 0] },
  { name: "Joyful Family in the Sunlit Park 1.png", mobileFile: "mobile/sunlit-park-phone.jpg", desktop: [0.7, 0.4], tablet: [0.88, 0.4], mobile: [0.5, 0] },
  { name: "Joyful Family Soccer in the Park 1.png", mobileFile: "mobile/soccer-park-phone.jpg", desktop: [0.65, 0.5], tablet: [0.88, 0.5], mobile: [0.5, 0] },
];

// Scrim tokens (tokens.css): footer-bg colour 31,29,33.
const SCRIM = { r: 31, g: 29, b: 33 };
const DESKTOP = [[0, 0.9], [0.45, 0.8], [0.72, 0.3], [1, 0]];
const MOBILE = [[0, 0.9], [0.55, 0.85], [0.78, 0], [1, 0]];
// From tablet up (md) a second scrim runs from the bottom edge upward (bg-hero-scrim-bottom): fraction of the hero height measured from the bottom.
const BOTTOM = [[0, 0.9], [0.12, 0.8], [0.26, 0.3], [0.4, 0]];
// Phone hero (768px and below), see tokens.css: the photo area starts at `photoTop` (below the buttons) and runs to the bottom. The fade
// at its top (--size-hero-fade, 96px) goes from the near-black to clear; the one at its bottom (--size-hero-bottom-fade, 208px) from clear
// to 80% near-black. The stops are fractions of each band.
const PHONE_FADE = 96, PHONE_BOTTOM_FADE = 208;
const PHONE_TOP = [[0, 1], [0.1, 0.97], [0.2, 0.896], [0.3, 0.784], [0.4, 0.648], [0.5, 0.5], [0.6, 0.352], [0.7, 0.216], [0.8, 0.104], [0.9, 0.028], [1, 0]];
const PHONE_BOTTOM = [[0, 0.8], [0.55, 0.8], [0.66, 0.74], [0.76, 0.6], [0.84, 0.42], [0.91, 0.22], [0.96, 0.08], [1, 0]]; // from the bottom edge upward
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
  { vw: 320, W: 320, H: 826, phone: true, photoTop: 474, h1: [[16,48,269,40],[16,90,229,40],[16,131,230,40],[16,173,92,40]], p: [[16,227,252,21],[16,252,267,21],[16,277,261,21],[16,302,283,21]], btn: [[16,410,288,48]], ul: [[44,672,138,18],[44,691,70,18],[44,727,172,18],[44,762,171,18],[44,782,158,18]] },
  { vw: 360, W: 360, H: 724, phone: true, photoTop: 372, h1: [[16,48,269,40],[16,90,328,40],[16,131,228,40]], p: [[16,186,320,21],[16,211,308,21],[16,235,295,21],[16,260,141,21]], btn: [[186,308,158,48]], ul: [[44,590,210,18],[44,625,172,18],[44,661,171,18],[44,680,158,18]] },
  { vw: 390, W: 390, H: 724, phone: true, photoTop: 372, h1: [[16,48,269,40],[16,90,328,40],[16,131,228,40]], p: [[16,186,320,21],[16,211,337,21],[16,235,334,21],[16,260,72,21]], btn: [[201,308,173,48]], ul: [[44,590,210,18],[44,625,172,18],[44,661,246,18],[44,680,83,18]] },
  { vw: 430, W: 430, H: 760, phone: true, photoTop: 347, h1: [[16,48,384,40],[16,90,350,40],[16,131,92,40]], p: [[16,186,365,21],[16,211,396,21],[16,235,305,21]], btn: [[221,283,193,48]], ul: [[44,626,210,18],[44,661,172,18],[44,697,246,18],[44,716,83,18]] },
  { vw: 600, W: 600, H: 760, phone: true, photoTop: 281, h1: [[16,48,503,40],[16,90,327,40]], p: [[16,144,555,21],[16,169,513,21]], btn: [[306,217,278,48]], ul: [[44,645,210,18],[44,681,172,18],[44,716,331,18]] },
  { vw: 768, W: 768, H: 760, phone: true, photoTop: 281, h1: [[16,48,603,40],[16,90,228,40]], p: [[16,144,597,21],[16,169,472,21]], btn: [[342,217,314,48]], ul: [[44,645,210,18],[44,681,172,18],[44,716,331,18]] },
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
      const mobile = c.vw < 1024;
      // The photo box: the whole hero on larger screens; on phones the bottom part of it (crop up to 599px, full photo from 600px).
      const phone = !!c.phone;
      const boxTop = phone ? c.photoTop : 0, boxH = c.H - boxTop;
      const cropFile = phone && c.vw < 600;
      const file = cropFile ? path.join(HERO_DIR, image.mobileFile) : SRC;
      const meta = cropFile ? await sharp(file).metadata() : { width: PW, height: PH };
      const [px, py] = phone ? (cropFile ? image.mobile : image.tablet) : image.desktop;
      const scale = Math.max(c.W / meta.width, boxH / meta.height);
      const sw = Math.round(meta.width * scale), sh = Math.round(meta.height * scale);
      const offX = Math.round((sw - c.W) * px), offY = Math.round((sh - boxH) * py);
      const { data } = await sharp(file).resize(sw, sh, { kernel: "cubic" }).extract({ left: offX, top: offY, width: c.W, height: boxH }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
      // Blend the scrim(s) over the photo (on phones the hero behind the photo box is the near-black itself).
      const L = new Float32Array(c.W * c.H);
      for (let y = 0; y < c.H; y++) {
        for (let x = 0; x < c.W; x++) {
          const i = ((y - boxTop) * c.W + x) * 3;
          const inPhoto = y >= boxTop;
          const pr = inPhoto ? data[i] : SCRIM.r, pg = inPhoto ? data[i + 1] : SCRIM.g, pb = inPhoto ? data[i + 2] : SCRIM.b;
          const a1 = phone ? (y < boxTop ? 1 : alphaAt(PHONE_TOP, (y - boxTop) / PHONE_FADE)) : mobile ? alphaAt(M, y / c.H) : alphaAt(D, x / c.W);
          const a2 = phone ? alphaAt(PHONE_BOTTOM, (c.H - 1 - y) / PHONE_BOTTOM_FADE) : c.vw >= 769 ? alphaAt(BOTTOM, 1 - y / c.H) : 0;
          const a = 1 - (1 - a1) * (1 - a2);
          const r = pr * (1 - a) + SCRIM.r * a, g = pg * (1 - a) + SCRIM.g * a, b = pb * (1 - a) + SCRIM.b * a;
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
      console.log(`${c.vw}px wide (hero ${c.W}x${c.H}, ${phone ? `phone layout, ${cropFile ? "portrait crop" : "full photo"}` : "desktop layout"}, photo ${sw}x${sh}, offset ${offX},${offY}, scrim ${phone || mobile ? "top-to-bottom" : "left-to-right"})`);
      console.log("  " + row("headline", c.h1, WHITE));
      console.log("  " + row("support", c.p, FOOT));
      if (c.btn) console.log("  " + row("button", c.btn.map(([x, y, w, h]) => [x + 14, y + 12, w - 28, h - 24]), WHITE));
      console.log("  " + row("trust row", c.ul, WHITE));

    }
    worstPerImage[image.name] = worstImage;
  }

  console.log("\nWorst text ratio per image:");
  for (const [name, v] of Object.entries(worstPerImage)) console.log(`  ${name.padEnd(42)} ${v.toFixed(2)}:1 ${v >= 4.5 ? "PASS" : "FAIL"}`);
  console.log(`\nWorst brightest-pixel text ratio over all images: ${worst.toFixed(2)}:1 (needs 4.5:1)`);
  if (worst < 4.5) process.exitCode = 1;
})();
