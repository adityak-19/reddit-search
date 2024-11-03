// components/SubredditCard.js
export default function SubredditCard({ subreddit }) {
  const {
    title = "Unknown Title",
    description = "No description available",
    created,
    restricted = false,
    members = 0, // Default to 0 if members is null
    online = 0,  // Default to 0 if online is null
    discord_url,
  } = subreddit;

  const formattedDate = created ? new Date(created * 1000).toLocaleDateString() : "Unknown Date"; // Fallback for date

  return (
    <div className="border border-gray-300 rounded-lg p-4">
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="text-gray-600">{description}</p>
      <div className="mt-4 text-gray-500">
        <p>📅 Created: {formattedDate}</p>
        <p>🔒 {restricted ? "Restricted" : "Open"}</p>
      </div>
      <div className="mt-4 flex items-center space-x-4">
        <p>👥 Members: {members !== null ? members.toLocaleString() : "Unknown"}</p>
        <p>🟢 Online: {online !== null ? online : "Unknown"}</p>
      </div>
      {discord_url && (
        <p className="mt-4 text-blue-500">
          <a href={discord_url} target="_blank" rel="noopener noreferrer">
            Official Discord
          </a>
        </p>
      )}
    </div>
  );
}
