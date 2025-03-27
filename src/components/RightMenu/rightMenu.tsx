'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import ProfileCard from '@/src/components/LeftMenu/profileCard';
import { FaTimes } from 'react-icons/fa';

interface SuggestedUser {
  _id: string;
  username: string;
  profileImageURL: string;
}

interface RightMenuProps {
  suggested: SuggestedUser[];
  showRightMenu: boolean;
  setShowRightMenu: (val: boolean) => void;
}

export default function RightMenu({ suggested, showRightMenu, setShowRightMenu }: RightMenuProps) {
  return (
    <motion.div
      initial={{ x: 200, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 right-0 w-72 h-screen p-6 bg-gray-900 bg-opacity-90 backdrop-blur-lg shadow-2xl overflow-y-auto z-50 transform transition-transform ${
        showRightMenu ? 'translate-x-0' : 'translate-x-full'
      } md:translate-x-0`}
    >
      {/* Close Button (Only for Mobile) */}
      <button className="md:hidden absolute top-4 left-4" onClick={() => setShowRightMenu(false)}>
        <FaTimes size={24} />
      </button>

      <div className="w-full py-4">
        <ProfileCard />
      </div>

      <div className="mt-auto">
        <h3 className="font-semibold text-gray-300 pb-4 border-b border-gray-700">
          Suggested for you
        </h3>

        {suggested.length > 0 ? (
          <div className="space-y-4 mt-4">
            {suggested.slice(0, 3).map((user) => (
              <Link 
                key={user._id} 
                href={`/profile/${user._id}`}
                className="flex items-center bg-gray-800 bg-opacity-40 rounded-xl p-3 transition-all duration-300 hover:bg-gray-700 cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center text-white font-medium">
                  {user.profileImageURL ? (
                    <img src={user.profileImageURL} alt={user.username} className="w-full h-full object-cover" />
                  ) : (
                    <span>{user.username.charAt(0).toUpperCase()}</span>
                  )}
                </div>

                <p className="text-white text-sm font-medium ml-3">{user.username}</p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm mt-4">No suggestions available</p>
        )}
      </div>
    </motion.div>
  );
}
