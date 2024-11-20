import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/shared/Navbar';
import SearchBar from '../components/shared/SearchBar';
import SortButtons from '../components/shared/SortButtons.jsx';
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

  // Handle sort change
  const handleSortChange = (newSort) => {
    if (newSort === sortBy) {
      // Toggle order if clicking same sort
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // New sort, default to ascending
      setSortBy(newSort);
      setSortOrder('asc');
    }
  };

  // Debounce search
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
          <div className="flex flex-col space-y-4 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between sm:space-y-0">
              <h1 className="text-3xl font-light text-gray-900 dark:text-white">
                Your reading <span className="font-medium">collection</span>
              </h1>
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                isSearching={isSearching}
              />
            </div>
            <div className="flex justify-end">
              <SortButtons
                activeSort={sortBy}
                activeOrder={sortOrder}
                onSortChange={handleSortChange}
              />
            </div>
          </div>

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