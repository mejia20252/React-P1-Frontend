import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';

const ReservaCancelado: React.FC = () => {
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/propietario/reservas', { replace: true });
        }, 4000); // 4000 milliseconds = 4 seconds

        // Cleanup the timer if the component unmounts
        return () => clearTimeout(timer);
    }, [navigate]); // Add navigate to dependency array

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 p-4 relative">
            <FontAwesomeIcon
                icon={faTimesCircle}
                size="5x"
                className="text-red-500 mb-6 animate-shake"
            />
            <h1 className="text-3xl font-bold text-red-800 mb-4">Pago Cancelado</h1>
            <p className="text-lg text-red-700 text-center">
                Has cancelado el proceso de pago.
            </p>
            <p className="text-md text-red-600 mt-2">
                Puedes intentar de nuevo en cualquier momento.
            </p>
            <p className="text-md text-red-600 mt-2">
                Serás redirigido a tus cuotas en 4 segundos.
            </p>
        </div>
    );
};

export default ReservaCancelado;