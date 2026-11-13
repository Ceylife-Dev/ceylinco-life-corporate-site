"use client";

import { getImageProps } from "next/image";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import { Button, cn } from "@/components/ui";
import { CaseToggle } from "@/components/site/CaseToggle";
import { home, type HeroImage } from "@/content/home";
import { caseProps } from "@/lib/case";

/** The props for a hero image (srcset, sizes, width and height) from next/image, for the plain <img> and <source> inside <picture>. */
const heroProps = (src: string, width: number, height: number, alt: string) => getImageProps({ src, width, height, alt, sizes: "100vw" }).props;
const desktopProps = (image: HeroImage) => heroProps(image.src, image.width, image.height, image.alt);
const mobileProps = (image: HeroImage) => heroProps(image.mobile?.src ?? image.src, image.mobile?.width ?? image.width, image.mobile?.height ?? image.height, image.alt);

/** Adds the given slide numbers to a list, without repeating any. */
const withSlides = (list: number[], add: number[]) => [...new Set([...list, ...add])];

/** The slideshow stops on the first image after this many full loops. */
const LOOPS = 3;

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/** A time token from tokens.css in milliseconds (for example --hero-autoplay: 6500ms). */
function tokenMs(name: string, fallback: number) {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const value = parseFloat(raw);
  if (Number.isNaN(value)) return fallback;
  return raw.endsWith("ms") ? value : value * 1000;
}

/**
 * 1. Hero: a full-bleed family photo that fills the screen below the sticky (solid white) header. The photo is a slideshow of the four
 * hero images: each one stays for 6.5 seconds (--hero-autoplay), then the next fades in over it for 800ms (--hero-fade-duration, ease-out;
 * opacity only, no sliding, scaling or zoom), and it loops. The headline, text, buttons and trust row never change.
 *
 * It waits (never advances) only while focus is inside the hero, while the page is hidden and while the hero is off screen (less than 10%
 * visible; it counts as visible until the observer says otherwise), and starts again afterwards. Hovering with the mouse does not pause it.
 * After three full loops it rests on the first image. An image that has not loaded yet is skipped, never waited for. There are no controls.
 * With reduced motion there is no autoplay and no crossfade: only the first image is shown (a note is logged in development).
 * Automatic changes are never announced (the region is aria-live="off" while it plays); the images are decorative (alt="").
 *
 * Hero images: confirm licence before launch. Each image is anchored by the --hero-position tokens (or its own `focus` in the content
 * file) so the family stays visible; a scrim (--color-scrim-hero-*) darkens the left side (the top on phones) so the white text passes
 * contrast, and from tablet up a second, bottom scrim sits under the full-width trust row. The scrims are the same for every image.
 * If contrast ever fails, raise the scrim opacity, not the text size (check with `npm run check:hero`, which tests every image).
 *
 * The first image loads at once with high priority. Once it has loaded, the other three are fetched (low priority), so there is no blank
 * frame when the slideshow reaches them. Every image has its real width and height, so nothing shifts.
 */
export function Hero() {
  const { headline, support, primaryCta, secondaryCta, trust, images } = home.hero;
  const count = images.length;
  const reduced = useSyncExternalStore(subscribeReducedMotion, () => window.matchMedia(REDUCED_MOTION).matches, () => false);

  const [shown, setShown] = useState(0); // the image on top (it only changes once that image has loaded)
  const [under, setUnder] = useState<number[]>([]); // images kept fully visible underneath while the new one fades in
  const [mounted, setMounted] = useState<number[]>([0]); // images added to the page so far

  const shownRef = useRef(0);
  const loaded = useRef(new Set<number>());
  const loops = useRef(0); // full loops finished (the count goes up each time the slideshow comes back round to the first image)
  const sectionRef = useRef<HTMLElement>(null);
  const holds = useRef({ hidden: false, offscreen: false }); // focus is read live (see schedule)
  const reschedule = useRef<() => void>(() => {});

  const show = useCallback((index: number) => {
    const previous = shownRef.current;
    if (index === previous) return;
    shownRef.current = index;
    setUnder((list) => withSlides(list, [previous])); // the old image stays fully visible underneath while the new one fades in
    setShown(index);
  }, []);

  /** Moves to the next image that has loaded (the last goes back to the first). One that is still loading is skipped, never waited for. */
  const advance = useCallback(() => {
    const from = shownRef.current;
    for (let step = 1; step < count; step++) {
      const target = (from + step) % count;
      if (!loaded.current.has(target)) continue;
      if (target < from) loops.current += 1;
      show(target);
      return;
    }
  }, [count, show]);

  const onSlideLoaded = useCallback(
    (index: number) => {
      loaded.current.add(index);
      // The first image has loaded: now fetch the others, so the slideshow never meets a blank frame.
      if (index === 0 && !window.matchMedia(REDUCED_MOTION).matches) setMounted(Array.from({ length: count }, (_, i) => i));
    },
    [count],
  );

  // Safety net: if the first image's load event was missed, still fetch the others after a moment.
  useEffect(() => {
    if (reduced) return;
    const timer = window.setTimeout(() => setMounted(Array.from({ length: count }, (_, i) => i)), 2500);
    return () => window.clearTimeout(timer);
  }, [count, reduced]);

  // The slideshow: one timer per image, started only when nothing is holding it. Any change in what holds it starts the wait again.
  useEffect(() => {
    if (reduced) {
      if (process.env.NODE_ENV === "development") console.info("[hero] prefers-reduced-motion is on: showing the first image only, no autoplay.");
      return;
    }
    const interval = tokenMs("--hero-autoplay", 6500);
    let timer = 0;
    // Nothing may hold it: three loops done and back on the first image, focus inside the hero, page hidden, hero off screen.
    // Read live each time, so a focus or visibility change that was missed can never let a tick through.
    const blocked = () =>
      (loops.current >= LOOPS && shownRef.current === 0) ||
      !!sectionRef.current?.contains(document.activeElement) ||
      holds.current.hidden ||
      holds.current.offscreen;
    const schedule = () => {
      window.clearTimeout(timer);
      timer = 0;
      if (blocked()) return;
      timer = window.setTimeout(() => {
        timer = 0;
        if (blocked()) return; // waits; the event that lifts the hold calls schedule() again
        advance();
        schedule();
      }, interval);
    };
    reschedule.current = schedule;
    const onVisibility = () => {
      holds.current.hidden = document.hidden;
      schedule();
    };
    holds.current.hidden = document.hidden;
    document.addEventListener("visibilitychange", onVisibility);
    // The hero counts as on screen until the observer says otherwise; it is off screen when less than 10% of it is visible.
    const watcher = new IntersectionObserver(
      ([entry]) => {
        holds.current.offscreen = !entry.isIntersecting;
        schedule();
      },
      { threshold: 0.1 },
    );
    if (sectionRef.current) watcher.observe(sectionRef.current);
    schedule();
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisibility);
      watcher.disconnect();
    };
  }, [advance, reduced]);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="hero-heading"
      onFocus={() => reschedule.current()}
      onBlur={() => reschedule.current()}
      className="focus-on-dark relative isolate grid hero-rows min-h-hero overflow-hidden bg-footer-bg text-ink-on-brand bar:flex bar:items-stretch"
    >
      {/* The carousel: the images, and the scrims. Phones: the photo area below the text block. From 769px: the whole hero. */}
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label="Featured images"
        aria-live="off"
        className="relative col-start-1 row-start-2 min-h-hero-photo bar:absolute bar:inset-0"
      >
        {/* The images (decorative). Their own stacking context keeps the crossfade below the scrims. */}
        <div aria-hidden="true" className="absolute inset-0 isolate">
          {images.map((image, index) =>
            mounted.includes(index) && (index === 0 || !reduced) ? (
              <div
                key={image.src}
                onTransitionEnd={() => index === shownRef.current && setUnder([])}
                style={
                  {
                    "--slide-position-desktop": image.focus?.desktop,
                    "--slide-position-mobile": image.focus?.mobile,
                    "--slide-position-tablet": image.focus?.tablet,
                  } as CSSProperties
                }
                className={cn(
                  "hero-fade absolute inset-0",
                  index === shown ? "z-raised opacity-100" : under.includes(index) ? "opacity-100" : "opacity-0",
                )}
              >
                {/* Up to 599px a crop of the photo (about 1000px wide) is served; from 600px the full photo, as before. */}
                <picture className="contents">
                  {image.mobile && <source media="(max-width: 599px)" srcSet={mobileProps(image).srcSet} sizes="100vw" />}
                  {/* The plain <img> in <picture> is how next/image does art direction (getImageProps). */}
                  <img
                    {...desktopProps(image)}
                    alt={image.alt}
                    // The first image loads at once with high priority; the others wait for it, then load at low priority.
                    fetchPriority={index === 0 ? "high" : "low"}
                    loading={index === 0 ? undefined : "eager"}
                    onLoad={() => onSlideLoaded(index)}
                    ref={(el) => {
                      if (el?.complete && el.naturalWidth > 0) loaded.current.add(index); // already loaded before React took over
                    }}
                    className="absolute inset-0 size-full object-cover object-hero-mobile tablet:object-hero-tablet bar:object-hero-desktop"
                  />
                </picture>
              </div>
            ) : null,
          )}
        </div>

        {/* Phones: a short fade from the near-black into the photo at its top, and a darker one at its bottom behind the trust facts (both
            fixed: they never move or fade with the slides). From 769px the original scrims are used. */}
        <div aria-hidden="true" className="absolute inset-x-0 top-0 hero-fade-top bg-hero-scrim-phone-top bar:inset-0 bar:bg-hero-scrim-mobile lg:bg-hero-scrim-desktop" />
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 hero-fade-bottom bg-hero-scrim-phone-bottom bar:inset-0 bar:bg-hero-scrim-bottom" />
      </div>

      {/* Review tool: text case toggle (development, or ?review=1 only). */}
      <CaseToggle />

      {/* Phones: this wrapper disappears and its two children sit in the hero's grid (the text block in row 1, the trust facts at the bottom of
          row 2 over the photo). From 769px it is the content column: the headline block in the middle of the free height, the trust row at the bottom. */}
      <div className="contents bar:relative bar:mx-auto bar:flex bar:w-full bar:max-w-page bar:flex-col bar:px-6 bar:pt-16 bar:pb-16">
        <div className="relative col-start-1 row-start-1 px-4 pt-12 pb-4 bar:static bar:flex bar:flex-1 bar:items-center bar:p-0">
          <div className="w-full max-w-hero lg:w-3/5">
            <h1
              id="hero-heading"
              {...caseProps}
              className="text-2xl text-ink-on-brand text-shadow-hero bar:text-3xl xl:text-4xl"
            >
              {headline}
            </h1>
            <p className="mt-3 max-w-hero-support text-base text-footer-text bar:mt-4 bar:text-lg">{support}</p>

            {/* Phones: two equal buttons side by side while they fit (about 152px each), otherwise stacked at full width. */}
            <div className="mt-6 grid hero-cta-grid gap-3 bar:mt-8 bar:flex bar:flex-wrap">
              <Button tone="inverse" href={primaryCta.href} className="w-full bar:w-auto">
                {primaryCta.label}
              </Button>
              <Button tone="inverse" variant="secondary" href={secondaryCta.href} className="w-full bar:w-auto">
                {secondaryCta.label}
              </Button>
            </div>
          </div>
        </div>

        {/* Trust facts. Phones: a compact 14px strip at the bottom of the photo (16px between the facts, line-height 1.4, 24px plus the safe area below), with 72px of right padding to clear the floating chat button.
            From 769px a full-width row (the three items spread across the container from xl, left-aligned below that, 64px of right padding). */}
        <ul className="relative col-start-1 row-start-2 flex flex-col gap-4 self-end pr-18 pl-4 hero-strip-pad bar:static bar:mt-8 bar:flex-row bar:flex-wrap bar:gap-x-8 bar:gap-y-3 bar:self-auto bar:p-0 bar:pr-16 xl:justify-between">
          {trust.map(({ icon: Icon, text, mobileText }) => (
            <li key={text} className="flex items-start gap-3 text-sm leading-compact text-shadow-strip text-ink-on-brand bar:text-base bar:leading-body bar:text-shadow-none">
              <Icon aria-hidden="true" className="mt-0.5 size-4 shrink-0 bar:size-5" />
              {/* Phones show the shorter wording when there is one; larger screens always show the full wording. */}
              {mobileText ? (
                <>
                  <span className="bar:hidden">{mobileText}</span>
                  <span className="hidden bar:inline">{text}</span>
                </>
              ) : (
                <span>{text}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
