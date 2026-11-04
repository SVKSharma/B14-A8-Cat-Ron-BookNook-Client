export default function LoadingProfile() {
  return (
    <section className="keep-content-center w-full py-10 sm:py-14 lg:py-16" aria-label="Loading profile" aria-busy="true">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center gap-3">
          <div className="size-11 animate-pulse rounded-2xl bg-primary/10" />
          <div className="space-y-2">
            <div className="h-3 w-40 animate-pulse rounded-full bg-primary/15" />
            <div className="h-9 w-56 animate-pulse rounded-xl bg-muted" />
          </div>
        </div>
        <div className="mt-4 h-5 w-full max-w-xl animate-pulse rounded-lg bg-muted/80" />
        <div className="mt-8 overflow-hidden rounded-[2rem] border border-border/75 bg-card/90">
          <div className="h-28 animate-pulse bg-primary/10 sm:h-36" />
          <div className="relative -mt-12 flex flex-col items-center gap-4 px-6 pb-7 sm:flex-row sm:items-end sm:gap-5 sm:px-8">
            <div className="size-20 animate-pulse rounded-full border-4 border-card bg-muted" />
            <div className="space-y-2 pb-1 text-center sm:text-left">
              <div className="h-7 w-48 animate-pulse rounded bg-muted" />
              <div className="mx-auto h-4 w-32 animate-pulse rounded bg-muted/80 sm:mx-0" />
            </div>
          </div>
          <div className="grid gap-3 px-6 pb-6 sm:grid-cols-2 sm:px-8 sm:pb-8">
            <div className="h-20 animate-pulse rounded-2xl bg-background/80" />
            <div className="h-20 animate-pulse rounded-2xl bg-background/80" />
          </div>
          <div className="h-20 animate-pulse border-t border-border/70 bg-muted/20" />
        </div>
      </div>
    </section>
  );
}
