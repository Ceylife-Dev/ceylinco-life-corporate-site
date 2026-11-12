"use client";

import { ChevronDown, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState, useSyncExternalStore, type RefObject } from "react";
import { Button, IconButton, NavLink, Select, cn, isCurrentPath, navItemClasses } from "@/components/ui";
import { headerText, languages, links, mainNav, type Language } from "@/content/navigation";
import { caseProps } from "@/lib/case";
import { MegaMenuGroup } from "./MegaMenuPanel";

/** Phones and small tablets: 768px and below (--breakpoint-bar is 769px). Not rendered on the server, so the first client render is the tablet layout; the menu is closed then. */
const PHONE_QUERY = "(max-width: 48rem)";
function subscribePhone(onChange: () => void) {
  const query = window.matchMedia(PHONE_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}
const usePhone = () => useSyncExternalStore(subscribePhone, () => window.matchMedia(PHONE_QUERY).matches, () => false);

/**
 * The menu shown below the "nav" breakpoint. On phones (768px and below, opened from "More" in the bottom bar) the order is: its own
 * close button, the navigation, then the two buttons (Pay premium online, Get a quote) at the end of the scrolling content. There is no language
 * control on phones: the header has it. From 769px (opened from the header's menu button) the order is: Get a quote, language, the navigation.
 * Search is in the header bar, not here. Each mega menu becomes an accordion; Home, Contact Us and Careers are plain rows.
 */
export function MobileMenu({
  open,
  language,
  onLanguageChange,
  closeRef,
  onClose,
}: {
  open: boolean;
  language: Language;
  onLanguageChange: (language: Language) => void;
  /** The menu's own close button (768px and below, where there is no menu button in the header). */
  closeRef: RefObject<HTMLButtonElement | null>;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const phone = usePhone();
  const [expanded, setExpanded] = useState<string[]>([]);

  const toggle = (id: string) =>
    setExpanded((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));

  return (
    <div
      id="mobile-menu"
      className={cn(
        "min-h-0 flex-1 overflow-y-auto border-t border-border bg-surface px-4 pt-4 pb-above-bar bar:pb-8 md:px-6 nav:hidden",
        !open && "hidden",
      )}
    >
      <div className="mx-auto flex max-w-prose flex-col gap-6">
        {/* The menu's own close button (768px and below). The menu stays above the bottom bar, whose "More" button shows it is open. */}
        <div className="-mb-2 flex justify-end bar:hidden">
          <IconButton ref={closeRef} label={headerText.closeMenu} icon={<X />} onClick={onClose} />
        </div>

        {/* From 769px: Get a quote, then the language (the header has no language control at these widths). Not on phones. */}
        {!phone && (
          <>
            <Button variant="secondary" fullWidth href={links.getQuote}>
              {headerText.getQuote}
            </Button>
            <Select
              label={headerText.languageLabel}
              value={language.code}
              onChange={(event) => {
                const next = languages.find((item) => item.code === event.target.value);
                if (next) onLanguageChange(next);
              }}
            >
              {languages.map((item) => (
                <option key={item.code} value={item.code} lang={item.htmlLang}>
                  {item.code} - {item.name}
                </option>
              ))}
            </Select>
          </>
        )}

        {/* 3. Navigation: plain rows and one accordion per mega menu */}
        <nav aria-label={headerText.mainNavLabel}>
          <ul className="flex flex-col gap-1">
            {mainNav.map((entry) => {
              if (entry.kind === "link") {
                return (
                  <li key={entry.href}>
                    <NavLink variant="block" href={entry.href}>
                      {entry.label}
                    </NavLink>
                  </li>
                );
              }

              const { menu } = entry;
              const isExpanded = expanded.includes(menu.id);
              const inSection = isCurrentPath(pathname, menu.basePath);
              const triggerId = `mobile-trigger-${menu.id}`;
              const panelId = `mobile-panel-${menu.id}`;
              return (
                <li key={menu.id}>
                  <button
                    type="button"
                    id={triggerId}
                    aria-expanded={isExpanded}
                    aria-controls={panelId}
                    aria-current={inSection ? "true" : undefined}
                    onClick={() => toggle(menu.id)}
                    className={cn(navItemClasses("block", inSection), "cursor-pointer justify-between")}
                  >
                    <span {...caseProps}>{menu.label}</span>
                    <ChevronDown aria-hidden="true" className={cn("transition", isExpanded && "rotate-180")} />
                  </button>
                  <div id={panelId} role="region" aria-labelledby={triggerId} className={cn("pt-1 pb-2", !isExpanded && "hidden")}>
                    <div className="flex flex-col gap-3">
                      {menu.groups.map((group, index) => (
                        <MegaMenuGroup key={group.heading ?? index} group={group} idPrefix={`${panelId}-${index}`} columns={1} />
                      ))}
                    </div>
                    {menu.footerLink && (
                      <div className="mt-2">
                        <Button variant="tertiary" href={menu.footerLink.href}>
                          {menu.footerLink.title}
                        </Button>
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Phones: the two buttons after the menu sections, full width, the same height, 12px apart (primary, then outline). */}
        {phone && (
          <div className="flex flex-col gap-3">
            <Button fullWidth href={links.customerPortal}>
              {headerText.payPremiumOnline}
            </Button>
            <Button variant="secondary" fullWidth href={links.getQuote}>
              {headerText.getQuote}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
