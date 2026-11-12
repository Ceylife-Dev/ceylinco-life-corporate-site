import { cn } from "./cn";

type SkeletonProps = {
  /** Layout only: width and height, for example "h-6 w-2/3". */
  className?: string;
};

/**
 * A placeholder block shown while content loads: a soft grey box (`surface-sunken`) with a 12px radius. It pulses gently
 * from tablet up; on phones it is still (less movement), and with reduced motion it never moves. It is hidden from screen
 * readers (put aria-busy and a visible or screen-reader-only "Loading" on the container instead).
 */
export function Skeleton({ className }: SkeletonProps) {
  return <div aria-hidden="true" className={cn("rounded-control bg-surface-sunken md:motion-safe:animate-pulse", className)} />;
}
