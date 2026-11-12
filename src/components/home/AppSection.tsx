import { Check } from "lucide-react";
import Image from "next/image";
import { Button, Reveal, Section, StoreBadge } from "@/components/ui";
import { home } from "@/content/home";
import { caseProps } from "@/lib/case";
import { AppSwoosh } from "./AppSwoosh";

/**
 * 7. Mobile app and self-service (alt tone): a large picture of the app on the left, details on the right.
 *
 * The picture (`mobile.svg`, 1015 x 1058: two phones, the home screen overlapping the Pay premium screen, on a transparent
 * background) fills the left column. A soft pink swoosh (AppSwoosh) sits behind it and bleeds off the left edge of the screen.
 * The image is decorative (the text beside it says it all), loads lazily and only fades in on scroll. Below 1024px the columns
 * stack with the picture UNDER the text.
 * The text column has three clear levels:
 *   1. the heading (44px bold) with the intro line (18px, muted) under it;
 *   2. the four key details as a list: a maroon tick in a small pink tile, and 18px medium text, with generous space between rows;
 *   3. a divider, then the actions: the three official store badges (StoreBadge), then "Prefer using the website?" with two outline
 *      buttons (Pay premium online, Customer portal). Both are hidden in the installed app (hide-standalone).
 */
export function AppSection() {
  const { heading, intro, features, stores, webFallback, image } = home.app;
  return (
    <Section tone="alt" labelledBy="app-heading" className="overflow-clip">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal variant="fade" className="relative order-first mx-auto w-full md:max-w-lg lg:order-first lg:max-w-none">
          <AppSwoosh />
          <Image
            src={image.src}
            width={image.width}
            height={image.height}
            alt=""
            aria-hidden="true"
            unoptimized
            sizes="(min-width: 1024px) 568px, (min-width: 768px) 512px, 100vw"
            className="relative h-auto w-full max-w-full object-contain lg:max-h-136"
          />
        </Reveal>

        <Reveal>
          <h2 id="app-heading" {...caseProps}>{heading}</h2>
          <p className="mt-4 text-lg text-ink-muted">{intro}</p>

          <ul className="mt-8 flex flex-col gap-4">
            {features.map((feature) => (
              <li key={feature} className="flex items-center gap-4">
                <span
                  aria-hidden="true"
                  className="flex size-8 shrink-0 items-center justify-center rounded-control bg-brand-tint text-brand"
                >
                  <Check className="size-5" />
                </span>
                <span className="text-lg font-medium">{feature}</span>
              </li>
            ))}
          </ul>

          {/* The store badges and the website fallback. Both are hidden in the installed app (they are for getting the app). */}
          <div className="hide-standalone mt-10 border-t border-border pt-8">
            {/* One row at one height (48px; 44px up to 768px) with 12px gaps; up to 768px the row is narrow enough to wrap two plus one. */}
            <div className="flex max-w-80 flex-wrap gap-3 bar:max-w-none">
              {stores.map(({ name, ariaLabel, badge, href }) => (
                <StoreBadge key={name} src={badge.src} width={badge.width} height={badge.height} label={ariaLabel} href={href} />
              ))}
            </div>

            {/* Label, thin divider, two outline buttons. One row only where the column is wide enough (769px to 1023px); label above the
                buttons from 1024px; stacked full width up to 768px.
            <div className="mt-6 flex flex-col gap-3 bar:flex-row bar:items-center bar:gap-4 lg:flex-col lg:items-start lg:gap-3">
              <p className="text-base text-ink-muted">{webFallback.label}</p>
              <span aria-hidden="true" className="hidden h-8 w-px bg-border bar:block lg:hidden" />
              <div className="flex flex-col gap-3 bar:flex-row">
                {webFallback.links.map(({ label, href, icon: Icon }) => (
                  <Button key={label} variant="secondary" hoverFill href={href} iconStart={<Icon aria-hidden="true" />} className="w-full bar:w-auto">
                    {label}
                  </Button>
                ))}
              </div>
            </div> */}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
