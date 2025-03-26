import { connect } from '@/src/dbConfig/dbConfig';
import { NextResponse, NextRequest } from 'next/server';
import Post from '@/src/models/postModel';

connect();

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const postId = url.pathname.split('/').pop();
    if(!postId){
        return NextResponse.json({error:"No post found to delete"},{status:400})
    }

    const postres=await Post.findOneAndDelete({
        _id:postId
    })

    return NextResponse.json({message:"Post deleted successfully",postres},{status:201});

  }
  catch(error:any){
    return NextResponse.json({error:error},{status:500})
  }
}