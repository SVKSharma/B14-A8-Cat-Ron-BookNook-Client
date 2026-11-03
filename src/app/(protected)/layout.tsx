import type { ReactNode } from "react";
import { Suspense } from "react";

function ProtectedLoading() {
  return (
    <div className="keep-content-center min-h-[32rem] py-12" aria-label="Loading your library" aria-busy="true">
      <div className="mx-auto max-w-3xl space-y-5">
        <div className="h-9 w-2/5 animate-pulse rounded bg-muted" />
        <div className="h-40 animate-pulse rounded-2xl bg-muted/70" />
        <div className="h-40 animate-pulse rounded-2xl bg-muted/70" />
      </div>
    </div>
  );
}

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<ProtectedLoading />}>
      {children}
    </Suspense>
  );
}
