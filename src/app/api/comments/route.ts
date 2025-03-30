import Comment from '@/src/models/commentModel';
import { connect } from '@/src/dbConfig/dbConfig'
import { NextResponse, NextRequest } from 'next/server';
connect();

export async function POST(request: NextRequest) {
    try {
        const { commentText, user, postId } = await request.json();
        if (!commentText || !user || !postId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }
        const comment = await Comment.create({
            comment: commentText,
            postId:postId ,
            createdBy: user
        });
        return NextResponse.json({ message: "Comment has been posted", comment }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
