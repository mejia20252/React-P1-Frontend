// src/pages/Administrador/Reserva/ReservaForm.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import { reservaCreateSchema, type ReservaFormData } from '../../../schemas/schema-reserva';
import { toUiError } from '../../../api/error';
import { reservaApi } from '../../../api/api-reserva';
import { areaComunApi } from '../../../api/api-area-comun';
import { residenteApi } from '../../../api/api-residente';
import type { Residente } from '../../../types/type-residente';
import type { AreaComun } from '../../../types/type-area-comun';

const ReservaForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [topError, setTopError] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({});
  const [areas, setAreas] = useState<AreaComun[]>([]);
  const [residentes, setResidentes] = useState<Residente[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<ReservaFormData>({
    resolver: zodResolver(reservaCreateSchema) as any,
    defaultValues: {
      area_comun: 0,
      residente: null,
      fecha: '',
      hora_inicio: '',
      hora_fin: '',
      estado: 'pendiente',
      pagada: false,
    },
  });

  // Cargar listas y datos si es edición
  useEffect(() => {
    const loadDependencies = async () => {
      try {
        const [areasData, residentesData] = await Promise.all([
          areaComunApi.getAll(),
          residenteApi.getAll(),
        ]);
        setAreas(areasData);
        setResidentes(residentesData);

        if (isEdit && id) {
          setLoading(true);
          const reserva = await reservaApi.getById(Number(id));
          setValue('area_comun', reserva.area_comun);
          setValue('residente', reserva.residente);
          setValue('fecha', reserva.fecha);
          setValue('hora_inicio', reserva.hora_inicio.slice(0, 5));
          setValue('hora_fin', reserva.hora_fin.slice(0, 5));
          setValue('estado', reserva.estado);
          setValue('pagada', reserva.pagada);
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

  const onSubmit = async (data: ReservaFormData) => {
    setTopError('');
    setFormErrors({});

    try {
      if (isEdit && id) {
        await reservaApi.update(Number(id), data);
      } else {
        await reservaApi.create(data);
      }

      navigate('/administrador/reservas');
    } catch (error) {
      const uiError = toUiError(error);
      if (uiError.fields) {
        setFormErrors(uiError.fields);
      } else if (uiError.message) {
        setTopError(uiError.message);
      } else {
        setTopError('Error al guardar la reserva.');
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
            {isEdit ? 'Editar Reserva' : 'Nueva Reserva'}
          </h2>
          <button
            onClick={() => navigate('/administrador/reservas')}
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
          {/* Área Común */}
          <div>
            <label htmlFor="area_comun" className="block text-sm font-medium text-gray-700 mb-1">
              Área Común *
            </label>
            <select
              id="area_comun"
              {...register('area_comun', { valueAsNumber: true })}
              className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                formErrors.area_comun ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value={0}>Selecciona un área</option>
              {areas.map(area => (
                <option key={area.id} value={area.id}>{area.nombre}</option>
              ))}
            </select>
            {formErrors.area_comun?.map((m, i) => (
              <p key={i} className="mt-1 text-sm text-red-600">{m}</p>
            ))}
          </div>

          {/* Residente */}
          <div>
            <label htmlFor="residente" className="block text-sm font-medium text-gray-700 mb-1">
              Residente (opcional)
            </label>
            <select
              id="residente"
              {...register('residente', { valueAsNumber: true })}
              className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                formErrors.residente ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Sin residente</option>
              {residentes.map(residente => (
                <option key={residente.id} value={residente.id}>
                  Residente {residente.id} (Usuario {residente.usuario})
                </option>
              ))}
            </select>
            {formErrors.residente?.map((m, i) => (
              <p key={i} className="mt-1 text-sm text-red-600">{m}</p>
            ))}
          </div>

          {/* Fecha */}
          <div>
            <label htmlFor="fecha" className="block text-sm font-medium text-gray-700 mb-1">
              Fecha *
            </label>
            <input
              type="date"
              id="fecha"
              {...register('fecha')}
              className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                formErrors.fecha ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {formErrors.fecha?.map((m, i) => (
              <p key={i} className="mt-1 text-sm text-red-600">{m}</p>
            ))}
          </div>

          {/* Hora Inicio */}
          <div>
            <label htmlFor="hora_inicio" className="block text-sm font-medium text-gray-700 mb-1">
              Hora de Inicio *
            </label>
            <input
              type="time"
              id="hora_inicio"
              {...register('hora_inicio')}
              className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                formErrors.hora_inicio ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {formErrors.hora_inicio?.map((m, i) => (
              <p key={i} className="mt-1 text-sm text-red-600">{m}</p>
            ))}
          </div>

          {/* Hora Fin */}
          <div>
            <label htmlFor="hora_fin" className="block text-sm font-medium text-gray-700 mb-1">
              Hora de Fin *
            </label>
            <input
              type="time"
              id="hora_fin"
              {...register('hora_fin')}
              className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                formErrors.hora_fin ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {formErrors.hora_fin?.map((m, i) => (
              <p key={i} className="mt-1 text-sm text-red-600">{m}</p>
            ))}
          </div>

          {/* Estado */}
          <div>
            <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              id="estado"
              {...register('estado')}
              className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300"
            >
              <option value="pendiente">Pendiente</option>
              <option value="confirmada">Confirmada</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </div>

          {/* Pagada */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="pagada"
              {...register('pagada')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="pagada" className="ml-2 block text-sm text-gray-700">
              Pagada
            </label>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/administrador/reservas')}
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

export default ReservaForm;