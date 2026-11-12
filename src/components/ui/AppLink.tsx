import Link from "next/link";
import type { ComponentProps } from "react";

/** True for links that leave the site (https://..., mailto:, tel:). */
export function isExternalHref(href: string): boolean {
  return /^(https?:)?\/\//.test(href) || href.startsWith("mailto:") || href.startsWith("tel:");
}

type AppLinkProps = Omit<ComponentProps<"a">, "href"> & {
  href: string;
  /** Force internal/external handling. Normally detected from the href. */
  external?: boolean;
};

/**
 * One link component for the whole site.
 * Internal links use Next.js <Link> (fast client-side navigation).
 * External links use a plain <a> that opens in the same tab.
 */
export function AppLink({ href, external, ...rest }: AppLinkProps) {
  if (external ?? isExternalHref(href)) {
    return <a href={href} rel="noopener noreferrer" {...rest} />;
  }
  return <Link href={href} {...rest} />;
}
