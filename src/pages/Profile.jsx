import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/shared/Navbar';
import ProfileInfo from '../components/profile/ProfileInfo';
import UserReviews from '../components/profile/UserReviews';
import PageTransition from '../components/shared/PageTransition';
import { api } from '../utils/api';

const Profile = () => {
  const { token, username } = useAuth();
  const [userData, setUserData] = useState(null);
  const [userReviews, setUserReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const [profileData, reviewsData] = await Promise.all([
          api.users.getProfile(token),
          api.users.getReviews(token)
        ]);
        setUserData(profileData);
        setUserReviews(reviewsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [token]);

  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <Navbar />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="animate-pulse space-y-8">
              <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg" />
              <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-lg" />
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
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <p className="text-red-600 dark:text-red-400 text-center">{error}</p>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ProfileInfo user={userData} />
          <UserReviews reviews={userReviews} />
        </div>
      </div>
    </PageTransition>
  );
};

export default Profile;