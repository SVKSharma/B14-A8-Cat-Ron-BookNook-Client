"use client";

import dynamic from "next/dynamic";

const HeroCarouselContent = dynamic(() => import("./HeroCarouselContent"), {
  ssr: false,
  loading: () => <HeroFallback />,
});

function HeroFallback() {
  return (
    <section className="home-hero-stage keep-content-center py-8 sm:py-10">
      <div className="relative min-h-[30rem] overflow-hidden rounded-[2rem] border border-border bg-card sm:min-h-[34rem]">
        <div className="absolute inset-0 animate-pulse bg-muted/60" />
        <div className="relative flex min-h-[30rem] items-center px-7 py-12 sm:min-h-[34rem] sm:px-14">
          <div className="max-w-2xl space-y-5">
            <div className="h-4 w-36 rounded bg-muted-foreground/15" />
            <div className="h-12 w-full max-w-xl rounded bg-muted-foreground/15" />
            <div className="h-5 w-full max-w-lg rounded bg-muted-foreground/15" />
            <div className="h-11 w-36 rounded-full bg-muted-foreground/15" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function HeroCarousel() {
  return <HeroCarouselContent />;
}
