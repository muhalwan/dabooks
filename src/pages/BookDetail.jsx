import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/shared/Navbar';
import BookInfo from '../components/book/BookInfo';
import ReviewForm from '../components/book/ReviewForm';
import ReviewList from '../components/book/ReviewList';
import PageTransition from '../components/shared/PageTransition';
import { api } from '../utils/api';

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookData = async () => {
    try {
      setLoading(true);
      // ponytail: was two sequential awaits; Promise.all fans them out.
      const [bookResponse, reviewsResponse] = await Promise.all([
        api.books.getById(id),
        api.books.getReviews(id),
      ]);
      setBook(bookResponse.data);
      setReviews(reviewsResponse.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (id) fetchBookData(); /* eslint-disable-next-line */ }, [id]);

  const handleReviewClick = () => {
    if (!token) navigate('/login', { state: { from: `/book/${id}` } });
    else setIsReviewFormOpen(true);
  };

  const handleReviewSubmit = async (reviewData) => {
    if (!token) { navigate('/login', { state: { from: `/book/${id}` } }); return; }
    try {
      await api.books.addReview(id, reviewData, token);
      setIsReviewFormOpen(false);
      await fetchBookData();
    } catch {
      setError('Failed to submit review');
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-paper">
        <Navbar />
        <main className="max-w-3xl mx-auto px-5 sm:px-8 py-14">
          {loading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-10 w-2/3 bg-line" />
              <div className="h-4 w-1/3 bg-line" />
              <div className="h-32 w-full bg-line mt-8" />
            </div>
          ) : error ? (
            <p className="text-accent">— {error}</p>
          ) : (
            <>
              <BookInfo book={book} onReviewClick={handleReviewClick} />
              <ReviewList reviews={reviews} />
            </>
          )}
        </main>

        {/* ponytail: native <dialog>-style overlay, no framer-motion. */}
        {isReviewFormOpen && token && (
          <div
            className="fixed inset-0 z-50 bg-ink/40 flex items-start sm:items-center justify-center p-4 sm:p-6 overflow-auto"
            onClick={() => setIsReviewFormOpen(false)}
          >
            <div
              className="bg-paper border border-line w-full max-w-lg p-7 sm:p-9 mt-10 sm:mt-0"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-baseline justify-between mb-6">
                <h2 className="font-serif text-2xl text-ink">Write a review</h2>
                <button onClick={() => setIsReviewFormOpen(false)} className="text-muted hover:text-ink text-xl leading-none" aria-label="Close">✕</button>
              </div>
              <ReviewForm onSubmit={handleReviewSubmit} onCancel={() => setIsReviewFormOpen(false)} />
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default BookDetail;
