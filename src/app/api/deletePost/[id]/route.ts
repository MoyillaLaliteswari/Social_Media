import Post from "@/src/models/postModel";
import { NextRequest,NextResponse } from "next/server";
import { connect } from "@/src/dbConfig/dbConfig";
connect();

export async function DELETE(request:NextRequest){
    try{
        const url=new URL(request.url);
        const id=url.pathname.split('/').pop();
        const post=await Post.findById(id);

        if(!post){
            return NextResponse.json({message:"Post not found"},{status:404});
        }
        await Post.deleteOne({_id:id});
        return NextResponse.json({message:"Post deleted Successfully"},{status:200});
    }catch(error){
        return NextResponse.json({message:"Server Error",error},{status:500});
    }
}