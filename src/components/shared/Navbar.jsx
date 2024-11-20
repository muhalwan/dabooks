import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useDarkMode } from '../../context/DarkModeContext';
import { motion } from 'framer-motion';
import UserSearchBar from '../user/UserSearchBar';

const Navbar = () => {
  const navigate = useNavigate();
  const { username, logout } = useAuth();
  const { isDark, toggleDarkMode } = useDarkMode();
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Navbar */}
        <div className="flex justify-between h-16">
          <motion.div
            className="flex items-center cursor-pointer"
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate('/')}
          >
            <span className="text-2xl font-light text-gray-900 dark:text-white">
              da<span className="font-medium">books</span>
            </span>
          </motion.div>

          <div className="flex items-center">
            {/* Search bar - hidden on mobile, visible on larger screens */}
            <div className="hidden md:block md:mr-4">
              <UserSearchBar />
            </div>

            {/* Search toggle for mobile */}
            <button
              className="md:hidden p-2 rounded-lg text-gray-500 hover:text-gray-700
                       dark:text-gray-400 dark:hover:text-gray-300"
              onClick={() => setIsSearchVisible(!isSearchVisible)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 ml-2"
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

            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate('/profile')}
              className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900
                       dark:hover:text-white ml-2 hidden sm:block"
            >
              {username}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={logout}
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700
                       dark:hover:text-gray-300 px-3 py-2 rounded-md ml-2"
            >
              Sign out
            </motion.button>
          </div>
        </div>

        {/* Mobile search bar */}
        {isSearchVisible && (
          <div className="md:hidden pb-4">
            <UserSearchBar />
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;