#!/usr/bin/env node
// Run: node scripts/make-pwa-icons.mjs
// Makes the installed-app icons from the logo (public/images/ceylife-logo.svg, used as supplied) on a white square:
//   public/icons/icon-192.png, icon-512.png          "any" icons (logo about 72% of the width)
//   public/icons/icon-maskable-512.png               "maskable" icon (logo about 52% of the width, so the Android mask can
//                                                    crop to a circle or squircle without touching it: inside the 80% safe zone)
//   public/icons/apple-touch-icon.png (180)          iOS home screen icon
// The white is the `surface` token (#FFFFFF).
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const logo = path.join(root, "public", "images", "ceylife-logo.svg");
const outDir = path.join(root, "public", "icons");
const WHITE = { r: 255, g: 255, b: 255, alpha: 1 };

async function makeIcon(file, size, logoShare) {
  const logoWidth = Math.round(size * logoShare);
  const logoPng = await sharp(logo, { density: 600 }).resize({ width: logoWidth }).png().toBuffer();
  const meta = await sharp(logoPng).metadata();
  await sharp({ create: { width: size, height: size, channels: 4, background: WHITE } })
    .composite([{ input: logoPng, left: Math.round((size - meta.width) / 2), top: Math.round((size - meta.height) / 2) }])
    .png()
    .toFile(path.join(outDir, file));
  console.log(file, size + "x" + size, "logo", meta.width + "x" + meta.height);
}

await mkdir(outDir, { recursive: true });
await makeIcon("icon-192.png", 192, 0.72);
await makeIcon("icon-512.png", 512, 0.72);
await makeIcon("icon-maskable-512.png", 512, 0.52);
await makeIcon("apple-touch-icon.png", 180, 0.72);
