// src/pages/Administrador/Casa/CasaForm.tsx
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CasaSchema, type CasaFormData } from '../../../schemas/schema-casa';
import { casaApi } from '../../../api/api-casa';
import { useNavigate, useParams } from 'react-router-dom';
import { toUiError } from '../../../api/error';

export default function CasaForm() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const isEditing = !!id && id !== 'new'; // Solo edición si es ID numérico
    const isCreating = id === 'new'; // Creación explícita

    const [error, setTopError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [formErrors, setFormErrors] = useState<Record<string, string[]>>({});


    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<CasaFormData>({
        resolver: zodResolver(CasaSchema),
        defaultValues: {
            numero_casa: '',
            tipo_de_unidad: '',
            numero: 0,
            area: 0,
            propietario_nombre: '',
        },
    });

    // Cargar datos si es edición
    useEffect(() => {
        if (isEditing) {
            const loadCasa = async () => {
                try {
                    const casas = await casaApi.getAll();
                    const casa = casas.find((c) => c.id === parseInt(id));
                    if (casa) {
                        setValue('numero_casa', casa.numero_casa);
                        setValue('tipo_de_unidad', casa.tipo_de_unidad);
                        setValue('numero', casa.numero);
                        setValue('area', casa.area);
                        if (casa.propietario) {
                            const fullName = `${casa.propietario.usuario.nombre} ${casa.propietario.usuario.apellido_paterno}`;
                            setValue('propietario_nombre', fullName);
                        }
                    }
                } catch (err) {
                    setTopError('No se pudo cargar la casa.');
                }
            };
            loadCasa();
        }
    }, [id, isEditing, setValue]);

    const onSubmit = async (data: CasaFormData) => {
        setLoading(true);
        setTopError(null);

        try {
            if (isEditing) {
                await casaApi.update(parseInt(id), data);
            } else {
                await casaApi.create(data);
            }
            navigate('/administrador/casas'); // ← Redirección programática (¡como en RolList!)
        } catch (err) {
            const { message, fields } = toUiError(err);
            setTopError(message);
            if (fields) setFormErrors(fields);
        } finally {
            setLoading(false);
        }
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
                            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.numero_casa ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                        {errors.numero_casa && (
                            <p className="mt-1 text-xs text-red-500">{errors.numero_casa.message}</p>
                        )}
                        {formErrors.numero_casa?.map((m, i) => (
                            <p key={i} className="mt-1 text-sm text-red-600">{m}</p>
                        ))}

                    </div>

                    {/* Tipo de Unidad */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Unidad *</label>
                        <select
                            {...register('tipo_de_unidad')}
                            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.tipo_de_unidad ? 'border-red-500' : 'border-gray-300'
                                }`}
                        >
                            <option value="">Seleccionar...</option>
                            <option value="apartamento">Apartamento</option>
                            <option value="casa">Casa</option>
                            <option value="villa">Villa</option>
                            <option value="duplex">Duplex</option>
                            <option value="otro">Otro</option>
                        </select>
                        {errors.tipo_de_unidad && (
                            <p className="mt-1 text-xs text-red-500">{errors.tipo_de_unidad.message}</p>
                        )}
                    </div>

                    {/* Número de Unidad */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Número de Unidad *</label>
                        <input
                            {...register('numero', { valueAsNumber: true })}
                            type="number"
                            placeholder="Ej: 101"
                            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.numero ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                        {errors.numero && (
                            <p className="mt-1 text-xs text-red-500">{errors.numero.message}</p>
                        )}
                    </div>

                    {/* Área (m²) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Área (m²) *</label>
                        <input
                            {...register('area', { valueAsNumber: true })}
                            type="number"
                            step="0.01"
                            placeholder="Ej: 85.5"
                            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.area ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                        {errors.area && (
                            <p className="mt-1 text-xs text-red-500">{errors.area.message}</p>
                        )}
                    </div>

                    {/* Asignar Propietario */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Asignar Propietario (nombre o email)
                        </label>
                        <input
                            {...register('propietario_nombre')}
                            type="text"
                            placeholder="Ej: Juan Pérez o juan@ejemplo.com"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            Ingresa el nombre completo o email de un usuario ya registrado.
                        </p>
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