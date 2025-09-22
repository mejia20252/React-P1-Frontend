// src/pages/Inquilino/Telefono/TelefonoList.tsx // Changed path in comment
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchTelefonos, deleteTelefono } from '../../../api/telefono';
import type { Telefono } from '../../../types/type-telefono';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const TelefonoList: React.FC = () => {
  const [telefonos, setTelefonos] = useState<Telefono[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null); // State to handle errors
  const navigate = useNavigate();

  const loadTelefonos = async () => {
    try {
      setLoading(true);
      setError(null); // Clear previous errors
      const data = await fetchTelefonos();
      setTelefonos(data);
    } catch (error) {
      console.error('Error al cargar teléfonos', error);
      setError('No se pudieron cargar los teléfonos. Inténtalo de nuevo más tarde.'); // Set user-friendly error message
      setTelefonos([]); // Ensure no old data is shown on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTelefonos();
  }, []);

  const handleEdit = (id: number) => {
    navigate(`/inquilino/telefonos/${id}/edit`); // Changed from /propietario to /inquilino
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTelefono(id);
      loadTelefonos();
    } catch (error) {
      console.error('Error al eliminar el teléfono', error);
      // Optionally, set an error message for the user here too
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:gap-0">
        <h2 className="text-3xl font-bold text-gray-800">Teléfonos del Inquilino</h2> {/* Adjusted title */}
        <button
          onClick={() => navigate('/inquilino/telefonos/new')} // Changed from /propietario to /inquilino
          className="flex items-center px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Nuevo Teléfono
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <p className="text-gray-500 text-lg">Cargando teléfonos...</p>
        </div>
      ) : error ? ( // Display error message if there's an error
        <div className="flex justify-center items-center h-48">
          <p className="text-red-600 text-lg font-medium">{error}</p>
        </div>
      ) : telefonos.length === 0 ? (
        <div className="flex justify-center items-center h-48">
          <p className="text-gray-500 text-lg">No se encontraron teléfonos para este inquilino.</p> {/* Changed message */}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {telefonos.map((telefono) => (
              <li key={telefono.id} className="p-4 sm:p-6 hover:bg-gray-50 transition duration-150 ease-in-out">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div className="flex flex-col mb-2 sm:mb-0">
                    <span className="text-xs font-semibold uppercase text-gray-500">ID: {telefono.id}</span>
                    <span className="text-xl font-semibold text-gray-900">{telefono.numero}</span>
                    <span className="text-sm text-gray-600">Tipo: {telefono.tipo}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(telefono.id)}
                      className="flex items-center px-4 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition duration-300"
                      aria-label={`Editar teléfono ${telefono.numero}`}
                    >
                      <FontAwesomeIcon icon={faEdit} className="mr-2 hidden sm:block" />
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(telefono.id)}
                      className="flex items-center px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition duration-300"
                      aria-label={`Eliminar teléfono ${telefono.numero}`}
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

export default TelefonoList;