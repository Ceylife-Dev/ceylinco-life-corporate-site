"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "./cn";
import { Reveal } from "./Reveal";

type CardCarouselProps = {
  /** Names the scrolling area for screen readers, for example "Customer reviews". */
  label: string;
  /** What one card is called, for its group label: "Review" gives "Review 2 of 6". */
  itemName: string;
  /** One entry per card. Every card is stretched to the height of the tallest. */
  items: ReactNode[];
  /** Layout only. */
  className?: string;
};

/**
 * ONE horizontal, swipeable card carousel, used by the testimonials (all screen sizes) and the news (up to 1024px: the news
 * section hides it from 1025px and shows its own bento grid instead).
 *
 * Cards per view, with a small peek of the next card in every case (the `carousel-card` and `w-carousel-*` utilities; the breakpoints
 * and the peek and gap are tokens: --breakpoint-tablet, --breakpoint-wide, --carousel-peek, --carousel-gap):
 *   up to 599px    1 card, its width = 100vw - 2 x page padding - peek (never wider than the scroller)
 *   600px-1024px   2 cards, each (the scroller's width - peek - 2 gaps) / 2
 *   1025px up      3 cards
 *
 *  - Cards snap into place (scroll-snap-type x mandatory, align start), 16px gaps, all cards as tall as the tallest, NO autoplay.
 *  - A position indicator below ("2 / 6", or "1-3 / 6" when several cards show) is updated as you scroll and announced politely.
 *  - From 600px: previous and next buttons next to the indicator (the hero switcher's look: a 32px dark circle, white chevron, 44px
 *    tap target, 70% opacity, 100% on hover and keyboard focus, no movement). They are disabled at the ends. A trackpad and
 *    shift + mouse wheel also scroll it.
 *  - It never blocks the page: vertical scrolling works over it (touch-action pan-x pan-y) and a sideways swipe stops at the ends
 *    (overscroll-behavior-x: contain).
 *  - Keyboard: the scrolling area is focusable (visible ring) and the left and right arrow keys move one card. Each card is a
 *    labelled group. With reduced motion the scroll jumps instead of gliding. The scrollbar is not drawn (the carousel still scrolls with a
 *    finger, trackpad, shift + wheel, the arrow keys and the buttons).
 *  - Below 600px the cards run to the screen edges (negative side margins equal to the page padding), so the peeking card is not
 *    cut off by the content column; from 600px they stay inside it.
 *  - The scroll reveal (fade and rise) applies to the carousel as a whole, not to each card.
 */
export function CardCarousel({ label, itemName, items, className }: CardCarouselProps) {
  const scroller = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const count = items.length;
  const [view, setView] = useState({ first: 0, last: 0, atStart: true, atEnd: count <= 1 });

  /** The distance from one card to the next (a card and one gap). */
  const step = useCallback(() => {
    const cards = scroller.current?.children;
    if (!cards || cards.length < 2) return scroller.current?.clientWidth ?? 0;
    return (cards[1] as HTMLElement).offsetLeft - (cards[0] as HTMLElement).offsetLeft;
  }, []);

  const update = useCallback(() => {
    const element = scroller.current;
    if (!element) return;
    const size = step();
    const style = getComputedStyle(element);
    const room = element.clientWidth - (parseFloat(style.paddingLeft) || 0) - (parseFloat(style.paddingRight) || 0);
    const gap = parseFloat(style.columnGap) || 0;
    const perView = size ? Math.max(1, Math.floor((room + gap + 0.5) / size)) : 1; // cards that fit fully, not counting the peek
    const max = element.scrollWidth - element.clientWidth;
    const atStart = element.scrollLeft <= 2;
    const atEnd = max <= 2 || element.scrollLeft >= max - 2;
    let first = size ? Math.round(element.scrollLeft / size) : 0;
    if (atEnd && max > 2) first = Math.max(0, count - perView);
    first = Math.max(0, Math.min(count - 1, first));
    setView({ first, last: Math.min(count - 1, first + perView - 1), atStart, atEnd });
  }, [count, step]);

  const onScroll = useCallback(() => {
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(update);
  }, [update]);

  // Work out the position once the cards are laid out, and again when the window size (and so cards per view) changes.
  useEffect(() => {
    const element = scroller.current;
    if (!element) return;
    const start = requestAnimationFrame(update);
    const observer = new ResizeObserver(() => requestAnimationFrame(update));
    observer.observe(element);
    return () => {
      cancelAnimationFrame(start);
      cancelAnimationFrame(frame.current);
      observer.disconnect();
    };
  }, [update]);

  function move(direction: 1 | -1) {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    scroller.current?.scrollBy({ left: direction * step(), behavior: reduced ? "auto" : "smooth" });
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    move(event.key === "ArrowRight" ? 1 : -1);
  }

  const position = view.first === view.last ? `${view.first + 1} / ${count}` : `${view.first + 1}–${view.last + 1} / ${count}`;

  const arrowClasses =
    "group size-11 cursor-pointer items-center justify-center rounded-full disabled:pointer-events-none disabled:opacity-40";
  const circleClasses =
    "flex size-8 items-center justify-center rounded-full bg-hero-control text-ink-on-brand opacity-70 transition-opacity duration-base " +
    "group-hover:opacity-100 group-focus-visible:opacity-100 group-active:opacity-100";

  return (
    <Reveal className={className}>
      <div
        ref={scroller}
        role="region"
        aria-label={label}
        tabIndex={0}
        onScroll={onScroll}
        onKeyDown={onKeyDown}
        className={cn(
          "scrollbar-hidden -mx-4 flex gap-carousel snap-x snap-mandatory overflow-x-auto overscroll-x-contain px-4 py-2 tablet:-mx-1 tablet:px-1",
          "touch-pan-x touch-pan-y scroll-px-4 focus-visible:-outline-offset-2 tablet:scroll-px-1",
        )}
      >
        {items.map((item, position) => (
          <div key={position} role="group" aria-label={`${itemName} ${position + 1} of ${count}`} className="carousel-card flex w-carousel-one snap-start tablet:w-carousel-two wide:w-carousel-three">
            {item}
          </div>
        ))}
      </div>

      {/* The position (same look in every carousel), with previous / next buttons from 600px. */}
      <div className="mt-3 flex items-center justify-center gap-1">
        <button type="button" aria-label={`Previous ${itemName.toLowerCase()}`} disabled={view.atStart} onClick={() => move(-1)} className={cn(arrowClasses, "hidden tablet:inline-flex")}>
          <span className={circleClasses}>
            <ChevronLeft aria-hidden="true" className="size-4" />
          </span>
        </button>
        <p aria-live="polite" className="min-w-16 text-center text-sm text-ink-muted tabular-nums">
          {position}
        </p>
        <button type="button" aria-label={`Next ${itemName.toLowerCase()}`} disabled={view.atEnd} onClick={() => move(1)} className={cn(arrowClasses, "hidden tablet:inline-flex")}>
          <span className={circleClasses}>
            <ChevronRight aria-hidden="true" className="size-4" />
          </span>
        </button>
      </div>
    </Reveal>
  );
}
