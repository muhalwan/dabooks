import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/shared/Navbar';
import BookCard from '../components/book/BookCard';
import PageTransition from '../components/shared/PageTransition';
import { motion } from 'framer-motion';
import { api } from '../utils/api';

const SortButton = ({ label, active, order, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
                ${active 
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
  >
    {label}
    {active && <span className="ml-1">{order === 'asc' ? '↑' : '↓'}</span>}
  </motion.button>
);

const Dashboard = () => {
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
            <div className="animate-pulse space-y-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            {/* Title */}
            <h1 className="text-3xl font-light text-gray-900 dark:text-white">
              Your reading <span className="font-medium">collection</span>
            </h1>

            {/* Search and Sort */}
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="w-64">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search books..."
                  className="w-full px-4 py-2 rounded-lg border border-gray-300
                           dark:border-gray-600 bg-white dark:bg-gray-700
                           text-gray-900 dark:text-white focus:outline-none
                           focus:ring-2 focus:ring-indigo-500"
                />
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

          {/* Books Grid */}
          {error ? (
            <div className="bg-red-100 dark:bg-red-900 p-4 rounded-lg">
              <p className="text-red-700 dark:text-red-100">{error}</p>
            </div>
          ) : books.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                {searchQuery
                  ? 'No books found matching your search'
                  : 'No books available'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {books.map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default Dashboard;