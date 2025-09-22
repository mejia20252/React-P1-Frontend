// src/pages/Propietario/Reserva/PagarReserva.tsx (CORREGIDO)
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faMoneyBillWave, faArrowLeft, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { loadStripe } from '@stripe/stripe-js';
import api from '../../../app/axiosInstance';
import { reservaApi } from '../../../api/api-reserva';
import { areaComunApi } from '../../../api/api-area-comun'; // Importa la API de área común
import type { Reserva } from '../../../types/type-reserva';
import type { AreaComun } from '../../../types/type-area-comun'; // Importa el tipo AreaComun

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '');

const PagarReserva: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [reserva, setReserva] = useState<Reserva | null>(null);
    const [areaComun, setAreaComun] = useState<AreaComun | null>(null); // Estado para el área común
    const [loading, setLoading] = useState(true);
    const [loadingAccion, setLoadingAccion] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadReservaAndAreaComun = async () => {
            if (!id) {
                setError('ID de reserva no proporcionado.');
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const reservaData = await reservaApi.getById(Number(id));
                setReserva(reservaData);

                if (reservaData.pagada) {
                    setError('Esta reserva ya ha sido pagada.');
                }

                // Cargar los detalles del área común usando el ID de la reserva
                const areaComunData = await areaComunApi.getById(reservaData.area_comun);
                setAreaComun(areaComunData);

            } catch (err) {
                console.error('Error al cargar la reserva o el área común:', err);
                setError('No se pudo cargar la información de la reserva o el área común. Intenta más tarde.');
            } finally {
                setLoading(false);
            }
        };
        loadReservaAndAreaComun();
    }, [id]);

    const formatCurrency = (amount: string): string => {
        const num = parseFloat(amount);
        return new Intl.NumberFormat('es-BO', {
            style: 'currency',
            currency: 'USD',
            currencyDisplay: 'narrowSymbol',
        }).format(num);
    };

    const handlePagarConStripe = async () => {
        if (!reserva || reserva.pagada || !areaComun) return; // Añadir areaComun a la verificación

        setLoadingAccion(true);
        try {
            const stripe = await stripePromise;
            if (!stripe) {
                console.error('Stripe.js no cargó correctamente.');
                return;
            }

            const response = await api.post(
                '/pagos/crear_sesion_stripe/',
                {
                    tipo_objeto: 'reserva',
                    objeto_id: reserva.id,
                    success_url: window.location.origin + '/pago-exitoso',
                    cancel_url: window.location.origin + '/pago-cancelado',
                }
            );

            const sessionId = response.data.id;

            const result = await stripe.redirectToCheckout({ sessionId });

            if (result.error) {
                console.error('Error al redirigir a Stripe Checkout:', result.error.message);
                alert('Hubo un error al iniciar el pago: ' + result.error.message);
            }
        } catch (err: any) {
            console.error('Error al procesar el pago con Stripe:', err.response ? err.response.data : err.message);
            alert('Error al procesar el pago. Intenta de nuevo.');
        } finally {
            setLoadingAccion(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
                <div className="text-center">
                    <FontAwesomeIcon icon={faSpinner} spin size="2x" className="text-blue-600 mb-4" />
                    <p className="text-gray-600">Cargando información de la reserva...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md max-w-lg text-center">
                    <FontAwesomeIcon icon={faExclamationCircle} className="mr-2" />
                    <p>{error}</p>
                    <button
                        onClick={() => navigate('/propietario/reservas')}
                        className="mt-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                        Volver a Reservas
                    </button>
                </div>
            </div>
        );
    }

    if (!reserva || !areaComun) { // Verificar también que areaComun se haya cargado
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md max-w-lg text-center">
                    <FontAwesomeIcon icon={faExclamationCircle} className="mr-2" />
                    <p>No se encontró la reserva o el área común especificada.</p>
                    <button
                        onClick={() => navigate('/propietario/reservas')}
                        className="mt-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                        Volver a Reservas
                    </button>
                </div>
            </div>
        );
    }

    // Ahora usamos 'areaComun.costo_reserva' que está en el estado 'areaComun'
    const costoReserva = areaComun.costo_alquiler || '0.00';

    return (
        <div className="min-h-screen bg-gray-50 p-4 flex justify-center items-center">
            <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
                <FontAwesomeIcon icon={faMoneyBillWave} size="3x" className="text-green-500 mb-6" />
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Pagar Reserva</h1>
                <p className="text-lg text-gray-700 mb-2">
                    **Área Común:** {areaComun.nombre || `ID: ${reserva.area_comun}`}
                </p>
                <p className="text-lg text-gray-700 mb-2">
                    **Fecha:** {new Date(reserva.fecha).toLocaleDateString()}
                </p>
                <p className="text-lg text-gray-700 mb-4">
                    **Monto a Pagar:** <span className="font-semibold text-xl">{formatCurrency(costoReserva)}</span>
                </p>

                {reserva.pagada ? (
                    <div className="bg-green-100 text-green-800 px-4 py-3 rounded-md mb-6">
                        <p className="font-semibold">¡Esta reserva ya está pagada!</p>
                    </div>
                ) : (
                    <button
                        onClick={handlePagarConStripe}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md text-lg font-medium transition-colors duration-200 flex items-center justify-center w-full"
                        disabled={loadingAccion}
                    >
                        {loadingAccion ? (
                            <>
                                <FontAwesomeIcon icon={faSpinner} spin className="mr-3" />
                                Procesando pago...
                            </>
                        ) : (
                            <>
                                <FontAwesomeIcon icon={faMoneyBillWave} className="mr-3" />
                                Pagar con Stripe
                            </>
                        )}
                    </button>
                )}

                <button
                    onClick={() => navigate('/propietario/reservas')}
                    className="mt-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
                    disabled={loadingAccion}
                >
                    <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                    Volver a Reservas
                </button>
            </div>
        </div>
    );
};

export default PagarReserva;