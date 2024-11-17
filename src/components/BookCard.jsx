// components/BookCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const BookCard = ({ book }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/book/${book.id}`)}
      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer"
    >
      <div className="p-6">
        <div className="h-40 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">{book.title}</h3>
            <p className="text-sm text-gray-500 italic">{book.author}</p>
            <div className="flex items-center mt-2">
              <div className="flex items-center">
                <span className="text-yellow-400">{'★'.repeat(Math.round(book.average_rating))}</span>
                <span className="text-gray-300">{'★'.repeat(5 - Math.round(book.average_rating))}</span>
              </div>
              <span className="ml-2 text-sm text-gray-500">
                ({book.average_rating})
              </span>
              <span className="ml-2 text-sm text-gray-400">
                {book.review_count} {book.review_count === 1 ? 'review' : 'reviews'}
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-600 line-clamp-3 mt-4">{book.description}</p>
        </div>
      </div>
    </div>
  );
};

export default BookCard;