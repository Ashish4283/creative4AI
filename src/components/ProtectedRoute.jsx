import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
    const { isAuthenticated, user, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-zinc-950 text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (requiredRole && user?.role !== requiredRole) {
        // If they are an admin, they can probably go anywhere, but strictly:
        if (requiredRole === 'admin' && user?.role !== 'admin') {
            return <Navigate to="/dashboard" replace />;
        }
        if (requiredRole === 'user' && user?.role === 'admin') {
            // Admin trying to access user dashboard. Maybe allow, maybe redirect to admin
            return <Navigate to="/admin" replace />;
        }
    }

    return children;
};

export default ProtectedRoute;
