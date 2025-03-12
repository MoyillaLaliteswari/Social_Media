'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface CommentSectionProps {
  postId: string;
  user: {
    _id: string;
    [key: string]: any;
  };
}

export default function CommentSection({ postId, user }: CommentSectionProps) {
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyText, setReplyText] = useState<ReplyTextState>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`/api/posts/${postId}/comments`);
      setComments(response.data.comments);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleCommentSubmit = async (e:any) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    setLoading(true);
    try {
      const response = await axios.post(`/api/posts/comments`, {
        comment: newComment,
        post: { _id: postId },
        user: { _id: user._id },
      });
      setComments([...comments, response.data.newComment]);
      setNewComment('');
    } catch (error) {
      console.error('Error posting comment:', error);
    }
    setLoading(false);
  };

interface ReplyTextState {
    [key: string]: string;
}

interface Comment {
    _id: string;
    comment: string;
    createdBy: {
        _id: string;
        username: string;
        profilePhoto?: string;
    };
    likes: number;
    replies: Comment[];
}

const handleReplySubmit = async (e: React.FormEvent<HTMLFormElement>, parentId: string) => {
    e.preventDefault();
    if (!replyText[parentId]?.trim()) return;
    try {
        const response = await axios.post(`/api/posts/comments/reply`, {
            comment: replyText[parentId],
            post: { _id: postId },
            user: { _id: user._id },
            parentId
        });
        setComments((prevComments) => prevComments.map(comment =>
            comment._id === parentId ? { ...comment, replies: [...comment.replies, response.data.newComment] } : comment
        ));
        setReplyText((prev) => ({ ...prev, [parentId]: '' }));
    } catch (error) {
        console.error('Error posting reply:', error);
    }
};

interface LikeCommentResponse {
    success: boolean;
    message: string;
}

const handleLikeComment = async (commentId: string) => {
    try {
        await axios.post<LikeCommentResponse>(`/api/comments/like`, { commentId, userId: user._id });
        setComments((prevComments) =>
            prevComments.map((comment) =>
                comment._id === commentId ? { ...comment, likes: comment.likes + 1 } : comment
            )
        );
    } catch (error) {
        console.error('Error liking comment:', error);
    }
};

  return (
    <div className="p-4 border-t border-gray-200">
      <h3 className="text-lg font-semibold">Comments</h3>
      <div className="mt-4">
        {comments.map((comment) => (
          <div key={comment._id} className="mb-3">
            <div className="flex items-start gap-3">
              <img
                src={comment.createdBy.profilePhoto || '/default-avatar.png'}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover cursor-pointer"
                onClick={() => router.push(`/profile/${comment.createdBy._id}`)}
              />
              <div>
                <p className="text-sm font-semibold cursor-pointer" onClick={() => router.push(`/profile/${comment.createdBy._id}`)}>
                  {comment.createdBy.username}
                </p>
                <p className="text-sm text-gray-600">{comment.comment}</p>
                <button
                  onClick={() => handleLikeComment(comment._id)}
                  className="text-blue-500 text-sm"
                >
                  ❤️ {comment.likes || 0}
                </button>
                <button
                  onClick={() => setReplyText((prev) => ({ ...prev, [comment._id]: '' }))}
                  className="text-gray-500 text-sm ml-2"
                >
                  Reply
                </button>
                {replyText[comment._id] !== undefined && (
                  <form onSubmit={(e) => handleReplySubmit(e, comment._id)} className="flex items-center gap-3 mt-2">
                    <input
                      type="text"
                      value={replyText[comment._id]}
                      onChange={(e) => setReplyText((prev) => ({ ...prev, [comment._id]: e.target.value }))}
                      placeholder="Write a reply..."
                      className="flex-1 p-2 border rounded-lg"
                    />
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                      Reply
                    </button>
                  </form>
                )}
              </div>
            </div>
            {comment.replies && comment.replies.length > 0 && (
              <div className="ml-12 mt-2">
                {comment.replies.map((reply:any) => (
                  <div key={reply._id} className="flex items-start gap-3 mb-2">
                    <img
                      src={reply.createdBy.profilePhoto || '/default-avatar.png'}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover cursor-pointer"
                      onClick={() => router.push(`/profile/${reply.createdBy._id}`)}
                    />
                    <div>
                      <p className="text-sm font-semibold cursor-pointer" onClick={() => router.push(`/profile/${reply.createdBy._id}`)}>
                        {reply.createdBy.username}
                      </p>
                      <p className="text-sm text-gray-600">{reply.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <form onSubmit={handleCommentSubmit} className="flex items-center gap-3 mt-4">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 p-2 border rounded-lg"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Posting...' : 'Post'}
        </button>
      </form>
    </div>
  );
}