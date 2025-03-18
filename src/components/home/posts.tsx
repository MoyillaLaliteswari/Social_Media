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
  const [postLikes, setPostLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [user, setUser] = useState<any>(null);
  const [postComments, setPostComments] = useState<any[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
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
      const { data } = await axios.post(`/api/intialLikes/${postId}`, { userId: user });
      setPostLikes(data.likes);
      setHasLiked(data.likedByUser);
    } catch (error) {
      console.error("Error fetching likes:", error);
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

  const toggleVideo = (e: React.MouseEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
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
    <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-gray-700 rounded-2xl p-4 shadow-lg backdrop-blur-md transition-all duration-300 hover:shadow-xl max-w-md mx-auto">
  <div className="flex items-center space-x-2 mb-3">
    <img
      src={post.createdBy.profileImageURL || "/noAvatar.png"}
      alt={post.createdBy.username}
      className="w-8 h-8 rounded-full border border-gray-600 object-cover"
    />
    <Link href={`/profile/${post.createdBy._id}`} className="text-white text-sm font-semibold hover:text-blue-300 transition-colors">
      {post.createdBy.username}
    </Link>
  </div>

  <div className="relative mb-3 rounded-lg overflow-hidden">
    {post.images.map((file, index) => {
      const isVideo = file.endsWith(".mp4") || file.endsWith(".mov") || file.endsWith(".webm");
      return isVideo ? (
        <video
          key={index}
          src={file}
          controls
          muted
          onClick={toggleVideo}
          className="w-full aspect-auto object-contain rounded-lg" // Changed aspect-square to aspect-auto, object-cover to object-contain, and added rounded-lg
        />
      ) : (
        <img
          key={index}
          src={file}
          alt={`${post.title}-${index}`}
          className="w-full aspect-auto object-contain rounded-lg" // Changed aspect-square to aspect-auto, object-cover to object-contain, and added rounded-lg
        />
      );
    })}
  </div>

  <p className="text-gray-300 text-xs mt-1 line-clamp-2 leading-relaxed">
    {post.caption}
  </p>

  <div className="flex justify-between items-center text-gray-400 mt-3">
    <div className="flex space-x-3">
      <button onClick={toggleLike} className="flex items-center space-x-1">
        {hasLiked ? (
          <FaHeart className="text-lg text-red-500 cursor-pointer transition-all animate-pulse" />
        ) : (
          <FaRegHeart className="text-lg cursor-pointer hover:text-red-400 transition-colors" />
        )}
        <span className="text-white text-xs">{postLikes}</span>
      </button>
      <FaComment className="text-lg cursor-pointer hover:text-blue-300 transition-colors" />
    </div>
  </div>

  <div className="mt-3">
    <form onSubmit={onComment} className="flex items-center space-x-2">
      <input
        type="text"
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        placeholder="Add a comment..."
        className="w-full bg-gray-800/70 text-white p-2 rounded-full border border-gray-600 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 transition-shadow"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs hover:bg-blue-400 transition-colors"
      >
        Post
      </button>
    </form>

    <div className="mt-2 space-y-2 max-h-32 overflow-y-auto sleek-scrollbar">
      {postComments.length > 0 ? (
        postComments.map((comment, index) => (
          <div key={index} className="flex items-start space-x-2 animate-fade-in">
            <img
              src={comment.createdBy.profileImageURL || "/noAvatar.png"}
              alt={comment.createdBy.username}
              className="w-6 h-6 rounded-full border border-gray-600 object-cover"
            />
            <div className="bg-gray-800/80 p-2 rounded-lg text-xs max-w-[80%]">
              <p className="text-xs">
                <Link
                  href={`/profile/${comment.createdBy._id}`}
                  className="font-semibold text-white hover:text-blue-300 transition-colors"
                >
                  {comment.createdBy.username}
                </Link>
                <span className="text-gray-400 ml-1">{comment.comment}</span>
              </p>
              <span className="text-[0.6rem] text-gray-500">{formatTimeAgo(comment.createdAt)}</span>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-xs">No comments yet.</p>
      )}
    </div>
  </div>
</div>
  );
}
