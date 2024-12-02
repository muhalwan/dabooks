import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useDarkMode } from '../../context/DarkModeContext';
import { motion } from 'framer-motion';
import UserSearchBar from '../user/UserSearchBar';

const Navbar = () => {
  const navigate = useNavigate();
  const { username, logout, token } = useAuth();
  const { isDark, toggleDarkMode } = useDarkMode();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
      <nav className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <motion.div
                className="flex items-center cursor-pointer"
                whileHover={{ scale: 1.05 }}
                onClick={() => navigate('/')}
            >
            <span className="text-2xl font-light text-gray-900 dark:text-white">
              da<span className="font-medium">books</span>
            </span>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {token && (
                  <div className="md:mr-4">
                    <UserSearchBar />
                  </div>
              )}
              <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleDarkMode}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700"
              >
                {isDark ? (
                    <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                ) : (
                    <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                )}
              </motion.button>
              {token ? (
                  <>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={() => navigate('/profile')}
                        className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                    >
                      {username}
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={logout}
                        className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700
                           dark:hover:text-gray-300 px-3 py-2 rounded-md"
                    >
                      Sign out
                    </motion.button>
                  </>
              ) : (
                  <>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/login')}
                        className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700
                           dark:hover:text-gray-300 px-3 py-2 rounded-md"
                    >
                      Sign in
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/register')}
                        className="text-sm text-white bg-indigo-600 hover:bg-indigo-700
                           px-3 py-2 rounded-md"
                    >
                      Register
                    </motion.button>
                  </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleDarkMode}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 mr-2"
              >
                {isDark ? (
                    <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                ) : (
                    <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                )}
              </motion.button>
              <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 rounded-lg text-gray-500 dark:text-gray-400"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMenuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
              <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="md:hidden pb-4"
              >
                <div className="pt-2 pb-3 space-y-1">
                  {token ? (
                      <>
                        <div className="mb-4">
                          <UserSearchBar />
                        </div>
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              navigate('/profile');
                              setIsMenuOpen(false);
                            }}
                            className="block w-full text-left px-4 py-2 text-base text-gray-600
                             dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          Profile ({username})
                        </motion.button>
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              logout();
                              setIsMenuOpen(false);
                            }}
                            className="block w-full text-left px-4 py-2 text-base text-gray-500
                             dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          Sign out
                        </motion.button>
                      </>
                  ) : (
                      <>
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              navigate('/login');
                              setIsMenuOpen(false);
                            }}
                            className="block w-full text-left px-4 py-2 text-base text-gray-500
                             dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          Sign in
                        </motion.button>
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              navigate('/register');
                              setIsMenuOpen(false);
                            }}
                            className="block w-full text-left px-4 py-2 text-base text-white bg-indigo-600
                             hover:bg-indigo-700"
                        >
                          Register
                        </motion.button>
                      </>
                  )}
                </div>
              </motion.div>
          )}
        </div>
      </nav>
  );
};

export default Navbar;