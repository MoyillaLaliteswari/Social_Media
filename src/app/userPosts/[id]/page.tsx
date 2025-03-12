
"use client";

import React,{useState,useEffect} from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import axios from "axios";
import {motion} from "framer-motion";
import NavBarPage from "@/src/components/navBar";

interface Post {
  _id: string;
  title: string;
  caption: string;
  images: string[];
  createdAt: string;
  createdBy: {
    username:string;
  };
}

const UserPosts = () => {
    const params = useParams();
    const userId=params?.id;
    const [posts,setPosts]=useState<Post[]>([]);
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState("");

    useEffect(()=>{
        const fetchPosts = async()=>{
            try{
                const res=await axios.get(`/api/userPosts/${userId}`);
                setPosts(res.data.posts);
            }catch(err:any){
                setError(err.response.data.error);
            }finally{
                setLoading(false);
            }
        };
        fetchPosts();
    },[])

    if(loading)
        return(
 
        
        <div className="flex justify-center items-center h-screen">
            <h1 className="text-3xl font-semibold text-gray-800">Loading posts...</h1>
        </div>
        );
        if(error)
        return(
            <div>
                <NavBarPage/>
                <div className="flex justify-center items-center h-screen">
                    <h1 className="text-3xl font-semibold text-gray-800">{error}</h1>
                </div>
            </div>
        );
        return(
            <><NavBarPage/>
            {posts.length>0 && posts[0].createdBy.username}Blogs
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {posts.map((post)=>(
                    <motion.div key={post._id} layoutId={post._id} className="p-4 border rounded-lg shadow-sm bg-gray-50">
                        <h3 className="text-xl font-bold">{post.title}</h3>
                        <img src={post.images[0]} alt={post.title} className="w-full h-40 object-cover rounded-md my-2" />
                        <p className="text-gray-600">{post.caption}</p>
                        <p className="text-gray-600">{post.createdAt}</p>
                        <motion.a
                            href={`/post/${post._id}`}
                            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                            View Post
                        </motion.a>

                    </motion.div>
                ))}
                
            </div>
            </>
            
            
        )
        

}