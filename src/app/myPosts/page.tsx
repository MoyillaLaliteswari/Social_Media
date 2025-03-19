import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Posts from '@/src/components/home/posts';

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

function MyPosts() {

    const [userId, setUserId] = useState<any>(null);
    const [posts,setPosts] = useState<Post[]>([]);

    const fetchUser = async () => {
        try {
          const { data } = await axios.get("/api/users/me");
          setUserId(data.data._id);
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      };

      const fetchPosts = async () => {
        try {
          const { data } = await axios.post(`/api/posts/myPosts`, { userId });
          setPosts(data.data.posts);
        } catch (error) {
          console.error("Error fetching posts:", error);
        }
      }

      useEffect(()=>{
            fetchUser();
            fetchPosts();
      },[])


  return (
    <div>
        
        <div className="h-[80vh] overflow-y-auto hide-scrollbar space-y-8">
                        {posts.map((post) => (
                          <Posts key={post._id} post={post} />
                        ))}
                      </div>
    </div>
  )
}

export default MyPosts