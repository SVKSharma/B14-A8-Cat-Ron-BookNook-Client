export default function Loading() {
  return (
    <div aria-label="Loading home page" aria-busy="true">
      <section className="home-hero-stage keep-content-center py-8 sm:py-10">
        <div className="relative min-h-[30rem] overflow-hidden rounded-[2rem] border border-border bg-card sm:min-h-[34rem]">
          <div className="absolute inset-0 animate-pulse bg-muted/60" />
          <div className="relative flex min-h-[30rem] items-center px-7 py-12 sm:min-h-[34rem] sm:px-14">
            <div className="w-full max-w-2xl space-y-5">
              <div className="h-4 w-36 animate-pulse rounded bg-muted" />
              <div className="h-12 w-full max-w-xl animate-pulse rounded-xl bg-muted" />
              <div className="h-5 w-full max-w-lg animate-pulse rounded-lg bg-muted" />
              <div className="h-11 w-36 animate-pulse rounded-full bg-primary/15" />
            </div>
          </div>
        </div>
      </section>
      <section className="keep-content-center py-14 sm:py-16 lg:py-20">
        <div className="mb-8 space-y-3">
          <div className="h-3 w-36 animate-pulse rounded-full bg-primary/15" />
          <div className="h-9 w-64 max-w-full animate-pulse rounded-xl bg-muted" />
          <div className="h-4 w-full max-w-xl animate-pulse rounded-lg bg-muted/80" />
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="overflow-hidden rounded-2xl border border-border/80 bg-card/80">
              <div className="aspect-[4/3] animate-pulse bg-muted" />
              <div className="space-y-3 p-4">
                <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
                <div className="h-4 w-full animate-pulse rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
