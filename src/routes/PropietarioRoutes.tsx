// src/routes/AdminRoutes.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute.tsx';
import Dashboard from '../pages/Propietario/Dashboard.tsx';
// Nuevas importaciones para Grupos
import TelefonoForm from '../pages/Propietario/Telefono/TelefonoForm.tsx';
import TelefonoList from '../pages/Propietario/Telefono/TelefonoList.tsx';



import CasaForm from '../pages/Administrador/Casa/CasaForm.tsx';
import CasaList from '../pages/Administrador/Casa/CasaList.tsx';

import VehiculoList from '../pages/Propietario/Vehiculo/VehiculoList.tsx';

import MascotaList from '../pages/Propietario/Mascota/MascotaList.tsx'

import AreasComunesList from '../pages/Propietario/AreaComun/AreasComunesList.tsx'

import ReservaList from '../pages/Propietario/Reserva/ReservaList.tsx';
import ReservaForm from '../pages/Propietario/Reserva/ReservaForm.tsx';
import ReservaCancelado from '../pages/Propietario/Reserva/ReservaCancelado.tsx';
import ReservaExitoso from '../pages/Propietario/Reserva/ReservaExitoso.tsx';



import ComunicadoList from '../pages/Propietario/Comunicado/ComunicadoList.tsx';


import PagoList from '../pages/Propietario/Pago/PagoList.tsx';

import PropietarioCasaDetail from '../pages/Propietario/MisPropieades.tsx';

import CuotaExitoso from '../pages/Propietario/Cuota/CuotaExitoso.tsx';
import MisCuotas from '../pages/Propietario/Cuota/MisCuotas.tsx';
import CuotaCancelado from '../pages/Propietario/Cuota/CuotaCancelado.tsx';



import ChangePassword from '../pages/CambiarContras.tsx';
import Perfil from '../pages/Perfil.tsx';
const AdminRoutes: React.FC = () => (
    <ProtectedRoute requiredRoles={["Propietario"]}>
        <Routes>
            <Route index element={<Navigate to="dashboard" replace />} />
            {/* RUTA DEL DASHBOARD */}
            <Route path="dashboard" element={<Dashboard />} />




            <Route path="telefonos" element={<TelefonoList />} />
            <Route path="telefonos/new" element={<TelefonoForm />} />
            <Route path="telefonos/:id/edit" element={<TelefonoForm />} />


            <Route path="casas" element={<CasaList />} />
            <Route path="casas/nueva" element={<CasaForm />} />
            <Route path="casas/:id/editar" element={<CasaForm />} />

            <Route path="vehiculos" element={<VehiculoList />} />


            <Route path="mascotas" element={<MascotaList />} />



            <Route path="areas-comunes" element={<AreasComunesList />} />

            <Route path="reservas" element={<ReservaList />} />
            <Route path="reservas/nuevo" element={<ReservaForm />} />
            <Route path="reservas/:id/editar" element={<ReservaForm />} />


            <Route path="/comunicados" element={<ComunicadoList />} />



            <Route path="pagos" element={<PagoList />} />


            <Route path='/cambiar-contra' element={<ChangePassword />} />
            <Route path='/perfil' element={<Perfil />} />
            <Route path='/mis-propiedades' element={<PropietarioCasaDetail />} />
            <Route path='/cuotas' element={<MisCuotas />} />

            <Route path="/cuota-pago-exitoso" element={<CuotaExitoso />} />
            <Route path="/cuota-pago-cancelado" element={<CuotaCancelado />} />

            <Route path="/reserva-pago-exitoso" element={<ReservaExitoso />} />
            <Route path="/reserva-pago-cancelado" element={<ReservaCancelado />} />



            {/* <Route path="*" element={<Navigate to="/not-found" replace />} />  */}
        </Routes>
    </ProtectedRoute>
);

export default AdminRoutes;