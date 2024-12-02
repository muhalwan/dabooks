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
    getAll: async (token = null, searchQuery = '', sortBy = 'title', sortOrder = 'asc') => {
      const query = new URLSearchParams({
        search: searchQuery,
        sort: sortBy,
        order: sortOrder
      }).toString();

      const response = await fetch(`${config.API_URL}/books?${query}`);
      return handleResponse(response);
    },

    getById: async (id, token = null) => {
      const response = await fetch(`${config.API_URL}/books/${id}`);
      return handleResponse(response);
    },

    getReviews: async (bookId, token = null) => {
      const response = await fetch(`${config.API_URL}/books/${bookId}/reviews`);
      return handleResponse(response);
    },

    addReview: async (bookId, reviewData, token) => {
      if (!token) throw new Error('Authentication required');

      const response = await fetch(`${config.API_URL}/books/${bookId}/reviews`, {
        method: 'POST',
        headers: createHeaders(token),
        body: JSON.stringify(reviewData),
      });
      return handleResponse(response);
    }
  },

  users: {
    search: async (query, token) => {
      if (!token) throw new Error('Authentication required');

      const response = await fetch(`${config.API_URL}/users/search?q=${encodeURIComponent(query)}`, {
        headers: createHeaders(token)
      });
      return handleResponse(response);
    },
    getPublicProfile: async (userId, token) => {
      if (!token) throw new Error('Authentication required');

      const response = await fetch(`${config.API_URL}/users/${userId}`, {
        headers: createHeaders(token)
      });
      return handleResponse(response);
    },
    getProfile: async (token) => {
      if (!token) throw new Error('Authentication required');

      const response = await fetch(`${config.API_URL}/users/profile`, {
        headers: createHeaders(token)
      });
      return handleResponse(response);
    }
  }
};