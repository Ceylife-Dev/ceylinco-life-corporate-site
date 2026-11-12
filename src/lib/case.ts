/**
 * Sentence case / title case for the UI text review toggle (see src/components/site/CaseToggle.tsx).
 *
 * The content files hold the text as written (sentence case). Title case is worked out from it here, in one place, so there is
 * only one source of truth. This is NOT `text-transform: capitalize` (that would capitalise every word, including "of" and "to",
 * and mangle acronyms).
 *
 * Which elements change is decided in the markup: an element carries `data-case="ui"` (use `caseProps`). Body paragraphs,
 * descriptions, review quotes, names, news headlines, dates, phone numbers and the all-caps eyebrow labels do not carry it.
 */

/**
 * Words and phrases that are kept exactly as written, whatever the mode: acronyms, brand names and proper nouns. Matching ignores
 * case and whole words only; the spelling here is what is kept. TO ADD ONE, add a line: the longest phrase wins when two overlap.
 */
export const CASE_EXCEPTIONS: string[] = [
  // Acronyms
  "CSR",
  "FAQ",
  "FAQs",
  "EN",
  "SI",
  "TA",
  "CMA",
  "IRCSL",
  "SMS",
  "PDF",
  "WhatsApp",
  "LinkedIn",
  "YouTube",
  "Rs.",
  // Brand names, products and programmes
  "Ceylinco Life",
  "Ceylinco",
  "Ceylife Digital",
  "Ceylife",
  "App Store",
  "Google Play",
  "AppGallery",
  "Huawei",
  "Life Rewards",
  "Family Savari",
  "Pranama Scholarships",
  // Places
  "Sri Lanka",
  "Sri Lankans",
  "Sri Lankan",
  "Colombo",
  "Kandy",
];

/** Small words that stay in lower case in a title, unless they are the first or the last word. */
const SMALL_WORDS = new Set(["a", "an", "the", "and", "but", "or", "for", "nor", "in", "on", "at", "to", "of", "by", "up", "as"]);

const escape = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Marks, for one string, the stretches that are protected by the exceptions list. */
function protectedRanges(text: string, exceptions: string[]): Array<[number, number]> {
  const ranges: Array<[number, number]> = [];
  const longestFirst = [...exceptions].sort((a, b) => b.length - a.length);
  for (const phrase of longestFirst) {
    const pattern = new RegExp(`(?<![\\p{L}\\p{N}])${escape(phrase)}(?![\\p{L}\\p{N}])`, "giu");
    for (const match of text.matchAll(pattern)) {
      const start = match.index ?? 0;
      const end = start + match[0].length;
      if (!ranges.some(([from, to]) => start < to && end > from)) ranges.push([start, end]);
    }
  }
  return ranges;
}

const capitalise = (word: string) => (word ? word.charAt(0).toUpperCase() + word.slice(1) : word);

/**
 * Title case: every word is capitalised except a, an, the, and, but, or, for, nor, in, on, at, to, of, by, up and as, unless it is
 * the first or the last word. Hyphenated words capitalise both parts. Only the first letter of a word is touched (so acronyms and
 * names such as "WhatsApp" keep their spelling), and anything in the exceptions list is left exactly as written.
 *
 * One deliberate detail: in a question that ends with a small word ("What are you looking for?") that last small word stays in
 * lower case ("What Are You Looking for?"), because the mark after it makes it part of the sentence's ending, not a word to stress.
 */
export function toTitleCase(text: string, exceptions: string[] = CASE_EXCEPTIONS): string {
  const protectedAt = protectedRanges(text, exceptions);
  const endsWithQuestion = /\?\s*$/.test(text);

  // Every word (a run without spaces that has a letter in it), with where it starts and ends.
  const words: Array<{ start: number; end: number; coreStart: number; coreEnd: number }> = [];
  for (const match of text.matchAll(/\S+/g)) {
    const start = match.index ?? 0;
    const token = match[0];
    const lead = token.match(/^[^\p{L}\p{N}]*/u)?.[0].length ?? 0;
    const trail = token.match(/[^\p{L}\p{N}]*$/u)?.[0].length ?? 0;
    const coreStart = start + lead;
    const coreEnd = start + token.length - trail;
    if (coreEnd > coreStart && /\p{L}/u.test(text.slice(coreStart, coreEnd))) words.push({ start, end: start + token.length, coreStart, coreEnd });
  }

  let result = "";
  let cursor = 0;
  words.forEach((word, index) => {
    const core = text.slice(word.coreStart, word.coreEnd);
    const isProtected = protectedAt.some(([from, to]) => word.coreStart < to && word.coreEnd > from);
    let changed = core;
    if (!isProtected) {
      const first = index === 0;
      const last = index === words.length - 1;
      if (core.includes("-")) {
        changed = core.split("-").map(capitalise).join("-"); // hyphenated: both parts
      } else if (SMALL_WORDS.has(core.toLowerCase()) && !first && !(last && !endsWithQuestion)) {
        changed = core; // stays as written (lower case)
      } else {
        changed = capitalise(core);
      }
    }
    result += text.slice(cursor, word.coreStart) + changed;
    cursor = word.coreEnd;
  });
  return result + text.slice(cursor);
}

/**
 * Props for an element whose text changes with the review toggle. The text is rendered in the case it has in the content file;
 * the toggle rewrites the text nodes inside the element in the browser, so `suppressHydrationWarning` tells React not to be
 * surprised by that.
 */
export const caseProps = { "data-case": "ui", suppressHydrationWarning: true } as const;
