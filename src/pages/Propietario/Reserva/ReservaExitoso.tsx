import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const ReservaExitoso: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        // You can still verify the session_id here if needed
//        const params = new URLSearchParams(location.search);
 //       const sessionId = params.get('session_id'); // This line remains if you use session_id

        const timer = setTimeout(() => {
            navigate('/propietario/reservas');
        }, 4000); // 4000 milliseconds = 4 seconds

        // Cleanup the timer if the component unmounts
        return () => clearTimeout(timer);
    }, [location, navigate]); // Add location to dependency array if you use sessionId

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 p-4">
            <FontAwesomeIcon
                icon={faCheckCircle}
                size="5x"
                className="text-green-500 mb-6 animate-bounce"
            />
            <h1 className="text-3xl font-bold text-green-800 mb-4">¡Pago Exitoso!</h1>
            <p className="text-lg text-green-700 text-center">
                Tu pago ha sido procesado correctamente.
            </p>
            <p className="text-md text-green-600 mt-2">
                Serás redirigido a tus cuotas en 4 segundos.
            </p>
        </div>
    );
};

export default ReservaExitoso;