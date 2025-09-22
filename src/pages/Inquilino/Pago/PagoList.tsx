import React, { useEffect, useState } from 'react';
import api from '../../../app/axiosInstance';
export interface Pago {
  id: number;
  usuario: number;
  usuario_nombre: string | null;
  tipo_pago: 'cuota' | 'reserva' | 'multa' | 'gasto_comun' | 'otro';
  tipo_pago_display: string;
  monto: string;
  fecha_pago: string;
  metodo_pago: 'tarjeta' | 'transferencia' | 'efectivo' | 'qr';
  metodo_pago_display: string;
  referencia: string | null;
  comprobante: string | null;
  observaciones: string | null;
  objeto_relacionado_tipo: string | null;
  objeto_relacionado_id: number | null;
  objeto_relacionado_descripcion: string | null;
}

import { toast } from 'react-toastify';


const PagoList: React.FC = () => {
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPagos = async () => {
      try {
        setLoading(true);
        const response = await api.get<Pago[]>('/pagos/');
        setPagos(response.data);
      } catch (err) {
        console.error("Error fetching payments:", err);
        setError("No se pudieron cargar los pagos. Inténtalo de nuevo más tarde.");
        toast.error("Error al cargar los pagos.");
      } finally {
        setLoading(false);
      }
    };

    fetchPagos();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100"></div>
        <p className="ml-4 text-gray-700 dark:text-gray-300">Cargando pagos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-4 rounded-md">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center"> {/* CAMBIO AQUÍ */}
        Historial de Pagos
      </h1>

      {pagos.length === 0 ? (
        <div className="text-center text-gray-600 p-8 bg-white rounded-lg shadow-md">
          <p className="text-lg">No hay pagos registrados.</p>
          <p className="text-sm mt-2">Cuando realices un pago, aparecerá aquí.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pagos.map((pago) => (
            <div
              key={pago.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-200"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-lg font-semibold text-gray-800"> {/* CAMBIO AQUÍ */}
                  {pago.tipo_pago_display}
                </span>
                <span className="text-2xl font-bold text-indigo-600"> {/* CAMBIO AQUÍ */}
                  ${parseFloat(pago.monto).toFixed(2)}
                </span>
              </div>

              <p className="text-gray-600 text-sm mb-2"> {/* CAMBIO AQUÍ */}
                <span className="font-medium">Fecha:</span> {new Date(pago.fecha_pago).toLocaleDateString()}
              </p>
              <p className="text-gray-600 text-sm mb-2"> {/* CAMBIO AQUÍ */}
                <span className="font-medium">Método:</span> {pago.metodo_pago_display}
              </p>
              {pago.usuario_nombre && (
                <p className="text-gray-600 text-sm mb-2"> {/* CAMBIO AQUÍ */}
                  <span className="font-medium">Usuario:</span> {pago.usuario_nombre}
                </p>
              )}
              {pago.referencia && (
                <p className="text-gray-600 text-sm mb-2 truncate"> {/* CAMBIO AQUÍ */}
                  <span className="font-medium">Ref:</span> {pago.referencia}
                </p>
              )}
              {pago.objeto_relacionado_descripcion && (
                <p className="text-gray-700 text-sm mb-2"> {/* CAMBIO AQUÍ */}
                  <span className="font-medium">Detalle:</span> {pago.objeto_relacionado_descripcion}
                </p>
              )}
              {pago.observaciones && (
                <p className="text-gray-600 text-sm italic mt-2"> {/* CAMBIO AQUÍ */}
                  "{pago.observaciones}"
                </p>
              )}

              {pago.comprobante && (
                <div className="mt-4 text-right">
                  <a
                    href={pago.comprobante}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 2h2v2H6V6zm5-1.723L12.723 7H11V5.277zM10 12h4v2h-4v-2z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Ver Comprobante
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PagoList;