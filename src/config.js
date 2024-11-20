const config = {
  production: {
    API_URL: 'https://dabooks-api-c1dc5695b41d.herokuapp.com'
  },
  development: {
    API_URL: 'http://localhost:5000'
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