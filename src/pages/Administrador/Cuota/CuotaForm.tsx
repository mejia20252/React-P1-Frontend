// src/pages/Administrador/Cuota/CuotaForm.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faArrowLeft, faSave } from '@fortawesome/free-solid-svg-icons';
import { cuotaApi } from '../../../api/api-cuota';
import { casaApi } from '../../../api/api-casa';
import { conceptoPagoApi } from '../../../api/api-concepto-pago';
import type { Casa } from '../../../types/type-casa';
import type { ConceptoPago } from '../../../types/type-concepto-pago';
import type { CuotaFormData } from '../../../schemas/schema-cuota';
import { toUiError } from '../../../api/error';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cuotaCreateSchema } from '../../../schemas/schema-cuota';

const CuotaForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [topError, setTopError] = useState('');
  const [serverErrors, setServerErrors] = useState<Record<string, string[]>>({});
  const [casas, setCasas] = useState<Casa[]>([]);
  const [conceptos, setConceptos] = useState<ConceptoPago[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<CuotaFormData>({
    resolver: zodResolver(cuotaCreateSchema),
    defaultValues: {
      concepto: 0,
      casa: 0,
      monto: '',
      periodo: '',
      fecha_vencimiento: '',
      estado: 'pendiente',
      fecha_pago: null,
      generada_automaticamente: true,
    },
  });

  // Cargar listas y datos si es edición
  useEffect(() => {
    const loadDependencies = async () => {
      try {
        const [casasData, conceptosData] = await Promise.all([
          casaApi.getAll(),
          conceptoPagoApi.getAll(),
        ]);
        setCasas(casasData);
        setConceptos(conceptosData);

        if (isEdit && id) {
          setLoading(true);
          const cuota = await cuotaApi.getById(Number(id));
          setValue('concepto', cuota.concepto);
          setValue('casa', cuota.casa);
          setValue('monto', cuota.monto);
          setValue('periodo', cuota.periodo.split('T')[0]); // Convertir a YYYY-MM-DD
          setValue('fecha_vencimiento', cuota.fecha_vencimiento.split('T')[0]);
          setValue('estado', cuota.estado);
          setValue('fecha_pago', cuota.fecha_pago ? cuota.fecha_pago.split('T')[0] : null);
          setValue('generada_automaticamente', cuota.generada_automaticamente);
        }
      } catch (error) {
        console.error('Error al cargar dependencias:', error);
        setTopError('Error al cargar datos necesarios.');
      } finally {
        setLoading(false);
      }
    };

    loadDependencies();
  }, [id, isEdit, setValue]);

  const onSubmit: SubmitHandler<CuotaFormData> = async (data) => {
    setTopError('');
    setServerErrors({});

    try {
      if (isEdit && id) {
        await cuotaApi.update(Number(id), data);
      } else {
        await cuotaApi.create(data);
      }

      navigate('/administrador/cuotas');
    } catch (error) {
      const uiError = toUiError(error);
      if (uiError.fields) {
        setServerErrors(uiError.fields);
      } else if (uiError.message) {
        setTopError(uiError.message);
      } else {
        setTopError('Error al guardar la cuota.');
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
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {isEdit ? 'Editar Cuota' : 'Nueva Cuota'}
          </h2>
          <button
            onClick={() => navigate('/administrador/cuotas')}
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
          {/* Concepto */}
          <div>
            <label htmlFor="concepto" className="block text-sm font-medium text-gray-700 mb-1">
              Concepto *
            </label>
            <select
              id="concepto"
              {...register('concepto', { valueAsNumber: true })}
              className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                errors.concepto || serverErrors.concepto ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Selecciona un concepto</option>
              {conceptos.map(concepto => (
                <option key={concepto.id} value={concepto.id}>{concepto.nombre}</option>
              ))}
            </select>
            {errors.concepto && <p className="mt-1 text-sm text-red-600">{errors.concepto.message}</p>}
            {serverErrors.concepto?.map((m, i) => <p key={i} className="mt-1 text-sm text-red-600">{m}</p>)}
          </div>

          {/* Casa */}
          <div>
            <label htmlFor="casa" className="block text-sm font-medium text-gray-700 mb-1">
              Casa *
            </label>
            <select
              id="casa"
              {...register('casa', { valueAsNumber: true })}
              className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                errors.casa || serverErrors.casa ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Selecciona una casa</option>
              {casas.map(casa => (
                <option key={casa.id} value={casa.id}>Casa #{casa.numero}</option>
              ))}
            </select>
            {errors.casa && <p className="mt-1 text-sm text-red-600">{errors.casa.message}</p>}
            {serverErrors.casa?.map((m, i) => <p key={i} className="mt-1 text-sm text-red-600">{m}</p>)}
          </div>

          {/* Monto */}
          <div>
            <label htmlFor="monto" className="block text-sm font-medium text-gray-700 mb-1">
              Monto *
            </label>
            <input
              type="text"
              id="monto"
              {...register('monto')}
              placeholder="0.00"
              className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                errors.monto || serverErrors.monto ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.monto && <p className="mt-1 text-sm text-red-600">{errors.monto.message}</p>}
            {serverErrors.monto?.map((m, i) => <p key={i} className="mt-1 text-sm text-red-600">{m}</p>)}
          </div>

          {/* Período */}
          <div>
            <label htmlFor="periodo" className="block text-sm font-medium text-gray-700 mb-1">
              Período (mes de la cuota) *
            </label>
            <input
              type="date"
              id="periodo"
              {...register('periodo')}
              className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                errors.periodo || serverErrors.periodo ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.periodo && <p className="mt-1 text-sm text-red-600">{errors.periodo.message}</p>}
            {serverErrors.periodo?.map((m, i) => <p key={i} className="mt-1 text-sm text-red-600">{m}</p>)}
          </div>

          {/* Fecha de Vencimiento */}
          <div>
            <label htmlFor="fecha_vencimiento" className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de Vencimiento *
            </label>
            <input
              type="date"
              id="fecha_vencimiento"
              {...register('fecha_vencimiento')}
              className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                errors.fecha_vencimiento || serverErrors.fecha_vencimiento ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.fecha_vencimiento && <p className="mt-1 text-sm text-red-600">{errors.fecha_vencimiento.message}</p>}
            {serverErrors.fecha_vencimiento?.map((m, i) => <p key={i} className="mt-1 text-sm text-red-600">{m}</p>)}
          </div>

          {/* Estado */}
          <div>
            <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              id="estado"
              {...register('estado')}
              className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                errors.estado || serverErrors.estado ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="pendiente">Pendiente</option>
              <option value="pagada">Pagada</option>
              <option value="vencida">Vencida</option>
              <option value="cancelada">Cancelada</option>
            </select>
            {errors.estado && <p className="mt-1 text-sm text-red-600">{errors.estado.message}</p>}
            {serverErrors.estado?.map((m, i) => <p key={i} className="mt-1 text-sm text-red-600">{m}</p>)}
          </div>

          {/* Generada automáticamente */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="generada_automaticamente"
              {...register('generada_automaticamente')}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="generada_automaticamente" className="ml-2 block text-sm text-gray-700">
              Generada automáticamente
            </label>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/administrador/cuotas')}
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

export default CuotaForm;