import { NextResponse,NextRequest } from "next/server";
import User from "@/src/models/userModel";
import {connect} from "@/src/dbConfig/dbConfig";
connect();

export async function GET(request:NextRequest){
    try {
        const users=await User.find();
        const suggested: { id: string; username: string }[] = [];
        users.map((user)=>{
            suggested.push({id:user._id,username:user.username})
        })
        return NextResponse.json({suggested},{status:200});
    } catch (error:any) {
        return NextResponse.json({error:error.message},{status:500});
    }
}