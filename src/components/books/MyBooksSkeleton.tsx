import { BookPlus, LibraryBig } from "lucide-react";

type MyBooksSkeletonProps = {
  showPageHeader?: boolean;
};

function BookCardSkeleton({ index }: { index: number }) {
  return (
    <article
      className="flex h-full flex-col overflow-hidden rounded-2xl border border-primary/15 bg-card/80 shadow-sm shadow-primary/5 backdrop-blur-sm"
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
        <div className="borrow-skeleton mt-auto h-10 w-full rounded-xl" />
      </div>
      <span className="sr-only">Loading book {index + 1}</span>
    </article>
  );
}

export function MyBooksSkeleton({ showPageHeader = false }: MyBooksSkeletonProps) {
  return (
    <div className="space-y-5" aria-label="Loading your books" aria-busy="true">
      {showPageHeader ? (
        <header className="relative mb-8 overflow-hidden rounded-[2rem] border border-border/75 bg-card/80 p-6 shadow-lg shadow-foreground/5 backdrop-blur-sm sm:mb-10 sm:p-8">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_8%_0%,color-mix(in_srgb,var(--accent)_30%,transparent),transparent_48%),radial-gradient(ellipse_at_100%_100%,color-mix(in_srgb,var(--primary)_18%,transparent),transparent_45%)]"
          />
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-start gap-4">
              <span className="borrow-skeleton flex size-12 shrink-0 items-center justify-center rounded-2xl">
                <LibraryBig className="size-6 text-primary" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1 space-y-3">
                <div className="borrow-skeleton h-3 w-52 rounded-full" />
                <div className="borrow-skeleton h-9 w-44 rounded-xl" />
                <div className="borrow-skeleton h-4 w-full max-w-lg rounded-lg" />
              </div>
            </div>
            <div className="borrow-skeleton flex h-11 w-full items-center justify-center gap-2 rounded-full sm:w-36">
              <BookPlus className="size-4 text-primary/80" aria-hidden="true" />
            </div>
          </div>
        </header>
      ) : null}

      <div className="flex h-16 items-center gap-3 rounded-2xl border border-border/70 bg-card/70 px-4 shadow-sm sm:px-5">
        <span className="borrow-skeleton size-10 shrink-0 rounded-xl" />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="borrow-skeleton h-3 w-24 rounded-full" />
          <div className="borrow-skeleton h-4 w-56 max-w-full rounded-md" />
        </div>
        <div className="borrow-skeleton h-9 w-20 shrink-0 rounded-xl" />
      </div>

      <div className="grid min-w-0 grid-cols-1 items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {Array.from({ length: 3 }, (_, index) => (
          <BookCardSkeleton key={index} index={index} />
        ))}
      </div>
    </div>
  );
}
