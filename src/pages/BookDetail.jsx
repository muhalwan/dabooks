import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
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
  const { token } = useAuth();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [bookData, reviewsData] = await Promise.all([
        api.books.getById(id, token),
        api.books.getReviews(id, token)
      ]);
      setBook(bookData);
      setReviews(reviewsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id, token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleReviewSubmit = async (reviewData) => {
    try {
      await api.books.addReview(id, reviewData, token);
      setIsReviewFormOpen(false);
      await fetchData();
    } catch (err) {
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
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <p className="text-red-600 dark:text-red-400 text-center">{error}</p>
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
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <p className="text-gray-500 dark:text-gray-400 text-center">Book not found</p>
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
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <BookInfo book={book} onReviewClick={() => setIsReviewFormOpen(true)} />
          <ReviewList reviews={reviews} />

          <AnimatePresence>
            {isReviewFormOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full m-4"
                  onClick={e => e.stopPropagation()}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Write a Review</h2>
                    <button
                      onClick={() => setIsReviewFormOpen(false)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      ✕
                    </button>
                  </div>
                  <ReviewForm
                    onSubmit={handleReviewSubmit}
                    onCancel={() => setIsReviewFormOpen(false)}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </PageTransition>
  );
};

export default BookDetail;