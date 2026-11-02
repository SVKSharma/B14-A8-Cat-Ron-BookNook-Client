import type { ReactNode } from "react";
import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

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

async function RequireSession({ children }: { children: ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/signin");
  return children;
}

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<ProtectedLoading />}>
      <RequireSession>{children}</RequireSession>
    </Suspense>
  );
}
