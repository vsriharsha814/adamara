import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Form from './pages/Form';
import Admin from './pages/Admin';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import RequestDetail from './pages/RequestDetail';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow bg-gray-50 py-6">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Navigate to="/request" />} />
            <Route path="/request" element={<Form />} />
            <Route path="/admin/login" element={<Login />} />
            
            {/* Protected Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            } />
            <Route path="/admin/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/requests/:id" element={
              <ProtectedRoute>
                <RequestDetail />
              </ProtectedRoute>
            } />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;