import { siFacebook, siInstagram, siLinkedin, siYoutube } from "simple-icons";

/**
 * Social network glyphs, taken from the simple-icons package (free to use, CC0).
 *
 * IMPORTANT: simple-icons is pinned to exactly 13.21.0 in package.json and must
 * NOT be upgraded: LinkedIn's glyph was removed from newer versions, so an
 * upgrade would break the LinkedIn icon.
 */
const glyphs = {
  facebook: siFacebook,
  linkedin: siLinkedin,
  youtube: siYoutube,
  instagram: siInstagram,
};

export type SocialName = keyof typeof glyphs;

/** Decorative: the link around it carries the accessible name. Takes its colour from the text colour. */
export function SocialIcon({ name }: { name: SocialName }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="size-5">
      <path d={glyphs[name].path} />
    </svg>
  );
}
