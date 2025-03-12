
import {connect} from '@/src/dbConfig/dbConfig';
import {NextResponse,NextRequest} from 'next/server';
import Comment from '@/src/models/commentModel';
connect();

export async function GET(request:NextRequest) {
    try{
        const url=await new URL(request.url);
        const postId=url.pathname.split('/').pop();
        if(!postId){
            return NextResponse.json({error:"Blog id is required",status:400});
        }
        const comments=await Comment.find({postId}).populate('createdBy');
        if(!comments || comments.length===0){
           return NextResponse.json({error:"No comments found",status:404}); 
        }
    }catch(error:any){
        return NextResponse.json({error:error.message,status:500});
    }
}