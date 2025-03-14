interface PostsProps {
  posts: {
    _id: number;
    title: string;
    images: string;
    caption: string;
  }[];
}

export default function Posts({ posts }: PostsProps) {
  console.log(posts);
  if (!Array.isArray(posts) || posts.length === 0) {
    return <p className="text-center text-gray-400">No posts available</p>;
  }

  return (
    <div>
      {posts.map((post) => (
        <div key={post._id}>
          <h2>{post.title}</h2>
          <img src={post.images} alt={post.title} />
          <p>{post.caption}</p>
        </div>
      ))}
    </div>
  );
}
