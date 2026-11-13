import { MessageCircle } from "lucide-react";
import { AppLink } from "@/components/ui";
import { footer } from "@/content/footer";
import { site } from "@/content/site";

/**
 * Floating chat button, bottom right on every page.
 * It is white with a maroon icon (not filled), so the page still has one filled
 * button at a time. It sits below the header and overlays in the stacking order.
 * The footer keeps space free at its very bottom so this never covers a link.
 */
export function ChatButton() {
  const { label, href } = footer.chat;
  // While the address is still the "#" placeholder the link stays in the same tab (and says nothing about a new tab).
  const realAddress = href !== "#";
  return (
    <aside aria-label="Chat">
      <AppLink
        href={href}
        target={realAddress ? "_blank" : undefined}
        aria-label={realAddress ? `${label}, ${site.opensInNewTab}` : label}
        className="fixed-corner fixed z-raised inline-flex size-14 items-center justify-center rounded-control border border-border-strong bg-surface text-brand shadow-md transition hover:bg-brand-tint hover:shadow-lg focus-visible:bg-brand-tint focus-visible:ring-2 focus-visible:ring-surface active:bg-brand-tint-strong [&_svg]:size-6"
      >
        <MessageCircle aria-hidden="true" />
      </AppLink>
    </aside>
  );
}
