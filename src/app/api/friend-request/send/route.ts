import { connect } from "@/src/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import User from "@/src/models/userModel";
import FriendRequest from "@/src/models/friendRequest";

connect();

export async function POST(request: NextRequest) {
  const { senderId, receiverId } = await request.json();

  if (!senderId || !receiverId) {
    return NextResponse.json({ message: "Both IDs are required." }, { status: 400 });
  }

  try {
    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!sender || !receiver) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    // Check if a request already exists
    const existingRequest = await FriendRequest.findOne({
      sender: senderId,
      receiver: receiverId,
      status: "pending",
    });

    if (existingRequest) {
      return NextResponse.json({ message: "Request already sent." }, { status: 400 });
    }

    const newRequest = new FriendRequest({ sender: senderId, receiver: receiverId });
    await newRequest.save();

    sender.sentRequests.push(newRequest._id);
    receiver.receivedRequests.push(newRequest._id);

    await sender.save();
    await receiver.save();

    return NextResponse.json({ message: "Friend request sent." }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: "An error occurred.", error }, { status: 500 });
  }
}
