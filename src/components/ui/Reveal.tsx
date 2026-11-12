"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "./cn";

type RevealProps = {
  /** Element to render. Use "li" inside a list, "span" for a decorative line. */
  as?: "div" | "li" | "span";
  /**
   * rise = fades in and moves up (headings, cards, text blocks). The default.
   * fade = fades in only, no movement (photos).
   * draw = the element is a clipping track and its child slides in along it (the dotted connector in "Getting covered").
   *        Give the child `reveal-draw-x` (draws left to right) or `reveal-draw-y` (top to bottom).
   */
  variant?: "rise" | "fade" | "draw";
  /** Layout only. */
  className?: string;
  children?: ReactNode;
};

/*
 * ONE shared observer for every Reveal on the page (cheaper than one per element). When elements scroll into view
 * together (a row of cards), they get a rank in page order, and the CSS turns that into a stagger
 * (--reveal-stagger per item, never more than --reveal-stagger-max in all). Each element plays once and is then released.
 * An element counts as seen once 15% of it is on screen, or once it fills at least 40% of the screen height (so a very tall
 * element can never stay hidden on a short screen).
 */
let shared: IntersectionObserver | null = null;

function observer() {
  shared ??= new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting && (entry.intersectionRatio >= 0.15 || entry.intersectionRect.height >= (entry.rootBounds?.height ?? Infinity) * 0.4))
        .map((entry) => entry.target as HTMLElement);
      visible.sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
      let rank = 0;
      for (const element of visible) {
        if (!element.classList.contains("reveal-draw")) element.style.setProperty("--reveal-index", String(rank++));
        element.dataset.reveal = "shown";
        shared?.unobserve(element);
      }
    },
    { threshold: [0, 0.15, 0.3, 0.5, 0.75, 1] },
  );
  return shared;
}

/**
 * Subtle scroll reveal: content fades in (and rises a little) the first time it scrolls into view. It plays once and never
 * resets when you scroll back up. Only opacity and transform change, so nothing around it moves (no layout shift).
 *
 * The hidden state is added by this script only after the page has loaded, so:
 *   - without JavaScript everything is simply visible;
 *   - anything already on screen when the page loads (the hero, the first viewport) is never hidden, so it appears at once;
 *   - with prefers-reduced-motion nothing is hidden and nothing moves.
 * Distance, duration, easing and stagger come from the --reveal-* tokens (tokens.css); the rules are in globals.css.
 * Do not use it on the header, navigation, bottom bar, menus or form fields.
 */
export function Reveal({ as: Tag = "div", variant = "rise", className, children }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || !("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (element.getBoundingClientRect().top < window.innerHeight) return; // already on screen (or above it): show at once

    element.dataset.reveal = "hidden";
    const watcher = observer();
    watcher.observe(element);
    // Last resort: if the observer has not shown it after a few seconds although it is on screen, show it anyway.
    const safety = window.setTimeout(() => {
      const box = element.getBoundingClientRect();
      if (element.dataset.reveal === "hidden" && box.bottom > 0 && box.top < window.innerHeight) element.dataset.reveal = "shown";
    }, 3000);
    return () => {
      window.clearTimeout(safety);
      watcher.unobserve(element);
      delete element.dataset.reveal;
    };
  }, []);

  return (
    <Tag ref={ref as React.RefObject<never>} className={cn("reveal", variant === "fade" && "reveal-fade", variant === "draw" && "reveal-draw", className)}>
      {children}
    </Tag>
  );
}
