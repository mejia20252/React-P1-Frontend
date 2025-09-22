import React, { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../../app/axiosInstance';
import { toUiError } from '../../../api/error';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import type { ApiContratoArrendamiento, ApiUsuario, ApiCasa } from '../../../types/ContratoArrendamiento';

// Tipo para el estado del formulario
interface FormInput {
    arrendatario: number;
    unidad: number;
    propietario: number;
    fecha_inicio: string;
    fecha_fin: string; // Se maneja como string para el input type="date"
    esta_activo: boolean;
}

// Tipo para los errores del formulario
type FormErrors = {
    [K in keyof FormInput]?: string;
} & { topError?: string };

const ContratoArrendamientoForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const isEdit = useMemo(() => Boolean(id), [id]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<FormInput>({
        arrendatario: 0,
        unidad: 0,
        propietario: 0,
        fecha_inicio: '',
        fecha_fin: '',
        esta_activo: true,
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDirty, setIsDirty] = useState(false);

    const [arrendatarios, setArrendatarios] = useState<ApiUsuario[]>([]);
    const [unidades, setUnidades] = useState<ApiCasa[]>([]);
    const [propietarios, setPropietarios] = useState<ApiUsuario[]>([]);

    // Cargar listas de arrendatarios, unidades y propietarios
    useEffect(() => {
        const fetchDependencies = async () => {
            try {
                const [arrendatariosRes, unidadesRes, propietariosRes] = await Promise.all([
                    axiosInstance.get<ApiUsuario[]>('/usuarios/?rol__nombre=Inquilino'),
                    axiosInstance.get<ApiCasa[]>('/casas/'),
                    axiosInstance.get<ApiUsuario[]>('/usuarios/?rol__nombre=Propietario'),
                ]);
                setArrendatarios(arrendatariosRes.data);
                setUnidades(unidadesRes.data);
                setPropietarios(propietariosRes.data);
            } catch (err) {
                console.error('Error al cargar dependencias para contrato de arrendamiento', err);
                toast.error('Error al cargar listas de usuarios o casas.');
            }
        };
        fetchDependencies();
    }, []);

    // Cargar datos en modo edición
    useEffect(() => {
        const loadContratoArrendamiento = async () => {
            if (!isEdit || !id) return;
            setLoading(true);
            try {
                const { data } = await axiosInstance.get<ApiContratoArrendamiento>(`/contratos-arrendamiento/${id}/`);
                setFormData({
                    arrendatario: data.arrendatario,
                    unidad: data.unidad,
                    propietario: data.propietario,
                    fecha_inicio: data.fecha_inicio,
                    fecha_fin: data.fecha_fin || '',
                    esta_activo: data.esta_activo,
                });
                setIsDirty(false); // Reset dirty state after loading
            } catch (err) {
                setErrors({ topError: 'No se pudo cargar el contrato de arrendamiento.' });
                toast.error('Error al cargar el contrato de arrendamiento.');
            } finally {
                setLoading(false);
            }
        };
        loadContratoArrendamiento();
    }, [id, isEdit]);

      const handleChange = (e: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value, type } = e.target;
        
        // Explicitly check the type to access 'checked' property
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
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

        if (data.arrendatario <= 0) {
            newErrors.arrendatario = 'Debe seleccionar un arrendatario.';
        }
        if (data.unidad <= 0) {
            newErrors.unidad = 'Debe seleccionar una unidad.';
        }
        if (data.propietario <= 0) {
            newErrors.propietario = 'Debe seleccionar un propietario.';
        }
        if (!data.fecha_inicio) {
            newErrors.fecha_inicio = 'La fecha de inicio es obligatoria.';
        }
        // Opcional: Validar que fecha_fin sea posterior a fecha_inicio si está presente
        if (data.fecha_inicio && data.fecha_fin && new Date(data.fecha_fin) < new Date(data.fecha_inicio)) {
            newErrors.fecha_fin = 'La fecha de fin no puede ser anterior a la fecha de inicio.';
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
            fecha_fin: formData.fecha_fin || null, // Convert empty string to null for API if nullable
        };

        try {
            if (isEdit && id) {
                await axiosInstance.patch(`/contratos-arrendamiento/${id}/`, payload);
                toast.success('Contrato de arrendamiento actualizado exitosamente.');
            } else {
                await axiosInstance.post(`/contratos-arrendamiento/`, payload);
                toast.success('Contrato de arrendamiento creado exitosamente.');
            }
            navigate('/administrador/contratos-arrendamiento');
        } catch (error) {
            console.error('Error al guardar contrato de arrendamiento', error);
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
            toast.error(ui.message || 'Error al guardar el contrato de arrendamiento.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
            <div className="w-full max-w-lg bg-white rounded-lg shadow-xl p-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">{isEdit ? 'Editar Contrato de Arrendamiento' : 'Nuevo Contrato de Arrendamiento'}</h2>
                    <button
                        onClick={() => navigate('/administrador/contratos-arrendamiento')}
                        className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                        aria-label="Volver a la lista de contratos de arrendamiento"
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
                        {/* Campo Arrendatario */}
                        <div>
                            <label htmlFor="arrendatario" className="block text-sm font-medium text-gray-700 mb-1">
                                Arrendatario (Inquilino)
                            </label>
                            <select
                                id="arrendatario"
                                name="arrendatario"
                                value={formData.arrendatario}
                                onChange={handleChange}
                                aria-invalid={!!errors.arrendatario}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value={0}>Seleccione un arrendatario...</option>
                                {arrendatarios.map((u) => (
                                    <option key={u.id} value={u.id}>
                                        {u.nombre} {u.apellido_paterno} ({u.email})
                                    </option>
                                ))}
                            </select>
                            {errors.arrendatario && (
                                <p id="arrendatario-err" className="mt-2 text-sm text-red-600">
                                    {errors.arrendatario}
                                </p>
                            )}
                        </div>

                        {/* Campo Unidad (Casa) */}
                        <div>
                            <label htmlFor="unidad" className="block text-sm font-medium text-gray-700 mb-1">
                                Unidad (Casa)
                            </label>
                            <select
                                id="unidad"
                                name="unidad"
                                value={formData.unidad}
                                onChange={handleChange}
                                aria-invalid={!!errors.unidad}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value={0}>Seleccione una unidad...</option>
                                {unidades.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.torre_o_bloque ? `${c.torre_o_bloque} - ` : ''}Casa {c.numero_casa} ({c.estado_ocupacion})
                                    </option>
                                ))}
                            </select>
                            {errors.unidad && (
                                <p id="unidad-err" className="mt-2 text-sm text-red-600">
                                    {errors.unidad}
                                </p>
                            )}
                        </div>

                        {/* Campo Propietario */}
                        <div>
                            <label htmlFor="propietario" className="block text-sm font-medium text-gray-700 mb-1">
                                Propietario
                            </label>
                            <select
                                id="propietario"
                                name="propietario"
                                value={formData.propietario}
                                onChange={handleChange}
                                aria-invalid={!!errors.propietario}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value={0}>Seleccione un propietario...</option>
                                {propietarios.map((u) => (
                                    <option key={u.id} value={u.id}>
                                        {u.nombre} {u.apellido_paterno} ({u.email})
                                    </option>
                                ))}
                            </select>
                            {errors.propietario && (
                                <p id="propietario-err" className="mt-2 text-sm text-red-600">
                                    {errors.propietario}
                                </p>
                            )}
                        </div>

                        {/* Campo Fecha de Inicio */}
                        <div>
                            <label htmlFor="fecha_inicio" className="block text-sm font-medium text-gray-700 mb-1">
                                Fecha de Inicio
                            </label>
                            <input
                                type="date"
                                id="fecha_inicio"
                                name="fecha_inicio"
                                value={formData.fecha_inicio}
                                onChange={handleChange}
                                aria-invalid={!!errors.fecha_inicio}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                            {errors.fecha_inicio && (
                                <p id="fecha_inicio-err" className="mt-2 text-sm text-red-600">
                                    {errors.fecha_inicio}
                                </p>
                            )}
                        </div>

                        {/* Campo Fecha de Fin (Opcional) */}
                        <div>
                            <label htmlFor="fecha_fin" className="block text-sm font-medium text-gray-700 mb-1">
                                Fecha de Fin (Opcional)
                            </label>
                            <input
                                type="date"
                                id="fecha_fin"
                                name="fecha_fin"
                                value={formData.fecha_fin}
                                onChange={handleChange}
                                aria-invalid={!!errors.fecha_fin}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                            {errors.fecha_fin && (
                                <p id="fecha_fin-err" className="mt-2 text-sm text-red-600">
                                    {errors.fecha_fin}
                                </p>
                            )}
                        </div>

                        {/* Campo Esta Activo */}
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="esta_activo"
                                name="esta_activo"
                                checked={formData.esta_activo}
                                onChange={handleChange}
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label htmlFor="esta_activo" className="ml-2 block text-sm font-medium text-gray-700">
                                Contrato Activo
                            </label>
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => navigate('/administrador/contratos-arrendamiento')}
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

export default ContratoArrendamientoForm;