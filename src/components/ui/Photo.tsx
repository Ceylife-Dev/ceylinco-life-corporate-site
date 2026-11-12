import Image from "next/image";
import type { ImageProps } from "next/image";
import { cn } from "./cn";
import { Reveal } from "./Reveal";
import type { ImageRadius, ImageRatio } from "./ImagePlaceholder";

type PhotoProps = {
  src: ImageProps["src"];
  /** Meaningful alt text. Use "" only for a purely decorative image (the hero photo). */
  alt: string;
  /** Fixed ratio so every photo on the site lines up. The photo is cropped to fit (object-fit: cover). */
  ratio?: ImageRatio;
  /** container = 24px (stand-alone photos), control = 12px (inside a card). */
  radius?: ImageRadius;
  /** Tells the browser how wide the photo is shown, so it downloads the right size. */
  sizes: string;
  priority?: boolean;
  /** Layout only (width, max-width). */
  className?: string;
};

// Written out in full so Tailwind can find each class.
const ratioClasses: Record<ImageRatio, string> = {
  "16/9": "aspect-16/9",
  "3/2": "aspect-3/2",
  "4/3": "aspect-4/3",
  "3/4": "aspect-3/4",
  "9/16": "aspect-9/16",
  "1/1": "aspect-square",
};

/**
 * A photo with a fixed aspect ratio and rounded corners, served by next/image (AVIF / WebP, right-sized).
 * It is the real-image counterpart of ImagePlaceholder: same ratios and radii, so a placeholder can be swapped
 * for a photo without the layout moving.
 */
export function Photo({ src, alt, ratio = "4/3", radius = "control", sizes, priority, className }: PhotoProps) {
  return (
    <Reveal
      variant="fade"
      className={cn(
        "relative w-full overflow-hidden bg-surface-sunken",
        ratioClasses[ratio],
        radius === "container" ? "rounded-container" : "rounded-control",
        className,
      )}
    >
      <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
    </Reveal>
  );
}
