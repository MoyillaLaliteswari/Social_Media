import { NextRequest, NextResponse } from "next/server";
import {connect} from "@/src/dbConfig/dbConfig";
import Comment from "@/src/models/commentModel";
connect()

export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const commentId = url.pathname.split('/').pop();

        if (!commentId) {
            return NextResponse.json({ error: "Comment ID is required" }, { status: 400 });
        }

        const replies = await Comment.find({ parentId: commentId })
            .populate("createdBy", "username profileImageURL")
            .sort({ createdAt: -1 });

        return NextResponse.json({ replies }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Error fetching replies" }, { status: 500 });
    }
}
