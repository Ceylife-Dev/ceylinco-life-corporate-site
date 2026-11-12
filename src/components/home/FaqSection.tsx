import { ArrowRight, CircleHelp, Phone } from "lucide-react";
import Image from "next/image";
import { Accordion, Button, Card, Section, TextLink } from "@/components/ui";
import { home } from "@/content/home";
import { SectionIntro } from "./SectionIntro";

/**
 * 6. FAQ (white): ONE centred column. A 56px white circle with a maroon help icon, a centred heading and one-line intro,
 * then (800px wide) a white 24px card holding the accordion (each row has an icon tile, the question and a plus / minus
 * toggle; the open row shows its answer and, when there is one, a text link), and under it a warm cream strip of the same width: a
 * pink circle with a maroon phone icon, "Still have questions?", the phone line (the number is a tel: link) and, on the
 * right, a text link with an arrow. No left column, no help card.
 *
 * An optional soft background picture can be set in the content file (`faq.background`, shown at 30% opacity).
 */
export function FaqSection() {
  const { heading, intro, help, items, background } = home.faq;
  return (
    <Section tone="white" labelledBy="faq-heading" className="relative isolate overflow-hidden">
      {background && (
        <Image src={background} alt="" fill sizes="100vw" className="absolute inset-0 object-cover opacity-30" />
      )}
      <div className="relative">
        <div className="mx-auto mb-6 flex size-14 items-center justify-center rounded-full border border-border bg-surface text-brand shadow-sm">
          <CircleHelp aria-hidden="true" className="size-6" />
        </div>
        <SectionIntro id="faq-heading" heading={heading} subtext={intro} align="center" />

        <div className="mx-auto mt-10 max-w-faq">
          <Accordion
            items={items.map(({ id, question, answer, icon: Icon, link }) => ({
              id,
              title: question,
              icon: <Icon aria-hidden="true" />,
              content: (
                <>
                  <p>{answer}</p>
                  {link && (
                    <div className="mt-2 -ml-2">
                      <Button variant="tertiary" size="sm" href={link.href} iconEnd={<ArrowRight />}>
                        {link.label}
                      </Button>
                    </div>
                  )}
                </>
              ),
            }))}
            defaultOpen={[items[0].id]}
          />

          <Card tone="cream" shadow="sm" padding="xl" className="mt-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
              {/* The pink circle with a maroon phone icon. */}
              <span
                aria-hidden="true"
                className="flex size-12 shrink-0 items-center justify-center rounded-full bg-brand-tint text-brand"
              >
                <Phone className="size-6" />
              </span>
              <div className="md:flex-1">
                <p className="font-semibold">{help.title}</p>
                <p className="text-ink-muted">
                  {help.callPrefix}{" "}
                  <TextLink inline href={help.phone.href}>
                    {help.phone.label}
                  </TextLink>
                  , {help.hours}
                </p>
              </div>
              <Button variant="tertiary" href={help.link.href} iconEnd={<ArrowRight />}>
                {help.link.label}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </Section>
  );
}
