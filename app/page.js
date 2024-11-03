// app/page.js
'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';
import SubredditCard from '@/components/SubredditCard';

export default function HomePage() {
  const [subreddits, setSubreddits] = useState([]);
  const [query, setQuery] = useState(''); // State to hold the search input
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // State to handle loading

  const fetchSubreddits = async (searchQuery) => {
    setLoading(true); // Start loading
    setError(null); // Clear previous error message
    console.log(`Fetching subreddits for query: ${searchQuery}`); // Log the query

    try {
      const response = await axios.get(`/api/reddit?query=${searchQuery}`);
      console.log('Response from API:', response.data); // Log the API response

      // Check if the response contains valid data
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        setSubreddits(response.data);
      } else {
        setSubreddits([]);
        setError("No subreddits found. Please try a different query.");
      }
    } catch (error) {
      console.error("Error fetching subreddits", error); // Log the entire error object
      const errorMessage = error.response
        ? error.response.data.error || error.response.data // Adjust based on your API response structure
        : error.message || "An unknown error occurred"; // Fallback for unknown errors
      setError(`Failed to load subreddits: ${errorMessage}`);
      setSubreddits([]); // Clear results if there's an error
    } finally {
      setLoading(false); // End loading
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim() !== '') {
      fetchSubreddits(query);
    }
  };

  return (
    <div className="p-6">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-6 w-[60%] m-auto flex items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a subreddit"
          className="border border-gray-300 rounded-l p-2 w-full focus:outline-none focus:ring focus:border-blue-300"
        />
        <button
          type="submit"
          className="bg-blue-500 ml-1 text-white rounded-r px-4 py-2 hover:bg-blue-600 hover:rounded-l"
          disabled={loading} // Disable button while loading
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {/* Display Results */}
      {error && <p className="text-red-500">{error}</p>}
      {loading && <p className="text-blue-500">Loading...</p>}
      {!loading && subreddits.length > 0 && (
        <div className="grid grid-cols-1 gap-6">
          {subreddits.map((subreddit, index) => (
            <SubredditCard key={index} subreddit={subreddit} />
          ))}
        </div>
      )}
    </div>
  );
}
