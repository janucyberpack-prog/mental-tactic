import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ProfileSkeleton } from './Skeletons';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAdmin = false
}) => {
  const { user, loading, isAdmin, isEditor } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] py-20 flex items-center justify-center">
        <ProfileSkeleton />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (requireAdmin && !isAdmin && !isEditor) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6 text-center">
        <div className="max-w-sm space-y-4">
          <h2 className="font-serif text-3xl text-[#122B22]">Access Restricted</h2>
          <p className="text-xs text-[#122B22]/70 leading-relaxed font-sans">
            This area requires editor or administrator privileges.
          </p>
          <div className="pt-2">
            <a
              href="/"
              className="inline-block px-6 py-2.5 rounded-full bg-[#122B22] text-[#FAF7F2] text-xs font-semibold uppercase tracking-wider hover:bg-[#1A3B2F] transition-colors"
            >
              Return Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
