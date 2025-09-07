
// src/routes/ClientRoutes.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import Dashboard from '../pages/Cliente/Dashboard';



const ClientRoutes: React.FC = () => (
  <ProtectedRoute requiredRoles={["Personal"]}>
    <>
      
      <Routes>
        <Route index element={<Navigate to="dashboard" replace />} />
        {/* sub-rutas */}
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/not-found" replace />} />
      </Routes>
    </>
  </ProtectedRoute>
);

export default ClientRoutes;
