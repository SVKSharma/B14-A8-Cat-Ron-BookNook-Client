export default function LoadingBookDetails() {
  return (
    <section className="keep-content-center py-8 sm:py-12 lg:py-14" aria-label="Loading book details" aria-busy="true">
      <div className="mb-7 h-5 w-32 animate-pulse rounded bg-muted" />
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-12">
        <div className="mx-auto aspect-[4/5] w-full max-w-md animate-pulse rounded-3xl bg-muted" />
        <div className="space-y-5 py-1 lg:py-3">
          <div className="h-7 w-28 animate-pulse rounded-full bg-primary/10" />
          <div className="h-12 w-full max-w-xl animate-pulse rounded-xl bg-muted" />
          <div className="h-5 w-2/5 animate-pulse rounded-lg bg-muted/80" />
          <div className="space-y-4 rounded-2xl border border-border/70 bg-card/70 p-5 sm:p-6">
            <div className="h-6 w-40 animate-pulse rounded bg-muted" />
            <div className="h-4 w-full animate-pulse rounded bg-muted" />
            <div className="h-4 w-full animate-pulse rounded bg-muted" />
            <div className="h-4 w-4/5 animate-pulse rounded bg-muted" />
          </div>
          <div className="h-16 w-full max-w-md animate-pulse rounded-2xl bg-card/80" />
          <div className="h-12 w-full max-w-md animate-pulse rounded-full bg-primary/15" />
        </div>
      </div>
    </section>
  );
}
