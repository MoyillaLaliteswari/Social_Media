import { connect } from '@/src/dbConfig/dbConfig';
import { NextResponse, NextRequest } from 'next/server';
import Comment from '@/src/models/commentModel';

connect();

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const commentId = url.pathname.split('/').pop();
    if(!commentId){
        return NextResponse.json({error:"No post found to delete"},{status:400})
    }

    const commentRes=await Comment.findOneAndDelete({
        _id:commentId
    })

    return NextResponse.json({message:"Comment deleted successfully",commentRes},{status:201});

  }
  catch(error){
    return NextResponse.json({error},{status:500})
  }
}