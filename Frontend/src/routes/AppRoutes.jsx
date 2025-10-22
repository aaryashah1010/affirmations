import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../shared/hooks/useAuth.js';
import ProtectedRoute from './ProtectedRoute.jsx';

// Auth routes
import { AuthRoutes } from '../modules/auth/index.js';

// Dashboard routes
import { DashboardRoutes } from '../modules/dashboard/index.js';

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Auth routes */}
      <Route path="/login/*" element={<AuthRoutes />} />
      <Route path="/register/*" element={<AuthRoutes />} />
      
      {/* Protected dashboard routes */}
      <Route path="/dashboard/*" element={
        <ProtectedRoute>
          <DashboardRoutes />
        </ProtectedRoute>
      } />
      
      {/* Redirects */}
      <Route 
        path="/" 
        element={
          <Navigate 
            to={isAuthenticated ? "/dashboard" : "/login"} 
            replace 
          />
        } 
      />
      
      {/* Catch all - redirect to dashboard or login */}
      <Route 
        path="*" 
        element={
          <Navigate 
            to={isAuthenticated ? "/dashboard" : "/login"} 
            replace 
          />
        } 
      />
    </Routes>
  );
};

export default AppRoutes;
