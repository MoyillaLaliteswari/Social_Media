import { connect } from "../../../../dbConfig/dbConfig";
import User from "../../../../models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

connect()

export async function POST(request:NextRequest) {
    try {
      const reqBody = await request.json();
      const { email, password } = reqBody;
      console.log("Request received:", reqBody);
  
      const user = await User.findOne({ email });
      if (!user) {
        return NextResponse.json({ error: "User does not exist" }, { status: 400 });
      }
  
      const validPassword = await bcryptjs.compare(password, user.password);
      if (!validPassword) {
        return NextResponse.json({ error: "Invalid Password" }, { status: 400 });
      }
  
      const isVerified=user.isVerified;
      if(!isVerified)
        return NextResponse.json({ error: "Please Verify to Login" }, { status: 400 });
  
      const tokenData = {
        id: user._id,
        username: user.username,
        email: user.email,
      };
  
      const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
        expiresIn: "1d",
      });
  
      const response = NextResponse.json({
        message: "Login successful",
        success: true,
      });
  
      response.cookies.set("token", token, {
        httpOnly: true,
      //   sameSite: "lax",
        maxAge: 24 * 60 * 60, 
      });
  
      return response;
    } catch (error) {
      console.error("Error in Login", error);
      return NextResponse.json({ error: error }, { status: 500 });
    }
  }
  