import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ReviewForm = ({ bookId, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    text: '',
    rating: 5
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(bookId, formData);
  };

  const renderStarInput = () => {
    return (
      <div className="flex items-center space-x-1">
        {[5, 4, 3, 2, 1].map((star) => (
          <motion.button
            key={star}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            type="button"
            onClick={() => setFormData({ ...formData, rating: star })}
            className="focus:outline-none"
          >
            <motion.span
              animate={{
                scale: formData.rating >= star ? 1.2 : 1,
                color: formData.rating >= star ? '#FBBF24' : '#D1D5DB'
              }}
              className="text-2xl"
            >
              ★
            </motion.span>
          </motion.button>
        ))}
      </div>
    );
  };

  return (
    <motion.form
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      onSubmit={handleSubmit}
      className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-lg"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Rating
        </label>
        {renderStarInput()}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Review
        </label>
        <textarea
          required
          value={formData.text}
          onChange={(e) => setFormData({ ...formData, text: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm
                   focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400
                   dark:focus:border-indigo-400 bg-white dark:bg-gray-700
                   text-gray-900 dark:text-white"
          rows="4"
          placeholder="Write your review here..."
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm
                   font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700
                   hover:bg-gray-50 dark:hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm
                   font-medium text-white bg-indigo-600 hover:bg-indigo-700
                   dark:bg-indigo-500 dark:hover:bg-indigo-600"
        >
          Submit Review
        </button>
      </div>
    </motion.form>
  );
};

export default ReviewForm;