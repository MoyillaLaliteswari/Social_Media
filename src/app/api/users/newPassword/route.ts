import { NextRequest,NextResponse } from "next/server";
import User from "@/src/models/userModel";
import {connect} from "@/src/dbConfig/dbConfig";
import bcryptjs from "bcryptjs";

connect();

export async function POST(request: NextRequest) {
    try {
      const reqBody = await request.json();
      const { email, newPassword } = reqBody;
      console.log(email)
      const hashedEmail=email;
  
      if (!email || !newPassword) {
        return NextResponse.json({ error: "Email or password is missing" }, { status: 400 });
      }
  
      console.log("Request Body:", reqBody);
  
      const user = await User.findOne({ hashedEmail });
      console.log(user);
      if (!user) {
        return NextResponse.json({ error: "Invalid email" }, { status: 400 });
      }
  
      console.log("User found:", user);
  
      const salt = await bcryptjs.genSalt(10);
      const hashedNewPassword = await bcryptjs.hash(newPassword, salt);
  
      user.password = hashedNewPassword;
      user.hashedEmail=undefined;
      await user.save();
  
      return NextResponse.json({ message: "Password reset successful", success: true }, { status: 200 });
    } catch (error: any) {
      console.error("Error resetting password:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
  