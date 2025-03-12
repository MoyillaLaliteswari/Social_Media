import { NextRequest,NextResponse } from "next/server";
import User from "@/src/models/userModel";
import { connect } from "@/src/dbConfig/dbConfig";

connect();

export async function POST(request:NextRequest){
    try{
        const req=await request.json();
        const {user,bio}=req;
        if(!user || !bio){
            return NextResponse.json({message:"Give a valid bio!"},{status:400});
        }
        const currentUser=await User.findById(user._id);

        if(!currentUser){
            return NextResponse.json({message:"User not Authenticated!"},{status:400});
        }

        currentUser.bio=bio;
        await currentUser.save();
        return  NextResponse.json({message:"Bio updated Successfully!",currentUser});
    }catch(err:any){
        return NextResponse.json({message:err.message},{status:500});
    }
}
