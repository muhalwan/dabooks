import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BookDetail from './pages/BookDetail';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AnimatePresence } from 'framer-motion';
import { DarkModeProvider } from './context/DarkModeContext';


const PrivateRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
};


const App = () => {
  return (
    <Router>
      <DarkModeProvider>
        <AuthProvider>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/book/:id"
              element={
                <PrivateRoute>
                  <BookDetail />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </AuthProvider>
      </DarkModeProvider>
    </Router>
  );
};

export default App;