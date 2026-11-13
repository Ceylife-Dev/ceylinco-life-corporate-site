/**
 * HOME PAGE CONTENT: every word on the home page lives here.
 *
 * HOW TO READ THIS FILE
 *  - Text is the agreed copy unless it sits under a "// SAMPLE: confirm with
 *    Ceylinco before launch" comment. A SAMPLE block is stand-in content that
 *    looks real: it must be confirmed or replaced before launch.
 *  - A link of "#" means the real address has not been given yet (it goes nowhere).
 *  - Do not add a statistic, quote, award or claims figure unless it was supplied
 *    by Ceylinco. If it is only an example, put the SAMPLE comment above it.
 *
 * COMPLIANCE NOTES
 *  - Anything about cover, exclusions, waiting periods, premiums, claims
 *    settlement or regulation (hero trust line, "Coverage and key details",
 *    claims times, FAQ answers) MUST be confirmed with compliance before launch.
 *  - Testimonials: use only real, approved customer testimonials, with the
 *    customer's permission to use their name and location.
 *
 * ABOUT THE COMPANY: Ceylinco Life is an insurance and financial protection
 * company (life, retirement, medical, investment and group plans, and possibly
 * more). Never describe it as only a life insurance company.
 *
 * Footer content is in src/content/footer.ts. Menu content is in navigation.ts.
 */
import {
  Award,
  Calculator,
  CreditCard,
  FileText,
  FileX,
  Heart,
  HeartHandshake,
  LifeBuoy,
  ListChecks,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Stethoscope,
  TrendingUp,
  User,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { ComponentType } from "react";
import { OldWomanIcon } from "@/components/ui/OldWomanIcon";
import { links } from "./navigation";

/** "#" = the real address has not been given yet. TODO: replace each one. */
const NO_URL_YET = "#";

/**
 * A product card. The card shows the icon, the title and the product name. `description` and `linkLabel` are kept
 * (they are the earlier copy) but are no longer shown: the description is read out by screen readers
 * (aria-describedby) and `linkLabel` is unused.
 */
/** Any icon that takes a className: a Lucide icon, or a custom one such as OldWomanIcon. */
export type IconComponent = ComponentType<{ className?: string; strokeWidth?: number | string; "aria-hidden"?: boolean | "true" | "false" }>;
export type NeedCard = {
  icon: IconComponent;
  title: string;
  /** The product name, shown as the muted line under the title. Also part of the accessible name. */
  product: string;
  description: string;
  linkLabel: string;
  href: string;
};
export type Step = { title: string; text?: string; icon: LucideIcon };
/** A proof number. The number counts up on screen; prefix and suffix stay still. */
/** `spoken` is what a screen reader says for the number, for example "More than 20" for "20+" (the label is read right after it). */
export type Stat = { prefix?: string; value: number; suffix?: string; spoken?: string; label: string; note?: string };
export type InfoCard = { title: string; points: string[] };
/** `avatar` is an optional photo path (for example "/images/avatar-nimali.jpg"): use only a real photo the customer has permitted. */
export type Testimonial = { quote: string; name: string; descriptor: string; avatar?: string };
/** `focus` is the photo's object-position (for example "50% 30%"): where the crop is anchored, so faces are not cut off. */
/** `iso` is the same date as `date` in the form 2026-04-08 (for the <time> element, and to sort newest first on phones). */
export type NewsItem = { date: string; iso: string; headline: string; href: string; image: { src: string; alt: string; focus?: string } };
/** `icon` shows in the tile before the question. `link` (optional) is the text link under the open answer; "#" = address not given yet. */
export type Faq = { id: string; question: string; answer: string; icon: LucideIcon; link?: { label: string; href: string } };
/** An official store badge, used as supplied. `badge` is the file and its own size in px (only its proportions are used). */
/** One hero image. `focus` (optional) is the CSS object-position on desktop and on phones, so the family is not cropped out. */
export type HeroImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** A crop of the photo (1.12 wide to 1 high, the shape of the phone photo area) used up to 599px wide. */
  mobile?: { src: string; width: number; height: number };
  /** object-position per screen: `mobile` = the portrait crop (up to 599px), `tablet` = the full photo (600px to 768px), `desktop` = the full photo (769px and up). */
  focus?: { desktop: string; tablet: string; mobile: string };
};
export type StoreLink = { name: string; ariaLabel: string; badge: { src: string; width: number; height: number }; href: string };

export const home = {
  /* 1. HERO ---------------------------------------------------------------- */
  hero: {
    headline: "Protection for the people and the future you care about",
    support:
      "Insurance, retirement and savings plans for every stage of life, backed by a team that has stood beside Sri Lankan families for over two decades.",
    primaryCta: { label: "Explore plans", href: "/products" },
    secondaryCta: { label: "Get a quote", href: links.getQuote },
    /** Trust row. The licence wording is as supplied; confirm with compliance. An item may have a shorter `mobileText` for phones (768px and below). */
    trust: [
      { icon: Award, text: "20+ years of industry leadership" },
      { icon: MapPin, text: "250 branches island-wide" },
      // SAMPLE: confirm with compliance. `mobileText` is the shorter wording shown up to 768px so the fact fits on one or two lines; larger screens show `text`.
      { icon: ShieldCheck, text: "Licensed by the Insurance Regulatory Commission of Sri Lanka", mobileText: "Licensed by the Insurance Regulatory Commission" },
    ],
    // Hero images (the slideshow in Hero.tsx, 6.5 seconds each): confirm licence before launch. The first loads first. `width` and `height` are the real size of each file.
    // They are decorative, so they have no alt text (alt is empty). `mobile` is a crop of the photo for phones (up to 599px, about 1000px wide, made at native resolution), and `focus` is optional: where each image is anchored
    // on phones (the crop) and on larger screens (the full photo) (CSS object-position); without it the --hero-position tokens are used. Keep the same list in
    // scripts/check-hero-contrast.mjs, which tests the hero text against every image.
    images: [
      {
        src: "/images/Hero/hero-family-sunset.jpeg",
        alt: "",
        width: 1537,
        height: 1023,
        mobile: { src: "/images/Hero/mobile/sunset-phone.jpg", width: 698, height: 623 },
        focus: { desktop: "55% 75%", tablet: "60% 85%", mobile: "50% 100%" },
      },
      {
        src: "/images/Hero/Golden-Hour Family Embrace 1.png",
        alt: "",
        width: 1672,
        height: 941,
        mobile: { src: "/images/Hero/mobile/golden-hour-phone.jpg", width: 1054, height: 941 },
        focus: { desktop: "70% 40%", tablet: "88% 40%", mobile: "50% 0%" },
      },
      {
        src: "/images/Hero/Joyful Family in the Sunlit Park 1.png",
        alt: "",
        width: 1774,
        height: 887,
        mobile: { src: "/images/Hero/mobile/sunlit-park-phone.jpg", width: 993, height: 887 },
        focus: { desktop: "70% 40%", tablet: "88% 40%", mobile: "50% 0%" },
      },
      {
        src: "/images/Hero/Joyful Family Soccer in the Park 1.png",
        alt: "",
        width: 1774,
        height: 887,
        mobile: { src: "/images/Hero/mobile/soccer-park-phone.jpg", width: 993, height: 887 },
        focus: { desktop: "65% 50%", tablet: "88% 50%", mobile: "50% 0%" },
      },
    ] satisfies HeroImage[],
  },

  /* 2. CHOOSE A NEED OR PRODUCT -------------------------------------------- */
  needs: {
    heading: "What are you looking for?",
    subtext: "Tell us what matters to you and we'll point you to the right plan.",
    cards: [
      {
        icon: Heart,
        title: "Protect my family",
        product: "Life insurance",
        description: "Financial protection that keeps your family secure, whatever life brings.",
        linkLabel: "View life plans",
        href: "/products/life-insurance",
      },
      {
        icon: OldWomanIcon, // from the Figma (a filled glyph); the other three are Lucide outline icons
        title: "Plan my retirement",
        product: "Retirement plans",
        description: "Build the savings you need to enjoy your later years with confidence.",
        linkLabel: "View retirement plans",
        href: "/products/retirement-plans",
      },
      {
        icon: Stethoscope,
        title: "Cover medical costs",
        product: "Medical plans",
        description: "Be ready for unexpected medical expenses without worrying about the bill.",
        linkLabel: "View medical plans",
        href: "/products/medical-plans",
      },
      {
        icon: TrendingUp,
        title: "Grow my savings",
        product: "Investment plans",
        description: "Build your savings over time with plans designed around your goals.",
        linkLabel: "View investment plans",
        href: "/products/investment",
      },
      // SAMPLE: confirm with Ceylinco before launch
      // The title and product name come from the Figma design; the description (read out by screen readers only) is a draft.
      {
        icon: Users, // the same icon as "Group Insurance" in the Products menu (navigation.ts)
        title: "Protect my business",
        product: "Group Insurance",
        description: "Cover and benefits for your employees, and protection for your business.",
        linkLabel: "View group insurance",
        href: "/products/group-insurance",
      },
    ] satisfies NeedCard[],
    /** Link shown under the five cards. */
    allLink: { label: "See all products", href: "/products" },
    // "Cover for your business? Group insurance" was removed from this row (the Figma design has the "Protect my business" card instead).
    quickLinks: [
      { prompt: "Prefer to buy online?", label: "Buy online in minutes", href: links.buyOnline },
      { prompt: "Need to make a claim?", label: "Start a claim", href: "/claims/make-a-claim" },
    ],
  },

  /* 3. WHY CHOOSE US ------------------------------------------------------- */
  why: {
    heading: "A name Sri Lankans trust, for generations",
    story:
      "For more than two decades, families across Sri Lanka have chosen us to protect what matters most. We keep our plans simple, our service personal and our promises clear.",
    linkLabel: "Our story",
    href: "/about/who-we-are",
    /** The photo beside the story (1433 x 1098), shown as a 3:2 photo with rounded corners. */
    image: {
      src: "/images/trust.jpeg",
      alt: "A father smiling as he holds his laughing baby",
    },
    stats: [
      { value: 20, suffix: "+", spoken: "More than 20", label: "years of industry leadership" },
      { value: 250, spoken: "250", label: "branches island-wide" },
      // SAMPLE: confirm with Ceylinco before launch
      // Confirm the figure and the currency.
      { prefix: "Rs. ", value: 200, suffix: "+ billion", spoken: "More than Rs. 200 billion", label: "life fund" },
      { value: 38000, suffix: "+", spoken: "More than 38,000", label: "Family Savari winners" },
    ] as Stat[], // typed as Stat[] so the optional "note" field stays available to the component
    recognition:
      "Voted Sri Lanka's most popular life insurer for the 20th consecutive year (SLIM Kantar People's Awards, 2026).",
  },

  /* 4. HOW IT WORKS -------------------------------------------------------- */
  how: {
    heading: "Getting covered is simple",
    subtext: "A quick and hassle-free journey to protection",
    steps: [
      { icon: MessageCircle, title: "Tell us what you need", text: "Get a quote online or speak to an advisor." },
      { icon: ListChecks, title: "Choose your plan", text: "Compare options that fit your goals and budget." },
      { icon: ShieldCheck, title: "Get covered", text: "Complete a short application and pay your first premium." },
      { icon: HeartHandshake, title: "We're with you", text: "Manage your policy and make claims with ease." },
    ] satisfies Step[],
    help: {
      title: "Not sure where to start?",
      text: "Our advisors will help you choose the right plan, with no pressure.",
      cta: { label: "Talk to an advisor", href: "/contact" },
      // The phone number is a tel: link whose text is its name ("Call (011) 246 1461"); the number never splits (non-breaking spaces).
      contact: { phone: { label: "Call (011) 246 1461", href: "tel:+94112461461" }, text: "or request a call back." },
    },
  },

  /* 5. COVERAGE AND KEY DETAILS -------------------------------------------- */
  // SAMPLE: confirm with Ceylinco before launch
  // Needs compliance review: all wording about cover, checks and premiums.
  coverage: {
    heading: "Know what you're getting",
    cards: [
      {
        title: "What's covered",
        points: [
          "The main benefit of your plan, such as a payout for your family, medical costs or maturity benefits",
          "Optional extras you can add to your plan",
          "Cover that applies for the term you choose",
        ],
      },
      {
        title: "What to check",
        points: [
          "Waiting periods before some benefits start",
          "Exclusions listed in your policy document",
          "The free-look period to review your policy",
        ],
      },
      {
        title: "What affects your premium",
        points: ["Your age", "The amount of cover", "The policy term", "The type of plan and your circumstances"],
      },
    ] satisfies InfoCard[],
    linkLabel: "See full details on each product page",
    href: "/products",
    note: "Benefits vary by plan. Please read your policy document.",
  },

  /* 6. TESTIMONIALS -------------------------------------------------------- */
  // SAMPLE: confirm with Ceylinco before launch
  // Invented examples: replace with approved, real testimonials (with the customer's permission).
  // The first three show by default; the next three appear when "Show more reviews" is used, together with "Show fewer reviews"
  // and the "Read all reviews" link.
  testimonials: {
    heading: "What our customers say",
    subtext: "Hear from the families who trust Ceylinco Life",
    showMore: "Show more reviews",
    showFewer: "Show fewer reviews",
    /** Where "Read all reviews" goes. The address was not given, so it points to the placeholder Testimonials page from the About Us menu: replace it with the real one. */
    readAll: { label: "Read all reviews", href: "/about/testimonials" },
    items: [
      {
        quote:
          "When my husband fell ill, the team guided us through every step of the claim. It was handled with care and I never had to chase anyone.",
        name: "Nimali Fernando",
        descriptor: "Policyholder, Kandy",
        avatar: "/images/avatar-nimali.png",
      },
      {
        quote:
          "I started with a simple plan for my children's education. The advisor explained everything clearly and never pushed me to buy more than I needed.",
        name: "Ruwan Jayasinghe",
        descriptor: "Policyholder, Colombo",
        avatar: "/images/avatar-ruwan.png",
      },
      {
        quote:
          "Paying my premiums and checking my policy on the app takes a minute. It saves me a trip to the branch every time.",
        name: "Dilani Perera",
        descriptor: "Policyholder, Galle",
        avatar: "/images/avatar-dilani.png",
      },
      {
        quote:
          "My family has been with the company for years. Every time we've needed help, someone has picked up the phone and sorted it out.",
        name: "Kasun Wickramasinghe",
        descriptor: "Policyholder, Matara",
      },
      {
        quote:
          "I wasn't sure which plan suited me. The advisor compared three options and let me decide in my own time.",
        name: "Sanduni Abeysekara",
        descriptor: "Policyholder, Negombo",
      },
      {
        quote:
          "The retirement plan I chose gives me peace of mind. I know exactly what I'll receive and when.",
        name: "Mahesh Rajapaksa",
        descriptor: "Policyholder, Kurunegala",
      },
    ] as Testimonial[], // typed as Testimonial[] so the optional "avatar" field stays available to the component
  },

  /* 7. MOBILE APP AND SELF-SERVICE ----------------------------------------- */
  app: {
    heading: "Your policy, in your pocket",
    intro: "With the Ceylife Digital app you can:",
    features: [
      "Pay your premiums in a few taps",
      "View your policies and benefits",
      "Request services without visiting a branch",
      "See the latest promotions",
    ],
    /** The official store badges (black, English), used exactly as supplied in public/images/store. TODO: replace each "#" with the real store listing. */
    stores: [
      {
        name: "App Store",
        ariaLabel: "Download Ceylife Digital on the App Store",
        badge: { src: "/images/store/app-store-badge.svg", width: 120, height: 40 },
        href: NO_URL_YET,
      },
      {
        name: "Google Play",
        ariaLabel: "Get Ceylife Digital on Google Play",
        badge: { src: "/images/store/google-play-badge.svg", width: 135, height: 40 },
        href: NO_URL_YET,
      },
      {
        name: "Huawei AppGallery",
        ariaLabel: "Explore Ceylife Digital on Huawei AppGallery",
        badge: { src: "/images/store/appgallery-badge.svg", width: 134, height: 40 },
        href: NO_URL_YET,
      },
    ] satisfies StoreLink[],
    /** Shown under the badges (and hidden in the installed app). TODO: both go to the customer portal link, which is still "#". */
    webFallback: {
      label: "Prefer using the website?",
      links: [
        { label: "Pay premium online", href: links.customerPortal, icon: CreditCard },
        { label: "Customer portal", href: links.customerPortal, icon: User },
      ],
    },
    /** The app picture: two phones (home screen over the Pay premium screen), supplied as mobile.svg, used as is. Decorative, so it has no alt text. */
    image: {
      src: "/images/mobile.svg",
      width: 1015,
      height: 1058,
    },
  },

  /* 8. NEWS ---------------------------------------------------------------- */
  news: {
    heading: "Latest news",
    allLabel: "View all news",
    allHref: "/about/news",
    // Photo matching is arbitrary for now (the designer said any match will do): confirm which photo belongs to which story.
    items: [
      {
        date: "8 April 2026",
        iso: "2026-04-08",
        headline: "Ceylinco Life celebrates its ‘Unstoppable Champions’ at Annual Awards 2026",
        href: "/about/news",
        image: { src: "/images/news2.webp", alt: "Staff and guests on stage at an awards ceremony", focus: "50% 40%" },
      },
      {
        date: "2 April 2026",
        iso: "2026-04-02",
        headline: "Ceylinco Life Chairman R. Renganathan honoured by CMA",
        href: "/about/news",
        image: { src: "/images/news3.jpeg", alt: "People seated and talking at a community event", focus: "60% 30%" },
      },
      {
        date: "30 March 2026",
        iso: "2026-03-30",
        headline: "Ceylinco Life voted Sri Lanka’s most popular life insurer for the 20th consecutive year",
        href: "/about/news",
        image: { src: "/images/news1.jpg", alt: "A team in maroon shirts posing together at an airport", focus: "45% 30%" },
      },
    ] satisfies NewsItem[],
  },

  /* 9. FAQ ---------------------------------------------------------------- */
  // SAMPLE: confirm with Ceylinco before launch
  // Needs compliance review: every answer.
  faq: {
    heading: "Questions, answered",
    /** One centred line under the heading. */
    // SAMPLE: confirm with Ceylinco before launch
    intro: "Quick answers to the questions we hear most.",
    /**
     * Optional soft picture behind the whole FAQ section (shown at 30% opacity). TODO: export it from the Figma frame
     * ("FAQ" section image fill, a soft pink abstract picture) to public/images/faq-background.webp, then set
     * background: "/images/faq-background.webp". Leave undefined until the file exists.
     */
    background: undefined as string | undefined,
    /** The white strip under the accordion: a pink phone circle, this text and the text link on the right. */
    help: {
      title: "Still have questions?",
      callPrefix: "Call",
      phone: { label: "(011) 246 1461", href: "tel:+94112461461" }, //   = non-breaking space
      // SAMPLE: confirm with Ceylinco before launch (sample opening hours)
      hours: "Mon to Fri, 8.30 am to 5.00 pm", // each time is joined with a non-breaking space
      link: { label: "Talk to an advisor", href: "/contact" },
    },
    items: [
      {
        id: "cover",
        icon: ShieldCheck,
        link: { label: "Explore plans", href: "/products" },
        question: "What does my insurance cover?",
        answer:
          "Cover depends on the plan you choose. Life plans pay a benefit to your family, and other plans can cover medical costs, retirement income or savings goals. Your policy document lists exactly what is included and excluded.",
      },
      {
        id: "amount",
        icon: Calculator,
        link: { label: "Explore plans", href: "/products" },
        question: "How much cover do I need?",
        answer:
          "A good starting point is enough to cover your family's living costs, loans and future goals such as education. An advisor can help you work out an amount that suits your income and responsibilities.",
      },
      {
        id: "quote",
        icon: FileText,
        link: { label: "Get a quote", href: links.getQuote },
        question: "How do I get a quote?",
        answer:
          "Choose Get a quote, tell us a little about yourself and what you need, and we'll show you your options. You can also speak to an advisor who will guide you.",
      },
      {
        id: "claim",
        icon: LifeBuoy,
        link: { label: "Make a claim", href: "/claims/make-a-claim" },
        question: "How do I make a claim?",
        answer:
          "Contact us or visit any branch, tell us what happened and send the required documents. Our team will guide you through each step and keep you updated until your claim is settled.",
      },
      {
        id: "pay",
        icon: CreditCard,
        link: { label: "Pay premium", href: links.customerPortal },
        question: "How do I pay my premium?",
        answer:
          "You can pay online through the customer portal or the Ceylife Digital app, or by visiting a branch.",
      },
      {
        id: "cancel",
        icon: FileX,
        question: "Can I cancel my policy?",
        answer:
          "You can usually cancel within a free-look period after you receive your policy. The exact period is stated in your policy document. Cancelling later may affect the benefits you receive, so talk to an advisor first.",
      },
    ] satisfies Faq[],
  },

  /* 10. FINAL CALL-TO-ACTION (a rounded maroon card, the only maroon block) -- */
  finalCta: {
    heading: "Ready to protect what matters most?",
    text: "Get a quote online or talk to an advisor who can guide you.",
    primaryCta: { label: "Get a quote", href: links.getQuote },
    secondaryCta: { label: "Talk to an advisor", href: "/contact" },
    /** Optional decorative picture on the maroon card (soft rings on maroon), from the Figma frame. Decoration only. */
    pattern: "/images/cta-pattern.png" as string | undefined,
  },
};
