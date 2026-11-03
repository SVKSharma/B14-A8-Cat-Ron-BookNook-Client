"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ImagePlus,
  Link2,
  LoaderCircle,
  TriangleAlert,
  Upload,
  UserRound,
} from "lucide-react";

import { AuthFieldList, type AuthFieldSpec } from "@/components/auth/AuthFieldList";
import { SiteLogo } from "@/components/layout/SiteLogo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToastManager } from "@/components/ui/toast";
import { authClient, signUp } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { registerSchema, type RegisterValues } from "@/lib/validations";

const identityFields: Record<"name" | "email", AuthFieldSpec> = {
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
};

const passwordFields: Record<"password" | "confirmPassword", AuthFieldSpec> = {
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

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

type ImageMode = "url" | "upload";

export function RegisterForm() {
  const router = useRouter();
  const toastManager = useToastManager();
  const [googlePending, setGooglePending] = useState(false);
  const [imageMode, setImageMode] = useState<ImageMode>("url");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const localPreviewUrlRef = useRef<string | null>(null);
  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", image: "", password: "", confirmPassword: "" },
  });
  const imageValue = useWatch({ control: form.control, name: "image" }) ?? "";
  const imageError = typeof form.formState.errors.image?.message === "string"
    ? form.formState.errors.image.message
    : undefined;
  const urlPreview = /^https?:\/\//i.test(imageValue.trim()) ? imageValue.trim() : null;
  const uploadPreviewUrl = uploadedImageUrl ?? localPreviewUrl;
  const profilePreviewUrl = imageMode === "url" ? urlPreview : uploadPreviewUrl;

  useEffect(() => {
    return () => {
      if (localPreviewUrlRef.current) {
        URL.revokeObjectURL(localPreviewUrlRef.current);
        localPreviewUrlRef.current = null;
      }
    };
  }, []);

  function clearLocalPreview() {
    if (localPreviewUrlRef.current) {
      URL.revokeObjectURL(localPreviewUrlRef.current);
      localPreviewUrlRef.current = null;
    }
    setLocalPreviewUrl(null);
  }

  function changeImageMode(nextMode: ImageMode) {
    if (nextMode === imageMode) return;

    setImageMode(nextMode);
    setSelectedImage(null);
    setUploadedImageUrl(null);
    setUploadError(null);
    clearLocalPreview();
    form.clearErrors("image");
    form.setValue("image", "", { shouldDirty: false, shouldValidate: false });
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleImageChange(file: File | undefined, input: HTMLInputElement) {
    if (!file) return;

    setUploadError(null);
    setUploadedImageUrl(null);
    form.clearErrors("image");

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setSelectedImage(null);
      clearLocalPreview();
      input.value = "";
      form.setValue("image", "", { shouldValidate: false });
      form.setError("image", { type: "manual", message: "Choose a JPG, PNG, WEBP, or GIF image." });
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setSelectedImage(null);
      clearLocalPreview();
      input.value = "";
      form.setValue("image", "", { shouldValidate: false });
      form.setError("image", { type: "manual", message: "Choose a profile photo smaller than 10 MB." });
      return;
    }

    clearLocalPreview();
    const preview = URL.createObjectURL(file);
    localPreviewUrlRef.current = preview;
    setLocalPreviewUrl(preview);
    setSelectedImage(file);
    setIsUploading(true);

    try {
      const uploadForm = new FormData();
      uploadForm.append("image", file);
      const response = await fetch("/api/upload/profile", {
        method: "POST",
        body: uploadForm,
        signal: AbortSignal.timeout(35_000),
      });
      const result = (await response.json()) as { url?: string; message?: string };

      if (!response.ok || !result.url) {
        throw new Error(result.message || "The profile photo could not be uploaded.");
      }

      setUploadedImageUrl(result.url);
      form.setValue("image", result.url, { shouldDirty: true, shouldValidate: true });
      toastManager.add({
        type: "success",
        title: "Profile photo ready",
        description: "This is how it will look on your account.",
      });
    } catch (error) {
      const message = error instanceof Error && error.name === "TimeoutError"
        ? "The upload took too long. Please try a smaller image."
        : error instanceof Error
          ? error.message
          : "The profile photo could not be uploaded. Please try again.";

      setUploadError(message);
      setSelectedImage(null);
      clearLocalPreview();
      input.value = "";
      form.setValue("image", "", { shouldValidate: false });
      form.setError("image", { type: "manual", message });
    } finally {
      setIsUploading(false);
    }
  }

  async function onSubmit(values: RegisterValues) {
    const { confirmPassword, ...credentials } = values;
    void confirmPassword;

    try {
      const result = await signUp.email({ ...credentials, callbackURL: "/signin" });
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

  const isSubmitting = form.formState.isSubmitting || googlePending || isUploading;

  return (
    <section className="keep-content-center flex w-full flex-1 items-center justify-center py-10 sm:py-14">
      <div className="w-full max-w-xl rounded-3xl border border-border/75 bg-card/85 p-6 shadow-xl shadow-foreground/5 backdrop-blur-sm sm:p-8">
        <div className="flex justify-center"><SiteLogo /></div>
        <div className="mt-7 text-center">
          <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <BookOpen className="size-6" aria-hidden="true" />
          </span>
          <h1 className="mt-4 font-heading text-3xl font-semibold tracking-tight text-foreground">Join the shared shelf</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Create an account and make room for your next read.</p>
        </div>

        <form className="mt-7 space-y-5" onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <AuthFieldList fields={identityFields} register={form.register} errors={form.formState.errors} />

          <div className="space-y-3 rounded-2xl border border-border/75 bg-background/60 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Profile photo <span className="text-destructive" aria-hidden="true">*</span>
                </p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Paste a photo link or upload one directly from your device.
                </p>
              </div>
              {profilePreviewUrl ? (
                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                  <CheckCircle2 className="size-3.5" aria-hidden="true" />
                  Ready
                </span>
              ) : null}
            </div>

            <input type="hidden" {...form.register("image")} />

            <div className="grid grid-cols-2 gap-1 rounded-xl border border-border/70 bg-muted/60 p-1" role="group" aria-label="Choose how to add a profile photo">
              <button
                type="button"
                aria-pressed={imageMode === "url"}
                onClick={() => changeImageMode("url")}
                className={cn(
                  "inline-flex h-9 items-center justify-center gap-2 rounded-lg text-xs font-semibold transition",
                  imageMode === "url"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Link2 className="size-4" aria-hidden="true" />
                Paste URL
              </button>
              <button
                type="button"
                aria-pressed={imageMode === "upload"}
                onClick={() => changeImageMode("upload")}
                className={cn(
                  "inline-flex h-9 items-center justify-center gap-2 rounded-lg text-xs font-semibold transition",
                  imageMode === "upload"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Upload className="size-4" aria-hidden="true" />
                Upload image
              </button>
            </div>

            {imageMode === "url" ? (
              <div className="space-y-2">
                <label htmlFor="auth-image" className="text-sm font-semibold text-foreground">
                  Photo URL
                </label>
                <Input
                  id="auth-image"
                  type="url"
                  inputMode="url"
                  autoComplete="url"
                  placeholder="https://example.com/photo.jpg"
                  value={imageValue}
                  aria-invalid={Boolean(imageError)}
                  aria-describedby={imageError ? "auth-image-error" : undefined}
                  className="h-11 rounded-xl bg-background px-3.5"
                  onChange={(event) => {
                    form.clearErrors("image");
                    form.setValue("image", event.target.value, { shouldDirty: true });
                  }}
                  onBlur={() => void form.trigger("image")}
                />
                {imageError ? (
                  <p id="auth-image-error" className="text-sm text-destructive" role="alert">
                    {imageError}
                  </p>
                ) : null}
                {urlPreview ? <ProfileImagePreview src={urlPreview} /> : null}
              </div>
            ) : (
              <div className="space-y-2">
                <label
                  htmlFor="profile-photo"
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-primary/30 bg-card/70 p-3 transition hover:border-primary/60 hover:bg-primary/5",
                    isUploading && "cursor-wait opacity-80"
                  )}
                >
                  <Avatar className="size-14 border border-border/70 bg-muted">
                    {uploadPreviewUrl ? <AvatarImage src={uploadPreviewUrl} alt="Profile photo preview" /> : null}
                    <AvatarFallback className="bg-primary/10 text-primary">
                      <ImagePlus className="size-5" aria-hidden="true" />
                    </AvatarFallback>
                  </Avatar>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-foreground">
                      {isUploading
                        ? "Uploading your photo…"
                        : uploadPreviewUrl
                          ? "Choose a different photo"
                          : "Choose a photo from your device"}
                    </span>
                    <span className="mt-1 block truncate text-xs text-muted-foreground">
                      {selectedImage ? selectedImage.name : "JPG, PNG, WEBP, or GIF · up to 10 MB"}
                    </span>
                  </span>
                  {isUploading ? (
                    <LoaderCircle className="size-4 shrink-0 animate-spin text-primary" aria-hidden="true" />
                  ) : (
                    <Upload className="size-4 shrink-0 text-primary" aria-hidden="true" />
                  )}
                  <input
                    ref={fileInputRef}
                    id="profile-photo"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="sr-only"
                    disabled={isUploading}
                    onChange={(event) => void handleImageChange(event.currentTarget.files?.[0], event.currentTarget)}
                  />
                </label>

                {uploadedImageUrl && !isUploading ? (
                  <p className="flex items-start gap-2 rounded-xl border border-emerald-200/70 bg-emerald-50/70 px-3 py-2 text-xs leading-5 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                    <span>Photo uploaded. This is how it will look on your account.</span>
                  </p>
                ) : null}

                {uploadError ? (
                  <p role="alert" className="flex items-start gap-2 rounded-xl border border-destructive/20 bg-destructive/5 px-3 py-2 text-xs leading-5 text-destructive">
                    <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                    <span>{uploadError}</span>
                  </p>
                ) : null}

                {imageError && !uploadError ? (
                  <p className="text-sm text-destructive" role="alert">
                    {imageError}
                  </p>
                ) : null}
              </div>
            )}
          </div>

          <AuthFieldList fields={passwordFields} register={form.register} errors={form.formState.errors} />
          <p className="-mt-1 text-xs leading-5 text-muted-foreground">
            Use at least 6 characters, with one uppercase and one lowercase letter.
          </p>
          <Button type="submit" size="lg" className="h-11 w-full rounded-full" disabled={isSubmitting}>
            {form.formState.isSubmitting || isUploading ? <LoaderCircle className="animate-spin" aria-hidden="true" /> : null}
            {isUploading ? "Uploading photo…" : "Create account"} {!isUploading ? <ArrowRight aria-hidden="true" /> : null}
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

function ProfileImagePreview({ src }: { src: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border/70 bg-card/80 p-3">
      <Avatar className="size-12 border border-border/70">
        <AvatarImage src={src} alt="Profile photo preview" />
        <AvatarFallback className="bg-primary/10 text-primary">
          <UserRound className="size-5" aria-hidden="true" />
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Profile preview</p>
        <p className="mt-1 truncate text-xs text-foreground">{src}</p>
      </div>
    </div>
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
