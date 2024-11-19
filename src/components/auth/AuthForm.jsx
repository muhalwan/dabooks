import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const AuthForm = ({
  type,
  formData,
  onInputChange,
  onSubmit,
  error,
  isLoading
}) => {
  const isLogin = type === 'login';
  const fields = isLogin ? [
    { name: 'username', type: 'text', label: 'Username' },
    { name: 'password', type: 'password', label: 'Password' }
  ] : [
    { name: 'username', type: 'text', label: 'Username' },
    { name: 'email', type: 'email', label: 'Email' },
    { name: 'password', type: 'password', label: 'Password' }
  ];

  return (
    <div className="min-h-screen flex flex-col justify-center bg-gray-50 dark:bg-gray-900 py-12 sm:px-6 lg:px-8 transition-colors duration-200">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sm:mx-auto sm:w-full sm:max-w-md"
      >
        <h2 className="text-center text-3xl font-light text-gray-900 dark:text-white">
          {isLogin ? 'Welcome to ' : 'Create your '}<span className="font-medium">dabooks</span>
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={onSubmit}>
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

            {fields.map(({ name, type, label }) => (
              <div key={name}>
                <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {label}
                </label>
                <div className="mt-1">
                  <input
                    id={name}
                    name={name}
                    type={type}
                    required
                    value={formData[name]}
                    onChange={onInputChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300
                             dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400
                             dark:placeholder-gray-500 focus:outline-none focus:ring-indigo-500
                             focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400
                             sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                             transition-colors duration-200"
                  />
                </div>
              </div>
            ))}

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md
                         shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700
                         dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2
                         focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900
                         transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  isLogin ? 'Sign in' : 'Register'
                )}
              </button>
            </motion.div>
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6"
          >
            <div className="relative flex justify-center text-sm">
              <Link
                to={isLogin ? '/register' : '/login'}
                className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500
                         dark:hover:text-indigo-300 transition-colors duration-200"
              >
                {isLogin ? "Don't have an account? Register" : 'Already have an account? Sign in'}
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthForm;