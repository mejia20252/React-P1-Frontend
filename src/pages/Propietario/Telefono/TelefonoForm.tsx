// src/pages/Administrador/Telefono/TelefonoForm.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toUiError } from '../../../api/error';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
// Importa las funciones de la API
import { createTelefono, fetchTelefono, updateTelefono } from '../../../api/telefono'; 
// Importa el esquema del teléfono (asegúrate de que TelefonoFormState ya no necesite 'usuario' como string para validación)
import { telefonoFormSchema, type TelefonoFormState } from '../../../schemas/scheama-telefono-propietario';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../../contexts/AuthContext'; // Import useAuth

const TelefonoForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = useMemo(() => Boolean(id), [id]);
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth(); // Get authenticated user from context

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
    // Default values: 'usuario' is not needed in the form state for Propietarios, 
    // as it's implicitly handled by the backend.
    defaultValues: { numero: '', tipo: '' }, 
  });
  console.log('📋 Errores del formulario:', errors);

  useEffect(() => {
    const loadTelefono = async () => {
      if (!isEdit || !id) {
      
         
        return;
      }
      setLoading(true);
      try {
        const data = await fetchTelefono(Number(id));
        reset({
          numero: data?.numero ?? '',
          tipo: data?.tipo ?? '',
          // 'usuario' field is removed as it's not managed by the Propietario directly
        });
      } catch (err) {
        setTopError('No se pudo cargar el teléfono.');
      } finally {
        setLoading(false);
      }
    };
    if (!authLoading) { // Ensure auth context is loaded before trying to load data
        loadTelefono();
    }
  }, [id, isEdit, reset, authLoading]);

  const onSubmit = async (values: TelefonoFormState) => {
    console.log('🚀 onSubmit ejecutado - Valores del formulario:', values); 
    setTopError('');
    if (!user?.id) {
        setTopError("Usuario no autenticado para realizar esta acción.");
        return;
    }
    try {
      let payload: any = {
        numero: values.numero,
        tipo: values.tipo,
      };

      // For Propietarios, we explicitly set the user ID from the auth context
      // for both creation and updates, as per the new requirement.
      payload.usuario = user.id;

      
      if (isEdit && id) {
        await updateTelefono(Number(id), payload); 
      } else {
        console.log('🚀 Payload que se enviará al servidor:', payload); 

        await createTelefono(payload); 
      }
      navigate('/propietario/telefonos'); 
    } catch (error) {
      console.log('🚀 errr'); 

      const ui = toUiError(error);
      if (ui.message) setTopError(ui.message);
      if (ui.fields) {
        (Object.keys(ui.fields) as (keyof TelefonoFormState)[]).forEach((field) => {
          const msgs = ui.fields?.[field];
          const message = Array.isArray(msgs) ? msgs.join(' ') : String(msgs ?? '');
          // 'usuario' field error handling removed as it's not a user-editable field anymore
          if (field === 'numero' || field === 'tipo') { // Only set errors for user-editable fields
            setError(field, { type: 'server', message });
          } else {
            if (message) setTopError((prev) => (prev ? `${prev} ${message}` : message));
          }
        });
      }
    }
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
        <p className="text-gray-600">Cargando perfil de usuario...</p>
      </div>
    );
  }

  // The 'usuario' field is no longer conditionally rendered as it's implicitly handled.

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{isEdit ? 'Editar Teléfono' : 'Nuevo Teléfono'}</h2>
          <button
            onClick={() => navigate('/propietario/telefonos')}
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
            
            {/* The 'usuario' field is removed from the UI as it's now handled implicitly */}

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/propietario/telefonos')}
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