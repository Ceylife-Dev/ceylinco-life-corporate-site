import { Section, Skeleton } from "@/components/ui";
import { pwa } from "@/content/pwa";

/**
 * Shown while a page is loading (for example the first time an installed app opens a page): grey skeleton blocks in the
 * shape of a page (a heading, two lines of text and three cards), in the design system's own colours and radii.
 * `aria-busy` plus a screen-reader-only "Loading" tell assistive technology what is happening.
 */
export default function Loading() {
  return (
    <main id="main-content" aria-busy="true">
      <Section tone="white">
        <p role="status" className="sr-only">
          {pwa.loading}
        </p>
        <div className="mx-auto flex max-w-prose flex-col items-center gap-4">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-2/3" />
        </div>
        <div className="mt-10 grid gap-4 md:gap-6 lg:grid-cols-3">
          {[0, 1, 2].map((index) => (
            <div key={index} className="rounded-container border border-border bg-surface p-6 shadow-sm md:p-8">
              <Skeleton className="size-14" />
              <Skeleton className="mt-6 h-6 w-2/3" />
              <Skeleton className="mt-3 h-4 w-full" />
              <Skeleton className="mt-2 h-4 w-5/6" />
            </div>
          ))}
        </div>
      </Section>
    </main>
  );
}
