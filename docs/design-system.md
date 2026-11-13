# Design system

Warm, modern, friendly and trustworthy. The site is for an insurance and
financial protection company (life, retirement, medical, investment and group
plans, and possibly more), never described as only a life insurance company.
Written for designers, developers and AI assistants. The rules summary is in
`CLAUDE.md`; the values are in `src/styles/tokens.css`.

**How it works:** every value is a design token (a CSS custom property). Tailwind
turns each token into a class, so `--color-brand` becomes `bg-brand`,
`text-brand`, `border-brand`. Components use only those classes. To change the
look of the whole site, change a token.

## 1. Colour

| Token | Hex | Use it for | Don't |
|---|---|---|---|
| `brand` | #790011 | Primary button, active nav item, focus ring, small accents (icons, links) | Large full-width blocks, section backgrounds |
| `brand-hover` | #66000E | Hover of primary button and links | |
| `brand-pressed` | #55000C | Pressed of primary button and links | |
| `brand-tint` | #FBEEF0 | Soft pink (restored at the designer's request): icon and step tiles, advisor card, chips, hover background of menu items, nav items and outlined buttons, the circular card arrow on hover, the accordion toggle | Body text background |
| `brand-tint-strong` | #F4D9DD | Pressed background, text selection, border of pink cards, the soft resting line under text links, and the "+" text accent on dark sections | |
| `ink` | #2A2A2E | Body text, headings, icons | Never swap for black |
| `ink-muted` | #5F5B60 | Secondary text, help text, placeholders | Disabled labels |
| `ink-on-brand` | #FFFFFF | Text on filled maroon, tooltip text | |
| `surface-alt` | #F6F3F1 | The hover, selected and open-row background of list items, menu items, outlined buttons and FAQ rows, and the icon tile on a white FAQ row (the title turns maroon). Replaced the old off-white `background` token | Text on it must stay 4.5:1 |
| `surface-section` | #FBFAF9 | The alternate full-width section background (`Section tone="alt"`): how it works, testimonials, app, final call-to-action. Added from the Figma frame (it used a raw #FBFAF9) | Text on it must stay 4.5:1 |
| `surface-cream` | #FFFBF2 | A warm callout fill: the slim quick-link row, the advisor card and the FAQ contact strip. Added from the Figma frame (it used a raw #FFFBF2) | Large section backgrounds |
| `surface` | #FFFFFF | Cards, panels, header, inputs | |
| `surface-sunken` | #F3F0F1 | Disabled fields, neutral tags, subtle wells | |
| `border` | #E3E1E4 | Card edges, dividers (decorative, 1.3:1) | Input/select/button boundaries |
| `border-strong` | #857F86 | Input, select, icon-button outline boundaries (3.9:1) | Decorative dividers (too heavy) |
| `success` / `success-tint` | #1E6B47 / #E6F3EC | Confirmations, approved states | Colour alone |
| `warning` / `warning-tint` | #874F00 / #FFF2D6 | Pending, needs attention | Colour alone |
| `error` / `error-tint` | #B42318 / #FCEBE9 | Errors, declined | Colour alone |
| `scrim` | warm grey, 45% | Dim layer behind overlays | |
| `on-brand-hover` / `on-brand-pressed` | white at 12% / 20% | Hover and pressed tint of outlined controls on the maroon call-to-action card | |
| `footer-bg` | #1F1D21 | Dark footer background (warm near-black) | Pure black; use anywhere but the footer |
| `footer-text` | #F3F1F2 | Footer headings, hovered links, focus ring | |
| `footer-muted` | #B9B5BA | Footer links, body text and icons | Headings |
| `footer-border` | white at 12% | Footer dividers and social icon outlines | Text |

Status colours are close to the brand hue, so **always add an icon or words**.
`border` is below 3:1 on purpose: it is for decoration. Anything that marks the
edge of a control uses `border-strong`.

Contrast: run `npm run check:contrast`. It tests every pairing used by the
components and fails if any drops below AA.

**Hero scrim tokens.** `scrim-hero-strong` / `medium` / `faint` / `clear` (desktop, left to right at 0 / 45 / 72 / 100%)
and `scrim-hero-top` / `mid` / `clear` (below lg, top to bottom at 0 / 55 / 78%) are the footer's warm
near-black (#1F1D21) at 90 / 80 / 30 / 0% and 90 / 85 / 0%. They were raised from the first values (82 / 62 / 15% and
88 / 55%) because white text failed 4.5:1 on the bright sunset. Other hero tokens: `--size-hero-min` 560px,
`--size-hero-max` 880px, `--size-header` (65px phones, 73px from 1152px), `--hero-position` 55% 75%,
`--hero-position-mobile` 57% 80%, `--container-hero` 640px, `--container-hero-support` 52ch, and the
`text-shadow-hero` shadow (0 2px 16px at 35% of #1F1D21).

## 2. Typography

Typeface: **Plus Jakarta Sans** (400, 500, 600, 700). Sinhala and Tamil fall
back to Noto Sans Sinhala / Noto Sans Tamil (loaded only when needed).

| Class | Size | Line height | Tracking | Typical use |
|---|---|---|---|---|
| `text-sm` | 14px | 1.55 | normal | Help text, tags, captions |
| `text-base` | 16px | 1.55 | normal | UI text, nav, buttons, body on phones |
| `text-lg` | 18px | 1.55 | normal | Body from tablet up, lead paragraphs |
| `text-xl` | 24px | 1.3 | normal | Small headings |
| `text-2xl` | 32px | 1.3 | -1% | Section headings |
| `text-3xl` | 44px | 1.2 | -2% | Page headings (tablet+) |
| `text-4xl` | 56px | 1.2 | -2% | Hero headings (desktop) |

- `h1` to `h4` already have sensible responsive sizes in `globals.css`.
- Headings are SemiBold or Bold; body is Regular; UI labels Medium or SemiBold.
- Sizes are `rem`, so they follow the visitor's browser font setting.
- **Sinhala and Tamil** (`<html lang="si">` / `"ta"`): text is 6.25% larger,
  line height rises to about 1.8 (body) and 1.45 (headings), negative
  letter spacing is removed.
- Keep reading lines under about 75 characters (`max-w-prose`).

## 3. Spacing and layout

4px base unit. `1` = 4px, `2` = 8px, `3` = 12px, `4` = 16px, `5` = 20px, `6` = 24px,
`8` = 32px, `10` = 40px, `12` = 48px, `16` = 64px. Use generous space; when unsure
go one step up.

- Page width: `max-w-page` (1200px). Header bar width: `max-w-header` (1600px, new token `--container-header`), so the header's logo and actions sit closer to the screen edges than the page content, with the same 16px / 24px side padding. Reading width: `max-w-prose`. Mega menu panel: `max-w-menu` (1056px, the same for every menu).
- Page side padding: `px-4` on phones, `md:px-6` from tablet.
- Minimum tap target: `min-h-touch` / `min-w-touch` (44px).
- Breakpoints: `md` 768, `lg` 1024, `nav` 1152 (the one-row header switches to the hamburger below this), `xl` 1280.

## 4. Radius

| Class | Value | For |
|---|---|---|
| `rounded-control` | 12px | Buttons, inputs, selects, tags, tooltips, **anything inside a card or panel** |
| `rounded-container` | 24px | Cards, panels, mega menu panel |
| `rounded-full` | circle | **Only** these: the Stepper's number badges, the round icon tiles in the advisor and help cards, the FAQ plus / minus toggle, the 56px help circle above the FAQ heading, the pink phone circle in the FAQ strip, the circular arrow on the product cards, the large decorative circle behind the app phone, and the footer social icon buttons. Nothing else is a circle |

Rule of thumb: a container's radius minus its padding should roughly equal the
radius of what sits inside, so 24px outside and 12px inside look concentric.

## 5. Shadow

| Class | Value | For |
|---|---|---|
| `shadow-sm` | 0 1px 2px, 10% grey | Cards at rest, primary button |
| `shadow-md` | 0 4px 12px, 10% grey | Hover on cards and buttons, tooltips |
| `shadow-lg` | layered, up to 40px blur, 10% grey | Mega menu panel, overlays |
| `shadow-focus` | 4px soft maroon ring | Focused inputs and selects |
| `shadow-focus-error` | 4px soft red ring | Focused invalid inputs |

Shadows use warm blue-grey `rgb(71 76 85)`, never black.

## 6. Motion

- `duration-fast` 150ms: hover, press, colour changes (the default for `transition`).
- `duration-base` 200ms: menus and overlays opening, the accordion height change.
- `duration-slow` 400ms: longer fades. The scroll reveal and the count-up have their own shared tokens (see Reveal):
  `--reveal-distance` 20px (12px at 768px and below), `--reveal-duration` 450ms, `--reveal-ease` (ease-out),
  `--reveal-stagger` 70ms with `--reveal-stagger-max` 400ms, `--reveal-line-duration` 900ms and `--count-duration` 1200ms.
  Never write these values in a component.
- `--underline-duration` 200ms and `--underline-thickness` 2px: the animated link underline (see Link underline in section 11).
- Easing: one soft curve (`--ease-standard`).
- When the visitor has "reduce motion" on, the durations become ~0, which
  disables every token-driven transition. Never write a transition with a raw
  duration.

## 7. Z-index layers

`z-raised` 10 &lt; `z-sticky` 100 (header) &lt; `z-dropdown` 200 (mega menus) &lt;
`z-overlay` 300 (search, mobile menu) &lt; `z-tooltip` 400. Never write a number.

## 8. Focus

Every interactive element shows a 2px maroon outline, offset 2px, on keyboard
focus (`:focus-visible`), set globally in `globals.css`. Inputs and selects use
the same outline and also a maroon border plus a soft ring. Don't remove outlines.

## 9. Components

Import from `@/components/ui`. All are accessible by default.

### Button
`<Button variant size iconStart iconEnd fullWidth disabled href>`

| Prop | Values | Notes |
|---|---|---|
| `variant` | `primary` (default), `secondary`, `tertiary` | primary = filled maroon, white label; secondary = 1px maroon outline and text on a white fill (its hover is clearly visible: a stronger pink `brand-tint-strong` fill, a darker maroon border and label, and `shadow-md`; primary hover = `brand-hover` and `shadow-lg`; 200ms ease-out, nothing moves: no lift, no scale, no bounce); tertiary = text link with a soft resting line and the animated underline; add a trailing `iconEnd` arrow when it goes to another page (see the Arrow rule) |
| `tone` | `default`, `inverse` | `inverse` is for the maroon call-to-action card, the hero photo and the dark sections: primary = white fill with maroon label, secondary = white outline and label, tertiary = white text link. Its focus ring is white |
| `size` | `sm` 44px, `md` 48px (default), `lg` 56px, `adaptive` 48px up to 768px and 56px from 769px | All meet the tap target |
| `hoverFill` | boolean | Default-tone secondary only (the "Prefer using the website?" buttons): transparent with a maroon outline, text and icon; on hover (only where hover exists) it FILLS maroon with white text and icon, the border stays maroon so the size never changes; pressed = `brand-hover` fill; keyboard focus = the hover colours plus the 2px ring (2px offset). Colours only (`transition-colors`, 200ms), no movement |
| `strongOutline` | boolean | Inverse secondary only (the final call-to-action card): 1.5px border at 80% white (`--border-width-outline`) instead of 1px full white. The two buttons there are one width and one height: stacked in a 320px column up to 768px, side by side (each at least 220px) from 769px |
| `href` | string | Renders a link (internal uses Next `<Link>`, external a plain `<a>`) |
| `iconStart` / `iconEnd` | icon element | Sized automatically to 20px. An `iconEnd` arrow does not move. Use `iconEnd` arrows only on section-level "see all" links (see the Arrow rule) |
| `fullWidth`, `disabled`, `className` (layout only) | | Disabled button: `aria-disabled`, no click handler, never submits, stays focusable. Disabled link (`href`): rendered without an href, so it is announced as disabled but is skipped by Tab |

States: default, hover, focus (ring), active (pressed), disabled.
Use **one** primary button per area. In the header only "Get a quote".

### Input
`<Input label help error optional ...inputProps />`
States: default, hover, focus (maroon border + soft ring), error (red border,
icon + message, `aria-invalid`), disabled. 48px high, 12px radius, label always
visible. Error and help text are linked with `aria-describedby`.

### Select
`<Select label help error optional>…<option/>…</Select>`
Native `<select>` with a custom chevron. Same states and look as Input.

### Field
Wrapper used by Input and Select (label, help, error wiring). Use it for any
new form control (e.g. a textarea).

### Card
`<Card variant padding as href onClick>`

| Prop | Values | Notes |
|---|---|---|
| `variant` | `default`, `interactive` | interactive needs `href` (link) or `onClick` (button) |
| `shadow` | `md` (default), `sm` | the resting shadow of a white card; `sm` is for light strips |
| `padding` | `md` (default), `lg`, `xl`, `xxl`, `none` | md = 20/24px, lg = 24/32px, xl = always 32px, xxl = 24px on phones and 40px from tablet up (a card holding a whole section) |
| `tone` | `surface` (default), `tint`, `cream` | tint = soft pink card (`brand-tint` with a `brand-tint-strong` border, no shadow). cream = warm cream card (`surface-cream` with a `brand-tint-strong` border) for the advisor card and the FAQ contact strip (add `shadow="sm"` for the strip). Static cards only |
| `as` | `div`, `section`, `article`, `li` | default variant only |

24px radius, white, 1px `border`, `shadow-md`. Interactive: on hover the card does not move
(no lift, no scale): over 200ms ease-out it raises to `shadow-lg` and
gets a soft pink `brand-tint-strong` border. The card title carries the animated underline, triggered by
the card (`link-underline group-hover:link-underline-shown
group-focus-visible:link-underline-shown`). Only large cards (the product cards and
the featured news card) add the circular arrow (`CardArrow`); other cards have no
arrow. Things inside use `rounded-control`. Text colour is explicit (`text-ink`),
so a card on a dark section does not inherit white text.

### CardArrow
`<CardArrow />`: the decorative circular arrow for large clickable cards: a 40px circle with a maroon arrow. At rest the circle has no
fill (the Figma frame hides it, so only the arrow shows); inside an interactive card it fills soft pink (`brand-tint`) and the arrow
moves 4px right on hover and focus (200ms ease-out; the only arrow that moves). It sits top right on the product cards.
Only the product cards use it (the news cards have no arrow).

### Reveal
`<Reveal as variant>`: the one scroll-reveal behaviour. `variant="rise"` (default) fades in and rises 20px (12px at
768px and below) over 450ms, ease-out; `variant="fade"` fades only, no movement (photos); `variant="draw"` is a clipping
track whose child slides in along it (the dotted connector in Getting covered: `reveal-draw-x` left to right on desktop,
`reveal-draw-y` top to bottom on phones). Only opacity and transform change, so nothing shifts (CLS stays 0).

- One shared `IntersectionObserver` (threshold 0.15). Each element plays once and is never reset when you scroll up.
- Items that appear together get a stagger of 70ms each, in page order, capped at 400ms in all (set by the script as
  `--reveal-index`; the CSS turns it into the delay). Steps in Getting covered therefore appear in order.
- The hidden state is added by the script only after the page has loaded (`data-reveal`), and only to content below the
  first screen. Content already in view at load appears at once, and without JavaScript everything is visible.
- An element counts as seen when 15% of it is on screen, or when it fills 40% of the screen height (a very tall element on a short screen can't stay hidden), and a 3-second safety check shows anything on screen that the observer missed.
- With `prefers-reduced-motion` nothing is hidden or moved (the tokens go to zero too) and numbers do not count.
- Used on: section headings and subtitles (`SectionIntro`), product, review, news and stat cards, the steps, photos
  (`Photo`, the trust photo), the text columns of the trust and app sections, and the closing call-to-action card.
- **Never** on: the header, navigation, bottom bar, menus, form fields, the hero's first screen or buttons in the first
  viewport (the "already in view" rule covers the last two).

### NavLink
`<NavLink href variant exact>`
`variant`: `inline` (main navigation: 14px, weight 500, 44px tall hit area, no
background in any state; hover and keyboard focus draw the animated line under the label
(`link-line`: 2px, currentColor, scaleX 0 to 1 from the left, 200ms ease-out); the current page is
maroon and keeps the full line; a menu button keeps the line while its menu is open and its
chevron turns 180 degrees) or `block` (mobile menu rows:
18px, tinted when current). Sets
`aria-current="page"`. Sections count as current for their sub-pages unless
`exact`. Also exports `navItemClasses()` and `navLabelClasses()` so menu buttons look identical, and
`isCurrentPath()`.
It reads the URL: wrap it in `<Suspense>` on routes with dynamic params.

### IconButton
`<IconButton label icon variant size showTooltip href>`
`label` is required (becomes `aria-label`). `variant`: `ghost` (default),
`subtle`, `outline`. `size`: `md` 44px, `lg` 48px. Extra props such as
`aria-expanded` pass through.

### Tooltip
`<Tooltip content placement describe>{one focusable child}</Tooltip>`
Opens on hover and keyboard focus, closes on Esc, blur and pointer leave, and
the pointer may move onto it. Top or bottom only; short text only; never hide
essential information (touch screens have no hover).

### Tag
`<Tag tone icon>`: `neutral` (grey fill), `brand` (soft pink chip), `outline` (white, 1px border: the chip style on a pink section), `success`, `warning`, `error`. Read-only
label, 28px high. Not clickable.

### Section
`<Section tone labelledBy id>`: the wrapper for one full-width band of a page, with a centred
1200px container and the standard vertical space (56px on phones, 96px from tablet up). `tone`:
- `white` (`surface`, #FFFFFF)
- `alt` (`surface-section`, #FBFAF9, a warm off-white)
- `tint` (`brand-tint`, soft pink: available but not used on the home page now)
- `dark` (`footer-bg`, #1F1D21, with white text and a white focus ring)

Alternate `white` and `alt` down the page, so no two neighbouring sections share a tone. `dark` is the exception
(the trust block, and the footer), and the section after it is white. There is no full-bleed
maroon tone. Inside `dark`, text links and icons are white (`Button tone="inverse"`), never maroon: maroon on this
colour is 1.2:1. Cards on any tone are white with a 1px border and `shadow-md`. All section headings are
aligned by one rule: centred for full-width content rows (products, getting covered, customers, FAQ, and the final call-to-action), left for split sections (trust, app) and for the news heading, which keeps "View all news" on the right. Use `SectionIntro align="center"` for the centred ones.

### Photo
`<Photo src alt ratio radius sizes priority>`: a real photo with a fixed ratio (`16/9`, `4/3`, `3/4`, `9/16`,
`1/1`) and rounded corners, served by `next/image` (AVIF and WebP, right-sized, cropped with object-fit cover). It
uses the same ratios and radii as `ImagePlaceholder`. Always give meaningful `alt` text (only the decorative hero
photo has `alt=""`).

### CardCarousel
`<CardCarousel label itemName items>`: ONE horizontal, swipeable card carousel. Testimonials use it on every screen size; the news uses it on phones
and tablets (up to 1024px; from 1025px the news keeps its bento grid). Cards per view, each with a 32px peek of the next (`--carousel-peek`):
1 up to 599px (width = 100vw - 2 x page padding - the peek, never wider than the scroller), 2 from 600px (width = (the scroller - the peek - 2 gaps) / 2),
3 from 1025px. The breakpoints are the tokens `--breakpoint-tablet` (600px) and `--breakpoint-wide` (1025px), used as the `tablet:` and `wide:` variants;
the widths are the `w-carousel-one`, `w-carousel-two` and `w-carousel-three` utilities on top of `carousel-card` (border-box, `min-width: 0`, `max-width: 100%`).
Cards snap (`scroll-snap-type: x mandatory`, align start) with 16px gaps (`--carousel-gap`), all cards are as tall as the tallest, and there is no
autoplay. Below the cards: a position indicator ("2 / 6", or "1–3 / 6" when several cards show; `aria-live="polite"`) and, from 600px, previous and next
buttons in the style of the 32px dark round hero buttons (32px dark circle `--color-hero-control`, white 16px chevron, 44px tap target, 70% opacity and 100% on hover,
pressed and focus, no movement), disabled at the ends. Trackpad and shift + wheel scroll it too. The page still scrolls vertically over it
(`touch-action: pan-x pan-y`) and `overscroll-behavior-x: contain` stops the sideways swipe at the ends. The scroller is a focusable `role="region"` with
the standard focus ring (drawn inside); left and right arrow keys move one card; each card is a `role="group"` named "Review 2 of 6" (the `itemName`);
reduced motion makes the keys and buttons jump instead of glide. The scrollbar is not drawn (`scrollbar-hidden`) but everything above still works. Below
600px the cards run to the screen edges (negative side margins equal to the page padding); from 600px they stay inside the container. The scroll reveal (fade and rise) is on the carousel as a whole,
never on each card.

**Review card** (`ReviewCard` in `TestimonialsSection.tsx`): left-aligned; quote mark and quote (`line-clamp-8`), then, pinned to the bottom (`mt-auto`), the 48px
photo, the name under it (one line, ellipsis) and the details under the name (`line-clamp-2`). Identical on every card.

**News card in the carousel** (`NewsCard` in `NewsSection.tsx`): a `Card` (`press="brand"`: the border turns maroon when pressed; no lift or scale) with 16px
padding, a 16:9 photo (its own `focus` as object-position, width and height attributes, lazy-loaded), the date in a `<time>`, then the headline
(`line-clamp-3`). All cards look the same (no featured card), newest first (`iso` date in the content file). "View all news" is centred under the carousel up to 1024px
(so the floating chat button cannot cover it) and in the heading row from 1025px.

### StoreBadge
`<StoreBadge src width height label href>`: an official app store badge as a link, used exactly as supplied (never recoloured, cropped or
restyled). The three badges (black, English) are in `public/images/store`: `app-store-badge.svg` 120 x 40, `google-play-badge.svg` 135 x 40
and `appgallery-badge.svg` 134 x 40. All share one height (44px up to 768px, 48px from 769px) and keep their own proportions, in a row
with 12px gaps; up to 768px the row is narrow (`max-w-80`) so they wrap two plus one, left-aligned. Each link has a descriptive
`aria-label` ("Download Ceylife Digital on the App Store", "Get Ceylife Digital on Google Play", "Explore Ceylife Digital on Huawei
AppGallery"), and opens in a new tab with `rel="noopener"` once a real address is set (the "#" placeholder stays in the same tab).
States are colour only (no lift, scale or bounce): a 2px ring with a 2px offset (`--radius-badge` corner) that is transparent at rest and turns maroon on
hover (only on devices that can hover), while pressed and on keyboard focus (always visible); hover brightens the badge (`brightness(1.08)`,
`--brightness-hover`), pressed darkens it (`0.95`, `--brightness-pressed`). Only `outline-color` and `filter` transition, 200ms, standard easing. The wording,
labels and addresses are in `home.app.stores`. The old outlined `StoreButton` is gone.

### ImagePlaceholder
`<ImagePlaceholder label ratio radius>`: neutral grey stand-in for a photo that
does not exist yet. Nothing is written on the box (only a small image icon);
`label` is the image's alt text for screen readers, for example "A family
smiling together". `ratio`: `16/9`, `4/3`, `3/4`,
`9/16`, `1/1`. `radius`: `container` (24px, stand-alone) or `control` (12px,
inside a card). Swap in the real image at the same ratio and radius.

### Accordion
`<Accordion items defaultOpen>` with `items = [{ id, title, content, icon? }]` (`icon` is an icon element such as `<ShieldCheck />`; it is sized for you).
WAI-ARIA accordion: each heading is a button inside an `h3` with
`aria-expanded` and `aria-controls`, each panel is a labelled region. Enter or
Space toggles; Arrow Down/Up move between headings (wrapping); Home/End jump.
Any number of items can be open. It is ONE white 24px card (1px border, `shadow-sm`, 8px inner padding) with 1px dividers
between the items. Each row (12px radius, padding 20px 24px, vertically centred) is an optional 44px icon tile (12px radius,
`surface-alt`, 22px maroon outline icon), the question (18px semibold) and a 32px round toggle on the right
(brand-tint circle, maroon plus). Hover gives the row `surface-alt`. The OPEN row is `surface-alt`: the tile turns maroon with a
white icon, the question turns maroon, the toggle becomes a maroon circle with a white minus (the plus rotates a quarter turn
and fades while the minus fades in; no movement for reduced motion), and the answer (muted, 16px, indented 84px when there is an
icon so it lines up with the question, 20px bottom padding) opens with a smooth 200ms height change (`accordion-panel`); a closed
panel is `inert`. Open the first item by default with `defaultOpen`. Row heights are at least 44px at every width; a long question
wraps in its own column and never touches the toggle.

### CountUp
`<CountUp value prefix suffix spoken duration>`: a number that counts up from 0 to
`value` when it scrolls into view (`--count-duration`, 1200ms, ease-out, runs once, also on phones). The prefix
and suffix (for example `Rs. ` and `+ billion`) never move. Thousands get commas,
digits are tabular and the final width is reserved, so the layout never shifts.
With reduced motion on, the final number shows immediately. Screen readers read
only the final value: the moving digits are `aria-hidden` and an `sr-only` element holds the final text, or `spoken` (one string for
the whole figure, for example "More than Rs. 200 billion" for the split "Rs. 200+ billion").

### StatsStrip
`<StatsStrip stats tone>` with `stats = [{ prefix, value, suffix, spoken, label }]`: an open strip of proof numbers, no
boxes. Four columns with 1px vertical dividers from lg; 2 x 2 on phones with vertical and horizontal dividers.
Each column: a 32px by 3px accent line, the number (56px from xl, 44px below, weight 700, tabular, line-height 1,
counting up with `CountUp`, once, final value for screen readers and reduced motion), and a 16px muted label 12px
below. The prefix and suffix ("Rs.", "+ billion") are 24px (the nearest scale size to half), on the baseline.
On phones a long value wraps ("Rs. 200+" then "billion"); from lg it stays on one line and the columns share the
width by content.
Semantics: a description list (`<dl>`). Each stat is one `<div>` with a `<dt>` (the number) and a `<dd>` (the label), so a screen reader says them together
("250, branches island-wide"; "More than Rs. 200 billion, life fund"). The numbers are not headings (no h1 to h6, no `p`). The accent line is a `::before`, so the
list holds only the terms and descriptions.

| `tone` | Section behind it | Numbers | Prefix, suffix, accent | Labels | Dividers |
|---|---|---|---|---|---|
| `dark` (default) | `Section tone="dark"` | white | prefix and suffix `brand-tint-strong`, accent line `footer-muted` | `footer-muted` | `footer-border` |
| `light` | `Section tone="tint"` | `brand` | `brand` | `ink-muted` | `brand-tint-strong` |

To switch the "Why families trust us" section, change the `TONE` constant at the top of
`src/components/home/WhySection.tsx` ("dark" or "light"): the section background, text, link and strip all follow.
Both tones pass contrast (see "Dark sections" and "Light stats strip" in `npm run check:contrast`).

### Stepper
`<Stepper items columns look>` with `items = [{ icon, title, text }]`. Each step has a
56px soft pink icon tile (maroon icon) with a small number badge (maroon circle, white number)
overlapping its top-right corner, a title (18px semibold) and a description (16px,
muted). A thin dotted line (`border-strong`) joins the centres of the tiles: across on
desktop, 2x2 on tablet (the line breaks after the second step), down the left on
phones (the step becomes a row: tile, then text). `columns`: 4 or 3. `look`: `card`
(each step in its own white 24px card, padding 32px, on an off-white section) or
`plain` (no card, steps side by side), `timeline` (no cards, used in How it works: from lg four equal columns with everything centred (icon tile, LARGE maroon number instead of the small badge, title, description up to 240px) and ONE dotted line behind the tiles from the centre of the first to the centre of the last (the list's `::before`; the tiles have solid backgrounds on top); below lg the steps stack, left-aligned, with the line down the left), or `rows` (no card, the steps stacked as rows, the icon tile beside the text, joined by a dotted vertical line at every size: available, not used on the home page now). Steps fade up one
after another with `Reveal`. It is a real ordered list (`<ol role="list">`, so VoiceOver keeps the list when the list style is removed; screen readers say "list, 4 items"). The numbers (the badge and the
timeline’s large number) are plain `<span>`s, never headings or paragraphs (WAVE reports bold, large paragraph text as a "possible heading"), and are `aria-hidden` because the list
already numbers the steps. Each step reads once: its title (h3), then its description. The icons and the dotted connectors are `aria-hidden`; nothing with text or a link is.

## 10. Site header (built from the components above)

Files: `src/components/header/`. All words and links live in
`src/content/navigation.ts`; edit that file to change menu copy, add or remove
items, swap an icon, or fix a link. Components contain no menu text.

| Part | What it is |
|---|---|
| `Header` | ONE sticky row, about 72px (65px on phones), 1px grey bottom border, and an md grey shadow once the page has scrolled. Everything is vertically centred on one line. Holds the language, search and mobile-menu state |
| Left to right (from 1152px) | Logo, `DesktopNav` (14px / 500 links), then pushed right: search icon button, language selector (`EN` + chevron), outlined "Get a quote", filled "Pay premium online" (to the customer portal; the address is still a "#" TODO). Both are 44px tall, 14px text, 12px radius; Pay premium online is the only filled button |
| Hamburger breakpoint | `nav` = 72rem (1152px), found by measuring: at 1100px the links wrapped, from about 1150px the row fits with a 32px gap before the buttons, at 1200px the gap is 81px. Change it in `tokens.css` and re-test |
| `DesktopNav` + `MegaMenuPanel` | Home, Products, Claims & Support, About Us, Contact Us. Three mega menus. About Us has fourteen links in three groups (Our company: Who we are, Company history, Leadership, Management, Subsidiaries; Investors and media: Investor relations, Annual reports, Corporate governance, News; Community and careers: Awards & recognitions, CSR, Environmental sustainability, Testimonials, Careers). Claims & Support has nine links and a text link in three groups (Claims and complaints: Make a claim, Claims process, Complaints procedure, Customer charter; Policy services: Policy documents, Branch locator, Ceylife Digital App; Life Rewards: Family Savari, Pranama Scholarships, plus the group link "All Life Rewards"). Products is unchanged. The panel is 1056px wide for every menu and shows one column per group; columns stretch to the same height; a group can carry an optional text link (`link` in `navigation.ts`) pinned to its bottom. Descriptions for Family Savari and Pranama Scholarships are SAMPLE drafts. Keyboard: Enter or Space opens a menu, ArrowDown moves into it, arrow keys move between items (also across columns), Esc closes it and returns focus to the button |
| `MegaMenuItem` | Icon tile, title, one-line description. 12px radius, soft pink hover with the title turning maroon, pink icon tile, `aria-current` when it is the current page |
| `LanguageMenu` | Compact menu (radio items). Changes `<html lang>`, which switches on the Sinhala/Tamil type rules. Does not translate yet |
| `SearchOverlay` | Dialog with a 12px input. Esc closes, focus is trapped and returned. Enter goes to `/search?q=` |
| Phone and tablet (below 1152px) | Header shows logo, a 48px "Pay premium online" and a hamburger. `MobileMenu`: | Get a quote (outlined, full width), search, language, then Home, an accordion per mega menu (each shows its group headings, items and any group link), Contact Us |

Behaviour: menus open on hover (mouse only, 100ms in / 200ms out) and on click,
tap, Enter or Space. A menu opened by hover becomes pinned when clicked. Arrow
Down on a menu button opens it and moves in; arrow keys move between items in
the direction pressed; Home and End jump; Esc closes and returns to the button;
Tab out or a click elsewhere closes. The current page is marked with
`aria-current="page"` on links and `aria-current="true"` plus the maroon bar on
the menu button for its section.

Rules for changing it: keep one filled button; keep menu items one line of
description; add new content to `navigation.ts`, not to components; any new
colour pair goes into `scripts/check-contrast.mjs`.

**Placeholders.** `src/app/[...slug]/page.tsx` serves a placeholder for every
internal link in `navigation.ts` (plus Get a quote and Search). Creating a real
page folder (for example `src/app/products/life-insurance/page.tsx`) replaces
that placeholder automatically.

## 11. Home page, footer and chat button

Files: `src/components/home/` (one file per section), `src/components/site/`
(`Footer`, `ChatButton`). Wording: `src/content/home.ts` and
`src/content/footer.ts`.

**SAMPLE rule.** Content is written as real copy, with no brackets. Content that
is only an example (invented testimonials, an unconfirmed figure, sample opening
hours, a placeholder email, a draft menu description) sits under the comment
`// SAMPLE: confirm with Ceylinco before launch` in the data file, so it can be
found and replaced. A link of `#` means the real address has not been given yet.
Do not add a statistic, quote, award or claims figure unless Ceylinco supplied
it; if it is only an example, mark it SAMPLE. Wording about cover, exclusions,
premiums, claims times, regulation and the FAQ answers must be confirmed with
compliance; testimonials must be real and approved before launch.

Section order and backgrounds (the order of the Figma frame): hero (full-bleed photo), choose a need (white), how it works (alt),
why trust us (dark), testimonials (white), app (alt), news (white), final
call-to-action (alt section holding a rounded 24px maroon card). Alt is `surface-section` (#FBFAF9). The Figma frame shows testimonials on alt, but with the FAQ removed it would sit next to the alt app section, so it is white. The FAQ (`FaqSection`) is no longer on the home page (removed at the designer's request); the component and its wording in `home.faq` are kept, unused. The footer is dark (see below) on every page.
There is no Claims section: it was removed at the designer's request. The claims links stay in the header menu,
the footer Support column, the FAQ question "How do I make a claim?", step 4 of Getting covered and the "Need to make
a claim? Start a claim" item in the slim row under the product cards.
"Know what you're getting" was removed from the page at the designer's request: its component
(`CoverageSection`) and wording (`home.coverage`) are kept, unused. Images in `public/images`: `hero-family-sunset.jpeg`
(hero, temporary 600 x 400 placeholder), `trust.jpeg` (the photo in the trust block; `trust-cutout.svg` is the old cutout, unused), `mobile.svg` (the two-phone picture in the
app section), `news1.jpg`, `news2.webp`, `news3.jpeg` (the three news stories), `store/google-play.svg` and `store/appgallery.svg` (full-colour store logos). `avatar-nimali.png`, `avatar-ruwan.png`, `avatar-dilani.png` (testimonial avatars, matched to the three names by the person shown: confirm), `cta-pattern.png` (ring pattern on the maroon call-to-action card). Still to export from the Figma frame: the soft background picture for the FAQ section (`home.faq.background`).finalCta.pattern`).

Rules: no carousels or auto-rotating content; images keep a fixed ratio (hero
4:3, phone 9:16, news 16:9, never text over a photo); the header's sticky "Get a
quote" and the hero / final-band "Get a quote" buttons all go to the same place,
so they repeat one action rather than compete. Whole-card links (need cards,
news cards) show a text-link look but are not nested links.

**Arrow rule.** Arrows appear in three places only.
1. A trailing arrow on **tertiary (text-link) buttons that go to another page** ("See all products", "View all news",
   "Our story", "Group insurance", "Buy online in minutes", "Start a claim", "Pay premium", "Customer portal",
   "talk to an advisor" in the FAQ line, "See full details..."): `iconEnd={<ArrowRight />}` (the arrow stays still).
2. The **40px circular arrow** (`CardArrow`: maroon arrow in a circle that has no fill at rest and fills soft pink on hover) on large clickable cards: the four
   product cards (top right). The news cards have no arrow.
3. The "Buy online" strip in the Products mega menu.

No arrows on primary or secondary buttons, nav links, mega menu items, footer links, inline text links inside
paragraphs (the phone number), or expand and collapse controls (they use a plus, minus or chevron). Ask before adding
an arrow anywhere else.

**Text links (`TextLink`).** One component, `TextLink` (`@/components/ui`), draws every text link; `Button variant="tertiary"` renders it. Props: `tone` (`default` for light backgrounds, `light` for dark sections, `light-muted` for the footer lists), `size` (`sm` 44px / 14px, `md` 48px / 16px, `list` 44px / 16px), `inline` (a link inside a sentence, no padding), `iconEnd` / `iconStart`, `disabled`. Behaviour on hover and `:focus-visible`: a 2px line in `currentColor` grows from the left (`scaleX(0)` to `scaleX(1)`, `transform-origin: left`, `--underline-duration` 200ms, `--ease-standard`; the `link-line` utility in `globals.css`, put on the label) and the arrow, if any, stays still; keyboard focus also shows the 2px focus ring (footer-text on dark tones). The text colour does not change on hover; pressed goes a shade darker. The default tone keeps a thin pale pink resting line (`link-rest-soft`); dark tones have none, so the growing line is visible. Hover is wrapped in `(hover: hover)`. Reduced motion: `--underline-duration` drops to about 0, so the line appears at once. The older `link-underline` utility (background-size gradient; variants `link-underline-shown`, `group-hover:link-underline-shown`, `link-line-footer`, `link-line-inverse`, `link-rest-soft`, `link-rest-current`) is kept for multi-line text (card titles) and the navigation items. Used on: tertiary buttons, the footer link lists, the FAQ phone link, "Our story". Not used on: primary and secondary buttons, mega menu items, mobile menu rows, or cards as a whole.

**Product cards** ("What are you looking for?"): five cards, the fifth being "Protect my business / Group Insurance" with a briefcase icon (its screen-reader description is a SAMPLE draft). One column on phones, two from sm, three from lg, and five in a row from xl (211px each, titles wrap to two lines). The slim row under them now has two items ("Prefer to buy online?" and "Need to make a claim?", 16px prompts, about 182px apart from lg); "Cover for your business? Group insurance" was removed. Footer contact lines are 14px apart and the social icons sit 24px below them. Each card is one link each (32px padding, `shadow-sm`): an 80px soft pink tile with a
maroon 56px icon (heart, a filled older-woman glyph taken from the Figma for retirement, stethoscope, trending-up),
the need as the title (18px semibold, the nearest scale size to the 20px asked for), the product name in muted text
(Life insurance, Retirement plans, Medical plans, Investment plans); the circular arrow sits top right, opposite the tile. The
accessible name is "need, product" (for example "Protect my family, life insurance"); the old description is kept in
the data file and read out through `aria-describedby`. Hover (200ms ease-out, the card does not move): a `brand-tint-strong` border and `shadow-lg`; the title underlines and the arrow nudges 4px right.

**Hero** (`src/components/home/Hero.tsx`) is a full-width photo that fills the screen below the solid white sticky
header: `min-h-hero` = clamp(560px, 100svh minus the header, 880px). The photos are plain `<img>` inside `<picture>` with the props from `next/image`’s `getImageProps` (explicit `width` and `height`, `sizes="100vw"`, `object-fit: cover`, `alt=""` because they are decorative; AVIF and WebP are enabled in
`next.config.ts`). **Image slideshow:** the hero is a slideshow of the four images in `public/images/Hero` (list in `home.hero.images`, each with its real `width` and `height` so nothing shifts). Each image stays 6.5 seconds (`--hero-autoplay` in `tokens.css`, read by `Hero.tsx`), then the next fades in over it for 800ms ease-out (`--hero-fade-duration`, opacity only: no sliding, scaling, zoom or bounce), and it loops three times (`LOOPS` in `Hero.tsx`), then rests on the first image. The headline, text, buttons and trust row never change. There are no controls at all: no previous / next buttons, counter, position dots, pause button, swipe or keyboard shortcuts.
Autoplay waits (never advances) only while focus is inside the hero (read live from `document.activeElement`), while the page is hidden (`visibilitychange`) and while the hero is off screen (`IntersectionObserver`, threshold 0.1, counted as visible until it reports otherwise), and starts the 6.5 seconds again afterwards; hovering with the mouse does not pause it. The check is repeated when each timer fires, so a missed event can never let a change through while something is holding it. An image that has not loaded yet is skipped, never waited for. In development a note is logged when reduced motion keeps the slideshow on the first image. With reduced motion there is no autoplay and no crossfade: only the first image is in the page.
The images sit in a `role="region" aria-roledescription="carousel" aria-label="Featured images"` with `aria-live="off"` while it plays (automatic changes are never announced). The first image loads at once (`priority`, `fetchPriority="high"`); once it has loaded, the other three are requested (low priority) so there is no blank frame. Next to the old image the new one fades in on top of it (the old one stays fully visible underneath, so there is no dark dip). Each image can have its own `focus` (object-position for desktop and phones) in the content file. It is anchored with `--hero-position` (55% 75%, phones 57% 80%) so the family, lower right of
centre, stays visible. A scrim (the `scrim-hero-*` tokens) darkens the left side (the top below lg) so the white
text passes 4.5:1; if it ever fails (for example after a photo change), raise the scrim, never the text size.
Content: a left column, max 640px, vertically centred from lg and top-aligned below it (48px top padding on phones,
with extra space underneath so the family is not covered by text), nothing in the right 40% from lg. Headline white,
44px (56px from xl), weight 700, line-height 1.2 (the display token), with `text-shadow-hero`; supporting line 18px in
`footer-text`, about 52 characters wide; two 48px `inverse` buttons (white filled with maroon text, and white
outlined, the same pattern as the final call-to-action card); a trust row of small white icons with 16px full-white
text, which runs the full width of the container along the bottom of the hero (items spread with space-between from xl and left-aligned below it, with 64px of right padding to clear the chat button, wrapping; from tablet up, over a second bottom scrim, `bg-hero-scrim-bottom`) and stacks under the buttons on phones. `npm run check:hero` rebuilds the hero (EVERY slideshow image, with its own crop, and the scrim) for 390, 768, 1280, 1440 and
1920px, finds the brightest pixel behind the headline, supporting line and trust row, and tests the text against it, Keep its image list in step with `home.hero.images`.
Re-measure the text boxes in `scripts/check-hero-contrast.mjs` if the layout or copy changes. The images are `public/images/Hero/` (folder name with a capital H): `hero-family-sunset.jpeg` (1537 x 1023, a little soft on screens wider than about 1500px) and three PNGs (about 1700 x 900, 2.3 to 2.7 MB each, resized by `next/image`). Hero images: confirm licence before launch.

**Phone hero (768px and below; 769px and up is unchanged):** a near-black hero (`footer-bg`) at least clamp(560px, 100svh minus the 56px header, the 64px bottom bar and the safe areas, 760px) tall, which only grows when its content needs more. It is a grid of two rows: row 1 holds the headline (32px), supporting line (16px) and the two buttons (equal width, side by side while each can be 152px wide, otherwise stacked) on the plain near-black; row 2 is the photo area (at least 352px tall, so the faces always have room above the trust strip) with the slider in it, a 96px eased fade from the near-black into the photo at its top and a 208px (about 29% of the hero) eased fade up to 80% near-black behind the trust facts at its bottom, fixed above the slides so contrast never changes during the crossfade (`--hero-scrim-phone-top`, `--hero-scrim-phone-bottom`, `--size-hero-*` in `tokens.css`). The fades and the text never move or fade with the slides. The trust facts are a strip at the bottom of the photo: white 14px text with a subtle shadow (`text-shadow-strip`), line-height 1.4 (`leading-compact`), 16px between the facts, a 12px icon-to-text gap with the 16px icons aligned to the first line, 16px on the left, 72px on the right (clear of the chat button) and 24px plus the bottom safe area below. Phones show the shorter `mobileText` of a fact when the content file has one (the licence fact drops "of Sri Lanka"; wording to be confirmed with compliance); larger screens always show the full `text`, as two spans toggled by CSS. Up to 599px each photo is a crop (`public/images/Hero/mobile/`, 1.12 wide to 1 high so the whole height shows, about 1000px wide at native resolution, served through `<picture>` and anchored by `focus.mobile`); from 600px the full photo with `focus.tablet`; from 769px `focus.desktop`. When a photo is added, make its crop, put it in `home.hero.images` and check that no face sits under the text, the top fade or the trust strip. `npm run check:hero` rebuilds this layout too (320, 360, 390, 430, 600 and 768px, from the measured line boxes and each case’s `photoTop`, the top of the photo area): re-measure them if the copy or layout changes.

**Proof numbers** use `CountUp` (20+, 250, Rs. 200+ billion, 38,000+); the data
holds the number, prefix and suffix separately.

**How it works** (alt tone, centred heading with the intro "A quick and hassle-free journey to protection") is one connected, centred timeline (`Stepper look="timeline"`: no cards, a dotted line through the four icon tiles, a large maroon number above each title), then a cream advisor card
(`Card tone="cream"`: `surface-cream` with a `brand-tint-strong` border) with a round white headset icon, the text and the "Talk to an advisor" button, with the call
note at 14px. This button and the one in the final call-to-action are the only "Talk to an advisor" buttons.

**Why families trust us** (the one dark block) has the heading, story and "Our story" link on the left and a photo (`trust.jpeg`, 1433 x 1098) on the right, then the open `StatsStrip` and the recognition line. The photo is not a rectangle: `TrustPhoto.tsx` cuts it to the custom skewed, rounded shape from the Figma design with an SVG `clipPath` (objectBoundingBox units, the exported "Rectangle 1" path divided by its own size, so it scales), and draws two outlines of the same kind of shape as a separate SVG layer behind it, at the offsets of the design. The outlines are the shape's path stroked 16 units wide and clipped to itself, which leaves the design's 8-unit inside stroke (it thins in proportion on small screens). Their colour is the `brand-line` token (#B02133, a lighter maroon that shows on the dark section; brand maroon would be invisible). Everything sits in a box with the design's 554 : 359 ratio and is positioned in percentages, so the photo and outlines stay aligned at every width; no border-radius is used. The outlines are decoration only. The old cutout (`trust-cutout.svg`) and the `trust-glow` glow are kept but unused.

**App section** (alt): the left column is `mobile.svg` (1015 x 1058, used as supplied: two phones, the home screen overlapping the Pay premium screen, on a transparent background; it wraps a raster image, so it is about 1.4 MB) over a soft pink swoosh (`AppSwoosh`, `brand-tint`: a diagonal band that bleeds off the left edge of the screen and stays inside its column). The picture is decorative (`alt=""`, `aria-hidden`), has explicit width and height, loads lazily and only fades in (`Reveal variant="fade"`, no movement). From 1024px it is capped at the height of the old photo so the section keeps its height; below 1024px the columns stack with the picture UNDER the text, full width. The text column has three levels: the heading with an 18px muted intro; the four key details as a list (a maroon tick in a 32px pink tile, 18px medium text, 16px gaps); then, under a 1px divider with generous space, the three `StoreBadge`s and a website fallback: the label "Prefer using the website?", a thin vertical divider (only where the column is wide enough, 769px to 1023px) and two secondary outline buttons with a leading icon ("Pay premium online" with the card icon, "Customer portal" with the user icon), equal 12px gaps and no underline. Up to 768px the label sits above the two buttons, which are full width and stacked; from 1024px the label sits above the two buttons side by side. In the installed app (`display-mode: standalone`) the badges and the fallback are hidden (`hide-standalone`).

**FAQ** (white, sits before the app section): ONE centred column. A 56px white circle (1px `border`, `shadow-sm`) with a 24px maroon help icon, then a centred heading and a one-line intro (SAMPLE: "Quick answers to the questions we hear most."), then,
800px wide (`max-w-faq`), a white 24px card holding the accordion (see Accordion: an icon tile, the question and a plus / minus toggle per row; open row on `surface-alt`; first item open) and, under it,
a cream strip of the same width (`Card tone="cream" shadow="sm"`, 24px radius, 1px border): a pink circle with a maroon phone icon, "Still have
questions?" (semibold), "Call (011) 246 1461, Mon to Fri, 8.30 am to 5.00 pm" (the number is a `tel:` link; the hours are SAMPLE) and, on
the right, a text link "Talk to an advisor" with an arrow. The strip stacks on phones. No left column. Each question can have a `link` in `home.faq.items` (shown as a text link with an arrow under the open answer): Explore plans (cover, amount), Get a quote, Make a claim, Pay premium; "How do I cancel" has none. The icons per question are in `home.ts` (shield-check, calculator, file-text, life-buoy, credit-card, file-x). An optional soft background picture (`home.faq.background`, 30% opacity) can sit behind the section.

**Dark sections** (the trust block, and the footer) use `footer-bg` with white text, white icons, white `inverse` text
links and a white focus ring (`focus-on-dark`, set by `Section tone="dark"`). The proof numbers are an open
`StatsStrip` (no boxes). These, and the maroon call-to-action card, are the page's heavy blocks.

**Soft pink.** The soft pink `brand-tint` (#FBEEF0) and `brand-tint-strong` (#F4D9DD) are part of the look again, at the designer's request: icon and step tiles, the advisor card, chips, hover and pressed backgrounds (menus, nav, outlined buttons), the circular card arrow on hover, the accordion toggle and the app phone circle. Pink is no longer used as a full-bleed section fill on the home page (the `tint` section tone still exists).

**Testimonials** (alt section, centred heading with the intro "Hear from the families who trust Ceylinco Life"; the cards are white with a 1px border and `shadow-sm`, 32px padding) show three equal cards with a maroon quote mark and the quote at the
top and the profile (48px avatar, name, descriptor) pinned to the bottom, equal height. The avatar is a photo when the content file gives `avatar`, otherwise a neutral tile. "Show more reviews" (secondary button) expands the section in place: three more reviews (six in all) open with a 200ms height and fade transition (ease-out, no bounce or scale; instant with reduced motion, using the accordion's grid-rows technique), keyboard focus moves to the first new review, and the button becomes "Show fewer reviews" (collapses back to three, scrolls to the top of the section and focuses its heading) beside the text link "Read all reviews" with an arrow (`readAll` in `home.testimonials`; it points to the placeholder Testimonials page until the real address is given). The toggle has `aria-expanded` and `aria-controls`, the extra reviews are `inert` while collapsed, and a hidden live region announces "Showing 3 of 6 reviews" or "Showing all 6 reviews". There is no carousel. If a testimonials or stories page is added later, the
button can become a link to it.

**News bento grid.** From 900px (the `bento` breakpoint, `--breakpoint-bento`): a 12-column grid with a 24px gap and two equal rows of
`--size-news-row` (15rem, 240px; the `auto-rows-news` utility, so the cards carry no fixed heights). The featured card spans
7 columns and both rows; two small cards each span 5 columns and one row, so the featured card's bottom edge and the second
small card's bottom edge line up. The grid edges are the section container's edges. All cards: white, 24px radius, 1px
border, sm shadow, 16px inner padding, photo inset with a 12px radius. Featured: the photo takes all the remaining height
(object-fit cover), then date (14px), 8px of space and a 24px semibold headline (16px padding all round, 16px above the text); the circular arrow sits bottom right and the text has
right padding so it never overlaps. Small: a photo about 40% wide filling the card height (never under 112px), and a text
column (20px from the photo, 8px top, bottom and right of inner space, 12px minimum between date and headline), the date at the top and an 18px semibold headline at the bottom; no arrow. Headlines are never
truncated (no line clamp, no ellipsis). Each news item can set `image.focus` in `home.ts` (an object-position such as "50% 30%")
so faces are not cut off. Below 900px: one column (featured card with a 16:9 photo first, then the small cards stacked with
the photo on the left). Header: the heading on the left and "View all news" with an arrow on the right, centred on one row.

**Addresses and short pairs.** The footer address is stored as three lines in `src/content/footer.ts` and rendered in an `<address>` with one block-level span per line (`text-balance`, no `<br>`); "106 Havelock" and "Colombo 5" use a non-breaking space so a number never wraps alone. The phone number "(011) 246 1461" and the times "8.30 am" and "5.00 pm" (footer, FAQ strip, advisor card) are joined the same way. Where an address must be one line, join the lines with ", " and keep the non-breaking spaces.

**Dark footer.** Background `footer-bg` (#1F1D21), headings `footer-text`, links
`footer-muted` that turn `footer-text` with the animated underline on hover, light focus
ring. The logo file has dark lettering, so it sits on a white 12px chip (there
is no reversed logo and the file is never edited or recoloured). Social links are
44px outlined circles (`footer-border`) with light glyphs from `simple-icons`,
which is pinned to exactly 13.21.0 and must NOT be upgraded (newer versions
removed LinkedIn). The bottom bar is separated by a `footer-border` line. The
closing call-to-action is a rounded maroon card on an off-white (alt) section, so there is
light space between the maroon and the dark footer and the two never read as one
heavy block.

**Chat button.** White with a maroon icon (not filled), fixed bottom right,
below the header and overlays. The footer keeps space free at its very bottom so
the button never covers a link.

**Neutrals.** `ink` (text), `ink-muted` (secondary text and disabled labels, at least 5.9:1 on every light surface),
three surfaces (`surface` white, `surface-alt` the alternate band, `surface-sunken` wells and disabled fields), the
soft pink `brand-tint` pair (see Soft pink), `border` (decorative lines and card edges), `border-strong` (control
boundaries and the dotted step line), and the footer greys. Hover and selected states are soft pink with a maroon
title. Small muted text must pass 4.5:1 (`npm run check:contrast`).

## 12. Installable app (PWA)

The site is a progressive web app: on phones and tablets it can be added to the home screen and opens like an app. The
desktop design is not changed by any of this.

- **Manifest** (`src/app/manifest.ts`, served at `/manifest.webmanifest`): name and short name "Ceylinco Life", `start_url`
  "/", `display: standalone`. `theme_color` is `brand` (#790011) and `background_color` is `surface` (white); both are read
  from `tokens.css` through `colourToken()` in `src/lib/tokens.ts`, so no hex lives outside the token file. Icons: 192 and
  512 (any) and a 512 maskable (logo on white, inside the safe zone), plus the Apple touch icon, all in `public/icons`.
  Re-create them with `node scripts/make-pwa-icons.mjs`.
- **Service worker** (`public/sw.js`, registered by `PwaRegister` in production only). Saves static files (scripts, styles,
  fonts, images, icons) and public marketing pages as they are visited; the offline page and the home page are saved at
  install. Pages: network first, saved copy when offline. With no connection and no saved copy the visitor is sent to
  `/offline?from=<page>`, and "Try again" goes back to that page. **It never saves, and never intercepts, the customer
  portal, payments, accounts, sign-in, forms, search or API routes** (the `NEVER_CACHE` list at the top of `sw.js`:
  `/api /portal /customer /login /signin /sign-in /account /my- /pay /payment /checkout /get-a-quote /search`), any address
  with a query string, any request with an `Authorization` header, any non-GET request, other websites, and any response
  the server marks `private`, `no-store`, `Set-Cookie` or `Vary: Cookie`. When a real authenticated route is added, add its
  address start to `NEVER_CACHE` and bump `VERSION`.
- **Bottom bar** (`BottomNav`): shows at **768px and below** (hidden from 769px up, token `--breakpoint-bar`), in a normal
  browser tab and in the installed app alike; it does not depend on display mode. Home, Products, Pay, Quote and
  More (a three-dot icon; More opens the full-screen menu and is the only way to open it on phones). 64px tall (`--size-bottom-nav`) plus the home-indicator safe area, white, 1px grey
  top border and a soft upward shadow (`--shadow-up`), labels 12px (`text-tab`, bottom bar and the hero counter only). Five equal columns with a 24px icon area and a 16px label area, so icons and labels line up; every label is one line (nowrap, ellipsis as a safety net, checked down to 320px). The Pay link's spoken name is "Pay premium online", and the Quote tab (a document icon, link to the quote page) is read out as "Get a quote"; Claims is not a tab and stays in the menu under Claims & Support. The
  current tab is maroon with a 2px bar on top; inactive tabs are `ink-muted`, pressed tabs change colour (no scale). It is `z-dropdown`, ABOVE the header's full-screen
  menu (`z-sticky`), so while the menu is open "More" shows the active look (and the current page goes grey), with `aria-expanded` and
  `aria-controls`; focus returns to "More" when the menu closes. The menu's last item clears the bar (`pb-above-bar`). The page has matching bottom
  padding, and the chat button, install card and hero controls lift above the bar (the hero controls can pass under it for an instant while the hero scrolls in).
  Pay premium goes to the customer portal link, which is still a `#` placeholder.
- **Phone header** (768px and below): a compact 56px bar with a 1px bottom border (`--size-header-mobile`; the installed app adds the top safe area to
  `--size-header`): the logo on the left (32px high; the existing logo, so its tagline is too small to read until a compact logo is supplied), search and
  language on the right (44px tap targets, 8px apart). There is NO menu button on phones. From 769px to the `nav` breakpoint (1152px) the header shows the
  filled "Pay premium online" button and the menu button instead, because there is no bottom bar there. The menu (opened from "More" on phones, from the
  menu button on tablets) is the full-screen accordion (About Us, Products, Claims & Support). On phones it has its own close button at the top, closes on
  Esc, traps focus and locks the page scroll; it stays above the page but below the bottom bar. Its order on phones: the close button, the accordion (About Us, Products,
  Claims & Support), then two full-width buttons 12px apart at the end of the scrolling content ("Pay premium online" filled, "Get a quote" outlined). There is no
  language control in the phone menu (the header has it); from 769px the menu keeps its order: Get a quote, language, accordion.
- **Add to home screen card** (`InstallPrompt`): phones and tablets only, from the second visit, never in the installed app (it checks display mode only to avoid asking someone who has already installed).
  Uses `beforeinstallprompt` where the browser has it (Chrome and Edge on Android); Safari on iPhone has no such event, so
  no card is shown there. "Not now" (or installing) keeps it quiet for 30 days. All text is in `src/content/pwa.ts`.
- **Offline page and loading states**: `/offline` (tinted icon tile, heading, one line of help, "Try again" primary button,
  "Go to the home page" text link) and `Skeleton` (`@/components/ui`; `surface-sunken` blocks, 12px radius, a gentle pulse
  that stops for reduced motion) used by `src/app/loading.tsx`.
- **Safe areas**: the page uses `viewport-fit=cover`. Fixed elements use the utilities in `globals.css`: `pt-safe` (header),
  `pb-safe` (bottom bar), `fixed-corner` (chat button) and `fixed-install` (install card), all based on
  `env(safe-area-inset-*)`.
- **No hover-only states**: every `hover:` style has a matching `active:` (or `group-active:`) and `focus-visible:` style, so
  touch and keyboard users see the same feedback. Hover itself stays wrapped in `(hover: hover)`.
- **Mobile motion**: at 768px and below the scroll reveal rises 12px instead of 20px (the token changes, not the component).
  Under `prefers-reduced-motion` every duration and distance token is zero and the numbers show their final value.
- **Checks**: `npm run check:contrast` includes the bottom bar pairs. Lighthouse is run by hand (see the report in the
  project notes), not in `npm run check`.

### Text case review toggle (sentence case / title case)
A review tool, not a feature for visitors. A small "Aa" button (`CaseToggle`, in the hero's top right corner: 32px circle in a 44px tap target,
`--color-hero-control`, 70% opacity and 100% on hover and keyboard focus, 16px in from the corner, 24px from 769px) switches the UI text between sentence
case and title case. It exists only in development or when the address has `?review=1` (remembered for the visit), never in the installed app
(`display-mode: standalone`) and never for normal visitors in production. It is `aria-pressed` with the label "Text case: sentence. Switch to title case."
and a `title` tooltip. The mode is kept in `localStorage` (`cl:case`, in try / catch); a tiny script in the `<head>` marks `<html data-case-mode>` before
the first paint and the flagged text stays hidden until the mode is applied (2 second safety net), so there is no flash.

- **One source of truth:** the content files hold the text as written (sentence case). `toTitleCase()` in `src/lib/case.ts` works out title case from it.
  It is NOT `text-transform: capitalize`. Every word is capitalised except a, an, the, and, but, or, for, nor, in, on, at, to, of, by, up and as, unless it is
  the first or last word; hyphenated words capitalise both parts; only the first letter of a word is touched. In a question that ends with a small word
  ("What are you looking for?") that word stays lower case, so it becomes "What Are You Looking for?".
- **Exceptions:** `CASE_EXCEPTIONS` in `src/lib/case.ts` keeps acronyms, brand names and proper nouns as written (CSR, FAQ, EN, Ceylinco Life, Ceylife Digital,
  App Store, Google Play, AppGallery, Huawei, Life Rewards, Family Savari, Pranama Scholarships, Sri Lanka, WhatsApp and others). Add a line to extend it.
- **What changes:** only elements that carry `data-case="ui"` (spread `caseProps` from `src/lib/case.ts`, which also sets `suppressHydrationWarning` because
  the text is rewritten in the browser): headings and section titles, card titles, nav and menu labels (mega menu titles and group headings, the phone menu),
  buttons (`Button`), text links (`TextLink`, including the footer lists), footer column headings and the bottom bar labels. The page is not scanned: only flagged
  elements are rewritten, and a MutationObserver re-applies the mode to flagged elements that appear later.
- **What does not change:** body paragraphs and descriptions, review quotes, customer names and details, news headlines, dates, phone numbers, addresses and
  the all-caps eyebrow labels (they carry no `data-case`). To include news headlines, add `{...caseProps}` to the headline elements in `NewsSection.tsx`.
- **Mixed content:** a few labels are written in title case in the content files (for example "About Us", "Contact Us", "Life Insurance", "Retirement Plans",
  "Medical Plans", "Group Insurance", "Ceylife Digital App"), so "sentence" mode shows them as written.

## 13. Do's and don'ts

**Do**
- Start from existing components and tokens; add a token before adding a value.
- Keep most of a screen white and off-white; let maroon be the small accent.
- Use generous spacing and 16-18px body text.
- Pair status colours with an icon or words.
- Run `npm run check` before finishing.

**Don't**
- Don't use `#000`, `black`, `bg-black` or black shadows.
- Don't write raw hex, `px` values, `z-50`, `p-[13px]`, `bg-[#...]`.
- Don't use `border` colour for input or button boundaries (use `border-strong`).
- Don't use `className` to restyle colour, radius or shadow on components.
- Don't put a second filled maroon button next to the primary one.
- Don't add full-bleed maroon sections or heavy decorative shapes. The only maroon block is the closing call-to-action card.
- Don't put maroon text, links or icons on a dark section (use `inverse` and white).
- Don't add arrows beyond the two allowed places (see the Arrow rule).
- Don't remove focus outlines or shrink tap targets below 44px.
- Don't add font weights other than 400, 500, 600, 700.
- Don't use Tailwind's default width names such as `max-w-lg` or `max-w-xl`: the theme wipes them, so they produce no CSS and do nothing. Use the container tokens (`max-w-prose`, `max-w-page`, `max-w-faq`, ...) or add one.

## 14. Accessibility (WCAG 2.2 AA)

What is in place, so new work keeps it:

- **Landmarks and structure.** A skip link ("Skip to main content") is the first focusable element and goes to `#main-content` on every page (also the offline page and the
  404 page, `src/app/not-found.tsx`). One `<main>`, one h1 per page, headings in order. Landmarks: header, nav "Main" (desktop and the menu), nav "Mobile" (the phone
  bottom bar), the footer ("Site footer", with its own labelled navs) and "Chat" (the floating chat button). Sections are regions named by their heading. Two landmarks
  of the same kind never share a name (the news carousel is "Latest news stories", the section "Latest news"). `<html lang>` follows the language menu, and the language
  names carry their own `lang`.
- **Focus.** One ring everywhere: 2px solid `--color-focus` with a 2px offset (the `:focus-visible` rule in `globals.css`; white on dark sections via `focus-on-dark`).
  Inputs use the same ring plus the maroon border. Nothing removes the outline without a replacement.
- **Overlays.** The phone and tablet menu and the search dialog trap Tab, close on Esc and return focus to the button that opened them (More, the menu button, or Search).
  While one is open the rest of the page is `inert` (not focusable, not clickable, hidden from screen readers) and does not scroll. `useFocusTrap` (header/hooks.ts)
  does this; an element with `data-inert-exempt` stays active (the bottom bar, so "More" can close the menu).
- **Menus.** Mega menus: Enter or Space opens, ArrowDown moves in, arrows, Home and End move, Esc closes and returns to the button, Tab moves on.
  The language popover (`aria-haspopup="menu"`): Enter, Space, ArrowDown or ArrowUp opens it and focus lands on the current language; arrows, Home and End move,
  Enter chooses, Esc closes and returns focus. A menu that must receive focus when it opens is made visible at once (only its opacity fades in), because focus cannot move
  into an element that is still `visibility: hidden`.
- **Names.** Icon-only controls have a label (IconButton requires one); decorative icons are `aria-hidden`. The logo links are "Ceylinco Life, home page". The tablet
  menu button is always "Menu" (`aria-expanded` says whether it is open). A link that opens a new tab says so ("..., opens in a new tab": the chat button and the store
  badges, once they have a real address). A news card link is named by its own text, the date and the headline in the order shown, so the visible text is part of the
  name (WCAG 2.5.3); its thumbnail is decorative (`alt=""`) so the photo’s description is not repeated in the name. Dates are in `<time>`.
- **Install card.** A labelled region that does not take focus on its own; when it closes with the keyboard, focus goes back to where it came from.
- **Motion.** Every duration, distance and the smooth scroll are tokens that drop to about zero under `prefers-reduced-motion`; the hero slideshow does not run then.
- **Checks.** `npm run check` covers contrast and tokens. For a full pass run Lighthouse (accessibility) and axe-core on the home page at 1440px and 390px, with the
  phone menu, a mega menu and the search dialog open, and walk the page with the Tab key. Open items are listed in the last accessibility report.

## 15. Known exceptions

- The logo file contains pure black in its small lettering. It is used as
  supplied, as an agreed exception for the logo only.
