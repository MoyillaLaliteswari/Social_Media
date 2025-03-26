'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaHome, FaSearch, FaBell, FaPlusCircle, FaUser } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Stories from '@/src/components/home/stories';
import StoryModal from '@/src/components/home/storyModal';

interface Story {
  _id: number;
  user: string;
  img: string;
  media: string;
  mediaType: 'image' | 'video';
}

export default function LeftMenu() {
  const router = useRouter();
  const [stories, setStories] = useState<Story[]>([]);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);

  useEffect(() => {
    const fetchUserStories = async () => {
      try {
        const res = await axios.get('/api/stories/my');
        if (res.status === 200 && Array.isArray(res.data.stories)) {
          setStories(res.data.stories);
        }
      } catch (error) {
        console.error('Failed to fetch user stories:', error);
      }
    };
    fetchUserStories();
  }, []);

  const menuItems = [
    { href: '/', label: 'Home', icon: <FaHome /> },
    { href: '/search', label: 'Search', icon: <FaSearch /> },
    { href: '/notifications', label: 'Notifications', icon: <FaBell /> },
    { href: '/addPost', label: 'Create', icon: <FaPlusCircle /> },
    { href: '/profile', label: 'Profile', icon: <FaUser /> },
  ];

  const handleLogout = async () => {
    try {
      await axios.get('/api/users/logout');
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <>
      <motion.div
        initial={{ x: -200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 w-64 h-screen p-6 border-r border-gray-700 bg-gray-900 bg-opacity-40 backdrop-blur-lg hidden md:flex flex-col justify-between z-50"
      >
        <h1 className="text-4xl font-extrabold tracking-wide text-blue-400 mb-6">Lalli</h1>

        <ul className="space-y-4">
          {menuItems.map(({ href, label, icon }) => (
            <li key={href}>
              <Link
                href={href}
                className="flex items-center space-x-4 text-gray-300 text-lg font-medium p-3 rounded-lg transition-all duration-300 hover:bg-gray-800 hover:text-blue-400"
              >
                <span className="text-xl">{icon}</span>
                <span>{label}</span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Display User Stories */}
        {stories.length > 0 && <Stories stories={stories} />}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="mt-auto flex items-center space-x-3 text-gray-400 hover:text-red-500 hover:bg-gray-800 p-3 rounded-lg transition-all duration-300"
        >
          🚪 <span>Logout</span>
        </button>
      </motion.div>

      {/* Story Modal */}
      {selectedStory && <StoryModal story={selectedStory} onClose={() => setSelectedStory(null)} />}
    </>
  );
}
