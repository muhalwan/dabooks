import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const UserSearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const wrapperRef = useRef(null);
  const { token } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchUsers = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      try {
        setIsSearching(true);
        const response = await api.users.search(query, token);
        setResults(response.data);
        setIsOpen(true);
      } catch (err) {
        console.error('Error searching users:', err);
      } finally {
        setIsSearching(false);
      }
    };

    const timeoutId = setTimeout(() => {
      searchUsers();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, token]);

  return (
    <div className="relative w-64" ref={wrapperRef}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search users..."
          className="w-full px-4 py-2 rounded-lg border border-gray-300
                   dark:border-gray-600 bg-white dark:bg-gray-700
                   text-gray-900 dark:text-white focus:outline-none
                   focus:ring-2 focus:ring-indigo-500 transition-colors"
        />
        {isSearching && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full"
            />
          </div>
        )}
      </div>

      <AnimatePresence>
        {isOpen && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 rounded-lg
                     shadow-lg border border-gray-200 dark:border-gray-700 max-h-96 overflow-auto"
          >
            {results.map((user) => (
              <motion.div
                key={user._id}
                whileHover={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
                onClick={() => {
                  navigate(`/user/${user._id}`);
                  setIsOpen(false);
                  setQuery('');
                }}
                className="px-4 py-3 cursor-pointer first:rounded-t-lg last:rounded-b-lg
                         dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-indigo-100 dark:bg-indigo-900 rounded-full p-2 w-8 h-8 flex items-center justify-center">
                    <span className="text-indigo-600 dark:text-indigo-400 text-sm font-medium">
                      {user.username[0].toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {user.username}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {user.reviews_count || 0} reviews
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserSearchBar;