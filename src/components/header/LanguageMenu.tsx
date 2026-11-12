"use client";

import { Check, ChevronDown } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { cn, navItemClasses, navLabelClasses } from "@/components/ui";
import { headerText, languages, type Language } from "@/content/navigation";

/**
 * Compact language selector for the header row: a short code (EN) with a chevron.
 * Opens a small menu. Arrow keys move, Enter or Space chooses, Esc closes.
 */
export function LanguageMenu({ value, onChange }: { value: Language; onChange: (language: Language) => void }) {
  const [open, setOpen] = useState(false);
  // The header has two copies (phone and desktop); only one is shown, but ids must stay unique.
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);

  const items = () => Array.from(menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitemradio"]') ?? []);

  // Esc closes, and so does a click outside.
  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  // When opened, focus the current language.
  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => {
      const list = items();
      (list.find((item) => item.getAttribute("aria-checked") === "true") ?? list[0])?.focus();
    });
    return () => cancelAnimationFrame(frame);
  }, [open]);

  function onMenuKeyDown(event: React.KeyboardEvent) {
    const list = items();
    const index = list.indexOf(document.activeElement as HTMLElement);
    const move = (target: number) => {
      event.preventDefault();
      list[(target + list.length) % list.length]?.focus();
    };
    if (event.key === "ArrowDown") move(index + 1);
    else if (event.key === "ArrowUp") move(index - 1);
    else if (event.key === "Home") move(0);
    else if (event.key === "End") move(list.length - 1);
  }

  return (
    <div
      ref={rootRef}
      className="relative"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={`${value.code}, ${headerText.changeLanguage}`}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" && !open) {
            event.preventDefault();
            setOpen(true);
          }
        }}
        className={cn(navItemClasses("inline", false), "cursor-pointer")}
      >
        <span className={navLabelClasses(open)}>{value.code}</span>
        <ChevronDown aria-hidden="true" className={cn("transition duration-base", open && "rotate-180")} />
      </button>

      <ul
        ref={menuRef}
        id={menuId}
        role="menu"
        aria-label={headerText.languageLabel}
        onKeyDown={onMenuKeyDown}
        className={cn(
          "absolute top-full right-0 z-dropdown mt-2 w-max min-w-44 rounded-container border border-border bg-surface p-2 shadow-lg",
          "transition-[opacity,visibility] duration-base",
          open ? "visible opacity-100" : "invisible opacity-0",
        )}
      >
        {languages.map((language) => {
          const selected = language.code === value.code;
          return (
            <li key={language.code} role="none">
              <button
                type="button"
                role="menuitemradio"
                aria-checked={selected}
                lang={language.htmlLang}
                onClick={() => {
                  onChange(language);
                  setOpen(false);
                  buttonRef.current?.focus();
                }}
                className={cn(
                  "flex min-h-touch w-full cursor-pointer items-center gap-3 rounded-control px-3 text-left text-base transition",
                  "hover:bg-brand-tint hover:text-brand focus-visible:bg-brand-tint active:bg-brand-tint-strong",
                  selected ? "font-semibold text-brand" : "font-medium text-ink",
                )}
              >
                <span className="w-7 text-sm">{language.code}</span>
                <span className="flex-1">{language.name}</span>
                {selected && <Check aria-hidden="true" className="size-4 shrink-0" />}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
