// src/pages/Administrador/Comunicado/ComunicadoForm.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faArrowLeft, faSave } from '@fortawesome/free-solid-svg-icons';
import { comunicadoApi } from '../../../api/api-comunicado';
import { casaApi } from '../../../api/api-casa';
import type { Casa } from '../../../types/type-casa';
import type { ComunicadoFormData } from '../../../schemas/schema-comunicado';
import { toUiError } from '../../../api/error';
import { useForm, type SubmitHandler, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { comunicadoCreateSchemaWithValidation } from '../../../schemas/schema-comunicado';

const ComunicadoForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [topError, setTopError] = useState('');
  const [serverErrors, setServerErrors] = useState<Record<string, string[]>>({});
  const [casas, setCasas] = useState<Casa[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<ComunicadoFormData>({
    resolver: zodResolver(comunicadoCreateSchemaWithValidation) as unknown as Resolver<
      ComunicadoFormData,
      any
    >,
    defaultValues: {
      titulo: '',
      contenido: '',
      fecha_publicacion: null,
      estado: 'borrador',
      casa_destino: null,
      fecha_expiracion: null,
    },
  });

  const estadoValue = watch('estado');

  // Cargar casas y datos si es edición
  useEffect(() => {
    const loadDependencies = async () => {
      setLoading(true); // Start loading when dependencies are being loaded
      try {
        const casasData = await casaApi.getAll();
        setCasas(casasData);

        if (isEdit && id) {
          const comunicado = await comunicadoApi.getById(Number(id));

          setValue('titulo', comunicado.titulo);
          setValue('contenido', comunicado.contenido);
          // Assuming fecha_publicacion and fecha_expiracion are ISO strings or null
          setValue('fecha_publicacion', comunicado.fecha_publicacion ? new Date(comunicado.fecha_publicacion).toISOString().slice(0, 16) : null);
          setValue('estado', comunicado.estado);
          setValue('casa_destino', comunicado.casa_destino);
          setValue('fecha_expiracion', comunicado.fecha_expiracion ? new Date(comunicado.fecha_expiracion).toISOString().slice(0, 16) : null);
        }
      } catch (error) {
        console.error('Error al cargar datos:', error);
        setTopError('Error al cargar datos necesarios.');
      } finally {
        setLoading(false); // End loading regardless of success or failure
      }
    };

    loadDependencies();
  }, [id, isEdit, setValue]);

  const onSubmit: SubmitHandler<ComunicadoFormData> = async (data) => {
    setTopError('');
    setServerErrors({});

    try {
      const formData = new FormData();

      formData.append('titulo', data.titulo);
      formData.append('contenido', data.contenido);
      formData.append('estado', data.estado);

      // Ensure dates are sent explicitly, even if null.
      // If data.fecha_publicacion is null, an empty string will be sent, which the backend should interpret as null.
      // If it's an ISO string, the string will be sent.
      formData.append('fecha_publicacion', data.fecha_publicacion || '');
      formData.append('fecha_expiracion', data.fecha_expiracion || '');

      // If casa_destino is null, an empty string is sent.
      formData.append('casa_destino', data.casa_destino ? data.casa_destino.toString() : '');

      if (isEdit && id) {
        await comunicadoApi.update(Number(id), formData as any);
      } else {
        await comunicadoApi.create(formData as any);
      }

      navigate('/administrador/comunicados');
    } catch (error) {
      const uiError = toUiError(error);
      if (uiError.fields) {
        setServerErrors(uiError.fields);
      } else if (uiError.message) {
        setTopError(uiError.message);
      } else {
        setTopError('Error al guardar el comunicado.');
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
            {isEdit ? 'Editar Comunicado' : 'Nuevo Comunicado'}
          </h2>
          <button
            onClick={() => navigate('/administrador/comunicados')}
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
          {/* Título */}
          <div>
            <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-1">
              Título *
            </label>
            <input
              type="text"
              id="titulo"
              {...register('titulo')}
              className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${errors.titulo || serverErrors.titulo ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="Ej: Aviso de corte de agua"
            />
            {errors.titulo && <p className="mt-1 text-sm text-red-600">{errors.titulo.message}</p>}
            {serverErrors.titulo?.map((m, i) => <p key={i} className="mt-1 text-sm text-red-600">{m}</p>)}
          </div>

          {/* Contenido */}
          <div>
            <label htmlFor="contenido" className="block text-sm font-medium text-gray-700 mb-1">
              Contenido *
            </label>
            <textarea
              id="contenido"
              {...register('contenido')}
              rows={5}
              className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${errors.contenido || serverErrors.contenido ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="Escribe aquí el contenido del comunicado..."
            />
            {errors.contenido && <p className="mt-1 text-sm text-red-600">{errors.contenido.message}</p>}
            {serverErrors.contenido?.map((m, i) => <p key={i} className="mt-1 text-sm text-red-600">{m}</p>)}
          </div>

          {/* Estado */}
          <div>
            <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              id="estado"
              {...register('estado')}
              className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${errors.estado || serverErrors.estado ? 'border-red-500' : 'border-gray-300'
                }`}
            >
              <option value="borrador">Borrador</option>
              <option value="publicado">Publicado</option>
              <option value="archivado">Archivado</option>
            </select>
            {errors.estado && <p className="mt-1 text-sm text-red-600">{errors.estado.message}</p>}
            {serverErrors.estado?.map((m, i) => <p key={i} className="mt-1 text-sm text-red-600">{m}</p>)}
          </div>

          {/* Fecha de Publicación (requerida si estado=publicado) */}
          <div>
            <label htmlFor="fecha_publicacion" className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de Publicación {estadoValue === 'publicado' && <span className="text-red-500">*</span>}
            </label>
            <input
              type="datetime-local"
              id="fecha_publicacion"
              {...register('fecha_publicacion')}
              className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${errors.fecha_publicacion || serverErrors.fecha_publicacion ? 'border-red-500' : 'border-gray-300'
                }`}
              disabled={estadoValue !== 'publicado'}
            />
            {errors.fecha_publicacion && <p className="mt-1 text-sm text-red-600">{errors.fecha_publicacion.message}</p>}
            {serverErrors.fecha_publicacion?.map((m, i) => <p key={i} className="mt-1 text-sm text-red-600">{m}</p>)}
          </div>

          {/* Casa Destino (opcional) */}
          <div>
            <label htmlFor="casa_destino" className="block text-sm font-medium text-gray-700 mb-1">
              Casa Destino (opcional)
            </label>
            <select
              id="casa_destino"
              {...register('casa_destino', { valueAsNumber: true })}
              className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${errors.casa_destino || serverErrors.casa_destino ? 'border-red-500' : 'border-gray-300'
                }`}
            >
              <option value="">Todo el condominio</option>
              {casas.map(casa => (
                <option key={casa.id} value={casa.id}>
                  Casa #{casa.numero_casa}
                </option>
              ))}
            </select>
            {errors.casa_destino && <p className="mt-1 text-sm text-red-600">{errors.casa_destino.message}</p>}
            {serverErrors.casa_destino?.map((m, i) => <p key={i} className="mt-1 text-sm text-red-600">{m}</p>)}
          </div>

          {/* Fecha de Expiración (opcional) */}
          <div>
            <label htmlFor="fecha_expiracion" className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de Expiración (opcional)
            </label>
            <input
              type="datetime-local"
              id="fecha_expiracion"
              {...register('fecha_expiracion')}
              className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${errors.fecha_expiracion || serverErrors.fecha_expiracion ? 'border-red-500' : 'border-gray-300'
                }`}
            />
            {errors.fecha_expiracion && <p className="mt-1 text-sm text-red-600">{errors.fecha_expiracion.message}</p>}
            {serverErrors.fecha_expiracion?.map((m, i) => <p key={i} className="mt-1 text-sm text-red-600">{m}</p>)}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/administrador/comunicados')}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors duration-200"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex items-center px-4 py-2 text-sm font-medium text-white rounded-md transition-colors duration-200 ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
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

export default ComunicadoForm;