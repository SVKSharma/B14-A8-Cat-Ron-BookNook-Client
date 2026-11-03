import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, PencilLine } from "lucide-react";

import { EditBookForm } from "@/components/books/EditBookForm";
import { Button } from "@/components/ui/button";
import { getBook, ApiError } from "@/lib/api";
import { auth } from "@/lib/auth";
import { isBook } from "@/lib/book-utils";

export const metadata: Metadata = {
  title: "Edit Book",
  description: "Update the details of a book you shared with BookNook.",
};

type EditBookPageProps = { params: Promise<{ id: string }> };

function EditBookLoading() {
  return (
    <div className="keep-content-center min-h-[36rem] py-12" aria-label="Loading book details" aria-busy="true">
      <div className="mx-auto max-w-4xl space-y-5">
        <div className="h-8 w-1/3 animate-pulse rounded bg-muted" />
        <div className="h-48 animate-pulse rounded-3xl bg-card/75" />
      </div>
    </div>
  );
}

function EditBookError() {
  return (
    <section className="keep-content-center py-16">
      <div className="mx-auto max-w-lg rounded-3xl border border-border/75 bg-card/85 p-8 text-center shadow-lg">
        <h1 className="font-heading text-2xl font-semibold text-foreground">We couldn’t load this book.</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Check your connection and try opening the edit page again.</p>
        <Button className="mt-6 rounded-full" nativeButton={false} render={<Link href="/my-books" />}>
          <ArrowLeft aria-hidden="true" /> Back to My Books
        </Button>
      </div>
    </section>
  );
}

async function EditBookContent({ params }: EditBookPageProps) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/signin?callbackUrl=%2Fmy-books");

  const { id } = await params;
  let result: unknown;
  try {
    result = await getBook(id);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    return <EditBookError />;
  }

  if (!isBook(result)) notFound();
  if (result.addedByEmail.trim().toLowerCase() !== session.user.email.trim().toLowerCase()) notFound();

  return (
      <section className="keep-content-center w-full py-10 sm:py-14 lg:py-16">
        <div className="mx-auto max-w-5xl">
          <Button variant="ghost" className="mb-5 -ml-3 rounded-full text-muted-foreground" nativeButton={false} render={<Link href="/my-books" />}>
            <ArrowLeft aria-hidden="true" /> Back to My Books
          </Button>
          <header className="mb-8 flex items-start gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary shadow-sm">
              <PencilLine className="size-6" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Update your listing</p>
              <h1 className="mt-1 truncate font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Edit book details</h1>
              <p className="mt-2 text-sm leading-6 text-muted-foreground sm:text-base">Make changes to “{result.title}” on the shared shelf.</p>
            </div>
          </header>
          <EditBookForm book={result} user={{ name: session.user.name, email: session.user.email }} />
        </div>
      </section>
  );
}

export default function EditBookPage({ params }: EditBookPageProps) {
  return (
    <Suspense fallback={<EditBookLoading />}>
      <EditBookContent params={params} />
    </Suspense>
  );
}
