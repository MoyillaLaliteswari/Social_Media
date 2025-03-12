import { connect } from '@/src/dbConfig/dbConfig';
import { NextResponse, NextRequest } from 'next/server';
import Comment from '@/src/models/commentModel';

connect();

export async function POST(request: NextRequest) {
    try {
        const req = await request.json();
        const { comment, post, user, parentId } = req;

        if (!comment || !post || !user || !parentId) {
            return NextResponse.json({ error: "Comment, post, user, and parentId are required" }, { status: 400 });
        }

        const postId = post._id;
        const userId = user._id;


        const newReply = await Comment.create({
            comment,
            postId,
            createdBy: userId,
            parentId, 
        });


        await Comment.findByIdAndUpdate(parentId, { $push: { replies: newReply._id } });

        return NextResponse.json({ message: "Reply added successfully", newReply }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
