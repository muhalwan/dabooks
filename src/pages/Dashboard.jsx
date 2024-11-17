import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import BookCard from '../components/BookCard';
import Navbar from '../components/Navbar';
import config from '../config';

const Dashboard = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch(`${config.API_URL}/books`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch books');
      }

      const data = await response.json();
      setBooks(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching books:', err);
      setError('Error loading books');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-light text-gray-900">
            Your reading <span className="font-medium">collection</span>
          </h1>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse text-gray-400">Loading books...</div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-red-500">{error}</div>
          </div>
        ) : books.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-400">No books available</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;