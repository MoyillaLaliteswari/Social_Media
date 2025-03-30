import { connect } from "@/src/dbConfig/dbConfig";
import User from "@/src/models/userModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
    try {
      const reqBody = await request.json();
      const {token}=reqBody;
  
      const user=await User.findOne({
          forgotPasswordToken:token,
          forgotPasswordTokenExpiry:{ $gt: Date.now() }
      });
  
      if(!user){
          return NextResponse.json({error:"Invalid or Expired Token"},{status:400})
      }
  
      user.forgotPasswordToken=undefined;
      user.forgotPasswordTokenExpiry=undefined;
  
      await user.save();
  
      return NextResponse.json({
          message:"Email verifed successfully", success:true},
          {status:200}
      )
  
    } catch (error) {
      return NextResponse.json({error:error},{status:500});
    }
  }