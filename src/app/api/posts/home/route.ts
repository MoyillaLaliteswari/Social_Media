import Post from "@/src/models/postModel";
import { connect } from "@/src/dbConfig/dbConfig";
import { NextResponse } from "next/server";

connect();

export async function GET() {
    try {
        const posts = await Post.find().populate({
            path: "createdBy",
            select: "username email profileImageURL"
        });

        return NextResponse.json({ message: "Posts fetched successfully", posts, status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error, status: 500 });
    }
}
