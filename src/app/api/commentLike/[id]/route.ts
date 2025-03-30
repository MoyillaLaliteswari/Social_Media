import { NextRequest, NextResponse } from "next/server";
import {connect} from "@/src/dbConfig/dbConfig";
import Comment from "@/src/models/commentModel";
connect()

export async function POST(req:NextRequest) {
    try {
        const { userId } = await req.json();
        const url = new URL(req.url);
        const commentId = url.pathname.split('/').pop();
        console.log(userId)
        console.log(commentId)

        if (!commentId || !userId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return NextResponse.json({ error: "Comment not found" }, { status: 404 });
        }

        let updatedLikes = comment.likes;
        const alreadyLiked = comment.likedBy?.includes(userId);

        if (alreadyLiked) {
            updatedLikes -= 1;
            await Comment.findByIdAndUpdate(commentId, { 
                $pull: { likedBy: userId },
                $set: { likes: updatedLikes }
            });
        } else {
            updatedLikes += 1;
            await Comment.findByIdAndUpdate(commentId, { 
                $push: { likedBy: userId },
                $set: { likes: updatedLikes }
            });
        }

        return NextResponse.json({ message: "Like toggled successfully", likes: updatedLikes }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: `Error liking/unliking comment: ${error}` }, { status: 500 });
    }
}
