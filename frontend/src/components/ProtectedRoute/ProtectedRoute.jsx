import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser } = useAuth();
  const location = useLocation();

  const isAuthorized = currentUser && allowedRoles.includes(currentUser.role);

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAuthorized) {
    return <Navigate to={`/${currentUser.role}/dashboard`} replace />;
  }

  return children;
};

export default ProtectedRoute;