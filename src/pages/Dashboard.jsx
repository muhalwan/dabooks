import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/shared/Navbar';
import BookCard from '../components/book/BookCard';
import PageTransition from '../components/shared/PageTransition';
import { api } from '../utils/api';

const Dashboard = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [sortBy, setSortBy] = useState('title');
  const [sortOrder, setSortOrder] = useState('asc');
  const { token } = useAuth();

  const fetchBooks = useCallback(async () => {
    try {
      setIsSearching(true);
      const data = await api.books.getAll(token, searchQuery, sortBy, sortOrder);
      setBooks(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch books');
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  }, [token, searchQuery, sortBy, sortOrder]);

  useEffect(() => {
    const timeoutId = setTimeout(fetchBooks, 300);
    return () => clearTimeout(timeoutId);
  }, [fetchBooks]);

  const handleSort = (value) => {
    if (value === sortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(value);
      setSortOrder('asc');
    }
  };

  const renderContent = () => {
    if (error) {
      return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
          <p className="text-red-600 dark:text-red-400 text-center">{error}</p>
        </div>
      );
    }

    if (loading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-8" />
              <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          ))}
        </div>
      );
    }

    if (books.length === 0) {
      return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
          <p className="text-gray-500 dark:text-gray-400 text-center">
            {searchQuery ? 'No books found matching your search' : 'No books available'}
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    );
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 space-y-4 sm:space-y-0">
            <h1 className="text-3xl font-light text-gray-900 dark:text-white">
              Your reading <span className="font-medium">collection</span>
            </h1>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              {/* Search Input */}
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search books..."
                  className="w-full sm:w-64 px-4 py-2 rounded-lg border border-gray-300
                           dark:border-gray-600 bg-white dark:bg-gray-700
                           text-gray-900 dark:text-white"
                />
                {isSearching && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-500" />
                  </div>
                )}
              </div>
              {/* Sort Buttons */}
              <div className="flex space-x-2">
                {['title', 'rating', 'popularity'].map((option) => (
                  <motion.button
                    key={option}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSort(option)}
                    className={`px-3 py-2 rounded-md text-sm font-medium
                              ${sortBy === option
                                ? 'bg-indigo-600 text-white'
                                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                              }`}
                  >
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                    {sortBy === option && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* Content Section */}
          <AnimatePresence mode="wait">
            {renderContent()}
          </AnimatePresence>
        </div>
      </div>
    </PageTransition>
  );
};

export default Dashboard;