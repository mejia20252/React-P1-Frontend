import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../app/axiosInstance';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { toUiError } from '../../../api/error';

// Definición de tipos para PerfilTrabajador dentro de este archivo
interface PerfilTrabajador {
  id: number;
  usuario: number;
  usuario_nombre_completo: string;
  usuario_email: string;
  usuario_username: string;
  especialidades: string[];
  activo: boolean;
  fecha_contratacion: string; // ISO date string
  salario: string | null; // Decimal string
  horario_laboral: string | null;
  supervisor: number | null;
  supervisor_nombre_completo: string | null;
  supervisor_email: string | null;
  observaciones: string | null;
}

const PerfilTrabajadorList: React.FC = () => {
  const [perfiles, setPerfiles] = useState<PerfilTrabajador[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const fetchPerfilesTrabajador = async (): Promise<PerfilTrabajador[]> => {
    try {
      const response = await axiosInstance.get<PerfilTrabajador[]>('/perfiles-trabajador/');
      return response.data;
    } catch (error) {
      console.error('Error al cargar perfiles de trabajador', error);
      const uiError = toUiError(error);
      toast.error(uiError.message || 'Error al cargar perfiles de trabajador.');
      return [];
    }
  };

  const loadPerfiles = async () => {
    setLoading(true);
    const data = await fetchPerfilesTrabajador();
    setPerfiles(data);
    setLoading(false);
  };

  useEffect(() => {
    loadPerfiles();
  }, []);

  const handleEdit = (id: number) => {
    navigate(`/perfiltrabajador/${id}/editar`);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este perfil de trabajador?')) {
      return;
    }
    try {
      await axiosInstance.delete(`/perfiles-trabajador/${id}/`);
      toast.success('Perfil de trabajador eliminado exitosamente.');
      loadPerfiles(); // Recargar la lista después de eliminar
    } catch (error) {
      console.error('Error al eliminar perfil de trabajador', error);
      const uiError = toUiError(error);
      toast.error(uiError.message || 'Error al eliminar el perfil de trabajador.');
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:gap-0">
        <h2 className="text-3xl font-bold text-gray-800">Perfiles de Trabajador</h2>
        <button
          onClick={() => navigate('/administrador/perfiltrabajador/nuevo')}
          className="flex items-center px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Nuevo Perfil
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <p className="text-gray-500 text-lg">Cargando perfiles...</p>
        </div>
      ) : perfiles.length === 0 ? (
        <div className="flex justify-center items-center h-48">
          <p className="text-gray-500 text-lg">No hay perfiles de trabajador para mostrar.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {perfiles.map((perfil) => (
              <li key={perfil.id} className="p-4 sm:p-6 hover:bg-gray-50 transition duration-150 ease-in-out">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div className="flex flex-col mb-2 sm:mb-0">
                    <span className="text-xs font-semibold uppercase text-gray-500">ID: {perfil.id}</span>
                    <span className="text-xl font-semibold text-gray-900">{perfil.usuario_nombre_completo}</span>
                    <span className="text-sm text-gray-600">{perfil.usuario_email}</span>
                    <span className="text-sm text-gray-600">Especialidades: {perfil.especialidades.join(', ')}</span>
                    <span className="text-sm text-gray-600">Estado: {perfil.activo ? 'Activo' : 'Inactivo'}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(perfil.id)}
                      className="flex items-center px-4 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition duration-300"
                      aria-label={`Editar perfil de ${perfil.usuario_nombre_completo}`}
                    >
                      <FontAwesomeIcon icon={faEdit} className="mr-2 hidden sm:block" />
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(perfil.id)}
                      className="flex items-center px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition duration-300"
                      aria-label={`Eliminar perfil de ${perfil.usuario_nombre_completo}`}
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

export default PerfilTrabajadorList;