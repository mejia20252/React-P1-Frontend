import React, { useEffect, useState } from 'react';
import { type Cuota } from '../../../types/type-propietario-cuota'; // Asegúrate de que esta ruta sea correcta
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { loadStripe } from '@stripe/stripe-js';
import api from '../../../app/axiosInstance'; // Importa tu instancia configurada de axios

// Asegúrate de usar tu clave pública de Stripe (pk_test_...)
// Idealmente, esto debería venir de una variable de entorno.
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '');
const MisCuotas: React.FC = () => {
    const [cuotas, setCuotas] = useState<Cuota[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [loadingAccion, setLoadingAccion] = useState<number | null>(null);

    useEffect(() => {
        const loadCuotas = async () => {
            try {
                setLoading(true);
                // No necesitas el token ni la configuración de headers aquí, el interceptor de `api` lo maneja
                const { data } = await api.get('/cuotas/mis-cuotas/'); 
                setCuotas(data.results || data); // Ajusta según la estructura de tu respuesta
            } catch (err) {
                setError('No se pudieron cargar tus cuotas. Intenta más tarde.');
                console.error('Error al cargar cuotas:', err);
            } finally {
                setLoading(false);
            }
        };

        loadCuotas();
    }, []);

    const formatDate = (dateString: string | null): string => {
        if (!dateString) return '—';
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const formatCurrency = (amount: string): string => {
        const num = parseFloat(amount);
        return new Intl.NumberFormat('es-BO', {
            style: 'currency',
            currency: 'USD',
            currencyDisplay: 'narrowSymbol',
        }).format(num);
    };

    const getEstadoBadge = (estado: string) => {
        const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
        switch (estado) {
            case 'pagada':
                return <span className={`${baseClasses} bg-green-100 text-green-800`}>Pagada</span>;
            case 'pendiente':
                return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>Pendiente</span>;
            case 'vencida':
                return <span className={`${baseClasses} bg-red-100 text-red-800`}>Vencida</span>;
            default:
                return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>{estado}</span>;
        }
    };

    const handlePagarConStripe = async (cuotaId: number) => {
        setLoadingAccion(cuotaId);
        try {
            const stripe = await stripePromise;
            if (!stripe) {
                console.error('Stripe.js no cargó correctamente.');
                return;
            }

            // No necesitas el token ni la configuración de headers aquí, el interceptor de `api` lo maneja
            const response = await api.post(
                '/pagos/crear_sesion_stripe/', // Ajusta esta URL a tu API
                {
                    tipo_objeto: 'cuota',
                    objeto_id: cuotaId,
                    success_url: window.location.origin + '/propietario/cuota-pago-exitoso', 
                    cancel_url: window.location.origin + '/propietario/cuota-pago-cancelado',
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
            setLoadingAccion(null);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
                <div className="text-center">
                    <FontAwesomeIcon icon={faSpinner} spin size="2x" className="text-blue-600 mb-4" />
                    <p className="text-gray-600">Cargando tus cuotas...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md max-w-lg text-center">
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Mis Cuotas</h1>

                {cuotas.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-8 text-center">
                        <p className="text-gray-600">No tienes cuotas registradas.</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Período
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Vencimiento
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Monto
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Estado
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Casa
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Acción
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {cuotas.map((cuota) => (
                                        <tr key={cuota.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {formatDate(cuota.periodo)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {formatDate(cuota.fecha_vencimiento)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {formatCurrency(cuota.monto)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getEstadoBadge(cuota.estado)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                #{cuota.casa_numero_casa}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                {cuota.estado !== 'pagada' && (
                                                    <button
                                                        onClick={() => handlePagarConStripe(cuota.id)}
                                                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm transition"
                                                        disabled={loadingAccion === cuota.id}
                                                    >
                                                        {loadingAccion === cuota.id ? (
                                                            <FontAwesomeIcon icon={faSpinner} spin />
                                                        ) : (
                                                            'Pagar Cuota'
                                                        )}
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MisCuotas;