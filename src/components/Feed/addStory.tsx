import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiPlus } from "react-icons/fi";
import Image from "next/image";
import StoryModal from "@/src/components/home/storyModal";

interface Story {
  _id: number;
  user: string;
  img: string;
  media: string;
  mediaType: "image" | "video";
}

interface AddStoryProps {
    myStories: Story[];
    updateStories: (newStory: Story) => void;
  }  

const AddStory: React.FC<AddStoryProps> = ({ myStories, updateStories }) => {
  const [media, setMedia] = useState<File | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [profileImage, setProfileImage] = useState<string>("/noAvatar.png");
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await axios.get("/api/users/me");
        if (res.status === 200 && res.data.data.profileImageURL) {
          setProfileImage(res.data.data.profileImageURL);
        }
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
    };
    fetchUserInfo();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMedia(file);
      setMediaType(file.type.startsWith("video") ? "video" : "image");
    }
  };

  const handleUpload = async () => {
    if (!media) return alert("Please select a file");

    setUploadStatus("uploading");

    const formData = new FormData();
    formData.append("file", media);
    formData.append("mediaType", mediaType);

    try {
      const res = await axios.post("/api/stories/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status === 200) {
        const newStory: Story = res.data.story;
        setUploadStatus("success");
        updateStories(newStory); // Update the story list
        setSelectedStory(newStory); // Open the story after upload
        setMedia(null);
      } else {
        setUploadStatus("error");
        alert("Upload failed. Please try again.");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      setUploadStatus("error");
      alert("Upload failed. Please try again.");
    }
  };

  return (
    <>
      <div className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform">
        <label htmlFor="story-upload" className="cursor-pointer">
          <div className="relative w-16 h-16 p-1 rounded-full bg-gradient-to-r from-[#ff416c] to-[#ff4b2b]">
            <div className="w-full h-full bg-white p-[2px] rounded-full flex items-center justify-center relative shadow-lg">
              <Image
                src={profileImage}
                alt="Profile"
                width={64}
                height={64}
                className="rounded-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-full transition-opacity duration-300 hover:bg-opacity-50">
                <FiPlus className="text-white text-3xl" />
              </div>
            </div>
          </div>
        </label>
        <input
          id="story-upload"
          type="file"
          accept="image/*,video/*"
          className="hidden"
          onChange={handleFileChange}
        />

        
        {myStories.length > 0 ? (
        <button
            onClick={() => setSelectedStory(myStories[0])} // Set the first story initially
            className="text-xs mt-2 text-gray-300 font-medium backdrop-blur-sm px-2 py-1 rounded-md bg-white/10 hover:bg-white/20 transition-all"
        >
            View My Stories
        </button>
        ) : (
        <p className="text-xs mt-2 text-gray-300 font-medium backdrop-blur-sm px-2 py-1 rounded-md bg-white/10">
            Add Story
        </p>
        )}



        {/* Upload Button */}
        {media && (
          <button
            onClick={handleUpload}
            className="mt-3 px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-full shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            {uploadStatus === "uploading" ? "Uploading..." : "Upload"}
          </button>
        )}

        {/* Upload Status */}
        {uploadStatus === "success" && <p className="text-xs text-green-400 mt-1">Story uploaded!</p>}
        {uploadStatus === "error" && <p className="text-xs text-red-400 mt-1">Upload failed!</p>}
      </div>

      {/* Story Modal */}
        {selectedStory && (
        <StoryModal
            stories={myStories} 
            currentIndex={myStories.findIndex((story) => story._id === selectedStory._id)}
            setCurrentIndex={(index) => setSelectedStory(myStories[index])} // Update selected story on navigation
            onClose={() => setSelectedStory(null)}
        />
        )}

    </>
  );
};

export default AddStory;
