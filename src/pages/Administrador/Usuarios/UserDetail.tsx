// src/pages/Admin/Users/UserDetail.tsx

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchUser } from '../../../api/user';
import type { CustomUserResponse } from '../../../types/user';
import { toUiError } from '../../../api/error';

const UserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<CustomUserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadUser = async () => {
      if (!id) return;
      try {
        const data = await fetchUser(+id);
        setUser(data);
      } catch (err) {
        const uiError = toUiError(err);
        setError(uiError.message);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [id]);

  if (loading) return <div className="p-6 text-center text-gray-500">Cargando detalle...</div>;
  if (error) return <div className="p-6 text-red-500 bg-red-50 border border-red-200 rounded-lg">{error}</div>;
  if (!user) return <div className="p-6">Usuario no encontrado.</div>;

  const formatDate = (dateStr: string | null | undefined): string => {
    if (!dateStr) return 'No especificado';
    return new Date(dateStr).toLocaleDateString('es-ES');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm"
          >
            ← Volver
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Detalles del Usuario</h1>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header Profile */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 border-b border-gray-200">
            <div className="flex items-center space-x-5">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-2xl font-bold">
                {user.nombre.charAt(0)}{user.apellido_paterno.charAt(0)}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {user.nombre} {user.apellido_paterno} {user.apellido_materno}
                </h2>
                <p className="text-gray-600 mt-1">{user.username}</p>
                {user.email && <p className="text-sm text-gray-500">{user.email}</p>}
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

              {/* Información Personal */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Personal</h3>
                <dl className="space-y-3">
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Rol</dt>
                    <dd className="text-sm font-medium text-gray-900">{user.rol_nombre || 'No asignado'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Sexo</dt>
                    <dd className="text-sm font-medium text-gray-900">
                      {user.sexo === 'M' ? 'Masculino' : user.sexo === 'F' ? 'Femenino' : 'No especificado'}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Fecha de nacimiento</dt>
                    <dd className="text-sm font-medium text-gray-900">{formatDate(user.fecha_nacimiento)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Dirección</dt>
                    <dd className="text-sm font-medium text-gray-900">{user.direccion || 'No especificada'}</dd>
                  </div>
                </dl>
              </div>

            </div>

            {/* Acciones */}
            <div className="mt-10 pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-end gap-3">
              <button
                // UPDATED PATH: now points to the new component
                onClick={() => navigate(`/administrador/usuarios/${id}/cambiar-contrasena`)}
                className="w-full sm:w-auto text-blue-600 hover:text-blue-800 border border-blue-600 hover:border-blue-800 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                Cambiar Contraseña
              </button>
              <button
                onClick={() => navigate(`/administrador/usuarios/${id}/editar`)}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                Editar Usuario
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;