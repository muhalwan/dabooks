import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/shared/Navbar';
import PageTransition from '../components/shared/PageTransition';
import Stars from '../components/shared/Stars';
import { api } from '../utils/api';

const initial = (name) => (name?.[0] || '?').toUpperCase();
const fmt = (iso) => {
  try { return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }); }
  catch { return ''; }
};

const UserProfile = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        setLoading(true);
        const res = await api.users.getPublicProfile(id, token);
        setUserData(res.data);
      } catch (err) { setError(err.message); }
      finally { setLoading(false); }
    })();
  }, [id, token]);

  const reviews = userData?.reviews || [];

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
              {/* Reader card */}
              <section className="pb-8 mb-10 border-b border-line">
                <div className="flex items-center gap-5 mb-6">
                  <div className="w-14 h-14 flex items-center justify-center border border-line bg-surface">
                    <span className="font-serif text-2xl text-accent">{initial(userData?.username)}</span>
                  </div>
                  <div>
                    <h1 className="font-serif text-3xl text-ink tracking-tightish leading-tight">{userData?.username}</h1>
                    <p className="text-sm text-muted">{reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}</p>
                  </div>
                </div>
              </section>

              {/* Reviews */}
              {reviews.length === 0 ? (
                <p className="text-muted italic">— This reader hasn't written any reviews yet.</p>
              ) : (
                <ul className="divide-y divide-line">
                  {reviews.map((r) => (
                    <li key={r._id} className="py-6 first:pt-0 last:pb-0">
                      <header className="flex items-baseline justify-between gap-4 mb-2">
                        <h3 className="font-serif text-lg text-ink">{r.book_title}</h3>
                        <div className="flex items-center gap-3">
                          <Stars value={r.rating} />
                          <span className="text-xs text-muted">{fmt(r.date_posted)}</span>
                        </div>
                      </header>
                      {r.book_author && <p className="text-xs italic text-muted mb-2">by {r.book_author}</p>}
                      <p className="font-serif text-[1.02rem] leading-[1.7] text-ink/90 max-w-prose">{r.text}</p>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </main>
      </div>
    </PageTransition>
  );
};

export default UserProfile;
