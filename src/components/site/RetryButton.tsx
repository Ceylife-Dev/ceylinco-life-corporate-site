"use client";

import { Button } from "@/components/ui";

/**
 * "Try again" on the offline page: goes back to the page the person was heading to (the service worker adds it as
 * ?from=/the/page). Only an address on this site is accepted; otherwise it reloads. If there is still no connection the
 * service worker sends them straight back here.
 */
export function RetryButton({ children }: { children: string }) {
  function retry() {
    const from = new URLSearchParams(window.location.search).get("from");
    const safe = from && from.startsWith("/") && !from.startsWith("//") && !from.startsWith("/offline");
    if (safe) window.location.assign(from);
    else window.location.reload();
  }
  return <Button onClick={retry}>{children}</Button>;
}
