import { useState, useEffect } from 'react';
import type { Vehiculo } from '../../../types/type-vehiculo';
import type { Casa } from '../../../types/type-casa'; // Import Casa type
import { vehiculoApiAgigment } from '../../../api/api-vehiculo-asingment';

interface AsignarCasaModalProps {
  vehiculoId: number;
  casas: Casa[]; // Add this prop to receive the list of houses
  onAssignSuccess: (updatedVehiculo: Vehiculo) => void;
  onClose: () => void;
}

export default function AsignarCasaModal({ vehiculoId, casas, onAssignSuccess, onClose }: AsignarCasaModalProps) {
  const [selectedCasaId, setSelectedCasaId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Optional: If there's only one casa, pre-select it or handle initial state
    if (casas.length > 0 && !selectedCasaId) {
      // You might want to pre-select the first one or ensure logic for no selection
    }
  }, [casas, selectedCasaId]);


  const handleAssign = async () => {
    if (!selectedCasaId) {
      setError('Por favor, selecciona una casa para asignar.');
      return;
    }
    setLoading(true);
    setError(null); // Clear previous errors
    try {
      const updatedVehiculo = await vehiculoApiAgigment.asignarCasa(vehiculoId, selectedCasaId);
      onAssignSuccess(updatedVehiculo);
      onClose(); // Close modal on success
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error desconocido al asignar la casa.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600/40 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm mx-4">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Asignar Casa a Vehículo</h2>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="casa-select" className="block text-sm font-medium text-gray-700 mb-1">
            Selecciona una casa:
          </label>
          <select
            id="casa-select"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            value={selectedCasaId || ''}
            onChange={(e) => setSelectedCasaId(Number(e.target.value))}
            disabled={loading}
          >
            <option value="">-- Selecciona una casa --</option>
            {casas.length === 0 ? (
                <option disabled>No hay casas disponibles</option>
            ) : (
                casas.map((casa) => (
                    <option key={casa.id} value={casa.id}>
                        Casa {casa.numero_casa} ({casa.tipo_de_unidad})
                    </option>
                ))
            )}
          </select>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-300 transition-colors"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            onClick={handleAssign}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || !selectedCasaId} // Disable if loading or no casa is selected
          >
            {loading ? 'Asignando...' : 'Asignar'}
          </button>
        </div>
      </div>
    </div>
  );
}