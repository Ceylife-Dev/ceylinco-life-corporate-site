import { Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import { AppLink, TextLink } from "@/components/ui";
import { footer } from "@/content/footer";
import { site } from "@/content/site";
import { SocialIcon } from "./SocialIcon";
import { caseProps } from "@/lib/case";

/**
 * 12. Footer (dark: warm near-black, never pure black). Logo on a white chip,
 * four columns, then a bottom bar. Shown on every page. The extra space at the
 * very bottom keeps the floating chat button from ever covering a link.
 */
export function Footer() {
  const { columns, contact, bottomBar } = footer;
  return (
    <footer aria-label="Site footer" className="bg-footer-bg text-footer-muted">
      <div className="mx-auto max-w-page px-4 pt-14 pb-28 md:px-6 md:pt-16">
        {/* The logo file has dark lettering, so it sits on a white 12px chip. The file itself is not edited or recoloured. */}
        <AppLink href="/" aria-label={site.homeLinkLabel} className="inline-flex rounded-control bg-surface p-2 focus-visible:outline-footer-text">
          <Image
            src="/images/ceylife-logo.svg"
            alt={site.name}
            width={162}
            height={97}
            unoptimized
            className="h-12 w-auto"
          />
        </AppLink>

        <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h2 {...caseProps} className="text-base font-semibold text-footer-text md:text-base">{column.title}</h2>
              <ul className="mt-3 flex flex-col">
                {column.links.map((link) => (
                  <li key={link.href}>
                    {/* The shared text link, in its footer tone: muted light text that brightens on hover, with the animated line. */}
                    <TextLink href={link.href} tone="light-muted" size="list" className="-ml-2 justify-start">
                      {link.label}
                    </TextLink>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <h2 {...caseProps} className="text-base font-semibold text-footer-text md:text-base">{contact.title}</h2>
            <ul className="mt-3 flex flex-col gap-3.5">
              <li className="flex items-start gap-3">
                <MapPin aria-hidden="true" className="mt-1 size-5 shrink-0" />
                {/* One block-level span per stored line, so the lines always break exactly as written. `text-balance`
                    evens out the wrap if a line is still too long for a very narrow column. */}
                <address className="text-balance not-italic">
                  {contact.address.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
              </li>
              <li className="flex items-start gap-3">
                <Phone aria-hidden="true" className="mt-1 size-5 shrink-0" />
                <span>{contact.phone}</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail aria-hidden="true" className="mt-1 size-5 shrink-0" />
                <span>{contact.email}</span>
              </li>
            </ul>

            {/* Outlined circles (the only circular buttons on the site), light icons, 44px tap area. */}
            <ul aria-label="Social media" className="mt-6 flex flex-wrap gap-3">
              {contact.social.map((link) => (
                <li key={link.label}>
                  <AppLink
                    href={link.href}
                    className="flex size-11 items-center justify-center rounded-full border border-footer-border text-footer-muted transition hover:border-footer-muted hover:text-footer-text focus-visible:border-footer-muted focus-visible:text-footer-text focus-visible:outline-footer-text active:border-footer-muted active:text-footer-text"
                  >
                    <SocialIcon name={link.icon} />
                    <span className="sr-only">{link.label}</span>
                  </AppLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-footer-border pt-6 text-sm">
          <p>{bottomBar.licence}</p>
          <p>{bottomBar.copyright}</p>
          <p>{bottomBar.disclosures}</p>
        </div>
      </div>
    </footer>
  );
}
