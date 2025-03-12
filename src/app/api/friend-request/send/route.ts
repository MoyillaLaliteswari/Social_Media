import { connect } from "@/src/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import User from "@/src/models/userModel";
import FriendRequest from "@/src/models/friendRequest";

connect();

export async function POST(request: NextRequest) {
    try {
        const { senderId, receiverId } = await request.json();

        if (!senderId || !receiverId) {
            return NextResponse.json({ message: "User IDs are required." }, { status: 400 });
        }

        if (senderId === receiverId) {
            return NextResponse.json({ message: "You cannot send a request to yourself." }, { status: 400 });
        }

        const existingRequest = await FriendRequest.findOne({ sender: senderId, receiver: receiverId });
        if (existingRequest) {
            return NextResponse.json({ message: "Friend request already sent." }, { status: 400 });
        }

        const newRequest = await FriendRequest.create({ sender: senderId, receiver: receiverId });

        await User.findByIdAndUpdate(receiverId, {
            $push: { pendingRequests: newRequest._id }
        });

        return NextResponse.json({ message: "Friend request sent successfully." }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
