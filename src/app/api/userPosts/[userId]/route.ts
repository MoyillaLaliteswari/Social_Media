import {NextRequest,NextResponse} from "next/server";
import {connect} from "@/src/dbConfig/dbConfig";
import Post from "@/src/models/postModel";
import User from "@/src/models/userModel";

connect();

export async function GET(request:NextRequest,{params}:{params:{userId:string}}){
    const {userId}=await params;
    console.log(userId);
    try{
        const user=await User.findById(userId);
        if(!user){
            return NextResponse.json({error:"User not authenticated!"},{status:404});
        }

        const posts=await Post.find({ createdBy: userId }).populate("createdBy");
        if(posts.length===0){
            return NextResponse.json({message:"No posts to display!"})
        }
        return NextResponse.json(posts);
    }catch(err:any){
        console.log("Error fetchng userPosts:" ,err);
        return NextResponse.json({error:"Failed to fetch user posts"},{status:500});
    }
} 