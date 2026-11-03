"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BookOpen, Check, LoaderCircle, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useToastManager } from "@/components/ui/toast";
import { useSession } from "@/lib/auth-client";
import { createBorrow, getBookAvailability, getBorrows } from "@/lib/api";
import { getBrowserAccessToken } from "@/lib/auth-token-client";
import type { Book } from "@/lib/types";

export function BorrowBookButton({ book }: { book: Book }) {
  const router = useRouter();
  const toastManager = useToastManager();
  const { data: session, isPending } = useSession();
  const [isBorrowing, setIsBorrowing] = useState(false);
  const [borrowed, setBorrowed] = useState(false);
  const [borrowCheckStatus, setBorrowCheckStatus] = useState<"checking" | "ready" | "error">("checking");
  const [availableCopies, setAvailableCopies] = useState<number | null>(null);
  const [borrowableCopies, setBorrowableCopies] = useState<number | null>(null);
  const [ownsBook, setOwnsBook] = useState(false);
  const [availabilityStatus, setAvailabilityStatus] = useState<"loading" | "ready" | "error">("loading");
  const [availabilityRetry, setAvailabilityRetry] = useState(0);
  const lock = useRef(false);

  useEffect(() => {
    let active = true;
    let availabilityRequestPending = false;
    let borrowRequestPending = false;

    async function checkAvailability() {
      if (availabilityRequestPending) return;
      availabilityRequestPending = true;

      try {
        const accessToken = session?.user.email
          ? await getBrowserAccessToken()
          : undefined;
        const result = await getBookAvailability(
          book._id,
          AbortSignal.timeout(15_000),
          accessToken,
        );
        const borrowable = result.borrowableCopies ?? result.availableCopies;
        if (
          !Number.isSafeInteger(result.availableCopies) ||
          result.availableCopies < 0 ||
          !Number.isSafeInteger(borrowable) ||
          borrowable < 0
        ) {
          throw new Error("The availability response was invalid.");
        }
        if (active) {
          setAvailableCopies(result.availableCopies);
          setBorrowableCopies(borrowable);
          setOwnsBook(result.ownsBook ?? false);
          setAvailabilityStatus("ready");
        }
      } catch {
        if (active) setAvailabilityStatus("error");
      } finally {
        availabilityRequestPending = false;
      }
    }

    async function checkBorrowStatus() {
      if (isPending) return;
      if (!session?.user.email) {
        setBorrowed(false);
        setBorrowCheckStatus("ready");
        return;
      }
      if (borrowRequestPending) return;
      borrowRequestPending = true;

      try {
        const accessToken = await getBrowserAccessToken();
        const borrows = await getBorrows(
          session.user.email,
          AbortSignal.timeout(15_000),
          accessToken,
        );
        if (active) {
          setBorrowed(borrows.some((record) =>
            record.bookId === book._id ||
            Boolean(book.isbn && record.bookIsbn === book.isbn)
          ));
          setBorrowCheckStatus("ready");
        }
      } catch {
        if (active) setBorrowCheckStatus("error");
      } finally {
        borrowRequestPending = false;
      }
    }

    function handleBookReturned(event: Event) {
      const returned = (event as CustomEvent<{ bookId: string; isbn?: string }>).detail;
      if (returned.bookId !== book._id && (!book.isbn || returned.isbn !== book.isbn)) return;
      setBorrowed(false);
      setBorrowCheckStatus("ready");
      refreshAvailability();
    }

    void checkAvailability();
    void checkBorrowStatus();
    const interval = window.setInterval(() => {
      void checkAvailability();
      void checkBorrowStatus();
    }, 10_000);
    window.addEventListener("focus", checkAvailability);
    window.addEventListener("focus", checkBorrowStatus);
    window.addEventListener("booknook:borrow-returned", handleBookReturned);

    return () => {
      active = false;
      window.clearInterval(interval);
      window.removeEventListener("focus", checkAvailability);
      window.removeEventListener("focus", checkBorrowStatus);
      window.removeEventListener("booknook:borrow-returned", handleBookReturned);
    };
  }, [book._id, book.isbn, availabilityRetry, isPending, session?.user.email]);

  function refreshAvailability() {
    setAvailabilityStatus("loading");
    setAvailabilityRetry((retry) => retry + 1);
  }

  async function borrow() {
    if (
      lock.current ||
      isPending ||
      !session?.user.email ||
      ownsBook ||
      availabilityStatus !== "ready" ||
      borrowableCopies === null ||
      borrowableCopies < 1
    ) return;

    lock.current = true;
    setIsBorrowing(true);
    try {
      const accessToken = await getBrowserAccessToken();
      const currentBorrows = await getBorrows(session.user.email, AbortSignal.timeout(15_000), accessToken);
      if (currentBorrows.some((record) =>
        record.bookId === book._id ||
        Boolean(book.isbn && record.bookIsbn === book.isbn)
      )) {
        setBorrowed(true);
        toastManager.add({ type: "error", title: "Already on your borrow list", description: "Return this copy before borrowing it again." });
        return;
      }

      await createBorrow({
        bookId: book._id,
      }, accessToken);
      setBorrowed(true);
      setAvailableCopies((copies) => copies === null ? null : Math.max(0, copies - 1));
      setBorrowableCopies((copies) => copies === null ? null : Math.max(0, copies - 1));
      refreshAvailability();
      toastManager.add({ type: "success", title: "Book borrowed", description: `“${book.title}” is now in My Borrows. You have 7 days to read it.` });
      router.refresh();
    } catch (error) {
      refreshAvailability();
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

  const action = borrowed ? (
    <Button size="lg" variant="outline" className="h-12 w-full rounded-full" nativeButton={false} render={<Link href="/my-borrows" />}>
      <Check aria-hidden="true" /> View in My Borrows
    </Button>
  ) : borrowCheckStatus === "checking" ? (
    <Button size="lg" variant="outline" className="h-12 w-full rounded-full" disabled>
      <LoaderCircle className="animate-spin" aria-hidden="true" /> Checking your borrows…
    </Button>
  ) : borrowCheckStatus === "error" ? (
    <Button size="lg" variant="outline" className="h-12 w-full rounded-full" disabled>
      Borrow status unavailable
    </Button>
  ) : ownsBook ? (
    <Button size="lg" variant="outline" className="h-12 w-full rounded-full" disabled>
      You shared this book
    </Button>
  ) : availabilityStatus === "ready" && borrowableCopies === 0 ? (
    <Button size="lg" variant="outline" className="h-12 w-full rounded-full" disabled>
      {availableCopies && availableCopies > 0 ? "No other copies available" : "No copies available"}
    </Button>
  ) : availabilityStatus === "error" ? (
    <Button size="lg" variant="outline" className="h-12 w-full rounded-full" disabled>
      Availability unavailable
    </Button>
  ) : !isPending && !session ? (
    <Button
      size="lg"
      className="h-12 w-full rounded-full"
      nativeButton={false}
      render={<Link href={`/signin?callbackUrl=${encodeURIComponent(`/books/${book._id}`)}`} />}
    >
      <BookOpen aria-hidden="true" /> Sign in to borrow
    </Button>
  ) : (
    <Button
      size="lg"
      className="h-12 w-full rounded-full"
      onClick={() => void borrow()}
      disabled={isPending || isBorrowing || availabilityStatus !== "ready" || borrowableCopies === null}
    >
      {isBorrowing || availabilityStatus === "loading"
        ? <LoaderCircle className="animate-spin" aria-hidden="true" />
        : <BookOpen aria-hidden="true" />}
      {isBorrowing
        ? "Borrowing…"
        : availabilityStatus === "loading"
          ? "Checking copies…"
          : "Borrow this book"}
    </Button>
  );

  return (
    <div>
      <div className="mb-3 flex min-h-6 items-center justify-between gap-3 text-sm" aria-live="polite">
        <p className={availabilityStatus === "error" || borrowCheckStatus === "error" ? "text-destructive" : "text-muted-foreground"}>
          {borrowCheckStatus === "error"
            ? "We couldn’t verify your active borrows."
            : availabilityStatus === "loading"
            ? "Checking live availability…"
            : availabilityStatus === "error"
              ? "We couldn’t check the available copies."
              : `${availableCopies} ${availableCopies === 1 ? "copy" : "copies"} available`}
        </p>
        {(availabilityStatus === "error" || borrowCheckStatus === "error") && (
          <button
            type="button"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-md font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            onClick={refreshAvailability}
          >
            <RefreshCw className="size-3.5" aria-hidden="true" /> Try again
          </button>
        )}
      </div>
      {availabilityStatus === "ready" && borrowableCopies === 0 && (
        <p className="mb-3 rounded-xl border border-border/70 bg-muted/50 px-4 py-3 text-sm leading-6 text-muted-foreground">
          {availableCopies && availableCopies > 0
            ? "The available copies are on your own shelf. You can borrow this title from another community member when one is listed."
            : "Every copy is currently with a reader. Check back soon—returned books become available here automatically."}
        </p>
      )}
      {availabilityStatus === "ready" && ownsBook && (
        <p className="mb-3 rounded-xl border border-border/70 bg-muted/50 px-4 py-3 text-sm leading-6 text-muted-foreground">
          You’ve already shared this ISBN with the community, so you can’t borrow this book.
        </p>
      )}
      {action}
    </div>
  );
}
