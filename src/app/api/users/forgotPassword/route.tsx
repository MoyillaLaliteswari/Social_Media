import { NextRequest,NextResponse } from "next/server";
import {connect} from "@/src/dbConfig/dbConfig"
import User from "@/src/models/userModel";
import sendEmail from "@/src/helpers/mailer";
connect();

export async function POST(request: NextRequest) {
    try {
     const reqBody=await request.json();
     const{email}=reqBody;
     console.log(email);
     const user=await User.findOne({email});
     if(!user){
         return NextResponse.json({error:"User not found"},{status:404});
     }
 
     await sendEmail({email,emailType:"RESET",userId:user._id});
     return NextResponse.json({message:"Email sent to reset password"});
 
    } catch (error:any) {
         return NextResponse.json({error:error.message},{status:500});
    }
 }