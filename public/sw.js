/* Ceylinco Life service worker (plain JavaScript, no libraries).
 *
 * What it does
 *   - Saves the site's static files (scripts, styles, fonts, images, icons) so the site opens fast and works offline.
 *   - Saves public marketing pages as they are visited, and serves the saved copy when there is no connection.
 *   - Sends people to the /offline page (with ?from=<the page they wanted>) when there is no connection and the page was never
 *     saved. It redirects, instead of showing the offline HTML at the other address, because Next.js needs the address and the
 *     page to agree to start up correctly. "Try again" on that page goes back to the page they wanted.
 *
 * What it NEVER does
 *   - It never saves anything for the customer portal, payments, logins, accounts, forms, search or any API route (see
 *     NEVER_CACHE below), nor any response the server marks private or no-store (which is how pages that depend on who is
 *     signed in are sent), nor any page address with a query string. Those requests always go straight to the network.
 *   - It does not touch requests to other websites (for example an external customer portal): it ignores them completely.
 *
 * To change what is saved, edit this file and bump VERSION so old caches are removed.
 */
const VERSION = "v3";
const STATIC_CACHE = `cl-static-${VERSION}`; // scripts, styles, fonts, images, icons
const PAGES_CACHE = `cl-pages-${VERSION}`; // public marketing pages
const OFFLINE_URL = "/offline";
const PRECACHE_FILES = ["/icons/icon-192.png", "/images/ceylife-logo.svg", "/manifest.webmanifest"];
/* Pages saved at install time, with every script, style and font they need: the offline page (so it always opens) and the home page. */
const PRECACHE_PAGES = [[OFFLINE_URL, STATIC_CACHE], ["/", PAGES_CACHE]];
const ASSET_PATTERN = /(?:\/_next\/)?static\/(?:chunks|media|css)\/[A-Za-z0-9_.\-]+\.(?:js|css|woff2?)/g;
const MAX_PAGES = 30;
const MAX_STATIC = 120;

/* Address starts that are never saved: customer portal, payments, accounts, login, forms, search and APIs. */
const NEVER_CACHE = [
  "/api",
  "/portal",
  "/customer",
  "/login",
  "/signin",
  "/sign-in",
  "/account",
  "/my-",
  "/pay",
  "/payment",
  "/checkout",
  "/get-a-quote",
  "/search",
];

const isNeverCached = (url) => NEVER_CACHE.some((start) => url.pathname === start || url.pathname.startsWith(start));

/* A response is only saved when it is a plain success that the server did not mark as private. */
function isSafeToStore(response) {
  if (!response || response.status !== 200 || response.type === "opaque") return false;
  const control = (response.headers.get("Cache-Control") || "").toLowerCase();
  if (/\b(private|no-store)\b/.test(control)) return false;
  if (response.headers.has("Set-Cookie")) return false;
  if ((response.headers.get("Vary") || "").toLowerCase().includes("cookie")) return false;
  return true;
}

/* No connection and nothing saved: go to the offline page, remembering where the person was headed. */
function toOfflinePage(request) {
  const wanted = new URL(request.url);
  return Response.redirect(`${OFFLINE_URL}?from=${encodeURIComponent(wanted.pathname + wanted.search)}`, 302);
}

async function trim(cacheName, max) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  for (let index = 0; index < keys.length - max; index += 1) await cache.delete(keys[index]);
}

/* Saves the offline page and the home page together with the files they load, so they work offline from the first visit
   (files loaded before the worker took control are not otherwise saved). Anything that fails is simply skipped. */
async function precache() {
  const statics = await caches.open(STATIC_CACHE);
  await statics.addAll(PRECACHE_FILES).catch(() => {});
  for (const [path, cacheName] of PRECACHE_PAGES) {
    try {
      const response = await fetch(path);
      if (response.status !== 200) continue;
      const html = await response.clone().text();
      await (await caches.open(cacheName)).put(path, response);
      const assets = new Set((html.match(ASSET_PATTERN) || []).map((found) => (found.startsWith("/_next/") ? found : "/_next/" + found)));
      await Promise.all([...assets].map((asset) => statics.add(asset).catch(() => {})));
    } catch {
      // offline while installing: nothing to save yet
    }
  }
}

self.addEventListener("install", (event) => {
  event.waitUntil(precache().then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) => Promise.all(names.filter((name) => name.startsWith("cl-") && ![STATIC_CACHE, PAGES_CACHE].includes(name)).map((name) => caches.delete(name))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") self.skipWaiting();
});

/* Static files: saved copy first, then the network (and save it). Next.js file names change when the file changes. */
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (isSafeToStore(response)) {
    const cache = await caches.open(STATIC_CACHE);
    await cache.put(request, response.clone());
    trim(STATIC_CACHE, MAX_STATIC);
  }
  return response;
}

/* Images that can change (optimised images, /images): show the saved copy at once, refresh it in the background. */
async function staleWhileRevalidate(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cached = await cache.match(request);
  const refresh = fetch(request)
    .then((response) => {
      if (isSafeToStore(response)) {
        cache.put(request, response.clone());
        trim(STATIC_CACHE, MAX_STATIC);
      }
      return response;
    })
    .catch(() => cached);
  return cached || refresh;
}

/* Pages: the network first (so people see fresh content); saved copy when offline; the offline page as a last resort. */
async function networkFirstPage(request) {
  try {
    const response = await fetch(request);
    if (isSafeToStore(response)) {
      const cache = await caches.open(PAGES_CACHE);
      await cache.put(request, response.clone());
      trim(PAGES_CACHE, MAX_PAGES);
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    return cached || toOfflinePage(request);
  }
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return; // forms, payments and API calls are never touched
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // other websites are never touched
  if (request.headers.has("Authorization")) return; // anything signed in goes straight to the network
  if (request.headers.get("RSC") || url.searchParams.has("_rsc")) return; // Next.js app data: let the browser handle it

  // Page loads.
  if (request.mode === "navigate") {
    if (url.pathname === OFFLINE_URL) {
      // The offline page itself: the saved copy first (with or without ?from=), the network if it is somehow missing.
      event.respondWith(caches.match(OFFLINE_URL).then((saved) => saved || fetch(request)));
      return;
    }
    if (isNeverCached(url) || url.search) {
      // Straight to the network. Nothing is saved; if there is no connection the person is sent to the offline page.
      event.respondWith(fetch(request).catch(() => toOfflinePage(request)));
      return;
    }
    event.respondWith(networkFirstPage(request));
    return;
  }

  if (isNeverCached(url)) return;

  if (url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/icons/") || url.pathname === "/favicon.ico") {
    event.respondWith(cacheFirst(request));
    return;
  }
  if (url.pathname.startsWith("/_next/image") || url.pathname.startsWith("/images/") || url.pathname === "/manifest.webmanifest") {
    event.respondWith(staleWhileRevalidate(request));
  }
});
