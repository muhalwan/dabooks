import React from 'react';
import { motion } from 'framer-motion';

const ProfileInfo = ({ user }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
    <div className="flex items-center space-x-4 mb-6">
      <div className="bg-indigo-100 dark:bg-indigo-900 p-4 rounded-full">
        <span className="text-2xl text-indigo-600 dark:text-indigo-400">
          {user?.username?.[0]?.toUpperCase()}
        </span>
      </div>
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          {user?.username}
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Member since {new Date(user?.created_at).toLocaleDateString()}
        </p>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Reading Stats
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Reviews Written</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {user?.reviews?.length || 0}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Average Rating</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {user?.reviews?.length
                ? (user.reviews.reduce((acc, r) => acc + r.rating, 0) / user.reviews.length).toFixed(1)
                : 'N/A'} ★
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ProfileInfo;