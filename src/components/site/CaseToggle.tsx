"use client";

import { useEffect, useSyncExternalStore } from "react";
import { toTitleCase } from "@/lib/case";

/*
 * REVIEW TOGGLE: switches the site's UI text between sentence case (the text as written in the content files) and title case.
 *
 *  - It only exists in development, or when the address has ?review=1 (remembered for the visit), never in the installed app
 *    (display-mode: standalone), and never for normal visitors in production.
 *  - Elements that change carry data-case="ui" (see `caseProps` in src/lib/case.ts). Only the text nodes inside them are rewritten,
 *    in the browser, by `toTitleCase`; the original text is remembered so "sentence" restores it exactly. The page is not scanned:
 *    only elements with the attribute are looked at, and a MutationObserver re-applies the mode to flagged elements that appear
 *    later (a new page, a re-rendered label).
 *  - The mode is kept in localStorage (inside try / catch). A tiny script in the <head> (see layout.tsx) puts `data-case-mode` on <html>
 *    before the first paint, and globals.css keeps flagged text hidden until this code has applied the mode (with a 2 second
 *    safety net), so there is no flash of the other case.
 */

export type CaseMode = "sentence" | "title";

const MODE_KEY = "cl:case";
const REVIEW_KEY = "cl:review";

type Snapshot = { enabled: boolean; mode: CaseMode };
const SERVER_SNAPSHOT: Snapshot = { enabled: false, mode: "sentence" };

let snapshot: Snapshot | null = null;
const listeners = new Set<() => void>();

/** Is the review tool on here? Development, or ?review=1 (kept for the visit); not in the installed app. */
function reviewEnabled(): boolean {
  try {
    if (window.matchMedia("(display-mode: standalone)").matches) return false;
    if (new URLSearchParams(window.location.search).get("review") === "1") window.sessionStorage.setItem(REVIEW_KEY, "1");
    return process.env.NODE_ENV !== "production" || window.sessionStorage.getItem(REVIEW_KEY) === "1";
  } catch {
    return process.env.NODE_ENV !== "production";
  }
}

function storedMode(): CaseMode {
  try {
    return window.localStorage.getItem(MODE_KEY) === "title" ? "title" : "sentence";
  } catch {
    return "sentence";
  }
}

function getSnapshot(): Snapshot {
  if (!snapshot) {
    const enabled = reviewEnabled();
    snapshot = { enabled, mode: enabled ? storedMode() : "sentence" };
  }
  return snapshot;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function setMode(mode: CaseMode) {
  snapshot = { ...getSnapshot(), mode };
  try {
    window.localStorage.setItem(MODE_KEY, mode);
  } catch {
    // storage is blocked (a private window): the mode simply is not remembered
  }
  listeners.forEach((listener) => listener());
}

/* --- Rewriting the text --------------------------------------------------------------------------------------------------- */

/** Every text node we have rewritten: the text as written, and the title-case text we put there. */
const rewritten = new WeakMap<Text, { original: string; applied: string }>();

function textNodes(element: Element): Text[] {
  const nodes: Text[] = [];
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if ((node.nodeValue ?? "").trim()) nodes.push(node as Text);
  }
  return nodes;
}

function applyToElement(element: Element, mode: CaseMode) {
  for (const node of textNodes(element)) {
    const entry = rewritten.get(node);
    if (mode === "title") {
      if (entry && node.nodeValue === entry.applied) continue; // already done
      const original = node.nodeValue ?? "";
      const applied = toTitleCase(original);
      rewritten.set(node, { original, applied });
      if (applied !== original) node.nodeValue = applied;
    } else if (entry) {
      if (node.nodeValue === entry.applied) node.nodeValue = entry.original; // put the text back exactly as written
      rewritten.delete(node);
    }
  }
}

function applyToAll(mode: CaseMode) {
  document.querySelectorAll('[data-case="ui"]').forEach((element) => applyToElement(element, mode));
}

/** Re-applies the mode to flagged elements that were added or re-rendered after the first pass. */
function watch(mode: CaseMode): () => void {
  let working = false;
  const observer = new MutationObserver((records) => {
    if (working) return;
    working = true;
    const touched = new Set<Element>();
    for (const record of records) {
      const target = record.target instanceof Element ? record.target : record.target.parentElement;
      const owner = target?.closest('[data-case="ui"]');
      if (owner) touched.add(owner);
      record.addedNodes.forEach((added) => {
        if (!(added instanceof Element)) return;
        const inner = added.closest('[data-case="ui"]');
        if (inner) touched.add(inner);
        added.querySelectorAll('[data-case="ui"]').forEach((element) => touched.add(element));
      });
    }
    touched.forEach((element) => applyToElement(element, mode));
    observer.takeRecords(); // do not react to our own edits
    working = false;
  });
  observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  return () => observer.disconnect();
}

const circleClasses =
  "flex size-8 items-center justify-center rounded-full bg-hero-control text-sm font-semibold text-ink-on-brand opacity-70 transition-opacity duration-base " +
  "group-hover:opacity-100 group-focus-visible:opacity-100 group-active:opacity-100";

/**
 * The small "Aa" button in the hero's top right corner. It looks like the hero image switcher's buttons (a 32px circle in a 44px
 * tap target, 70% opacity, 100% on hover and keyboard focus, no movement). It draws nothing unless the review tool is on.
 */
export function CaseToggle() {
  const { enabled, mode } = useSyncExternalStore(subscribe, getSnapshot, () => SERVER_SNAPSHOT);

  useEffect(() => {
    if (!enabled) return;
    applyToAll(mode);
    document.documentElement.setAttribute("data-case-mode", mode);
    document.documentElement.setAttribute("data-case-ready", "");
    return watch(mode);
  }, [enabled, mode]);

  if (!enabled) return null;

  const other: CaseMode = mode === "sentence" ? "title" : "sentence";
  const status = `Text case: ${mode}. Switch to ${other} case.`;
  return (
    <button
      type="button"
      aria-pressed={mode === "title"}
      aria-label={status}
      title={`Switch to ${other} case`}
      onClick={() => setMode(other)}
      className="case-toggle hide-standalone group absolute z-raised inline-flex size-11 cursor-pointer items-center justify-center rounded-full"
    >
      <span className={circleClasses}>
        <span aria-hidden="true">Aa</span>
      </span>
    </button>
  );
}
