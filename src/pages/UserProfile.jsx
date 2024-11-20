import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/shared/Navbar';
import PageTransition from '../components/shared/PageTransition';
import { api } from '../utils/api';

const UserProfile = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await api.users.getPublicProfile(id, token);
        setUserData(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUserProfile();
    }
  }, [id, token]);

  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <Navbar />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="animate-pulse space-y-8">
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg" />
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  if (error) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <Navbar />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-red-100 dark:bg-red-900 p-4 rounded-lg">
              <p className="text-red-700 dark:text-red-100">{error}</p>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="bg-indigo-100 dark:bg-indigo-900 rounded-full p-4">
                <span className="text-2xl text-indigo-600 dark:text-indigo-400">
                  {userData?.username[0].toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {userData?.username}
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                  {userData?.reviews?.length || 0} reviews
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {userData?.reviews?.map((review) => (
                <div
                  key={review._id}
                  className="border-b last:border-b-0 pb-6 last:pb-0 dark:border-gray-700"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {review.book_title}
                    </h3>
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
                </div>
              ))}

              {(!userData?.reviews || userData.reviews.length === 0) && (
                <p className="text-center text-gray-500 dark:text-gray-400 italic">
                  This user hasn't written any reviews yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default UserProfile;