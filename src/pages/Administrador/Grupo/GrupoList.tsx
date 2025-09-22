// src/pages/Administrador/Grupo/GrupoList.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import axiosInstance from '../../../app/axiosInstance';
import type { Group } from '../../../types/type-group';

const GrupoList: React.FC = () => {
  const [grupos, setGrupos] = useState<Group[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const loadGrupos = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get('/grupos/');
      console.log('data is ',data)
      setGrupos(data);
    } catch (error) {
      console.log('Error al cargar grupos', error);
      setError('No se pudieron cargar los grupos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGrupos();
  }, []);

  const handleEdit = (id: number) => {
    navigate(`/administrador/grupos/${id}/edit`);
  };

  const handleDelete = async (id: number) => {
    try {
      if (window.confirm('¿Estás seguro de que quieres eliminar este grupo?')) {
        await axiosInstance.delete(`/grupos/${id}/`);
        loadGrupos();
      }
    } catch (error) {
      console.error('Error al eliminar grupo', error);
      setError('No se pudo eliminar el grupo.');
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:gap-0">
        <h2 className="text-3xl font-bold text-gray-800">Grupos</h2>
        <button
          onClick={() => navigate('/administrador/grupos/new')}
          className="flex items-center px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Nuevo Grupo
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-md bg-red-100 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <p className="text-gray-500 text-lg">Cargando grupos...</p>
        </div>
      ) : grupos.length === 0 ? (
        <div className="flex justify-center items-center h-48">
          <p className="text-gray-500 text-lg">No hay grupos para mostrar.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {grupos.map((grupo) => (
              <li key={grupo.id} className="p-4 sm:p-6 hover:bg-gray-50 transition duration-150 ease-in-out">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div className="flex flex-col mb-2 sm:mb-0">
                    <span className="text-xs font-semibold uppercase text-gray-500">ID: {grupo.id}</span>
                    <span className="text-xl font-semibold text-gray-900">{grupo.name}</span>
                    <span className="text-sm text-gray-600 mt-1">
                      Permisos: {grupo.permissions.length}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(grupo.id)}
                      className="flex items-center px-4 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition duration-300"
                      aria-label={`Editar grupo ${grupo.name}`}
                    >
                      <FontAwesomeIcon icon={faEdit} className="mr-2 hidden sm:block" />
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(grupo.id)}
                      className="flex items-center px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition duration-300"
                      aria-label={`Eliminar grupo ${grupo.name}`}
                    >
                      <FontAwesomeIcon icon={faTrashAlt} className="mr-2 hidden sm:block" />
                      Eliminar
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default GrupoList;