"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AppLink, cn, isCurrentPath } from "@/components/ui";
import { MENU_STATE_EVENT, TOGGLE_MENU_EVENT } from "@/components/header/hooks";
import { pwa } from "@/content/pwa";
import { caseProps } from "@/lib/case";

// A 24px icon area and a 16px label area (the same in every item), so icons and labels line up across the bar.
const itemClasses =
  "relative flex h-full w-full min-w-0 flex-col items-center justify-start gap-0.5 px-0.5 pt-1.5 text-center text-tab font-medium transition-colors " +
  "hover:bg-brand-tint focus-visible:bg-brand-tint active:bg-brand-tint-strong [&_svg]:size-6";

// z-dropdown puts the bar above the header's full-screen menu, so "More" stays visible (active) while the menu is open.
const barClasses = "fixed inset-x-0 bottom-0 z-dropdown border-t border-border bg-surface pb-safe shadow-up bar:hidden";

// The active look: maroon icon and label and a 2px bar along the top of the item.
const activeClasses = "text-brand before:absolute before:inset-x-4 before:top-0 before:h-0.5 before:bg-brand";

/** What shows for a moment before the bar is ready: the same empty bar, so the page does not jump. */
export function BottomNavFallback() {
  return (
    <div aria-hidden="true" className={barClasses}>
      <div className="h-bottom-nav" />
    </div>
  );
}

/**
 * The bottom bar on phones: Home, Products, Pay, Quote and More (the last one opens the full-screen menu). Five equal columns; every label is one line (12px, never wraps, ellipsis as a safety net).
 *
 * It shows at 768px and below, in the browser and in the installed app alike (it does not depend on display mode), and
 * is hidden from 769px up. The page and the floating buttons are lifted above it (see globals.css). It sits ABOVE the
 * header's full-screen menu (z-dropdown over z-sticky), and it respects the home-indicator safe area. A 1px top border and a
 * soft upward shadow (--shadow-up) separate it from the page. The current section is maroon with a 2px bar on top, and has
 * aria-current="page". "More" (three dots) is the only way to open the menu on phones: it has aria-expanded and aria-controls,
 * shows the same active look while the menu is open (the current page goes grey meanwhile), and takes keyboard focus back when the menu closes.
 * It reads the URL, so it sits inside <Suspense> in the layout.
 */
export function BottomNav() {
  const pathname = usePathname();
  const { label, items, menu } = pwa.bottomNav;
  const MenuIcon = menu.icon;
  const moreRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // The header says when the menu opens or closes. When it closes, focus goes back to "More" (if the bar is on screen).
  useEffect(() => {
    function onState(event: Event) {
      const open = (event as CustomEvent<{ open: boolean }>).detail.open;
      setMenuOpen(open);
      if (wasOpen.current && !open && (moreRef.current?.getClientRects().length ?? 0) > 0) moreRef.current?.focus();
      wasOpen.current = open;
    }
    window.addEventListener(MENU_STATE_EVENT, onState);
    return () => window.removeEventListener(MENU_STATE_EVENT, onState);
  }, []);

  return (
    <nav aria-label={label} data-inert-exempt className={barClasses}>
      <ul className="mx-auto flex h-bottom-nav max-w-prose">
        {items.map(({ label: itemLabel, href, icon: Icon, ...rest }) => {
          // While the menu is open "More" is the active item, so the current page is shown as grey.
          const current = !menuOpen && isCurrentPath(pathname, href, href === "/");
          return (
            <li key={itemLabel} className="min-w-0 flex-1">
              <AppLink
                href={href}
                aria-label={"ariaLabel" in rest ? rest.ariaLabel : undefined}
                aria-current={current ? "page" : undefined}
                className={cn(itemClasses, current ? activeClasses : "text-ink-muted")}
              >
                <Icon aria-hidden="true" />
                <span {...caseProps} className="block h-4 w-full truncate leading-4">{itemLabel}</span>
              </AppLink>
            </li>
          );
        })}
        <li className="min-w-0 flex-1">
          <button
            ref={moreRef}
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className={cn(itemClasses, "cursor-pointer", menuOpen ? activeClasses : "text-ink-muted")}
            onClick={() => window.dispatchEvent(new Event(TOGGLE_MENU_EVENT))}
          >
            <MenuIcon aria-hidden="true" />
            <span {...caseProps} className="block h-4 w-full truncate leading-4">{menu.label}</span>
          </button>
        </li>
      </ul>
    </nav>
  );
}
