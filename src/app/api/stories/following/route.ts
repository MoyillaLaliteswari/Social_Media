import { connect } from "@/src/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import Story from "@/src/models/storyModel";
import User from "@/src/models/userModel";
import { getDataFromToken } from "@/src/helpers/getDataFromToken";
connect();

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
    const req=await request;
    const userId=await getDataFromToken(req);
    if (!userId) {
        return NextResponse.json({ message: "UserId is required" }, { status: 400 });
    }
    try {
        const user = await User.findById(userId).populate("following");
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const followingIds = user.following.map((f: any) => f._id);
        
        const stories = await Story.find({
            author: { $in: followingIds },
            expiresAt: { $gt: new Date() }
        })
        .populate("author", "username profileImageURL")  // Fixed field name
        .sort({ createdAt: -1 });  // Optional: Sort by latest

        return NextResponse.json({ stories }, { status: 200 });
    } catch (error: any) {
        console.error("Error fetching stories:", error);
        return NextResponse.json({ message: "Failed to fetch stories", error: error.message }, { status: 500 });
    }
}