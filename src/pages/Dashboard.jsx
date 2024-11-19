import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import BookCard from '../components/BookCard';
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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between mb-8">
          <h1 className="text-3xl font-light text-gray-900">
            Your reading <span className="font-medium">collection</span>
          </h1>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search books..."
                className="w-full sm:w-64 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-500"></div>
                </div>
              )}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleSort('title')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  sortBy === 'title'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                } border border-gray-300`}
              >
                Title {getSortIcon('title')}
              </button>
              <button
                onClick={() => handleSort('rating')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  sortBy === 'rating'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                } border border-gray-300`}
              >
                Rating {getSortIcon('rating')}
              </button>
              <button
                onClick={() => handleSort('popularity')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  sortBy === 'popularity'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                } border border-gray-300`}
              >
                Popularity {getSortIcon('popularity')}
              </button>
            </div>
          </div>
        </div>

        {/* Rest of the component remains the same */}
        {error ? (
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-red-600 text-center">{error}</p>
          </div>
        ) : loading && !isSearching ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : books.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8">
            <p className="text-gray-500 text-center">
              {searchQuery ? 'No books found matching your search' : 'No books available'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;