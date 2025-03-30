import { connect } from "@/src/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import Story from "@/src/models/storyModel";
import { getDataFromToken } from "@/src/helpers/getDataFromToken";
connect();

export async function GET(request: NextRequest) {
    try {
        const userId = await getDataFromToken(request);
        if (!userId) {
            return NextResponse.json({ message: "UserId is required" }, { status: 400 });
        }

        
        const stories = await Story.find({
            author: {$in: userId },
            expiresAt: { $gt: new Date() }
        })
        .populate("author", "username profileImageURL") || []

        console.log(stories);

        return NextResponse.json({ 
            stories: stories.map((story: typeof Story.prototype) => ({
                _id: story._id,
                user: story.author.username,
                img: story.author.profileImageURL,
                media: story.media,
                mediaType: story.mediaType
            }))
        }, { status: 200 });


    } catch (error) {
        console.error("Error fetching stories:", error);
        return NextResponse.json({ message: "Failed to fetch stories", error: error }, { status: 500 });
    }
}
