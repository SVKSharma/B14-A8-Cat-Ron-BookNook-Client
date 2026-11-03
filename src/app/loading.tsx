export default function Loading() {
  return (
    <section className="keep-content-center min-h-[60svh] w-full py-10 sm:py-14" aria-label="Loading BookNook" aria-busy="true">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 space-y-3">
          <div className="h-3 w-32 animate-pulse rounded-full bg-primary/15" />
          <div className="h-9 w-64 max-w-full animate-pulse rounded-xl bg-muted" />
          <div className="h-4 w-96 max-w-full animate-pulse rounded-lg bg-muted/80" />
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="overflow-hidden rounded-3xl border border-border/70 bg-card/70 p-3 shadow-sm">
              <div className="aspect-[4/3] animate-pulse rounded-2xl bg-muted" />
              <div className="space-y-3 px-2 pb-2 pt-4">
                <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-muted/80" />
                <div className="h-10 w-full animate-pulse rounded-full bg-muted/80" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
