'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import LeftMenu from '@/src/components/LeftMenu/leftMenu';
import RightMenu from '@/src/components/RightMenu/rightMenu';
import Stories from '@/src/components/home/stories';
import Posts from '@/src/components/home/posts';

interface Story {
  _id: number;
  user: string;
  img: string;
}

interface Post {
  _id: number;
  title: string;
  images: string;
  caption: string;
}

interface SuggestedUser {
  _id: number;
  username: string;
}

export default function Home() {
  const [stories, setStories] = useState<Story[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [suggested, setSuggested] = useState<SuggestedUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [postsRes,storiesRes,suggestedRes] = await Promise.all([
          axios.get('/api/posts/home'),
          axios.get('/api/stories/following'),
          axios.get('/api/suggestions'),
        ]);
        
        // console.log(postsRes.data.posts);
        // console.log(suggestedRes.data.suggested);
        // Ensure data is always an array before setting state
        setPosts(Array.isArray(postsRes.data.posts) ? postsRes.data.posts : []);
        setStories(Array.isArray(storiesRes.data.stories) ? storiesRes.data.stories : []);
        setSuggested(Array.isArray(suggestedRes.data.suggested) ? suggestedRes.data.suggested : []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="flex h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white"
    >
      {/* Left Sidebar */}
      <LeftMenu />

      {/* Main Feed */}
      <div className="w-3/5 mx-auto mt-5 space-y-5">
        {/* Loading Animation */}
        {loading ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
            className="text-center text-gray-300 text-xl"
          >
            Loading...
          </motion.div>
        ) : (
          <>
            {/* Stories Component */}
            <Stories stories={stories} />

            {/* Posts Component */}
            <Posts posts={posts} />
          </>
        )}
      </div>

      {/* Right Sidebar */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <RightMenu suggested={suggested} />
      </motion.div>
    </motion.div>
  );
}
