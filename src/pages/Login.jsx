import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthForm from '../components/auth/AuthForm';
import { api } from '../utils/api';
import { ROUTES } from '../utils/constants';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Get the redirect path from location state or default to home
  const from = location.state?.from || ROUTES.HOME;

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await api.auth.login(formData);
      login(response.data.access_token, response.data.username);
      navigate(from); // Redirect to the original destination
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <AuthForm
          type="login"
          formData={formData}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
          error={error}
          isLoading={isLoading}
      />
  );
};

export default Login;