'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const ProfileCard = () => {
  const [user, setUser] = useState<{ profileImageURL?: string; name?: string; username?: string; followers?: any[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await axios.get('/api/users/me', { withCredentials: true });
        setUser(response.data.data);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchUserData();
  }, []);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="p-5 bg-gray-900 bg-opacity-60 backdrop-blur-lg rounded-lg shadow-lg flex items-center justify-center"
      >
        <Loader2 className="animate-spin text-blue-400" />
      </motion.div>
    );
  }

  if (!user) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-900 bg-opacity-60 backdrop-blur-lg p-5 rounded-xl shadow-xl w-full overflow-hidden"
    >
      {/* Cover Image */}
      <div className="relative w-full h-20 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-t-xl"></div>

      {/* Profile Image */}
      <div className="relative -mt-10 flex justify-center">
        <Image
          src={user.profileImageURL || '/noAvatar.png'}
          alt="Profile"
          width={80}
          height={80}
          className="rounded-full border-4 border-white shadow-md hover:scale-105 transition-transform"
        />
      </div>

      {/* User Info */}
      <div className="text-center mt-3">
        <h2 className="text-lg font-semibold text-white">{user.name || user.username || 'User'}</h2>
        <span className="text-sm text-gray-400">{user.followers?.length || 0} Followers</span>
      </div>

      {/* Profile Button */}
      <div className="mt-3 flex justify-center">
        <Link href={`/profile`}>
          <button className="bg-blue-500 text-white text-sm px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition">
            My Profile
          </button>
        </Link>
      </div>
    </motion.div>
  );
};

export default ProfileCard;
