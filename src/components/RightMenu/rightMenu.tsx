'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import ProfileCard from '@/src/components/LeftMenu/profileCard';

interface SuggestedUser {
  _id?: number;
  username: string;
}

export default function RightMenu({ suggested }: { suggested: SuggestedUser[] }) {
  return (
    <motion.div
      initial={{ x: 200, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 right-0 w-72 h-screen p-6 hidden lg:flex flex-col bg-gray-900 bg-opacity-90 backdrop-blur-lg shadow-2xl overflow-y-auto z-50"
    >
      <div className="w-full">
        <ProfileCard />
      </div>

      <div className="mt-auto">
        <h3 className="font-semibold text-gray-300 pb-4 border-b border-gray-700">
          Suggested for you
        </h3>

        {Array.isArray(suggested) && suggested.length > 0 ? (
          <div className="space-y-4 mt-4">
            {suggested.slice(0, 3).map((user, index) => (
              <div 
                key={user._id ?? index} 
                className="flex items-center justify-between bg-gray-800 bg-opacity-40 rounded-xl p-3 transition-all duration-300 hover:bg-gray-700"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white font-medium">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <p className="text-white text-sm font-medium">{user.username}</p>
                </div>

                <Link 
                  href={`/profile/${user._id ?? ''}`} 
                  className="text-sm font-bold text-blue-400 border border-blue-400 px-3 py-1 rounded-lg transition-all duration-300 hover:bg-blue-500 hover:text-white"
                >
                  Follow
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm mt-4">No suggestions available</p>
        )}
      </div>
    </motion.div>
  );
}
