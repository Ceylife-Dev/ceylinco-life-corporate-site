/**
 * HEADER CONTENT: every word and link in the header and its menus lives here.
 * Edit this file to change menu copy, add or remove items, or fix a link.
 * Components never contain menu text.
 *
 * Icons come from Lucide (https://lucide.dev/icons). To change one, import the
 * new icon in the list below and use it in the item.
 *
 * Descriptions: one short, plain, warm sentence (aim for under 45 characters so
 * it fits on one line in the menu).
 */
import type { ComponentType } from "react";
import {
  Award,
  Briefcase,
  Building2,
  ChartLine,
  FileChartColumn,
  FilePlus2,
  FileText,
  Gift,
  GraduationCap,
  Heart,
  HeartHandshake,
  History,
  Leaf,
  MapPin,
  MessageCircleWarning,
  MessageSquareQuote,
  Network,
  Newspaper,
  Route,
  Scale,
  ScrollText,
  Smartphone,
  Stethoscope,
  TrendingUp,
  UserCog,
  Users,
  UsersRound,
} from "lucide-react";
import { OldWomanIcon } from "@/components/ui/OldWomanIcon";

/* -----------------------------------------------------------------------------
   LINKS THAT STILL NEED CONFIRMING
   "#" means the real address has not been given yet (the link goes nowhere).
   Replace each "#" with the real address.
   --------------------------------------------------------------------------- */
export const links = {
  home: "/",
  getQuote: "/get-a-quote",
  /** TODO: replace "#" with the real customer portal address. */
  customerPortal: "#",
  /** TODO: replace "#" with the real "Buy online" address. */
  buyOnline: "#",
  /** Where the search box sends people. The page is a placeholder for now. */
  search: "/search",
} as const;

/* -----------------------------------------------------------------------------
   TEXT FOR BUTTONS AND SCREEN READERS
   --------------------------------------------------------------------------- */
export const headerText = {
  skipToContent: "Skip to main content",
  mainNavLabel: "Main",
  /** No longer used in the header (the Figma design replaced it with "Get a quote" as the outlined button); kept for reference. */
  customerLogin: "Customer login",
  getQuote: "Get a quote",
  /** The filled header button. It goes to the customer portal (the address is still a "#" TODO in `links`). */
  payPremiumOnline: "Pay premium online",
  openMenu: "Open menu",
  closeMenu: "Close menu",
  search: "Search",
  searchTitle: "Search",
  searchLabel: "What are you looking for?",
  searchHelp: "Press Enter to search, or Esc to close.",
  searchPlaceholder: "For example: claim, medical plan",
  closeSearch: "Close search",
  languageLabel: "Language",
  changeLanguage: "Change language",
} as const;

/* -----------------------------------------------------------------------------
   LANGUAGES
   The selector is visual only for now: it changes the page language setting
   (which switches on the larger Sinhala and Tamil type) but does not translate
   anything yet.
   --------------------------------------------------------------------------- */
export const languages = [
  { code: "EN", htmlLang: "en", name: "English" },
  { code: "SI", htmlLang: "si", name: "සිංහල" },
  { code: "TA", htmlLang: "ta", name: "தமிழ்" },
] as const;

export type Language = (typeof languages)[number];

/* -----------------------------------------------------------------------------
   MENU TYPES
   --------------------------------------------------------------------------- */
export type MenuItem = {
  title: string;
  description: string;
  href: string;
  /** Any icon that takes a className: a Lucide icon, or a custom one such as OldWomanIcon. */
  icon: ComponentType<{ className?: string }>;
};

export type MenuGroup = {
  /** Small, non-clickable subheading. Leave out for a menu with a single list. */
  heading?: string;
  items: MenuItem[];
  /** Optional text link at the bottom of the group (for example "All Life Rewards"). */
  link?: { title: string; href: string };
};

export type MegaMenu = {
  /** Used in element ids. Lowercase letters and dashes only. */
  id: string;
  label: string;
  /** Any page whose address starts with this counts as "inside this section". */
  basePath: string;
  groups: MenuGroup[];
  /** Optional strip at the bottom of the panel. */
  footerLink?: { title: string; description: string; href: string };
};

export type NavEntry =
  | { kind: "link"; label: string; href: string }
  | { kind: "menu"; menu: MegaMenu };

/* -----------------------------------------------------------------------------
   THE THREE MEGA MENUS
   --------------------------------------------------------------------------- */
export const productsMenu: MegaMenu = {
  id: "products",
  label: "Products",
  basePath: "/products",
  groups: [
    {
      items: [
        {
          title: "Life Insurance",
          description: "Protect your family's future.",
          href: "/products/life-insurance",
          icon: Heart,
        },
        {
          title: "Retirement Plans",
          description: "Save today for a comfortable tomorrow.",
          href: "/products/retirement-plans",
          icon: OldWomanIcon, // the same icon as the "Plan my retirement" card on the home page
        },
        {
          title: "Medical Plans",
          description: "Cover for hospital stays and treatment.",
          href: "/products/medical-plans",
          icon: Stethoscope,
        },
        {
          title: "Investment",
          description: "Grow your savings towards your goals.",
          href: "/products/investment",
          icon: TrendingUp,
        },
        {
          title: "Group Insurance",
          description: "Look after your whole team.",
          href: "/products/group-insurance",
          icon: Users,
        },
      ],
    },
  ],
  footerLink: {
    title: "Buy online",
    description: "Choose a plan and apply from home.",
    href: links.buyOnline,
  },
};

export const claimsMenu: MegaMenu = {
  id: "claims",
  label: "Claims & Support",
  basePath: "/claims",
  groups: [
    {
      heading: "Claims and complaints",
      items: [
        {
          title: "Make a claim",
          description: "Tell us what happened. We'll guide you.",
          href: "/claims/make-a-claim",
          icon: FilePlus2,
        },
        {
          title: "Claims process",
          description: "Every step, from first call to payment.",
          href: "/claims/claims-process",
          icon: Route,
        },
        {
          title: "Complaints procedure",
          description: "Not happy? Here's how to tell us.",
          href: "/claims/complaints-procedure",
          icon: MessageCircleWarning,
        },
        {
          title: "Customer charter",
          description: "What you can expect from us.",
          href: "/claims/customer-charter",
          icon: ScrollText,
        },
      ],
    },
    {
      heading: "Policy services",
      items: [
        {
          title: "Policy documents",
          description: "Find your policy papers in one place.",
          href: "/claims/policy-documents",
          icon: FileText,
        },
        {
          title: "Branch locator",
          description: "Find your nearest branch and its hours.",
          href: "/claims/branch-locator",
          icon: MapPin,
        },
        {
          title: "Ceylife Digital App",
          description: "Manage your policy on the go.",
          href: "/claims/ceylife-digital-app",
          icon: Smartphone,
        },
      ],
    },
    {
      heading: "Life Rewards",
      items: [
        {
          // SAMPLE: confirm with Ceylinco before launch
          // The description is a draft (none was supplied).
          title: "Family Savari",
          description: "Rewards for our policyholders and their families.",
          href: "/claims/life-rewards/family-savari",
          icon: Gift,
        },
        {
          // SAMPLE: confirm with Ceylinco before launch
          // The description is a draft (none was supplied).
          title: "Pranama Scholarships",
          description: "Scholarships to support children's education.",
          href: "/claims/life-rewards/pranama-scholarships",
          icon: GraduationCap,
        },
      ],
      link: { title: "All Life Rewards", href: "/claims/life-rewards" },
    },
  ],
};

export const aboutMenu: MegaMenu = {
  id: "about",
  label: "About Us",
  basePath: "/about",
  groups: [
    {
      heading: "Our company",
      items: [
        {
          title: "Who we are",
          description: "Our story, purpose and values.",
          href: "/about/who-we-are",
          icon: Building2,
        },
        {
          title: "Company history",
          description: "Our journey over the years.",
          href: "/about/company-history",
          icon: History,
        },
        {
          title: "Leadership",
          description: "Meet the people who guide us.",
          href: "/about/leadership",
          icon: UsersRound,
        },
        {
          title: "Management",
          description: "The team running day to day.",
          href: "/about/management",
          icon: UserCog,
        },
        {
          title: "Subsidiaries",
          description: "The companies in our group.",
          href: "/about/subsidiaries",
          icon: Network,
        },
      ],
    },
    {
      heading: "Investors and media",
      items: [
        {
          title: "Investor relations",
          description: "Reports for shareholders.",
          href: "/about/investor-relations",
          icon: ChartLine,
        },
        {
          title: "Annual reports",
          description: "Our yearly results and highlights.",
          href: "/about/annual-reports",
          icon: FileChartColumn,
        },
        {
          title: "Corporate governance",
          description: "How we're run and held accountable.",
          href: "/about/corporate-governance",
          icon: Scale,
        },
        {
          title: "News",
          description: "Announcements and stories.",
          href: "/about/news",
          icon: Newspaper,
        },
      ],
    },
    {
      heading: "Community and careers",
      items: [
        {
          title: "Awards & recognitions",
          description: "Honours we're proud of.",
          href: "/about/awards-and-recognitions",
          icon: Award,
        },
        {
          title: "CSR",
          description: "Giving back to communities.",
          href: "/about/csr",
          icon: HeartHandshake,
        },
        {
          title: "Environmental sustainability",
          description: "Our commitment to the planet.",
          href: "/about/environmental-sustainability",
          icon: Leaf,
        },
        {
          title: "Testimonials",
          description: "What our customers say.",
          href: "/about/testimonials",
          icon: MessageSquareQuote,
        },
        {
          // SAMPLE: confirm with Ceylinco before launch
          // The description is a draft (none was supplied). The page address is the existing placeholder page.
          title: "Careers",
          description: "Join our team across Sri Lanka.",
          href: "/careers",
          icon: Briefcase,
        },
      ],
    },
  ],
};

/* -----------------------------------------------------------------------------
   MAIN NAVIGATION: the order here is the order on screen.
   --------------------------------------------------------------------------- */
export const mainNav: NavEntry[] = [
  { kind: "link", label: "Home", href: links.home },
  { kind: "menu", menu: productsMenu },
  { kind: "menu", menu: claimsMenu },
  { kind: "menu", menu: aboutMenu },
  { kind: "link", label: "Contact Us", href: "/contact" },
];

/* -----------------------------------------------------------------------------
   PLACEHOLDER PAGES
   Every internal link above gets a simple placeholder page so nothing shows an
   error while the real pages are being built. This helper collects them.
   --------------------------------------------------------------------------- */
const extraPlaceholderPages: Array<{ title: string; href: string }> = [
  { title: "Get a quote", href: links.getQuote },
  { title: "Search", href: links.search },
  { title: "Products", href: "/products" },
  { title: "Privacy policy", href: "/privacy-policy" },
  { title: "Data subject rights", href: "/data-subject-rights" },
];

function isInternal(href: string) {
  return href.startsWith("/") && href !== "/";
}

/** Every internal page that needs a placeholder, with its title. */
export function placeholderPages(): Array<{ title: string; href: string }> {
  const pages = [...extraPlaceholderPages];
  for (const entry of mainNav) {
    if (entry.kind === "link") {
      if (isInternal(entry.href)) pages.push({ title: entry.label, href: entry.href });
      continue;
    }
    for (const group of entry.menu.groups) {
      for (const item of group.items) if (isInternal(item.href)) pages.push({ title: item.title, href: item.href });
      if (group.link && isInternal(group.link.href)) pages.push({ title: group.link.title, href: group.link.href });
    }
  }
  return pages;
}
