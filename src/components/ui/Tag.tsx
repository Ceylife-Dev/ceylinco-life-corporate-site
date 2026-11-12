import type { ReactNode } from "react";
import { cn } from "./cn";

export type TagTone = "neutral" | "brand" | "outline" | "success" | "warning" | "error";

type TagProps = {
  /** neutral = grey fill, brand = soft pink, outline = white with a 1px border (for chips on a pink section), success / warning / error = status colours. */
  tone?: TagTone;
  /** Optional icon before the label. Status tags should always have one or clear words. */
  icon?: ReactNode;
  /** Layout only. */
  className?: string;
  children: ReactNode;
};

// Each tone is a dark text colour on its own light tint. All pairs pass AA (see npm run check:contrast).
const toneClasses: Record<TagTone, string> = {
  neutral: "bg-surface-sunken text-ink",
  brand: "bg-brand-tint text-brand",
  outline: "border border-border bg-surface text-ink",
  success: "bg-success-tint text-success",
  warning: "bg-warning-tint text-warning",
  error: "bg-error-tint text-error",
};

/**
 * Tag: a small, read-only label such as "New", "Popular" or "Approved".
 * It is not clickable. If you need a clickable chip, use a Button instead.
 */
export function Tag({ tone = "neutral", icon, className, children }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex min-h-7 items-center gap-1.5 rounded-control px-3 text-sm font-medium [&_svg]:size-4 [&_svg]:shrink-0",
        toneClasses[tone],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  );
}
