import { NextResponse,NextRequest } from "next/server";
import {connect} from '@/src/dbConfig/dbConfig';
import User from "@/src/models/userModel";
connect();

export async function GET(request:NextRequest) {
    try {
        const url=new URL(request.url);
        const userId=url.pathname.split('/').pop();

        if(!userId)
            return NextResponse.json({message:"User id not found"},{status:404});

        const user=await User.findById(userId);
        if(!user)
            return NextResponse.json({message:"Invalid User"},{status:404});

        return NextResponse.json({message:"User and posts fetched",user},{status:200})


    } catch (error) {
        return NextResponse.json({error:error},{status:500});
    }
}