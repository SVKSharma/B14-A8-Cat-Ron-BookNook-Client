"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { BookOpen, Check, LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useToastManager } from "@/components/ui/toast";
import { useSession } from "@/lib/auth-client";
import { createBorrow, getBorrows } from "@/lib/api";
import type { Book } from "@/lib/types";

export function BorrowBookButton({ book }: { book: Book }) {
  const router = useRouter();
  const toastManager = useToastManager();
  const { data: session, isPending } = useSession();
  const [isBorrowing, setIsBorrowing] = useState(false);
  const [borrowed, setBorrowed] = useState(false);
  const lock = useRef(false);

  async function borrow() {
    if (lock.current || isPending || !session?.user.email) return;
    if (book.addedByEmail.trim().toLowerCase() === session.user.email.trim().toLowerCase()) {
      toastManager.add({ type: "error", title: "This is your book", description: "You can’t borrow a book from your own shelf." });
      return;
    }

    lock.current = true;
    setIsBorrowing(true);
    try {
      const currentBorrows = await getBorrows(session.user.email, AbortSignal.timeout(15_000));
      if (currentBorrows.some((record) => record.bookId === book._id)) {
        setBorrowed(true);
        toastManager.add({ type: "error", title: "Already on your borrow list", description: "Return this copy before borrowing it again." });
        return;
      }

      await createBorrow({
        bookId: book._id,
        userEmail: session.user.email,
        bookTitle: book.title,
        bookImage: book.image,
      });
      setBorrowed(true);
      toastManager.add({ type: "success", title: "Book borrowed", description: `“${book.title}” is now in My Borrows. You have 7 days to read it.` });
      router.refresh();
    } catch (error) {
      toastManager.add({
        type: "error",
        title: "Couldn’t borrow this book",
        description: error instanceof Error && error.name === "TimeoutError"
          ? "The request took too long. Please try again."
          : error instanceof Error ? error.message : "Please try again in a moment.",
      });
    } finally {
      lock.current = false;
      setIsBorrowing(false);
    }
  }

  if (!isPending && !session) {
    return (
      <Button size="lg" className="h-12 w-full rounded-full" nativeButton={false} render={<Link href={`/signin?callbackUrl=${encodeURIComponent(`/books/${book._id}`)}`} />}>
        <BookOpen aria-hidden="true" /> Sign in to borrow
      </Button>
    );
  }

  if (borrowed) {
    return (
      <Button size="lg" variant="outline" className="h-12 w-full rounded-full" nativeButton={false} render={<Link href="/my-borrows" />}>
        <Check aria-hidden="true" /> View in My Borrows
      </Button>
    );
  }

  const isOwnBook = session?.user.email?.trim().toLowerCase() === book.addedByEmail.trim().toLowerCase();
  return (
    <Button size="lg" className="h-12 w-full rounded-full" onClick={() => void borrow()} disabled={isPending || isBorrowing || isOwnBook}>
      {isBorrowing ? <LoaderCircle className="animate-spin" aria-hidden="true" /> : <BookOpen aria-hidden="true" />}
      {isBorrowing ? "Checking availability…" : isOwnBook ? "Your listing" : "Borrow this book"}
    </Button>
  );
}
