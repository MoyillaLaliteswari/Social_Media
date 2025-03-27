'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaBars, FaTimes } from 'react-icons/fa';
import LeftMenu from '@/src/components/LeftMenu/leftMenu';
import RightMenu from '@/src/components/RightMenu/rightMenu';
import Stories from '@/src/components/home/stories';
import Posts from '@/src/components/home/posts';
import AddStory from '@/src/components/Feed/addStory';

interface Story {
  _id: number;
  user: string;
  img: string;
  media: string;
  mediaType: 'image' | 'video';
}

interface Post {
  _id: string;
  title: string;
  images: string[];
  caption: string;
  createdBy: {
    _id: string;
    username: string;
    email: string;
    profileImageURL: string;
  };
}

interface SuggestedUser {
  _id: string;
  username: string;
  profileImageURL: string;
}

export default function Home() {
  const [stories, setStories] = useState<Story[]>([]);
  const [myStories, setMyStories] = useState<Story[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [suggested, setSuggested] = useState<SuggestedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLeftMenu, setShowLeftMenu] = useState(false);
  const [showRightMenu, setShowRightMenu] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [postsRes, storiesRes, myStoryRes, suggestedRes] = await Promise.all([
          axios.get('/api/posts/home'),
          axios.get('/api/stories/following'),
          axios.get('/api/stories/my'),
          axios.get('/api/suggestions'),
        ]);

        setPosts(postsRes.data.posts || []);
        setStories(storiesRes.data.stories || []);
        setMyStories(myStoryRes.data.stories || []);
        setSuggested(suggestedRes.data.suggested || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="flex flex-col md:flex-row bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white min-h-screen relative">
      {/* Left Menu Toggle Button */}
      <button
        className="md:hidden fixed top-4 left-4 bg-gray-800 p-2 rounded-full shadow-lg z-50"
        onClick={() => setShowLeftMenu(true)}
      >
        <FaBars size={24} />
      </button>

      {/* Right Menu Toggle Button */}
      <button
        className="md:hidden fixed top-4 right-4 bg-gray-800 p-2 rounded-full shadow-lg z-50"
        onClick={() => setShowRightMenu(true)}
      >
        <FaBars size={24} />
      </button>

      {/* Left Sidebar with Backdrop */}
      {showLeftMenu && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setShowLeftMenu(false)}
        />
      )}
      <div
        className={`fixed top-0 left-0 w-64 h-full bg-gray-900 z-50 transform transition-transform ${
          showLeftMenu ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:static md:block`}
      >
        <button className="md:hidden absolute top-4 right-4" onClick={() => setShowLeftMenu(false)}>
          <FaTimes size={24} />
        </button>
        <LeftMenu showLeftMenu={showLeftMenu} setShowLeftMenu={setShowLeftMenu} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex justify-center w-full">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full sm:w-[45rem] max-w-full min-h-screen overflow-y-auto pt-5 px-4 flex flex-col gap-6"
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
              {/* Stories Section */}
              <div className="sticky top-0 bg-gray-900 z-10 pb-3 flex px-4 items-center gap-4 overflow-x-auto hide-scrollbar">
                <AddStory myStories={myStories} updateStories={(newStory) => setMyStories((prev) => [...prev, newStory])} />
                <Stories stories={stories} />
              </div>

              {/* Posts Section */}
              <div className="h-[80vh] overflow-y-auto hide-scrollbar space-y-8">
                {posts.map((post) => (
                  <Posts key={post._id} post={post} />
                ))}
              </div>
            </>
          )}
        </motion.div>
      </div>

      {/* Right Sidebar with Backdrop */}
      {showRightMenu && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setShowRightMenu(false)}
        />
      )}
      <div
        className={`fixed top-0 right-0 w-72 h-full bg-gray-900 z-50 transform transition-transform ${
          showRightMenu ? 'translate-x-0' : 'translate-x-full'
        } md:translate-x-0 md:static md:block`}
      >
        <button className="md:hidden absolute top-4 left-4" onClick={() => setShowRightMenu(false)}>
          <FaTimes size={24} />
        </button>
        <RightMenu suggested={suggested} showRightMenu={showRightMenu} setShowRightMenu={setShowRightMenu} />
      </div>
    </div>
  );
}
