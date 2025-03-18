'use client';

import Image from 'next/image';

interface Story {
  _id: string;
  expiresAt: string;
  author: {
    username: string;
    profileImageURL: string;
  };
}

interface StoriesProps {
  stories: Story[];
}

export default function Stories({ stories }: StoriesProps) {
  console.log('Stories in Stories Component:', stories);

  return (
    <div className="flex space-x-4 overflow-x-auto p-4 bg-white shadow rounded-lg">
      {stories.length > 0 ? (
        stories.map((story, index) => (
          <div key={story._id} className="flex flex-col items-center cursor-pointer">
            <div className="w-16 h-16 border-2 border-pink-500 rounded-full p-1">
              <Image
                src={story.author.profileImageURL}
                alt={story.author.username}
                width={64}
                height={64}
                className="w-full h-full rounded-full object-cover"
                priority={index < 3}
              />
            </div>
            <span className="text-xs mt-1 text-gray-700">{story.author.username}</span>
          </div>
        ))
      ) : (
        <div className="text-center text-gray-500"></div>
      )}
    </div>
  );
}
