import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const BookCard = ({ book }) => {
  const navigate = useNavigate();
  const rating = Math.round(book.average_rating || 0);

  return (
      <motion.div
          whileHover={{ y: -4 }}
          onClick={() => navigate(`/book/${book._id}`)}
          className="group bg-white dark:bg-gray-800 rounded-2xl p-6 h-[240px]
                 cursor-pointer border border-gray-200 dark:border-gray-700
                 hover:bg-gray-50 dark:hover:bg-gray-700/50
                 transition-all duration-200"
      >
        <div className="flex flex-col h-full">
          <div className="mb-4">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white
                       group-hover:text-indigo-600 dark:group-hover:text-indigo-400
                       transition-colors duration-200">
              {book.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm italic">
              {book.author}
            </p>
          </div>

          <div className="flex items-center mb-4">
            <div className="flex text-yellow-400">
              {'★'.repeat(rating)}
              <span className="text-gray-300 dark:text-gray-600">
              {'★'.repeat(5 - rating)}
            </span>
            </div>
            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
            ({book.total_ratings || 0} reviews)
          </span>
          </div>

          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3">
            {book.description}
          </p>
        </div>
      </motion.div>
  );
};

export default BookCard;