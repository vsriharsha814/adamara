import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }
      
      try {
        // Verify token with backend
        await axios.get('/api/auth/current', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Authentication error:', error);
        localStorage.removeItem('authToken');
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" />;
  }
  
  return children;
};

export default ProtectedRoute;