import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const BookCard = ({ book }) => {
  const navigate = useNavigate();

  // Debug log to check book data
  console.log('Book data in card:', book);

  const handleClick = () => {
    // MongoDB returns _id, so we need to use that
    const bookId = book._id || book.id;
    if (bookId) {
      navigate(`/book/${bookId}`);
    } else {
      console.error('No book ID available:', book);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 cursor-pointer
                 transition-all duration-200 hover:shadow-md"
    >
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {book.title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 italic mb-4">
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
          ({book.total_ratings || 0} reviews)
        </span>
      </div>
      {book.description && (
        <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-3">
          {book.description}
        </p>
      )}
    </motion.div>
  );
};

export default BookCard;