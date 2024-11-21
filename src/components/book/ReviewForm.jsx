import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ReviewForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    text: '',
    rating: 5
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Rating
        </label>
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
              className="focus:outline-none"
            >
              <span
                className={`text-2xl ${
  formData.rating >= star ? 'text-yellow-400' : 'text-gray-600'
}`}
              >
                ★
              </span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Review
        </label>
        <textarea
          value={formData.text}
          onChange={(e) => setFormData(prev => ({ ...prev, text: e.target.value }))}
          required
          rows="4"
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg
                   text-white placeholder-gray-400 focus:outline-none
                   focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          placeholder="Write your review here..."
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg
                   hover:bg-gray-600 transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg
                   hover:bg-indigo-700 transition-colors duration-200
                   disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;