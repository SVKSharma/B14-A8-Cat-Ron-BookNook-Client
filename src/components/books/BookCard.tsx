import Image from "next/image";
import Link from "next/link";
import { ArrowRight, UserRound } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Book } from "@/lib/types";

type BookCardProps = {
  book: Book;
};

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export function BookCard({ book }: BookCardProps) {
  const detailsHref = `/books/${encodeURIComponent(book._id)}`;

  return (
    <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-[1.35rem] border border-border/70 bg-card shadow-[0_3px_14px_-10px_rgba(25,38,29,0.3)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_36px_-22px_rgba(25,38,29,0.38)]">
      <Link
        href={detailsHref}
        className="relative block aspect-[4/3] overflow-hidden bg-muted focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-ring"
        aria-label={`View ${book.title} by ${book.author}`}
      >
        <Image
          src={book.image}
          alt={`Cover of ${book.title}`}
          fill
          sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
          className="object-cover transition duration-500 group-hover:scale-[1.035]"
        />
        <Badge className="absolute left-3 top-3 border border-border/70 bg-card/95 text-foreground shadow-sm">
          {book.category}
        </Badge>
      </Link>

      <div className="flex flex-1 flex-col px-4 pb-4 pt-3.5 sm:px-5 sm:pt-4">
        <h3 className="line-clamp-1 font-heading text-lg font-semibold leading-snug text-card-foreground sm:text-xl">
          <Link
            href={detailsHref}
            className="rounded-sm outline-none transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring/60"
          >
            {book.title}
          </Link>
        </h3>
        <p className="mt-1.5 truncate text-sm text-muted-foreground">
          {book.author}
        </p>
        <p className="mt-2.5 line-clamp-2 min-h-10 text-[0.8125rem] leading-5 text-muted-foreground">
          {book.description}
        </p>
      </div>

      <div className="mt-auto border-t border-border/60 bg-muted/45 px-4 py-3.5 sm:px-5">
        <div className="mb-3 flex min-w-0 items-center gap-2.5">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-primary/10 bg-primary/10 text-[0.68rem] font-bold text-primary">
            {initials(book.addedByName) || <UserRound className="size-3.5" aria-hidden="true" />}
          </span>
          <div className="min-w-0">
            <p className="text-[0.65rem] font-medium uppercase tracking-[0.12em] text-muted-foreground">
              Shared by
            </p>
            <p className="truncate text-xs font-semibold text-foreground">
              {book.addedByName}
            </p>
          </div>
        </div>
        <Button
          className="h-10 w-full rounded-full shadow-sm"
          nativeButton={false}
          render={<Link href={detailsHref} />}
        >
          View details <ArrowRight aria-hidden="true" />
        </Button>
      </div>
    </article>
  );
}
