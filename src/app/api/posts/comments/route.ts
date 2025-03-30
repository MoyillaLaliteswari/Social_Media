
import Comment from '@/src/models/commentModel';
import { connect } from '@/src/dbConfig/dbConfig';
import { NextResponse, NextRequest } from 'next/server';

connect()

export async function POST(request: NextRequest) {
    try {
        const req=await request.json();
        const {comment,post,user}=req;
        if(!comment || !post || !user){
            return NextResponse.json({error:"Comment, post and user are required",status:400});
        }
        const postId=await post._id;
        const userId=await user._id;
        const newComment=await Comment.create({
            comment,
            postId:postId,
            createdBy:userId
        });
        return NextResponse.json({message:"Comment added successfully",newComment,status:200});
    }
    catch(error) {
        return NextResponse.json({ error: error, status: 500 });
    }
};