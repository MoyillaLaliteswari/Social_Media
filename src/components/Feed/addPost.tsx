"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { FaCloudUploadAlt } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

export default function AddPost() {
  const router = useRouter();
  const [post, setPost] = useState({ title: "", caption: "", mediaURL: "" });
  const [media, setMedia] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleMediaUpload = async (): Promise<string | null> => {
    if (!media) {
      toast.error("No media selected.");
      return null;
    }

    const formData = new FormData();
    formData.append("media", media);

    try {
      const response = await axios.post("/api/media/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        return response.data.secure_url;
      } else {
        toast.error("Failed to upload media.");
        return null;
      }
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

      const updatedPost = { ...post, mediaURL: url };
      const response = await axios.post("/api/posts/addPost", updatedPost);
      console.log(response)
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
      setMedia(file);

      const reader = new FileReader();
      reader.onloadend = () => setMediaPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-6 space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-900">
          Create a New Post ✨
        </h2>
        <form onSubmit={(e) => { e.preventDefault(); onAddPost(); }} className="space-y-6">
          {/* Media Upload Section */}
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

          {/* Preview Media */}
          {mediaPreview && (
            <div className="relative">
              <button
                className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded-full"
                onClick={() => setMediaPreview(null)}
              >
                <IoClose />
              </button>
              {media?.type.startsWith("video") ? (
                <video
                  src={mediaPreview}
                  controls
                  className="w-full h-48 object-cover rounded-lg"
                />
              ) : (
                <img
                  src={mediaPreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
              )}
            </div>
          )}

          {/* Title Input */}
          <input
            type="text"
            onChange={(e) => setPost({ ...post, title: e.target.value })}
            className="w-full p-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 transition text-gray-800"
            placeholder="Enter post title..."
            required
          />

          {/* Caption Input */}
          <textarea
            onChange={(e) => setPost({ ...post, caption: e.target.value })}
            rows={3}
            className="w-full p-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 transition text-gray-800"
            placeholder="Write a caption..."
            required
          ></textarea>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200"
          >
            {loading ? "Uploading..." : "Post 🚀"}
          </button>
        </form>
      </div>
    </div>
  );
}
