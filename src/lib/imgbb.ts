const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export class ImageUploadError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ImageUploadError";
    this.status = status;
  }
}

export async function uploadImageToImgbb(image: File): Promise<string> {
  const apiKey = process.env.IMGBB_API_KEY?.trim();
  if (!apiKey) {
    throw new ImageUploadError("Image uploads are not configured yet.", 503);
  }

  if (image.size === 0) {
    throw new ImageUploadError("Choose a valid image file.", 400);
  }

  if (!ALLOWED_IMAGE_TYPES.has(image.type)) {
    throw new ImageUploadError("The selected file must be a JPG, PNG, WEBP, or GIF image.", 400);
  }

  if (image.size > MAX_IMAGE_SIZE) {
    throw new ImageUploadError("Choose an image smaller than 10 MB.", 413);
  }

  const uploadData = new FormData();
  uploadData.append("image", image, image.name);
  const endpoint = new URL("https://api.imgbb.com/1/upload");
  endpoint.searchParams.set("key", apiKey);

  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      body: uploadData,
      signal: AbortSignal.timeout(30_000),
    });
  } catch (error) {
    const timedOut = error instanceof Error && error.name === "TimeoutError";
    throw new ImageUploadError(
      timedOut
        ? "ImgBB did not finish the upload in 30 seconds. Try a smaller image."
        : "The image service could not be reached. Please try again.",
      timedOut ? 504 : 502
    );
  }

  const result: unknown = await response.json().catch(() => null);
  const imageUrl = getImageUrl(result);
  const providerMessage = getImageError(result);

  if (!response.ok || !imageUrl) {
    throw new ImageUploadError(
      providerMessage ?? `ImgBB upload failed (HTTP ${response.status}). Check the API key and try again.`,
      502
    );
  }

  return imageUrl;
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
