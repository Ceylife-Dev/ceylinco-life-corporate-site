"use client";

import { usePathname } from "next/navigation";
import type { ComponentProps, ReactNode } from "react";
import { AppLink } from "./AppLink";
import { cn } from "./cn";
import { caseProps } from "@/lib/case";

export type NavLinkVariant = "inline" | "block";

/**
 * Classes for a navigation item. Exported so menu buttons (which are not links)
 * can look exactly like NavLinks.
 *
 *   inline = top navigation: text only, no background. Hover and keyboard focus draw the animated line under the label;
 *            the current page (or an open menu) keeps the line, and the current page is maroon.
 *   block  = mobile menu: full-width row, tinted when current
 */
export function navItemClasses(variant: NavLinkVariant, active: boolean): string {
  if (variant === "block") {
    return cn(
      "flex w-full min-h-12 items-center gap-3 rounded-control px-4 text-lg font-medium transition",
      "hover:bg-brand-tint hover:text-brand focus-visible:bg-brand-tint active:bg-brand-tint-strong [&_svg]:size-5 [&_svg]:shrink-0",
      active ? "bg-brand-tint text-brand" : "text-ink",
    );
  }
  return cn(
    // 14px / weight 500. The 44px tall hit area comes from min-h-touch plus the side padding.
    // No background on hover or when open: the animated line is drawn on the label (see navLabelClasses), and `group/nav`
    // lets the whole 44px row trigger it.
    "group/nav relative inline-flex min-h-touch items-center gap-1.5 rounded-control px-3 text-sm font-medium transition-colors",
    "[&_svg]:size-4 [&_svg]:shrink-0",
    active ? "text-brand" : "text-ink",
  );
}

/**
 * The text of a top navigation item. A 2px line in the text colour (currentColor) grows from the left (scaleX 0 to 1, 200ms,
 * ease-out; see `link-line` in globals.css) on hover and keyboard focus. Pass `true` to keep the full line: for the current
 * page, and for a menu button while its menu is open. Use it around the label of every inline nav link and menu button.
 */
export function navLabelClasses(keepLine: boolean): string {
  return cn("link-line group-hover/nav:link-scale-full group-focus-visible/nav:link-scale-full", keepLine && "link-scale-full");
}

/** Is `href` the page we are on? Sections count as current for their sub-pages. */
export function isCurrentPath(pathname: string, href: string, exact = false): boolean {
  const target = href.split(/[?#]/)[0];
  if (!target.startsWith("/")) return false; // external links are never "current"
  if (target === "/" || exact) return pathname === target;
  return pathname === target || pathname.startsWith(`${target}/`);
}

type NavLinkProps = Omit<ComponentProps<"a">, "href" | "className"> & {
  href: string;
  children: ReactNode;
  variant?: NavLinkVariant;
  /** Only the exact page counts as current (not its sub-pages). */
  exact?: boolean;
  /** Layout only. */
  className?: string;
};

/**
 * Navigation link that marks the current page with aria-current="page".
 *
 * Note: it reads the URL, so on routes with unknown params (like a catch-all)
 * the component that renders it must sit inside <Suspense>.
 */
export function NavLink({ href, children, variant = "inline", exact, className, ...rest }: NavLinkProps) {
  const pathname = usePathname();
  const active = isCurrentPath(pathname, href, exact);

  return (
    <AppLink
      {...rest}
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(navItemClasses(variant, active), className)}
    >
      <span className={variant === "inline" ? navLabelClasses(active) : undefined} {...caseProps}>
        {children}
      </span>
    </AppLink>
  );
}
