import { NextRequest,NextResponse } from "next/server";
import { connect } from "@/src/dbConfig/dbConfig";
import { getDataFromToken } from "@/src/helpers/getDataFromToken";
import Post from "@/src/models/postModel";
connect();

export async function GET(request:NextRequest,userId:string){
    try{
        const req=await request.json();
        const userId=await getDataFromToken(req.token);
        if(!userId){
            return NextResponse.json({error:"User not authenticated!"})
        }
        const posts=await Post.find({userId}).sort({createdAt:-1})
        if(posts.length===0){
            return NextResponse.json({message:"No posts to Display"});
        }
    }catch(error){
        console.log(error)
        return NextResponse.json({message:error,status:400})
    }
}