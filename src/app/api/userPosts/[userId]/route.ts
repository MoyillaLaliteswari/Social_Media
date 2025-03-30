import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/src/dbConfig/dbConfig";
import Post from "@/src/models/postModel";
import User from "@/src/models/userModel";

connect();

export async function GET(
    request: NextRequest,
    { params }: { params: { userId: string } } // Corrected typing
) {
    try {
        console.log("User ID:", params.userId);

        const user = await User.findById(params.userId);
        if (!user) {
            return NextResponse.json({ error: "User not authenticated!" }, { status: 404 });
        }

        const posts = await Post.find({ createdBy: params.userId }).populate("createdBy");
        if (posts.length === 0) {
            return NextResponse.json({ message: "No posts to display!" });
        }

        return NextResponse.json(posts);
    } catch (err) {
        console.log("Error fetching user posts:", err);
        return NextResponse.json({ error: "Failed to fetch user posts" }, { status: 500 });
    }
}
