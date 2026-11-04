import { BookOpen, Search, SlidersHorizontal } from "lucide-react";

type BooksLoadingSkeletonProps = {
  showPageHeader?: boolean;
};

function BookCardSkeleton() {
  return (
    <article
      className="flex h-full flex-col overflow-hidden rounded-2xl border border-border/75 bg-card/80 shadow-sm backdrop-blur-sm"
      aria-hidden="true"
    >
      <div className="borrow-skeleton relative aspect-[4/3] overflow-hidden">
        <div className="absolute inset-4 rounded-xl border border-primary/15" />
        <div className="absolute inset-x-0 bottom-5 flex justify-center">
          <div className="borrow-skeleton h-3 w-1/3 rounded-full" />
        </div>
      </div>
      <div className="flex flex-1 flex-col space-y-3 p-4 sm:p-5">
        <div className="borrow-skeleton h-5 w-3/4 rounded-md" />
        <div className="borrow-skeleton h-4 w-1/2 rounded-md" />
        <div className="borrow-skeleton h-10 w-full rounded-xl" />
        <div className="borrow-skeleton mt-auto h-10 w-full rounded-full" />
      </div>
    </article>
  );
}

export function BooksLoadingSkeleton({ showPageHeader = false }: BooksLoadingSkeletonProps) {
  return (
    <div className="space-y-5" aria-label="Loading books" aria-busy="true">
      {showPageHeader ? (
        <header className="relative mb-8 overflow-hidden rounded-[2rem] border border-border/75 bg-card/80 p-6 shadow-lg shadow-foreground/5 backdrop-blur-sm sm:mb-10 sm:p-8">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_8%_0%,color-mix(in_srgb,var(--accent)_30%,transparent),transparent_48%),radial-gradient(ellipse_at_100%_100%,color-mix(in_srgb,var(--primary)_18%,transparent),transparent_45%)]"
          />
          <div className="relative flex items-start gap-4">
            <span className="borrow-skeleton flex size-12 shrink-0 items-center justify-center rounded-2xl">
              <BookOpen className="size-6 text-primary/80" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1 space-y-3">
              <div className="borrow-skeleton h-3 w-40 rounded-full" />
              <div className="borrow-skeleton h-10 w-full max-w-2xl rounded-xl sm:h-12" />
              <div className="borrow-skeleton h-5 w-full max-w-2xl rounded-lg" />
            </div>
          </div>
        </header>
      ) : null}

      <div className="rounded-2xl border border-border/75 bg-card/80 p-4 shadow-sm backdrop-blur-sm sm:p-5">
        <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_15rem] sm:items-end">
          <div className="space-y-2">
            <div className="borrow-skeleton h-4 w-36 rounded-md" />
            <div className="borrow-skeleton flex h-11 items-center gap-3 rounded-xl px-3">
              <Search className="size-4 text-primary/70" aria-hidden="true" />
              <div className="borrow-skeleton h-4 w-3/4 rounded-md" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="borrow-skeleton flex h-4 w-24 items-center gap-2 rounded-md">
              <SlidersHorizontal className="size-4 text-primary/70" aria-hidden="true" />
            </div>
            <div className="borrow-skeleton h-11 rounded-xl" />
          </div>
        </div>
      </div>

      <div className="flex h-8 items-center justify-between">
        <div className="borrow-skeleton h-4 w-40 rounded-md" />
        <div className="borrow-skeleton h-4 w-20 rounded-md" />
      </div>

      <div className="grid min-w-0 grid-cols-1 items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {Array.from({ length: 6 }, (_, index) => (
          <BookCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
