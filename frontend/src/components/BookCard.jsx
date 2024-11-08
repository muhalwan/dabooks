import React from 'react';

const BookCard = ({ book, onReviewClick }) => {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900">{book.title}</h3>
        <p className="mt-1 text-sm text-gray-600">{book.author}</p>
        <p className="mt-2 text-sm text-gray-500">{book.description}</p>
        <button
          onClick={() => onReviewClick(book.id)}
          className="mt-4 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
        >
          Add Review
        </button>
      </div>
    </div>
  );
};

export default BookCard;