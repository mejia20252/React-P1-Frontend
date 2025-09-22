// components/administrador/propiedades/PropiedadList.tsx

import { useEffect, useState } from 'react';
import { propiedadApi } from '../../../api/api-propiedad';
import type { Propiedad } from '../../../types/type-propiedad';
import { useNavigate } from 'react-router-dom';

export default function PropiedadList() {
  const navigate = useNavigate();
  const [propiedades, setPropiedades] = useState<Propiedad[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const propiedadesData = await propiedadApi.getAll();
        setPropiedades(propiedadesData);
      } catch (err: any) {
        setError('No se pudieron cargar las propiedades.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredPropiedades = propiedades.filter((propiedad) => {
  const casaStr = propiedad.casa?.__str__ || '';
  const propietarioNombre = propiedad.propietario?.nombre || '';
  const propietarioApellido = propiedad.propietario?.apellido_paterno || '';

  const fullPropietarioName = `${propietarioNombre} ${propietarioApellido}`.trim();

  const searchTermLower = searchTerm.toLowerCase();

  return (
    casaStr.toLowerCase().includes(searchTermLower) ||
    fullPropietarioName.toLowerCase().includes(searchTermLower)
  );
});

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-4 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Propiedades</h1>
          <button
            onClick={() => navigate('/administrador/asignar-propietario/nuevo')}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors"
          >
            + Asignar Propietario
          </button>
        </div>
      </div>

      {/* Búsqueda */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar por casa o propietario..."
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
            <p className="text-gray-500">Cargando propiedades...</p>
          </div>
        ) : filteredPropiedades.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500">No hay propiedades asignadas.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredPropiedades.map((propiedad) => (
              <div
                key={propiedad.id}
                className="bg-white p-4 rounded-lg shadow border border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-md transition-shadow"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{propiedad.casa.__str__}</h3>
                  <p className="text-sm text-gray-600">
                    Propietario: {propiedad.propietario.nombre} {propiedad.propietario.apellido_paterno}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Adquirida: {propiedad.fecha_adquisicion} •{' '}
                    {propiedad.activa ? (
                      <span className="text-green-600 font-medium">Activa</span>
                    ) : (
                      <span className="text-red-600">Transferida el {propiedad.fecha_transferencia}</span>
                    )}
                  </p>
                </div>

                <div className="flex gap-2">
                  {propiedad.activa && (
                    <button
                      onClick={() => navigate(`/administrador/asignar-propietario/${propiedad.id}/editar`)}
                      className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                    >
                      Transferir
                    </button>
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