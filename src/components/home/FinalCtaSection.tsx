import Image from "next/image";
import { Button, Reveal, Section } from "@/components/ui";
import { home } from "@/content/home";
import { caseProps } from "@/lib/case";

/**
 * 9. Final call-to-action: a rounded 24px maroon card on an alt (off-white) section, with
 * space all round. It is the only maroon block on the page, and the off-white space
 * around it keeps it from running into the dark footer below.
 *
 * An optional decorative picture (soft rings on the maroon) can be set in the content file (`finalCta.pattern`);
 * it is decoration only (alt=""), and the text sits above it.
 */
export function FinalCtaSection() {
  const { heading, text, primaryCta, secondaryCta, pattern } = home.finalCta;
  return (
    <Section tone="alt" labelledBy="cta-heading">
      <Reveal className="relative isolate overflow-hidden rounded-container bg-brand px-6 py-12 text-center text-ink-on-brand md:px-16 md:py-16">
        {pattern && <Image src={pattern} alt="" fill sizes="(min-width: 1280px) 1152px, 100vw" className="absolute inset-0 object-cover" />}
        <div className="relative mx-auto max-w-prose">
          <h2 id="cta-heading" {...caseProps}>{heading}</h2>
          <p className="mt-4">{text}</p>
          {/* Two buttons of the same width and height: stacked in a 320px column up to 768px, side by side from 769px (each at least 220px). */}
          <div className="mt-8 flex justify-center">
            <div className="grid w-full max-w-80 gap-3 bar:w-auto bar:max-w-none bar:auto-cols-fr bar:grid-flow-col">
              <Button tone="inverse" size="adaptive" href={primaryCta.href} className="bar:min-w-55">
                {primaryCta.label}
              </Button>
              <Button tone="inverse" variant="secondary" size="adaptive" strongOutline href={secondaryCta.href} className="bar:min-w-55">
                {secondaryCta.label}
              </Button>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
