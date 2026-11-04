export default function LoadingBooks() {
  return (
    <section className="w-full py-10 sm:py-14 lg:py-16" aria-label="Loading books" aria-busy="true">
      <div className="keep-content-center">
        <header className="mb-8 max-w-3xl sm:mb-10">
          <div className="h-3 w-40 animate-pulse rounded-full bg-primary/15" />
          <div className="mt-3 h-10 w-full max-w-2xl animate-pulse rounded-xl bg-muted sm:h-12" />
          <div className="mt-4 h-5 w-full max-w-2xl animate-pulse rounded-lg bg-muted/80" />
        </header>
        <div className="mb-6 flex flex-col gap-3 sm:flex-row">
          <div className="h-11 flex-1 animate-pulse rounded-xl bg-card/80" />
          <div className="h-11 w-full animate-pulse rounded-xl bg-card/80 sm:w-48" />
        </div>
        <div className="grid min-w-0 grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="overflow-hidden rounded-2xl border border-border/75 bg-card/80 shadow-sm">
              <div className="aspect-[4/3] animate-pulse bg-muted" />
              <div className="space-y-3 p-4 sm:p-5">
                <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
                <div className="h-10 w-full animate-pulse rounded bg-muted" />
                <div className="h-10 w-full animate-pulse rounded-full bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
