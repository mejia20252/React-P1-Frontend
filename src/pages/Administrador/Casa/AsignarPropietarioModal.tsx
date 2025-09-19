import React, { useState, useEffect } from 'react';
import { casaApi } from '../../../api/api-casa';
import { getPropietarios } from '../../../api/api-usuario'; // 👈 Cambia esto!
import type { Casa } from '../../../types/type-casa';
import type { Usuario } from '../../../types/type-usuario';

interface AsignarPropietarioModalProps {
  casa: Casa;
  onAssignSuccess: (updatedCasa: Casa) => void;
  onClose: () => void;
}

const AsignarPropietarioModal: React.FC<AsignarPropietarioModalProps> = ({
  casa,
  onAssignSuccess,
  onClose,
}) => {
  const [propietarios, setPropietarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUsuarioId, setSelectedUsuarioId] = useState<number | null>(null);

  useEffect(() => {
    const fetchPropietarios = async () => {
      try {
        setLoading(true);
        // Obtener todos los usuarios que tienen rol "Propietario"
        const data = await getPropietarios(); // 👈 Ver más abajo cómo crearlo
        setPropietarios(data);
      } catch (err: any) {
        setError('No se pudieron cargar los propietarios.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPropietarios();
  }, []);

  const handleAssign = async () => {
    if (selectedUsuarioId === null) return;

    try {
      const updatedCasa = await casaApi.asignarPropietario(casa.id, selectedUsuarioId);
      onAssignSuccess(updatedCasa);
      onClose();
    } catch (err: any) {
      setError(
        err.response?.data?.usuario_id ||
        err.response?.data?.non_field_errors ||
        'Error al asignar el propietario.'
      );
    }
  };

  const handleDesassign = async () => {
    if (!casa.propietario) return;

    if (!window.confirm('¿Estás seguro de desasignar al propietario de esta casa?')) return;

    try {
      const updatedCasa = await casaApi.desasignarPropietario(casa.id);
      onAssignSuccess(updatedCasa);
      onClose();
    } catch (err: any) {
      setError('Error al desasignar el propietario.');
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/25 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {casa.propietario ? 'Desasignar Propietario' : 'Asignar Propietario'}
        </h2>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <p>Cargando propietarios...</p>
        ) : (
          <>
            {casa.propietario ? (
              <div className="mb-4 p-3 bg-gray-50 rounded">
                <p className="text-sm">
                  <strong>Actualmente asignado:</strong> {casa.propietario.usuario.nombre} {casa.propietario.usuario.apellido_paterno}
                </p>
              </div>
            ) : (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selecciona un propietario
                </label>
                <select
                  value={selectedUsuarioId || ''}
                  onChange={(e) => setSelectedUsuarioId(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                  required
                >
                  <option value="">-- Selecciona un propietario --</option>
                  {propietarios.map((usuario) => (
                    <option key={usuario.id} value={usuario.id}>
                      {usuario.nombre} {usuario.apellido_paterno} ({usuario.email})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex gap-3 mt-6 justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>

              {casa.propietario ? (
                <button
                  onClick={handleDesassign}
                  className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  Desasignar
                </button>
              ) : (
                <button
                  onClick={handleAssign}
                  disabled={selectedUsuarioId === null}
                  className="px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Asignar
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AsignarPropietarioModal;