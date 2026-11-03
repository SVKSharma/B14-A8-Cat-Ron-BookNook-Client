import "server-only";

import { cookies, headers } from "next/headers";

import { auth } from "@/lib/auth";

export async function getServerSession(
  requestHeaders?: Awaited<ReturnType<typeof headers>>,
) {
  const resolvedHeaders = requestHeaders ?? await headers();
  try {
    return await auth.api.getSession({ headers: resolvedHeaders });
  } catch (error) {
    console.error("[auth] Failed to load server session", error instanceof Error
      ? { name: error.name, message: error.message }
      : { message: String(error) });
    throw error;
  }
}

function tokenMatchesEmail(token: string, email: string) {
  try {
    const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64url").toString("utf8")) as {
      email?: unknown;
      exp?: unknown;
    };
    return typeof payload.email === "string" &&
      payload.email.trim().toLowerCase() === email.trim().toLowerCase() &&
      typeof payload.exp === "number" && payload.exp * 1000 > Date.now() + 60_000;
  } catch {
    return false;
  }
}

export async function getServerAccessToken(expectedEmail: string) {
  const storedToken = (await cookies()).get("booknook_api_token")?.value;
  if (storedToken && tokenMatchesEmail(storedToken, expectedEmail)) return storedToken;

  const result = await auth.api.getToken({ headers: await headers() });
  if (!result?.token) throw new Error("A signed-in session is required for this request.");
  return result.token;
}
