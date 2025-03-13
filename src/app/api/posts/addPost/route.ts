import { NextResponse, NextRequest } from "next/server";
import Post from "@/src/models/postModel";
import { getDataFromToken } from "@/src/helpers/getDataFromToken";
import { connect } from "@/src/dbConfig/dbConfig";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const userId = await getDataFromToken(request);
    console.log(userId)

    if (!userId) {
      return NextResponse.json({ message: "Please have a valid token" });
    }

    const { title, body, coverImageURL } = reqBody;
    const images= [coverImageURL];
    const caption = body;

    if (!title || !body || !coverImageURL) {
      return NextResponse.json(
        { message: "All fields are required", success: false },
        { status: 400 }
      );
    }

    const blog = await Post.create({
      title,
      caption,
      images,
      createdBy: userId,
    });

    return NextResponse.json(
      { message: "Blog Published Successfully", success: true, blog },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message, success: false }, { status: 500 });
  }
}
