import Link from "next/link";
import { ArrowRight, BookOpen, Search, Undo2 } from "lucide-react";

import { SectionHeading } from "@/components/shared/SectionHeading";
import { Button } from "@/components/ui/button";

const steps = [
  {
    number: "01",
    title: "Find a book",
    description:
      "Explore the community shelf and choose a story you’re excited to spend time with.",
    Icon: Search,
  },
  {
    number: "02",
    title: "Borrow and enjoy",
    description:
      "Open the book’s details to start a borrow, then settle in with your new read.",
    Icon: BookOpen,
  },
  {
    number: "03",
    title: "Return it for the next reader",
    description:
      "When you’re finished, return the book so another reader can discover it too.",
    Icon: Undo2,
  },
];

export function HowItWorks() {
  return (
    <section className="w-full border-y border-border/60 bg-muted/35 py-14 sm:py-16 lg:py-20" aria-label="How borrowing works">
      <div className="keep-content-center">
        <SectionHeading
          eyebrow="A simple way to share"
          title="How borrowing works"
          description="Three small steps bring good books to more readers."
          action={
            <Button className="rounded-full px-5" nativeButton={false} render={<Link href="/books" />}>
              Explore the shelves <ArrowRight aria-hidden="true" />
            </Button>
          }
        />

        <ol className="relative mt-9 grid grid-cols-1 gap-4 sm:mt-11 sm:grid-cols-3 sm:gap-5 lg:gap-6">
          {steps.map(({ number, title, description, Icon }, index) => (
            <li key={number} className="relative flex min-w-0 flex-col rounded-2xl border border-border/75 bg-card p-5 shadow-sm sm:p-6">
              {index < steps.length - 1 ? (
                <span aria-hidden="true" className="absolute -right-4 top-10 z-10 hidden h-px w-3 bg-border sm:block lg:-right-5 lg:w-4" />
              ) : null}
              <div className="flex items-center justify-between gap-4">
                <span className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="size-5" strokeWidth={1.8} aria-hidden="true" />
                </span>
                <span className="font-heading text-sm font-semibold tracking-[0.14em] text-muted-foreground/70">
                  {number}
                </span>
              </div>
              <h3 className="mt-6 font-heading text-xl font-semibold tracking-tight text-card-foreground">
                {title}
              </h3>
              <p className="mt-2.5 text-sm leading-6 text-muted-foreground">
                {description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
