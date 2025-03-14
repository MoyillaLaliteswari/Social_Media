interface StoriesProps {
  stories: {
    _id: number;
    user: string;
    img: string;
  }[];
}

export default function Stories({ stories }: StoriesProps) {
  if (!Array.isArray(stories) || stories.length === 0) {
    return <p className="text-center text-gray-400">No stories available</p>;
  }

  return (
    <div>
      {stories.map((story) => (
        <div key={story._id}>
          <img src={story.img} alt={story.user} />
          <p>{story.user}</p>
        </div>
      ))}
    </div>
  );
}
