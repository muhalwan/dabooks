import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/shared/Navbar';
import ProfileInfo from '../components/profile/ProfileInfo';
import UserReviews from '../components/profile/UserReviews';
import PageTransition from '../components/shared/PageTransition';
import { api } from '../utils/api';

const Profile = () => {
  const { token } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        setLoading(true);
        const res = await api.users.getProfile(token);
        setProfileData(res.data);
      } catch (err) { setError(err.message); }
      finally { setLoading(false); }
    })();
  }, [token]);

  return (
    <PageTransition>
      <div className="min-h-screen bg-paper">
        <Navbar />
        <main className="max-w-3xl mx-auto px-5 sm:px-8 py-14">
          {loading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-16 w-full bg-line" />
              <div className="h-64 w-full bg-line" />
            </div>
          ) : error ? (
            <p className="text-accent">— {error}</p>
          ) : (
            <>
              <ProfileInfo user={profileData} />
              <UserReviews reviews={profileData?.reviews || []} />
            </>
          )}
        </main>
      </div>
    </PageTransition>
  );
};

export default Profile;
