import {NextResponse,NextRequest} from 'next/server';
import User from '@/src/models/userModel';
import {connect} from '@/src/dbConfig/dbConfig';
import Post from '@/src/models/postModel';
connect();

export async function GET(request:NextResponse){
    try{
        const url=await new URL(request.url);
        const postId=url.pathname.split('/').pop();
        if(!postId){
            return NextResponse.json({error:"Post id is required",status:400});
        }
        const post=await Post.findById(postId);
        if(!post){
            return NextResponse.json({error:"Post not found",status:404});
        }
        const user=await User.findById(post.createdBy);
        return NextResponse.json({post,user,status:200});
    }catch(error:any){
        return NextResponse.json({error:error.message,status:500});
    }
        
}