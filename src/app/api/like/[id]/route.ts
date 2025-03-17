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

    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    if (!Array.isArray(post.likedBy)) {
        post.likedBy = [];
    }

    if (post.likedBy.includes(userId)) {
      return NextResponse.json(
        { message: "You have already liked this blog" },
        { status: 400 }
      );
    }
    post.likes += 1;
    post.likedBy.push(userId);

    await post.save();

    return NextResponse.json(
      { message: "post liked", postLikes: post.likes },
      { status: 200 }
    );
  } catch (error:any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
