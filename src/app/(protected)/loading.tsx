export default function LoadingProtectedPage() {
  return (
    <section className="keep-content-center min-h-[32rem] w-full py-10 sm:py-14" aria-label="Loading your library" aria-busy="true">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="space-y-3">
          <div className="h-3 w-40 animate-pulse rounded-full bg-primary/15" />
          <div className="h-10 w-2/3 max-w-lg animate-pulse rounded-xl bg-muted" />
          <div className="h-5 w-full max-w-2xl animate-pulse rounded-lg bg-muted/80" />
        </div>
        <div className="h-48 animate-pulse rounded-3xl border border-border/70 bg-card/75 sm:h-64" />
      </div>
    </section>
  );
}
