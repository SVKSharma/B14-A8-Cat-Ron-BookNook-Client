import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Sparkles } from "lucide-react";

import { BookCard } from "@/components/books/BookCard";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Button } from "@/components/ui/button";
import { BOOK_CATEGORIES } from "@/lib/constants";
import { getBooks } from "@/lib/api";
import type { Book } from "@/lib/types";

function isBook(value: unknown): value is Book {
  if (typeof value !== "object" || value === null) return false;

  const book = value as Record<string, unknown>;
  return (
    typeof book._id === "string" &&
    book._id.length > 0 &&
    typeof book.title === "string" &&
    book.title.trim().length > 0 &&
    typeof book.author === "string" &&
    book.author.trim().length > 0 &&
    typeof book.category === "string" &&
    BOOK_CATEGORIES.includes(book.category as (typeof BOOK_CATEGORIES)[number]) &&
    typeof book.image === "string" &&
    book.image.trim().length > 0 &&
    typeof book.description === "string" &&
    typeof book.addedByName === "string" &&
    typeof book.addedByEmail === "string" &&
    typeof book.createdAt === "string"
  );
}

function NewArrivalsSkeleton() {
  return (
    <div className="grid min-w-0 grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-label="Loading new arrivals" aria-busy="true">
      {Array.from({ length: 6 }, (_, index) => (
        <div key={index} className="overflow-hidden rounded-2xl border border-border/80 bg-card">
          <div className="aspect-[4/3] animate-pulse bg-muted" />
          <div className="space-y-3 p-4">
            <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
            <div className="h-4 w-full animate-pulse rounded bg-muted" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}

async function NewArrivalsContent() {
  let books: Book[];

  try {
    const result: unknown = await getBooks({ limit: 6 });
    if (!Array.isArray(result)) throw new Error("Unexpected book list response");
    books = result.filter(isBook);
  } catch {
    return (
      <div className="rounded-2xl border border-border bg-card px-6 py-12 text-center shadow-sm">
        <BookOpen className="mx-auto size-8 text-muted-foreground" aria-hidden="true" />
        <p className="mt-4 font-heading text-xl font-semibold">The shelves are taking a moment.</p>
        <p className="mt-2 text-sm text-muted-foreground">Try browsing all books while we reconnect to the library.</p>
        <Button className="mt-5 rounded-full" nativeButton={false} render={<Link href="/books" />}>
          Browse all books <ArrowRight aria-hidden="true" />
        </Button>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card/70 px-6 py-12 text-center">
        <Sparkles className="mx-auto size-8 text-primary" aria-hidden="true" />
        <p className="mt-4 font-heading text-xl font-semibold">A fresh shelf is waiting.</p>
        <p className="mt-2 text-sm text-muted-foreground">There are no books to feature just yet. Check back soon.</p>
        <Button variant="outline" className="mt-5 rounded-full" nativeButton={false} render={<Link href="/books" />}>
          Browse all books <ArrowRight aria-hidden="true" />
        </Button>
      </div>
    );
  }

  return (
    <div className="grid min-w-0 grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
      {books.map((book) => <BookCard key={book._id} book={book} />)}
    </div>
  );
}

export function NewArrivals() {
  return (
    <section className="w-full py-14 sm:py-16 lg:py-20" aria-label="New arrivals">
      <div className="keep-content-center">
        <SectionHeading
          eyebrow="Fresh from the community"
          title="New arrivals"
          description="A few recent additions to the shared shelf. Find a story that feels like yours."
          action={
            <Button variant="outline" className="rounded-full px-5" nativeButton={false} render={<Link href="/books" />}>
              View all books <ArrowRight aria-hidden="true" />
            </Button>
          }
        />
        <div className="mt-8 sm:mt-10">
          <Suspense fallback={<NewArrivalsSkeleton />}>
            <NewArrivalsContent />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
