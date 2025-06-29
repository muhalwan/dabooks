const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default {
  API_URL: API_URL,
  API_TIMEOUT: 15000,
  defaultHeaders: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

const currentConfig = process.env.NODE_ENV === 'production' ? config.production : config.development;

export default {
  ...currentConfig,
  API_TIMEOUT: 15000,
  defaultHeaders: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};
