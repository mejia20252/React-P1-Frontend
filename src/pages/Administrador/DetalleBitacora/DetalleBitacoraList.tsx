// src/pages/Admin/Bitacora/BitacoraDetail.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../../app/axiosInstance'; // Importar la instancia de axios configurada

// --- Tipos internos ---
interface CustomUser {
  id: number;
  username: string;
  email: string;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  // Añade aquí cualquier otro campo relevante del usuario
}

interface Bitacora {
  id: number;
  login: string;
  logout: string | null;
  usuario: number; // Solo el ID del usuario
  ip: string | null;
  device: string | null;
}

interface DetalleBitacora {
  id: number;
  bitacora: number; // Solo el ID de la bitácora
  accion: string;
  fecha: string;
  tabla: string;
}

const BitacoraDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [bitacora, setBitacora] = useState<Bitacora | null>(null);
  const [detalles, setDetalles] = useState<DetalleBitacora[]>([]);
  const [usuario, setUsuario] = useState<CustomUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        if (id) {
          const bitacoraId = +id; // Convertir id a número

          // Fetch Bitacora
          const bitacoraResponse = await axiosInstance.get<Bitacora>(`/bitacoras/${bitacoraId}/`);
          const fetchedBitacora = bitacoraResponse.data;

          // Fetch Detalles de Bitacora
          const detallesResponse = await axiosInstance.get<DetalleBitacora[]>('/detalle-bitacoras/');
          const allDetalles = detallesResponse.data;

          // Fetch Usuarios
          const usuariosResponse = await axiosInstance.get<CustomUser[]>('/usuarios/');
          const allUsers = usuariosResponse.data;

          setBitacora(fetchedBitacora);
          setDetalles(allDetalles.filter(detalle => detalle.bitacora === bitacoraId));

          const foundUser = allUsers.find(u => u.id === fetchedBitacora.usuario);
          setUsuario(foundUser || null);
        }
      } catch (err) {
        console.error("Failed to load bitacora details:", err);
        setError("No se pudieron cargar los detalles de la bitácora. Inténtalo de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-gray-700 text-lg">Cargando detalles de bitácora...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-md max-w-2xl mx-auto my-8">
        <p className="font-bold mb-2">Error al cargar:</p>
        <p>{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Volver
        </button>
      </div>
    );
  }

  if (!bitacora) {
    return (
      <div className="p-6 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-lg shadow-md max-w-2xl mx-auto my-8">
        <p className="font-bold mb-2">Bitácora no encontrada.</p>
        <p>Parece que el registro de bitácora solicitado no existe o fue eliminado.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition"
        >
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition duration-200 ease-in-out flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Volver a Sesiones
        </button>

        <h1 className="text-3xl font-extrabold text-gray-900 mb-6 border-b-2 pb-2">
          Detalle de Sesión de {usuario?.username || 'Usuario Desconocido'}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 mb-8">
          <div>
            <p className="text-gray-600 text-sm">Fecha y Hora de Login:</p>
            <p className="text-gray-900 font-medium text-lg">{new Date(bitacora.login).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Fecha y Hora de Logout:</p>
            <p className="text-gray-900 font-medium text-lg">
              {bitacora.logout ? new Date(bitacora.logout).toLocaleString() : 'Sesión Activa'}
            </p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Dirección IP:</p>
            <p className="text-gray-900 font-medium text-lg">{bitacora.ip ?? 'No registrada'}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Dispositivo:</p>
            <p className="text-gray-900 font-medium text-lg">{bitacora.device ?? 'No registrado'}</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 pb-2">Acciones Realizadas durante la Sesión</h2>

        {detalles.length === 0 ? (
          <div className="bg-blue-50 border-l-4 border-blue-400 text-blue-700 p-4 rounded-md">
            <p className="font-semibold">No hay acciones registradas para esta sesión.</p>
            <p className="text-sm">El usuario no realizó operaciones detalladas durante este periodo.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Fecha y Hora
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Acción
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Tabla Afectada
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {detalles.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {new Date(d.fecha).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{d.accion}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{d.tabla}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BitacoraDetail;