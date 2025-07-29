import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useSearch } from '../context/SearchContext';

const SearchBar = () => {
  const navigate = useNavigate();
  const { updateSearchQuery } = useSearch();
  const [query, setQuery] = useState('');

  // Mock recent searches
  const recentSearches = [
    'Paneer Butter Masala',
    'Dominoes Pizza',
    'Biryani'
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    updateSearchQuery(query);
    navigate('/search');
  };

  const handleRecentSearch = (search: string) => {
    updateSearchQuery(search);
    navigate('/search');
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search dish, restaurant, or cuisine..."
            className="w-full py-3 pl-10 pr-4 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#FF5A5F] shadow-sm"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-[#FF5A5F] to-[#FC8019] text-white py-1.5 px-4 rounded-full hover:shadow-md transition"
          >
            Compare
          </button>
        </div>
      </form>

      {recentSearches.length > 0 && (
        <div className="mt-3">
          <p className="text-xs text-gray-500 mb-1.5">Recent searches:</p>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((search, index) => (
              <button
                key={index}
                onClick={() => handleRecentSearch(search)}
                className="bg-white text-sm text-gray-600 border border-gray-200 rounded-full px-3 py-1 hover:bg-gray-50 transition"
              >
                {search}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;