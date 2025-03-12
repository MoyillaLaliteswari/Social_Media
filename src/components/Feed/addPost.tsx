"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AddPost() {
  const router = useRouter();
  const [post, setPost] = useState({
    title: "",
    caption: "",
    images: [],
  });

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setImages((prev) => [...prev, ...selectedFiles]);

      const newPreviews = selectedFiles.map((file) =>
        URL.createObjectURL(file)
      );
      setImagePreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

 
  const uploadImages = async (): Promise<string[]> => {
    const uploadedImageUrls: string[] = [];

    for (const image of images) {
      const reader = new FileReader();
      reader.readAsDataURL(image);

      const imageUrl = await new Promise<string>((resolve, reject) => {
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
              toast.error("Image upload failed");
            }
          } catch (err: any) {
            reject(err);
            toast.error("Error uploading image");
          }
        };
      });

      uploadedImageUrls.push(imageUrl);
    }

    return uploadedImageUrls;
  };


  const onAddPost = async () => {
    setLoading(true);
    try {
      const imageUrls = await uploadImages();
      if (imageUrls.length === 0) {
        toast.error("No images uploaded");
        setLoading(false);
        return;
      }

      const updatedPost = { ...post, images: imageUrls };
      await axios.post("/api/post/addPost", updatedPost);
      toast.success("Post created successfully!");
      router.push("/myPosts");
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Error creating post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex justify-center items-center px-4 py-12">
        <div className="w-full max-w-lg p-6 shadow-2xl rounded-xl bg-gray-50">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Create a Post 📸
          </h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onAddPost();
            }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <label className="block font-semibold text-gray-700">
                Title
              </label>
              <input
                onChange={(e) => setPost({ ...post, title: e.target.value })}
                type="text"
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Enter post title"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block font-semibold text-gray-700">
                Caption
              </label>
              <textarea
                onChange={(e) => setPost({ ...post, caption: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Enter post caption"
                required
              ></textarea>
            </div>

            <div className="space-y-2">
              <label className="block font-semibold text-gray-700">
                Upload Images
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    document.getElementById("imageUpload")?.click()
                  }
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
                >
                  + Add Image
                </button>
                <input
                  type="file"
                  multiple
                  id="imageUpload"
                  className="hidden"
                  onChange={handleImageChange}
                  accept="image/*"
                />
              </div>

            
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-20 h-20 object-cover rounded-lg shadow"
                      />
                      <button
                        type="button"
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                        onClick={() => removeImage(index)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white py-2 rounded-lg shadow hover:bg-blue-600 transition"
            >
              {loading ? "Posting..." : "Post 📤"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
