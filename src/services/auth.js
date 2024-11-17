// services/auth.js or similar
import config from '../config';

export const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${config.API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    return response.json();
  } catch (err) {
    console.error('Login error:', err); // Add this for debugging
    throw err;
  }
};