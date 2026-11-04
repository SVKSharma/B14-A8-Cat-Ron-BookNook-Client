import { ArrowLeft, BookOpen, UserRound } from "lucide-react";

export function BookDetailsSkeleton() {
  return (
    <section
      className="keep-content-center py-8 sm:py-12 lg:py-14"
      aria-label="Loading book details"
      aria-busy="true"
    >
      <div className="borrow-skeleton mb-7 flex h-5 w-36 items-center gap-2 rounded-md">
        <ArrowLeft className="size-4 text-primary/70" aria-hidden="true" />
      </div>
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-12">
        <div className="borrow-skeleton relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-3xl border border-border/70 shadow-xl shadow-foreground/10">
          <div className="absolute inset-5 rounded-2xl border border-primary/15" />
          <BookOpen className="absolute left-1/2 top-1/2 size-12 -translate-x-1/2 -translate-y-1/2 text-primary/30" aria-hidden="true" />
        </div>
        <article className="min-w-0 space-y-5 py-1 lg:py-3">
          <div className="borrow-skeleton h-7 w-28 rounded-full" />
          <div className="borrow-skeleton h-12 w-4/5 max-w-xl rounded-xl" />
          <div className="borrow-skeleton h-5 w-2/5 rounded-lg" />
          <div className="space-y-4 rounded-2xl border border-border/70 bg-card/70 p-5 sm:p-6">
            <div className="borrow-skeleton h-6 w-40 rounded-md" />
            <div className="borrow-skeleton h-4 w-full rounded-md" />
            <div className="borrow-skeleton h-4 w-full rounded-md" />
            <div className="borrow-skeleton h-4 w-4/5 rounded-md" />
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-card/70 p-4 sm:p-5">
            <div className="borrow-skeleton flex size-10 shrink-0 items-center justify-center rounded-full">
              <UserRound className="size-5 text-primary/70" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1 space-y-2">
              <div className="borrow-skeleton h-3 w-44 rounded-md" />
              <div className="borrow-skeleton h-4 w-32 rounded-md" />
            </div>
          </div>
          <div className="borrow-skeleton h-12 w-full max-w-md rounded-full" />
        </article>
      </div>
    </section>
  );
}
