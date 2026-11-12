/** Joins class names, skipping anything falsy:  cn("a", isOn && "b")  ->  "a b" */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
