import { BookOpen, Mail, UserRound } from "lucide-react";

export default function LoadingProfile() {
  return (
    <section className="keep-content-center w-full py-10 sm:py-14 lg:py-16" aria-label="Loading profile" aria-busy="true">
      <div className="mx-auto max-w-3xl space-y-5">
        <header className="relative overflow-hidden rounded-[2rem] border border-border/75 bg-card/80 p-6 shadow-lg shadow-foreground/5 backdrop-blur-sm sm:p-8">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_8%_0%,color-mix(in_srgb,var(--accent)_30%,transparent),transparent_48%),radial-gradient(ellipse_at_100%_100%,color-mix(in_srgb,var(--primary)_18%,transparent),transparent_45%)]" />
          <div className="relative flex items-center gap-4">
            <div className="borrow-skeleton flex size-12 shrink-0 items-center justify-center rounded-2xl">
              <BookOpen className="size-6 text-primary/80" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1 space-y-3">
              <div className="borrow-skeleton h-3 w-40 rounded-full" />
              <div className="borrow-skeleton h-9 w-56 rounded-xl" />
            </div>
          </div>
          <div className="relative mt-4 borrow-skeleton h-5 w-full max-w-xl rounded-lg" />
        </header>

        <article className="relative overflow-hidden rounded-[2rem] border border-border/75 bg-card/80 shadow-lg shadow-foreground/5 backdrop-blur-sm">
          <div className="borrow-skeleton relative h-28 overflow-hidden sm:h-36">
            <div className="absolute inset-4 rounded-2xl border border-primary/15" />
          </div>
          <div className="relative -mt-12 flex flex-col items-center gap-4 px-6 pb-7 sm:-mt-14 sm:flex-row sm:items-end sm:gap-5 sm:px-8">
            <div className="borrow-skeleton size-20 shrink-0 rounded-full border-4 border-card shadow-lg shadow-foreground/10" />
            <div className="w-full space-y-2 pb-1 text-center sm:text-left">
              <div className="borrow-skeleton mx-auto h-7 w-48 max-w-full rounded-lg sm:mx-0" />
              <div className="borrow-skeleton mx-auto h-4 w-32 rounded-md sm:mx-0" />
            </div>
          </div>

          <div className="grid gap-3 px-6 pb-6 sm:grid-cols-2 sm:px-8 sm:pb-8">
            <div className="flex items-start gap-3 rounded-2xl border border-border/70 bg-background/65 p-4">
              <span className="borrow-skeleton flex size-9 shrink-0 items-center justify-center rounded-xl">
                <Mail className="size-4 text-primary/80" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1 space-y-2 pt-1">
                <div className="borrow-skeleton h-3 w-24 rounded-full" />
                <div className="borrow-skeleton h-4 w-full rounded-md" />
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl border border-border/70 bg-background/65 p-4">
              <span className="borrow-skeleton flex size-9 shrink-0 items-center justify-center rounded-xl">
                <UserRound className="size-4 text-primary/80" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1 space-y-2 pt-1">
                <div className="borrow-skeleton h-3 w-28 rounded-full" />
                <div className="borrow-skeleton h-4 w-3/4 rounded-md" />
              </div>
            </div>
          </div>

          <div className="flex justify-center border-t border-border/70 bg-muted/20 p-5 sm:justify-end sm:px-8">
            <div className="borrow-skeleton h-11 w-full rounded-full sm:w-36" />
          </div>
        </article>
      </div>
    </section>
  );
}
