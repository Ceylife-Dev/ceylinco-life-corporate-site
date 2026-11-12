"use client";

import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button, Card, IconButton } from "@/components/ui";
import { pwa } from "@/content/pwa";

/** The (not yet standard) event the browser sends when the site can be installed. */
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const VISITS_KEY = "cl:visits";
const COUNTED_KEY = "cl:visit-counted";
const DISMISSED_KEY = "cl:install-dismissed";
const MIN_VISITS = 2; // show it from the second visit on, never on the first
const QUIET_DAYS = 30; // after "Not now" (or an install), stay quiet for this long

/** localStorage can be blocked (private windows): every read and write is wrapped, and the card simply stays hidden. */
function safe<T>(action: () => T, fallback: T): T {
  try {
    return action();
  } catch {
    return fallback;
  }
}

/**
 * A dismissible "Add to home screen" card, for phones and tablets only.
 *
 * It appears only when ALL of these are true: the browser has offered the install (the beforeinstallprompt event, which
 * Chrome and Edge on Android send; Safari on iPhone does not, so nothing shows there), this is a repeat visit (the
 * second or later visit, counted once per browser session), the site is not already installed, and the card was not
 * dismissed in the last 30 days. "Add to home screen" opens the browser's own install dialog. It is hidden on desktop.
 */
export function InstallPrompt() {
  const [offer, setOffer] = useState<BeforeInstallPromptEvent | null>(null);
  const [repeatVisit, setRepeatVisit] = useState(false);
  const [visible, setVisible] = useState(false);
  const eventRef = useRef<BeforeInstallPromptEvent | null>(null);

  // Count this visit once per session, and work out whether the card is allowed to show.
  useEffect(() => {
    const standalone = window.matchMedia("(display-mode: standalone)").matches;
    if (standalone) return;

    const counted = safe(() => sessionStorage.getItem(COUNTED_KEY), "1");
    let visits = safe(() => Number(localStorage.getItem(VISITS_KEY)) || 0, 0);
    if (!counted) {
      visits += 1;
      safe(() => localStorage.setItem(VISITS_KEY, String(visits)), undefined);
      safe(() => sessionStorage.setItem(COUNTED_KEY, "1"), undefined);
    }
    const dismissedAt = safe(() => Number(localStorage.getItem(DISMISSED_KEY)) || 0, 0);
    const quiet = Date.now() - dismissedAt < QUIET_DAYS * 24 * 60 * 60 * 1000;
    // Defer the state updates so they do not run synchronously inside the effect.
    queueMicrotask(() => setRepeatVisit(visits >= MIN_VISITS && !quiet));
  }, []);

  useEffect(() => {
    function onBeforeInstall(event: Event) {
      event.preventDefault(); // keep the event so the card can open the install dialog later
      eventRef.current = event as BeforeInstallPromptEvent;
      setOffer(event as BeforeInstallPromptEvent);
    }
    function onInstalled() {
      safe(() => localStorage.setItem(DISMISSED_KEY, String(Date.now())), undefined);
      setVisible(false);
      setOffer(null);
    }
    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  useEffect(() => {
    queueMicrotask(() => setVisible(Boolean(offer) && repeatVisit));
  }, [offer, repeatVisit]);

  function dismiss() {
    safe(() => localStorage.setItem(DISMISSED_KEY, String(Date.now())), undefined);
    setVisible(false);
  }

  async function install() {
    const event = eventRef.current;
    if (!event) return;
    setVisible(false);
    await event.prompt();
    const { outcome } = await event.userChoice;
    eventRef.current = null;
    setOffer(null);
    if (outcome === "dismissed") safe(() => localStorage.setItem(DISMISSED_KEY, String(Date.now())), undefined);
  }

  if (!visible) return null;

  const { title, text, add, dismiss: dismissLabel } = pwa.install;
  return (
    <div role="region" aria-label={title} className="fixed-install fixed z-raised nav:hidden">
      <Card padding="md" shadow="md">
        <div className="flex items-start gap-2">
          <div className="min-w-0 flex-1">
            <p className="font-semibold">{title}</p>
            <p className="mt-1 text-sm text-ink-muted">{text}</p>
            <div className="mt-3">
              <Button size="sm" onClick={install}>
                {add}
              </Button>
            </div>
          </div>
          <IconButton label={dismissLabel} icon={<X />} onClick={dismiss} />
        </div>
      </Card>
    </div>
  );
}
