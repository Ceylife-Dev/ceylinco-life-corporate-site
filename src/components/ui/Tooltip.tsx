"use client";

import { cloneElement, isValidElement, useId, useState, type ReactElement, type ReactNode } from "react";
import { cn } from "./cn";

type TooltipProps = {
  /** The short text to show. Keep it to a few words. */
  content: ReactNode;
  /** One focusable element: a button, link or input. */
  children: ReactElement<{ "aria-describedby"?: string }>;
  placement?: "top" | "bottom";
  /**
   * Link the tooltip to the child with aria-describedby (default). Turn this off
   * when the tooltip only repeats the child's aria-label, as IconButton does.
   */
  describe?: boolean;
};

/**
 * Tooltip. Opens on hover and on keyboard focus, closes on Esc, on blur and
 * when the pointer leaves. The pointer can move onto the tooltip without it
 * closing (WCAG 1.4.13).
 *
 * Limits: it positions above or below only, so keep it away from the screen
 * edge. Touch screens have no hover, so never hide essential information in a
 * tooltip.
 */
export function Tooltip({ content, children, placement = "top", describe = true }: TooltipProps) {
  const id = useId();
  const [open, setOpen] = useState(false);

  const trigger =
    describe && isValidElement(children) ? cloneElement(children, { "aria-describedby": id }) : children;

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      onKeyDown={(event) => {
        if (event.key === "Escape") setOpen(false);
      }}
    >
      {trigger}
      {/* Always in the page (hidden with `invisible`) so aria-describedby can find it. */}
      <span
        role="tooltip"
        id={id}
        data-open={open}
        className={cn(
          "invisible absolute left-1/2 z-tooltip -translate-x-1/2 opacity-0 transition-opacity",
          "data-[open=true]:visible data-[open=true]:opacity-100",
          // The padding is a bridge so the pointer can travel from trigger to tooltip.
          placement === "top" ? "bottom-full pb-2" : "top-full pt-2",
        )}
      >
        <span className="block w-max max-w-60 rounded-control bg-ink px-3 py-2 text-center text-sm font-medium text-ink-on-brand shadow-md">
          {content}
        </span>
      </span>
    </span>
  );
}
