import config from '../config';

const createHeaders = (token) => ({
  'Content-Type': 'application/json',
  ...(token && { 'Authorization': `Bearer ${token}` })
});

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'API request failed');
  }
  return response.json();
};

export const api = {
  auth: {
    login: async (credentials) => {
      const response = await fetch(`${config.API_URL}/auth/login`, {
        method: 'POST',
        headers: createHeaders(),
        body: JSON.stringify(credentials),
      });
      return handleResponse(response);
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
    getAll: async (token, searchQuery = '', sortBy = 'title', sortOrder = 'asc') => {
      const query = new URLSearchParams({
        search: searchQuery,
        sort: sortBy,
        order: sortOrder
      }).toString();

      const response = await fetch(`${config.API_URL}/books?${query}`, {
        headers: createHeaders(token),
      });
      return handleResponse(response);
    },

    getById: async (id, token) => {
      const response = await fetch(`${config.API_URL}/books/${id}`, {
        headers: createHeaders(token),
      });
      return handleResponse(response);
    },

    getReviews: async (bookId, token) => {
      const response = await fetch(`${config.API_URL}/books/${bookId}/reviews`, {
        headers: createHeaders(token),
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
        headers: createHeaders(token),
      });
      return handleResponse(response);
    },

    getReviews: async (token) => {
      const response = await fetch(`${config.API_URL}/users/reviews`, {
        headers: createHeaders(token),
      });
      return handleResponse(response);
    },
  },
};