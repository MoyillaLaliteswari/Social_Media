import {NextRequest,NextResponse} from "next/server";
import Comment from "@/src/models/commentModel";
import { connect } from "@/src/dbConfig/dbConfig";

connect();

export async function GET(request:NextRequest){
    try{
        const url=new URL(request.url)
        const postId=url.pathname.split('/').pop();
        if(!postId){
            return NextResponse.json({error:"PostId required"},{status:404});
        }
        const comments=await Comment.find({postId}).populate('createdBy');
        if(!comments || comments.length===0){
            return NextResponse.json({message:"No comments yet"},{status:400});
        }
        return NextResponse.json({message:"Comments fetched",comments},{status:200});
    }catch(error:any){
        return NextResponse.json({error:error.message},{status:500});
    }
}