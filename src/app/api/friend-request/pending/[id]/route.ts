import { connect } from "@/src/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import FriendRequest from "@/src/models/friendRequest";

connect();

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const userId = url.pathname.split("/").pop();

    if (!userId) {
      return NextResponse.json({ message: "User ID required." }, { status: 400 });
    }

    // Fetch friend requests where the user is the receiver and populate sender details
    const receivedRequests = await FriendRequest.find({ receiver: userId, status: "pending" })
      .populate("sender", "username profileImageURL") // Populating sender details
      .exec();

    return NextResponse.json({ receivedRequests }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "An error occurred.", error }, { status: 500 });
  }
}
