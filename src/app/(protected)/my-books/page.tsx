import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, BookPlus, LibraryBig } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { BookCard } from "@/components/books/BookCard";
import { Button } from "@/components/ui/button";
import { getBooks } from "@/lib/api";
import { isBook } from "@/lib/book-utils";
import { auth } from "@/lib/auth";
import type { Book } from "@/lib/types";

export const metadata: Metadata = {
  title: "My Books",
  description: "Review and edit the books you have shared with the BookNook community.",
};

function MyBooksSkeleton() {
  return (
    <div className="grid min-w-0 grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6" aria-label="Loading your books" aria-busy="true">
      {Array.from({ length: 3 }, (_, index) => (
        <div key={index} className="overflow-hidden rounded-2xl border border-border/75 bg-card/80 shadow-sm">
          <div className="aspect-[4/3] animate-pulse bg-muted" />
          <div className="space-y-3 p-4 sm:p-5">
            <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
            <div className="h-10 w-full animate-pulse rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}

function MyBooksError() {
  return (
    <div className="rounded-3xl border border-border bg-card/80 px-6 py-14 text-center shadow-sm sm:py-20">
      <LibraryBig className="mx-auto size-9 text-muted-foreground" aria-hidden="true" />
      <h2 className="mt-4 font-heading text-2xl font-semibold text-foreground">Your shelf couldn’t load.</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        We couldn’t retrieve your books right now. Please try again in a little while.
      </p>
      <Button variant="outline" className="mt-6 rounded-full" nativeButton={false} render={<Link href="/my-books" />}>
        Try again <ArrowRight aria-hidden="true" />
      </Button>
    </div>
  );
}

function MyBooksEmpty() {
  return (
    <div className="rounded-3xl border border-dashed border-border bg-card/65 px-6 py-14 text-center sm:py-20">
      <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <BookPlus className="size-7" aria-hidden="true" />
      </span>
      <h2 className="mt-5 font-heading text-2xl font-semibold text-foreground">Your shelf is ready for its first book.</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        Add a book you own and share it with readers in the BookNook community.
      </p>
      <p className="mt-5 text-sm font-medium text-primary">Use “Add a book” above to get started.</p>
    </div>
  );
}

async function MyBooksResults() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/signin?callbackUrl=%2Fmy-books");

  let books: Book[];
  try {
    const result: unknown = await getBooks({ email: session.user.email });
    if (!Array.isArray(result)) throw new Error("Unexpected book list response");
    const email = session.user.email.trim().toLowerCase();
    books = result.filter(isBook).filter((book) => book.addedByEmail.trim().toLowerCase() === email);
  } catch {
    return <MyBooksError />;
  }

  if (books.length === 0) return <MyBooksEmpty />;

  return (
    <>
      <div className="mb-5 flex items-center justify-between gap-4 rounded-2xl border border-border/70 bg-card/70 px-4 py-3 shadow-sm sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <LibraryBig className="size-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">Your shelf</p>
            <p className="mt-1 truncate text-sm text-foreground">Books you’ve shared with the community</p>
          </div>
        </div>
        <span className="shrink-0 rounded-xl border border-primary/10 bg-primary/5 px-3 py-2 text-sm font-semibold text-primary">
          {books.length} {books.length === 1 ? "book" : "books"}
        </span>
      </div>
      <div className="grid min-w-0 grid-cols-1 items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {books.map((book) => <BookCard key={book._id} book={book} showEdit />)}
      </div>
    </>
  );
}

export default function MyBooksPage() {
  return (
    <section className="keep-content-center w-full py-10 sm:py-14 lg:py-16" aria-label="My books">
      <header className="relative mb-8 overflow-hidden rounded-[2rem] border border-border/75 bg-card/80 p-6 shadow-lg shadow-foreground/5 backdrop-blur-sm sm:mb-10 sm:p-8">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_8%_0%,color-mix(in_srgb,var(--accent)_38%,transparent),transparent_48%),radial-gradient(ellipse_at_100%_100%,color-mix(in_srgb,var(--primary)_12%,transparent),transparent_45%)]" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary shadow-sm">
              <LibraryBig className="size-6" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Your contribution to the community</p>
              <h1 className="mt-1 font-heading text-3xl font-semibold tracking-tight text-balance text-foreground sm:text-4xl">My Books</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                Keep track of the books you’ve added to the shared shelf.
              </p>
            </div>
          </div>
          <Button className="w-full shrink-0 rounded-full shadow-sm sm:w-auto" nativeButton={false} render={<Link href="/add-book" />}>
            <BookPlus aria-hidden="true" /> Add a book <ArrowRight aria-hidden="true" />
          </Button>
        </div>
      </header>
      <Suspense fallback={<MyBooksSkeleton />}>
        <MyBooksResults />
      </Suspense>
    </section>
  );
}
