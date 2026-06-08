import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../store/authContext';

export const ProtectedRoute: React.FC = () => {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-4 border-brand-500/10 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-t-brand-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
