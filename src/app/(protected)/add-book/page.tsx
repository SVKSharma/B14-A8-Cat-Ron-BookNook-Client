import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { BookPlus } from "lucide-react";

import { AddBookForm } from "@/components/books/AddBookForm";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Add a Book",
  description: "Share a book with the BookNook community.",
};

export default async function AddBookPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/signin?callbackUrl=%2Fadd-book");

  return (
    <section className="keep-content-center w-full py-10 sm:py-14 lg:py-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-start gap-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary shadow-sm">
            <BookPlus className="size-6" aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Grow the shared shelf</p>
            <h1 className="mt-1 font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Add a book</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              Share a story with the community. Add the book details and a cover image to make it easy for readers to find.
            </p>
          </div>
        </div>
        <AddBookForm user={{ name: session.user.name, email: session.user.email }} />
      </div>
    </section>
  );
}
