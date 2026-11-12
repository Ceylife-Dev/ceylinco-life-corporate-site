import type { ComponentProps, ReactElement, ReactNode } from "react";
import { AppLink } from "./AppLink";
import { Tooltip } from "./Tooltip";
import { cn } from "./cn";

export type IconButtonVariant = "ghost" | "subtle" | "outline";
export type IconButtonSize = "md" | "lg";

type SharedProps = {
  /** What the button does, e.g. "Search". Required: icons alone are not accessible. */
  label: string;
  /** The icon element, e.g. <Search />. It is sized for you. */
  icon: ReactNode;
  /** ghost = no box until hover, subtle = soft grey box, outline = grey border. */
  variant?: IconButtonVariant;
  /** md = 44x44px, lg = 48x48px. */
  size?: IconButtonSize;
  /** Show the label in a tooltip on hover and focus. */
  showTooltip?: boolean;
  disabled?: boolean;
  /** Layout only. */
  className?: string;
};

type AsButton = SharedProps & Omit<ComponentProps<"button">, keyof SharedProps | "children"> & { href?: undefined };
type AsLink = SharedProps &
  Omit<ComponentProps<"a">, keyof SharedProps | "href" | "children"> & { href: string; external?: boolean };

export type IconButtonProps = AsButton | AsLink;

const base =
  "inline-flex shrink-0 items-center justify-center rounded-control text-ink transition cursor-pointer " +
  "aria-disabled:cursor-not-allowed aria-disabled:text-ink-muted [&_svg]:size-5 [&_svg]:shrink-0";

const variantClasses: Record<IconButtonVariant, string> = {
  ghost:
    "bg-transparent not-aria-disabled:hover:bg-brand-tint not-aria-disabled:hover:text-brand not-aria-disabled:focus-visible:bg-brand-tint not-aria-disabled:focus-visible:text-brand " +
    "not-aria-disabled:active:bg-brand-tint-strong",
  subtle:
    "bg-surface-sunken not-aria-disabled:hover:bg-brand-tint not-aria-disabled:hover:text-brand not-aria-disabled:focus-visible:bg-brand-tint not-aria-disabled:focus-visible:text-brand " +
    "not-aria-disabled:active:bg-brand-tint-strong",
  outline:
    "border border-border-strong bg-surface not-aria-disabled:hover:border-brand not-aria-disabled:hover:bg-brand-tint " +
    "not-aria-disabled:focus-visible:border-brand not-aria-disabled:focus-visible:bg-brand-tint not-aria-disabled:focus-visible:text-brand " +
    "not-aria-disabled:hover:text-brand not-aria-disabled:active:bg-brand-tint-strong aria-disabled:border-border " +
    "aria-disabled:bg-surface-sunken",
};

const sizeClasses: Record<IconButtonSize, string> = { md: "size-11", lg: "size-12" };

/**
 * Icon-only button (or link when you pass `href`).
 *
 *   <IconButton label="Search" icon={<Search />} onClick={openSearch} />
 *
 * Extra props like aria-expanded or aria-haspopup pass straight through.
 */
export function IconButton(props: IconButtonProps) {
  const {
    label,
    icon,
    variant = "ghost",
    size = "md",
    showTooltip = false,
    disabled = false,
    className,
    ...rest
  } = props;

  const classes = cn(base, variantClasses[variant], sizeClasses[size], className);

  let control: ReactNode;
  if (rest.href !== undefined) {
    const { href, external, ...linkRest } = rest as Omit<AsLink, keyof SharedProps>;
    control = disabled ? (
      <a {...linkRest} aria-label={label} aria-disabled="true" className={classes}>
        {icon}
      </a>
    ) : (
      <AppLink {...linkRest} href={href} external={external} aria-label={label} className={classes}>
        {icon}
      </AppLink>
    );
  } else {
    const { type = "button", onClick, ...buttonRest } = rest as Omit<AsButton, keyof SharedProps>;
    control = (
      <button
        {...buttonRest}
        // Disabled: no click handler, and never a submit button, so nothing can fire.
        type={disabled ? "button" : type}
        aria-label={label}
        aria-disabled={disabled || undefined}
        onClick={disabled ? undefined : onClick}
        className={classes}
      >
        {icon}
      </button>
    );
  }

  if (!showTooltip) return control;
  return (
    <Tooltip content={label} describe={false}>
      {control as ReactElement<{ "aria-describedby"?: string }>}
    </Tooltip>
  );
}
