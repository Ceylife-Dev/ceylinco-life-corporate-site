"use client";

import { Minus, Plus } from "lucide-react";
import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "./cn";

export type AccordionItem = {
  /** Unique within this accordion. */
  id: string;
  /** The question or heading that opens the item. */
  title: string;
  content: ReactNode;
  /** Optional icon element (for example <ShieldCheck />; it is sized for you), shown in a 44px tile before the question. The answer lines up with the question text. */
  icon?: ReactNode;
};

type AccordionProps = {
  items: AccordionItem[];
  /** Ids of items that start open. Default: all closed. */
  defaultOpen?: string[];
  /** Layout only. */
  className?: string;
};

/**
 * Accessible accordion (WAI-ARIA "accordion" pattern), drawn as ONE white 24px card with 1px dividers
 * between the items.
 *
 * Each row: an optional 44px icon tile (12px radius, surface-alt, maroon outline icon), the question (18px semibold) and
 * a 32px round plus / minus toggle on the right, all vertically centred. Hovering a row, or opening it, gives it the
 * surface-alt background. The OPEN row turns the tile maroon with a white icon, the question maroon, and the toggle a
 * maroon circle with a white minus (the plus rotates into the minus). The answer is 16px muted text indented to line up
 * with the question. The panel opens and closes with a smooth 200ms height change (instant for reduced motion).
 *
 * Mouse and touch: click a heading to open or close it. Any number can be open.
 * Keyboard: Tab to a heading, Enter or Space toggles it, Arrow Down/Up move
 * between headings, Home/End jump to the first/last.
 * Screen readers: each heading is a button with aria-expanded and aria-controls,
 * and each panel is a labelled region. A closed panel is inert, so its text is skipped.
 */
export function Accordion({ items, defaultOpen = [], className }: AccordionProps) {
  const baseId = useId();
  const [open, setOpen] = useState<string[]>(defaultOpen);
  const buttons = useRef<Array<HTMLButtonElement | null>>([]);

  const toggle = (id: string) =>
    setOpen((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const last = items.length - 1;
    const targets: Record<string, number> = {
      ArrowDown: index === last ? 0 : index + 1,
      ArrowUp: index === 0 ? last : index - 1,
      Home: 0,
      End: last,
    };
    if (event.key in targets) {
      event.preventDefault();
      buttons.current[targets[event.key]]?.focus();
    }
  }

  return (
    // The card is 24px; each row inside is 12px so the curves stay concentric.
    <div className={cn("rounded-container border border-border bg-surface p-2 text-ink shadow-sm", className)}>
      {items.map((item, index) => {
        const isOpen = open.includes(item.id);
        const buttonId = `${baseId}-button-${item.id}`;
        const panelId = `${baseId}-panel-${item.id}`;
        const Icon = item.icon;
        return (
          <div
            key={item.id}
            className={cn(
              "rounded-control border-b transition last:border-b-0",
              isOpen ? "border-transparent bg-surface-alt" : "border-border",
            )}
          >
            <h3 className="text-lg font-semibold md:text-lg">
              <button
                ref={(element) => {
                  buttons.current[index] = element;
                }}
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
                onKeyDown={(event) => onKeyDown(event, index)}
                className={cn(
                  "group flex min-h-touch w-full cursor-pointer items-center gap-4 rounded-control px-6 py-5 text-left transition",
                  isOpen ? "text-brand" : "text-ink hover:bg-surface-alt focus-visible:bg-surface-alt active:bg-surface-alt",
                )}
              >
                {Icon && (
                  <span
                    aria-hidden="true"
                    className={cn(
                      "flex size-11 shrink-0 items-center justify-center rounded-control transition [&_svg]:size-5.5",
                      isOpen ? "bg-brand text-ink-on-brand" : "bg-surface-alt text-brand group-hover:bg-surface group-focus-visible:bg-surface group-active:bg-surface",
                    )}
                  >
                    {Icon}
                  </span>
                )}
                <span className="min-w-0 flex-1">{item.title}</span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "relative flex size-8 shrink-0 items-center justify-center rounded-full transition",
                    isOpen ? "bg-brand text-ink-on-brand" : "bg-brand-tint text-brand group-hover:bg-brand-tint-strong group-focus-visible:bg-brand-tint-strong group-active:bg-brand-tint-strong",
                  )}
                >
                  {/* The plus turns a quarter and fades out while the minus fades in (no movement for reduced motion). */}
                  <Plus
                    className={cn(
                      "absolute size-4 motion-safe:transition-transform",
                      isOpen ? "opacity-0 motion-safe:rotate-90" : "opacity-100",
                    )}
                  />
                  <Minus className={cn("absolute size-4", isOpen ? "opacity-100" : "opacity-0")} />
                </span>
              </button>
            </h3>
            <div id={panelId} role="region" aria-labelledby={buttonId} inert={!isOpen} className={cn("accordion-panel", isOpen && "accordion-panel-open")}>
              <div className="min-h-0 overflow-hidden">
                {/* 24px row padding + the 44px tile + the 16px gap = the question's left edge, so the answer lines up with it. */}
                <div className={cn("pr-6 pb-5 text-base text-ink-muted", Icon ? "pl-21" : "pl-6")}>{item.content}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
