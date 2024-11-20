import config from '../config';

const createHeaders = (token) => ({
  'Content-Type': 'application/json',
  ...(token && { 'Authorization': `Bearer ${token}` })
});

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }
  return data;
};

export const api = {
  auth: {
    login: async (credentials) => {
      const response = await fetch(`${config.API_URL}/auth/login`, {
        method: 'POST',
        headers: createHeaders(),
        body: JSON.stringify(credentials),
      });
      const data = await handleResponse(response);
      if (!data.data?.access_token) {
        throw new Error('Invalid response format');
      }
      return data;
    },

    register: async (userData) => {
      const response = await fetch(`${config.API_URL}/auth/register`, {
        method: 'POST',
        headers: createHeaders(),
        body: JSON.stringify(userData),
      });
      return handleResponse(response);
    }
  },

books: {
  getAll: async (token) => {
    const response = await fetch(`${config.API_URL}/books`, {
      headers: createHeaders(token)
    });
    const data = await handleResponse(response);
    console.log('API response for books:', data); // Debug log
    return data;
  },

  getById: async (id, token) => {
    console.log('Fetching book with ID:', id); // Debug log
    const response = await fetch(`${config.API_URL}/books/${id}`, {
      headers: createHeaders(token)
    });
    const data = await handleResponse(response);
    console.log('API response for single book:', data); // Debug log
    return data;
  },

    getReviews: async (bookId, token) => {
      const response = await fetch(`${config.API_URL}/books/${bookId}/reviews`, {
        headers: createHeaders(token)
      });
      return handleResponse(response);
    },

    addReview: async (bookId, reviewData, token) => {
      const response = await fetch(`${config.API_URL}/books/${bookId}/reviews`, {
        method: 'POST',
        headers: createHeaders(token),
        body: JSON.stringify(reviewData),
      });
      return handleResponse(response);
    }
  },

  users: {
    getProfile: async (token) => {
      const response = await fetch(`${config.API_URL}/users/profile`, {
        headers: createHeaders(token)
      });
      return handleResponse(response);
    },

    getReviews: async (token) => {
      const response = await fetch(`${config.API_URL}/users/profile/reviews`, {
        headers: createHeaders(token)
      });
      return handleResponse(response);
    }
  }
};