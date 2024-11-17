import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MainLayout from '../layouts/MainLayout';
import ReviewForm from '../components/ReviewForm';
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
            'Accept': 'application/json'
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
            'Accept': 'application/json'
          },
        });

        if (!reviewsResponse.ok) {
          throw new Error('Failed to fetch reviews');
        }

        const reviewsData = await reviewsResponse.json();
        setReviews(reviewsData);
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
          'Accept': 'application/json'
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
          'Accept': 'application/json'
        },
      });
      const updatedReviews = await updatedReviewsResponse.json();
      setReviews(updatedReviews);
    } catch (err) {
      console.error('Error submitting review:', err);
      setError('Error submitting review');
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse text-gray-400">Loading...</div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="text-red-500 text-center">{error}</div>
      </MainLayout>
    );
  }

  if (!book) {
    return (
      <MainLayout>
        <div className="text-gray-500 text-center">Book not found</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>
          <p className="text-xl text-gray-600 italic mb-4">{book.author}</p>
          <p className="text-gray-600 mb-6">{book.description}</p>
          
          <button
            onClick={() => setIsReviewFormOpen(true)}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Write a Review
          </button>
        </div>

        {isReviewFormOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">Write a Review</h2>
              <ReviewForm
                bookId={id}
                onSubmit={handleReviewSubmit}
                onCancel={() => setIsReviewFormOpen(false)}
              />
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4">Reviews</h2>
          {reviews.length === 0 ? (
            <p className="text-gray-500">No reviews yet</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="border-b pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">{review.user}</span>
                    <div className="flex items-center">
                      <span className="text-yellow-400">{'★'.repeat(review.rating)}</span>
                      <span className="text-gray-300">{'★'.repeat(5 - review.rating)}</span>
                    </div>
                  </div>
                  <p className="text-gray-700">{review.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default BookDetail;