// src/pages/Administrador/Telefono/TelefonoForm.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toUiError } from '../../../api/error';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
// Importa las funciones de la API
import { createTelefono, fetchTelefono, updateTelefono } from '../../../api/telefono'; 
import { telefonoFormSchema, telefonoSchema, type TelefonoFormState } from '../../../schemas/telefono';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';


const TelefonoForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = useMemo(() => Boolean(id), [id]);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [topError, setTopError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<TelefonoFormState>({
    resolver: zodResolver(telefonoFormSchema), // Usa el esquema del formulario
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: { numero: '', tipo: '', usuario: '' },
  });

  useEffect(() => {
    const loadTelefono = async () => {
      if (!isEdit || !id) return;
      setLoading(true);
      try {
        // Usa la función de la API para obtener los datos
        const data = await fetchTelefono(Number(id));
        reset({
          numero: data?.numero ?? '',
          tipo: data?.tipo ?? '',
          usuario: String(data?.usuario) ?? '', // Convertir el ID de usuario a string
        });
      } catch (err) {
        setTopError('No se pudo cargar el teléfono.');
      } finally {
        setLoading(false);
      }
    };
    loadTelefono();
  }, [id, isEdit, reset]);

  const onSubmit = async (values: TelefonoFormState) => {
    setTopError('');
    try {
      // Validar los datos finales usando el esquema de la API antes de enviarlos
      const parsedValues = telefonoSchema.parse({
        ...values,
        usuario: Number(values.usuario), // Convertir el ID de usuario a número
      });

      if (isEdit && id) {
        // Usar la función de la API de actualización
        await updateTelefono(Number(id), parsedValues);
      } else {
        // Usar la función de la API de creación
        await createTelefono(parsedValues);
      }
      navigate('/administrador/telefonos');
    } catch (error) {
      const ui = toUiError(error);
      if (ui.message) setTopError(ui.message);
      if (ui.fields) {
        (Object.keys(ui.fields) as (keyof TelefonoFormState)[]).forEach((field) => {
          const msgs = ui.fields?.[field];
          const message = Array.isArray(msgs) ? msgs.join(' ') : String(msgs ?? '');
          if (field in values) {
            setError(field, { type: 'server', message });
          } else {
            if (message) setTopError((prev) => (prev ? `${prev} ${message}` : message));
          }
        });
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{isEdit ? 'Editar Teléfono' : 'Nuevo Teléfono'}</h2>
          <button
            onClick={() => navigate('/administrador/telefonos')}
            className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
            aria-label="Volver a la lista de teléfonos"
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
            <p className="text-gray-600">Cargando datos…</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
            <div>
              <label htmlFor="numero" className="block text-sm font-medium text-gray-700 mb-1">
                Número
              </label>
              <input
                id="numero"
                type="text"
                {...register('numero')}
                placeholder="Ej. 1234567890"
                aria-invalid={!!errors.numero}
                aria-describedby={errors.numero ? 'numero-err' : undefined}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.numero && (
                <p id="numero-err" className="mt-2 text-sm text-red-600">
                  {errors.numero.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-1">
                Tipo
              </label>
              <input
                id="tipo"
                type="text"
                {...register('tipo')}
                placeholder="Ej. Celular, Fijo"
                aria-invalid={!!errors.tipo}
                aria-describedby={errors.tipo ? 'tipo-err' : undefined}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.tipo && (
                <p id="tipo-err" className="mt-2 text-sm text-red-600">
                  {errors.tipo.message}
                </p>
              )}
            </div>
            
            {/* Campo para el ID de usuario */}
            <div>
              <label htmlFor="usuario" className="block text-sm font-medium text-gray-700 mb-1">
                ID de Usuario
              </label>
              <input
                id="usuario"
                type="text"
                {...register('usuario')}
                placeholder="ID del usuario asociado"
                aria-invalid={!!errors.usuario}
                aria-describedby={errors.usuario ? 'usuario-err' : undefined}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.usuario && (
                <p id="usuario-err" className="mt-2 text-sm text-red-600">
                  {errors.usuario.message}
                </p>
              )}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/administrador/telefonos')}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors duration-200"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex items-center px-4 py-2 text-sm font-medium text-white rounded-md transition-colors duration-200 ${
                  isSubmitting
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
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
                    Guardar
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

export default TelefonoForm;