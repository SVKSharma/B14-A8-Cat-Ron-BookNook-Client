"use client";

import { authClient } from "@/lib/auth-client";

let cachedToken: string | null = null;
let cachedTokenExpiresAt = 0;
let cookieSync: Promise<void> | null = null;

function readExpiration(token: string) {
  try {
    const encodedPayload = token.split(".")[1];
    if (!encodedPayload) return 0;
    const payload = JSON.parse(atob(encodedPayload.replace(/-/g, "+").replace(/_/g, "/"))) as { exp?: unknown };
    return typeof payload.exp === "number" ? payload.exp * 1000 : 0;
  } catch {
    return 0;
  }
}

async function syncTokenCookie(token: string) {
  if (!cookieSync) {
    cookieSync = fetch("/api/auth/token-cookie", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("Could not refresh the secure API session. Please sign in again.");
      })
      .finally(() => { cookieSync = null; });
  }
  await cookieSync;
}

export async function getBrowserAccessToken() {
  if (cachedToken && cachedTokenExpiresAt > Date.now() + 60_000) return cachedToken;

  const { data, error } = await authClient.token();
  if (error || !data?.token) {
    cachedToken = null;
    cachedTokenExpiresAt = 0;
    throw new Error(error?.message ?? "Sign in to continue.");
  }

  cachedToken = data.token;
  cachedTokenExpiresAt = readExpiration(data.token);
  await syncTokenCookie(data.token);
  return data.token;
}

export function clearBrowserAccessToken() {
  cachedToken = null;
  cachedTokenExpiresAt = 0;
  cookieSync = null;
}
