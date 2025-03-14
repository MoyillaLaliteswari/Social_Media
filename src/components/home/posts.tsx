import { FaHeart, FaRegHeart, FaComment, FaShare } from "react-icons/fa";

interface PostsProps {
  posts: {
    _id: number;
    title: string;
    images: string;
    caption: string;
  }[];
}

export default function Posts({ posts }: PostsProps) {
  if (!Array.isArray(posts) || posts.length === 0) {
    return <p className="text-center text-gray-400">No posts available</p>;
  }

  return (
    <div className="h-[80vh] overflow-y-auto hide-scrollbar space-y-8">
      {posts.map((post) => (
        <div
          key={post._id}
          className="bg-gray-900 bg-opacity-90 backdrop-blur-lg shadow-xl rounded-lg p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
        >
          {/* Header with Avatar and Username */}
          <div className="flex items-center space-x-4 mb-4">
            <img
              src={`https://i.pravatar.cc/150?img=${post._id}`} // Random avatar
              alt="User Avatar"
              className="w-10 h-10 rounded-full border border-gray-700"
            />
            <h2 className="text-white text-lg font-semibold">{post.title}</h2>
          </div>

          {/* Post Image */}
          <div className="relative">
            <img
              src={post.images}
              alt={post.title}
              className="w-full h-80 object-cover rounded-md transition-transform duration-300 hover:scale-105"
            />
          </div>

          {/* Icons (Like, Comment, Share) */}
          <div className="flex justify-between items-center text-gray-400 mt-4 px-2">
            <div className="flex space-x-4">
              <FaRegHeart className="text-xl cursor-pointer hover:text-red-500 transition-all" />
              <FaComment className="text-xl cursor-pointer hover:text-blue-400 transition-all" />
              <FaShare className="text-xl cursor-pointer hover:text-green-400 transition-all" />
            </div>
          </div>

          {/* Caption */}
          <p className="text-gray-300 text-sm mt-3 px-2">{post.caption}</p>
        </div>
      ))}
    </div>
  );
}
