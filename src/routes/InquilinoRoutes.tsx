// src/routes/AdminRoutes.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';

import Dashboard from '../pages/Inquilino/Dashboard';
import Perfil from '../pages/Perfil.tsx';

import ChangePassword from '../pages/CambiarContras.tsx';
// Nuevas importaciones para Grupos
import TelefonoForm from '../pages/Inquilino/Telefono/TelefonoForm.tsx';
import TelefonoList from '../pages/Inquilino/Telefono/TelefonoList.tsx';

import CasaList from '../pages/Inquilino/Casa/CasaList.tsx'; // Asumiendo que CasaList sigue siendo para el Administrador

import ComunicadoList from '../pages/Inquilino/Comunicado/ComunicadoList.tsx';

import PagoList from '../pages/Inquilino/Pago/PagoList.tsx';


import ReservaList from '../pages/Inquilino/Reserva/ReservaList.tsx';
import ReservaForm from '../pages/Inquilino/Reserva/ReservaForm.tsx';
import PagarReserva from '../pages/Inquilino/Reserva/PagarReserva.tsx';
import ReservaPagoCancelado from '../pages/Inquilino/Reserva/ReservaPagoCancelado.tsx';
import ReservaPagoExitoso from '../pages/Inquilino/Reserva/ReservaPagoExitoso.tsx';

import AreasComunesList from '../pages/Inquilino/AreaComun/AreasComunesList.tsx'
import VehiculoList from '../pages/Propietario/Vehiculo/VehiculoList.tsx';

import MascotaList from '../pages/Propietario/Mascota/MascotaList.tsx'

import MisCuotas from '../pages/Inquilino/Cuota/MisCuotas.tsx';
import CuotaPagoCancelado from '../pages/Inquilino/Cuota/CuotaPagoCancelado.tsx';
import CuotaPagoExitoso from '../pages/Inquilino/Cuota/CuotaPagoExitoso.tsx';



const InquilinoRoutes: React.FC = () => (
    <ProtectedRoute requiredRoles={["Inquilino"]}>
        <Routes>
            <Route index element={<Navigate to="dashboard" replace />} />
            {/* RUTA DEL DASHBOARD */}
            <Route path="dashboard" element={<Dashboard />} />

            <Route path="telefonos" element={<TelefonoList />} />
            <Route path="telefonos/new" element={<TelefonoForm />} />
            <Route path="telefonos/:id/edit" element={<TelefonoForm />} />

            <Route path="/comunicados" element={<ComunicadoList />} />

            <Route path="vehiculos" element={<VehiculoList />} />


            <Route path="mascotas" element={<MascotaList />} />

            <Route path="reservas" element={<ReservaList />} />
            <Route path="reservas/nuevo" element={<ReservaForm />} />
            <Route path="reservas/:id/editar" element={<ReservaForm />} />
            <Route path="reservas/:id/pagar" element={<PagarReserva />} />

            <Route path="areas-comunes" element={<AreasComunesList />} />



            <Route path="pagos" element={<PagoList />} />
            <Route path="pago-exitoso" element={<CuotaPagoExitoso />} />
            <Route path="pago-cancelado" element={<CuotaPagoCancelado />} />

            <Route path="/reserva-pago-exitoso" element={<ReservaPagoExitoso />} />
            <Route path="/reserva-pago-cancelado" element={<ReservaPagoCancelado />} />
         

            <Route path="casas" element={<CasaList />} />
            <Route path='/cambiar-contra' element={<ChangePassword />} />
            <Route path='/perfil' element={<Perfil />} />
            <Route path='/cuotas' element={<MisCuotas />} />
            




            {/* <Route path="*" element={<Navigate to="/not-found" replace />} /> */}
        </Routes>
    </ProtectedRoute>
);

export default InquilinoRoutes;