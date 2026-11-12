#!/usr/bin/env node
/**
 * Pink scan.  Run:  npm run check:pink
 *
 * Finds every colour in the project's source files (hex, rgb()/rgba()) that is a light, red-hued tint ("pink"): hue in the
 * red range (330 to 360 or 0 to 20 degrees), lightness above 85% and a visible amount of colour (saturation of 8% or
 * more). Warm stone neutrals (hue about 35 to 45 degrees) and the maroon brand colour do not match. Exits with code 1 if
 * anything is found. The logo SVG is scanned too, and the scan lists where each match is.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SKIP = new Set(["node_modules", ".next", ".git", "scripts"]);

function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    if (SKIP.has(entry)) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) yield* walk(full);
    else if (/\.(css|ts|tsx|md|svg|mjs)$/.test(entry)) yield full;
  }
}

function hsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  const l = (max + min) / 2;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60; if (h < 0) h += 360;
  }
  return { h, s, l };
}
const isPink = ({ h, s, l }) => (h >= 330 || h <= 20) && l > 0.85 && s >= 0.08;

let found = 0;
for (const file of walk(root)) {
  const text = readFileSync(file, "utf8");
  text.split(/\r?\n/).forEach((line, i) => {
    for (const m of line.matchAll(/#([0-9a-fA-F]{6})\b|#([0-9a-fA-F]{3})\b/g)) {
      let hex = m[1] || m[2].split("").map((c) => c + c).join("");
      const v = [0, 2, 4].map((k) => parseInt(hex.slice(k, k + 2), 16));
      if (isPink(hsl(...v))) { found++; console.log(`${relative(root, file)}:${i + 1}  #${hex}  ${line.trim().slice(0, 100)}`); }
    }
    for (const m of line.matchAll(/rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)/g)) {
      const v = [m[1], m[2], m[3]].map(Number);
      if (isPink(hsl(...v))) { found++; console.log(`${relative(root, file)}:${i + 1}  rgb(${v.join(" ")})  ${line.trim().slice(0, 100)}`); }
    }
    if (/brand-tint/.test(line) && !/check-no-pink/.test(file)) { found++; console.log(`${relative(root, file)}:${i + 1}  brand-tint token still referenced`); }
  });
}
console.log(found === 0 ? "No pink found." : `\n${found} pink value(s) found.`);
process.exit(found === 0 ? 1 - 1 : 1);
