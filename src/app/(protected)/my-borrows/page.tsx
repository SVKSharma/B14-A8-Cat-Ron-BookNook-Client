import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ArrowRight, BookOpen, CalendarDays, LibraryBig } from "lucide-react";

import { ReturnBorrowButton } from "@/components/books/ReturnBorrowButton";
import { Button } from "@/components/ui/button";
import { getBorrows } from "@/lib/api";
import { auth } from "@/lib/auth";
import { getServerAccessToken } from "@/lib/auth-token-server";
import type { Borrow } from "@/lib/types";

export const metadata: Metadata = {
  title: "My Borrows",
  description: "Keep track of the books you are currently borrowing.",
};

function isBorrow(value: unknown): value is Borrow {
  if (typeof value !== "object" || value === null) return false;
  const borrow = value as Record<string, unknown>;
  return typeof borrow._id === "string" && borrow._id.length > 0
    && typeof borrow.bookId === "string" && borrow.bookId.length > 0
    && typeof borrow.bookTitle === "string" && borrow.bookTitle.trim().length > 0
    && typeof borrow.bookImage === "string" && borrow.bookImage.trim().length > 0
    && typeof borrow.userEmail === "string"
    && typeof borrow.borrowDate === "string" && Number.isFinite(Date.parse(borrow.borrowDate))
    && typeof borrow.returnDate === "string" && Number.isFinite(Date.parse(borrow.returnDate));
}

function dateLabel(value: string) {
  return new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(value));
}

function MyBorrowsSkeleton() {
  return (
    <div className="space-y-4" aria-label="Loading your borrows" aria-busy="true">
      {Array.from({ length: 2 }, (_, index) => <div key={index} className="h-44 animate-pulse rounded-3xl bg-card/70" />)}
    </div>
  );
}

function MyBorrowsError() {
  return (
    <div className="rounded-3xl border border-border bg-card/80 px-6 py-14 text-center shadow-sm">
      <LibraryBig className="mx-auto size-9 text-muted-foreground" aria-hidden="true" />
      <h2 className="mt-4 font-heading text-2xl font-semibold text-foreground">Your borrows couldn’t load.</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">We couldn’t retrieve your borrowing history right now. Please try again in a little while.</p>
      <Button variant="outline" className="mt-6 rounded-full" nativeButton={false} render={<Link href="/my-borrows" />}>Try again <ArrowRight aria-hidden="true" /></Button>
    </div>
  );
}

function MyBorrowsEmpty() {
  return (
    <div className="rounded-3xl border border-dashed border-border bg-card/65 px-6 py-14 text-center sm:py-20">
      <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary"><BookOpen className="size-7" aria-hidden="true" /></span>
      <h2 className="mt-5 font-heading text-2xl font-semibold text-foreground">Your next read is waiting.</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">Books you borrow from the community will appear here, along with their due dates.</p>
      <Button className="mt-6 rounded-full" nativeButton={false} render={<Link href="/books" />}>Explore the library <ArrowRight aria-hidden="true" /></Button>
    </div>
  );
}

async function MyBorrowsResults() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/signin?callbackUrl=%2Fmy-borrows");

  let borrows: Borrow[];
  try {
    const result: unknown = await getBorrows(session.user.email, AbortSignal.timeout(15_000), await getServerAccessToken(session.user.email));
    if (!Array.isArray(result)) throw new Error("Unexpected borrow list response");
    const email = session.user.email.trim().toLowerCase();
    borrows = result.filter(isBorrow).filter((borrow) => borrow.userEmail.trim().toLowerCase() === email);
  } catch {
    return <MyBorrowsError />;
  }

  if (borrows.length === 0) return <MyBorrowsEmpty />;

  return (
    <div className="space-y-4">
      {borrows.map((borrow) => (
        <article key={borrow._id} className="flex flex-col gap-4 rounded-3xl border border-border/75 bg-card/80 p-4 shadow-sm backdrop-blur-sm sm:flex-row sm:items-center sm:gap-5 sm:p-5">
          <Link href={`/books/${encodeURIComponent(borrow.bookId)}`} className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-2xl bg-muted sm:aspect-[3/4] sm:w-28" aria-label={`View ${borrow.bookTitle}`}>
            <Image src={borrow.bookImage} alt={`Cover of ${borrow.bookTitle}`} fill sizes="(max-width: 639px) 100vw, 7rem" className="object-cover" />
          </Link>
          <div className="min-w-0 flex-1">
            <Link href={`/books/${encodeURIComponent(borrow.bookId)}`} className="line-clamp-2 font-heading text-xl font-semibold text-foreground transition-colors hover:text-primary">{borrow.bookTitle}</Link>
            <p className="mt-1 text-sm text-muted-foreground">Borrowed {dateLabel(borrow.borrowDate)}</p>
            <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-accent/70 bg-accent/35 px-3 py-1.5 text-sm font-medium text-accent-foreground"><CalendarDays className="size-4" aria-hidden="true" /> Due {dateLabel(borrow.returnDate)}</p>
          </div>
          <div className="flex shrink-0 items-center sm:justify-end"><ReturnBorrowButton id={borrow._id} title={borrow.bookTitle} /></div>
        </article>
      ))}
    </div>
  );
}

export default function MyBorrowsPage() {
  return (
    <section className="keep-content-center w-full py-10 sm:py-14 lg:py-16" aria-label="My borrows">
      <header className="relative mb-8 overflow-hidden rounded-[2rem] border border-border/75 bg-card/80 p-6 shadow-lg shadow-foreground/5 backdrop-blur-sm sm:mb-10 sm:p-8">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_8%_0%,color-mix(in_srgb,var(--accent)_38%,transparent),transparent_48%),radial-gradient(ellipse_at_100%_100%,color-mix(in_srgb,var(--primary)_12%,transparent),transparent_45%)]" />
        <div className="relative flex items-start gap-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary shadow-sm"><BookOpen className="size-6" aria-hidden="true" /></span>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Your current reads</p>
            <h1 className="mt-1 font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">My Borrows</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">Keep an eye on your due dates and return books when you’re finished.</p>
          </div>
        </div>
      </header>
      <Suspense fallback={<MyBorrowsSkeleton />}><MyBorrowsResults /></Suspense>
    </section>
  );
}
