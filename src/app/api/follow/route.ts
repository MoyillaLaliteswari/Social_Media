import { connect } from "@/src/dbConfig/dbConfig";
import {NextRequest,NextResponse} from "next/server";
import User from "@/src/models/userModel";

connect();

export async function POST(request:NextRequest){
    const req=await request.json();
    const {userId,myId}=req;
    if(!userId || !myId){
        return NextResponse.json({message:"Ids are necessary."},{status:404});
    }
    try{
        const ExistingUser=await User.findById(userId);
        const currentUser=await User.findById(myId);
        if(!ExistingUser || !currentUser){
            return NextResponse.json({message:"User not found."},{status:400});
        }
        if(!Array.isArray(ExistingUser.followers)){
            ExistingUser.followers=[];
        }
        if(!Array.isArray(currentUser.following)){
            currentUser.following=[];
        }
        if(ExistingUser.followers.includes(myId)){
            return NextResponse.json({message:"You have been already following"},{status:400});
        }
        ExistingUser.followers.push(myId);
        currentUser.following.push(userId);

        await ExistingUser.save();
        await currentUser.save();
        
        return NextResponse.json({message:"Followed successfully,"},{status:200});
    }catch(error){
        return NextResponse.json({ message: "An error occurred.", error }, { status: 500 });
    }
}