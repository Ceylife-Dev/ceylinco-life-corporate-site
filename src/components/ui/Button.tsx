import type { ComponentProps, ReactNode } from "react";
import { AppLink } from "./AppLink";
import { cn } from "./cn";
import { TextLink } from "./TextLink";
import { caseProps } from "@/lib/case";

export type ButtonVariant = "primary" | "secondary" | "tertiary";
export type ButtonSize = "sm" | "md" | "lg" | "adaptive";
export type ButtonTone = "default" | "inverse";

type SharedProps = {
  /** primary = filled maroon, secondary = maroon outline, tertiary = a text link (drawn by TextLink: animated underline, arrow nudge). */
  variant?: ButtonVariant;
  /** Height: sm 44px, md 48px, lg 56px, adaptive 48px up to 768px and 56px from 769px. Every size meets the 44px tap target. */
  size?: ButtonSize;
  /** Inverse secondary only (the maroon call-to-action card): a 1.5px border at 80% white instead of the 1px full white one. */
  strongOutline?: boolean;
  /** Default-tone secondary only: a transparent button with a maroon outline, text and icon that FILLS maroon on hover (text and icon turn white), a darker maroon while pressed, and the 2px focus ring. The border stays maroon so the size never changes. Colours only, no movement. */
  hoverFill?: boolean;
  /**
   * "inverse" is for the maroon call-to-action card and the hero: a white filled button and a white
   * outlined button, with a white focus ring. (On a tertiary link, inverse selects TextLink's light tone for dark sections.)
   */
  tone?: ButtonTone;
  fullWidth?: boolean;
  /** An icon before / after the label. Pass an icon element; it is sized for you. */
  iconStart?: ReactNode;
  iconEnd?: ReactNode;
  disabled?: boolean;
  /** Layout only (margin, width). Never use it to change colour, radius or shadow. */
  className?: string;
  children: ReactNode;
};

type AsButton = SharedProps & Omit<ComponentProps<"button">, keyof SharedProps> & { href?: undefined };
type AsLink = SharedProps &
  Omit<ComponentProps<"a">, keyof SharedProps | "href"> & { href: string; external?: boolean };

export type ButtonProps = AsButton | AsLink;

/* Every class is written out in full so Tailwind can find it. */
const base =
  "group/btn inline-flex items-center justify-center gap-2 rounded-control font-semibold whitespace-nowrap " +
  "select-none transition duration-base cursor-pointer aria-disabled:cursor-not-allowed [&_svg]:size-5 [&_svg]:shrink-0";

const variantClasses: Record<Exclude<ButtonVariant, "tertiary">, string> = {
  primary:
    "bg-brand text-ink-on-brand shadow-sm " +
    "not-aria-disabled:hover:bg-brand-hover not-aria-disabled:focus-visible:bg-brand-hover not-aria-disabled:hover:shadow-lg " +
    "not-aria-disabled:active:bg-brand-pressed not-aria-disabled:active:shadow-sm " +
    "aria-disabled:bg-surface-sunken aria-disabled:text-ink-muted aria-disabled:shadow-none",
  // Hover is clearly visible without any movement: a stronger pink fill, a darker maroon border and label, and a soft shadow.
  secondary:
    "border border-brand bg-surface text-brand " +
    "not-aria-disabled:hover:border-brand-hover not-aria-disabled:hover:bg-brand-tint-strong not-aria-disabled:hover:text-brand-hover not-aria-disabled:hover:shadow-md not-aria-disabled:focus-visible:border-brand-hover not-aria-disabled:focus-visible:bg-brand-tint-strong not-aria-disabled:focus-visible:text-brand-hover " +
    "not-aria-disabled:active:border-brand-pressed not-aria-disabled:active:bg-brand-tint-strong not-aria-disabled:active:text-brand-pressed not-aria-disabled:active:shadow-none " +
    "aria-disabled:border-border aria-disabled:bg-surface-sunken aria-disabled:text-ink-muted",
};

/* Same three variants, for use on the maroon call-to-action card. The focus ring is white because a maroon ring would vanish. */
const inverseVariantClasses: Record<Exclude<ButtonVariant, "tertiary">, string> = {
  primary:
    "bg-surface text-brand shadow-sm focus-visible:outline-ink-on-brand " +
    "not-aria-disabled:hover:bg-brand-tint-strong not-aria-disabled:focus-visible:bg-brand-tint-strong not-aria-disabled:hover:shadow-lg " +
    "not-aria-disabled:active:bg-brand-tint-strong not-aria-disabled:active:shadow-sm",
  secondary:
    "border border-ink-on-brand bg-transparent text-ink-on-brand focus-visible:outline-ink-on-brand " +
    "not-aria-disabled:hover:bg-on-brand-pressed not-aria-disabled:focus-visible:bg-on-brand-pressed not-aria-disabled:hover:shadow-md " +
    "not-aria-disabled:active:bg-on-brand-pressed not-aria-disabled:active:shadow-none",
};

// The secondary button on the maroon card with a stronger outline: 1.5px at 80% white (instead of 1px full white). Same hover and press.
const inverseStrongOutline = inverseVariantClasses.secondary.replace("border border-ink-on-brand", "border-outline border-ink-on-brand/80");

// An outlined button that fills with maroon on hover: colours only. Hover is wrapped in (hover: hover) by Tailwind, so touch screens never keep it;
// :active is for touch feedback. The keyboard focus state is the hover colours plus the standard 2px ring (2px offset). The border stays maroon.
const hoverFillClasses =
  "border border-brand bg-transparent text-brand " +
  "not-aria-disabled:hover:bg-brand not-aria-disabled:hover:text-ink-on-brand not-aria-disabled:focus-visible:bg-brand not-aria-disabled:focus-visible:text-ink-on-brand " +
  "not-aria-disabled:active:bg-brand-hover not-aria-disabled:active:text-ink-on-brand " +
  "aria-disabled:border-border aria-disabled:bg-surface-sunken aria-disabled:text-ink-muted";

const sizeClasses: Record<ButtonSize, string> = {
  sm: "min-h-11 text-sm",
  md: "min-h-12 text-base",
  lg: "min-h-14 text-lg",
  adaptive: "min-h-12 text-base bar:min-h-14 bar:text-lg",
};

// Horizontal padding.
const paddingClasses: Record<ButtonSize, string> = { sm: "px-4", md: "px-6", lg: "px-8", adaptive: "px-6 bar:px-8" };

/** The button look as a class string, for the rare case you need it on another element. */
export function buttonClasses(
  variant: Exclude<ButtonVariant, "tertiary"> = "primary",
  size: ButtonSize = "md",
  fullWidth = false,
  className?: string,
  tone: ButtonTone = "default",
  strongOutline = false,
  hoverFill = false,
) {
  const fill = hoverFill && tone === "default" && variant === "secondary";
  return cn(
    // the fill button changes colours only, so it transitions only colours (not the whole `transition` shorthand, which also lists transform)
    fill ? base.replace("transition duration-base", "transition-colors duration-base") : base,
    fill ? hoverFillClasses : tone === "inverse" ? (strongOutline && variant === "secondary" ? inverseStrongOutline : inverseVariantClasses[variant]) : variantClasses[variant],
    sizeClasses[size],
    paddingClasses[size],
    fullWidth && "w-full",
    className,
  );
}

/**
 * Button. Renders a <button>, or a link when you pass `href`.
 *
 *   <Button>Get a quote</Button>
 *   <Button variant="secondary" href="/login">Customer login</Button>
 *
 * Disabled button: uses aria-disabled so it stays focusable and screen readers
 * can still find it; it gets no click handler and is never a submit button.
 * Disabled link: rendered without an href (announced as disabled, skipped by Tab).
 */
export function Button(props: ButtonProps) {
  const {
    variant = "primary",
    size = "md",
    tone = "default",
    strongOutline = false,
    hoverFill = false,
    fullWidth = false,
    iconStart,
    iconEnd,
    disabled = false,
    className,
    children,
    ...rest
  } = props;

  // A tertiary "button" is a text link: it is drawn by the shared TextLink, so every text link behaves the same.
  if (variant === "tertiary") {
    return (
      <TextLink
        {...(rest as object)}
        tone={tone === "inverse" ? "light" : "default"}
        size={size === "sm" ? "sm" : "md"}
        iconStart={iconStart}
        iconEnd={iconEnd}
        disabled={disabled}
        className={className}
      >
        {children}
      </TextLink>
    );
  }

  const classes = buttonClasses(variant, size, fullWidth, className, tone, strongOutline, hoverFill);
  const content = (
    <>
      {iconStart}
      <span {...caseProps}>{children}</span>
      {iconEnd && <span className="inline-flex">{iconEnd}</span>}
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
      // Disabled: no click handler, and never a submit button, so nothing can fire.
      type={disabled ? "button" : type}
      aria-disabled={disabled || undefined}
      onClick={disabled ? undefined : onClick}
      className={classes}
    >
      {content}
    </button>
  );
}
