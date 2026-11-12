import Image from "next/image";
import { AppLink } from "@/components/ui";
import { site } from "@/content/site";

/**
 * The company logo, linked to the home page.
 * The file is used exactly as supplied (162 x 97), so its proportions are kept:
 * we set only the height and let the width follow: 32px on phones (768px and below), 48px from 769px, 56px from the nav breakpoint.
 * There is no compact logo without the tagline yet, so on phones the tagline is too small to read.
 */
export function Logo() {
  return (
    <AppLink href="/" className="inline-flex min-h-touch shrink-0 items-center rounded-control">
      <Image
        src="/images/ceylife-logo.svg"
        alt={site.name}
        width={162}
        height={97}
        loading="eager"
        unoptimized // SVG: already tiny and sharp at every size
        className="h-8 w-auto bar:h-12 nav:h-14"
      />
    </AppLink>
  );
}
