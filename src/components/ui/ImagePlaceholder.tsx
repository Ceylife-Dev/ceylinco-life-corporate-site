import { Image as ImageIcon } from "lucide-react";
import { cn } from "./cn";

export type ImageRatio = "16/9" | "3/2" | "4/3" | "3/4" | "9/16" | "1/1";
export type ImageRadius = "container" | "control";

type ImagePlaceholderProps = {
  /** The image's alt text, e.g. "A family smiling together". Read by screen readers; nothing is written on the grey box. */
  label: string;
  /** Fixed ratio so every image on the site lines up. */
  ratio?: ImageRatio;
  /** container = 24px (stand-alone images), control = 12px (inside a card). */
  radius?: ImageRadius;
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
 * Neutral grey stand-in for a photo that does not exist yet. Replace it with
 * a real image of the same ratio and radius when one is available.
 */
export function ImagePlaceholder({ label, ratio = "4/3", radius = "container", className }: ImagePlaceholderProps) {
  return (
    <div
      role="img"
      aria-label={label}
      className={cn(
        "flex w-full flex-col items-center justify-center bg-surface-sunken p-6 text-ink-muted",
        ratioClasses[ratio],
        radius === "container" ? "rounded-container" : "rounded-control",
        className,
      )}
    >
      <ImageIcon aria-hidden="true" className="size-8" />
    </div>
  );
}
