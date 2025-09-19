// src/pages/Perfil.tsx
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEffect } from 'react';
import axiosInstance from '../app/axiosInstance';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faUserCircle } from '@fortawesome/free-solid-svg-icons';


async function getUsuario(id: number) {
  try {
    const { data } = await axiosInstance.get(`/usuarios/me/`);
  } catch (error) {
    console.error('Error al obtener el usuario:', error);
  }
}

export default function Perfil() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Si el usuario existe, podemos llamar a la API
    if (user?.id) {
      getUsuario(user.id);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-600">Cargando perfil...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-gray-50">
        <p className="mb-4 text-gray-600">No hay una sesión activa.</p>
        <NavLink
          to="/login"
          className="px-4 py-2 text-sm font-medium text-white transition-colors duration-200 rounded-md shadow-sm bg-blue-600 hover:bg-blue-700"
        >
          Iniciar sesión
        </NavLink>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col items-center">
      <div className="w-full max-w-2xl">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center px-4 py-2 mb-6 text-sm font-medium text-gray-700 transition-colors duration-200 rounded-md hover:bg-gray-200 focus:outline-none"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          Atrás
        </button>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex flex-col items-center mb-6">
            <FontAwesomeIcon icon={faUserCircle} className="text-blue-600 text-6xl mb-4" />
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight text-center">
              Perfil de Usuario
            </h1>
            <p className="text-sm font-medium text-gray-500 mt-1">{user.rol?.nombre}</p>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-100 rounded-lg p-5">
              <h2 className="font-semibold text-lg text-gray-800 mb-3">Información personal</h2>
              <dl className="space-y-3">
                <div className="flex justify-between items-center border-b pb-2">
                  <dt className="text-gray-500">ID</dt>
                  <dd className="font-medium text-gray-900">{user.id}</dd>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <dt className="text-gray-500">Nombre de usuario</dt>
                  <dd className="font-medium text-gray-900 break-words">{user.username}</dd>
                </div>
                <div className="flex justify-between items-center">
                  <dt className="text-gray-500">ID del Rol</dt>
                  <dd className="font-medium text-gray-900">{user.rol?.id}</dd>
                </div>
              </dl>
            </div>
            
            <NavLink
              to="/administrador/cambiar-contra"
              className="flex justify-center items-center w-full px-4 py-3 text-sm font-medium text-white transition-colors duration-200 rounded-md shadow-sm bg-blue-600 hover:bg-blue-700"
            >
              Cambiar contraseña
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}