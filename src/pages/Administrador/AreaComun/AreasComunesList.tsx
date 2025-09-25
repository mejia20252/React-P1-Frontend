'use client';

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faDollarSign, faTimesCircle } from '@fortawesome/free-solid-svg-icons'; // Added faDollarSign and faTimesCircle
import { areaComunApi } from '../../../api/api-area-comun';
import type { AreaComun } from '../../../types/type-area-comun';

const AreasComunesList: React.FC = () => {
  const [areas, setAreas] = useState<AreaComun[]>([]);
  const [loading, setLoading] = useState(true);
  const [topError, setTopError] = useState('');

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

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de eliminar esta área común?')) return;

    try {
      await areaComunApi.delete(id);
      setAreas(areas.filter(area => area.id !== id));
    } catch (error) {
      alert('No se pudo eliminar el área común.');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Áreas Comunes</h1>
        <Link
          to="/administrador/areas-comunes/nuevo"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" /> Nueva Área
        </Link>
      </div>

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
          <Link to="/administrador/areas-comunes/nuevo" className="text-blue-600 hover:text-blue-800 mt-4 block">
            Registrar una ahora
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacidad</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th> {/* ✅ Nuevo encabezado */}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Costo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {areas.map((area) => (
                <tr key={area.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {area.nombre}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {area.capacidad} personas
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm"> {/* ✅ Nueva celda */}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      area.es_de_pago ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      <FontAwesomeIcon icon={area.es_de_pago ? faDollarSign : faTimesCircle} className="mr-1" />
                      {area.es_de_pago ? 'De Pago' : 'Gratis'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${parseFloat(area.costo_alquiler).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      area.estado === 'disponible' ? 'bg-green-100 text-green-800' :
                      area.estado === 'mantenimiento' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {area.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      to={`/administrador/areas-comunes/${area.id}/editar`}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      <FontAwesomeIcon icon={faEdit} /> Editar
                    </Link>
                    <button
                      onClick={() => handleDelete(area.id)}
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

export default AreasComunesList;