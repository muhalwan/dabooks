import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import ReviewForm from '../components/ReviewForm';
import PageTransition from '../components/PageTransition';
import config from '../config';

const BookDetail = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch book details
        const bookResponse = await fetch(`${config.API_URL}/books/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!bookResponse.ok) {
          throw new Error('Failed to fetch book details');
        }

        const bookData = await bookResponse.json();
        setBook(bookData);

        // Fetch reviews
        const reviewsResponse = await fetch(`${config.API_URL}/books/${id}/reviews`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!reviewsResponse.ok) {
          throw new Error('Failed to fetch reviews');
        }

        const reviewsData = await reviewsResponse.json();
        setReviews(reviewsData);
        setError(null);
      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, token]);

  const handleReviewSubmit = async (bookId, reviewData) => {
    try {
      const response = await fetch(`${config.API_URL}/books/${bookId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(reviewData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit review');
      }

      setIsReviewFormOpen(false);

      // Fetch updated reviews
      const updatedReviewsResponse = await fetch(`${config.API_URL}/books/${id}/reviews`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const updatedReviews = await updatedReviewsResponse.json();
      setReviews(updatedReviews);
    } catch (err) {
      setError('Error submitting review');
    }
  };

  const darkClass = "bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white";

  if (loading) {
    return (
      <PageTransition>
        <div className={`min-h-screen ${darkClass}`}>
          <Navbar />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="animate-pulse space-y-8">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="space-y-4">
                <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
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
        <div className={`min-h-screen ${darkClass}`}>
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
        <div className={`min-h-screen ${darkClass}`}>
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
      <div className={`min-h-screen ${darkClass}`}>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
            <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
            <p className="text-xl italic mb-4">{book.author}</p>
            <div className="flex items-center mb-6">
              <div className="flex text-yellow-400">
                {'★'.repeat(Math.round(book.average_rating || 0))}
                <span className="text-gray-300 dark:text-gray-600">
                  {'★'.repeat(5 - Math.round(book.average_rating || 0))}
                </span>
              </div>
              <span className="ml-2 text-gray-600 dark:text-gray-400">
                ({book.total_ratings || 0} {book.total_ratings === 1 ? 'review' : 'reviews'})
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{book.description}</p>

            <button
              onClick={() => setIsReviewFormOpen(true)}
              className="py-2 px-4 rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Write a Review
            </button>
          </div>

          {isReviewFormOpen && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full m-4">
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
                  bookId={id}
                  onSubmit={handleReviewSubmit}
                  onCancel={() => setIsReviewFormOpen(false)}
                />
              </div>
            </div>
          )}

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Reviews</h2>
            {reviews.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">No reviews yet</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600 dark:text-gray-400">{review.user}</span>
                      <div className="flex items-center">
                        <span className="text-yellow-400">{'★'.repeat(review.rating)}</span>
                        <span className="text-gray-300 dark:text-gray-600">
                          {'★'.repeat(5 - review.rating)}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-400">{review.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default BookDetail;
