import { useEffect, useState } from "react";
import { FaRegHeart, FaHeart, FaComment, FaReply,FaTrash  } from "react-icons/fa";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";

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
  const router=useRouter()
  const [postLikes, setPostLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [user, setUser] = useState<string | null>(null);
  const [postComments, setPostComments] = useState<any[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiking] = useState(false);
  const [isCommenting] = useState(false);
  const [replyTexts, setReplyTexts] = useState<{ [key: string]: string }>({});
  const [showReplies, setShowReplies] = useState<{ [key: string]: boolean }>(
    {}
  );

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

  const deletePost = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await axios.delete(`/api/postDelete/${postId}`);
      alert("Post deleted successfully.");
      router.refresh();
      router.push('/');
      // Optionally, refresh or update UI
    } catch (error) {
      console.error("Error deleting post:", error);
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

  const fetchReplies = async (commentId: string) => {
    try {
      const { data } = await axios.get(`/api/replies/${commentId}`);
      setPostComments((prev) =>
        prev.map((c) =>
          c._id === commentId ? { ...c, replies: data.replies } : c
        )
      );
    } catch (error) {
      console.error("Error fetching replies:", error);
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

  const toggleCommentLike = async (commentId: string) => {
    try {
      await axios.post(`/api/commentLike/${commentId}`, { userId: user });
      fetchComments();
    } catch (error) {
      console.error("Error liking comment:", error);
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

  const handleReplyChange = (commentId: string, text: string) => {
    setReplyTexts((prev) => ({ ...prev, [commentId]: text }));
  };

  const submitReply = async (commentId: string) => {
    if (!replyTexts[commentId]?.trim()) return;
    try {
      await axios.post("/api/replies", {
        commentId,
        replyText: replyTexts[commentId],
        user,
      });
      setReplyTexts((prev) => ({ ...prev, [commentId]: "" }));
      fetchReplies(commentId);
    } catch (error) {
      console.error("Error submitting reply:", error);
    }
  };

  const toggleReplies = (commentId: string) => {
    setShowReplies((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
    if (!showReplies[commentId]) {
      fetchReplies(commentId);
    }
  };

  const deleteComment=async(commentId: string)=>{
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    try {
      const del=await axios.delete(`api/commentDelete/${commentId}`)
      alert("Comment deleted successfully.");
      console.log(del);
      fetchComments();
    } catch (error) {
      console.log("error",error);
    }
  }

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
    <div className="bg-black border border-gray-700 rounded-lg p-4 shadow-md w-full max-w-md sm:max-w-sm mx-auto transition-all">
      {/* Post Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <img
            src={post.createdBy.profileImageURL || "/noAvatar.png"}
            alt={post.createdBy.username}
            className="w-9 h-9 rounded-full border border-gray-600 object-cover"
          />
          <Link
            href={`/profile/${post.createdBy._id}`}
            className="text-white text-sm font-semibold hover:text-gray-300"
          >
            {post.createdBy.username}
          </Link>
        </div>
        {user === post.createdBy._id && (
          <button onClick={deletePost} className="text-gray-400 hover:text-red-500">
            <FaTrash className="text-lg" />
          </button>
        )}
      </div>
  
      {/* Post Media */}
      <div className="relative mb-2 overflow-hidden rounded-md">
        {post.images.map((file, index) => {
          const isVideo = file.endsWith(".mp4") || file.endsWith(".mov") || file.endsWith(".webm");
          return isVideo ? (
            <video
              key={index}
              src={file}
              controls
              muted
              onClick={toggleVideo}
              className="w-full h-auto object-cover rounded-md"
            />
          ) : (
            <img
              key={index}
              src={file}
              alt={post.title}
              className="w-full h-auto object-cover rounded-md"
            />
          );
        })}
      </div>
  
      {/* Post Actions */}
      <div className="flex justify-between items-center text-gray-400 px-2">
        <div className="flex space-x-4">
          <button onClick={toggleLike} className="flex items-center space-x-1" disabled={isLiking}>
            {hasLiked ? (
              <FaHeart className="text-lg text-red-500 transition-transform scale-110" />
            ) : (
              <FaRegHeart className="text-lg hover:text-red-400 transition-colors" />
            )}
            <span className="text-white text-xs">{postLikes}</span>
          </button>
          <FaComment className="text-lg hover:text-gray-300 cursor-pointer" />
        </div>
      </div>
  
      {/* Caption */}
      <p className="text-gray-300 text-sm px-2 mt-1">{post.caption}</p>
  
      {/* Comments Section */}
      <div className="mt-2 max-h-32 overflow-y-auto text-gray-400 text-sm px-2 sleek-scrollbar">
        {postComments.length > 0 ? (
          postComments.map((comment, index) => (
            <div key={comment._id || `comment-${index}`} className="flex flex-col space-y-2">
              <div className="flex items-start space-x-2">
                <img
                  src={comment.createdBy.profileImageURL || "/noAvatar.png"}
                  alt={comment.createdBy.username}
                  className="w-6 h-6 rounded-full border border-gray-600 object-cover"
                />
                <div className="bg-gray-800/80 p-2 rounded-lg text-xs w-full max-w-[80%]">
                  <p className="text-xs">
                    <Link
                      href={`/profile/${comment.createdBy._id}`}
                      className="font-semibold text-white hover:text-blue-300 transition-colors"
                    >
                      {comment.createdBy.username}
                    </Link>
                    <span className="text-gray-400 ml-1">{comment.comment}</span>
                  </p>
                  <span className="text-[0.6rem] text-gray-500">
                    {formatTimeAgo(comment.createdAt)}
                  </span>
                  <div className="flex space-x-3 mt-1">
                    <button
                      onClick={() => toggleCommentLike(comment._id)}
                      className="text-xs text-gray-400 flex items-center space-x-1"
                    >
                      <FaRegHeart />
                      <span>{comment.likes}</span>
                    </button>
                    <button
                      onClick={() => toggleReplies(comment._id)}
                      className="text-xs text-blue-400 flex items-center space-x-1"
                    >
                      <FaReply />
                      <span>Replies</span>
                    </button>
  
                    {user === comment.createdBy._id && (
                      <button
                        onClick={() => deleteComment(comment._id)}
                        className="text-red-500 hover:text-red-400 transition-all"
                      >
                        <FaTrash className="text-xs" />
                      </button>
                    )}
                  </div>
  
                  {/* Replies Section */}
                  {showReplies[comment._id] &&
                    comment.replies?.map((reply: any, index: number) => (
                      <div key={reply._id || `reply-${index}`} className="ml-4 mt-2 flex items-start space-x-2">
                        {reply.createdBy ? (
                          <>
                            <img
                              src={reply.createdBy.profileImageURL || "/noAvatar.png"}
                              alt={reply.createdBy.username || "Anonymous"}
                              className="w-5 h-5 rounded-full border border-gray-600 object-cover"
                            />
                            <div className="bg-gray-700/80 p-2 rounded-lg text-xs w-full max-w-[75%]">
                              <p className="text-xs">
                                <Link
                                  href={`/profile/${reply.createdBy._id}`}
                                  className="font-semibold text-white hover:text-blue-300 transition-colors"
                                >
                                  {reply.createdBy.username}
                                </Link>
                                <span className="text-gray-400 ml-1">
                                  {reply.comment}
                                </span>
                              </p>
                              <span className="text-[0.6rem] text-gray-500">
                                {formatTimeAgo(reply.createdAt)}
                              </span>
                            </div>
                          </>
                        ) : (
                          <div className="bg-gray-700/80 p-2 rounded-lg text-xs w-full max-w-[75%]">
                            <p className="text-gray-400">[Deleted User]</p>
                            <span className="text-gray-500">{reply.comment}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  <input
                    type="text"
                    value={replyTexts[comment._id] || ""}
                    onChange={(e) => handleReplyChange(comment._id, e.target.value)}
                    placeholder="Reply..."
                    className="bg-gray-700 text-white p-1 rounded-md text-xs w-full mt-1"
                  />
                  <button onClick={() => submitReply(comment._id)} className="text-xs text-blue-400">
                    Reply
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-xs">No comments yet.</p>
        )}
      </div>
  
      {/* Add Comment */}
      <form onSubmit={onComment} className="flex items-center mt-2 px-2">
        <input
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Add a comment..."
          className="w-full bg-gray-800 text-white p-2 rounded-full text-xs"
        />
        <button type="submit" className="text-blue-400 text-xs ml-2" disabled={isCommenting}>
          Post
        </button>
      </form>
    </div>
  );
   
}
