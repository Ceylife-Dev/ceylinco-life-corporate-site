import { ChevronDown } from "lucide-react";
import type { ComponentProps } from "react";
import { Field, fieldControlClasses, type FieldProps } from "./Field";
import { cn } from "./cn";

export type SelectProps = FieldProps &
  Omit<ComponentProps<"select">, "id" | "className"> & {
    /** Applied to the whole field (label + select + messages): layout only. */
    className?: string;
  };

/**
 * Select with label, help text and error message.
 * It is a real native <select>, which gives the best keyboard, screen reader
 * and mobile behaviour (including Sinhala and Tamil keyboards).
 *
 *   <Select label="Product">
 *     <option value="life">Life Insurance</option>
 *   </Select>
 */
export function Select({ label, help, error, optional, id, className, children, ...selectProps }: SelectProps) {
  return (
    <Field label={label} help={help} error={error} optional={optional} id={id} className={className}>
      {(control) => (
        <div className="relative">
          <select {...selectProps} {...control} className={cn(fieldControlClasses, "appearance-none pr-12")}>
            {children}
          </select>
          {/* Decorative chevron; clicks pass through to the select underneath. */}
          <ChevronDown
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2 text-ink-muted"
          />
        </div>
      )}
    </Field>
  );
}
