"use client";

import axios from "axios";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import FollowModal from "@/src/components/followFeature";
import LeftMenu from "@/src/components/LeftMenu/leftMenu";
import { FaBars, FaTimes } from "react-icons/fa";

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
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [newBio, setNewBio] = useState("");
  const [showLeftMenu, setShowLeftMenu] = useState(false);

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
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.data?.message) {
          setError(error.response.data.message);
        } else {
          setError("Error fetching user data.");
        }
        setLoading(false);
        return null;
      }
    };

    const fetchPosts = async (userId: string) => {
      try {
        if (userId) {
          const posts = await axios.get(`/api/userPosts/${userId}`);
          console.log(posts.data);
          setPostCount(posts.data.length);
          setRecentPosts(posts.data);
        }
      } catch (error) {
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
          setProfile((prevUser) => 
            prevUser ? { ...prevUser, profileImageURL: response.data.secure_url } : prevUser
          );
        } catch (error) {
          console.error("Error uploading image:", error);
        } finally {
          setUploading(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBioChange = () => {
    if (isEditingBio) {
      axios
        .post("/api/users/updateBio", { bio: newBio, profile })
        .then(() => {
          setProfile((prevUser) => prevUser ? { ...prevUser, bio: newBio } : prevUser);
        })
        .catch((err) => {
          console.error(err);
        });
    }
    setIsEditingBio(!isEditingBio);
  };

  const isVideo = (url: string) => {
    return url.match(/\.(mp4|mov|avi|wmv|flv|webm)$/i);
  };


  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Left Sidebar - Fixed on Laptop Screens */}
      <div className="hidden md:block fixed top-0 left-0 w-64 h-full bg-gray-900 z-50">
        <LeftMenu showLeftMenu={true} setShowLeftMenu={setShowLeftMenu} />
      </div>

      {/* Mobile Sidebar - Toggle on Button Click */}
      <div
        className={`fixed top-0 left-0 w-64 h-full bg-gray-900 z-50 transform transition-transform ${
          showLeftMenu ? "translate-x-0" : "-translate-x-full"
        } md:hidden`}
      >
        <button className="absolute top-4 right-4" onClick={() => setShowLeftMenu(false)}>
          <FaTimes size={24} />
        </button>
        <LeftMenu showLeftMenu={showLeftMenu} setShowLeftMenu={setShowLeftMenu} />
      </div>

      {/* Overlay for Mobile */}
      {showLeftMenu && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setShowLeftMenu(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center w-full px-6 py-8 md:p-10 md:ml-64">
        {/* Mobile Menu Button */}
        <button
          className="md:hidden fixed top-4 left-4 bg-gray-800 p-2 rounded-full shadow-lg z-50"
          onClick={() => setShowLeftMenu(true)}
        >
          <FaBars size={24} />
        </button>

        {loading ? (
          <p className="text-lg font-semibold animate-pulse">Loading User Profile...</p>
        ) : profile ? (
          <div className="max-w-3xl w-full bg-gray-800 bg-opacity-95 shadow-xl rounded-2xl p-6 sm:p-8 flex flex-col items-center backdrop-blur-md border border-gray-700">
            {/* Profile Image */}
            <div className="relative group w-32 h-32 sm:w-40 sm:h-40">
              <img
                src={profile.profileImageURL}
                alt="Profile"
                className="w-full h-full rounded-full object-cover border-4 border-blue-500 shadow-xl"
              />
            </div>

            {/* Profile Details */}
            <h1 className="text-2xl sm:text-3xl font-bold mt-4">{profile.username}</h1>
            <h2 className="text-gray-400 text-center">{profile.email}</h2>

            {/* Bio Section */}
            <div className="mt-4 w-full flex flex-col items-center text-center">
              <p className="text-base text-gray-300">{profile.bio}</p>
            </div>

            {/* Stats Section */}
            <div className="flex flex-wrap justify-center gap-4 mt-6 w-full">
              <div
                className="text-center cursor-pointer p-4 bg-purple-700 rounded-lg shadow-md hover:bg-purple-600 transition w-24 sm:w-32"
                onClick={() => setFollowersOpen(true)}
              >
                <p className="text-xl sm:text-2xl font-bold">{followersCount}</p>
                <p className="text-gray-300 text-sm">Followers</p>
              </div>
              <div
                className="text-center cursor-pointer p-4 bg-purple-700 rounded-lg shadow-md hover:bg-purple-600 transition w-24 sm:w-32"
                onClick={() => setFollowingOpen(true)}
              >
                <p className="text-xl sm:text-2xl font-bold">{followingCount}</p>
                <p className="text-gray-300 text-sm">Following</p>
              </div>
              <div className="text-center p-4 bg-purple-700 rounded-lg shadow-md w-24 sm:w-32">
                <p className="text-xl sm:text-2xl font-bold">{postCount}</p>
                <p className="text-gray-300 text-sm">Posts</p>
              </div>
            </div>

            {/* Modals */}
            {followersOpen && (
              <FollowModal title="Followers" list={followerList} onClose={() => setFollowersOpen(false)} />
            )}
            {followingOpen && (
              <FollowModal title="Following" list={followingList} onClose={() => setFollowingOpen(false)} />
            )}

            {/* View All Posts Link */}
            <Link href={`/userPosts/${myId?._id}`} className="mt-6 text-purple-400 hover:underline text-lg font-medium">
              View all posts
            </Link>

            {/* Recent Posts Section */}
            <div className="mt-6 w-full">
              <h2 className="text-2xl font-semibold mb-4 text-white">Recent Posts</h2>
              {recentPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {recentPosts.slice(0, 4).map((post) => (
                    <Link key={post._id} href={`/post/${post._id}`}>
                      <div className="bg-gray-700 p-4 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 cursor-pointer">
                        <img
                          src={
                            post.images.length > 0
                              ? isVideo(post.images[0])
                                ? "/addVideo.png"
                                : post.images[0]
                              : "/default.png"
                          }
                          alt="Post"
                          className="w-full h-40 object-cover rounded-md transform hover:scale-105 transition duration-300"
                        />
                        <h1 className="text-lg font-semibold mt-2 text-white">{post.title}</h1>
                        <p className="text-gray-400 text-sm">{post.caption}</p>
                      </div>
                    </Link>
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
    </div>
  );
};

export default UserProfile;
