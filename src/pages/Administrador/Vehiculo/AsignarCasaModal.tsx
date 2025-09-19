import React, { useState,useEffect } from 'react';
import { casaApi } from '../../../api/api-casa';
import type { Casa } from '../../../types/type-casa';
import { vehiculoApiAgigment } from '../../../api/api-vehiculo-asingment';
import { type Vehiculo } from '../../../types/type-vehiculo';

interface AsignarCasaModalProps {
  vehiculoId: number;
  onAssignSuccess: (updatedVehiculo: Vehiculo) => void;
  onClose: () => void;
}

const AsignarCasaModal: React.FC<AsignarCasaModalProps> = ({
  vehiculoId,
  onAssignSuccess,
  onClose,
}) => {
  const [casas, setCasas] = useState<Casa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCasaId, setSelectedCasaId] = useState<number | null>(null);

  useEffect(() => {
    const fetchCasas = async () => {
      try {
        setLoading(true);
        const data = await casaApi.getAll();
        setCasas(data);
      } catch (err: any) {
        setError('No se pudieron cargar las casas disponibles.');
      } finally {
        setLoading(false);
      }
    };

    fetchCasas();
  }, []);

  const handleAssign = async () => {
    if (selectedCasaId === null) return;

    try {
      const updatedVehiculo = await vehiculoApiAgigment.asignarCasa(vehiculoId, selectedCasaId);
      onAssignSuccess(updatedVehiculo);
      onClose();
    } catch (err: any) {
      setError('Error al asignar la casa. Verifica que la casa tenga residente.');
    }
  };

  const handleCancel = () => {
    setSelectedCasaId(null);
    onClose();
  };

  return (
    <div className="fixed inset-0  bg-black/25 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Asignar Casa al Vehículo</h2>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <p>Cargando casas...</p>
        ) : (
          <>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selecciona una casa
            </label>
            <select
              value={selectedCasaId || ''}
              onChange={(e) => setSelectedCasaId(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              required
            >
              <option value="">-- Selecciona una casa --</option>
              {casas.map((casa) => (
                <option key={casa.id} value={casa.id}>
                  {casa.numero_casa} ({casa.tipo_de_unidad})
                </option>
              ))}
            </select>

            <div className="flex gap-3 mt-6 justify-end">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleAssign}
                disabled={selectedCasaId === null}
                className="px-4 py-2 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Asignar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AsignarCasaModal;