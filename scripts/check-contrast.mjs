#!/usr/bin/env node
/**
 * Contrast checker.  Run:  npm run check:contrast
 *
 * Reads the colour tokens straight from src/styles/tokens.css, tests every
 * text/background (and UI component) pairing the components use against
 * WCAG 2.2 AA, and prints a pass/fail report. Exits with code 1 if anything
 * required fails, so it can also run in CI.
 *
 *   AA text           4.5:1  (normal text)
 *   AA large / UI     3:1    (text 24px+, icons, input borders, focus rings)
 *
 * When you add a new colour pairing to a component, add it to PAIRS below.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const tokensPath = join(dirname(fileURLToPath(import.meta.url)), "..", "src", "styles", "tokens.css");
const css = readFileSync(tokensPath, "utf8");

// --- Read every `--color-name: #rrggbb;` token --------------------------------
const colours = {};
for (const match of css.matchAll(/--color-([a-z-]+):\s*(#[0-9a-fA-F]{6})\s*;/g)) {
  colours[match[1]] = match[2].toLowerCase();
}
colours.focus = colours.brand; // --color-focus is an alias of brand

// Translucent white tints used on the maroon band (see tokens.css). We test the colour they
// produce when laid over the maroon background.
const blendOver = (fgHex, bgHex, alpha) => {
  const mix = (i) => Math.round(parseInt(fgHex.slice(1 + i * 2, 3 + i * 2), 16) * alpha + parseInt(bgHex.slice(1 + i * 2, 3 + i * 2), 16) * (1 - alpha));
  return "#" + [0, 1, 2].map((i) => mix(i).toString(16).padStart(2, "0")).join("");
};
colours["on-brand-hover"] = blendOver("#ffffff", colours.brand, 0.12);
colours["on-brand-pressed"] = blendOver("#ffffff", colours.brand, 0.2);
// The same white tints, laid over the dark section / footer colour (inverse links hovered on a dark section).
colours["on-dark-hover"] = blendOver("#ffffff", colours["footer-bg"], 0.12);
colours["on-dark-pressed"] = blendOver("#ffffff", colours["footer-bg"], 0.2);

// --- WCAG maths ---------------------------------------------------------------
const channel = (hex, i) => {
  const v = parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16) / 255;
  return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};
const luminance = (hex) => 0.2126 * channel(hex, 0) + 0.7152 * channel(hex, 1) + 0.0722 * channel(hex, 2);
const ratio = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

const TEXT = 4.5;
const UI = 3;

// --- Pairings: [group, label, foreground token, background token, minimum] ----
const PAIRS = [
  // App-style bottom bar (standalone mode only) and install card
  ["PWA", "Bottom bar label (not current) on bar", "ink-muted", "surface", TEXT],
  ["PWA", "Bottom bar label (current) on bar", "brand", "surface", TEXT],
  ["PWA", "Bottom bar label (current) pressed", "brand", "brand-tint-strong", TEXT],
  ["PWA", "Bottom bar label on hover tint", "ink-muted", "brand-tint", TEXT],
  // App-style bottom bar (standalone mode only)
  ["PWA", "Bottom bar label (other tabs) on bar", "ink-muted", "surface", TEXT],
  ["PWA", "Bottom bar label (current tab) on bar", "brand", "surface", TEXT],
  ["PWA", "Bottom bar label (current tab) pressed", "brand", "brand-tint-strong", TEXT],
  ["PWA", "Bottom bar label on hover tint", "ink-muted", "brand-tint", TEXT],
  // Body text
  ["Text", "Body text on page", "ink", "surface-alt", TEXT],
  ["Text", "Body text on card / header", "ink", "surface", TEXT],
  ["Text", "Body text on sunken surface", "ink", "surface-sunken", TEXT],
  ["Text", "Nav item on hover tint", "ink", "surface-alt", TEXT],
  ["Text", "Text on pressed tint", "ink", "border", TEXT],
  ["Text", "Muted text on page", "ink-muted", "surface-alt", TEXT],
  ["Text", "Muted text / placeholder on card", "ink-muted", "surface", TEXT],
  ["Text", "Muted text on sunken surface", "ink-muted", "surface-sunken", TEXT],
  ["Text", "Muted text on hover tint", "ink-muted", "surface-alt", TEXT],
  ["Text", "Muted text on pressed tint", "ink-muted", "border", TEXT],

  // Brand
  ["Brand", "White label on primary button", "ink-on-brand", "brand", TEXT],
  ["Brand", "White label on primary hover", "ink-on-brand", "brand-hover", TEXT],
  ["Brand", "White label on primary pressed", "ink-on-brand", "brand-pressed", TEXT],
  ["Brand", "Maroon text on page", "brand", "surface-alt", TEXT],
  ["Brand", "Maroon text on card / header", "brand", "surface", TEXT],
  ["Brand", "Maroon text on hover tint", "brand", "surface-alt", TEXT],
  ["Brand", "Maroon text on pressed tint", "brand", "border", TEXT],
  ["Brand", "Maroon text link hover on card", "brand-hover", "surface", TEXT],
  ["Brand", "Maroon text link hover on page", "brand-hover", "surface-alt", TEXT],
  ["Brand", "Maroon text link pressed on card", "brand-pressed", "surface", TEXT],
  ["Brand", "Maroon text on neutral tag", "brand", "surface-sunken", TEXT],

  // Status
  ["Status", "Success text on tint (tag)", "success", "success-tint", TEXT],
  ["Status", "Success text on card", "success", "surface", TEXT],
  ["Status", "Warning text on tint (tag)", "warning", "warning-tint", TEXT],
  ["Status", "Warning text on card", "warning", "surface", TEXT],
  ["Status", "Error text on tint (tag)", "error", "error-tint", TEXT],
  ["Status", "Error message on card", "error", "surface", TEXT],
  ["Status", "Error message on page", "error", "surface-alt", TEXT],

  // Tooltip
  ["Tooltip", "Tooltip text (white on ink)", "ink-on-brand", "ink", TEXT],

  // Dark footer
  ["Dark footer", "Footer headings and hovered links", "footer-text", "footer-bg", TEXT],
  ["Dark footer", "Footer links and body text", "footer-muted", "footer-bg", TEXT],
  ["Dark footer", "Footer icons (social, contact)", "footer-muted", "footer-bg", UI],
  ["Dark footer", "Hovered social icon", "footer-text", "footer-bg", UI],
  ["Dark footer", "Footer focus ring", "footer-text", "footer-bg", UI],
  ["Dark footer", "Chat button white focus ring on footer", "surface", "footer-bg", UI],

  // Dark sections (Why families trust us, the app section): the same warm near-black as the footer, white text.
  ["Dark sections", "White heading and text on dark", "ink-on-brand", "footer-bg", TEXT],
  ["Dark sections", "White link label hovered (inverse text link)", "ink-on-brand", "on-dark-hover", TEXT],
  ["Dark sections", "White link label pressed", "ink-on-brand", "on-dark-pressed", TEXT],
  ["Dark sections", "White ticks and icons on dark", "ink-on-brand", "footer-bg", UI],
  ["Dark sections", "White focus ring on dark", "ink-on-brand", "footer-bg", UI],
  ["Dark sections", "Stats: prefix and suffix (brand-tint-strong) on dark", "brand-tint-strong", "footer-bg", TEXT],
  ["Dark sections", "Stats: muted label (footer-muted) on dark", "footer-muted", "footer-bg", TEXT],
  ["Dark sections", "Recognition line (footer-text) on dark", "footer-text", "footer-bg", TEXT],
  ["Dark sections", "Maroon label on white store button", "brand", "surface", TEXT],
  ["Dark sections", "Maroon number on white stat card", "brand", "surface", TEXT],
  ["Dark sections", "Muted label on white stat card", "ink-muted", "surface", TEXT],

  // Light stats strip (the alternative look of "Why families trust us": a white section, maroon numbers)
  ["Light stats strip", "Maroon number, prefix and suffix on white", "brand", "surface", TEXT],
  ["Light stats strip", "Muted label on white", "ink-muted", "surface", TEXT],
  ["Light stats strip", "Body text on white", "ink", "surface", TEXT],

  // Soft pink (brand-tint) surfaces: hover backgrounds, tiles, cards, chips and the claims section
  ["Pink (brand-tint)", "Body text on pink", "ink", "brand-tint", TEXT],
  ["Pink (brand-tint)", "Body text on pressed pink", "ink", "brand-tint-strong", TEXT],
  ["Pink (brand-tint)", "Muted text on pink", "ink-muted", "brand-tint", TEXT],
  ["Pink (brand-tint)", "Muted text on pressed pink", "ink-muted", "brand-tint-strong", TEXT],
  ["Pink (brand-tint)", "Maroon text and links on pink", "brand", "brand-tint", TEXT],
  ["Pink (brand-tint)", "Maroon text on pressed pink", "brand", "brand-tint-strong", TEXT],
  ["Pink (brand-tint)", "Maroon link hover on pink", "brand-hover", "brand-tint", TEXT],
  ["Pink (brand-tint)", "Maroon icon on pink tile", "brand", "brand-tint", UI],
  ["Pink (brand-tint)", "Maroon arrow on pink circle", "brand", "brand-tint", UI],
  ["Pink (brand-tint)", "Maroon arrow on hovered pink circle", "brand", "brand-tint-strong", UI],
  ["Pink (brand-tint)", "Focus ring on pink", "focus", "brand-tint", UI],
  ["Pink (brand-tint)", "Focus ring on pressed pink", "focus", "brand-tint-strong", UI],
  ["Pink (brand-tint)", "Maroon label on hovered white button", "brand", "brand-tint", TEXT],
  ["Pink (brand-tint)", "Maroon label on pressed white button", "brand", "brand-tint-strong", TEXT],
  ["Pink (brand-tint)", "Maroon icon on white round icon over pink", "brand", "surface", UI],
  ["Pink (brand-tint)", "Maroon stats on pink (light strip)", "brand", "brand-tint", TEXT],

  // Testimonials: the soft pink section with white cards on it
  ["Pink testimonials", "Section heading on the pink section", "ink", "brand-tint", TEXT],
  ["Pink testimonials", "Quote and name on a white card", "ink", "surface", TEXT],
  ["Pink testimonials", "Place line (muted) on a white card", "ink-muted", "surface", TEXT],
  ["Pink testimonials", "Maroon quote mark on a white card", "brand", "surface", UI],
  ["Pink testimonials", "Show more button: maroon outline on the pink section", "brand", "brand-tint", UI],
  ["Pink testimonials", "Show more button label on its white fill", "brand", "surface", TEXT],
  ["Pink testimonials", "Focus ring on the pink section", "focus", "brand-tint", UI],

  // Alternate section tone (surface-alt) and the controls on it
  ["Alt tone", "Body text on alt section", "ink", "surface-alt", TEXT],
  ["Alt tone", "Muted text on alt section", "ink-muted", "surface-alt", TEXT],
  ["Alt tone", "Maroon text and links on alt section", "brand", "surface-alt", TEXT],
  ["Alt tone", "Maroon link hover on alt section", "brand-hover", "surface-alt", TEXT],
  ["Alt tone", "Store button label on its hover background", "ink", "surface-alt", TEXT],
  ["Alt tone", "Muted store eyebrow on its hover background", "ink-muted", "surface-alt", TEXT],
  ["Alt tone", "Store button border on white", "border-strong", "surface", UI],
  ["Alt tone", "Maroon arrow on the hovered card circle", "brand", "surface-alt", UI],
  ["Alt tone", "Maroon icon on white tile", "brand", "surface", UI],
  ["Alt tone", "Chip text on white", "ink", "surface", TEXT],

  // Figma-frame tones: the off-white section (surface-section) and the warm cream callout fill (surface-cream)
  ["Section tone", "Body text on the off-white section", "ink", "surface-section", TEXT],
  ["Section tone", "Muted text on the off-white section", "ink-muted", "surface-section", TEXT],
  ["Section tone", "Maroon text and links on the off-white section", "brand", "surface-section", TEXT],
  ["Section tone", "Maroon link hover on the off-white section", "brand-hover", "surface-section", TEXT],
  ["Section tone", "Maroon link pressed on the off-white section", "brand-pressed", "surface-section", TEXT],
  ["Section tone", "Maroon outline button border on the off-white section", "brand", "surface-section", UI],
  ["Section tone", "Maroon arrow / icon on the off-white section", "brand", "surface-section", UI],
  ["Section tone", "Maroon icon on the pink phone circle over the off-white section", "brand", "brand-tint", UI],
  ["Section tone", "Body text on cream (slim row, advisor card, contact strip)", "ink", "surface-cream", TEXT],
  ["Section tone", "Muted text on cream", "ink-muted", "surface-cream", TEXT],
  ["Section tone", "Maroon text and links on cream", "brand", "surface-cream", TEXT],
  ["Section tone", "Maroon link hover on cream", "brand-hover", "surface-cream", TEXT],
  ["Section tone", "Maroon link pressed on cream", "brand-pressed", "surface-cream", TEXT],

  // Button hover and pressed states
  ["Buttons", "Secondary hover: darker maroon label on stronger pink", "brand-hover", "brand-tint-strong", TEXT],
  ["Buttons", "Secondary pressed: darkest maroon label on stronger pink", "brand-pressed", "brand-tint-strong", TEXT],
  ["Buttons", "Secondary hover: maroon border on white page", "brand-hover", "surface", UI],
  ["Buttons", "Inverse primary hover: maroon label on stronger pink", "brand", "brand-tint-strong", TEXT],
  ["Buttons", "Primary hover label stays white on brand-hover", "ink-on-brand", "brand-hover", TEXT],

  // FAQ rows (open row = surface-alt, open tile and toggle = maroon fill with white icon)
  ["FAQ", "Question on a hovered / open row", "ink", "surface-alt", TEXT],
  ["FAQ", "Open question (maroon) on the surface-alt row", "brand", "surface-alt", TEXT],
  ["FAQ", "Answer (muted) on the open surface-alt row", "ink-muted", "surface-alt", TEXT],
  ["FAQ", "Maroon text link under the answer on the open row", "brand", "surface-alt", TEXT],
  ["FAQ", "Maroon icon on the closed icon tile (surface-alt)", "brand", "surface-alt", UI],
  ["FAQ", "Maroon icon on the hovered icon tile (white)", "brand", "surface", UI],
  ["FAQ", "White icon on the open maroon tile", "ink-on-brand", "brand", UI],
  ["FAQ", "White minus on the open maroon circle", "ink-on-brand", "brand", UI],
  ["FAQ", "Maroon plus on the closed pink circle", "brand", "brand-tint", UI],
  ["FAQ", "Maroon plus on the hovered pink circle", "brand", "brand-tint-strong", UI],
  ["FAQ", "Maroon help icon on its white circle", "brand", "surface", UI],

  // Steps, advisor and help callouts, accordion
  ["Steps and callouts", "White number on maroon badge", "ink-on-brand", "brand", TEXT],
  ["Steps and callouts", "Maroon icon on brand-tint tile", "brand", "surface-alt", UI],
  ["Steps and callouts", "Maroon icon on white round icon", "brand", "surface", UI],
  ["Steps and callouts", "Muted description on white step card", "ink-muted", "surface", TEXT],
  ["Steps and callouts", "Muted text on brand-tint callout card", "ink-muted", "surface-alt", TEXT],
  ["Steps and callouts", "Body text on brand-tint help strip", "ink", "surface-alt", TEXT],
  ["Steps and callouts", "Maroon arrow on brand-tint circle", "brand", "surface-alt", UI],
  ["Steps and callouts", "Maroon arrow on hovered circle", "brand", "border", UI],
  ["Steps and callouts", "Open accordion question (maroon) on white", "brand", "surface", TEXT],
  ["Steps and callouts", "Plus / minus icon on its circle", "brand", "surface-alt", UI],
  ["Steps and callouts", "Maroon tag on brand-tint", "brand", "surface-alt", TEXT],

  // Maroon band (final call-to-action)
  ["Maroon band", "White heading and text on maroon", "ink-on-brand", "brand", TEXT],
  ["Maroon band", "White label on hovered outline button", "ink-on-brand", "on-brand-hover", TEXT],
  ["Maroon band", "White label on pressed outline button", "ink-on-brand", "on-brand-pressed", TEXT],
  ["Maroon band", "Maroon label on white filled button", "brand", "surface", TEXT],
  ["Maroon band", "Maroon label on hovered white button", "brand", "surface-alt", TEXT],
  ["Maroon band", "Maroon label on pressed white button", "brand", "border", TEXT],
  ["Maroon band", "White outline border and focus ring", "ink-on-brand", "brand", UI],

  // UI components and graphics: 3:1
  ["UI (3:1)", "Input / select border on card", "border-strong", "surface", UI],
  ["UI (3:1)", "Input / outline button border on page", "border-strong", "surface-alt", UI],
  ["UI (3:1)", "Maroon outline button border on page", "brand", "surface-alt", UI],
  ["UI (3:1)", "Maroon outline button border on card", "brand", "surface", UI],
  ["UI (3:1)", "Focus ring on page", "focus", "surface-alt", UI],
  ["UI (3:1)", "Focus ring on card", "focus", "surface", UI],
  ["UI (3:1)", "Focus ring on hover tint", "focus", "surface-alt", UI],
  ["UI (3:1)", "Focus ring on pressed tint", "focus", "border", UI],
  ["UI (3:1)", "Error input border on card", "error", "surface", UI],
  ["UI (3:1)", "Active nav bar on card / header", "brand", "surface", UI],

  // Disabled controls use ink-muted on a sunken surface, so they pass AA too (pairs above: "Muted text on sunken surface").
];

// Decorative lines: not required to pass, shown for transparency only.
const INFO = [
  ["Decorative (not required)", "Card edge / divider on card", "border", "surface"],
  ["Decorative (not required)", "Card edge / divider on page", "border", "surface-alt"],
];

// --- Report --------------------------------------------------------------------
const useColour = process.stdout.isTTY || process.env.FORCE_COLOR;
const paint = (code, text) => (useColour ? `\x1b[${code}m${text}\x1b[0m` : text);
const green = (t) => paint(32, t);
const red = (t) => paint(31, t);
const dim = (t) => paint(2, t);
const bold = (t) => paint(1, t);

let failures = 0;
let lastGroup = "";
const nameWidth = Math.max(...PAIRS.map((p) => p[1].length)) + 2;

console.log(bold("\nContrast report (WCAG 2.2 AA)"));
console.log(dim(`Tokens read from ${tokensPath}\n`));

for (const [group, label, fgName, bgName, min] of PAIRS) {
  const fg = colours[fgName];
  const bg = colours[bgName];
  if (!fg || !bg) {
    console.log(red(`  ERROR  unknown token in pair "${label}": ${fgName} / ${bgName}`));
    failures++;
    continue;
  }
  if (group !== lastGroup) {
    console.log(bold(`\n${group}`));
    lastGroup = group;
  }
  const value = ratio(fg, bg);
  const pass = value >= min;
  if (!pass) failures++;
  const status = pass ? green("PASS") : red("FAIL");
  console.log(
    `  ${status}  ${label.padEnd(nameWidth)} ${value.toFixed(2).padStart(5)}:1  ` +
      dim(`needs ${min}:1   ${fg} on ${bg}`),
  );
}

lastGroup = "";
for (const [group, label, fgName, bgName] of INFO) {
  if (group !== lastGroup) {
    console.log(bold(`\n${group}`));
    lastGroup = group;
  }
  const value = ratio(colours[fgName], colours[bgName]);
  console.log(
    `  ${dim("info")}  ${label.padEnd(nameWidth)} ${value.toFixed(2).padStart(5)}:1  ` +
      dim("decorative only; never use for input borders"),
  );
}

const total = PAIRS.length;
console.log(
  `\n${failures === 0 ? green(bold("All required pairs pass.")) : red(bold(`${failures} pair(s) FAILED.`))} ` +
    dim(`${total - failures}/${total} required pairs passing.\n`),
);
process.exit(failures === 0 ? 0 : 1);
