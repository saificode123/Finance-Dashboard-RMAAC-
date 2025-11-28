import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext/index';

const ProtectedRoute = ({ children }) => {
  const { userLoggedIn, userAccess, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6D79CF]"></div>
      </div>
    );
  }

  if (!userLoggedIn) {
    return <Navigate to="/" replace />;
  }

  if (!userAccess.accessGranted) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute;