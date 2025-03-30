import { connect } from '@/src/dbConfig/dbConfig';
import User from "@/src/models/userModel";  
import { NextRequest, NextResponse } from "next/server";
connect();

export async function POST(request: NextRequest) {
    const reqBody = await request.json();
    const { userId, myId } = reqBody;

    if (!userId || !myId) {
        return NextResponse.json({ message: "User IDs are required." }, { status: 400 });
    }

    try {
        console.log("Request Body:", reqBody); 

        const userToUnfollow = await User.findById(userId);
        const currentUser = await User.findById(myId);

        if (!userToUnfollow || !currentUser) {
            return NextResponse.json({ message: "User not found." }, { status: 404 });
        }

        if (!Array.isArray(userToUnfollow.followers)) {
            userToUnfollow.followers = []; 
        }
        if (!Array.isArray(currentUser.following)) {
            currentUser.following = []; 
        }

        if (!userToUnfollow.followers.includes(myId)) {
            return NextResponse.json({ message: "Not following this user." }, { status: 400 });
        }

        await User.updateOne(
            { _id: userId },
            { $pull: { followers: myId } }
        );

        await User.updateOne(
            { _id: myId },
            { $pull: { following: userId } }
        );

        console.log("Unfollowed successfully:", { userId, myId }); 

        return NextResponse.json({ message: "Unfollowed successfully." }, { status: 200 });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ message: "An error occurred.", error }, { status: 500 });
    }
}
