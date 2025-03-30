import { connect } from "@/src/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/src/helpers/getDataFromToken";
import cloudinary from "cloudinary";

// Cloudinary Configuration
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

connect();

export async function POST(request: NextRequest) {
    try {
        const userId = getDataFromToken(request);
        if (!userId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get("file") as Blob | null;
        const mediaType = formData.get("mediaType") as string;

        if (!file || !mediaType) {
            return NextResponse.json({ message: "All fields are required" }, { status: 400 });
        }

        // Convert Blob to Buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload to Cloudinary
        const uploadResponse = await new Promise((resolve, reject) => {
            const stream = cloudinary.v2.uploader.upload_stream(
                {
                    resource_type: mediaType === "video" ? "video" : "image", // FIXED
                    chunk_size: 6000000, // 6MB chunk size to handle large files
                    timeout: 600000, // 10 minutes timeout
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            stream.end(buffer);
        });

        const coverImageURL = (uploadResponse as { secure_url: string }).secure_url;

        return NextResponse.json({ message: "Post uploaded successfully", coverImageURL }, { status: 200 });
    } catch (error) {
        console.error("Upload Error:", error);
        return NextResponse.json({ message: "Failed to upload media", error: error }, { status: 500 });
    }
}
