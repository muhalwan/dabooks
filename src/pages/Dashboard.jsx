// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import BookCard from '../components/BookCard';
import PageTransition from '../components/PageTransition';
import config from '../config';

const Dashboard = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [sortBy, setSortBy] = useState('title');
  const [sortOrder, setSortOrder] = useState('asc');
  const { token } = useAuth();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchBooks(searchQuery);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, sortBy, sortOrder]);

  const fetchBooks = async (query = '') => {
    try {
      setIsSearching(true);
      const response = await fetch(
        `${config.API_URL}/books?search=${encodeURIComponent(query)}&sort=${sortBy}&order=${sortOrder}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch books');
      }

      const data = await response.json();
      setBooks(data);
      setError(null);
    } catch (err) {
      console.error('Error:', err);
      setError('Error loading books');
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  const handleSort = (value) => {
    if (value === sortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(value);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (value) => {
    if (value !== sortBy) return '↕';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 space-y-4 sm:space-y-0"
          >
            <h1 className="text-3xl font-light text-gray-900 dark:text-white">
              Your reading <span className="font-medium">collection</span>
            </h1>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search books..."
                  className="w-full sm:w-64 px-4 py-2 rounded-lg border border-gray-300
                           dark:border-gray-600 bg-white dark:bg-gray-700
                           text-gray-900 dark:text-white placeholder-gray-500
                           dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500
                           dark:focus:ring-indigo-400 focus:border-transparent
                           transition-colors duration-200"
                />
                {isSearching && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2
                                  border-indigo-500 dark:border-indigo-400"></div>
                  </div>
                )}
              </div>
              <div className="flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSort('title')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200
                    ${sortBy === 'title'
                      ? 'bg-indigo-600 dark:bg-indigo-500 text-white'
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                    } border border-gray-300 dark:border-gray-600`}
                >
                  Title {getSortIcon('title')}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSort('rating')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200
                    ${sortBy === 'rating'
                      ? 'bg-indigo-600 dark:bg-indigo-500 text-white'
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                    } border border-gray-300 dark:border-gray-600`}
                >
                  Rating {getSortIcon('rating')}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSort('popularity')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200
                    ${sortBy === 'popularity'
                      ? 'bg-indigo-600 dark:bg-indigo-500 text-white'
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                    } border border-gray-300 dark:border-gray-600`}
                >
                  Popularity {getSortIcon('popularity')}
                </motion.button>
              </div>
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {error ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-700 p-4"
              >
                <p className="text-red-600 dark:text-red-400 text-center">{error}</p>
              </motion.div>
            ) : loading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-700 p-6 animate-pulse">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-8"></div>
                    <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                ))}
              </motion.div>
            ) : books.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-700 p-8"
              >
                <p className="text-gray-500 dark:text-gray-400 text-center">
                  {searchQuery ? 'No books found matching your search' : 'No books available'}
                </p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {books.map((book, index) => (
                  <BookCard key={book.id} book={book} index={index} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageTransition>
  );
};

export default Dashboard;