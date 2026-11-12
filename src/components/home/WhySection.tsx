import { ArrowRight, Award } from "lucide-react";
import { Button, Reveal, Section, StatsStrip } from "@/components/ui";
import { home } from "@/content/home";
import { caseProps } from "@/lib/case";
import { TrustPhoto } from "./TrustPhoto";

/**
 * HOW TO SWITCH THIS SECTION'S LOOK: change TONE below.
 *   "dark"  = the warm near-black of the footer, white text (the current design).
 *   "light" = a soft pink (brand-tint) section with maroon numbers and dark text.
 * Everything else (section background, text colours, link style, strip colours) follows from it.
 */
const TONE: "dark" | "light" = "dark";

/**
 * 4. Why families trust us (the one dark block on the page, after "Getting covered is simple"). Heading, story and
 * the "Our story" link on the left, the cutout figure on a soft light glow on the right, then an open StatsStrip
 * (four numbers that count up, with thin dividers and no boxes), then the recognition line under a thin divider.
 * On the dark tone the link and icon are white, never maroon (maroon on this colour is 1.2:1).
 *
 * The photo (`trust.jpeg`) is cut to the skewed, rounded shape from the Figma design with an SVG clip path, and two red
 * outlines sit behind it (see TrustPhoto.tsx). The photo carries the alt text; the outlines are decoration only. The old
 * cutout (`trust-cutout.svg`) is kept in the images folder, unused.
 */
export function WhySection() {
  const { heading, story, linkLabel, href, image, stats, recognition } = home.why;
  const dark = TONE === "dark";
  return (
    <Section tone={dark ? "dark" : "tint"} labelledBy="why-heading" className="overflow-x-clip">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <h2 id="why-heading" {...caseProps}>{heading}</h2>
          <p className={dark ? "mt-4 max-w-prose" : "mt-4 max-w-prose text-ink-muted"}>{story}</p>
          <div className="mt-6">
            <Button variant="tertiary" tone={dark ? "inverse" : "default"} href={href} iconEnd={<ArrowRight />}>
              {linkLabel}
            </Button>
          </div>
        </Reveal>

        <Reveal variant="fade" className="mx-auto w-full max-w-prose lg:max-w-none">
          <TrustPhoto src={image.src} alt={image.alt} />
        </Reveal>
      </div>

      <StatsStrip stats={stats} tone={TONE} className="mt-12" />

      {/* The recognition line sits under a thin divider, with a small (16px) award icon. */}
      <p
        className={
          dark
            ? "mt-8 flex items-start gap-3 border-t border-footer-border pt-6 text-base text-footer-text"
            : "mt-8 flex items-start gap-3 border-t border-brand-tint-strong pt-6 text-base text-ink-muted"
        }
      >
        <Award aria-hidden="true" className="mt-1 size-4 shrink-0" />
        <span>{recognition}</span>
      </p>
    </Section>
  );
}
