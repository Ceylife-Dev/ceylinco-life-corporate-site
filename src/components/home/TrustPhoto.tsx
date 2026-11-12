import Image from "next/image";

/**
 * The photo in "Why families trust us": a custom skewed shape with rounded corners, plus two red outlines of the same kind of
 * shape peeking out behind it, exactly as drawn in the Figma design (frame "Frame 10": a 554 x 359 box).
 *
 * How it is built (no border-radius, no rectangular crop):
 *  - the whole thing is laid out in a box with the design's 554 : 359 ratio (`aspect-554/359` with full width, so its height is
 *    always derived from its width and never fixed), so it scales with the column and everything inside keeps its place;
 *  - the PHOTO is a next/image inside a box that is positioned as a percentage of that ratio box and cut to the shape with
 *    an SVG clipPath in objectBoundingBox units (the path below is the exported "Rectangle 1" outline, divided by its own
 *    width and height, so it scales to any size);
 *  - the two OUTLINES are drawn in one SVG layer behind the photo, positioned the same way. Each outline is the shape's path
 *    stroked 16 units wide and clipped to the shape itself, which leaves the 8-unit inside stroke the design has (so the
 *    stroke thins a little on small screens, in proportion with everything else).
 * The outline colour is the `brand-line` token (via `text-brand-line` and currentColor). The outlines are decoration only.
 *
 * All numbers are in the design's frame units. To change the shape, replace the three paths and the numbers next to them.
 */

// The photo shape, measured from its own top-left corner: 532.707 x 354.792 (design units).
const PHOTO_WIDTH = 532.707;
const PHOTO_HEIGHT = 354.792;
const PHOTO_PATH =
  "M69.426 63.159 C75.323 43.24 92.921 29.043 113.636 27.492 L478.97 0.143 C509.527 -2.145 534.934 23.341 532.552 53.891 L512.679 308.68 C510.65 334.707 488.937 354.792 462.831 354.792 L50.032 354.792 C16.614 354.792 -7.398 322.641 2.089 290.598 L69.426 63.159 Z";

// The two outlines, drawn in the frame's own coordinates.
const OUTLINE_A =
  "M55.519 142.63 C62.525 124.548 79.355 112.148 98.701 110.814 L366.877 92.319 C398.929 90.108 424.718 118.268 419.704 150.003 L390.789 333.026 C386.897 357.665 365.44 375.665 340.5 375.216 L39.591 369.791 C4.838 369.164 -18.688 334.145 -6.13 301.734 L55.519 142.63 Z";
const OUTLINE_B =
  "M209.704 37.13 C216.71 19.048 233.54 6.648 252.886 5.314 L521.062 -13.181 C553.114 -15.392 578.903 12.768 573.889 44.503 L544.974 227.526 C541.082 252.165 519.625 270.165 494.685 269.716 L193.776 264.291 C159.023 263.664 135.496 228.645 148.055 196.234 L209.704 37.13 Z";
const OUTLINE_STROKE = 16; // 8 units inside the shape; the other 8 are clipped away

// Where things sit, as percentages of the 554 x 359 frame box (the ratio is the aspect-554/359 class on the box below).
const photoBox = { left: 3.0537, top: 1.1722, width: 96.1569, height: 98.8278 };
// The outline layer's own view box (design units) and its place in the frame box.
const outlineView = { x: -9.552, y: -13.303, width: 584.067, height: 388.527 };
const outlineBox = { left: -1.7242, top: -3.7056, width: 105.4308, height: 108.2243 };

type TrustPhotoProps = {
  src: string;
  /** Describes the photo for screen readers. */
  alt: string;
};

export function TrustPhoto({ src, alt }: TrustPhotoProps) {
  return (
    <div className="relative aspect-554/359 w-full">
      {/* The box has the design's ratio; the three layers below are positioned inside it as percentages. */}

      {/* The outlines, behind the photo. */}
      <svg
        aria-hidden="true"
        viewBox={`${outlineView.x} ${outlineView.y} ${outlineView.width} ${outlineView.height}`}
        className="absolute text-brand-line"
        style={{ left: `${outlineBox.left}%`, top: `${outlineBox.top}%`, width: `${outlineBox.width}%`, height: `${outlineBox.height}%` }}
      >
        <defs>
          <clipPath id="trust-outline-a">
            <path d={OUTLINE_A} />
          </clipPath>
          <clipPath id="trust-outline-b">
            <path d={OUTLINE_B} />
          </clipPath>
        </defs>
        <path d={OUTLINE_A} fill="none" stroke="currentColor" strokeWidth={OUTLINE_STROKE} clipPath="url(#trust-outline-a)" />
        <path d={OUTLINE_B} fill="none" stroke="currentColor" strokeWidth={OUTLINE_STROKE} clipPath="url(#trust-outline-b)" />
      </svg>

      {/* The photo, cut to the shape. The soft fill behind it only shows if the photo file is missing or still loading, so the shape never looks empty. */}
      <div
        className="absolute bg-footer-border"
        style={{
          left: `${photoBox.left}%`,
          top: `${photoBox.top}%`,
          width: `${photoBox.width}%`,
          height: `${photoBox.height}%`,
          clipPath: "url(#trust-photo-clip)",
        }}
      >
        <Image src={src} alt={alt} fill sizes="(min-width: 1024px) 560px, 90vw" className="object-cover object-center" />
      </div>

      {/* The clip path itself: objectBoundingBox units, so it scales with the box it is applied to. */}
      <svg aria-hidden="true" width="0" height="0" className="absolute">
        <defs>
          <clipPath id="trust-photo-clip" clipPathUnits="objectBoundingBox">
            <path d={PHOTO_PATH} transform={`scale(${1 / PHOTO_WIDTH} ${1 / PHOTO_HEIGHT})`} />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}
