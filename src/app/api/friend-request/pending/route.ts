import { connect } from "@/src/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import User from "@/src/models/userModel";
import FriendRequest from "@/src/models/friendRequest";

connect();

export async function GET(request: NextRequest) {
    try {
        const userId = request.headers.get("user-id");
        if (!userId) {
            return NextResponse.json({ message: "User ID required." }, { status: 400 });
        }

        const user = await User.findById(userId).populate({
            path: "pendingRequests",
            populate: { path: "sender", select: "username profileImageURL" }
        });

        if (!user) {
            return NextResponse.json({ message: "User not found." }, { status: 404 });
        }

        return NextResponse.json({ pendingRequests: user.pendingRequests }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
