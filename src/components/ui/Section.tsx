import type { ReactNode } from "react";
import { cn } from "./cn";

export type SectionTone = "white" | "alt" | "tint" | "dark";

type SectionProps = {
  /**
   * Background of the full-width band. Alternate "white" and "alt" (surface-section, #FBFAF9) down a page; "tint" (the soft pink brand-tint, not used on the home page now) is the other accent tone; no two
   * neighbouring sections share a tone. "dark" (footer-bg, #1F1D21) is the exception, used only for the trust block
   * (and the footer), and the section after it is white. There is no full-bleed maroon tone: the closing
   * call-to-action is a rounded maroon card inside an "alt" section.
   * Inside "dark", text links and icons must be white (Button tone="inverse"), never maroon: maroon on this
   * colour is 1.2:1.
   */
  tone?: SectionTone;
  /** id of the heading inside, so screen readers announce the section by name. */
  labelledBy?: string;
  id?: string;
  /** Layout only. */
  className?: string;
  children: ReactNode;
};

const toneClasses: Record<SectionTone, string> = {
  white: "bg-surface",
  alt: "bg-surface-section",
  tint: "bg-brand-tint",
  dark: "bg-footer-bg text-ink-on-brand focus-on-dark",
};

/**
 * One full-width band of a page. Gives the standard 56px (phone) / 96px
 * (desktop) vertical space and a centred 1200px container.
 */
export function Section({ tone = "white", labelledBy, id, className, children }: SectionProps) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={cn(toneClasses[tone], "py-14 md:py-24", className)}>
      <div className="mx-auto max-w-page px-4 md:px-6">{children}</div>
    </section>
  );
}
