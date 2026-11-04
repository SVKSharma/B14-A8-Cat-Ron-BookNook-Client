export default function LoadingMyBooks() {
  return (
    <section className="keep-content-center w-full py-10 sm:py-14 lg:py-16" aria-label="Loading your books" aria-busy="true">
      <header className="mb-8 rounded-[2rem] border border-border/75 bg-card/75 p-6 sm:mb-10 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="size-12 shrink-0 animate-pulse rounded-2xl bg-primary/10" />
            <div className="space-y-3">
              <div className="h-3 w-48 animate-pulse rounded-full bg-primary/15" />
              <div className="h-9 w-44 animate-pulse rounded-xl bg-muted" />
              <div className="h-4 w-full max-w-lg animate-pulse rounded-lg bg-muted/80" />
            </div>
          </div>
          <div className="h-11 w-full animate-pulse rounded-full bg-primary/15 sm:w-36" />
        </div>
      </header>
      <div className="mb-5 h-16 animate-pulse rounded-2xl border border-border/70 bg-card/70" />
      <div className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="overflow-hidden rounded-2xl border border-border/75 bg-card/80">
            <div className="aspect-[4/3] animate-pulse bg-muted" />
            <div className="space-y-3 p-4">
              <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
              <div className="h-10 animate-pulse rounded-xl bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
