import { Check } from "lucide-react";
import { Button, Card, Section } from "@/components/ui";
import { home } from "@/content/home";
import { SectionIntro } from "./SectionIntro";

/**
 * NOT SHOWN ON THE HOME PAGE: "Know what you're getting" was removed from the page at the designer's request (it is not in the
 * approved Figma or section order). The component and its wording (home.coverage) are kept, unused, in case it returns.
 * Coverage and key details (alt tone).
 * All wording here must be confirmed with compliance before launch (see home.ts).
 */
export function CoverageSection() {
  const { heading, cards, linkLabel, href, note } = home.coverage;
  return (
    <Section tone="alt" labelledBy="coverage-heading">
      <SectionIntro id="coverage-heading" heading={heading} />

      <ul className="mt-10 grid gap-4 md:gap-6 lg:grid-cols-3">
        {cards.map(({ title, points }) => (
          <li key={title}>
            <Card padding="lg" className="h-full">
              <h3 className="text-xl font-bold">{title}</h3>
              <ul className="mt-4 flex flex-col gap-3">
                {points.map((point, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check aria-hidden="true" className="mt-1 size-5 shrink-0 text-brand" />
                    <span className="text-ink-muted">{point}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </li>
        ))}
      </ul>

      <div className="mt-8">
        <Button variant="tertiary" href={href}>
          {linkLabel}
        </Button>
      </div>
      <p className="mt-4 text-sm text-ink-muted">{note}</p>
    </Section>
  );
}
