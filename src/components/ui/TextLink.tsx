import type { ComponentProps, ReactNode } from "react";
import { AppLink } from "./AppLink";
import { cn } from "./cn";
import { caseProps } from "@/lib/case";

export type TextLinkTone = "default" | "light" | "light-muted";
export type TextLinkSize = "sm" | "md" | "list";

type SharedProps = {
  /**
   * default = maroon text and a maroon line (over a thin pale pink resting line), for light backgrounds.
   * light = near-white text (footer-text) and line, for dark sections such as the trust block (no resting line, so the growing line is visible).
   * light-muted = muted light text (footer-muted) that brightens to footer-text on hover, with a footer-text line: the footer's link lists.
   */
  tone?: TextLinkTone;
  /** Height: sm 44px / 14px text, md 48px / 16px text, list 44px / 16px text (link lists such as the footer). Ignored when `inline`. */
  size?: TextLinkSize;
  /** For a link inside a sentence: no padding or minimum height, text size inherited. */
  inline?: boolean;
  /** An icon after the label, normally <ArrowRight /> for a link that goes to another page. It does not move. */
  iconEnd?: ReactNode;
  iconStart?: ReactNode;
  disabled?: boolean;
  /** Layout only (margin, width). Never use it to change colour or type. */
  className?: string;
  children: ReactNode;
};

type AsButton = SharedProps & Omit<ComponentProps<"button">, keyof SharedProps> & { href?: undefined };
type AsLink = SharedProps & Omit<ComponentProps<"a">, keyof SharedProps | "href"> & { href: string; external?: boolean };

export type TextLinkProps = AsButton | AsLink;

/* Every class is written out in full so Tailwind can find it. */
const base =
  "group/link rounded-control font-semibold select-none transition-colors cursor-pointer " +
  "aria-disabled:cursor-not-allowed aria-disabled:text-ink-muted";

const toneClasses: Record<TextLinkTone, string> = {
  // The text colour stays the same on hover: the line (and the arrow) are the hover effect. Pressed goes a shade darker.
  default: "text-brand not-aria-disabled:active:text-brand-pressed link-rest-soft",
  light: "text-footer-text not-aria-disabled:active:text-ink-on-brand focus-visible:outline-footer-text",
  "light-muted":
    "text-footer-muted not-aria-disabled:hover:text-footer-text not-aria-disabled:focus-visible:text-footer-text not-aria-disabled:active:text-ink-on-brand focus-visible:outline-footer-text link-line-footer",
};

const sizeClasses: Record<TextLinkSize, string> = {
  sm: "min-h-11 text-sm",
  md: "min-h-12 text-base",
  list: "min-h-11 text-base",
};

/** The text of the link: carries the animated line (see `link-line` in globals.css). */
const labelClasses =
  "link-line group-hover/link:link-scale-full group-focus-visible/link:link-scale-full group-active/link:link-scale-full";

/** The arrow stays still: only the large clickable cards move their arrow (see CardArrow). */
const iconEndClasses = "inline-flex";

/**
 * The one text-link component. Every text link on the site (the tertiary buttons, the footer lists, the phone link in the FAQ
 * strip, "Our story" on the dark section) uses it, so they all behave the same:
 *   hover / keyboard focus: a 2px line grows from the left under the text (200ms, ease-out); an arrow, if there is one,
 *                           stays still; keyboard focus also shows the standard 2px focus ring;
 *   pressed:                the text goes a shade darker;
 *   dark sections:          use tone="light" (or "light-muted" in the footer) so the line and the focus ring stay visible.
 * Hover effects only apply on devices that can hover. With reduced motion the line appears at once.
 *
 *   <TextLink href="/products" iconEnd={<ArrowRight />}>See all products</TextLink>
 */
export function TextLink(props: TextLinkProps) {
  const {
    tone = "default",
    size = "md",
    inline = false,
    iconEnd,
    iconStart,
    disabled = false,
    className,
    children,
    ...rest
  } = props;

  const classes = cn(
    base,
    toneClasses[tone],
    inline ? "inline" : cn("inline-flex min-w-touch items-center justify-center gap-2 px-2 whitespace-nowrap [&_svg]:size-5 [&_svg]:shrink-0", sizeClasses[size]),
    className,
  );

  const content = (
    <>
      {iconStart}
      <span className={disabled ? undefined : labelClasses} {...caseProps}>{children}</span>
      {iconEnd && <span className={iconEndClasses}>{iconEnd}</span>}
    </>
  );

  if (rest.href !== undefined) {
    const { href, external, onClick, ...linkRest } = rest as Omit<AsLink, keyof SharedProps>;
    if (disabled) {
      // A link without an href is announced as disabled and cannot be followed.
      return (
        <a {...linkRest} aria-disabled="true" className={classes}>
          {content}
        </a>
      );
    }
    return (
      <AppLink {...linkRest} href={href} external={external} onClick={onClick} className={classes}>
        {content}
      </AppLink>
    );
  }

  const { type = "button", onClick, ...buttonRest } = rest as Omit<AsButton, keyof SharedProps>;
  return (
    <button
      {...buttonRest}
      type={disabled ? "button" : type}
      aria-disabled={disabled || undefined}
      onClick={disabled ? undefined : onClick}
      className={classes}
    >
      {content}
    </button>
  );
}
