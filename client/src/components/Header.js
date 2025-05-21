import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  const isAdmin = location.pathname.includes('/admin');
  
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-blue-600 text-2xl font-bold">Ad</span>
              <span className="text-gray-800 text-2xl font-bold">Amara</span>
            </Link>
            <span className="ml-4 text-sm text-gray-500 hidden sm:inline-block">
              by Amaravati Communications Pvt. Ltd.
            </span>
          </div>
          
          <nav className="flex space-x-4">
            {isAdmin ? (
              <>
                <Link 
                  to="/admin/dashboard" 
                  className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Dashboard
                </Link>
                <button 
                  className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                  onClick={() => {
                    // Clear token and redirect to login
                    localStorage.removeItem('authToken');
                    window.location.href = '/admin/login';
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <Link 
                to="/admin/login" 
                className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Admin Login
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;