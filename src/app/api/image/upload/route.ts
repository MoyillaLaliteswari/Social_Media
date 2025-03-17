import { NextResponse, NextRequest } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("media") as File;

    if (!file) {
      return NextResponse.json({ success: false, error: "No media file provided." }, { status: 400 });
    }

    // Convert file to base64
    const buffer = await file.arrayBuffer();
    const base64String = `data:${file.type};base64,${Buffer.from(buffer).toString("base64")}`;

    console.log("Uploading image to Cloudinary...");
    const uploadResponse = await cloudinary.uploader.upload(base64String, { folder: "uploads" });

    return NextResponse.json({ success: true, secure_url: uploadResponse.secure_url });
  } catch (error: any) {
    console.error("Cloudinary upload error:", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
