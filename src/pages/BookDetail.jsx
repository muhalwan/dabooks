import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
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

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        navigate('/');
        return;
      }

      try {
        setLoading(true);
        const [bookData, reviewsData] = await Promise.all([
          api.books.getById(id, token),
          api.books.getReviews(id, token)
        ]);

        console.log('Book data:', bookData); // Debug log
        console.log('Reviews data:', reviewsData); // Debug log

        setBook(bookData.data);
        setReviews(reviewsData.data);
      } catch (err) {
        console.error('Error fetching book data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, token, navigate]);

  const handleReviewSubmit = async (reviewData) => {
    try {
      await api.books.addReview(id, reviewData, token);
      const newReviews = await api.books.getReviews(id, token);
      setReviews(newReviews.data);
      setIsReviewFormOpen(false);
    } catch (err) {
      console.error('Error submitting review:', err);
      setError('Failed to submit review');
    }
  };

  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <Navbar />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="animate-pulse space-y-8">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded" />
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

  if (!book) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <Navbar />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center text-gray-500 dark:text-gray-400">
              Book not found
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
          <BookInfo book={book} onReviewClick={() => setIsReviewFormOpen(true)} />
          <ReviewList reviews={reviews} />

          <AnimatePresence>
            {isReviewFormOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4"
                >
                  <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                    Write a Review
                  </h2>
                  <ReviewForm
                    onSubmit={handleReviewSubmit}
                    onCancel={() => setIsReviewFormOpen(false)}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageTransition>
  );
};

export default BookDetail;