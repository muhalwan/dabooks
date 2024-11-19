import React from 'react';
import { motion } from 'framer-motion';

const ReviewItem = ({ review }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="border-b pb-4 last:border-b-0 dark:border-gray-700"
  >
    <div className="flex items-center justify-between mb-2">
      <span className="text-gray-600 dark:text-gray-400">{review.user}</span>
      <div className="flex text-yellow-400">
        {'★'.repeat(review.rating)}
        <span className="text-gray-300 dark:text-gray-600">
          {'★'.repeat(5 - review.rating)}
        </span>
      </div>
    </div>
    <p className="text-gray-700 dark:text-gray-300">{review.text}</p>
  </motion.div>
);

const ReviewList = ({ reviews }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
  >
    <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Reviews</h2>
    {reviews.length === 0 ? (
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-gray-500 dark:text-gray-400 text-center italic"
      >
        No reviews yet. Be the first to share your thoughts!
      </motion.p>
    ) : (
      <div className="space-y-4">
        {reviews.map((review) => (
          <ReviewItem key={review.id} review={review} />
        ))}
      </div>
    )}
  </motion.div>
);

export default ReviewList;