const config = {
  production: {
    API_URL: 'https://active-konstance-muhalwan-1333f850.koyeb.app'
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
