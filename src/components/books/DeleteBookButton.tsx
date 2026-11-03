"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Trash2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToastManager } from "@/components/ui/toast";
import { deleteBook } from "@/lib/api";
import { getBrowserAccessToken } from "@/lib/auth-token-client";
import type { Book } from "@/lib/types";

export function DeleteBookButton({ book, showLabel = false }: { book: Pick<Book, "_id" | "title">; showLabel?: boolean }) {
  const router = useRouter();
  const toastManager = useToastManager();
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleted, setDeleted] = useState(false);

  async function confirmDelete() {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      await deleteBook(book._id, await getBrowserAccessToken());
      setOpen(false);
      setDeleted(true);
      toastManager.add({
        type: "success",
        title: "Book removed",
        description: `“${book.title}” has been removed from your shelf.`,
      });
      router.replace("/my-books");
    } catch (error) {
      toastManager.add({
        type: "error",
        title: "Couldn’t delete this book",
        description: error instanceof Error && error.name === "TimeoutError"
          ? "The books API did not respond in 30 seconds. Please try again."
          : error instanceof Error ? error.message : "Please try again in a moment.",
      });
    } finally {
      setIsDeleting(false);
    }
  }

  if (deleted) return null;

  return (
    <AlertDialog open={open} onOpenChange={(nextOpen) => !isDeleting && setOpen(nextOpen)}>
      <AlertDialogTrigger
        render={
          <Button
            type="button"
            size={showLabel ? "default" : "icon"}
            variant={showLabel ? "outline" : "ghost"}
            className={showLabel ? "h-10 w-full rounded-full border-destructive/30 px-4 text-destructive hover:bg-destructive/10 hover:text-destructive sm:w-auto" : "size-10 rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive"}
            aria-label={`Delete ${book.title}`}
            title="Delete book"
          />
        }
      >
        <Trash2 aria-hidden="true" />
        {showLabel ? "Delete book" : null}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive">
            <Trash2 aria-hidden="true" />
          </AlertDialogMedia>
          <AlertDialogTitle>Remove this book from your shelf?</AlertDialogTitle>
          <AlertDialogDescription>
            “{book.title}” will be removed from the shared shelf. This action can’t be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Keep book</AlertDialogCancel>
          <Button variant="destructive" onClick={() => void confirmDelete()} disabled={isDeleting}>
            {isDeleting ? <LoaderCircle className="animate-spin" aria-hidden="true" /> : <Trash2 aria-hidden="true" />}
            {isDeleting ? "Removing…" : "Remove book"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
