import { Logo } from "./Logo";

/**
 * Shown for a split second while the real header loads on routes that Next.js
 * cannot fully prepare in advance. Same height as the header's main bar, so the
 * page does not jump.
 */
export function HeaderFallback() {
  return (
    <div className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-header items-center px-4 py-2 max-bar:h-header-row max-bar:py-0 md:px-6">
        <Logo />
      </div>
    </div>
  );
}
