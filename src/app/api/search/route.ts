import { NextResponse } from "next/server";
import User from "@/src/models/userModel";
import {connect} from '@/src/dbConfig/dbConfig'
connect();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json({ message: "Query is required" }, { status: 400 });
  }


  try {
    const users = await User.find(
      { username: { $regex: query, $options: "i" } }, 
      "username profileImageURL followers" 
    )
      .limit(5)
      .lean();

    const formattedUsers = users.map(user => ({
      id: user._id,
      username: user.username,
      profileImageURL: user.profileImageURL,
      followersCount: user.followers.length 
    }));

    return NextResponse.json(formattedUsers, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: `Server Error :${error}` }, { status: 500 });
  }
}
