"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ArrowRight, BookOpen, LoaderCircle } from "lucide-react";

import { AuthFieldList, type AuthFieldSpec } from "@/components/auth/AuthFieldList";
import { SiteLogo } from "@/components/layout/SiteLogo";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { getSafeCallbackUrl } from "@/lib/auth-redirect";
import type { LoginValues } from "@/lib/validations";
import { loginSchema } from "@/lib/validations";
import { useToastManager } from "@/components/ui/toast";

const loginFields: Record<keyof LoginValues, AuthFieldSpec> = {
  email: {
    label: "Email address",
    type: "email",
    placeholder: "you@example.com",
    autoComplete: "email",
    inputMode: "email",
  },
  password: {
    label: "Password",
    type: "password",
    placeholder: "Enter your password",
    autoComplete: "current-password",
  },
};

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toastManager = useToastManager();
  const [googlePending, setGooglePending] = useState(false);
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginValues) {
    const callbackURL = getSafeCallbackUrl(searchParams.get("callbackUrl"));
    try {
      const result = await authClient.signIn.email({ ...values, callbackURL });
      if (result.error) {
        toastManager.add({
          type: "error",
          title: "Sign in failed",
          description: result.error.message || "Check your email and password, then try again.",
        });
        return;
      }

      toastManager.add({ type: "success", title: "Welcome back", description: "You’re signed in to BookNook." });
      router.replace(callbackURL);
      router.refresh();
    } catch {
      toastManager.add({ type: "error", title: "Sign in failed", description: "The library couldn’t sign you in. Please try again." });
    }
  }

  async function signInWithGoogle() {
    setGooglePending(true);
    try {
      const callbackURL = getSafeCallbackUrl(searchParams.get("callbackUrl"));
      const result = await authClient.signIn.social({ provider: "google", callbackURL });
      if (result.error) {
        toastManager.add({ type: "error", title: "Google sign in failed", description: result.error.message });
        setGooglePending(false);
      }
    } catch {
      toastManager.add({ type: "error", title: "Google sign in failed", description: "Please try again." });
      setGooglePending(false);
    }
  }

  const isSubmitting = form.formState.isSubmitting || googlePending;

  return (
    <section className="keep-content-center flex w-full flex-1 items-center justify-center py-10 sm:py-14">
      <div className="w-full max-w-md rounded-3xl border border-border/75 bg-card/85 p-6 shadow-xl shadow-foreground/5 backdrop-blur-sm sm:p-8">
        <div className="flex justify-center"><SiteLogo /></div>
        <div className="mt-8 text-center">
          <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <BookOpen className="size-6" aria-hidden="true" />
          </span>
          <h1 className="mt-4 font-heading text-3xl font-semibold tracking-tight text-foreground">Welcome back</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Sign in and find your way back to the shared shelf.</p>
        </div>

        <form className="mt-7 space-y-5" onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <AuthFieldList fields={loginFields} register={form.register} errors={form.formState.errors} />
          <Button type="submit" size="lg" className="h-11 w-full rounded-full" disabled={isSubmitting}>
            {form.formState.isSubmitting ? <LoaderCircle className="animate-spin" aria-hidden="true" /> : null}
            Sign in <ArrowRight aria-hidden="true" />
          </Button>
        </form>

        <div className="relative my-5 flex items-center justify-center">
          <span className="absolute inset-x-0 h-px bg-border" />
          <span className="relative bg-card px-3 text-xs font-medium text-muted-foreground">or continue with</span>
        </div>

        <Button type="button" variant="outline" className="h-11 w-full rounded-full bg-background" onClick={signInWithGoogle} disabled={isSubmitting}>
          {googlePending ? <LoaderCircle className="animate-spin" aria-hidden="true" /> : <GoogleMark />}
          Google
        </Button>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          New to BookNook? <Link href="/signup" className="font-semibold text-primary hover:underline">Sign up</Link>
        </p>
      </div>
    </section>
  );
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 48 48" className="size-4" aria-hidden="true">
      <path fill="#4285F4" d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.4 9.4 0 0 1-4.1 6.2v5.1h6.6c3.9-3.6 6.1-8.8 6.1-15Z" />
      <path fill="#34A853" d="M24 44c5.5 0 10.1-1.8 13.5-4.8l-6.6-5.1c-1.8 1.2-4.1 2-6.9 2-5.3 0-9.8-3.6-11.4-8.4H5.8v5.3A20 20 0 0 0 24 44Z" />
      <path fill="#FBBC05" d="M12.6 27.7a12 12 0 0 1 0-7.4V15H5.8a20 20 0 0 0 0 18l6.8-5.3Z" />
      <path fill="#EA4335" d="M24 11.9c3 0 5.7 1 7.8 3.1l5.8-5.8C34.1 5.9 29.5 4 24 4A20 20 0 0 0 5.8 15l6.8 5.3c1.6-4.8 6.1-8.4 11.4-8.4Z" />
    </svg>
  );
}
