import { connect } from "@/src/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import FriendRequest from "@/src/models/friendRequest";

connect();

export async function DELETE(request: NextRequest) {
    try {
        const { senderId, receiverId } = await request.json();

        if (!senderId || !receiverId) {
            return NextResponse.json({ message: "Both senderId and receiverId are required." }, { status: 400 });
        }

        const requestExists = await FriendRequest.findOneAndDelete({
            sender: senderId,
            receiver: receiverId,
        });

        if (!requestExists) {
            return NextResponse.json({ message: "No friend request found to cancel." }, { status: 404 });
        }

        return NextResponse.json({ message: "Friend request canceled successfully." }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: "An error occurred.", error: error }, { status: 500 });
    }
}
