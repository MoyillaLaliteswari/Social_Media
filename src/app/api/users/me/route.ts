import { getDataFromToken } from "@/src/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import User from "@/src/models/userModel";
import { connect } from "@/src/dbConfig/dbConfig";

connect();

export async function GET(request: NextRequest) {
    try {
        const userId = await getDataFromToken(request);

        const user = await User.findOne({ _id: userId })
            .select("-password")
            .lean(); 
        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }
        
        return NextResponse.json({
            message: "User found",
            data: user,
        });
    } catch (error: any) {
        console.error("Error:", error.message);
        return NextResponse.json(
            { error: error.message },
            { status: 400 }
        );
    }
}
