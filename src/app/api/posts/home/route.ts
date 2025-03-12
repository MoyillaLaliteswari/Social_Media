import Post from "@/src/models/postModel";
import {connect} from "@/src/dbConfig/dbConfig";
import { NextResponse } from "next/server";
connect();

export async function GET(){
    try{
        const posts=await Post.find();
       return NextResponse.json({message:"Posts fetched successfully",posts,status:200});
    }catch(error:any){
        return NextResponse.json({error:error.message,status:500});
    }
}