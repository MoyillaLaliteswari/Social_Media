import { connect } from "@/src/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import FriendRequest from "@/src/models/friendRequest";

connect();

export async function DELETE(request: NextRequest) {
    const { requestId, userId } = await request.json();
  
    if (!requestId || !userId) {
      return NextResponse.json({ message: "Request ID and User ID required." }, { status: 400 });
    }
  
    try {
      const friendRequest = await FriendRequest.findById(requestId);
  
      if (!friendRequest || friendRequest.status !== "pending") {
        return NextResponse.json({ message: "Request not found or already processed." }, { status: 404 });
      }
  
      if (friendRequest.receiver.toString() !== userId) {
        return NextResponse.json({ message: "Unauthorized." }, { status: 403 });
      }
  
      await FriendRequest.findByIdAndDelete(requestId);
  
      return NextResponse.json({ message: "Friend request rejected." }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ message: "An error occurred.", error }, { status: 500 });
    }
  }
  
