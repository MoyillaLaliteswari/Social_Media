import { connect } from "@/src/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import Story from "@/src/models/storyModel";
import User from "@/src/models/userModel";
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
            cloudinary.v2.uploader.upload_stream(
                { resource_type: mediaType === "video" ? "video" : "image" },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            ).end(buffer);
        });

        const mediaURL = (uploadResponse as any).secure_url;

        // Save story to MongoDB
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
        const newStory = new Story({
            author: userId,
            media: mediaURL,
            mediaType,
            expiresAt,
        });

        await newStory.save();

        return NextResponse.json({ message: "Story uploaded successfully", mediaURL }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: "Failed to upload story", error: error.message }, { status: 500 });
    }
}
