"use client";

import dynamic from "next/dynamic";

const HeroCarouselContent = dynamic(() => import("./HeroCarouselContent"), {
  ssr: false,
  loading: () => <HeroFallback />,
});

function HeroFallback() {
  return (
    <section className="home-hero-stage keep-content-center py-6 sm:py-9" aria-label="Loading banner" aria-busy="true">
      <div className="relative overflow-hidden rounded-[2rem] border border-border bg-card shadow-[0_24px_70px_-42px_rgba(24,34,27,0.42)]">
        <div className="relative isolate flex min-h-[34rem] items-center overflow-hidden bg-[radial-gradient(ellipse_at_70%_36%,rgba(211,163,93,0.12),transparent_38%),linear-gradient(120deg,var(--background),var(--muted))] px-6 py-12 sm:min-h-[36rem] sm:px-12 lg:min-h-[39rem] lg:px-16">
          <div aria-hidden="true" className="absolute -right-20 top-1/2 -z-10 size-[28rem] -translate-y-1/2 rounded-full border border-primary/10 sm:right-2 sm:size-[38rem]" />
          <div aria-hidden="true" className="absolute -right-7 top-1/2 -z-10 size-[22rem] -translate-y-1/2 rounded-full border border-primary/10 sm:right-20 sm:size-[30rem]" />

          <div className="grid w-full items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6">
            <div className="w-full max-w-2xl">
              <div className="h-9 w-56 animate-pulse rounded-full bg-muted-foreground/15" />
              <div className="mt-6 space-y-3">
                <div className="h-10 w-full max-w-xl animate-pulse rounded-lg bg-muted-foreground/15 sm:h-12" />
                <div className="h-10 w-4/5 max-w-lg animate-pulse rounded-lg bg-muted-foreground/15 sm:h-12" />
              </div>
              <div className="mt-5 space-y-2">
                <div className="h-5 w-full max-w-xl animate-pulse rounded bg-muted-foreground/15" />
                <div className="h-5 w-4/5 max-w-lg animate-pulse rounded bg-muted-foreground/15" />
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <div className="h-12 w-40 animate-pulse rounded-full bg-muted-foreground/20" />
                <div className="h-5 w-40 animate-pulse rounded bg-muted-foreground/15" />
              </div>
            </div>

            <div aria-hidden="true" className="relative mx-auto flex h-56 w-full max-w-md items-center justify-center sm:h-72 lg:h-[26rem]">
              <div className="absolute bottom-5 h-8 w-4/5 rounded-[50%] bg-foreground/10 blur-xl" />
              <div className="absolute left-[18%] top-[22%] h-[68%] w-[39%] rotate-[-13deg] rounded-l-lg rounded-r-md bg-primary/30 shadow-2xl">
                <div className="absolute inset-y-0 left-0 w-3 rounded-l-lg bg-primary/20" />
                <div className="absolute inset-y-5 left-6 right-4 flex flex-col justify-between border-y border-white/25 py-4">
                  <div className="h-3 w-3/4 animate-pulse rounded bg-white/25" />
                  <div className="space-y-2">
                    <div className="h-4 w-full animate-pulse rounded bg-white/30" />
                    <div className="h-4 w-4/5 animate-pulse rounded bg-white/30" />
                  </div>
                  <div className="h-2 w-1/2 animate-pulse rounded bg-white/25" />
                </div>
              </div>
              <div className="absolute right-[18%] top-[18%] h-[72%] w-[42%] rotate-[9deg] rounded-l-lg rounded-r-md bg-accent/70 shadow-xl">
                <div className="absolute inset-3 rounded-sm border border-white/40" />
                <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-center">
                  <div className="size-12 animate-pulse rounded-full bg-white/25 sm:size-16" />
                </div>
              </div>
              <div className="absolute bottom-5 right-4 h-14 w-52 -rotate-6 animate-pulse rounded-2xl border border-border/80 bg-card shadow-lg sm:bottom-8 sm:right-0" />
              <div className="absolute right-8 top-6 size-8 animate-pulse rounded-full bg-primary/15" />
            </div>
          </div>
        </div>

        <div aria-hidden="true" className="absolute bottom-5 left-6 z-10 flex items-center gap-3 sm:bottom-7 sm:left-12 lg:left-16">
          <div className="size-10 rounded-full border border-border bg-card/90 shadow-sm" />
          <div className="flex items-center gap-1.5">
            <div className="h-[7px] w-[22px] rounded-full bg-primary/40" />
            <div className="size-[7px] rounded-full bg-muted-foreground/30" />
            <div className="size-[7px] rounded-full bg-muted-foreground/30" />
          </div>
          <div className="size-10 rounded-full border border-border bg-card/90 shadow-sm" />
        </div>
      </div>
    </section>
  );
}

export function HeroCarousel() {
  return <HeroCarouselContent />;
}
