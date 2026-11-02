"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, BookOpen, LoaderCircle } from "lucide-react";

import { AuthFieldList, type AuthFieldSpec } from "@/components/auth/AuthFieldList";
import { SiteLogo } from "@/components/layout/SiteLogo";
import { Button } from "@/components/ui/button";
import { useToastManager } from "@/components/ui/toast";
import { authClient, signUp } from "@/lib/auth-client";
import { registerSchema, type RegisterValues } from "@/lib/validations";

const registerFields: Record<keyof RegisterValues, AuthFieldSpec> = {
  name: {
    label: "Your name",
    type: "text",
    placeholder: "How should we address you?",
    autoComplete: "name",
  },
  email: {
    label: "Email address",
    type: "email",
    placeholder: "you@example.com",
    autoComplete: "email",
    inputMode: "email",
  },
  image: {
    label: "Photo URL (optional)",
    type: "url",
    placeholder: "https://example.com/photo.jpg",
    autoComplete: "url",
    inputMode: "url",
  },
  password: {
    label: "Password",
    type: "password",
    placeholder: "Create a password",
    autoComplete: "new-password",
  },
  confirmPassword: {
    label: "Confirm password",
    type: "password",
    placeholder: "Enter your password again",
    autoComplete: "new-password",
  },
};

export function RegisterForm() {
  const router = useRouter();
  const toastManager = useToastManager();
  const [googlePending, setGooglePending] = useState(false);
  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", image: "", password: "", confirmPassword: "" },
  });

  async function onSubmit(values: RegisterValues) {
    const { confirmPassword, ...credentials } = values;
    void confirmPassword;

    try {
      const result = await signUp.email({ ...credentials, image: credentials.image || undefined, callbackURL: "/signin" });
      if (result.error) {
        toastManager.add({
          type: "error",
          title: "Couldn’t create your account",
          description: result.error.message || "Please review your details and try again.",
        });
        return;
      }

      toastManager.add({
        type: "success",
        title: "Your account is ready",
        description: "Sign in to start exploring the BookNook shelves.",
      });
      router.replace("/signin");
      router.refresh();
    } catch {
      toastManager.add({
        type: "error",
        title: "Couldn’t create your account",
        description: "The library couldn’t complete registration. Please try again.",
      });
    }
  }

  async function signUpWithGoogle() {
    setGooglePending(true);
    try {
      const result = await authClient.signIn.social({ provider: "google", callbackURL: "/" });
      if (result.error) {
        toastManager.add({ type: "error", title: "Google sign up failed", description: result.error.message });
        setGooglePending(false);
      }
    } catch {
      toastManager.add({ type: "error", title: "Google sign up failed", description: "Please try again." });
      setGooglePending(false);
    }
  }

  const isSubmitting = form.formState.isSubmitting || googlePending;

  return (
    <section className="keep-content-center flex w-full flex-1 items-center justify-center py-10 sm:py-14">
      <div className="w-full max-w-lg rounded-3xl border border-border/75 bg-card/85 p-6 shadow-xl shadow-foreground/5 backdrop-blur-sm sm:p-8">
        <div className="flex justify-center"><SiteLogo /></div>
        <div className="mt-7 text-center">
          <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <BookOpen className="size-6" aria-hidden="true" />
          </span>
          <h1 className="mt-4 font-heading text-3xl font-semibold tracking-tight text-foreground">Join the shared shelf</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Create an account and make room for your next read.</p>
        </div>

        <form className="mt-7 space-y-5" onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <AuthFieldList fields={registerFields} register={form.register} errors={form.formState.errors} />
          <p className="-mt-1 text-xs leading-5 text-muted-foreground">
            Use at least 6 characters, with one uppercase and one lowercase letter.
          </p>
          <Button type="submit" size="lg" className="h-11 w-full rounded-full" disabled={isSubmitting}>
            {form.formState.isSubmitting ? <LoaderCircle className="animate-spin" aria-hidden="true" /> : null}
            Create account <ArrowRight aria-hidden="true" />
          </Button>
        </form>

        <div className="relative my-5 flex items-center justify-center">
          <span className="absolute inset-x-0 h-px bg-border" />
          <span className="relative bg-card px-3 text-xs font-medium text-muted-foreground">or continue with</span>
        </div>

        <Button type="button" variant="outline" className="h-11 w-full rounded-full bg-background" onClick={signUpWithGoogle} disabled={isSubmitting}>
          {googlePending ? <LoaderCircle className="animate-spin" aria-hidden="true" /> : <GoogleMark />}
          Continue with Google
        </Button>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account? <Link href="/signin" className="font-semibold text-primary hover:underline">Sign in</Link>
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
