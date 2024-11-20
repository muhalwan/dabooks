import React from 'react';
import { motion } from 'framer-motion';

const UserReviews = ({ reviews = [] }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
        Your Reviews
      </h2>

      {reviews.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center italic">
          You haven't written any reviews yet.
        </p>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <motion.div
              key={review._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="border-b last:border-b-0 pb-6 last:pb-0 dark:border-gray-700"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {review.book_title}
                  </h3>
                </div>
                <div className="flex text-yellow-400">
                  {'★'.repeat(review.rating)}
                  <span className="text-gray-300 dark:text-gray-600">
                    {'★'.repeat(5 - review.rating)}
                  </span>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300">{review.text}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {new Date(review.date_posted).toLocaleDateString()}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserReviews;