"use client";

import type { HTMLInputTypeAttribute } from "react";
import type { FieldErrors, FieldPath, FieldValues, UseFormRegister } from "react-hook-form";

import { Input } from "@/components/ui/input";

export type AuthFieldSpec = {
  label: string;
  type: HTMLInputTypeAttribute;
  placeholder: string;
  autoComplete: string;
  inputMode?: "email" | "url" | "text";
};

type AuthFieldListProps<TValues extends FieldValues> = {
  fields: Record<string, AuthFieldSpec>;
  register: UseFormRegister<TValues>;
  errors: FieldErrors<TValues>;
};

export function AuthFieldList<TValues extends FieldValues>({
  fields,
  register,
  errors,
}: AuthFieldListProps<TValues>) {
  return (
    <div className="space-y-4">
      {Object.entries(fields).map(([fieldName, field]) => {
        const name = fieldName as FieldPath<TValues>;
        const fieldError = errors[fieldName as keyof TValues];
        const message = fieldError && "message" in fieldError ? fieldError.message : undefined;
        const errorMessage = typeof message === "string" ? message : undefined;
        const inputId = `auth-${fieldName}`;

        return (
          <div key={fieldName} className="space-y-2">
            <label htmlFor={inputId} className="text-sm font-semibold text-foreground">
              {field.label}
            </label>
            <Input
              id={inputId}
              type={field.type}
              inputMode={field.inputMode}
              autoComplete={field.autoComplete}
              placeholder={field.placeholder}
              aria-invalid={Boolean(errorMessage)}
              aria-describedby={errorMessage ? `${inputId}-error` : undefined}
              className="h-11 rounded-xl bg-background px-3.5"
              {...register(name)}
            />
            {errorMessage ? (
              <p id={`${inputId}-error`} className="text-sm text-destructive" role="alert">
                {errorMessage}
              </p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
