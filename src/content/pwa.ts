/**
 * INSTALLED-APP (PWA) CONTENT: every word used by the offline page, the bottom bar and the "Add to home screen" card.
 * Menu copy is in navigation.ts and page copy in home.ts. Components never contain this text.
 */
import { CreditCard, Ellipsis, FileText, House, LayoutGrid, type LucideIcon } from "lucide-react";
import { links } from "./navigation";

export const pwa = {
  /** The offline page (shown when there is no connection and the page was not saved). */
  offline: {
    title: "You're offline",
    text: "Check your connection and try again. Pages you've already visited may still open.",
    note: "Payments and your account always need a connection.",
    retry: "Try again",
    home: "Go to the home page",
  },

  /** Screen-reader-only text on the skeleton loading state. */
  loading: "Loading",

  /** The bottom bar (phones, 768px and below; it does not depend on the app being installed). */
  bottomNav: {
    label: "Mobile",
    items: [
      { label: "Home", href: "/", icon: House },
      { label: "Products", href: "/products", icon: LayoutGrid },
      // Goes to the customer portal (the address is still a "#" TODO in navigation.ts).
      // "Pay" is short so the label stays on one line; the link's spoken name is the full "Pay premium online".
      { label: "Pay", href: links.customerPortal, icon: CreditCard, ariaLabel: "Pay premium online" },
      // "Quote" is short so the label stays on one line; the link's spoken name is "Get a quote". It goes to the existing quote page. Claims stay in the menu, under Claims & Support.
      { label: "Quote", href: links.getQuote, icon: FileText, ariaLabel: "Get a quote" },    ] satisfies Array<{ label: string; href: string; icon: LucideIcon; section?: string; ariaLabel?: string }>,
    /** The last button opens the full-screen menu (the accordion). */
    menu: { label: "More", icon: Ellipsis },
  },

  /** The "Add to home screen" card (phones and tablets, after a repeat visit). */
  install: {
    title: "Add Ceylinco Life to your home screen",
    text: "Open it like an app, in one tap.",
    add: "Add to home screen",
    dismiss: "Not now",
  },

  /** Names used by the web app manifest and the installed app. */
  app: {
    name: "Ceylinco Life",
    shortName: "Ceylinco Life",
  },
} as const;
