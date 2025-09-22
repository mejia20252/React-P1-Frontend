// src/pages/Administrador/Residente/ResidenteForm.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../../app/axiosInstance'; // 👈 sigue siendo tu cliente
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import { residenteCreateSchema } from '../../../schemas/schema-residente';
import type { ResidenteFormData } from '../../../schemas/schema-residente';
import { toUiError } from '../../../api/error';
import type { ResidenteCreateRequest, Residente } from '../../../types/type-residente';

interface Usuario {
    id: number;
    nombre: string;
    apellido_paterno: string;
    apellido_materno: string;
    email: string | null;
}

interface Casa {
    id: number;
    area: string;
    numero_casa: string;
}

const ResidenteForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const isEdit = Boolean(id);
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [topError, setTopError] = useState('');
    const [formErrors, setFormErrors] = useState<Record<string, string[]>>({});
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [casas, setCasas] = useState<Casa[]>([]);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { isSubmitting },
    } = useForm<ResidenteFormData>({
        defaultValues: {
            usuario_id: 0,
            casa_id: 0,
            rol_residencia: 'familiar',
        },
    });

    // Cargar datos iniciales
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const [usuariosData, casasData] = await Promise.all([
                    axiosInstance.get<Usuario[]>('/usuarios/'), // 👈 SIN /api/
                    axiosInstance.get<Casa[]>('/casas/'), // 👈 SIN /api/
                ]);

                setUsuarios(usuariosData.data);
                setCasas(casasData.data);

                if (isEdit && id) {
                    const residenteResponse = await axiosInstance.get<Residente>(`/residentes/${id}/`); // 👈 SIN /api/
                    const res = residenteResponse.data;
                    setValue('usuario_id', res.usuario);
                    setValue('casa_id', res.casa);
                    setValue('rol_residencia', res.rol_residencia);
                }
            } catch (error) {
                console.error('Error al cargar datos:', error);
                setTopError('No se pudieron cargar los datos necesarios.');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [id, isEdit, setValue]);

    const onSubmit = async (data: ResidenteFormData) => {
        setTopError('');
        setFormErrors({});

        // Validación Zod frontend
        const result = residenteCreateSchema.safeParse(data);
        if (!result.success) {
            const fieldErrors = result.error.flatten().fieldErrors;
            setFormErrors(fieldErrors as Record<string, string[]>);
            return;
        }

        try {
            const payload: ResidenteCreateRequest = {
                usuario: data.usuario_id,
                casa: data.casa_id,
                rol_residencia: data.rol_residencia,
            };
            console.log('Payload que se enviará al backend:', payload);
            if (isEdit && id) {
                await axiosInstance.patch(`/residentes/${id}/`, payload); // 👈 SIN /api/
            } else {
                await axiosInstance.post(`/residentes/`, payload); // 👈 SIN /api/
            }

            navigate('/administrador/residentes');
        } catch (error) {
            const uiError = toUiError(error);

            if (uiError.fields) {
                setFormErrors(uiError.fields);
            } else if (uiError.message) {
                setTopError(uiError.message);
            } else {
                setTopError('Ocurrió un error inesperado al guardar el residente.');
            }
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
            <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl p-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">{isEdit ? 'Editar Residente' : 'Nuevo Residente'}</h2>
                    <button
                        onClick={() => navigate('/administrador/residentes')}
                        className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                        aria-label="Volver a la lista de residentes"
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
                        {/* Usuario */}
                        <div>
                            <label htmlFor="usuario_id" className="block text-sm font-medium text-gray-700 mb-1">
                                Usuario
                            </label>
                            <select
                                id="usuario_id"
                                {...register('usuario_id', { valueAsNumber: true })}
                                className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${formErrors.usuario_id ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            >
                                <option value="">Selecciona un usuario</option>
                                {usuarios.map((usuario) => (
                                    <option key={usuario.id} value={usuario.id}>
                                        {usuario.nombre} {usuario.apellido_paterno} {usuario.apellido_materno}
                                        {usuario.email && ` (${usuario.email})`}
                                    </option>
                                ))}
                            </select>
                            {formErrors.usuario_id?.map((m, i) => (
                                <p key={i} className="mt-1 text-sm text-red-600">{m}</p>
                            ))}
                        </div>

                        {/* Casa */}
                        <div>
                            <label htmlFor="casa_id" className="block text-sm font-medium text-gray-700 mb-1">
                                Casa
                            </label>
                            <select
                                id="casa_id"
                                {...register('casa_id', { valueAsNumber: true })}
                                className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${formErrors.casa_id ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            >
                                <option value="">Selecciona una casa</option>
                                {casas.map((casa) => (
                                    <option key={casa.id} value={casa.id}>
                                        {casa.numero_casa} - {casa.area}
                                    </option>
                                ))}
                            </select>
                            {formErrors.casa_id?.map((m, i) => (
                                <p key={i} className="mt-1 text-sm text-red-600">{m}</p>
                            ))}
                        </div>

                        {/* Rol de residencia */}
                        <div>
                            <label htmlFor="rol_residencia" className="block text-sm font-medium text-gray-700 mb-1">
                                Rol en la casa
                            </label>
                            <select
                                id="rol_residencia"
                                {...register('rol_residencia')}
                                className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${formErrors.rol_residencia ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            >
                                <option value="">Selecciona un rol</option>
                                <option value="propietario">Propietario</option>
                                <option value="familiar">Familiar</option>
                                <option value="inquilino">Inquilino</option>
                            </select>
                            {formErrors.rol_residencia?.map((m, i) => (
                                <p key={i} className="mt-1 text-sm text-red-600">{m}</p>
                            ))}
                        </div>

                        {/* Mensaje específico si ya existe este residente */}
                        {formErrors.non_field_errors && formErrors.non_field_errors.some(msg =>
                            msg.toLowerCase().includes('ya es residente')
                        ) && (
                                <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-800">
                                    ⚠️ Este usuario ya es residente de otra casa. Solo puede tener un registro activo.
                                </div>
                            )}

                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => navigate('/administrador/residentes')}
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
                )}
            </div>
        </div>
    );
};

export default ResidenteForm;