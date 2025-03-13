"use client";

import axios from "axios";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import FollowModal from "@/src/components/followFeature";

interface User {
  _id: string;
  profileImageURL: string;
  username: string;
  email: string;
  followers: string[];
  following: string[];
  bio: string;
}

interface Post {
  _id: string;
  title: string;
  caption: string;
  images: string[];
}

interface Follower {
  _id: string;
  username: string;
  profileImageURL: string;
}

const UserProfile = () => {
  const [myId, setMyId] = useState<User | null>(null);
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [postCount, setPostCount] = useState(0);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [followersOpen, setFollowersOpen] = useState(false);
  const [followingOpen, setFollowingOpen] = useState(false);
  const [followerList, setFollowerList] = useState<Follower[]>([]);
  const [followingList, setFollowingList] = useState<Follower[]>([]);
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | ArrayBuffer | null>(
    null
  );

  useEffect(() => {
    const fetchMyId = async () => {
      try {
        const res = await axios.get(`/api/users/me`);
        const userData = res?.data?.data;
        setMyId(userData);
        setProfile(userData);
        setFollowersCount(userData.followers.length || 0);
        setFollowingCount(userData.following.length || 0);
        setLoading(false);
        return userData;
      } catch (error: any) {
        setError(error.response?.data?.message || "Error fetching user data.");
        setLoading(false);
        return null;
      }
    };

    const fetchPosts = async (userId: string) => {
      try {
        if (userId) {
          const posts = await axios.get(`/api/userPosts/${userId}`);
          setPostCount(posts.data.length);
          setRecentPosts(posts.data);
        }
      } catch (error: any) {
        console.log("error", error);
      }
    };

    const fetchFollowers = async (userId: string) => {
      try {
        const followers = await axios.get(`/api/followers/${userId}`);
        setFollowerList(followers.data.followers);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchFollowing = async (userId: string) => {
      try {
        const following = await axios.get(`/api/following/${userId}`);
        setFollowingList(following.data.following);
      } catch (error) {
        console.log(error);
      }
    };

    fetchMyId().then((user) => {
      if (user?._id) {
        fetchPosts(user._id);
        fetchFollowers(user._id);
        fetchFollowing(user._id);
      }
    });
  }, []);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        setImagePreview(reader.result);
        try {
          setUploading(true);
          const response = await axios.post("api/image/profile", {
            image: reader.result,
          });
          setProfile((prevUser:any) => ({
            ...prevUser,
            profileImageURL: response.data.secure_url,
          }));
        } catch (error) {
          console.error("Error uploading image:", error);
        } finally {
          setUploading(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center p-10 min-h-screen text-white bg-black">
      {loading ? (
        <p className="text-lg font-semibold animate-pulse">Loading User Profile...</p>
      ) : profile ? (
        <div className="max-w-3xl w-full bg-gray-800 bg-opacity-95 shadow-2xl rounded-3xl p-8 flex flex-col items-center backdrop-blur-md border border-gray-700">
          <div className="relative group">
                {" "}
                <img
                  src={
                    typeof imagePreview === "string"
                      ? imagePreview
                      : profile.profileImageURL
                  }
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow-xl"
                />{" "}
                <label
                  htmlFor="imageUpload"
                  className="absolute bottom-0 right-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-full cursor-pointer shadow-lg"
                >
                  {" "}
                  <input
                    type="file"
                    id="imageUpload"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />{" "}
                  {uploading ? "⏳" : "📸"}{" "}
                </label>{" "}
              </div>{" "}

          <h1 className="text-3xl font-bold mt-4 text-white">{profile.username}</h1>
          <h2 className="text-gray-400">{profile.email}</h2>
          <p className="text-center mt-2 text-gray-300">{profile.bio || "No bio available"}</p>

          <div className="flex justify-around w-full mt-6">
            <div
              className="text-center cursor-pointer p-4 bg-purple-700 rounded-lg shadow-md hover:bg-purple-600 transition duration-300"
              onClick={() => setFollowersOpen(true)}
            >
              <p className="text-2xl font-bold text-white">{followersCount}</p>
              <p className="text-gray-300">Followers</p>
            </div>
            <div
              className="text-center cursor-pointer p-4 bg-purple-700 rounded-lg shadow-md hover:bg-purple-600 transition duration-300"
              onClick={() => setFollowingOpen(true)}
            >
              <p className="text-2xl font-bold text-white">{followingCount}</p>
              <p className="text-gray-300">Following</p>
            </div>

            <div className="text-center p-4 bg-purple-700 rounded-lg shadow-md">
              <p className="text-2xl font-bold text-white">{postCount}</p>
              <p className="text-gray-300">Posts</p>
            </div>
          </div>

          {followersOpen && (
            <FollowModal title="Followers" list={followerList} onClose={() => setFollowersOpen(false)} />
          )}
          {followingOpen && (
            <FollowModal title="Following" list={followingList} onClose={() => setFollowingOpen(false)} />
          )}

        <Link href={`/userPosts/${myId?._id}`} className="mt-6 text-purple-400 hover:underline text-lg font-medium">
            View all posts
          </Link>

          <div className="mt-6 w-full">
            <h2 className="text-2xl font-semibold mb-4 text-white">Recent Posts</h2>
            {recentPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recentPosts.map((post) => (
                  <div key={post._id} className="bg-gray-700 p-4 rounded-xl shadow-lg hover:shadow-2xl transition duration-300">
                    <img
                      src={post.images.length > 0 ? post.images[0] : "/default.png"}
                      alt="Post"
                      className="w-full h-40 object-cover rounded-md transform hover:scale-105 transition duration-300"
                    />
                    <h1 className="text-lg font-semibold mt-2 text-white">{post.title}</h1>
                    <p className="text-gray-400 text-sm">{post.caption}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No posts available</p>
            )}
          </div>
        </div>
      ) : (
        <p className="text-red-500">{error}</p>
      )}
    </div>
  );
};

export default UserProfile;
