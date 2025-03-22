import { NextRequest, NextResponse } from "next/server";
import Comment from "@/src/models/commentModel";
import {connect} from '@/src/dbConfig/dbConfig'
connect();

export async function POST(req: NextRequest) {
    try {
        const { commentId, replyText, user } = await req.json();

        if (!commentId || !replyText || !user) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const reply = await Comment.create({ 
            comment: replyText, 
            createdBy: user, 
            postId: commentId, 
            parentId: commentId 
        });

        await Comment.findByIdAndUpdate(commentId, { $push: { replies: reply._id } });

        return NextResponse.json({ message: "Reply added successfully", reply }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Error adding reply" }, { status: 500 });
    }
}
