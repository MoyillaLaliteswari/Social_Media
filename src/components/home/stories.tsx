import React, { useState } from "react";
import StoryModal from "@/src/components/home/storyModal";

interface Story {
  _id: number;
  user: string;
  img: string;
  media: string;
  mediaType: "image" | "video";
}

interface StoriesProps {
  stories: Story[];
}

export default function Stories({ stories }: StoriesProps) {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);

  const openStory = (story: Story) => {
    setSelectedStory(story);
  };

  const closeStory = () => {
    setSelectedStory(null);
  };

  if (!Array.isArray(stories) || stories.length === 0) {
    return <p className="text-center text-gray-400">No stories available</p>;
  }

  return (
    <>
      <div className="flex space-x-4 overflow-x-auto p-4 scrollbar-hide">
        {stories.map((story) => (
          <div
            key={story._id}
            className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform"
            onClick={() => openStory(story)}
          >
            <div className="w-16 h-16 p-1 rounded-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500">
              <div className="w-full h-full bg-white p-[2px] rounded-full flex items-center justify-center">
                <img
                  src={story.img}
                  alt={story.user}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>
            <p className="text-xs mt-1 text-gray-400 truncate w-16 text-center">
              {story.user}
            </p>
          </div>
        ))}
      </div>

      {selectedStory && <StoryModal story={selectedStory} onClose={closeStory} />}
    </>
  );
}
