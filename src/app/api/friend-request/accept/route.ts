import { connect } from "@/src/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import User from "@/src/models/userModel";
import FriendRequest from "@/src/models/friendRequest";

connect();

export async function PATCH(request: NextRequest) {
  try {
    const { requestId, userId } = await request.json();

    if (!requestId || !userId) {
      return NextResponse.json({ message: "Request ID and User ID required." }, { status: 400 });
    }

    const friendRequest = await FriendRequest.findById(requestId);

    if (!friendRequest || friendRequest.status !== "pending") {
      return NextResponse.json({ message: "Request not found or already processed." }, { status: 404 });
    }

    if (friendRequest.receiver.toString() !== userId) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 403 });
    }

    // Add users to each other's lists
    const sender = await User.findById(friendRequest.sender);
    const receiver = await User.findById(friendRequest.receiver);

    if (!sender || !receiver) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    sender.following.push(receiver._id);
    receiver.followers.push(sender._id);

    await sender.save();
    await receiver.save();

    // Remove the friend request after accepting
    await FriendRequest.findByIdAndDelete(requestId);

    return NextResponse.json({ message: "Friend request accepted and removed from pending requests." }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "An error occurred.", error }, { status: 500 });
  }
}
