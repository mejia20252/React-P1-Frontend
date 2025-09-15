// src/routes/AdminRoutes.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';

import Dashboard from '../pages/Inquilino/Dashboard';


const InquilinoRoutes: React.FC = () => (
    <ProtectedRoute requiredRoles={["Inquilino"]}>
        <Routes>
            <Route index element={<Navigate to="dashboard" replace />} />
            {/* RUTA DEL DASHBOARD */}
            <Route path="dashboard" element={<Dashboard />} />


            <Route path="*" element={<Navigate to="/not-found" replace />} />
        </Routes>
    </ProtectedRoute>
);

export default InquilinoRoutes;