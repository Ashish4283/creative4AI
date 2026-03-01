import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Home from './components/sections/Home';
import WorkflowBuilder from './components/sections/WorkflowBuilder';
import UserApp from './UserApp';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AuthLayout from './components/auth/AuthLayout';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import AdminDashboard from './pages/Dashboard/AdminDashboard';

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* User Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute requiredRole="user">
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/builder" element={
            <ProtectedRoute requiredRole="user">
              <WorkflowBuilder />
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />

          {/* Public facing app route */}
          <Route path="/app" element={<UserApp />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;