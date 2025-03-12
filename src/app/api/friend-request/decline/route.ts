import { connect } from "@/src/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import User from "@/src/models/userModel";
import FriendRequest from "@/src/models/friendRequest";

connect();

export async function POST(request: NextRequest) {
    try {
        const { requestId } = await request.json();

        const friendRequest = await FriendRequest.findById(requestId);
        if (!friendRequest) {
            return NextResponse.json({ message: "Request not found." }, { status: 404 });
        }

        const { receiver } = friendRequest;

        await User.findByIdAndUpdate(receiver, {
            $pull: { pendingRequests: requestId }
        });

        await FriendRequest.findByIdAndDelete(requestId);

        return NextResponse.json({ message: "Friend request declined." }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
