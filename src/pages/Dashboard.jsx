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

     if (!response.ok) throw new Error('Failed to fetch books');

     const data = await response.json();
     setBooks(data);
     setError(null);
   } catch (err) {
     console.error('Error:', err);
     setError('Error loading books');
   } finally {
     setLoading(false);
   }
 };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-light text-gray-900">
            Your reading <span className="font-medium">collection</span>
          </h1>
        </div>

        {error ? (
          <div className="text-red-500 text-center p-4 bg-white rounded-lg shadow">
            {error}
          </div>
        ) : loading ? (
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
          <div className="text-gray-500 text-center p-8 bg-white rounded-lg shadow">
            No books available
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