import { NextResponse, NextRequest } from "next/server";
import User from "@/src/models/userModel";
import { connect } from "@/src/dbConfig/dbConfig";

connect();

export async function GET(request: NextRequest) {
  try {
    const users = await User.aggregate([
      { $sample: { size: 3 } }, // Select 3 random users
      { $project: { _id: 1, username: 1, profileImageURL: 1 } } // Include profile image
    ]);

    return NextResponse.json({ suggested: users }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
