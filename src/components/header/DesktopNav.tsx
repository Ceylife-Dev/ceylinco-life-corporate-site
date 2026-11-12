"use client";

import { caseProps } from "@/lib/case";
import { ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { NavLink, cn, isCurrentPath, navItemClasses, navLabelClasses } from "@/components/ui";
import { headerText, mainNav } from "@/content/navigation";
import { MegaMenuPanel } from "./MegaMenuPanel";
import { getFocusable, isArrowKey, nextFocusByArrow } from "./hooks";

/** How a menu was opened. A menu opened by hovering turns into a "pinned" one when clicked. */
type OpenBy = "hover" | "click" | "key";

const HOVER_OPEN_DELAY = 100; // ms: avoids menus flashing open as the pointer passes by
const HOVER_CLOSE_DELAY = 200; // ms: gives time to travel from the button to the panel

/**
 * The main navigation shown on wide screens (above the "nav" breakpoint).
 *
 * Behaviour
 *  - Mouse: menus open on hover, and stay open if you click the button.
 *  - Click / tap / Enter / Space: toggles the menu.
 *  - Arrow Down on a menu button opens it and moves into it. Inside, the arrow
 *    keys move between items, Home and End jump, and Esc closes the menu and
 *    returns to its button. Tab also works; tabbing out closes the menu.
 *  - A menu closes when you click elsewhere or go to another page.
 */
export function DesktopNav() {
  const pathname = usePathname();
  // `path` ties the open state to the page it was opened on, so navigating closes it.
  const [open, setOpen] = useState<{ id: string; by: OpenBy; path: string } | null>(null);
  const openId = open && open.path === pathname ? open.id : null;
  const openBy = open?.by;

  const navRef = useRef<HTMLElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const focusFirstIn = useRef<string | null>(null);

  const clearTimer = () => window.clearTimeout(timer.current);
  const openMenu = (id: string, by: OpenBy) => {
    clearTimer();
    setOpen({ id, by, path: pathname });
  };
  const closeMenu = () => {
    clearTimer();
    setOpen(null);
  };
  const triggerId = (id: string) => `nav-trigger-${id}`;
  const panelId = (id: string) => `nav-panel-${id}`;

  // Pointer handling (mouse only: touch uses tap/click).
  const hoverOpen = (id: string) => (event: React.PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    clearTimer();
    if (openId) openMenu(id, "hover");
    else timer.current = window.setTimeout(() => openMenu(id, "hover"), HOVER_OPEN_DELAY);
  };
  const hoverClose = (event: React.PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    clearTimer();
    // Only menus that were opened by hovering close on leave; clicked ones stay.
    timer.current = window.setTimeout(() => setOpen((current) => (current?.by === "hover" ? null : current)), HOVER_CLOSE_DELAY);
  };

  // While a menu is open: Esc closes it, and a click outside closes it.
  useEffect(() => {
    if (!openId) return;
    const nav = navRef.current;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      const focusWasInside = nav?.contains(document.activeElement);
      setOpen(null);
      if (focusWasInside) document.getElementById(`nav-trigger-${openId}`)?.focus();
    }
    function onPointerDown(event: PointerEvent) {
      if (nav && !nav.contains(event.target as Node)) setOpen(null);
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [openId]);

  // After a keyboard open, move focus to the first item once the panel is showing.
  useEffect(() => {
    if (!openId || focusFirstIn.current !== openId) return;
    focusFirstIn.current = null;
    const frame = requestAnimationFrame(() => {
      const panel = document.getElementById(`nav-panel-${openId}`);
      if (panel) getFocusable(panel)[0]?.focus();
    });
    return () => cancelAnimationFrame(frame);
  }, [openId]);

  function onTriggerClick(id: string, event: React.MouseEvent) {
    const fromKeyboard = event.detail === 0; // Enter or Space produce a click with no mouse detail
    if (openId === id) {
      if (openBy === "hover" && !fromKeyboard) setOpen({ id, by: "click", path: pathname }); // pin it
      else closeMenu();
      return;
    }
    openMenu(id, fromKeyboard ? "key" : "click");
    if (fromKeyboard) focusFirstIn.current = id;
  }

  function onTriggerKeyDown(id: string, event: React.KeyboardEvent) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      focusFirstIn.current = id;
      if (openId === id) getFocusable(document.getElementById(panelId(id))!)[0]?.focus();
      else openMenu(id, "key");
    }
  }

  // Arrow keys inside an open panel.
  function onPanelKeyDown(id: string, event: React.KeyboardEvent<HTMLDivElement>) {
    const items = getFocusable(event.currentTarget);
    const current = document.activeElement as HTMLElement;
    if (!items.includes(current)) return;

    if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      (event.key === "Home" ? items[0] : items[items.length - 1]).focus();
      return;
    }
    if (!isArrowKey(event.key)) return;
    event.preventDefault();
    const next = nextFocusByArrow(items, current, event.key);
    if (next) next.focus();
    else if (event.key === "ArrowUp") document.getElementById(triggerId(id))?.focus(); // up from the top goes back to the button
  }

  return (
    <nav ref={navRef} aria-label={headerText.mainNavLabel}>
      <ul className="flex items-center gap-1" onPointerLeave={hoverClose}>
        {mainNav.map((entry) => {
          if (entry.kind === "link") {
            return (
              <li key={entry.href} onPointerEnter={hoverClose}>
                <NavLink href={entry.href}>{entry.label}</NavLink>
              </li>
            );
          }

          const { menu } = entry;
          const isOpen = openId === menu.id;
          const inSection = isCurrentPath(pathname, menu.basePath);
          return (
            <li
              key={menu.id}
              onPointerEnter={hoverOpen(menu.id)}
              onBlur={(event) => {
                // Tabbing (or clicking) away from this menu's button and panel closes it.
                if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                  setOpen((current) => (current?.id === menu.id ? null : current));
                }
              }}
            >
              <button
                type="button"
                id={triggerId(menu.id)}
                aria-expanded={isOpen}
                aria-controls={panelId(menu.id)}
                aria-current={inSection ? "true" : undefined}
                onClick={(event) => onTriggerClick(menu.id, event)}
                onKeyDown={(event) => onTriggerKeyDown(menu.id, event)}
                className={cn(navItemClasses("inline", inSection), "cursor-pointer")}
              >
                {/* The line stays visible while the menu is open or when this is the current section; the chevron turns 180 degrees. */}
                <span className={navLabelClasses(inSection || isOpen)} {...caseProps}>{menu.label}</span>
                <ChevronDown aria-hidden="true" className={cn("transition duration-base", isOpen && "rotate-180")} />
              </button>
              {/* Kept right after its button in the page so Tab and screen readers find it naturally. */}
              <MegaMenuPanel
                menu={menu}
                panelId={panelId(menu.id)}
                open={isOpen}
                onKeyDown={(event) => onPanelKeyDown(menu.id, event)}
              />
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
