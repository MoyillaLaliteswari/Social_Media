import { connect } from "@/src/dbConfig/dbConfig";
import { NextRequest,NextResponse } from "next/server";
import Story from "@/src/models/storyModel"
import User from "@/src/models/userModel";

connect();

export async function POST(request:NextRequest){
    const {userId,mediaURL,mediaType}=await request.json();
    if(!userId || !mediaURL || !mediaType){
        return NextResponse.json({message:"All fields are required"},{status:400});
    }
    try{
        const user=await User.findById(userId);
        if(!user){
            return NextResponse.json({message:"User not found!"},{status:404});
        }
        const expiresAt=new Date(Date.now()+24*60*60*1000);
        const newStory=new Story({
            author:userId,
            medai:mediaURL,
            mediaType:mediaType,
            expiresAt:expiresAt
        });
        await newStory.save();
        return NextResponse.json({message:"Story uploaded successfully"},{status:200});
    }catch(error){
        return NextResponse.json({ message: "Failed to upload story", error }, { status: 500 });
    }
}