import { NextResponse } from "next/server";

import { ImageUploadError, uploadImageToImgbb } from "@/lib/imgbb";

/**
 * Sign-up happens before a session exists, so profile photo uploads must be
 * available without authentication. The shared ImgBB helper validates the
 * file type and size before sending anything to the image service.
 */
export async function POST(request: Request) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ message: "Choose a valid image file." }, { status: 400 });
  }

  const image = formData.get("image");
  if (!(image instanceof File) || image.size === 0) {
    return NextResponse.json({ message: "Choose a profile photo to upload." }, { status: 400 });
  }

  try {
    const url = await uploadImageToImgbb(image);
    return NextResponse.json({ url });
  } catch (error) {
    if (error instanceof ImageUploadError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    return NextResponse.json(
      { message: "The image service could not be reached. Please try again." },
      { status: 502 }
    );
  }
}
