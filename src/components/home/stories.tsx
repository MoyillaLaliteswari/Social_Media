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
  const [selectedUserStories, setSelectedUserStories] = useState<Story[] | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openStory = (userStories: Story[]) => {
    setSelectedUserStories([...userStories]); // Ensure state updates properly
    setCurrentIndex(0);
  };

  const closeStory = () => {
    setSelectedUserStories(null);
  };

  // Group stories by user
  const groupedStories: { [key: string]: Story[] } = {};
  stories.forEach((story) => {
    if (!groupedStories[story.user]) groupedStories[story.user] = [];
    groupedStories[story.user].push(story);
  });

  return (
    <>
      <div className="flex space-x-4 overflow-x-auto p-4 scrollbar-hide">
        {Object.entries(groupedStories).map(([user, userStories]) => (
          <div
            key={user}
            className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform"
            onClick={() => openStory(userStories)}
          >
            <div className="w-16 h-16 p-1 rounded-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500">
              <div className="w-full h-full bg-white p-[2px] rounded-full flex items-center justify-center">
                <img
                  src={userStories[0].img}
                  alt={user}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>
            <p className="text-xs mt-1 text-gray-400 truncate w-16 text-center">
              {user}
            </p>
          </div>
        ))}
      </div>

      {selectedUserStories && (
        <StoryModal
          stories={selectedUserStories}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
          onClose={closeStory}
        />
      )}
    </>
  );
}
