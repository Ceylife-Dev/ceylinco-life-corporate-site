"use client";

import { useEffect } from "react";

/**
 * Registers the service worker (public/sw.js) so the site can work offline and be installed.
 * It only runs in the production build: in development the worker is switched off (and any old one removed), so saved
 * copies never hide your changes. It renders nothing.
 */
export function PwaRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    if (process.env.NODE_ENV !== "production") {
      navigator.serviceWorker.getRegistrations().then((registrations) => registrations.forEach((registration) => registration.unregister()));
      return;
    }

    const register = () => navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {});
    // Wait until the page has loaded, so registering never slows the first visit down.
    if (document.readyState === "complete") register();
    else window.addEventListener("load", register, { once: true });
  }, []);

  return null;
}
