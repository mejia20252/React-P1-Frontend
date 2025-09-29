// src/pages/Administrador/AreaComun/AreasComunesList.tsx
'use client';

import React, { useEffect, useState } from 'react';
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import { faCalendar } from '@fortawesome/free-solid-svg-icons'; // Ícono de reservar
import { areaComunApi } from '../../../api/api-area-comun';
import type { AreaComun } from '../../../types/type-area-comun';
//import { useNavigate } from 'react-router-dom';

const AreasComunesList: React.FC = () => {
  const [areas, setAreas] = useState<AreaComun[]>([]);
  const [loading, setLoading] = useState(true);
  const [topError, setTopError] = useState('');
//    const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await areaComunApi.getAll();
        setAreas(data);
      } catch (error) {
        console.error('Error al cargar áreas comunes:', error);
        setTopError('No se pudieron cargar las áreas comunes.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Placeholder: función vacía por ahora

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-xl sm:text-2xl font-bold mb-6">Áreas Comunes</h1>

      {topError && (
        <div className="mb-4 p-3 rounded-md bg-red-100 border border-red-200 text-red-700 text-sm">
          {topError}
        </div>
      )}

      {loading ? (
        <p className="text-gray-600">Cargando áreas comunes...</p>
      ) : areas.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No hay áreas comunes registradas.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6">Nombre</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6">Capacidad</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6">Costo</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6">Estado</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {areas.map((area) => (
                <tr key={area.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 sm:px-6">
                    {area.nombre}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 sm:px-6">
                    {area.capacidad} personas
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 sm:px-6">
                    ${parseFloat(area.costo_alquiler).toFixed(2)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm sm:px-6">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      area.estado === 'disponible' ? 'bg-green-100 text-green-800' :
                      area.estado === 'mantenimiento' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {area.estado}
                    </span>
                  </td>
                  {/*
                  /<td className="px-4 py-4 whitespace-nowrap text-sm font-medium sm:px-6">
                    <button
                      onClick={() => handleReservar(area.id)}
                      className="bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1 rounded-md text-xs font-medium transition flex items-center gap-1"
                      disabled={area.estado !== 'disponible'} // Solo si está disponible
                    >
                      <FontAwesomeIcon icon={faCalendar} size="sm" />
                      <span className="hidden sm:inline">Reservar</span>
                      <span className="sm:hidden"></span> 
                    </button> 
                  </td>*/}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AreasComunesList;