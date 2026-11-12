import { ArrowRight } from "lucide-react";

/**
 * The circular arrow on a large clickable card: a 40px circle holding a maroon arrow. At rest the circle has no fill
 * (the Figma frame hides it, so only the arrow shows); on hover or focus it fills soft pink (brand-tint).
 * It is decorative (hidden from screen readers; the card itself is the link) and goes in the top right corner of the
 * card. It needs a parent with `group` (the interactive Card has one): on hover or focus the arrow also moves 4px right
 * (skipped for reduced motion).
 *
 * Only the product cards use it (the news cards have no arrow).
 */
export function CardArrow() {
  return (
    <span
      aria-hidden="true"
      className="flex size-10 shrink-0 items-center justify-center rounded-full bg-transparent text-brand transition duration-base group-hover:bg-brand-tint group-focus-visible:bg-brand-tint group-active:bg-brand-tint-strong"
    >
      <ArrowRight className="size-5 motion-safe:transition-transform motion-safe:duration-base motion-safe:group-hover:translate-x-1 motion-safe:group-focus-visible:translate-x-1 motion-safe:group-active:translate-x-1" />
    </span>
  );
}
