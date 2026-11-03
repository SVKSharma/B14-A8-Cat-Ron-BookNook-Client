import { NextResponse } from "next/server";

import { getServerSession } from "@/lib/auth-token-server";
import { ImageUploadError, uploadImageToImgbb } from "@/lib/imgbb";

export async function POST(request: Request) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ message: "Sign in to upload a book cover." }, { status: 401 });
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
