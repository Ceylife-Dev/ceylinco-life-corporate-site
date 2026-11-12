#!/usr/bin/env node
/**
 * Token-usage checker.  Run:  npm run check:tokens
 *
 * Enforces "everything comes from tokens" by scanning src/ for raw values that
 * should be tokens. Only src/styles/tokens.css is allowed to contain them.
 * Exits with code 1 if it finds anything.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = join(root, "src");
const allowed = new Set([join(srcDir, "styles", "tokens.css")]);

const RULES = [
  { name: "Hex colour", test: /#[0-9a-fA-F]{3,8}\b/ },
  { name: "rgb()/hsl() colour", test: /\b(rgba?|hsla?)\(/ },
  { name: "Pure black", test: /\b(?:bg|text|border|ring|outline|shadow|fill|stroke|divide|decoration|from|to|via)-black\b|(?<![\w-])black(?![\w-])/ },
  { name: "Pure white (use bg-surface / text-ink-on-brand)", test: /\b(?:bg|text|border|ring|outline|fill|stroke)-white\b/ },
  {
    name: "Tailwind default colour (only token colours exist)",
    test: /\b(?:bg|text|border|ring|outline|fill|stroke|from|to|via)-(?:slate|gray|grey|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}\b/,
  },
  { name: "Arbitrary pixel/rem/em value in a class", test: /\b[a-z-]+-\[[^\]]*\d(?:px|rem|em|vh|vw)\b[^\]]*\]/ },
  { name: "Arbitrary colour in a class", test: /\b[a-z-]+-\[(?:#|rgb|hsl)[^\]]*\]/ },
  { name: "Numeric z-index (use z-sticky, z-dropdown ...)", test: /\bz-(?:\d+|\[\d+\])\b/ },
  { name: "Inline style with a raw value", test: /style=\{\{[^}]*(?:px|#[0-9a-fA-F]{3,6}|rgb)/ },
];

function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) yield* walk(full);
    else if (/\.(css|ts|tsx)$/.test(entry)) yield full;
  }
}

let problems = 0;
for (const file of walk(srcDir)) {
  if (allowed.has(file)) continue;
  const lines = readFileSync(file, "utf8").split(/\r?\n/);
  lines.forEach((line, index) => {
    // Skip pure comment lines (documentation may quote values).
    const trimmed = line.trim();
    if (trimmed.startsWith("//") || trimmed.startsWith("*") || trimmed.startsWith("/*")) return;
    for (const rule of RULES) {
      if (rule.test.test(line)) {
        problems++;
        console.log(`${relative(root, file)}:${index + 1}  ${rule.name}\n    ${trimmed}`);
      }
    }
  });
}

if (problems === 0) {
  console.log("Token check passed: no raw colours, sizes, radii, shadows or z-indexes outside tokens.css.");
} else {
  console.log(`\n${problems} problem(s). Replace raw values with tokens from src/styles/tokens.css.`);
  process.exit(1);
}
