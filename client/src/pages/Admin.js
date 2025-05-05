import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

// Admin component that redirects to Dashboard
const Admin = () => {
  // Simply redirect to the dashboard
  return <Navigate to="/admin/dashboard" replace />;
};

export default Admin;