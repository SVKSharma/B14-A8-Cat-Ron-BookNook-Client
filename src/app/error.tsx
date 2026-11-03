"use client";

import Link from "next/link";
import { AlertTriangle, ArrowRight, RotateCw } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="keep-content-center grid min-h-[65svh] w-full place-items-center py-12 sm:py-16" aria-labelledby="error-title">
      <div className="w-full max-w-xl rounded-[2rem] border border-border/75 bg-card/85 px-6 py-10 text-center shadow-xl shadow-foreground/5 backdrop-blur-sm sm:px-10 sm:py-12">
        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
          <AlertTriangle className="size-7" aria-hidden="true" />
        </span>
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-primary">A small interruption</p>
        <h1 id="error-title" className="mt-2 font-heading text-2xl font-semibold text-foreground sm:text-3xl">This page hit an unexpected snag.</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">Your books are safe. Try loading this page again, or return to the library.</p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Button className="rounded-full" onClick={reset}><RotateCw aria-hidden="true" /> Try again</Button>
          <Button variant="outline" className="rounded-full" nativeButton={false} render={<Link href="/books" />}>Browse books <ArrowRight aria-hidden="true" /></Button>
        </div>
      </div>
    </section>
  );
}
