import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-navy-800 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500">Verifying credentials…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded border border-red-200 shadow-sm max-w-sm">
          <div className="text-4xl mb-3">🚫</div>
          <h2 className="text-lg font-semibold text-red-700 mb-2">Access Restricted</h2>
          <p className="text-sm text-gray-600">
            You are not authorized to access this section.<br />
            Current role: <strong>{user.role}</strong>
          </p>
        </div>
      </div>
    );
  }

  return children;
}
