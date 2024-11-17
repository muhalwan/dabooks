import React, { useState } from 'react';

const ReviewForm = ({ bookId, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    text: '',
    rating: 5
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(bookId, formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Rating</label>
        <select
          value={formData.rating}
          onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          {[1, 2, 3, 4, 5].map((num) => (
            <option key={num} value={num}>
              {num} Star{num !== 1 ? 's' : ''}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Review</label>
        <textarea
          value={formData.text}
          onChange={(e) => setFormData({ ...formData, text: e.target.value })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          rows="4"
          placeholder="Write your review here..."
        ></textarea>
      </div>
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Submit Review
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;