import { useEffect, useState } from "react";
import { FaRegHeart, FaHeart, FaComment } from "react-icons/fa";
import Link from "next/link";
import axios from "axios";

interface PostProps {
  post: {
    _id: string;
    title: string;
    images: string[];
    caption: string;
    createdBy: {
      _id: string;
      username: string;
      profileImageURL: string;
    };
  };
}

export default function Posts({ post }: PostProps) {
  const [likes, setLikes] = useState(0);
  const [commentText, setCommentText] = useState("");
  const [hasLiked, setHasLiked] = useState(false);
  const [postLikes, setPostLikes] = useState(0);
  const [user, setUser] = useState<any>(null);
  const [postComments, setPostComments] = useState<any[]>([]);
  const postId = post._id;

  useEffect(() => {
    if (!postId) return;
    fetchUser();
  }, [postId]);

  useEffect(() => {
    if (user) {
      fetchInitialLikes();
      fetchComments();
    }
  }, [user]);

  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/users/me");
      setUser(data.data._id);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const fetchInitialLikes = async () => {
    try {
      const { data } = await axios.post(`/api/intialLikes/${postId}`, {
        userId: user,
      });
      setPostLikes(data.likes);
      setHasLiked(data.likedByUser);
    } catch (error) {
      console.error("Error fetching likes:", error);
    }
  };

  const fetchComments = async () => {
    try {
      const { data } = await axios.get(`/api/comments/${postId}`);
      setPostComments(data.comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const toggleLike = async () => {
    if (!user) return;
    try {
      if (hasLiked) {
        await axios.post(`/api/unlike/${postId}`, { userId: user });
        setPostLikes((prev) => prev - 1);
      } else {
        await axios.post(`/api/like/${postId}`, { userId: user });
        setPostLikes((prev) => prev + 1);
      }
      setHasLiked(!hasLiked);
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const onComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      await axios.post("/api/comments", { commentText, user, postId });
      setCommentText("");
      fetchComments();
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `${diffInWeeks}w ago`;
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) return `${diffInMonths}mo ago`;
    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears}y ago`;
  };

  return (
    <div className="bg-gray-900/80 border border-gray-700 rounded-3xl p-6 shadow-lg backdrop-blur-md transition-all duration-300 hover:shadow-2xl hover:scale-105">
      <div className="flex items-center space-x-3 mb-4">
        <img
          src={post.createdBy.profileImageURL || "/noAvatar.png"}
          alt={post.createdBy.username}
          className="w-12 h-12 rounded-full border border-gray-600"
        />
        <Link
          href={`/profile/${post.createdBy._id}`}
          className="text-white text-lg font-semibold hover:text-blue-400 transition-all"
        >
          {post.createdBy.username}
        </Link>
      </div>

      <div className="relative">
        {Array.isArray(post.images) && post.images.length > 0 ? (
          post.images.length > 1 ? (
            <div className="grid grid-cols-2 gap-3">
              {post.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${post.title}-${index}`}
                  className="w-full h-64 object-cover rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
                />
              ))}
            </div>
          ) : (
            <img
              src={post.images[0]}
              alt={post.title}
              className="w-full h-96 object-cover rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
            />
          )
        ) : (
          <div className="text-gray-400 text-center py-10">No images available</div>
        )}
      </div>

      <div className="flex justify-between items-center text-gray-400 mt-5">
        <div className="flex space-x-5">
          <button onClick={toggleLike} className="flex items-center space-x-1">
            {hasLiked ? (
              <FaHeart className="text-2xl text-red-500 cursor-pointer transition-all animate-pulse" />
            ) : (
              <FaRegHeart className="text-2xl cursor-pointer hover:text-red-500 transition-all" />
            )}
            <span className="text-white">{postLikes}</span>
          </button>
          <FaComment className="text-2xl cursor-pointer hover:text-blue-400 transition-all" />
        </div>
      </div>

      <p className="text-gray-300 text-md mt-4">{post.caption}</p>

      <div className="mt-4">
        <form onSubmit={onComment} className="flex items-center space-x-3">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment..."
            className="w-full bg-gray-800/70 text-white p-3 rounded-full border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-all"
          >
            Post
          </button>
        </form>

        <div className="mt-4 space-y-4 max-h-48 overflow-y-auto sleek-scrollbar">
          {postComments.length > 0 ? (
            postComments.map((comment, index) => (
              <div key={index} className="flex items-start space-x-3 animate-fade-in">
                <img
                  src={comment.createdBy.profileImageURL || "/noAvatar.png"}
                  alt={comment.createdBy.username}
                  className="w-10 h-10 rounded-full border border-gray-600"
                />
                <div className="bg-gray-800/80 p-3 rounded-xl max-w-[80%]">
                  <p className="text-sm">
                    <Link
                      href={`/profile/${comment.createdBy._id}`}
                      className="font-semibold text-white hover:text-blue-400 transition-all"
                    >
                      {comment.createdBy.username}
                    </Link>
                    <span className="text-gray-400 ml-2">{comment.comment}</span>
                  </p>
                  <span className="text-xs text-gray-500">{formatTimeAgo(comment.createdAt)}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No comments yet. Be the first to comment!</p>
          )}
        </div>
      </div>
    </div>
  );
}
