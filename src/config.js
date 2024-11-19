const production = {
  API_URL: 'https://dabooks-api-c1dc5695b41d.herokuapp.com'
};

const development = {
  API_URL: 'http://localhost:5000'
};

export default process.env.NODE_ENV === 'production' ? production : development;