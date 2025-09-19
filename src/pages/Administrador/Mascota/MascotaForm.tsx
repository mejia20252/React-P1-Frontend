// src/pages/Administrador/Mascota/MascotaForm.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axiosInstance from '../../../app/axiosInstance';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import { mascotaCreateSchema } from '../../../schemas/schema-mascota';
import type { MascotaFormData } from '../../../schemas/schema-mascota';
import { toUiError } from '../../../api/error';
import { mascotaApi } from '../../../api/api-mascota';
import type { ResidenteRaw } from '../../../types/type-mascota';
import { normalizeEspecie } from '../../../types/type-mascota';

const MascotaForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [topError, setTopError] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({});
  const [residentes, setResidentes] = useState<ResidenteRaw[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<MascotaFormData>({
    resolver: zodResolver(mascotaCreateSchema),
    defaultValues: {
      nombre: '',
      especie: 'perro',
      raza: '',
      fecha_nacimiento: '',
      dueno: 0,
    },
  });

  // Cargar residentes crudos (solo IDs)
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // ✅ Cargamos residentes tal cual vienen del backend
        const response = await axiosInstance.get<ResidenteRaw[]>('/residentes/');
        setResidentes(response.data);

        if (isEdit && id) {
          const mascota = await mascotaApi.getByIdRaw(Number(id));
          setValue('nombre', mascota.nombre);
          setValue('especie', normalizeEspecie(mascota.especie) as any);
          setValue('raza', mascota.raza || '');
          setValue('fecha_nacimiento', mascota.fecha_nacimiento || '');
          setValue('dueno', mascota.dueno);
        }
      } catch (error) {
        console.error('Error al cargar datos:', error);
        setTopError('No se pudieron cargar los residentes.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, isEdit, setValue]);

  const onSubmit = async (data: MascotaFormData) => {
    setTopError('');
    setFormErrors({});

    try {
      const payload = {
        nombre: data.nombre,
        especie: data.especie,
        raza: data.raza === undefined ? null : data.raza,
        fecha_nacimiento: data.fecha_nacimiento === undefined ? null : data.fecha_nacimiento,
        dueno: data.dueno,
      };

      if (isEdit && id) {
        await mascotaApi.update(Number(id), payload);
      } else {
        await mascotaApi.create(payload);
      }

      navigate('/administrador/mascotas');
    } catch (error) {
      const uiError = toUiError(error);
      if (uiError.fields) {
        setFormErrors(uiError.fields);
      } else if (uiError.message) {
        setTopError(uiError.message);
      } else {
        setTopError('Error al guardar la mascota.');
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{isEdit ? 'Editar Mascota' : 'Nueva Mascota'}</h2>
          <button
            onClick={() => navigate('/administrador/mascotas')}
            className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
            aria-label="Cerrar"
          >
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </div>

        {topError && (
          <div className="mb-4 p-3 rounded-md bg-red-100 border border-red-200 text-red-700 text-sm">
            {topError}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center min-h-[150px]">
            <p className="text-gray-600">Cargando residentes...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
            {/* Nombre */}
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <input
                type="text"
                id="nombre"
                {...register('nombre')}
                className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  formErrors.nombre ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {formErrors.nombre?.map((m, i) => (
                <p key={i} className="mt-1 text-sm text-red-600">{m}</p>
              ))}
            </div>

            {/* Especie */}
            <div>
              <label htmlFor="especie" className="block text-sm font-medium text-gray-700 mb-1">
                Especie
              </label>
              <select
                id="especie"
                {...register('especie')}
                className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  formErrors.especie ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="perro">Perro</option>
                <option value="gato">Gato</option>
                <option value="ave">Ave</option>
                <option value="otro">Otro</option>
              </select>
              {formErrors.especie?.map((m, i) => (
                <p key={i} className="mt-1 text-sm text-red-600">{m}</p>
              ))}
            </div>

            {/* Raza */}
            <div>
              <label htmlFor="raza" className="block text-sm font-medium text-gray-700 mb-1">
                Raza (opcional)
              </label>
              <input
                type="text"
                id="raza"
                {...register('raza')}
                className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300"
              />
              {formErrors.raza?.map((m, i) => (
                <p key={i} className="mt-1 text-sm text-red-600">{m}</p>
              ))}
            </div>

            {/* Fecha de nacimiento */}
            <div>
              <label htmlFor="fecha_nacimiento" className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de nacimiento (opcional)
              </label>
              <input
                type="date"
                id="fecha_nacimiento"
                {...register('fecha_nacimiento')}
                className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300"
              />
              {formErrors.fecha_nacimiento?.map((m, i) => (
                <p key={i} className="mt-1 text-sm text-red-600">{m}</p>
              ))}
            </div>

            {/* Dueño (Residente por ID) */}
            <div>
              <label htmlFor="dueno" className="block text-sm font-medium text-gray-700 mb-1">
                Dueño (ID de Residente)
              </label>
              <select
                id="dueno"
                {...register('dueno', { valueAsNumber: true })}
                className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  formErrors.dueno ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Selecciona un residente</option>
                {residentes.map((r) => (
                  <option key={r.id} value={r.id}>
                    Residente ID: {r.id} | Usuario ID: {r.usuario} | Casa: {r.casa} | Rol: {r.rol_residencia}
                  </option>
                ))}
              </select>
              {formErrors.dueno?.map((m, i) => (
                <p key={i} className="mt-1 text-sm text-red-600">{m}</p>
              ))}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/administrador/mascotas')}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors duration-200"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex items-center px-4 py-2 text-sm font-medium text-white rounded-md transition-colors duration-200 ${
                  isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Guardando...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faSave} className="mr-2" />
                    {isEdit ? 'Actualizar' : 'Crear'}
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default MascotaForm;