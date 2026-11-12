import type { ComponentProps, ReactNode } from "react";
import { AppLink } from "./AppLink";
import { cn } from "./cn";

type CardPadding = "none" | "md" | "lg" | "xl" | "xxl";

type SharedProps = {
  /** Inner spacing. md = 20/24px, lg = 24/32px, xl = 32px, xxl = 24px on phones and 40px from tablet up, none = you control it (e.g. a full-width image). */
  padding?: CardPadding;
  /**
   * surface = white card (default). tint = soft pink card (brand-tint with a brand-tint-strong border, no shadow)
   * for help and advisor callouts. cream = a warm cream card (surface-cream, a brand-tint-strong border, no shadow)
   * for the advisor card; with shadow "sm" it also takes the light shadow (the FAQ contact strip).
   */
  tone?: "surface" | "tint" | "cream";
  /** Shadow of a white card at rest: md (default) or sm (a lighter strip). */
  shadow?: "sm" | "md";
  /** Interactive cards only. soft (default) = the border turns soft pink on hover and press; brand = it turns maroon on press (the carousel news cards). */
  press?: "soft" | "brand";
  /** Layout only (margin, width, height). */
  className?: string;
  children: ReactNode;
};

/** A plain container. Use `as` to pick a better element, e.g. "li" or "section". */
type StaticCard = SharedProps & {
  variant?: "default";
  as?: "div" | "section" | "article" | "li";
  href?: undefined;
};

/** A card that is one big link. */
type LinkCard = SharedProps & {
  variant: "interactive";
  href: string;
  external?: boolean;
} & Omit<ComponentProps<"a">, keyof SharedProps | "href">;

/** A card that is one big button. */
type ButtonCard = SharedProps & {
  variant: "interactive";
  href?: undefined;
  onClick: NonNullable<ComponentProps<"button">["onClick"]>;
} & Omit<ComponentProps<"button">, keyof SharedProps | "onClick">;

export type CardProps = StaticCard | LinkCard | ButtonCard;

const paddingClasses: Record<CardPadding, string> = {
  none: "",
  md: "p-5 md:p-6",
  lg: "p-6 md:p-8",
  xl: "p-8", // always 32px, for roomy cards such as the advisor help card
  xxl: "p-6 md:p-10", // 24px on phones, 40px from tablet up, for a card that holds a whole section's content
};

// 24px radius. Anything nested inside a card must use rounded-control (12px).
// White surface, 1px border, md grey shadow, on any section tone. text-ink is explicit so a card on a dark section does not inherit white text.
const baseClasses = "block w-full rounded-container border text-left text-ink";
const toneClasses = {
  surface: "border-border bg-surface shadow-md",
  tint: "border-brand-tint-strong bg-brand-tint",
  cream: "border-brand-tint-strong bg-surface-cream",
};

// `group` lets text inside the card react to the card's hover (the title underlines, the arrow nudges). The card itself does
// not move: on hover the border turns soft pink and the shadow deepens, over 200ms (no lift, no scale, no bounce).
const interactiveClasses =
  "group cursor-pointer transition duration-base hover:border-brand-tint-strong hover:shadow-lg focus-visible:border-brand-tint-strong focus-visible:shadow-lg active:border-brand-tint-strong active:shadow-md";

/**
 * Card.
 *
 *   <Card>...</Card>                                           static container
 *   <Card variant="interactive" href="/products">...</Card>    whole card is a link
 *   <Card variant="interactive" onClick={open}>...</Card>      whole card is a button
 *
 * Keep one main action per interactive card. Don't nest buttons or links in it.
 */
export function Card(props: CardProps) {
  const { padding = "md", tone = "surface", shadow = "md", press = "soft", className, children, variant = "default", ...rest } = props;
  const classes = cn(baseClasses, toneClasses[tone], tone !== "tint" && shadow === "sm" && "shadow-sm", paddingClasses[padding], className);

  if (variant !== "interactive") {
    const Tag = (rest as Pick<StaticCard, "as">).as ?? "div";
    return <Tag className={classes}>{children}</Tag>;
  }

  const interactive = cn(classes, press === "brand" ? interactiveClasses.replace("active:border-brand-tint-strong", "active:border-brand") : interactiveClasses);

  if (rest.href !== undefined) {
    const { href, external, ...linkRest } = rest as Omit<LinkCard, keyof SharedProps | "variant">;
    return (
      <AppLink {...linkRest} href={href} external={external} className={interactive}>
        {children}
      </AppLink>
    );
  }

  const buttonRest = rest as Omit<ButtonCard, keyof SharedProps | "variant">;
  return (
    <button type="button" {...buttonRest} className={interactive}>
      {children}
    </button>
  );
}
