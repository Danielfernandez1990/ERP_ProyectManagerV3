import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { authApi } from '../services/api';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, accessToken } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    const validateToken = async () => {
      if (!isAuthenticated || !accessToken) {
        setValid(false);
        setLoading(false);
        return;
      }

      try {
        await authApi.getMe();
        setValid(true);
      } catch (error) {
        setValid(false);
      }

      setLoading(false);
    };

    validateToken();
  }, [isAuthenticated, accessToken]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!valid) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
