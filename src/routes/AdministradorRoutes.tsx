// src/routes/AdminRoutes.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import RolesList from '../pages/Administrador/Rol/RolList';
import RolesForm from '../pages/Administrador/Rol/RolForm';
import Dashboard from '../pages/Administrador/Dashboard';
import BitacoraList from '../pages/Administrador/Bitacora/BitacoraList';
import BitacoraDetail from '../pages/Administrador/DetalleBitacora/DetalleBitacoraList';
// Nuevas importaciones para Grupos
import GrupoList from '../pages/Administrador/Grupo/GrupoList';
import GrupoForm from '../pages/Administrador/Grupo/GrupoForm';
import TelefonoForm from '../pages/Administrador/Telefono/TelefonoForm';
import TelefonoList from '../pages/Administrador/Telefono/TelefonoList';

import UserList from '../pages/Administrador/Usuarios/UserList';
import UserForms from '../pages/Administrador/Usuarios/UserForms';
import UserDetail from '../pages/Administrador/Usuarios/UserDetail';

import CasaForm from '../pages/Administrador/Casa/CasaForm';
import CasaList from '../pages/Administrador/Casa/CasaList';

import VehiculoForm from '../pages/Administrador/Vehiculo/VehiculoForm';
import VehiculoList from '../pages/Administrador/Vehiculo/VehiculoList';
// RESIDENTES (NUEVO)
import ResidentesList from '../pages/Administrador/Residente/ResidenteList.tsx'
import ResidenteForm from '../pages/Administrador/Residente/ResidenteForm.tsx';

import MascotaList from '../pages/Administrador/Mascota/MascotaList.tsx'
import MascotaForm from '../pages/Administrador/Mascota/MascotaForm.tsx';

import AreasComunesForm from '../pages/Administrador/AreaComun/AreasComunesForm.tsx'
import AreasComunesList from '../pages/Administrador/AreaComun/AreasComunesList.tsx';

import ReservaList from '../pages/Administrador/Reserva/ReservaList';
import ReservaForm from '../pages/Administrador/Reserva/ReservaForm';

import TareaMantenimientoList from '../pages/Administrador/TareaMantenimiento/TareaMantenimientoList';
import TareaMantenimientoForm from '../pages/Administrador/TareaMantenimiento/TareaMantenimientoForm';

import ComunicadoList from '../pages/Administrador/Comunicado/ComunicadoList';
import ComunicadoForm from '../pages/Administrador/Comunicado/ComunicadoForm';

import ConceptoPagoList from '../pages/Administrador/ConceptoPago/ConceptoPagoList';
import ConceptoPagoForm from '../pages/Administrador/ConceptoPago/ConceptoPagoForm';

import CuotaList from '../pages/Administrador/Cuota/CuotaList';
import CuotaForm from '../pages/Administrador/Cuota/CuotaForm';

import PagoList from '../pages/Administrador/Pago/PagoList';
import PagoForm from '../pages/Administrador/Pago/PagoForm';


import ChangePassword from '../pages/CambiarContras';
import Perfil from '../pages/Perfil.tsx';
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

            {/* RUTA DEL DASHBOARD */}
            <Route path="bitacoras" element={<BitacoraList />} />
            <Route path="bitacoras/:id" element={<BitacoraDetail />} />
            {/* RUTAS PARA GRUPOS */}
            <Route path="grupos" element={<GrupoList />} />
            <Route path="grupos/new" element={<GrupoForm />} />
            <Route path="grupos/:id/edit" element={<GrupoForm />} />
            {/* RUTAS PARA Telefonos */}
            <Route path="telefonos" element={<TelefonoList />} />
            <Route path="telefonos/new" element={<TelefonoForm />} />
            <Route path="telefonos/:id/edit" element={<TelefonoForm />} />
            {/* Rutas para el CRUD de Administrador */}
            <Route path="usuarios" element={<UserList />} />
            <Route path="usuarios/:id" element={<UserDetail />} />
            <Route path="usuarios/new" element={<UserForms />} />
            <Route path="usuarios/:id/editar" element={<UserForms />} />

            <Route path="casas" element={<CasaList />} />
            <Route path="casas/nueva" element={<CasaForm />} />
            <Route path="casas/:id/editar" element={<CasaForm />} />

            <Route path="vehiculos" element={<VehiculoList />} />
            <Route path="vehiculos/new" element={<VehiculoForm />} />
            <Route path="vehiculos/:id/editar" element={<VehiculoForm />} />


            <Route path="mascotas" element={<MascotaList />} />
            <Route path="mascotas/new" element={<MascotaForm />} />
            <Route path="mascotas/:id/editar" element={<MascotaForm />} />

            {/* NUEVA RUTA para asignar casa a vehículo */}
            {/* RESIDENTES — NUEVAS RUTAS PRINCIPALES */}
            <Route path="residentes" element={<ResidentesList />} />
            <Route path="residentes/nuevo" element={<ResidenteForm />} />
            <Route path="residentes/:id/editar" element={<ResidenteForm />} />

            <Route path="areas-comunes" element={<AreasComunesList />} />
            <Route path="areas-comunes/nuevo" element={<AreasComunesForm />} />
            <Route path="areas-comunes/:id/editar" element={<AreasComunesForm />} />
            <Route path="reservas" element={<ReservaList />} />
            <Route path="reservas/nuevo" element={<ReservaForm />} />
            <Route path="reservas/:id/editar" element={<ReservaForm />} />

            <Route path="tareas-mantenimiento" element={<TareaMantenimientoList />} />
            <Route path="tareas-mantenimiento/nuevo" element={<TareaMantenimientoForm />} />
            <Route path="tareas-mantenimiento/:id/editar" element={<TareaMantenimientoForm />} />
            <Route path="/comunicados" element={<ComunicadoList />} />
            <Route path="/comunicados/nuevo" element={<ComunicadoForm />} />
            <Route path="/comunicados/:id/editar" element={<ComunicadoForm />} />

            <Route path="/conceptos-pago" element={<ConceptoPagoList />} />
            <Route path="/conceptos-pago/nuevo" element={<ConceptoPagoForm />} />
            <Route path="/conceptos-pago/:id/editar" element={<ConceptoPagoForm />} />

            <Route path="/cuotas" element={<CuotaList />} />
            <Route path="/cuotas/nuevo" element={<CuotaForm />} />
            <Route path="/cuotas/:id/editar" element={<CuotaForm />} />

            <Route path="pagos" element={<PagoList />} />
            <Route path="pagos/nuevo" element={<PagoForm />} />
            <Route path="pagos/:id/editar" element={<PagoForm />} />

            <Route path='/cambiar-contra' element={<ChangePassword />} />
            <Route path='/perfil' element={<Perfil />} />

            <Route path="*" element={<Navigate to="/not-found" replace />} />
        </Routes>
    </ProtectedRoute>
);

export default AdminRoutes;