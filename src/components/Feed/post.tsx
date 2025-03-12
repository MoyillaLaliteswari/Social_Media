import React from "react";
import { useRouter } from "next/router";

interface Post {
  _id: string;
  title: string;
  caption: string;
  images: string;
  createdBy: string;
}

interface PostModalProps {
  posts: Post[];
}

const PostModal = ({ posts }: PostModalProps) => {
  const router = useRouter();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-6 overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">All Posts</h2>

        <ul className="space-y-4">
          {posts.map((post) => (
            <li key={post._id} className="p-4 border rounded-lg shadow-sm bg-gray-50">
              <h3 className="text-xl font-bold">{post.title}</h3>
              <img src={post.images} alt={post.title} className="w-full h-40 object-cover rounded-md my-2" />
              <p className="text-gray-600">{post.caption}</p>
              <button
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                onClick={() => router.push(`/post/${post._id}`)}
              >
                View Post
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PostModal;
