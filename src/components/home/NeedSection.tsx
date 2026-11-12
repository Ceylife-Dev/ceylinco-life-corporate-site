import { ArrowRight } from "lucide-react";
import { Button, Card, CardArrow, Reveal, Section } from "@/components/ui";
import { home } from "@/content/home";
import { caseProps } from "@/lib/case";
import { SectionIntro } from "./SectionIntro";

/**
 * 1. Choose a need or product (white). The heading, intro, "See all products" and the slim row (warm cream) are centred. Each product card is one big link: a large icon in a soft pink tile with the
 * arrow at the top right, the need as the title and the product name in muted text.
 * The longer description is kept for screen readers (aria-describedby). Arrows: the circular one on each card and the
 * one on the section-level "See all products" link.
 */
export function NeedSection() {
  const { heading, subtext, cards, allLink, quickLinks } = home.needs;
  return (
    <Section tone="white" labelledBy="needs-heading">
      <SectionIntro id="needs-heading" heading={heading} subtext={subtext} align="center" />

      {/* Five cards: one column on phones, two from sm, three from lg and all five in a row from xl (each 211px wide in the Figma design). */}
      <ul className="mt-10 grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-5">
        {cards.map(({ icon: Icon, title, product, description, href }, index) => {
          const descriptionId = `need-card-${index}-description`;
          return (
            <Reveal as="li" key={title}>
              <Card
                variant="interactive"
                href={href}
                padding="lg"
                shadow="sm"
                className="h-full"
                // The name is the link's own visible text (title, then product), as WCAG 2.5.3 asks, e.g. "Protect my family Life insurance".
                aria-describedby={descriptionId}
              >
                <div className="flex h-full flex-col">
                  {/* An 80px tile with a 56px icon (same line weight on all four icons) on the left, the arrow on the right. */}
                  <div className="flex items-start justify-between">
                    <span className="flex size-20 items-center justify-center rounded-control bg-brand-tint text-brand">
                      <Icon aria-hidden="true" strokeWidth={1.5} className="size-14" />
                    </span>
                    <CardArrow />
                  </div>
                  <h3 {...caseProps} className="mt-6 text-lg font-semibold md:text-lg">
                    <span className="link-underline group-hover:link-underline-shown group-focus-visible:link-underline-shown group-active:link-underline-shown">
                      {title}
                    </span>
                  </h3>
                  <p {...caseProps} className="mt-1 text-ink-muted">{product}</p>
                </div>
              </Card>
              {/* Read out after the name (aria-describedby). It sits outside the link so the link's text is exactly its visible name. */}
              <span id={descriptionId} className="sr-only">
                {description}
              </span>
            </Reveal>
          );
        })}
      </ul>

      <div className="mt-6 flex justify-center">
        <Button variant="tertiary" href={allLink.href} iconEnd={<ArrowRight />}>
          {allLink.label}
        </Button>
      </div>

      <div className="mt-6 flex flex-col items-center gap-x-4 gap-y-1 rounded-container bg-surface-cream px-4 py-2 text-center md:flex-row md:flex-wrap md:justify-center md:px-6 lg:gap-x-45.5">
        {quickLinks.map(({ prompt, label, href }) => (
          <p key={label} className="flex flex-wrap items-center justify-center gap-x-2">
            <span className="w-full text-base text-ink-muted md:w-auto">{prompt}</span>
            <Button variant="tertiary" size="sm" href={href} iconEnd={<ArrowRight />}>
              {label}
            </Button>
          </p>
        ))}
      </div>
    </Section>
  );
}
