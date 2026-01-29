import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { firebaseApp } from '../firebase';

const Login = () => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleGoogleLogin = async () => {
    setError('');
    setIsLoading(true);
    
    try {
      const auth = getAuth(firebaseApp);
      const provider = new GoogleAuthProvider();

      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      // Store Firebase ID token; backend expects this as Bearer token
      localStorage.setItem('authToken', idToken);

      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError(
        err?.message ||
        'Google sign-in failed. Please try again.'
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
        
        <button
          type="button"
          onClick={handleGoogleLogin}
          className={`w-full px-4 py-2 text-white font-medium rounded-md ${
            isLoading 
              ? 'bg-blue-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
          disabled={isLoading}
        >
          {isLoading ? 'Signing in with Google...' : 'Continue with Google'}
        </button>
      </div>
    </div>
  );
};

export default Login;