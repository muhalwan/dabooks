import React from 'react';
import { useNavigate } from 'react-router-dom';

const BookCard = ({ book }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/book/${book.id}`)}
      className="bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-300 cursor-pointer"
    >
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {book.title}
        </h3>
        <p className="text-sm text-gray-600 italic mb-3">
          {book.author}
        </p>
        <div className="flex items-center mb-4">
          <div className="flex text-yellow-400">
            {'★'.repeat(Math.round(book.average_rating || 0))}
            <span className="text-gray-300">
              {'★'.repeat(5 - Math.round(book.average_rating || 0))}
            </span>
          </div>
          <span className="ml-2 text-sm text-gray-500">
            ({book.average_rating || 0})
          </span>
          <span className="ml-2 text-sm text-gray-500">
            {book.total_ratings || 0} reviews
          </span>
        </div>
        <p className="text-gray-700 line-clamp-3">
          {book.description}
        </p>
      </div>
    </div>
  );
};

export default BookCard;