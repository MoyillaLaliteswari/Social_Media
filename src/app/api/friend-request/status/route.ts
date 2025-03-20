import { connect } from "@/src/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import FriendRequest from "@/src/models/friendRequest";

connect();

export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const senderId = url.searchParams.get("senderId");
        const receiverId = url.searchParams.get("receiverId");

        if (!senderId || !receiverId) {
            return NextResponse.json({ message: "Both senderId and receiverId are required." }, { status: 400 });
        }

        const status = await FriendRequest.findOne({
            sender: senderId,
            receiver: receiverId,
        });

        return NextResponse.json({ requested: !!status }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "An error occurred.", error: error }, { status: 500 });
    }
}