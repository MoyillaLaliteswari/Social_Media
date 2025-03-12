"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

const ProfileCard = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data from API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/users/me", {
          method: "GET",
          credentials: "include", // Send cookies (for token)
        });

        const data = await response.json();

        if (response.ok) {
          setUser(data.data); // Set user data if response is OK
        } else {
          console.error("Failed to fetch user:", data.error);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="p-4 bg-white/30 backdrop-blur-md rounded-lg shadow-md flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-500" />
      </div>
    );
  }

  if (!user) {
    return null; // No user data found
  }

  return (
    <div className="p-4 bg-white/30 backdrop-blur-md rounded-lg shadow-md text-sm flex flex-col items-center gap-4">
      {/* Profile Cover and Avatar */}
      <div className="relative w-full h-24 mb-4">
        <Image
          src={user.cover ? user.cover : "https://images.pexels.com/photos/7885347/pexels-photo-7885347.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"}
          alt="Cover"
          fill
          className="object-cover rounded-md shadow-sm"
        />
        <Image
          src={user.profilePhoto ? user.profilePhoto : "/noAvatar.png"}
          alt="Profile"
          width={64}
          height={64}
          className="rounded-full object-cover w-16 h-16 absolute -bottom-8 left-1/2 transform -translate-x-1/2 ring-2 ring-white"
        />
      </div>

      {/* User Name and Followers */}
      <div className="text-center mt-6">
        <h2 className="text-lg font-semibold text-gray-800">
          {user.name || user.username || "User"}
        </h2>
        <span className="text-xs text-gray-500">{user.followers?.length || 0} Followers</span>
      </div>

      {/* Profile Link Button */}
      <Link href={`/profile/${user._id}`}>
        <button className="bg-blue-500 text-white text-xs p-2 rounded-md shadow-md hover:bg-blue-600 transition">
          My Profile
        </button>
      </Link>
    </div>
  );
};

export default ProfileCard;
