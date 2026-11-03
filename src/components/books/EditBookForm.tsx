"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, CheckCircle2, ImagePlus, LoaderCircle, Save, TriangleAlert, Upload, X } from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { DeleteBookButton } from "@/components/books/DeleteBookButton";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToastManager } from "@/components/ui/toast";
import { ApiError, getBooks, updateBook } from "@/lib/api";
import { getBrowserAccessToken } from "@/lib/auth-token-client";
import { BOOK_CATEGORIES } from "@/lib/constants";
import { normalizeIsbn } from "@/lib/isbn";
import type { Book } from "@/lib/types";
import { bookSchema } from "@/lib/validations";

const editDetailsSchema = bookSchema.omit({ image: true, category: true });
type EditDetails = z.infer<typeof editDetailsSchema>;
type EditBookFormProps = { book: Book; user: { name: string; email: string } };
type EditField = { label: string; placeholder: string; maxLength: number; rows?: number; inputMode?: "numeric" };

const editFields: Record<keyof EditDetails, EditField> = {
  isbn: { label: "ISBN-13", placeholder: "Enter 13 digits", maxLength: 20, inputMode: "numeric" },
  title: { label: "Book title", placeholder: "Book title", maxLength: 120 },
  author: { label: "Author", placeholder: "Author name", maxLength: 80 },
  description: { label: "About this book", placeholder: "Share a short description to help readers discover this book.", maxLength: 1200, rows: 5 },
};

function formatIsbnForDisplay(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 13);
  const groups = digits.slice(0, 9).match(/.{1,3}/g) ?? [];
  return [...groups, digits.slice(9)].filter(Boolean).join("-");
}

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export function EditBookForm({ book, user }: EditBookFormProps) {
  const router = useRouter();
  const toastManager = useToastManager();
  const [category, setCategory] = useState<string>(book.category);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isTakingLong, setIsTakingLong] = useState(false);
  const [stage, setStage] = useState<"checking" | "uploading" | "saving">("checking");
  const [isbnConflict, setIsbnConflict] = useState<string | null>(null);
  const submitLock = useRef(false);
  const form = useForm<EditDetails>({
    resolver: zodResolver(editDetailsSchema),
    defaultValues: {
      isbn: book.isbn ?? "",
      title: book.title,
      author: book.author,
      description: book.description,
    },
  });
  const isbnValue = form.watch("isbn") ?? "";
  const titleValue = form.watch("title") ?? "";
  const authorValue = form.watch("author") ?? "";

  useEffect(() => {
    setIsbnConflict(null);
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

  function changeImage(file: File | undefined, input: HTMLInputElement) {
    if (!file) {
      setSelectedImage(null);
      return;
    }
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setSelectedImage(null);
      setImageError("Choose a JPG, PNG, WEBP, or GIF image.");
      input.value = "";
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setSelectedImage(null);
      setImageError("Choose a cover image smaller than 10 MB.");
      input.value = "";
      return;
    }
    setSelectedImage(file);
    setImageError(null);
  }

  async function onSubmit(values: EditDetails) {
    if (submitLock.current) return;
    setCategoryError(category ? null : "Choose the category that best fits this book.");
    if (!category) return;

    submitLock.current = true;
    setIsSaving(true);
    setIsTakingLong(false);
    const slowTimer = window.setTimeout(() => setIsTakingLong(true), 5_000);
    let currentStage: "checking" | "uploading" | "saving" = "checking";
    setStage(currentStage);

    try {
      const checkSignal = AbortSignal.timeout(15_000);
      const accessToken = await getBrowserAccessToken();
      const [existingBooks, ownerBooks] = await Promise.all([
        getBooks({ signal: checkSignal }),
        getBooks({ email: user.email, signal: checkSignal, accessToken }),
      ]);
      const normalizeText = (value: string) => value.normalize("NFKC").trim().replace(/\s+/g, " ").toLowerCase();
      const isbn = normalizeIsbn(values.isbn);
      const title = normalizeText(values.title);
      const author = normalizeText(values.author);
      const sameIsbnBooks = existingBooks.filter((candidate) => candidate._id !== book._id && candidate.isbn && normalizeIsbn(candidate.isbn) === isbn);
      const conflict = sameIsbnBooks.find((candidate) =>
        normalizeText(candidate.title) !== title || normalizeText(candidate.author) !== author
      );
      if (conflict) {
        setIsbnConflict(`This ISBN is already linked to “${conflict.title}” by ${conflict.author}. Did you mean “${conflict.title}”? Check the ISBN or book details.`);
        return;
      }

      const ownerBookIds = new Set(ownerBooks.filter((candidate) => candidate._id !== book._id).map((candidate) => candidate._id));
      const duplicate = sameIsbnBooks.some((candidate) => ownerBookIds.has(candidate._id)) || ownerBooks.some((candidate) =>
        candidate._id !== book._id &&
        (!candidate.isbn || !isbn) &&
        normalizeText(candidate.title) === title &&
        normalizeText(candidate.author) === author
      );
      if (duplicate) {
        setIsbnConflict(`You already have another listing for “${values.title}”. Check its ISBN or edit that listing instead.`);
        return;
      }

      let image = book.image;
      if (selectedImage) {
        currentStage = "uploading";
        setStage(currentStage);
        const uploadForm = new FormData();
        uploadForm.append("image", selectedImage);
        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: uploadForm,
          signal: AbortSignal.timeout(35_000),
        });
        const uploadResult = await uploadResponse.json() as { url?: string; message?: string };
        if (!uploadResponse.ok || !uploadResult.url) {
          throw new Error(uploadResult.message || "The new cover image could not be uploaded.");
        }
        image = uploadResult.url;
      }

      currentStage = "saving";
      setStage(currentStage);
      await updateBook(book._id, {
        ...values,
        isbn,
        category: category as (typeof BOOK_CATEGORIES)[number],
        image,
      }, await getBrowserAccessToken());
      toastManager.add({ type: "success", title: "Book updated", description: `Changes to ${values.title} have been saved.` });
      router.push("/my-books");
      router.refresh();
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        setIsbnConflict(error.message);
        return;
      }
      const description = error instanceof Error && error.name === "TimeoutError"
        ? currentStage === "checking"
          ? "The books list did not respond in 15 seconds. Please try again."
          : currentStage === "uploading"
            ? "The image upload took too long. Try a smaller cover image."
            : "The books API did not respond in 30 seconds."
        : error instanceof Error ? error.message : "Please try again in a moment.";
      toastManager.add({ type: "error", title: "Couldn’t update this book", description });
    } finally {
      window.clearTimeout(slowTimer);
      submitLock.current = false;
      setIsSaving(false);
      setIsTakingLong(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_19rem]">
      <div className="space-y-6 rounded-3xl border border-border/75 bg-card/85 p-5 shadow-lg shadow-foreground/5 backdrop-blur-sm sm:p-7">
        <div className="grid gap-5 sm:grid-cols-2">
          {Object.entries(editFields).filter(([name]) => name !== "description").map(([name, field]) => {
            const key = name as keyof EditDetails;
            const error = form.formState.errors[key];
            const isIsbn = key === "isbn";
            return (
              <div key={name} className="space-y-2">
                <label htmlFor={`edit-${name}`} className="text-sm font-medium text-foreground">{field.label}</label>
                <Input
                  id={`edit-${name}`}
                  inputMode={field.inputMode}
                  placeholder={field.placeholder}
                  maxLength={field.maxLength}
                  aria-invalid={Boolean(error || (isIsbn && isbnConflict))}
                  {...form.register(key)}
                  {...(isIsbn ? {
                    value: formatIsbnForDisplay(isbnValue),
                    onChange: (event) => {
                      setIsbnConflict(null);
                      form.setValue("isbn", event.currentTarget.value.replace(/\D/g, "").slice(0, 13), { shouldDirty: true, shouldValidate: true });
                    },
                  } : {})}
                />
                {isIsbn ? (
                  <div className="flex min-h-4 items-center justify-between gap-2 text-xs">
                    {error?.message ? <p className="text-destructive">{error.message}</p> : <p className="text-muted-foreground">Enter 13 digits; hyphens are added for display.</p>}
                    {/^\d{13}$/.test(isbnValue) ? <span className="inline-flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400"><CheckCircle2 className="size-4" aria-hidden="true" /> Complete</span> : null}
                  </div>
                ) : error?.message ? <p className="text-xs text-destructive">{error.message}</p> : null}
                {isIsbn && isbnConflict ? <p role="alert" className="flex items-start gap-2 rounded-xl border border-destructive/20 bg-destructive/5 px-3 py-2 text-xs leading-5 text-destructive"><TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" /><span>{isbnConflict}</span></p> : null}
              </div>
            );
          })}
        </div>

        <div className="space-y-2">
          <label htmlFor="edit-category" className="text-sm font-medium text-foreground">Category</label>
          <Select value={category} onValueChange={(value) => { setCategory(value ?? ""); if (value) setCategoryError(null); }}>
            <SelectTrigger id="edit-category" aria-invalid={Boolean(categoryError)} className="h-11 w-full rounded-xl bg-background/70">
              <SelectValue placeholder="Choose a category" />
            </SelectTrigger>
            <SelectContent>{BOOK_CATEGORIES.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
          </Select>
          {categoryError ? <p role="alert" className="text-xs text-destructive">{categoryError}</p> : null}
        </div>

        {Object.entries(editFields).filter(([name]) => name === "description").map(([name, field]) => {
          const key = name as keyof EditDetails;
          const error = form.formState.errors[key];
          return (
            <div key={name} className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <label htmlFor={`edit-${name}`} className="text-sm font-medium text-foreground">{field.label}</label>
                <span className="text-xs text-muted-foreground">{form.watch(key)?.length ?? 0}/{field.maxLength}</span>
              </div>
              <Textarea id={`edit-${name}`} rows={field.rows} maxLength={field.maxLength} placeholder={field.placeholder} aria-invalid={Boolean(error)} className="min-h-36 resize-y rounded-xl bg-background/70" {...form.register(key)} />
              {error?.message ? <p className="text-xs text-destructive">{error.message}</p> : null}
            </div>
          );
        })}

        <div className="flex items-center gap-3 rounded-2xl border border-primary/10 bg-primary/5 p-4 text-sm text-muted-foreground">
          <Save className="size-5 shrink-0 text-primary" aria-hidden="true" />
          <p>Your changes will update the shared listing for <span className="font-medium text-foreground">{user.name}</span>.</p>
        </div>

        <Button type="submit" size="lg" className="h-12 w-full rounded-full" disabled={isSaving}>
          {isSaving ? <LoaderCircle className="animate-spin" aria-hidden="true" /> : <Save aria-hidden="true" />}
          {isSaving ? isTakingLong ? "Still working… this can take a little while" : stage === "checking" ? "Checking for conflicts…" : stage === "uploading" ? "Uploading new cover…" : "Saving changes…" : "Save changes"}
          {!isSaving ? <ArrowRight aria-hidden="true" /> : null}
        </Button>

        <section className="rounded-2xl border border-destructive/20 bg-destructive/[0.035] p-4 sm:p-5" aria-labelledby="delete-book-heading">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <h2 id="delete-book-heading" className="text-sm font-semibold text-foreground">Remove this listing</h2>
              <p className="mt-1 text-sm leading-5 text-muted-foreground">Permanently remove this book from your shelf.</p>
            </div>
            <DeleteBookButton book={book} showLabel />
          </div>
        </section>
      </div>

      <aside className="h-fit rounded-3xl border border-border/75 bg-card/70 p-5 shadow-sm backdrop-blur-sm sm:p-6">
        <p className="font-heading text-lg font-semibold text-foreground">Book cover</p>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">Keep the current image or choose a replacement cover.</p>
        <label htmlFor="edit-cover-image" className="mt-5 flex min-h-64 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-primary/30 bg-background/70 text-center transition hover:border-primary/60 hover:bg-primary/5">
          {previewUrl ? (
            <span className="relative block aspect-[4/5] w-full"><Image src={previewUrl} alt="Replacement book cover preview" fill unoptimized sizes="(max-width: 1024px) 100vw, 19rem" className="object-cover" /></span>
          ) : (
            <span className="relative block aspect-[4/5] w-full"><Image src={book.image} alt={`Current cover of ${book.title}`} fill sizes="(max-width: 1024px) 100vw, 19rem" className="object-cover" /></span>
          )}
          <input id="edit-cover-image" type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="sr-only" aria-invalid={Boolean(imageError)} onChange={(event) => changeImage(event.currentTarget.files?.[0], event.currentTarget)} />
        </label>
        {selectedImage ? (
          <div className="mt-3 flex items-center justify-between gap-3 rounded-xl bg-muted/55 px-3 py-2">
            <span className="min-w-0 truncate text-xs text-muted-foreground">New cover: {selectedImage.name}</span>
            <Button type="button" variant="ghost" size="icon-sm" aria-label="Cancel cover replacement" onClick={() => { setSelectedImage(null); setImageError(null); }}><X className="size-4" aria-hidden="true" /></Button>
          </div>
        ) : (
          <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground"><ImagePlus className="size-3.5" aria-hidden="true" />The current cover stays unless you replace it.</p>
        )}
        {imageError ? <p role="alert" className="mt-3 flex items-start gap-2 text-xs leading-5 text-destructive"><TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" /><span>{imageError}</span></p> : null}
        <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground"><Upload className="size-3.5" aria-hidden="true" />New images upload securely to ImgBB.</p>
      </aside>
    </form>
  );
}
