import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthForm from '../components/auth/AuthForm';
import { api } from '../utils/api';
import { ROUTES } from '../utils/constants';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

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
      console.log('Login response:', response); // Debug log

      if (response.data.access_token && response.data.username) {
        login(response.data.access_token, response.data.username);
        navigate(ROUTES.HOME);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Login error:', err);
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