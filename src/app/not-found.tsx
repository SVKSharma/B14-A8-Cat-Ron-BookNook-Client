import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, Search } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="keep-content-center grid min-h-[65svh] w-full place-items-center py-12 sm:py-16" aria-labelledby="not-found-title">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-[2rem] border border-border/75 bg-card/85 px-6 py-10 text-center shadow-xl shadow-foreground/5 backdrop-blur-sm sm:px-12 sm:py-14">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,color-mix(in_srgb,var(--accent)_48%,transparent),transparent_58%),radial-gradient(ellipse_at_100%_100%,color-mix(in_srgb,var(--primary)_10%,transparent),transparent_48%)]" />
        <div className="relative">
          <span className="mx-auto flex size-16 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary shadow-sm sm:size-20">
            <BookOpen className="size-8 sm:size-10" aria-hidden="true" />
          </span>
          <p className="mt-7 text-xs font-bold uppercase tracking-[0.24em] text-primary">Lost between the pages?</p>
          <p className="mt-3 font-heading text-7xl font-semibold tracking-tight text-foreground sm:text-8xl">404</p>
          <h1 id="not-found-title" className="mt-3 font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">We couldn’t find that page.</h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground sm:text-base">
            This page may have moved, or the link might be out of date. Let’s get you back to a shelf that’s still here.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button className="h-11 rounded-full px-5" nativeButton={false} render={<Link href="/books" />}>
              <Search aria-hidden="true" /> Browse books <ArrowRight aria-hidden="true" />
            </Button>
            <Button variant="outline" className="h-11 rounded-full px-5" nativeButton={false} render={<Link href="/" />}>
              <ArrowLeft aria-hidden="true" /> Back home
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
