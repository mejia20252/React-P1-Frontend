'use client';

import React, { useEffect, useState } from 'react';
import { comunicadoApi } from '../../../api/api-comunicado';
import type { Comunicado } from '../../../types/type-comunicado';
import { casaApi } from '../../../api/api-casa';
import type { Casa } from '../../../types/type-casa';

const ComunicadoList: React.FC = () => {
  const [comunicados, setComunicados] = useState<Comunicado[]>([]);
  const [casas, setCasas] = useState<Record<number, Casa>>({});
  const [loading, setLoading] = useState(true);
  const [topError, setTopError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [comunicadosData, casasData] = await Promise.all([
          comunicadoApi.getAll(),
          casaApi.getAll(),
        ]);

        setComunicados(comunicadosData);

        const casasMap = casasData.reduce((acc, casa) => {
          acc[casa.id] = casa;
          return acc;
        }, {} as Record<number, Casa>);
        setCasas(casasMap);

      } catch (error) {
        console.error('Error al cargar comunicados:', error);
        setTopError('No se pudieron cargar los comunicados.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getDestino = (comunicado: Comunicado) => {
    if (comunicado.casa_destino && casas[comunicado.casa_destino]) {
      return `Casa #${casas[comunicado.casa_destino].numero}`;
    }
    return 'Todo el condominio';
  };

  const getEstadoBadge = (estado: string) => {
    const classes = {
      borrador: 'bg-gray-100 text-gray-800',
      publicado: 'bg-green-100 text-green-800',
      archivado: 'bg-red-100 text-red-800',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${classes[estado as keyof typeof classes]}`}>
        {estado.charAt(0).toUpperCase() + estado.slice(1)}
      </span>
    );
  };

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Comunicados</h1>
      </div>

      {topError && (
        <div className="mb-4 p-3 rounded-md bg-red-100 border border-red-200 text-red-700 text-sm" role="alert">
          {topError}
        </div>
      )}

      {loading ? (
        <p className="text-gray-600 text-center py-8">Cargando comunicados...</p>
      ) : comunicados.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-500 text-lg">No hay comunicados registrados.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {comunicados.map((comunicado) => (
            <div key={comunicado.id} className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-2 truncate">{comunicado.titulo}</h2>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Destino:</span> {getDestino(comunicado)}
              </p>
              <p className="text-sm text-gray-600 mb-2 flex items-center">
                <span className="font-medium mr-2">Estado:</span> {getEstadoBadge(comunicado.estado)}
              </p>
              <div className="text-xs text-gray-500 pt-2 border-t border-gray-100 mt-3">
                <p>Publicado: {comunicado.fecha_publicacion ? new Date(comunicado.fecha_publicacion).toLocaleDateString() : '—'}</p>
                <p>Creado: {new Date(comunicado.fecha_creacion).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ComunicadoList;