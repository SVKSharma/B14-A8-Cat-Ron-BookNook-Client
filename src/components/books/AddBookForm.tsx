"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, BookOpen, CheckCircle2, ImagePlus, LoaderCircle, TriangleAlert, Upload, X } from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToastManager } from "@/components/ui/toast";
import { BOOK_CATEGORIES } from "@/lib/constants";
import { ApiError, createBook, getBooks } from "@/lib/api";
import { normalizeIsbn } from "@/lib/isbn";
import { bookSchema } from "@/lib/validations";

type BookDetails = z.infer<typeof bookDetailsSchema>;
type AddBookFormProps = { user: { name: string; email: string } };
type AddBookField = { label: string; placeholder: string; maxLength: number; rows?: number; type?: string; inputMode?: "numeric" };

const bookDetailsSchema = bookSchema.omit({ image: true, category: true });

const addBookFields: Record<keyof BookDetails, AddBookField> = {
  isbn: { label: "ISBN-13", placeholder: "Enter 13 digits", maxLength: 20, inputMode: "numeric" },
  title: { label: "Book title", placeholder: "e.g. The Name of the Wind", maxLength: 120 },
  author: { label: "Author", placeholder: "e.g. Patrick Rothfuss", maxLength: 80 },
  description: {
    label: "About this book",
    placeholder: "Share a short description to help readers discover this book.",
    maxLength: 1200,
    rows: 5,
  },
};

function formatIsbnForDisplay(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 13);
  const groups = digits.slice(0, 9).match(/.{1,3}/g) ?? [];
  const finalGroup = digits.slice(9);
  return [...groups, finalGroup].filter(Boolean).join("-");
}

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export function AddBookForm({ user }: AddBookFormProps) {
  const router = useRouter();
  const toastManager = useToastManager();
  const [category, setCategory] = useState("");
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageFieldError, setImageFieldError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isTakingLong, setIsTakingLong] = useState(false);
  const [submitStage, setSubmitStage] = useState<"checking" | "uploading" | "saving">("checking");
  const [isbnConflictMessage, setIsbnConflictMessage] = useState<string | null>(null);
  const submissionLock = useRef(false);
  const form = useForm<BookDetails>({
    resolver: zodResolver(bookDetailsSchema),
    defaultValues: { isbn: "", title: "", author: "", description: "" },
  });
  const isbnValue = form.watch("isbn") ?? "";
  const titleValue = form.watch("title") ?? "";
  const authorValue = form.watch("author") ?? "";

  useEffect(() => {
    setIsbnConflictMessage(null);
  }, [isbnValue, titleValue, authorValue]);

  useEffect(() => {
    if (!selectedImage) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(selectedImage);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [selectedImage]);

  function handleImageChange(file: File | undefined, input: HTMLInputElement) {
    if (!file) {
      setSelectedImage(null);
      return;
    }
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setSelectedImage(null);
      setImageFieldError("Choose a JPG, PNG, WEBP, or GIF image.");
      input.value = "";
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setSelectedImage(null);
      setImageFieldError("Choose a cover image smaller than 10 MB.");
      input.value = "";
      return;
    }
    setSelectedImage(file);
    setImageFieldError(null);
  }

  async function onSubmit(values: BookDetails) {
    if (submissionLock.current) return;
    const hasCategory = Boolean(category);
    const hasImage = Boolean(selectedImage);
    setCategoryError(hasCategory ? null : "Choose the category that best fits this book.");
    setImageFieldError(hasImage ? null : "A cover image is required to add this book.");
    if (!category || !selectedImage) return;

    submissionLock.current = true;
    setIsSaving(true);
    setIsTakingLong(false);
    const slowRequestTimer = window.setTimeout(() => setIsTakingLong(true), 5_000);
    let currentStage: "checking" | "uploading" | "saving" = "checking";
    setSubmitStage(currentStage);
    try {
      const existingBooks = await getBooks({ signal: AbortSignal.timeout(15_000) });
      const normalize = (value: string) => value.normalize("NFKC").trim().replace(/\s+/g, " ").toLowerCase();
      const normalizedTitle = normalize(values.title);
      const normalizedAuthor = normalize(values.author);
      const normalizedIsbn = values.isbn ? normalizeIsbn(values.isbn) : "";
      const matchingIsbnBooks = normalizedIsbn
        ? existingBooks.filter((book) => book.isbn && normalizeIsbn(book.isbn) === normalizedIsbn)
        : [];
      const isbnTitleConflict = matchingIsbnBooks.find((book) =>
        normalize(book.title) !== normalizedTitle || normalize(book.author) !== normalizedAuthor
      );

      if (isbnTitleConflict) {
        setIsbnConflictMessage(
          `This ISBN is already linked to “${isbnTitleConflict.title}” by ${isbnTitleConflict.author}. Did you mean “${isbnTitleConflict.title}”? Check the ISBN or book details.`
        );
        return;
      }

      const sameOwner = (book: (typeof existingBooks)[number]) =>
        normalize(book.addedByEmail) === normalize(user.email);
      const duplicate = matchingIsbnBooks.some(sameOwner) || existingBooks.some((book) =>
        sameOwner(book) &&
        (!normalizedIsbn || !book.isbn) &&
        normalize(book.title) === normalizedTitle &&
        normalize(book.author) === normalizedAuthor
      );

      if (duplicate) {
        toastManager.add({
          type: "error",
          title: "You already listed this book",
          description: normalizedIsbn
            ? `“${values.title}” is already listed under this ISBN. A duplicate listing was not created.`
            : `“${values.title}” by ${values.author} is already in your listings. A duplicate listing was not created.`,
        });
        return;
      }

      currentStage = "uploading";
      setSubmitStage(currentStage);
      const uploadForm = new FormData();
      uploadForm.append("image", selectedImage);
      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: uploadForm,
        signal: AbortSignal.timeout(35_000),
      });
      const uploadResult = (await uploadResponse.json()) as { url?: string; message?: string };
      if (!uploadResponse.ok || !uploadResult.url) {
        throw new Error(uploadResult.message || "The cover image could not be uploaded.");
      }

      currentStage = "saving";
      setSubmitStage(currentStage);
      await createBook({
        ...values,
        category: category as (typeof BOOK_CATEGORIES)[number],
        image: uploadResult.url,
        addedByName: user.name,
        addedByEmail: user.email,
      });
      toastManager.add({ type: "success", title: "Book added", description: `${values.title} is now on the BookNook shelf.` });
      router.push("/books");
      router.refresh();
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        setIsbnConflictMessage(error.message);
        return;
      }
      const description = error instanceof Error && error.name === "TimeoutError"
        ? currentStage === "checking"
          ? "The books list did not respond in 15 seconds. Please try again."
          : currentStage === "uploading"
            ? "The image upload took too long. Try a smaller cover image."
            : "The books API did not respond in 30 seconds."
        : error instanceof Error ? error.message : "Please try again in a moment.";
      toastManager.add({
        type: "error",
        title: "Couldn’t add this book",
        description,
      });
    } finally {
      window.clearTimeout(slowRequestTimer);
      submissionLock.current = false;
      setIsSaving(false);
      setIsTakingLong(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_19rem]">
      <div className="space-y-6 rounded-3xl border border-border/75 bg-card/85 p-5 shadow-lg shadow-foreground/5 backdrop-blur-sm sm:p-7">
        <div className="grid gap-5 sm:grid-cols-2">
          {Object.entries(addBookFields).filter(([name]) => name !== "description").map(([name, field]) => {
            const key = name as keyof BookDetails;
            const error = form.formState.errors[key];
            return (
              <div key={name} className="space-y-2">
                <label htmlFor={name} className="text-sm font-medium text-foreground">{field.label}</label>
                <Input
                  id={name}
                  type={field.type ?? "text"}
                  inputMode={field.inputMode}
                  placeholder={field.placeholder}
                  maxLength={field.maxLength}
                  aria-invalid={Boolean(error || (key === "isbn" && isbnConflictMessage))}
                  {...form.register(key)}
                  {...(key === "isbn" ? {
                    value: formatIsbnForDisplay(isbnValue),
                    onChange: (event) => {
                      setIsbnConflictMessage(null);
                      form.setValue("isbn", event.currentTarget.value.replace(/\D/g, "").slice(0, 13), { shouldDirty: true, shouldValidate: true });
                    },
                  } : {})}
                />
                {key === "isbn" ? (
                  <div className="flex min-h-4 items-center justify-between gap-2 text-xs">
                    {error?.message
                      ? <p className="text-destructive">{error.message}</p>
                      : <p className={/^\d{13}$/.test(isbnValue) ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}>
                        {/^\d{13}$/.test(isbnValue) ? "13 digits entered." : "Enter 13 digits; hyphens are added after each group of 3."}
                      </p>}
                    {/^\d{13}$/.test(isbnValue) ? (
                      <span className="inline-flex shrink-0 items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="size-4" aria-hidden="true" /> Complete
                      </span>
                    ) : null}
                  </div>
                ) : error?.message ? <p className="text-xs text-destructive">{error.message}</p> : null}
                {key === "isbn" && isbnConflictMessage ? (
                  <p role="alert" className="flex items-start gap-2 rounded-xl border border-destructive/20 bg-destructive/5 px-3 py-2 text-xs leading-5 text-destructive">
                    <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                    <span>{isbnConflictMessage}</span>
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>

        <div className="space-y-2">
          <label htmlFor="category" className="text-sm font-medium text-foreground">Category</label>
          <Select value={category} onValueChange={(value) => {
            setCategory(value ?? "");
            if (value) setCategoryError(null);
          }}>
            <SelectTrigger
              id="category"
              aria-invalid={Boolean(categoryError)}
              aria-describedby={categoryError ? "category-error" : undefined}
              className="h-11 w-full rounded-xl bg-background/70"
            >
              <SelectValue placeholder="Choose a category" />
            </SelectTrigger>
            <SelectContent>
              {BOOK_CATEGORIES.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
            </SelectContent>
          </Select>
          {categoryError ? <p id="category-error" role="alert" className="text-xs text-destructive">{categoryError}</p> : null}
        </div>

        {Object.entries(addBookFields).filter(([name]) => name === "description").map(([name, field]) => {
          const key = name as keyof BookDetails;
          const error = form.formState.errors[key];
          return (
            <div key={name} className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <label htmlFor={name} className="text-sm font-medium text-foreground">{field.label}</label>
                <span className="text-xs text-muted-foreground">{form.watch(key)?.length ?? 0}/{field.maxLength}</span>
              </div>
              <Textarea
                id={name}
                rows={field.rows}
                maxLength={field.maxLength}
                placeholder={field.placeholder}
                aria-invalid={Boolean(error)}
                className="min-h-36 resize-y rounded-xl bg-background/70"
                {...form.register(key)}
              />
              {error?.message ? <p className="text-xs text-destructive">{error.message}</p> : null}
            </div>
          );
        })}

        <div className="flex items-center gap-3 rounded-2xl border border-primary/10 bg-primary/5 p-4 text-sm text-muted-foreground">
          <BookOpen className="size-5 shrink-0 text-primary" aria-hidden="true" />
          <p>This book will be listed under <span className="font-medium text-foreground">{user.name}</span> as its contributor.</p>
        </div>

        <Button type="submit" size="lg" className="h-12 w-full rounded-full" disabled={isSaving}>
          {isSaving ? <LoaderCircle className="animate-spin" aria-hidden="true" /> : null}
          {isSaving
            ? isTakingLong
              ? "Still working… this can take a little while"
              : submitStage === "checking"
                ? "Checking for duplicates…"
                : submitStage === "uploading"
                  ? "Uploading cover…"
                  : "Saving book…"
            : "Add book to the shelf"}
          {!isSaving ? <ArrowRight aria-hidden="true" /> : null}
        </Button>
      </div>

      <aside className="h-fit rounded-3xl border border-border/75 bg-card/70 p-5 shadow-sm backdrop-blur-sm sm:p-6">
        <div>
          <p className="font-heading text-lg font-semibold text-foreground">Cover image</p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">Choose a clear image. We’ll upload it securely and save its link with your book.</p>
        </div>
        <label
          htmlFor="cover-image"
          className="mt-5 flex min-h-64 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-primary/30 bg-background/70 text-center transition hover:border-primary/60 hover:bg-primary/5"
        >
          {previewUrl ? (
            <span className="relative block aspect-[4/5] w-full">
              <Image src={previewUrl} alt="Selected book cover preview" fill unoptimized sizes="(max-width: 1024px) 100vw, 19rem" className="object-cover" />
            </span>
          ) : (
            <span className="flex flex-col items-center px-6 py-8">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"><ImagePlus className="size-6" aria-hidden="true" /></span>
              <span className="mt-4 text-sm font-semibold text-foreground">Choose a cover image</span>
              <span className="mt-1 text-xs text-muted-foreground">JPG, PNG, WEBP, GIF · up to 10 MB</span>
            </span>
          )}
          <input
            id="cover-image"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="sr-only"
            aria-invalid={Boolean(imageFieldError)}
            aria-describedby={imageFieldError ? "cover-image-error" : undefined}
            onChange={(event) => handleImageChange(event.currentTarget.files?.[0], event.currentTarget)}
          />
        </label>
        {selectedImage ? (
          <div className="mt-3 flex items-center justify-between gap-3 rounded-xl bg-muted/55 px-3 py-2">
            <span className="min-w-0 truncate text-xs text-muted-foreground">{selectedImage.name}</span>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Remove selected cover"
              onClick={() => {
                setSelectedImage(null);
                setImageFieldError("A cover image is required to add this book.");
              }}
            >
              <X className="size-4" aria-hidden="true" />
            </Button>
          </div>
        ) : null}
        {imageFieldError ? (
          <p id="cover-image-error" role="alert" className="mt-3 flex items-start gap-2 text-xs leading-5 text-destructive">
            <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <span>{imageFieldError}</span>
          </p>
        ) : null}
        <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground"><Upload className="size-3.5" aria-hidden="true" />Uploads go through our secure server route.</p>
      </aside>
    </form>
  );
}
