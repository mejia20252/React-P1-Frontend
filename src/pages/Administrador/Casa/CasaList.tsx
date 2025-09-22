import { useEffect, useState } from 'react';
import { casaApiV1 } from '../../../api/api-casa-v1';
import type { CasaV1 } from '../../../types/type-casa-v1';
import { useNavigate } from 'react-router-dom';

export default function CasaListV1() {
  const navigate = useNavigate();
  const [casas, setCasas] = useState<CasaV1[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCasas = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await casaApiV1.getAll();
        setCasas(data);
      } catch (err: any) {
        setError('No se pudieron cargar las casas.');
      } finally {
        setLoading(false);
      }
    };

    fetchCasas();
  }, []);

  const filteredCasas = casas.filter(
    (casa) =>
      casa.numero_casa.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-4 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Casas (v1)</h1>
          <button
            onClick={() => navigate('/administrador/casas/nueva')}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors"
          >
            + Nueva Casa
          </button>
        </div>
      </div>

      {/* Búsqueda */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar por número de casa..."
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
            <p className="text-gray-500">Cargando casas...</p>
          </div>
        ) : filteredCasas.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500">No se encontraron casas.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredCasas.map((casa) => (
              <div
                key={casa.id}
                className="bg-white p-4 rounded-lg shadow border border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-md transition-shadow"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{casa.numero_casa}</h3>
                  <p className="text-sm text-gray-600">
                    {casa.tipo_de_unidad.charAt(0).toUpperCase() + casa.tipo_de_unidad.slice(1)} • {casa.area} m²
                  </p>
                  {/* Se eliminó la lógica de propietario */}
                  <p className="text-sm text-gray-400 mt-1">Estado: {casa.estado_ocupacion.charAt(0).toUpperCase() + casa.estado_ocupacion.slice(1)}</p>
                </div>

                <div className="flex gap-2">
                  {/* Editar */}
                  <button
                    onClick={() => navigate(`/administrador/casas/${casa.id}/editar`)}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                  >
                    Editar
                  </button>

                  {/* El botón de asignar/desasignar propietario se ha eliminado por completo */}

                  {/* Eliminar */}
                  <button
                    onClick={() => {
                      if (window.confirm(`¿Eliminar la casa ${casa.numero_casa}?`)) {
                        casaApiV1.delete(casa.id)
                          .then(() => {
                            setCasas(casas.filter(c => c.id !== casa.id));
                          })
                          .catch(() => {
                            setError('No se pudo eliminar la casa.');
                          });
                      }
                    }}
                    className="px-2 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors flex items-center justify-center"
                    aria-label="Eliminar casa"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}