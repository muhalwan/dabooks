import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import BookCard from '../components/BookCard';
import config from '../config';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition';

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
      // If clicking the same sort option, toggle order
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // If clicking a different sort option, set it with default ascending order
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
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8"
          >
            {/* ... header content ... */}
          </motion.div>

          <AnimatePresence mode="wait">
            {error ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white rounded-lg shadow p-4"
              >
                <p className="text-red-600 text-center">{error}</p>
              </motion.div>
            ) : loading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {/* ... loading skeletons ... */}
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