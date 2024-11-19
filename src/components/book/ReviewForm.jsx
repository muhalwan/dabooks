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
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => (
    <div className="flex items-center space-x-1">
      {[5, 4, 3, 2, 1].map((star) => (
        <motion.button
          key={star}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          type="button"
          onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
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

  return (
    <motion.form
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Rating
        </label>
        {renderStars()}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Review
        </label>
        <textarea
          required
          value={formData.text}
          onChange={(e) => setFormData(prev => ({ ...prev, text: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                   shadow-sm focus:ring-indigo-500 focus:border-indigo-500
                   dark:focus:ring-indigo-400 dark:focus:border-indigo-400
                   bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          rows="4"
          placeholder="Write your review here..."
          disabled={isSubmitting}
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                   text-sm font-medium text-gray-700 dark:text-gray-300
                   bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600
                   disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm
                   text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700
                   dark:bg-indigo-500 dark:hover:bg-indigo-600
                   disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            'Submit Review'
          )}
        </motion.button>
      </div>
    </motion.form>
  );
};

export default ReviewForm;