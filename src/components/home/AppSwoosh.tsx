/**
 * The soft pink swoosh behind the app picture: a wide diagonal band, like a leaf, that rises from the bottom left corner of the
 * section to the top right behind the phones (the shape of the Ceylife Digital App landing page), so it bleeds off the left edge
 * of the screen. Decoration only (hidden from screen readers).
 *
 * It is drawn in a box the size of the picture's column, but the shape runs far past the left edge of that box
 * (`overflow-visible`), so it always reaches the edge of the screen; the section clips anything beyond it (`overflow-clip`). The shape stays inside the right edge of the column, so it never reaches the text beside it.
 * The colour is the soft pink token (`brand-tint`); nothing else is drawn.
 */
export function AppSwoosh() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 1000 1000"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 size-full overflow-visible fill-brand-tint"
    >
      <path d="M -1400 1718 C -1000 1420 -600 1080 -302 767 C -190 650 -60 540 63 451 C 230 330 400 230 587 150 C 700 95 800 40 870 -25 C 925 -75 990 -45 980 25 C 965 115 930 215 870 300 C 760 430 590 620 380 790 C 220 900 80 980 -95 1043 C -500 1180 -1000 1500 -1400 1896 Z" />
    </svg>
  );
}
