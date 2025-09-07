import React from 'react';
import { Link } from 'react-router-dom';

const Welcome: React.FC = () => {
  return (
    <div className="bg-red-900 p-4">
      <h1 className="bg-red-400 p-2 text-lg font-bold">Bienvenido</h1>
      <p>Nos alegra tenerte aquí. Disfruta tu experiencia.</p>
      <Link
        to="/login"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-red-600 inline-block mt-4 text-xl"
      >
        Ir al Login
      </Link>
      <h1 className='bg-red-200 mt-4 p-2'>
        Otro texto aquí
      </h1>
    </div>
  );
};

export default Welcome;
