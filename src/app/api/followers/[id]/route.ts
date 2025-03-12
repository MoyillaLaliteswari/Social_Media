import { NextRequest,NextResponse } from "next/server";
import User from "@/src/models/userModel";
import { connect } from "@/src/dbConfig/dbConfig";
connect();

export async function GET(request:NextRequest){
    try{
        const url=new URL(request.url);
        const userId=url.pathname.split('/').pop();

        if(!userId || userId.length!==24){
            return NextResponse.json({message:"Invalid User"},{status:400});
        }
        const user=await User.findById(userId).populate('followers','username profileImageUrl bio');
        if(!user){
            return NextResponse.json({message:"User doesn't exists"},{status:404});
        }
        const followers=user.followers;
        return NextResponse.json({message:"Followers fetched successfully",followers},{status:200});
    }catch(error:any){
        return NextResponse.json({error:error.message || "Server error"},{status:500});
    }
}