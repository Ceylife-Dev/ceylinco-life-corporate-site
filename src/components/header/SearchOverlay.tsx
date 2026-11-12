"use client";

import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type RefObject } from "react";
import { IconButton, Input } from "@/components/ui";
import { headerText, links } from "@/content/navigation";
import { useFocusTrap, useScrollLock } from "./hooks";

/**
 * Search overlay opened from the header's search button.
 * Esc or a click on the dim area closes it, Tab stays inside it, and focus goes
 * back to the search button when it closes. Enter goes to the search page.
 */
export function SearchOverlay({
  open,
  onClose,
  returnFocusRef,
}: {
  open: boolean;
  onClose: () => void;
  returnFocusRef: RefObject<HTMLElement | null>;
}) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");

  useFocusTrap(dialogRef, open, returnFocusRef);
  useScrollLock(open);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    onClose();
    router.push(`${links.search}?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <div
      className="fixed inset-0 z-overlay flex items-start justify-center bg-scrim px-4 pt-4 md:pt-24"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose(); // click on the dim area
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={headerText.searchTitle}
        className="w-full max-w-prose rounded-container bg-surface p-4 shadow-lg md:p-6"
      >
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-xl">{headerText.searchTitle}</h2>
          <IconButton label={headerText.closeSearch} icon={<X />} variant="subtle" onClick={onClose} />
        </div>

        <form role="search" onSubmit={onSubmit}>
          <Input
            type="search"
            name="q"
            label={headerText.searchLabel}
            help={headerText.searchHelp}
            placeholder={headerText.searchPlaceholder}
            enterKeyHint="search"
            autoComplete="off"
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </form>
      </div>
    </div>
  );
}

/** The search icon button for the header row. */
export function SearchButton({
  onClick,
  buttonRef,
}: {
  onClick: () => void;
  buttonRef: RefObject<HTMLButtonElement | null>;
}) {
  return (
    <IconButton
      ref={buttonRef}
      label={headerText.search}
      icon={<Search />}
      aria-haspopup="dialog"
      showTooltip
      onClick={onClick}
    />
  );
}
