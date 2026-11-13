import Image from "next/image";
import { site } from "@/content/site";
import { AppLink } from "./AppLink";

type StoreBadgeProps = {
  /** The official badge file, used exactly as supplied (never recoloured, cropped or restyled). */
  src: string;
  /** The file's own size: only its proportions are used, so every badge ends up the same height with its own width. */
  width: number;
  height: number;
  /** What a screen reader says, for example "Download Ceylife Digital on the App Store". */
  label: string;
  href: string;
};

/**
 * An official app store badge as a link. All badges share one height (44px up to 768px, 48px from 769px); the width follows
 * each badge's own proportions. It opens the store in a new tab (rel=noopener) once a real address is set; while the address is still
 * the "#" placeholder it stays in the same tab. The artwork is never touched. The link carries a 2px ring with a 2px offset that is
 * transparent at rest, follows the badge's corner (--radius-badge), and turns maroon on hover (only on devices that can hover),
 * while pressed and on keyboard focus (always visible). On hover the badge is a touch brighter (brightness 1.08), while pressed a
 * touch darker (0.95). Only the ring colour and the brightness change, over 200ms; nothing moves (no lift, scale or bounce).
 * The badge is a picture of the store logo, so the link carries the descriptive name.
 */
export function StoreBadge({ src, width, height, label, href }: StoreBadgeProps) {
  const realAddress = href !== "#";
  return (
    <AppLink
      href={href}
      aria-label={realAddress ? `${label}, ${site.opensInNewTab}` : label}
      target={realAddress ? "_blank" : undefined}
      rel={realAddress ? "noopener" : undefined}
      className="inline-flex h-11 shrink-0 rounded-badge outline-2 outline-offset-2 outline-transparent transition-badge hover:badge-brighter hover:outline-brand focus-visible:outline-brand active:badge-pressed active:outline-brand bar:h-12"
    >
      <Image src={src} alt="" width={width} height={height} unoptimized className="h-full w-auto" />
    </AppLink>
  );
}
