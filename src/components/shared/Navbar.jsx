import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useDarkMode } from '../../context/DarkModeContext';
import { motion } from 'framer-motion';

const Navbar = () => {
  const navigate = useNavigate();
  const { username, logout } = useAuth();
  const { isDark, toggleDarkMode } = useDarkMode();

  return (
    <nav className="bg-white dark:bg-gray-800 shadow transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <motion.span
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate('/')}
              className="text-2xl cursor-pointer font-light tracking-tight text-gray-900 dark:text-white"
            >
              da<span className="font-medium">books</span>
            </motion.span>
          </div>
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
              aria-label="Toggle dark mode"
            >
              {isDark ? <SunIcon /> : <MoonIcon />}
            </motion.button>
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
              className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700
                       dark:hover:text-gray-300 transition-colors duration-200 px-3 py-2 rounded-md"
            >
              Sign out
            </motion.button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;