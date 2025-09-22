// src/pages/Propietario/MisPropieades.tsx

import  { useState, useEffect } from 'react';
import { fetchMisPropiedades } from '../../api/api-mis-propiedades';

export interface Propiedad {
  id: number;
  casa: number; // ID de la casa
  casa_numero: string;
  casa_descripcion: string;
  propietario: number; // ID del usuario propietario
  propietario_nombre: string;
  propietario_email: string;
  fecha_adquisicion: string; // ISO Date string (ej: "2023-10-27")
  fecha_transferencia: string | null;
  activa: boolean;
}
const MisPropiedades = () => {
  const [propiedades, setPropiedades] = useState<Propiedad[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPropiedades = async () => {
      try {
        const data = await fetchMisPropiedades();
        setPropiedades(data);
        setLoading(false);
      } catch (err) {
        console.error("Error al cargar propiedades:", err);
        setError("No se pudieron cargar tus propiedades. Intenta más tarde.");
        setLoading(false);
      }
    };

    loadPropiedades();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-8">Mis Propiedades</h1>
        <p className="text-center text-gray-600">Cargando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-8">Mis Propiedades</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <h1 className="text-3xl font-extrabold text-gray-800 text-center mb-8 flex items-center justify-center gap-3">
        🏡 Mis Propiedades
      </h1>

      {propiedades.length === 0 ? (
        <p className="text-center text-gray-600 mt-8">No tienes propiedades asignadas.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {propiedades.map((prop) => (
            <div
              key={prop.id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-5 border border-gray-100"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                {prop.casa_descripcion || `Casa #${prop.casa_numero}`}
              </h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p><strong className="font-medium">Propietario:</strong> {prop.propietario_nombre}</p>
                <p><strong className="font-medium">Email:</strong> {prop.propietario_email}</p>
                <p><strong className="font-medium">Adquirida:</strong> {new Date(prop.fecha_adquisicion).toLocaleDateString()}</p>
                {prop.fecha_transferencia && (
                  <p><strong className="font-medium">Transferida:</strong> {new Date(prop.fecha_transferencia).toLocaleDateString()}</p>
                )}
              </div>
              <span
                className={`inline-block mt-4 px-3 py-1 rounded-full text-xs font-medium ${
                  prop.activa
                    ? 'bg-green-100 text-green-800 border border-green-200'
                    : 'bg-red-100 text-red-800 border border-red-200'
                }`}
              >
                {prop.activa ? 'Activa' : 'Inactiva'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MisPropiedades;