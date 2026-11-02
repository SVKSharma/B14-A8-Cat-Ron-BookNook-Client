import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, BookOpen, Library } from "lucide-react";

import { BooksCatalog } from "@/components/books/BooksCatalog";
import { Button } from "@/components/ui/button";
import { getBooks } from "@/lib/api";
import { isBook } from "@/lib/book-utils";
import type { Book } from "@/lib/types";

export const metadata: Metadata = {
  title: "All Books",
  description: "Explore books shared by the BookNook community. Search by title or author and browse by category.",
};

function BooksGridSkeleton() {
  return (
    <div className="grid min-w-0 grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6" aria-label="Loading books" aria-busy="true">
      {Array.from({ length: 6 }, (_, index) => (
        <div key={index} className="overflow-hidden rounded-2xl border border-border/75 bg-card/80 shadow-sm">
          <div className="aspect-[4/3] animate-pulse bg-muted" />
          <div className="space-y-3 p-4 sm:p-5">
            <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
            <div className="h-10 w-full animate-pulse rounded bg-muted" />
            <div className="h-10 w-full animate-pulse rounded-full bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyLibrary() {
  return (
    <div className="rounded-3xl border border-dashed border-border bg-card/65 px-6 py-14 text-center sm:py-20">
      <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Library className="size-7" aria-hidden="true" />
      </span>
      <h2 className="mt-5 font-heading text-2xl font-semibold text-foreground">The shared shelf is just getting started.</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        There aren’t any books to browse yet. Come back soon to see what readers have added.
      </p>
      <Button className="mt-6 rounded-full" nativeButton={false} render={<Link href="/" />}>
        Back to home <ArrowRight aria-hidden="true" />
      </Button>
    </div>
  );
}

function BooksLoadError() {
  return (
    <div className="rounded-3xl border border-border bg-card/80 px-6 py-14 text-center shadow-sm sm:py-20">
      <BookOpen className="mx-auto size-8 text-muted-foreground" aria-hidden="true" />
      <h2 className="mt-4 font-heading text-2xl font-semibold text-foreground">The library is taking a moment.</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        We couldn’t load the book list right now. Please try again in a little while.
      </p>
      <Button variant="outline" className="mt-6 rounded-full" nativeButton={false} render={<a href="/books" />}>
        Try again <ArrowRight aria-hidden="true" />
      </Button>
    </div>
  );
}

async function BooksResults() {
  let books: Book[];

  try {
    const result: unknown = await getBooks();
    if (!Array.isArray(result)) throw new Error("Unexpected book list response");
    books = result.filter(isBook);
  } catch {
    return <BooksLoadError />;
  }

  if (books.length === 0) return <EmptyLibrary />;
  return <BooksCatalog books={books} />;
}

export default function BooksPage() {
  return (
    <section className="w-full py-10 sm:py-14 lg:py-16" aria-label="All books">
      <div className="keep-content-center">
        <header className="mb-8 max-w-3xl sm:mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">The community shelf</p>
          <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-balance text-foreground sm:text-4xl lg:text-5xl">
            Find a story to take along.
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
            Browse books shared by readers. Search by title or author, or explore one category at a time.
          </p>
        </header>

        <Suspense fallback={<BooksGridSkeleton />}>
          <BooksResults />
        </Suspense>
      </div>
    </section>
  );
}
