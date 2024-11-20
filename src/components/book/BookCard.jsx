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
      className="bg-gray-800/50 rounded-2xl p-6 h-[240px] 
                 cursor-pointer hover:bg-gray-800/80
                 transition-all duration-200"
    >
      {/* Main content container with flex to ensure consistent spacing */}
      <div className="flex flex-col h-full">
        {/* Title and Author section */}
        <div className="mb-4">
          <h3 className="text-xl font-normal text-white mb-2">
            {book.title}
          </h3>
          <p className="text-gray-400 text-sm italic">
            {book.author}
          </p>
        </div>

        {/* Reviews section */}
        <div className="flex items-center mb-4">
          <div className="flex text-yellow-400">
            {'★'.repeat(rating)}
            <span className="text-gray-600">
              {'★'.repeat(5 - rating)}
            </span>
          </div>
          <span className="ml-2 text-sm text-gray-400">
            ({book.total_ratings || 0} reviews)
          </span>
        </div>

        {/* Description with line clamp to ensure consistent height */}
        <p className="text-gray-400 text-sm line-clamp-3">
          {book.description}
        </p>
      </div>
    </motion.div>
  );
};

export default BookCard;