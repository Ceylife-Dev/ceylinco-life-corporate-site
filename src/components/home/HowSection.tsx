import { Headset } from "lucide-react";
import { Button, Card, Reveal, Section, Stepper } from "@/components/ui";
import { home } from "@/content/home";
import { caseProps } from "@/lib/case";
import { SectionIntro } from "./SectionIntro";

/**
 * 3. How it works (alt tone): a centred heading with a one-line intro, one connected timeline (a dotted line through four soft pink icon tiles, each step with a large
 * maroon number), then a cream "ask an advisor" card with a round white icon, the text and the button. This is one of only two
 * places with a "Talk to an advisor" button (the other is the final call-to-action).
 */
export function HowSection() {
  const { heading, subtext, steps, help } = home.how;
  return (
    <Section tone="alt" labelledBy="how-heading">
      <SectionIntro id="how-heading" heading={heading} subtext={subtext} align="center" />

      <Stepper items={steps} look="timeline" className="mt-10" />

      <Reveal className="mt-12">
        <Card tone="cream" padding="xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            {/* A round white icon on the pink: the icon is maroon on white. */}
            <span aria-hidden="true" className="flex size-14 shrink-0 items-center justify-center rounded-full bg-surface text-brand">
              <Headset className="size-7" />
            </span>
            <div className="md:flex-1">
              <h3 {...caseProps} className="text-xl font-bold">{help.title}</h3>
              <p className="mt-2 text-base text-ink-muted">{help.text}</p>
            </div>
            {/* Button and note share one left edge. */}
            <div className="flex flex-col items-start gap-3">
              <Button variant="secondary" href={help.cta.href}>
                {help.cta.label}
              </Button>
              <p className="text-sm text-ink-muted">{help.contact}</p>
            </div>
          </div>
        </Card>
      </Reveal>
    </Section>
  );
}
