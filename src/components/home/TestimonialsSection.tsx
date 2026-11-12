import { ArrowRight, Quote, User } from "lucide-react";
import Image from "next/image";
import { CardCarousel, Card, Section, TextLink } from "@/components/ui";
import { home } from "@/content/home";
import { SectionIntro } from "./SectionIntro";

/** The most reviews the carousel shows. */
const CAROUSEL_MAX = 6;

/**
 * One review card, left-aligned, the same on every card. Top to bottom: the quote mark and the quote (at most eight lines; the full text stays
 * in the page), then the profile photo, then the name directly under the photo (one line, ellipsis) and the details under the name (at most
 * two lines). The photo, name and details block is pinned to the bottom of the card, so it sits in the same place on every card whatever
 * the length of the quote. All cards in the carousel are the same height.
 */
function ReviewCard({ quote, name, descriptor, avatar }: (typeof home.testimonials.items)[number]) {
  return (
    <Card padding="xl" shadow="sm" className="h-full">
      <figure className="flex h-full min-w-0 flex-col text-left">
        <div>
          <Quote aria-hidden="true" className="size-8 text-brand" />
          <blockquote className="mt-3 line-clamp-8 text-lg">{quote}</blockquote>
        </div>
        <figcaption className="mt-auto flex min-w-0 flex-col items-start pt-6">
          {/* A photo when a real, permitted one is supplied; otherwise a neutral tile. */}
          {avatar ? (
            <span aria-hidden="true" className="relative size-12 shrink-0 overflow-hidden rounded-control bg-surface-sunken">
              <Image src={avatar} alt="" fill sizes="48px" className="object-cover" />
            </span>
          ) : (
            <span
              aria-hidden="true"
              className="flex size-12 shrink-0 items-center justify-center rounded-control bg-surface-sunken text-ink-muted"
            >
              <User className="size-6" />
            </span>
          )}
          <span className="mt-3 block w-full truncate font-semibold">{name}</span>
          <span className="mt-1 line-clamp-2 block w-full text-sm text-ink-muted">{descriptor}</span>
        </figcaption>
      </figure>
    </Card>
  );
}

/**
 * 5. Testimonials (white tone; the cards are white with a 1px border and a light shadow).
 *
 * Up to six reviews in the shared swipeable CardCarousel on every screen size (one card per view up to 768px, two from 769px, three from
 * 1025px, each with a peek of the next), with the position indicator and, from 769px, previous / next buttons. "Read all reviews"
 * sits below. There is no "Show more" / "Show fewer" and no expanding. Only real, approved testimonials may go in the data file.
 */
export function TestimonialsSection() {
  const { heading, subtext, items, readAll } = home.testimonials;
  return (
    <Section tone="white" id="testimonials" labelledBy="testimonials-heading">
      <SectionIntro id="testimonials-heading" heading={heading} subtext={subtext} align="center" />

      <CardCarousel
        className="mt-10"
        label="Customer reviews"
        itemName="Review"
        items={items.slice(0, CAROUSEL_MAX).map((item, index) => (
          <ReviewCard key={index} {...item} />
        ))}
      />

      <div className="mt-6 flex justify-center">
        <TextLink href={readAll.href} iconEnd={<ArrowRight />}>
          {readAll.label}
        </TextLink>
      </div>
    </Section>
  );
}
