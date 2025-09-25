// AsignacionTareasFrom.tsx
import React, { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../../app/axiosInstance';
import { toUiError } from '../../../api/error';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
// Definición de tipos para la API
interface ApiTareaMantenimiento {
    id: number;
    titulo: string;
    descripcion: string;
}
interface ApiPerfilTrabajador {
    id: number;
    usuario_nombre_completo: string;
    especialidades: string[];
}
interface ApiUsuario {
    id: number;
    nombre: string;
    apellido_paterno: string;
    email: string;
}
interface ApiAsignacionTarea {
    id: number | string;
    tarea: number;
    trabajador: number;
    asignado_por: number | null; // ID del usuario que asignó
    fecha_asignacion: string;
    fecha_completado: string | null;
    estado_asignacion: 'activa' | 'completada' | 'cancelada' | 'reasignada';
    observaciones: string | null;
    // Agrega estos campos para la visualización, ya que el serializer los devuelve
    asignado_por_nombre_completo?: string;
}
// Tipo para el estado del formulario
interface FormInput {
    tarea: number;
    trabajador: number;
    estado_asignacion: 'activa' | 'completada' | 'cancelada' | 'reasignada';
    observaciones: string;
}
// Tipo para los errores del formulario
type FormErrors = {
    [K in keyof FormInput]?: string;
} & { topError?: string };
const AsignacionTareaForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const isEdit = useMemo(() => Boolean(id), [id]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<FormInput>({
        tarea: 0,
        trabajador: 0,
        estado_asignacion: 'activa',
        observaciones: '',
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDirty, setIsDirty] = useState(false);
    const [asignadoPorNombre, setAsignadoPorNombre] = useState<string | null>(null);
    const [tareas, setTareas] = useState<ApiTareaMantenimiento[]>([]);
    const [trabajadores, setTrabajadores] = useState<ApiPerfilTrabajador[]>([]);
    const [usuariosAdmin, setUsuariosAdmin] = useState<ApiUsuario[]>([]); // Para el campo 'asignado_por' (solo lectura en el form, lo gestiona el backend)
    // Cargar listas de tareas, trabajadores y administradores
    useEffect(() => {
        const fetchDependencies = async () => {
            try {
                const [tareasRes, trabajadoresRes, usuariosRes] = await Promise.all([
                    axiosInstance.get<ApiTareaMantenimiento[]>('/tareas-mantenimiento/'),
                    axiosInstance.get<ApiPerfilTrabajador[]>('/perfiles-trabajador/'),
                    axiosInstance.get<ApiUsuario[]>('/usuarios/?rol__nombre=Administrador'),
                ]);
                setTareas(tareasRes.data.filter(t => t.titulo));
                setTrabajadores(trabajadoresRes.data.filter(t => t.usuario_nombre_completo));
                setUsuariosAdmin(usuariosRes.data.filter(u => u.nombre && u.apellido_paterno));
            } catch (err) {
                console.error('Error al cargar dependencias para asignación de tareas', err);
                toast.error('Error al cargar listas de tareas, trabajadores o administradores.');
            }
        };

        fetchDependencies();
    }, []);
    // Cargar datos en modo edición
    useEffect(() => {
        const loadAsignacionTarea = async () => {
            if (!isEdit || !id) return;
            setLoading(true);
            try {
                const { data } = await axiosInstance.get<ApiAsignacionTarea>(`/asignaciones-tarea/${id}/`);
                setFormData({
                    tarea: data.tarea,
                    trabajador: data.trabajador,
                    estado_asignacion: data.estado_asignacion,
                    observaciones: data.observaciones || '',
                });
                // Establece el nombre del usuario que asignó para mostrarlo
                if (data.asignado_por_nombre_completo) {
                    setAsignadoPorNombre(data.asignado_por_nombre_completo);
                } else {
                    // Si no viene directamente, busca en usuariosAdmin si el ID existe
                    const asignador = usuariosAdmin.find(u => u.id === data.asignado_por);
                    setAsignadoPorNombre(asignador ? `${asignador.nombre} ${asignador.apellido_paterno}` : 'Desconocido');
                }
                setIsDirty(false); // Reset dirty state after loading
            } catch (err) {
                setErrors({ topError: 'No se pudo cargar la asignación de tarea.' });
                toast.error('Error al cargar la asignación de tarea.');
            } finally {
                setLoading(false);
            }
        };
        loadAsignacionTarea();
    }, [id, isEdit, usuariosAdmin]);
    const handleChange = (e: ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
        setIsDirty(true);
        // Clear error for the field being changed
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[name as keyof FormInput];
            return newErrors;
        });
    };
    const validateForm = (data: FormInput): FormErrors => {
        const newErrors: FormErrors = {};

        if (data.tarea <= 0) {
            newErrors.tarea = 'Debe seleccionar una tarea.';
        }
        if (data.trabajador <= 0) {
            newErrors.trabajador = 'Debe seleccionar un trabajador.';
        }

        return newErrors;
    };
    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setErrors({}); // Clear previous errors
        setIsSubmitting(true);

        const validationErrors = validateForm(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setIsSubmitting(false);
            toast.error('Por favor, corrija los errores del formulario.');
            return;
        }

        // Transform data for API
        const payload = {
            ...formData,
            observaciones: formData.observaciones || null, // Convert empty string to null for API if nullable
        };

        try {
            if (isEdit && id) {
                await axiosInstance.patch(`/asignaciones-tarea/${id}/`, payload);
                toast.success('Asignación de tarea actualizada exitosamente.');
            } else {
                await axiosInstance.post(`/asignaciones-tarea/`, payload);
                toast.success('Asignación de tarea creada exitosamente.');
            }
            navigate('/administrador/asignacionestarea');
        } catch (error) {
            console.error('Error al guardar asignación de tarea', error);
            const ui = toUiError(error);
            const apiErrors: FormErrors = {};
            if (ui.message) apiErrors.topError = ui.message;

            if (ui.fields) {
                (Object.keys(ui.fields) as (keyof FormInput)[]).forEach((field) => {
                    const msgs = ui.fields?.[field as string];
                    const message = Array.isArray(msgs) ? msgs.join(' ') : String(msgs ?? '');
                    if (field in formData) {
                        apiErrors[field] = message;
                    } else {
                        if (message) apiErrors.topError = (apiErrors.topError ? `${apiErrors.topError} ${message}` : message);
                    }
                });
            }
            setErrors(apiErrors);
            toast.error(ui.message || 'Error al guardar la asignación de tarea.');
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
            <div className="w-full max-w-lg bg-white rounded-lg shadow-xl p-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">{isEdit ? 'Editar Asignación de Tarea' : 'Nueva Asignación de Tarea'}</h2>
                    <button
                        onClick={() => navigate('/administrador/asignacionestarea')}
                        className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                        aria-label="Volver a la lista de asignaciones de tareas"
                    >
                        <FontAwesomeIcon icon={faTimes} size="lg" />
                    </button>
                </div>

                {errors.topError && (
                    <div className="mb-4 p-3 rounded-md bg-red-100 border border-red-200 text-red-700 text-sm">
                        {errors.topError}
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center items-center min-h-[150px]">
                        <p className="text-gray-600">Cargando datos…</p>
                    </div>
                ) : (
                    <form onSubmit={onSubmit} noValidate className="space-y-6">
                        {/* Campo Tarea */}
                        <div>
                            <label htmlFor="tarea" className="block text-sm font-medium text-gray-700 mb-1">
                                Tarea de Mantenimiento
                            </label>
                            <select
                                id="tarea"
                                name="tarea"
                                value={formData.tarea}
                                onChange={handleChange}
                                aria-invalid={!!errors.tarea}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                disabled={isEdit} // Disable task selection in edit mode to avoid re-assigning the same task
                            >
                                <option value={0}>Seleccione una tarea...</option>
                                {tareas.map((t) => (
                                    <option key={t.id} value={t.id}>
                                        {t.titulo || `Tarea #${t.id}`}
                                    </option>
                                ))}
                            </select>
                            {errors.tarea && (
                                <p id="tarea-err" className="mt-2 text-sm text-red-600">
                                    {errors.tarea}
                                </p>
                            )}
                        </div>

                        {/* Campo Trabajador */}
                        <div>
                            <label htmlFor="trabajador" className="block text-sm font-medium text-gray-700 mb-1">
                                Trabajador Asignado
                            </label>
                            <select
                                id="trabajador"
                                name="trabajador"
                                value={formData.trabajador}
                                onChange={handleChange}
                                aria-invalid={!!errors.trabajador}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                disabled={isEdit} // Disable worker selection in edit mode to avoid re-assigning the same worker
                            >
                                <option value={0}>Seleccione un trabajador...</option>
                                {trabajadores.map((t) => (
                                    <option key={t.id} value={t.id}>
                                        {t.usuario_nombre_completo} ({t.especialidades.join(', ')})
                                    </option>
                                ))}
                            </select>
                            {errors.trabajador && (
                                <p id="trabajador-err" className="mt-2 text-sm text-red-600">
                                    {errors.trabajador}
                                </p>
                            )}
                        </div>
                        {isEdit && (
                            <div>
                                <label htmlFor="asignado_por" className="block text-sm font-medium text-gray-700 mb-1">
                                    Asignado Por
                                </label>
                                <input
                                    id="asignado_por"
                                    name="asignado_por"
                                    type="text"
                                    value={asignadoPorNombre || 'Cargando...'}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 cursor-not-allowed"
                                    readOnly
                                    aria-label="Usuario que asignó la tarea"
                                />
                            </div>
                        )}

                        {/* Campo Estado de Asignación */}
                        <div>
                            <label htmlFor="estado_asignacion" className="block text-sm font-medium text-gray-700 mb-1">
                                Estado de la Asignación
                            </label>
                            <select
                                id="estado_asignacion"
                                name="estado_asignacion"
                                value={formData.estado_asignacion}
                                onChange={handleChange}
                                aria-invalid={!!errors.estado_asignacion}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="activa">Activa</option>
                                <option value="completada">Completada</option>
                                <option value="cancelada">Cancelada</option>
                                <option value="reasignada">Reasignada</option>
                            </select>
                            {errors.estado_asignacion && (
                                <p id="estado_asignacion-err" className="mt-2 text-sm text-red-600">
                                    {errors.estado_asignacion}
                                </p>
                            )}
                        </div>

                        {/* Campo Observaciones */}
                        <div>
                            <label htmlFor="observaciones" className="block text-sm font-medium text-gray-700 mb-1">
                                Observaciones (opcional)
                            </label>
                            <textarea
                                id="observaciones"
                                name="observaciones"
                                value={formData.observaciones}
                                onChange={handleChange}
                                placeholder="Notas adicionales sobre la asignación..."
                                rows={3}
                                aria-invalid={!!errors.observaciones}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            ></textarea>
                            {errors.observaciones && (
                                <p id="observaciones-err" className="mt-2 text-sm text-red-600">
                                    {errors.observaciones}
                                </p>
                            )}
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => navigate('/administrador/asignacionestarea')}
                                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors duration-200"
                            >
                                <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`flex items-center px-4 py-2 text-sm font-medium text-white rounded-md transition-colors duration-200 ${isSubmitting
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
                        {isDirty && (
                            <p className="text-sm text-center text-gray-500 mt-4">Tienes cambios sin guardar.</p>
                        )}
                    </form>
                )}
            </div>
        </div>
    );
};
export default AsignacionTareaForm;