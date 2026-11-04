export default function LoadingMyBorrows() {
  return (
    <section className="keep-content-center w-full py-10 sm:py-14 lg:py-16" aria-label="Loading your borrows" aria-busy="true">
      <header className="relative mb-8 overflow-hidden rounded-[2rem] border border-border/75 bg-card/80 p-6 sm:mb-10 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="size-12 shrink-0 animate-pulse rounded-2xl bg-primary/10" />
          <div className="flex-1 space-y-3">
            <div className="h-3 w-40 animate-pulse rounded-full bg-primary/15" />
            <div className="h-9 w-52 animate-pulse rounded-xl bg-muted" />
            <div className="h-4 w-full max-w-2xl animate-pulse rounded-lg bg-muted/80" />
          </div>
        </div>
      </header>
      <div className="space-y-4">
        {Array.from({ length: 2 }, (_, index) => (
          <article key={index} className="flex flex-col gap-4 rounded-3xl border border-border/75 bg-card/80 p-4 sm:flex-row sm:items-center sm:gap-5 sm:p-5">
            <div className="aspect-[4/3] w-full shrink-0 animate-pulse rounded-2xl bg-muted sm:aspect-[3/4] sm:w-28" />
            <div className="min-w-0 flex-1 space-y-3">
              <div className="h-6 w-3/4 animate-pulse rounded bg-muted" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
              <div className="h-8 w-40 animate-pulse rounded-full bg-accent/40" />
            </div>
            <div className="h-10 w-32 animate-pulse rounded-full bg-muted sm:self-center" />
          </article>
        ))}
      </div>
    </section>
  );
}
