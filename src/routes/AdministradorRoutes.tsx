// src/routes/AdminRoutes.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import RolesList from  '../pages/Administrador/Rol/RolList';
import RolesForm from  '../pages/Administrador/Rol/RolForm';
import Dashboard from '../pages/Administrador/Dashboard';
import CustomUserForm from '../pages/Administrador/CustomUser/CustomUserForm';
import CustomUserList from '../pages/Administrador/CustomUser/CustomUserList';
import BitacoraList from '../pages/Administrador/Bitacora/BitacoraList';
import BitacoraDetail from '../pages/Administrador/DetalleBitacora/DetalleBitacoraList';

import ChangePassword from '../pages/CambiarContras';
const AdminRoutes: React.FC = () => (
    <ProtectedRoute requiredRoles={["Administrador"]}>
        <Routes>
            <Route index element={<Navigate to="dashboard" replace />} />
             {/* RUTA DEL DASHBOARD */}
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="roles" element={<RolesList />} />
            <Route path="roles/new" element={<RolesForm />} />
            <Route path="roles/:id/edit" element={<RolesForm />} />
             {/* RUTA DEL usuarios */}
            <Route path="usuarios" element={<CustomUserList />} />
            <Route path="usuarios/new" element={<CustomUserForm />} />
            <Route path="usuarios/:id/edit" element={<CustomUserForm />} />

             {/* RUTA DEL DASHBOARD */}
            <Route path="bitacoras" element={<BitacoraList />} />
            <Route path="bitacoras/:id" element={<BitacoraDetail />} />
             {/* RUTA DEL usuarios */}
    

            <Route path='/cambiar-contra' element={<ChangePassword />} />


       

            <Route path="*" element={<Navigate to="/not-found" replace />} />
        </Routes>
    </ProtectedRoute>
);

export default AdminRoutes;