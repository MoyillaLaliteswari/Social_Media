"use client";

import axios from "axios";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import FollowModal from "@/src/components/followFeature";

interface User {
  _id: string;
  profileImageURL: string;
  username: string;
  email: string;
  count: number;
  followers: [];
  following: [];
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
  const router = useRouter();
  const params = useParams();
  const userId = params?.id;

  const [user, setUser] = useState<User | null>(null);
  const [myId, setMyId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [followersOpen, setFollowersOpen] = useState(false);
  const [followingOpen, setFollowingOpen] = useState(false);
  const [followerList, setFollowerList] = useState<Follower[]>([]);
  const [followingList, setFollowingList] = useState<Follower[]>([]);
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (!userId) {
      setError("Invalid user");
      setLoading(false);
      return;
    }
    const fetchMyId = async () => {
      try {
        const res = await axios.get(`/api/users/me`);
        setMyId(res.data?.user._id);
      } catch (error: any) {
        setError(error.response?.data?.message || "Error fetching user data.");
      }
    };
    fetchUserAndBlogs();
    fetchMyId();
  }, [userId]);

  const fetchUserAndBlogs = async () => {
    try {
      setLoading(true);
      const [userRes, postsRes] = await Promise.all([
        axios.get(`/api/profile/${userId}`),
        axios.get(`/api/userPosts/${userId}`)
      ]);

      const user = userRes.data;
      const posts = postsRes.data;

      if (!user) {
        setError("User not found");
        return;
      }

      const isCurrentlyFollowing = user.followers.includes(myId);
      setUser(user);
      setIsFollowing(isCurrentlyFollowing);
      setFollowersCount(user.followers.length);
      setFollowingCount(user.following.length);
      setRecentPosts(posts.message ? [] : posts);
    } catch (error: any) {
      setError(error.response?.data?.message || "User Fetching Error");
    } finally {
      setLoading(false);
    }
  };

  const toggleFollow = async () => {
    try {
      const button = isFollowing ? "/api/unfollow" : "/api/follow";
      await axios.post(button, { userId, myId });
      setIsFollowing(!isFollowing);
      setFollowersCount((prevCount) => (isFollowing ? prevCount - 1 : prevCount + 1));
      fetchUserAndBlogs();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {loading ? (
        <p>Loading User Profile</p>
      ) : (
        user && (
          <>
            <div>
              <img src={user.profileImageURL} alt="Profile" />
              <h1>{user.username}</h1>
              <h2>{user.email}</h2>
              <p>{user.bio || "No bio Available"}</p>
              <div>
                <div onClick={() => setFollowersOpen(true)}>
                  <p>{followersCount}</p>
                  <p>Followers</p>
                </div>
                <div onClick={() => setFollowingOpen(true)}>
                  <p>{followingCount}</p>
                  <p>Following</p>
                </div>
                {userId !== myId && (
                  <button onClick={toggleFollow}>
                    {isFollowing ? "Unfollow" : "Follow"}
                  </button>
                )}
              </div>
            </div>
            {followersOpen && (
              <FollowModal title="Followers" list={followerList} onClose={() => setFollowersOpen(false)} />
            )}
            {followingOpen && (
              <FollowModal title="Following" list={followingList} onClose={() => setFollowingOpen(false)} />
            )}
            <div>
              <Link href={`/userPosts/${userId}`}>
                <p>View all posts</p>
              </Link>
              <p>{recentPosts.length} Passioning My style</p>
            </div>
            <div>
              {recentPosts.length > 0 ? (
                <div>
                  {recentPosts.map((post) => (
                    <div key={post._id}>
                      <img src={post.images.length > 0 ? post.images[0] : "default.png"} alt="Post" />
                      <h1>{post.title}</h1>
                      <p>{post.caption}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No posts Available</p>
              )}
            </div>
          </>
        )
      )}
    </div>
  );
};

export default UserProfile;
