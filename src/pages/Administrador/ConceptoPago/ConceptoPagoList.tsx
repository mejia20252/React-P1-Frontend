// src/pages/Administrador/ConceptoPago/ConceptoPagoList.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { conceptoPagoApi } from '../../../api/api-concepto-pago';
import type { ConceptoPago } from '../../../types/type-concepto-pago';

const ConceptoPagoList: React.FC = () => {
  const [conceptos, setConceptos] = useState<ConceptoPago[]>([]);
  const [loading, setLoading] = useState(true);
  const [topError, setTopError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const conceptosData = await conceptoPagoApi.getAll();
        setConceptos(conceptosData);
      } catch (error) {
        console.error('Error al cargar conceptos de pago:', error);
        setTopError('No se pudieron cargar los conceptos de pago.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de eliminar este concepto de pago?')) return;

    try {
      await conceptoPagoApi.delete(id);
      setConceptos(conceptos.filter(c => c.id !== id));
    } catch (error) {
      alert('No se pudo eliminar el concepto de pago.');
    }
  };

  const getEstadoBadge = (activo: boolean) => {
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {activo ? 'Activo' : 'Inactivo'}
      </span>
    );
  };

  const getTipoBadge = (esFijo: boolean) => {
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        esFijo ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
      }`}>
        {esFijo ? 'Fijo' : 'Variable'}
      </span>
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Conceptos de Pago</h1>
        <Link
          to="/administrador/conceptos-pago/nuevo"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" /> Nuevo Concepto
        </Link>
      </div>

      {topError && (
        <div className="mb-4 p-3 rounded-md bg-red-100 border border-red-200 text-red-700 text-sm">
          {topError}
        </div>
      )}

      {loading ? (
        <p className="text-gray-600">Cargando conceptos...</p>
      ) : conceptos.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No hay conceptos de pago registrados.</p>
          <Link to="/administrador/conceptos-pago/nuevo" className="text-blue-600 hover:text-blue-800 mt-4 block">
            Crear uno ahora
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto Fijo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {conceptos.map((concepto) => (
                <tr key={concepto.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {concepto.nombre}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {getTipoBadge(concepto.es_fijo)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {concepto.es_fijo ? `$${concepto.monto_fijo}` : '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {getEstadoBadge(concepto.activo)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      to={`/administrador/conceptos-pago/${concepto.id}/editar`}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      <FontAwesomeIcon icon={faEdit} /> Editar
                    </Link>
                    <button
                      onClick={() => handleDelete(concepto.id)}
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

export default ConceptoPagoList;