import React from 'react';
import { motion } from 'framer-motion';

const SearchBar = ({ value, onChange, isSearching }) => {
  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search books..."
        className="w-full sm:w-64 px-4 py-2 rounded-lg border border-gray-300
                 dark:border-gray-600 bg-white dark:bg-gray-700
                 text-gray-900 dark:text-white focus:outline-none
                 focus:ring-2 focus:ring-indigo-500"
      />
      {isSearching && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full"
          />
        </div>
      )}
    </div>
  );
};

export default SearchBar;