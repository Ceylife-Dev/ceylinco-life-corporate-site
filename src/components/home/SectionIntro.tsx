import type { ReactNode } from "react";
import { Reveal } from "@/components/ui";
import { caseProps } from "@/lib/case";

/**
 * The heading (and optional one-line subtext) at the top of a home page section.
 *
 * Alignment rule: CENTRED for full-width content rows (products, getting covered, customers, FAQ), LEFT for split
 * sections (trust, app) and for the news heading, which keeps "View all news" on the right. Pass `align="center"`
 * for the centred ones; `action` is only used with the left alignment.
 */
export function SectionIntro({
  id,
  heading,
  subtext,
  action,
  align = "left",
}: {
  /** Matches the section's labelledBy so screen readers announce the section by name. */
  id: string;
  heading: string;
  subtext?: string;
  /** Optional text link or button shown at the right on wide screens (left alignment only). */
  action?: ReactNode;
  align?: "left" | "center";
}) {
  if (align === "center") {
    return (
      <Reveal className="mx-auto max-w-prose text-center">
        <h2 id={id} {...caseProps}>{heading}</h2>
        {subtext && <p className="mt-3 text-ink-muted">{subtext}</p>}
      </Reveal>
    );
  }
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <Reveal className="max-w-prose">
        <h2 id={id} {...caseProps}>{heading}</h2>
        {subtext && <p className="mt-3 text-ink-muted">{subtext}</p>}
      </Reveal>
      {action}
    </div>
  );
}
