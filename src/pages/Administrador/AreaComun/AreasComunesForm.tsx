// src/pages/Administrador/AreaComun/AreasComunesForm.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import { areaComunCreateSchema, type AreaComunFormData } from '../../../schemas/schema-area-comun'; // ✅ Importa el tipo desde aquí
import { toUiError } from '../../../api/error';
import { areaComunApi } from '../../../api/api-area-comun';

const AreasComunesForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [topError, setTopError] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({});

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<AreaComunFormData>({
    resolver: zodResolver(areaComunCreateSchema) as any,
    defaultValues: {
      nombre: '',
      descripcion: '', // ✅ string vacío, coincide con transform
      costo_alquiler: '0.00',
      capacidad: 1,
      estado: 'disponible',
    },
  });

  // Cargar datos si es edición
  useEffect(() => {
    if (isEdit && id) {
      setLoading(true);
      areaComunApi.getById(Number(id))
        .then((area) => {
          setValue('nombre', area.nombre);
          setValue('descripcion', area.descripcion || ''); // ✅ Siempre string
          setValue('costo_alquiler', area.costo_alquiler);
          setValue('capacidad', area.capacidad);
          setValue('estado', area.estado);
        })
        .catch((error) => {
          console.error('Error al cargar área:', error);
          setTopError('No se pudo cargar el área común.');
        })
        .finally(() => setLoading(false));
    }
  }, [id, isEdit, setValue]);

  const onSubmit = async (data: AreaComunFormData) => {
    setTopError('');
    setFormErrors({});

    try {
      if (isEdit && id) {
        await areaComunApi.update(Number(id), data);
      } else {
        await areaComunApi.create(data);
      }

      navigate('/administrador/areas-comunes');
    } catch (error) {
      const uiError = toUiError(error);
      if (uiError.fields) {
        setFormErrors(uiError.fields);
      } else if (uiError.message) {
        setTopError(uiError.message);
      } else {
        setTopError('Error al guardar el área común.');
      }
    }
  };

  if (loading && isEdit) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {isEdit ? 'Editar Área Común' : 'Nueva Área Común'}
          </h2>
          <button
            onClick={() => navigate('/administrador/areas-comunes')}
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

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
          {/* Nombre */}
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre *
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

          {/* Descripción */}
          <div>
            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
              Descripción (opcional)
            </label>
            <textarea
              id="descripcion"
              {...register('descripcion')}
              rows={3}
              className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300"
            />
            {formErrors.descripcion?.map((m, i) => (
              <p key={i} className="mt-1 text-sm text-red-600">{m}</p>
            ))}
          </div>

          {/* Costo de alquiler */}
          <div>
            <label htmlFor="costo_alquiler" className="block text-sm font-medium text-gray-700 mb-1">
              Costo de Alquiler (USD) *
            </label>
            <input
              type="text"
              id="costo_alquiler"
              {...register('costo_alquiler')}
              placeholder="0.00"
              className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                formErrors.costo_alquiler ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {formErrors.costo_alquiler?.map((m, i) => (
              <p key={i} className="mt-1 text-sm text-red-600">{m}</p>
            ))}
          </div>

          {/* Capacidad */}
          <div>
            <label htmlFor="capacidad" className="block text-sm font-medium text-gray-700 mb-1">
              Capacidad Máxima (personas) *
            </label>
            <input
              type="number"
              id="capacidad"
              {...register('capacidad', { valueAsNumber: true })}
              min="1"
              className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                formErrors.capacidad ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {formErrors.capacidad?.map((m, i) => (
              <p key={i} className="mt-1 text-sm text-red-600">{m}</p>
            ))}
          </div>

          {/* Estado */}
          <div>
            <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">
              Estado *
            </label>
            <select
              id="estado"
              {...register('estado')}
              className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                formErrors.estado ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="disponible">Disponible</option>
              <option value="mantenimiento">En Mantenimiento</option>
              <option value="cerrada">Cerrada</option>
            </select>
            {formErrors.estado?.map((m, i) => (
              <p key={i} className="mt-1 text-sm text-red-600">{m}</p>
            ))}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/administrador/areas-comunes')}
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
      </div>
    </div>
  );
};

export default AreasComunesForm;