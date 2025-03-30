"use client";

import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
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
  const params = useParams();
  const userId = params?.id;

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
  const [isFollowing, setIsFollowing] = useState(false);
  const [isRequested, setIsRequested] = useState(false);
  const [isLoadingFollow, setIsLoadingFollow] = useState(false);
  const [showLeftMenu, setShowLeftMenu] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const fetchMyId = async () => {
      try {
        const res = await axios.get(`/api/users/me`);
        setMyId(res.data.data);
      } catch (error) {
        console.error("Error fetching my user data:", error);
      }
    };

    fetchMyId();
  }, []);

  useEffect(() => {
    if (!userId || !myId) return;

    const fetchProfile = async () => {
      try {
        const res = await axios.get(`/api/users/${userId}`);
        const userData = res.data.user;
        setProfile(userData);
        setFollowersCount(userData.followers.length || 0);
        setFollowingCount(userData.following.length || 0);
        setIsFollowing(userData.followers.includes(myId._id));
      } catch (error) {
        setError((error as Error)?.message || "Error fetching user profile.");
      } finally {
        setLoading(false);
      }
    };

    const fetchPosts = async () => {
      try {
        const res = await axios.get(`/api/userPosts/${userId}`);
        setPostCount(res.data.length || 0);
        setRecentPosts(res.data);
      } catch (error) {
        console.error("Error fetching user posts:", error);
      }
    };

    const fetchFriendRequestStatus = async () => {
      try {
        const res = await axios.get(`/api/friend-request/status`, {
          params: { senderId: myId._id, receiverId: userId },
        });
        setIsRequested(res.data.requested);
      } catch (error) {
        console.error("Error checking friend request status:", error);
      }
    };


    const fetchFollowers = async () => {
      try {
        const res = await axios.get(`/api/followers/${userId}`);
        setFollowerList(res.data.followers);
      } catch (error) {
        console.error("Error fetching followers:", error);
      }
    };

    const fetchFollowing = async () => {
      try {
        const res = await axios.get(`/api/following/${userId}`);
        setFollowingList(res.data.following);
      } catch (error) {
        console.error("Error fetching following:", error);
      }
    };


    fetchProfile();
    fetchPosts();
    fetchFriendRequestStatus();
    fetchFollowers();
    fetchFollowing();
  }, [userId, myId]);

  const handleFollowRequest = async () => {
    if (!myId || isLoadingFollow) return;
    setIsLoadingFollow(true);
    try {
      await axios.post(`/api/friend-request/send`, { receiverId: userId, senderId: myId._id });
      setIsRequested(true);
    } catch (error) {
      console.error("Error sending follow request:", error);
    } finally {
      setIsLoadingFollow(false);
    }
  };

  const handleCancelRequest = async () => {
    if (!myId || isLoadingFollow) return;
    setIsLoadingFollow(true);
    try {
      await axios.delete(`/api/friend-request/cancel`,{
        data: { senderId: myId._id, receiverId: userId }},
      );
      setIsRequested(false);
    } catch (error) {
      console.error("Error canceling request:", error);
    } finally {
      setIsLoadingFollow(false);
    }
  };

  const handleUnfollow = async () => {
    if (!myId || isLoadingFollow) return;
    setIsLoadingFollow(true);
    try {
      await axios.post(`/api/unfollow`, { userId, myId: myId._id });
      setFollowersCount((prev) => prev - 1);
      setIsFollowing(false);
    } catch (error) {
      console.error("Error unfollowing user:", error);
    } finally {
      setIsLoadingFollow(false);
    }
  };
  const isVideo = (url: string) => {
    return url.match(/\.(mp4|mov|avi|wmv|flv|webm)$/i);
  };

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Left Sidebar */}
      <div
        className={`fixed top-0 left-0 w-64 h-full bg-gray-900 z-50 transform transition-transform ${
          showLeftMenu ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static md:block`}
      >
        <button className="md:hidden absolute top-4 right-4" onClick={() => setShowLeftMenu(false)}>
          <FaTimes size={24} />
        </button>
        <LeftMenu showLeftMenu={showLeftMenu} setShowLeftMenu={setShowLeftMenu} />
      </div>

      {/* Backdrop for mobile */}
      {showLeftMenu && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setShowLeftMenu(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center p-10 md:pl-64">
        <button
          className="md:hidden fixed top-4 left-4 bg-gray-800 p-2 rounded-full shadow-lg z-50"
          onClick={() => setShowLeftMenu(true)}
        >
          <FaBars size={24} />
        </button>

        {loading ? (
          <p className="text-lg font-semibold animate-pulse">Loading User Profile...</p>
        ) : profile ? (
          <div className="max-w-3xl w-full bg-gray-800 bg-opacity-95 shadow-2xl rounded-3xl p-8 flex flex-col items-center backdrop-blur-md border border-gray-700">
            <img
              src={profile.profileImageURL}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow-xl"
            />
            <h1 className="text-3xl font-bold mt-4 text-white">{profile.username}</h1>
            <h2 className="text-gray-400">{profile.email}</h2>
            <p className="text-center mt-2 text-gray-300">{profile.bio || "No bio available"}</p>

            {myId?._id !== profile._id && (
              <button
                className={`mt-4 px-6 py-2 rounded-lg font-semibold transition duration-300 ${
                  isFollowing
                    ? "bg-red-500 hover:bg-red-600"
                    : isRequested
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                } ${isLoadingFollow ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={isFollowing ? handleUnfollow : isRequested ? handleCancelRequest : handleFollowRequest}
                disabled={isLoadingFollow}
              >
                {isLoadingFollow ? "Processing..." : isFollowing ? "Unfollow" : isRequested ? "Requested" : "Follow"}
              </button>
            )}

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

            <Link href={`/userPosts/${userId}`} className="mt-6 text-purple-400 hover:underline text-lg font-medium">
              View all posts
            </Link>

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
