import React from 'react';
import { motion } from 'framer-motion';

const ReviewList = ({ reviews }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Reviews</h2>

      {(!reviews || reviews.length === 0) ? (
        <p className="text-gray-500 dark:text-gray-400 text-center italic">
          No reviews yet. Be the first to share your thoughts!
        </p>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <motion.div
              key={review._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="border-b last:border-b-0 pb-4 last:pb-0 dark:border-gray-700"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-900 dark:text-white">
                  {review.user?.username || 'Anonymous'}
                </span>
                <div className="flex text-yellow-400">
                  {'★'.repeat(review.rating)}
                  <span className="text-gray-300 dark:text-gray-600">
                    {'★'.repeat(5 - review.rating)}
                  </span>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300">{review.text}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {new Date(review.created_at).toLocaleDateString()}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewList;