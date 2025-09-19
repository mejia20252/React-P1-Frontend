// src/pages/Administrador/Cuota/CuotaList.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { cuotaApi } from '../../../api/api-cuota';
import type { Cuota } from '../../../types/type-cuota';
import { casaApi } from '../../../api/api-casa';
import { conceptoPagoApi } from '../../../api/api-concepto-pago';
import type { Casa } from '../../../types/type-casa';
import type { ConceptoPago } from '../../../types/type-concepto-pago';
import type { EstadoCuota } from '../../../types/type-cuota';
const CuotaList: React.FC = () => {
  const [cuotas, setCuotas] = useState<Cuota[]>([]);
  const [casas, setCasas] = useState<Record<number, Casa>>({});
  const [conceptos, setConceptos] = useState<Record<number, ConceptoPago>>({});
  const [loading, setLoading] = useState(true);
  const [topError, setTopError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [cuotasData, casasData, conceptosData] = await Promise.all([
          cuotaApi.getAll(),
          casaApi.getAll(),
          conceptoPagoApi.getAll(),
        ]);

        setCuotas(cuotasData);

        const casasMap = casasData.reduce((acc, casa) => {
          acc[casa.id] = casa;
          return acc;
        }, {} as Record<number, Casa>);
        setCasas(casasMap);

        const conceptosMap = conceptosData.reduce((acc, concepto) => {
          acc[concepto.id] = concepto;
          return acc;
        }, {} as Record<number, ConceptoPago>);
        setConceptos(conceptosMap);

      } catch (error) {
        console.error('Error al cargar cuotas:', error);
        setTopError('No se pudieron cargar las cuotas.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de eliminar esta cuota?')) return;

    try {
      await cuotaApi.delete(id);
      setCuotas(cuotas.filter(c => c.id !== id));
    } catch (error) {
      alert('No se pudo eliminar la cuota.');
    }
  };

 const getEstadoBadge = (estado: EstadoCuota) => {
  const classes: Record<EstadoCuota, string> = {
    pendiente: 'bg-yellow-100 text-yellow-800',
    pagada: 'bg-green-100 text-green-800',
    vencida: 'bg-red-100 text-red-800',
    cancelada: 'bg-gray-100 text-gray-800',
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${classes[estado]}`}>
      {estado.charAt(0).toUpperCase() + estado.slice(1)}
    </span>
  );
};

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Cuotas</h1>
        <Link
          to="/administrador/cuotas/nuevo"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" /> Nueva Cuota
        </Link>
      </div>

      {topError && (
        <div className="mb-4 p-3 rounded-md bg-red-100 border border-red-200 text-red-700 text-sm">
          {topError}
        </div>
      )}

      {loading ? (
        <p className="text-gray-600">Cargando cuotas...</p>
      ) : cuotas.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No hay cuotas registradas.</p>
          <Link to="/administrador/cuotas/nuevo" className="text-blue-600 hover:text-blue-800 mt-4 block">
            Crear una ahora
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Concepto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Casa</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Período</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vence</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {cuotas.map((cuota) => (
                <tr key={cuota.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {cuota.concepto_nombre || `ID: ${cuota.concepto}`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {cuota.casa_numero || `ID: ${cuota.casa}`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${parseFloat(cuota.monto).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(cuota.periodo).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(cuota.fecha_vencimiento).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {getEstadoBadge(cuota.estado)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      to={`/administrador/cuotas/${cuota.id}/editar`}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      <FontAwesomeIcon icon={faEdit} /> Editar
                    </Link>
                    <button
                      onClick={() => handleDelete(cuota.id)}
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

export default CuotaList;