'use client';

// src/pages/Administrador/Comunicado/ComunicadoForm.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import api from '../../../app/axiosInstance';
import { toUiError } from '../../../api/error';

// --- INLINE BackButton Component ---
const BackButton: React.FC = () => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(-1)}
      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:bg-gray-700 dark:hover:bg-gray-600"
    >
      <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
      </svg>
      Volver
    </button>
  );
};

// --- INLINE Spinner Component ---
interface SpinnerProps {
  size?: 'small' | 'medium' | 'large';
}

const Spinner: React.FC<SpinnerProps> = ({ size = 'medium' }) => {
  const sizeClasses = {
    small: 'w-4 h-4 border-2',
    medium: 'w-8 h-8 border-4',
    large: 'w-12 h-12 border-4',
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className={`animate-spin rounded-full ${sizeClasses[size]} border-t-transparent border-indigo-500 dark:border-indigo-300`}
        role="status"
      >
        <span className="sr-only">Cargando...</span>
      </div>
    </div>
  );
};


// Tipos de datos para el comunicado
interface ComunicadoFormData {
  titulo: string;
  contenido: string;
  estado: 'borrador' | 'publicado' | 'archivado';
  casa_destino: number | null;
  archivo_adjunto: FileList | null;
  fecha_expiracion: string | null;
  send_notification?: boolean; // Campo para indicar si se envía notificación
  target_recipients?: string; // Campo para especificar el grupo de destinatarios
}

interface Casa {
  id: number;
  nombre: string;
}

interface UsuarioSimple {
  id: number;
  nombre: string;
  apellido_paterno: string;
  username: string;
}

const ComunicadoForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [casas, setCasas] = useState<Casa[]>([]);
  const [usuarios, setUsuarios] = useState<UsuarioSimple[]>([]); // Para el destinatario único
  const isEditing = !!id;

  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<ComunicadoFormData>();

  const estadoWatch = watch('estado'); // Observar el campo 'estado'
  const sendNotificationWatch = watch('send_notification'); // Observar el campo 'send_notification'

  useEffect(() => {
    const fetchFormData = async () => {
      setLoading(true);
      try {
        const [casasRes, usuariosRes] = await Promise.all([
          api.get('/casas/'),
          // Obtener usuarios con roles relevantes, incluyendo 'Seguridad'
          api.get('/usuarios/?rol__nombre=Propietario,Inquilino,Administrador,Trabajador,Seguridad') 
        ]);
        setCasas(casasRes.data);
        setUsuarios(usuariosRes.data);

        if (isEditing) {
          const comunicadoRes = await api.get(`/comunicados/${id}/`);
          const comunicadoData = comunicadoRes.data;
          
          const formattedFechaExpiracion = comunicadoData.fecha_expiracion 
            ? new Date(comunicadoData.fecha_expiracion).toISOString().split('T')[0] 
            : '';

          reset({
            titulo: comunicadoData.titulo,
            contenido: comunicadoData.contenido,
            estado: comunicadoData.estado,
            casa_destino: comunicadoData.casa_destino || null,
            fecha_expiracion: formattedFechaExpiracion,
          });
        }
      } catch (error) {
        toast.error(toUiError(error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchFormData();
  }, [id, isEditing, reset]);

  const onSubmit = async (data: ComunicadoFormData) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('titulo', data.titulo);
    formData.append('contenido', data.contenido);
    formData.append('estado', data.estado);

    if (data.casa_destino) {
      formData.append('casa_destino', data.casa_destino.toString());
    }
    if (data.fecha_expiracion) {
      formData.append('fecha_expiracion', data.fecha_expiracion + 'T23:59:59Z'); 
    }
    if (data.archivo_adjunto && data.archivo_adjunto.length > 0) {
      formData.append('archivo_adjunto', data.archivo_adjunto[0]);
    }

    formData.append('send_notification', data.send_notification ? 'true' : 'false');
    if (data.target_recipients) {
        formData.append('target_recipients', data.target_recipients);
    }

    try {
      if (isEditing) {
        await api.patch(`/comunicados/${id}/`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Comunicado actualizado exitosamente.');
      } else {
        await api.post('/comunicados/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Comunicado creado exitosamente.');
      }
      navigate('/administrador/comunicados');
    } catch (error) {
      toast.error(toUiError(error).message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !casas.length) {
    return <Spinner />;
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          {isEditing ? 'Editar Comunicado' : 'Nuevo Comunicado'}
        </h1>
        <BackButton />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 space-y-6">
        {/* Título */}
        <div>
          <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Título
          </label>
          <input
            id="titulo"
            type="text"
            {...register('titulo', { required: 'El título es obligatorio' })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          />
          {errors.titulo && <p className="mt-1 text-sm text-red-600">{errors.titulo.message}</p>}
        </div>

        {/* Contenido */}
        <div>
          <label htmlFor="contenido" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Contenido
          </label>
          <textarea
            id="contenido"
            rows={5}
            {...register('contenido', { required: 'El contenido es obligatorio' })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          ></textarea>
          {errors.contenido && <p className="mt-1 text-sm text-red-600">{errors.contenido.message}</p>}
        </div>

        {/* Estado */}
        <div>
          <label htmlFor="estado" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Estado
          </label>
          <select
            id="estado"
            {...register('estado', { required: 'El estado es obligatorio' })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="borrador">Borrador</option>
            <option value="publicado">Publicado</option>
            <option value="archivado">Archivado</option>
          </select>
          {errors.estado && <p className="mt-1 text-sm text-red-600">{errors.estado.message}</p>}
        </div>

        {/* Casa Destino (Opcional) */}
        <div>
          <label htmlFor="casa_destino" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Casa Destino (Opcional, si es para una casa específica)
          </label>
          <select
            id="casa_destino"
            {...register('casa_destino')}
            // Add a specific class or directly apply styles for better visibility
            // The following classes are designed to ensure text is visible even with a blue background
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white
            [&_option]:bg-white [&_option]:text-gray-900 dark:[&_option]:bg-gray-700 dark:[&_option]:text-white
            dark:[&_option:hover]:bg-indigo-600 dark:[&_option:hover]:text-white
            [&_option:checked]:bg-indigo-600 [&_option:checked]:text-white dark:[&_option:checked]:bg-indigo-600 dark:[&_option:checked]:text-white
            "
          >
            <option value="">Todo el Condominio (por defecto)</option>
            {casas.map((casa) => (
              <option key={casa.id} value={casa.id}>
                {casa.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Fecha de Expiración (Opcional) */}
        <div>
          <label htmlFor="fecha_expiracion" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Fecha de Expiración (Opcional)
          </label>
          <input
            id="fecha_expiracion"
            type="date"
            {...register('fecha_expiracion')}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* Archivo Adjunto (Opcional) */}
        <div>
          <label htmlFor="archivo_adjunto" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Archivo Adjunto (PDF, Imagen)
          </label>
          <input
            id="archivo_adjunto"
            type="file"
            {...register('archivo_adjunto')}
            accept=".pdf,.jpg,.jpeg,.png"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:bg-gray-700 dark:text-white dark:file:bg-indigo-700 dark:file:text-white dark:hover:file:bg-indigo-600"
          />
        </div>

        {/* Sección de Notificaciones Push (Visible solo si el estado es 'publicado') */}
        {estadoWatch === 'publicado' && (
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md shadow-inner border border-gray-200 dark:border-gray-700 mt-6">
            <div className="flex items-center mb-4">
              <input
                id="send_notification"
                type="checkbox"
                {...register('send_notification')}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
              />
              <label htmlFor="send_notification" className="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Enviar Notificación Push (solo si es nuevo o se republica)
              </label>
            </div>

            {sendNotificationWatch && (
              <div>
                <label htmlFor="target_recipients" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Enviar a:
                </label>
                <select
                  id="target_recipients"
                  {...register('target_recipients')}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Según Casa Destino (o todo el condominio)</option>
                  <option value="todos">Todos los usuarios registrados</option>
                  <option value="administradores">Solo Administradores</option>
                  <option value="propietarios">Solo Propietarios</option>
                  <option value="inquilinos">Solo Inquilinos</option>
                  <option value="trabajadores">Solo Trabajadores</option>
                  <option value="seguridad">Solo Seguridad</option> {/* <--- NUEVA OPCIÓN */}
                  <optgroup label="Usuario Específico">
                    {usuarios.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.nombre} {user.apellido_paterno} ({user.username})
                      </option>
                    ))}
                  </optgroup>
                </select>
                {errors.target_recipients && <p className="mt-1 text-sm text-red-600">{errors.target_recipients.message}</p>}
              </div>
            )}
          </div>
        )}

        {/* Botón de Enviar */}
        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-700 dark:hover:bg-indigo-800"
            disabled={loading}
          >
            {loading ? <Spinner size="small" /> : (isEditing ? 'Actualizar Comunicado' : 'Crear Comunicado')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ComunicadoForm;