import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, to = '/' }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div style={{ padding: '3rem', textAlign: 'center' }}>Loading...</div>;
  }

  if (!user) {
    return <Navigate to={to} replace />;
  }

  return children;
};

export default ProtectedRoute;
