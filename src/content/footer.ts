/**
 * FOOTER CONTENT: shown at the bottom of every page.
 * A "// SAMPLE: confirm with Ceylinco before launch" comment marks stand-in
 * content that must be confirmed. A link of "#" means the real address has not
 * been given yet. See src/content/home.ts for the full rules.
 * Link lists reuse the menu data in navigation.ts, so a page address only ever
 * has to be fixed in one place.
 */
import { aboutMenu, claimsMenu, productsMenu, type MegaMenu } from "./navigation";

/** Pick menu items by title, in the order given. */
const pick = (menu: MegaMenu, titles: string[]) => {
  const all = menu.groups.flatMap((group) => group.items);
  return titles.map((title) => {
    const item = all.find((entry) => entry.title === title);
    if (!item) throw new Error(`footer.ts: "${title}" is not in the ${menu.label} menu`);
    return { label: item.title, href: item.href };
  });
};

/** "#" = the real address has not been given yet. TODO: replace each one. */
const NO_URL_YET = "#";

export const footer = {
  columns: [
    {
      title: "Company",
      links: pick(aboutMenu, [
        "Who we are",
        "Company history",
        "Leadership",
        "Awards & recognitions",
        "Subsidiaries",
        "Investor relations",
        "Careers",
      ]),
    },
    {
      title: "Products",
      links: pick(productsMenu, ["Life Insurance", "Retirement Plans", "Medical Plans", "Investment", "Group Insurance"]),
    },
    {
      title: "Support",
      links: [
        ...pick(claimsMenu, ["Make a claim", "Claims process", "Policy documents", "Complaints procedure", "Customer charter"]),
        { label: "Privacy policy", href: "/privacy-policy" },
        { label: "Data subject rights", href: "/data-subject-rights" },
      ],
    },
  ],
  contact: {
    title: "Contact",
    /**
     * The address is stored as LINES, and each line is shown on its own row. Inside a line the pairs that must not split
     * ("106 Havelock", "Colombo 5") are joined with a non-breaking space ( ). Where the address has to be ONE line
     * (page metadata, structured data, copy to clipboard), join the lines with ", " and keep the non-breaking spaces.
     */
    address: ["Ceylinco Life Tower,", "106 Havelock Road,", "Colombo 5"],
    // SAMPLE: confirm with Ceylinco before launch
    // The phone number was supplied; the opening hours are a sample.
    // Short pairs that must not split are joined with non-breaking spaces ( ): the phone number and each time.
    phone: "(011) 246 1461, Mon to Fri, 8.30 am to 5.00 pm",
    // SAMPLE: confirm with Ceylinco before launch
    // Placeholder address: replace with the real contact email.
    email: "contact@example.com",
    /** Shown as outlined circles with the network's glyph. `icon` picks the glyph. TODO: replace each "#". */
    social: [
      { label: "Facebook", icon: "facebook", href: NO_URL_YET },
      { label: "LinkedIn", icon: "linkedin", href: NO_URL_YET },
      { label: "YouTube", icon: "youtube", href: NO_URL_YET },
      { label: "Instagram", icon: "instagram", href: NO_URL_YET },
    ] satisfies Array<{ label: string; icon: "facebook" | "linkedin" | "youtube" | "instagram"; href: string }>,
  },
  bottomBar: {
    licence: "Ceylinco Life Insurance Limited is licensed by the Insurance Regulatory Commission of Sri Lanka.",
    copyright: "© 2026 Ceylinco Life Insurance Limited. All rights reserved.",
    disclosures:
      "Benefits depend on the plan you choose and are subject to the policy's terms, conditions and exclusions. Please read your policy document.",
  },
  /** Floating chat button. TODO: replace "#" with the real WhatsApp link (https://wa.me/<number>). */
  chat: {
    label: "Chat with us on WhatsApp",
    href: NO_URL_YET,
  },
};
