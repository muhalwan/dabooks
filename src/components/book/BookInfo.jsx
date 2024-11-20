import React from 'react';
import { motion } from 'framer-motion';

const BookInfo = ({ book, onReviewClick }) => {
  const rating = Math.round(book?.average_rating || 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
      <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
        {book?.title}
      </h1>
      <p className="text-xl italic mb-4 text-gray-700 dark:text-gray-300">
        {book?.author}
      </p>

      <div className="flex items-center mb-6">
        <div className="flex text-yellow-400">
          {'★'.repeat(rating)}
          <span className="text-gray-300 dark:text-gray-600">
            {'★'.repeat(5 - rating)}
          </span>
        </div>
        <span className="ml-2 text-gray-600 dark:text-gray-400">
          ({book?.total_ratings || 0} {book?.total_ratings === 1 ? 'review' : 'reviews'})
        </span>
      </div>

      <p className="text-gray-600 dark:text-gray-400 mb-6">
        {book?.description}
      </p>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onReviewClick}
        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md
                 shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700
                 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2
                 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
      >
        Write a Review
      </motion.button>
    </div>
  );
};

export default BookInfo;