import { BookOpen } from "lucide-react";

export function MyBorrowsSkeleton() {
  return (
    <div
      className="space-y-4"
      aria-label="Loading your borrows"
      aria-busy="true"
    >
      <header className="relative overflow-hidden rounded-[2rem] border border-border/75 bg-card/80 p-6 shadow-lg shadow-foreground/5 backdrop-blur-sm sm:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_8%_0%,color-mix(in_srgb,var(--accent)_30%,transparent),transparent_48%),radial-gradient(ellipse_at_100%_100%,color-mix(in_srgb,var(--primary)_18%,transparent),transparent_45%)]" />
        <div className="relative flex items-start gap-4">
          <div className="borrow-skeleton flex size-12 shrink-0 items-center justify-center rounded-2xl">
            <BookOpen className="size-6 text-primary/80" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1 space-y-3">
            <div className="borrow-skeleton h-3 w-40 rounded-full" />
            <div className="borrow-skeleton h-9 w-52 rounded-xl" />
            <div className="borrow-skeleton h-4 w-full max-w-2xl rounded-lg" />
          </div>
        </div>
      </header>

      {Array.from({ length: 2 }, (_, index) => (
        <article
          key={index}
          className="flex flex-col gap-4 rounded-3xl border border-primary/15 bg-card/80 p-4 shadow-sm shadow-primary/5 backdrop-blur-sm sm:flex-row sm:items-center sm:gap-5 sm:p-5"
        >
          <div className="borrow-skeleton aspect-[4/3] w-full shrink-0 rounded-2xl sm:aspect-[3/4] sm:w-28" />
          <div className="min-w-0 flex-1 space-y-3">
            <div className="borrow-skeleton h-6 w-3/4 rounded" />
            <div className="borrow-skeleton h-4 w-1/2 rounded" />
            <div className="borrow-skeleton h-8 w-40 rounded-full" />
          </div>
          <div className="borrow-skeleton h-10 w-32 rounded-full sm:self-center" />
        </article>
      ))}
    </div>
  );
}
