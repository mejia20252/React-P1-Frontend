// src/pages/Administrador/Casa/CasaFormV1.tsx

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { casaApiV1 } from '../../../api/api-casa-v1';
import type {  CasaFormData } from '../../../types/type-casa-v1';
import { useNavigate, useParams } from 'react-router-dom';
import { toUiError } from '../../../api/error';
import { validateCasaForm } from '../../../utils/validateCasaForm';

export default function CasaFormV1() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const isEditing = !!id && id !== 'new';
    const isCreating = id === 'new';

    const [error, setTopError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<keyof CasaFormData, string>>({} as any);
    const [loading, setLoading] = useState(false);

    // ✅ Define defaultValues con el tipo exacto CasaFormData
    const defaultValues: CasaFormData = {
        numero_casa: '',
        tipo_de_unidad: '',
        numero: 0,
        area: '',
        estado_ocupacion: 'desocupada',
        tiene_parqueo_asignado: false,
        piso: undefined,
        torre_o_bloque: undefined,
        numero_parqueo: undefined,
        observaciones: undefined,
    };

    const {
        register,
        handleSubmit,
        formState: { errors: rhfErrors }, // Solo para estilos, no validación
        setValue,
        watch,
        getValues,
    } = useForm<CasaFormData>({
        defaultValues,
    });

    // Cargar datos si es edición
    useEffect(() => {
        if (isEditing) {
            const loadCasa = async () => {
                try {
                    const casa = await casaApiV1.fetchCasa(parseInt(id!));
                    setValue('numero_casa', casa.numero_casa);
                    setValue('tipo_de_unidad', casa.tipo_de_unidad);
                    setValue('numero', casa.numero);
                    setValue('area', casa.area);
                    setValue('piso', casa.piso ?? undefined);
                    setValue('torre_o_bloque', casa.torre_o_bloque ?? undefined);
                    setValue('tiene_parqueo_asignado', casa.tiene_parqueo_asignado);
                    setValue('numero_parqueo', casa.numero_parqueo ?? undefined);
                    setValue('estado_ocupacion', casa.estado_ocupacion);
                    setValue('observaciones', casa.observaciones ?? undefined);
                } catch (err) {
                    setTopError('No se pudo cargar la casa.');
                }
            };
            loadCasa();
        }
    }, [id, isEditing, setValue]);

    const onSubmit = async () => {
        setLoading(true);
        setTopError(null);
        setFieldErrors({} as any);

        const data = getValues();

        // ✅ Validación manual
        const validationErrors = validateCasaForm(data);
        if (validationErrors.length > 0) {
            const fieldErrorsMap = {} as Record<keyof CasaFormData, string>;
            validationErrors.forEach(err => {
                fieldErrorsMap[err.field] = err.message;
            });
            setFieldErrors(fieldErrorsMap);
            setLoading(false);
            return;
        }

        try {
            // ✅ Convertir undefined → null para campos opcionales
            const payload = {
                ...data,
                piso: data.piso === undefined ? null : data.piso,
                torre_o_bloque: data.torre_o_bloque === undefined ? null : data.torre_o_bloque,
                numero_parqueo: data.numero_parqueo === undefined ? null : data.numero_parqueo,
                observaciones: data.observaciones === undefined ? null : data.observaciones,
            };

            if (isEditing) {
                await casaApiV1.update(parseInt(id!), payload);
            } else {
                await casaApiV1.create(payload);
            }

            navigate('/administrador/casas');
        } catch (err) {
            const { message } = toUiError(err);
            setTopError(message);
        } finally {
            setLoading(false);
        }
    };

    const tieneParqueoAsignado = watch('tiene_parqueo_asignado');

    // Helper para mostrar error de campo
    const getFieldError = (field: keyof CasaFormData) => {
        return fieldErrors[field] || (rhfErrors[field]?.message as string | undefined);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-lg">
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    {isCreating ? 'Nueva Casa' : isEditing ? 'Editar Casa' : 'Error'}
                </h1>

                {error && (
                    <div className="p-3 mb-4 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Número de Casa */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Número de Casa *</label>
                        <input
                            {...register('numero_casa')}
                            type="text"
                            placeholder="Ej: A-101"
                            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${getFieldError('numero_casa') ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                        {getFieldError('numero_casa') && (
                            <p className="mt-1 text-xs text-red-500">{getFieldError('numero_casa')}</p>
                        )}
                    </div>

                    {/* Tipo de Unidad */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Unidad *</label>
                        <select
                            {...register('tipo_de_unidad')}
                            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${getFieldError('tipo_de_unidad') ? 'border-red-500' : 'border-gray-300'
                                }`}
                        >
                            <option value="">Seleccionar...</option>
                            <option value="apartamento">Apartamento</option>
                            <option value="casa">Casa</option>
                            <option value="villa">Villa</option>
                            <option value="duplex">Duplex</option>
                            <option value="otro">Otro</option>
                        </select>
                        {getFieldError('tipo_de_unidad') && (
                            <p className="mt-1 text-xs text-red-500">{getFieldError('tipo_de_unidad')}</p>
                        )}
                    </div>

                    {/* Número de Unidad */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Número de Unidad *</label>
                        <input
                            {...register('numero', { valueAsNumber: true })}
                            type="number"
                            placeholder="Ej: 101"
                            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${getFieldError('numero') ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                        {getFieldError('numero') && (
                            <p className="mt-1 text-xs text-red-500">{getFieldError('numero')}</p>
                        )}
                    </div>

                    {/* Área (m²) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Área (m²) *</label>
                        <input
                            {...register('area')}
                            type="text"
                            placeholder="Ej: 85.50"
                            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${getFieldError('area') ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                        {getFieldError('area') && (
                            <p className="mt-1 text-xs text-red-500">{getFieldError('area')}</p>
                        )}
                    </div>

                    {/* Estado de Ocupación */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Estado de Ocupación *</label>
                        <select
                            {...register('estado_ocupacion')}
                            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${getFieldError('estado_ocupacion') ? 'border-red-500' : 'border-gray-300'
                                }`}
                        >
                            <option value="desocupada">Desocupada</option>
                            <option value="ocupada">Ocupada</option>
                            <option value="en_mantenimiento">En Mantenimiento</option>
                            <option value="suspendida">Suspendida</option>
                        </select>
                        {getFieldError('estado_ocupacion') && (
                            <p className="mt-1 text-xs text-red-500">{getFieldError('estado_ocupacion')}</p>
                        )}
                    </div>

                    {/* Tiene Parqueo Asignado */}
                    <div className="flex items-center">
                        <input
                            {...register('tiene_parqueo_asignado')}
                            type="checkbox"
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-700">
                            Tiene parqueo asignado
                        </label>
                    </div>

                    {/* Número de Parqueo (opcional) */}
                    {tieneParqueoAsignado && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Número de Parqueo</label>
                            <input
                                {...register('numero_parqueo')}
                                type="text"
                                placeholder="Ej: P-102"
                                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${getFieldError('numero_parqueo') ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            />
                            {getFieldError('numero_parqueo') && (
                                <p className="mt-1 text-xs text-red-500">{getFieldError('numero_parqueo')}</p>
                            )}
                        </div>
                    )}

                    {/* Torre o Bloque (opcional) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Torre o Bloque</label>
                        <input
                            {...register('torre_o_bloque')}
                            type="text"
                            placeholder="Ej: Torre A"
                            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${getFieldError('torre_o_bloque') ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                        {getFieldError('torre_o_bloque') && (
                            <p className="mt-1 text-xs text-red-500">{getFieldError('torre_o_bloque')}</p>
                        )}
                    </div>

                    {/* Piso (opcional) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Piso</label>
                        <input
                            {...register('piso', { valueAsNumber: true })}
                            type="number"
                            placeholder="Ej: 3"
                            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${getFieldError('piso') ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                        {getFieldError('piso') && (
                            <p className="mt-1 text-xs text-red-500">{getFieldError('piso')}</p>
                        )}
                    </div>

                    {/* Observaciones (opcional) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
                        <textarea
                            {...register('observaciones')}
                            rows={3}
                            placeholder="Notas adicionales sobre la unidad..."
                            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${getFieldError('observaciones') ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                        {getFieldError('observaciones') && (
                            <p className="mt-1 text-xs text-red-500">{getFieldError('observaciones')}</p>
                        )}
                    </div>

                    {/* Botones */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors text-sm font-medium"
                        >
                            {loading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}