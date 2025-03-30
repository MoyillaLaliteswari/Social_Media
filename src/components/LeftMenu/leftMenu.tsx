'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaHome, FaSearch, FaBell, FaPlusCircle, FaUser, FaTimes } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface LeftMenuProps {
  showLeftMenu: boolean;
  setShowLeftMenu: (val: boolean) => void;
}

export default function LeftMenu({ showLeftMenu, setShowLeftMenu }: LeftMenuProps) {
  const router = useRouter();

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
    <motion.div
      initial={{ x: -200, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 w-64 h-screen p-6 border-r border-gray-700 bg-gray-900 bg-opacity-40 backdrop-blur-lg z-50 ${
        showLeftMenu ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0`}
    >
      {/* Close Button (Only for Mobile) */}
      <button className="md:hidden absolute top-4 right-4" onClick={() => setShowLeftMenu(false)}>
        <FaTimes size={24} />
      </button>

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

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="mt-auto flex items-center space-x-3 text-gray-400 hover:text-red-500 hover:bg-gray-800 p-3 rounded-lg transition-all duration-300"
      >
        🚪 <span>Logout</span>
      </button>
    </motion.div>
  );
}