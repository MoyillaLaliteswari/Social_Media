import axios from "axios";
import React, { useEffect, useState } from "react";

interface Comment {
    _id: string;
    content: string;
    createdBy: {
        username: string;
        profileImage?: string;
    };
}

interface CommentProps{
    postId:string;
}

const Comments = ({postId}:CommentProps) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await axios.get(`/api/posts/comments/${postId}`);
                setComments(res.data?.comments || []);
            } catch (error) {
                console.error("Error fetching comments:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchComments();
    }, []);

    if (loading) {
        return <p className="text-center">Loading comments...</p>;
    }

    if (comments.length === 0) {
        return <p className="text-center">No comments yet.</p>;
    }

    return (
        <div className="space-y-4">
            {comments.map((comment) => (
                <div key={comment._id} className="bg-white shadow-md rounded-lg p-4">
                    <div className="flex items-center mb-2">
                        <img
                            src={comment.createdBy.profileImage || "/noAvatar.png"}
                            alt="User Avatar"
                            className="w-8 h-8 rounded-full mr-2"
                        />
                        <span className="font-semibold">{comment.createdBy.username}</span>
                    </div>
                    <p className="text-gray-700">{comment.content}</p>
                </div>
            ))}
        </div>
    );
};

export default Comments;
