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

import CasaForm from '../pages/Administrador/Casa/CasaForm.tsx'; // Asumiendo que CasaForm sigue siendo para el Administrador
import CasaList from '../pages/Administrador/Casa/CasaList.tsx'; // Asumiendo que CasaList sigue siendo para el Administrador

import VehiculoList from '../pages/Inquilino/Vehiculo/VehiculoList.tsx';

import MascotaList from '../pages/Inquilino/Mascota/MascotaList.tsx';

import AreasComunesList from '../pages/Inquilino/AreaComun/AreasComunesList.tsx';

import ReservaList from '../pages/Inquilino/Reserva/ReservaList.tsx';
import ReservaForm from '../pages/Inquilino/Reserva/ReservaForm.tsx';
import PagarReserva from '../pages/Inquilino/Reserva/PagarReserva.tsx';

import ComunicadoList from '../pages/Inquilino/Comunicado/ComunicadoList.tsx';

import PagoList from '../pages/Inquilino/Pago/PagoList.tsx';

import InquilinoCasaDetail from '../pages/Inquilino/MisPropieades.tsx'; // Cambiado a InquilinoCasaDetail
import MisCuotas from '../pages/Inquilino/Cuota/MisCuotas.tsx';
const InquilinoRoutes: React.FC = () => (
    <ProtectedRoute requiredRoles={["Inquilino"]}>
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
            <Route path="reservas/:id/pagar" element={<PagarReserva />} />

       
            <Route path="/comunicados" element={<ComunicadoList />} />
  


            <Route path="pagos" element={<PagoList />} />
        

            <Route path='/cambiar-contra' element={<ChangePassword />} />
            <Route path='/perfil' element={<Perfil />} />
            <Route path='/mis-propiedades' element={<InquilinoCasaDetail />} />
            <Route path='/cuotas' element={<MisCuotas />} />
            // App.tsx o donde tengas tus rutas
           



            <Route path="*" element={<Navigate to="/not-found" replace />} />
        </Routes>
    </ProtectedRoute>
);

export default InquilinoRoutes;