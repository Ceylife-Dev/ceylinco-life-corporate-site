"use client";

import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button, IconButton, cn } from "@/components/ui";
import { headerText, languages, links, type Language } from "@/content/navigation";
import { DesktopNav } from "./DesktopNav";
import { LanguageMenu } from "./LanguageMenu";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";
import { SearchButton, SearchOverlay } from "./SearchOverlay";
import { MENU_STATE_EVENT, TOGGLE_MENU_EVENT, useFocusTrap, useScrollLock } from "./hooks";

/**
 * The site header.
 *
 *   Wide screens:     ONE row, about 72px: logo | navigation with mega menus |
 *                     search, language, Customer login, Get a quote (pushed right)
 *   Below the "nav"   logo | search, language (768px and below: a compact 56px bar; the menu is opened from "More" in the bottom bar,
 *   breakpoint:       there is no menu button) or logo | Pay premium online, menu button (769px up). The menu opens full-screen.
 *                     The bottom bar (BottomNav) shows at 768px and below.
 *                     (breakpoints are set in src/styles/tokens.css)
 *
 * The header sticks to the top while scrolling and gets a grey shadow once the
 * page has scrolled. "Pay premium online" is the only filled button in it; "Get a quote" is the outlined one.
 */
export function Header() {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null); // the menu button (769px and up only)
  const closeRef = useRef<HTMLButtonElement>(null); // the menu's own close button (768px and below)
  const searchButtonRef = useRef<HTMLButtonElement>(null);
  const phoneSearchButtonRef = useRef<HTMLButtonElement>(null);
  // Focus goes back to whichever search button opened the search (the phone one or the desktop one).
  const searchReturnRef = useRef<HTMLButtonElement>(null);

  const [language, setLanguage] = useState<Language>(languages[0]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // The mobile menu remembers which page it was opened on, so going to another page closes it.
  const [mobileOpenAt, setMobileOpenAt] = useState<string | null>(null);
  const mobileOpen = mobileOpenAt === pathname;

  const closeSearch = useCallback(() => setSearchOpen(false), []);

  // The language choice sets the page language, which switches on the larger Sinhala and Tamil type.
  useEffect(() => {
    document.documentElement.lang = language.htmlLang;
  }, [language]);

  // A soft shadow appears once the page has scrolled.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The bottom bar's "More" button opens and closes the mobile menu.
  useEffect(() => {
    const toggle = () => setMobileOpenAt((current) => (current === pathname ? null : pathname));
    window.addEventListener(TOGGLE_MENU_EVENT, toggle);
    return () => window.removeEventListener(TOGGLE_MENU_EVENT, toggle);
  }, [pathname]);

  // Tell the bottom bar whether the menu is open (its "More" button shows the active state, and takes focus back when the menu closes).
  useEffect(() => {
    window.dispatchEvent(new CustomEvent(MENU_STATE_EVENT, { detail: { open: mobileOpen } }));
  }, [mobileOpen]);

  // Mobile menu: Esc closes it; growing the window past the "nav" breakpoint closes it too.
  useEffect(() => {
    if (!mobileOpen) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMobileOpenAt(null);
        hamburgerRef.current?.focus();
      }
    }
    function onResize() {
      // From the nav breakpoint (72rem, see tokens.css) the menu is not used any more.
      if (window.matchMedia("(min-width: 72rem)").matches) setMobileOpenAt(null);
    }
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
    };
  }, [mobileOpen]);

  useFocusTrap(headerRef, mobileOpen, hamburgerRef);
  useScrollLock(mobileOpen);

  // When the menu opens, keyboard focus starts on the close button (the menu button from 769px, the menu's own close button on phones),
  // then moves through the menu.
  useEffect(() => {
    if (!mobileOpen) return;
    const menuButtonShown = (hamburgerRef.current?.getClientRects().length ?? 0) > 0;
    (menuButtonShown ? hamburgerRef.current : closeRef.current)?.focus();
  }, [mobileOpen]);

  return (
    <>
      <a
        href="#main-content"
        className="sr-only rounded-control bg-surface px-4 py-3 font-semibold text-brand shadow-md focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-tooltip"
      >
        {headerText.skipToContent}
      </a>

      <header
        ref={headerRef}
        className={cn(
          "sticky top-0 z-sticky border-b border-border bg-surface pt-safe transition-shadow",
          scrolled && "shadow-md",
          // Open mobile menu: the header fills the screen; the bar stays put and only the menu scrolls.
          mobileOpen && "max-nav:flex max-nav:h-dvh max-nav:flex-col",
        )}
      >
        {/* The single bar (72px): logo, navigation, then the actions pushed to the right. The bar is wider than the page
            content (max-w-header) with the same 16px / 24px side padding, so the logo and the actions sit close to the screen
            edges. The navigation stays next to the logo; the actions are pushed to the right, with at least 48px (from xl)
            between the two groups. */}
        <div className="relative mx-auto flex w-full max-w-header shrink-0 items-center gap-3 px-4 py-2 max-bar:h-header-row max-bar:py-0 md:px-6 nav:gap-6">
          <Logo />

          <div className="hidden nav:block">
            <DesktopNav />
          </div>

          <div className="ml-auto flex items-center gap-2 xl:pl-12">
            {/* Desktop actions. Customer login and Get a quote are both 44px / 14px / 12px radius. */}
            <div className="hidden items-center gap-2 nav:flex">
              <SearchButton
                buttonRef={searchButtonRef}
                onClick={() => {
                  searchReturnRef.current = searchButtonRef.current;
                  setSearchOpen(true);
                }}
              />
              <LanguageMenu value={language} onChange={setLanguage} />
              <Button variant="secondary" size="sm" href={links.getQuote}>
                {headerText.getQuote}
              </Button>
              <Button size="sm" href={links.customerPortal}>
                {headerText.payPremiumOnline}
              </Button>
            </div>

            {/* Phones (768px and below): just search and language, each with a 44px tap target. Pay premium and the menu are in the bottom bar. */}
            <div className="flex items-center gap-2 bar:hidden">
              <SearchButton
                buttonRef={phoneSearchButtonRef}
                onClick={() => {
                  searchReturnRef.current = phoneSearchButtonRef.current;
                  setSearchOpen(true);
                }}
              />
              <LanguageMenu value={language} onChange={setLanguage} />
            </div>

            {/* Tablets (769px to the nav breakpoint): the filled button ("Pay premium online"); there is no bottom bar here. */}
            <div className="hidden bar:block nav:hidden">
              <Button href={links.customerPortal}>{headerText.payPremiumOnline}</Button>
            </div>
            {/* Tablets (769px to the nav breakpoint): the menu button. It does not exist on phones (the bottom bar's "More" opens the menu there). */}
            <div className="hidden bar:block nav:hidden">
              <IconButton
                ref={hamburgerRef}
                size="lg"
                label={headerText.menuButton}
                icon={mobileOpen ? <X /> : <Menu />}
                aria-expanded={mobileOpen}
                aria-controls="mobile-menu"
                onClick={() => setMobileOpenAt(mobileOpen ? null : pathname)}
              />
            </div>
          </div>
        </div>

        <MobileMenu
          open={mobileOpen}
          language={language}
          onLanguageChange={setLanguage}
          closeRef={closeRef}
          onClose={() => setMobileOpenAt(null)}
        />
      </header>

      <SearchOverlay open={searchOpen} onClose={closeSearch} returnFocusRef={searchReturnRef} />
    </>
  );
}
