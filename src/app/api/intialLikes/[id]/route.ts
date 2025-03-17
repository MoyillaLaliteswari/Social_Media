import { connect } from '@/src/dbConfig/dbConfig';
import { NextResponse, NextRequest } from 'next/server';
import Post from '@/src/models/postModel';

connect();

export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const postId = url.pathname.split('/').pop();
    const reqBody = await request.json();
    const { userId } = reqBody;
    console.log("userId",userId);

    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }


    const likedByUser=(post.likedBy.includes(userId))
    const likes=post.likes;

    return NextResponse.json(
      { message: "Post likes fetched",likedByUser:likedByUser,likes:likes},
      { status: 200 }
    );
  } catch (error:any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
