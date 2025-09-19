// src/pages/Administrador/Comunicado/ComunicadoList.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
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

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de eliminar este comunicado?')) return;

    try {
      await comunicadoApi.delete(id);
      setComunicados(comunicados.filter(c => c.id !== id));
    } catch (error) {
      alert('No se pudo eliminar el comunicado.');
    }
  };

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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Comunicados</h1>
        <Link
          to="/administrador/comunicados/nuevo"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" /> Nuevo Comunicado
        </Link>
      </div>

      {topError && (
        <div className="mb-4 p-3 rounded-md bg-red-100 border border-red-200 text-red-700 text-sm">
          {topError}
        </div>
      )}

      {loading ? (
        <p className="text-gray-600">Cargando comunicados...</p>
      ) : comunicados.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No hay comunicados registrados.</p>
          <Link to="/administrador/comunicados/nuevo" className="text-blue-600 hover:text-blue-800 mt-4 block">
            Crear uno ahora
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destino</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Publicado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Creado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {comunicados.map((comunicado) => (
                <tr key={comunicado.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {comunicado.titulo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getDestino(comunicado)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {getEstadoBadge(comunicado.estado)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {comunicado.fecha_publicacion ? new Date(comunicado.fecha_publicacion).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(comunicado.fecha_creacion).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      to={`/administrador/comunicados/${comunicado.id}/editar`}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      <FontAwesomeIcon icon={faEdit} /> Editar
                    </Link>
                    <button
                      onClick={() => handleDelete(comunicado.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FontAwesomeIcon icon={faTrash} /> Eliminar
                    </button>
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

export default ComunicadoList;