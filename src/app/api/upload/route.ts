import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ message: "Sign in to upload a book cover." }, { status: 401 });
  }

  const apiKey = process.env.IMGBB_API_KEY?.trim();
  if (!apiKey) {
    return NextResponse.json({ message: "Image uploads are not configured yet." }, { status: 503 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ message: "Choose a valid image file." }, { status: 400 });
  }

  const image = formData.get("image");
  if (!(image instanceof File) || image.size === 0) {
    return NextResponse.json({ message: "Choose a book cover image to upload." }, { status: 400 });
  }
  if (!ALLOWED_IMAGE_TYPES.has(image.type)) {
    return NextResponse.json({ message: "The selected file must be an image." }, { status: 400 });
  }
  if (image.size > MAX_IMAGE_SIZE) {
    return NextResponse.json({ message: "Choose an image smaller than 10 MB." }, { status: 413 });
  }

  const uploadData = new FormData();
  uploadData.append("image", image, image.name);
  const endpoint = new URL("https://api.imgbb.com/1/upload");
  endpoint.searchParams.set("key", apiKey);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      body: uploadData,
      signal: AbortSignal.timeout(30_000),
    });
    const result: unknown = await response.json().catch(() => null);
    const imageUrl = getImageUrl(result);
    const providerMessage = getImageError(result);

    if (!response.ok || !imageUrl) {
      return NextResponse.json(
        { message: providerMessage ?? `ImgBB upload failed (HTTP ${response.status}). Check the API key and try again.` },
        { status: 502 }
      );
    }

    return NextResponse.json({ url: imageUrl });
  } catch (error) {
    const timedOut = error instanceof Error && error.name === "TimeoutError";
    return NextResponse.json(
      { message: timedOut ? "ImgBB did not finish the upload in 30 seconds. Try a smaller image." : "The image service could not be reached. Please try again." },
      { status: timedOut ? 504 : 502 }
    );
  }
}

function getImageUrl(result: unknown): string | null {
  if (!result || typeof result !== "object") return null;
  const data = (result as { data?: unknown }).data;
  if (!data || typeof data !== "object") return null;
  const url = (data as { url?: unknown }).url;
  return typeof url === "string" && url.startsWith("https://") ? url : null;
}

function getImageError(result: unknown): string | null {
  if (!result || typeof result !== "object") return null;
  const error = (result as { error?: unknown }).error;
  if (!error || typeof error !== "object") return null;
  const message = (error as { message?: unknown }).message;
  return typeof message === "string" && message.length <= 300 ? message : null;
}
