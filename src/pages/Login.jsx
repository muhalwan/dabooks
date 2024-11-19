import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import config from '../config';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${config.API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.access_token, data.username);
        navigate('/');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error occurred');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center bg-gray-50 dark:bg-gray-900 py-12 sm:px-6 lg:px-8 transition-colors duration-200">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sm:mx-auto sm:w-full sm:max-w-md"
      >
        <h2 className="text-center text-3xl font-light text-gray-900 dark:text-white">
          Welcome to <span className="font-medium">dabooks</span>
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="rounded-md bg-red-50 dark:bg-red-900/50 p-4"
              >
                <div className="text-sm text-red-700 dark:text-red-200">{error}</div>
              </motion.div>
            )}

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Username
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300
                           dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400
                           dark:placeholder-gray-500 focus:outline-none focus:ring-indigo-500
                           focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400
                           sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           transition-colors duration-200"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300
                           dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400
                           dark:placeholder-gray-500 focus:outline-none focus:ring-indigo-500
                           focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400
                           sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           transition-colors duration-200"
                />
              </div>
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md
                         shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700
                         dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2
                         focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900
                         transition-colors duration-200"
              >
                Sign in
              </button>
            </motion.div>
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6"
          >
            <div className="relative">
              <div className="relative flex justify-center text-sm">
                <Link
                  to="/register"
                  className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500
                           dark:hover:text-indigo-300 transition-colors duration-200"
                >
                  Don't have an account? Register
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;