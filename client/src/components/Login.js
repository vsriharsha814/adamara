import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const response = await axios.post('/api/auth/login', {
        email,
        password
      });
      
      // Store token in localStorage
      localStorage.setItem('authToken', response.data.token);
      
      // Redirect to admin dashboard
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError(
        err.response?.data?.errors?.[0]?.msg || 
        err.response?.data?.message || 
        'Login failed. Please check your credentials and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-8">
        <h2 className="text-center text-2xl font-bold text-gray-700 mb-6">
          Admin Login
        </h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <div>
            <button
              type="submit"
              className={`w-full px-4 py-2 text-white font-medium rounded-md ${
                isLoading 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;