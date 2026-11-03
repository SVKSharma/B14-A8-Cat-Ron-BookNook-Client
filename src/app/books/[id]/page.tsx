import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft, BookOpen, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BorrowBookButton } from "@/components/books/BorrowBookButton";
import { ApiError, getBook } from "@/lib/api";
import { isBook } from "@/lib/book-utils";
import type { Book } from "@/lib/types";

type BookDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: BookDetailsPageProps): Promise<Metadata> {
  try {
    const { id } = await params;
    const result: unknown = await getBook(id);
    if (!isBook(result)) return { title: "Book Details" };

    return {
      title: result.title,
      description: `${result.title} by ${result.author}. ${result.description.slice(0, 120)}`,
      openGraph: {
        title: `${result.title} by ${result.author}`,
        description: result.description.slice(0, 180),
        images: [{ url: result.image, alt: `Cover of ${result.title}` }],
      },
    };
  } catch {
    return { title: "Book Details" };
  }
}

function BookDetailsSkeleton() {
  return (
    <section className="keep-content-center py-10 sm:py-14" aria-label="Loading book details" aria-busy="true">
      <div className="mb-8 h-5 w-28 animate-pulse rounded bg-muted" />
      <div className="grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-12">
        <div className="mx-auto aspect-[4/5] w-full max-w-md animate-pulse rounded-3xl bg-muted" />
        <div className="space-y-5 py-2">
          <div className="h-7 w-28 animate-pulse rounded-full bg-muted" />
          <div className="h-12 w-4/5 animate-pulse rounded bg-muted" />
          <div className="h-5 w-2/5 animate-pulse rounded bg-muted" />
          <div className="h-32 w-full animate-pulse rounded-2xl bg-muted" />
          <div className="h-14 w-full max-w-sm animate-pulse rounded-2xl bg-muted" />
        </div>
      </div>
    </section>
  );
}

function BookDetailsError() {
  return (
    <div className="mx-auto max-w-xl rounded-3xl border border-border bg-card/80 px-6 py-14 text-center shadow-sm">
      <BookOpen className="mx-auto size-9 text-muted-foreground" aria-hidden="true" />
      <h1 className="mt-4 font-heading text-2xl font-semibold text-foreground">The book details aren’t available right now.</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">Please return to the shelves and try again in a little while.</p>
      <Button className="mt-6 rounded-full" nativeButton={false} render={<Link href="/books" />}>
        <ArrowLeft aria-hidden="true" /> Back to all books
      </Button>
    </div>
  );
}

function BookDetails({ book }: { book: Book }) {
  return (
    <section className="keep-content-center py-8 sm:py-12 lg:py-14">
      <Link href="/books" className="mb-7 inline-flex items-center gap-2 rounded-md text-sm font-medium text-muted-foreground transition hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">
        <ArrowLeft className="size-4" aria-hidden="true" /> Back to all books
      </Link>

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-12">
        <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-3xl border border-border/70 bg-card shadow-xl shadow-foreground/10">
          <Image
            src={book.image}
            alt={`Cover of ${book.title}`}
            fill
            priority
            sizes="(max-width: 1023px) 100vw, 40vw"
            className="object-cover"
          />
        </div>

        <article className="min-w-0 py-1 lg:py-3">
          <Badge className="rounded-full border border-primary/15 bg-primary/10 px-3 py-1 text-primary">
            {book.category}
          </Badge>
          <h1 className="mt-5 text-balance font-heading text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            {book.title}
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">by <span className="font-medium text-foreground">{book.author}</span></p>

          <div className="mt-7 rounded-2xl border border-border/70 bg-card/75 p-5 sm:p-6">
            <h2 className="font-heading text-xl font-semibold text-foreground">About this book</h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-muted-foreground sm:text-base">
              {book.description}
            </p>
          </div>

          <div className="mt-5 rounded-2xl border border-border/70 bg-card/70 p-4 sm:p-5">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <UserRound className="size-5" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block text-xs text-muted-foreground">Shared with the community by</span>
                <span className="block truncate text-sm font-semibold text-foreground">{book.addedByName}</span>
              </span>
            </div>
          </div>

          <div className="mt-6 max-w-md">
            <BorrowBookButton key={book._id} book={book} />
            <p className="mt-2 text-center text-xs leading-5 text-muted-foreground">
              Borrowed books are due back in 7 days. Find yours in My Borrows.
            </p>
          </div>
        </article>
      </div>
    </section>
  );
}

async function BookDetailsContent({ params }: BookDetailsPageProps) {
  const { id } = await params;
  let result: unknown;

  try {
    result = await getBook(id);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    return (
      <section className="keep-content-center py-12 sm:py-16">
        <BookDetailsError />
      </section>
    );
  }

  if (!isBook(result)) notFound();
  return <BookDetails book={result} />;
}

export default function BookDetailsPage({ params }: BookDetailsPageProps) {
  return (
    <Suspense fallback={<BookDetailsSkeleton />}>
      <BookDetailsContent params={params} />
    </Suspense>
  );
}
