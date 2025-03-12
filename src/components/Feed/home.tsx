"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

interface Post {
    _id: string;
    title: string;
    caption: string;
    images: string;
    createdBy: string;
}

const HomePage = () => {
    const [posts, setPosts] = useState<Post[] | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await axios.get("/api/posts/home");
                setPosts(res.data?.posts ?? []);  // Set empty array if no posts
            } catch (error) {
                console.error("Error fetching posts: ", error);
                setPosts([]);  // Handle error by setting an empty array
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    if (loading) {
        return <p>Loading Posts...</p>;
    }

    if (!posts || posts.length === 0) {
        return <p>No posts available.</p>;
    }

    return (
        <div>
            {posts.map((post) => (
                <div key={post._id} className="p-4 mb-4 bg-white shadow rounded-lg">
                    <h2 className="text-lg font-bold">{post.title}</h2>
                    <p>{post.caption}</p>
                    {post.images && (
                        <img
                            src={post.images}
                            alt="Post Image"
                            className="w-full h-auto mt-2 rounded-lg"
                        />
                    )}
                    <p className="text-sm text-gray-500">By: {post.createdBy}</p>
                </div>
            ))}
        </div>
    );
};

export default HomePage;
