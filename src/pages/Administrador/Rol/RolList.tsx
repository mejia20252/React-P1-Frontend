



// src/pages/Admin/Roles/RolesList.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchRoles, deleteRol } from '../../../api/api';
import type { Rol } from '../../../types';

const RolesList: React.FC = () => {
  const [roles, setRoles] = useState<Rol[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const loadRoles = async () => {
    try {
      setLoading(true);
      const data = await fetchRoles();
      setRoles(data);
    } catch (error) {
      console.error('Error al cargar roles', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoles();
  }, []);

  const handleEdit = (id: number) => {
    navigate(`/administrador/roles/${id}/edit`);
  };

  const handleDelete = async (id: number) => {
    
      try {
        await deleteRol(id);
        loadRoles();
      } catch (error) {
        console.error('Error al eliminar rol', error);
      }
    
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Roles</h2>
        <button
          onClick={() => navigate('/administrador/roles/new')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Nuevo Rol
        </button>
      </div>

      {loading ? (
        <p>Cargando roles...</p>
      ) : (
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="px-4 py-2 border">id</th>
              <th className="px-4 py-2 border">Nombre</th>
              <th className="px-4 py-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((rol) => (
              <tr key={rol.id}>
                <td className="px-4 py-2 border">{rol.id}</td>
                <td className="px-4 py-2 border">{rol.nombre}</td>
                <td className="px-4 py-2 border">
                  <button
                    onClick={() => handleEdit(rol.id)}
                    className="mr-2 px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(rol.id)}
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RolesList;
