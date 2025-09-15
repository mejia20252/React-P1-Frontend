import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { casaApi } from '../../../api/api-casa'; // ✅ Importa correctamente
import type { Casa } from '../../../types/type-casa';
import { useNavigate } from 'react-router-dom'; // 👈 IMPORTA useNavigate

export default function CasaDetail() {
  const navigate = useNavigate(); // 👈 Hook para navegar programáticamente
  const { id } = useParams<{ id?: string }>();
  const [casa, setCasa] = useState<Casa | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarCasa = async () => {
      if (!id) {
        setError('ID de casa no proporcionado.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await casaApi.fetchCasa(Number(id));
        setCasa(data);
      } catch (err: any) {
        console.error('Error al cargar la casa:', err);
        setError('No se pudo cargar la información de la casa.');
      } finally {
        setLoading(false);
      }
    };

    cargarCasa();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen bg-gray-50 p-6 text-center">Cargando...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          {error}
        </div>
      </div>
    );
  }

  if (!casa) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 text-center">
        <p className="text-gray-500">Casa no encontrada.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* 👇 BOTÓN DE VUELTA - RESPONSIVE Y ESTILIZADO */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/administrador/casas')}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium shadow"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H15a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Volver a Casas
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-6">Detalles de la Casa</h1>

      <div className="bg-white p-8 rounded-xl shadow-lg max-w-3xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Número de casa */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Número de Casa</label>
            <p className="text-lg font-semibold text-gray-900">{casa.numero_casa}</p>
          </div>

          {/* Tipo de unidad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Unidad</label>
            <p className="text-lg font-semibold text-gray-900">{casa.tipo_de_unidad}</p>
          </div>

          {/* Número (opcional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Número</label>                            
            <p className="text-lg font-semibold text-gray-900">{casa.numero}</p>
          </div>

          {/* Área */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Área (m²)</label>
            <p className="text-lg font-semibold text-gray-900">{casa.area} m²</p>                                
          </div>

          {/* Propietario */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Propietario</label>
            {casa.propietario ? (
              <p className="text-lg font-semibold text-gray-900">
                {casa.propietario.usuario.nombre} {casa.propietario.usuario.apellido_paterno}
              </p>
            ) : (
              <p className="text-gray-500 italic">Sin propietario asignado</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}