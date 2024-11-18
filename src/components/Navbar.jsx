import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { username, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span
              onClick={() => navigate('/')}
              className="text-2xl font-light tracking-tight text-gray-900 cursor-pointer hover:text-gray-700 transition-colors duration-200"
            >
              da<span className="font-medium">books</span>
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {username}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors duration-200 px-3 py-2 rounded-md hover:bg-gray-50"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;