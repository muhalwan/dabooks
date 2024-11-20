import React from 'react';
import { motion } from 'framer-motion';

const SortButtons = ({ activeSort, activeOrder, onSortChange }) => {
  const sorts = [
    { value: 'title', label: 'Title' },
    { value: 'rating', label: 'Rating' },
    { value: 'popularity', label: 'Popularity' }
  ];

  return (
    <div className="flex space-x-2">
      {sorts.map(({ value, label }) => (
        <motion.button
          key={value}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSortChange(value)}
          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors
                     ${activeSort === value
                       ? 'bg-indigo-600 text-white dark:bg-indigo-500'
                       : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                     }`}
        >
          {label}
          {activeSort === value && (
            <span className="ml-1">
              {activeOrder === 'asc' ? '↑' : '↓'}
            </span>
          )}
        </motion.button>
      ))}
    </div>
  );
};

export default SortButtons;