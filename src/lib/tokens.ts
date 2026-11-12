import { readFileSync } from "node:fs";
import path from "node:path";

/**
 * Reads a colour token (for example "brand") straight from src/styles/tokens.css, so the few places that cannot use a CSS
 * variable (the web app manifest and the browser's theme-color tag) still take their value from the design system and no
 * hex code is repeated in the code. Server-side only; it runs at build time.
 */
export function colourToken(name: string): string {
  const css = readFileSync(path.join(process.cwd(), "src", "styles", "tokens.css"), "utf-8");
  const match = css.match(new RegExp(`--color-${name}:\\s*(#[0-9a-fA-F]{6})\\b`));
  if (!match) throw new Error(`Colour token --color-${name} was not found in tokens.css`);
  return match[1];
}
