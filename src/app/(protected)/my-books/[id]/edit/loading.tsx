export default function LoadingEditBook() {
  return (
    <section className="keep-content-center w-full py-10 sm:py-14 lg:py-16" aria-label="Loading edit book form" aria-busy="true">
      <div className="mx-auto max-w-5xl">
        <div className="mb-5 h-10 w-36 animate-pulse rounded-full bg-muted/80" />
        <header className="mb-8 flex items-start gap-4">
          <div className="size-12 shrink-0 animate-pulse rounded-2xl bg-primary/10" />
          <div className="flex-1 space-y-3 pt-1">
            <div className="h-3 w-40 animate-pulse rounded-full bg-primary/15" />
            <div className="h-9 w-64 animate-pulse rounded-xl bg-muted" />
            <div className="h-4 w-full max-w-xl animate-pulse rounded-lg bg-muted/80" />
          </div>
        </header>
        <div className="grid gap-6 rounded-3xl border border-border/75 bg-card/75 p-5 shadow-sm sm:p-7 lg:grid-cols-[minmax(0,1fr)_16rem]">
          <div className="space-y-5">
            <div className="h-11 animate-pulse rounded-xl bg-muted" />
            <div className="h-11 animate-pulse rounded-xl bg-muted" />
            <div className="h-11 animate-pulse rounded-xl bg-muted" />
            <div className="h-28 animate-pulse rounded-xl bg-muted" />
            <div className="h-11 animate-pulse rounded-xl bg-muted" />
          </div>
          <div className="space-y-4">
            <div className="aspect-[4/3] animate-pulse rounded-2xl bg-muted" />
            <div className="h-11 animate-pulse rounded-xl bg-muted" />
          </div>
        </div>
      </div>
    </section>
  );
}
