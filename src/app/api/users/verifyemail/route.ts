import { connect } from "@/src/dbConfig/dbConfig";
import { NextRequest,NextResponse } from "next/server";
import User from "@/src/models/userModel";

connect()

export async function POST(request:NextRequest){
    try{
        const reqBody=await request.json()
        const {token}=reqBody

        if (!token) {
            return NextResponse.json({ error: "Token is required" }, { status: 400 });
        }
        console.log(token);

        const user = await User.findOne({ verifyToken: token, verifyTokenExpiry: { $gt: Date.now() } });

if (!user) {
    return NextResponse.json({ error: "Invalid token" }, { status: 400 });
}

console.log("User found:", user);

// First, update verification status
user.isVerified = true;
await user.save();

// Clear token AFTER the response is sent (avoids immediate token loss)
setTimeout(async () => {
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;
    await user.save();
    console.log("Token cleared after delay");
}, 3000); // Delay of 3 seconds

return NextResponse.json({
    message: "Email Verified Successfully",
    success: true
});

       
    }catch(error:any){
        return NextResponse.json({error:error.message},{status:500})
    }
}