
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <Loader2 className="w-12 h-12 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly) {
    const allowedRoles = ['admin', 'site_owner', 'oversee'];
    // Check if user has one of the allowed roles
    if (!role || !allowedRoles.includes(role)) {
       // Optional: Redirect to a "Not Authorized" page or back to dashboard
       // For now, redirecting to dashboard which is a safe protected route for authenticated users
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
