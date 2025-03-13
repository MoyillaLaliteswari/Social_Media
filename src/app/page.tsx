'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import { motion } from 'framer-motion';

interface Story {
  id: number;
  user: string;
  img: string;
}

interface Post {
  id: number;
  username: string;
  image: string;
  caption: string;
}

interface SuggestedUser {
  id: number;
  user: string;
}

export default function Home() {
  const [stories, setStories] = useState<Story[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [suggested, setSuggested] = useState<SuggestedUser[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [storiesRes, postsRes, suggestedRes] = await Promise.all([
          axios.get<Story[]>('/api/stories'),
          axios.get<Post[]>('/api/posts'),
          axios.get<SuggestedUser[]>('/api/suggestions')
        ]);
        setStories(storiesRes.data);
        setPosts(postsRes.data);
        setSuggested(suggestedRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="flex h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white">
      {/* Sidebar */}
      <motion.div 
        initial={{ x: -200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-1/5 p-5 border-r border-gray-600 bg-gray-900 bg-opacity-40 backdrop-blur-lg hidden md:block rounded-r-3xl shadow-xl"
      >
        <h1 className="text-4xl font-extrabold tracking-wide text-blue-400">Lalli</h1>
        <ul className="mt-8 space-y-6 text-gray-300">
          {[['/', '🏠 Home'], ['/search', '🔍 Search'], ['/reels', '🎥 Reels'], 
            ['/messages', '📨 Messages'], ['/notifications', '🔔 Notifications'], ['/create', '➕ Create'], 
            ['/profile', '👤 Profile']].map(([href, label]) => (
            <li key={href} className="hover:text-blue-400 transition duration-200 text-lg">
              <Link href={href}>{label}</Link>
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Main Feed */}
      <div className="w-3/5 mx-auto mt-5 space-y-5">
        {/* Stories */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="flex space-x-4 overflow-x-scroll scrollbar-hide p-3 border-b border-gray-600"
        >
          {stories.map((story) => (
            <div key={story.id} className="flex flex-col items-center">
              <Image
                src={story.img}
                alt={story.user}
                width={60}
                height={60}
                className="rounded-full border-4 border-purple-500 hover:scale-110 transition-transform"
              />
              <p className="text-xs mt-1 text-gray-300">{story.user}</p>
            </div>
          ))}
        </motion.div>

        {/* Posts */}
        {posts.map((post) => (
          <motion.div 
            key={post.id} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-900 bg-opacity-60 backdrop-blur-lg p-5 rounded-xl shadow-lg hover:scale-[1.02] transition-transform"
          >
            <h2 className="text-lg font-semibold text-blue-300">{post.username}</h2>
            <Image
              src={post.image}
              alt="Post Image"
              width={500}
              height={500}
              className="mt-3 rounded-lg shadow-md"
            />
            <p className="mt-3 text-sm text-gray-300">{post.caption}</p>
          </motion.div>
        ))}
      </div>

      {/* Suggestions */}
      <motion.div 
        initial={{ x: 200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-1/5 p-5 hidden lg:block bg-gray-900 bg-opacity-40 backdrop-blur-lg rounded-l-3xl shadow-xl"
      >
        <h3 className="font-semibold text-gray-300 mb-3">Suggested for you</h3>
        {suggested.map((user) => (
          <div key={user.id} className="flex justify-between items-center mb-3">
            <p className="text-gray-300">{user.user}</p>
            <Link href={`/profile/${user.id}`} className="text-blue-400 hover:text-blue-500 text-sm font-bold">Follow</Link>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
