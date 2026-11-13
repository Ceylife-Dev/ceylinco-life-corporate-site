"use client";

import { useEffect, useRef } from "react";
import { cn } from "./cn";

type CountUpProps = {
  /** The final number. Counts up from 0 to this. */
  value: number;
  /** Static text before the number, for example "Rs. ". Never animated. */
  prefix?: string;
  /** Static text after the number, for example "+ billion". Never animated. */
  suffix?: string;
  /** Milliseconds. Leave it out to use the site-wide --count-duration token (1200ms). */
  duration?: number;
  /** What a screen reader says for the whole figure, for example "More than Rs. 200 billion" (the visible "Rs. 200+ billion" is split into pieces). Leave it out to read prefix, number and suffix as they are. */
  spoken?: string;
  /** Classes for the prefix and suffix (for example a smaller size or another colour). The number keeps the parent's style. */
  affixClassName?: string;
  /** Layout only. */
  className?: string;
};

const format = (n: number) => n.toLocaleString("en-US"); // thousands separated by commas

/** The site-wide count duration (--count-duration in tokens.css), in milliseconds. */
function tokenDuration() {
  const raw = getComputedStyle(document.documentElement).getPropertyValue("--count-duration").trim();
  const value = parseFloat(raw);
  if (Number.isNaN(value)) return 1200;
  return raw.endsWith("ms") ? value : value * 1000;
}

/**
 * A number that counts up from 0 when it scrolls into view. It runs once.
 *
 *   <CountUp value={38000} suffix="+" />   ->   38,000+
 *
 * - The prefix and suffix stay still; only the number moves.
 * - Space for the final number is reserved, and digits are tabular, so the
 *   layout never shifts while counting.
 * - It counts once, the first time it is on screen, for --count-duration (1200ms, ease-out). With "reduce motion" on the final
 *   number is shown straight away.
 * - Screen readers read the final value only: the moving digits are hidden
 *   from them (aria-hidden), and the final text (or `spoken`, one string for the whole figure) is provided separately in an sr-only element.
 * - Without JavaScript the final number is simply shown.
 */
export function CountUp({ value, prefix = "", suffix = "", duration, spoken, affixClassName, className }: CountUpProps) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);
  const finalText = format(value);

  useEffect(() => {
    const root = rootRef.current;
    const number = numberRef.current;
    if (!root || !number) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return; // keep the final number

    number.textContent = format(0);
    let frame = 0;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect(); // run once only
        const start = performance.now();
        const total = duration ?? tokenDuration();
        const tick = (now: number) => {
          const progress = Math.min((now - start) / total, 1);
          const eased = 1 - Math.pow(1 - progress, 3); // ease-out
          number.textContent = progress < 1 ? format(Math.round(value * eased)) : finalText;
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    observer.observe(root);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value, duration, finalText]);

  return (
    <span ref={rootRef} className={cn("inline-block tabular-nums", className)}>
      <span className="sr-only">{spoken ?? `${prefix}${finalText}${suffix}`}</span>
      <span aria-hidden="true">
        {prefix && <span className={affixClassName}>{prefix}</span>}
        {/* The invisible copy holds the final width; the counting number sits on top of it, right-aligned. */}
        <span className="relative inline-block">
          <span className="invisible">{finalText}</span>
          <span ref={numberRef} className="absolute inset-0 text-right">
            {finalText}
          </span>
        </span>
        {suffix && <span className={affixClassName}>{suffix}</span>}
      </span>
    </span>
  );
}
