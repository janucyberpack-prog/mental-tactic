import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ProfileSkeleton } from './Skeletons';
import { ShieldAlert, ArrowLeft, LogIn } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAdmin = false
}) => {
  const { user, profile, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] py-20 flex items-center justify-center">
        <ProfileSkeleton />
      </div>
    );
  }

  const isAdminArea = location.pathname.startsWith('/admin');

  if (!user) {
    const targetRedirect = isAdminArea ? '/admin/login' : '/login';
    return <Navigate to={targetRedirect} state={{ from: location.pathname }} replace />;
  }

  // Strict administrator check: editors and regular users do not receive admin privileges
  if (requireAdmin && !isAdmin) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-6 text-center bg-[#FAF7F2]">
        <div className="max-w-md bg-white rounded-3xl p-8 border border-[#EBE6DC] shadow-sm space-y-5">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center mx-auto border border-amber-200">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h2 className="font-serif text-3xl text-[#122B22]">Administrator Access Required</h2>
            <p className="text-xs text-[#122B22]/70 leading-relaxed font-sans">
              You are signed in as <span className="font-medium text-[#122B22]">{user.email}</span> with role <span className="font-semibold uppercase tracking-wider text-xs px-2 py-0.5 rounded-full bg-[#FAF7F2] border border-[#EBE6DC] text-[#6F8A77]">{profile?.role || 'user'}</span>.
            </p>
            <p className="text-xs text-[#122B22]/60 leading-relaxed font-sans pt-1">
              Access to the Mental Tactic CMS Studio is restricted strictly to administrators. Editors and seekers cannot access administrator controls.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
            <Link
              to="/admin/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#122B22] text-[#FAF7F2] text-xs font-semibold uppercase tracking-wider hover:bg-[#1A3B2F] transition-colors"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Switch to Admin</span>
            </Link>
            <Link
              to="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#FAF7F2] text-[#122B22] border border-[#EBE6DC] text-xs font-semibold uppercase tracking-wider hover:bg-[#EAE5DB] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return Home</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

