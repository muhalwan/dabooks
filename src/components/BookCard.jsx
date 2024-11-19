import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const BookCard = ({ book, index }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      onClick={() => navigate(`/book/${book.id}`)}
      className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md dark:shadow-gray-700 transition-all duration-300 cursor-pointer"
    >
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {book.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 italic mb-3">
          {book.author}
        </p>
        <div className="flex items-center mb-4">
          <div className="flex text-yellow-400">
            {'★'.repeat(Math.round(book.average_rating || 0))}
            <span className="text-gray-300 dark:text-gray-600">
              {'★'.repeat(5 - Math.round(book.average_rating || 0))}
            </span>
          </div>
          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
            ({book.average_rating || 0})
          </span>
          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
            {book.total_ratings || 0} reviews
          </span>
        </div>
        <p className="text-gray-700 dark:text-gray-300 line-clamp-3">
          {book.description}
        </p>
      </div>
    </motion.div>
  );
};

export default BookCard;