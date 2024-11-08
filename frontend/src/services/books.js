const API_URL = 'http://localhost:5000';

export const getBooks = async (token) => {
  const response = await fetch(`${API_URL}/books`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch books');
  }

  return response.json();
};

export const addReview = async (bookId, reviewData, token) => {
  const response = await fetch(`${API_URL}/books/${bookId}/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(reviewData),
  });

  if (!response.ok) {
    throw new Error('Failed to add review');
  }

  return response.json();
};

export const getBookReviews = async (bookId) => {
  const response = await fetch(`${API_URL}/books/${bookId}/reviews`);

  if (!response.ok) {
    throw new Error('Failed to fetch reviews');
  }

  return response.json();
};