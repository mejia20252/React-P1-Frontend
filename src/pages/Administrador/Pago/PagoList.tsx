// src/pages/Administrador/Pago/PagoList.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { pagoApi } from '../../../api/api-pago';
import type { Pago, MetodoPago } from '../../../types/type-pago';

const PagoList: React.FC = () => {
  const [pagos, setPagos] = useState<Pago[]>([]);
  // ✅ Opcional: si planeas usar conceptos/usuarios en detalle, déjalos. Si no, puedes eliminarlos.
  // const [conceptos, setConceptos] = useState<Record<number, ConceptoPago>>({});
  // const [usuarios, setUsuarios] = useState<Record<number, Usuario>>({});
  const [loading, setLoading] = useState(true);
  const [topError, setTopError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [pagosData, /*conceptosData, usuariosData*/] = await Promise.all([
          pagoApi.getAll(),
          // conceptoPagoApi.getAll(),
          // usuarioApi.fetchUsuarios(), // ✅ Usamos fetchUsuarios en lugar de getAll si no existe getAll
        ]);

        setPagos(pagosData);

        // ✅ Opcional: si necesitas mapear conceptos o usuarios, descomenta esto:
        /*
        const conceptosMap = conceptosData.reduce<Record<number, ConceptoPago>>((acc, concepto) => {
          acc[concepto.id] = concepto;
          return acc;
        }, {});
        setConceptos(conceptosMap);

        const usuariosMap = usuariosData.reduce<Record<number, Usuario>>((acc, usuario) => {
          acc[usuario.id] = usuario;
          return acc;
        }, {});
        setUsuarios(usuariosMap);
        */

      } catch (error) {
        console.error('Error al cargar pagos:', error);
        setTopError('No se pudieron cargar los pagos.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de eliminar este pago?')) return;

    try {
      await pagoApi.delete(id);
      setPagos(pagos.filter(p => p.id !== id));
    } catch (error) {
      alert('No se pudo eliminar el pago.');
    }
  };

  const getMetodoPagoBadge = (metodo: MetodoPago) => {
    // ✅ Tipado explícito del objeto classes
    const classes: Record<MetodoPago, string> = {
      tarjeta: 'bg-blue-100 text-blue-800',
      transferencia: 'bg-green-100 text-green-800',
      efectivo: 'bg-yellow-100 text-yellow-800',
      qr: 'bg-purple-100 text-purple-800',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${classes[metodo]}`}>
        {metodo.charAt(0).toUpperCase() + metodo.slice(1)}
      </span>
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Pagos</h1>
        <Link
          to="/administrador/pagos/nuevo"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" /> Nuevo Pago
        </Link>
      </div>

      {topError && (
        <div className="mb-4 p-3 rounded-md bg-red-100 border border-red-200 text-red-700 text-sm">
          {topError}
        </div>
      )}

      {loading ? (
        <p className="text-gray-600">Cargando pagos...</p>
      ) : pagos.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No hay pagos registrados.</p>
          <Link to="/administrador/pagos/nuevo" className="text-blue-600 hover:text-blue-800 mt-4 block">
            Registrar uno ahora
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Concepto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Método</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pagado por</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pagos.map((pago) => (
                <tr key={pago.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {pago.concepto_nombre || `ID: ${pago.concepto}`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${parseFloat(pago.monto).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {getMetodoPagoBadge(pago.metodo_pago)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {pago.pagado_por_email || '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(pago.fecha_pago).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      to={`/administrador/pagos/${pago.id}/editar`}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      <FontAwesomeIcon icon={faEdit} /> Editar
                    </Link>
                    <button
                      onClick={() => handleDelete(pago.id)}
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

export default PagoList;