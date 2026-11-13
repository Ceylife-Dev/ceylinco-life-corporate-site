/**
 * Site-wide facts that more than one component needs.
 * Menu copy and links will live in src/content/navigation.ts (Phase 2).
 */
export const site = {
  /** Used for the page title and the logo's alt text. */
  name: "Ceylinco Life",
  description: "Life, medical, retirement and investment insurance for individuals and families in Sri Lanka.",
  /** The spoken name of the logo link (header and footer): the logo is a picture, and the link goes to the home page. */
  homeLinkLabel: "Ceylinco Life, home page",
  /** Added to the spoken name of a link that opens in a new tab. */
  opensInNewTab: "opens in a new tab",
  /** The page shown for an address that does not exist. */
  notFound: {
    title: "We can't find that page",
    text: "The address may be wrong, or the page may have moved.",
    home: "Go to the home page",
  },
} as const;
