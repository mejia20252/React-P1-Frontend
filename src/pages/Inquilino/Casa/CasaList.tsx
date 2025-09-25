// src/components/InquilinoDashboard.tsx
import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../app/axiosInstance'; // Adjust path as needed
import { toUiError } from '../../../api/error'; // Adjust path as needed
import { toast } from 'react-toastify';
import { FaUser, FaHome, FaCalendarAlt, FaEnvelope, FaBuilding } from 'react-icons/fa';

interface ContratoArrendamiento {
  id: number;
  arrendatario: number;
  arrendatario_nombre_completo: string;
  arrendatario_email: string;
  unidad: number;
  unidad_numero_casa: string;
  unidad_tipo: string;
  propietario: number;
  propietario_nombre_completo: string;
  propietario_email: string;
  fecha_inicio: string;
  fecha_fin: string | null;
  esta_activo: boolean;
}

const CasaList: React.FC = () => {
  const [contratos, setContratos] = useState<ContratoArrendamiento[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContratos = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axiosInstance.get<ContratoArrendamiento[]>('/contratos-arrendamiento/');
        setContratos(response.data);
      } catch (err: unknown) {
        const uiError = toUiError(err);
        setError(uiError.message);
        toast.error(uiError.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContratos();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <p className="ml-4 text-gray-700">Cargando contratos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
        <div className="text-red-600 text-lg font-semibold">Error: {error}</div>
      </div>
    );
  }

  if (contratos.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
        <p className="text-gray-700 text-lg">No se encontraron contratos de arrendamiento activos para este inquilino.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-8 text-center drop-shadow-sm">
        Mis Contratos de Arrendamiento
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contratos.map((contrato) => (
          <div
            key={contrato.id}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200"
          >
            <div className={`p-5 border-b-4 ${contrato.esta_activo ? 'border-green-500' : 'border-red-500'}`}>
              <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
                <FaHome className="mr-3 text-indigo-600" />
                Unidad: {contrato.unidad_numero_casa}
              </h2>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  contrato.esta_activo
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {contrato.esta_activo ? 'Activo' : 'Inactivo'}
              </span>
            </div>

            <div className="p-5 space-y-4 text-gray-700">
              {/* Información del Inquilino */}
              <div className="flex items-center">
                <FaUser className="mr-3 text-indigo-500" />
                <div>
                  <p className="font-semibold">Inquilino:</p>
                  <p>{contrato.arrendatario_nombre_completo}</p>
                  <p className="text-sm text-gray-500 flex items-center">
                    <FaEnvelope className="mr-1" /> {contrato.arrendatario_email}
                  </p>
                </div>
              </div>

              {/* Información del Propietario */}
              <div className="flex items-center">
                <FaBuilding className="mr-3 text-purple-500" />
                <div>
                  <p className="font-semibold">Propietario:</p>
                  <p>{contrato.propietario_nombre_completo}</p>
                  <p className="text-sm text-gray-500 flex items-center">
                    <FaEnvelope className="mr-1" /> {contrato.propietario_email}
                  </p>
                </div>
              </div>

              {/* Información de la Unidad */}
              <div className="flex items-center">
                <FaHome className="mr-3 text-teal-500" />
                <div>
                  <p className="font-semibold">Tipo de Unidad:</p>
                  <p className="capitalize">{contrato.unidad_tipo}</p>
                </div>
              </div>

              {/* Fechas del Contrato */}
              <div className="flex items-center">
                <FaCalendarAlt className="mr-3 text-orange-500" />
                <div>
                  <p className="font-semibold">Periodo:</p>
                  <p>Inicio: {contrato.fecha_inicio}</p>
                  <p>Fin: {contrato.fecha_fin || 'Indefinido'}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CasaList;