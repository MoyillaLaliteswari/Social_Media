"use client";
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

function UserPosts() {
  const params = useParams();
  const userId = params?.id;
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState<string>("User");

  useEffect(() => {
    if (!userId) return;

    const fetchPosts = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`/api/userPosts/${userId}`);

        if (response.data.error) {
          setError(response.data.error);
        } else if (response.data.message) {
          setPosts([]);
        } else {
          setPosts(response.data);
          if (response.data.length > 0) {
            setUsername(response.data[0].createdBy.username);
          }
          console.log("User posts:", response.data);
        }
      } catch (error) {
        console.error("Error fetching user posts:", error);
        setError("Failed to fetch user posts.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [userId]);

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <LeftMenu/>        
        <RightMenu suggested={[]}/>        
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
        {username}'s Posts
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
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post._id}
              className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 transition transform hover:scale-[1.02]"
            >
              <Posts post={post} />
            </div>
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center">
            No posts found.
          </p>
        )}
      </div>
    </div>
  );
}

export default UserPosts;
