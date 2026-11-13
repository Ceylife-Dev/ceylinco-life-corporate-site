import type { LucideIcon } from "lucide-react";
import { cn } from "./cn";
import { Reveal } from "./Reveal";
import { caseProps } from "@/lib/case";

export type StepperItem = { title: string; text?: string; icon: LucideIcon };

type StepperProps = {
  items: StepperItem[];
  /** Columns on desktop. 4 columns become 2x2 on tablet; 3 columns stay 3. Phones always stack. */
  columns?: 3 | 4;
  /**
   * card = every step sits in its own white 24px card (use on an off-white section).
   * plain = no card, steps side by side with the line across (use inside a card that is already white).
   * rows = no card, the steps stacked as rows (icon tile beside the text) joined by a dotted vertical line at every
   *        screen size. Not used on the home page at the moment.
   * timeline = one connected timeline, no cards. From lg: four equal columns with everything centred (icon tile, large
   *        maroon number, title, description up to 240px wide) and ONE dotted line behind the tiles, from the centre of
   *        the first to the centre of the last. Below lg: stacked, left-aligned rows with the line down the left.
   */
  look?: "card" | "plain" | "rows" | "timeline";
  /** Icon tile colour: tint (soft pink, default) or surface (white with a 1px border, for use on a pink section). */
  tile?: "tint" | "surface";
  /** Layout only. */
  className?: string;
};

// Written out in full so Tailwind can find each class.
const gridClasses: Record<3 | 4, string> = {
  3: "md:grid md:grid-cols-3",
  4: "md:grid md:grid-cols-2 lg:grid-cols-4",
};

/**
 * Where the dotted line is hidden: after the last step, and (for four steps in two columns) after the second
 * step, so the line never runs off a row.
 */
const lineHidden: Record<3 | 4, string> = {
  3: "group-last:hidden",
  4: "group-last:hidden md:max-lg:group-even:hidden",
};

/*
 * The dotted line runs from the centre of one icon tile to the centre of the next. It sits above the cards (z-raised,
 * so the next card's white background does not hide it) and below the tiles (they come later in the markup and have
 * z-raised too). The offsets are: padding + half a tile (28px), and the gap between steps.
 *   card:  phone p-6 -> centre 52px, gap 16px; tablet and up p-8 -> centre 60px, gap 24px
 *   plain: no padding -> centre 28px, gap 32px
 */
const lineClasses = {
  card:
    // phone: vertical line down the left, through the tiles
    "absolute top-13 left-13 -bottom-17 w-0 border-l-2 border-dotted border-border-strong " +
    // tablet and up: horizontal line through the tiles
    "md:top-15 md:left-15 md:-right-21 md:bottom-auto md:h-0 md:w-auto md:border-t-2 md:border-l-0",
  plain:
    "absolute top-7 left-7 -bottom-15 w-0 border-l-2 border-dotted border-border-strong " +
    "md:-right-15 md:bottom-auto md:h-0 md:w-auto md:border-t-2 md:border-l-0",
  // rows: the same vertical line as a phone, at every size (centre 28px, gap 32px)
  rows: "absolute top-7 left-7 -bottom-15 w-0 border-l-2 border-dotted border-border-strong",
  // timeline: a vertical line down the left below lg (centre 28px, gap 32px). From lg this per-step line is hidden and
  // one line for the whole row is drawn instead (see `timelineRowLine`).
  // (a clipping track: the dotted line inside slides down into place as the step scrolls into view)
  timeline: "absolute top-7 left-7 -bottom-15 w-0.5 overflow-hidden lg:hidden",
};

// The timeline's single connector from lg: a clipping track across the row at the tile centres (28px down), from the centre
// of the first of four equal columns (1/8 of the width) to the centre of the last (1/8 from the right), placed just before
// the list. The tiles sit on top of it (they have a solid background and z-raised). Its dotted line slides in from the left
// when the row scrolls into view (Reveal variant="draw").
const timelineRowTrack = "absolute top-7 right-1/8 left-1/8 hidden h-0.5 overflow-hidden lg:block";

/**
 * A numbered stepper. Each step has a 56px soft pink icon tile (maroon icon) with a small number badge (a maroon circle with a
 * white number) overlapping its top-right corner, a title and a short description. A thin dotted line joins the
 * tiles: across on desktop, 2x2 on tablet, down the left on phones. Steps fade up one after another as they scroll
 * into view (see Reveal).
 *
 * It is a real ordered list (`role="list"` keeps the list semantics for VoiceOver when the list style is removed), so screen readers announce
 * "list, 4 items" and "1 of 4" and so on. The numbers (the badge, and the timeline's large number) are plain `<span>`s, never headings or paragraphs, and are
 * `aria-hidden` for that reason. Each step reads once: title (h3), then description. The icons and the dotted connector lines are decorative (`aria-hidden`).
 */
export function Stepper({ items, columns = 4, look = "card", tile = "tint", className }: StepperProps) {
  const list = (
    <ol
      role="list"
      className={cn(
        "relative flex flex-col",
        look === "card" ? "gap-4 md:gap-6" : "gap-8",
        look === "timeline" ? "lg:grid lg:grid-cols-4 lg:gap-8" : look !== "rows" && gridClasses[columns],
        look !== "timeline" && className,
      )}
    >
      {items.map((item, index) => {
        const Icon = item.icon;
        return (
          <Reveal
            key={item.title}
            as="li"
            className={cn(
              "group relative flex gap-4",
              look === "timeline" ? "lg:flex-col lg:items-center lg:text-center" : look !== "rows" && "md:flex-col",
              look === "card" && "rounded-container border border-border bg-surface p-6 shadow-md md:p-8",
            )}
          >
            {look === "timeline" ? (
              <Reveal as="span" variant="draw" className={cn(lineClasses.timeline, "group-last:hidden z-raised")}>
                <span aria-hidden="true" className="reveal-draw-y block h-full w-0 border-l-2 border-dotted border-border-strong" />
              </Reveal>
            ) : (
              <span
                aria-hidden="true"
                className={cn(lineClasses[look], look === "rows" ? "group-last:hidden" : lineHidden[columns], "z-raised")}
              />
            )}
            {/* The tile is 12px inside a 24px card, so the curves stay concentric. */}
            <span className={cn("relative z-raised flex size-14 shrink-0 items-center justify-center rounded-control text-brand",
              tile === "tint" ? "bg-brand-tint" : "border border-border bg-surface",
            )}>
              <Icon aria-hidden="true" className="size-7" />
              {look !== "timeline" && (
                <span
                  aria-hidden="true"
                  className="absolute -top-2 -right-2 flex size-6 items-center justify-center rounded-full bg-brand text-sm font-bold text-ink-on-brand"
                >
                  {index + 1}
                </span>
              )}
            </span>
            <div className={look === "rows" ? "pt-1" : look === "timeline" ? "lg:max-w-60 lg:pt-2" : "pt-1 md:pt-0"}>
              {/* The timeline's large maroon number: a decorative <span> (hidden from screen readers: the ordered list already numbers the steps; not a heading or a paragraph). */}
              {look === "timeline" && (
                <span aria-hidden="true" className="block text-3xl leading-none font-bold text-brand tabular-nums">
                  {index + 1}
                </span>
              )}
              <h3 {...caseProps} className={cn("text-lg font-semibold md:text-lg", look === "timeline" && "mt-2")}>{item.title}</h3>
              {item.text && <p className="mt-1 text-base text-ink-muted">{item.text}</p>}
            </div>
          </Reveal>
        );
      })}
    </ol>
  );
  if (look !== "timeline") return list;
  return (
    <div className={cn("relative", className)}>
      <Reveal as="span" variant="draw" className={timelineRowTrack}>
        <span aria-hidden="true" className="reveal-draw-x block h-0.5 w-full border-t-2 border-dotted border-border-strong" />
      </Reveal>
      {list}
    </div>
  );
}
