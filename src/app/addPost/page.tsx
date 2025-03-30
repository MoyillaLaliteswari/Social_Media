"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { FaBars, FaCloudUploadAlt } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import LeftMenu from "@/src/components/LeftMenu/leftMenu";

export default function AddPost() {
  const router = useRouter();
  const [post, setPost] = useState({ title: "", body: "", coverImageURL: "" });
  const [media, setMedia] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video" | null>(null);
  const [loading, setLoading] = useState(false);
  const [showLeftMenu, setShowLeftMenu] = useState(false);

  const handleMediaUpload = async (): Promise<string | null> => {
    if (!media) {
      toast.error("No media selected.");
      return null;
    }

    const formData = new FormData();
    formData.append("file", media);
    formData.append("mediaType", mediaType || "image");

    try {
      const response = await axios.post("/api/image/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return response.data.coverImageURL || null;
    } catch (error) {
      console.log(error)
      toast.error("Error uploading media.");
      return null;
    }
  };

  const onAddPost = async () => {
    setLoading(true);
    try {
      const url = await handleMediaUpload();
      if (!url) {
        setLoading(false);
        return;
      }

      const updatedPost = { ...post, coverImageURL: url };
      const response = await axios.post("/api/posts/addPost", updatedPost);
      toast.success("Post created successfully!");
      router.push(`/post/${response.data.post._id}`);
    } catch (error) {
      toast.error("Error creating post.");
      console.log(error)
    } finally {
      setLoading(false);
    }
  };

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      const fileType = file.type.startsWith("video") ? "video" : "image";
      setMedia(file);
      setMediaType(fileType);

      const reader = new FileReader();
      reader.onloadend = () => setMediaPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Left Sidebar */}
      <div
        className={`fixed top-0 left-0 w-64 h-screen bg-gray-900 z-50 transition-transform transform ${
          showLeftMenu ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <LeftMenu showLeftMenu={showLeftMenu} setShowLeftMenu={setShowLeftMenu} />
      </div>

      {/* Backdrop for mobile */}
      {showLeftMenu && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setShowLeftMenu(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex justify-center items-center bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 px-4 md:pl-64">
        <button
          className="md:hidden fixed top-4 left-4 bg-gray-800 p-2 rounded-full shadow-lg z-50"
          onClick={() => setShowLeftMenu((prev) => !prev)}
        >
          <FaBars size={24} />
        </button>
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-6 space-y-6 text-black">
          <h2 className="text-2xl font-bold text-center text-gray-900">Create a New Post ✨</h2>
          <form onSubmit={(e) => { e.preventDefault(); onAddPost(); }} className="space-y-6">
            <input
              type="text"
              placeholder="Enter title..."
              value={post.title}
              onChange={(e) => setPost({ ...post, title: e.target.value })}
              className="w-full p-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 transition text-gray-800"
              required
            />

            <div className="relative border-2 border-dashed border-gray-400 rounded-lg p-6 text-center cursor-pointer bg-gray-100">
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleMediaChange}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
              />
              <FaCloudUploadAlt className="text-gray-500 text-4xl mx-auto mb-2" />
              <p className="text-gray-700">Click or Drag & Drop to Upload</p>
            </div>

            {mediaPreview && (
              <div className="relative">
                <button
                  className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded-full"
                  onClick={() => {
                    setMediaPreview(null);
                    setMedia(null);
                    setMediaType(null);
                  }}
                >
                  <IoClose />
                </button>
                {mediaType === 'image' ? (
                  <img src={mediaPreview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                ) : (
                  <video src={mediaPreview} controls className="w-full h-48 rounded-lg" />
                )}
              </div>
            )}

            <textarea
              onChange={(e) => setPost({ ...post, body: e.target.value })}
              rows={3}
              className="w-full p-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 transition text-gray-800"
              placeholder="Write a caption..."
              required
            ></textarea>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200"
            >
              {loading ? 'Uploading...' : 'Post 🚀'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
