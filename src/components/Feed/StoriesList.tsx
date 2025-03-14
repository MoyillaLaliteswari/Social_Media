'use client';

interface Story {
    _id: string;
    author: {
        username: string;
        profileImageURL: string;
    };
    expiresAt: string;
}

interface StoriesProps {
    stories: Story[];
}

export default function Stories({ stories }: StoriesProps) {
    return (
        <div className="flex space-x-4 overflow-x-auto p-4 bg-white shadow rounded-lg">
            {stories.length > 0 ? (
                stories.map((story) => (
                    <div key={story._id} className="flex flex-col items-center cursor-pointer">
                        <div className="w-16 h-16 border-2 border-pink-500 rounded-full p-1">
                            <img
                                src={story.author.profileImageURL}
                                alt={story.author.username}
                                className="w-full h-full rounded-full object-cover"
                            />
                        </div>
                        <span className="text-xs mt-1 text-gray-700">{story.author.username}</span>
                    </div>
                ))
            ) : (
                <div className="text-center text-gray-500">No stories available</div>
            )}
        </div>
    );
}
