"use client";

import { useState, type HTMLInputTypeAttribute } from "react";
import { Eye, EyeOff } from "lucide-react";
import type { FieldErrors, FieldPath, FieldValues, UseFormRegister } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

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
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});

  return (
    <div className="space-y-4">
      {Object.entries(fields).map(([fieldName, field]) => {
        const name = fieldName as FieldPath<TValues>;
        const fieldError = errors[fieldName as keyof TValues];
        const message = fieldError && "message" in fieldError ? fieldError.message : undefined;
        const errorMessage = typeof message === "string" ? message : undefined;
        const inputId = `auth-${fieldName}`;
        const isPassword = field.type === "password";
        const isPasswordVisible = visiblePasswords[fieldName] ?? false;

        return (
          <div key={fieldName} className="space-y-2">
            <label htmlFor={inputId} className="text-sm font-semibold text-foreground">
              {field.label}
            </label>
            <div className="relative">
              <Input
                id={inputId}
                type={isPassword && isPasswordVisible ? "text" : field.type}
                inputMode={field.inputMode}
                autoComplete={field.autoComplete}
                placeholder={field.placeholder}
                aria-invalid={Boolean(errorMessage)}
                aria-describedby={errorMessage ? `${inputId}-error` : undefined}
                className={cn("h-11 rounded-xl bg-background px-3.5", isPassword && "pr-11")}
                {...register(name)}
              />
              {isPassword ? (
                <button
                  type="button"
                  aria-label={isPasswordVisible ? `Hide ${field.label.toLowerCase()}` : `Show ${field.label.toLowerCase()}`}
                  aria-pressed={isPasswordVisible}
                  onClick={() =>
                    setVisiblePasswords((current) => ({
                      ...current,
                      [fieldName]: !current[fieldName],
                    }))
                  }
                  className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-xl text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring"
                >
                  {isPasswordVisible ? (
                    <EyeOff className="size-4" aria-hidden="true" />
                  ) : (
                    <Eye className="size-4" aria-hidden="true" />
                  )}
                </button>
              ) : null}
            </div>
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
