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
    getAll: async (token, searchQuery = '', sortBy = 'title', sortOrder = 'asc', page = 1, perPage = 30) => {
      const params = new URLSearchParams({
        ...(searchQuery && { search: searchQuery }),
        sort: sortBy,
        order: sortOrder,
        page: page,
        per_page: perPage
      });

      const response = await fetch(`${config.API_URL}/books?${params}`, {
        headers: createHeaders(token)
      });
      return handleResponse(response);
    },
    getById: async (id, token) => {
      const response = await fetch(`${config.API_URL}/books/${id}`, {
        headers: createHeaders(token)
      });
      return handleResponse(response);
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
    search: async (query, token) => {
      const response = await fetch(`${config.API_URL}/users/search?q=${encodeURIComponent(query)}`, {
        headers: createHeaders(token)
      });
      return handleResponse(response);
    },
    getPublicProfile: async (userId, token) => {
      const response = await fetch(`${config.API_URL}/users/${userId}`, {
        headers: createHeaders(token)
      });
      return handleResponse(response);
    },
    getProfile: async (token) => {
      const response = await fetch(`${config.API_URL}/users/profile`, {
        headers: createHeaders(token)
      });
      return handleResponse(response);
    }
  }
};