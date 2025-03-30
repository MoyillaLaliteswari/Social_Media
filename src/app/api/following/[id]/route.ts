import { NextRequest,NextResponse } from "next/server";
import User from "@/src/models/userModel";
import { connect } from "@/src/dbConfig/dbConfig";
connect();

export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const userId = url.pathname.split('/').pop();

        if (!userId || userId.length !== 24) {
            return NextResponse.json({ message: "Invalid userId" }, { status: 400 });
        }

        const user = await User.findById(userId).populate('following', 'username profileImageURL bio');

        if (!user) {
            return NextResponse.json({ message: "User does not exist" }, { status: 404 });
        }

        const following = user.following;
        return NextResponse.json({ message: "following fetched successfully", following }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error || "Internal Server Error" }, { status: 500 });
    }
}
