import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { Button, Card, CardCarousel, Reveal, Section } from "@/components/ui";
import { home, type NewsItem } from "@/content/home";
import { caseProps } from "@/lib/case";

/** One story as a carousel card (phones and small tablets): a 16:9 photo, the date, then the headline (three lines at most). All cards look the same.
 * The photo is decorative here (alt=""): the link already says what the story is, so its spoken name is just the date and the headline in the order
 * they are shown (the visible text is part of the name, WCAG 2.5.3). */
function NewsCard({ date, iso, headline, href, image }: NewsItem) {
  return (
    <Card
      variant="interactive"
      href={href}
      padding="none"
      shadow="sm"
      press="brand"
      className="h-full min-w-0"
    >
      <div className="flex h-full min-w-0 flex-col p-4">
        <div className="relative aspect-16/9 overflow-hidden rounded-control">
          <Image
            src={image.src}
            alt=""
            width={640}
            height={360}
            sizes="80vw"
            className="size-full object-cover"
            style={{ objectPosition: image.focus }}
          />
        </div>
        <div className="mt-4 min-w-0 px-1">
          <time dateTime={iso} className="block text-sm text-ink-muted">
            {date}
          </time>
          <h3 className="mt-2 line-clamp-3 min-w-0 text-lg font-semibold break-words">{headline}</h3>
        </div>
      </div>
    </Card>
  );
}

/**
 * 7. News (white tone).
 *
 * From 1025px: a bento grid. The first item is the featured card.
 *
 * Desktop (from 900px, the `bento` breakpoint): a 12-column grid with a 24px gap and two equal rows of 15rem
 * (240px, the `auto-rows-news` utility, so the cards carry no fixed heights). The featured card spans 7 columns and both
 * rows; the two small cards each span 5 columns and one row, so the featured card's bottom edge and the second small
 * card's bottom edge line up exactly. The grid edges are the section container's edges.
 * Up to 1024px: the shared swipeable CardCarousel instead of the bento (one card per view below 600px, two from 600px): identical cards (no featured card), newest first, each a
 * 16:9 photo (with its own `focus`), the date in a <time> element and the headline limited to three lines (the only place
 * headlines are cut). The whole card is the link; pressing it turns the border maroon. "View all news" is under the carousel up to 1024px
 * (centred, so the floating chat button can never cover it) and in the heading row from 1025px.
 *
 * Every desktop card: white, 24px radius, 1px border, sm shadow, 16px inner padding, photo inset with a 12px radius (24 - 12, so the
 * curves are concentric). Desktop headlines are never cut off: no line clamp and no "...". Each photo has an optional `focus`
 * (object-position) in the content file so faces are not cropped. No card has an arrow (the featured card's circular arrow was removed); the whole card is the link and its headline underlines on hover.
 */
export function NewsSection() {
  const { heading, allLabel, allHref, items } = home.news;
  const [featured, ...small] = items;
  // Newest first for the carousel.
  const newestFirst = [...items].sort((a, b) => b.iso.localeCompare(a.iso));

  return (
    <Section tone="white" labelledBy="news-heading">
      {/* Heading on the left, "View all news" on the right, centred on one row. The link's right edge sits on the
          container edge (the button has 8px of side padding, so it is pulled back by that much). Up to 1024px the link moves
          under the carousel (it does not fit beside the heading at 320px, and the chat button could cover it at the right edge). */}
      <Reveal className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <h2 id="news-heading" {...caseProps}>{heading}</h2>
        <div className="hidden wide:block">
          <Button variant="tertiary" href={allHref} iconEnd={<ArrowRight />} className="-mr-2">
            {allLabel}
          </Button>
        </div>
      </Reveal>

      {/* Up to 1024px: the shared carousel. */}
      <div className="mt-10 wide:hidden">
        <CardCarousel label="Latest news stories" itemName="Story" items={newestFirst.map((item) => <NewsCard key={item.headline} {...item} />)} />
        <div className="mt-6 flex justify-center">
          <Button variant="tertiary" href={allHref} iconEnd={<ArrowRight />}>
            {allLabel}
          </Button>
        </div>
      </div>

      {/* From 1025px: the bento grid (unchanged). */}
      <ul className="mt-10 hidden gap-4 wide:grid bento:auto-rows-news bento:grid-cols-12 bento:gap-6">
        {featured && (
          <Reveal as="li" className="bento:col-span-7 bento:row-span-2">
            <Card
              variant="interactive"
              href={featured.href}
              padding="none"
              shadow="sm"
              className="h-full"
            >
              <div className="relative flex h-full flex-col p-4">
                {/* The photo takes all the remaining height on desktop (so the card fills its cell) and is 16:9 below. */}
                <div className="relative aspect-16/9 overflow-hidden rounded-control bento:aspect-auto bento:min-h-0 bento:flex-1">
                  <Image
                    src={featured.image.src}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 640px, 100vw"
                    className="object-cover"
                    style={{ objectPosition: featured.image.focus }}
                  />
                </div>
                <div className="mt-4 px-1">
                  <time dateTime={featured.iso} className="block text-sm text-ink-muted">
                    {featured.date}
                  </time>
                  <h3 className="mt-2 text-xl font-semibold">
                    <span className="link-underline group-hover:link-underline-shown group-focus-visible:link-underline-shown group-active:link-underline-shown">
                      {featured.headline}
                    </span>
                  </h3>
                </div>
              </div>
            </Card>
          </Reveal>
        )}

        {small.map(({ date, iso, headline, href, image }) => (
          <Reveal as="li" key={headline} className="bento:col-span-5">
            <Card
              variant="interactive"
              href={href}
              padding="none"
              shadow="sm"
              className="h-full"
            >
              <div className="flex h-full p-4">
                {/* The photo fills the full height of the card, about 40% wide, never narrower than 112px. */}
                <div className="relative min-h-28 w-2/5 min-w-28 shrink-0 overflow-hidden rounded-control">
                  <Image
                    src={image.src}
                    alt=""
                    fill
                    sizes="(min-width: 900px) 190px, 40vw"
                    className="object-cover"
                    style={{ objectPosition: image.focus }}
                  />
                </div>
                {/* The text column stretches the card height: the date at the top, the headline below it. */}
                <div className="flex flex-1 flex-col justify-between gap-3 py-2 pr-2 pl-5">
                  <time dateTime={iso} className="text-sm text-ink-muted">
                    {date}
                  </time>
                  <h3 className="text-lg font-semibold">
                    <span className="link-underline group-hover:link-underline-shown group-focus-visible:link-underline-shown group-active:link-underline-shown">
                      {headline}
                    </span>
                  </h3>
                </div>
              </div>
            </Card>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
