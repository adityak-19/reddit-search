// components/PostList.js
export default function PostList({ posts }) {
    return (
      <div className="p-4">
        {posts.map((post) => (
          <div key={post.id} className="border p-4 mb-2 rounded shadow">
            <h3 className="text-xl font-bold">{post.title}</h3>
            <p className="text-gray-600">{post.selftext}</p>
            <a href={`https://reddit.com${post.permalink}`} target="_blank" className="text-blue-500">
              View on Reddit
            </a>
          </div>
        ))}
      </div>
    );
  }
  