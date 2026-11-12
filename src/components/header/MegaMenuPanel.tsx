"use client";

import { ArrowRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { AppLink, Button, TextLink, cn, isCurrentPath } from "@/components/ui";
import type { MegaMenu, MenuGroup, MenuItem } from "@/content/navigation";
import { caseProps } from "@/lib/case";

/**
 * One row inside a menu: icon, title and a one-line description.
 * 12px radius (it sits inside a 24px panel) and a soft pink (brand-tint) hover (the title turns maroon).
 */
export function MegaMenuItem({ item }: { item: MenuItem }) {
  const pathname = usePathname();
  const current = isCurrentPath(pathname, item.href, true);
  const Icon = item.icon;

  return (
    <AppLink
      href={item.href}
      aria-current={current ? "page" : undefined}
      className={cn(
        "group flex min-h-touch items-start gap-4 rounded-control p-3 transition",
        current ? "bg-brand-tint" : "hover:bg-brand-tint focus-visible:bg-brand-tint active:bg-brand-tint-strong",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "flex size-11 shrink-0 items-center justify-center rounded-control text-brand transition",
          current ? "bg-surface" : "bg-brand-tint group-hover:bg-surface group-focus-visible:bg-surface group-active:bg-surface",
        )}
      >
        <Icon className="size-5" />
      </span>
      <span className="flex flex-col">
        <span {...caseProps} className={cn("text-base font-semibold", current ? "text-brand" : "text-ink group-hover:text-brand group-focus-visible:text-brand group-active:text-brand")}>
          {item.title}
        </span>
        <span className="text-sm text-ink-muted">{item.description}</span>
      </span>
    </AppLink>
  );
}

/** A list of items, optionally under a small non-clickable subheading. */
export function MegaMenuGroup({
  group,
  idPrefix,
  columns,
}: {
  group: MenuGroup;
  idPrefix: string;
  columns: 1 | 2;
}) {
  const headingId = group.heading ? `${idPrefix}-heading` : undefined;
  return (
    <div className="flex flex-col">
      {group.heading && (
        <p id={headingId} {...caseProps} className="px-3 pb-2 text-sm font-semibold text-ink-muted">
          {group.heading}
        </p>
      )}
      <ul aria-labelledby={headingId} className={cn("grid gap-1", columns === 2 && "grid-cols-2")}>
        {group.items.map((item) => (
          <li key={item.href}>
            <MegaMenuItem item={item} />
          </li>
        ))}
      </ul>
      {/* An optional text link at the bottom of the group (for example "All Life Rewards"). */}
      {group.link && (
        <div className="mt-auto pt-2">
          <TextLink size="sm" href={group.link.href} iconEnd={<ArrowRight />} className="ml-1">
            {group.link.title}
          </TextLink>
        </div>
      )}
    </div>
  );
}

/** The optional strip at the bottom of a panel (for example "Buy online"). */
export function MegaMenuFooter({ link }: { link: NonNullable<MegaMenu["footerLink"]> }) {
  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 rounded-control bg-surface-alt py-1 pr-2 pl-4">
      <p className="text-sm text-ink-muted">{link.description}</p>
      <Button variant="tertiary" size="sm" href={link.href} iconEnd={<ArrowRight />}>
        {link.title}
      </Button>
    </div>
  );
}

/**
 * The desktop panel. It is always in the page (so aria-controls works) and is
 * hidden and faded until `open`. It is centred under the header.
 */
export function MegaMenuPanel({
  menu,
  panelId,
  open,
  onKeyDown,
}: {
  menu: MegaMenu;
  panelId: string;
  open: boolean;
  onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => void;
}) {
  const multiGroup = menu.groups.length > 1;
  // One column per group (a single list is shown in two columns). Written out in full so Tailwind finds each class.
  const columnClasses: Record<number, string> = { 1: "grid-cols-1", 2: "grid-cols-2", 3: "grid-cols-3" };

  return (
    <div
      id={panelId}
      onKeyDown={onKeyDown}
      className={cn(
        "absolute top-full left-1/2 z-dropdown w-full max-w-menu -translate-x-1/2 pt-3",
        "transition-[opacity,visibility] duration-base",
        open ? "visible opacity-100" : "invisible opacity-0",
      )}
    >
      {/* The pt-3 above is an invisible bridge so the pointer can travel from the menu button to the panel. */}
      <div className="rounded-container border border-border bg-surface p-4 shadow-lg md:p-6">
        <div className={cn("grid gap-x-6 gap-y-2", columnClasses[menu.groups.length] ?? "grid-cols-3")}>
          {menu.groups.map((group, index) => (
            <MegaMenuGroup
              key={group.heading ?? index}
              group={group}
              idPrefix={`${panelId}-${index}`}
              columns={multiGroup ? 1 : 2}
            />
          ))}
        </div>
        {menu.footerLink && <MegaMenuFooter link={menu.footerLink} />}
      </div>
    </div>
  );
}
