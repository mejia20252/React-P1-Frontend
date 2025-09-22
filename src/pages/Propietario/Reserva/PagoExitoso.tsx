import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const PagoExitoso: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        // Puedes verificar el session_id aquí si lo necesitas para mostrar detalles
        const params = new URLSearchParams(location.search);
        const sessionId = params.get('session_id');

        // Opcional: Podrías hacer una llamada a tu backend para verificar
        // el estado del pago usando el sessionId para mayor seguridad.
        // Pero el webhook ya se encarga de actualizar el estado en el backend.

        setTimeout(() => {
            navigate('/propietario/reservas'); // Redirige al usuario de vuelta a sus cuotas
        }, 5000); // Redirige después de 5 segundos
    }, [location, navigate]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 p-4">
            <FontAwesomeIcon icon={faCheckCircle} size="5x" className="text-green-500 mb-6 animate-bounce" />
            <h1 className="text-3xl font-bold text-green-800 mb-4">¡Pago Exitoso!</h1>
            <p className="text-lg text-green-700 text-center">
                Tu pago ha sido procesado correctamente.
            </p>
            <p className="text-md text-green-600 mt-2">
                Serás redirigido a tus cuotas en breve.
            </p>
            {/* Opcional: Mostrar sessionId para depuración */}
            {/* <p className="text-sm text-gray-500 mt-4">Session ID: {new URLSearchParams(location.search).get('session_id')}</p> */}
        </div>
    );
};

export default PagoExitoso;