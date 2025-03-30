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
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    if (!Array.isArray(post.likedBy)) {
        post.likedBy = [];
    }

    if (!post.likedBy.includes(userId)) {
      return NextResponse.json(
        { message: "You have not liked this blog" },
        { status: 400 }
      );
    }

    const result = await Post.updateOne(
      { _id: postId },
      {
        $pull: { likedBy: userId }, 
        $inc: { likes: -1 }           
      }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ message: "Failed to unlike the post" }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Post unliked", postLikes: post.likes - 1 },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
