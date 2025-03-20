"use client"
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Posts from "@/src/components/home/posts";
import axios from "axios";
import LeftMenu from "@/src/components/LeftMenu/leftMenu";
import RightMenu from "@/src/components/RightMenu/rightMenu";

interface Post {
  _id: string;
  title: string;
  images: string[];
  caption: string;
  createdBy: {
    _id: string;
    username: string;
    email: string;
    profileImageURL: string;
  };
  likes: any[];
  comments: any[];
}

function UniquePost() {
  const params = useParams();
  const postId = params?.id;
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState<string>("User");

  useEffect(() => {
    if (!postId) return;

    const fetchPost = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`/api/posts/${postId}`);
        if (response.data.error) {
          setError(response.data.error);
        } else {
          setPost(response.data);
          setUsername(response.data.createdBy.username || "User");
        }
      } catch (error) {
        console.error("Error fetching post:", error);
        setError("Failed to fetch post.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Left Menu */}
      <LeftMenu />

      {/* Main Content */}
      <div className="flex-grow flex flex-col items-center w-full p-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          {username}'s Post
        </h1>
        <div className="w-full max-w-3xl space-y-6">
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-gray-200 dark:bg-gray-700 h-48 rounded-lg"
                />
              ))}
            </div>
          ) : error ? (
            <p className="text-red-500 dark:text-red-400 text-center">{error}</p>
          ) : post ? (
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 transition transform hover:scale-[1.02]">
              <Posts post={post} />
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center">
              No post found.
            </p>
          )}
        </div>
      </div>

      {/* Right Menu */}
      <RightMenu suggested={[]} />
    </div>
  );
}

export default UniquePost;
