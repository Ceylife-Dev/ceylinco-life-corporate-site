import { cn } from "./cn";
import { CountUp } from "./CountUp";
import { Reveal } from "./Reveal";

export type StatsStripItem = { prefix?: string; value: number; suffix?: string; label: string };

export type StatsStripTone = "dark" | "light";

type StatsStripProps = {
  stats: StatsStripItem[];
  /**
   * dark  = for a dark section (footer-bg): white numbers, prefix and suffix in brand-tint-strong (a text accent), muted light labels.
   * light = for a pink (tint) section: maroon numbers, prefix and suffix in maroon, muted dark labels.
   * The section behind the strip must match the tone (Section tone="dark" or tone="tint").
   */
  tone?: StatsStripTone;
  /** Layout only. */
  className?: string;
};

// Written out in full so Tailwind can find every class. Every pair is in scripts/check-contrast.mjs.
const toneClasses: Record<StatsStripTone, { divider: string; accent: string; number: string; affix: string; label: string }> = {
  dark: {
    divider: "border-footer-border",
    accent: "bg-footer-muted",
    number: "text-ink-on-brand",
    affix: "text-brand-tint-strong",
    label: "text-footer-muted",
  },
  light: {
    divider: "border-brand-tint-strong",
    accent: "bg-brand",
    number: "text-brand",
    affix: "text-brand",
    label: "text-ink-muted",
  },
};

/**
 * Where each of the four columns draws its 1px dividers.
 *   Phones: 2 x 2, with a vertical line between the two columns and a horizontal line between the two rows.
 *   From lg: one row of four, with a vertical line between neighbours.
 * (The first column has no left padding so it lines up with the text above it.)
 */
const positionClasses = [
  "pr-4 lg:pr-8",
  "border-l pl-4 lg:px-8",
  "border-t pr-4 lg:border-t-0 lg:border-l lg:px-8",
  "border-t border-l pl-4 lg:border-t-0 lg:pl-8",
];

/**
 * An open strip of proof numbers, with no boxes. Each column has a short accent line, a big number that counts up
 * (CountUp: once, final value for screen readers and reduced motion), and a muted label. The prefix and suffix
 * ("Rs.", "+ billion") are smaller and in the accent colour.
 *
 * To switch the look: change `tone` here and use the matching Section tone around it. See WhySection.
 */
export function StatsStrip({ stats, tone = "dark", className }: StatsStripProps) {
  const t = toneClasses[tone];
  return (
    <ul className={cn("grid grid-cols-2 lg:flex", className)}>
      {stats.map(({ prefix, value, suffix, label }, index) => (
        <Reveal
          as="li"
          key={label}
          className={cn("py-6 lg:flex-auto lg:py-2", t.divider, positionClasses[index % positionClasses.length])}
        >
          <span aria-hidden="true" className={cn("mb-4 block h-0.75 w-8", t.accent)} />
          <p className={cn("text-3xl leading-none font-bold tabular-nums lg:whitespace-nowrap xl:text-4xl", t.number)}>
            <CountUp value={value} prefix={prefix} suffix={suffix} affixClassName={cn("text-xl", t.affix)} />
          </p>
          <p className={cn("mt-3 text-base", t.label)}>{label}</p>
        </Reveal>
      ))}
    </ul>
  );
}
