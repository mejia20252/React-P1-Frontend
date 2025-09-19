// src/pages/Administrador/Residente/ResidenteList.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../../app/axiosInstance';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import type { Residente } from '../../../types/type-residente';

interface Usuario {
  id: number;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  email: string | null;
}

interface Casa {
  id: number;
  numero_casa: string;
  area: string;
}

const ResidentesList: React.FC = () => {
  const [residentes, setResidentes] = useState<Residente[]>([]);
  const [loading, setLoading] = useState(true);
  const [topError, setTopError] = useState('');
  const [usuariosMap, setUsuariosMap] = useState<Record<number, Usuario>>({});
  const [casasMap, setCasasMap] = useState<Record<number, Casa>>({});

  useEffect(() => {

    const fetchData = async () => {
      setLoading(true);
      try {
        // 👇 SIN /api/ — llamada directa a /residentes/
        const residentesResponse = await axiosInstance.get<Residente[]>('/residentes/');
        setResidentes(residentesResponse.data);

        // 👇 SIN /api/
        const [usuariosData, casasData] = await Promise.all([
          axiosInstance.get<Usuario[]>('/usuarios/'),
          axiosInstance.get<Casa[]>('/casas/'),
        ]);

        const usuariosMap = usuariosData.data.reduce((acc, u) => ({ ...acc, [u.id]: u }), {});
        console.log('datos e usauiors :',usuariosMap)
        const casasMap = casasData.data.reduce((acc, c) => ({ ...acc, [c.id]: c }), {});
        console.log('datos e casas :',casasMap)


        setUsuariosMap(usuariosMap);
        setCasasMap(casasMap);
      } catch (error) {
        console.error('Error al cargar residentes:', error);
        setTopError('No se pudieron cargar los residentes.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Residentes</h1>
        <Link
          to="/administrador/residentes/nuevo"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" /> Nuevo Residente
        </Link>
      </div>

      {topError && (
        <div className="mb-4 p-3 rounded-md bg-red-100 border border-red-200 text-red-700 text-sm">
          {topError}
        </div>
      )}

      {loading ? (
        <p className="text-gray-600">Cargando residentes...</p>
      ) : residentes.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No hay residentes registrados.</p>
          <Link to="/administrador/residentes/nuevo" className="text-blue-600 hover:text-blue-800 mt-4 block">
            Agregar uno ahora
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Casa</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {residentes.map((residente) => {
                const usuario = usuariosMap[residente.usuario];
                const casa = casasMap[residente.casa];

                return (
                  <tr key={residente.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {usuario ? `${usuario.nombre} ${usuario.apellido_paterno}` : 'Usuario eliminado'}
                      </div>
                      {usuario?.email && (
                        <div className="text-sm text-gray-500">{usuario.email}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {casa ? `${casa.numero_casa} - ${casa.area}` : 'Casa eliminada'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        residente.rol_residencia === 'propietario' ? 'bg-green-100 text-green-800' :
                        residente.rol_residencia === 'inquilino' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {residente.rol_residencia === 'propietario' ? 'Propietario' :
                         residente.rol_residencia === 'inquilino' ? 'Inquilino' : 'Familiar'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(residente.fecha_mudanza).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        to={`/administrador/residentes/${residente.id}/editar`}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={async () => {
                          if (window.confirm('¿Estás seguro de eliminar este residente?')) {
                            try {
                              await axiosInstance.delete(`/residentes/${residente.id}/`); // 👈 SIN /api/
                              window.location.reload();
                            } catch (err) {
                              alert('No se pudo eliminar el residente.');
                            }
                          }
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ResidentesList;