import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DarkModeProvider } from './context/DarkModeContext';
import { ROUTES } from './utils/constants';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BookDetail from './pages/BookDetail.jsx';
import PrivateRoute from './components/PrivateRoute';
import Profile from "./pages/Profile.jsx";
import UserProfile from "./pages/UserProfile.jsx";

const App = () => {
  return (
    <Router>
      <DarkModeProvider>
        <AuthProvider>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <Routes>
              <Route path={ROUTES.LOGIN} element={<Login />} />
              <Route path={ROUTES.REGISTER} element={<Register />} />
              <Route
                path={ROUTES.HOME}
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path={ROUTES.BOOK_DETAIL}
                element={
                  <PrivateRoute>
                    <BookDetail />
                  </PrivateRoute>
                }
              />
              <Route
                path={ROUTES.PROFILE}
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />
              <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
              <Route
                  path="/user/:id"
                  element={
                    <PrivateRoute>
                      <UserProfile />
                    </PrivateRoute>
                  }
              />
            </Routes>
          </div>
        </AuthProvider>
      </DarkModeProvider>
    </Router>
  );
};

export default App;