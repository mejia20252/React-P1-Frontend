import { useEffect, useState } from 'react';
import { vehiculoApi } from '../../../api/api-vehiculo';
import type { Vehiculo } from '../../../types/type-vehiculo';
import { getVehiculoTipoDisplay } from '../../../utils/vehiculo-utils';

export default function VehiculoList() {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const vehiculosData = await vehiculoApi.getAll();
        setVehiculos(vehiculosData);
      } catch (err: any) {
        setError('No se pudieron cargar los vehículos.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredVehiculos = vehiculos.filter(
    (vehiculo) =>
      vehiculo.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (vehiculo.dueno &&
        `${vehiculo.dueno_nombre_completo}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-4 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Vehículos</h1>
        </div>
      </div>

      {/* Búsqueda */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar por placa o dueño..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
          />
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Cargando vehículos...</p>
          </div>
        ) : filteredVehiculos.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500">No hay vehículos registrados.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredVehiculos.map((vehiculo) => (
              <div
                key={vehiculo.id}
                className="bg-white p-4 rounded-lg shadow border border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-md transition-shadow"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{vehiculo.placa}</h3>
                  <p className="text-sm text-gray-600">
                    {getVehiculoTipoDisplay(vehiculo.tipo)} • Dueño: {vehiculo.dueno_nombre_completo}
                  </p>
                  {vehiculo.casa ? (
                    <p className="text-sm text-gray-500 mt-1">
                      Asignado a: {vehiculo.casa_numero_casa})
                    </p>
                  ) : (
                    <p className="text-sm text-gray-400 mt-1">Sin casa asignada</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}