import type { MetadataRoute } from "next";

/**
 * robots.txt: search engines may visit everything except the offline page (it is only a fallback for the installed app).
 * Add a `sitemap` line here when the site's real address is known.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/offline"] },
  };
}
