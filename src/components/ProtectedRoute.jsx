import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
    const { isAuthenticated, user, isLoading } = useAuth();
    const location = useLocation();

    console.log("[ProtectedRoute Trace]", {
        path: location.pathname,
        isLoading,
        isAuthenticated,
        userRole: user?.role
    });

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

    if (requiredRole) {
        const ROLE_LEVELS = {
            'agent': 1,
            'user': 2,
            'tech_user': 2,
            'manager': 3,
            'admin': 4,
            'super_admin': 5
        };

        const uRole = user?.role || 'tech_user';
        const userLevel = ROLE_LEVELS[uRole.toLowerCase()] || 0;
        const requiredLevel = ROLE_LEVELS[requiredRole.toLowerCase()] || 0;

        if (userLevel < requiredLevel) {
            // ONLY redirect if we are not already going where we need to go
            if (location.pathname !== '/dashboard') {
                return <Navigate to="/dashboard" replace />;
            }
        }
    }

    return children;
};

export default ProtectedRoute;
