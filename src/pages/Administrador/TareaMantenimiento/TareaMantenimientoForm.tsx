import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faArrowLeft, faSave } from '@fortawesome/free-solid-svg-icons';
import { tareaMantenimientoApi } from '../../../api/api-tarea-mantenimiento';
import { casaApi } from '../../../api/api-casa';
import { areaComunApi } from '../../../api/api-area-comun';
import type { Casa } from '../../../types/type-casa';
import type { AreaComun } from '../../../types/type-area-comun';
import { toUiError } from '../../../api/error';
import { useForm, type SubmitHandler, type FieldErrors } from 'react-hook-form'; // Import FieldErrors

// Define the form data type directly as Zod schema is being removed
// This type should reflect the structure of your form data, including potential nulls for optional fields.
interface TareaMantenimientoFormData {
  titulo: string | null;
  descripcion: string | null;
  casa: number | null | undefined; // Keep undefined for initial select state, convert to null for submission
  area_comun: number | null | undefined; // Keep undefined for initial select state, convert to null for submission
  ubicacion_personalizada: string | null;
  prioridad: 'baja' | 'media' | 'alta' | 'critica';
  estado: 'creada' | 'asignada' | 'en_progreso' | 'completada' | 'cancelada';
  costo_estimado: string | null; // Use string for input, convert to number if needed before API call
}

const TareaMantenimientoForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [topError, setTopError] = useState('');
  // Use a more specific type for server errors if possible, or keep as Record<string, string[]>
  const [serverErrors, setServerErrors] = useState<Record<string, string[]>>({});
  const [casas, setCasas] = useState<Casa[]>([]);
  const [areas, setAreas] = useState<AreaComun[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError, // Add setError to manually set form errors
    clearErrors, // Add clearErrors to manually clear form errors
    formState: { isSubmitting, errors },
  } = useForm<TareaMantenimientoFormData>({
    // resolver: zodResolver(tareaMantenimientoCreateSchema), // REMOVED ZOD RESOLVER
    defaultValues: {
      titulo: '',
      descripcion: '',
      casa: undefined, // undefined for initial select state
      area_comun: undefined, // undefined for initial select state
      ubicacion_personalizada: '',
      prioridad: 'media',
      estado: 'creada',
      costo_estimado: '',
    },
  });

  // Observamos los campos para lógica condicional y manual validation
  const casaValue = watch('casa');
  const areaComunValue = watch('area_comun');
  const ubicacionValue = watch('ubicacion_personalizada') || '';

  // Cargar listas y datos si es edición
  useEffect(() => {
    const loadDependencies = async () => {
      try {
        const [casasData, areasData] = await Promise.all([
          casaApi.getAll(),
          areaComunApi.getAll(),
        ]);
        setCasas(casasData);
        setAreas(areasData);

        if (isEdit && id) {
          setLoading(true);
          const tarea = await tareaMantenimientoApi.getById(Number(id));
          setValue('titulo', tarea.titulo || '');
          setValue('descripcion', tarea.descripcion || '');
          setValue('casa', tarea.casa ?? undefined);
          setValue('area_comun', tarea.area_comun ?? undefined);
          setValue('ubicacion_personalizada', tarea.ubicacion_personalizada || '');
          setValue('prioridad', tarea.prioridad);
          setValue('estado', tarea.estado);
          setValue('costo_estimado', tarea.costo_estimado || '');
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

  // Manual validation function
  const validateForm = (data: TareaMantenimientoFormData): boolean => {
    let isValid = true;
    clearErrors(); // Clear all previous errors
    setServerErrors({}); // Clear server errors
    setTopError(''); // Clear top error

    const currentErrors: FieldErrors<TareaMantenimientoFormData> = {};

    // Validate titulo
    if (data.titulo && data.titulo.length > 200) {
      currentErrors.titulo = { type: 'maxLength', message: 'Máximo 200 caracteres' };
      isValid = false;
    }

    // Validate descripcion
    if (data.descripcion && data.descripcion.length > 1000) {
      currentErrors.descripcion = { type: 'maxLength', message: 'Máximo 1000 caracteres' };
      isValid = false;
    }

    // LOCATION VALIDATION LOGIC
    const hasCasa = (data.casa != null && !isNaN(data.casa) && data.casa > 0);
    const hasArea = (data.area_comun != null && !isNaN(data.area_comun) && data.area_comun > 0);
    const hasUbicacion = (data.ubicacion_personalizada || '').trim().length > 0;

    const countLocations = [hasCasa, hasArea, hasUbicacion].filter(Boolean).length;

    if (countLocations === 0) {
      currentErrors.casa = { type: 'manual', message: 'Debes especificar al menos una ubicación: casa, área común o ubicación personalizada.' };
      isValid = false;
    } else if (countLocations > 1) {
      currentErrors.casa = { type: 'manual', message: 'Solo puedes especificar UNA ubicación: casa, área común o ubicación personalizada.' };
      isValid = false;
    }
    
    // Validate ubicacion_personalizada length if present
    if (data.ubicacion_personalizada && data.ubicacion_personalizada.length > 200) {
        currentErrors.ubicacion_personalizada = { type: 'maxLength', message: 'Máximo 200 caracteres' };
        isValid = false;
    }

    // Validate prioridad (should be handled by select, but good to have a fallback)
    const validPriorities = ['baja', 'media', 'alta', 'critica'];
    if (!data.prioridad || !validPriorities.includes(data.prioridad)) {
      currentErrors.prioridad = { type: 'manual', message: 'Prioridad inválida.' };
      isValid = false;
    }

    // Validate estado (should be handled by select, but good to have a fallback)
    const validStates = ['creada', 'asignada', 'en_progreso', 'completada', 'cancelada'];
    if (!data.estado || !validStates.includes(data.estado)) {
      currentErrors.estado = { type: 'manual', message: 'Estado inválido.' };
      isValid = false;
    }

    // Validate costo_estimado
    if (data.costo_estimado && data.costo_estimado.trim() !== '') {
      const costRegex = /^\d+(\.\d{1,2})?$/;
      if (!costRegex.test(data.costo_estimado)) {
        currentErrors.costo_estimado = { type: 'pattern', message: 'Formato inválido. Usa hasta 2 decimales, ej: 50.00' };
        isValid = false;
      }
    }

    // Apply errors to react-hook-form
    if (!isValid) {
      for (const field in currentErrors) {
        if (currentErrors[field as keyof TareaMantenimientoFormData]) {
          setError(
            field as keyof TareaMantenimientoFormData,
            currentErrors[field as keyof TareaMantenimientoFormData] as { type: string; message: string }
          );
        }
      }
    }

    return isValid;
  };

  const onSubmit: SubmitHandler<TareaMantenimientoFormData> = async (data) => {
    setTopError('');
    setServerErrors({});

    // Manual validation step
    if (!validateForm(data)) {
        console.log("Form data invalid:", errors);
        return; // Stop submission if validation fails
    }

    try {
      // Clean up data for submission: convert undefined or NaN to null if necessary
      const submissionData = {
        ...data,
        titulo: data.titulo === '' ? null : data.titulo,
        descripcion: data.descripcion === '' ? null : data.descripcion,
        // Convert `undefined` (from select `value={undefined}`) or `NaN` (from `valueAsNumber` on empty string) to `null`
        casa: (data.casa === undefined || isNaN(data.casa as number)) ? null : data.casa,
        area_comun: (data.area_comun === undefined || isNaN(data.area_comun as number)) ? null : data.area_comun,
        // Ensure empty string for ubicacion_personalizada is converted to null
        ubicacion_personalizada: data.ubicacion_personalizada === '' ? null : data.ubicacion_personalizada,
        // Convert empty string cost_estimado to null
        costo_estimado: data.costo_estimado === '' ? null : data.costo_estimado
      };

      if (isEdit && id) {
        await tareaMantenimientoApi.update(Number(id), submissionData);
      } else {
        await tareaMantenimientoApi.create(submissionData);
      }

      navigate('/administrador/tareas-mantenimiento');
    } catch (error) {
      const uiError = toUiError(error);
      if (uiError.fields) {
        setServerErrors(uiError.fields);
      } else if (uiError.message) {
        setTopError(uiError.message);
      } else {
        setTopError('Error al guardar la tarea.');
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
            {isEdit ? 'Editar Tarea de Mantenimiento' : 'Nueva Tarea de Mantenimiento'}
          </h2>
          <button
            onClick={() => navigate('/administrador/tareas-mantenimiento')}
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
              Título (opcional)
            </label>
            <input
              type="text"
              id="titulo"
              {...register('titulo')}
              className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${errors.titulo || serverErrors.titulo ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="Ej: Reparar fuga en cocina"
            />
            {errors.titulo && (
              <p className="mt-1 text-sm text-red-600">{errors.titulo.message}</p>
            )}
            {serverErrors.titulo?.map((m, i) => (
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
              className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${errors.descripcion || serverErrors.descripcion ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="Detalles del trabajo a realizar..."
            />
            {errors.descripcion && (
              <p className="mt-1 text-sm text-red-600">{errors.descripcion.message}</p>
            )}
            {serverErrors.descripcion?.map((m, i) => (
              <p key={i} className="mt-1 text-sm text-red-600">{m}</p>
            ))}
          </div>

          {/* Ubicación — Casa */}
          <div>
            <label htmlFor="casa" className="block text-sm font-medium text-gray-700 mb-1">
              Casa (opcional, selecciona solo UNA ubicación)
            </label>
            <select
              id="casa"
              {...register('casa', { valueAsNumber: true })}
              className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${errors.casa || serverErrors.casa ? 'border-red-500' : 'border-gray-300'
                }`}
              disabled={!!areaComunValue || (ubicacionValue.trim().length > 0)}
            >
              {/* Use value={undefined} for the placeholder to resolve to null/undefined */}
              <option value={undefined}>Selecciona una casa</option>
              {casas.map(casa => (
                <option key={casa.id} value={casa.id}>Casa #{casa.numero}</option>
              ))}
            </select>
            {errors.casa && (
              <p className="mt-1 text-sm text-red-600">{errors.casa.message}</p>
            )}
            {serverErrors.casa?.map((m, i) => (
              <p key={i} className="mt-1 text-sm text-red-600">{m}</p>
            ))}
          </div>

          {/* Ubicación — Área Común */}
          <div>
            <label htmlFor="area_comun" className="block text-sm font-medium text-gray-700 mb-1">
              Área Común (opcional, selecciona solo UNA ubicación)
            </label>
            <select
              id="area_comun"
              {...register('area_comun', { valueAsNumber: true })}
              className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${errors.area_comun || serverErrors.area_comun ? 'border-red-500' : 'border-gray-300'
                }`}
              disabled={!!casaValue || (ubicacionValue.trim().length > 0)}
            >
              {/* Use value={undefined} for the placeholder to resolve to null/undefined */}
              <option value={undefined}>Selecciona un área común</option>
              {areas.map(area => (
                <option key={area.id} value={area.id}>{area.nombre}</option>
              ))}
            </select>
            {errors.area_comun && (
              <p className="mt-1 text-sm text-red-600">{errors.area_comun.message}</p>
            )}
            {serverErrors.area_comun?.map((m, i) => (
              <p key={i} className="mt-1 text-sm text-red-600">{m}</p>
            ))}
          </div>

          {/* Ubicación — Personalizada */}
          <div>
            <label htmlFor="ubicacion_personalizada" className="block text-sm font-medium text-gray-700 mb-1">
              Ubicación Personalizada (opcional, solo si no es casa ni área común)
            </label>
            <input
              type="text"
              id="ubicacion_personalizada"
              {...register('ubicacion_personalizada')}
              className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${errors.ubicacion_personalizada || serverErrors.ubicacion_personalizada ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="Ej: Estacionamiento sur, cerca de portería"
              disabled={!!casaValue || !!areaComunValue}
            />
            {errors.ubicacion_personalizada && (
              <p className="mt-1 text-sm text-red-600">{errors.ubicacion_personalizada.message}</p>
            )}
            {serverErrors.ubicacion_personalizada?.map((m, i) => (
              <p key={i} className="mt-1 text-sm text-red-600">{m}</p>
            ))}
          </div>

          {/* Prioridad */}
          <div>
            <label htmlFor="prioridad" className="block text-sm font-medium text-gray-700 mb-1">
              Prioridad
            </label>
            <select
              id="prioridad"
              {...register('prioridad')}
              className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${errors.prioridad || serverErrors.prioridad ? 'border-red-500' : 'border-gray-300'
                }`}
            >
              <option value="baja">Baja</option>
              <option value="media">Media</option>
              <option value="alta">Alta</option>
              <option value="critica">Crítica</option>
            </select>
            {errors.prioridad && (
              <p className="mt-1 text-sm text-red-600">{errors.prioridad.message}</p>
            )}
            {serverErrors.prioridad?.map((m, i) => (
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
              className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${errors.estado || serverErrors.estado ? 'border-red-500' : 'border-gray-300'
                }`}
            >
              <option value="creada">Creada</option>
              <option value="asignada">Asignada</option>
              <option value="en_progreso">En progreso</option>
              <option value="completada">Completada</option>
              <option value="cancelada">Cancelada</option>
            </select>
            {errors.estado && (
              <p className="mt-1 text-sm text-red-600">{errors.estado.message}</p>
            )}
            {serverErrors.estado?.map((m, i) => (
              <p key={i} className="mt-1 text-sm text-red-600">{m}</p>
            ))}
          </div>

          {/* Costo Estimado */}
          <div>
            <label htmlFor="costo_estimado" className="block text-sm font-medium text-gray-700 mb-1">
              Costo Estimado (USD, opcional)
            </label>
            <input
              type="text"
              id="costo_estimado"
              {...register('costo_estimado')}
              placeholder="0.00"
              className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${errors.costo_estimado || serverErrors.costo_estimado ? 'border-red-500' : 'border-gray-300'
                }`}
            />
            {errors.costo_estimado && (
              <p className="mt-1 text-sm text-red-600">{errors.costo_estimado.message}</p>
            )}
            {serverErrors.costo_estimado?.map((m, i) => (
              <p key={i} className="mt-1 text-sm text-red-600">{m}</p>
            ))}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/administrador/tareas-mantenimiento')}
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

export default TareaMantenimientoForm;