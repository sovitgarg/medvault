import { useState } from 'react';
import { useDriveContext } from '../../context/DriveContext';

export const SearchBar = () => {
  const [query, setQuery] = useState('');
  const { searchFolders, fetchFolders } = useDriveContext();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim()) {
      searchFolders(value);
    } else {
      fetchFolders();
    }
  };

  return (
    <div className="relative max-w-2xl">
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Search folders and files..."
        className="w-full px-6 py-4 pl-14 pr-4 text-base border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm bg-white"
      />
      <svg
        className="absolute left-5 top-4.5 h-6 w-6 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>
  );
};
