// src/routes/AdminRoutes.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute.tsx';
import Dashboard from '../pages/Trabajador/Dashboard.tsx';
// Nuevas importaciones para Grupos


import ChangePassword from '../pages/CambiarContras.tsx';
import Perfil from '../pages/Perfil.tsx';
const AdminRoutes: React.FC = () => (
    <ProtectedRoute requiredRoles={["Trabajador"]}>
        <Routes>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
     


            <Route path='/cambiar-contra' element={<ChangePassword />} />
            <Route path='/perfil' element={<Perfil />} />
           


            <Route path="*" element={<Navigate to="/not-found" replace />} />
        </Routes>
    </ProtectedRoute>
);

export default AdminRoutes;