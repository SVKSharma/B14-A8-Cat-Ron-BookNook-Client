import { BookPlus } from "lucide-react";

export default function LoadingAddBook() {
  return (
    <section className="keep-content-center w-full py-10 sm:py-14 lg:py-16" aria-label="Loading add book form" aria-busy="true">
      <div className="mx-auto max-w-5xl">
        <header className="relative mb-8 overflow-hidden rounded-[2rem] border border-border/75 bg-card/80 p-6 shadow-lg shadow-foreground/5 backdrop-blur-sm sm:p-8">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_8%_0%,color-mix(in_srgb,var(--accent)_30%,transparent),transparent_48%),radial-gradient(ellipse_at_100%_100%,color-mix(in_srgb,var(--primary)_18%,transparent),transparent_45%)]" />
          <div className="relative flex items-start gap-4">
            <div className="borrow-skeleton flex size-12 shrink-0 items-center justify-center rounded-2xl">
              <BookPlus className="size-6 text-primary/80" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1 space-y-3 pt-1">
              <div className="borrow-skeleton h-3 w-40 rounded-full" />
              <div className="borrow-skeleton h-9 w-56 rounded-xl" />
              <div className="borrow-skeleton h-4 w-full max-w-2xl rounded-lg" />
            </div>
          </div>
        </header>
        <div className="grid gap-6 rounded-3xl border border-border/75 bg-card/80 p-5 shadow-lg shadow-foreground/5 backdrop-blur-sm sm:p-7 lg:grid-cols-[minmax(0,1fr)_19rem]">
          <div className="space-y-6">
            <div className="grid gap-5 sm:grid-cols-2">
              {Array.from({ length: 2 }, (_, index) => (
                <div key={index} className="space-y-2">
                  <div className="borrow-skeleton h-4 w-24 rounded-md" />
                  <div className="borrow-skeleton h-11 rounded-xl" />
                  <div className="borrow-skeleton h-3 w-3/4 rounded-md" />
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <div className="borrow-skeleton h-4 w-20 rounded-md" />
              <div className="borrow-skeleton h-11 rounded-xl" />
            </div>
            <div className="space-y-2">
              <div className="borrow-skeleton h-4 w-32 rounded-md" />
              <div className="borrow-skeleton h-28 rounded-xl" />
            </div>
            <div className="borrow-skeleton h-11 w-full rounded-full sm:w-40" />
          </div>
          <div className="space-y-4">
            <div className="borrow-skeleton relative aspect-[4/3] overflow-hidden rounded-2xl">
              <div className="absolute inset-4 rounded-xl border border-primary/15" />
            </div>
            <div className="borrow-skeleton h-11 rounded-xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
