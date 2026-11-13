import { CircleAlert } from "lucide-react";
import { useId, type ReactNode } from "react";
import { cn } from "./cn";

export type FieldProps = {
  /** Always visible. Every field needs a label. */
  label: string;
  /** Short hint shown under the field. */
  help?: string;
  /** Error message. When set, the field turns red and is marked invalid. */
  error?: string;
  /** Shows "(optional)" after the label. */
  optional?: boolean;
  /** Pass the id of the control if you need to control it; otherwise one is generated. */
  id?: string;
};

type ControlProps = {
  id: string;
  "aria-describedby"?: string;
  "aria-invalid"?: true;
};

/** Look shared by Input and Select (default, hover, focus, error, disabled). */
export const fieldControlClasses = cn(
  "block w-full min-h-12 rounded-control border border-border-strong bg-surface px-4 text-base text-ink",
  "placeholder:text-ink-muted transition",
  "enabled:hover:border-ink-muted",
  // Focus: brand border + soft maroon ring, plus the site-wide focus ring (2px, 2px offset, --color-focus: the global :focus-visible rule in globals.css).
  "focus:border-brand focus:shadow-focus",
  // Error
  "aria-invalid:border-error aria-invalid:focus:border-error aria-invalid:focus:shadow-focus-error",
  // Disabled
  "disabled:cursor-not-allowed disabled:border-border disabled:bg-surface-sunken disabled:text-ink-muted",
);

/**
 * Label + control + help text + error message, wired together for screen readers.
 * Input and Select both use this; use it for any new form control.
 */
export function Field({
  label,
  help,
  error,
  optional,
  id,
  className,
  children,
}: FieldProps & { className?: string; children: (control: ControlProps) => ReactNode }) {
  const generatedId = useId();
  const controlId = id ?? generatedId;
  const helpId = `${controlId}-help`;
  const errorId = `${controlId}-error`;
  const describedBy = [error ? errorId : null, help ? helpId : null].filter(Boolean).join(" ");

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={controlId} className="text-base font-medium text-ink">
        {label}
        {optional && <span className="font-normal text-ink-muted"> (optional)</span>}
      </label>

      {children({
        id: controlId,
        "aria-describedby": describedBy || undefined,
        "aria-invalid": error ? true : undefined,
      })}

      {help && (
        <p id={helpId} className="text-sm text-ink-muted">
          {help}
        </p>
      )}

      {/* The live region stays in the page so new errors are announced politely. */}
      <div aria-live="polite">
        {error && (
          <p id={errorId} className="flex items-start gap-2 text-sm font-medium text-error">
            <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
            <span>{error}</span>
          </p>
        )}
      </div>
    </div>
  );
}
