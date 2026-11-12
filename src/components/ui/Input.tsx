import type { ComponentProps } from "react";
import { Field, fieldControlClasses, type FieldProps } from "./Field";
import { cn } from "./cn";

export type InputProps = FieldProps &
  Omit<ComponentProps<"input">, "id" | "className"> & {
    /** Applied to the whole field (label + input + messages): layout only. */
    className?: string;
  };

/**
 * Text input with label, help text and error message.
 *
 *   <Input label="Full name" help="As on your NIC" />
 *   <Input label="Email" type="email" error="Enter an email like name@example.com" />
 */
export function Input({ label, help, error, optional, id, className, ...inputProps }: InputProps) {
  return (
    <Field label={label} help={help} error={error} optional={optional} id={id} className={className}>
      {(control) => <input {...inputProps} {...control} className={cn(fieldControlClasses)} />}
    </Field>
  );
}
