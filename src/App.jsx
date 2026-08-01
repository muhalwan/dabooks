import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DarkModeProvider } from './context/DarkModeContext';
import { ROUTES } from './utils/constants';
import PrivateRoute from './components/PrivateRoute';

// ponytail: route-level code splitting. Each page becomes its own chunk so the
// initial bundle = just Dashboard. Wraps every route in a single Suspense
// fallback instead of one per route.
const Login      = lazy(() => import('./pages/Login'));
const Register   = lazy(() => import('./pages/Register'));
const Dashboard  = lazy(() => import('./pages/Dashboard'));
const BookDetail = lazy(() => import('./pages/BookDetail'));
const Profile    = lazy(() => import('./pages/Profile'));
const UserProfile = lazy(() => import('./pages/UserProfile'));

const Fallback = () => (
  <div className="min-h-screen bg-paper flex items-center justify-center">
    <div className="w-5 h-5 border border-line border-t-accent rounded-full animate-spin" />
  </div>
);

const App = () => (
  <Router>
    <DarkModeProvider>
      <AuthProvider>
        <div className="min-h-screen bg-paper transition-colors duration-200">
          <Suspense fallback={<Fallback />}>
            <Routes>
              <Route path={ROUTES.LOGIN} element={<Login />} />
              <Route path={ROUTES.REGISTER} element={<Register />} />
              <Route path={ROUTES.HOME} element={<Dashboard />} />
              <Route path={ROUTES.BOOK_DETAIL} element={<BookDetail />} />
              <Route
                path={ROUTES.PROFILE}
                element={<PrivateRoute><Profile /></PrivateRoute>}
              />
              <Route
                path="/user/:id"
                element={<PrivateRoute><UserProfile /></PrivateRoute>}
              />
              <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
            </Routes>
          </Suspense>
        </div>
      </AuthProvider>
    </DarkModeProvider>
  </Router>
);

export default App;
