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

interface Assam {
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
        const [postsRes, storiesRes, suggestedRes] = await Promise.all([
          axios.get('/api/posts/home'),
          axios.get('/api/stories/following'),
          axios.get('/api/suggestions'),
        ]);
  
        console.log("Stories API Response:", storiesRes.data.stories); // Debugging
  
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
    <div className="flex bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white h-screen">
      {/* Left Sidebar */}
      <LeftMenu />

      {/* Main Content (Scrollable) */}
      <div className="flex-1 flex justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="w-[45rem] max-w-full h-screen overflow-y-auto pt-5 px-4 flex flex-col gap-6"
        >
          {loading ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
              className="text-center text-gray-300 text-xl"
            >
              Loading...
            </motion.div>
          ) : (
            <>
              <div className="sticky top-0 bg-gray-900 z-10 pb-3">
                <Stories stories={stories} />
              </div>
              <Posts posts={posts} />
            </>
          )}
        </motion.div>
      </div>

      {/* Right Sidebar */}
      <RightMenu suggested={suggested} />
    </div>
  );
}
