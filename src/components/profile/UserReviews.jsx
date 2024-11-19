import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const UserReviews = ({ reviews }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
    <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Your Reviews</h2>
    {reviews.length === 0 ? (
      <p className="text-gray-500 dark:text-gray-400 text-center italic">
        You haven't written any reviews yet.
      </p>
    ) : (
      <div className="space-y-4">
        {reviews.map((review) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="border-b last:border-b-0 pb-4 dark:border-gray-700"
          >
            <Link
              to={`/book/${review.book_id}`}
              className="block hover:bg-gray-50 dark:hover:bg-gray-700 -mx-4 px-4 py-2 rounded-lg"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {review.book_title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {review.book_author}
                  </p>
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
                {new Date(review.created_at).toLocaleDateString()}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>
    )}
  </div>
);

export default UserReviews;