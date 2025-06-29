const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const config = {
  API_URL: API_URL,
  API_TIMEOUT: 15000,
  defaultHeaders: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

export default config;
