import { WifiOff } from "lucide-react";
import type { Metadata } from "next";
import { RetryButton } from "@/components/site/RetryButton";
import { Section, TextLink } from "@/components/ui";
import { pwa } from "@/content/pwa";

export const metadata: Metadata = {
  title: pwa.offline.title,
  robots: { index: false },
};

/**
 * The offline page. The service worker (public/sw.js) shows it when there is no connection and the page was not saved.
 * It is saved when the app is installed, so it always opens. One filled button (Try again) and one text link.
 */
export default function OfflinePage() {
  const { title, text, note, retry, home } = pwa.offline;
  return (
    <main id="main-content">
      <Section tone="alt" labelledBy="offline-heading" className="min-h-hero">
        <div className="mx-auto flex max-w-prose flex-col items-center text-center">
          <span aria-hidden="true" className="flex size-20 items-center justify-center rounded-control bg-brand-tint text-brand">
            <WifiOff className="size-10" />
          </span>
          <h1 id="offline-heading" className="mt-8 text-2xl md:text-3xl">
            {title}
          </h1>
          <p className="mt-4 text-ink-muted">{text}</p>
          <p className="mt-2 text-sm text-ink-muted">{note}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <RetryButton>{retry}</RetryButton>
            <TextLink href="/">{home}</TextLink>
          </div>
        </div>
      </Section>
    </main>
  );
}
