"use client";

import { useEffect, useRef } from "react";

import { useSession } from "@/lib/auth-client";

export function AccessTokenCookieSync() {
  const { data: session } = useSession();
  const syncedUserId = useRef<string | null>(null);
  const userId = session?.user.id ?? null;

  useEffect(() => {
    if (!userId || syncedUserId.current === userId) return;
    syncedUserId.current = userId;
    void fetch("/api/auth/token-cookie", { method: "POST", credentials: "same-origin" })
      .then((response) => {
        if (!response.ok) syncedUserId.current = null;
      })
      .catch(() => { syncedUserId.current = null; });
  }, [userId]);

  return null;
}
