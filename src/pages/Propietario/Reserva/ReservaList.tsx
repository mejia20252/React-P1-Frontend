// src/pages/Administrador/Reserva/ReservaList.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faDollarSign, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { loadStripe } from '@stripe/stripe-js'; // Import loadStripe
import api from '../../../app/axiosInstance'; // Import your axios instance
import { reservaApi } from '../../../api/api-reserva';
import { areaComunApi } from '../../../api/api-area-comun';
import { residenteApi } from '../../../api/api-residente';
import type { Reserva } from '../../../types/type-reserva';
import type { AreaComun } from '../../../types/type-area-comun';
import type { Residente } from '../../../types/type-residente';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '');

const ReservaList: React.FC = () => {
    const [reservas, setReservas] = useState<Reserva[]>([]);
    const [areas, setAreas] = useState<Record<number, AreaComun>>({});
    const [residentes, setResidentes] = useState<Record<number, Residente>>({});
    const [loading, setLoading] = useState(true);
    const [topError, setTopError] = useState('');
    const [loadingPaymentId, setLoadingPaymentId] = useState<number | null>(null); // State for payment loading

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [reservasData, areasData, residentesData] = await Promise.all([
                    reservaApi.getAll(),
                    areaComunApi.getAll(),
                    residenteApi.getAll(),
                ]);

                setReservas(reservasData);

                // Convertimos arrays en mapas por ID para acceso rápido
                const areasMap = areasData.reduce((acc, area) => {
                    acc[area.id] = area;
                    return acc;
                }, {} as Record<number, AreaComun>);
                setAreas(areasMap);

                const residentesMap = residentesData.reduce((acc, residente) => {
                    acc[residente.id] = residente;
                    return acc;
                }, {} as Record<number, Residente>);
                setResidentes(residentesMap);

            } catch (error) {
                console.error('Error al cargar reservas:', error);
                setTopError('No se pudieron cargar las reservas.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleDelete = async (id: number) => {
        if (!window.confirm('¿Estás seguro de eliminar esta reserva?')) return;

        try {
            await reservaApi.delete(id);
            setReservas(reservas.filter(r => r.id !== id));
        } catch (error) {
            alert('No se pudo eliminar la reserva.');
        }
    };

    const handlePagarReserva = async (reservaId: number) => {
        setLoadingPaymentId(reservaId);
        try {
            const stripe = await stripePromise;
            if (!stripe) {
                console.error('Stripe.js no cargó correctamente.');
                alert('Hubo un error al cargar Stripe. Intenta de nuevo.');
                return;
            }

            const response = await api.post(
                '/pagos/crear_sesion_stripe/',
                {
                    tipo_objeto: 'reserva',
                    objeto_id: reservaId,
                    success_url: window.location.origin + '/propietario/reserva-pago-exitoso', // Asegúrate que esta ruta exista
                    cancel_url: window.location.origin + '/propietario/reserva-pago-cancelado', // Asegúrate que esta ruta exista
                }
            );

            const sessionId = response.data.id;

            const result = await stripe.redirectToCheckout({ sessionId });

            if (result.error) {
                console.error('Error al redirigir a Stripe Checkout:', result.error.message);
                alert('Hubo un error al iniciar el pago: ' + result.error.message);
            }
        } catch (err: any) {
            console.error('Error al procesar el pago de la reserva con Stripe:', err.response ? err.response.data : err.message);
            alert('Error al procesar el pago de la reserva. Intenta de nuevo.');
        } finally {
            setLoadingPaymentId(null);
        }
    };

    // Helpers para mostrar nombres
    const getAreaNombre = (id: number) => areas[id]?.nombre || `Área ${id}`;
    const getResidenteNombre = (id: number | null) => {
        if (id === null) return 'Sin residente';
        const residente = residentes[id];
        return residente ? `Residente ${id} (Usuario ${residente.usuario})` : `Residente ${id}`;
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Reservas de Áreas Comunes</h1>
                <Link
                    to="/propietario/reservas/nuevo"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
                >
                    <FontAwesomeIcon icon={faPlus} className="mr-2" /> Nueva Reserva
                </Link>
            </div>

            {topError && (
                <div className="mb-4 p-3 rounded-md bg-red-100 border border-red-200 text-red-700 text-sm">
                    {topError}
                </div>
            )}

            {loading ? (
                <p className="text-gray-600">Cargando reservas...</p>
            ) : reservas.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">No hay reservas registradas.</p>
                    <Link to="/propietario/reservas/nuevo" className="text-blue-600 hover:text-blue-800 mt-4 block">
                        Registrar una ahora
                    </Link>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Área</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Residente</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Horario</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pago</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {reservas.map((reserva) => (
                                <tr key={reserva.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {getAreaNombre(reserva.area_comun)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {getResidenteNombre(reserva.residente)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {new Date(reserva.fecha).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {reserva.hora_inicio.slice(0, 5)} - {reserva.hora_fin.slice(0, 5)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            reserva.estado === 'confirmada' ? 'bg-green-100 text-green-800' :
                                                reserva.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                        }`}>
                                            {reserva.estado}
                                        </span>
                                    </td>
                                    {/* Columna de Pago */}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        {reserva.pagada ? (
                                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Pagada</span>
                                        ) : (
                                            // Only show the pay button if the reservation is not yet paid
                                            <button
                                                onClick={() => handlePagarReserva(reserva.id)}
                                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm transition flex items-center justify-center"
                                                disabled={loadingPaymentId === reserva.id}
                                            >
                                                {loadingPaymentId === reserva.id ? (
                                                    <FontAwesomeIcon icon={faSpinner} spin className="mr-1" />
                                                ) : (
                                                    <FontAwesomeIcon icon={faDollarSign} className="mr-1" />
                                                )}
                                                {loadingPaymentId === reserva.id ? 'Procesando...' : 'Pagar'}
                                            </button>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <Link
                                            to={`/propietario/reservas/${reserva.id}/editar`}
                                            className="text-blue-600 hover:text-blue-900 mr-4"
                                        >
                                            <FontAwesomeIcon icon={faEdit} /> Editar
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(reserva.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            <FontAwesomeIcon icon={faTrash} /> Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ReservaList;