import { BookOpen } from "lucide-react";

function HomeBookCardSkeleton() {
  return (
    <article className="overflow-hidden rounded-2xl border border-border/75 bg-card/80 shadow-sm" aria-hidden="true">
      <div className="borrow-skeleton relative aspect-[4/3]">
        <div className="absolute inset-4 rounded-xl border border-primary/15" />
      </div>
      <div className="space-y-3 p-4">
        <div className="borrow-skeleton h-5 w-3/4 rounded-md" />
        <div className="borrow-skeleton h-4 w-1/2 rounded-md" />
        <div className="borrow-skeleton h-4 w-full rounded-md" />
      </div>
    </article>
  );
}

export default function LoadingHome() {
  return (
    <div aria-label="Loading home page" aria-busy="true">
      <section className="home-hero-stage keep-content-center py-6 sm:py-9">
        <div className="relative overflow-hidden rounded-[2rem] border border-border/75 bg-card/80 shadow-lg shadow-foreground/5 backdrop-blur-sm">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_8%_0%,color-mix(in_srgb,var(--accent)_30%,transparent),transparent_48%),radial-gradient(ellipse_at_100%_100%,color-mix(in_srgb,var(--primary)_18%,transparent),transparent_45%)]" />
          <div className="relative isolate flex min-h-[34rem] items-center overflow-hidden px-6 py-12 sm:min-h-[36rem] sm:px-12 lg:min-h-[39rem] lg:px-16">
            <div aria-hidden="true" className="absolute -right-20 top-1/2 -z-10 size-[28rem] -translate-y-1/2 rounded-full border border-primary/10 sm:right-2 sm:size-[38rem]" />
            <div className="grid w-full items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6">
              <div className="w-full max-w-2xl">
                <div className="borrow-skeleton h-9 w-56 rounded-full" />
                <div className="mt-6 space-y-3">
                  <div className="borrow-skeleton h-10 w-full max-w-xl rounded-lg sm:h-12" />
                  <div className="borrow-skeleton h-10 w-4/5 max-w-lg rounded-lg sm:h-12" />
                </div>
                <div className="mt-5 space-y-2">
                  <div className="borrow-skeleton h-5 w-full max-w-xl rounded-md" />
                  <div className="borrow-skeleton h-5 w-4/5 max-w-lg rounded-md" />
                </div>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <div className="borrow-skeleton h-12 w-40 rounded-full" />
                  <div className="borrow-skeleton h-5 w-40 rounded-md" />
                </div>
              </div>
              <div aria-hidden="true" className="relative mx-auto flex h-56 w-full max-w-md items-center justify-center sm:h-72 lg:h-[26rem]">
                <div className="absolute bottom-5 h-8 w-4/5 rounded-[50%] bg-foreground/10 blur-xl" />
                <div className="borrow-skeleton absolute left-[18%] top-[22%] h-[68%] w-[39%] rotate-[-13deg] rounded-lg shadow-2xl">
                  <div className="absolute inset-y-0 left-0 w-3 rounded-l-lg bg-primary/25" />
                  <div className="absolute inset-y-5 left-6 right-4 flex flex-col justify-between border-y border-white/25 py-4">
                    <div className="h-3 w-3/4 rounded bg-white/25" />
                    <div className="space-y-2">
                      <div className="h-4 w-full rounded bg-white/30" />
                      <div className="h-4 w-4/5 rounded bg-white/30" />
                    </div>
                    <div className="h-2 w-1/2 rounded bg-white/25" />
                  </div>
                </div>
                <div className="borrow-skeleton absolute right-[18%] top-[18%] h-[72%] w-[42%] rotate-[9deg] rounded-lg shadow-xl">
                  <div className="absolute inset-3 rounded-sm border border-white/40" />
                  <BookOpen className="absolute left-1/2 top-1/2 size-12 -translate-x-1/2 -translate-y-1/2 text-white/50 sm:size-16" />
                </div>
              </div>
            </div>
          </div>
          <div aria-hidden="true" className="absolute bottom-5 left-6 flex items-center gap-3 sm:bottom-7 sm:left-12 lg:left-16">
            <div className="borrow-skeleton size-10 rounded-full" />
            <div className="borrow-skeleton h-[7px] w-[22px] rounded-full" />
            <div className="borrow-skeleton size-[7px] rounded-full" />
            <div className="borrow-skeleton size-[7px] rounded-full" />
            <div className="borrow-skeleton size-10 rounded-full" />
          </div>
        </div>
      </section>

      <section className="keep-content-center py-14 sm:py-16 lg:py-20" aria-hidden="true">
        <div className="mb-8 space-y-3">
          <div className="borrow-skeleton h-3 w-40 rounded-full" />
          <div className="borrow-skeleton h-9 w-64 max-w-full rounded-xl" />
          <div className="borrow-skeleton h-4 w-full max-w-xl rounded-lg" />
        </div>
        <div className="mb-6 flex justify-end">
          <div className="borrow-skeleton h-10 w-36 rounded-full" />
        </div>
        <div className="grid min-w-0 grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {Array.from({ length: 3 }, (_, index) => <HomeBookCardSkeleton key={index} />)}
        </div>
      </section>

      <section className="w-full border-y border-border/60 py-14 sm:py-16 lg:py-20" aria-hidden="true">
        <div className="keep-content-center">
          <div className="mb-8 space-y-3">
            <div className="borrow-skeleton h-3 w-40 rounded-full" />
            <div className="borrow-skeleton h-9 w-72 max-w-full rounded-xl" />
            <div className="borrow-skeleton h-4 w-full max-w-xl rounded-lg" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
            {Array.from({ length: 3 }, (_, index) => (
              <div key={index} className="rounded-2xl border border-border/75 bg-card/80 p-5 shadow-sm sm:p-6">
                <div className="borrow-skeleton size-11 rounded-2xl" />
                <div className="borrow-skeleton mt-6 h-6 w-3/4 rounded-md" />
                <div className="borrow-skeleton mt-3 h-4 w-full rounded-md" />
                <div className="borrow-skeleton mt-2 h-4 w-4/5 rounded-md" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="keep-content-center py-14 sm:py-16 lg:py-20" aria-hidden="true">
        <div className="mb-8 space-y-3">
          <div className="borrow-skeleton h-3 w-36 rounded-full" />
          <div className="borrow-skeleton h-9 w-80 max-w-full rounded-xl" />
          <div className="borrow-skeleton h-4 w-full max-w-xl rounded-lg" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="space-y-4 rounded-2xl border border-border/75 bg-card/80 p-5 shadow-sm">
              <div className="borrow-skeleton h-5 w-full rounded-md" />
              <div className="borrow-skeleton h-5 w-4/5 rounded-md" />
              <div className="borrow-skeleton mt-8 h-10 w-36 rounded-full" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
