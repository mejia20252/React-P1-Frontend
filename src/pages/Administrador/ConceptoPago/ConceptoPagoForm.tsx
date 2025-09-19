// src/pages/Administrador/ConceptoPago/ConceptoPagoForm.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faArrowLeft, faSave } from '@fortawesome/free-solid-svg-icons';
import { conceptoPagoApi } from '../../../api/api-concepto-pago';
import type { ConceptoPagoFormData } from '../../../schemas/schema-concepto-pago';
import { toUiError } from '../../../api/error';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { conceptoPagoCreateSchema } from '../../../schemas/schema-concepto-pago';

const ConceptoPagoForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [topError, setTopError] = useState('');
  const [serverErrors, setServerErrors] = useState<Record<string, string[]>>({});

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<ConceptoPagoFormData>({
    resolver: zodResolver(conceptoPagoCreateSchema),
    defaultValues: {
      nombre: '',
      descripcion: '',
      es_fijo: false,
      monto_fijo: '',
      activo: true,
    },
  });

  const esFijo = watch('es_fijo');

  // Cargar datos si es edición
  useEffect(() => {
    if (isEdit && id) {
      setLoading(true);
      conceptoPagoApi.getById(Number(id))
        .then((concepto) => {
          setValue('nombre', concepto.nombre);
          setValue('descripcion', concepto.descripcion || '');
          setValue('es_fijo', concepto.es_fijo);
          setValue('monto_fijo', concepto.monto_fijo || '');
          setValue('activo', concepto.activo);
        })
        .catch((error) => {
          console.error('Error al cargar concepto:', error);
          setTopError('Error al cargar el concepto de pago.');
        })
        .finally(() => setLoading(false));
    }
  }, [id, isEdit, setValue]);

  const onSubmit: SubmitHandler<ConceptoPagoFormData> = async (data) => {
    setTopError('');
    setServerErrors({});

    try {
      if (isEdit && id) {
        await conceptoPagoApi.update(Number(id), data);
      } else {
        await conceptoPagoApi.create(data);
      }

      navigate('/administrador/conceptos-pago');
    } catch (error) {
      const uiError = toUiError(error);
      if (uiError.fields) {
        setServerErrors(uiError.fields);
      } else if (uiError.message) {
        setTopError(uiError.message);
      } else {
        setTopError('Error al guardar el concepto de pago.');
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
            {isEdit ? 'Editar Concepto de Pago' : 'Nuevo Concepto de Pago'}
          </h2>
          <button
            onClick={() => navigate('/administrador/conceptos-pago')}
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
                errors.nombre || serverErrors.nombre ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ej: Expensa Mensual, Multa por ruido"
            />
            {errors.nombre && <p className="mt-1 text-sm text-red-600">{errors.nombre.message}</p>}
            {serverErrors.nombre?.map((m, i) => <p key={i} className="mt-1 text-sm text-red-600">{m}</p>)}
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
              className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                errors.descripcion || serverErrors.descripcion ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Detalles del concepto de pago..."
            />
            {errors.descripcion && <p className="mt-1 text-sm text-red-600">{errors.descripcion.message}</p>}
            {serverErrors.descripcion?.map((m, i) => <p key={i} className="mt-1 text-sm text-red-600">{m}</p>)}
          </div>

          {/* Tipo: Fijo o Variable */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="es_fijo"
              {...register('es_fijo')}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="es_fijo" className="ml-2 block text-sm text-gray-700">
              Monto Fijo
            </label>
          </div>

          {/* Monto Fijo (solo si es_fijo = true) */}
          {esFijo && (
            <div>
              <label htmlFor="monto_fijo" className="block text-sm font-medium text-gray-700 mb-1">
                Monto Fijo *
              </label>
              <input
                type="text"
                id="monto_fijo"
                {...register('monto_fijo')}
                placeholder="0.00"
                className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  errors.monto_fijo || serverErrors.monto_fijo ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.monto_fijo && <p className="mt-1 text-sm text-red-600">{errors.monto_fijo.message}</p>}
              {serverErrors.monto_fijo?.map((m, i) => <p key={i} className="mt-1 text-sm text-red-600">{m}</p>)}
            </div>
          )}

          {/* Activo */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="activo"
              {...register('activo')}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="activo" className="ml-2 block text-sm text-gray-700">
              Activo
            </label>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/administrador/conceptos-pago')}
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

export default ConceptoPagoForm;