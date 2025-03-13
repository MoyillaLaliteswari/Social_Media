"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AddBlog() {
  const router = useRouter();
  const [blog, setBlog] = useState({
    title: "",
    body: "",
    coverImageURL: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); 

  const handleImageURL = async (): Promise<string | null> => {
    if (!image) {
      console.error("No image selected.");
      toast.error("No image selected.");
      return null;
    }

    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.onload = async () => {
        try {
          const base64Image = reader.result;
          const response = await fetch("/api/image/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image: base64Image }),
          });

          const data = await response.json();
          if (data.success) {
            resolve(data.secure_url);
          } else {
            reject(new Error(data.error));
            toast.error("Failed to upload image.");
          }
        } catch (err: any) {
          console.error("Error uploading image:", err.message);
          reject(err);
          toast.error("Error uploading image.");
        }
      };

      reader.onerror = (error) => {
        console.error("FileReader error:", error);
        reject(error);
        toast.error("FileReader error.");
      };

      reader.readAsDataURL(image);
    });
  };

  const onAddBlog = async () => {
    setLoading(true); 
    try {
      const url = await handleImageURL();
      if (!url) {
        console.error("Failed to upload image");
        toast.error("Failed to upload image.");
        setLoading(false); 
        return;
      }

      const updatedBlog = { ...blog, coverImageURL: url };
      const response = await axios.post("/api/posts/addPost", updatedBlog);
      const id = response.data.blog._id;
      toast.success("Blog created successfully!");
      // router.push(`blog/${id}`);
    } catch (error: any) {
      console.log("Error", error);
      toast.error("Error creating blog.");
    } finally {
      setLoading(false); 
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-white flex justify-center items-center px-4 sm:px-6 py-12 sm:py-16">
        <div className="w-full max-w-lg sm:max-w-2xl p-6 sm:p-10 shadow-2xl rounded-xl space-y-8 border border-gray-300 bg-gray-50">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-800 mb-6">
            Create Your Blog ✍️
          </h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onAddBlog();
            }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <label
                htmlFor="title"
                className="block text-base sm:text-lg font-semibold text-gray-700"
              >
                Blog Title
              </label>
              <input
                onChange={(e) => setBlog({ ...blog, title: e.target.value })}
                type="text"
                id="title"
                name="title"
                className="w-full px-4 py-3 sm:px-5 sm:py-4 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-300 text-gray-800 shadow-md"
                placeholder="Enter your blog title"
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="coverImage"
                className="block text-base sm:text-lg font-semibold text-gray-700"
              >
                Cover Image
              </label>
              <div className="border-2 border-dashed border-gray-400 rounded-lg p-4 sm:p-6 space-y-4 bg-gray-50 hover:bg-gray-100 transition duration-300 shadow-md">
                <input
                  onChange={handleImageChange}
                  type="file"
                  id="coverImage"
                  name="coverImage"
                  className="w-full py-2 sm:py-3 text-sm text-gray-800 file:mr-4 file:px-4 file:py-2 file:border-0 file:bg-indigo-600 file:text-white rounded-lg hover:file:bg-indigo-700 transition duration-200"
                />
                {imagePreview && (
                  <div className="mt-4 flex justify-center">
                    <img
                      src={imagePreview}
                      alt="Image preview"
                      className="max-w-full sm:max-w-xs rounded-lg shadow-lg"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="body"
                className="block text-base sm:text-lg font-semibold text-gray-700"
              >
                Blog Content
              </label>
              <textarea
                onChange={(e) => setBlog({ ...blog, body: e.target.value })}
                id="body"
                name="body"
                rows={6}
                className="w-full px-4 py-3 sm:px-5 sm:py-4 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-300 text-gray-800 shadow-md"
                placeholder="Write your blog content here..."
                required
              ></textarea>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4 text-white font-semibold bg-gradient-to-r from-indigo-600 to-blue-500 rounded-lg shadow-lg hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-600 transition duration-200 transform hover:scale-105"
              >
                {loading ? (
                  <span>Publishing...</span>
                ) : (
                  <span>Publish Blog 🚀</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
