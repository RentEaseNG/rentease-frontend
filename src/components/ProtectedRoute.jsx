import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute
 *
 * Props:
 *   requiredRole  (string)   – single role, e.g. "Admin"
 *   requiredRoles (string[]) – any of these roles is allowed
 *   fallback      (string)   – where to redirect on role mismatch (default: "/dashboard")
 */
const ProtectedRoute = ({ children, requiredRole, requiredRoles, fallback = '/dashboard' }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600" />
            </div>
        );
    }

    if (!user) return <Navigate to="/login" replace />;

    // Build the set of allowed roles
    const allowed = requiredRoles ?? (requiredRole ? [requiredRole] : null);

    if (allowed && !allowed.includes(user.role)) {
        return <Navigate to={fallback} replace />;
    }

    return children;
};

export default ProtectedRoute;