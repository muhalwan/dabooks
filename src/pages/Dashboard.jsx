import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useDarkMode } from '../context/DarkModeContext';
import Navbar from '../components/shared/Navbar';
import BookCard from '../components/book/BookCard';
import PageTransition from '../components/shared/PageTransition';
import { motion } from 'framer-motion';
import { api } from '../utils/api';

const SortButton = ({ label, active, order, onClick }) => (
    <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={`px-4 py-2.5 rounded-xl text-sm font-medium
                transition-all duration-200
                ${active
            ? 'bg-indigo-500 text-white dark:bg-indigo-600'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
        }`}
    >
      {label}
      {active && (
          <span className="ml-1">
        {order === 'asc' ? '↑' : '↓'}
      </span>
      )}
    </motion.button>
);

const Dashboard = () => {
  const { isDark } = useDarkMode();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [sortBy, setSortBy] = useState('title');
  const [sortOrder, setSortOrder] = useState('asc');
  const { token } = useAuth();


  const fetchBooks = useCallback(async (query = '') => {
    try {
      setIsSearching(true);
      const response = await api.books.getAll(token, query, sortBy, sortOrder);
      setBooks(response.data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  }, [token, sortBy, sortOrder]);

  const handleSortChange = (newSort) => {
    if (newSort === sortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSort);
      setSortOrder('asc');
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchBooks(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, fetchBooks]);

  if (loading && !isSearching) {
    return (
        <PageTransition>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-64 bg-white dark:bg-gray-800 rounded-2xl animate-pulse shadow-sm" />
                ))}
              </div>
            </div>
          </div>
        </PageTransition>
    );
  }

  return (
      <PageTransition>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
          <Navbar />

          {/* Hero Section */}
          <div className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900
                      border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                {/* Title */}
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl font-light text-gray-900 dark:text-white"
                >
                  Your reading <span className="font-semibold text-indigo-600 dark:text-indigo-400">collection</span>
                </motion.h1>

                {/* Search and Sort */}
                <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
                  {/* Search */}
                  <div className="w-full md:w-64 relative">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search books..."
                        className="w-full px-4 py-2.5 rounded-xl
                             bg-white dark:bg-gray-800
                             border border-gray-200 dark:border-gray-700
                             text-gray-900 dark:text-white
                             placeholder-gray-500 dark:placeholder-gray-400
                             focus:outline-none focus:ring-2 focus:ring-indigo-500/50
                             focus:border-indigo-500
                             shadow-sm
                             transition-colors duration-200"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {isSearching ? (
                          <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                      ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                      )}
                    </div>
                  </div>

                  {/* Sort Buttons */}
                  <div className="flex gap-2">
                    <SortButton
                        label="Title"
                        active={sortBy === 'title'}
                        order={sortOrder}
                        onClick={() => handleSortChange('title')}
                    />
                    <SortButton
                        label="Rating"
                        active={sortBy === 'rating'}
                        order={sortOrder}
                        onClick={() => handleSortChange('rating')}
                    />
                    <SortButton
                        label="Popularity"
                        active={sortBy === 'popularity'}
                        order={sortOrder}
                        onClick={() => handleSortChange('popularity')}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {error ? (
                <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700
                          rounded-2xl p-4 transition-colors duration-200">
                  <p className="text-red-600 dark:text-red-400">{error}</p>
                </div>
            ) : books.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl
                        border border-gray-200 dark:border-gray-700
                        shadow-sm transition-colors duration-200"
                >
                  <p className="text-gray-600 dark:text-gray-400">
                    {searchQuery
                        ? 'No books found matching your search'
                        : 'No books available'}
                  </p>
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                  {books.map((book, index) => (
                      <motion.div
                          key={book._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                      >
                        <BookCard book={book} />
                      </motion.div>
                  ))}
                </motion.div>
            )}
          </main>
        </div>
      </PageTransition>
  );
};

export default Dashboard;