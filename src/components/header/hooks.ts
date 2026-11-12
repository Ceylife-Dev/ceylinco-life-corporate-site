"use client";

/**
 * Small helpers for the header: focus handling and keyboard movement.
 * Nothing here is visual.
 */
import { useEffect, type RefObject } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Everything inside `container` that can take keyboard focus right now. */
export function getFocusable(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (element) => element.getClientRects().length > 0 && getComputedStyle(element).visibility !== "hidden",
  );
}

/**
 * Keeps Tab and Shift+Tab inside `ref` while `active` is true (for overlays).
 * When it turns off, focus goes back to `returnFocusRef` (or where it was).
 */
export function useFocusTrap(
  ref: RefObject<HTMLElement | null>,
  active: boolean,
  returnFocusRef?: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    if (!active) return;
    const container = ref.current;
    if (!container) return;
    // Remember where focus should go back to when the overlay closes.
    const returnTarget = returnFocusRef?.current ?? (document.activeElement as HTMLElement | null);

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Tab" || !container) return;
      const items = getFocusable(container);
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const current = document.activeElement;
      const outside = !container.contains(current);

      if (event.shiftKey && (current === first || outside)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (current === last || outside)) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      returnTarget?.focus?.();
    };
  }, [ref, active, returnFocusRef]);
}

/** Stops the page behind an overlay from scrolling while `active` is true. */
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const root = document.documentElement;
    root.classList.add("overflow-hidden");
    return () => root.classList.remove("overflow-hidden");
  }, [active]);
}

/**
 * Arrow-key movement across a grid of links. Picks the nearest link in the
 * direction of the key, so it works for one column, two columns or two groups.
 * Returns null when there is nothing further in that direction.
 */
export function nextFocusByArrow(
  items: HTMLElement[],
  current: HTMLElement,
  key: "ArrowUp" | "ArrowDown" | "ArrowLeft" | "ArrowRight",
): HTMLElement | null {
  const center = (element: HTMLElement) => {
    const box = element.getBoundingClientRect();
    return { x: box.left + box.width / 2, y: box.top + box.height / 2 };
  };
  const from = center(current);
  const vertical = key === "ArrowUp" || key === "ArrowDown";
  const tolerance = 4;

  let best: HTMLElement | null = null;
  let bestScore = Infinity;

  for (const item of items) {
    if (item === current) continue;
    const to = center(item);
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const inDirection =
      key === "ArrowDown" ? dy > tolerance : key === "ArrowUp" ? dy < -tolerance : key === "ArrowRight" ? dx > tolerance : dx < -tolerance;
    if (!inDirection) continue;

    const along = vertical ? Math.abs(dy) : Math.abs(dx);
    const across = vertical ? Math.abs(dx) : Math.abs(dy);
    const score = along + across * 3; // prefer staying in the same row or column
    if (score < bestScore) {
      best = item;
      bestScore = score;
    }
  }
  return best;
}

export const arrowKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"] as const;
export type ArrowKey = (typeof arrowKeys)[number];
export const isArrowKey = (key: string): key is ArrowKey => (arrowKeys as readonly string[]).includes(key);

/** Sent by the installed app's bottom bar ("Menu") to open the mobile menu in the header. */
export const TOGGLE_MENU_EVENT = "cl:toggle-menu";
/** The header tells the rest of the page whether the menu is open: a CustomEvent with `detail: { open: boolean }`. The bottom bar's "More" button follows it. */
export const MENU_STATE_EVENT = "cl:menu-state";
