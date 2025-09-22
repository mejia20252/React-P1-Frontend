'use client';

import React, { useEffect, useState } from 'react';
import { mascotaApi } from '../../../api/api-mascota';
import type { MascotaRaw } from '../../../types/type-mascota';
import { normalizeEspecie } from '../../../types/type-mascota';

const MascotaList: React.FC = () => {
  const [mascotas, setMascotas] = useState<MascotaRaw[]>([]);
  const [loading, setLoading] = useState(true);
  const [topError, setTopError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const mascotasData = await mascotaApi.getAllRaw();
        setMascotas(mascotasData);
      } catch (error) {
        console.error('Error al cargar mascotas:', error);
        setTopError('No se pudieron cargar las mascotas.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mascotas Registradas</h1>
      </div>

      {topError && (
        <div className="mb-4 p-3 rounded-md bg-red-100 border border-red-200 text-red-700 text-sm">
          {topError}
        </div>
      )}

      {loading ? (
        <p className="text-gray-600">Cargando mascotas...</p>
      ) : mascotas.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No hay mascotas registradas.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Especie</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Dueño</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mascotas.map(mascota => (
                <tr key={mascota.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {mascota.nombre}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {normalizeEspecie(mascota.especie).charAt(0).toUpperCase() +
                      normalizeEspecie(mascota.especie).slice(1)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ID: {mascota.dueno}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MascotaList;