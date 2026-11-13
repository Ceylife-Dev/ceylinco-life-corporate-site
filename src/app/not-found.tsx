import { SearchX } from "lucide-react";
import type { Metadata } from "next";
import { Section, TextLink } from "@/components/ui";
import { site } from "@/content/site";

export const metadata: Metadata = {
  robots: { index: false },
};

/**
 * The page for an address that does not exist. It has the same landmarks as every page (the skip link in the header jumps to
 * `main-content`) and one h1, so a screen reader user knows where they are and the way back.
 */
export default function NotFound() {
  const { title, text, home } = site.notFound;
  return (
    <main id="main-content">
      {/* The page title (React puts it in the <head>): not-found pages cannot set it through `metadata`. */}
      <title>{`${title} | ${site.name}`}</title>
      <Section tone="alt" labelledBy="not-found-heading" className="min-h-hero">
        <div className="mx-auto flex max-w-prose flex-col items-center text-center">
          <span aria-hidden="true" className="flex size-20 items-center justify-center rounded-control bg-brand-tint text-brand">
            <SearchX className="size-10" />
          </span>
          <h1 id="not-found-heading" className="mt-8 text-2xl md:text-3xl">
            {title}
          </h1>
          <p className="mt-4 text-ink-muted">{text}</p>
          <div className="mt-8">
            <TextLink href="/">{home}</TextLink>
          </div>
        </div>
      </Section>
    </main>
  );
}
