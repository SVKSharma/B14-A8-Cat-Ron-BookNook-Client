import { auth, connectAuthDatabase } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

const handlers = toNextJsHandler(auth);

export async function GET(...args: Parameters<typeof handlers.GET>) {
  await connectAuthDatabase();
  return handlers.GET(...args);
}

export async function POST(...args: Parameters<typeof handlers.POST>) {
  await connectAuthDatabase();
  return handlers.POST(...args);
}