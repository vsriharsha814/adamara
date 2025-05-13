import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="max-w-lg mx-auto px-4 py-12 text-center">
      <svg 
        className="w-24 h-24 text-gray-400 mx-auto mb-6" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth="2" 
          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
        />
      </svg>
      
      <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">
        Oops! The page you&apos;re looking for doesn&apos;t exist.
      </p>
      
      <div className="space-y-4">
        <Link 
          to="/" 
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-block"
        >
          Go to Home
        </Link>
        
        <div className="block text-gray-500">
          or
        </div>
        
        <Link 
          to="/admin/dashboard" 
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 inline-block"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;