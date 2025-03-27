import { connect } from "@/src/dbConfig/dbConfig";
import { NextRequest,NextResponse } from "next/server";
import User from "@/src/models/userModel";

connect()

export async function POST(request: NextRequest) {
    await connect();
    try {
        const reqBody = await request.json();
        const { token } = reqBody;

        const user = await User.findOne({
            verifyToken: token,
            verifyTokenExpiry: { $gt: Date.now() },
        });
        if (!user) {
            return NextResponse.json(
                { error: "Invalid or Expired Token" },
                { status: 400 }
            );
        }

        user.isVerified = true;
        user.verifyToken = undefined;
        user.verifyTokenExpiry = undefined;
        await user.save();

        return NextResponse.json(
            { message: "Email Verified Successfully", success: true },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Server Error" },
            { status: 500 }
        );
    }
}
