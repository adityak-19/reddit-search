// components/SearchBar.js
import { useState } from 'react';

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    onSearch(query);
  };

  return (
    <div className="flex items-center space-x-4 p-4">
      <input 
        type="text" 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search Reddit..."
        className="p-2 border rounded w-full"
      />
      <button onClick={handleSearch} className="bg-blue-500 text-white px-4 py-2 rounded">Search</button>
    </div>
  );
}
