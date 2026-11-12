import type { MetadataRoute } from "next";
import { colourToken } from "@/lib/tokens";
import { pwa } from "@/content/pwa";
import { site } from "@/content/site";

/**
 * The web app manifest (served at /manifest.webmanifest). It makes the site installable.
 * The two colours cannot read CSS variables, so they are read from the design tokens (src/styles/tokens.css):
 *   theme_color      = `brand`   (the browser's address bar / status bar colour)
 *   background_color = `surface` (the splash screen)
 * Icons are made by scripts/make-pwa-icons.mjs from the logo (public/icons).
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: pwa.app.name,
    short_name: pwa.app.shortName,
    description: site.description,
    id: "/",
    start_url: "/",
    scope: "/",
    display: "standalone",
    theme_color: colourToken("brand"),
    background_color: colourToken("surface"),
    lang: "en",
    categories: ["finance", "business"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
