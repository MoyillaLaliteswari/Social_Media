'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
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
  // const [myStories, setMyStories] = useState<Story[]>([]);
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
          // axios.get('/api/stories/my'),
        ]);

        console.log('Posts API Response:', postsRes.data.posts);

        setPosts(
          Array.isArray(postsRes.data.posts)
            ? postsRes.data.posts.map((post: any) => ({
                ...post,
                likes: Array.isArray(post.likes) ? post.likes : [],
                comments: Array.isArray(post.comments) ? post.comments : [],
              }))
            : []
        );

        setStories(Array.isArray(storiesRes.data.stories) ? storiesRes.data.stories : []);
        setSuggested(Array.isArray(suggestedRes.data.suggested) ? suggestedRes.data.suggested : []);
        // setMyStories(Array.isArray(storiesRes.data.stories) ? myStories.data.stories : []);
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
      <LeftMenu />
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
              <div className="sticky top-0 bg-gray-900 z-10 pb-3 flex px-4 items-center gap-4">
                <AddStory />
                {/* <Stories stories={myStories} /> */}
                <Stories stories={stories} />
              </div>
              <div className="h-[80vh] overflow-y-auto hide-scrollbar space-y-8">
                {posts.map((post) => (
                  <Posts key={post._id} post={post} />
                ))}
              </div>
            </>
          )}
        </motion.div>
      </div>
      <RightMenu suggested={suggested} />
    </div>
  );
}
