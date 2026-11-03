import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";

const ACCESS_TOKEN_COOKIE = "booknook_api_token";
const TOKEN_MAX_AGE = 7 * 24 * 60 * 60;

export async function POST(request: Request) {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({ headers: requestHeaders });
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let token: string | undefined;
  try {
    const body = await request.json() as { token?: unknown };
    if (typeof body.token === "string" && body.token.length <= 8192 && body.token.split(".").length === 3) {
      token = body.token;
    }
  } catch {
    // Existing sessions can still sync a token without a request body.
  }

  if (!token) {
    const result = await auth.api.getToken({ headers: requestHeaders });
    token = result?.token;
  }
  if (!token) {
    return NextResponse.json({ message: "Could not create an API token." }, { status: 500 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(ACCESS_TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: TOKEN_MAX_AGE,
  });
  response.headers.set("Cache-Control", "no-store");
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(ACCESS_TOKEN_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  response.headers.set("Cache-Control", "no-store");
  return response;
}
